import type { ConceptExplanation, ExplanationRequest, Settings } from '../types';
import { ExplanationError, type ExplanationProvider } from './provider';
import { matchConcept } from '../concepts/matcher';
import type { ConceptEntry } from '../concepts/entry';
import { sanitizeSelection, truncate } from '../utils/text';

const REQUEST_TIMEOUT_MS = 15_000;
const REST_SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const ACTION_API = 'https://en.wikipedia.org/w/api.php';

/** Shape of the fields we read from Wikipedia's REST summary endpoint. */
interface WikiSummary {
  type?: string;
  title?: string;
  extract?: string;
  description?: string;
  content_urls?: { desktop?: { page?: string } };
}

/** A lookup attempt: either a direct page title or a full-text search phrase. */
interface Candidate {
  kind: 'title' | 'search';
  value: string;
}

/**
 * Live provider backed by Wikipedia's free REST API. Needs no API key, covers
 * essentially every computer science topic, and works with arbitrary text.
 *
 * When the selection also matches a curated concept, we layer the hand-written
 * example, analogy, and "why it matters" on top of Wikipedia's live definition.
 */
export class WikipediaProvider implements ExplanationProvider {
  async explain(
    input: ExplanationRequest,
    _settings: Settings,
    signal?: AbortSignal,
  ): Promise<ConceptExplanation> {
    const context = [input.nearestHeading, input.surroundingText, input.pageTitle].join(' ');
    const local = matchConcept(input.selectedText, context);
    // The user's own selection drives the lookup — a dictionary alias must not
    // hijack it (e.g. "Deep Learning" is an alias of Machine Learning, but has
    // its own Wikipedia article). The curated name is only a fallback.
    const selected = this.conciseQuery(input.selectedText);
    const localName = local?.entry.name;
    if (!selected && !localName) {
      throw new ExplanationError('Highlight a term to look up.', false);
    }

    const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

    // Try the exact title first (fast; Wikipedia redirects casing), then search.
    const differsFromLocal = Boolean(localName && localName.toLowerCase() !== selected.toLowerCase());
    const candidates: Candidate[] = [{ kind: 'title', value: selected || localName! }];
    if (differsFromLocal) candidates.push({ kind: 'title', value: localName! });
    candidates.push({ kind: 'search', value: selected || localName! });
    if (differsFromLocal) candidates.push({ kind: 'search', value: localName! });

    try {
      const summary = await this.resolve(candidates, combined);

      if (!summary || !summary.extract) {
        throw new ExplanationError(
          `No Wikipedia article was found for “${truncate(selected || localName!, 50)}”. Try highlighting a more specific term.`,
          false,
        );
      }

      // Only layer curated example/analogy on top when the resolved article
      // actually matches the curated concept — never a loosely-related alias.
      const enrich =
        local && this.matchesLocalConcept(summary.title, local.entry) ? local.entry : undefined;
      return this.build(summary, enrich);
    } catch (error) {
      if (error instanceof ExplanationError) throw error;
      if (signal?.aborted) throw new ExplanationError('Request cancelled.', false);
      if (timeout.aborted)
        throw new ExplanationError('Wikipedia took too long to respond. Try again.');
      throw new ExplanationError('Could not reach Wikipedia. Check your connection and try again.');
    }
  }

  /** Try each candidate in order; return the first usable article summary. */
  private async resolve(candidates: Candidate[], signal: AbortSignal): Promise<WikiSummary | null> {
    for (const candidate of candidates) {
      const title =
        candidate.kind === 'title' ? candidate.value : await this.search(candidate.value, signal);
      if (!title) continue;
      const summary = await this.fetchSummary(title, signal);
      if (summary && summary.type !== 'disambiguation' && summary.extract) return summary;
    }
    return null;
  }

  private async fetchSummary(title: string, signal: AbortSignal): Promise<WikiSummary | null> {
    const url = `${REST_SUMMARY}${encodeURIComponent(title.replace(/ /g, '_'))}?redirect=true`;
    const response = await fetch(url, { headers: { Accept: 'application/json' }, signal });
    if (response.status === 404) return null;
    if (!response.ok) {
      throw new ExplanationError(
        `Wikipedia returned an error (HTTP ${response.status}). Try again.`,
      );
    }
    return (await response.json()) as WikiSummary;
  }

  private async search(query: string, signal: AbortSignal): Promise<string | null> {
    const params = new URLSearchParams({
      action: 'query',
      list: 'search',
      srsearch: query,
      srlimit: '6',
      srnamespace: '0',
      format: 'json',
      origin: '*',
    });
    const response = await fetch(`${ACTION_API}?${params.toString()}`, { signal });
    if (!response.ok) return null;
    const data = (await response.json()) as {
      query?: { search?: Array<{ title?: string }> };
    };
    const titles = (data.query?.search ?? [])
      .map((hit) => hit.title)
      .filter((title): title is string => Boolean(title));
    return this.chooseTitle(titles, query);
  }

  /**
   * Pick the best article from search hits: skip broad meta-pages (glossaries,
   * lists, outlines) and prefer the title that most closely matches the query.
   */
  private chooseTitle(titles: string[], query: string): string | null {
    if (titles.length === 0) return null;
    const wanted = query.trim().toLowerCase();
    const isMeta = (title: string): boolean =>
      /^(glossary|list|index|outline|comparison|timeline|history|portal)\b/i.test(title);

    const specific = titles.filter((title) => !isMeta(title));
    const pool = specific.length > 0 ? specific : titles;

    const exact = pool.find((title) => title.toLowerCase() === wanted);
    if (exact) return exact;

    // A title whose base (before any "(disambiguation-style)" qualifier) matches.
    const baseMatch = pool.find((title) => title.split(' (')[0]?.toLowerCase() === wanted);
    if (baseMatch) return baseMatch;

    const startsWith = pool.find((title) => title.toLowerCase().startsWith(wanted));
    return startsWith ?? pool[0] ?? null;
  }

  /**
   * True only when the resolved Wikipedia article is the same concept as the
   * curated entry (matched on the concept name, ignoring a trailing qualifier
   * like "(computer science)"), so we never attach a related concept's example.
   */
  private matchesLocalConcept(title: string | undefined, entry: ConceptEntry): boolean {
    const base = (title ?? '').split(' (')[0]?.trim().toLowerCase() ?? '';
    return base.length > 0 && base === entry.name.toLowerCase();
  }

  private build(summary: WikiSummary, local?: ConceptEntry): ConceptExplanation {
    const extract = (summary.extract ?? '').trim();
    const short = this.firstSentences(extract, 2, 320);

    return {
      concept: summary.title ?? 'Concept',
      shortExplanation: short,
      detailedExplanation: extract.length > short.length ? extract : '',
      example: local?.example ?? '',
      analogy: local?.analogy ?? '',
      whyItMatters: local?.whyItMatters ?? '',
      relatedConcepts: local?.relatedConcepts ?? [],
      difficulty: local?.difficulty ?? 'beginner',
      source: 'Wikipedia',
    };
  }

  /** Keep only the first couple of sentences for the concise view. */
  private firstSentences(text: string, count: number, max: number): string {
    const sentences = text.match(/[^.!?]+[.!?]+(?:\s|$)/g);
    if (!sentences) return truncate(text, max);
    let out = '';
    let used = 0;
    for (const sentence of sentences) {
      if (out && out.length + sentence.length > max) break;
      out += sentence;
      if (++used >= count) break;
    }
    return out.trim() || truncate(text, max);
  }

  /** Reduce a long or messy selection to a short lookup phrase. */
  private conciseQuery(raw: string): string {
    const cleaned = sanitizeSelection(raw);
    const words = cleaned.split(' ');
    return words.length <= 6 ? cleaned : words.slice(0, 6).join(' ');
  }
}

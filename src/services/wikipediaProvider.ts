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

    // Resolve the user's own selection first — exact title (fast; Wikipedia
    // redirects casing), then full-text search — and only then fall back to the
    // curated name. Otherwise an alias like "supervised learning" would send
    // "Self-Supervised Learning" to the Machine Learning article.
    const differsFromLocal = Boolean(
      localName && localName.toLowerCase() !== selected.toLowerCase(),
    );
    const primary = selected || localName!;
    const candidates: Candidate[] = [
      { kind: 'title', value: primary },
      { kind: 'search', value: primary },
    ];
    if (differsFromLocal) {
      candidates.push({ kind: 'title', value: localName! }, { kind: 'search', value: localName! });
    }

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
      throw new ExplanationError(`Wikipedia returned an error (HTTP ${response.status}). Try again.`);
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

    // A title whose base (before any "(qualifier)") matches the query.
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
    const sentences = this.splitSentences(extract);
    const short = this.take(sentences, 2, 320) || truncate(extract, 320);
    // The expanded view shows what the concise view left off, so nothing repeats.
    const remainder = extract.startsWith(short) ? extract.slice(short.length).trim() : extract;

    return {
      concept: summary.title ?? 'Concept',
      shortExplanation: short,
      detailedExplanation: remainder && remainder !== short ? remainder : '',
      example: local?.example ?? '',
      analogy: local?.analogy ?? '',
      whyItMatters: local?.whyItMatters ?? '',
      relatedConcepts: local?.relatedConcepts ?? [],
      difficulty: local?.difficulty ?? 'beginner',
      source: 'Wikipedia',
    };
  }

  /**
   * Split prose into sentences without breaking on common abbreviations
   * ("e.g.", "i.e.", "etc.") — the naive "split on every period" approach
   * produced fragments like "g. in the form of decisions."
   */
  private splitSentences(text: string): string[] {
    const dot = String.fromCharCode(0); // sentinel standing in for an abbreviation's period
    const abbreviations = /\b(e\.g|i\.e|etc|vs|cf|al|Inc|Ltd|Dr|Mr|Mrs|Ms|St|approx|Fig|No)\./gi;
    const guarded = text.replace(abbreviations, (match) => match.split('.').join(dot));
    return guarded
      .split(/(?<=[.!?])\s+(?=[A-Z"“'(])/)
      .map((sentence) => sentence.split(dot).join('.').trim())
      .filter(Boolean);
  }

  /** Join sentences up to a count and character budget. */
  private take(sentences: string[], count: number, max: number): string {
    let out = '';
    let used = 0;
    for (const sentence of sentences) {
      if (out && out.length + sentence.length + 1 > max) break;
      out += (out ? ' ' : '') + sentence;
      if (++used >= count) break;
    }
    return out.trim();
  }

  /** Reduce a selection to a clean lookup phrase, stripping stray punctuation. */
  private conciseQuery(raw: string): string {
    const cleaned = sanitizeSelection(raw)
      // Drop leading/trailing punctuation an accidental highlight may include,
      // but keep trailing "+"/"#" so "C++" and "C#" survive.
      .replace(/^[^\p{L}\p{N}]+/u, '')
      .replace(/[^\p{L}\p{N}+#]+$/u, '')
      .trim();
    if (!cleaned) return '';
    const words = cleaned.split(' ');
    return words.length <= 6 ? cleaned : words.slice(0, 6).join(' ');
  }
}

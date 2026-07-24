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
    const query = local?.entry.name ?? this.conciseQuery(input.selectedText);
    if (!query) {
      throw new ExplanationError('Highlight a term to look up.', false);
    }

    const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

    // A curated match gives us the canonical CS title directly. Otherwise bias
    // the lookup toward computer science so ambiguous terms (e.g. "semaphore")
    // resolve to their CS sense rather than the everyday one.
    const candidates: Candidate[] = local
      ? [
          { kind: 'title', value: local.entry.name },
          { kind: 'search', value: local.entry.name },
        ]
      : [
          { kind: 'search', value: `${query} computer science` },
          { kind: 'title', value: query },
          { kind: 'search', value: query },
        ];

    try {
      const summary = await this.resolve(candidates, combined);

      if (!summary || !summary.extract) {
        throw new ExplanationError(
          `No Wikipedia article was found for “${truncate(query, 50)}”. Try highlighting a more specific term.`,
          false,
        );
      }

      return this.build(summary, local?.entry);
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
      srlimit: '1',
      srnamespace: '0',
      format: 'json',
      origin: '*',
    });
    const response = await fetch(`${ACTION_API}?${params.toString()}`, { signal });
    if (!response.ok) return null;
    const data = (await response.json()) as {
      query?: { search?: Array<{ title?: string }> };
    };
    return data.query?.search?.[0]?.title ?? null;
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

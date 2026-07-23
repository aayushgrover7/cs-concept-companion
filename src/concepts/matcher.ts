import { allConcepts, type ConceptEntry } from './index';

export interface MatchResult {
  entry: ConceptEntry;
  /** Higher is more confident. Direct selection matches beat context matches. */
  score: number;
  matchedVia: 'exact' | 'contains' | 'context';
}

/** Lowercase, collapse whitespace, strip punctuation that hurts matching. */
export function normalizeTerm(text: string): string {
  return text
    .toLowerCase()
    .replace(/["'`().,;:!?[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Naive singularization so "arrays" matches "array". */
function singularize(word: string): string {
  if (word.length > 3 && word.endsWith('es')) return word.slice(0, -2);
  if (word.length > 2 && word.endsWith('s')) return word.slice(0, -1);
  return word;
}

function termsFor(entry: ConceptEntry): string[] {
  return [entry.name.toLowerCase(), ...entry.aliases.map((a) => a.toLowerCase())];
}

/** Whole-word (not substring) containment: "api" should not match "rapid". */
function containsTerm(haystack: string, term: string): boolean {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${escaped}($|[^a-z0-9])`, 'i').test(haystack);
}

/**
 * Find the best concept for a selection, optionally using surrounding page
 * context to break ties or rescue selections with no direct match.
 */
export function matchConcept(selectedText: string, context = ''): MatchResult | null {
  const selection = normalizeTerm(selectedText);
  if (!selection) return null;

  const selectionSingular = normalizeTerm(selection.split(' ').map(singularize).join(' '));
  const normalizedContext = normalizeTerm(context);

  let best: MatchResult | null = null;

  for (const entry of allConcepts) {
    let score = 0;
    let matchedVia: MatchResult['matchedVia'] = 'context';

    for (const term of termsFor(entry)) {
      const termSingular = term.split(' ').map(singularize).join(' ');
      if (selection === term || selectionSingular === termSingular) {
        score = Math.max(score, 100);
        matchedVia = 'exact';
      } else if (containsTerm(selection, term)) {
        // Longer matched terms are more specific ("binary tree" > "tree").
        score = Math.max(score, 50 + Math.min(term.length, 30));
        if (matchedVia !== 'exact') matchedVia = 'contains';
      } else if (score === 0 && normalizedContext && containsTerm(normalizedContext, term)) {
        score = Math.max(score, 10 + Math.min(term.length, 10));
      }
    }

    // Context agreement breaks ties between direct matches.
    if (score >= 50 && normalizedContext) {
      for (const term of termsFor(entry)) {
        if (containsTerm(normalizedContext, term)) {
          score += 5;
          break;
        }
      }
    }

    if (score > 0 && (!best || score > best.score)) {
      best = { entry, score, matchedVia };
    }
  }

  // A pure context match is only trustworthy for short selections that look
  // like a term, not for whole highlighted sentences.
  if (best && best.matchedVia === 'context' && selection.split(' ').length > 4) {
    return null;
  }

  return best;
}

/** Suggest concepts related to page context, used for "not CS" fallbacks. */
export function conceptsInText(text: string, limit = 3): ConceptEntry[] {
  const normalized = normalizeTerm(text);
  const found: ConceptEntry[] = [];
  for (const entry of allConcepts) {
    if (termsFor(entry).some((t) => containsTerm(normalized, t))) {
      found.push(entry);
      if (found.length >= limit) break;
    }
  }
  return found;
}

export function findConceptByName(name: string): ConceptEntry | undefined {
  const normalized = normalizeTerm(name);
  return allConcepts.find((entry) => termsFor(entry).some((t) => normalizeTerm(t) === normalized));
}

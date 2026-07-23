import type { ConceptExplanation, Difficulty } from '../types';

const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string').slice(0, 6);
}

/** Pull a JSON object out of a model reply that may include code fences. */
export function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  const fenced = /```(?:json)?\s*([\s\S]*?)```/.exec(trimmed);
  const candidate = fenced?.[1] ?? trimmed;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
}

/**
 * Validate and normalize a parsed AI response into a ConceptExplanation.
 * Returns null when required fields are missing or the shape is wrong.
 */
export function validateExplanation(data: unknown, source: string): ConceptExplanation | null {
  if (typeof data !== 'object' || data === null) return null;
  const record = data as Record<string, unknown>;

  const concept = asString(record.concept);
  const shortExplanation = asString(record.shortExplanation);
  if (!concept || !shortExplanation) return null;

  const rawDifficulty = asString(record.difficulty).toLowerCase();
  const difficulty = DIFFICULTIES.includes(rawDifficulty as Difficulty)
    ? (rawDifficulty as Difficulty)
    : 'beginner';

  return {
    concept,
    shortExplanation,
    detailedExplanation: asString(record.detailedExplanation),
    example: asString(record.example),
    analogy: asString(record.analogy),
    whyItMatters: asString(record.whyItMatters),
    relatedConcepts: asStringArray(record.relatedConcepts),
    difficulty,
    notCsConcept: record.isCsConcept === false,
    source,
  };
}

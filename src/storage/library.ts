import type { ConceptExplanation, SavedConcept } from '../types';
import { STORAGE_KEYS, storageGet, storageSet } from './chromeStorage';
import { makeId, truncate } from '../utils/text';

const MAX_SAVED = 200;

export async function getSavedConcepts(): Promise<SavedConcept[]> {
  return storageGet<SavedConcept[]>(STORAGE_KEYS.saved, []);
}

function isDuplicate(existing: SavedConcept[], concept: string): boolean {
  const normalized = concept.trim().toLowerCase();
  return existing.some((item) => item.concept.trim().toLowerCase() === normalized);
}

/**
 * Save an explanation to the library. Returns the saved item, or null when an
 * item for the same concept already exists (duplicate prevention).
 */
export async function saveConcept(
  explanation: ConceptExplanation,
  sourceTitle: string,
  sourceUrl: string,
): Promise<SavedConcept | null> {
  const existing = await getSavedConcepts();
  if (isDuplicate(existing, explanation.concept)) return null;

  const item: SavedConcept = {
    id: makeId(),
    concept: explanation.concept,
    shortExplanation: explanation.shortExplanation,
    example: explanation.example,
    sourceTitle: truncate(sourceTitle, 120),
    sourceUrl,
    savedAt: Date.now(),
    tags: explanation.relatedConcepts,
    difficulty: explanation.difficulty,
  };

  await storageSet(STORAGE_KEYS.saved, [item, ...existing].slice(0, MAX_SAVED));
  return item;
}

export async function isConceptSaved(concept: string): Promise<boolean> {
  return isDuplicate(await getSavedConcepts(), concept);
}

export async function deleteConcept(id: string): Promise<SavedConcept[]> {
  const remaining = (await getSavedConcepts()).filter((item) => item.id !== id);
  await storageSet(STORAGE_KEYS.saved, remaining);
  return remaining;
}

export async function clearSavedConcepts(): Promise<void> {
  await storageSet(STORAGE_KEYS.saved, []);
}

export function searchSaved(items: SavedConcept[], query: string): SavedConcept[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.concept.toLowerCase().includes(q) ||
      item.shortExplanation.toLowerCase().includes(q) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q)),
  );
}

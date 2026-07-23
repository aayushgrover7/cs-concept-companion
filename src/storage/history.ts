import type { ConceptExplanation, HistoryEntry, UsageStats } from '../types';
import { STORAGE_KEYS, storageGet, storageSet } from './chromeStorage';
import { makeId, truncate } from '../utils/text';

const MAX_HISTORY = 50;

export async function getHistory(): Promise<HistoryEntry[]> {
  return storageGet<HistoryEntry[]>(STORAGE_KEYS.history, []);
}

export async function addToHistory(
  explanation: ConceptExplanation,
  sourceTitle: string,
  sourceUrl: string,
): Promise<void> {
  const history = await getHistory();
  const entry: HistoryEntry = {
    id: makeId(),
    concept: explanation.concept,
    shortExplanation: explanation.shortExplanation,
    sourceTitle: truncate(sourceTitle, 120),
    sourceUrl,
    explainedAt: Date.now(),
  };
  // Keep one entry per concept, most recent first.
  const deduped = history.filter(
    (item) => item.concept.toLowerCase() !== entry.concept.toLowerCase(),
  );
  await storageSet(STORAGE_KEYS.history, [entry, ...deduped].slice(0, MAX_HISTORY));
}

export async function clearHistory(): Promise<void> {
  await storageSet(STORAGE_KEYS.history, []);
}

export async function getStats(): Promise<UsageStats> {
  return storageGet<UsageStats>(STORAGE_KEYS.stats, { conceptsExplained: 0, conceptsSaved: 0 });
}

export async function bumpStat(key: keyof UsageStats, delta = 1): Promise<void> {
  const stats = await getStats();
  stats[key] = Math.max(0, stats[key] + delta);
  await storageSet(STORAGE_KEYS.stats, stats);
}

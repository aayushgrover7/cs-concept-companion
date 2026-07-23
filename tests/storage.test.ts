import { describe, expect, it } from 'vitest';
import type { ConceptExplanation } from '../src/types';
import {
  clearSavedConcepts,
  deleteConcept,
  getSavedConcepts,
  isConceptSaved,
  saveConcept,
  searchSaved,
} from '../src/storage/library';
import { getSettings, resetSettings, saveSettings } from '../src/storage/settings';
import { addToHistory, bumpStat, getHistory, getStats } from '../src/storage/history';
import { DEFAULT_SETTINGS } from '../src/types';

const explanation: ConceptExplanation = {
  concept: 'Recursion',
  shortExplanation: 'A function calling itself.',
  detailedExplanation: 'More detail.',
  example: 'factorial(n)',
  analogy: 'Mirrors.',
  whyItMatters: 'Everywhere.',
  relatedConcepts: ['Function'],
  difficulty: 'intermediate',
  source: 'Demo Mode',
};

describe('settings storage', () => {
  it('returns defaults when nothing is stored', async () => {
    expect(await getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('merges partial updates over defaults', async () => {
    await saveSettings({ theme: 'dark' });
    const settings = await getSettings();
    expect(settings.theme).toBe('dark');
    expect(settings.mode).toBe('demo');
  });

  it('resets to defaults', async () => {
    await saveSettings({ enabled: false, apiKey: 'secret' });
    await resetSettings();
    expect(await getSettings()).toEqual(DEFAULT_SETTINGS);
  });
});

describe('saved concept library', () => {
  it('saves and retrieves a concept', async () => {
    const item = await saveConcept(explanation, 'Wikipedia', 'https://en.wikipedia.org/x');
    expect(item).not.toBeNull();
    const all = await getSavedConcepts();
    expect(all).toHaveLength(1);
    expect(all[0]?.concept).toBe('Recursion');
    expect(all[0]?.sourceTitle).toBe('Wikipedia');
  });

  it('prevents duplicate saves of the same concept', async () => {
    await saveConcept(explanation, 'A', 'https://a.example');
    const second = await saveConcept(explanation, 'B', 'https://b.example');
    expect(second).toBeNull();
    expect(await getSavedConcepts()).toHaveLength(1);
  });

  it('treats duplicates case-insensitively', async () => {
    await saveConcept(explanation, 'A', 'https://a.example');
    const second = await saveConcept(
      { ...explanation, concept: 'RECURSION ' },
      'B',
      'https://b.example',
    );
    expect(second).toBeNull();
  });

  it('reports saved status', async () => {
    expect(await isConceptSaved('Recursion')).toBe(false);
    await saveConcept(explanation, 'A', 'https://a.example');
    expect(await isConceptSaved('recursion')).toBe(true);
  });

  it('deletes individual concepts', async () => {
    const item = await saveConcept(explanation, 'A', 'https://a.example');
    const remaining = await deleteConcept(item?.id ?? '');
    expect(remaining).toHaveLength(0);
  });

  it('clears all saved concepts', async () => {
    await saveConcept(explanation, 'A', 'https://a.example');
    await clearSavedConcepts();
    expect(await getSavedConcepts()).toHaveLength(0);
  });

  it('searches by concept, explanation, and tags', () => {
    const items = [
      { ...baseSaved('Recursion'), tags: ['Function'] },
      { ...baseSaved('Hash Table'), shortExplanation: 'Instant lookups.' },
    ];
    expect(searchSaved(items, 'recur')).toHaveLength(1);
    expect(searchSaved(items, 'instant')).toHaveLength(1);
    expect(searchSaved(items, 'function')).toHaveLength(1);
    expect(searchSaved(items, '')).toHaveLength(2);
    expect(searchSaved(items, 'zebra')).toHaveLength(0);
  });
});

describe('history and stats', () => {
  it('records history newest first and dedupes by concept', async () => {
    await addToHistory(explanation, 'Page A', 'https://a.example');
    await addToHistory(
      { ...explanation, concept: 'Big O Notation' },
      'Page B',
      'https://b.example',
    );
    await addToHistory(explanation, 'Page C', 'https://c.example');
    const history = await getHistory();
    expect(history).toHaveLength(2);
    expect(history[0]?.concept).toBe('Recursion');
    expect(history[0]?.sourceTitle).toBe('Page C');
  });

  it('increments stats', async () => {
    await bumpStat('conceptsExplained');
    await bumpStat('conceptsExplained');
    await bumpStat('conceptsSaved');
    expect(await getStats()).toEqual({ conceptsExplained: 2, conceptsSaved: 1 });
  });
});

function baseSaved(concept: string) {
  return {
    id: concept,
    concept,
    shortExplanation: 'x',
    example: '',
    sourceTitle: '',
    sourceUrl: '',
    savedAt: 0,
    tags: [] as string[],
    difficulty: 'beginner' as const,
  };
}

/**
 * Thin promise wrapper around chrome.storage.local. Keeping every read/write
 * behind this module makes the rest of the code testable with a mock.
 */
export async function storageGet<T>(key: string, fallback: T): Promise<T> {
  try {
    const result = await chrome.storage.local.get(key);
    const value = result[key] as T | undefined;
    return value === undefined || value === null ? fallback : value;
  } catch {
    return fallback;
  }
}

export async function storageSet(key: string, value: unknown): Promise<void> {
  await chrome.storage.local.set({ [key]: value });
}

export async function storageRemove(keys: string | string[]): Promise<void> {
  await chrome.storage.local.remove(keys);
}

export const STORAGE_KEYS = {
  settings: 'settings',
  saved: 'savedConcepts',
  history: 'history',
  stats: 'stats',
  onboarded: 'onboarded',
} as const;

import { DEFAULT_SETTINGS, type Settings } from '../types';
import { STORAGE_KEYS, storageGet, storageSet } from './chromeStorage';

/** Merge stored settings over defaults so missing/new keys never break. */
export async function getSettings(): Promise<Settings> {
  const stored = await storageGet<Partial<Settings>>(STORAGE_KEYS.settings, {});
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettings(update: Partial<Settings>): Promise<Settings> {
  const merged = { ...(await getSettings()), ...update };
  await storageSet(STORAGE_KEYS.settings, merged);
  return merged;
}

export async function resetSettings(): Promise<Settings> {
  await storageSet(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  return DEFAULT_SETTINGS;
}

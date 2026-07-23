import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_SETTINGS, type Settings } from '../types';
import { getSettings, saveSettings } from '../storage/settings';

/** Load settings, keep them in sync across pages, and apply the theme. */
export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void getSettings().then((loadedSettings) => {
      setSettings(loadedSettings);
      setLoaded(true);
    });

    const onChange = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ): void => {
      if (area === 'local' && changes.settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...(changes.settings.newValue as Partial<Settings>) });
      }
    };
    chrome.storage.onChanged.addListener(onChange);
    return () => chrome.storage.onChanged.removeListener(onChange);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (): void => {
      const resolved =
        settings.theme === 'system' ? (media.matches ? 'dark' : 'light') : settings.theme;
      document.documentElement.dataset.theme = resolved;
    };
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, [settings.theme]);

  const update = useCallback(async (partial: Partial<Settings>) => {
    setSettings((previous) => ({ ...previous, ...partial }));
    await saveSettings(partial);
  }, []);

  return { settings, update, loaded };
}

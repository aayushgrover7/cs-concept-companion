import { useEffect, useState } from 'react';
import type { DetailLevel, Difficulty, Theme } from '../types';
import { Logo } from '../components/Logo';
import { Toggle } from '../components/Toggle';
import { useSettings } from '../components/useSettings';
import { resetSettings } from '../storage/settings';
import { clearSavedConcepts } from '../storage/library';
import { clearHistory } from '../storage/history';

type AiStatus = { kind: 'ok' | 'err'; text: string } | null;

/** Ask for host permission on the API origin so the worker can call it. */
async function requestApiPermission(baseUrl: string): Promise<boolean> {
  try {
    const origin = `${new URL(baseUrl).origin}/*`;
    return await chrome.permissions.request({ origins: [origin] });
  } catch {
    return false;
  }
}

export function App() {
  const { settings, update, loaded } = useSettings();
  const [apiKey, setApiKey] = useState('');
  const [apiBaseUrl, setApiBaseUrl] = useState('');
  const [model, setModel] = useState('');
  const [aiStatus, setAiStatus] = useState<AiStatus>(null);

  useEffect(() => {
    if (loaded) {
      setApiKey(settings.apiKey);
      setApiBaseUrl(settings.apiBaseUrl);
      setModel(settings.model);
    }
    // Only seed the form once settings arrive; edits stay local until saved.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  if (!loaded) return null;

  const saveAiSettings = async (): Promise<void> => {
    setAiStatus(null);
    let normalizedUrl: string;
    try {
      normalizedUrl = new URL(apiBaseUrl).toString().replace(/\/+$/, '');
    } catch {
      setAiStatus({ kind: 'err', text: 'The API base URL is not a valid URL.' });
      return;
    }
    const granted = await requestApiPermission(normalizedUrl);
    if (!granted) {
      setAiStatus({
        kind: 'err',
        text: 'Chrome needs permission to reach that API host. Please allow it and save again.',
      });
      return;
    }
    await update({ apiKey: apiKey.trim(), apiBaseUrl: normalizedUrl, model: model.trim() });
    setAiStatus({ kind: 'ok', text: 'AI settings saved.' });
  };

  return (
    <main className="options">
      <header className="options-header">
        <Logo size={34} />
        <div>
          <h1>CS Concept Companion</h1>
          <p>Settings</p>
        </div>
      </header>

      <section className="section card-panel" aria-labelledby="general-heading">
        <h2 id="general-heading">General</h2>

        <div className="field">
          <div className="field-text">
            <span className="field-label">Enable extension</span>
            <span className="field-desc">
              When off, no floating button appears and nothing runs on webpages.
            </span>
          </div>
          <div className="field-control">
            <Toggle
              checked={settings.enabled}
              onChange={(enabled) => void update({ enabled })}
              label="Enable extension"
            />
          </div>
        </div>

        <div className="field">
          <div className="field-text">
            <span className="field-label">Theme</span>
            <span className="field-desc">Applies to the popup, this page, and inline cards.</span>
          </div>
          <div className="field-control">
            <select
              className="input"
              value={settings.theme}
              onChange={(event) => void update({ theme: event.target.value as Theme })}
              aria-label="Theme"
            >
              <option value="system">Match system</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </section>

      <section className="section card-panel" aria-labelledby="explanations-heading">
        <h2 id="explanations-heading">Explanations</h2>

        <div className="field stacked">
          <div className="field-text">
            <span className="field-label">Explanation source</span>
            <span className="field-desc">
              Live Mode looks concepts up on Wikipedia — no key needed, covers almost any term. Demo
              Mode works fully offline from a curated dictionary. AI Mode uses your own API.
            </span>
          </div>
          <div className="mode-picker">
            <button
              className="mode-option"
              aria-pressed={settings.mode === 'live'}
              onClick={() => void update({ mode: 'live' })}
            >
              <strong>Live Mode</strong>
              <span>Free Wikipedia lookups. No key. Works with almost any term.</span>
            </button>
            <button
              className="mode-option"
              aria-pressed={settings.mode === 'demo'}
              onClick={() => void update({ mode: 'demo' })}
            >
              <strong>Demo Mode</strong>
              <span>Curated offline dictionary. Nothing ever leaves your device.</span>
            </button>
            <button
              className="mode-option"
              aria-pressed={settings.mode === 'ai'}
              onClick={() => void update({ mode: 'ai' })}
            >
              <strong>AI Mode</strong>
              <span>Open-ended explanations via your own OpenAI-compatible API key.</span>
            </button>
          </div>
        </div>

        <div className="field">
          <div className="field-text">
            <span className="field-label">Detail level</span>
            <span className="field-desc">How much the card shows before you expand it.</span>
          </div>
          <div className="field-control">
            <select
              className="input"
              value={settings.detailLevel}
              onChange={(event) => void update({ detailLevel: event.target.value as DetailLevel })}
              aria-label="Detail level"
            >
              <option value="concise">Concise</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>
        </div>

        <div className="field">
          <div className="field-text">
            <span className="field-label">Reading level</span>
            <span className="field-desc">
              In AI Mode, explanations are written for this level of experience.
            </span>
          </div>
          <div className="field-control">
            <select
              className="input"
              value={settings.readingLevel}
              onChange={(event) => void update({ readingLevel: event.target.value as Difficulty })}
              aria-label="Reading level"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="field">
          <div className="field-text">
            <span className="field-label">Show analogies</span>
            <span className="field-desc">Everyday comparisons that make concepts click.</span>
          </div>
          <div className="field-control">
            <Toggle
              checked={settings.showAnalogies}
              onChange={(showAnalogies) => void update({ showAnalogies })}
              label="Show analogies"
            />
          </div>
        </div>

        <div className="field">
          <div className="field-text">
            <span className="field-label">Show examples</span>
            <span className="field-desc">Short code snippets or scenarios in each card.</span>
          </div>
          <div className="field-control">
            <Toggle
              checked={settings.showExamples}
              onChange={(showExamples) => void update({ showExamples })}
              label="Show examples"
            />
          </div>
        </div>
      </section>

      <section className="section card-panel" aria-labelledby="ai-heading">
        <h2 id="ai-heading">AI Mode</h2>

        <div className="field stacked">
          <div className="field-text">
            <span className="field-label">API key</span>
            <span className="field-desc">
              Stored only in Chrome’s local extension storage on this device. Never committed to
              code or sent anywhere except the API host below.
            </span>
          </div>
          <div className="field-control">
            <input
              className="input"
              type="password"
              autoComplete="off"
              placeholder="sk-…"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              aria-label="API key"
            />
          </div>
        </div>

        <div className="field stacked">
          <div className="field-text">
            <span className="field-label">API base URL</span>
            <span className="field-desc">
              Any OpenAI-compatible endpoint, e.g. https://api.openai.com/v1
            </span>
          </div>
          <div className="field-control">
            <input
              className="input"
              type="url"
              placeholder="https://api.openai.com/v1"
              value={apiBaseUrl}
              onChange={(event) => setApiBaseUrl(event.target.value)}
              aria-label="API base URL"
            />
          </div>
        </div>

        <div className="field stacked">
          <div className="field-text">
            <span className="field-label">Model</span>
            <span className="field-desc">The model name the API expects, e.g. gpt-4o-mini</span>
          </div>
          <div className="field-control">
            <input
              className="input"
              type="text"
              placeholder="gpt-4o-mini"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              aria-label="Model name"
            />
          </div>
        </div>

        <div className="field">
          <button className="btn primary" onClick={() => void saveAiSettings()}>
            Save AI settings
          </button>
          {aiStatus && <span className={`status ${aiStatus.kind}`}>{aiStatus.text}</span>}
        </div>

        <p className="notice">
          <strong>A note on key safety:</strong> AI Mode calls the API directly from this extension,
          so your key lives in the extension’s local storage. That is reasonable for a personal key
          you control, but a shipped product should keep keys on a backend proxy server instead.
          Details are in the project README.
        </p>
      </section>

      <section className="section card-panel" aria-labelledby="privacy-heading">
        <h2 id="privacy-heading">Privacy</h2>
        <p className="notice">
          This extension collects <strong>no analytics</strong> and sends{' '}
          <strong>no browsing data</strong> anywhere on its own. In Demo Mode, everything happens on
          your device. In AI Mode, only the text you explicitly select — plus its surrounding
          sentence and the page title — is sent to the API host you configured, and only when you
          click Explain.
        </p>
      </section>

      <section className="section card-panel" aria-labelledby="reset-heading">
        <h2 id="reset-heading">Reset</h2>
        <div className="danger-zone">
          <button
            className="btn"
            onClick={() => {
              if (window.confirm('Reset all settings to their defaults?')) {
                void resetSettings();
              }
            }}
          >
            Reset settings
          </button>
          <button
            className="btn danger"
            onClick={() => {
              if (window.confirm('Delete all saved concepts and history? This cannot be undone.')) {
                void Promise.all([clearSavedConcepts(), clearHistory()]);
              }
            }}
          >
            Clear saved data
          </button>
        </div>
      </section>
    </main>
  );
}

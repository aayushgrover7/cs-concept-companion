import { useEffect, useMemo, useState } from 'react';
import type { HistoryEntry, SavedConcept, UsageStats } from '../types';
import { Logo } from '../components/Logo';
import { Toggle } from '../components/Toggle';
import { useSettings } from '../components/useSettings';
import {
  clearSavedConcepts,
  deleteConcept,
  getSavedConcepts,
  searchSaved,
} from '../storage/library';
import { clearHistory, getHistory, getStats } from '../storage/history';
import { SavedList } from './SavedList';
import { HistoryList } from './HistoryList';

type Tab = 'library' | 'history';

const LEARNING_GOAL = 25;

export function App() {
  const { settings, update, loaded } = useSettings();
  const [tab, setTab] = useState<Tab>('library');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<SavedConcept[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState<UsageStats>({ conceptsExplained: 0, conceptsSaved: 0 });

  useEffect(() => {
    void getSavedConcepts().then(setSaved);
    void getHistory().then(setHistory);
    void getStats().then(setStats);
  }, []);

  const filteredSaved = useMemo(() => searchSaved(saved, query), [saved, query]);
  const filteredHistory = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return history;
    return history.filter((entry) => entry.concept.toLowerCase().includes(q));
  }, [history, query]);

  const progress = Math.min(1, stats.conceptsExplained / LEARNING_GOAL);

  if (!loaded) return null;

  return (
    <div className="popup">
      <header className="popup-header">
        <Logo size={26} />
        <div className="popup-title">
          <h1>CS Concept Companion</h1>
          <p>Your inline computer science tutor</p>
        </div>
        <Toggle
          checked={settings.enabled}
          onChange={(enabled) => void update({ enabled })}
          label="Enable or disable the extension"
        />
      </header>

      <div className="stats-row">
        <div className="stat card-panel">
          <div className="stat-value">{stats.conceptsExplained}</div>
          <div className="stat-label">concepts explained</div>
        </div>
        <div className="stat card-panel">
          <div className="stat-value">{stats.conceptsSaved}</div>
          <div className="stat-label">saved to library</div>
        </div>
      </div>

      {stats.conceptsExplained > 0 && stats.conceptsExplained < LEARNING_GOAL && (
        <>
          <div className="progress-note">
            {LEARNING_GOAL - stats.conceptsExplained} more to your first {LEARNING_GOAL}-concept
            milestone
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={stats.conceptsExplained}
            aria-valuemin={0}
            aria-valuemax={LEARNING_GOAL}
            aria-label="Progress toward learning milestone"
          >
            <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
        </>
      )}

      <p className="hint">
        Highlight any CS term on a webpage, then click <strong>Explain</strong> — or press{' '}
        <kbd>{navigator.platform.includes('Mac') ? '⌘⇧E' : 'Ctrl+Shift+E'}</kbd>.
      </p>

      <div className="tabs" role="tablist" aria-label="Popup sections">
        <button
          className="tab"
          role="tab"
          aria-selected={tab === 'library'}
          onClick={() => setTab('library')}
        >
          Library ({saved.length})
        </button>
        <button
          className="tab"
          role="tab"
          aria-selected={tab === 'history'}
          onClick={() => setTab('history')}
        >
          Recent ({history.length})
        </button>
      </div>

      <div className="search-wrap">
        <input
          className="input"
          type="search"
          placeholder={tab === 'library' ? 'Search saved concepts…' : 'Search recent concepts…'}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search concepts"
        />
      </div>

      {tab === 'library' ? (
        <SavedList
          items={filteredSaved}
          searching={query.trim().length > 0}
          onDelete={(id) => void deleteConcept(id).then(setSaved)}
        />
      ) : (
        <HistoryList items={filteredHistory} searching={query.trim().length > 0} />
      )}

      <footer className="popup-footer">
        <button className="btn ghost" onClick={() => chrome.runtime.openOptionsPage()}>
          Settings
        </button>
        {tab === 'library' && saved.length > 0 && (
          <button
            className="btn ghost danger"
            onClick={() => {
              if (window.confirm('Delete all saved concepts? This cannot be undone.')) {
                void clearSavedConcepts().then(() => setSaved([]));
              }
            }}
          >
            Clear library
          </button>
        )}
        {tab === 'history' && history.length > 0 && (
          <button
            className="btn ghost danger"
            onClick={() => void clearHistory().then(() => setHistory([]))}
          >
            Clear history
          </button>
        )}
        <div className="footer-spacer" />
        <button
          className="btn ghost"
          onClick={() => void chrome.tabs.create({ url: chrome.runtime.getURL('onboarding.html') })}
        >
          Guide
        </button>
      </footer>
    </div>
  );
}

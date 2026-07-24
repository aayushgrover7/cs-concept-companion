import { Logo } from '../components/Logo';
import { useSettings } from '../components/useSettings';

export function App() {
  // Loads settings so the page follows the user's theme.
  useSettings();

  return (
    <main className="onboarding">
      <header className="hero">
        <div className="hero-logo">
          <Logo size={44} />
        </div>
        <h1>CS Concept Companion</h1>
        <p className="tagline">
          Read anything on the web. When you meet a computer science term you don’t know, highlight
          it and get a clear explanation — right there on the page.
        </p>

        <div className="demo-strip card-panel">
          “The function calls itself repeatedly, a technique known as <mark>recursion</mark>, until
          it reaches the base case…”
          <div className="demo-caption">
            ↑ Highlight a term like this, then click the <strong>Explain</strong> button that
            appears.
          </div>
        </div>
      </header>

      <div className="steps">
        <div className="step card-panel">
          <div className="step-number" aria-hidden="true">
            1
          </div>
          <div>
            <h2>Highlight any CS term</h2>
            <p>
              On any normal webpage — Wikipedia, documentation, a tutorial — select a term like
              “hash table”, “Big O”, or “REST API”. A small <strong>Explain</strong> button pops up
              next to your selection.
            </p>
          </div>
        </div>

        <div className="step card-panel">
          <div className="step-number" aria-hidden="true">
            2
          </div>
          <div>
            <h2>Read the explanation card</h2>
            <p>
              A compact card appears with a beginner-friendly explanation, an example, an analogy,
              and why the concept matters. Expand it for depth, copy it, or explore related
              concepts. Prefer the keyboard? Press <kbd>Ctrl/⌘ + Shift + E</kbd> with text selected.
            </p>
          </div>
        </div>

        <div className="step card-panel">
          <div className="step-number" aria-hidden="true">
            3
          </div>
          <div>
            <h2>Save concepts to your library</h2>
            <p>
              Click <strong>Save</strong> on any card to keep it. Open the extension popup anytime
              to review, search, and revisit everything you’ve learned.
            </p>
          </div>
        </div>

        <div className="step card-panel">
          <div className="step-number" aria-hidden="true">
            4
          </div>
          <div>
            <h2>It already works — no setup</h2>
            <p>
              <strong>Live Mode</strong> is on by default: it looks concepts up on Wikipedia, so it
              works with almost any term and needs no API key. Prefer fully offline? Switch to{' '}
              <strong>Demo Mode</strong> in Settings, or add your own key for{' '}
              <strong>AI Mode</strong>.
            </p>
          </div>
        </div>
      </div>

      <div className="privacy-card card-panel">
        <h2>Your privacy, plainly</h2>
        <p>
          No analytics, no tracking, no data collection. In Demo Mode nothing ever leaves your
          device. In Live Mode the term you highlight is sent to Wikipedia to fetch its article; in
          AI Mode the selection (plus its surrounding sentence and the page title) goes to the API
          host you chose — either way, only when you ask for an explanation.
        </p>
      </div>

      <div className="cta-row">
        <button className="btn primary" onClick={() => window.close()}>
          Start reading
        </button>
        <button className="btn" onClick={() => chrome.runtime.openOptionsPage()}>
          Open settings
        </button>
      </div>
    </main>
  );
}

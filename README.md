# CS Concept Companion

A Chrome extension that explains computer science concepts **inline, while you read** — highlight an unfamiliar term on any webpage and get a clear, beginner-friendly explanation without leaving the page.

> Built with Manifest V3, TypeScript, React, and Vite. Works instantly with no API key.

---

## The problem

Learning computer science from the web means constantly hitting unfamiliar jargon — _memoization_, _normalization_, _O(n log n)_ — mid-paragraph. The usual fix is opening a new tab, searching, skimming three results, and losing your place. That context-switch tax adds up, and for beginners it often means giving up on hard articles entirely.

CS Concept Companion removes the tab-switch: select the term, click **Explain**, read a focused explanation right next to the text, and keep reading.

## Key features

- **Inline explanation card** — highlight text and a small _Explain_ button appears; clicking it opens a compact card with the concept name, a 2–3 sentence explanation, a code example, an everyday analogy, why the concept matters, related-concept chips, and a difficulty label.
- **Three explanation sources**, switchable in Settings:
  - **Live Mode (default)** — looks concepts up on **Wikipedia's free REST API**. No API key, covers essentially any CS term, and biases ambiguous words (e.g. _semaphore_) toward their computer-science sense. When a term is also in the curated set, the live definition is enriched with a hand-written example and analogy.
  - **Demo Mode** — a curated, hand-written dictionary of **52 core CS concepts** with aliases and context-aware matching. Fully offline; nothing ever leaves your device.
  - **AI Mode** — plug in any OpenAI-compatible API (key, base URL, model) for open-ended explanations tuned to your chosen reading level.
- **Saved concept library** — save explanations, then search, review, copy, and revisit them from the popup, with source-page attribution.
- **Recent history & usage stats** — see what you've looked up, plus a small learning-milestone progress bar.
- **Keyboard shortcut** — `Ctrl/⌘ + Shift + E` explains the current selection.
- **Light & dark themes**, reduced-motion support, keyboard navigation, and ARIA labeling throughout.
- **Style isolation via Shadow DOM** — the injected UI can't be broken by page CSS and can't break the page.

## Screenshots

| Inline card on an article | Popup library      | Settings           |
| ------------------------- | ------------------ | ------------------ |
| _(add screenshot)_        | _(add screenshot)_ | _(add screenshot)_ |

To capture your own: load the extension (below), visit any article, highlight “recursion”, and click **Explain**.

## Architecture

```text
┌─────────────── webpage ───────────────┐
│  content script (vanilla TS, IIFE)    │
│  • selection detection + debounce     │
│  • context capture (paragraph,        │
│    heading, title)                    │
│  • floating button + card, rendered   │
│    in a closed Shadow DOM             │
└──────────────┬────────────────────────┘
               │ chrome.runtime messages
┌──────────────▼────────────────────────┐
│  background service worker (module)   │
│  • routes explain/save requests       │
│  • per-tab request cancellation       │
│  • ExplanationProvider interface      │
│    ├─ WikipediaProvider (live REST)   │
│    ├─ DemoProvider (local dictionary) │
│    └─ AiProvider  (OpenAI-compatible) │
│  • history + stats bookkeeping        │
└──────────────┬────────────────────────┘
               │ chrome.storage.local
┌──────────────▼────────────────────────┐
│  React pages (popup / options /       │
│  onboarding) built with Vite          │
└───────────────────────────────────────┘
```

Design decisions worth noting:

- **The content script is deliberately React-free.** It ships as a single 20 kB IIFE, keeping injection light on every page. React powers the three extension pages, where it earns its weight.
- **All explanation logic lives behind one interface** (`ExplanationProvider`), so adding Anthropic, Gemini, or a self-hosted model later is a single new class.
- **Every storage read goes through one module** with defaults merged over stored values — missing or stale keys can never crash the UI, and tests swap in an in-memory mock.

## Technology stack

- Chrome Extension **Manifest V3** (module service worker, content script, commands)
- **TypeScript** (strict, `noUncheckedIndexedAccess`)
- **React 18** for popup / options / onboarding
- **Vite** (two builds: ES-module pages + IIFE content script)
- **Vitest** for tests, **ESLint + Prettier** for quality
- Plain scoped CSS with design tokens (no CSS framework needed)

## Installation (load unpacked)

1. `git clone https://github.com/aayushgrover7/cs-concept-companion && cd cs-concept-companion`
2. `npm install`
3. `npm run build`
4. Open Chrome → `chrome://extensions`
5. Enable **Developer mode** (top right)
6. Click **Load unpacked** and choose the generated **`dist/`** folder
7. A short onboarding page opens — you're ready. Highlight any CS term on a webpage.

## Local development

```bash
npm install        # install dependencies
npm run dev        # rebuild pages on change (re-run build for the content script)
npm run build      # production build → dist/
npm run test       # vitest suite
npm run typecheck  # strict TypeScript
npm run lint       # eslint
npm run format     # prettier
npm run icons      # regenerate PNG icons from the SVG logo
```

After rebuilding, click the refresh icon on the extension card in `chrome://extensions`.

## How Live Mode works

Live Mode is the default and needs no setup:

1. The highlighted term is resolved to a lookup phrase (a curated-dictionary match supplies a canonical CS title when one exists).
2. For terms not in the dictionary, the lookup is **biased toward computer science** — it searches Wikipedia for `"<term> computer science"` first, so _semaphore_ resolves to _Semaphore (programming)_ rather than flag signaling.
3. It fetches the article via Wikipedia's REST summary endpoint (`/api/rest_v1/page/summary/…`), following redirects and skipping disambiguation pages, with a full-text search fallback.
4. The first two sentences become the concise explanation; the full extract is shown on expand. If the term is also curated, the hand-written example, analogy, and "why it matters" are layered on top.

Only the highlighted term is sent to Wikipedia — never the page. All requests go through the background service worker, which holds the narrow `https://*.wikipedia.org/*` host permission.

## How Demo Mode works

Demo Mode is a fully offline explanation engine:

1. The selection is normalized (case, punctuation, simple plurals).
2. It's matched against 52 curated concepts and ~200 aliases (`hashmap` → _Hash Table_, `github` → _Git_, `o(n)` → _Big O Notation_), using whole-word matching so "api" never fires inside "rapid".
3. Longer, more specific terms win (“binary search tree” beats “tree”), and the surrounding paragraph, nearest heading, and page title break ties — a selection of just “tcp” on a networking article resolves confidently to _TCP/IP_.
4. If nothing matches, the card says so politely and suggests CS concepts it _did_ spot nearby — it never invents an answer.

## Configuring AI Mode

1. Open **Settings** (popup → Settings, or right-click the icon → Options).
2. Choose **AI Mode**, then enter your API key, base URL (e.g. `https://api.openai.com/v1`), and model (e.g. `gpt-4o-mini`).
3. Click **Save AI settings** — Chrome will ask to grant access to that API host (the extension requests host permission _only_ for the origin you configure, only when you configure it).

The AI is prompted to return strict JSON (`concept`, `shortExplanation`, `detailedExplanation`, `example`, `analogy`, `whyItMatters`, `relatedConcepts`, `difficulty`), which is validated and normalized before rendering; malformed responses produce a friendly error with a retry, never a broken card.

### ⚠️ AI Mode & key safety

Calling an AI API directly from a browser extension means your API key is stored in the extension's local storage and attached to requests from your machine. That's a reasonable trade-off for a **personal key you own and can revoke**, and the key never appears in this repository or its code. But for a production product with real users, the right architecture is a **backend proxy**: the extension calls your server, the server holds the key, adds rate limiting and abuse controls, and forwards requests to the AI provider. The `ExplanationProvider` interface here was designed so a `ProxyProvider` could be added without touching any UI code.

## Privacy

- **No analytics, no tracking, no data collection. Period.**
- **Demo Mode:** nothing ever leaves your device.
- **Live Mode:** only the term you highlight is sent to Wikipedia to fetch its article — never the surrounding page — and only when you ask for an explanation.
- **AI Mode:** only when you explicitly request an explanation, the extension sends the selected text, up to ~600 characters of surrounding text, the nearest heading, and the page title — never the full page — to the API host _you_ configured.
- Saved concepts, history, stats, and settings live in `chrome.storage.local` on your device.
- The extension does not run on `chrome://` pages or the Web Store.

## Permissions explained

| Permission                                    | Why                                                                                                                                          |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `storage`                                     | Save your settings, concept library, and history locally.                                                                                    |
| `host_permissions: https://*.wikipedia.org/*` | Lets the background worker fetch article summaries in Live Mode. Narrowly scoped to Wikipedia.                                               |
| Content script on `http(s)://*/*`             | Required to detect selections and show the card on the pages you read. It runs no network requests and collects nothing.                     |
| `optional_host_permissions: https://*/*`      | Requested **only** for the single API origin you configure in AI Mode, at the moment you configure it. Never requested in Demo or Live Mode. |

## Testing

```bash
npm run test
```

51 tests cover concept matching (exact, alias, plural, context, whole-word negative cases), AI response extraction/validation against malformed payloads, the live Wikipedia provider (summary mapping, CS-biased search fallback, curated enrichment, not-found errors), storage utilities with an in-memory Chrome mock, duplicate-save prevention, and selection sanitization.

Manual verification was done on Wikipedia, MDN, GitHub, a blog article, documentation sites, a dark-themed page, and an SPA (the card and button are viewport-fixed and dismiss on significant scroll, navigation, `Escape`, or outside clicks).

## Technical challenges

- **Injecting UI into arbitrary pages safely.** Every site ships different, sometimes hostile CSS. The button and card render inside a _closed_ Shadow DOM with `all: initial` at the boundary, so page styles can't leak in and extension styles can't leak out. All dynamic text is inserted via `textContent`, never `innerHTML`, so page or AI content can't inject markup.
- **Positioning near selected text.** The UI anchors to `Range.getBoundingClientRect()`, prefers the space below the selection, flips above near the bottom edge, and clamps to the viewport with a margin — measured after render so real card height drives the math.
- **Two build targets from one codebase.** Extension pages want modern ES modules; content scripts must be single-file IIFEs. Two small Vite configs share one `src/`, and the service worker builds as an ES module with a stable filename for the manifest.
- **Reliability under rapid input.** Selection events are debounced; each tab keeps at most one in-flight request (new requests abort the old via `AbortController`); stale responses are dropped with a sequence counter; duplicate cards are impossible by construction.
- **Supporting both local and AI providers.** A single typed `ExplanationProvider` interface plus a strict validator means the card-rendering code neither knows nor cares where an explanation came from.

## Known limitations

- Demo Mode covers 52 concepts; outside its dictionary it declines rather than guesses (by design — AI Mode covers the long tail).
- The content script cannot run on Chrome internal pages, the Chrome Web Store, or PDFs (a platform restriction for all extensions).
- Sites with aggressive selection-clearing scripts can occasionally dismiss the button early.
- AI Mode requires the configured endpoint to support the OpenAI chat-completions format.

## Future improvements

- Spaced-repetition review mode ("quiz me on my saved concepts")
- Export library to Markdown/Anki
- Backend proxy provider with managed keys
- Firefox port (the code touches only WebExtension-compatible APIs)
- Per-site disable list

## Project impact

I built CS Concept Companion to solve a problem I have every week: technical reading is where real CS learning happens, but jargon makes it feel gated. The project pushed me across an unusually wide surface — browser extension architecture (three isolated runtime contexts talking over message passing), defensive UI injection into pages I don't control, typed provider abstractions, offline NLP-ish term matching, API integration with strict response validation, and accessibility. It is small enough to hold in your head and complete enough to ship: tested, linted, documented, and genuinely useful in my own browser every day.

---

_MIT-style use welcome — built as a learning project and portfolio piece._

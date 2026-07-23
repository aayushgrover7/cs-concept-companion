/**
 * All inline-UI styles live inside the shadow root, so page CSS cannot leak in
 * and ours cannot leak out. Only system fonts are used — the extension makes
 * no network requests of its own.
 */
export const shadowStyles = `
  :host {
    all: initial;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .root {
    --paper: #fffdf7;
    --ink: #26303c;
    --muted: #6b7484;
    --accent: #b45309;
    --accent-strong: #92400e;
    --accent-soft: #fdf1dc;
    --border: #e7dfcd;
    --shadow: 0 4px 6px rgba(38, 48, 60, 0.06), 0 12px 32px rgba(38, 48, 60, 0.14);
    --code-bg: #f4efe3;
    --success: #15803d;
    --danger: #b91c1c;
    --serif: Charter, 'Iowan Old Style', 'Palatino Linotype', Georgia, serif;
    --sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-family: var(--sans);
    font-size: 14px;
    line-height: 1.5;
    color: var(--ink);
  }

  .root[data-theme='dark'] {
    --paper: #1c232e;
    --ink: #e9e4d8;
    --muted: #98a1b0;
    --accent: #e8a33d;
    --accent-strong: #f3b95f;
    --accent-soft: #2c2a20;
    --border: #333e4d;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.25), 0 12px 32px rgba(0, 0, 0, 0.45);
    --code-bg: #141a23;
    --success: #4ade80;
    --danger: #f87171;
  }

  /* ---- Floating action button ---- */
  .fab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px 6px 8px;
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--paper);
    color: var(--ink);
    font-family: var(--sans);
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.01em;
    cursor: pointer;
    box-shadow: var(--shadow);
    animation: rise 140ms ease-out;
  }
  .fab:hover { border-color: var(--accent); color: var(--accent-strong); }
  .fab:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  .fab svg { display: block; }

  /* ---- Card ---- */
  .card {
    width: 360px;
    max-width: calc(100vw - 24px);
    max-height: min(480px, calc(100vh - 24px));
    display: flex;
    flex-direction: column;
    background: var(--paper);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--shadow);
    overflow: hidden;
    animation: rise 160ms ease-out;
  }
  .card:focus { outline: none; }
  .card:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

  .card-header {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 14px 8px;
    border-bottom: 1px solid var(--border);
  }
  .card-title-wrap { flex: 1; min-width: 0; }
  .card-eyebrow {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 2px;
  }
  .card-title {
    font-family: var(--serif);
    font-size: 19px;
    font-weight: 700;
    line-height: 1.25;
    overflow-wrap: break-word;
  }
  .badges { display: flex; gap: 6px; margin-top: 5px; flex-wrap: wrap; }
  .badge {
    font-size: 10.5px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 999px;
    border: 1px solid var(--border);
    color: var(--muted);
    background: transparent;
  }
  .badge.difficulty { color: var(--accent-strong); background: var(--accent-soft); border-color: transparent; }

  .card-body {
    padding: 12px 14px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }
  .short { font-size: 14px; line-height: 1.55; }

  .section { margin-top: 12px; }
  .section-label {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 4px;
  }
  .section p { font-size: 13.5px; line-height: 1.55; white-space: pre-wrap; }
  .example {
    font-family: var(--mono);
    font-size: 12px;
    line-height: 1.55;
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px;
    white-space: pre-wrap;
    overflow-x: auto;
  }
  .analogy {
    font-family: var(--serif);
    font-style: italic;
    border-left: 3px solid var(--accent);
    padding-left: 10px;
  }

  .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
  .chip {
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 500;
    color: var(--ink);
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 3px 10px;
    cursor: pointer;
  }
  .chip:hover { border-color: var(--accent); color: var(--accent-strong); }
  .chip:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }

  .card-footer {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 10px;
    border-top: 1px solid var(--border);
  }
  .spacer { flex: 1; }
  .source {
    font-size: 11px;
    color: var(--muted);
    padding-left: 4px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: var(--sans);
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
    background: transparent;
    border: none;
    border-radius: 7px;
    padding: 6px 8px;
    cursor: pointer;
  }
  .btn:hover { color: var(--ink); background: var(--accent-soft); }
  .btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
  .btn[disabled] { opacity: 0.5; cursor: default; }
  .btn.saved { color: var(--success); }
  .btn svg { display: block; }

  .icon-btn { padding: 6px; border-radius: 7px; }

  .expand-btn {
    margin-top: 12px;
    color: var(--accent-strong);
    padding-left: 0;
  }
  .expand-btn:hover { background: transparent; text-decoration: underline; }

  /* ---- Loading skeleton ---- */
  .skeleton-line {
    height: 12px;
    border-radius: 6px;
    background: linear-gradient(90deg, var(--code-bg) 25%, var(--accent-soft) 50%, var(--code-bg) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite linear;
    margin-bottom: 10px;
  }
  .skeleton-line.w60 { width: 60%; }
  .skeleton-line.w90 { width: 90%; }
  .skeleton-line.w75 { width: 75%; }
  .skeleton-title { height: 18px; width: 45%; margin-bottom: 14px; }

  /* ---- Error state ---- */
  .error-box { padding: 4px 0; }
  .error-title { font-weight: 700; color: var(--danger); font-size: 13.5px; margin-bottom: 4px; }
  .error-msg { font-size: 13px; color: var(--ink); margin-bottom: 10px; }
  .retry-btn {
    color: var(--paper);
    background: var(--accent);
    padding: 6px 14px;
  }
  .retry-btn:hover { background: var(--accent-strong); color: var(--paper); }

  .not-cs { color: var(--muted); font-size: 13px; margin-top: 8px; }

  @keyframes rise {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    from { background-position: 200% 0; }
    to { background-position: -200% 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .fab, .card { animation: none; }
    .skeleton-line { animation: none; background: var(--code-bg); }
  }
`;

import type { ConceptExplanation, ExplainResponse, ExplanationRequest, Settings } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { captureContext, isInEditableElement } from './context';
import { FloatingButton } from './ui/button';
import { ExplanationCard } from './ui/card';
import { isSelectionUsable } from '../utils/text';

const SCROLL_HIDE_THRESHOLD = 120;
const SELECTION_DEBOUNCE_MS = 180;

// Guard against double injection (e.g. after an extension reload).
declare global {
  interface Window {
    __csConceptCompanionLoaded?: boolean;
  }
}

function main(): void {
  if (window.__csConceptCompanionLoaded) return;
  window.__csConceptCompanionLoaded = true;

  let settings: Settings = DEFAULT_SETTINGS;
  let lastRequest: ExplanationRequest | null = null;
  let lastAnchorRect: DOMRect | null = null;
  let debounceTimer: number | undefined;
  let scrollOrigin: number | null = null;
  let requestSeq = 0;

  const card = new ExplanationCard(DEFAULT_SETTINGS.theme, {
    onClose: () => card.close(),
    onRetry: () => {
      if (lastRequest) explain(lastRequest);
    },
    onRegenerate: () => {
      if (lastRequest) explain(lastRequest);
    },
    onSave: async (explanation: ConceptExplanation) => {
      const response = (await send({
        type: 'save-concept',
        explanation,
        pageTitle: lastRequest?.pageTitle ?? document.title,
        pageUrl: lastRequest?.pageUrl ?? location.href,
      })) as { saved: boolean } | undefined;
      // Treat "already saved" duplicates as saved so the UI settles.
      return response ? true : false;
    },
    onExplainRelated: (concept: string) => {
      if (!lastRequest) return;
      explain({ ...lastRequest, selectedText: concept, surroundingText: '', nearestHeading: '' });
    },
    isSaved: async (concept: string) => {
      const response = (await send({ type: 'is-saved', concept })) as
        { saved: boolean } | undefined;
      return response?.saved === true;
    },
  });

  const button = new FloatingButton(DEFAULT_SETTINGS.theme, () => {
    button.hide();
    if (lastRequest) explain(lastRequest);
  });

  function send(message: unknown): Promise<unknown> {
    return chrome.runtime.sendMessage(message).catch(() => undefined);
  }

  function explain(request: ExplanationRequest): void {
    lastRequest = request;
    const seq = ++requestSeq;
    card.showLoading(lastAnchorRect ?? undefined);
    scrollOrigin = null;

    void send({ type: 'explain', request }).then((raw) => {
      if (seq !== requestSeq || !card.visible) return; // superseded or closed
      const response = raw as ExplainResponse | undefined;
      if (!response) {
        card.showError('The extension was reloaded. Refresh this page and try again.', false);
        return;
      }
      if (response.ok) {
        card.showExplanation(response.explanation);
      } else {
        card.showError(response.error, response.retryable);
      }
    });
  }

  function currentSelectionRequest(): { request: ExplanationRequest; rect: DOMRect } | null {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) return null;
    if (isInEditableElement(selection.anchorNode) || isInEditableElement(selection.focusNode)) {
      return null;
    }
    if (!isSelectionUsable(selection.toString())) return null;

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return null;
    return { request: captureContext(selection), rect };
  }

  function onSelectionSettled(): void {
    if (!settings.enabled) return;
    const found = currentSelectionRequest();
    if (!found) {
      button.hide();
      return;
    }
    lastRequest = found.request;
    lastAnchorRect = found.rect;
    scrollOrigin = null;
    if (!card.visible) button.show(found.rect);
  }

  document.addEventListener('selectionchange', () => {
    window.clearTimeout(debounceTimer);
    debounceTimer = window.setTimeout(onSelectionSettled, SELECTION_DEBOUNCE_MS);
  });

  // Hide UI when clicking outside of it.
  document.addEventListener(
    'mousedown',
    (event) => {
      if (button.contains(event.target) || card.contains(event.target)) return;
      button.hide();
      if (card.visible) card.close();
    },
    true,
  );

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && (card.visible || button.visible)) {
      button.hide();
      card.close();
    }
  });

  // Hide after significant scrolling — positions are viewport-fixed.
  window.addEventListener(
    'scroll',
    () => {
      if (!button.visible && !card.visible) return;
      if (scrollOrigin === null) scrollOrigin = window.scrollY;
      if (Math.abs(window.scrollY - scrollOrigin) > SCROLL_HIDE_THRESHOLD) {
        button.hide();
        card.close();
        scrollOrigin = null;
      }
    },
    { passive: true },
  );

  // SPA navigations: close any open UI so it never floats over new content.
  window.addEventListener('popstate', () => {
    button.hide();
    card.close();
  });

  chrome.runtime.onMessage.addListener((message: { type?: string }) => {
    if (message.type === 'explain-shortcut') {
      const found = currentSelectionRequest();
      if (found) {
        lastRequest = found.request;
        lastAnchorRect = found.rect;
        button.hide();
        explain(found.request);
      }
    }
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local' || !changes.settings) return;
    settings = { ...DEFAULT_SETTINGS, ...(changes.settings.newValue as Partial<Settings>) };
    card.setTheme(settings.theme);
    button.setTheme(settings.theme);
    if (!settings.enabled) {
      button.hide();
      card.close();
    }
  });

  void chrome.storage.local
    .get('settings')
    .then((stored) => {
      settings = { ...DEFAULT_SETTINGS, ...(stored.settings as Partial<Settings> | undefined) };
      card.setTheme(settings.theme);
      button.setTheme(settings.theme);
    })
    .catch(() => undefined);
}

main();

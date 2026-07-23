import type { ExplainResponse, RuntimeMessage } from '../types';
import { getExplanation } from '../services/explanationService';
import { ExplanationError } from '../services/provider';
import { getSettings } from '../storage/settings';
import { addToHistory, bumpStat } from '../storage/history';
import { isConceptSaved, saveConcept } from '../storage/library';

// One in-flight explanation per tab: a newer request cancels the older one,
// which handles rapid repeated clicks cleanly.
const inflight = new Map<number, AbortController>();

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    void chrome.tabs.create({ url: chrome.runtime.getURL('onboarding.html') });
  }
});

// Keyboard shortcut: ask the active tab's content script to explain its selection.
chrome.commands.onCommand.addListener((command) => {
  if (command !== 'explain-selection') return;
  void chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
    if (tab?.id !== undefined) {
      chrome.tabs.sendMessage(tab.id, { type: 'explain-shortcut' }).catch(() => {
        // No content script on this page (e.g. chrome:// or the web store) — ignore.
      });
    }
  });
});

async function handleExplain(
  message: Extract<RuntimeMessage, { type: 'explain' }>,
  tabId: number | undefined,
): Promise<ExplainResponse> {
  const settings = await getSettings();
  if (!settings.enabled) {
    return {
      ok: false,
      error: 'The extension is turned off. Enable it from the popup.',
      retryable: false,
    };
  }

  if (tabId !== undefined) {
    inflight.get(tabId)?.abort();
  }
  const controller = new AbortController();
  if (tabId !== undefined) inflight.set(tabId, controller);

  try {
    const explanation = await getExplanation(message.request, settings, controller.signal);
    if (!explanation.notCsConcept) {
      await addToHistory(explanation, message.request.pageTitle, message.request.pageUrl);
      await bumpStat('conceptsExplained');
    }
    return { ok: true, explanation };
  } catch (error) {
    if (error instanceof ExplanationError) {
      return { ok: false, error: error.message, retryable: error.retryable };
    }
    return { ok: false, error: 'Something went wrong. Please try again.', retryable: true };
  } finally {
    if (tabId !== undefined && inflight.get(tabId) === controller) {
      inflight.delete(tabId);
    }
  }
}

chrome.runtime.onMessage.addListener((message: RuntimeMessage, sender, sendResponse) => {
  if (message.type === 'explain') {
    void handleExplain(message, sender.tab?.id).then(sendResponse);
    return true; // keep the message channel open for the async response
  }

  if (message.type === 'save-concept') {
    void saveConcept(message.explanation, message.pageTitle, message.pageUrl).then(
      async (saved) => {
        if (saved) await bumpStat('conceptsSaved');
        sendResponse({ saved: saved !== null });
      },
    );
    return true;
  }

  if (message.type === 'is-saved') {
    void isConceptSaved(message.concept).then((saved) => sendResponse({ saved }));
    return true;
  }

  return false;
});

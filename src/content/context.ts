import type { ExplanationRequest } from '../types';
import { MAX_CONTEXT_LENGTH, sanitizeSelection, truncate } from '../utils/text';

const BLOCK_TAGS = new Set([
  'P',
  'LI',
  'TD',
  'DD',
  'DT',
  'BLOCKQUOTE',
  'PRE',
  'ARTICLE',
  'SECTION',
  'DIV',
  'MAIN',
]);
const HEADING_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6']);

function closestBlock(node: Node | null): Element | null {
  let el: Element | null = node instanceof Element ? node : (node?.parentElement ?? null);
  while (el && !BLOCK_TAGS.has(el.tagName)) el = el.parentElement;
  return el;
}

/** Walk backwards through the document for the nearest heading above the selection. */
function nearestHeading(node: Node | null): string {
  let el: Element | null = node instanceof Element ? node : (node?.parentElement ?? null);
  while (el) {
    let sibling: Element | null = el.previousElementSibling;
    while (sibling) {
      if (HEADING_TAGS.has(sibling.tagName)) {
        return truncate(sibling.textContent ?? '', 120);
      }
      const nested = sibling.querySelector('h1,h2,h3,h4,h5,h6');
      if (nested) return truncate(nested.textContent ?? '', 120);
      sibling = sibling.previousElementSibling;
    }
    if (HEADING_TAGS.has(el.tagName)) return truncate(el.textContent ?? '', 120);
    el = el.parentElement;
  }
  return '';
}

/** Build the minimal page context we send along with a selection. */
export function captureContext(selection: Selection): ExplanationRequest {
  const selectedText = sanitizeSelection(selection.toString());
  const anchor = selection.anchorNode;
  const block = closestBlock(anchor);

  return {
    selectedText,
    surroundingText: truncate(block?.textContent ?? '', MAX_CONTEXT_LENGTH),
    pageTitle: truncate(document.title, 150),
    pageUrl: location.href.split('#')[0] ?? location.href,
    nearestHeading: nearestHeading(anchor),
  };
}

/** True when the selection lives inside an editable field we must not touch. */
export function isInEditableElement(node: Node | null): boolean {
  let el: Element | null = node instanceof Element ? node : (node?.parentElement ?? null);
  while (el) {
    const tag = el.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if ((el as HTMLElement).isContentEditable) return true;
    el = el.parentElement;
  }
  return false;
}

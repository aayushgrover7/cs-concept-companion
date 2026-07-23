export const MAX_SELECTION_LENGTH = 400;
export const MAX_CONTEXT_LENGTH = 600;
export const MIN_SELECTION_LENGTH = 2;

/** Trim, collapse internal whitespace, and cap the length of a selection. */
export function sanitizeSelection(raw: string): string {
  const cleaned = raw.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= MAX_SELECTION_LENGTH) return cleaned;
  // Cut at a word boundary so we never send half a word.
  const cut = cleaned.slice(0, MAX_SELECTION_LENGTH);
  const lastSpace = cut.lastIndexOf(' ');
  return lastSpace > MAX_SELECTION_LENGTH / 2 ? cut.slice(0, lastSpace) : cut;
}

export function isSelectionUsable(text: string): boolean {
  const cleaned = text.trim();
  return cleaned.length >= MIN_SELECTION_LENGTH && /[a-zA-Z]/.test(cleaned);
}

export function truncate(text: string, max: number): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  return cleaned.length <= max ? cleaned : `${cleaned.slice(0, max - 1)}…`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

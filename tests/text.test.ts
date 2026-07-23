import { describe, expect, it } from 'vitest';
import {
  isSelectionUsable,
  MAX_SELECTION_LENGTH,
  sanitizeSelection,
  truncate,
} from '../src/utils/text';

describe('sanitizeSelection', () => {
  it('trims and collapses whitespace', () => {
    expect(sanitizeSelection('  hello \n\t world  ')).toBe('hello world');
  });

  it('caps very long selections at a word boundary', () => {
    const long = 'word '.repeat(200);
    const result = sanitizeSelection(long);
    expect(result.length).toBeLessThanOrEqual(MAX_SELECTION_LENGTH);
    expect(result.endsWith('word')).toBe(true);
  });

  it('leaves short selections unchanged', () => {
    expect(sanitizeSelection('recursion')).toBe('recursion');
  });
});

describe('isSelectionUsable', () => {
  it('rejects empty and whitespace-only selections', () => {
    expect(isSelectionUsable('')).toBe(false);
    expect(isSelectionUsable('   \n ')).toBe(false);
  });

  it('rejects selections with no letters', () => {
    expect(isSelectionUsable('12345 !!')).toBe(false);
  });

  it('rejects single characters', () => {
    expect(isSelectionUsable('a')).toBe(false);
  });

  it('accepts normal terms', () => {
    expect(isSelectionUsable('Big O')).toBe(true);
  });
});

describe('truncate', () => {
  it('shortens with an ellipsis', () => {
    expect(truncate('abcdefghij', 5)).toBe('abcd…');
  });

  it('leaves short text alone', () => {
    expect(truncate('abc', 5)).toBe('abc');
  });
});

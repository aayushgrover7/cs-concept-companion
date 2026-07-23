import { describe, expect, it } from 'vitest';
import { extractJson, validateExplanation } from '../src/services/validate';

const validPayload = {
  concept: 'Recursion',
  isCsConcept: true,
  shortExplanation: 'A function calling itself.',
  detailedExplanation: 'Longer text.',
  example: 'factorial(n)',
  analogy: 'Mirrors facing each other.',
  whyItMatters: 'Common technique.',
  relatedConcepts: ['Function', 'Stack'],
  difficulty: 'intermediate',
};

describe('extractJson', () => {
  it('parses plain JSON', () => {
    expect(extractJson('{"a": 1}')).toEqual({ a: 1 });
  });

  it('parses JSON wrapped in a code fence', () => {
    expect(extractJson('```json\n{"a": 1}\n```')).toEqual({ a: 1 });
  });

  it('parses JSON surrounded by prose', () => {
    expect(extractJson('Here you go: {"a": 1} hope that helps')).toEqual({ a: 1 });
  });

  it('returns null for garbage', () => {
    expect(extractJson('not json at all')).toBeNull();
    expect(extractJson('{broken')).toBeNull();
  });
});

describe('validateExplanation', () => {
  it('accepts a complete valid payload', () => {
    const result = validateExplanation(validPayload, 'test-model');
    expect(result).not.toBeNull();
    expect(result?.concept).toBe('Recursion');
    expect(result?.difficulty).toBe('intermediate');
    expect(result?.source).toBe('test-model');
    expect(result?.notCsConcept).toBe(false);
  });

  it('rejects payloads missing required fields', () => {
    expect(validateExplanation({ concept: 'X' }, 'm')).toBeNull();
    expect(validateExplanation({ shortExplanation: 'Y' }, 'm')).toBeNull();
    expect(validateExplanation(null, 'm')).toBeNull();
    expect(validateExplanation('string', 'm')).toBeNull();
  });

  it('normalizes an invalid difficulty to beginner', () => {
    const result = validateExplanation({ ...validPayload, difficulty: 'expert' }, 'm');
    expect(result?.difficulty).toBe('beginner');
  });

  it('drops non-string related concepts and caps the list', () => {
    const result = validateExplanation(
      { ...validPayload, relatedConcepts: ['A', 2, 'B', null, 'C', 'D', 'E', 'F', 'G'] },
      'm',
    );
    expect(result?.relatedConcepts).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
  });

  it('flags non-CS responses', () => {
    const result = validateExplanation({ ...validPayload, isCsConcept: false }, 'm');
    expect(result?.notCsConcept).toBe(true);
  });

  it('tolerates missing optional fields', () => {
    const result = validateExplanation(
      { concept: 'X', shortExplanation: 'Enough text here.' },
      'm',
    );
    expect(result?.example).toBe('');
    expect(result?.relatedConcepts).toEqual([]);
  });
});

import { describe, expect, it } from 'vitest';
import {
  conceptsInText,
  findConceptByName,
  matchConcept,
  normalizeTerm,
} from '../src/concepts/matcher';
import { allConcepts } from '../src/concepts';

describe('concept dictionary', () => {
  it('contains at least 40 concepts', () => {
    expect(allConcepts.length).toBeGreaterThanOrEqual(40);
  });

  it('has complete entries', () => {
    for (const entry of allConcepts) {
      expect(entry.name).toBeTruthy();
      expect(entry.shortExplanation.length).toBeGreaterThan(40);
      expect(entry.detailedExplanation.length).toBeGreaterThan(40);
      expect(entry.example).toBeTruthy();
      expect(entry.analogy).toBeTruthy();
      expect(entry.whyItMatters).toBeTruthy();
      expect(entry.relatedConcepts.length).toBeGreaterThan(0);
    }
  });

  it('has unique ids', () => {
    const ids = allConcepts.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('normalizeTerm', () => {
  it('lowercases, trims, and strips punctuation', () => {
    expect(normalizeTerm('  "Recursion!"  ')).toBe('recursion');
    expect(normalizeTerm('Big   O   notation')).toBe('big o notation');
  });
});

describe('matchConcept', () => {
  it('matches an exact concept name', () => {
    expect(matchConcept('recursion')?.entry.id).toBe('recursion');
  });

  it('matches regardless of case and punctuation', () => {
    expect(matchConcept('"Recursion."')?.entry.id).toBe('recursion');
  });

  it('matches aliases', () => {
    expect(matchConcept('hashmap')?.entry.id).toBe('hash-table');
    expect(matchConcept('OOP')?.entry.id).toBe('oop');
    expect(matchConcept('github')?.entry.id).toBe('git');
  });

  it('matches simple plurals', () => {
    expect(matchConcept('pointers')?.entry.id).toBe('pointer');
    expect(matchConcept('binary trees')?.entry.id).toBe('binary-tree');
  });

  it('finds a concept inside a longer selection', () => {
    const match = matchConcept('the function uses recursion to walk the tree');
    expect(match?.entry.id).toBe('recursion');
  });

  it('prefers the more specific multi-word concept', () => {
    expect(matchConcept('big o notation')?.entry.id).toBe('big-o');
    expect(matchConcept('binary search')?.entry.id).toBe('binary-search');
  });

  it('does not match substrings inside other words', () => {
    // "api" must not fire inside "rapid".
    expect(matchConcept('rapid growth of plants')).toBeNull();
  });

  it('returns null for clearly non-CS text', () => {
    expect(matchConcept('grilled cheese sandwich lunch menu ideas today')).toBeNull();
  });

  it('uses page context to resolve a vague short selection', () => {
    const match = matchConcept('tcp', 'A guide to networking and the TCP/IP protocol suite');
    expect(match?.entry.id).toBe('tcp-ip');
  });
});

describe('conceptsInText', () => {
  it('lists concepts mentioned in context text', () => {
    const found = conceptsInText('This article covers recursion and hash tables in depth');
    const ids = found.map((entry) => entry.id);
    expect(ids).toContain('recursion');
  });
});

describe('findConceptByName', () => {
  it('finds by display name', () => {
    expect(findConceptByName('Big O Notation')?.id).toBe('big-o');
  });

  it('returns undefined for unknown names', () => {
    expect(findConceptByName('flux capacitor')).toBeUndefined();
  });
});

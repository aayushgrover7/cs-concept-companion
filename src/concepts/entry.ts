import type { Difficulty } from '../types';

export interface ConceptEntry {
  id: string;
  name: string;
  /** Lowercase alternative spellings and synonyms used for matching. */
  aliases: string[];
  category: string;
  difficulty: Difficulty;
  shortExplanation: string;
  detailedExplanation: string;
  example: string;
  analogy: string;
  whyItMatters: string;
  relatedConcepts: string[];
}

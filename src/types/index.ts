export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type ExplanationMode = 'demo' | 'ai';
export type Theme = 'light' | 'dark' | 'system';
export type DetailLevel = 'concise' | 'detailed';

/** Context captured from the page when the user asks for an explanation. */
export interface ExplanationRequest {
  selectedText: string;
  /** Sentence/paragraph surrounding the selection, already length-limited. */
  surroundingText: string;
  pageTitle: string;
  pageUrl: string;
  /** Nearest heading above the selection, when one exists. */
  nearestHeading: string;
}

/** A structured explanation, produced by either provider. */
export interface ConceptExplanation {
  concept: string;
  shortExplanation: string;
  detailedExplanation: string;
  example: string;
  analogy: string;
  whyItMatters: string;
  relatedConcepts: string[];
  difficulty: Difficulty;
  /** True when the selection did not look like a CS concept. */
  notCsConcept?: boolean;
  /** Where the explanation came from, e.g. "Demo Mode" or a model name. */
  source: string;
}

export interface SavedConcept {
  id: string;
  concept: string;
  shortExplanation: string;
  example: string;
  sourceTitle: string;
  sourceUrl: string;
  savedAt: number;
  tags: string[];
  difficulty: Difficulty;
}

export interface HistoryEntry {
  id: string;
  concept: string;
  shortExplanation: string;
  sourceTitle: string;
  sourceUrl: string;
  explainedAt: number;
}

export interface Settings {
  enabled: boolean;
  mode: ExplanationMode;
  apiKey: string;
  apiBaseUrl: string;
  model: string;
  detailLevel: DetailLevel;
  readingLevel: Difficulty;
  showAnalogies: boolean;
  showExamples: boolean;
  theme: Theme;
}

export interface UsageStats {
  conceptsExplained: number;
  conceptsSaved: number;
}

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  mode: 'demo',
  apiKey: '',
  apiBaseUrl: 'https://api.openai.com/v1',
  model: 'gpt-4o-mini',
  detailLevel: 'concise',
  readingLevel: 'beginner',
  showAnalogies: true,
  showExamples: true,
  theme: 'system',
};

/** Messages exchanged between the content script and the background worker. */
export type RuntimeMessage =
  | { type: 'explain'; request: ExplanationRequest }
  | { type: 'save-concept'; explanation: ConceptExplanation; pageTitle: string; pageUrl: string }
  | { type: 'is-saved'; concept: string }
  | { type: 'explain-shortcut' };

export type ExplainResponse =
  { ok: true; explanation: ConceptExplanation } | { ok: false; error: string; retryable: boolean };

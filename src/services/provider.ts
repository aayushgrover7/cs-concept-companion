import type { ConceptExplanation, ExplanationRequest, Settings } from '../types';

export interface ExplanationProvider {
  explain(
    input: ExplanationRequest,
    settings: Settings,
    signal?: AbortSignal,
  ): Promise<ConceptExplanation>;
}

/** Error with a user-facing message and a hint about whether retrying helps. */
export class ExplanationError extends Error {
  readonly retryable: boolean;

  constructor(message: string, retryable = true) {
    super(message);
    this.name = 'ExplanationError';
    this.retryable = retryable;
  }
}

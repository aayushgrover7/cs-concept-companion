import type { ConceptExplanation, ExplanationRequest, Settings } from '../types';
import { ExplanationError, type ExplanationProvider } from './provider';
import { extractJson, validateExplanation } from './validate';
import { truncate } from '../utils/text';

const REQUEST_TIMEOUT_MS = 25_000;

/**
 * Provider for any OpenAI-compatible chat completions API.
 *
 * NOTE: calling an AI API directly from an extension means the user's own API
 * key lives in extension storage and is attached to requests from the client.
 * That is acceptable for a personal key the user controls, but a production
 * product should route requests through a backend proxy that holds the key
 * server-side. See README "AI Mode & key safety".
 */
export class AiProvider implements ExplanationProvider {
  async explain(
    input: ExplanationRequest,
    settings: Settings,
    signal?: AbortSignal,
  ): Promise<ConceptExplanation> {
    if (!settings.apiKey) {
      throw new ExplanationError('AI Mode needs an API key. Add one in Settings.', false);
    }

    const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
    const combined = signal ? AbortSignal.any([signal, timeout]) : timeout;

    let response: Response;
    try {
      response = await fetch(`${settings.apiBaseUrl.replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.apiKey}`,
        },
        body: JSON.stringify({
          model: settings.model,
          temperature: 0.4,
          max_tokens: 700,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: this.systemPrompt(settings) },
            { role: 'user', content: this.userPrompt(input) },
          ],
        }),
        signal: combined,
      });
    } catch {
      if (signal?.aborted) throw new ExplanationError('Request cancelled.', false);
      if (timeout.aborted) throw new ExplanationError('The AI request timed out. Try again.');
      throw new ExplanationError(
        'Could not reach the AI service. Check your connection and API base URL.',
        true,
      );
    }

    if (!response.ok) throw this.httpError(response.status);

    const payload: unknown = await response.json().catch(() => null);
    const content = this.messageContent(payload);
    const explanation = validateExplanation(extractJson(content ?? ''), settings.model);
    if (!explanation) {
      throw new ExplanationError('The AI returned an unexpected response. Try regenerating.');
    }
    return explanation;
  }

  private messageContent(payload: unknown): string | null {
    if (typeof payload !== 'object' || payload === null) return null;
    const choices = (payload as { choices?: unknown }).choices;
    if (!Array.isArray(choices) || choices.length === 0) return null;
    const message = (choices[0] as { message?: { content?: unknown } }).message;
    return typeof message?.content === 'string' ? message.content : null;
  }

  private httpError(status: number): ExplanationError {
    if (status === 401 || status === 403) {
      return new ExplanationError('Invalid API key. Check your key in Settings.', false);
    }
    if (status === 429) {
      return new ExplanationError('Rate limit reached. Wait a moment and try again.');
    }
    if (status === 404) {
      return new ExplanationError(
        'Model or endpoint not found. Check the model name and base URL in Settings.',
        false,
      );
    }
    return new ExplanationError(`The AI service returned an error (HTTP ${status}). Try again.`);
  }

  private systemPrompt(settings: Settings): string {
    return [
      'You explain computer science concepts to students. Respond with ONLY a JSON object with keys:',
      'concept (string), isCsConcept (boolean), shortExplanation (2-3 sentences),',
      'detailedExplanation (1 short paragraph), example (short code or scenario),',
      'analogy (one everyday comparison), whyItMatters (1-2 sentences),',
      'relatedConcepts (array of up to 4 strings), difficulty ("beginner"|"intermediate"|"advanced").',
      `Write for a ${settings.readingLevel}-level reader. Be accurate and concise.`,
      'If the selection is not related to computer science, set isCsConcept to false and politely say so in shortExplanation instead of inventing an answer.',
    ].join(' ');
  }

  private userPrompt(input: ExplanationRequest): string {
    return [
      `Selected text: "${input.selectedText}"`,
      input.surroundingText ? `Surrounding text: "${truncate(input.surroundingText, 500)}"` : '',
      input.nearestHeading ? `Section heading: "${input.nearestHeading}"` : '',
      input.pageTitle ? `Page title: "${input.pageTitle}"` : '',
      'Explain the computer science concept the selected text refers to.',
    ]
      .filter(Boolean)
      .join('\n');
  }
}

import type { ConceptExplanation, ExplanationRequest, Settings } from '../types';
import type { ExplanationProvider } from './provider';
import { conceptsInText, matchConcept } from '../concepts/matcher';
import { truncate } from '../utils/text';

/**
 * Offline provider backed by the curated concept dictionary. Works with no
 * API key and never sends data off the device.
 */
export class DemoProvider implements ExplanationProvider {
  explain(input: ExplanationRequest, settings: Settings): Promise<ConceptExplanation> {
    const context = [input.nearestHeading, input.surroundingText, input.pageTitle].join(' ');
    const match = matchConcept(input.selectedText, context);

    if (!match) {
      return Promise.resolve(this.fallback(input));
    }

    const { entry } = match;
    return Promise.resolve({
      concept: entry.name,
      shortExplanation: entry.shortExplanation,
      detailedExplanation:
        settings.detailLevel === 'detailed'
          ? `${entry.shortExplanation}\n\n${entry.detailedExplanation}`
          : entry.detailedExplanation,
      example: settings.showExamples ? entry.example : '',
      analogy: settings.showAnalogies ? entry.analogy : '',
      whyItMatters: entry.whyItMatters,
      relatedConcepts: entry.relatedConcepts,
      difficulty: entry.difficulty,
      source: 'Demo Mode',
    });
  }

  private fallback(input: ExplanationRequest): ConceptExplanation {
    const nearby = conceptsInText(`${input.surroundingText} ${input.pageTitle}`);
    const suggestion =
      nearby.length > 0
        ? ` Based on this page, you might be interested in: ${nearby.map((c) => c.name).join(', ')}. Try highlighting one of those terms.`
        : ' Try highlighting a specific technical term, like "recursion" or "hash table".';

    return {
      concept: truncate(input.selectedText, 60),
      shortExplanation: `"${truncate(input.selectedText, 80)}" doesn't clearly match a computer science concept in the built-in library, so rather than guess, I'll say so.${suggestion}`,
      detailedExplanation:
        'Demo Mode explains concepts from a curated dictionary of 50+ core computer science topics. For open-ended explanations of any technical text, you can enable AI Mode in Settings with your own API key.',
      example: '',
      analogy: '',
      whyItMatters: '',
      relatedConcepts: nearby.map((c) => c.name),
      difficulty: 'beginner',
      notCsConcept: true,
      source: 'Demo Mode',
    };
  }
}

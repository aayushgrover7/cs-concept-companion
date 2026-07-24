import type { ConceptExplanation, ExplanationRequest, Settings } from '../types';
import type { ExplanationProvider } from './provider';
import { DemoProvider } from './demoProvider';
import { AiProvider } from './aiProvider';
import { WikipediaProvider } from './wikipediaProvider';

const providers: Record<Settings['mode'], ExplanationProvider> = {
  demo: new DemoProvider(),
  live: new WikipediaProvider(),
  ai: new AiProvider(),
};

export function getExplanation(
  request: ExplanationRequest,
  settings: Settings,
  signal?: AbortSignal,
): Promise<ConceptExplanation> {
  return providers[settings.mode].explain(request, settings, signal);
}

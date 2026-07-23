import type { ConceptExplanation, ExplanationRequest, Settings } from '../types';
import type { ExplanationProvider } from './provider';
import { DemoProvider } from './demoProvider';
import { AiProvider } from './aiProvider';

const providers: Record<Settings['mode'], ExplanationProvider> = {
  demo: new DemoProvider(),
  ai: new AiProvider(),
};

export function getExplanation(
  request: ExplanationRequest,
  settings: Settings,
  signal?: AbortSignal,
): Promise<ConceptExplanation> {
  return providers[settings.mode].explain(request, settings, signal);
}

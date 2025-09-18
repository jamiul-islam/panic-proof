import type { LlmProvider, LlmService } from '@/types/llm';
import { OnlineLlmService } from './online';
import { LocalLlmService } from './local';

export function getServiceFor(provider: LlmProvider): LlmService {
  switch (provider) {
    case 'local':
      return LocalLlmService;
    case 'online':
      return OnlineLlmService;
    case 'auto':
    default:
      return OnlineLlmService;
  }
}


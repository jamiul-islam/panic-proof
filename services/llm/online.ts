import { GeminiChatService } from '@/services/gemini-service';
import type { LlmService } from '@/types/llm';

const gemini = new GeminiChatService();

export const OnlineLlmService: LlmService = {
  name: 'Gemini',
  isAvailable: () => true,
  sendMessage: async (text, userId) => {
    return gemini.sendMessage(text, userId);
  },
};


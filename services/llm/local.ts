import type { LlmService } from '@/types/llm';
import type { SupabaseChecklistResponse } from '@/types/chat';
import { getMetadata, verifyModel } from './files';

async function tryGetExecutorch() {
  try {
    const mod = await import('react-native-executorch');
    return mod;
  } catch (e) {
    return null;
  }
}

function stubResponse(userMessage: string): SupabaseChecklistResponse {
  return {
    displayMessage: `🧠 Local LLM (stub)\n\nHere is a checklist for: ${userMessage}`,
    checklistData: {
      title: 'Local Preparedness Checklist',
      description: 'Checklist generated locally (stub)',
      category: 'planning',
      points: 12,
    },
    itemsData: [
      { text: 'Gather emergency contacts', priority: 'high', item_order: 0 },
      { text: 'Prepare a go-bag', priority: 'high', item_order: 1 },
      { text: 'Set up meeting points', priority: 'medium', item_order: 2 },
      { text: 'Practice evacuation drills', priority: 'low', item_order: 3 },
      { text: 'Check supplies monthly', priority: 'low', item_order: 4 },
    ],
    tokensUsed: 0,
  };
}

export const LocalLlmService: LlmService = {
  name: 'Local (ExecuTorch)',
  isAvailable: async () => {
    const meta = await getMetadata();
    if (!meta) return false;
    const ok = await verifyModel(meta);
    return ok;
  },
  init: async () => {
    await tryGetExecutorch();
  },
  sendMessage: async (text: string) => {
    return stubResponse(text);
  },
};


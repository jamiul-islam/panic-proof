import type { LlmService } from '@/types/llm';
import type { SupabaseChecklistResponse } from '@/types/chat';
import { getMetadata, verifyModel } from './files';

// Model used by the ExecuTorch example app
export const MODEL_ID = 'LLAMA3_2_1B_SPINQUANT';

async function tryGetExecutorch() {
  try {
    // Use require to avoid dynamic import issues with native modules in RN
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('react-native-executorch');
    return mod;
  } catch (e) {
    return null;
  }
}

function buildPrompt(userMessage: string) {
  // Minimal prompt that mirrors the Gemini JSON keys our app expects
  return `You are an emergency preparedness expert. Produce STRICT JSON only, no extra text.
Schema:
{
  "checklist": { "title": string, "description": string, "category": "supplies"|"planning"|"skills"|"home"|"personal", "points": number(5..50) },
  "items": [ { "text": string, "priority": "high"|"medium"|"low" }, ... up to 5 ],
  "display_message": string
}
User request: ${userMessage}`;
}

function toResponse(parsed: any): SupabaseChecklistResponse {
  // Normalize model JSON into our app type
  return {
    displayMessage: parsed.display_message,
    checklistData: parsed.checklist,
    itemsData: (parsed.items || []).map((it: any, i: number) => ({
      text: it.text,
      priority: it.priority,
      item_order: i,
    })),
    tokensUsed: 0,
  };
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
    // Prepare ExecuTorch runtime (matches example app model selection)
    // In UI, the hook would be: useLLM({ model: LLAMA3_2_1B_SPINQUANT })
    await tryGetExecutorch();
  },
  sendMessage: async (text: string) => {
    // Placeholder: in a subsequent step, use react-native-executorch to run prompt
    // For now, return deterministic stub to keep DB/business logic identical to online
    const prompt = buildPrompt(text);
    void prompt; // placeholder until ExecuTorch inference is wired here
    return stubResponse(text);
  },
};

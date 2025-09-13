import type { SupabaseChecklistResponse } from '@/types/chat';

export type LlmProvider = 'online' | 'local' | 'auto';

export interface LlmService {
  init?: () => Promise<void>;
  isAvailable: () => Promise<boolean> | boolean;
  sendMessage: (text: string, userId: string) => Promise<SupabaseChecklistResponse>;
  name: string;
}


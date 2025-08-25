// types/chat.ts - Updated for Supabase integration
interface SupabaseChecklistData {
  title: string;
  description: string;
  category: 'supplies' | 'planning' | 'skills' | 'home' | 'personal';
  points: number;
}

interface SupabaseItemData {
  text: string;
  priority: 'high' | 'medium' | 'low';
  item_order: number;
}

interface SupabaseChecklistResponse {
  displayMessage: string; // For chat display
  checklistData: SupabaseChecklistData; // For user_checklists table
  itemsData: SupabaseItemData[]; // For user_checklist_items table
  tokensUsed: number;
}

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  checklistData?: SupabaseChecklistData;
  itemsData?: SupabaseItemData[];
  timestamp: string;
}

interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export type {
  SupabaseChecklistData,
  SupabaseItemData,
  SupabaseChecklistResponse,
  ChatMessage,
  ChatSession
};

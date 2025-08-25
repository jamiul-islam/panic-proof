// store/supabase-chat-store.ts - New Supabase-integrated chat store
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { GeminiChatService } from '../services/gemini-service';
import { useAuthStore } from './auth-store';
import { useUserStore } from './user-store';
import type { 
  SupabaseChecklistResponse, 
  ChatMessage, 
  ChatSession,
  SupabaseChecklistData,
  SupabaseItemData 
} from '../types/chat';

interface SupabaseChatStore {
  // State
  currentSession: ChatSession | null;
  chatSessions: ChatSession[];
  isTyping: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadSessions: () => Promise<void>;
  createNewSession: () => Promise<void>;
  selectSession: (sessionId: string) => void;
  sendMessage: (text: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  clearAllSessions: () => void;
  addChecklistToPrepList: (messageId: string) => Promise<boolean>;
  
  // Internal helpers
  _addMessageToSession: (sessionId: string, message: ChatMessage) => void;
  _updateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  _getUserUuidFromClerkId: (clerkId: string) => Promise<string | null>;
}

const geminiService = new GeminiChatService();

export const useSupabaseChatStore = create<SupabaseChatStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSession: null,
      chatSessions: [],
      isTyping: false,
      isLoading: false,
      error: null,

      // Load sessions from Supabase
      loadSessions: async () => {
        console.log('💬 Loading chat sessions from Supabase...');
        set({ isLoading: true, error: null });
        
        try {
          const { userId, isAuthenticated } = useAuthStore.getState();
          
          if (!isAuthenticated || !userId) {
            console.log('⚠️ No authenticated user, working with offline mode');
            set({ isLoading: false });
            return;
          }

          // Get user's UUID from Clerk ID
          const userUuid = await get()._getUserUuidFromClerkId(userId);
          if (!userUuid) {
            throw new Error('User not found in database');
          }

          // Fetch sessions with message counts
          const { data: sessions, error: sessionsError } = await supabase
            .from('chat_sessions')
            .select(`
              *,
              chat_messages(id)
            `)
            .eq('user_id', userUuid)
            .order('updated_at', { ascending: false });

          if (sessionsError) {
            throw sessionsError;
          }

          console.log(`✅ Loaded ${sessions?.length || 0} sessions`);

          // Convert to our format
          const formattedSessions: ChatSession[] = sessions?.map(session => ({
            id: session.id,
            user_id: session.user_id,
            title: session.title,
            created_at: session.created_at || '',
            updated_at: session.updated_at || ''
          })) || [];

          set({ 
            chatSessions: formattedSessions,
            currentSession: formattedSessions[0] || null,
            isLoading: false 
          });

        } catch (error) {
          console.error('❌ Failed to load sessions:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to load sessions',
            isLoading: false 
          });
        }
      },

      // Create a new chat session
      createNewSession: async () => {
        console.log('📝 Creating new chat session...');
        set({ isLoading: true, error: null });
        
        try {
          const { userId, isAuthenticated } = useAuthStore.getState();
          
          if (!isAuthenticated || !userId) {
            // Create offline session for unauthenticated users
            console.log('⚠️ Creating offline chat session...');
            const offlineSession: ChatSession = {
              id: `offline-${Date.now()}`,
              user_id: userId || 'guest',
              title: 'AI Chat',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            set((state) => ({
              chatSessions: [offlineSession, ...state.chatSessions],
              currentSession: offlineSession,
              isLoading: false
            }));

            return;
          }

          // Get user's UUID from Clerk ID
          const userUuid = await get()._getUserUuidFromClerkId(userId);
          if (!userUuid) {
            throw new Error('User not found in database');
          }

          // Create session in database for authenticated users
          const { data: session, error: sessionError } = await supabase
            .from('chat_sessions')
            .insert([{ 
              user_id: userUuid, 
              title: 'AI Chat' 
            }])
            .select()
            .single();

          if (sessionError) {
            throw sessionError;
          }

          console.log('✅ Created session:', session.id);

          // Add welcome message
          const welcomeMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            content: 'Hello! I\'m your emergency preparedness AI assistant. Ask me anything about disaster preparation, and I\'ll create actionable checklists you can save to your prep list.',
            role: 'assistant',
            timestamp: new Date().toISOString(),
          };

          // Save welcome message to database
          await supabase
            .from('chat_messages')
            .insert([{
              session_id: session.id,
              content: welcomeMessage.content,
              role: welcomeMessage.role
            }]);

          const newSession: ChatSession = {
            id: session.id,
            user_id: session.user_id,
            title: session.title,
            created_at: session.created_at || new Date().toISOString(),
            updated_at: session.updated_at || new Date().toISOString()
          };

          set((state) => ({
            chatSessions: [newSession, ...state.chatSessions],
            currentSession: newSession,
            isLoading: false
          }));

        } catch (error) {
          console.error('❌ Failed to create session:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create session',
            isLoading: false 
          });
        }
      },

      // Select an existing session and load its messages
      selectSession: (sessionId: string) => {
        console.log('📂 Selecting session:', sessionId);
        const { chatSessions } = get();
        const session = chatSessions.find(s => s.id === sessionId);
        
        if (session) {
          set({ currentSession: session });
        }
      },

      // Send a message and get AI response
      sendMessage: async (text: string) => {
        console.log('📤 Sending message:', text.substring(0, 50) + '...');
        const { currentSession } = get();
        
        if (!currentSession) {
          console.error('❌ No current session');
          return;
        }

        set({ isTyping: false, error: null });

        try {
          const { userId, isAuthenticated } = useAuthStore.getState();
          const currentUserId = userId || 'guest';

          // For offline sessions or unauthenticated users, we still get AI responses
          // but don't save to database
          if (!isAuthenticated || !userId || currentSession.id.startsWith('offline-')) {
            console.log('⚠️ Offline mode - AI responses only, no database storage');
            
            // Show typing indicator
            set({ isTyping: true });

            // Get AI response
            console.log('🤖 Getting AI response...');
            const aiResponse = await geminiService.sendMessage(text, currentUserId);
            
            console.log('✅ AI response received, tokens:', aiResponse.tokensUsed);

            set({ isTyping: false });
            return;
          }

          // Get user's UUID from Clerk ID (userId is guaranteed to be non-null here)
          const userUuid = await get()._getUserUuidFromClerkId(userId);
          if (!userUuid) {
            throw new Error('User not found in database');
          }

          // Save user message to database (authenticated users)
          const { data: userMessage, error: userMsgError } = await supabase
            .from('chat_messages')
            .insert([{
              session_id: currentSession.id,
              content: text,
              role: 'user'
            }])
            .select()
            .single();

          if (userMsgError) {
            throw userMsgError;
          }

          console.log('✅ User message saved');

          // Update session title if it's still default
          if (currentSession.title === 'AI Chat' && text.length > 0) {
            const newTitle = text.length > 30 ? text.substring(0, 30) + '...' : text;
            
            await supabase
              .from('chat_sessions')
              .update({ title: newTitle, updated_at: new Date().toISOString() })
              .eq('id', currentSession.id);

            get()._updateSession(currentSession.id, { title: newTitle });
          }

          // Show typing indicator
          set({ isTyping: true });

          // Get AI response
          console.log('🤖 Getting AI response...');
          const aiResponse = await geminiService.sendMessage(text, userUuid);
          
          console.log('✅ AI response received, tokens:', aiResponse.tokensUsed);

          // Save AI response to database with checklist data
          const { data: assistantMessage, error: assistantMsgError } = await supabase
            .from('chat_messages')
            .insert([{
              session_id: currentSession.id,
              content: aiResponse.displayMessage,
              role: 'assistant',
              checklist_data: JSON.parse(JSON.stringify({
                checklist: aiResponse.checklistData,
                items: aiResponse.itemsData,
                tokensUsed: aiResponse.tokensUsed
              }))
            }])
            .select()
            .single();

          if (assistantMsgError) {
            throw assistantMsgError;
          }

          console.log('✅ AI message saved with checklist data');

          // Update session updated_at
          await supabase
            .from('chat_sessions')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', currentSession.id);

          set({ isTyping: false });

        } catch (error) {
          console.error('❌ Failed to send message:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to send message',
            isTyping: false 
          });
        }
      },      // Delete a chat session
      deleteSession: async (sessionId: string) => {
        console.log('🗑️ Deleting session:', sessionId);
        set({ isLoading: true, error: null });

        try {
          // Delete from database (messages will be cascade deleted)
          const { error } = await supabase
            .from('chat_sessions')
            .delete()
            .eq('id', sessionId);

          if (error) {
            throw error;
          }

          console.log('✅ Session deleted from database');

          const { chatSessions, currentSession } = get();
          const updatedSessions = chatSessions.filter(s => s.id !== sessionId);
          
          let newCurrentSession = currentSession;
          if (currentSession?.id === sessionId) {
            newCurrentSession = updatedSessions[0] || null;
          }

          set({
            chatSessions: updatedSessions,
            currentSession: newCurrentSession,
            isLoading: false
          });

        } catch (error) {
          console.error('❌ Failed to delete session:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete session',
            isLoading: false 
          });
        }
      },

      // Clear all sessions (for debugging)
      clearAllSessions: () => {
        console.log('🧹 Clearing all sessions');
        set({
          currentSession: null,
          chatSessions: [],
          isTyping: false,
          error: null
        });
      },

      // Add checklist from message to user's prep list
      addChecklistToPrepList: async (messageId: string) => {
        console.log('📋 Adding checklist to prep list, messageId:', messageId);
        set({ error: null });

        try {
          const { userId, isAuthenticated } = useAuthStore.getState();
          
          if (!isAuthenticated || !userId) {
            throw new Error('Please sign in to save checklists to your prep list');
          }

          // Get user's UUID from Clerk ID
          const userUuid = await get()._getUserUuidFromClerkId(userId);
          if (!userUuid) {
            throw new Error('User not found in database');
          }

          // Get the message with checklist data
          const { data: message, error: msgError } = await supabase
            .from('chat_messages')
            .select('checklist_data')
            .eq('id', messageId)
            .single();

          if (msgError || !message?.checklist_data) {
            throw new Error('Message or checklist data not found');
          }

          const checklistData = message.checklist_data as any;
          
          // Create checklist in user_checklists using UUID
          const { data: checklist, error: checklistError } = await supabase
            .from('user_checklists')
            .insert([{
              user_id: userUuid,  // Use UUID instead of Clerk ID
              title: checklistData.checklist.title,
              description: checklistData.checklist.description,
              category: checklistData.checklist.category,
              points: checklistData.checklist.points
            }])
            .select()
            .single();

          if (checklistError) {
            throw checklistError;
          }

          console.log('✅ Checklist created:', checklist.id);

          // Create items
          const items = checklistData.items.map((item: any) => ({
            checklist_id: checklist.id,
            text: item.text,
            item_order: item.item_order,
            is_completed: false
          }));

          const { error: itemsError } = await supabase
            .from('user_checklist_items')
            .insert(items);

          if (itemsError) {
            throw itemsError;
          }

          console.log('✅ Checklist items created:', items.length);

          // Refresh custom checklists in user store
          try {
            await useUserStore.getState().loadCustomChecklists();
            console.log('✅ User store custom checklists refreshed');
          } catch (refreshError) {
            console.warn('⚠️ Failed to refresh user store checklists:', refreshError);
            // Don't throw - the checklist was still created successfully
          }

          return true;

        } catch (error) {
          console.error('❌ Failed to add checklist:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to add checklist'
          });
          return false;
        }
      },

      // Internal helper: Add message to current session
      _addMessageToSession: (sessionId: string, message: ChatMessage) => {
        // This will be handled by the database and real-time subscriptions in production
        // For now, we'll let the UI refresh by querying
      },

      // Internal helper: Update session
      _updateSession: (sessionId: string, updates: Partial<ChatSession>) => {
        set((state) => ({
          chatSessions: state.chatSessions.map(session =>
            session.id === sessionId ? { ...session, ...updates } : session
          ),
          currentSession: state.currentSession?.id === sessionId 
            ? { ...state.currentSession, ...updates }
            : state.currentSession
        }));
      },

      // Internal helper: Get user UUID from Clerk ID
      _getUserUuidFromClerkId: async (clerkId: string) => {
        try {
          console.log('🔍 Looking up UUID for Clerk ID:', clerkId);
          
          const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('clerk_user_id', clerkId)
            .single();

          if (error) {
            console.error('❌ Error looking up user UUID:', error);
            return null;
          }

          if (!data) {
            console.error('❌ User not found for Clerk ID:', clerkId);
            return null;
          }

          console.log('✅ Found UUID for Clerk ID:', data.id);
          return data.id;
        } catch (error) {
          console.error('❌ Exception looking up user UUID:', error);
          return null;
        }
      },
    }),
    {
      name: 'supabase-chat-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          return {
            currentSession: null,
            chatSessions: [],
            isTyping: false,
            isLoading: false,
            error: null,
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        // Only persist session list, not loading states
        chatSessions: state.chatSessions,
        currentSession: state.currentSession,
      }),
    }
  )
);

// Helper function for generating IDs
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

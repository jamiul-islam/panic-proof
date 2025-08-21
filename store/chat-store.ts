import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage, ChatSession } from '@/types';
import { mockChatSessions, generateAIResponse } from '@/mocks/chats';

interface ChatStore {
  // State
  currentSession: ChatSession | null;
  chatSessions: ChatSession[];
  isTyping: boolean;
  
  // Actions
  loadSessions: () => void;
  createNewSession: () => void;
  selectSession: (sessionId: string) => void;
  sendMessage: (text: string) => void;
  deleteSession: (sessionId: string) => void;
  clearAllSessions: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSession: null,
      chatSessions: [],
      isTyping: false,

      // Load sessions from storage or use mock data
      loadSessions: () => {
        const { chatSessions } = get();
        if (chatSessions.length === 0) {
          set({ chatSessions: mockChatSessions, currentSession: mockChatSessions[0] });
        }
      },

      // Create a new chat session
      createNewSession: () => {
        const newSession: ChatSession = {
          id: `session-${Date.now()}`,
          title: 'New Chat',
          messages: [
            {
              id: `msg-${Date.now()}`,
              text: 'Hello! I\'m your emergency preparedness AI assistant. How can I help you stay prepared today?',
              isUser: false,
              timestamp: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          chatSessions: [newSession, ...state.chatSessions],
          currentSession: newSession,
        }));
      },

      // Select an existing session
      selectSession: (sessionId: string) => {
        const { chatSessions } = get();
        const session = chatSessions.find(s => s.id === sessionId);
        if (session) {
          set({ currentSession: session });
        }
      },

      // Send a message and generate AI response
      sendMessage: (text: string) => {
        const { currentSession, chatSessions } = get();
        if (!currentSession) return;

        const userMessage: ChatMessage = {
          id: `msg-${Date.now()}-user`,
          text,
          isUser: true,
          timestamp: new Date().toISOString(),
        };

        // Add user message and show typing indicator
        const updatedSession = {
          ...currentSession,
          messages: [...currentSession.messages, userMessage],
          updatedAt: new Date().toISOString(),
        };

        // Update session title based on first user message if it's still "New Chat"
        if (updatedSession.title === 'New Chat' && text.length > 0) {
          updatedSession.title = text.length > 30 ? text.substring(0, 30) + '...' : text;
        }

        const updatedSessions = chatSessions.map(session =>
          session.id === currentSession.id ? updatedSession : session
        );

        set({
          currentSession: updatedSession,
          chatSessions: updatedSessions,
          isTyping: true,
        });

        // Simulate AI response delay
        setTimeout(() => {
          const aiResponse: ChatMessage = {
            id: `msg-${Date.now()}-ai`,
            text: generateAIResponse(text),
            isUser: false,
            timestamp: new Date().toISOString(),
          };

          const finalSession = {
            ...updatedSession,
            messages: [...updatedSession.messages, aiResponse],
            updatedAt: new Date().toISOString(),
          };

          const finalSessions = chatSessions.map(session =>
            session.id === currentSession.id ? finalSession : session
          );

          set({
            currentSession: finalSession,
            chatSessions: finalSessions,
            isTyping: false,
          });
        }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5 seconds
      },

      // Delete a chat session
      deleteSession: (sessionId: string) => {
        const { chatSessions, currentSession } = get();
        const updatedSessions = chatSessions.filter(s => s.id !== sessionId);
        
        let newCurrentSession = currentSession;
        if (currentSession?.id === sessionId) {
          newCurrentSession = updatedSessions[0] || null;
        }

        set({
          chatSessions: updatedSessions,
          currentSession: newCurrentSession,
        });
      },

      // Clear all sessions (for debugging/reset)
      clearAllSessions: () => {
        set({
          currentSession: null,
          chatSessions: [],
          isTyping: false,
        });
      },
    }),
    {
      name: 'chat-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Handle migration from older versions
        if (version === 0) {
          // If migrating from version 0, reset to initial state
          return {
            currentSession: null,
            chatSessions: [],
            isTyping: false,
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        chatSessions: state.chatSessions,
        currentSession: state.currentSession,
      }),
    }
  )
);

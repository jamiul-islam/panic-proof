import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  userId: string | null;
  userEmail: string | null;
  lastSignInTime: number | null;
  setAuthenticated: (value: boolean) => void;
  setOnboardingCompleted: (value: boolean) => void;
  setUserData: (userId: string, email: string) => void;
  signOut: () => void;
  reset: () => void;
  clearPersistedState: () => Promise<void>;
  isSessionValid: () => boolean;
}

const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      userId: null,
      userEmail: null,
      lastSignInTime: null,
      
      setAuthenticated: (value) => set({ 
        isAuthenticated: value,
        lastSignInTime: value ? Date.now() : null
      }),
      
      setOnboardingCompleted: (value) => set({ hasCompletedOnboarding: value }),
      
      setUserData: (userId, email) => set({ 
        userId, 
        userEmail: email,
        lastSignInTime: Date.now()
      }),
      
      signOut: () => set({ 
        isAuthenticated: false, 
        hasCompletedOnboarding: false,
        userId: null,
        userEmail: null,
        lastSignInTime: null
      }),
      
      reset: () => set({ 
        isAuthenticated: false, 
        hasCompletedOnboarding: false,
        userId: null,
        userEmail: null,
        lastSignInTime: null
      }),
      
      isSessionValid: () => {
        const { lastSignInTime } = get();
        if (!lastSignInTime) return false;
        return Date.now() - lastSignInTime < SESSION_DURATION;
      },
      
      clearPersistedState: async () => {
        await AsyncStorage.removeItem('auth-storage');
        set({ 
          isAuthenticated: false, 
          hasCompletedOnboarding: false,
          userId: null,
          userEmail: null,
          lastSignInTime: null
        });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2, // Increment version for new fields
      migrate: (persistedState: any, version: number) => {
        // Handle migration from older versions
        if (version < 2) {
          // Add new fields with default values
          return {
            ...persistedState,
            userId: null,
            userEmail: null,
            lastSignInTime: null,
            isAuthenticated: persistedState.isAuthenticated || false,
            hasCompletedOnboarding: persistedState.hasCompletedOnboarding || false,
          };
        }
        return persistedState;
      },
    }
  )
);
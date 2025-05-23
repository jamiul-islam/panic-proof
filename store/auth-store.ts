import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  setAuthenticated: (value: boolean) => void;
  setOnboardingCompleted: (value: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setOnboardingCompleted: (value) => set({ hasCompletedOnboarding: value }),
      reset: () => set({ isAuthenticated: false, hasCompletedOnboarding: false })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
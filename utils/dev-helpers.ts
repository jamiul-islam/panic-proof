import { useAuthStore } from '@/store/auth-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Development utility functions for testing authentication flow
 * These should only be used during development/testing
 */

export const DevAuthHelpers = {
  /**
   * Clear all persisted auth state and reset to initial state
   * Use this to test the authentication flow from scratch
   */
  clearAuthState: async () => {
    try {
      await AsyncStorage.removeItem('auth-storage');
      // Reset the auth store to initial state
      useAuthStore.getState().reset();
      console.log('Auth state cleared successfully');
    } catch (error) {
      console.error('Error clearing auth state:', error);
    }
  },

  /**
   * Clear all AsyncStorage data (be careful with this!)
   */
  clearAllAsyncStorage: async () => {
    try {
      await AsyncStorage.clear();
      console.log('All AsyncStorage data cleared');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  },

  /**
   * Set authentication state manually for testing
   */
  setAuthState: (isAuthenticated: boolean, hasCompletedOnboarding: boolean = false) => {
    const { setAuthenticated, setOnboardingCompleted } = useAuthStore.getState();
    setAuthenticated(isAuthenticated);
    setOnboardingCompleted(hasCompletedOnboarding);
    console.log(`Auth state set to: authenticated=${isAuthenticated}, onboarded=${hasCompletedOnboarding}`);
  },

  /**
   * Get current auth state for debugging
   */
  getAuthState: () => {
    const state = useAuthStore.getState();
    console.log('Current auth state:', {
      isAuthenticated: state.isAuthenticated,
      hasCompletedOnboarding: state.hasCompletedOnboarding
    });
    return state;
  }
};

// For easy access in development console
if (__DEV__) {
  (global as any).DevAuthHelpers = DevAuthHelpers;
}

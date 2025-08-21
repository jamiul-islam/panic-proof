import { UserService } from '../services/user-service';
import { OnboardingData } from '../types/supabase';

/**
 * Authentication flow utilities for Clerk + Supabase integration
 */
export class AuthFlowHelper {
  /**
   * Handle user after Clerk verification
   * Call this after user verifies their Clerk account
   * 
   * @param clerkUserId - The Clerk user ID
   * @returns true if user exists (redirect to home), false if needs onboarding
   */
  static async handleAfterClerkVerification(clerkUserId: string): Promise<boolean> {
    try {
      const userExists = await UserService.userExists(clerkUserId);
      return userExists;
    } catch (error) {
      console.error('Error checking user after Clerk verification:', error);
      throw error;
    }
  }

  /**
   * Handle onboarding completion
   * Call this when user completes onboarding form
   * 
   * @param clerkUserId - The Clerk user ID
   * @param email - User's email
   * @param onboardingData - Data from onboarding form
   */
  static async handleOnboardingComplete(
    clerkUserId: string,
    email: string,
    onboardingData: OnboardingData
  ) {
    try {
      const user = await UserService.createUser(clerkUserId, email, onboardingData);
      console.log('User created in Supabase:', user.id);
      return user;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  }

  /**
   * Handle sign-in
   * Call this when user signs in with Clerk
   * 
   * @param clerkUserId - The Clerk user ID
   * @returns user data or null if not found
   */
  static async handleSignIn(clerkUserId: string) {
    try {
      const user = await UserService.signInUser(clerkUserId);
      if (user) {
        console.log('User signed in:', user.name);
      } else {
        console.log('User not found, needs onboarding');
      }
      return user;
    } catch (error) {
      console.error('Error during sign-in:', error);
      throw error;
    }
  }

  /**
   * Get user profile for profile screen
   * 
   * @param clerkUserId - The Clerk user ID
   */
  static async getUserForProfile(clerkUserId: string) {
    try {
      return await UserService.getUserProfile(clerkUserId);
    } catch (error) {
      console.error('Error getting user for profile:', error);
      throw error;
    }
  }
}

/**
 * Example usage in your components:
 * 
 * // After Clerk verification (in verify.tsx):
 * const needsOnboarding = !(await AuthFlowHelper.handleAfterClerkVerification(clerkUserId));
 * if (needsOnboarding) {
 *   router.push('/onboarding');
 * } else {
 *   router.push('/(tabs)');
 * }
 * 
 * // In onboarding.tsx:
 * await AuthFlowHelper.handleOnboardingComplete(clerkUserId, email, formData);
 * router.push('/(tabs)');
 * 
 * // In sign-in.tsx (with loading state):
 * setLoading(true);
 * const user = await AuthFlowHelper.handleSignIn(clerkUserId);
 * setLoading(false);
 * if (user) {
 *   router.push('/(tabs)');
 * } else {
 *   router.push('/onboarding');
 * }
 * 
 * // In profile.tsx:
 * const user = await AuthFlowHelper.getUserForProfile(clerkUserId);
 * setUserName(user?.name || '');
 */

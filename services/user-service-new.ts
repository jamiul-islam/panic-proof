import { 
  getUserProfileByClerkId, 
  createUserAfterOnboarding, 
  updateUserProfile, 
  checkUserExists 
} from '../lib/supabase';
import { OnboardingData, UserProfile } from '../types/supabase';

export class UserService {
  /**
   * Get user profile by Clerk user ID
   * Used during sign-in to fetch user data from Supabase
   */
  static async getUserProfile(clerkUserId: string): Promise<UserProfile | null> {
    try {
      return await getUserProfileByClerkId(clerkUserId);
    } catch (error) {
      console.error('UserService: Error getting user profile:', error);
      throw error;
    }
  }

  /**
   * Create user after onboarding completion
   * Called when user completes onboarding process
   */
  static async createUser(
    clerkUserId: string,
    email: string,
    onboardingData: OnboardingData
  ): Promise<UserProfile> {
    try {
      // Check if user already exists
      const exists = await checkUserExists(clerkUserId);
      if (exists) {
        throw new Error('User already exists');
      }

      // Create new user
      return await createUserAfterOnboarding(clerkUserId, email, onboardingData);
    } catch (error) {
      console.error('UserService: Error creating user:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * Used to update user information
   */
  static async updateUser(
    clerkUserId: string,
    updates: Partial<OnboardingData>
  ): Promise<UserProfile> {
    try {
      return await updateUserProfile(clerkUserId, updates);
    } catch (error) {
      console.error('UserService: Error updating user:', error);
      throw error;
    }
  }

  /**
   * Check if user exists in Supabase
   * Used to determine if user needs onboarding
   */
  static async userExists(clerkUserId: string): Promise<boolean> {
    try {
      return await checkUserExists(clerkUserId);
    } catch (error) {
      console.error('UserService: Error checking user existence:', error);
      throw error;
    }
  }

  /**
   * Get user for sign-in with loading state support
   * Returns user data or null if not found
   */
  static async signInUser(clerkUserId: string): Promise<UserProfile | null> {
    try {
      return await getUserProfileByClerkId(clerkUserId);
    } catch (error) {
      console.error('UserService: Error during sign-in:', error);
      throw error;
    }
  }
}

// Legacy exports for backward compatibility (if needed)
export { UserService as default };

// Example usage:
/*
// After Clerk verification, during onboarding:
const user = await UserService.createUser(clerkUserId, email, {
  name: 'John Doe',
  location: 'New York, NY',
  household_size: 3,
  has_pets: true,
  has_children: true,
  has_elderly: false,
  has_disabled: false,
  medical_conditions: ['diabetes'],
  notification_preferences: {
    alerts: true,
    reminders: true,
    weather: true,
    emergency: true
  }
});

// During sign-in:
const userProfile = await UserService.signInUser(clerkUserId);
if (userProfile) {
  // Redirect to home screen
} else {
  // Redirect to onboarding
}

// In profile screen:
const currentUser = await UserService.getUserProfile(clerkUserId);
console.log(currentUser.name); // Shows the name from onboarding
*/

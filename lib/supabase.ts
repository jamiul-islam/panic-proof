import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database, OnboardingData, UserProfile } from '../types/supabase';

// Supabase configuration
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Validate required environment variables
if (!SUPABASE_URL) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL environment variable');
}

if (!SUPABASE_ANON_KEY) {
  throw new Error('Missing EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper function to get user profile by Clerk user ID
export async function getUserProfileByClerkId(clerkUserId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No user found, return null
        return null;
      }
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserProfileByClerkId:', error);
    throw error;
  }
}

// Helper function to create user after onboarding
export async function createUserAfterOnboarding(
  clerkUserId: string,
  email: string,
  onboardingData: OnboardingData
): Promise<UserProfile> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        clerk_user_id: clerkUserId,
        email,
        name: onboardingData.name,
        location: onboardingData.location,
        household_size: onboardingData.household_size || 1,
        has_pets: onboardingData.has_pets || false,
        has_children: onboardingData.has_children || false,
        has_elderly: onboardingData.has_elderly || false,
        has_disabled: onboardingData.has_disabled || false,
        medical_conditions: onboardingData.medical_conditions || [],
        notification_preferences: onboardingData.notification_preferences || {
          alerts: true,
          reminders: true,
          weather: true,
          emergency: true
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createUserAfterOnboarding:', error);
    throw error;
  }
}

// Helper function to update user profile
export async function updateUserProfile(
  clerkUserId: string,
  updates: Partial<Omit<OnboardingData, 'name'>> & { name?: string }
): Promise<UserProfile> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('clerk_user_id', clerkUserId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
}

// Helper function to check if user exists
export async function checkUserExists(clerkUserId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_user_id', clerkUserId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No user found
        return false;
      }
      console.error('Error checking user existence:', error);
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error in checkUserExists:', error);
    throw error;
  }
}

export default supabase;

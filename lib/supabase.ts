import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '../types/supabase';

// Type definitions to resolve compile errors
type UserProfile = Database['public']['Tables']['users']['Row'];
type OnboardingData = {
  name: string;
  location: string;
  household_size?: number;
  has_pets?: boolean;
  has_children?: boolean;
  has_elderly?: boolean;
  has_disabled?: boolean;
  medical_conditions?: any[];
  notification_preferences?: any;
};
type EmergencyContactRow = Database['public']['Tables']['emergency_contacts']['Row'];
type SavedLocationRow = Database['public']['Tables']['saved_locations']['Row'];

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

// Function to set Clerk JWT token in Supabase
export const setSupabaseAuth = async (token: string | null, clerkUserId?: string) => {
  try {
    if (token && clerkUserId) {
      // For now, we'll use anon key with RLS instead of custom JWT
      // This prevents authentication loops and signature validation errors
      console.log('🔧 Using anon access with RLS for Clerk auth');
      
      // Clear any existing session to ensure clean state
      const { error } = await supabase.auth.signOut();
      if (error && !error.message?.includes('No user session found')) {
        console.warn('Warning clearing session:', error.message);
      }
    } else {
      const { error } = await supabase.auth.signOut();
      if (error && !error.message?.includes('No user session found')) {
        console.warn('Warning clearing session:', error.message);
      }
      console.log('🚪 Supabase session cleared');
    }
  } catch (error) {
    console.log('🔧 Falling back to anon access with RLS');
  }
};

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
  updates: {
    name?: string;
    location?: string;
    household_size?: number;
    has_pets?: boolean;
    has_children?: boolean;
    has_elderly?: boolean;
    has_disabled?: boolean;
    medical_conditions?: string[];
  }
): Promise<UserProfile> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
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

// Emergency Contacts Service Functions
export async function createEmergencyContact(
  supabaseUserId: string,
  contactData: Omit<EmergencyContactRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<EmergencyContactRow> {
  try {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert({
        user_id: supabaseUserId,
        ...contactData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating emergency contact:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createEmergencyContact:', error);
    throw error;
  }
}

export async function getEmergencyContacts(supabaseUserId: string): Promise<EmergencyContactRow[]> {
  try {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', supabaseUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching emergency contacts:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getEmergencyContacts:', error);
    throw error;
  }
}

export async function updateEmergencyContact(
  supabaseUserId: string,
  contactId: string,
  updates: Partial<Omit<EmergencyContactRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<EmergencyContactRow> {
  try {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .update(updates)
      .eq('id', contactId)
      .eq('user_id', supabaseUserId) // Ensure user can only update their own contacts
      .select()
      .single();

    if (error) {
      console.error('Error updating emergency contact:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateEmergencyContact:', error);
    throw error;
  }
}

export async function deleteEmergencyContact(
  supabaseUserId: string,
  contactId: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', contactId)
      .eq('user_id', supabaseUserId); // Ensure user can only delete their own contacts

    if (error) {
      console.error('Error deleting emergency contact:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteEmergencyContact:', error);
    throw error;
  }
}

// Saved Locations Service Functions
export async function createSavedLocation(
  supabaseUserId: string,
  locationData: Omit<SavedLocationRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<SavedLocationRow> {
  try {
    // If this is being set as primary, clear other primary locations
    if (locationData.is_primary) {
      await supabase
        .from('saved_locations')
        .update({ is_primary: false })
        .eq('user_id', supabaseUserId)
        .eq('is_primary', true);
    }

    const { data, error } = await supabase
      .from('saved_locations')
      .insert({
        user_id: supabaseUserId,
        ...locationData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating saved location:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createSavedLocation:', error);
    throw error;
  }
}

export async function getSavedLocations(supabaseUserId: string): Promise<SavedLocationRow[]> {
  try {
    const { data, error } = await supabase
      .from('saved_locations')
      .select('*')
      .eq('user_id', supabaseUserId)
      .order('is_primary', { ascending: false }) // Primary locations first
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching saved locations:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getSavedLocations:', error);
    throw error;
  }
}

export async function updateSavedLocation(
  supabaseUserId: string,
  locationId: string,
  updates: Partial<Omit<SavedLocationRow, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<SavedLocationRow> {
  try {
    // If this is being set as primary, clear other primary locations
    if (updates.is_primary) {
      await supabase
        .from('saved_locations')
        .update({ is_primary: false })
        .eq('user_id', supabaseUserId)
        .eq('is_primary', true)
        .neq('id', locationId); // Don't update the current location
    }

    const { data, error } = await supabase
      .from('saved_locations')
      .update(updates)
      .eq('id', locationId)
      .eq('user_id', supabaseUserId) // Ensure user can only update their own locations
      .select()
      .single();

    if (error) {
      console.error('Error updating saved location:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateSavedLocation:', error);
    throw error;
  }
}

export async function deleteSavedLocation(
  supabaseUserId: string,
  locationId: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('saved_locations')
      .delete()
      .eq('id', locationId)
      .eq('user_id', supabaseUserId); // Ensure user can only delete their own locations

    if (error) {
      console.error('Error deleting saved location:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteSavedLocation:', error);
    throw error;
  }
}

export async function setPrimaryLocation(
  supabaseUserId: string,
  locationId: string
): Promise<SavedLocationRow> {
  try {
    // Clear all primary locations for this user
    await supabase
      .from('saved_locations')
      .update({ is_primary: false })
      .eq('user_id', supabaseUserId)
      .eq('is_primary', true);

    // Set the new primary location
    const { data, error } = await supabase
      .from('saved_locations')
      .update({ is_primary: true })
      .eq('id', locationId)
      .eq('user_id', supabaseUserId)
      .select()
      .single();

    if (error) {
      console.error('Error setting primary location:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in setPrimaryLocation:', error);
    throw error;
  }
}

export default supabase;

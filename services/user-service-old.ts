import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

export interface CreateUserData {
  clerk_user_id: string;
  email?: string;
  name: string;
  location: string;
  household_size: number;
  has_pets: boolean;
  has_children: boolean;
  has_elderly: boolean;
  has_disabled: boolean;
  medical_conditions: string[];
}

/**
 * Create a new user record in Supabase
 */
export async function createUser(userData: CreateUserData) {
  try {
    // Test Supabase connection first
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (testError) {
      throw new Error(`Database connection failed: ${testError.message}`);
    }
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        clerk_user_id: userData.clerk_user_id,
        email: userData.email,
        name: userData.name,
        location: userData.location,
        household_size: userData.household_size,
        has_pets: userData.has_pets,
        has_children: userData.has_children,
        has_elderly: userData.has_elderly,
        has_disabled: userData.has_disabled,
        medical_conditions: userData.medical_conditions,
        points: 0,
        level: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Get user by Clerk user ID
 */
export async function getUserByClerkId(clerkUserId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      throw error;
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(clerkUserId: string, updates: Partial<CreateUserData>) {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('clerk_user_id', clerkUserId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Convert Supabase user data to local UserProfile format
 */
export function mapSupabaseUserToProfile(supabaseUser: any): UserProfile {
  return {
    id: supabaseUser.clerk_user_id,
    name: supabaseUser.name,
    location: supabaseUser.location,
    householdSize: supabaseUser.household_size,
    hasPets: supabaseUser.has_pets,
    hasChildren: supabaseUser.has_children,
    hasElderly: supabaseUser.has_elderly,
    hasDisabled: supabaseUser.has_disabled,
    medicalConditions: supabaseUser.medical_conditions || [],
    emergencyContacts: [], // These will be loaded separately
    points: supabaseUser.points || 0,
    level: supabaseUser.level || 1,
    badges: [], // These will be loaded separately
    customKit: [], // These will be loaded separately
    customChecklists: [] // These will be loaded separately
  };
}

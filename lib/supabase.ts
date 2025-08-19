import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '../types/supabase';

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

// Helper function to get the current user's database record
export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data: userProfile, error } = await supabase
    .from('users')
    .select('*')
    .eq('clerk_user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return userProfile;
}

// Helper function to create or update user profile
export async function upsertUserProfile(clerkUserId: string, userData: {
  name: string;
  location?: string;
  household_size?: number;
  has_pets?: boolean;
  has_children?: boolean;
  has_elderly?: boolean;
  has_disabled?: boolean;
  medical_conditions?: any[];
  notification_preferences?: any;
  profile_image?: string;
}) {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      clerk_user_id: clerkUserId,
      ...userData,
    }, {
      onConflict: 'clerk_user_id',
      ignoreDuplicates: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error upserting user profile:', error);
    throw error;
  }

  return data;
}

export default supabase;

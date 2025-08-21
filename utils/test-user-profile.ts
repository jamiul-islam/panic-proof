import { UserService } from '../services/user-service';
import { supabase } from '../lib/supabase';

/**
 * Test script to verify user profile loading functionality
 * This script can be used to test the database integration
 */
export async function testUserProfile() {
  console.log('🧪 Testing user profile loading...');
  
  try {
    // First, let's check if we have any users in the database
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Error fetching users:', error);
      return;
    }
    
    console.log(`📊 Found ${users?.length || 0} users in database`);
    
    if (users && users.length > 0) {
      const testUser = users[0];
      console.log('👤 Testing with user:', testUser.name, '(ID:', testUser.clerk_user_id, ')');
      
      // Test the UserService.getUserProfile function
      const profile = await UserService.getUserProfile(testUser.clerk_user_id);
      
      if (profile) {
        console.log('✅ Successfully loaded user profile:');
        console.log('   - Name:', profile.name);
        console.log('   - Location:', profile.location);
        console.log('   - Household size:', profile.household_size);
        console.log('   - Has pets:', profile.has_pets);
        console.log('   - Has children:', profile.has_children);
        console.log('   - Medical conditions:', profile.medical_conditions);
        console.log('   - Notification preferences:', profile.notification_preferences);
      } else {
        console.log('❌ No profile found for user');
      }
    } else {
      console.log('ℹ️  No users found in database. Create a user through onboarding first.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Uncomment to run the test automatically when imported
// testUserProfile();

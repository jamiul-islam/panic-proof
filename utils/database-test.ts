import { UserService } from '../services/user-service';
import { OnboardingData } from '../types/supabase';

/**
 * Test functions for database integration
 * Use these to verify your Clerk + Supabase integration
 */
export class DatabaseTest {
  
  /**
   * Test creating a user (simulate onboarding completion)
   * Call this to test if user creation works
   */
  static async testCreateUser() {
    const testClerkId = 'test_clerk_user_' + Date.now();
    const testEmail = 'test@example.com';
    
    const testOnboardingData: OnboardingData = {
      name: 'Test User',
      location: 'Test City, Test State',
      household_size: 2,
      has_pets: true,
      has_children: false,
      has_elderly: false,
      has_disabled: false,
      medical_conditions: ['test condition'],
      notification_preferences: {
        alerts: true,
        reminders: true,
        weather: true,
        emergency: true
      }
    };

    try {
      const user = await UserService.createUser(testClerkId, testEmail, testOnboardingData);
      console.log('✅ Test user created successfully:', {
        id: user.id,
        name: user.name,
        clerk_user_id: user.clerk_user_id,
        email: user.email
      });
      return user;
    } catch (error) {
      console.error('❌ Error creating test user:', error);
      throw error;
    }
  }

  /**
   * Test fetching a user (simulate sign-in)
   */
  static async testGetUser(clerkUserId: string) {
    try {
      const user = await UserService.getUserProfile(clerkUserId);
      if (user) {
        console.log('✅ User found:', {
          id: user.id,
          name: user.name,
          location: user.location,
          household_size: user.household_size
        });
      } else {
        console.log('ℹ️ User not found (would redirect to onboarding)');
      }
      return user;
    } catch (error) {
      console.error('❌ Error getting user:', error);
      throw error;
    }
  }

  /**
   * Test checking if user exists
   */
  static async testUserExists(clerkUserId: string) {
    try {
      const exists = await UserService.userExists(clerkUserId);
      console.log(`✅ User exists: ${exists}`);
      return exists;
    } catch (error) {
      console.error('❌ Error checking user existence:', error);
      throw error;
    }
  }

  /**
   * Run all tests
   */
  static async runAllTests() {
    console.log('🧪 Starting database tests...\n');
    
    try {
      // Test 1: Create a test user
      console.log('Test 1: Creating test user...');
      const createdUser = await this.testCreateUser();
      
      // Test 2: Fetch the created user
      console.log('\nTest 2: Fetching created user...');
      await this.testGetUser(createdUser.clerk_user_id);
      
      // Test 3: Check if user exists
      console.log('\nTest 3: Checking if user exists...');
      await this.testUserExists(createdUser.clerk_user_id);
      
      console.log('\n✅ All tests passed! Your database integration is working correctly.');
      
      return {
        success: true,
        testUserId: createdUser.clerk_user_id,
        message: 'Database integration is working correctly'
      };
      
    } catch (error) {
      console.error('\n❌ Tests failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Database integration has issues'
      };
    }
  }
}

// Example usage:
/*
// To run all tests:
const results = await DatabaseTest.runAllTests();

// To test specific functionality:
const user = await DatabaseTest.testCreateUser();
const fetchedUser = await DatabaseTest.testGetUser(user.clerk_user_id);
*/

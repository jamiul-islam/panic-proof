// utils/auth-test.ts - Test authentication integration
import { useAuthStore } from '@/store/auth-store';

function testAuth() {
  console.log('🔐 Testing Authentication Integration...\n');
  
  const authState = useAuthStore.getState();
  
  console.log('📊 Current Auth State:');
  console.log('  isAuthenticated:', authState.isAuthenticated);
  console.log('  userId:', authState.userId);
  console.log('  userEmail:', authState.userEmail);
  console.log('  hasCompletedOnboarding:', authState.hasCompletedOnboarding);
  console.log('  lastSignInTime:', authState.lastSignInTime);
  console.log('  isSessionValid:', authState.isSessionValid());
  
  if (!authState.isAuthenticated) {
    console.log('\n⚠️  User is not authenticated');
    console.log('   Chat will work in offline mode (AI responses but no database saving)');
    console.log('   To test database integration, you need to sign in first');
  } else {
    console.log('\n✅ User is authenticated');
    console.log('   Chat will save to database');
    console.log('   Ready for full testing');
  }
  
  return authState;
}

// Execute if run directly
if (require.main === module) {
  testAuth();
}

export { testAuth };

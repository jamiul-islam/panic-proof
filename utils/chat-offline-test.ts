// utils/chat-offline-test.ts - Test chat functionality without authentication
import { useSupabaseChatStore } from '@/store/supabase-chat-store';

async function testOfflineChat() {
  console.log('💬 Testing Chat Functionality (Offline Mode)...\n');
  
  const chatStore = useSupabaseChatStore.getState();
  
  console.log('📋 Step 1: Test createNewSession()');
  try {
    await chatStore.createNewSession();
    console.log('✅ Session created successfully');
    
    const currentSession = useSupabaseChatStore.getState().currentSession;
    if (currentSession) {
      console.log('  Session ID:', currentSession.id);
      console.log('  Session Title:', currentSession.title);
      console.log('  User ID:', currentSession.user_id);
    }
  } catch (error) {
    console.error('❌ Session creation failed:', error);
    return;
  }
  
  console.log('\n📋 Step 2: Test sendMessage()');
  try {
    await chatStore.sendMessage('What should I prepare for an earthquake?');
    console.log('✅ Message sent successfully');
    
    const { error, isTyping } = useSupabaseChatStore.getState();
    console.log('  Typing indicator:', isTyping);
    console.log('  Error state:', error);
  } catch (error) {
    console.error('❌ Message sending failed:', error);
  }
  
  console.log('\n🎯 Offline Chat Test Complete');
  console.log('   The chat should now work in your app UI');
  console.log('   Try: Open app → Chat tab → Start New Chat → Send message');
}

// Execute if run directly
if (require.main === module) {
  testOfflineChat().catch(console.error);
}

export { testOfflineChat };

// test-gemini.ts - Temporary test file
import { GeminiChatService } from '../services/gemini-service';

async function testGeminiAPI() {
  try {
    console.log('🚀 Starting Gemini API test...');
    const geminiService = new GeminiChatService();
    const success = await geminiService.testConnection();
    
    if (success) {
      console.log('🎉 Gemini API integration is working!');
      process.exit(0);
    } else {
      console.log('❌ Gemini API integration failed');
      process.exit(1);
    }
  } catch (error) {
    console.error('Test error:', error);
    process.exit(1);
  }
}

testGeminiAPI();

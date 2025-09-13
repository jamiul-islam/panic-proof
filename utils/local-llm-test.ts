// utils/local-llm-test.ts - Test Local (ExecuTorch) provider end-to-end shape
import { LocalLlmService } from '@/services/llm/local';

async function runLocalLlmTest() {
  console.log('\n🔍 Local LLM Test (ExecuTorch stub)');
  console.log('='.repeat(50));

  try {
    const available = await LocalLlmService.isAvailable();
    console.log('📦 Model available:', available ? 'YES' : 'NO');
    await LocalLlmService.init?.();

    const prompts = [
      'How do I prepare for a hurricane?',
      'Create an emergency plan for wildfires.',
    ];

    for (const p of prompts) {
      console.log('\n📤 Prompt:', p);
      const res = await (LocalLlmService as any).sendMessage(p, 'local-test-user');
      console.log('✅ Received structured response');
      console.log('  • Title:', res.checklistData.title);
      console.log('  • Category:', res.checklistData.category);
      console.log('  • Points:', res.checklistData.points);
      console.log('  • Items:', res.itemsData.length);
      console.log('  • Display message (first 60):', res.displayMessage.slice(0, 60), '...');
    }

    console.log('\n🎉 Local LLM test finished.');
  } catch (e) {
    console.error('❌ Local LLM test failed:', e);
  }
}

if (require.main === module) {
  runLocalLlmTest().catch(console.error);
}


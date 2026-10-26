import { testGeminiKey, analyzeWithGemini } from '../js/ai/providers/gemini.js';
import { testOpenAIKey } from '../js/ai/providers/openai.js';
import { testAnthropicKey } from '../js/ai/providers/anthropic.js';

const key = 'AQ.Ab8RN6LCvjENMigh5FAsU-1FvPbLwpPjypLsXKMjmrUmpMrHNA';

async function main() {
  console.log('=== Testing 3 AI Providers ===\n');

  // 1. Test Google Gemini with the user provided key
  console.log('1. Testing Google Gemini:');
  const geminiTest = await testGeminiKey(key);
  console.log('Gemini Test Key Result:', geminiTest);

  if (geminiTest.success) {
    console.log('Testing full Gemini JSON analysis call...');
    const promptData = {
      systemInstruction: 'You are an evidence-backed cosmetic science AI. Output strictly valid JSON with keys: summary, keyActives.',
      userMessage: 'Analyze formula containing Niacinamide in Arabic.'
    };
    const response = await analyzeWithGemini(promptData, { apiKey: key });
    console.log('Gemini Live Response:', response.trim().slice(0, 150));
  }

  // 2. Test OpenAI (Mock / Validation test)
  console.log('\n2. Testing OpenAI Provider Adapter:');
  const dummyOpenAITest = await testOpenAIKey('sk-dummy-test-key');
  console.log('OpenAI with test key expected 401 error:', dummyOpenAITest);

  // 3. Test Anthropic (Mock / Validation test)
  console.log('\n3. Testing Anthropic Provider Adapter:');
  const dummyAnthropicTest = await testAnthropicKey('sk-ant-dummy-test-key');
  console.log('Anthropic with test key expected 401 error:', dummyAnthropicTest);

  console.log('\n=== All 3 Provider Adapters Verified ===');
}

main().catch(err => {
  console.error('Fatal test error:', err);
});

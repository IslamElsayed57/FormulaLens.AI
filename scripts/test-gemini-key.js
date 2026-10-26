import { testGeminiKey, analyzeWithGemini } from '../js/ai/providers/gemini.js';

const key = 'AQ.Ab8RN6LCvjENMigh5FAsU-1FvPbLwpPjypLsXKMjmrUmpMrHNA';

async function run() {
  console.log('Testing testGeminiKey with default model...');
  const res = await testGeminiKey(key, 'gemini-3.5-flash');
  console.log('gemini-3.5-flash result:', res);

  const res2 = await testGeminiKey(key, 'gemini-3-flash-preview');
  console.log('gemini-3-flash-preview result:', res2);
}

run();

const key = 'AQ.Ab8RN6LCvjENMigh5FAsU-1FvPbLwpPjypLsXKMjmrUmpMrHNA';
const models = [
  'gemini-2.5-pro',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
  'gemini-3-flash-preview',
  'gemini-flash-latest',
  'gemini-pro-latest',
  'gemma-4-31b-it',
  'gemma-4-26b-a4b-it'
];

async function check() {
  console.log('Testing models with key...');
  for (const m of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${key}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
        })
      });
      const data = await res.json();
      if (res.ok) {
        console.log('[WORKS!]', m, '=>', data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()?.slice(0, 40));
      } else {
        console.log('[ERR]', m, res.status, data.error?.message?.slice(0, 80));
      }
    } catch (e) {
      console.log('[NET_ERR]', m, e.message);
    }
  }
}

check();

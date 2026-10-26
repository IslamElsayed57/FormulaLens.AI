/**
 * FormulaLens AI — OpenAI Provider Adapter
 * Directly calls OpenAI Chat Completions API with response_format json_object
 * Supports user-provided API key stored in localStorage
 */

const OPENAI_MODELS = {
  'gpt-4o-mini': 'gpt-4o-mini',
  'gpt-4o': 'gpt-4o',
};

const DEFAULT_MODEL = 'gpt-4o-mini';
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

/**
 * Send an analysis request to OpenAI
 * @param {Object} promptData - { systemInstruction, userMessage }
 * @param {Object} options - { apiKey, model, signal }
 * @returns {Promise<string>} raw JSON string from OpenAI
 */
export async function analyzeWithOpenAI(promptData, options = {}) {
  const apiKey = options.apiKey || localStorage.getItem('fl_api_openai');
  if (!apiKey) {
    throw new Error('OpenAI API key is missing. Please set it in Settings.');
  }

  const model = options.model || localStorage.getItem('fl_model_openai') || DEFAULT_MODEL;

  const requestBody = {
    model: model,
    messages: [
      {
        role: 'system',
        content: promptData.systemInstruction,
      },
      {
        role: 'user',
        content: promptData.userMessage,
      },
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' },
  };

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify(requestBody),
    signal: options.signal,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody?.error?.message || `HTTP ${response.status} ${response.statusText}`;
    throw new Error(`OpenAI API error: ${message}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error('Empty response received from OpenAI API');
  }

  return text;
}

/**
 * Test connectivity and API key validity
 */
export async function testOpenAIKey(apiKey, model = DEFAULT_MODEL) {
  try {
    const testBody = {
      model: model,
      messages: [{ role: 'user', content: 'Respond with JSON: {"status":"ok"}' }],
      response_format: { type: 'json_object' },
      max_tokens: 15,
    };
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify(testBody),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err?.error?.message || `HTTP ${res.status}` };
    }
    return { success: true, message: 'OpenAI connected successfully' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export { OPENAI_MODELS, DEFAULT_MODEL as DEFAULT_OPENAI_MODEL };

/**
 * FormulaLens AI — Anthropic Claude Provider Adapter
 * Directly calls Anthropic Messages API
 * Supports user-provided API key stored in localStorage
 */

const ANTHROPIC_MODELS = {
  'claude-3-5-haiku-20241022': 'claude-3-5-haiku-20241022',
  'claude-3-5-sonnet-20241022': 'claude-3-5-sonnet-20241022',
};

const DEFAULT_MODEL = 'claude-3-5-haiku-20241022';
const API_ENDPOINT = 'https://api.anthropic.com/v1/messages';

/**
 * Send an analysis request to Anthropic Claude
 * @param {Object} promptData - { systemInstruction, userMessage }
 * @param {Object} options - { apiKey, model, signal }
 * @returns {Promise<string>} raw JSON text from Claude
 */
export async function analyzeWithAnthropic(promptData, options = {}) {
  const apiKey = options.apiKey || localStorage.getItem('fl_api_anthropic');
  if (!apiKey) {
    throw new Error('Anthropic Claude API key is missing. Please set it in Settings.');
  }

  const model = options.model || localStorage.getItem('fl_model_anthropic') || DEFAULT_MODEL;

  const requestBody = {
    model: model,
    max_tokens: 4096,
    temperature: 0.1,
    system: promptData.systemInstruction,
    messages: [
      {
        role: 'user',
        content: promptData.userMessage,
      },
    ],
    tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 5 }],
  };

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey.trim(),
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(requestBody),
    signal: options.signal,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message = errorBody?.error?.message || `HTTP ${response.status} ${response.statusText}`;
    throw new Error(`Anthropic API error: ${message}`);
  }

  const data = await response.json();
  const text = data?.content?.find(block => block.type === 'text')?.text;

  if (!text) {
    throw new Error('Empty response received from Anthropic API');
  }

  const webSources = (data.content || []).filter(block => block.type === 'web_search_tool_result')
    .flatMap(block => block.content || []).map(source => ({
      title: source.title || 'Web source', url: source.url || '',
    })).filter(source => /^https:\/\//i.test(source.url));
  return { text, webSources };
}

/**
 * Test connectivity and API key validity
 */
export async function testAnthropicKey(apiKey, model = DEFAULT_MODEL) {
  try {
    const testBody = {
      model: model,
      max_tokens: 20,
      messages: [{ role: 'user', content: 'Respond with JSON: {"status":"ok"}' }],
    };
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify(testBody),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err?.error?.message || `HTTP ${res.status}` };
    }
    return { success: true, message: 'Anthropic Claude connected successfully' };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export { ANTHROPIC_MODELS, DEFAULT_MODEL as DEFAULT_ANTHROPIC_MODEL };

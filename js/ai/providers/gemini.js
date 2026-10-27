/**
 * FormulaLens AI — Google Gemini Provider Adapter
 * Directly calls Google Generative AI API (Gemini 3.5 Flash / 3.0 / 2.5 / 1.5)
 * Supports user-provided API key stored in localStorage
 */

const GEMINI_MODELS = {
  'gemini-3.8-flash': 'gemini-3.8-flash',
  'gemini-3.6-flash': 'gemini-3.6-flash',
  'gemini-3.5-flash-lite': 'gemini-3.5-flash-lite',
  'gemini-3-flash-preview': 'gemini-3-flash-preview',
  'gemini-2.5-flash': 'gemini-2.5-flash',
  'gemini-2.5-flash-lite': 'gemini-2.5-flash-lite',
};

const DEFAULT_MODEL = 'gemini-3.8-flash';
const CANDIDATE_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
  'gemini-3-flash-preview',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
];

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Send an analysis request to Google Gemini with automatic model fallback
 * @param {Object} promptData - { systemInstruction, userMessage }
 * @param {Object} options - { apiKey, model, signal }
 * @returns {Promise<string>} raw parsed JSON from Gemini
 */
export async function analyzeWithGemini(promptData, options = {}) {
  const apiKey = (options.apiKey || (typeof localStorage !== 'undefined' ? localStorage.getItem('fl_api_gemini') : '') || '').trim();
  if (!apiKey) {
    throw new Error('Google Gemini API key is missing. Please set it in Settings.');
  }

  const preferredModel = options.model || (typeof localStorage !== 'undefined' ? localStorage.getItem('fl_model_gemini') : null) || DEFAULT_MODEL;
  const listedModels = await listModelsSupportingGenerateContent(apiKey, options.signal);
  const availableModels = listedModels.length ? listedModels : CANDIDATE_MODELS;
  const modelsToTry = [
    ...(availableModels.includes(preferredModel) ? [preferredModel] : []),
    ...CANDIDATE_MODELS.filter(model => availableModels.includes(model) && model !== preferredModel),
    ...availableModels.filter(model => !CANDIDATE_MODELS.includes(model) && model !== preferredModel),
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const endpoint = `${API_BASE}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [
              { text: promptData.userMessage }
            ]
          }
        ],
        systemInstruction: {
          parts: [
            { text: promptData.systemInstruction }
          ]
        },
        generationConfig: {
          temperature: 0.1,
          topP: 0.95,
        },
        tools: [{ google_search: {} }],
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: options.signal,
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        const message = errorBody?.error?.message || `HTTP ${response.status} ${response.statusText}`;

        // If model not found, deprecated, or temporarily unavailable (503 / 429), try next candidate
        if (isRetryableModelError(response.status, message)) {
          lastError = new Error(message);
          continue;
        }
        throw new Error(`Gemini API error: ${message}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts
        ?.filter(part => typeof part.text === 'string' && !part.thought)
        .map(part => part.text).join('\n').trim();

      if (!text) {
        throw new Error('Empty response received from Gemini API');
      }

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('fl_model_gemini', model);
      }

      return { text, webSources: extractGroundingSources(data) };
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to connect to Google Gemini API');
}

async function listModelsSupportingGenerateContent(apiKey, signal) {
  try {
    const response = await fetch(`${API_BASE}?key=${encodeURIComponent(apiKey)}`, { signal });
    if (!response.ok) return [];
    const data = await response.json();
    return (data.models || [])
      .filter(model => model.supportedGenerationMethods?.includes('generateContent'))
      .map(model => String(model.name || '').replace(/^models\//, ''))
      .filter(Boolean);
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    return [];
  }
}

function isRetryableModelError(status, message = '') {
  const text = message.toLowerCase();
  return status === 404 || status === 429 || status === 503
    || text.includes('not found') || text.includes('high demand')
    || text.includes('no longer available') || text.includes('not supported')
    || text.includes('google_search') || text.includes('search grounding')
    || text.includes('tool is not supported');
}

function extractGroundingSources(data) {
  const metadata = data?.candidates?.[0]?.groundingMetadata;
  const chunks = metadata?.groundingChunks || [];
  const supports = metadata?.groundingSupports || [];
  return chunks.map((chunk, index) => {
    const source = chunk.web || chunk.retrievedContext || {};
    const snippets = supports.filter(item => item.groundingChunkIndices?.includes(index))
      .map(item => item.segment?.text).filter(Boolean);
    return { title: source.title || 'Web source', url: source.uri || source.url || '', snippets };
  }).filter(source => /^https:\/\//i.test(source.url));
}

/**
 * Test connectivity and API key validity with candidate model fallback
 */
export async function testGeminiKey(apiKey, preferredModel = DEFAULT_MODEL) {
  const cleanKey = (apiKey || '').trim();
  if (!cleanKey) {
    return { success: false, error: 'API key is empty' };
  }

  const storedModel = typeof localStorage !== 'undefined' ? localStorage.getItem('fl_model_gemini') : null;
  const initialModel = preferredModel || storedModel || DEFAULT_MODEL;
  const listedModels = await listModelsSupportingGenerateContent(cleanKey);
  const availableModels = listedModels.length ? listedModels : CANDIDATE_MODELS;
  const modelsToTry = [
    ...(availableModels.includes(initialModel) ? [initialModel] : []),
    ...CANDIDATE_MODELS.filter(model => availableModels.includes(model) && model !== initialModel),
    ...availableModels.filter(model => !CANDIDATE_MODELS.includes(model) && model !== initialModel),
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const endpoint = `${API_BASE}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(cleanKey)}`;
      const testBody = {
        contents: [{ role: 'user', parts: [{ text: 'Respond with JSON: {"status":"ok"}' }] }],
        tools: [{ google_search: {} }],
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testBody),
      });

      if (res.ok) {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('fl_model_gemini', model);
        }
        return {
          success: true,
          message: `Google Gemini (${model}) connected successfully`,
          detectedModel: model
        };
      }

      const err = await res.json().catch(() => ({}));
      const message = err?.error?.message || `HTTP ${res.status}`;

      if (isRetryableModelError(res.status, message)) {
        lastError = message;
        continue;
      }

      return { success: false, error: message };
    } catch (e) {
      lastError = e.message;
    }
  }

  return { success: false, error: lastError || 'Could not find a supported Gemini model for this API key' };
}

export { GEMINI_MODELS, DEFAULT_MODEL as DEFAULT_GEMINI_MODEL };

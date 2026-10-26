/**
 * FormulaLens AI — Google Gemini Provider Adapter
 * Directly calls Google Generative AI API (Gemini 3.5 Flash / 3.0 / 2.5 / 1.5)
 * Supports user-provided API key stored in localStorage
 */

const GEMINI_MODELS = {
  'gemini-3.5-flash': 'gemini-3.5-flash',
  'gemini-3-flash-preview': 'gemini-3-flash-preview',
  'gemini-3.8-flash': 'gemini-3.8-flash',
  'gemini-2.5-flash': 'gemini-2.5-flash',
  'gemini-1.5-flash': 'gemini-1.5-flash',
  'gemini-1.5-pro': 'gemini-1.5-pro',
};

const DEFAULT_MODEL = 'gemini-3.5-flash';
const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3-flash-preview',
  'gemini-3.8-flash',
  'gemini-2.5-flash',
  'gemini-1.5-flash',
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
  const modelsToTry = [preferredModel, ...CANDIDATE_MODELS.filter(m => m !== preferredModel)];

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
          responseMimeType: 'application/json',
        }
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
        if (response.status === 404 || response.status === 503 || response.status === 429 || message.includes('not found') || message.includes('high demand') || message.includes('no longer available')) {
          lastError = new Error(message);
          continue;
        }
        throw new Error(`Gemini API error: ${message}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('Empty response received from Gemini API');
      }

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('fl_model_gemini', model);
      }

      return text;
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      lastError = err;
    }
  }

  throw lastError || new Error('Failed to connect to Google Gemini API');
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
  const modelsToTry = [initialModel, ...CANDIDATE_MODELS.filter(m => m !== initialModel)];

  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const endpoint = `${API_BASE}/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(cleanKey)}`;
      const testBody = {
        contents: [{ role: 'user', parts: [{ text: 'Respond with JSON: {"status":"ok"}' }] }],
        generationConfig: { responseMimeType: 'application/json' }
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

      if (res.status === 404 || res.status === 503 || res.status === 429 || message.includes('not found') || message.includes('high demand') || message.includes('no longer available')) {
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

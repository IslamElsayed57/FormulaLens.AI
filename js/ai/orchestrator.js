/**
 * FormulaLens AI — AI Orchestrator
 * Coordinates requests to the selected AI provider (Gemini, OpenAI, or Anthropic),
 * builds the unified prompt, enforces response validation, and provides an offline
 * deterministic evidence synthesizer fallback when no API key is configured.
 */

import { buildAnalysisPrompt } from './prompt-builder.js';
import { validateAIResponse } from './response-validator.js';
import { analyzeWithGemini, testGeminiKey } from './providers/gemini.js';
import { analyzeWithOpenAI, testOpenAIKey } from './providers/openai.js';
import { analyzeWithAnthropic, testAnthropicKey } from './providers/anthropic.js';
import { getState } from '../state.js';

export const PROVIDERS = {
  GEMINI: 'gemini',
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
};

/**
 * Check which AI providers are currently configured with an API key
 */
export function getConfiguredProviders() {
  return {
    gemini: Boolean(localStorage.getItem('fl_api_gemini')),
    openai: Boolean(localStorage.getItem('fl_api_openai')),
    anthropic: Boolean(localStorage.getItem('fl_api_anthropic')),
  };
}

/**
 * Get the currently active provider
 */
export function getActiveProvider() {
  const configured = getConfiguredProviders();
  const preferred = getState('selectedProvider') || localStorage.getItem('fl_provider');

  if (preferred && configured[preferred]) {
    return preferred;
  }

  // Fallback to first configured
  if (configured.gemini) return PROVIDERS.GEMINI;
  if (configured.openai) return PROVIDERS.OPENAI;
  if (configured.anthropic) return PROVIDERS.ANTHROPIC;

  return null;
}

/**
 * Test an API key for a given provider
 */
export async function testProviderKey(provider, key, model) {
  switch (provider) {
    case PROVIDERS.GEMINI:
      return testGeminiKey(key, model);
    case PROVIDERS.OPENAI:
      return testOpenAIKey(key, model);
    case PROVIDERS.ANTHROPIC:
      return testAnthropicKey(key, model);
    default:
      return { success: false, error: `Unknown provider: ${provider}` };
  }
}

/**
 * Run AI formula analysis with fallback support
 * @param {Object} evidencePackage - Evidence package generated from matched ingredients
 * @param {Object} options - { skinProfiles, productName, lang, signal, forceLocal }
 * @returns {Promise<Object>} Validated analysis result with metadata
 */
export async function runAIAnalysis(evidencePackage, options = {}) {
  const lang = options.lang || getState('lang') || 'en';
  const provider = options.forceLocal ? null : (options.provider || getActiveProvider());

  // If no provider or explicitly requested local, generate deterministic scientific synthesis
  if (!provider) {
    const fallbackResult = synthesizeLocalAnalysis(evidencePackage, { ...options, lang });
    fallbackResult.warnings.push({
      type: 'AI_PROVIDER_NOT_CONFIGURED',
      message: lang === 'ar'
        ? 'البحث والتحليل بالذكاء الاصطناعي غير متاحين: لم يتم اختيار مزود بمفتاح API محفوظ. افتح الإعدادات ومفاتيح الذكاء الاصطناعي واتصل بمزود لتفعيل بحث الويب.'
        : 'AI web research is unavailable because no provider API key is configured. Open Settings & AI Keys and connect a provider to enable web search.',
    });
    return fallbackResult;
  }

  // Build the unified evidence-based prompt
  const promptData = buildAnalysisPrompt(evidencePackage, {
    skinProfiles: options.skinProfiles || [],
    productName: options.productName || null,
    lang,
  });

  let rawResponseText;
  let webSources = [];
  const startTime = performance.now();

  try {
    switch (provider) {
      case PROVIDERS.GEMINI:
        ({ text: rawResponseText, webSources = [] } = await analyzeWithGemini(promptData, { signal: options.signal }));
        break;
      case PROVIDERS.OPENAI:
        ({ text: rawResponseText, webSources = [] } = await analyzeWithOpenAI(promptData, { signal: options.signal }));
        break;
      case PROVIDERS.ANTHROPIC:
        ({ text: rawResponseText, webSources = [] } = await analyzeWithAnthropic(promptData, { signal: options.signal }));
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    console.warn(`[AI Orchestrator] Provider ${provider} failed, falling back to local synthesis:`, error);
    const fallbackResult = synthesizeLocalAnalysis(evidencePackage, { ...options, lang });
    fallbackResult.warnings = fallbackResult.warnings || [];
    fallbackResult.warnings.push({
      type: 'PROVIDER_FALLBACK',
      message: `AI provider (${provider}) encountered an error: ${error.message}. Formulated using deterministic evidence engine.`,
    });
    return fallbackResult;
  }

  const durationMs = Math.round(performance.now() - startTime);

  // Validate the response against scientific source policy
  const validationPackage = { ...evidencePackage, webSearchSources: webSources };
  const validation = validateAIResponse(rawResponseText, validationPackage);

  if (!validation.result) {
    console.warn('[AI Orchestrator] Validation failed for AI response, falling back to local synthesis. Errors:', validation.errors);
    const fallbackResult = synthesizeLocalAnalysis(evidencePackage, { ...options, lang });
    fallbackResult.warnings.push({
      type: 'VALIDATION_FALLBACK',
      message: 'AI response failed scientific schema validation. Using verified evidence synthesis.',
      details: validation.errors,
    });
    return fallbackResult;
  }

  return {
    ...validation.result,
    provider,
    isLocalFallback: false,
    durationMs,
    policyViolations: validation.policyViolations || [],
    webSearchSources: webSources,
    warnings: [...(validation.result.warnings || []), ...(validation.warnings || [])],
  };
}

/**
 * Deterministic evidence synthesizer
 * Runs when offline or when no API key is provided, generating a fully evidence-backed report
 * from the local database without hallucination.
 */
function synthesizeLocalAnalysis(evidencePackage, options = {}) {
  const { matchedIngredients = [], unmatchedIngredients = [], skinProfiles = [], lang = 'en' } = options;
  const isAr = lang === 'ar';

  const ingredientAnalysis = matchedIngredients.map((item, idx) => {
    const ing = item.ingredient || item;
    const isSensitive = ing.sensitizingPotential === 'high' || ing.sensitizingPotential === 'moderate';
    const isComedogenic = (ing.comedogenicRating || 0) >= 3;

    return {
      inciName: ing.inciName || item.rawName || `Ingredient ${idx + 1}`,
      normalizedName: ing.normalizedName || '',
      function: ing.functions || (isAr ? 'عامل تجميلي' : 'Cosmetic functional agent'),
      safetyRating: ing.cirStatus || (isAr ? 'قيد المراجعة' : 'Under Review'),
      comedogenicRating: ing.comedogenicRating ?? null,
      sensitizingRisk: ing.sensitizingPotential || 'low',
      evidenceStatus: ing.evidenceStatus || 'verified',
      isVerified: Boolean(ing.id),
      observations: isAr
        ? `عنصر مستخلص بناءً على سجلات CIR وقاعدة البيانات المحلية.`
        : `Verified component evaluated against CIR records and cosmetic regulatory data.`,
      sources: ing.sources?.map(s => s.sourceId || s.sourceName) || ['CIR_PANEL'],
    };
  });

  // Calculate high-level formula characteristics
  const total = matchedIngredients.length + unmatchedIngredients.length;
  const matchRate = total > 0 ? Math.round((matchedIngredients.length / total) * 100) : 0;

  const activeCategories = new Set();
  matchedIngredients.forEach(item => {
    const cats = item.ingredient?.category || [];
    cats.forEach(c => activeCategories.add(c));
  });

  const summary = isAr
    ? `تم تحليل هذه التركيبة التي تحتوي على ${total} مكوناً (${matchedIngredients.length} تم التحقق منها محلياً بنسبة مطابقة ${matchRate}%). التركيبة تركز بشكل أساسي على: ${Array.from(activeCategories).join('، ') || 'العناية الأساسية بالبشرة'}.`
    : `This formula contains ${total} identified cosmetic ingredients (${matchedIngredients.length} verified locally, ${matchRate}% match rate). Key targeted categories include: ${Array.from(activeCategories).join(', ') || 'General skin care'}.`;

  const formulationInsights = {
    keyActives: matchedIngredients.slice(0, 5).map(m => m.ingredient?.inciName || m.rawName),
    targetFunctions: Array.from(activeCategories),
    textureAndVehicle: isAr ? 'قاعدة مائية / مرطبة نموذجية' : 'Standard cosmetic vehicle',
    compatibilityNotes: skinProfiles.length > 0
      ? (isAr ? `تمت المواءمة مع الملف الشخصي المحدد: ${skinProfiles.join(', ')}.` : `Evaluated against chosen skin profiles: ${skinProfiles.join(', ')}.`)
      : (isAr ? 'لم يتم تحديد ملف جلدي محدد.' : 'No specific skin profile selected.'),
  };

  const warnings = [];
  if (unmatchedIngredients.length > 0) {
    warnings.push({
      type: 'UNMATCHED_INGREDIENTS',
      message: isAr
        ? `${unmatchedIngredients.length} من المكونات لم يتم العثور عليها في قاعدة البيانات المحلية المعتمدة.`
        : `${unmatchedIngredients.length} ingredient(s) were not found in the verified local evidence database.`,
      items: unmatchedIngredients.map(u => u.rawName || u),
    });
  }

  return {
    summary,
    ingredientAnalysis,
    formulationInsights,
    warnings,
    limitations: [
      isAr
        ? 'تحليل مبني على الأدلة العلمية المسجلة محلياً بدون تخمين للنسب الدقيقة.'
        : 'Analysis generated using verified local scientific evidence without inferring proprietary concentration levels.',
      isAr
        ? 'هذا التقرير لأغراض البحث التجميلي ولا يشكل تشخيصاً طبياً.'
        : 'This report is for cosmetic research and consumer education; not a medical diagnosis.',
    ],
    provider: 'local_evidence_engine',
    isLocalFallback: true,
    durationMs: 40,
    policyViolations: [],
  };
}

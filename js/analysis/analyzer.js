/**
 * FormulaLens AI — 5-Stage Scientific Analysis Engine
 * Faithfully follows the multi-stage analysis pipeline:
 * 1. Reading & extracting ingredient text
 * 2. Matching ingredients against local IndexedDB
 * 3. Retrieving and validating available supporting evidence
 * 4. Requesting and validating AI analysis
 * 5. Presenting completed results
 */

import { parseIngredients } from '../ocr/ocr-engine.js';
import {
  findIngredientByName,
  findSynonym,
  getRecord,
  searchIngredients,
  putRecord,
  getAllRecords,
} from '../database/indexeddb.js';
import { calculateFormulaScore } from './safety-scoring.js';
import { runAIAnalysis } from '../ai/orchestrator.js';
import { setState, getState } from '../state.js';

export const ANALYSIS_STAGES = {
  IDLE: 'idle',
  READING: 'reading',
  MATCHING: 'matching',
  EVIDENCE: 'evidence',
  AI: 'ai',
  PRESENTING: 'presenting',
  DONE: 'done',
  ERROR: 'error',
};

/**
 * Execute the 5-stage formula analysis
 * @param {string} rawText - Raw ingredient text or OCR output
 * @param {Object} options - { productName, skinProfiles, signal, onStageChange, forceLocal }
 * @returns {Promise<Object>} Complete analysis payload
 */
export async function executeFormulaAnalysis(rawText, options = {}) {
  const {
    productName = null,
    skinProfiles = getState('skinProfiles') || [],
    signal = null,
    onStageChange = null,
    forceLocal = false,
  } = options;

  const notifyStage = (stage, progress, details = {}) => {
    setState({ analysisStage: stage, analysisProgress: progress });
    if (onStageChange) onStageChange(stage, progress, details);
  };

  try {
    // ── STAGE 1: Reading and extracting ingredient text ────────────
    notifyStage(ANALYSIS_STAGES.READING, 0.15, { label: 'Reading and parsing cosmetic INCI text' });
    if (signal?.aborted) throw new Error('Analysis cancelled by user');

    const parsedTokens = parseIngredients(rawText);
    if (!parsedTokens || parsedTokens.length === 0) {
      throw new Error('No valid cosmetic ingredients could be detected in the provided text.');
    }

    // ── STAGE 2: Matching against IndexedDB ────────────────────────
    notifyStage(ANALYSIS_STAGES.MATCHING, 0.35, {
      label: `Matching ${parsedTokens.length} ingredient tokens against local database`,
      count: parsedTokens.length,
    });
    if (signal?.aborted) throw new Error('Analysis cancelled by user');

    const matchedIngredients = [];
    const unmatchedIngredients = [];

    // Pre-fetch all ingredients once for sub-millisecond in-memory fuzzy/substring matching
    let allIngredientsList = [];
    try {
      allIngredientsList = await getAllRecords('ingredients');
    } catch (e) {
      allIngredientsList = [];
    }

    function computeLevenshtein(a, b) {
      const m = a.length, n = b.length;
      const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      for (let i = 0; i <= m; i++) d[i][0] = i;
      for (let j = 0; j <= n; j++) d[0][j] = j;
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
        }
      }
      return d[m][n];
    }

    for (const token of parsedTokens) {
      if (signal?.aborted) throw new Error('Analysis cancelled by user');

      const norm = token.cleanName.toLowerCase().trim();
      let matchedRecord = await findIngredientByName(norm);

      // 1. Synonym search
      if (!matchedRecord) {
        const synRecord = await findSynonym(norm);
        if (synRecord && synRecord.ingredientId) {
          matchedRecord = await getRecord('ingredients', synRecord.ingredientId);
        }
      }

      // 2. Substring & Token containment search (e.g. "avene aqua" contains "aqua", "thermal spring water" contains "water")
      if (!matchedRecord && allIngredientsList.length > 0) {
        matchedRecord = allIngredientsList.find(ing => {
          if (ing.normalizedName && ing.normalizedName.length >= 4 && norm.includes(ing.normalizedName)) return true;
          if (ing.synonyms && ing.synonyms.some(s => s.length >= 4 && norm.includes(s.toLowerCase()))) return true;
          return false;
        }) || null;
      }

      // 3. Partial/fuzzy search as tertiary fallback
      if (!matchedRecord && norm.length >= 4) {
        const candidates = await searchIngredients(norm, { limit: 1 });
        if (candidates.length > 0) {
          matchedRecord = candidates[0];
        }
      }

      // 4. Fuzzy Levenshtein for small OCR typos (distance <= 2 for words >= 5 chars, e.g. "glycern" -> "glycerin")
      if (!matchedRecord && norm.length >= 5 && allIngredientsList.length > 0) {
        matchedRecord = allIngredientsList.find(ing => {
          if (Math.abs((ing.normalizedName || '').length - norm.length) <= 2) {
            return computeLevenshtein(ing.normalizedName, norm) <= 2;
          }
          return false;
        }) || null;
      }

      if (matchedRecord) {
        matchedIngredients.push({
          rawName: token.rawName,
          cleanName: token.cleanName,
          concentrationHint: token.concentrationHint,
          ingredient: matchedRecord,
        });
      } else {
        unmatchedIngredients.push({
          rawName: token.rawName,
          cleanName: token.cleanName,
          concentrationHint: token.concentrationHint,
        });
      }
    }

    // ── STAGE 3: Retrieving & validating supporting evidence ──────
    notifyStage(ANALYSIS_STAGES.EVIDENCE, 0.60, {
      label: 'Compiling evidence packages, CIR safety profiles, and skin compatibility',
      matchedCount: matchedIngredients.length,
      unmatchedCount: unmatchedIngredients.length,
    });
    if (signal?.aborted) throw new Error('Analysis cancelled by user');

    const safetyScoreData = calculateFormulaScore(matchedIngredients, unmatchedIngredients, skinProfiles);

    const evidencePackage = {
      productName: productName || 'Cosmetic Formula',
      totalDetected: parsedTokens.length,
      matchedIngredients: matchedIngredients.map(m => ({
        id: m.ingredient.id,
        inciName: m.ingredient.inciName,
        normalizedName: m.ingredient.normalizedName,
        category: m.ingredient.category,
        functions: m.ingredient.functions,
        cirStatus: m.ingredient.cirStatus,
        comedogenicRating: m.ingredient.comedogenicRating,
        sensitizingPotential: m.ingredient.sensitizingPotential,
        evidenceStatus: m.ingredient.evidenceStatus,
        suitability: m.ingredient.suitability,
        sources: m.ingredient.sources,
        concentrationHint: m.concentrationHint,
      })),
      unmatchedIngredients: unmatchedIngredients.map(u => ({
        rawName: u.rawName,
        concentrationHint: u.concentrationHint,
      })),
      skinProfiles,
      safetyScoreData,
    };

    // ── STAGE 4: Requesting & validating AI analysis ───────────────
    notifyStage(ANALYSIS_STAGES.AI, 0.80, {
      label: 'Synthesizing evidence-backed formula intelligence',
    });
    if (signal?.aborted) throw new Error('Analysis cancelled by user');

    const aiResult = await runAIAnalysis(evidencePackage, {
      productName,
      skinProfiles,
      signal,
      forceLocal,
      lang: getState('lang') || 'en',
    });

    // ── STAGE 5: Presenting completed results ──────────────────────
    notifyStage(ANALYSIS_STAGES.PRESENTING, 0.95, { label: 'Formatting Bento Grid results' });

    const finalReport = {
      id: `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      productName: productName || (getState('lang') === 'ar' ? 'تركيبة تجميلية' : 'Cosmetic Formula'),
      rawText,
      matchedIngredients,
      unmatchedIngredients,
      totalCount: parsedTokens.length,
      matchPercentage: Math.round((matchedIngredients.length / parsedTokens.length) * 100),
      safetyScore: safetyScoreData,
      aiInsights: aiResult,
      skinProfiles,
    };

    // Store in history
    try {
      await putRecord('analysis_history', {
        id: finalReport.id,
        createdAt: finalReport.createdAt,
        productName: finalReport.productName,
        provider: aiResult.provider,
        score: safetyScoreData.score,
        grade: safetyScoreData.grade,
        matchPercentage: finalReport.matchPercentage,
        totalIngredients: finalReport.totalCount,
        reportData: finalReport,
      });
    } catch (dbErr) {
      console.warn('[Analyzer] Could not save to history store:', dbErr);
    }

    notifyStage(ANALYSIS_STAGES.DONE, 1.0, { label: 'Analysis complete', report: finalReport });
    setState({ currentAnalysis: finalReport });

    return finalReport;
  } catch (err) {
    notifyStage(ANALYSIS_STAGES.ERROR, 0, { error: err.message });
    throw err;
  }
}

/**
 * FormulaLens AI — Automated Verification Test Suite
 * Tests INCI parsing, safety scoring, comparison, prompt construction, and dataset validity
 */

import fs from 'fs';
import path from 'path';
import { parseIngredients } from '../js/ocr/ocr-engine.js';
import { calculateFormulaScore } from '../js/analysis/safety-scoring.js';
import { compareProducts } from '../js/analysis/comparison.js';
import { buildAnalysisPrompt } from '../js/ai/prompt-builder.js';
import { validateAIResponse } from '../js/ai/response-validator.js';
import { filterRelevantArticles, hasIngredientMention, limitResearchResults } from '../js/research/literature-search.js';
import { analyzeWithGemini } from '../js/ai/providers/gemini.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    failed++;
  }
}

console.log('=== FormulaLens AI Verification Test Suite ===\n');

// 1. DATASET VALIDATION
console.log('1. Testing Dataset Integrity:');
const datasetPath = path.resolve('data/ingredients.json');
const manifestPath = path.resolve('data/data-manifest.json');

assert(fs.existsSync(datasetPath), 'data/ingredients.json exists');
assert(fs.existsSync(manifestPath), 'data/data-manifest.json exists');

const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

assert(Array.isArray(dataset) && dataset.length >= 100, `Dataset contains ${dataset.length} records (>= 100 required)`);
assert(manifest.totalRecords === dataset.length, `Manifest totalRecords (${manifest.totalRecords}) matches dataset length (${dataset.length})`);

const sampleIng = dataset.find(d => d.id === 'ing_niacinamide');
assert(sampleIng !== undefined, 'Found Niacinamide in dataset');
assert(sampleIng.inciName === 'Niacinamide', 'Niacinamide has correct INCI name');
assert(sampleIng.normalizedName === 'niacinamide', 'Niacinamide has lowercase normalized name');
assert(sampleIng.evidenceStatus === 'verified', 'Niacinamide evidence status is verified');

// 2. INCI PARSER TEST
console.log('\n2. Testing INCI Cosmetic Parser:');
const sampleINCI = 'Aqua (Water/Eau), Niacinamide 10%, Glycerin, Zinc PCA 1%, Phenoxyethanol, [+/- May Contain: CI 77891].';
const tokens = parseIngredients(sampleINCI);

assert(tokens.length >= 4, `Parsed ${tokens.length} ingredient tokens`);
assert(tokens.some(t => t.cleanName === 'Niacinamide'), 'Detected Niacinamide');
assert(tokens.some(t => t.cleanName === 'Glycerin'), 'Detected Glycerin');
assert(tokens.some(t => t.cleanName === 'Zinc PCA'), 'Detected Zinc PCA');
assert(tokens.some(t => t.cleanName === 'Phenoxyethanol'), 'Detected Phenoxyethanol');

// 3. SAFETY SCORING TEST
console.log('\n3. Testing Safety & Profile Compatibility Scoring:');
const mockMatched = [
  { rawName: 'Water', ingredient: dataset.find(d => d.id === 'ing_water') || { inciName: 'Water', sensitizingPotential: 'low', comedogenicRating: 0 } },
  { rawName: 'Niacinamide', ingredient: sampleIng },
  { rawName: 'Glycerin', ingredient: dataset.find(d => d.id === 'ing_glycerin') || { inciName: 'Glycerin', sensitizingPotential: 'low', comedogenicRating: 0 } },
];
const scoreRes = calculateFormulaScore(mockMatched, [], ['oily', 'sensitive']);

assert(typeof scoreRes.score === 'number', `Calculated score: ${scoreRes.score}`);
assert(scoreRes.score >= 80, 'Clean formula gets >= 80 score');
assert(scoreRes.grade === 'A' || scoreRes.grade === 'B', `Assigned grade: ${scoreRes.grade}`);

// 4. COMPARISON TEST
console.log('\n4. Testing Multi-Product Comparison:');
const prodA = {
  name: 'Product A',
  matchedIngredients: [mockMatched[0], mockMatched[1]],
};
const prodB = {
  name: 'Product B',
  matchedIngredients: [mockMatched[0], mockMatched[2]],
};

const compRes = compareProducts([prodA, prodB], ['sensitive']);
assert(compRes.commonCount === 1, `Identified 1 common ingredient (${compRes.commonIngredients[0]?.name})`);
assert(compRes.bestSuitability !== null, `Determined best suitability winner: ${compRes.bestSuitability.productName}`);

// 3-Product Comparison Test
const prodC = {
  name: 'Product C',
  matchedIngredients: [mockMatched[0], mockMatched[1], mockMatched[2]],
};
const compRes3 = compareProducts([prodA, prodB, prodC], ['sensitive']);
assert(compRes3.products.length === 3, 'Evaluated 3 products simultaneously');
assert(compRes3.commonCount === 1, `Found 1 common backbone ingredient across all 3 products`);
assert(compRes3.bestSuitability !== null, `Determined 3-way winner: ${compRes3.bestSuitability.productName}`);
assert(compRes3.uniquePerProduct.length === 3, 'Calculated exclusive ingredients for each of the 3 products');

// 5. PROMPT & VALIDATION TEST
console.log('\n5. Testing Shared Prompt Builder & Validator:');
const relevantAveneStudy = {
  sourceId: 'europe_pmc',
  title: 'Effect of AVENE thermal spring water on skin barrier properties',
  abstract: '',
};
const unrelatedTopicalStudy = {
  sourceId: 'europe_pmc',
  title: 'Mechanistic Review of Topical Therapies Targeting Dermal Fibroblasts',
  abstract: 'A general review of skin aging and rejuvenation.',
};
const relevantPegStudy = {
  sourceId: 'pubmed',
  title: 'Allergic contact dermatitis caused by PEG-22/Dodecyl Glycol Copolymer',
  abstract: '',
};
assert(hasIngredientMention(relevantAveneStudy, 'AVENE THERMAL SPRING'), 'Matches an ingredient explicitly named in a study title');
assert(!hasIngredientMention(unrelatedTopicalStudy, 'AVENE THERMAL SPRING'), 'Rejects topical studies that do not name the ingredient');
assert(hasIngredientMention(relevantPegStudy, 'PEG:22/DODECYL GLYCOL COPOLYMER'), 'Matches punctuation variants of the same ingredient name');
assert(filterRelevantArticles([relevantAveneStudy, unrelatedTopicalStudy], 'AVENE THERMAL SPRING').length === 1, 'Shows only ingredient-relevant records');
assert(!hasIngredientMention({ title: 'Water for injection quality standards' }, 'Water'), 'Rejects generic water records without cosmetic or skin context');
assert(limitResearchResults([1, 2, 3, 4].map(id => ({ sourceRecordId: `PMID:${id}` }))).length === 3, 'Caps results at three records per ingredient');

const promptObj = buildAnalysisPrompt({
  productName: 'Test Serum',
  matchedIngredients: mockMatched,
  unmatchedIngredients: [],
  skinProfiles: ['sensitive'],
});

assert(typeof promptObj.systemInstruction === 'string' && promptObj.systemInstruction.length > 50, 'System instruction constructed');
assert(typeof promptObj.userMessage === 'string' && promptObj.userMessage.length > 50, 'User message constructed');

const sampleValidAI = JSON.stringify({
  summary: 'This formula is a gentle hydrating serum.',
  ingredientAnalysis: [],
  formulationInsights: {
    keyActives: ['Niacinamide'],
    targetFunctions: ['Soothing'],
    textureAndVehicle: 'Aqueous',
    compatibilityNotes: 'Well tolerated',
  },
  warnings: [],
  limitations: ['Concentrations are not inferred.'],
});

const valRes = validateAIResponse(sampleValidAI);
assert(valRes.result !== null, 'Valid AI response parsed and validated');
assert(valRes.errors.length === 0, 'No schema errors in valid response');

const webEvidenceUrl = 'https://example.org/cosmetic-ingredient-review';
const webEvidenceResponse = {
  summary: 'Preliminary review.',
  ingredientAnalysis: [{
    name: 'Sample Extract', inciName: 'Sample Extract', matchedInDatabase: false,
    evidenceAssessment: {
      functions: [{ value: 'Skin conditioning', sourceRecordIds: [webEvidenceUrl] }],
      comedogenicity: { rating: null, note: null, sourceRecordIds: [] },
      sensitization: { level: 'unknown', note: null, sourceRecordIds: [] },
      pregnancy: { status: 'unknown', note: null, sourceRecordIds: [] },
      skinSuitability: [],
    },
  }],
  formulationInsights: [], warnings: [], limitations: [],
  evidenceReferences: [{ sourceId: null, sourceName: 'Review', sourceUrl: webEvidenceUrl, ingredient: 'Sample Extract', claim: 'Skin conditioning', evidenceCategory: 'function' }],
};
const webValidation = validateAIResponse(webEvidenceResponse, {
  unmatchedIngredients: [{ rawName: 'Sample Extract', cleanName: 'Sample Extract' }],
  literatureResearch: { byIngredient: {} }, skinProfiles: [],
  webSearchSources: [{ title: 'Review', url: webEvidenceUrl }],
});
assert(webValidation.result?.ingredientAnalysis[0]?.evidenceAssessment.functions[0]?.sourceRecordIds.includes(webEvidenceUrl), 'Accepts exact provider web-search citations in ingredient evidence assessments');
assert(webValidation.result?.evidenceReferences[0]?.sourceUrl === webEvidenceUrl, 'Keeps provider URLs only when returned by the current web search');
assert(!promptObj.systemInstruction.includes('PROVIDED EVIDENCE PACKAGE ONLY'), 'Does not restrict the model to the preloaded source package');

const originalFetch = globalThis.fetch;
const originalLocalStorage = globalThis.localStorage;
const fakeStorage = new Map([['fl_api_gemini', 'unit-test-key']]);
globalThis.localStorage = { getItem: key => fakeStorage.get(key) || null, setItem: (key, value) => fakeStorage.set(key, value) };
const geminiCalls = [];
globalThis.fetch = async (url, options = {}) => {
  geminiCalls.push({ url: String(url), options });
  if (String(url).includes('/v1beta/models?')) {
    return new Response(JSON.stringify({ models: [{ name: 'models/gemini-3.8-flash', supportedGenerationMethods: ['generateContent'] }] }), { status: 200 });
  }
  return new Response(JSON.stringify({
    candidates: [{
      content: { parts: [{ text: '{"summary":"ok"}' }] },
      groundingMetadata: { groundingChunks: [{ web: { title: 'Test source', uri: 'https://example.org/source' } }] },
    }],
  }), { status: 200 });
};
const geminiTestResult = await analyzeWithGemini({ systemInstruction: 'system', userMessage: 'search' });
assert(geminiCalls.some(call => call.url.includes('/gemini-3.8-flash:generateContent')), 'Discovers and calls an available Gemini generateContent model');
assert(geminiCalls.some(call => call.url.includes(':generateContent') && JSON.parse(call.options.body).tools?.[0]?.google_search), 'Enables Google Search grounding in the Gemini request');
assert(geminiTestResult.webSources?.[0]?.url === 'https://example.org/source', 'Extracts Gemini grounding sources from the response');
globalThis.fetch = originalFetch;
if (originalLocalStorage === undefined) delete globalThis.localStorage;
else globalThis.localStorage = originalLocalStorage;

console.log(`\n===========================================`);
console.log(`Test Results: ${passed} Passed, ${failed} Failed`);
if (failed === 0) {
  console.log('ALL VERIFICATION TESTS PASSED SUCCESSFULLY!');
} else {
  process.exit(1);
}

/**
 * FormulaLens AI — Dataset Importer
 * Imports the local ingredient dataset into IndexedDB on first run
 * Handles batch processing, progress reporting, and version checking
 */

import { getBasePath } from '../utils/i18n.js';
import {
  getDatasetMeta,
  setDatasetMeta,
  batchInsert,
  countRecords,
} from './indexeddb.js';
import { FALLBACK_MANIFEST, FALLBACK_INGREDIENTS } from '../../data/dataset-fallback.js';

const CURRENT_DATASET_VERSION = '1.0.0';
const IMPORT_FLAG_KEY = 'dataset_import_complete';
const VERSION_KEY = 'dataset_version';
const COUNT_KEY = 'ingredient_count';
const IMPORT_DATE_KEY = 'last_import_date';

/**
 * Check if the dataset needs to be imported
 */
export async function needsDatasetImport() {
  try {
    const importFlag = await getDatasetMeta(IMPORT_FLAG_KEY);
    const versionMeta = await getDatasetMeta(VERSION_KEY);
    const installedVersion = versionMeta?.value;

    if (!importFlag?.value || installedVersion !== CURRENT_DATASET_VERSION) {
      return true;
    }

    // Cross-check: count actual records
    const count = await countRecords('ingredients');
    if (count < 100) { // Minimum sanity check
      return true;
    }

    return false;
  } catch (e) {
    console.warn('[Importer] Could not check import status:', e);
    return true;
  }
}

/**
 * Load and import the ingredient dataset
 * @param {Function} onProgress - callback(current, total, stats)
 * @param {AbortSignal} signal - optional abort signal
 */
export async function importDataset({ onProgress, signal } = {}) {
  const base = getBasePath();
  let manifestData;
  let ingredientsData;

  // ── Step 1: Load manifest ────────────────────────────────
  try {
    const manifestRes = await fetch(`${base}data/data-manifest.json`);
    if (!manifestRes.ok) throw new Error(`HTTP ${manifestRes.status}`);
    manifestData = await manifestRes.json();
  } catch (e) {
    console.warn('[Importer] Fetch for manifest failed, using bundled fallback:', e.message);
    manifestData = FALLBACK_MANIFEST;
  }

  if (signal?.aborted) throw new Error('Import aborted');

  // ── Step 2: Load ingredients ─────────────────────────────
  try {
    const ingredRes = await fetch(`${base}data/ingredients.json`);
    if (!ingredRes.ok) throw new Error(`HTTP ${ingredRes.status}`);
    ingredientsData = await ingredRes.json();
  } catch (e) {
    console.warn('[Importer] Fetch for ingredients failed, using bundled fallback:', e.message);
    ingredientsData = FALLBACK_INGREDIENTS;
  }

  if (signal?.aborted) throw new Error('Import aborted');

  // ── Step 3: Validate ─────────────────────────────────────
  if (!Array.isArray(ingredientsData)) {
    throw new Error('Ingredients data is not an array');
  }

  const validRecords = ingredientsData.filter(validateIngredientRecord);
  console.log(`[Importer] ${validRecords.length} valid records out of ${ingredientsData.length}`);

  if (validRecords.length < 100) {
    throw new Error(`Too few valid ingredient records: ${validRecords.length}`);
  }

  if (signal?.aborted) throw new Error('Import aborted');

  // ── Step 4: Import ingredients ───────────────────────────
  const result = await batchInsert('ingredients', validRecords, {
    batchSize: 200,
    onProgress: (current, total, stats) => {
      if (onProgress) onProgress(current, total, { phase: 'ingredients', ...stats });
    },
  });

  if (signal?.aborted) throw new Error('Import aborted');

  // ── Step 5: Import synonyms ──────────────────────────────
  const synonymRecords = [];
  for (const ingredient of validRecords) {
    if (Array.isArray(ingredient.synonyms)) {
      for (const syn of ingredient.synonyms) {
        if (syn && typeof syn === 'string' && syn.trim()) {
          synonymRecords.push({
            ingredientId: ingredient.id,
            synonym: syn.toLowerCase().trim(),
            originalSynonym: syn.trim(),
          });
        }
      }
    }
  }

  if (synonymRecords.length > 0) {
    await batchInsert('synonyms', synonymRecords, {
      batchSize: 500,
      onProgress: (current, total, stats) => {
        if (onProgress) onProgress(current, total, { phase: 'synonyms', ...stats });
      },
    });
  }

  // ── Step 6: Mark import complete ─────────────────────────
  const importDate = new Date().toISOString();
  await setDatasetMeta(IMPORT_FLAG_KEY, true);
  await setDatasetMeta(VERSION_KEY, CURRENT_DATASET_VERSION);
  await setDatasetMeta(COUNT_KEY, result.inserted + result.skipped);
  await setDatasetMeta(IMPORT_DATE_KEY, importDate);

  return {
    version: CURRENT_DATASET_VERSION,
    totalRecords: ingredientsData.length,
    validRecords: validRecords.length,
    imported: result.inserted,
    skipped: result.skipped,
    errors: result.errors,
    synonymCount: synonymRecords.length,
    importedAt: importDate,
    manifest: manifestData,
  };
}

/**
 * Validate an ingredient record structure
 * Does not accept obviously placeholder/fabricated records
 */
function validateIngredientRecord(record) {
  if (!record || typeof record !== 'object') return false;

  // Required fields
  if (!record.id || typeof record.id !== 'string') return false;
  if (!record.inciName || typeof record.inciName !== 'string') return false;
  if (!record.normalizedName || typeof record.normalizedName !== 'string') return false;

  // Reject obviously fake records
  const name = record.inciName.toLowerCase();
  const PLACEHOLDER_PATTERNS = [
    'placeholder', 'example', 'test ingredient', 'lorem ipsum',
    'ingredient_', 'fake_', 'dummy', 'filler',
  ];
  if (PLACEHOLDER_PATTERNS.some(p => name.includes(p))) return false;

  // Evidence status must be from approved list
  const VALID_EVIDENCE_STATUSES = [
    'verified', 'partially_verified', 'unverified', 'pending_research', 'conflicting_evidence',
  ];
  if (record.evidenceStatus && !VALID_EVIDENCE_STATUSES.includes(record.evidenceStatus)) {
    return false;
  }

  // normalizedName must be lowercase
  if (record.normalizedName !== record.normalizedName.toLowerCase()) {
    return false;
  }

  return true;
}

/**
 * Get current dataset metadata for display
 */
export async function getDatasetInfo() {
  const [version, count, importDate] = await Promise.all([
    getDatasetMeta(VERSION_KEY),
    getDatasetMeta(COUNT_KEY),
    getDatasetMeta(IMPORT_DATE_KEY),
  ]);

  return {
    version: version?.value ?? null,
    count: count?.value ?? 0,
    importedAt: importDate?.value ?? null,
  };
}

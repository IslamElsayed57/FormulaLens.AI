/**
 * FormulaLens AI — AI Response Validator
 * Validates all provider responses before accepting or displaying them.
 * Shared across ALL three providers.
 */

import { EVIDENCE_STATUS } from '../research/source-registry.js';
import { enforceSourcePolicy, validateEvidenceReferences } from '../research/source-policy.js';

const MAX_SUMMARY_LENGTH = 2000;
const MAX_FIELD_LENGTH = 5000;
const MAX_RESPONSE_SIZE_BYTES = 500_000; // 500 KB

/**
 * Parse and validate a raw AI provider response
 * @param {string|object} rawResponse - Raw text or pre-parsed response
 * @param {object} evidencePackage - The evidence package sent to the provider
 * @returns {{ result, errors, warnings, policyViolations }}
 */
export function validateAIResponse(rawResponse, evidencePackage = null) {
  const errors = [];
  const warnings = [];

  // ── Step 1: Size limit ───────────────────────────────────
  const responseStr = typeof rawResponse === 'string' ? rawResponse : JSON.stringify(rawResponse);
  if (responseStr.length > MAX_RESPONSE_SIZE_BYTES) {
    errors.push(`Response exceeds maximum size (${responseStr.length} > ${MAX_RESPONSE_SIZE_BYTES} bytes)`);
    return { result: null, errors, warnings, policyViolations: [] };
  }

  // ── Step 2: Parse JSON safely ────────────────────────────
  let parsed;
  if (typeof rawResponse === 'object' && rawResponse !== null) {
    parsed = rawResponse;
  } else {
    try {
      // Strip potential markdown code fences (some providers wrap JSON in ```)
      const stripped = responseStr
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/\s*```\s*$/, '')
        .trim();
      parsed = JSON.parse(stripped);
    } catch (e) {
      errors.push(`Failed to parse JSON response: ${e.message}`);
      return { result: null, errors, warnings, policyViolations: [] };
    }
  }

  if (typeof parsed !== 'object' || parsed === null) {
    errors.push('Parsed response is not an object');
    return { result: null, errors, warnings, policyViolations: [] };
  }

  // ── Step 3: Required field validation ───────────────────
  const REQUIRED_FIELDS = ['summary', 'ingredientAnalysis', 'formulationInsights', 'warnings', 'limitations'];
  for (const field of REQUIRED_FIELDS) {
    if (!(field in parsed)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (errors.length > 0) {
    return { result: null, errors, warnings, policyViolations: [] };
  }

  // ── Step 4: Field type validation ───────────────────────
  if (typeof parsed.summary !== 'string') {
    errors.push('summary must be a string');
  } else if (parsed.summary.length > MAX_SUMMARY_LENGTH) {
    warnings.push(`summary truncated from ${parsed.summary.length} chars`);
    parsed.summary = parsed.summary.substring(0, MAX_SUMMARY_LENGTH);
  }

  if (!Array.isArray(parsed.ingredientAnalysis)) {
    errors.push('ingredientAnalysis must be an array');
  }

  if (!Array.isArray(parsed.formulationInsights)) {
    warnings.push('formulationInsights is not an array; replacing with empty');
    parsed.formulationInsights = [];
  }

  if (!Array.isArray(parsed.warnings)) {
    warnings.push('warnings is not an array; replacing with empty');
    parsed.warnings = [];
  }

  if (!Array.isArray(parsed.limitations)) {
    warnings.push('limitations is not an array; replacing with empty');
    parsed.limitations = [];
  }

  if (errors.length > 0) {
    return { result: null, errors, warnings, policyViolations: [] };
  }

  // ── Step 5: Validate ingredientAnalysis items ────────────
  const validIngredients = [];
  for (let i = 0; i < parsed.ingredientAnalysis.length; i++) {
    const item = parsed.ingredientAnalysis[i];
    if (!item || typeof item !== 'object') {
      warnings.push(`ingredientAnalysis[${i}] is not an object; skipped`);
      continue;
    }

    // Sanitize text fields (ensure they are strings, not objects or arrays)
    for (const field of ['name', 'inciName', 'aiObservations', 'irritationNotes', 'comedogenicityNote']) {
      if (item[field] !== null && item[field] !== undefined && typeof item[field] !== 'string') {
        item[field] = String(item[field]);
        warnings.push(`ingredientAnalysis[${i}].${field} converted to string`);
      }
      // Enforce length limit
      if (typeof item[field] === 'string' && item[field].length > MAX_FIELD_LENGTH) {
        item[field] = item[field].substring(0, MAX_FIELD_LENGTH);
      }
    }

    // Validate evidence status
    if (item.evidenceStatus) {
      const validStatuses = Object.values(EVIDENCE_STATUS);
      if (!validStatuses.includes(item.evidenceStatus)) {
        warnings.push(`ingredientAnalysis[${i}] has invalid evidenceStatus: ${item.evidenceStatus}`);
        item.evidenceStatus = EVIDENCE_STATUS.PENDING_RESEARCH;
      }
    }

    // Ensure arrays are arrays
    for (const field of ['functions', 'skinConsiderations', 'sourceIds']) {
      if (!Array.isArray(item[field])) {
        item[field] = [];
      }
    }

    const unmatched = findUnmatchedIngredient(evidencePackage, item.name || item.inciName);
    if (unmatched) {
      item.matchedInDatabase = false;
      item.evidenceStatus = EVIDENCE_STATUS.PENDING_RESEARCH;
      item.evidenceAssessment = validateEvidenceAssessment(
        item.evidenceAssessment,
        item.name || item.inciName,
        evidencePackage,
      );
      const sourceIds = new Set(getArticlesForIngredient(evidencePackage, item.name || item.inciName).map(article => article.sourceId));
      item.sourceIds = item.sourceIds.filter(sourceId => sourceIds.has(sourceId));
    }

    // AI-generated fields must not be marked as verified
    if (item.aiObservations && item.evidenceStatus === EVIDENCE_STATUS.VERIFIED) {
      item.evidenceStatus = EVIDENCE_STATUS.PARTIALLY_VERIFIED;
      warnings.push(`ingredientAnalysis[${i}]: demoted to partially_verified due to ai observations`);
    }

    validIngredients.push(item);
  }
  parsed.ingredientAnalysis = validIngredients;

  // ── Step 6: Validate warnings array items ───────────────
  const validWarnings = [];
  for (const w of parsed.warnings) {
    if (!w || typeof w !== 'object') continue;
    if (typeof w.description !== 'string') w.description = String(w.description ?? '');
    if (w.description.length > MAX_FIELD_LENGTH) w.description = w.description.substring(0, MAX_FIELD_LENGTH);

    const validSeverities = ['low', 'medium', 'high'];
    if (!validSeverities.includes(w.severity)) w.severity = 'low';

    validWarnings.push(w);
  }
  parsed.warnings = validWarnings;

  // ── Step 7: Validate evidence references ────────────────
  let policyViolations = [];
  if (evidencePackage && Array.isArray(parsed.evidenceReferences)) {
    const refValidation = validateEvidenceReferences(parsed.evidenceReferences, evidencePackage);
    if (!refValidation.valid) {
      for (const mismatch of refValidation.mismatches) {
        policyViolations.push(`Reference mismatch: ${mismatch.reason}`);
      }
      // Keep only verified references; flag the rest
      parsed.evidenceReferences = refValidation.validReferences;
      parsed.uncertainties = parsed.uncertainties || [];
      if (refValidation.mismatches.length > 0) {
        parsed.uncertainties.push(
          `${refValidation.mismatches.length} AI-cited reference(s) could not be verified against the retrieved evidence package.`
        );
      }
    }
  }

  // ── Step 8: Source policy enforcement ───────────────────
  const { sanitized, violations, warnings: policyWarnings } = enforceSourcePolicy(parsed);
  policyViolations = [...policyViolations, ...violations];
  warnings.push(...policyWarnings);

  // ── Step 9: Ensure no executable content ────────────────
  // All text fields must be plain text — no HTML or script tags
  sanitizeTextFields(sanitized);

  // ── Step 10: Add metadata ────────────────────────────────
  sanitized.validatedAt = new Date().toISOString();
  sanitized.validationWarnings = warnings.length > 0 ? warnings : undefined;
  sanitized.policyViolations = policyViolations.length > 0 ? policyViolations : undefined;

  return { result: sanitized, errors, warnings, policyViolations };
}

function normalizeName(value) {
  return String(value || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function findUnmatchedIngredient(evidencePackage, name) {
  const target = normalizeName(name);
  return (evidencePackage?.unmatchedIngredients || []).find(item =>
    normalizeName(item.cleanName || item.rawName || item) === target
  ) || null;
}

function getArticlesForIngredient(evidencePackage, name) {
  const target = normalizeName(name);
  const key = Object.keys(evidencePackage?.literatureResearch?.byIngredient || {})
    .find(candidate => normalizeName(candidate) === target);
  return key ? evidencePackage.literatureResearch.byIngredient[key] || [] : [];
}

function validateEvidenceAssessment(value, name, evidencePackage) {
  const articles = getArticlesForIngredient(evidencePackage, name);
  const validRecordIds = new Set(articles.map(article => article.sourceRecordId).filter(Boolean));
  const validProfiles = new Set(evidencePackage?.skinProfiles || []);
  const claims = Array.isArray(value?.functions) ? value.functions.slice(0, 8).map(claim => {
    const sourceRecordIds = Array.isArray(claim?.sourceRecordIds)
      ? claim.sourceRecordIds.filter(id => validRecordIds.has(id)).slice(0, 5)
      : [];
    return {
      value: sourceRecordIds.length ? String(claim.value || '').slice(0, 300) : '',
      sourceRecordIds,
    };
  }).filter(claim => claim.value && claim.sourceRecordIds.length) : [];

  const claimSources = item => Array.isArray(item?.sourceRecordIds)
    ? item.sourceRecordIds.filter(id => validRecordIds.has(id)).slice(0, 5)
    : [];
  const comedoSources = claimSources(value?.comedogenicity);
  const rawRating = Number(value?.comedogenicity?.rating);
  const validRating = typeof value?.comedogenicity?.rating === 'number'
    && Number.isInteger(rawRating) && rawRating >= 0 && rawRating <= 5 && comedoSources.length > 0;
  const sensitivitySources = claimSources(value?.sensitization);
  const sensitivityLevels = ['low', 'moderate', 'high'];
  const sensitivityLevel = sensitivitySources.length && sensitivityLevels.includes(value?.sensitization?.level)
    ? value.sensitization.level : 'unknown';
  const pregnancySources = claimSources(value?.pregnancy);
  const pregnancyStatuses = ['evidence_of_safety', 'evidence_of_concern'];
  const pregnancyStatus = pregnancySources.length && pregnancyStatuses.includes(value?.pregnancy?.status)
    ? value.pregnancy.status : 'unknown';
  const skinStatuses = ['suitable', 'caution', 'avoid'];
  const skinSuitability = Array.isArray(value?.skinSuitability) ? value.skinSuitability
    .filter(item => validProfiles.has(item?.profile))
    .slice(0, 8)
    .map(item => {
      const sourceRecordIds = claimSources(item);
      const status = sourceRecordIds.length && skinStatuses.includes(item?.status) ? item.status : 'unknown';
      return {
        profile: item.profile,
        status,
        note: sourceRecordIds.length ? String(item.note || '').slice(0, 500) : '',
        sourceRecordIds: status === 'unknown' ? [] : sourceRecordIds,
      };
    }) : [];

  return {
    functions: claims,
    comedogenicity: {
      rating: validRating ? rawRating : null,
      note: comedoSources.length ? String(value.comedogenicity.note || '').slice(0, 500) : '',
      sourceRecordIds: validRating || comedoSources.length ? comedoSources : [],
    },
    sensitization: {
      level: sensitivityLevel,
      note: sensitivitySources.length ? String(value.sensitization.note || '').slice(0, 500) : '',
      sourceRecordIds: sensitivityLevel === 'unknown' ? [] : sensitivitySources,
    },
    pregnancy: {
      status: pregnancyStatus,
      note: pregnancySources.length ? String(value.pregnancy.note || '').slice(0, 500) : '',
      sourceRecordIds: pregnancyStatus === 'unknown' ? [] : pregnancySources,
    },
    skinSuitability,
  };
}

/**
 * Recursively sanitize all string fields to remove HTML/script content
 * All content is treated as plain text — no HTML rendering of AI output
 */
function sanitizeTextFields(obj) {
  if (!obj || typeof obj !== 'object') return;

  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i] === 'string') {
        obj[i] = stripHtmlTags(obj[i]);
      } else {
        sanitizeTextFields(obj[i]);
      }
    }
  } else {
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === 'string') {
        obj[key] = stripHtmlTags(obj[key]);
      } else if (typeof obj[key] === 'object') {
        sanitizeTextFields(obj[key]);
      }
    }
  }
}

/**
 * Strip HTML tags and dangerous patterns from text
 * Content is ALWAYS displayed as plain text, but this provides defense-in-depth
 */
function stripHtmlTags(str) {
  // Remove script/style tags and their contents
  let cleaned = str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Remove all HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '');

  return cleaned;
}

/**
 * Validate a connection test response (minimal validation)
 */
export function validateConnectionTestResponse(response) {
  if (!response || typeof response !== 'object') {
    return { valid: false, error: 'No response received' };
  }
  return { valid: true };
}

/**
 * Create a safe partial result for incomplete responses
 * Used when an analysis fails mid-way
 */
export function createPartialResult(partial, reason) {
  return {
    summary: partial?.summary || 'Analysis incomplete.',
    ingredientAnalysis: partial?.ingredientAnalysis || [],
    formulationInsights: [],
    warnings: [],
    limitations: [`Analysis was incomplete: ${reason}`],
    uncertainties: ['This result is incomplete and should not be relied upon.'],
    evidenceReferences: [],
    isPartial: true,
    partialReason: reason,
    validatedAt: new Date().toISOString(),
  };
}

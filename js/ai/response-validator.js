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

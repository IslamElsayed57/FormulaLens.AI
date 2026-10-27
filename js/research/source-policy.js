/**
 * FormulaLens AI — Source Policy Enforcement
 * Validates that sources, evidence, and claims conform to the approved policy.
 * This module is shared across ALL three AI providers.
 */

import {
  APPROVED_SOURCES,
  EVIDENCE_STATUS,
  VALID_STATUS_TRANSITIONS,
  isApprovedSource,
  getApprovedSourceIds,
} from './source-registry.js';

/**
 * Validate a source record before storing it
 * Returns { valid, errors }
 */
export function validateSourceRecord(sourceRecord) {
  const errors = [];

  if (!sourceRecord || typeof sourceRecord !== 'object') {
    return { valid: false, errors: ['Source record is not an object'] };
  }

  // Source name must be present
  if (!sourceRecord.sourceName || typeof sourceRecord.sourceName !== 'string') {
    errors.push('Missing sourceName');
  }

  // Source URL must be HTTPS if present
  if (sourceRecord.sourceUrl) {
    if (typeof sourceRecord.sourceUrl !== 'string') {
      errors.push('sourceUrl must be a string');
    } else if (sourceRecord.sourceUrl && !sourceRecord.sourceUrl.startsWith('https://')) {
      errors.push('sourceUrl must use HTTPS');
    }
  }

  // Evidence category must be from approved list if present
  if (sourceRecord.evidenceCategory) {
    const VALID_CATEGORIES = [
      'identity', 'regulatory', 'safety', 'function',
      'skin_science', 'efficacy', 'formulation', 'toxicology',
    ];
    if (!VALID_CATEGORIES.includes(sourceRecord.evidenceCategory)) {
      errors.push(`Invalid evidenceCategory: ${sourceRecord.evidenceCategory}`);
    }
  }

  // Verification status must be from approved list
  if (sourceRecord.verificationStatus) {
    const VALID_STATUSES = Object.values(EVIDENCE_STATUS);
    if (!VALID_STATUSES.includes(sourceRecord.verificationStatus)) {
      errors.push(`Invalid verificationStatus: ${sourceRecord.verificationStatus}`);
    }
  }

  // Reject obviously fabricated source URLs (common hallucination patterns)
  if (sourceRecord.sourceUrl) {
    const REJECTED_PATTERNS = [
      'example.com', 'placeholder.com', 'test.com', 'localhost',
      'ingredient.info', 'skincare.info',
    ];
    const url = sourceRecord.sourceUrl.toLowerCase();
    if (REJECTED_PATTERNS.some(p => url.includes(p))) {
      errors.push(`Suspicious sourceUrl pattern: ${sourceRecord.sourceUrl}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validate an evidence status transition
 * Prevents automatic promotion of unverified claims
 */
export function validateStatusTransition(fromStatus, toStatus) {
  // Any status can stay the same
  if (fromStatus === toStatus) return { valid: true };

  // If source is null/undefined, treat as pending
  const from = fromStatus || EVIDENCE_STATUS.PENDING_RESEARCH;
  const to = toStatus;

  const validTransitions = VALID_STATUS_TRANSITIONS[from] || [];

  if (validTransitions.includes(to)) {
    return { valid: true };
  }

  // AI-generated claims cannot be promoted to verified
  if (to === EVIDENCE_STATUS.VERIFIED || to === EVIDENCE_STATUS.PARTIALLY_VERIFIED) {
    return {
      valid: false,
      error: `Cannot promote from '${from}' to '${to}' without explicit verification.`,
    };
  }

  return {
    valid: false,
    error: `Invalid status transition from '${from}' to '${to}'.`,
  };
}

/**
 * Enforce source policy on an AI-generated analysis result
 * Returns sanitized result with policy violations flagged
 */
export function enforceSourcePolicy(analysisResult) {
  const violations = [];
  const warnings = [];

  if (!analysisResult || typeof analysisResult !== 'object') {
    return { sanitized: analysisResult, violations: ['Analysis result is not an object'], warnings };
  }

  // Check evidence references
  if (Array.isArray(analysisResult.evidenceReferences)) {
    for (const ref of analysisResult.evidenceReferences) {
      // AI references must not claim to be verified without a real source
      if (ref.verificationStatus === EVIDENCE_STATUS.VERIFIED && !ref.sourceId) {
        ref.verificationStatus = EVIDENCE_STATUS.PENDING_RESEARCH;
        violations.push(`Reference '${ref.sourceName}' claimed verified without sourceId`);
      }

      // Validate HTTPS
      if (ref.sourceUrl && !ref.sourceUrl.startsWith('https://')) {
        ref.sourceUrl = null;
        violations.push(`Removed non-HTTPS URL from reference '${ref.sourceName}'`);
      }
    }
  }

  // AI-generated ingredients must not be auto-marked verified
  if (Array.isArray(analysisResult.ingredientAnalysis)) {
    for (const ing of analysisResult.ingredientAnalysis) {
      if (ing.aiGenerated && ing.evidenceStatus === EVIDENCE_STATUS.VERIFIED) {
        ing.evidenceStatus = EVIDENCE_STATUS.PENDING_RESEARCH;
        warnings.push(`Demoted AI-generated claim for '${ing.name}' from verified to pending_research`);
      }
    }
  }

  return { sanitized: analysisResult, violations, warnings };
}

/**
 * Check if an AI response's evidence references match the retrieved evidence package
 * Returns { valid, mismatches }
 */
export function validateEvidenceReferences(aiReferences, retrievedEvidencePackage) {
  const mismatches = [];
  const valid = [];

  if (!Array.isArray(aiReferences)) {
    return { valid: false, mismatches: ['aiReferences is not an array'] };
  }

  // Build a set of ingredient IDs in the evidence package
  const packageIngredientIds = new Set(
    (retrievedEvidencePackage?.ingredients || []).map(i => i.id)
  );

  for (const ref of aiReferences) {
    if (!ref || typeof ref !== 'object') {
      mismatches.push({ ref, reason: 'Not an object' });
      continue;
    }

    // If the reference claims to be from a specific ingredient,
    // verify that ingredient was actually in the evidence package
    if (ref.ingredientId && !packageIngredientIds.has(ref.ingredientId)) {
      mismatches.push({
        ref,
        reason: `Ingredient ID '${ref.ingredientId}' was not in the retrieved evidence package`,
      });
      continue;
    }

    // Provider web-search results are accepted only when the exact HTTPS URL
    // was returned by that provider during this analysis.
    const searchedUrls = new Set((retrievedEvidencePackage?.webSearchSources || []).map(source => source.url));
    if (ref.sourceUrl && (!/^https:\/\//i.test(ref.sourceUrl) || !searchedUrls.has(ref.sourceUrl))) {
      mismatches.push({ ref, reason: 'Source URL was not returned by this analysis web search' });
      continue;
    }

    // If a source ID is supplied, it must belong to the local approved registry.
    if (ref.sourceId) {
      const approvedIds = getApprovedSourceIds();
      if (!approvedIds.includes(ref.sourceId)) {
        mismatches.push({
          ref,
          reason: `Source ID '${ref.sourceId}' is not in the approved source registry`,
        });
        continue;
      }
    }

    valid.push(ref);
  }

  return {
    valid: mismatches.length === 0,
    validReferences: valid,
    mismatches,
    total: aiReferences.length,
  };
}

/**
 * Determine if a claim requires a backend lookup
 * (i.e., cannot be satisfied by the local dataset alone)
 */
export function requiresExternalRetrieval(claimType) {
  // These claim types can only be satisfied by live external sources
  const EXTERNAL_ONLY = ['efficacy', 'toxicology'];
  return EXTERNAL_ONLY.includes(claimType);
}

/**
 * Policy summary for display in the application
 */
export const SOURCE_POLICY_SUMMARY = {
  version: '1.0.0',
  description: 'FormulaLens AI uses a curated set of approved scientific and regulatory sources. All three AI providers use the same source policy and evidence retrieval pipeline.',
  approvedSources: Object.keys(APPROVED_SOURCES),
  prohibitions: [
    'AI-generated text cannot be automatically promoted to verified status.',
    'Missing evidence must be disclosed, not invented.',
    'Source URLs must use HTTPS.',
    'Ingredient identity does not imply clinical efficacy.',
    'CosIng listing does not guarantee finished-product safety.',
    'Ingredient order in a list does not reveal exact concentrations.',
  ],
  aiRole: 'The selected AI provider receives the pre-retrieved evidence package and generates interpretations. The provider does not define the scientific database or source policy.',
};

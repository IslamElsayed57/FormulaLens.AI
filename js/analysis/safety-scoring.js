/**
 * FormulaLens AI — Transparent Evidence-Based Safety & Compatibility Scoring
 * Computes deterministic, auditable safety scores from verified scientific sources
 * without arbitrary black-box algorithms.
 */

/**
 * Evaluate safety score and profile compatibility for a list of matched ingredients
 * @param {Array} matched - List of matched ingredient items
 * @param {Array} unmatched - List of unmatched ingredient tokens
 * @param {Array} skinProfiles - User selected profiles ('oily', 'dry', 'sensitive', 'acneProne', 'rosacea', 'pregnant')
 * @returns {Object} Comprehensive scoring breakdown
 */
export function calculateFormulaScore(matched = [], unmatched = [], skinProfiles = []) {
  let baseScore = 100;
  const deductions = [];
  const profileWarnings = [];
  const highlights = [];

  let comedogenicHighCount = 0;
  let sensitizerHighCount = 0;
  let sensitizerModerateCount = 0;
  let pregnancyRiskCount = 0;
  let fragranceAllergenCount = 0;

  for (const item of matched) {
    const ing = item.ingredient || item;

    // 1. Sensitization & Allergens
    if (ing.sensitizingPotential === 'high') {
      sensitizerHighCount++;
      baseScore -= 6;
      deductions.push({
        ingredient: ing.inciName,
        reason: 'High sensitization / allergen potential (EU Annex III allergen or volatile fragrance)',
        points: -6,
      });
    } else if (ing.sensitizingPotential === 'moderate') {
      sensitizerModerateCount++;
      baseScore -= 2;
    }

    if (ing.category?.includes('fragrance') || ing.category?.includes('fragrance_allergen')) {
      fragranceAllergenCount++;
    }

    // 2. Comedogenicity
    const comedo = ing.comedogenicRating ?? 0;
    if (comedo >= 4) {
      comedogenicHighCount++;
      baseScore -= 5;
      deductions.push({
        ingredient: ing.inciName,
        reason: `High comedogenicity rating (${comedo}/5)`,
        points: -5,
      });
    } else if (comedo === 3) {
      baseScore -= 2;
    }

    // 3. CIR Review Status
    if (ing.cirStatus && ing.cirStatus.toLowerCase().includes('limit')) {
      // Qualified safety
      baseScore -= 1;
    }

    // 4. Skin Profile Compatibility Checks
    const PROFILE_NAMES_AR = {
      oily: 'الدهنية',
      dry: 'الجافة',
      sensitive: 'الحساسة',
      acneProne: 'المعرضة للحبوب',
      rosacea: 'الوردية',
      combination: 'المختلطة',
      normal: 'العادية',
      pregnant: 'فترة الحمل',
      pregnancy: 'فترة الحمل',
    };

    for (const profile of skinProfiles) {
      const suit = ing.suitability?.[profile];
      const profAr = PROFILE_NAMES_AR[profile] || profile;
      if (suit === 'avoid') {
        profileWarnings.push({
          ingredient: ing.inciName,
          profile,
          level: 'high',
          reason: `Not recommended for ${profile} skin (potential barrier disruption or irritation).`,
          reasonAr: `غير موصى به للبشرة ${profAr} (احتمالية تهيج أو إضعاف حاجز البشرة).`,
        });
      } else if (suit === 'caution') {
        profileWarnings.push({
          ingredient: ing.inciName,
          profile,
          level: 'moderate',
          reason: `Use with caution for ${profile} skin; patch test recommended.`,
          reasonAr: `يُنصح باستخدامه بحذر للبشرة ${profAr}؛ يُفضل إجراء اختبار حساسية موضعي.`,
        });
      } else if (suit === 'beneficial') {
        highlights.push({
          ingredient: ing.inciName,
          profile,
          reason: `Targeted benefit for ${profile} skin.`,
          reasonAr: `فائدة مستهدفة للبشرة ${profAr}.`,
        });
      }
    }

    // Special Pregnancy Safety Check
    if (skinProfiles.includes('pregnant') || skinProfiles.includes('pregnancy')) {
      if (ing.suitability?.pregnancySafe === false) {
        pregnancyRiskCount++;
        profileWarnings.push({
          ingredient: ing.inciName,
          profile: 'pregnant',
          level: 'critical',
          reason: 'Contraindicated during pregnancy/nursing (e.g., Vitamin A retinoid or high dose salicylate).',
          reasonAr: 'غير آمن خلال فترة الحمل أو الرضاعة (مثل مشتقات فيتامين أ الريتينويدية أو حمض الساليسيليك العالي).',
        });
      }
    }
  }

  // Deduct slightly for unmatched ingredients due to uncertainty
  if (unmatched.length > 0) {
    const uncertaintyPenalty = Math.min(10, unmatched.length * 1.5);
    baseScore -= uncertaintyPenalty;
    deductions.push({
      ingredient: `${unmatched.length} unmatched`,
      reason: 'Information gap: unverified against local evidence base',
      points: -uncertaintyPenalty,
    });
  }

  const finalScore = Math.max(10, Math.min(100, Math.round(baseScore)));

  let grade = 'A';
  let gradeColor = 'var(--color-emerald-500)';
  let gradeLabel = 'Excellent Profile';

  if (finalScore >= 88) {
    grade = 'A';
    gradeLabel = 'Clean & Well-Tolerated';
    gradeColor = 'var(--color-emerald-500)';
  } else if (finalScore >= 75) {
    grade = 'B';
    gradeLabel = 'Generally Safe & Balanced';
    gradeColor = 'var(--color-mint-500)';
  } else if (finalScore >= 60) {
    grade = 'C';
    gradeLabel = 'Moderate Caution / Active Formula';
    gradeColor = 'var(--color-amber-500)';
  } else {
    grade = 'D';
    gradeLabel = 'Higher Irritation / Allergen Potential';
    gradeColor = 'var(--color-rose-500)';
  }

  return {
    score: finalScore,
    grade,
    gradeLabel,
    gradeColor,
    deductions,
    profileWarnings,
    highlights,
    metrics: {
      totalIngredients: matched.length + unmatched.length,
      matchedCount: matched.length,
      unmatchedCount: unmatched.length,
      sensitizerHighCount,
      sensitizerModerateCount,
      comedogenicHighCount,
      fragranceAllergenCount,
      pregnancyRiskCount,
    },
  };
}

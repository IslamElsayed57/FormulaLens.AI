/**
 * FormulaLens AI — Multi-Product Formula Comparison Engine
 * Compares 2-3 products side-by-side:
 * - Shared ingredient backbone
 * - Unique active differentials
 * - Side-by-side safety scores and comedogenic ratings
 * - Skin profile compatibility winner
 */

import { calculateFormulaScore } from './safety-scoring.js';

/**
 * Compare two or three products
 * @param {Array<Object>} products - Array of product objects with { name, matchedIngredients, unmatchedIngredients }
 * @param {Array<string>} skinProfiles - Selected skin profiles
 * @returns {Object} Structured comparison analysis
 */
export function compareProducts(products = [], skinProfiles = []) {
  if (!Array.isArray(products) || products.length < 2) {
    throw new Error('At least 2 products are required for comparison.');
  }

  const normalizedLists = products.map((prod, idx) => {
    const list = (prod.matchedIngredients || []).map(m => {
      const ing = m.ingredient || m;
      return {
        id: ing.id || ing.normalizedName,
        name: ing.inciName || m.cleanName || m.rawName,
        normalizedName: ing.normalizedName || (m.cleanName || '').toLowerCase(),
        ingredient: ing,
      };
    });

    const scoreData = prod.safetyScore || calculateFormulaScore(
      prod.matchedIngredients || [],
      prod.unmatchedIngredients || [],
      skinProfiles
    );

    return {
      index: idx,
      name: prod.productName || prod.name || `Product ${idx + 1}`,
      ingredients: list,
      unmatchedIngredients: prod.unmatchedIngredients || [],
      literatureResearch: prod.literatureResearch || null,
      aiReviewStatus: prod.aiReviewStatus || null,
      scoreData,
      totalCount: (prod.matchedIngredients?.length || 0) + (prod.unmatchedIngredients?.length || 0),
    };
  });

  // Calculate shared ingredients (present in ALL products)
  const firstList = normalizedLists[0].ingredients;
  const commonIngredients = firstList.filter(itemA => {
    return normalizedLists.slice(1).every(otherProd => {
      return otherProd.ingredients.some(itemB => itemB.normalizedName === itemA.normalizedName);
    });
  });

  // Calculate unique ingredients per product
  const uniquePerProduct = normalizedLists.map(prod => {
    const unique = prod.ingredients.filter(itemA => {
      return normalizedLists.every(otherProd => {
        if (otherProd.index === prod.index) return true;
        return !otherProd.ingredients.some(itemB => itemB.normalizedName === itemA.normalizedName);
      });
    });
    return {
      productName: prod.name,
      uniqueIngredients: unique,
    };
  });

  // Comparative winner determination
  let bestScoreProd = normalizedLists[0];
  for (const p of normalizedLists) {
    if (p.scoreData.score > bestScoreProd.scoreData.score) {
      bestScoreProd = p;
    }
  }

  return {
    comparedAt: new Date().toISOString(),
    productCount: products.length,
    products: normalizedLists,
    commonIngredients,
    commonCount: commonIngredients.length,
    uniquePerProduct,
    bestSuitability: {
      productName: bestScoreProd.name,
      score: bestScoreProd.scoreData.score,
      grade: bestScoreProd.scoreData.grade,
      reason: `Highest safety index (${bestScoreProd.scoreData.score}/100) with fewer potential irritants.`,
    },
  };
}

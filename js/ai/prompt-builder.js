/**
 * FormulaLens AI — Shared Prompt Builder
 * Constructs analysis prompts for ALL three AI providers.
 * All providers receive the same scientific instructions and evidence package.
 * The adapter translates this into provider-specific API format.
 */

/**
 * Build a complete analysis prompt from the evidence package
 * This is the SHARED methodology — not provider-specific
 */
export function buildAnalysisPrompt(evidencePackage, options = {}) {
  const {
    skinProfiles = [],
    productName = null,
    requestedAnalysis = 'full',
    lang = 'en',
  } = options;

  const systemInstruction = buildSystemInstruction(lang);
  const userMessage = buildAnalysisMessage(evidencePackage, { skinProfiles, productName, lang });

  return { systemInstruction, userMessage };
}

/**
 * System instruction — defines the AI's role and constraints
 * Same for all providers
 */
function buildSystemInstruction(lang = 'en') {
  return `You are FormulaLens AI, a scientific cosmetic ingredient analysis assistant. Your role is to interpret the provided evidence package and generate a structured analysis.

CRITICAL RULES — YOU MUST FOLLOW THESE WITHOUT EXCEPTION:

1. RESEARCH EACH UNMATCHED INGREDIENT USING WEB SEARCH WHEN AVAILABLE.
   - Search the web yourself for each unmatched ingredient and relevant claims; do not restrict searches to a predetermined list of domains.
   - Prefer primary research, official regulatory material, recognized safety reviews, and authoritative ingredient references, while considering source quality and date.
   - Use the supplied evidence package as additional context. Do not invent findings; if searches find no relevant evidence, state that clearly.

2. DO NOT FABRICATE SOURCE CITATIONS.
   - Cite real sources actually retrieved by web search or listed in the evidence package. Never invent publication dates, URLs, journal names, or study results.
   - Include source title and URL for web-search sources in evidenceReferences. Do not present a search result title as proof unless its content supports the claim.

3. DO NOT INFER INGREDIENT CONCENTRATIONS.
   - Ingredient lists may reflect decreasing concentration under some labeling rules, but exact concentrations are never known from ingredient lists alone.
   - Never claim or imply a specific concentration percentage.

4. MAINTAIN UNCERTAINTY.
   - Clearly distinguish between: (a) source-backed facts, (b) evidence-based interpretations, (c) AI-generated observations that are unverified.
   - Label AI-generated observations as "unverified observation" or equivalent.
   - Report missing or conflicting evidence transparently.

5. DO NOT DIAGNOSE OR TREAT.
   - This is a cosmetic ingredient research tool, not a medical device.
   - Do not diagnose skin conditions or recommend medical treatments.
   - Suitability observations are for general cosmetic research purposes.

6. COMEDOGENICITY AND IRRITATION LIMITATIONS.
   - Report comedogenicity evidence only if present in the evidence package.
   - Do not invent ratings. Acknowledging incomplete evidence is correct behavior.

7. SUNSCREEN LIMITATIONS.
   - Do not infer SPF, UVA protection, water resistance, or finished-product efficacy from ingredient lists.

8. OUTPUT FORMAT.
   - Return ONLY valid JSON matching the required output schema.
   - Do not include markdown fences, explanations, or text outside the JSON.
   - All text fields must be plain text — no HTML, no markdown, no JavaScript.

${lang === 'ar' ? 'LANGUAGE: Respond in Arabic. Use clear, scientific Arabic terminology.' : 'LANGUAGE: Respond in English.'}`;
}

/**
 * Build the user message with the evidence package
 */
function buildAnalysisMessage(evidencePackage, { skinProfiles, productName, lang }) {
  const ingredients = evidencePackage.ingredients || evidencePackage.matchedIngredients || [];
  const unknownIngredients = evidencePackage.unknownIngredients || evidencePackage.unmatchedIngredients?.map(u => u.rawName || u) || [];
  const conflicts = evidencePackage.conflicts || evidencePackage.safetyScoreData?.profileWarnings?.map(w => `${w.ingredient}: ${w.reason}`) || [];

  const ingredientSummary = buildIngredientEvidenceSummary({ ...evidencePackage, ingredients, unknownIngredients, conflicts });
  const skinProfileText = skinProfiles.length > 0
    ? `Selected skin profiles for this analysis: ${skinProfiles.join(', ')}.`
    : 'No skin profile selected. Provide general observations.';

  return `PRODUCT ANALYSIS REQUEST

${productName ? `Product Name: ${productName}` : 'Product Name: Not provided'}
${skinProfileText}

INGREDIENT LIST (${ingredients.length} ingredients confirmed):
${ingredients.map((ing, i) => `${i + 1}. ${ing.inciName || ing.name || ing.rawName}`).join('\n')}

EVIDENCE PACKAGE:
${ingredientSummary}

MISSING FROM LOCAL DATABASE:
${unknownIngredients.length > 0
  ? unknownIngredients.join(', ')
  : 'None — all ingredients were found in the database.'}

SUPPLIED SEARCH RESULTS (additional leads; assess relevance and source quality):
${formatLiteratureResearch(evidencePackage.literatureResearch)}

${conflicts.length > 0 ? `KNOWN CONFLICTS:\n${conflicts.map(c => `- ${c}`).join('\n')}` : ''}

INSTRUCTIONS:
Search independently for every unmatched ingredient using web search when available, and use relevant sources from any domain. Return one ingredientAnalysis item for every unmatched ingredient, using its exact input name. Search results are leads: check that the source actually concerns the named ingredient and that its content supports the claim; do not infer ingredient identity from a vague text match or claim a source is verified. Cite supplied records with their exact sourceRecordIds. For web sources, include exact source title and URL in evidenceReferences, with the exact ingredient name and supported claim. In evidenceAssessment sourceRecordIds, use supplied record IDs or exact HTTPS URLs from your own cited web sources; never invent IDs or URLs. PubChem records may support chemical identity or formula only, not cosmetic safety, comedogenicity, sensitization, pregnancy safety, or skin suitability. Citation metadata without an abstract or accessible supporting content does not support specific safety claims. If reliable direct evidence is absent for a field, use unknown/null. Never infer a 0–5 comedogenicity rating from qualitative prose. Never call an ingredient pregnancy-safe based only on absence of reported harm; require direct ingredient-specific pregnancy evidence, otherwise use unknown. Skin-profile suitability requires direct evidence relevant to that profile; otherwise unknown. A single case report may document a possible reaction but does not establish population-level sensitization risk. Unknown ingredients remain pending research. Generate the structured JSON response.

REQUIRED JSON OUTPUT SCHEMA:
{
  "summary": "string — 2-4 sentence overall product summary",
  "ingredientAnalysis": [
    {
      "name": "string — ingredient name from the list",
      "inciName": "string or null",
      "matchedInDatabase": true|false,
      "functions": ["string"],
      "evidenceStatus": "verified|partially_verified|unverified|pending_research|conflicting_evidence",
      "skinConsiderations": ["string"],
      "irritationNotes": "string or null",
      "comedogenicityNote": "string or null — only include if evidence exists",
      "aiObservations": "string or null — label as unverified if AI-generated",
      "sourceIds": ["string — from evidence package only"],
      "evidenceAssessment": {
        "functions": [{"value": "string", "sourceRecordIds": ["exact supplied source record IDs or exact cited HTTPS source URLs"]}],
        "comedogenicity": {"rating": "integer 0-5 or null; only if a cited source explicitly reports this scale", "note": "string or null", "sourceRecordIds": []},
        "sensitization": {"level": "low|moderate|high|unknown", "note": "string or null", "sourceRecordIds": []},
        "pregnancy": {"status": "evidence_of_safety|evidence_of_concern|unknown", "note": "string or null", "sourceRecordIds": []},
        "skinSuitability": [{"profile": "one selected skin profile", "status": "suitable|caution|avoid|unknown", "note": "string or null", "sourceRecordIds": []}]
      }
    }
  ],
  "skinCompatibility": {
    "profiles": ["string — profiles assessed"],
    "considerations": ["string"],
    "limitations": ["string"]
  },
  "formulationInsights": [
    {
      "observation": "string",
      "category": "string — e.g. humectants, emollients, preservatives",
      "evidenceBased": true|false,
      "sourceIds": ["string"]
    }
  ],
  "warnings": [
    {
      "type": "string — fragrance|irritant|allergen|regulatory|other",
      "severity": "low|medium|high",
      "ingredient": "string",
      "description": "string",
      "evidenceBased": true|false
    }
  ],
  "evidenceReferences": [
    {
      "sourceId": "string or null — use a real ID only when supplied",
      "sourceName": "string",
      "sourceUrl": "string — exact HTTPS URL actually retrieved",
      "ingredient": "string — exact ingredient name supported by this source",
      "ingredientId": "string or null",
      "claim": "string — what this source supports",
      "evidenceCategory": "string"
    }
  ],
  "uncertainties": ["string — list specific missing or uncertain data points"],
  "limitations": ["string — important limitations of this analysis"],
  "formulationSafetyNote": "string — reminder that this is cosmetic research only"
}`;
}

function formatLiteratureResearch(research = {}) {
  if (!research.searchedNames?.length) return 'No live literature search was performed.';
  const lines = [];
  for (const name of research.searchedNames) {
    const articles = research.byIngredient?.[name] || [];
    lines.push(`\nIngredient query: ${name}`);
    if (!articles.length) lines.push('  No relevant records returned.');
    for (const article of articles) {
      lines.push(`  [${article.sourceName || article.sourceId || 'Source'} ${article.sourceRecordId}] ${article.title} (${article.year || 'date unavailable'}). ${article.journal || ''}`);
      if (article.abstract) lines.push(`  Abstract excerpt: ${article.abstract.slice(0, 800)}`);
      lines.push(`  Source URL: ${article.sourceUrl}`);
    }
  }
  if (research.skippedNames?.length) lines.push(`\nNot searched due to per-analysis limit: ${research.skippedNames.join(', ')}`);
  if (research.errors?.length) lines.push(`\nRetrieval errors: ${research.errors.map(e => `${e.ingredientName || 'search'}: ${e.message}`).join('; ')}`);
  return lines.join('\n').slice(0, 50000);
}

/**
 * Summarize the evidence package for the prompt
 */
function buildIngredientEvidenceSummary(evidencePackage) {
  const lines = [];
  const ingredients = evidencePackage.ingredients || evidencePackage.matchedIngredients || [];

  for (const ingredient of ingredients) {
    const ing = ingredient.ingredient || ingredient;
    lines.push(`\n[${ing.inciName || ing.name || ingredient.rawName}]`);
    lines.push(`  ID: ${ing.id || 'unknown'}`);
    lines.push(`  Evidence Status: ${ing.evidenceStatus || 'unknown'}`);

    if (ing.functions?.length > 0) {
      lines.push(`  Functions: ${ing.functions.join(', ')}`);
    }

    if (ingredient.skinTypeConsiderations?.length > 0) {
      lines.push(`  Skin Considerations: ${ingredient.skinTypeConsiderations.join('; ')}`);
    }

    if (ingredient.irritationConsiderations?.length > 0) {
      lines.push(`  Irritation Notes: ${ingredient.irritationConsiderations.join('; ')}`);
    }

    if (ingredient.comedogenicity?.evidenceStatus && ingredient.comedogenicity.evidenceStatus !== 'pending_research') {
      lines.push(`  Comedogenicity: ${ingredient.comedogenicity.value ?? 'data not available'} (${ingredient.comedogenicity.evidenceStatus})`);
    }

    if (ingredient.sources?.length > 0) {
      const sourceRefs = ingredient.sources
        .filter(s => s.verificationStatus !== 'unverified')
        .map(s => `${s.sourceName} [${s.evidenceCategory}]`)
        .join(', ');
      if (sourceRefs) lines.push(`  Sources: ${sourceRefs}`);
    }
  }

  return lines.join('\n') || 'No detailed evidence available for any ingredient.';
}

/**
 * Build a comparison prompt for multiple products
 */
export function buildComparisonPrompt(products, { skinProfiles = [], lang = 'en' } = {}) {
  const systemInstruction = buildSystemInstruction(lang);

  const productSections = products.map((product, idx) =>
    `PRODUCT ${idx + 1}: ${product.name || `Product ${idx + 1}`}
Ingredients: ${product.ingredients.join(', ')}`
  ).join('\n\n');

  const userMessage = `PRODUCT COMPARISON REQUEST

Compare the following ${products.length} products based on their ingredient lists.
${skinProfiles.length > 0 ? `Skin profiles: ${skinProfiles.join(', ')}` : 'No skin profile selected.'}

${productSections}

Return a JSON object with:
{
  "sharedIngredients": ["string"],
  "productComparisons": [
    {
      "productIndex": 0,
      "productName": "string",
      "uniqueIngredients": ["string"],
      "strengths": ["string"],
      "considerations": ["string"]
    }
  ],
  "overallObservations": ["string"],
  "skinProfileNotes": "string or null",
  "limitations": ["string"]
}

Apply all the same evidence and safety rules as individual analysis.`;

  return { systemInstruction, userMessage };
}

/**
 * Build a prompt for ingredient library lookup enrichment
 * Used only when a user requests additional detail on a specific ingredient
 */
export function buildIngredientDetailPrompt(ingredientRecord, lang = 'en') {
  const systemInstruction = buildSystemInstruction(lang);

  const userMessage = `INGREDIENT DETAIL REQUEST

Ingredient: ${ingredientRecord.inciName || ingredientRecord.name}
Current Evidence Status: ${ingredientRecord.evidenceStatus}
Known Functions: ${ingredientRecord.functions?.join(', ') || 'Not documented'}
Known Skin Considerations: ${ingredientRecord.skinTypeConsiderations?.join('; ') || 'Not documented'}

Using ONLY information supported by the provided evidence status and the INCI name above, provide a brief scientific summary. Do not invent functions, studies, or clinical outcomes not supported by the evidence package.

Return JSON:
{
  "briefSummary": "string — 1-2 sentences",
  "keyFunctions": ["string"],
  "researchNotes": "string or null",
  "evidenceStatus": "string",
  "limitations": ["string"]
}`;

  return { systemInstruction, userMessage };
}

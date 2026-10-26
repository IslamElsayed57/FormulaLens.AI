/**
 * FormulaLens AI — Source Registry
 * Approved sources and their permitted claim types
 * This is the ONLY approved source list for the application.
 * All three AI providers use this same registry.
 */

/**
 * Evidence categories for source claims
 */
export const EVIDENCE_CATEGORIES = {
  IDENTITY: 'identity',           // Ingredient name, INCI, synonyms
  REGULATORY: 'regulatory',       // Regulatory listings and restrictions
  SAFETY_ASSESSMENT: 'safety',    // Safety assessments and evaluations
  FUNCTION: 'function',           // Documented functions and uses
  SKIN_SCIENCE: 'skin_science',   // Skin biology and interaction data
  EFFICACY: 'efficacy',          // Clinical/in-vitro efficacy evidence
  FORMULATION: 'formulation',     // Formulation chemistry
  TOXICOLOGY: 'toxicology',       // Toxicological data
};

/**
 * Source reliability tiers
 */
export const SOURCE_TIER = {
  TIER_1: 'tier_1', // Official regulatory databases
  TIER_2: 'tier_2', // Peer-reviewed scientific literature
  TIER_3: 'tier_3', // Industry technical resources
  TIER_4: 'tier_4', // Secondary/educational resources
};

/**
 * Permitted evidence status values
 */
export const EVIDENCE_STATUS = {
  VERIFIED: 'verified',
  PARTIALLY_VERIFIED: 'partially_verified',
  UNVERIFIED: 'unverified',
  PENDING_RESEARCH: 'pending_research',
  CONFLICTING_EVIDENCE: 'conflicting_evidence',
};

/**
 * Valid evidence status transitions
 * Prevents automatic promotion of unverified claims
 */
export const VALID_STATUS_TRANSITIONS = {
  pending_research: ['partially_verified', 'unverified', 'conflicting_evidence'],
  unverified: ['partially_verified', 'conflicting_evidence'],
  partially_verified: ['verified', 'conflicting_evidence'],
  verified: ['conflicting_evidence'],        // Can be downgraded if contradicted
  conflicting_evidence: ['partially_verified', 'unverified'],
};

/**
 * Approved source registry
 * These are the only sources the application treats as authoritative.
 */
export const APPROVED_SOURCES = {
  COSING: {
    id: 'cosing',
    name: 'European Commission CosIng',
    shortName: 'CosIng',
    url: 'https://ec.europa.eu/growth/tools-databases/cosing/',
    tier: SOURCE_TIER.TIER_1,
    supportedClaims: [
      EVIDENCE_CATEGORIES.IDENTITY,
      EVIDENCE_CATEGORIES.REGULATORY,
      EVIDENCE_CATEGORIES.FUNCTION,
    ],
    licenseNotes: 'European Commission official database. Public access. Attribution required.',
    accessMethod: 'web_interface',
    apiAvailable: false,
    downloadAvailable: false,
    corsCompatible: false,
    limitations: [
      'No supported public search API is available to this browser-only app; users can open the official search tool.',
      'CosIng listing does not prove cosmetic efficacy or safety for all uses.',
    ],
    notes: 'Authoritative source for INCI names and EU regulatory information.',
  },

  PUBCHEM: {
    id: 'pubchem',
    name: 'PubChem (NCBI)',
    shortName: 'PubChem',
    url: 'https://pubchem.ncbi.nlm.nih.gov/',
    apiUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/',
    tier: SOURCE_TIER.TIER_1,
    supportedClaims: [
      EVIDENCE_CATEGORIES.IDENTITY,
      EVIDENCE_CATEGORIES.FUNCTION,
      EVIDENCE_CATEGORIES.TOXICOLOGY,
      EVIDENCE_CATEGORIES.SKIN_SCIENCE,
    ],
    licenseNotes: 'NCBI/NLM PubChem. Public domain. Attribution encouraged.',
    accessMethod: 'public_api',
    apiAvailable: true,
    downloadAvailable: true,
    corsCompatible: true, // PubChem API supports CORS for basic queries
    limitations: [
      'PubChem records chemical identity, not finished-product safety.',
      'Rate limits apply. Excessive queries may be throttled.',
      'Browser CORS support varies by endpoint.',
    ],
    notes: 'Chemical identity and structure information source.',
  },

  EUROPE_PMC: {
    id: 'europe_pmc',
    name: 'Europe PMC (includes PubMed records)',
    shortName: 'Europe PMC',
    url: 'https://europepmc.org/',
    apiUrl: 'https://www.ebi.ac.uk/europepmc/webservices/rest/search',
    tier: SOURCE_TIER.TIER_2,
    supportedClaims: [
      EVIDENCE_CATEGORIES.SAFETY_ASSESSMENT,
      EVIDENCE_CATEGORIES.SKIN_SCIENCE,
      EVIDENCE_CATEGORIES.EFFICACY,
      EVIDENCE_CATEGORIES.TOXICOLOGY,
      EVIDENCE_CATEGORIES.FORMULATION,
    ],
    licenseNotes: 'Europe PMC provides bibliographic metadata and abstracts; reuse terms vary by publication.',
    accessMethod: 'public_api',
    apiAvailable: true,
    corsCompatible: true,
    limitations: [
      'Search results and abstracts are leads for review, not a definitive ingredient dossier.',
      'Publication relevance and evidence quality require human assessment.',
      'Only abstracts and bibliographic metadata are retained locally by this app.',
    ],
    notes: 'Live literature search; includes PubMed-indexed records and other life-science publications.',
  },

  FDA_COSMETICS: {
    id: 'fda_cosmetics',
    name: 'U.S. Food and Drug Administration — Cosmetics',
    shortName: 'FDA Cosmetics',
    url: 'https://www.fda.gov/cosmetics/cosmetics-laws-regulations/prohibited-restricted-ingredients-cosmetics',
    tier: SOURCE_TIER.TIER_1,
    supportedClaims: [EVIDENCE_CATEGORIES.REGULATORY, EVIDENCE_CATEGORIES.SAFETY_ASSESSMENT],
    licenseNotes: 'Official FDA public guidance and regulations.',
    accessMethod: 'official_web_reference',
    apiAvailable: false,
    corsCompatible: false,
    limitations: [
      'FDA does not provide a general public ingredient-safety approval database or ingredient search API.',
      'The official page covers selected prohibited and restricted ingredients; it is not a complete cosmetic ingredient inventory.',
    ],
    notes: 'Use for U.S. cosmetic requirements and selected prohibited or restricted ingredients.',
  },

  SFDA_COSMETICS: {
    id: 'sfda_cosmetics',
    name: 'Saudi Food and Drug Authority — Cosmetic Ingredients',
    shortName: 'SFDA',
    url: 'https://www.sfda.gov.sa/ar/node/17590',
    apiUrl: 'https://api.sfda.gov.sa:9001/v1/cosmetics/requirements/AllCosmeticList',
    tier: SOURCE_TIER.TIER_1,
    supportedClaims: [EVIDENCE_CATEGORIES.IDENTITY, EVIDENCE_CATEGORIES.REGULATORY],
    licenseNotes: 'Official SFDA public ingredient list and regulatory information.',
    accessMethod: 'official_web_reference',
    apiAvailable: true,
    corsCompatible: false,
    limitations: [
      'The published service documents list pagination but not a supported name-filter contract for browser clients.',
      'The public page is used for manual confirmation; SFDA records are not queried automatically by this version.',
    ],
    notes: 'Saudi ingredient list includes scientific name, CAS, use conditions and restrictions.',
  },

  SCCS: {
    id: 'sccs',
    name: 'Scientific Committee on Consumer Safety (SCCS)',
    shortName: 'SCCS',
    url: 'https://ec.europa.eu/health/scientific_committees/consumer_safety_en',
    tier: SOURCE_TIER.TIER_1,
    supportedClaims: [
      EVIDENCE_CATEGORIES.SAFETY_ASSESSMENT,
      EVIDENCE_CATEGORIES.TOXICOLOGY,
      EVIDENCE_CATEGORIES.REGULATORY,
    ],
    licenseNotes: 'European Commission scientific opinions. Public access.',
    accessMethod: 'web_documents',
    apiAvailable: false,
    corsCompatible: false,
    limitations: [
      'No automated API. Opinions pre-collected in dataset.',
      'Opinions cover specific ingredients under specific conditions.',
    ],
    notes: 'Authoritative EU safety assessments for cosmetic ingredients.',
  },

  ECHA: {
    id: 'echa',
    name: 'European Chemicals Agency (ECHA)',
    shortName: 'ECHA',
    url: 'https://echa.europa.eu/',
    tier: SOURCE_TIER.TIER_1,
    supportedClaims: [
      EVIDENCE_CATEGORIES.REGULATORY,
      EVIDENCE_CATEGORIES.TOXICOLOGY,
      EVIDENCE_CATEGORIES.SAFETY_ASSESSMENT,
    ],
    licenseNotes: 'ECHA public data. Attribution required.',
    accessMethod: 'web_interface',
    apiAvailable: true,
    corsCompatible: false,
    limitations: ['Focuses on industrial chemicals; cosmetic-specific data varies.'],
    notes: 'European regulatory chemical information.',
  },

  CIR: {
    id: 'cir',
    name: 'Cosmetic Ingredient Review (CIR)',
    shortName: 'CIR',
    url: 'https://www.cir-safety.org/',
    tier: SOURCE_TIER.TIER_2,
    supportedClaims: [
      EVIDENCE_CATEGORIES.SAFETY_ASSESSMENT,
      EVIDENCE_CATEGORIES.TOXICOLOGY,
      EVIDENCE_CATEGORIES.FUNCTION,
    ],
    licenseNotes: 'CIR safety assessments. Public reports. Review for reuse terms.',
    accessMethod: 'web_documents',
    apiAvailable: false,
    corsCompatible: false,
    limitations: ['Reports are long-form documents; data pre-collected in dataset.'],
    notes: 'US industry-sponsored but scientifically rigorous safety reviews.',
  },

  // Internal/user-generated — lowest trust
  AI_GENERATED: {
    id: 'ai_generated',
    name: 'AI-Generated Analysis',
    shortName: 'AI',
    tier: SOURCE_TIER.TIER_4,
    supportedClaims: [], // AI-generated content cannot verify any claim type
    licenseNotes: 'AI-generated. Not a verified source.',
    limitations: [
      'AI-generated observations must never be automatically promoted to verified status.',
      'AI output is not a substitute for source-backed evidence.',
    ],
    notes: 'Placeholder source type for AI-generated observations.',
  },

  USER_CREATED: {
    id: 'user_created',
    name: 'User-Created Record',
    shortName: 'User',
    tier: SOURCE_TIER.TIER_4,
    supportedClaims: [],
    licenseNotes: 'User-created. Not a verified scientific source.',
    limitations: ['User notes are separate from verified ingredient data.'],
    notes: 'Placeholder source type for user-entered information.',
  },
};

/**
 * Get an approved source by ID
 */
export function getSource(sourceId) {
  const source = Object.values(APPROVED_SOURCES).find(s => s.id === sourceId);
  return source ?? null;
}

/**
 * Get all sources that support a given claim type
 */
export function getSourcesForClaim(claimType) {
  return Object.values(APPROVED_SOURCES).filter(s =>
    s.supportedClaims.includes(claimType)
  );
}

/**
 * Check if a source is approved and supports a given claim
 */
export function isApprovedSource(sourceId, claimType = null) {
  const source = getSource(sourceId);
  if (!source) return false;
  if (!claimType) return true;
  return source.supportedClaims.includes(claimType);
}

/**
 * Get all approved source IDs
 */
export function getApprovedSourceIds() {
  return Object.values(APPROVED_SOURCES).map(s => s.id);
}

/**
 * Get ordered sources by tier reliability for a given claim
 */
export function getRankedSources(claimType) {
  const tierOrder = [SOURCE_TIER.TIER_1, SOURCE_TIER.TIER_2, SOURCE_TIER.TIER_3, SOURCE_TIER.TIER_4];
  return getSourcesForClaim(claimType)
    .sort((a, b) => tierOrder.indexOf(a.tier) - tierOrder.indexOf(b.tier));
}

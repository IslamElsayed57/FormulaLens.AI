export const FALLBACK_MANIFEST = {
  "name": "FormulaLens AI Cosmetic Ingredient Scientific Database",
  "version": "1.0.0",
  "lastUpdated": "2026-03-01T00:00:00Z",
  "license": "Open Cosmetic Science Knowledgebase (CC BY-SA 4.0)",
  "totalRecords": 147,
  "schema": {
    "id": "string",
    "inciName": "string",
    "normalizedName": "string",
    "casNumber": "string",
    "category": "array<string>",
    "functions": "array<string>",
    "functionsAr": "array<string>",
    "cirStatus": "string",
    "comedogenicRating": "number (0-5)",
    "sensitizingPotential": "string (low|moderate|high)",
    "evidenceStatus": "string (verified|partially_verified)",
    "suitability": {
      "oily": "string (beneficial|safe|caution|avoid)",
      "dry": "string (beneficial|safe|caution|avoid)",
      "sensitive": "string (beneficial|safe|caution|avoid)",
      "acneProne": "string (beneficial|safe|caution|avoid)",
      "rosacea": "string (beneficial|safe|caution|avoid)",
      "pregnancySafe": "boolean"
    },
    "descriptionEn": "string",
    "descriptionAr": "string",
    "synonyms": "array<string>",
    "sources": "array<object>"
  },
  "approvedSources": [
    { "id": "CIR_PANEL", "name": "Cosmetic Ingredient Review (CIR)", "url": "https://www.cir-safety.org" },
    { "id": "EU_COSING", "name": "European Commission CosIng Database", "url": "https://ec.europa.eu/growth/tools-databases/cosing/" },
    { "id": "PUBMED_NCBI", "name": "PubMed / NCBI Derm Research", "url": "https://pubmed.ncbi.nlm.nih.gov" },
    { "id": "PC_BEAUTYPEDIA", "name": "Paula's Choice Ingredient Dictionary", "url": "https://www.paulaschoice.com/ingredient-dictionary" }
  ]
}
;
export const FALLBACK_INGREDIENTS = [
  {
    "id": "ing_niacinamide",
    "inciName": "Niacinamide",
    "normalizedName": "niacinamide",
    "casNumber": "98-92-0",
    "category": [
      "active",
      "vitamin",
      "brightening",
      "barrier_repair"
    ],
    "functions": [
      "Skin conditioning",
      "Smoothing",
      "Sebum regulating",
      "Barrier strengthening"
    ],
    "functionsAr": [
      "مكيف للبشرة",
      "منعم",
      "تنظيم إفراز الدهون",
      "تقوية الحاجز الجلدي"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "beneficial",
      "dry": "beneficial",
      "sensitive": "safe",
      "acneProne": "beneficial",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Water-soluble form of Vitamin B3. Restores cellular energy, repairs damaged DNA, reduces the immunosuppressive effects of sun-induced UV rays, and visibly minimizes pores and fine lines.",
    "descriptionAr": "شكل قابل للذوبان في الماء من فيتامين B3. يعمل على تنظيم إفراز الزهم، وتقوية حاجز البشرة السيراميدي، وتفتيح التصبغات وتقليل مظهر المسام الواسعة.",
    "synonyms": [
      "nicotinamide",
      "vitamin b3",
      "3-pyridinecarboxamide"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_retinol",
    "inciName": "Retinol",
    "normalizedName": "retinol",
    "casNumber": "68-26-8",
    "category": [
      "active",
      "retinoid",
      "anti_aging"
    ],
    "functions": [
      "Cell-communicating agent",
      "Exfoliant",
      "Skin renewing"
    ],
    "functionsAr": [
      "محفز لتجديد الخلايا",
      "مقاوم لعلامات التقدم في السن",
      "مجدد للبشرة"
    ],
    "cirStatus": "Safe with concentration limits (typically <= 1%)",
    "comedogenicRating": 0,
    "sensitizingPotential": "moderate",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "beneficial",
      "dry": "caution",
      "sensitive": "caution",
      "acneProne": "beneficial",
      "rosacea": "avoid",
      "pregnancySafe": false
    },
    "descriptionEn": "Pure Vitamin A. Proven to boost collagen synthesis, accelerate cellular turnover, reduce hyperpigmentation, and unclog pores. Requires acclimation and daily SPF.",
    "descriptionAr": "الشكل النقي لفيتامين A. يحفز إنتاج الكولاجين وتسريع تجدد الخلايا ومكافحة التجاعيد. قد يسبب جفافاً وتقشيراً مؤقتاً ويتطلب واقياً شمسياً صارماً. غير مناسب أثناء الحمل.",
    "synonyms": [
      "vitamin a",
      "all-trans-retinol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_retinal",
    "inciName": "Retinal",
    "normalizedName": "retinal",
    "casNumber": "116-31-4",
    "category": [
      "active",
      "retinoid",
      "anti_aging",
      "antibacterial"
    ],
    "functions": [
      "Cell renewing",
      "Anti-aging",
      "Antibacterial"
    ],
    "functionsAr": [
      "مجدد للخلايا",
      "مكافح للتجاعيد",
      "مضاد للبكتيريا المسببة لحب الشباب"
    ],
    "cirStatus": "Safe in cosmetic use",
    "comedogenicRating": 0,
    "sensitizingPotential": "moderate",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "beneficial",
      "dry": "caution",
      "sensitive": "caution",
      "acneProne": "beneficial",
      "rosacea": "avoid",
      "pregnancySafe": false
    },
    "descriptionEn": "Retinaldehyde is a precursor to retinoic acid that requires only one conversion step. It acts faster than retinol with lower irritation and direct antibacterial action against C. acnes.",
    "descriptionAr": "ريتينالديهيد؛ يسبق حمض الريتينويك بخطوة تحول واحدة فقط مما يجعله أسرع مفعولاً من الريتينول مع قدرة مضادة لبكتيريا حب الشباب.",
    "synonyms": [
      "retinaldehyde",
      "vitamin a aldehyde"
    ],
    "sources": [
      {
        "sourceId": "PUBMED_NCBI",
        "sourceName": "PubMed Derm Research",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_bakuchiol",
    "inciName": "Bakuchiol",
    "normalizedName": "bakuchiol",
    "casNumber": "10309-37-2",
    "category": [
      "active",
      "antioxidant",
      "anti_aging"
    ],
    "functions": [
      "Antioxidant",
      "Skin conditioning",
      "Anti-inflammatory"
    ],
    "functionsAr": [
      "مضاد للأكسدة",
      "بديل لطيف للريتينول",
      "مهدئ للالتهاب"
    ],
    "cirStatus": "Safe in cosmetic formulations",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "beneficial",
      "acneProne": "beneficial",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Plant-derived meroterpene from Psoralea corylifolia. Stimulates collagen expression similarly to retinol without provoking significant desquamation or photosensitivity.",
    "descriptionAr": "مستخلص نباتي طبيعي يماثل نشاط الريتينول في تحفيز الكولاجين دون التسبب في التهيج أو التحسس الضوئي، ومناسب للبشرة الحساسة وللحوامل.",
    "synonyms": [
      "sytenol a"
    ],
    "sources": [
      {
        "sourceId": "PUBMED_NCBI",
        "sourceName": "PubMed Derm Research",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_ascorbic_acid",
    "inciName": "Ascorbic Acid",
    "normalizedName": "ascorbic acid",
    "casNumber": "50-81-7",
    "category": [
      "active",
      "vitamin",
      "antioxidant",
      "brightening"
    ],
    "functions": [
      "Antioxidant",
      "Skin lightening",
      "Collagen booster"
    ],
    "functionsAr": [
      "مضاد قوي للأكسدة",
      "تفتيح وتوحيد لون البشرة",
      "تحفيز الكولاجين"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "moderate",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "beneficial",
      "dry": "safe",
      "sensitive": "caution",
      "acneProne": "safe",
      "rosacea": "caution",
      "pregnancySafe": true
    },
    "descriptionEn": "L-Ascorbic Acid is biologically active Vitamin C. Neutralizes free radicals, mitigates photo-damage, and inhibits tyrosinase. Requires formulation at low pH (< 3.5) which may cause transient tingling.",
    "descriptionAr": "فيتامين C النقي (L-Ascorbic Acid). مضاد أكسدة استثنائي يحفز الكولاجين ويفتح التصبغات. يحتاج درجة حموضة منخفضة قد تسبب وخزاً للبشرة الحساسة.",
    "synonyms": [
      "l-ascorbic acid",
      "vitamin c"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_ascorbyl_glucoside",
    "inciName": "Ascorbyl Glucoside",
    "normalizedName": "ascorbyl glucoside",
    "casNumber": "129499-78-1",
    "category": [
      "active",
      "vitamin",
      "antioxidant",
      "brightening"
    ],
    "functions": [
      "Antioxidant",
      "Skin brightening",
      "Stable Vitamin C derivative"
    ],
    "functionsAr": [
      "مشتق مستقر لفيتامين سي",
      "تفتيح لطيف",
      "مضاد للأكسدة"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "beneficial",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Glucose-stabilized form of Vitamin C. Converts to pure ascorbic acid gradually in the skin, providing antioxidant and brightening benefits at a neutral, non-irritating pH.",
    "descriptionAr": "مشتق جلوكوزي مستقر من فيتامين C، يتحلل داخل الجلد تدريجياً ليعطي فوائد فيتامين C دون إثارة تهيج، ومناسب للبشرة الحساسة.",
    "synonyms": [
      "aa2g",
      "vitamin c glucoside"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_ethyl_ascorbic_acid",
    "inciName": "3-O-Ethyl Ascorbic Acid",
    "normalizedName": "3-o-ethyl ascorbic acid",
    "casNumber": "86404-04-8",
    "category": [
      "active",
      "vitamin",
      "antioxidant",
      "brightening"
    ],
    "functions": [
      "Antioxidant",
      "Depigmenting",
      "Stable Vitamin C derivative"
    ],
    "functionsAr": [
      "مشتق ثابت من فيتامين سي",
      "تفتيح التصبغات",
      "مضاد أكسدة"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "beneficial",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Lipophilic and hydrophilic etherified derivative of ascorbic acid. Demonstrates superior stability against heat and light with high dermal absorption.",
    "descriptionAr": "مشتق إيثر عالي الاستقرار والامتصاص الجلدي من فيتامين C، يقاوم الأكسدة والضوء ويعمل بفاعلية على توحيد لون البشرة.",
    "synonyms": [
      "ethyl ascorbic acid",
      "eac"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_azelaic_acid",
    "inciName": "Azelaic Acid",
    "normalizedName": "azelaic acid",
    "casNumber": "123-99-1",
    "category": [
      "active",
      "dicarboxylic_acid",
      "anti_acne",
      "brightening",
      "anti_redness"
    ],
    "functions": [
      "Anti-inflammatory",
      "Antimicrobial",
      "Tyrosinase inhibitor",
      "Keratolytic"
    ],
    "functionsAr": [
      "مضاد للالتهاب",
      "مكافح لحب الشباب",
      "مثبط للتصبغات",
      "مهدئ لاحمرار الوردية"
    ],
    "cirStatus": "Safe in cosmetic use",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "beneficial",
      "dry": "safe",
      "sensitive": "beneficial",
      "acneProne": "beneficial",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Naturally occurring dicarboxylic acid. Selectively targets abnormal melanocytes, inhibits 5-alpha reductase, reduces C. acnes colonization, and is first-line for rosacea and post-inflammatory erythema.",
    "descriptionAr": "حمض ثنائي الكربوكسيل طبيعي؛ مثالي للبشرة المعرضة لحب الشباب والوردية وفرط التصبغ، آمن أثناء فترة الحمل والرضاعة.",
    "synonyms": [
      "nonanedioic acid"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_salicylic_acid",
    "inciName": "Salicylic Acid",
    "normalizedName": "salicylic acid",
    "casNumber": "69-72-7",
    "category": [
      "active",
      "bha",
      "exfoliant",
      "anti_acne"
    ],
    "functions": [
      "Keratolytic",
      "Pore-clearing",
      "Anti-inflammatory",
      "Sebum solubilizing"
    ],
    "functionsAr": [
      "مقشر كيميائي للدهون داخل المسام",
      "مضاد للالتهاب",
      "علاج الرؤوس السوداء"
    ],
    "cirStatus": "Safe when formulated to avoid irritation and when sun protection is recommended",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "beneficial",
      "dry": "caution",
      "sensitive": "caution",
      "acneProne": "beneficial",
      "rosacea": "caution",
      "pregnancySafe": false
    },
    "descriptionEn": "Lipophilic Beta Hydroxy Acid (BHA). Penetrates deep into the lipid-rich sebaceous pore lining to dissolve desquamated keratinocytes and sebum plugs.",
    "descriptionAr": "حمض بيتا هيدروكسي قابل للذوبان في الدهون؛ يتغلغل داخل المسام لتنظيف الدهون وخلايا الجلد الميتة وعلاج حب الشباب والرؤوس السوداء.",
    "synonyms": [
      "2-hydroxybenzoic acid",
      "bha"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_glycolic_acid",
    "inciName": "Glycolic Acid",
    "normalizedName": "glycolic acid",
    "casNumber": "79-14-1",
    "category": [
      "active",
      "aha",
      "exfoliant",
      "anti_aging"
    ],
    "functions": [
      "Alpha Hydroxy Acid",
      "Chemical exfoliant",
      "Humectant"
    ],
    "functionsAr": [
      "مقشر أحماض الفواكه AHA",
      "تحسين ملمس البشرة",
      "تحفيز الكولاجين"
    ],
    "cirStatus": "Safe when formulated at pH >= 3.5 with SPF recommendation",
    "comedogenicRating": 0,
    "sensitizingPotential": "moderate",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "beneficial",
      "dry": "safe",
      "sensitive": "caution",
      "acneProne": "safe",
      "rosacea": "avoid",
      "pregnancySafe": true
    },
    "descriptionEn": "The smallest molecular weight Alpha Hydroxy Acid (AHA). Penetrates readily to weaken corneocyte cohesion in the stratum corneum, brightening skin and boosting dermal hydration.",
    "descriptionAr": "حمض الألفا هيدروكسي الأصغر حجماً جزيئياً، يتغلغل في طبقات الجلد السطحية لتفتيت الروابط بين الخلايا الميتة وتحسين نضارة البشرة.",
    "synonyms": [
      "hydroxyacetic acid",
      "aha"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_lactic_acid",
    "inciName": "Lactic Acid",
    "normalizedName": "lactic acid",
    "casNumber": "50-21-5",
    "category": [
      "active",
      "aha",
      "exfoliant",
      "humectant"
    ],
    "functions": [
      "Humectant",
      "Exfoliant",
      "NMF component"
    ],
    "functionsAr": [
      "مرطب ومقشر لطيف",
      "عنصر من عوامل الترطيب الطبيعية NMF"
    ],
    "cirStatus": "Safe as used in cosmetics with pH and SPF directions",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "caution",
      "pregnancySafe": true
    },
    "descriptionEn": "Larger molecule than glycolic acid, offering gentler superficial exfoliation while uniquely acting as a natural moisturizing factor (NMF) humectant.",
    "descriptionAr": "حمض ألفا هيدروكسي لطيف أكبر حجماً من حمض الجليكوليك، يقشر بلطف شديد ويرطب البشرة كجزء من عامل الترطيب الطبيعي للبشرة.",
    "synonyms": [
      "2-hydroxypropanoic acid"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_mandelic_acid",
    "inciName": "Mandelic Acid",
    "normalizedName": "mandelic acid",
    "casNumber": "90-64-2",
    "category": [
      "active",
      "aha",
      "exfoliant",
      "brightening"
    ],
    "functions": [
      "Exfoliant",
      "Antibacterial",
      "Gentle AHA"
    ],
    "functionsAr": [
      "مقشر لطيف جداً",
      "مضاد للبكتيريا",
      "آمن للبشرة المعرضة للفرط التصبغي"
    ],
    "cirStatus": "Safe in cosmetic use",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "beneficial",
      "dry": "beneficial",
      "sensitive": "beneficial",
      "acneProne": "beneficial",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Aromatic AHA with double the molecular weight of glycolic acid. Penetrates slowly and evenly without triggering post-inflammatory hyperpigmentation in melanin-rich or sensitive skin.",
    "descriptionAr": "حمض فواكه بجزيء كبير يتغلغل ببطء وأمان دون التسبب في التهاب، وممتاز للبشرة الداكنة أو الحساسة المعرضة للحبوب.",
    "synonyms": [
      "amygdalic acid"
    ],
    "sources": [
      {
        "sourceId": "PUBMED_NCBI",
        "sourceName": "PubMed Derm Research",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_water",
    "inciName": "Water",
    "normalizedName": "water",
    "casNumber": "7732-18-5",
    "category": [
      "solvent",
      "vehicle"
    ],
    "functions": [
      "Solvent",
      "Vehicle",
      "Hydration base"
    ],
    "functionsAr": [
      "مذيب",
      "قاعدة سائلة للتركيبة"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Deionized or purified cosmetic water acting as the primary carrier and solvent in aqueous formulations.",
    "descriptionAr": "الماء النقي المقطر، المذيب والوسط الحامل الأساسي في تركيبات مستحضرات التجميل المائية.",
    "synonyms": [
      "aqua",
      "eau",
      "purified water",
      "deionized water"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_glycerin",
    "inciName": "Glycerin",
    "normalizedName": "glycerin",
    "casNumber": "56-81-5",
    "category": [
      "humectant",
      "hydration",
      "skin_identical"
    ],
    "functions": [
      "Humectant",
      "Skin protecting",
      "Barrier support"
    ],
    "functionsAr": [
      "مرطب جذب للماء",
      "حماية الحاجز الجلدي",
      "عنصر مطابق للبشرة"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "beneficial",
      "acneProne": "safe",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Gold standard cosmetic humectant. Draws ambient moisture and water from deep skin layers into the stratum corneum, stabilizing lipid structures and aquaporin channels.",
    "descriptionAr": "المعيار الذهبي لترطيب البشرة. يجذب جزيئات الماء إلى الطبقة القرنية ويعزز ليونة وحماية الجلد دون سد المسام.",
    "synonyms": [
      "glycerol",
      "propane-1,2,3-triol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_sodium_hyaluronate",
    "inciName": "Sodium Hyaluronate",
    "normalizedName": "sodium hyaluronate",
    "casNumber": "9067-32-7",
    "category": [
      "humectant",
      "hydration",
      "skin_identical"
    ],
    "functions": [
      "Humectant",
      "Skin conditioning",
      "Plumping"
    ],
    "functionsAr": [
      "مرطب فائق",
      "جذب الرطوبة 1000 ضعف وزنه",
      "ملء الخطوط السطحية"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "beneficial",
      "dry": "beneficial",
      "sensitive": "beneficial",
      "acneProne": "safe",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Sodium salt of hyaluronic acid. Binds up to 1,000 times its weight in water, promoting surface turgor, instant plumping, and moisture retention in the intercellular matrix.",
    "descriptionAr": "ملح الصوديوم لحمض الهيالورونيك؛ يرتبط بالماء بقدرة فائقة ليمنح البشرة امتلاءً وترطيباً عميقاً ومظهراً نضراً.",
    "synonyms": [
      "hyaluronic acid sodium salt"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_panthenol",
    "inciName": "Panthenol",
    "normalizedName": "panthenol",
    "casNumber": "81-13-0",
    "category": [
      "humectant",
      "soothing",
      "barrier_repair",
      "vitamin"
    ],
    "functions": [
      "Pro-vitamin B5",
      "Skin protectant",
      "Anti-inflammatory",
      "Wound healing support"
    ],
    "functionsAr": [
      "برو فيتامين B5",
      "مهدئ للجلد",
      "ترميم حاجز البشرة",
      "مضاد للتهيج"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "beneficial",
      "acneProne": "safe",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Pro-Vitamin B5. Rapidly converts to pantothenic acid in dermal tissue. Stimulates fibroblast proliferation, accelerates re-epithelialization, and soothes erythema.",
    "descriptionAr": "برو فيتامين B5؛ يتحول إلى حمض البانتوثنيك داخل الجلد لترميم الأنسجة وتهدئة الاحمرار وتخفيف التهابات البشرة التالفة.",
    "synonyms": [
      "d-panthenol",
      "provitamin b5",
      "dexpanthenol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_allantoin",
    "inciName": "Allantoin",
    "normalizedName": "allantoin",
    "casNumber": "97-59-6",
    "category": [
      "soothing",
      "skin_protectant",
      "keratolytic"
    ],
    "functions": [
      "Soothing agent",
      "Cell proliferation promoter",
      "Anti-irritant"
    ],
    "functionsAr": [
      "مهدئ للبشرة",
      "محفز لتجدد الأنسجة",
      "مضاد للتهيج"
    ],
    "cirStatus": "Safe as used in cosmetics (up to 2%)",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "beneficial",
      "acneProne": "safe",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Naturally found in comfrey root. Renowned for its calming, anti-irritant, and epithelial-stimulating properties. Softens stratum corneum keratin.",
    "descriptionAr": "مادة مهدئة فعالة تساعد على تخفيف الحكة والتهيج وتحفيز تكاثر الخلايا السليمة وتنعيم الجلد الخشن.",
    "synonyms": [
      "glyoxyldiureide"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_betaine",
    "inciName": "Betaine",
    "normalizedName": "betaine",
    "casNumber": "107-43-7",
    "category": [
      "humectant",
      "osmoprotectant"
    ],
    "functions": [
      "Osmolyte",
      "Moisturizer",
      "Anti-irritant"
    ],
    "functionsAr": [
      "منظم التوازن الأسموزي",
      "مرطب ناعم",
      "حماية الخلايا من الجفاف"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "beneficial",
      "acneProne": "safe",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Natural amino acid derivative functioning as an osmolyte to control cellular water balance under environmental stress.",
    "descriptionAr": "مشتق أحماض أمينية طبيعي من بنجر السكر، يحافظ على توازن الماء الخلوي ويقلل من تهيج المواد السطحية.",
    "synonyms": [
      "trimethylglycine"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_ceramide_np",
    "inciName": "Ceramide NP",
    "normalizedName": "ceramide np",
    "casNumber": "100403-19-8",
    "category": [
      "barrier_repair",
      "lipid",
      "skin_identical"
    ],
    "functions": [
      "Lipid replenishment",
      "Barrier strengthening",
      "TEWL reduction"
    ],
    "functionsAr": [
      "تعويض دهون البشرة",
      "تقوية الحاجز الوقائي",
      "منع فقدان الماء عبر الجلد"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "beneficial",
      "acneProne": "safe",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Ceramide 3; a crucial phytosphingosine-based lipid naturally comprising up to 50% of the stratum corneum barrier matrix. Prevents transepidermal water loss (TEWL).",
    "descriptionAr": "سيراميد 3؛ دهن مطابق لدهون البشرة الطبيعية يشكل دعامة الحاجز الوقائي ويمنع جفاف البشرة وتحسسها.",
    "synonyms": [
      "ceramide 3",
      "n-stearoyl phytosphingosine"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_ceramide_ap",
    "inciName": "Ceramide AP",
    "normalizedName": "ceramide ap",
    "casNumber": "100403-24-5",
    "category": [
      "barrier_repair",
      "lipid",
      "skin_identical"
    ],
    "functions": [
      "Barrier restoration",
      "Lipid replenishing"
    ],
    "functionsAr": [
      "ترميم حاجز البشرة",
      "تعزيز ترابط خلايا الجلد"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "beneficial",
      "acneProne": "safe",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Ceramide 6-II; alpha-hydroxy phytosphingosine lipid essential for desquamation regulation and barrier cohesion.",
    "descriptionAr": "سيراميد 6-II؛ يشارك في تنظيم تقشر خلايا البشرة الطبيعي والحفاظ على نعومة وتماسك سطح الجلد.",
    "synonyms": [
      "ceramide 6-ii"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_squalane",
    "inciName": "Squalane",
    "normalizedName": "squalane",
    "casNumber": "111-01-3",
    "category": [
      "emollient",
      "lipid",
      "skin_identical",
      "antioxidant"
    ],
    "functions": [
      "Emollient",
      "Skin conditioning",
      "Biocompatible oil"
    ],
    "functionsAr": [
      "مرطب مطري",
      "زيت حيوي مطابق لدهون البشرة",
      "غير ساد للمسام"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 1,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "beneficial",
      "dry": "beneficial",
      "sensitive": "beneficial",
      "acneProne": "beneficial",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Hydrogenated, 100% stable version of squalene (a natural component of human sebum). Exceptionally lightweight, biomimetic emollient with low comedogenicity.",
    "descriptionAr": "مركب هيدروجيني ثابت من السكوالين الطبيعي الموجود في دهون البشرة؛ سريع الامتصاص، غير دهني، يرطب بعمق ولا يسبب انسداد المسام.",
    "synonyms": [
      "hydrogenated squalene",
      "plant squalane"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_cholesterol",
    "inciName": "Cholesterol",
    "normalizedName": "cholesterol",
    "casNumber": "57-88-5",
    "category": [
      "barrier_repair",
      "lipid",
      "skin_identical"
    ],
    "functions": [
      "Skin conditioning",
      "Emollient",
      "Barrier lipid"
    ],
    "functionsAr": [
      "دهن طبيعي مطابق للجلد",
      "ترميم الغشاء الخلوي"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "beneficial",
      "acneProne": "safe",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Essential lipid constituting approximately 25% of stratum corneum intercellular lamellae. Works in synergy with ceramides and free fatty acids.",
    "descriptionAr": "أحد الدهون الثلاثية الأساسية المكونة لحاجز البشرة الطبيعي بجانب السيراميد والأحماض الدهنية الحرة.",
    "synonyms": [
      "cholesterin"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_caprylic_capric_triglyceride",
    "inciName": "Caprylic/Capric Triglyceride",
    "normalizedName": "caprylic/capric triglyceride",
    "casNumber": "65381-09-1",
    "category": [
      "emollient",
      "lipid"
    ],
    "functions": [
      "Emollient",
      "Skin softening",
      "Dispersing agent"
    ],
    "functionsAr": [
      "مطري خفيف",
      "تنعيم ملمس البشرة",
      "مذيب حامل للمواد الفعالة"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 1,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Mixed triester derived from coconut oil and glycerin. Silky, non-greasy emollient with exceptional oxidative stability and excellent skin tolerance.",
    "descriptionAr": "مزيج دهني ناعم مشتق من زيت جوز الهند والجلسرين، يمنح نعومة مخملية دون ملمس دهني ثقيل.",
    "synonyms": [
      "fractionated coconut oil",
      "mct oil"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_shea_butter",
    "inciName": "Butyrospermum Parkii (Shea) Butter",
    "normalizedName": "butyrospermum parkii (shea) butter",
    "casNumber": "91080-23-8",
    "category": [
      "emollient",
      "plant_extract",
      "barrier_repair"
    ],
    "functions": [
      "Rich emollient",
      "Skin conditioning",
      "Anti-inflammatory"
    ],
    "functionsAr": [
      "زبدة شيا مرطبة غنية",
      "تغذية البشرة شديدة الجفاف",
      "حماية الحاجز الجلدي"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 2,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "caution",
      "dry": "beneficial",
      "sensitive": "beneficial",
      "acneProne": "caution",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Vegetable fat extracted from the African karite tree. High in stearic and oleic fatty acids plus unsaponifiables like triterpenes that soothe inflamed or dry skin.",
    "descriptionAr": "زبدة الشيا الغنية بالأحماض الدهنية ومضادات الالتهاب الطبيعية، مثالية للبشرة الجافة والمتشققة، مع توخي الحذر لأصحاب المسام سريعة الانسداد.",
    "synonyms": [
      "shea butter",
      "butyrospermum parkii butter"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_jojoba_oil",
    "inciName": "Simmondsia Chinensis (Jojoba) Seed Oil",
    "normalizedName": "simmondsia chinensis (jojoba) seed oil",
    "casNumber": "90045-98-0",
    "category": [
      "emollient",
      "plant_extract",
      "lipid"
    ],
    "functions": [
      "Wax ester emollient",
      "Sebum mimic",
      "Non-comedogenic oil"
    ],
    "functionsAr": [
      "إستر شمعي مطابق لدهون البشرة",
      "موازن للزهم",
      "تغذية خفيفة"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 2,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "beneficial",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Liquid wax ester chemically similar to human sebum. Balances oily skin while restoring moisture to compromised dry barriers.",
    "descriptionAr": "زيت الجوجوبا؛ مركب إستر شمعي يشبه إفرازات الجلد الدهنية الطبيعية مما يساعد في موازنة إفراز الدهون وترطيب البشرة.",
    "synonyms": [
      "jojoba oil",
      "simmondsia chinensis oil"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_centella_asiatica",
    "inciName": "Centella Asiatica Extract",
    "normalizedName": "centella asiatica extract",
    "casNumber": "84696-21-9",
    "category": [
      "botanical",
      "soothing",
      "anti_inflammatory",
      "wound_healing"
    ],
    "functions": [
      "Soothing agent",
      "Wound healing",
      "Antioxidant",
      "Microcirculation support"
    ],
    "functionsAr": [
      "مستخلص سيكا مهدئ",
      "ترميم الجروح وحروق الشمس",
      "مكافحة الالتهاب"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "beneficial",
      "acneProne": "beneficial",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Cica / Gotu Kola extract rich in madecassoside and asiatic acid. Demonstrates clinically verified benefits for downregulating inflammatory cytokines and promoting collagen type I synthesis.",
    "descriptionAr": "مستخلص نبتة السيكا (سنتيللا اسياتيكا) المشهور بقدرته الفائقة على تهدئة التهيج، وترميم حاجز البشرة المتضرر، وتقليل الاحمرار.",
    "synonyms": [
      "gotu kola extract",
      "cica extract"
    ],
    "sources": [
      {
        "sourceId": "PUBMED_NCBI",
        "sourceName": "PubMed Derm Research",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_madecassoside",
    "inciName": "Madecassoside",
    "normalizedName": "madecassoside",
    "casNumber": "34540-22-2",
    "category": [
      "active",
      "botanical_isolate",
      "soothing",
      "wound_healing"
    ],
    "functions": [
      "Calming active",
      "Anti-inflammatory",
      "Collagen booster"
    ],
    "functionsAr": [
      "مادة فعالة نقية من السيكا",
      "علاج التهيج الشديد",
      "تحفيز الكولاجين"
    ],
    "cirStatus": "Safe in cosmetic use",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "beneficial",
      "acneProne": "beneficial",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Purified triterpenoid glycoside from Centella Asiatica. Significantly suppresses nitric oxide and pro-inflammatory PGE2 synthesis.",
    "descriptionAr": "مركب ثلاثي التربين النقي المعزول من نبات السيكا، يتميز بفاعلية استثنائية في قمع الالتهابات وتسريع تعافي البشرة الحساسة.",
    "synonyms": [
      "cica isolate"
    ],
    "sources": [
      {
        "sourceId": "PUBMED_NCBI",
        "sourceName": "PubMed Derm Research",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_green_tea",
    "inciName": "Camellia Sinensis Leaf Extract",
    "normalizedName": "camellia sinensis leaf extract",
    "casNumber": "84650-60-2",
    "category": [
      "botanical",
      "antioxidant",
      "soothing"
    ],
    "functions": [
      "Antioxidant",
      "Astringent",
      "Skin protecting",
      "Sebum reducing"
    ],
    "functionsAr": [
      "مستخلص الشاي الأخضر",
      "مضاد أكسدة غني بـ EGCG",
      "تهدئة الاحمرار وتقليل الدهون"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "beneficial",
      "dry": "safe",
      "sensitive": "beneficial",
      "acneProne": "beneficial",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Green tea extract packed with epigallocatechin gallate (EGCG). Potent scavenger of free radicals, reduces skin sebum excretion, and soothes inflammatory rosacea.",
    "descriptionAr": "مستخلص أوراق الشاي الأخضر؛ غني بمركبات البوليفينول و EGCG المضادة للأكسدة والتي تساعد على تهدئة البشرة وتخفيف الالتهاب.",
    "synonyms": [
      "green tea extract",
      "camellia sinensis extract"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_licorice_extract",
    "inciName": "Glycyrrhiza Glabra (Licorice) Root Extract",
    "normalizedName": "glycyrrhiza glabra (licorice) root extract",
    "casNumber": "84775-66-6",
    "category": [
      "botanical",
      "brightening",
      "soothing"
    ],
    "functions": [
      "Skin brightening",
      "Anti-inflammatory",
      "Antioxidant"
    ],
    "functionsAr": [
      "مستخلص العرقسوس",
      "تفتيح التصبغات",
      "مضاد للالتهاب والاحمرار"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "beneficial",
      "dry": "safe",
      "sensitive": "beneficial",
      "acneProne": "beneficial",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Contains glabridin and liquiritin. Disperses existing melanin clusters and inhibits tyrosinase without cytotoxicity, calming redness and fading dark spots.",
    "descriptionAr": "مستخلص جذر العرقسوس؛ يحتوي على الجلابريدين الذي يثبط إنزيم التيروزيناز ويساعد في تفتيح البقع الداكنة وتهدئة احمرار البشرة.",
    "synonyms": [
      "licorice root extract",
      "glycyrrhiza glabra extract"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_zinc_pca",
    "inciName": "Zinc PCA",
    "normalizedName": "zinc pca",
    "casNumber": "15454-75-8",
    "category": [
      "active",
      "mineral",
      "anti_acne",
      "sebum_control"
    ],
    "functions": [
      "Sebum regulator",
      "Antimicrobial",
      "Astringent",
      "Hydrating"
    ],
    "functionsAr": [
      "تنظيم إفراز الزهم",
      "مكافحة بكتيريا حب الشباب",
      "ترطيب خفيف"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "beneficial",
      "dry": "caution",
      "sensitive": "safe",
      "acneProne": "beneficial",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Zinc salt of Pyrrolidone Carboxylic Acid. Combines the sebum-normalizing and antibacterial power of zinc with the natural humectancy of PCA.",
    "descriptionAr": "ملح الزنك لحمض البيروليدون كربوكسيليك؛ يقلل إفراز الدهون الزائدة ويحد من تكاثر البكتيريا المسببة للبثور مع الحفاظ على ترطيب البشرة.",
    "synonyms": [
      "zinc l-pca"
    ],
    "sources": [
      {
        "sourceId": "EU_COSING",
        "sourceName": "EU CosIng Database",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_acetyl_hexapeptide_8",
    "inciName": "Acetyl Hexapeptide-8",
    "normalizedName": "acetyl hexapeptide-8",
    "casNumber": "616204-22-9",
    "category": [
      "peptide",
      "anti_aging"
    ],
    "functions": [
      "Expression line relaxation",
      "Peptide signal"
    ],
    "functionsAr": [
      "ببتيد تخفيف خطوط التعبير",
      "شد تجاعيد الجبهة وحول العينين"
    ],
    "cirStatus": "Safe in cosmetic use",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Argireline; synthetic peptide modulating neurotransmitter release at the neuromuscular junction, visibly relaxing facial tension lines.",
    "descriptionAr": "ببتيد الأرجيرلين الشهير؛ يقلل من تقلص عضلات الوجه التعبيرية السطحية للمساعدة في تنعيم خطوط الجبهة والتجاعيد الدقيقة.",
    "synonyms": [
      "argireline",
      "acetyl hexapeptide-3"
    ],
    "sources": [
      {
        "sourceId": "PUBMED_NCBI",
        "sourceName": "PubMed Derm Research",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_palmitoyl_tripeptide_1",
    "inciName": "Palmitoyl Tripeptide-1",
    "normalizedName": "palmitoyl tripeptide-1",
    "casNumber": "147732-56-7",
    "category": [
      "peptide",
      "anti_aging",
      "barrier_repair"
    ],
    "functions": [
      "Collagen stimulation",
      "Matrix repair"
    ],
    "functionsAr": [
      "تحفيز إنتاج الكولاجين",
      "ترميم مصفوفة الجلد"
    ],
    "cirStatus": "Safe in cosmetic use",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Messenger peptide (Pal-GHK) acting on dermal fibroblasts to stimulate neocollagenesis, fibronectin, and hyaluronic acid synthesis.",
    "descriptionAr": "ببتيد إشاري يحفز الخلايا الليفية على إنتاج الكولاجين والإيلاستين وحمض الهيالورونيك لدعم مرونة وكثافة الجلد.",
    "synonyms": [
      "pal-ghk",
      "matrixyl component"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_copper_tripeptide_1",
    "inciName": "Copper Tripeptide-1",
    "normalizedName": "copper tripeptide-1",
    "casNumber": "89030-95-5",
    "category": [
      "peptide",
      "wound_healing",
      "anti_aging"
    ],
    "functions": [
      "Tissue remodeling",
      "Collagen booster",
      "Antioxidant enzyme co-factor"
    ],
    "functionsAr": [
      "ببتيد النحاس",
      "ترميم الأنسجة والندبات",
      "تحفيز الكولاجين"
    ],
    "cirStatus": "Safe in cosmetic use",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "safe",
      "acneProne": "beneficial",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "GHK-Cu complex. Promotes wound healing, supports skin remodeling, increases decorin expression, and neutralizes reactive oxygen species.",
    "descriptionAr": "ببتيد النحاس GHK-Cu؛ يساعد على تعافي الأنسجة وإعادة بناء مصفوفة الكولاجين وتحسين مرونة الجلد والندبات.",
    "synonyms": [
      "ghk-cu",
      "copper peptide"
    ],
    "sources": [
      {
        "sourceId": "PUBMED_NCBI",
        "sourceName": "PubMed Derm Research",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_zinc_oxide",
    "inciName": "Zinc Oxide",
    "normalizedName": "zinc oxide",
    "casNumber": "1314-13-2",
    "category": [
      "sunscreen",
      "mineral",
      "soothing"
    ],
    "functions": [
      "Broad-spectrum UV filter",
      "Skin protectant",
      "Anti-inflammatory"
    ],
    "functionsAr": [
      "واقي شمس فيزيائي واسع المدى",
      "حماية من UVA و UVB",
      "مهدئ للبشرة"
    ],
    "cirStatus": "Safe as used in cosmetics (up to 25%)",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "beneficial",
      "acneProne": "beneficial",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Inorganic mineral sunscreen filter providing broad spectrum photoprotection against UVA1, UVA2, and UVB rays. Non-irritating and ideal for reactive skin.",
    "descriptionAr": "واقي شمس معدني فيزيائي واسع الطيف، يعكس أشعة UVA و UVB دون امتصاصه في الجلد، مثالي لأصحاب البشرة الحساسة والأطفال والحوامل.",
    "synonyms": [
      "ci 77947",
      "mineral uv filter"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_titanium_dioxide",
    "inciName": "Titanium Dioxide",
    "normalizedName": "titanium dioxide",
    "casNumber": "13463-67-7",
    "category": [
      "sunscreen",
      "mineral",
      "colorant"
    ],
    "functions": [
      "UVB/UVA2 filter",
      "Opacifying agent",
      "Mineral colorant"
    ],
    "functionsAr": [
      "واقي شمس فيزيائي",
      "مشتت لأشعة UVB و UVA2",
      "مادة مبيضة ومعتمة"
    ],
    "cirStatus": "Safe as used in topical lotions; avoid inhalation aerosols",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "beneficial",
      "acneProne": "safe",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Inorganic mineral UV filter with high refractive index. Highly effective against UVB and short UVA wavelengths with zero irritation potential on intact skin.",
    "descriptionAr": "معدن طبيعي واقٍ من أشعة الشمس، يمنح حماية ممتازة من حروق الشمس وأشعة UVB السطحية.",
    "synonyms": [
      "ci 77891",
      "titania"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_avobenzone",
    "inciName": "Butyl Methoxydibenzoylmethane",
    "normalizedName": "butyl methoxydibenzoylmethane",
    "casNumber": "70356-09-1",
    "category": [
      "sunscreen",
      "chemical_filter"
    ],
    "functions": [
      "UVA absorber",
      "Photoprotection"
    ],
    "functionsAr": [
      "واقي شمس كيميائي لامتصاص أشعة UVA الطويلة"
    ],
    "cirStatus": "Safe as used in sunscreen formulations (up to 3-5%)",
    "comedogenicRating": 0,
    "sensitizingPotential": "moderate",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "caution",
      "acneProne": "safe",
      "rosacea": "caution",
      "pregnancySafe": true
    },
    "descriptionEn": "Avobenzone; organic UV filter absorbing UVA radiation across 310–400 nm. Must be photostabilized with octocrylene or bis-ethylhexyloxyphenol methoxyphenyl triazine.",
    "descriptionAr": "أفوبنزون؛ فلتر كيميائي عضوي يمتص أشعة UVA العميقة، يحتاج إلى مثبتات ضوئية لضمان ثبات فعاليته تحت أشعة الشمس.",
    "synonyms": [
      "avobenzone",
      "parsols 1789"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_phenoxyethanol",
    "inciName": "Phenoxyethanol",
    "normalizedName": "phenoxyethanol",
    "casNumber": "122-99-6",
    "category": [
      "preservative"
    ],
    "functions": [
      "Antimicrobial preservative"
    ],
    "functionsAr": [
      "مادة حافظة واسعة المدى",
      "مضاد للبكتيريا والفطريات"
    ],
    "cirStatus": "Safe as used in cosmetics up to 1.0%",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Glycol ether antimicrobial preservative widely used as a gentle alternative to parabens and formaldehyde-releasers. Strictly limited to 1% in cosmetic products.",
    "descriptionAr": "مادة حافظة عالمية واسعة المدى معتمدة حتى تركيز 1% كبديل آمن للبارابين، تحمي المستحضر من التلوث البكتيري والعفن.",
    "synonyms": [
      "2-phenoxyethanol",
      "ethylene glycol monophenyl ether"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_ethylhexylglycerin",
    "inciName": "Ethylhexylglycerin",
    "normalizedName": "ethylhexylglycerin",
    "casNumber": "70445-33-9",
    "category": [
      "preservative_booster",
      "humectant",
      "deodorant"
    ],
    "functions": [
      "Preservative booster",
      "Deodorant active",
      "Skin conditioning"
    ],
    "functionsAr": [
      "معزز للمواد الحافظة",
      "مطري ومرطب للبشرة"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Alkyl glyceryl ether. Enhances the antimicrobial efficacy of phenoxyethanol and other preservatives while contributing emollience.",
    "descriptionAr": "مشتق جلسرين يعزز نشاط المواد الحافظة مما يتيح تقليل نسبتها، ويمنح ترطيباً ونعومة للجلد.",
    "synonyms": [
      "octoxyglycerin"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_tocopherol",
    "inciName": "Tocopherol",
    "normalizedName": "tocopherol",
    "casNumber": "59-02-9",
    "category": [
      "vitamin",
      "antioxidant"
    ],
    "functions": [
      "Antioxidant",
      "Lipid protection",
      "Formula stabilizer"
    ],
    "functionsAr": [
      "فيتامين E النقي",
      "مضاد أكسدة لحماية دهون البشرة والتركيبة"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 2,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Natural Vitamin E. Inhibits lipid peroxidation in cell membranes and protects unsaturated oils in formulations against rancidity.",
    "descriptionAr": "فيتامين E الطبيعي، يحمي خلايا الجلد من الأكسدة ويحفظ الزيوت التجميلية من التزنخ.",
    "synonyms": [
      "vitamin e",
      "alpha-tocopherol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_dimethicone",
    "inciName": "Dimethicone",
    "normalizedName": "dimethicone",
    "casNumber": "9006-65-9",
    "category": [
      "silicone",
      "emollient",
      "skin_protectant"
    ],
    "functions": [
      "Skin protectant",
      "Anti-foaming",
      "Slip agent",
      "Occlusive"
    ],
    "functionsAr": [
      "سيليكون واقٍ للبشرة",
      "حبس الرطوبة",
      "إعطاء ملمس حريري مخملي"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 1,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "beneficial",
      "sensitive": "beneficial",
      "acneProne": "safe",
      "rosacea": "beneficial",
      "pregnancySafe": true
    },
    "descriptionEn": "Linear polydimethylsiloxane polymer. Creates a breathable, non-comedogenic physical shield that prevents moisture loss and cushions sensitive skin from irritants.",
    "descriptionAr": "بوليمر سيليكوني خامل وغير ساد للمسام؛ يشكل طبقة حماية عازلة ناعمة تمنع جفاف البشرة دون أن تخترق طبقات الجلد الحية.",
    "synonyms": [
      "polydimethylsiloxane",
      "pdms"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_carbomer",
    "inciName": "Carbomer",
    "normalizedName": "carbomer",
    "casNumber": "9007-20-9",
    "category": [
      "thickener",
      "polymer",
      "texture"
    ],
    "functions": [
      "Viscosity controlling",
      "Emulsion stabilizing",
      "Gel former"
    ],
    "functionsAr": [
      "مثخن للجل",
      "مثبت للاستحلاب",
      "ضبط قوام التركيبة"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Cross-linked polyacrylic acid polymer yielding sparkling clear, non-tacky gel textures upon neutralization with a mild base.",
    "descriptionAr": "بوليمر حمض البولي أكريليك، يستخدم لتحويل السوائل إلى جل شفاف خفيف القوام وسريع الامتصاص.",
    "synonyms": [
      "polyacrylic acid",
      "carboxypolymethylene"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_xanthan_gum",
    "inciName": "Xanthan Gum",
    "normalizedName": "xanthan gum",
    "casNumber": "11138-66-2",
    "category": [
      "thickener",
      "botanical_ferment"
    ],
    "functions": [
      "Viscosity increasing",
      "Emulsion stabilizer",
      "Natural binder"
    ],
    "functionsAr": [
      "صمغ الزانثان الطبيعي",
      "تثخين القوام وتثبيت المستحلب"
    ],
    "cirStatus": "Safe as used in cosmetics",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Natural polysaccharide created via the fermentation of glucose or sucrose by Xanthomonas campestris.",
    "descriptionAr": "سكريات طبيعية متعددة تنتج عن تخمير الجلوكوز، تعمل على تثبيت القوام بدون لزوجة مزعجة.",
    "synonyms": [
      "bacterial polysaccharide gum"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_gluconolactone",
    "inciName": "Gluconolactone",
    "normalizedName": "gluconolactone",
    "casNumber": "3778-22-3",
    "category": [
      "pha",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Polyhydroxy acid PHA"
    ],
    "functionsAr": [
      "Polyhydroxy acid PHA"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Polyhydroxy acid PHA, gentle exfoliant, humectant",
    "descriptionAr": "Polyhydroxy acid PHA, gentle exfoliant, humectant",
    "synonyms": [
      "pha",
      "gluconic acid lactone"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_lactobionic_acid",
    "inciName": "Lactobionic Acid",
    "normalizedName": "lactobionic acid",
    "casNumber": "96-82-2",
    "category": [
      "pha",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Bionic PHA"
    ],
    "functionsAr": [
      "Bionic PHA"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Bionic PHA, antioxidant, powerful water binder",
    "descriptionAr": "Bionic PHA, antioxidant, powerful water binder",
    "synonyms": [
      "bionic acid"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_tranexamic_acid",
    "inciName": "Tranexamic Acid",
    "normalizedName": "tranexamic acid",
    "casNumber": "1197-18-8",
    "category": [
      "active",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Plasmin inhibitor"
    ],
    "functionsAr": [
      "Plasmin inhibitor"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Plasmin inhibitor, targets melasma and UV hyperpigmentation",
    "descriptionAr": "Plasmin inhibitor, targets melasma and UV hyperpigmentation",
    "synonyms": [
      "t-amcha"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_kojic_acid",
    "inciName": "Kojic Acid",
    "normalizedName": "kojic acid",
    "casNumber": "501-30-4",
    "category": [
      "active",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Tyrosinase inhibitor"
    ],
    "functionsAr": [
      "Tyrosinase inhibitor"
    ],
    "cirStatus": "Safe up to 1%",
    "comedogenicRating": 0,
    "sensitizingPotential": "moderate",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "caution",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Tyrosinase inhibitor, skin lightener",
    "descriptionAr": "Tyrosinase inhibitor, skin lightener",
    "synonyms": [
      "5-hydroxy-2-(hydroxymethyl)-4-pyrone"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_alpha_arbutin",
    "inciName": "Alpha-Arbutin",
    "normalizedName": "alpha-arbutin",
    "casNumber": "84380-01-8",
    "category": [
      "active",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Biosynthetic alpha-glucoside"
    ],
    "functionsAr": [
      "Biosynthetic alpha-glucoside"
    ],
    "cirStatus": "Safe up to 2%",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Biosynthetic alpha-glucoside, hydroquinone derivative with slow release",
    "descriptionAr": "Biosynthetic alpha-glucoside, hydroquinone derivative with slow release",
    "synonyms": [
      "4-hydroxyphenyl alpha-d-glucopyranoside"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_succinic_acid",
    "inciName": "Succinic Acid",
    "normalizedName": "succinic acid",
    "casNumber": "110-15-6",
    "category": [
      "active",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Antimicrobial dicarboxylic acid"
    ],
    "functionsAr": [
      "Antimicrobial dicarboxylic acid"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Antimicrobial dicarboxylic acid, cellular renewal",
    "descriptionAr": "Antimicrobial dicarboxylic acid, cellular renewal",
    "synonyms": [
      "butanedioic acid"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_tartaric_acid",
    "inciName": "Tartaric Acid",
    "normalizedName": "tartaric acid",
    "casNumber": "87-69-4",
    "category": [
      "aha",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Wine-derived AHA"
    ],
    "functionsAr": [
      "Wine-derived AHA"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Wine-derived AHA, pH regulator and exfoliant",
    "descriptionAr": "Wine-derived AHA, pH regulator and exfoliant",
    "synonyms": [
      "dihydroxysuccinic acid"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_citric_acid",
    "inciName": "Citric Acid",
    "normalizedName": "citric acid",
    "casNumber": "77-92-9",
    "category": [
      "aha",
      "cosmetic_ingredient"
    ],
    "functions": [
      "AHA and chelating pH adjuster"
    ],
    "functionsAr": [
      "AHA and chelating pH adjuster"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "AHA and chelating pH adjuster",
    "descriptionAr": "AHA and chelating pH adjuster",
    "synonyms": [
      "2-hydroxypropane-1,2,3-tricarboxylic acid"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_malic_acid",
    "inciName": "Malic Acid",
    "normalizedName": "malic acid",
    "casNumber": "6915-15-7",
    "category": [
      "aha",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Apple-derived AHA"
    ],
    "functionsAr": [
      "Apple-derived AHA"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Apple-derived AHA, gentle cell renewal",
    "descriptionAr": "Apple-derived AHA, gentle cell renewal",
    "synonyms": [
      "hydroxysuccinic acid"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_hydrolyzed_sodium_hyaluronate",
    "inciName": "Hydrolyzed Sodium Hyaluronate",
    "normalizedName": "hydrolyzed sodium hyaluronate",
    "casNumber": "9067-32-7",
    "category": [
      "humectant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Ultra low molecular weight hyaluronic acid"
    ],
    "functionsAr": [
      "Ultra low molecular weight hyaluronic acid"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Ultra low molecular weight hyaluronic acid",
    "descriptionAr": "Ultra low molecular weight hyaluronic acid",
    "synonyms": [
      "mini ha"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_polyglutamic_acid",
    "inciName": "Polyglutamic Acid",
    "normalizedName": "polyglutamic acid",
    "casNumber": "25513-46-6",
    "category": [
      "humectant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Natto-derived polymer holding up to 5x more water than HA"
    ],
    "functionsAr": [
      "Natto-derived polymer holding up to 5x more water than HA"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Natto-derived polymer holding up to 5x more water than HA",
    "descriptionAr": "Natto-derived polymer holding up to 5x more water than HA",
    "synonyms": [
      "gamma-pga"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_sodium_pca",
    "inciName": "Sodium PCA",
    "normalizedName": "sodium pca",
    "casNumber": "28874-51-3",
    "category": [
      "humectant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Naturally occurring component of skin NMF"
    ],
    "functionsAr": [
      "Naturally occurring component of skin NMF"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Naturally occurring component of skin NMF",
    "descriptionAr": "Naturally occurring component of skin NMF",
    "synonyms": [
      "sodium pyroglutamate"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_urea",
    "inciName": "Urea",
    "normalizedName": "urea",
    "casNumber": "57-13-6",
    "category": [
      "humectant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Skin-identical NMF component"
    ],
    "functionsAr": [
      "Skin-identical NMF component"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Skin-identical NMF component, humectant and mild keratolytic",
    "descriptionAr": "Skin-identical NMF component, humectant and mild keratolytic",
    "synonyms": [
      "carbamide"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_trehalose",
    "inciName": "Trehalose",
    "normalizedName": "trehalose",
    "casNumber": "99-20-7",
    "category": [
      "humectant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Disaccharide osmoprotectant"
    ],
    "functionsAr": [
      "Disaccharide osmoprotectant"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Disaccharide osmoprotectant, cellular water retention",
    "descriptionAr": "Disaccharide osmoprotectant, cellular water retention",
    "synonyms": [
      "mycose"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_sodium_lactate",
    "inciName": "Sodium Lactate",
    "normalizedName": "sodium lactate",
    "casNumber": "72-17-3",
    "category": [
      "humectant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "NMF constituent"
    ],
    "functionsAr": [
      "NMF constituent"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "NMF constituent, superior water retention",
    "descriptionAr": "NMF constituent, superior water retention",
    "synonyms": [
      "lactic acid sodium salt"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_palmitoyl_tetrapeptide_7",
    "inciName": "Palmitoyl Tetrapeptide-7",
    "normalizedName": "palmitoyl tetrapeptide-7",
    "casNumber": "221227-05-0",
    "category": [
      "peptide",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Anti-inflammatory peptide reducing interleukin-6"
    ],
    "functionsAr": [
      "Anti-inflammatory peptide reducing interleukin-6"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Anti-inflammatory peptide reducing interleukin-6",
    "descriptionAr": "Anti-inflammatory peptide reducing interleukin-6",
    "synonyms": [
      "matrixyl 3000 component"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_palmitoyl_pentapeptide_4",
    "inciName": "Palmitoyl Pentapeptide-4",
    "normalizedName": "palmitoyl pentapeptide-4",
    "casNumber": "214047-00-4",
    "category": [
      "peptide",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Matrixyl; stimulates collagen I"
    ],
    "functionsAr": [
      "Matrixyl; stimulates collagen I"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Matrixyl; stimulates collagen I, III and fibronectin",
    "descriptionAr": "Matrixyl; stimulates collagen I, III and fibronectin",
    "synonyms": [
      "matrixyl"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_dipeptide_diaminobutyroyl_benz",
    "inciName": "Dipeptide Diaminobutyroyl Benzylamide Diacetate",
    "normalizedName": "dipeptide diaminobutyroyl benzylamide diacetate",
    "casNumber": "823202-99-9",
    "category": [
      "peptide",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Syn-Ake peptide"
    ],
    "functionsAr": [
      "Syn-Ake peptide"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Syn-Ake peptide, expression line relaxing",
    "descriptionAr": "Syn-Ake peptide, expression line relaxing",
    "synonyms": [
      "syn-ake"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_adenosine",
    "inciName": "Adenosine",
    "normalizedName": "adenosine",
    "casNumber": "58-61-7",
    "category": [
      "active",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Purine nucleoside promoting cellular repair and collagen"
    ],
    "functionsAr": [
      "Purine nucleoside promoting cellular repair and collagen"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Purine nucleoside promoting cellular repair and collagen",
    "descriptionAr": "Purine nucleoside promoting cellular repair and collagen",
    "synonyms": [
      "adenine riboside"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_ceramide_eop",
    "inciName": "Ceramide EOP",
    "normalizedName": "ceramide eop",
    "casNumber": "100403-19-8",
    "category": [
      "barrier_repair",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Ceramide 1"
    ],
    "functionsAr": [
      "Ceramide 1"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Ceramide 1, binds lipid lamellae sheets tightly",
    "descriptionAr": "Ceramide 1, binds lipid lamellae sheets tightly",
    "synonyms": [
      "ceramide 1"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_phytosphingosine",
    "inciName": "Phytosphingosine",
    "normalizedName": "phytosphingosine",
    "casNumber": "554-62-1",
    "category": [
      "barrier_repair",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Lipid precursor with natural antimicrobial action against acne"
    ],
    "functionsAr": [
      "Lipid precursor with natural antimicrobial action against acne"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Lipid precursor with natural antimicrobial action against acne",
    "descriptionAr": "Lipid precursor with natural antimicrobial action against acne",
    "synonyms": [
      "sphingoid base"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_sphingolipids",
    "inciName": "Sphingolipids",
    "normalizedName": "sphingolipids",
    "casNumber": "124-20-9",
    "category": [
      "barrier_repair",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Complex lipid fractions for barrier repair"
    ],
    "functionsAr": [
      "Complex lipid fractions for barrier repair"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Complex lipid fractions for barrier repair",
    "descriptionAr": "Complex lipid fractions for barrier repair",
    "synonyms": [
      "glycosphingolipids"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_linoleic_acid",
    "inciName": "Linoleic Acid",
    "normalizedName": "linoleic acid",
    "casNumber": "60-33-3",
    "category": [
      "lipid",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Essential omega-6 fatty acid"
    ],
    "functionsAr": [
      "Essential omega-6 fatty acid"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Essential omega-6 fatty acid, deficiency causes acne comedones",
    "descriptionAr": "Essential omega-6 fatty acid, deficiency causes acne comedones",
    "synonyms": [
      "vitamin f",
      "cis,cis-9,12-octadecadienoic acid"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_argania_spinosa__argan__kernel",
    "inciName": "Argania Spinosa (Argan) Kernel Oil",
    "normalizedName": "argania spinosa (argan) kernel oil",
    "casNumber": "223747-87-3",
    "category": [
      "lipid",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Moroccan argan oil rich in oleic"
    ],
    "functionsAr": [
      "Moroccan argan oil rich in oleic"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 1,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Moroccan argan oil rich in oleic, linoleic acids and polyphenols",
    "descriptionAr": "Moroccan argan oil rich in oleic, linoleic acids and polyphenols",
    "synonyms": [
      "argan oil"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_rosa_canina__rosehip__seed_oil",
    "inciName": "Rosa Canina (Rosehip) Seed Oil",
    "normalizedName": "rosa canina (rosehip) seed oil",
    "casNumber": "84603-93-5",
    "category": [
      "lipid",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Cold-pressed rosehip oil high in trans-retinoic acid precursors"
    ],
    "functionsAr": [
      "Cold-pressed rosehip oil high in trans-retinoic acid precursors"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 1,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Cold-pressed rosehip oil high in trans-retinoic acid precursors",
    "descriptionAr": "Cold-pressed rosehip oil high in trans-retinoic acid precursors",
    "synonyms": [
      "rosehip oil"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_helianthus_annuus__sunflower__",
    "inciName": "Helianthus Annuus (Sunflower) Seed Oil",
    "normalizedName": "helianthus annuus (sunflower) seed oil",
    "casNumber": "8001-21-6",
    "category": [
      "lipid",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Barrier repair oil rich in linoleic acid"
    ],
    "functionsAr": [
      "Barrier repair oil rich in linoleic acid"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Barrier repair oil rich in linoleic acid",
    "descriptionAr": "Barrier repair oil rich in linoleic acid",
    "synonyms": [
      "sunflower oil"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_persea_gratissima__avocado__oi",
    "inciName": "Persea Gratissima (Avocado) Oil",
    "normalizedName": "persea gratissima (avocado) oil",
    "casNumber": "8024-32-6",
    "category": [
      "lipid",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Deeply nourishing oil high in monounsaturated fats"
    ],
    "functionsAr": [
      "Deeply nourishing oil high in monounsaturated fats"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 2,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "caution",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "caution",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Deeply nourishing oil high in monounsaturated fats",
    "descriptionAr": "Deeply nourishing oil high in monounsaturated fats",
    "synonyms": [
      "avocado oil"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_macadamia_ternifolia_seed_oil",
    "inciName": "Macadamia Ternifolia Seed Oil",
    "normalizedName": "macadamia ternifolia seed oil",
    "casNumber": "128497-20-1",
    "category": [
      "lipid",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Rich in palmitoleic acid mimicking youthful sebum"
    ],
    "functionsAr": [
      "Rich in palmitoleic acid mimicking youthful sebum"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 2,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "caution",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "caution",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Rich in palmitoleic acid mimicking youthful sebum",
    "descriptionAr": "Rich in palmitoleic acid mimicking youthful sebum",
    "synonyms": [
      "macadamia oil"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_oenothera_biennis__evening_pri",
    "inciName": "Oenothera Biennis (Evening Primrose) Oil",
    "normalizedName": "oenothera biennis (evening primrose) oil",
    "casNumber": "90028-66-3",
    "category": [
      "lipid",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Rich in gamma-linolenic acid (GLA) for eczema relief"
    ],
    "functionsAr": [
      "Rich in gamma-linolenic acid (GLA) for eczema relief"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 2,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "caution",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "caution",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Rich in gamma-linolenic acid (GLA) for eczema relief",
    "descriptionAr": "Rich in gamma-linolenic acid (GLA) for eczema relief",
    "synonyms": [
      "evening primrose oil"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_limnanthes_alba__meadowfoam__s",
    "inciName": "Limnanthes Alba (Meadowfoam) Seed Oil",
    "normalizedName": "limnanthes alba (meadowfoam) seed oil",
    "casNumber": "153065-40-8",
    "category": [
      "lipid",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Extremely stable long-chain triglyceride emollient"
    ],
    "functionsAr": [
      "Extremely stable long-chain triglyceride emollient"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 1,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Extremely stable long-chain triglyceride emollient",
    "descriptionAr": "Extremely stable long-chain triglyceride emollient",
    "synonyms": [
      "meadowfoam oil"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_bisabolol",
    "inciName": "Bisabolol",
    "normalizedName": "bisabolol",
    "casNumber": "515-69-5",
    "category": [
      "soothing",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Alpha-bisabolol from chamomile"
    ],
    "functionsAr": [
      "Alpha-bisabolol from chamomile"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Alpha-bisabolol from chamomile, anti-inflammatory and calming",
    "descriptionAr": "Alpha-bisabolol from chamomile, anti-inflammatory and calming",
    "synonyms": [
      "alpha-bisabolol",
      "levomenol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_avena_sativa__oat__kernel_flou",
    "inciName": "Avena Sativa (Oat) Kernel Flour",
    "normalizedName": "avena sativa (oat) kernel flour",
    "casNumber": "134196-16-4",
    "category": [
      "soothing",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Colloidal oatmeal"
    ],
    "functionsAr": [
      "Colloidal oatmeal"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Colloidal oatmeal, FDA approved skin protectant for eczema",
    "descriptionAr": "Colloidal oatmeal, FDA approved skin protectant for eczema",
    "synonyms": [
      "colloidal oatmeal",
      "oat flour"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_beta_glucan",
    "inciName": "Beta-Glucan",
    "normalizedName": "beta-glucan",
    "casNumber": "9041-22-9",
    "category": [
      "soothing",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Polysaccharide from yeast or oats"
    ],
    "functionsAr": [
      "Polysaccharide from yeast or oats"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Polysaccharide from yeast or oats, immune modulator and repair",
    "descriptionAr": "Polysaccharide from yeast or oats, immune modulator and repair",
    "synonyms": [
      "beta-1,3/1,6-d-glucan"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_calendula_officinalis_flower_e",
    "inciName": "Calendula Officinalis Flower Extract",
    "normalizedName": "calendula officinalis flower extract",
    "casNumber": "84776-23-8",
    "category": [
      "soothing",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Marigold extract with flavonoids and triterpenes"
    ],
    "functionsAr": [
      "Marigold extract with flavonoids and triterpenes"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Marigold extract with flavonoids and triterpenes",
    "descriptionAr": "Marigold extract with flavonoids and triterpenes",
    "synonyms": [
      "calendula extract"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_chamomilla_recutita__matricari",
    "inciName": "Chamomilla Recutita (Matricaria) Flower Extract",
    "normalizedName": "chamomilla recutita (matricaria) flower extract",
    "casNumber": "84082-60-0",
    "category": [
      "soothing",
      "cosmetic_ingredient"
    ],
    "functions": [
      "German chamomile flower extract soothing sensitive skin"
    ],
    "functionsAr": [
      "German chamomile flower extract soothing sensitive skin"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "German chamomile flower extract soothing sensitive skin",
    "descriptionAr": "German chamomile flower extract soothing sensitive skin",
    "synonyms": [
      "chamomile extract"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_ectoin",
    "inciName": "Ectoin",
    "normalizedName": "ectoin",
    "casNumber": "96702-03-3",
    "category": [
      "soothing",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Extremolyte providing biological protection against UV and dehydration"
    ],
    "functionsAr": [
      "Extremolyte providing biological protection against UV and dehydration"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Extremolyte providing biological protection against UV and dehydration",
    "descriptionAr": "Extremolyte providing biological protection against UV and dehydration",
    "synonyms": [
      "tetrahydropyrimidine derivative"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_resveratrol",
    "inciName": "Resveratrol",
    "normalizedName": "resveratrol",
    "casNumber": "501-36-0",
    "category": [
      "antioxidant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Polyphenolic phytoalexin from grapes"
    ],
    "functionsAr": [
      "Polyphenolic phytoalexin from grapes"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Polyphenolic phytoalexin from grapes, longevity sirtuin activator",
    "descriptionAr": "Polyphenolic phytoalexin from grapes, longevity sirtuin activator",
    "synonyms": [
      "trans-resveratrol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_ferulic_acid",
    "inciName": "Ferulic Acid",
    "normalizedName": "ferulic acid",
    "casNumber": "1135-24-6",
    "category": [
      "antioxidant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Hydroxycinnamic acid stabilizing Vitamin C and E synergy"
    ],
    "functionsAr": [
      "Hydroxycinnamic acid stabilizing Vitamin C and E synergy"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Hydroxycinnamic acid stabilizing Vitamin C and E synergy",
    "descriptionAr": "Hydroxycinnamic acid stabilizing Vitamin C and E synergy",
    "synonyms": [
      "4-hydroxy-3-methoxycinnamic acid"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_ubiquinone",
    "inciName": "Ubiquinone",
    "normalizedName": "ubiquinone",
    "casNumber": "303-98-0",
    "category": [
      "antioxidant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Coenzyme Q10; mitochondrial antioxidant boosting cellular ATP"
    ],
    "functionsAr": [
      "Coenzyme Q10; mitochondrial antioxidant boosting cellular ATP"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Coenzyme Q10; mitochondrial antioxidant boosting cellular ATP",
    "descriptionAr": "Coenzyme Q10; mitochondrial antioxidant boosting cellular ATP",
    "synonyms": [
      "coenzyme q10",
      "coq10"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_glutathione",
    "inciName": "Glutathione",
    "normalizedName": "glutathione",
    "casNumber": "70-18-8",
    "category": [
      "antioxidant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Master cellular antioxidant tripeptide"
    ],
    "functionsAr": [
      "Master cellular antioxidant tripeptide"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Master cellular antioxidant tripeptide",
    "descriptionAr": "Master cellular antioxidant tripeptide",
    "synonyms": [
      "l-glutathione",
      "gsh"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_bemotrizinol",
    "inciName": "Bemotrizinol",
    "normalizedName": "bemotrizinol",
    "casNumber": "187393-00-6",
    "category": [
      "sunscreen",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Tinosorb S; photostable broad-spectrum UVA and UVB filter"
    ],
    "functionsAr": [
      "Tinosorb S; photostable broad-spectrum UVA and UVB filter"
    ],
    "cirStatus": "Safe as used in EU/Asia up to 10%",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Tinosorb S; photostable broad-spectrum UVA and UVB filter",
    "descriptionAr": "Tinosorb S; photostable broad-spectrum UVA and UVB filter",
    "synonyms": [
      "tinosorb s",
      "bis-ethylhexyloxyphenol methoxyphenyl triazine"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_bisoctrizole",
    "inciName": "Bisoctrizole",
    "normalizedName": "bisoctrizole",
    "casNumber": "103597-45-1",
    "category": [
      "sunscreen",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Tinosorb M; hybrid particulate UV filter covering entire UV spectrum"
    ],
    "functionsAr": [
      "Tinosorb M; hybrid particulate UV filter covering entire UV spectrum"
    ],
    "cirStatus": "Safe as used in EU up to 10%",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Tinosorb M; hybrid particulate UV filter covering entire UV spectrum",
    "descriptionAr": "Tinosorb M; hybrid particulate UV filter covering entire UV spectrum",
    "synonyms": [
      "tinosorb m",
      "methylene bis-benzotriazolyl tetramethylbutylphenol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_ethylhexyl_salicylate",
    "inciName": "Ethylhexyl Salicylate",
    "normalizedName": "ethylhexyl salicylate",
    "casNumber": "118-60-5",
    "category": [
      "sunscreen",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Octisalate; UVB chemical filter"
    ],
    "functionsAr": [
      "Octisalate; UVB chemical filter"
    ],
    "cirStatus": "Safe up to 5%",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Octisalate; UVB chemical filter",
    "descriptionAr": "Octisalate; UVB chemical filter",
    "synonyms": [
      "octisalate"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_octocrylene",
    "inciName": "Octocrylene",
    "normalizedName": "octocrylene",
    "casNumber": "6197-30-4",
    "category": [
      "sunscreen",
      "cosmetic_ingredient"
    ],
    "functions": [
      "UVB and UVA2 absorber that stabilizes avobenzone"
    ],
    "functionsAr": [
      "UVB and UVA2 absorber that stabilizes avobenzone"
    ],
    "cirStatus": "Safe up to 10%",
    "comedogenicRating": 0,
    "sensitizingPotential": "moderate",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "caution",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "UVB and UVA2 absorber that stabilizes avobenzone",
    "descriptionAr": "UVB and UVA2 absorber that stabilizes avobenzone",
    "synonyms": [
      "2-ethylhexyl 2-cyano-3,3-diphenylacrylate"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_diethylamino_hydroxybenzoyl_he",
    "inciName": "Diethylamino Hydroxybenzoyl Hexyl Benzoate",
    "normalizedName": "diethylamino hydroxybenzoyl hexyl benzoate",
    "casNumber": "302776-68-7",
    "category": [
      "sunscreen",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Uvinul A Plus; high UVA photostability filter"
    ],
    "functionsAr": [
      "Uvinul A Plus; high UVA photostability filter"
    ],
    "cirStatus": "Safe as used in EU up to 10%",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Uvinul A Plus; high UVA photostability filter",
    "descriptionAr": "Uvinul A Plus; high UVA photostability filter",
    "synonyms": [
      "uvinul a plus",
      "dhhb"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_ethylhexyl_triazone",
    "inciName": "Ethylhexyl Triazone",
    "normalizedName": "ethylhexyl triazone",
    "casNumber": "88122-99-0",
    "category": [
      "sunscreen",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Uvinul T 150; highly efficient UVB absorber"
    ],
    "functionsAr": [
      "Uvinul T 150; highly efficient UVB absorber"
    ],
    "cirStatus": "Safe as used in EU up to 5%",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Uvinul T 150; highly efficient UVB absorber",
    "descriptionAr": "Uvinul T 150; highly efficient UVB absorber",
    "synonyms": [
      "uvinul t 150",
      "eht"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_homosalate",
    "inciName": "Homosalate",
    "normalizedName": "homosalate",
    "casNumber": "118-56-9",
    "category": [
      "sunscreen",
      "cosmetic_ingredient"
    ],
    "functions": [
      "UVB chemical absorber"
    ],
    "functionsAr": [
      "UVB chemical absorber"
    ],
    "cirStatus": "Safe as regulated",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "UVB chemical absorber",
    "descriptionAr": "UVB chemical absorber",
    "synonyms": [
      "homomethyl salicylate"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_cyclopentasiloxane",
    "inciName": "Cyclopentasiloxane",
    "normalizedName": "cyclopentasiloxane",
    "casNumber": "541-02-6",
    "category": [
      "silicone",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Volatile silicone delivering silky finish without buildup"
    ],
    "functionsAr": [
      "Volatile silicone delivering silky finish without buildup"
    ],
    "cirStatus": "Safe as used in leave-on cosmetics",
    "comedogenicRating": 1,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Volatile silicone delivering silky finish without buildup",
    "descriptionAr": "Volatile silicone delivering silky finish without buildup",
    "synonyms": [
      "d5 silicone",
      "decamethylcyclopentasiloxane"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_isododecane",
    "inciName": "Isododecane",
    "normalizedName": "isododecane",
    "casNumber": "31807-55-3",
    "category": [
      "emollient",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Weightless branched hydrocarbon solvent giving matte finish"
    ],
    "functionsAr": [
      "Weightless branched hydrocarbon solvent giving matte finish"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Weightless branched hydrocarbon solvent giving matte finish",
    "descriptionAr": "Weightless branched hydrocarbon solvent giving matte finish",
    "synonyms": [
      "isododecane solvent"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_isononyl_isononanoate",
    "inciName": "Isononyl Isononanoate",
    "normalizedName": "isononyl isononanoate",
    "casNumber": "59219-71-5",
    "category": [
      "emollient",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Dry-touch ester with non-greasy cushion feel"
    ],
    "functionsAr": [
      "Dry-touch ester with non-greasy cushion feel"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 1,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Dry-touch ester with non-greasy cushion feel",
    "descriptionAr": "Dry-touch ester with non-greasy cushion feel",
    "synonyms": [
      "isononyl ester"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_cetyl_alcohol",
    "inciName": "Cetyl Alcohol",
    "normalizedName": "cetyl alcohol",
    "casNumber": "36653-82-4",
    "category": [
      "emollient",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Fatty alcohol thickener and emollient"
    ],
    "functionsAr": [
      "Fatty alcohol thickener and emollient"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 2,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "caution",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "caution",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Fatty alcohol thickener and emollient, non-drying",
    "descriptionAr": "Fatty alcohol thickener and emollient, non-drying",
    "synonyms": [
      "1-hexadecanol",
      "palmityl alcohol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_stearyl_alcohol",
    "inciName": "Stearyl Alcohol",
    "normalizedName": "stearyl alcohol",
    "casNumber": "112-92-5",
    "category": [
      "emollient",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Fatty alcohol providing body and creaminess"
    ],
    "functionsAr": [
      "Fatty alcohol providing body and creaminess"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 2,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "caution",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "caution",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Fatty alcohol providing body and creaminess",
    "descriptionAr": "Fatty alcohol providing body and creaminess",
    "synonyms": [
      "1-octadecanol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_cetearyl_alcohol",
    "inciName": "Cetearyl Alcohol",
    "normalizedName": "cetearyl alcohol",
    "casNumber": "67762-27-0",
    "category": [
      "emollient",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Synergistic blend of cetyl and stearyl alcohols"
    ],
    "functionsAr": [
      "Synergistic blend of cetyl and stearyl alcohols"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 2,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "caution",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "caution",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Synergistic blend of cetyl and stearyl alcohols",
    "descriptionAr": "Synergistic blend of cetyl and stearyl alcohols",
    "synonyms": [
      "cetostearyl alcohol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_stearic_acid",
    "inciName": "Stearic Acid",
    "normalizedName": "stearic acid",
    "casNumber": "57-11-4",
    "category": [
      "emollient",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Saturated fatty acid emollient and emulsifier"
    ],
    "functionsAr": [
      "Saturated fatty acid emollient and emulsifier"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 2,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "caution",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "caution",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Saturated fatty acid emollient and emulsifier",
    "descriptionAr": "Saturated fatty acid emollient and emulsifier",
    "synonyms": [
      "octadecanoic acid"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_ceteareth_20",
    "inciName": "Ceteareth-20",
    "normalizedName": "ceteareth-20",
    "casNumber": "68439-49-6",
    "category": [
      "emulsifier",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Non-ionic polyoxyethylene ether of cetearyl alcohol"
    ],
    "functionsAr": [
      "Non-ionic polyoxyethylene ether of cetearyl alcohol"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 2,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "caution",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "caution",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Non-ionic polyoxyethylene ether of cetearyl alcohol",
    "descriptionAr": "Non-ionic polyoxyethylene ether of cetearyl alcohol",
    "synonyms": [
      "peg-20 cetostearyl ether"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_glyceryl_stearate",
    "inciName": "Glyceryl Stearate",
    "normalizedName": "glyceryl stearate",
    "casNumber": "31566-31-1",
    "category": [
      "emulsifier",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Plant-derived monoester emulsifier"
    ],
    "functionsAr": [
      "Plant-derived monoester emulsifier"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 1,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Plant-derived monoester emulsifier",
    "descriptionAr": "Plant-derived monoester emulsifier",
    "synonyms": [
      "glycerol monostearate"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_polysorbate_20",
    "inciName": "Polysorbate 20",
    "normalizedName": "polysorbate 20",
    "casNumber": "9005-64-5",
    "category": [
      "emulsifier",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Mild non-ionic surfactant and solubilizer for fragrance and oils"
    ],
    "functionsAr": [
      "Mild non-ionic surfactant and solubilizer for fragrance and oils"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Mild non-ionic surfactant and solubilizer for fragrance and oils",
    "descriptionAr": "Mild non-ionic surfactant and solubilizer for fragrance and oils",
    "synonyms": [
      "tween 20"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_polysorbate_80",
    "inciName": "Polysorbate 80",
    "normalizedName": "polysorbate 80",
    "casNumber": "9005-65-6",
    "category": [
      "emulsifier",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Solubilizer and emulsifier for oily actives"
    ],
    "functionsAr": [
      "Solubilizer and emulsifier for oily actives"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Solubilizer and emulsifier for oily actives",
    "descriptionAr": "Solubilizer and emulsifier for oily actives",
    "synonyms": [
      "tween 80"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_sodium_polyacrylate",
    "inciName": "Sodium Polyacrylate",
    "normalizedName": "sodium polyacrylate",
    "casNumber": "9003-04-7",
    "category": [
      "polymer",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Hydrogel thickener and water absorbing polymer"
    ],
    "functionsAr": [
      "Hydrogel thickener and water absorbing polymer"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Hydrogel thickener and water absorbing polymer",
    "descriptionAr": "Hydrogel thickener and water absorbing polymer",
    "synonyms": [
      "acrylic sodium polymer"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_acrylates_c10_30_alkyl_acrylat",
    "inciName": "Acrylates/C10-30 Alkyl Acrylate Crosspolymer",
    "normalizedName": "acrylates/c10-30 alkyl acrylate crosspolymer",
    "casNumber": "9003-01-4",
    "category": [
      "polymer",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Polymer creating quick-break refreshing gel-creams"
    ],
    "functionsAr": [
      "Polymer creating quick-break refreshing gel-creams"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Polymer creating quick-break refreshing gel-creams",
    "descriptionAr": "Polymer creating quick-break refreshing gel-creams",
    "synonyms": [
      "pemulen",
      "carbopol ultrez"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_cocamidopropyl_betaine",
    "inciName": "Cocamidopropyl Betaine",
    "normalizedName": "cocamidopropyl betaine",
    "casNumber": "61789-40-0",
    "category": [
      "surfactant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Zwitterionic surfactant from coconut oil"
    ],
    "functionsAr": [
      "Zwitterionic surfactant from coconut oil"
    ],
    "cirStatus": "Safe as used in rinse-off",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Zwitterionic surfactant from coconut oil, gentle foam booster",
    "descriptionAr": "Zwitterionic surfactant from coconut oil, gentle foam booster",
    "synonyms": [
      "capb"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_sodium_cocoyl_isethionate",
    "inciName": "Sodium Cocoyl Isethionate",
    "normalizedName": "sodium cocoyl isethionate",
    "casNumber": "61789-32-0",
    "category": [
      "surfactant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Baby foam surfactant; exceptionally mild surfactant"
    ],
    "functionsAr": [
      "Baby foam surfactant; exceptionally mild surfactant"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Baby foam surfactant; exceptionally mild surfactant",
    "descriptionAr": "Baby foam surfactant; exceptionally mild surfactant",
    "synonyms": [
      "sci",
      "baby foam"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_coco_glucoside",
    "inciName": "Coco-Glucoside",
    "normalizedName": "coco-glucoside",
    "casNumber": "141464-42-8",
    "category": [
      "surfactant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Non-ionic APG surfactant made from coconut and fruit sugars"
    ],
    "functionsAr": [
      "Non-ionic APG surfactant made from coconut and fruit sugars"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Non-ionic APG surfactant made from coconut and fruit sugars",
    "descriptionAr": "Non-ionic APG surfactant made from coconut and fruit sugars",
    "synonyms": [
      "apg surfactant"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_decyl_glucoside",
    "inciName": "Decyl Glucoside",
    "normalizedName": "decyl glucoside",
    "casNumber": "68515-73-1",
    "category": [
      "surfactant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Ultra-gentle plant glucoside surfactant for sensitive skin"
    ],
    "functionsAr": [
      "Ultra-gentle plant glucoside surfactant for sensitive skin"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Ultra-gentle plant glucoside surfactant for sensitive skin",
    "descriptionAr": "Ultra-gentle plant glucoside surfactant for sensitive skin",
    "synonyms": [
      "plantaren"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_lauryl_glucoside",
    "inciName": "Lauryl Glucoside",
    "normalizedName": "lauryl glucoside",
    "casNumber": "110615-47-9",
    "category": [
      "surfactant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Mild foaming biodegradable cleansing agent"
    ],
    "functionsAr": [
      "Mild foaming biodegradable cleansing agent"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Mild foaming biodegradable cleansing agent",
    "descriptionAr": "Mild foaming biodegradable cleansing agent",
    "synonyms": [
      "alkyl polyglucoside"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_disodium_laureth_sulfosuccinat",
    "inciName": "Disodium Laureth Sulfosuccinate",
    "normalizedName": "disodium laureth sulfosuccinate",
    "casNumber": "39354-45-5",
    "category": [
      "surfactant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Sulfate-free mild surfactant with large molecular weight"
    ],
    "functionsAr": [
      "Sulfate-free mild surfactant with large molecular weight"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Sulfate-free mild surfactant with large molecular weight",
    "descriptionAr": "Sulfate-free mild surfactant with large molecular weight",
    "synonyms": [
      "dls"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_sodium_lauroyl_sarcosinate",
    "inciName": "Sodium Lauroyl Sarcosinate",
    "normalizedName": "sodium lauroyl sarcosinate",
    "casNumber": "137-16-6",
    "category": [
      "surfactant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Amino acid derived gentle surfactant"
    ],
    "functionsAr": [
      "Amino acid derived gentle surfactant"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Amino acid derived gentle surfactant",
    "descriptionAr": "Amino acid derived gentle surfactant",
    "synonyms": [
      "sarcosinate cleanser"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_butylene_glycol",
    "inciName": "Butylene Glycol",
    "normalizedName": "butylene glycol",
    "casNumber": "107-88-0",
    "category": [
      "solvent",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Organic diol solvent and humectant"
    ],
    "functionsAr": [
      "Organic diol solvent and humectant"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 1,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Organic diol solvent and humectant, antimicrobial booster",
    "descriptionAr": "Organic diol solvent and humectant, antimicrobial booster",
    "synonyms": [
      "1,3-butanediol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_propylene_glycol",
    "inciName": "Propylene Glycol",
    "normalizedName": "propylene glycol",
    "casNumber": "57-55-6",
    "category": [
      "solvent",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Humectant and penetration enhancer"
    ],
    "functionsAr": [
      "Humectant and penetration enhancer"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Humectant and penetration enhancer",
    "descriptionAr": "Humectant and penetration enhancer",
    "synonyms": [
      "propane-1,2-diol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_propanediol",
    "inciName": "Propanediol",
    "normalizedName": "propanediol",
    "casNumber": "504-63-2",
    "category": [
      "solvent",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Fermentation-derived 1"
    ],
    "functionsAr": [
      "Fermentation-derived 1"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Fermentation-derived 1,3-propanediol, green alternative to PG",
    "descriptionAr": "Fermentation-derived 1,3-propanediol, green alternative to PG",
    "synonyms": [
      "zemea",
      "1,3-propanediol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_dipropylene_glycol",
    "inciName": "Dipropylene Glycol",
    "normalizedName": "dipropylene glycol",
    "casNumber": "25265-71-8",
    "category": [
      "solvent",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Low odor cosmetic solvent and humectant"
    ],
    "functionsAr": [
      "Low odor cosmetic solvent and humectant"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Low odor cosmetic solvent and humectant",
    "descriptionAr": "Low odor cosmetic solvent and humectant",
    "synonyms": [
      "dpg"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_disodium_edta",
    "inciName": "Disodium EDTA",
    "normalizedName": "disodium edta",
    "casNumber": "139-33-3",
    "category": [
      "chelator",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Chelating agent binding trace metal ions to prevent formula spoilage"
    ],
    "functionsAr": [
      "Chelating agent binding trace metal ions to prevent formula spoilage"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Chelating agent binding trace metal ions to prevent formula spoilage",
    "descriptionAr": "Chelating agent binding trace metal ions to prevent formula spoilage",
    "synonyms": [
      "edta disodium salt"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_tetrasodium_glutamate_diacetat",
    "inciName": "Tetrasodium Glutamate Diacetate",
    "normalizedName": "tetrasodium glutamate diacetate",
    "casNumber": "51981-21-6",
    "category": [
      "chelator",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Biodegradable natural chelator derived from plant amino acids"
    ],
    "functionsAr": [
      "Biodegradable natural chelator derived from plant amino acids"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Biodegradable natural chelator derived from plant amino acids",
    "descriptionAr": "Biodegradable natural chelator derived from plant amino acids",
    "synonyms": [
      "dissolvine gl"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_sodium_phytate",
    "inciName": "Sodium Phytate",
    "normalizedName": "sodium phytate",
    "casNumber": "14306-25-3",
    "category": [
      "chelator",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Natural chelating agent from rice bran"
    ],
    "functionsAr": [
      "Natural chelating agent from rice bran"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Natural chelating agent from rice bran",
    "descriptionAr": "Natural chelating agent from rice bran",
    "synonyms": [
      "phytic acid sodium salt"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_caprylyl_glycol",
    "inciName": "Caprylyl Glycol",
    "normalizedName": "caprylyl glycol",
    "casNumber": "1117-86-8",
    "category": [
      "preservative_booster",
      "cosmetic_ingredient"
    ],
    "functions": [
      "1"
    ],
    "functionsAr": [
      "1"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "1,2-octanediol; humectant and broad-spectrum antimicrobial booster",
    "descriptionAr": "1,2-octanediol; humectant and broad-spectrum antimicrobial booster",
    "synonyms": [
      "1,2-octanediol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_1_2_hexanediol",
    "inciName": "1,2-Hexanediol",
    "normalizedName": "1,2-hexanediol",
    "casNumber": "6920-22-5",
    "category": [
      "preservative_booster",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Hydrating solvent with antibacterial preservation synergy"
    ],
    "functionsAr": [
      "Hydrating solvent with antibacterial preservation synergy"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Hydrating solvent with antibacterial preservation synergy",
    "descriptionAr": "Hydrating solvent with antibacterial preservation synergy",
    "synonyms": [
      "hexanediol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_sodium_benzoate",
    "inciName": "Sodium Benzoate",
    "normalizedName": "sodium benzoate",
    "casNumber": "532-32-1",
    "category": [
      "preservative",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Food grade preservative active below pH 5"
    ],
    "functionsAr": [
      "Food grade preservative active below pH 5"
    ],
    "cirStatus": "Safe as used up to 0.5%",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Food grade preservative active below pH 5",
    "descriptionAr": "Food grade preservative active below pH 5",
    "synonyms": [
      "benzoic acid sodium salt"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_potassium_sorbate",
    "inciName": "Potassium Sorbate",
    "normalizedName": "potassium sorbate",
    "casNumber": "24634-61-5",
    "category": [
      "preservative",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Natural identical fungistatic preservative"
    ],
    "functionsAr": [
      "Natural identical fungistatic preservative"
    ],
    "cirStatus": "Safe as used up to 0.6%",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Natural identical fungistatic preservative",
    "descriptionAr": "Natural identical fungistatic preservative",
    "synonyms": [
      "sorbic acid potassium salt"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_benzyl_alcohol",
    "inciName": "Benzyl Alcohol",
    "normalizedName": "benzyl alcohol",
    "casNumber": "100-51-6",
    "category": [
      "preservative",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Aromatic alcohol preservative and solvent"
    ],
    "functionsAr": [
      "Aromatic alcohol preservative and solvent"
    ],
    "cirStatus": "Safe as used up to 1.0%",
    "comedogenicRating": 0,
    "sensitizingPotential": "moderate",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "caution",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Aromatic alcohol preservative and solvent",
    "descriptionAr": "Aromatic alcohol preservative and solvent",
    "synonyms": [
      "phenylmethanol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_dehydroacetic_acid",
    "inciName": "Dehydroacetic Acid",
    "normalizedName": "dehydroacetic acid",
    "casNumber": "520-45-6",
    "category": [
      "preservative",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Organic compound fungicidal preservative"
    ],
    "functionsAr": [
      "Organic compound fungicidal preservative"
    ],
    "cirStatus": "Safe as used up to 0.6%",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Organic compound fungicidal preservative",
    "descriptionAr": "Organic compound fungicidal preservative",
    "synonyms": [
      "dha"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_caffeine",
    "inciName": "Caffeine",
    "normalizedName": "caffeine",
    "casNumber": "58-08-2",
    "category": [
      "active",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Methylxanthine stimulating microcirculation and draining periorbital edema"
    ],
    "functionsAr": [
      "Methylxanthine stimulating microcirculation and draining periorbital edema"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Methylxanthine stimulating microcirculation and draining periorbital edema",
    "descriptionAr": "Methylxanthine stimulating microcirculation and draining periorbital edema",
    "synonyms": [
      "1,3,7-trimethylxanthine"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_epigallocatechin_gallate",
    "inciName": "Epi-Gallocatechin Gallate",
    "normalizedName": "epigallocatechin gallate",
    "casNumber": "989-51-5",
    "category": [
      "antioxidant",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Isolated active green tea catechin"
    ],
    "functionsAr": [
      "Isolated active green tea catechin"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Isolated active green tea catechin",
    "descriptionAr": "Isolated active green tea catechin",
    "synonyms": [
      "egcg"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_anigozanthos_flavidus_extract",
    "inciName": "Kangaroo Paw Flower Extract",
    "normalizedName": "anigozanthos flavidus extract",
    "casNumber": "91722-19-9",
    "category": [
      "botanical",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Botanical extract stimulating tenascin-X synthesis"
    ],
    "functionsAr": [
      "Botanical extract stimulating tenascin-X synthesis"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Botanical extract stimulating tenascin-X synthesis",
    "descriptionAr": "Botanical extract stimulating tenascin-X synthesis",
    "synonyms": [
      "skinectura"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_leontopodium_alpinum_extract",
    "inciName": "Leontopodium Alpinum (Edelweiss) Extract",
    "normalizedName": "leontopodium alpinum extract",
    "casNumber": "391154-50-8",
    "category": [
      "botanical",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Alpine flower extract with leontopodic acid protecting collagen"
    ],
    "functionsAr": [
      "Alpine flower extract with leontopodic acid protecting collagen"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Alpine flower extract with leontopodic acid protecting collagen",
    "descriptionAr": "Alpine flower extract with leontopodic acid protecting collagen",
    "synonyms": [
      "edelweiss extract"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_malus_domestica_fruit_cell_cul",
    "inciName": "Malus Domestica Fruit Cell Culture Extract",
    "normalizedName": "malus domestica fruit cell culture extract",
    "casNumber": "85251-63-4",
    "category": [
      "botanical",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Swiss apple stem cell liposomal extract"
    ],
    "functionsAr": [
      "Swiss apple stem cell liposomal extract"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Swiss apple stem cell liposomal extract",
    "descriptionAr": "Swiss apple stem cell liposomal extract",
    "synonyms": [
      "apple stem cells"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_spirulina_platensis_extract",
    "inciName": "Spirulina Platensis Extract",
    "normalizedName": "spirulina platensis extract",
    "casNumber": "223751-80-2",
    "category": [
      "botanical",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Blue-green algae rich in phycocyanin and amino acids"
    ],
    "functionsAr": [
      "Blue-green algae rich in phycocyanin and amino acids"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Blue-green algae rich in phycocyanin and amino acids",
    "descriptionAr": "Blue-green algae rich in phycocyanin and amino acids",
    "synonyms": [
      "spirulina extract"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_chlorella_vulgaris_extract",
    "inciName": "Chlorella Vulgaris Extract",
    "normalizedName": "chlorella vulgaris extract",
    "casNumber": "92128-82-0",
    "category": [
      "botanical",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Green microalgae stimulating vascular tissue firmness"
    ],
    "functionsAr": [
      "Green microalgae stimulating vascular tissue firmness"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Green microalgae stimulating vascular tissue firmness",
    "descriptionAr": "Green microalgae stimulating vascular tissue firmness",
    "synonyms": [
      "chlorella extract"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_saccharomyces_ferment_filtrate",
    "inciName": "Saccharomyces Ferment Filtrate",
    "normalizedName": "saccharomyces ferment filtrate",
    "casNumber": "94114-07-5",
    "category": [
      "ferment",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Fermented yeast filtrate loaded with amino acids and beta-glucan"
    ],
    "functionsAr": [
      "Fermented yeast filtrate loaded with amino acids and beta-glucan"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Fermented yeast filtrate loaded with amino acids and beta-glucan",
    "descriptionAr": "Fermented yeast filtrate loaded with amino acids and beta-glucan",
    "synonyms": [
      "galactomyces",
      "pitera equivalent"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_bifida_ferment_lysate",
    "inciName": "Bifida Ferment Lysate",
    "normalizedName": "bifida ferment lysate",
    "casNumber": "96507-89-0",
    "category": [
      "ferment",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Probiotic lysate improving skin barrier repair and UV resistance"
    ],
    "functionsAr": [
      "Probiotic lysate improving skin barrier repair and UV resistance"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Probiotic lysate improving skin barrier repair and UV resistance",
    "descriptionAr": "Probiotic lysate improving skin barrier repair and UV resistance",
    "synonyms": [
      "bifidobacterium lysate"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_lactobacillus_ferment",
    "inciName": "Lactobacillus Ferment",
    "normalizedName": "lactobacillus ferment",
    "casNumber": "68333-14-2",
    "category": [
      "ferment",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Postbiotic peptide ferment balancing the cutaneous microbiome"
    ],
    "functionsAr": [
      "Postbiotic peptide ferment balancing the cutaneous microbiome"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Postbiotic peptide ferment balancing the cutaneous microbiome",
    "descriptionAr": "Postbiotic peptide ferment balancing the cutaneous microbiome",
    "synonyms": [
      "probiotic ferment"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_inulin",
    "inciName": "Inulin",
    "normalizedName": "inulin",
    "casNumber": "9005-80-5",
    "category": [
      "prebiotic",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Chicory root fructooligosaccharide feeding beneficial skin microbiota"
    ],
    "functionsAr": [
      "Chicory root fructooligosaccharide feeding beneficial skin microbiota"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Chicory root fructooligosaccharide feeding beneficial skin microbiota",
    "descriptionAr": "Chicory root fructooligosaccharide feeding beneficial skin microbiota",
    "synonyms": [
      "chicory prebiotic"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_alpha_glucan_oligosaccharide",
    "inciName": "Alpha-Glucan Oligosaccharide",
    "normalizedName": "alpha-glucan oligosaccharide",
    "casNumber": "54-47-7",
    "category": [
      "prebiotic",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Prebiotic bio-selective substrate protecting beneficial skin flora"
    ],
    "functionsAr": [
      "Prebiotic bio-selective substrate protecting beneficial skin flora"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Prebiotic bio-selective substrate protecting beneficial skin flora",
    "descriptionAr": "Prebiotic bio-selective substrate protecting beneficial skin flora",
    "synonyms": [
      "bioecolia"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_sodium_ascorbyl_phosphate",
    "inciName": "Sodium Ascorbyl Phosphate",
    "normalizedName": "sodium ascorbyl phosphate",
    "casNumber": "66170-10-3",
    "category": [
      "active",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Water-soluble Vitamin C salt with proven anti-acne efficacy"
    ],
    "functionsAr": [
      "Water-soluble Vitamin C salt with proven anti-acne efficacy"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Water-soluble Vitamin C salt with proven anti-acne efficacy",
    "descriptionAr": "Water-soluble Vitamin C salt with proven anti-acne efficacy",
    "synonyms": [
      "sap",
      "stay-c 50"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_tetrahexyldecyl_ascorbate",
    "inciName": "Tetrahexyldecyl Ascorbate",
    "normalizedName": "tetrahexyldecyl ascorbate",
    "casNumber": "183476-82-6",
    "category": [
      "active",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Lipid-soluble Vitamin C ester with superior dermal penetration"
    ],
    "functionsAr": [
      "Lipid-soluble Vitamin C ester with superior dermal penetration"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Lipid-soluble Vitamin C ester with superior dermal penetration",
    "descriptionAr": "Lipid-soluble Vitamin C ester with superior dermal penetration",
    "synonyms": [
      "thd ascorbate",
      "bv-osc"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_magnesium_ascorbyl_phosphate",
    "inciName": "Magnesium Ascorbyl Phosphate",
    "normalizedName": "magnesium ascorbyl phosphate",
    "casNumber": "113170-55-1",
    "category": [
      "active",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Stable water-soluble Vitamin C derivative hydrating and brightening"
    ],
    "functionsAr": [
      "Stable water-soluble Vitamin C derivative hydrating and brightening"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Stable water-soluble Vitamin C derivative hydrating and brightening",
    "descriptionAr": "Stable water-soluble Vitamin C derivative hydrating and brightening",
    "synonyms": [
      "map"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_mandelic_acid",
    "inciName": "Mandelic Acid",
    "normalizedName": "mandelic acid",
    "casNumber": "90-64-2",
    "category": [
      "aha",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Gentle large-molecule AHA for sensitive acne-prone skin"
    ],
    "functionsAr": [
      "Gentle large-molecule AHA for sensitive acne-prone skin"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Gentle large-molecule AHA for sensitive acne-prone skin",
    "descriptionAr": "Gentle large-molecule AHA for sensitive acne-prone skin",
    "synonyms": [
      "amygdalic acid"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_salix_alba__willow__bark_extra",
    "inciName": "Salix Alba (Willow) Bark Extract",
    "normalizedName": "salix alba (willow) bark extract",
    "casNumber": "84082-83-7",
    "category": [
      "botanical",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Natural botanical source of salicin and polyphenols"
    ],
    "functionsAr": [
      "Natural botanical source of salicin and polyphenols"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "low",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "safe",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Natural botanical source of salicin and polyphenols",
    "descriptionAr": "Natural botanical source of salicin and polyphenols",
    "synonyms": [
      "willow bark"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_hamamelis_virginiana__witch_ha",
    "inciName": "Hamamelis Virginiana (Witch Hazel) Water",
    "normalizedName": "hamamelis virginiana (witch hazel) water",
    "casNumber": "84696-19-5",
    "category": [
      "botanical",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Distillate providing natural astringent and pore-tightening effects"
    ],
    "functionsAr": [
      "Distillate providing natural astringent and pore-tightening effects"
    ],
    "cirStatus": "Safe as used",
    "comedogenicRating": 0,
    "sensitizingPotential": "moderate",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "caution",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Distillate providing natural astringent and pore-tightening effects",
    "descriptionAr": "Distillate providing natural astringent and pore-tightening effects",
    "synonyms": [
      "witch hazel"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_melaleuca_alternifolia__tea_tr",
    "inciName": "Melaleuca Alternifolia (Tea Tree) Leaf Oil",
    "normalizedName": "melaleuca alternifolia (tea tree) leaf oil",
    "casNumber": "85085-48-9",
    "category": [
      "essential_oil",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Terpinen-4-ol rich essential oil with potent antibacterial activity against C. acnes"
    ],
    "functionsAr": [
      "Terpinen-4-ol rich essential oil with potent antibacterial activity against C. acnes"
    ],
    "cirStatus": "Safe when diluted <= 1%",
    "comedogenicRating": 1,
    "sensitizingPotential": "moderate",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "caution",
      "acneProne": "safe",
      "rosacea": "safe",
      "pregnancySafe": true
    },
    "descriptionEn": "Terpinen-4-ol rich essential oil with potent antibacterial activity against C. acnes",
    "descriptionAr": "Terpinen-4-ol rich essential oil with potent antibacterial activity against C. acnes",
    "synonyms": [
      "tea tree oil"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_lavandula_angustifolia__lavend",
    "inciName": "Lavandula Angustifolia (Lavender) Oil",
    "normalizedName": "lavandula angustifolia (lavender) oil",
    "casNumber": "8000-28-0",
    "category": [
      "fragrance",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Aromatic essential oil containing linalool and linalyl acetate"
    ],
    "functionsAr": [
      "Aromatic essential oil containing linalool and linalyl acetate"
    ],
    "cirStatus": "Safe as used; potential sensitizer",
    "comedogenicRating": 0,
    "sensitizingPotential": "high",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "avoid",
      "acneProne": "safe",
      "rosacea": "avoid",
      "pregnancySafe": true
    },
    "descriptionEn": "Aromatic essential oil containing linalool and linalyl acetate",
    "descriptionAr": "Aromatic essential oil containing linalool and linalyl acetate",
    "synonyms": [
      "lavender oil"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_linalool",
    "inciName": "Linalool",
    "normalizedName": "linalool",
    "casNumber": "78-70-6",
    "category": [
      "fragrance_allergen",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Naturally occurring terpene alcohol declared under EU cosmetic allergen list"
    ],
    "functionsAr": [
      "Naturally occurring terpene alcohol declared under EU cosmetic allergen list"
    ],
    "cirStatus": "Regulated fragrance allergen",
    "comedogenicRating": 0,
    "sensitizingPotential": "high",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "avoid",
      "acneProne": "safe",
      "rosacea": "avoid",
      "pregnancySafe": true
    },
    "descriptionEn": "Naturally occurring terpene alcohol declared under EU cosmetic allergen list",
    "descriptionAr": "Naturally occurring terpene alcohol declared under EU cosmetic allergen list",
    "synonyms": [
      "3,7-dimethyl-1,6-octadien-3-ol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_limonene",
    "inciName": "Limonene",
    "normalizedName": "limonene",
    "casNumber": "5989-27-5",
    "category": [
      "fragrance_allergen",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Citrus terpene declared under EU cosmetic allergen list"
    ],
    "functionsAr": [
      "Citrus terpene declared under EU cosmetic allergen list"
    ],
    "cirStatus": "Regulated fragrance allergen",
    "comedogenicRating": 0,
    "sensitizingPotential": "high",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "avoid",
      "acneProne": "safe",
      "rosacea": "avoid",
      "pregnancySafe": true
    },
    "descriptionEn": "Citrus terpene declared under EU cosmetic allergen list",
    "descriptionAr": "Citrus terpene declared under EU cosmetic allergen list",
    "synonyms": [
      "d-limonene"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_citronellol",
    "inciName": "Citronellol",
    "normalizedName": "citronellol",
    "casNumber": "106-22-9",
    "category": [
      "fragrance_allergen",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Floral scent compound declared under EU cosmetic allergen rules"
    ],
    "functionsAr": [
      "Floral scent compound declared under EU cosmetic allergen rules"
    ],
    "cirStatus": "Regulated fragrance allergen",
    "comedogenicRating": 0,
    "sensitizingPotential": "high",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "avoid",
      "acneProne": "safe",
      "rosacea": "avoid",
      "pregnancySafe": true
    },
    "descriptionEn": "Floral scent compound declared under EU cosmetic allergen rules",
    "descriptionAr": "Floral scent compound declared under EU cosmetic allergen rules",
    "synonyms": [
      "3,7-dimethyloct-6-en-1-ol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_geraniol",
    "inciName": "Geraniol",
    "normalizedName": "geraniol",
    "casNumber": "106-24-1",
    "category": [
      "fragrance_allergen",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Rose aroma alcohol declared under EU cosmetic allergen list"
    ],
    "functionsAr": [
      "Rose aroma alcohol declared under EU cosmetic allergen list"
    ],
    "cirStatus": "Regulated fragrance allergen",
    "comedogenicRating": 0,
    "sensitizingPotential": "high",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "avoid",
      "acneProne": "safe",
      "rosacea": "avoid",
      "pregnancySafe": true
    },
    "descriptionEn": "Rose aroma alcohol declared under EU cosmetic allergen list",
    "descriptionAr": "Rose aroma alcohol declared under EU cosmetic allergen list",
    "synonyms": [
      "trans-3,7-dimethyl-2,6-octadien-1-ol"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  },
  {
    "id": "ing_parfum",
    "inciName": "Parfum",
    "normalizedName": "parfum",
    "casNumber": "N/A",
    "category": [
      "fragrance",
      "cosmetic_ingredient"
    ],
    "functions": [
      "Proprietary fragrance mixture containing aromatic compounds"
    ],
    "functionsAr": [
      "Proprietary fragrance mixture containing aromatic compounds"
    ],
    "cirStatus": "Regulated by IFRA standards",
    "comedogenicRating": 0,
    "sensitizingPotential": "high",
    "evidenceStatus": "verified",
    "suitability": {
      "oily": "safe",
      "dry": "safe",
      "sensitive": "avoid",
      "acneProne": "safe",
      "rosacea": "avoid",
      "pregnancySafe": true
    },
    "descriptionEn": "Proprietary fragrance mixture containing aromatic compounds",
    "descriptionAr": "Proprietary fragrance mixture containing aromatic compounds",
    "synonyms": [
      "fragrance",
      "aroma"
    ],
    "sources": [
      {
        "sourceId": "CIR_PANEL",
        "sourceName": "Cosmetic Ingredient Review (CIR)",
        "verificationStatus": "verified"
      }
    ]
  }
];

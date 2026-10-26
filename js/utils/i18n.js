/**
 * FormulaLens AI — i18n (Internationalization)
 * Bilingual EN/AR support with RTL/LTR switching
 */

import { BUNDLED_LOCALES } from '../../locales/locales-bundle.js';

let _translations = {};
let _currentLang = 'en';

/**
 * Load a locale file
 */
export async function loadLocale(lang) {
  try {
    // Determine base path (supports GitHub Pages subpath)
    const base = getBasePath();
    const url = `${base}locales/${lang}.json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    _translations = data;
    _currentLang = lang;
    return true;
  } catch (e) {
    console.warn(`[i18n] Fetch failed for '${lang}', using bundled locale dictionary:`, e.message);
    _translations = BUNDLED_LOCALES[lang] || BUNDLED_LOCALES.en || FALLBACK_EN;
    _currentLang = lang;
    return true;
  }
}

/**
 * Get a translated string by dot-notation key
 * Supports template variables: t('key', { name: 'value' })
 */
export function t(key, vars = {}) {
  const parts = key.split('.');
  let value = _translations;

  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      // Key not found — return the key itself as fallback
      return key;
    }
  }

  if (typeof value !== 'string') return key;

  // Replace template variables
  return value.replace(/\{(\w+)\}/g, (match, varName) => {
    return varName in vars ? String(vars[varName]) : match;
  });
}

/**
 * Get current language code
 */
export function getCurrentLang() {
  return _currentLang;
}

/**
 * Get current text direction
 */
export function getCurrentDir() {
  return _currentLang === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Determine the application's base path
 * Handles GitHub Pages subpath deployments
 */
export function getBasePath() {
  // Check for a meta tag specifying the base path
  const meta = document.querySelector('meta[name="app-base-path"]');
  if (meta) return meta.content;

  // Try to detect from script src
  const scripts = document.querySelectorAll('script[src*="app.js"]');
  if (scripts.length > 0) {
    const src = scripts[0].src;
    const match = src.match(/^(.*\/)js\/app\.js/);
    if (match) return match[1];
  }

  // Default to current origin + pathname directory
  const path = window.location.pathname;
  const lastSlash = path.lastIndexOf('/');
  if (lastSlash > 0) {
    return path.substring(0, lastSlash + 1);
  }
  return '/';
}

/**
 * Apply language to the document
 */
export function applyLang(lang) {
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    document.documentElement.setAttribute('data-lang', lang);
    translateDOM();
  }
}

/**
 * Translate all static DOM elements annotated with data-i18n attributes
 */
export function translateDOM() {
  if (typeof document === 'undefined') return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      const translated = t(key);
      if (translated && translated !== key) {
        el.textContent = translated;
      }
    }
  });

  // Also translate any placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      const translated = t(key);
      if (translated && translated !== key) {
        el.setAttribute('placeholder', translated);
      }
    }
  });

  // Also translate title attributes
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (key) {
      const translated = t(key);
      if (translated && translated !== key) {
        el.setAttribute('title', translated);
      }
    }
  });

  // Sidebar brand tagline
  const tagline = document.querySelector('.sidebar__brand-tagline');
  if (tagline) {
    tagline.textContent = _currentLang === 'ar' ? 'الذكاء التجميلي' : 'Cosmetic Intelligence';
  }
}

/**
 * Cosmetic function translations dictionary (EN -> AR)
 */
const COSMETIC_FUNCTIONS_MAP_AR = {
  'skin conditioning': 'مكيف للبشرة',
  'smoothing': 'منعم للبشرة',
  'sebum regulating': 'تنظيم إفراز الدهون',
  'barrier strengthening': 'تقوية الحاجز الجلدي',
  'barrier repair': 'ترميم حاجز البشرة',
  'cell-communicating agent': 'محفز لتواصل وتجديد الخلايا',
  'cell communicating agent': 'محفز لتواصل وتجديد الخلايا',
  'cell renewing': 'تجديد الخلايا',
  'exfoliant': 'مقشر للبشرة',
  'skin renewing': 'تجديد خلايا البشرة',
  'anti-aging': 'مقاوم للتجاعيد وعلامات التقدم في السن',
  'anti aging': 'مقاوم لعلامات التقدم في السن',
  'antibacterial': 'مضاد للبكتيريا المسببة للحبوب',
  'humectant': 'مرطب جذاب للماء',
  'moisturizer': 'مرطب',
  'moisturizing': 'ترطيب عميق',
  'hydrating': 'ترطيب',
  'antioxidant': 'مضاد قوي للأكسدة',
  'soothing': 'مهدئ للبشرة المتهيجة',
  'anti-inflammatory': 'مضاد للالتهابات والاحمرار',
  'anti inflammatory': 'مضاد للالتهاب',
  'emollient': 'مطري ومنعم لخشونة الجلد',
  'occlusive': 'عازل حابس للرطوبة',
  'brightening': 'تفتيح وتوحيد لون البشرة',
  'depigmenting': 'مكافح للتصبغات والبقع',
  'sunscreen': 'واقي من أشعة الشمس',
  'uv filter': 'فلتر واقي من الأشعة فوق البنفسجية',
  'preservative': 'مادة حافظة تمنع التلوث',
  'solvent': 'مذيب للمركبات',
  'surfactant': 'خافض للتوتر السطحي',
  'cleansing agent': 'عامل تنظيف وإزالة الشوائب',
  'cleansing': 'منظف',
  'emulsifier': 'مستحلب لدمج الزيت والماء',
  'emulsifying': 'استحلاب',
  'thickener': 'مكثف قوام',
  'viscosity controlling': 'ضابط للزوجة والقوام',
  'ph adjuster': 'ضابط للحموضة (pH)',
  'buffering agent': 'منظم للأس الهيدروجيني',
  'chelating agent': 'عامل استخلاب لمنع أكسدة المعادن',
  'chelating': 'استخلاب المعادن',
  'astringent': 'قابض للمسام',
  'skin protectant': 'حامي لسطح البشرة',
  'film forming': 'مكوّن لغشاء واقي',
  'penetration enhancer': 'معزز لامتصاص المواد الفعالة',
  'keratolytic': 'محلل للكيراتين ومقشر سطحي',
  'collagen booster': 'محفز لإنتاج الكولاجين',
  'restorative': 'مرمم ومجدد',
  'calming': 'مهدئ ومسكن للتهيج',
  'pore minimizing': 'مقلص لمظهر المسام',
  'firming': 'شد وتحسين مرونة الجلد',
  'repairing': 'إصلاح وترميم',
  'nourishing': 'مغذي للبشرة'
};

/**
 * Translate cosmetic function term
 */
export function translateCosmeticFunction(funcName, isAr) {
  if (!isAr || !funcName) return funcName;
  const lower = String(funcName).trim().toLowerCase();
  return COSMETIC_FUNCTIONS_MAP_AR[lower] || funcName;
}

/**
 * Translate CIR Safety Review Status
 */
export function translateCirStatus(status, isAr) {
  if (!isAr || !status) return status || (isAr ? 'تم التقييم' : 'Evaluated');
  const s = String(status).trim();
  const lower = s.toLowerCase();

  if (lower === 'safe as used in cosmetics' || lower === 'safe as used') {
    return 'آمن وفق الاستخدام المتبع في مستحضرات التجميل';
  }
  if (lower === 'safe with qualifications') {
    return 'آمن مع اشتراطات محددة';
  }
  if (lower.startsWith('safe with concentration limits')) {
    const match = s.match(/\((.*?)\)/);
    if (match) {
      return `آمن ضمن حدود التركيز الموصى بها (${match[1].replace('typically', 'غالباً').replace('<=', '≤')})`;
    }
    return 'آمن ضمن حدود التركيز الموصى بها';
  }
  if (lower === 'safe in cosmetic use') {
    return 'آمن للاستخدام التجميلي';
  }
  if (lower.includes('broken skin')) {
    return 'آمن مع اشتراطات (تجنب التركيزات المرتفعة على الجلد المتضرر)';
  }
  if (lower.includes('rinse-off')) {
    return 'آمن وفق الاستخدام في المستحضرات المغسولة أو بتراكيز منخفضة للمستحضرات الباقية';
  }
  if (lower.includes('non-sensitizing')) {
    return 'آمن وفق الاستخدام؛ غير مسبب للتحسس في المستحضرات المصنعة';
  }
  if (lower.includes('avoid inhalation')) {
    return 'آمن وفق الاستخدام؛ مع تجنب الاستنشاق في مستحضرات الرذاذ';
  }
  if (lower === 'insufficient data to determine safety') {
    return 'بيانات غير كافية حالياً لتحديد الأمان';
  }
  if (lower === 'not safe as used') {
    return 'غير آمن للاستخدام التجميلي';
  }
  if (lower === 'reviewed') {
    return 'تمت مراجعته علمياً';
  }
  if (lower === 'evaluated') {
    return 'تم التقييم والمطابقة';
  }
  if (lower.includes('evaluated as safe')) {
    return 'تم تقييمه كآمن في الظروف التجميلية المعتادة';
  }
  if (lower.startsWith('safe')) {
    return 'آمن وفق تقييم الخبراء';
  }
  return status;
}

/**
 * Translate sensitizing potential level
 */
export function translateSensitizing(level, isAr) {
  if (!isAr) return level ? level.charAt(0).toUpperCase() + level.slice(1) : 'Low';
  const l = String(level || '').toLowerCase();
  if (l === 'high') return 'مرتفع';
  if (l === 'moderate') return 'متوسط';
  if (l === 'none') return 'معدوم';
  return 'منخفض';
}

/**
 * Translate scientific evidence status
 */
export function translateEvidenceStatus(status, isAr) {
  if (!isAr) return status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Verified';
  const s = String(status || '').toLowerCase();
  if (s === 'verified') return 'مؤكد علمياً';
  if (s === 'supported') return 'مدعوم بالأدلة';
  if (s === 'limited') return 'أدلة محدودة';
  return status || 'مؤكد علمياً';
}

/**
 * Format ingredient functions with fallback to Arabic translation
 */
export function formatIngredientFunctions(ing, isAr, max = 2) {
  if (!ing) return '';
  if (isAr && Array.isArray(ing.functionsAr) && ing.functionsAr.length > 0) {
    return ing.functionsAr.slice(0, max).join('، ');
  }
  const fns = ing.functions || [];
  if (isAr) {
    return fns.slice(0, max).map(f => translateCosmeticFunction(f, true)).join('، ');
  }
  return fns.slice(0, max).join(', ');
}

/**
 * Format pregnancy safety badge data
 */
export function getPregnancySuitability(suitability, isAr) {
  if (!suitability || suitability.pregnancySafe === undefined) return null;
  const isSafe = suitability.pregnancySafe === true;
  return {
    isSafe,
    text: isSafe ? (isAr ? 'الحمل: آمن' : 'Pregnancy: Safe') : (isAr ? 'الحمل: تجنب' : 'Pregnancy: Avoid'),
    badgeType: isSafe ? 'mint' : 'rose',
  };
}

/**
 * Format skin type suitability label
 */
export function getSkinSuitabilityLabel(suitability, isAr) {
  if (!suitability) return isAr ? 'البشرة: الكل' : 'Skin: All';

  const skinKeys = [
    { key: 'oily', en: 'Oily', ar: 'دهنية' },
    { key: 'dry', en: 'Dry', ar: 'جافة' },
    { key: 'sensitive', en: 'Sensitive', ar: 'حساسة' },
    { key: 'acneProne', en: 'Acne', ar: 'حبوب' },
    { key: 'rosacea', en: 'Rosacea', ar: 'وردية' },
  ];

  const hasCautionOrAvoid = skinKeys.some(item => {
    const val = suitability[item.key];
    return val === 'caution' || val === 'avoid';
  });

  if (!hasCautionOrAvoid) {
    return isAr ? 'البشرة: الكل' : 'Skin: All';
  }

  // Specific suitable types (beneficial or safe)
  const suitable = skinKeys
    .filter(item => {
      const val = suitability[item.key];
      return val === 'beneficial' || val === 'safe';
    })
    .map(item => (isAr ? item.ar : item.en));

  if (suitable.length === 0) {
    return isAr ? 'البشرة: بحذر' : 'Skin: Caution';
  }

  const list = suitable.slice(0, 2).join(isAr ? '، ' : ', ');
  return isAr ? `البشرة: ${list}` : `Skin: ${list}`;
}

/**
 * Get pregnancy suitability badge HTML for table cells.
 * Only shows content if profile includes 'pregnant'.
 */
export function getPregnancyBadgeHTML(suitability, isAr, profileIncludes) {
  if (!profileIncludes) {
    // Show neutral dash when not selected
    return '—';
  }
  if (!suitability || suitability.pregnancySafe === undefined) {
    return `<span class="badge badge-neutral">${isAr ? 'غير محدد' : 'N/A'}</span>`;
  }
  const isSafe = suitability.pregnancySafe === true;
  const text = isSafe
    ? (isAr ? 'آمن' : 'Safe')
    : (isAr ? 'تجنب' : 'Avoid');
  return `<span class="badge badge-${isSafe ? 'emerald' : 'rose'}">${text}</span>`;
}

/**
 * Get skin type suitability badge HTML for table cells.
 * Shows suitability based on selected skin types in profile.
 * @param {object} suitability - ingredient suitability object
 * @param {boolean} isAr
 * @param {string[]} selectedSkinTypes - array of selected skin type keys (e.g. ['oily','dry'])
 */
export function getSkinBadgeHTML(suitability, isAr, selectedSkinTypes) {
  const skinKeys = [
    { key: 'oily', en: 'Oily', ar: 'دهنية' },
    { key: 'dry', en: 'Dry', ar: 'جافة' },
    { key: 'sensitive', en: 'Sensitive', ar: 'حساسة' },
    { key: 'acneProne', en: 'Acne', ar: 'حبوب' },
    { key: 'rosacea', en: 'Rosacea', ar: 'وردية' },
  ];

  // Filter only the selected skin types (excluding 'pregnant')
  const activeSkinTypes = skinKeys.filter(item => selectedSkinTypes && selectedSkinTypes.includes(item.key));

  if (!activeSkinTypes.length) {
    // No skin type selected — show generic label
    if (!suitability) return `<span class="badge badge-neutral">${isAr ? 'الكل' : 'All'}</span>`;
    const hasCaution = skinKeys.some(item => {
      const val = suitability[item.key];
      return val === 'caution' || val === 'avoid';
    });
    return `<span class="badge badge-${hasCaution ? 'amber' : 'emerald'}">${isAr ? (hasCaution ? 'بحذر' : 'الكل') : (hasCaution ? 'Caution' : 'All')}</span>`;
  }

  if (!suitability) {
    return `<span class="badge badge-neutral">${isAr ? 'الكل' : 'All'}</span>`;
  }

  // Determine worst level among selected types
  let worst = 'beneficial';
  for (const item of activeSkinTypes) {
    const val = suitability[item.key];
    if (val === 'avoid') { worst = 'avoid'; break; }
    if (val === 'caution') worst = 'caution';
  }

  if (worst === 'avoid') {
    return `<span class="badge badge-rose">${isAr ? 'تجنب' : 'Avoid'}</span>`;
  }
  if (worst === 'caution') {
    return `<span class="badge badge-amber">${isAr ? 'بحذر' : 'Caution'}</span>`;
  }
  return `<span class="badge badge-emerald">${isAr ? 'مناسب' : 'Suitable'}</span>`;
}

/**
 * Initialize i18n system
 */
export async function initI18n(lang = 'en') {
  await loadLocale(lang);
  applyLang(lang);
  return true;
}

/**
 * Set active locale
 */
export async function setLocale(lang) {
  return initI18n(lang);
}

/**
 * Get supported locale list
 */
export function getSupportedLocales() {
  return [
    { code: 'en', name: 'English', dir: 'ltr' },
    { code: 'ar', name: 'العربية', dir: 'rtl' },
  ];
}

// Minimal fallback strings if locale file fails to load
const FALLBACK_EN = {
  app: { name: 'FormulaLens AI', tagline: 'Cosmetic Ingredient Analysis' },
  common: {
    loading: 'Loading...', save: 'Save', cancel: 'Cancel', delete: 'Delete',
    close: 'Close', back: 'Back', confirm: 'Confirm', done: 'Done',
    retry: 'Retry', unknown: 'Unknown',
  },
  errors: {
    generic: 'Something went wrong. Please try again.',
    db_init_failed: 'Database initialization failed.',
  },
  nav: {
    dashboard: 'Dashboard', analysis: 'Product Analysis',
    library: 'Ingredient Library', comparison: 'Compare Products',
    saved: 'Saved Products', history: 'Analysis History', settings: 'Settings',
  },
};

/**
 * FormulaLens AI — State Management
 * Centralized reactive application state
 */

const _listeners = new Map();
const _state = {
  // App
  initialized: false,
  dbReady: false,
  datasetImported: false,
  online: navigator.onLine,
  updateAvailable: false,

  // UI
  lang: 'en',
  dir: 'ltr',
  theme: 'light', // 'light' | 'dark' | 'system'
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  currentPage: 'dashboard',
  previousPage: null,
  toasts: [],

  // AI
  selectedProvider: null, // 'gemini' | 'openai' | 'anthropic'
  selectedModel: null,
  providerStatus: {}, // { gemini: 'ready'|'unconfigured'|'error', ... }

  // Analysis
  currentAnalysis: null,
  analysisStage: null, // null | 'reading' | 'matching' | 'evidence' | 'ai' | 'presenting' | 'done' | 'error'
  analysisProgress: 0,
  skinProfiles: [],

  // Library
  libraryQuery: '',
  libraryCategory: null,
  selectedIngredient: null,
  libraryResults: [],
  libraryPage: 0,
  libraryTotal: 0,

  // Comparison
  comparisonProducts: [], // max 3
  comparisonSkinProfile: null,

  // DB info
  ingredientCount: 0,
  datasetVersion: null,
  dbLastImport: null,

  // Stats
  analysisCount: 0,
  savedCount: 0,
};

/**
 * Get a copy of current state or a specific key
 */
export function getState(key) {
  if (key !== undefined) {
    return _state[key];
  }
  return { ..._state };
}

/**
 * Update state and notify listeners
 * @param {Object|Function} updater - partial state object or updater function
 */
export function setState(updater) {
  const updates = typeof updater === 'function' ? updater(_state) : updater;
  const changedKeys = [];

  for (const [key, value] of Object.entries(updates)) {
    if (_state[key] !== value) {
      _state[key] = value;
      changedKeys.push(key);
    }
  }

  if (changedKeys.length === 0) return;

  // Notify specific-key listeners
  for (const key of changedKeys) {
    const keyListeners = _listeners.get(key);
    if (keyListeners) {
      for (const cb of keyListeners) {
        try { cb(_state[key], key, _state); } catch (e) { console.error('[State]', e); }
      }
    }
  }

  // Notify wildcard listeners
  const wildcardListeners = _listeners.get('*');
  if (wildcardListeners) {
    for (const cb of wildcardListeners) {
      try { cb(changedKeys, _state); } catch (e) { console.error('[State]', e); }
    }
  }
}

/**
 * Subscribe to state changes
 * @param {string|string[]} keys - state key(s) to watch, or '*' for all
 * @param {Function} callback
 * @returns {Function} unsubscribe function
 */
export function subscribe(keys, callback) {
  const keyList = Array.isArray(keys) ? keys : [keys];

  for (const key of keyList) {
    if (!_listeners.has(key)) {
      _listeners.set(key, new Set());
    }
    _listeners.get(key).add(callback);
  }

  return () => {
    for (const key of keyList) {
      _listeners.get(key)?.delete(callback);
    }
  };
}

/**
 * Initialize state from localStorage
 */
export function initStateFromStorage() {
  try {
    const lang = localStorage.getItem('fl_lang') || 'en';
    const theme = localStorage.getItem('fl_theme') || 'system';
    const provider = localStorage.getItem('fl_provider') || null;
    const model = localStorage.getItem('fl_model') || null;
    const sidebarCollapsed = localStorage.getItem('fl_sidebar_collapsed') === 'true';
    let skinProfiles = [];
    try {
      const rawProfiles = localStorage.getItem('fl_skin_profiles');
      if (rawProfiles) skinProfiles = JSON.parse(rawProfiles);
    } catch (e) {
      skinProfiles = [];
    }

    setState({
      lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      theme,
      selectedProvider: provider,
      selectedModel: model,
      sidebarCollapsed,
      skinProfiles: Array.isArray(skinProfiles) ? skinProfiles : [],
    });
  } catch (e) {
    console.warn('[State] Could not read localStorage:', e);
  }
}

/**
 * Persist selected state keys to localStorage
 */
export function persistState(keys) {
  const keyMap = {
    lang: 'fl_lang',
    theme: 'fl_theme',
    selectedProvider: 'fl_provider',
    selectedModel: 'fl_model',
    sidebarCollapsed: 'fl_sidebar_collapsed',
    skinProfiles: 'fl_skin_profiles',
  };

  for (const key of keys) {
    const storageKey = keyMap[key];
    if (storageKey && _state[key] !== null && _state[key] !== undefined) {
      try {
        const val = typeof _state[key] === 'object' ? JSON.stringify(_state[key]) : String(_state[key]);
        localStorage.setItem(storageKey, val);
      } catch (e) {
        console.warn('[State] Could not persist', key, e);
      }
    }
  }
}

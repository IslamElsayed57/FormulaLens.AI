/**
 * FormulaLens AI — IndexedDB Layer
 * Schema migrations, initialization, and structured data access
 */

const DB_NAME = 'formulalens-db';
const DB_VERSION = 2;

let _db = null;

/**
 * Open and migrate the IndexedDB database
 */
export async function openDatabase() {
  return new Promise((resolve, reject) => {
    if (_db) {
      resolve(_db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const oldVersion = event.oldVersion;
      migrateDatabase(db, oldVersion, DB_VERSION);
    };

    request.onsuccess = (event) => {
      _db = event.target.result;

      _db.onversionchange = () => {
        _db.close();
        _db = null;
        console.warn('[DB] Database version changed. Please reload.');
      };

      resolve(_db);
    };

    request.onerror = (event) => {
      console.error('[DB] Failed to open database:', event.target.error);
      reject(event.target.error);
    };

    request.onblocked = () => {
      console.warn('[DB] Database upgrade blocked by another tab.');
    };
  });
}

/**
 * Run schema migrations based on version
 */
function migrateDatabase(db, oldVersion, newVersion) {
  console.log(`[DB] Migrating from v${oldVersion} to v${newVersion}`);

  // ── V1: Core stores ──────────────────────────────────────
  if (oldVersion < 1) {
    // Ingredients store (base dataset)
    const ingredientStore = db.createObjectStore('ingredients', { keyPath: 'id' });
    ingredientStore.createIndex('normalizedName', 'normalizedName', { unique: true });
    ingredientStore.createIndex('category', 'category', { unique: false, multiEntry: true });
    ingredientStore.createIndex('evidenceStatus', 'evidenceStatus', { unique: false });
    ingredientStore.createIndex('inciName', 'inciName', { unique: false });

    // Synonyms store
    const synonymStore = db.createObjectStore('synonyms', { keyPath: 'id', autoIncrement: true });
    synonymStore.createIndex('synonym', 'synonym', { unique: false });
    synonymStore.createIndex('ingredientId', 'ingredientId', { unique: false });

    // Saved products store
    const productStore = db.createObjectStore('saved_products', { keyPath: 'id' });
    productStore.createIndex('savedAt', 'savedAt', { unique: false });
    productStore.createIndex('name', 'name', { unique: false });

    // Analysis history store
    const historyStore = db.createObjectStore('analysis_history', { keyPath: 'id' });
    historyStore.createIndex('createdAt', 'createdAt', { unique: false });
    historyStore.createIndex('productId', 'productId', { unique: false });
    historyStore.createIndex('provider', 'provider', { unique: false });

    // Comparisons store
    const compStore = db.createObjectStore('comparisons', { keyPath: 'id' });
    compStore.createIndex('createdAt', 'createdAt', { unique: false });

    // Research records store
    const researchStore = db.createObjectStore('research_records', { keyPath: 'id' });
    researchStore.createIndex('ingredientId', 'ingredientId', { unique: false });
    researchStore.createIndex('evidenceStatus', 'evidenceStatus', { unique: false });
    researchStore.createIndex('createdAt', 'createdAt', { unique: false });

    // User notes store
    const notesStore = db.createObjectStore('user_notes', { keyPath: 'id' });
    notesStore.createIndex('ingredientId', 'ingredientId', { unique: false });
    notesStore.createIndex('createdAt', 'createdAt', { unique: false });

    // Dataset version metadata store
    db.createObjectStore('dataset_meta', { keyPath: 'key' });

    // App settings (overflow from localStorage)
    db.createObjectStore('app_settings', { keyPath: 'key' });
  }

  // ── V2: Confirmed ingredient lists ───────────────────────
  if (oldVersion < 2) {
    const confirmedStore = db.createObjectStore('confirmed_lists', { keyPath: 'id' });
    confirmedStore.createIndex('createdAt', 'createdAt', { unique: false });
    confirmedStore.createIndex('productName', 'productName', { unique: false });
  }
}

/**
 * Get the database instance (must call openDatabase first)
 */
export function getDatabase() {
  if (!_db) throw new Error('[DB] Database not initialized. Call openDatabase() first.');
  return _db;
}

// ──────────────────────────────────────────────────────────
// GENERIC STORE HELPERS
// ──────────────────────────────────────────────────────────

/**
 * Execute a transaction and return the result
 */
export function transaction(storeName, mode, callback) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const tx = db.transaction(storeName, mode);
    const store = tx.objectStore(storeName);

    let result;

    tx.oncomplete = () => resolve(result);
    tx.onerror = (e) => reject(e.target.error);
    tx.onabort = (e) => reject(e.target.error || new Error('Transaction aborted'));

    try {
      const returnVal = callback(store, tx);
      if (returnVal instanceof Promise) {
        returnVal.then(v => { result = v; }).catch(e => tx.abort());
      } else if (returnVal instanceof IDBRequest) {
        returnVal.onsuccess = (e) => { result = e.target.result; };
        returnVal.onerror = (e) => reject(e.target.error);
      } else {
        result = returnVal;
      }
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * Put a single record (add or update)
 */
export async function putRecord(storeName, record) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Get a record by key
 */
export async function getRecord(storeName, key) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Delete a record by key
 */
export async function deleteRecord(storeName, key) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.delete(key);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Get all records from a store (with optional limit)
 */
export async function getAllRecords(storeName, limit = null) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = limit ? store.getAll(null, limit) : store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Count records in a store
 */
export async function countRecords(storeName) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Query records by index
 */
export async function queryByIndex(storeName, indexName, value) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    const req = index.getAll(IDBKeyRange.only(value));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Batch insert records (with duplicate detection)
 * Returns { inserted, skipped, errors }
 */
export async function batchInsert(storeName, records, { onProgress, batchSize = 100 } = {}) {
  const db = getDatabase();
  let inserted = 0;
  let skipped = 0;
  let errors = 0;
  const total = records.length;

  for (let i = 0; i < total; i += batchSize) {
    const batch = records.slice(i, i + batchSize);

    await new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);

      tx.oncomplete = () => resolve();
      tx.onerror = (e) => {
        console.error('[DB] Batch transaction error:', e.target.error);
        resolve(); // Don't reject; continue with next batch
      };

      for (const record of batch) {
        const req = store.put(record);
        req.onsuccess = () => inserted++;
        req.onerror = (e) => {
          if (e.target.error?.name === 'ConstraintError') {
            skipped++;
          } else {
            errors++;
            console.warn('[DB] Record insert error:', e.target.error);
          }
          e.preventDefault(); // Don't abort the whole transaction
        };
      }
    });

    if (onProgress) {
      const processed = Math.min(i + batchSize, total);
      onProgress(processed, total, { inserted, skipped, errors });
    }
  }

  return { inserted, skipped, errors, total };
}

// ──────────────────────────────────────────────────────────
// INGREDIENT-SPECIFIC QUERIES
// ──────────────────────────────────────────────────────────

/**
 * Search ingredients by normalized name prefix
 */
export async function searchIngredients(query, { category = null, limit = 50 } = {}) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const tx = db.transaction('ingredients', 'readonly');
    const store = tx.objectStore('ingredients');

    const results = [];
    const normalizedQuery = query.toLowerCase().trim();

    const req = store.openCursor();

    req.onsuccess = (event) => {
      const cursor = event.target.result;
      if (!cursor || results.length >= limit) {
        resolve(results);
        return;
      }

      const record = cursor.value;
      const matches =
        record.normalizedName?.includes(normalizedQuery) ||
        record.inciName?.toLowerCase().includes(normalizedQuery) ||
        record.synonyms?.some(s => s.toLowerCase().includes(normalizedQuery));

      const categoryMatches = !category ||
        (Array.isArray(record.category)
          ? record.category.includes(category)
          : record.category === category);

      if (matches && categoryMatches) {
        results.push(record);
      }

      cursor.continue();
    };

    req.onerror = () => reject(req.error);
  });
}

/**
 * Find exact ingredient by normalized name
 */
export async function findIngredientByName(normalizedName) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const tx = db.transaction('ingredients', 'readonly');
    const store = tx.objectStore('ingredients');
    const index = store.index('normalizedName');
    const req = index.get(normalizedName.toLowerCase().trim());
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Find synonym record
 */
export async function findSynonym(synonymText) {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    const tx = db.transaction('synonyms', 'readonly');
    const store = tx.objectStore('synonyms');
    const index = store.index('synonym');
    const req = index.get(synonymText.toLowerCase().trim());
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

// ──────────────────────────────────────────────────────────
// DATASET METADATA
// ──────────────────────────────────────────────────────────

export async function getDatasetMeta(key) {
  return getRecord('dataset_meta', key);
}

export async function setDatasetMeta(key, value) {
  return putRecord('dataset_meta', { key, value });
}

// ──────────────────────────────────────────────────────────
// EXPORT / BACKUP HELPERS
// ──────────────────────────────────────────────────────────

/**
 * Export user data (never includes API keys)
 * Returns structured export object
 */
export async function exportUserData() {
  const [savedProducts, analysisHistory, comparisons, userNotes, confirmedLists, researchRecords] =
    await Promise.all([
      getAllRecords('saved_products'),
      getAllRecords('analysis_history'),
      getAllRecords('comparisons'),
      getAllRecords('user_notes'),
      getAllRecords('confirmed_lists'),
      getAllRecords('research_records'),
    ]);

  return {
    schemaVersion: '1.0.0',
    exportedAt: new Date().toISOString(),
    appVersion: '1.0.0',
    note: 'API keys are never exported. Import this file to restore your local data.',
    data: {
      savedProducts,
      analysisHistory,
      comparisons,
      userNotes,
      confirmedLists,
      researchRecords,
    },
  };
}

/**
 * Import user data from backup
 * Validates schema before writing
 * Does not overwrite existing records (skip on conflict)
 */
export async function importUserData(backup) {
  // Validate schema
  if (!backup || typeof backup !== 'object') {
    throw new Error('Invalid backup: not an object');
  }
  if (!backup.schemaVersion) {
    throw new Error('Invalid backup: missing schemaVersion');
  }
  if (!backup.data || typeof backup.data !== 'object') {
    throw new Error('Invalid backup: missing data section');
  }

  // Reject API key fields if accidentally present
  const sensitiveKeys = ['apiKey', 'api_key', 'key', 'token', 'secret'];
  const backupStr = JSON.stringify(backup);
  for (const sk of sensitiveKeys) {
    if (backupStr.toLowerCase().includes(`"${sk}"`)) {
      console.warn('[DB] Backup contains potentially sensitive field:', sk);
    }
  }

  const results = {};

  const storeMap = {
    savedProducts: 'saved_products',
    analysisHistory: 'analysis_history',
    comparisons: 'comparisons',
    userNotes: 'user_notes',
    confirmedLists: 'confirmed_lists',
    researchRecords: 'research_records',
  };

  for (const [dataKey, storeName] of Object.entries(storeMap)) {
    const records = backup.data[dataKey];
    if (!Array.isArray(records)) {
      results[dataKey] = { skipped: 0, imported: 0, error: 'Not an array' };
      continue;
    }

    // Validate each record has an id
    const valid = records.filter(r => r && typeof r === 'object' && r.id);
    const result = await batchInsert(storeName, valid);
    results[dataKey] = result;
  }

  return results;
}

/**
 * Clear all user-generated data (not the ingredient dataset)
 */
export async function clearUserData() {
  const stores = ['saved_products', 'analysis_history', 'comparisons', 'user_notes', 'confirmed_lists', 'research_records'];
  const db = getDatabase();

  for (const storeName of stores) {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
}

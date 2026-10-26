/**
 * FormulaLens AI — Progressive Web App Service Worker
 * Provides offline caching, asset management, and background resilience
 */

const CACHE_NAME = 'formulalens-v1.1.5';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './css/variables.css',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/pages.css',
  './css/responsive.css',
  './js/app.js',
  './js/state.js',
  './js/utils/dom.js',
  './js/utils/i18n.js',
  './js/database/indexeddb.js',
  './js/database/data-importer.js',
  './js/research/source-registry.js',
  './js/research/source-policy.js',
  './js/research/literature-search.js',
  './js/ai/prompt-builder.js',
  './js/ai/response-validator.js',
  './js/ai/orchestrator.js',
  './js/ai/providers/gemini.js',
  './js/ai/providers/openai.js',
  './js/ai/providers/anthropic.js',
  './js/ocr/ocr-engine.js',
  './js/analysis/analyzer.js',
  './js/analysis/safety-scoring.js',
  './js/analysis/comparison.js',
  './js/components/bento-card.js',
  './js/components/stage-tracker.js',
  './js/components/toast.js',
  './js/components/modal.js',
  './js/pages/dashboard.js',
  './js/pages/analyzer.js',
  './js/pages/compare.js',
  './js/pages/library.js',
  './js/pages/profile.js',
  './js/pages/history.js',
  './js/pages/settings.js',
  './locales/en.json',
  './locales/ar.json',
  './data/data-manifest.json',
  './data/ingredients.json',
  './data/dataset-fallback.js',
  './locales/locales-bundle.js',
  './assets/icons/favicon-32.png',
  './assets/icons/favicon-64.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching app shell assets');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[SW] Some assets failed to pre-cache during install:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Never cache AI provider API calls or Tesseract remote CDN models
  if (
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('openai.com') ||
    url.hostname.includes('anthropic.com')
  ) {
    return; // Pass through straight to network
  }

  // Stale-While-Revalidate for app assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Network failed, return cached response if available
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});

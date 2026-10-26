/**
 * FormulaLens AI — Main Application Router & Bootstrap
 * Orchestrates IndexedDB, Dataset Importer, PWA Service Worker, Router, and bilingual UI
 */

import { initStateFromStorage, getState, setState, subscribe, persistState } from './state.js';
import { initI18n, t, setLocale, translateDOM } from './utils/i18n.js';
import { openDatabase } from './database/indexeddb.js';
import { needsDatasetImport, importDataset } from './database/data-importer.js';
import { renderIcon } from './utils/dom.js';
import { getActiveProvider } from './ai/orchestrator.js';
import { showToast } from './components/toast.js';

// Page Renderers
import { renderDashboard } from './pages/dashboard.js';
import { renderAnalyzer } from './pages/analyzer.js';
import { renderCompare } from './pages/compare.js';
import { renderLibrary } from './pages/library.js';
import { renderProfile } from './pages/profile.js';
import { renderHistory } from './pages/history.js';
import { renderSettings } from './pages/settings.js';

const ROUTES = {
  dashboard: renderDashboard,
  analyzer: renderAnalyzer,
  compare: renderCompare,
  library: renderLibrary,
  profile: renderProfile,
  history: renderHistory,
  settings: renderSettings,
};

/**
 * Initialize application
 */
async function initApp() {
  console.log('[App] Initializing FormulaLens AI...');

  // 1. Initialize State & Preferences
  initStateFromStorage();
  const currentLang = getState('lang') || 'en';
  const currentTheme = getState('theme') || 'system';

  // Apply Theme
  applyTheme(currentTheme);

  // Listen to OS theme changes if theme is system
  if (typeof window !== 'undefined' && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if ((getState('theme') || 'system') === 'system') {
        applyTheme('system');
      }
    });
  }

  // 2. Initialize i18n
  await initI18n(currentLang);
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

  // 3. Open IndexedDB & Check Dataset
  try {
    await openDatabase();
    setState({ dbReady: true });

    if (await needsDatasetImport()) {
      console.log('[App] First run detected. Importing scientific dataset...');
      showToast(currentLang === 'ar' ? 'جاري تجهيز قاعدة البيانات العلمية...' : 'Preparing local cosmetic scientific database...', { type: 'info' });
      await importDataset({
        onProgress: (cur, tot) => {
          // progress callback
        },
      });
      console.log('[App] Scientific dataset import completed.');
      setState({ datasetImported: true });
    }
  } catch (err) {
    console.error('[App] Database initialization failed:', err);
    showToast(`Database warning: ${err.message}`, { type: 'warning' });
  }

  // 4. Populate SVG Icons in static HTML shell
  populateStaticIcons();

  // 5. Setup UI interactions
  setupGlobalControls();

  // 6. Setup Router & Hash Navigation
  window.addEventListener('hashchange', handleRoute);
  window.addEventListener('app:navigate', (e) => {
    if (e.detail?.page) {
      window.location.hash = '#' + e.detail.page;
    }
  });
  handleRoute();

  // 7. Register PWA Service Worker
  registerServiceWorker();

  // 8. Update Topbar Indicators
  updateTopbarIndicators();
  subscribe(['lang', 'theme', 'selectedProvider'], (state) => {
    applyTheme(state.theme || getState('theme'));
    updateTopbarIndicators();
    populateStaticIcons();
    translateDOM();
  });

  setState({ initialized: true });
}

/**
 * Route handler
 */
async function handleRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase() || 'dashboard';
  const page = ROUTES[hash] ? hash : 'dashboard';

  setState({ currentPage: page });

  // Update Sidebar active link
  document.querySelectorAll('.sidebar__nav-item').forEach(item => {
    const itemPage = item.getAttribute('data-page');
    if (itemPage === page) {
      item.classList.add('sidebar__nav-item--active');
    } else {
      item.classList.remove('sidebar__nav-item--active');
    }
  });

  // Update Topbar Title
  const titleEl = document.getElementById('topbar-page-title');
  if (titleEl) {
    titleEl.textContent = formatPageTitle(page);
  }

  // Close mobile sidebar on navigation
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    const wasOpen = sidebar.classList.contains('sidebar--mobile-open');
    sidebar.classList.remove('sidebar--mobile-open');
    document.getElementById('btn-mobile-menu')?.setAttribute('aria-expanded', 'false');
    document.getElementById('sidebar-overlay')?.classList.remove('sidebar-overlay--visible');
    if (wasOpen) document.body.classList.remove('sidebar-mobile-open');
  }

  // Render Page
  const contentContainer = document.getElementById('page-content');
  if (contentContainer && ROUTES[page]) {
    try {
      contentContainer.innerHTML = '';
      await ROUTES[page](contentContainer);
    } catch (e) {
      console.error(`[App] Error rendering page ${page}:`, e);
      contentContainer.innerHTML = `
        <div class="empty-state-full bento-card">
          <h3>Error loading page</h3>
          <p class="text-sm text-muted">${e.message}</p>
        </div>
      `;
    }
  }
}

function formatPageTitle(page) {
  const isAr = getState('lang') === 'ar';
  const titles = {
    dashboard: isAr ? 'لوحة التحكم' : 'Dashboard',
    analyzer: isAr ? 'تحليل التركيبة' : 'Formula Analyzer',
    compare: isAr ? 'مقارنة المنتجات' : 'Compare Products',
    library: isAr ? 'موسوعة المكونات' : 'Ingredient Library',
    profile: isAr ? 'الملف الشخصي' : 'Skin Profile',
    history: isAr ? 'سجل الفحص' : 'Scan History',
    settings: isAr ? 'الإعدادات ومفاتيح الذكاء' : 'Settings & AI Keys',
  };
  return titles[page] || page;
}

/**
 * Populate all static elements with data-icon attribute
 */
function populateStaticIcons() {
  document.querySelectorAll('[data-icon]').forEach(el => {
    const iconName = el.getAttribute('data-icon');
    if (iconName) {
      el.innerHTML = renderIcon(iconName, 18);
    }
  });
}

/**
 * Apply theme to document (sets both data-theme attribute and CSS classes)
 */
export function applyTheme(theme) {
  let resolvedTheme = theme;
  if (!resolvedTheme || resolvedTheme === 'system') {
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    resolvedTheme = prefersDark ? 'dark' : 'light';
  }

  if (resolvedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }

  // Synchronize Topbar Theme Toggle Icon
  const btnTheme = typeof document !== 'undefined' && document.getElementById ? document.getElementById('btn-theme-toggle') : null;
  if (btnTheme) {
    btnTheme.innerHTML = renderIcon(resolvedTheme === 'dark' ? 'sun' : 'moon', 18);
    const isAr = getState('lang') === 'ar';
    btnTheme.setAttribute('title', resolvedTheme === 'dark'
      ? (isAr ? 'التبديل إلى المظهر الفاتح' : 'Switch to Light Theme')
      : (isAr ? 'التبديل إلى المظهر الداكن' : 'Switch to Dark Theme'));
  }
}

/**
 * Setup Sidebar, Theme & Lang toggles
 */
function setupGlobalControls() {
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('main-content');
  const btnToggleSidebar = document.getElementById('btn-sidebar-toggle');
  const btnMobileMenu = document.getElementById('btn-mobile-menu');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  const btnTheme = document.getElementById('btn-theme-toggle');
  const btnLang = document.getElementById('btn-lang-toggle');

  // Sidebar Desktop Collapse
  if (btnToggleSidebar && sidebar && mainContent) {
    btnToggleSidebar.addEventListener('click', () => {
      sidebar.classList.toggle('sidebar--collapsed');
      mainContent.classList.toggle('main-content--sidebar-collapsed');
      const isCollapsed = sidebar.classList.contains('sidebar--collapsed');
      localStorage.setItem('fl_sidebar_collapsed', String(isCollapsed));
      setState({ sidebarCollapsed: isCollapsed });
    });
  }

  // Mobile Menu Drawer
  if (btnMobileMenu && sidebar) {
    btnMobileMenu.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('sidebar--mobile-open');
      document.body.classList.toggle('sidebar-mobile-open', isOpen);
      btnMobileMenu.setAttribute('aria-expanded', String(isOpen));
      sidebarOverlay?.classList.toggle('sidebar-overlay--visible', isOpen);
    });
  }

  sidebarOverlay?.addEventListener('click', () => {
    sidebar.classList.remove('sidebar--mobile-open');
    document.body.classList.remove('sidebar-mobile-open');
    btnMobileMenu?.setAttribute('aria-expanded', 'false');
    sidebarOverlay.classList.remove('sidebar-overlay--visible');
  });

  // Theme Toggle (Topbar)
  if (btnTheme) {
    btnTheme.addEventListener('click', () => {
      const isCurrentlyDark = document.documentElement.getAttribute('data-theme') === 'dark' || document.documentElement.classList.contains('dark');
      const next = isCurrentlyDark ? 'light' : 'dark';
      setState({ theme: next });
      persistState(['theme']);
      applyTheme(next);
      const isAr = getState('lang') === 'ar';
      showToast(isAr ? (next === 'dark' ? 'تم تفعيل المظهر الداكن' : 'تم تفعيل المظهر الفاتح') : `Theme set to: ${next}`, { type: 'info' });
    });
  }

  // Lang Toggle
  if (btnLang) {
    btnLang.addEventListener('click', async () => {
      const current = getState('lang');
      const next = current === 'ar' ? 'en' : 'ar';
      await setLocale(next);
      setState({ lang: next, dir: next === 'ar' ? 'rtl' : 'ltr' });
      persistState(['lang']);
      document.documentElement.lang = next;
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';

      // Re-route to refresh current page in new language
      handleRoute();
    });
  }
}

/**
 * Update Topbar indicators
 */
function updateTopbarIndicators() {
  const activeProv = getActiveProvider();
  const isAr = getState('lang') === 'ar';

  const badge = document.getElementById('topbar-provider-badge');
  if (badge) {
    if (activeProv) {
      badge.textContent = `AI: ${activeProv.toUpperCase()}`;
      badge.className = 'badge badge-emerald cursor-pointer';
    } else {
      badge.textContent = isAr ? 'المحرك: محلي' : 'AI: Local';
      badge.className = 'badge badge-mint cursor-pointer';
    }
  }

  const langText = document.getElementById('lang-toggle-text');
  if (langText) {
    langText.textContent = isAr ? 'English' : 'العربية';
  }
}

/**
 * Register Service Worker for PWA offline capabilities
 */
function registerServiceWorker() {
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    navigator.serviceWorker.register('./sw.js').then((reg) => {
      console.log('[SW] ServiceWorker registered with scope:', reg.scope);
      reg.addEventListener('updatefound', () => {
        const installingWorker = reg.installing;
        if (installingWorker) {
          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showToast(getState('lang') === 'ar' ? 'يتوفر إصدار جديد للتطبيق. أعد التحميل للحصول عليه.' : 'A new update is available. Reload to update.', {
                type: 'info',
                actionLabel: getState('lang') === 'ar' ? 'تحديث' : 'Reload',
                onAction: () => window.location.reload(),
              });
            }
          });
        }
      });
    }).catch((err) => {
      console.warn('[SW] ServiceWorker registration failed:', err);
    });
  }
}

// Start application when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
}


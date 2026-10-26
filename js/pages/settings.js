/**
 * FormulaLens AI — Settings Page
 * AI Provider API Keys, connection testers, Theme & Language toggles, data backups
 */

import { createElement, renderIcon } from '../utils/dom.js';
import { createBentoCard } from '../components/bento-card.js';
import { testProviderKey, PROVIDERS } from '../ai/orchestrator.js';
import { setLocale, getSupportedLocales } from '../utils/i18n.js';
import { exportUserData, importUserData, clearUserData } from '../database/indexeddb.js';
import { getState, setState, persistState } from '../state.js';
import { showToast } from '../components/toast.js';
import { openModal } from '../components/modal.js';

export function renderSettings(container) {
  container.innerHTML = '';
  const isAr = getState('lang') === 'ar';

  const view = createElement('div', { className: 'settings-view' });
  const grid = createElement('div', { className: 'bento-grid settings-grid' });

  // ── 1. AI PROVIDER SETTINGS (Col 2) ─────────────────────────────
  const storedGemini = localStorage.getItem('fl_api_gemini') || '';
  const storedOpenAI = localStorage.getItem('fl_api_openai') || '';
  const storedAnthropic = localStorage.getItem('fl_api_anthropic') || '';
  const storedProvider = localStorage.getItem('fl_provider') || 'gemini';

  const aiCard = createBentoCard({
    id: 'settings-ai-card',
    colSpan: '2',
    rowSpan: '2',
    icon: 'sparkles',
    title: isAr ? 'إدارة مفاتيح مزودي الذكاء الاصطناعي' : 'AI Provider Configurations',
    subtitle: isAr ? 'تحكم في مفاتيح API الخاصة بك. تُحفظ المفاتيح محلياً على جهازك فقط ولا تُرسل لأي خادم وسيط.' : 'Client-side direct connections. Your API keys are encrypted in localStorage and never sent to a middleman server.',
    badge: isAr ? '3 مزودين' : '3 Providers',
    badgeType: 'emerald',
    content: `
      <div class="ai-provider-settings-list">
        <!-- Default Provider Selector -->
        <div class="setting-row">
          <label class="form-label font-bold">${isAr ? 'المزود المفضل الافتراضي:' : 'Default Preferred Provider:'}</label>
          <select id="select-active-provider" class="form-select">
            <option value="gemini" ${storedProvider === 'gemini' ? 'selected' : ''}>Google Gemini</option>
            <option value="openai" ${storedProvider === 'openai' ? 'selected' : ''}>OpenAI</option>
            <option value="anthropic" ${storedProvider === 'anthropic' ? 'selected' : ''}>Anthropic Claude</option>
            <option value="local" ${storedProvider === 'local' ? 'selected' : ''}>${isAr ? 'المحرك المحلي (بدون مفتاح)' : 'Offline Local Engine'}</option>
          </select>
        </div>

        <hr class="divider-subtle" />

        <!-- Gemini -->
        <div class="provider-box">
          <div class="provider-header">
            <strong>Google Gemini</strong>
            <span class="badge ${storedGemini ? 'badge-emerald' : 'badge-neutral'}">${storedGemini ? (isAr ? 'مُهيأ' : 'Configured') : (isAr ? 'غير مدخل' : 'Missing')}</span>
          </div>
          <div class="provider-inputs">
            <input type="password" id="key-gemini" class="form-input text-xs font-mono" placeholder="AIzaSy..." value="${storedGemini}" />
            <div class="flex gap-2 mt-2">
              <button type="button" class="btn btn-xs btn-secondary btn-test-key" data-provider="gemini">${renderIcon('check', 14)} <span>${isAr ? 'اختبار الاتصال' : 'Test Key'}</span></button>
              <button type="button" class="btn btn-xs btn-ghost btn-save-key" data-provider="gemini">${renderIcon('save', 14)} <span>${isAr ? 'حفظ' : 'Save'}</span></button>
            </div>
          </div>
        </div>

        <!-- OpenAI -->
        <div class="provider-box mt-3">
          <div class="provider-header">
            <strong>OpenAI</strong>
            <span class="badge ${storedOpenAI ? 'badge-emerald' : 'badge-neutral'}">${storedOpenAI ? (isAr ? 'مُهيأ' : 'Configured') : (isAr ? 'غير مدخل' : 'Missing')}</span>
          </div>
          <div class="provider-inputs">
            <input type="password" id="key-openai" class="form-input text-xs font-mono" placeholder="sk-proj-..." value="${storedOpenAI}" />
            <div class="flex gap-2 mt-2">
              <button type="button" class="btn btn-xs btn-secondary btn-test-key" data-provider="openai">${renderIcon('check', 14)} <span>${isAr ? 'اختبار الاتصال' : 'Test Key'}</span></button>
              <button type="button" class="btn btn-xs btn-ghost btn-save-key" data-provider="openai">${renderIcon('save', 14)} <span>${isAr ? 'حفظ' : 'Save'}</span></button>
            </div>
          </div>
        </div>

        <!-- Anthropic -->
        <div class="provider-box mt-3">
          <div class="provider-header">
            <strong>Anthropic Claude</strong>
            <span class="badge ${storedAnthropic ? 'badge-emerald' : 'badge-neutral'}">${storedAnthropic ? (isAr ? 'مُهيأ' : 'Configured') : (isAr ? 'غير مدخل' : 'Missing')}</span>
          </div>
          <div class="provider-inputs">
            <input type="password" id="key-anthropic" class="form-input text-xs font-mono" placeholder="sk-ant-..." value="${storedAnthropic}" />
            <div class="flex gap-2 mt-2">
              <button type="button" class="btn btn-xs btn-secondary btn-test-key" data-provider="anthropic">${renderIcon('check', 14)} <span>${isAr ? 'اختبار الاتصال' : 'Test Key'}</span></button>
              <button type="button" class="btn btn-xs btn-ghost btn-save-key" data-provider="anthropic">${renderIcon('save', 14)} <span>${isAr ? 'حفظ' : 'Save'}</span></button>
            </div>
          </div>
        </div>
      </div>
    `,
  });

  // ── 2. PREFERENCES CARD (Col 1) ─────────────────────────────────
  const currentLang = getState('lang') || 'en';
  const currentTheme = getState('theme') || 'system';

  const prefCard = createBentoCard({
    id: 'settings-pref-card',
    colSpan: '1',
    rowSpan: '1',
    icon: 'user',
    title: isAr ? 'اللغة والمظهر' : 'Preferences & Appearance',
    subtitle: isAr ? 'تخصيص الواجهة والاتجاه ونظام الألوان' : 'Language, RTL layout, and theme modes',
    badge: isAr ? 'المظهر' : 'Display',
    badgeType: 'mint',
    content: `
      <div class="pref-options-wrapper">
        <div class="setting-row">
          <label class="form-label font-bold">${isAr ? 'اللغة (Language):' : 'Interface Language:'}</label>
          <select id="select-language" class="form-select">
            <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English (LTR)</option>
            <option value="ar" ${currentLang === 'ar' ? 'selected' : ''}>العربية (RTL)</option>
          </select>
        </div>

        <div class="setting-row mt-3">
          <label class="form-label font-bold">${isAr ? 'السمة (Theme):' : 'Color Theme:'}</label>
          <select id="select-theme" class="form-select">
            <option value="light" ${currentTheme === 'light' ? 'selected' : ''}>Light (Emerald / Mint)</option>
            <option value="dark" ${currentTheme === 'dark' ? 'selected' : ''}>Dark (Deep Emerald / Obsidian)</option>
            <option value="system" ${currentTheme === 'system' ? 'selected' : ''}>System Default</option>
          </select>
        </div>
      </div>
    `,
  });

  // ── 3. DATA & BACKUP CARD (Col 1) ───────────────────────────────
  const dataCard = createBentoCard({
    id: 'settings-data-card',
    colSpan: '1',
    rowSpan: '1',
    icon: 'database',
    title: isAr ? 'البيانات والنسخ الاحتياطي' : 'Data & Offline Storage',
    subtitle: isAr ? 'تصدير أو استعادة كامل بيانات التطبيق' : 'Export or restore IndexedDB and settings backup',
    badge: 'IndexedDB',
    badgeType: 'neutral',
    content: `
      <div class="backup-actions-row">
        <button type="button" id="btn-export-backup" class="btn btn-secondary w-full mb-2">
          ${renderIcon('download', 16)} <span>${isAr ? 'تصدير نسخة احتياطية كاملة' : 'Export Full Backup'}</span>
        </button>
        <label class="btn btn-ghost w-full cursor-pointer">
          ${renderIcon('upload', 16)} <span>${isAr ? 'استعادة من ملف' : 'Restore from Backup'}</span>
          <input type="file" id="file-import-backup" accept=".json" style="display:none;" />
        </label>
        <button type="button" id="btn-reset-db" class="btn btn-sm btn-ghost text-rose-500 w-full mt-2">
          ${renderIcon('close', 14)} <span>${isAr ? 'مسح التخزين المحلي تماماً' : 'Factory Reset Storage'}</span>
        </button>
      </div>
    `,
  });

  grid.append(aiCard, prefCard, dataCard);
  view.appendChild(grid);
  container.appendChild(view);

  // ── BIND LISTENERS ──────────────────────────────────────────────
  // Default provider change
  const selectProv = aiCard.querySelector('#select-active-provider');
  selectProv.addEventListener('change', () => {
    const val = selectProv.value;
    localStorage.setItem('fl_provider', val);
    setState({ selectedProvider: val });
    showToast(isAr ? 'تم تعيين المزود الافتراضي' : `Default provider set to: ${val}`, { type: 'success' });
  });

  // Save Key buttons
  aiCard.querySelectorAll('.btn-save-key').forEach(btn => {
    btn.addEventListener('click', () => {
      const prov = btn.getAttribute('data-provider');
      const input = aiCard.querySelector(`#key-${prov}`);
      const val = input.value.trim();
      localStorage.setItem(`fl_api_${prov}`, val);
      showToast(isAr ? `تم حفظ مفتاح ${prov}` : `Saved ${prov} key`, { type: 'success' });
      renderSettings(container);
    });
  });

  // Test Key buttons
  aiCard.querySelectorAll('.btn-test-key').forEach(btn => {
    btn.addEventListener('click', async () => {
      const prov = btn.getAttribute('data-provider');
      const input = aiCard.querySelector(`#key-${prov}`);
      const key = input.value.trim();
      if (!key) {
        showToast(isAr ? 'يرجى إدخال مفتاح API للاختبار' : 'Please enter an API key to test', { type: 'warning' });
        return;
      }
      btn.disabled = true;
      showToast(isAr ? `جاري اختبار الاتصال مع ${prov}...` : `Testing connection to ${prov}...`, { type: 'info' });
      try {
        const res = await testProviderKey(prov, key);
        if (res.success) {
          localStorage.setItem(`fl_api_${prov}`, key);
          showToast(res.message || (isAr ? `تم الاتصال بنجاح مع ${prov}!` : `Connected successfully to ${prov}!`), { type: 'success' });
          renderSettings(container);
        } else {
          showToast(`Connection failed: ${res.error}`, { type: 'error' });
        }
      } catch (err) {
        showToast(err.message, { type: 'error' });
      } finally {
        btn.disabled = false;
      }
    });
  });

  // Language switch
  const selectLang = prefCard.querySelector('#select-language');
  selectLang.addEventListener('change', async () => {
    const newLang = selectLang.value;
    await setLocale(newLang);
    setState({ lang: newLang, dir: newLang === 'ar' ? 'rtl' : 'ltr' });
    persistState(['lang']);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    const titleEl = document.getElementById('topbar-page-title');
    if (titleEl) {
      titleEl.textContent = newLang === 'ar' ? 'الإعدادات ومفاتيح الذكاء' : 'Settings & AI Keys';
    }
    showToast(newLang === 'ar' ? 'تم تغيير اللغة إلى العربية' : 'Switched language to English', { type: 'success' });
    // Re-render
    renderSettings(container);
  });

  // Theme switch
  const selectTheme = prefCard.querySelector('#select-theme');
  selectTheme.addEventListener('change', () => {
    const newTheme = selectTheme.value;
    setState({ theme: newTheme });
    persistState(['theme']);

    let resolved = newTheme;
    if (resolved === 'system') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      resolved = prefersDark ? 'dark' : 'light';
    }

    if (resolved === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }

    // Synchronize topbar icon
    const btnTheme = document.getElementById('btn-theme-toggle');
    if (btnTheme) {
      btnTheme.innerHTML = renderIcon(resolved === 'dark' ? 'sun' : 'moon', 18);
    }

    showToast(isAr ? 'تم تحديث السمة' : `Theme changed to: ${newTheme}`, { type: 'success' });
  });

  // Export full backup
  const btnExport = dataCard.querySelector('#btn-export-backup');
  btnExport.addEventListener('click', async () => {
    try {
      const backup = await exportUserData();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `formulalens_backup_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(isAr ? 'تم تصدير النسخة الاحتياطية بنجاح' : 'Backup downloaded successfully', { type: 'success' });
    } catch (e) {
      showToast(`Export error: ${e.message}`, { type: 'error' });
    }
  });

  // Import backup
  const fileImport = dataCard.querySelector('#file-import-backup');
  fileImport.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backup = JSON.parse(text);
      await importUserData(backup);
      showToast(isAr ? 'تمت استعادة البيانات بنجاح! يتم تحديث التطبيق...' : 'Backup restored successfully! Reloading...', { type: 'success' });
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      showToast(`Import error: ${err.message}`, { type: 'error' });
    }
  });

  // Reset database
  const btnReset = dataCard.querySelector('#btn-reset-db');
  btnReset.addEventListener('click', () => {
    openModal({
      title: isAr ? 'إعادة ضبط المصنع' : 'Factory Reset Storage',
      content: `<p>${isAr ? 'تحذير: سيتم حذف جميع المنتجات المحفوظة وسجلات الفحص والمفاتيح المحلية تماماً. هل أنت متأكد؟' : 'Warning: This will permanently delete all saved products, analysis history, and local keys. Proceed?'}</p>`,
      actions: [
        createElement('button', {
          className: 'btn btn-ghost',
          type: 'button',
          textContent: isAr ? 'إلغاء' : 'Cancel',
          onclick: () => document.querySelector('.modal-backdrop')?.remove(),
        }),
        createElement('button', {
          className: 'btn btn-primary bg-rose-600',
          type: 'button',
          textContent: isAr ? 'نعم، إعادة الضبط' : 'Yes, Reset All',
          onclick: async () => {
            await clearUserData();
            localStorage.clear();
            document.querySelector('.modal-backdrop')?.remove();
            showToast(isAr ? 'تم مسح البيانات. جاري إعادة التحميل...' : 'Data cleared. Reloading...', { type: 'info' });
            setTimeout(() => window.location.reload(), 1000);
          },
        }),
      ],
    });
  });
}

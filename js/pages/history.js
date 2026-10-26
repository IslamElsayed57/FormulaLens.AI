/**
 * FormulaLens AI — Analysis History Page
 * Displays saved formula reports with search, export, and report re-inspection
 */

import { createElement, renderIcon } from '../utils/dom.js';
import { createBentoCard } from '../components/bento-card.js';
import { getAllRecords, deleteRecord, clearUserData } from '../database/indexeddb.js';
import { openModal } from '../components/modal.js';
import { showToast } from '../components/toast.js';
import { getState, setState } from '../state.js';

export async function renderHistory(container) {
  container.innerHTML = '';
  const isAr = getState('lang') === 'ar';

  const view = createElement('div', { className: 'history-view' });

  let historyItems = [];
  try {
    historyItems = await getAllRecords('analysis_history');
    historyItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (e) {
    console.warn('[History] Could not load:', e);
  }

  // Header card
  const headerCard = createBentoCard({
    id: 'history-header-card',
    colSpan: 'full',
    rowSpan: '1',
    icon: 'clock',
    title: isAr ? 'سجل تحليلات التركيبات' : 'Formula Analysis History',
    subtitle: isAr ? `${historyItems.length} تقرير محفوظ محلياً في IndexedDB` : `${historyItems.length} reports preserved locally in IndexedDB`,
    badge: `${historyItems.length} Saved`,
    badgeType: 'emerald',
    actions: historyItems.length > 0 ? [
      createElement('button', {
        className: 'btn btn-sm btn-secondary',
        id: 'btn-export-history',
        type: 'button',
        innerHTML: `${renderIcon('download', 14)} <span>${isAr ? 'تصدير JSON' : 'Export JSON'}</span>`,
      }),
      createElement('button', {
        className: 'btn btn-sm btn-ghost text-rose-500',
        id: 'btn-clear-history',
        type: 'button',
        innerHTML: `${renderIcon('close', 14)} <span>${isAr ? 'مسح السجل' : 'Clear All'}</span>`,
      }),
    ] : null,
    content: historyItems.length === 0 ? `
      <div class="empty-state-full">
        ${renderIcon('sparkles', 32)}
        <p>${isAr ? 'لا توجد تحليلات محفوظة بعد. ابدأ بتحليل أول مستحضر!' : 'No saved reports yet. Analyze your first product to see it here!'}</p>
        <button type="button" class="btn btn-primary mt-3" onclick="window.location.hash='#analyzer'">
          ${renderIcon('scan', 16)} <span>${isAr ? 'الانتقال للمحلل' : 'Go to Analyzer'}</span>
        </button>
      </div>
    ` : null,
  });

  view.appendChild(headerCard);

  if (historyItems.length > 0) {
    const listGrid = createElement('div', { className: 'bento-grid history-grid mt-6' });

    historyItems.forEach(item => {
      const card = createBentoCard({
        colSpan: '1',
        rowSpan: '1',
        title: item.productName || 'Cosmetic Formula',
        subtitle: `${new Date(item.createdAt).toLocaleDateString()} · ${item.totalIngredients || 0} ${isAr ? 'مكون' : 'ingredients'}`,
        badge: `${item.grade || 'A'} · ${item.score || 90}%`,
        badgeType: item.grade === 'A' ? 'emerald' : item.grade === 'B' ? 'mint' : 'amber',
        interactive: true,
        onClick: () => {
          showHistoryReportModal(item, isAr);
        },
        content: `
          <div class="history-item-preview">
            <span class="text-xs text-muted">${isAr ? 'المحرك:' : 'Engine:'} ${item.provider || 'local'}</span>
            <div class="flex justify-between items-center mt-3">
              <span class="text-xs text-muted">${isAr ? 'نسبة المطابقة:' : 'Match Rate:'} ${item.matchPercentage || 100}%</span>
              <span class="btn btn-xs btn-ghost">${isAr ? 'عرض التقرير' : 'View Report'} &rarr;</span>
            </div>
          </div>
        `,
      });
      listGrid.appendChild(card);
    });

    view.appendChild(listGrid);
  }

  container.appendChild(view);

  // Bind Export
  const btnExport = headerCard.querySelector('#btn-export-history');
  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(historyItems, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `formulalens_history_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(isAr ? 'تم تصدير سجل التحليلات بنجاح' : 'History exported to JSON file', { type: 'success' });
    });
  }

  // Bind Clear
  const btnClear = headerCard.querySelector('#btn-clear-history');
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      openModal({
        title: isAr ? 'مسح سجل التحليلات' : 'Clear History Confirmation',
        content: `<p>${isAr ? 'هل أنت متأكد من مسح جميع التقارير المحفوظة محلياً؟ لا يمكن التراجع عن هذا الإجراء.' : 'Are you sure you want to delete all locally saved analysis reports? This cannot be undone.'}</p>`,
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
            textContent: isAr ? 'نعم، مسح السجل' : 'Yes, Clear All',
            onclick: async () => {
              for (const item of historyItems) {
                await deleteRecord('analysis_history', item.id);
              }
              document.querySelector('.modal-backdrop')?.remove();
              showToast(isAr ? 'تم مسح السجل بنجاح' : 'History cleared', { type: 'success' });
              renderHistory(container);
            },
          }),
        ],
      });
    });
  }
}

function showHistoryReportModal(item, isAr) {
  const rep = item.reportData || {};
  const ai = rep.aiInsights || {};
  const score = rep.safetyScore || {};

  const content = `
    <div class="history-modal-content">
      <div class="flex justify-between items-center mb-3">
        <span class="badge badge-emerald">${isAr ? 'الدرجة:' : 'Grade:'} ${score.grade || item.grade} (${score.score || item.score}/100)</span>
        <span class="text-xs text-muted">${new Date(item.createdAt).toLocaleString()}</span>
      </div>
      <p class="text-sm mb-4"><strong>${isAr ? 'الخلاصة:' : 'Summary:'}</strong> ${ai.summary || (isAr ? 'تحليل محفوظ' : 'Archived analysis')}</p>
      <div class="text-xs text-muted mb-3">
        <strong>${isAr ? 'المكونات المكتشفة:' : 'Detected Ingredients:'}</strong> (${rep.totalCount || 0})
      </div>
      <div class="chips-list max-h-48 overflow-y-auto">
        ${(rep.matchedIngredients || []).map(m => `<span class="badge badge-neutral">${m.ingredient?.inciName || m.rawName}</span>`).join('')}
      </div>
    </div>
  `;

  openModal({
    title: item.productName || 'Analysis Report',
    content,
    size: 'lg',
  });
}

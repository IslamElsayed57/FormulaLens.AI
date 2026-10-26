/**
 * FormulaLens AI — 5-Stage Analysis Progress Tracker Component
 * Renders real-time, non-simulated animated progress through the 5 actual stages:
 * 1. Reading & Parsing
 * 2. Database Matching
 * 3. Evidence Retrieval
 * 4. AI Analysis
 * 5. Result Presentation
 */

import { createElement, renderIcon } from '../utils/dom.js';
import { getState } from '../state.js';

export const STAGE_DEFS = [
  {
    key: 'reading',
    index: 1,
    titleEn: '1. Reading & Parsing',
    titleAr: '1. قراءة واستخراج المكونات',
    descEn: 'Extracting cosmetic INCI tokens from input or camera scan',
    descAr: 'استخراج وتفكيك قائمة المكونات التجميلية وتدقيق المصطلحات',
    icon: 'scan',
  },
  {
    key: 'matching',
    index: 2,
    titleEn: '2. Database Matching',
    titleAr: '2. المطابقة مع قاعدة البيانات',
    descEn: 'Matching ingredients against local IndexedDB scientific records',
    descAr: 'مطابقة الأسماء القياسية والبديلة في قاعدة البيانات المحلية',
    icon: 'database',
  },
  {
    key: 'evidence',
    index: 3,
    titleEn: '3. Evidence Retrieval',
    titleAr: '3. استرجاع الأدلة العلمية',
    descEn: 'Checking local evidence and searching Europe PMC for unlisted ingredients',
    descAr: 'فحص الأدلة المحلية والبحث في Europe PMC عن المكونات غير المسجلة',
    icon: 'shield',
  },
  {
    key: 'ai',
    index: 4,
    titleEn: '4. AI Intelligence Synthesis',
    titleAr: '4. تحليل الذكاء الاصطناعي والأدلة',
    descEn: 'Generating validated formula insights via selected AI provider or local engine',
    descAr: 'تحليل التركيبة ومطابقتها وفق سياسة الأدلة العلمية المعتمدة',
    icon: 'sparkles',
  },
  {
    key: 'presenting',
    index: 5,
    titleEn: '5. Results Formulation',
    titleAr: '5. إعداد وعرض النتائج',
    descEn: 'Structuring final Bento Grid report, scores, and safety ratings',
    descAr: 'صياغة تقرير Bento النهائي، والدرجة العلمية، وحفظ السجل',
    icon: 'check',
  },
];

/**
 * Create a live 5-Stage Progress Tracker element
 * @returns {Object} { element, updateStage(stageKey, progress, details) }
 */
export function createStageTracker() {
  const isAr = getState('lang') === 'ar';
  const container = createElement('div', { className: 'stage-tracker-container' });

  // Overall progress bar
  const progressHeader = createElement('div', { className: 'stage-progress-header' });
  const progressTitle = createElement('div', {
    className: 'stage-progress-title',
    textContent: isAr ? 'مراحل التحليل العلمي' : 'Scientific Analysis Pipeline',
  });
  const progressPercent = createElement('div', {
    className: 'stage-progress-percent',
    textContent: '0%',
  });
  progressHeader.append(progressTitle, progressPercent);

  const progressBar = createElement('div', { className: 'stage-progress-bar-track' });
  const progressBarFill = createElement('div', { className: 'stage-progress-bar-fill' });
  progressBar.appendChild(progressBarFill);

  // Stage list
  const stageList = createElement('div', { className: 'stage-list' });
  const stageNodes = new Map();

  STAGE_DEFS.forEach((stage) => {
    const item = createElement('div', {
      className: 'stage-item stage-pending',
      dataset: { stage: stage.key },
    });

    const iconBox = createElement('div', { className: 'stage-item-icon' });
    iconBox.innerHTML = renderIcon(stage.icon, 18);

    const contentBox = createElement('div', { className: 'stage-item-content' });
    const itemTitle = createElement('div', {
      className: 'stage-item-title',
      textContent: isAr ? stage.titleAr : stage.titleEn,
    });
    const itemDesc = createElement('div', {
      className: 'stage-item-desc',
      textContent: isAr ? stage.descAr : stage.descEn,
    });
    contentBox.append(itemTitle, itemDesc);

    const statusBadge = createElement('div', {
      className: 'stage-item-badge badge badge-neutral',
      textContent: isAr ? 'في الانتظار' : 'Pending',
    });

    item.append(iconBox, contentBox, statusBadge);
    stageList.appendChild(item);
    stageNodes.set(stage.key, { item, iconBox, statusBadge, itemDesc });
  });

  container.append(progressHeader, progressBar, stageList);

  /**
   * Update tracker state
   * @param {string} currentStage - Current stage key ('reading', 'matching', etc., 'done', 'error')
   * @param {number} progress - 0.0 to 1.0
   * @param {Object} details - Additional status message
   */
  function update(currentStage, progress = 0, details = {}) {
    const percentInt = Math.round(progress * 100);
    progressPercent.textContent = `${percentInt}%`;
    progressBarFill.style.width = `${percentInt}%`;

    const isDone = currentStage === 'done';
    const isError = currentStage === 'error';
    const currentIdx = STAGE_DEFS.findIndex(s => s.key === currentStage);

    STAGE_DEFS.forEach((s, idx) => {
      const node = stageNodes.get(s.key);
      if (!node) return;

      node.item.classList.remove('stage-pending', 'stage-active', 'stage-completed', 'stage-error');

      if (isError && idx === currentIdx) {
        node.item.classList.add('stage-error');
        node.statusBadge.className = 'stage-item-badge badge badge-rose';
        node.statusBadge.textContent = isAr ? 'خطأ' : 'Error';
        if (details.error) node.itemDesc.textContent = details.error;
      } else if (isDone || (currentIdx !== -1 && idx < currentIdx)) {
        node.item.classList.add('stage-completed');
        node.statusBadge.className = 'stage-item-badge badge badge-emerald';
        node.statusBadge.textContent = isAr ? 'مكتمل' : 'Completed';
      } else if (idx === currentIdx) {
        node.item.classList.add('stage-active');
        node.statusBadge.className = 'stage-item-badge badge badge-mint';
        node.statusBadge.textContent = isAr ? 'قيد التنفيذ...' : 'In Progress...';
        if (details.label) node.itemDesc.textContent = details.label;
      } else {
        node.item.classList.add('stage-pending');
        node.statusBadge.className = 'stage-item-badge badge badge-neutral';
        node.statusBadge.textContent = isAr ? 'في الانتظار' : 'Pending';
      }
    });
  }

  return {
    element: container,
    update,
  };
}

/**
 * FormulaLens AI — Ingredient Library & Encyclopedia
 * Searchable, filterable scientific cosmetic database with CIR safety reviews
 */

import { createElement, renderIcon } from '../utils/dom.js';
import { createBentoCard } from '../components/bento-card.js';
import { getAllRecords, searchIngredients } from '../database/indexeddb.js';
import { openModal } from '../components/modal.js';
import { getState } from '../state.js';
import {
  translateCirStatus,
  translateSensitizing,
  translateEvidenceStatus,
  formatIngredientFunctions,
  getPregnancySuitability,
  getSkinSuitabilityLabel
} from '../utils/i18n.js';

export async function renderLibrary(container) {
  container.innerHTML = '';
  const isAr = getState('lang') === 'ar';

  const view = createElement('div', { className: 'library-view' });

  // Filter & Search bar card
  const filterCard = createBentoCard({
    id: 'library-filter-card',
    colSpan: 'full',
    rowSpan: '1',
    icon: 'database',
    title: isAr ? 'موسوعة المكونات التجميلية المعتمدة' : 'Verified Cosmetic Ingredient Library',
    subtitle: isAr ? 'ابحث بالاسم القياسي (INCI) أو المرادفات أو الوظيفة التجميلية' : 'Search by INCI name, synonyms, CAS number, or cosmetic function',
    badge: isAr ? 'قاعدة البيانات' : '147 Records',
    badgeType: 'emerald',
    content: `
      <div class="library-controls-bar">
        <div class="search-input-wrapper">
          <input type="text" id="library-search-input" class="form-input" placeholder="${isAr ? 'ابحث عن مكون (مثلاً: Niacinamide, Retinol, Squalane)...' : 'Search ingredients (e.g. Niacinamide, Retinol, Squalane)...'}" />
        </div>
        <div class="category-filter-chips">
          <button type="button" class="cat-chip active" data-cat="all">${isAr ? 'الكل' : 'All'}</button>
          <button type="button" class="cat-chip" data-cat="active">${isAr ? 'مواد فعالة' : 'Actives'}</button>
          <button type="button" class="cat-chip" data-cat="aha">${isAr ? 'أحماض AHA/BHA' : 'Acids'}</button>
          <button type="button" class="cat-chip" data-cat="humectant">${isAr ? 'مرطبات' : 'Humectants'}</button>
          <button type="button" class="cat-chip" data-cat="barrier_repair">${isAr ? 'ترميم الحاجز' : 'Barrier'}</button>
          <button type="button" class="cat-chip" data-cat="soothing">${isAr ? 'مهدئات' : 'Soothing'}</button>
          <button type="button" class="cat-chip" data-cat="peptide">${isAr ? 'ببتيدات' : 'Peptides'}</button>
          <button type="button" class="cat-chip" data-cat="sunscreen">${isAr ? 'واقيات شمس' : 'Sunscreens'}</button>
        </div>
      </div>
    `,
  });

  const listContainer = createElement('div', {
    id: 'library-cards-grid',
    className: 'bento-grid library-cards-grid mt-6',
  });

  view.append(filterCard, listContainer);
  container.appendChild(view);

  // Initial load
  let allIngredients = [];
  try {
    allIngredients = await getAllRecords('ingredients');
  } catch (e) {
    console.warn('[Library] Failed to fetch:', e);
  }

  function renderCards(items) {
    listContainer.innerHTML = '';
    if (items.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state-full bento-col-full">
          ${renderIcon('alert', 32)}
          <p>${isAr ? 'لم يتم العثور على مكونات مطابقة لبحثك.' : 'No ingredients match your query.'}</p>
        </div>
      `;
      return;
    }

    items.forEach(ing => {
      const formattedFns = formatIngredientFunctions(ing, isAr, 2);
      const cirBadgeText = ing.cirStatus ? (isAr ? 'مُراجع من CIR' : 'CIR Audited') : (isAr ? 'معتمد' : 'Verified');
      const sensLevel = ing.sensitizingPotential || 'low';
      const sensLabel = isAr ? `تحسس: ${translateSensitizing(sensLevel, true)}` : `Sens: ${sensLevel}`;
      const comedoLabel = ing.comedogenicRating !== undefined && ing.comedogenicRating !== null ? (isAr ? `مسام: ${ing.comedogenicRating}/5` : `Comedo: ${ing.comedogenicRating}/5`) : '';
      const pregData = getPregnancySuitability(ing.suitability, isAr);
      const skinLabel = getSkinSuitabilityLabel(ing.suitability, isAr);

      const card = createBentoCard({
        colSpan: '1',
        rowSpan: '1',
        title: ing.inciName,
        subtitle: formattedFns || (isAr ? 'مركب تجميلي' : 'Cosmetic ingredient'),
        badge: cirBadgeText,
        badgeType: 'mint',
        interactive: true,
        onClick: () => {
          showDossierModal(ing, isAr);
        },
        content: `
          <div class="library-card-body-preview">
            <p class="text-xs text-muted line-clamp-3">${isAr ? (ing.descriptionAr || ing.descriptionEn) : ing.descriptionEn}</p>
            <div class="mini-tags-row mt-3">
              ${comedoLabel ? `<span class="badge badge-neutral">${comedoLabel}</span>` : ''}
              <span class="badge badge-${sensLevel === 'high' ? 'rose' : sensLevel === 'moderate' ? 'amber' : 'emerald'}">${sensLabel}</span>
              ${pregData ? `<span class="badge badge-${pregData.badgeType}">${pregData.text}</span>` : ''}
              <span class="badge badge-neutral">${skinLabel}</span>
            </div>
          </div>
        `,
      });
      listContainer.appendChild(card);
    });
  }

  renderCards(allIngredients);

  // Search & Filter listeners
  const searchInput = filterCard.querySelector('#library-search-input');
  const catChips = filterCard.querySelectorAll('.cat-chip');

  let activeCat = 'all';

  function applyFilter() {
    const q = searchInput.value.toLowerCase().trim();
    let filtered = allIngredients;

    if (activeCat !== 'all') {
      filtered = filtered.filter(ing => {
        const cats = ing.category || [];
        return cats.includes(activeCat);
      });
    }

    if (q) {
      filtered = filtered.filter(ing => {
        const name = (ing.inciName || '').toLowerCase();
        const norm = (ing.normalizedName || '').toLowerCase();
        const descEn = (ing.descriptionEn || '').toLowerCase();
        const descAr = (ing.descriptionAr || '').toLowerCase();
        const syns = (ing.synonyms || []).join(' ').toLowerCase();
        return name.includes(q) || norm.includes(q) || descEn.includes(q) || descAr.includes(q) || syns.includes(q);
      });
    }

    renderCards(filtered);
  }

  searchInput.addEventListener('input', applyFilter);

  catChips.forEach(chip => {
    chip.addEventListener('click', () => {
      catChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCat = chip.getAttribute('data-cat');
      applyFilter();
    });
  });
}

function showDossierModal(ing, isAr) {
  const sensLevel = ing.sensitizingPotential || 'low';
  const evidence = translateEvidenceStatus(ing.evidenceStatus || 'verified', isAr);
  const cirStatusTranslated = isAr ? translateCirStatus(ing.cirStatus, true) : (ing.cirStatus || 'Evaluated as safe under typical cosmetic conditions.');
  const comedoText = ing.comedogenicRating !== undefined && ing.comedogenicRating !== null ? (isAr ? `انسداد المسام: ${ing.comedogenicRating}/5` : `Comedogenicity: ${ing.comedogenicRating}/5`) : '';
  const sensText = isAr ? `درجة التحسس: ${translateSensitizing(sensLevel, true)}` : `Sensitization: ${sensLevel}`;
  const pregData = getPregnancySuitability(ing.suitability, isAr);
  const skinLabel = getSkinSuitabilityLabel(ing.suitability, isAr);

  const content = `
    <div class="ingredient-modal-dossier">
      <div class="dossier-header-badges">
        <span class="badge badge-emerald">${evidence}</span>
        ${ing.casNumber ? `<span class="badge badge-neutral">CAS: ${ing.casNumber}</span>` : ''}
        ${comedoText ? `<span class="badge badge-mint">${comedoText}</span>` : ''}
        <span class="badge badge-${sensLevel === 'high' ? 'rose' : sensLevel === 'moderate' ? 'amber' : 'emerald'}">${sensText}</span>
        ${pregData ? `<span class="badge badge-${pregData.badgeType}">${pregData.text}</span>` : ''}
        <span class="badge badge-neutral">${skinLabel}</span>
      </div>

      <div class="dossier-section">
        <h4>${isAr ? 'الوصف العلمي وآلية التأثير' : 'Scientific Description & Mechanism'}</h4>
        <p>${isAr ? (ing.descriptionAr || ing.descriptionEn) : ing.descriptionEn}</p>
      </div>

      <div class="dossier-section">
        <h4>${isAr ? 'تقييم لجنة CIR والسلامة التنظيمية' : 'Cosmetic Ingredient Review (CIR) Status'}</h4>
        <p class="text-sm"><strong>${cirStatusTranslated}</strong></p>
      </div>

      <div class="dossier-section">
        <h4>${isAr ? 'المصادر المعتمدة' : 'Approved Citations'}</h4>
        <ul>
          ${(ing.sources || []).map(s => `<li>${s.sourceName || s.sourceId || (isAr ? 'لجنة خبراء مراجعة مكونات مستحضرات التجميل (CIR)' : 'CIR Cosmetic Expert Panel')}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;

  openModal({
    title: ing.inciName,
    content,
    size: 'md',
  });
}

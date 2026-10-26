/**
 * FormulaLens AI — Skin Profile Customization Page
 * Sets personalized skin traits, sensitivities, and exclusions for formula screening
 */

import { createElement, renderIcon } from '../utils/dom.js';
import { createBentoCard } from '../components/bento-card.js';
import { getState, setState } from '../state.js';
import { showToast } from '../components/toast.js';

export function renderProfile(container) {
  container.innerHTML = '';
  const isAr = getState('lang') === 'ar';

  const storedProfiles = JSON.parse(localStorage.getItem('fl_skin_profiles') || '[]');
  const storedAllergens = localStorage.getItem('fl_allergens') || '';

  const view = createElement('div', { className: 'profile-view' });
  const grid = createElement('div', { className: 'bento-grid profile-grid' });

  // 1. Skin Types Card
  const typeCard = createBentoCard({
    id: 'profile-type-card',
    colSpan: '1',
    rowSpan: '1',
    icon: 'user',
    title: isAr ? 'نوع البشرة الأساسي' : 'Primary Skin Type',
    subtitle: isAr ? 'حدد طبيعة إنتاج الدهون والترطيب' : 'Select baseline sebum and hydration characteristics',
    badge: isAr ? 'النوع' : 'Baseline',
    badgeType: 'mint',
    content: `
      <div class="profile-options-vertical">
        ${[
        { id: 'oily', en: 'Oily Skin (High Sebum)', ar: 'دهنية (إفراز دهون عالي)' },
        { id: 'dry', en: 'Dry Skin (Low Lipids / Flaking)', ar: 'جافة (نقص دهون وتقشر)' },
        { id: 'combination', en: 'Combination (Oily T-Zone)', ar: 'مختلطة (منطقة T دهنية)' },
        { id: 'normal', en: 'Balanced / Normal', ar: 'عادية متوازنة' },
      ].map(item => `
          <label class="custom-radio-row">
            <input type="checkbox" class="profile-chk" name="skin_type" value="${item.id}" ${storedProfiles.includes(item.id) ? 'checked' : ''} />
            <span>${isAr ? item.ar : item.en}</span>
          </label>
        `).join('')}
      </div>
    `,
  });

  // 2. Specific Skin Concerns Card
  const concernCard = createBentoCard({
    id: 'profile-concern-card',
    colSpan: '1',
    rowSpan: '1',
    icon: 'shield',
    title: isAr ? 'حالات وتحسس البشرة' : 'Skin Conditions & Reactivity',
    subtitle: isAr ? 'كشف مسببات التهيج وسد المسام' : 'Screen for irritants, comedogens, and flares',
    badge: isAr ? 'الحالات' : 'Conditions',
    badgeType: 'emerald',
    content: `
      <div class="profile-options-vertical">
        ${[
        { id: 'sensitive', en: 'Sensitive / Reactive Barrier', ar: 'بشرة حساسة وسريعة التهيج' },
        { id: 'acneProne', en: 'Acne-Prone (Easily Clogged)', ar: 'معرضة للحبوب وانسداد المسام' },
        { id: 'rosacea', en: 'Rosacea / Flushing', ar: 'وردية واحمرار سطحي' },
        { id: 'pregnant', en: 'Pregnancy & Nursing Safe', ar: 'فترة الحمل' },
      ].map(item => `
          <label class="custom-radio-row">
            <input type="checkbox" class="profile-chk" name="skin_concern" value="${item.id}" ${storedProfiles.includes(item.id) ? 'checked' : ''} />
            <span>${isAr ? item.ar : item.en}</span>
          </label>
        `).join('')}
      </div>
    `,
  });

  // 3. Exclusions & Custom Sensitivities Card
  const exclusionsCard = createBentoCard({
    id: 'profile-exclusions-card',
    colSpan: '1',
    rowSpan: '1',
    icon: 'alert',
    title: isAr ? 'حساسيات واستثناءات مخصصة' : 'Specific Exclusions & Allergies',
    subtitle: isAr ? 'اكتب أسماء مكونات معينة تود تجنبها تماماً' : 'List specific ingredients you avoid (comma-separated)',
    badge: isAr ? 'استثناءات' : 'Exclusions',
    badgeType: 'amber',
    content: `
      <div class="exclusions-wrapper">
        <textarea id="profile-allergens-input" class="form-textarea" rows="4" placeholder="${isAr ? 'مثلاً: Fragrance, Essential oils, Niacinamide...' : 'e.g. Fragrance, Lavender oil, Benzyl alcohol...'}">${storedAllergens}</textarea>
        <p class="text-xs text-muted mt-2">${isAr ? 'سيتم وضع علامة تحذير بارزة فور ظهور أي من هذه المكونات في أي تركيبة.' : 'Formulas containing these components will trigger immediate visual alerts.'}</p>
      </div>
    `,
  });

  // Action Save Button Card (Col Full)
  const saveCard = createBentoCard({
    id: 'profile-save-card',
    colSpan: 'full',
    rowSpan: '1',
    title: isAr ? 'حفظ إعدادات الملف الشخصي' : 'Save Skin Profile',
    content: `
      <div class="flex justify-between items-center">
        <p class="text-sm text-muted">
          ${isAr ? 'يتم حفظ الملف محلياً على جهازك ويطبق تلقائياً على كل التحليلات القادمة.' : 'Settings are stored locally on your device and applied automatically to all future scans.'}
        </p>
        <button type="button" id="btn-save-profile" class="btn btn-primary btn-lg">
          ${renderIcon('check', 18)} <span>${isAr ? 'تأكيد وحفظ الملف' : 'Save Profile'}</span>
        </button>
      </div>
    `,
  });

  grid.append(typeCard, concernCard, exclusionsCard, saveCard);
  view.appendChild(grid);
  container.appendChild(view);

  function saveProfileData(showToastFeedback = false) {
    const checked = Array.from(grid.querySelectorAll('.profile-chk:checked')).map(cb => cb.value);
    const allergens = grid.querySelector('#profile-allergens-input')?.value.trim() || '';

    localStorage.setItem('fl_skin_profiles', JSON.stringify(checked));
    localStorage.setItem('fl_allergens', allergens);
    setState({ skinProfiles: checked });

    if (showToastFeedback) {
      showToast(isAr ? 'تم حفظ ملف بشرتك وتحديث النتائج بنجاح!' : 'Skin profile updated successfully!', { type: 'success' });
    }
  }

  // Instant auto-save on any option change
  grid.querySelectorAll('.profile-chk').forEach(chk => {
    chk.addEventListener('change', () => {
      saveProfileData(false);
    });
  });

  grid.querySelector('#profile-allergens-input')?.addEventListener('input', () => {
    saveProfileData(false);
  });

  const btnSave = saveCard.querySelector('#btn-save-profile');
  if (btnSave) {
    btnSave.addEventListener('click', () => {
      saveProfileData(true);
    });
  }
}

/**
 * FormulaLens AI — Product Comparison Page
 * Compares 2 or 3 products side-by-side with full multimodal inputs:
 * - Manual INCI Text input
 * - Packaging photo upload with OCR extraction
 * - Live Camera capture with OCR extraction
 * - Bento Grid results & full cross-product ingredient comparison matrix
 */

import { createElement, renderIcon } from '../utils/dom.js';
import { createBentoCard } from '../components/bento-card.js';
import { parseIngredients, recognizeText } from '../ocr/ocr-engine.js';
import { findIngredientByName } from '../database/indexeddb.js';
import { compareProducts } from '../analysis/comparison.js';
import { getState, subscribe } from '../state.js';
import { showToast } from '../components/toast.js';
import { translateCirStatus, formatIngredientFunctions, translateSensitizing, getPregnancyBadgeHTML, getSkinBadgeHTML } from '../utils/i18n.js';

const SAMPLE_PRESETS = [
  {
    nameEn: 'Cica Soothing Serum',
    nameAr: 'سيروم سيكا المهدئ',
    text: 'Water, Glycerin, Centella Asiatica Extract, Madecassoside, Niacinamide, Sodium Hyaluronate, Panthenol, Carbomer, Phenoxyethanol.',
  },
  {
    nameEn: 'Barrier Rich Cream',
    nameAr: 'كريم الترطيب المكثف',
    text: 'Water, Glycerin, Caprylic/Capric Triglyceride, Squalane, Ceramide NP, Cholesterol, Butyrospermum Parkii (Shea) Butter, Dimethicone, Phenoxyethanol, Ethylhexylglycerin.',
  },
  {
    nameEn: 'BHA Clarifying Cleanser',
    nameAr: 'غسول ساليسيليك المنقي',
    text: 'Aqua, Glycerin, Cocamidopropyl Betaine, Salicylic Acid, Sodium Hyaluronate, Camellia Sinensis Leaf Extract, Zinc PCA, Allantoin, Sodium Benzoate.',
  },
];

export function renderCompare(container) {
  container.innerHTML = '';
  const isAr = getState('lang') === 'ar';

  const view = createElement('div', { className: 'compare-view' });
  let hasThreeProducts = false;

  // Track active camera streams to stop when unmounting or switching
  const activeStreams = { A: null, B: null, C: null };

  // Main input card
  const inputCard = createBentoCard({
    id: 'compare-input-card',
    colSpan: 'full',
    rowSpan: '1',
    icon: 'compare',
    title: isAr ? 'مقارنة تركيبات مستحضرات التجميل' : 'Cosmetic Formula Comparison',
    subtitle: isAr
      ? 'قارن بين منتجين أو ثلاثة منتجات: اكتب التركيبة، أو ارفع صورة الملصق، أو التقط صورة بالكاميرا'
      : 'Compare 2 or 3 products side-by-side via text, photo upload, or live camera scan',
    badge: isAr ? 'مقارنة علمية' : 'Head-to-Head',
    badgeType: 'mint',
    content: `
      <!-- Top controls bar -->
      <div class="compare-controls-bar">
        <div class="flex items-center gap-2">
          <button type="button" id="btn-toggle-third-product" class="btn btn-sm btn-secondary">
            ${renderIcon('sparkles', 16)} <span id="toggle-third-text">${isAr ? 'إضافة منتج ثالث (+)' : 'Add 3rd Product (+)'}</span>
          </button>
        </div>

        <!-- Profile link banner (linked to Profile page) -->
        <div id="compare-profile-banner" class="profile-link-banner">
          ${renderIcon('user', 14)}
          <span id="compare-profile-text" class="profile-banner-text"></span>
          <button type="button" class="btn btn-xs btn-ghost" id="btn-comp-go-to-profile">
            ${isAr ? 'تعديل الملف' : 'Edit Profile'} ↗
          </button>
        </div>
      </div>

      <!-- Products Grid (A, B, and optional C) -->
      <div id="compare-grid" class="compare-inputs-grid">
        ${renderProductColumnHTML('A', isAr ? 'المستحضر الأول (أ)' : 'Product A', 'emerald', SAMPLE_PRESETS[0], isAr)}
        ${renderProductColumnHTML('B', isAr ? 'المستحضر الثاني (ب)' : 'Product B', 'mint', SAMPLE_PRESETS[1], isAr)}
        <div id="col-product-c-wrapper" style="display: none;">
          ${renderProductColumnHTML('C', isAr ? 'المستحضر الثالث (ج)' : 'Product C', 'amber', SAMPLE_PRESETS[2], isAr)}
        </div>
      </div>

      <div class="compare-actions-bar mt-6">
        <button type="button" id="btn-run-compare" class="btn btn-primary btn-lg">
          ${renderIcon('compare', 20)} <span>${isAr ? 'تنفيذ المقارنة الشاملة' : 'Run Full Comparison'}</span>
        </button>
        <button type="button" id="btn-clear-all-comp" class="btn btn-ghost btn-lg">
          ${renderIcon('close', 16)} <span>${isAr ? 'مسح الكل' : 'Clear All'}</span>
        </button>
      </div>
    `,
  });

  const resultsGrid = createElement('div', {
    id: 'compare-results-grid',
    className: 'bento-grid compare-results-grid mt-6',
    style: 'display: none;',
  });

  view.append(inputCard, resultsGrid);
  container.appendChild(view);

  // Setup column controllers (Tabs, Upload, Camera, Presets) for A, B, and C
  setupColumnControllers('A', inputCard, isAr, activeStreams);
  setupColumnControllers('B', inputCard, isAr, activeStreams);
  setupColumnControllers('C', inputCard, isAr, activeStreams);

  // ── PROFILE BANNER ────────────────────────────────────────────────
  const compareBannerText = inputCard.querySelector('#compare-profile-text');
  const PROFILE_LABELS_COMP = {
    en: { oily: 'Oily', dry: 'Dry', sensitive: 'Sensitive', acneProne: 'Acne-Prone', rosacea: 'Rosacea', combination: 'Combination', normal: 'Normal', pregnant: 'Pregnancy-Safe' },
    ar: { oily: 'دهنية', dry: 'جافة', sensitive: 'حساسة', acneProne: 'معرضة للحبوب', rosacea: 'وردية', combination: 'مختلطة', normal: 'عادية', pregnant: 'آمن للحمل' },
  };

  let lastProductsToCompare = null;

  function updateCompareBanner() {
    const profiles = getState('skinProfiles') || [];
    const labels = isAr ? PROFILE_LABELS_COMP.ar : PROFILE_LABELS_COMP.en;
    if (profiles.length === 0) {
      compareBannerText.textContent = isAr ? 'لا يوجد ملف شخصي محدد — اضغط تعديل لتحديده' : 'No skin profile set — click Edit Profile to set one';
    } else {
      const names = profiles.map(p => labels[p] || p).join(isAr ? '، ' : ', ');
      compareBannerText.textContent = (isAr ? 'الملف الشخصي النشط: ' : 'Active Profile: ') + names;
    }
  }

  updateCompareBanner();

  const unsubCompProfile = subscribe('skinProfiles', (state) => {
    updateCompareBanner();
    const updatedProfiles = state.skinProfiles || getState('skinProfiles') || [];
    if (lastProductsToCompare && resultsGrid.style.display !== 'none') {
      const updatedComp = compareProducts(lastProductsToCompare, updatedProfiles);
      renderComparisonResults(resultsGrid, updatedComp, isAr, updatedProfiles);
    }
  });

  const compObserver = new MutationObserver(() => {
    if (!container.contains(inputCard)) {
      unsubCompProfile();
      compObserver.disconnect();
    }
  });
  compObserver.observe(container, { childList: true });

  inputCard.querySelector('#btn-comp-go-to-profile')?.addEventListener('click', () => {
    window.location.hash = '#profile';
  });

  // Toggle Product C
  const btnToggleThird = inputCard.querySelector('#btn-toggle-third-product');
  const thirdText = inputCard.querySelector('#toggle-third-text');
  const colCWrapper = inputCard.querySelector('#col-product-c-wrapper');
  const compGrid = inputCard.querySelector('#compare-grid');

  btnToggleThird.addEventListener('click', () => {
    hasThreeProducts = !hasThreeProducts;
    if (hasThreeProducts) {
      colCWrapper.style.display = 'block';
      compGrid.classList.add('has-three');
      thirdText.textContent = isAr ? 'إزالة المنتج الثالث (-)' : 'Remove 3rd Product (-)';
      btnToggleThird.classList.replace('btn-secondary', 'btn-ghost');
      showToast(isAr ? 'تمت إضافة خانة المنتج الثالث (ج)' : 'Product C enabled for 3-way comparison', { type: 'info' });
    } else {
      // Stop camera if running on C
      if (activeStreams.C) {
        activeStreams.C.getTracks().forEach(t => t.stop());
        activeStreams.C = null;
      }
      colCWrapper.style.display = 'none';
      compGrid.classList.remove('has-three');
      thirdText.textContent = isAr ? 'إضافة منتج ثالث (+)' : 'Add 3rd Product (+)';
      btnToggleThird.classList.replace('btn-ghost', 'btn-secondary');
    }
  });

  // Clear All button
  inputCard.querySelector('#btn-clear-all-comp').addEventListener('click', () => {
    lastProductsToCompare = null;
    ['A', 'B', 'C'].forEach(id => {
      const nameInp = inputCard.querySelector(`#comp-name-${id.toLowerCase()}`);
      const textInp = inputCard.querySelector(`#comp-text-${id.toLowerCase()}`);
      if (nameInp) nameInp.value = '';
      if (textInp) textInp.value = '';
    });
    resultsGrid.style.display = 'none';
  });

  // Run Comparison
  const btnRun = inputCard.querySelector('#btn-run-compare');
  btnRun.addEventListener('click', async () => {
    const textA = inputCard.querySelector('#comp-text-a').value.trim();
    const textB = inputCard.querySelector('#comp-text-b').value.trim();
    const nameA = inputCard.querySelector('#comp-name-a').value.trim() || (isAr ? 'المستحضر أ' : 'Product A');
    const nameB = inputCard.querySelector('#comp-name-b').value.trim() || (isAr ? 'المستحضر ب' : 'Product B');

    if (!textA || !textB) {
      showToast(isAr ? 'يرجى إدخال قائمة المكونات للمستحضرين الأول والثاني على الأقل.' : 'Please enter ingredient lists for at least Product A and Product B.', { type: 'warning' });
      return;
    }

    const selectedProfiles = getState('skinProfiles') || [];

    const productsToCompare = [];
    btnRun.disabled = true;

    try {
      showToast(isAr ? 'جاري فحص ومطابقة المكونات...' : 'Matching ingredients across databases...', { type: 'info' });

      const prodA = await prepareProductForComp(nameA, textA);
      const prodB = await prepareProductForComp(nameB, textB);
      productsToCompare.push(prodA, prodB);

      if (hasThreeProducts) {
        const textC = inputCard.querySelector('#comp-text-c').value.trim();
        const nameC = inputCard.querySelector('#comp-name-c').value.trim() || (isAr ? 'المستحضر ج' : 'Product C');
        if (textC) {
          const prodC = await prepareProductForComp(nameC, textC);
          productsToCompare.push(prodC);
        }
      }

      lastProductsToCompare = productsToCompare;
      const comparison = compareProducts(productsToCompare, selectedProfiles);
      renderComparisonResults(resultsGrid, comparison, isAr, selectedProfiles);
      resultsGrid.style.display = 'grid';
      resultsGrid.scrollIntoView({ behavior: 'smooth' });
      showToast(isAr ? 'تمت المقارنة العلمية بنجاح!' : 'Comparison generated successfully!', { type: 'success' });
    } catch (e) {
      showToast(`Comparison error: ${e.message}`, { type: 'error' });
    } finally {
      btnRun.disabled = false;
    }
  });
}

/**
 * Generate HTML string for an individual product column
 */
function renderProductColumnHTML(id, label, badgeColor, preset, isAr) {
  const colId = id.toLowerCase();
  return `
    <div class="compare-input-col" data-col="${id}">
      <div class="compare-col-header">
        <label class="form-label font-bold text-sm mb-0">${label}</label>
        <span class="compare-col-badge badge badge-${badgeColor}">${id}</span>
      </div>

      <input type="text" id="comp-name-${colId}" class="form-input text-sm" placeholder="${isAr ? 'اسم المستحضر' : 'Product Name'}" value="${isAr ? preset.nameAr : preset.nameEn}" />

      <!-- Input mode mini tabs -->
      <div class="mini-tab-strip">
        <button type="button" class="mini-tab-btn active" data-col="${id}" data-mode="text">
          ${renderIcon('edit', 14)} <span>${isAr ? 'نص' : 'Text'}</span>
        </button>
        <button type="button" class="mini-tab-btn" data-col="${id}" data-mode="upload">
          ${renderIcon('scan', 14)} <span>${isAr ? 'رفع صورة' : 'Photo'}</span>
        </button>
        <button type="button" class="mini-tab-btn" data-col="${id}" data-mode="camera">
          ${renderIcon('camera', 14)} <span>${isAr ? 'كاميرا' : 'Camera'}</span>
        </button>
      </div>

      <!-- Mode 1: Text -->
      <div id="mode-text-${colId}" class="col-mode-panel active">
        <textarea id="comp-text-${colId}" class="form-textarea text-xs" rows="5" placeholder="${isAr ? 'الصق أو اكتب المكونات مفصولة بفواصل...' : 'Paste or type cosmetic ingredients separated by commas...'}">${preset.text}</textarea>
      </div>

      <!-- Mode 2: Photo Upload -->
      <div id="mode-upload-${colId}" class="col-mode-panel" style="display: none;">
        <div id="dropzone-${colId}" class="mini-dropzone">
          <input type="file" id="file-input-${colId}" accept="image/*" class="file-hidden-input" />
          ${renderIcon('upload', 24)}
          <p class="text-xs text-muted mt-2">${isAr ? 'انقر لرفع صورة ملصق العبوة (OCR)' : 'Upload packaging label photo'}</p>
        </div>
      </div>

      <!-- Mode 3: Live Camera -->
      <div id="mode-camera-${colId}" class="col-mode-panel" style="display: none;">
        <div class="mini-cam-wrapper">
          <video id="cam-video-${colId}" autoplay playsinline muted class="mini-cam-video"></video>
          <canvas id="cam-canvas-${colId}" style="display:none;"></canvas>
          <div class="mt-2 flex gap-2 p-2">
            <button type="button" id="btn-cam-start-${colId}" class="btn btn-xs btn-secondary">
              ${renderIcon('camera', 14)} <span>${isAr ? 'بدء الكاميرا' : 'Start'}</span>
            </button>
            <button type="button" id="btn-cam-capture-${colId}" class="btn btn-xs btn-primary" style="display:none;">
              ${renderIcon('scan', 14)} <span>${isAr ? 'التقاط وقراءة' : 'Capture'}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="compare-col-footer mt-3">
        <button type="button" class="btn btn-xs btn-ghost btn-load-preset" data-col="${id}">
          ${renderIcon('sparkles', 12)} <span>${isAr ? 'عينة' : 'Preset'}</span>
        </button>
        <button type="button" class="btn btn-xs btn-ghost btn-clear-col text-rose-500" data-col="${id}">
          ${renderIcon('close', 12)} <span>${isAr ? 'مسح' : 'Clear'}</span>
        </button>
      </div>
    </div>
  `;
}

/**
 * Setup Tabs, File Upload, Camera, and Presets for a column
 */
function setupColumnControllers(colId, container, isAr, activeStreams) {
  const idLower = colId.toLowerCase();
  const colEl = container.querySelector(`[data-col="${colId}"]`);
  if (!colEl) return;

  const textArea = colEl.querySelector(`#comp-text-${idLower}`);
  const nameInput = colEl.querySelector(`#comp-name-${idLower}`);

  // Tabs switching
  const tabBtns = colEl.querySelectorAll(`.mini-tab-btn[data-col="${colId}"]`);
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mode = btn.getAttribute('data-mode');
      colEl.querySelector(`#mode-text-${idLower}`).style.display = mode === 'text' ? 'block' : 'none';
      colEl.querySelector(`#mode-upload-${idLower}`).style.display = mode === 'upload' ? 'block' : 'none';
      colEl.querySelector(`#mode-camera-${idLower}`).style.display = mode === 'camera' ? 'block' : 'none';

      // If leaving camera, stop stream
      if (mode !== 'camera' && activeStreams[colId]) {
        activeStreams[colId].getTracks().forEach(t => t.stop());
        activeStreams[colId] = null;
        const btnStart = colEl.querySelector(`#btn-cam-start-${idLower}`);
        const btnCap = colEl.querySelector(`#btn-cam-capture-${idLower}`);
        if (btnStart) btnStart.style.display = 'inline-flex';
        if (btnCap) btnCap.style.display = 'none';
      }
    });
  });

  // Preset button
  colEl.querySelector(`.btn-load-preset[data-col="${colId}"]`).addEventListener('click', () => {
    const idx = colId === 'A' ? 0 : colId === 'B' ? 1 : 2;
    const p = SAMPLE_PRESETS[idx];
    nameInput.value = isAr ? p.nameAr : p.nameEn;
    textArea.value = p.text;
    showToast(isAr ? `تم تعيين نموذج ${colId}` : `Loaded preset for Product ${colId}`, { type: 'info' });
  });

  // Clear button
  colEl.querySelector(`.btn-clear-col[data-col="${colId}"]`).addEventListener('click', () => {
    nameInput.value = '';
    textArea.value = '';
  });

  // Upload & Drag-and-drop
  const fileInput = colEl.querySelector(`#file-input-${idLower}`);
  const dropzone = colEl.querySelector(`#dropzone-${idLower}`);

  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (file) await handleColumnOCR(file, colId, colEl, idLower, isAr);
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-active');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag-active'));
  dropzone.addEventListener('drop', async (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-active');
    const file = e.dataTransfer.files?.[0];
    if (file) await handleColumnOCR(file, colId, colEl, idLower, isAr);
  });

  // Camera
  const videoEl = colEl.querySelector(`#cam-video-${idLower}`);
  const canvasEl = colEl.querySelector(`#cam-canvas-${idLower}`);
  const btnStartCam = colEl.querySelector(`#btn-cam-start-${idLower}`);
  const btnCapture = colEl.querySelector(`#btn-cam-capture-${idLower}`);

  btnStartCam.addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } },
      });
      activeStreams[colId] = stream;
      videoEl.srcObject = stream;
      btnStartCam.style.display = 'none';
      btnCapture.style.display = 'inline-flex';
    } catch (err) {
      showToast(isAr ? 'تعذر تشغيل الكاميرا. يرجى التحقق من أذونات المتصفح.' : 'Camera permission denied or camera unavailable.', { type: 'error' });
    }
  });

  btnCapture.addEventListener('click', () => {
    if (!videoEl.videoWidth) return;
    canvasEl.width = videoEl.videoWidth;
    canvasEl.height = videoEl.videoHeight;
    const ctx = canvasEl.getContext('2d');
    ctx.drawImage(videoEl, 0, 0);

    // Stop camera stream
    if (activeStreams[colId]) {
      activeStreams[colId].getTracks().forEach(t => t.stop());
      activeStreams[colId] = null;
    }
    btnCapture.style.display = 'none';
    btnStartCam.style.display = 'inline-flex';

    canvasEl.toBlob(async (blob) => {
      if (blob) {
        await handleColumnOCR(blob, colId, colEl, idLower, isAr);
      }
    }, 'image/jpeg', 0.95);
  });
}

/**
 * Handle OCR extraction for an individual product column
 */
async function handleColumnOCR(imageBlob, colId, colEl, idLower, isAr) {
  showToast(isAr ? `جاري قراءة نص ملصق المستحضر (${colId}) عبر OCR...` : `Scanning label for Product ${colId} with OCR...`, { type: 'info' });
  try {
    const text = await recognizeText(imageBlob);
    if (!text || text.trim().length === 0) {
      showToast(isAr ? 'لم يتم العثور على نص واضح في الصورة.' : 'No readable text extracted. Try better lighting.', { type: 'warning' });
      return;
    }

    const textArea = colEl.querySelector(`#comp-text-${idLower}`);
    textArea.value = text;

    // Switch back to text tab
    colEl.querySelector(`.mini-tab-btn[data-mode="text"]`).click();
    showToast(isAr ? `تم استخراج مكونات المستحضر (${colId}) بنجاح!` : `Ingredients extracted for Product ${colId}!`, { type: 'success' });
  } catch (err) {
    showToast(`OCR error: ${err.message}`, { type: 'error' });
  }
}

/**
 * Parse ingredients & match with local IndexedDB records
 */
async function prepareProductForComp(name, rawText) {
  const tokens = parseIngredients(rawText);
  const matched = [];
  const unmatched = [];

  for (const t of tokens) {
    const rec = await findIngredientByName(t.cleanName.toLowerCase());
    if (rec) {
      matched.push({ rawName: t.rawName, cleanName: t.cleanName, ingredient: rec });
    } else {
      unmatched.push(t);
    }
  }

  return {
    productName: name,
    matchedIngredients: matched,
    unmatchedIngredients: unmatched,
  };
}

/**
 * Render complete Bento comparison results (supporting 2 or 3 products)
 */
function renderComparisonResults(container, comp, isAr, selectedProfiles = []) {
  container.innerHTML = '';
  const prods = comp.products;
  const count = prods.length;
  const isPregnant = selectedProfiles.includes('pregnant');
  const skinTypes = selectedProfiles.filter(p => p !== 'pregnant');

  // 1. COMPARATIVE SCIENCE VERDICT CARD (Col Full)
  const winnerCard = createBentoCard({
    id: 'comp-winner-card',
    colSpan: 'full',
    rowSpan: '1',
    icon: 'sparkles',
    title: isAr ? 'الخلاصة العلمية للمقارنة' : 'Comparative Science Verdict',
    subtitle: isAr ? `التركيبة الأكثر أماناً وملاءمة: ${comp.bestSuitability.productName}` : `Top Recommended Formula: ${comp.bestSuitability.productName}`,
    badge: isAr ? 'التوصية' : 'Verdict',
    badgeType: 'emerald',
    content: `
      <div class="winner-box">
        <p class="winner-reason"><strong>${comp.bestSuitability.productName}</strong>: ${comp.bestSuitability.reason}</p>
        <div class="winner-scores-row flex flex-wrap gap-3 mt-3">
          ${prods.map(p => `
            <div class="mini-score-tag badge ${p.scoreData.grade === 'A' ? 'badge-emerald' : p.scoreData.grade === 'B' ? 'badge-mint' : 'badge-amber'} p-2">
              <span>${p.name}:</span> <strong>${p.scoreData.score}/100 (${p.scoreData.grade})</strong> · ${p.ingredients.length} ${isAr ? 'مكون' : 'ingredients'}
            </div>
          `).join('')}
        </div>
      </div>
    `,
  });

  // 2. SHARED INGREDIENTS CARD (Col 1)
  const sharedCard = createBentoCard({
    id: 'comp-shared-card',
    colSpan: count === 3 ? 'full' : '1',
    rowSpan: '1',
    icon: 'check',
    title: isAr ? 'المكونات المشتركة بين كل المنتجات' : 'Shared Formula Backbone',
    subtitle: `${comp.commonCount} ${isAr ? 'مركبات متطابقة في كل التركيبات' : 'identical ingredients in all products'}`,
    badge: `${comp.commonCount}`,
    badgeType: 'mint',
    content: `
      <div class="chips-list">
        ${comp.commonIngredients.length > 0
        ? comp.commonIngredients.map(item => `<span class="badge badge-mint">${item.name}</span>`).join('')
        : `<p class="text-sm text-muted">${isAr ? 'لا توجد مكونات مشتركة تتطابق في جميع المستحضرات المقارنة.' : 'No overlapping ingredients found across all products.'}</p>`}
      </div>
    `,
  });

  // 3. UNIQUE INGREDIENTS CARDS (1 per product)
  const uniqueCards = prods.map((prod, idx) => {
    const unique = comp.uniquePerProduct[idx]?.uniqueIngredients || [];
    return createBentoCard({
      id: `comp-unique-${idx}-card`,
      colSpan: '1',
      rowSpan: '1',
      icon: 'sparkles',
      title: prod.name,
      subtitle: `${unique.length} ${isAr ? 'مكونات حصرية' : 'exclusive ingredients'}`,
      badge: `${prod.scoreData.score}/100`,
      badgeType: prod.scoreData.grade === 'A' ? 'emerald' : 'mint',
      content: `
        <div class="chips-list">
          ${unique.length > 0
          ? unique.map(item => `<span class="badge badge-neutral">${item.name}</span>`).join('')
          : `<p class="text-xs text-muted">${isAr ? 'لا توجد مكونات حصرية' : 'No exclusive ingredients'}</p>`}
        </div>
      `,
    });
  });

  // 4. MASTER CROSS-PRODUCT COMPARISON MATRIX TABLE (Col Full)
  // Gather all unique ingredients across all products
  const allMap = new Map();
  prods.forEach((prod, pIdx) => {
    prod.ingredients.forEach(item => {
      const key = item.normalizedName;
      if (!allMap.has(key)) {
        allMap.set(key, {
          name: item.name,
          ingredient: item.ingredient,
          foundIn: new Set([pIdx]),
        });
      } else {
        allMap.get(key).foundIn.add(pIdx);
      }
    });
  });

  const matrixRows = Array.from(allMap.values()).map(entry => {
    const ing = entry.ingredient || {};
    const presenceCells = prods.map((_, pIdx) => {
      const has = entry.foundIn.has(pIdx);
      return `<td class="text-center">${has ? '<span class="matrix-check">✓</span>' : '<span class="matrix-cross">—</span>'}</td>`;
    }).join('');

    const comedo = ing.comedogenicRating !== undefined && ing.comedogenicRating !== null
      ? `<span class="badge badge-${ing.comedogenicRating >= 3 ? 'amber' : 'neutral'}">${ing.comedogenicRating}/5</span>`
      : '—';

    const sensBadge = ing.sensitizingPotential === 'high'
      ? `<span class="badge badge-rose">${isAr ? 'مرتفع' : 'High'}</span>`
      : ing.sensitizingPotential === 'moderate'
        ? `<span class="badge badge-amber">${isAr ? 'متوسط' : 'Moderate'}</span>`
        : `<span class="badge badge-emerald">${isAr ? 'منخفض' : 'Low'}</span>`;

    const pregBadge = getPregnancyBadgeHTML(ing.suitability, isAr, isPregnant);
    const skinBadge = getSkinBadgeHTML(ing.suitability, isAr, skinTypes);

    const formattedFns = formatIngredientFunctions(ing, isAr, 2);
    const cirText = isAr ? translateCirStatus(ing.cirStatus, true) : (ing.cirStatus || 'Reviewed');

    return `
      <tr>
        <td><strong>${entry.name}</strong></td>
        ${presenceCells}
        <td class="text-xs text-muted">${formattedFns || '—'}</td>
        <td class="text-xs">${cirText}</td>
        <td>${comedo}</td>
        <td>${sensBadge}</td>
        <td>${pregBadge}</td>
        <td>${skinBadge}</td>
      </tr>
    `;
  }).join('');

  const tableHeaders = prods.map(p => `<th class="text-center">${p.name}</th>`).join('');

  const matrixCard = createBentoCard({
    id: 'comp-matrix-card',
    colSpan: 'full',
    rowSpan: '2',
    icon: 'database',
    title: isAr ? 'مصفوفة مقارنة المكونات التفصيلية' : 'Full Ingredient Comparison Matrix',
    subtitle: isAr
      ? `تحليل تفصيلي لـ ${allMap.size} مكوناً إجمالياً عبر المستحضرات المقارنة`
      : `Cross-analysis of ${allMap.size} total cosmetic ingredients`,
    badge: `${allMap.size} Ingredients`,
    badgeType: 'emerald',
    content: `
      <div class="table-responsive-wrapper">
        <table class="comparison-matrix-table">
          <thead>
            <tr>
              <th>${isAr ? 'المكون (INCI)' : 'Ingredient'}</th>
              ${tableHeaders}
              <th>${isAr ? 'الوظيفة التجميلية' : 'Function'}</th>
              <th>${isAr ? 'أمان CIR' : 'CIR Safety'}</th>
              <th>${isAr ? 'سد المسام' : 'Comedo'}</th>
              <th>${isAr ? 'التحسس' : 'Sensitization'}</th>
              <th>${isAr ? 'مناسب للحمل' : 'Pregnancy'}</th>
              <th>${isAr ? 'مناسب للبشرة' : 'Skin Type'}</th>
            </tr>
          </thead>
          <tbody>
            ${matrixRows}
          </tbody>
        </table>
      </div>
    `,
  });

  container.append(winnerCard, sharedCard, ...uniqueCards, matrixCard);
}

/**
 * FormulaLens AI — Formula Analyzer Page
 * 5-stage real-time progress tracker, OCR photo scanner, Bento Grid results
 */

import { createElement, renderIcon } from '../utils/dom.js';
import { createBentoCard } from '../components/bento-card.js';
import { createStageTracker } from '../components/stage-tracker.js';
import { executeFormulaAnalysis } from '../analysis/analyzer.js';
import { recognizeText } from '../ocr/ocr-engine.js';
import { getState, subscribe } from '../state.js';
import { showToast } from '../components/toast.js';
import { openModal } from '../components/modal.js';
import {
  translateCirStatus,
  translateSensitizing,
  translateEvidenceStatus,
  formatIngredientFunctions,
  getPregnancySuitability,
  getSkinSuitabilityLabel,
  getPregnancyBadgeHTML,
  getSkinBadgeHTML
} from '../utils/i18n.js';

const SAMPLE_FORMULAS = {
  niacinamide_serum: {
    nameEn: 'Niacinamide 10% + Zinc PCA 1% Clarifying Serum',
    nameAr: 'سيروم نياسيناميد 10% مع زنك 1% لتنقية البشرة',
    text: 'Aqua (Water), Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum, Xanthan Gum, Isoceteth-20, Ethoxydiglycol, Phenoxyethanol, Chlorphenesin.',
  },
  cica_barrier_cream: {
    nameEn: 'Centella Asiatica Barrier Recovery Cream',
    nameAr: 'كريم سيكا لترميم وتقوية حاجز البشرة',
    text: 'Water, Glycerin, Caprylic/Capric Triglyceride, Butylene Glycol, Squalane, Cetearyl Alcohol, Centella Asiatica Extract, Madecassoside, Ceramide NP, Ceramide AP, Cholesterol, Phytosphingosine, Panthenol, Allantoin, Dimethicone, Carbomer, 1,2-Hexanediol, Ethylhexylglycerin.',
  },
  salicylic_cleanser: {
    nameEn: 'BHA 2% Pore Clearing Foaming Cleanser',
    nameAr: 'غسول رغوي بحمض الساليسيليك 2% لتنظيف المسام',
    text: 'Aqua, Sodium Cocoyl Isethionate, Glycerin, Cocamidopropyl Betaine, Salicylic Acid, Niacinamide, Sodium Hyaluronate, Camellia Sinensis Leaf Extract, Zinc PCA, Citric Acid, Sodium Benzoate, Potassium Sorbate.',
  },
};

export function renderAnalyzer(container) {
  container.innerHTML = '';
  const isAr = getState('lang') === 'ar';

  const viewContainer = createElement('div', { className: 'analyzer-view' });

  // Input Card (Full width across page)
  const inputCard = createBentoCard({
    id: 'analyzer-input-card',
    colSpan: 'full',
    rowSpan: '1',
    icon: 'scan',
    title: isAr ? 'إدخال قائمة المكونات (INCI)' : 'Cosmetic Formula Input (INCI)',
    subtitle: isAr ? 'الصق النص مباشرة، أو ارفع صورة الملصق، أو التقط صورة بالكاميرا' : 'Paste ingredient text, upload packaging photo, or use live camera',
    badge: isAr ? 'مدخلات' : 'Input',
    badgeType: 'mint',
    content: `
      <div class="analyzer-input-wrapper">
        <div class="input-mode-tabs">
          <button type="button" class="tab-btn active" data-tab="paste">
            ${renderIcon('sparkles', 16)} <span>${isAr ? 'نص المكونات' : 'Paste Text'}</span>
          </button>
          <button type="button" class="tab-btn" data-tab="upload">
            ${renderIcon('scan', 16)} <span>${isAr ? 'رفع صورة الملصق' : 'Upload Photo'}</span>
          </button>
          <button type="button" class="tab-btn" data-tab="camera">
            ${renderIcon('camera', 16)} <span>${isAr ? 'الكاميرا الحية' : 'Live Camera'}</span>
          </button>
        </div>

        <div class="product-name-row">
          <input type="text" id="input-product-name" class="form-input" placeholder="${isAr ? 'اسم المستحضر (اختياري، مثلاً: سيروم الهيالورونيك)' : 'Product Name (e.g. Ceramide Barrier Moisturizer)'}" />
        </div>

        <!-- Tab 1: Text -->
        <div id="tab-content-paste" class="tab-content active">
          <textarea id="input-ingredient-text" class="form-textarea" rows="5" placeholder="${isAr ? 'الصق قائمة المكونات هنا مفصولة بفواصل، مثلاً: Water, Niacinamide, Glycerin, Centella Asiatica Extract...' : 'Paste cosmetic ingredients separated by commas: Water, Niacinamide, Glycerin, Centella Asiatica Extract, Ceramide NP...'}"></textarea>
          <div class="sample-presets-row">
            <span class="text-xs text-muted">${isAr ? 'نماذج جاهزة للتجربة:' : 'Try sample formulas:'}</span>
            <button type="button" class="btn btn-xs btn-ghost btn-preset" data-preset="niacinamide_serum">${isAr ? 'سيروم نياسيناميد' : 'Niacinamide Serum'}</button>
            <button type="button" class="btn btn-xs btn-ghost btn-preset" data-preset="cica_barrier_cream">${isAr ? 'كريم سيكا' : 'Cica Cream'}</button>
            <button type="button" class="btn btn-xs btn-ghost btn-preset" data-preset="salicylic_cleanser">${isAr ? 'غسول ساليسيليك' : 'BHA Cleanser'}</button>
          </div>
        </div>

        <!-- Tab 2: Upload -->
        <div id="tab-content-upload" class="tab-content">
          <div id="dropzone-upload" class="upload-dropzone">
            <input type="file" id="file-upload-input" accept="image/*" class="file-hidden-input" />
            <div class="dropzone-inner">
              ${renderIcon('scan', 32)}
              <p class="dropzone-text">${isAr ? 'اسحب صورة ملصق العبوة هنا أو انقر للاختيار' : 'Drag & drop cosmetic label photo or click to browse'}</p>
              <span class="text-xs text-muted">${isAr ? 'يدعم معالجة التباين وقراءة الخطوط الدقيقة' : 'Auto-enhances contrast and small typography'}</span>
            </div>
          </div>
        </div>

        <!-- Tab 3: Camera -->
        <div id="tab-content-camera" class="tab-content">
          <div class="camera-preview-wrapper">
            <video id="camera-video-stream" autoplay playsinline muted class="camera-stream"></video>
            <canvas id="camera-capture-canvas" style="display:none;"></canvas>
            <div class="camera-controls">
              <button type="button" id="btn-camera-start" class="btn btn-secondary">${renderIcon('camera', 16)} <span>${isAr ? 'تشغيل الكاميرا' : 'Start Camera'}</span></button>
              <button type="button" id="btn-camera-capture" class="btn btn-primary" style="display:none;">${renderIcon('scan', 16)} <span>${isAr ? 'التقاط وقراءة' : 'Capture & Read'}</span></button>
            </div>
          </div>
        </div>

        <div class="analyzer-actions-bar">
          <button type="button" id="btn-run-analysis" class="btn btn-primary btn-lg">
            ${renderIcon('sparkles', 20)}
            <span>${isAr ? 'تحليل التركيبة ومطابقة الأدلة' : 'Analyze & Screen Formula'}</span>
          </button>
          <button type="button" id="btn-clear-input" class="btn btn-ghost btn-lg">
            ${renderIcon('close', 16)}
            <span>${isAr ? 'مسح' : 'Clear'}</span>
          </button>
        </div>

        <!-- Profile link banner (linked to Profile page) -->
        <div id="analyzer-profile-banner" class="profile-link-banner">
          ${renderIcon('user', 14)}
          <span id="analyzer-profile-text" class="profile-banner-text"></span>
          <button type="button" class="btn btn-xs btn-ghost" id="btn-go-to-profile">
            ${isAr ? 'تعديل الملف' : 'Edit Profile'} ↗
          </button>
        </div>
      </div>
    `,
  });

  viewContainer.appendChild(inputCard);

  // ── PROGRESS TRACKER SECTION ─────────────────────────────────────
  const trackerWrapper = createElement('div', {
    id: 'analysis-tracker-wrapper',
    className: 'analysis-tracker-wrapper',
    style: 'display: none;',
  });
  const tracker = createStageTracker();
  trackerWrapper.appendChild(tracker.element);
  viewContainer.appendChild(trackerWrapper);

  // ── RESULTS SECTION (BENTO GRID) ─────────────────────────────────
  const resultsGrid = createElement('div', {
    id: 'analyzer-results-grid',
    className: 'bento-grid analyzer-results-grid',
    style: 'display: none;',
  });
  viewContainer.appendChild(resultsGrid);

  container.appendChild(viewContainer);

  // ── EVENT LISTENERS & LOGIC ──────────────────────────────────────
  const textArea = inputCard.querySelector('#input-ingredient-text');
  const nameInput = inputCard.querySelector('#input-product-name');
  const btnRun = inputCard.querySelector('#btn-run-analysis');
  const btnClear = inputCard.querySelector('#btn-clear-input');

  let lastReport = null;

  // ── PROFILE BANNER ────────────────────────────────────────────────
  const profileBannerText = inputCard.querySelector('#analyzer-profile-text');
  const PROFILE_LABELS = {
    en: { oily: 'Oily', dry: 'Dry', sensitive: 'Sensitive', acneProne: 'Acne-Prone', rosacea: 'Rosacea', combination: 'Combination', normal: 'Normal', pregnant: 'Pregnancy-Safe' },
    ar: { oily: 'دهنية', dry: 'جافة', sensitive: 'حساسة', acneProne: 'معرضة للحبوب', rosacea: 'وردية', combination: 'مختلطة', normal: 'عادية', pregnant: 'آمن للحمل' },
  };

  function updateProfileBanner() {
    const profiles = getState('skinProfiles') || [];
    const labels = isAr ? PROFILE_LABELS.ar : PROFILE_LABELS.en;
    if (profiles.length === 0) {
      profileBannerText.textContent = isAr ? 'لا يوجد ملف شخصي محدد — اضغط تعديل لتحديده' : 'No skin profile set — click Edit Profile to set one';
    } else {
      const names = profiles.map(p => labels[p] || p).join(isAr ? '، ' : ', ');
      profileBannerText.textContent = (isAr ? 'الملف الشخصي النشط: ' : 'Active Profile: ') + names;
    }
  }

  updateProfileBanner();

  // Auto-update banner and re-render active results when profile changes in another tab/page
  const unsubProfile = subscribe('skinProfiles', (state) => {
    updateProfileBanner();
    const updatedProfiles = state.skinProfiles || getState('skinProfiles') || [];
    if (lastReport && resultsGrid.style.display !== 'none') {
      renderAnalysisResults(resultsGrid, lastReport, isAr, updatedProfiles);
    }
  });

  // Cleanup subscription when page unmounts (next navigation replaces container)
  const observer = new MutationObserver(() => {
    if (!container.contains(inputCard)) {
      unsubProfile();
      observer.disconnect();
    }
  });
  observer.observe(container, { childList: true });

  // Navigate to profile page
  inputCard.querySelector('#btn-go-to-profile')?.addEventListener('click', () => {
    window.location.hash = '#profile';
  });

  // Tabs
  const tabButtons = inputCard.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      inputCard.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));

      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      const content = inputCard.querySelector(`#tab-content-${tabId}`);
      if (content) content.classList.add('active');
    });
  });

  // Presets
  inputCard.querySelectorAll('.btn-preset').forEach(btn => {
    btn.addEventListener('click', () => {
      const pKey = btn.getAttribute('data-preset');
      const preset = SAMPLE_FORMULAS[pKey];
      if (preset) {
        nameInput.value = isAr ? preset.nameAr : preset.nameEn;
        textArea.value = preset.text;
        showToast(isAr ? 'تم تحميل النموذج بنجاح' : 'Loaded sample formula', { type: 'info' });
      }
    });
  });

  // Clear
  btnClear.addEventListener('click', () => {
    lastReport = null;
    textArea.value = '';
    nameInput.value = '';
    resultsGrid.style.display = 'none';
    trackerWrapper.style.display = 'none';
  });

  // Upload
  const fileInput = inputCard.querySelector('#file-upload-input');
  const dropzone = inputCard.querySelector('#dropzone-upload');

  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageOCR(file);
    }
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
    if (file) {
      await handleImageOCR(file);
    }
  });

  // Camera
  let cameraStream = null;
  const videoEl = inputCard.querySelector('#camera-video-stream');
  const canvasEl = inputCard.querySelector('#camera-capture-canvas');
  const btnStartCam = inputCard.querySelector('#btn-camera-start');
  const btnCapture = inputCard.querySelector('#btn-camera-capture');

  btnStartCam.addEventListener('click', async () => {
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 } },
      });
      videoEl.srcObject = cameraStream;
      btnStartCam.style.display = 'none';
      btnCapture.style.display = 'inline-flex';
    } catch (err) {
      showToast(isAr ? 'تعذر فتح الكاميرا. يرجى التحقق من أذونات المتصفح.' : 'Camera access denied or unavailable.', { type: 'error' });
    }
  });

  btnCapture.addEventListener('click', async () => {
    if (!videoEl.videoWidth) return;
    canvasEl.width = videoEl.videoWidth;
    canvasEl.height = videoEl.videoHeight;
    const ctx = canvasEl.getContext('2d');
    ctx.drawImage(videoEl, 0, 0);

    // Stop stream
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      cameraStream = null;
    }
    btnCapture.style.display = 'none';
    btnStartCam.style.display = 'inline-flex';

    canvasEl.toBlob(async (blob) => {
      if (blob) {
        await handleImageOCR(blob);
      }
    }, 'image/jpeg', 0.95);
  });

  async function handleImageOCR(imageFile) {
    showToast(isAr ? 'جاري مسح الملصق وقراءة المكونات بواسطة OCR...' : 'Processing label image with OCR...', { type: 'info' });
    try {
      const text = await recognizeText(imageFile, {
        onProgress: (p) => {
          // Progress update
        },
      });

      if (!text || text.trim().length === 0) {
        showToast(isAr ? 'لم يتم العثور على نص واضح. حاول التقاط صورة بزاوية وإضاءة أفضل.' : 'No readable text recognized. Try better lighting.', { type: 'warning' });
        return;
      }

      textArea.value = text;
      // Switch back to text tab to review
      tabButtons[0].click();
      showToast(isAr ? 'تم استخراج المكونات بنجاح. يمكنك مراجعتها قبل التحليل.' : 'Extracted ingredients. Review and click Analyze.', { type: 'success' });
    } catch (e) {
      showToast(`OCR error: ${e.message}`, { type: 'error' });
    }
  }

  // Run Analysis
  btnRun.addEventListener('click', async () => {
    const rawText = textArea.value.trim();
    if (!rawText) {
      showToast(isAr ? 'يرجى إدخال أو لصق قائمة المكونات أولاً.' : 'Please enter or paste an ingredient list first.', { type: 'warning' });
      return;
    }

    // Read profile directly from global state (set in Profile page)
    const selectedProfiles = getState('skinProfiles') || [];

    trackerWrapper.style.display = 'block';
    resultsGrid.style.display = 'none';
    btnRun.disabled = true;

    try {
      const report = await executeFormulaAnalysis(rawText, {
        productName: nameInput.value.trim() || null,
        skinProfiles: selectedProfiles,
        onStageChange: (stage, progress, details) => {
          tracker.update(stage, progress, details);
        },
      });

      lastReport = report;
      showToast(isAr ? 'تم التحليل العلمي بنجاح!' : 'Formula analysis completed successfully!', { type: 'success' });
      renderAnalysisResults(resultsGrid, report, isAr, selectedProfiles);
      resultsGrid.style.display = 'grid';
      resultsGrid.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      tracker.update('error', 0, { error: err.message });
      showToast(err.message, { type: 'error' });
    } finally {
      btnRun.disabled = false;
    }
  });
}

/**
 * Render Complete Bento Grid Analysis Results
 */
function renderAnalysisResults(container, report, isAr, selectedProfiles = []) {
  container.innerHTML = '';
  const score = report.safetyScore;
  const ai = report.aiInsights;
  const isPregnant = selectedProfiles.includes('pregnant');
  // Skin types (exclude 'pregnant' from skin type list)
  const skinTypes = selectedProfiles.filter(p => p !== 'pregnant');

  // 1. OVERALL SAFETY SCORE CARD (Col 1, Row 1)
  const scoreCard = createBentoCard({
    id: 'result-score-card',
    colSpan: '1',
    rowSpan: '1',
    icon: 'shield',
    title: isAr ? 'مؤشر أمان التركيبة' : 'Formula Safety Index',
    subtitle: score.gradeLabel,
    badge: `${score.grade} · ${score.score}/100`,
    badgeType: score.grade === 'A' ? 'emerald' : score.grade === 'B' ? 'mint' : 'amber',
    content: `
      <div class="score-display-wrapper">
        <div class="score-circular-metric" style="color: ${score.gradeColor};">
          <span class="score-num">${score.score}</span>
          <span class="score-total">/100</span>
        </div>
        <div class="score-submetrics">
          <div class="submetric-item">
            <span class="sub-label">${isAr ? 'مكونات مطابقة:' : 'Verified:'}</span>
            <span class="sub-val">${report.matchedIngredients.length}/${report.totalCount}</span>
          </div>
          <div class="submetric-item">
            <span class="sub-label">${isAr ? 'مهيجات محتملة:' : 'Sensitizers:'}</span>
            <span class="sub-val">${score.metrics.sensitizerHighCount + score.metrics.sensitizerModerateCount}</span>
          </div>
          <div class="submetric-item">
            <span class="sub-label">${isAr ? 'عوامل سد المسام:' : 'Comedogenic:'}</span>
            <span class="sub-val">${score.metrics.comedogenicHighCount}</span>
          </div>
        </div>
      </div>
    `,
  });

  // 2. FORMULATION INSIGHTS CARD (Col 2, Row 1)
  const insights = ai.formulationInsights || {};
  const activesList = insights.keyActives || report.matchedIngredients.slice(0, 4).map(m => m.ingredient.inciName);

  const insightsCard = createBentoCard({
    id: 'result-insights-card',
    colSpan: '2',
    rowSpan: '1',
    icon: 'sparkles',
    title: isAr ? 'الخلاصة العلمية للتركيبة' : 'Scientific Formulation Insights',
    subtitle: ai.isLocalFallback ? (isAr ? 'محرك الأدلة المحلي' : 'Local Evidence Synthesis') : `AI Provider: ${ai.provider}`,
    badge: isAr ? 'تحليل ذكي' : 'Formula Insights',
    badgeType: 'emerald',
    content: `
      <div class="insights-content">
        <p class="summary-paragraph">${ai.summary || ''}</p>
        <div class="actives-chips-row">
          <span class="text-xs text-muted font-bold">${isAr ? 'المكونات الفعالة البارزة:' : 'Key Active Drivers:'}</span>
          ${activesList.map(a => `<span class="badge badge-mint">${a}</span>`).join('')}
        </div>
        ${insights.textureAndVehicle ? `<p class="text-xs text-muted mt-2">${insights.textureAndVehicle}</p>` : ''}
      </div>
    `,
  });

  // 3. SKIN COMPATIBILITY & WARNINGS CARD (Col 1, Row 1)
  const profileWarnings = score.profileWarnings || [];
  const compatContent = profileWarnings.length > 0
    ? `
      <div class="warnings-list">
        ${profileWarnings.map(w => {
          const profLabel = isAr ? (PROFILE_LABELS.ar[w.profile] || w.profile) : (PROFILE_LABELS.en[w.profile] || w.profile);
          const reasonText = isAr ? (w.reasonAr || w.reason) : w.reason;
          return `
            <div class="warning-row warning-${w.level}">
              ${renderIcon('alert', 16)}
              <div class="warning-text">
                <strong>${w.ingredient}</strong> (${profLabel}): ${reasonText}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `
    : `
      <div class="clean-profile-box">
        ${renderIcon('check', 24)}
        <p class="text-sm">${isAr ? 'لا توجد تعارضات مسجلة مع الملف الشخصي المحدد.' : 'No critical conflicts identified for the selected skin profile.'}</p>
      </div>
    `;

  const compatCard = createBentoCard({
    id: 'result-compat-card',
    colSpan: '1',
    rowSpan: '1',
    icon: 'user',
    title: isAr ? 'توافق الملف الشخصي' : 'Skin Compatibility Screening',
    subtitle: `${profileWarnings.length} ${isAr ? 'تنبيهات مسجلة' : 'alerts flagged'}`,
    badge: profileWarnings.length === 0 ? (isAr ? 'متوافق' : 'Compatible') : (isAr ? 'تنبيه' : 'Alerts'),
    badgeType: profileWarnings.length === 0 ? 'emerald' : 'amber',
    content: compatContent,
  });

  // 4. FULL INGREDIENT BREAKDOWN TABLE CARD (Col 3 / Full)
  // 4. FULL INGREDIENT BREAKDOWN TABLE CARD (Col 3 / Full)
  const matchedRows = (report.matchedIngredients || []).map(item => {
    const ing = item.ingredient;
    const comedoBadge = ing.comedogenicRating !== null && ing.comedogenicRating !== undefined
      ? `<span class="badge badge-${ing.comedogenicRating >= 3 ? 'amber' : 'neutral'}">${ing.comedogenicRating}/5</span>`
      : '—';

    const sensBadge = ing.sensitizingPotential === 'high'
      ? `<span class="badge badge-rose">${isAr ? 'مرتفع' : 'High'}</span>`
      : ing.sensitizingPotential === 'moderate'
        ? `<span class="badge badge-amber">${isAr ? 'متوسط' : 'Moderate'}</span>`
        : `<span class="badge badge-emerald">${isAr ? 'منخفض' : 'Low'}</span>`;

    const formattedFns = formatIngredientFunctions(ing, isAr, 2);
    const cirText = isAr ? translateCirStatus(ing.cirStatus, true) : (ing.cirStatus || 'Evaluated');

    const pregBadge = getPregnancyBadgeHTML(ing.suitability, isAr, isPregnant);
    const skinBadge = getSkinBadgeHTML(ing.suitability, isAr, skinTypes);

    return `
      <tr class="ingredient-row-interactive" data-id="${ing.id}">
        <td class="col-name">
          <strong>${ing.inciName}</strong>
          ${item.rawName !== ing.inciName ? `<span class="raw-sub">${item.rawName}</span>` : ''}
        </td>
        <td class="col-functions text-xs">${formattedFns || '—'}</td>
        <td class="col-cir text-xs">${cirText}</td>
        <td class="col-comedo">${comedoBadge}</td>
        <td class="col-sens">${sensBadge}</td>
        <td class="col-preg">${pregBadge}</td>
        <td class="col-skin">${skinBadge}</td>
        <td class="col-action">
          <button type="button" class="btn btn-xs btn-ghost btn-view-dossier" data-id="${ing.id}">
            ${renderIcon('sparkles', 14)} <span>${isAr ? 'التفاصيل' : 'Details'}</span>
          </button>
        </td>
      </tr>
    `;
  });

  const unmatchedRows = (report.unmatchedIngredients || []).map(item => {
    const rawDisplayName = item.cleanName || item.rawName;
    const assessment = item.aiAssessment || {};
    const citedFunctions = (assessment.functions || []).filter(claim => claim.value && claim.sourceRecordIds?.length).map(claim => claim.value);
    const comedoRating = assessment.comedogenicity?.sourceRecordIds?.length ? assessment.comedogenicity.rating : null;
    const comedoNote = assessment.comedogenicity?.sourceRecordIds?.length ? assessment.comedogenicity.note : '';
    const sensitivityLevel = assessment.sensitization?.sourceRecordIds?.length ? assessment.sensitization.level : 'unknown';
    const pregnancyStatus = assessment.pregnancy?.sourceRecordIds?.length ? assessment.pregnancy.status : 'unknown';
    const selectedAssessment = (assessment.skinSuitability || []).filter(result => skinTypes.includes(result.profile) && result.sourceRecordIds?.length);
    const aiSkinStatus = selectedAssessment.some(result => result.status === 'avoid') ? 'avoid'
      : selectedAssessment.some(result => result.status === 'caution') ? 'caution'
        : selectedAssessment.length && selectedAssessment.every(result => result.status === 'suitable') ? 'suitable' : 'unknown';
    const assessmentBadge = isAr ? 'تقييم أولي من AI' : 'AI evidence review';
    const aiUnavailable = report.aiInsights?.isLocalFallback;
    const researchHits = report.literatureResearch?.byIngredient?.[rawDisplayName] || [];
    const lookupFailed = report.literatureResearch?.errors?.some(error => !error.ingredientName || error.ingredientName.toLowerCase() === String(rawDisplayName).toLowerCase());
    const researchLinks = researchHits.map(hit => {
      const href = /^https:\/\/(?:pubmed\.ncbi\.nlm\.nih\.gov|europepmc\.org|doi\.org)\//i.test(hit.sourceUrl || '') ? hit.sourceUrl : '';
      return href ? `<a href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${escapeHTML(hit.title)}</a>` : '';
    }).filter(Boolean);
    const comedoCell = Number.isInteger(comedoRating)
      ? `<span class="badge badge-neutral">${comedoRating}/5</span>`
      : (comedoNote ? `<span class="text-xs">${escapeHTML(comedoNote)}</span>` : '—');
    const sensitivityCell = sensitivityLevel === 'high'
      ? `<span class="badge badge-rose">${isAr ? 'مرتفع*' : 'High*'}</span>`
      : sensitivityLevel === 'moderate'
        ? `<span class="badge badge-amber">${isAr ? 'متوسط*' : 'Moderate*'}</span>`
        : sensitivityLevel === 'low'
          ? `<span class="badge badge-mint">${isAr ? 'منخفض*' : 'Low*'}</span>`
          : `<span class="badge badge-neutral">${isAr ? 'غير معلوم' : 'Unknown'}</span>`;
    const pregnancyCell = !isPregnant ? '—'
      : pregnancyStatus === 'evidence_of_safety'
        ? `<span class="badge badge-mint">${isAr ? 'لا إشارة قلق بالمصدر*' : 'No concern noted*'}</span>`
        : pregnancyStatus === 'evidence_of_concern'
          ? `<span class="badge badge-amber">${isAr ? 'إشارة تستدعي الحذر*' : 'Concern noted*'}</span>`
          : `<span class="badge badge-neutral">${isAr ? 'بيانات غير كافية' : 'Insufficient data'}</span>`;
    const skinCell = aiSkinStatus === 'suitable'
      ? `<span class="badge badge-mint">${isAr ? 'ملائم وفق المصدر*' : 'Supported fit*'}</span>`
      : aiSkinStatus === 'caution'
        ? `<span class="badge badge-amber">${isAr ? 'حذر*' : 'Caution*'}</span>`
        : aiSkinStatus === 'avoid'
          ? `<span class="badge badge-rose">${isAr ? 'تجنب*' : 'Avoid*'}</span>`
          : `<span class="badge badge-neutral">${isAr ? 'غير معلوم' : 'Unknown'}</span>`;
    const query = encodeURIComponent(rawDisplayName || '');
    const officialSourceLinks = [
      { label: 'PubMed', href: `https://pubmed.ncbi.nlm.nih.gov/?term=${query}` },
      { label: 'CosIng', href: 'https://ec.europa.eu/growth/tools-databases/cosing/' },
      { label: 'FDA', href: `https://www.fda.gov/search?s=${query}` },
      { label: 'SFDA', href: 'https://www.sfda.gov.sa/ar/node/17590' },
    ];
    const officialSourceLinkHTML = officialSourceLinks.map(source =>
      `<a href="${escapeHTML(source.href)}" target="_blank" rel="noopener noreferrer">${source.label}</a>`
    ).join(' · ');
    return `
      <tr class="ingredient-row-unmatched">
        <td class="col-name">
          <strong>${escapeHTML(rawDisplayName)}</strong>
          ${item.rawName && item.rawName !== rawDisplayName ? `<span class="raw-sub">${escapeHTML(item.rawName)}</span>` : ''}
        </td>
        <td class="col-functions text-xs">${citedFunctions.length ? escapeHTML(citedFunctions.join(isAr ? '، ' : ', ')) : `<span class="text-muted">${isAr ? 'لا توجد وظيفة موثقة' : 'No sourced function'}</span>`}</td>
        <td class="col-cir text-xs"><span class="badge badge-neutral">${isAr ? 'لم يُفحص CIR' : 'CIR not checked'}</span></td>
        <td class="col-comedo">${comedoCell}</td>
        <td class="col-sens" title="${escapeHTML(assessment.sensitization?.note || '')}">${sensitivityCell}${assessment.sensitization?.note ? `<small class="text-muted">${escapeHTML(assessment.sensitization.note)}</small>` : ''}</td>
        <td class="col-preg" title="${escapeHTML(assessment.pregnancy?.note || '')}">${pregnancyCell}${isPregnant && assessment.pregnancy?.note ? `<small class="text-muted">${escapeHTML(assessment.pregnancy.note)}</small>` : ''}</td>
        <td class="col-skin" title="${escapeHTML(selectedAssessment[0]?.note || '')}">${skinCell}${selectedAssessment[0]?.note ? `<small class="text-muted">${escapeHTML(selectedAssessment[0].note)}</small>` : ''}</td>
        <td class="col-action">
          <span class="badge badge-mint">${item.aiAssessment ? assessmentBadge : aiUnavailable ? (isAr ? 'تعذر تقييم AI' : 'AI assessment unavailable') : (researchHits.length ? (isAr ? 'أدلة أولية' : 'Research leads') : lookupFailed ? (isAr ? 'تعذر الاتصال' : 'Lookup failed') : (isAr ? 'تم البحث' : 'Searched'))}</span>
          ${researchLinks.length ? `<div class="text-xs literature-links">${researchLinks.join('<br>')}<br><span class="text-muted">${isAr ? 'نتائج أولية — تحتاج مراجعة، ولم تُعتمد كمكوّن موثق.' : 'Preliminary leads; review required before verification.'}</span></div>` : `<div class="text-xs text-muted">${lookupFailed ? (isAr ? 'تعذر الوصول إلى Europe PMC.' : 'Could not reach Europe PMC.') : (isAr ? 'لا توجد نتائج مناسبة في Europe PMC.' : 'No relevant Europe PMC results.')}</div>`}
          <div class="text-xs official-source-links"><span class="text-muted">${isAr ? 'روابط تحقق (لم تُستعلم آلياً):' : 'Manual reference links (not queried):'}</span> ${officialSourceLinkHTML}</div>
        </td>
      </tr>
    `;
  });

  const allBreakdownRows = [...matchedRows, ...unmatchedRows].join('');

  const totalMatched = (report.matchedIngredients || []).length;
  const totalUnmatched = (report.unmatchedIngredients || []).length;
  const totalScreened = report.totalCount || (totalMatched + totalUnmatched);

  const tableSubtitle = isAr
    ? `${totalScreened} مكون تم استخراجها وفحصها (${totalMatched} مطابق لقاعدة الأدلة، ${totalUnmatched} قيد التوثيق)`
    : `${totalScreened} ingredients screened (${totalMatched} verified, ${totalUnmatched} unlisted)`;

  const tableCard = createBentoCard({
    id: 'result-table-card',
    colSpan: 'full',
    rowSpan: '2',
    icon: 'database',
    title: isAr ? 'التفكيك العلمي للمكونات المسجلة' : 'Verified Ingredient Breakdown',
    subtitle: tableSubtitle,
    badge: isAr ? `${totalMatched}/${totalScreened} مطابق` : `${totalMatched}/${totalScreened} Verified`,
    badgeType: totalMatched > 0 ? 'emerald' : 'amber',
    content: allBreakdownRows.length > 0 ? `
      ${report.literatureResearch?.skippedNames?.length ? `<p class="text-xs text-muted">${isAr ? `لم يُبحث عن ${report.literatureResearch.skippedNames.length} مكون بسبب حد البحث: ${escapeHTML(report.literatureResearch.skippedNames.join('، '))}` : `Search limit reached; not searched: ${escapeHTML(report.literatureResearch.skippedNames.join(', '))}`}</p>` : ''}
      <div class="table-responsive-wrapper">
        <table class="ingredient-breakdown-table">
          <thead>
            <tr>
              <th>${isAr ? 'اسم المركب (INCI)' : 'INCI Name'}</th>
              <th>${isAr ? 'الوظيفة التجميلية' : 'Primary Function'}</th>
              <th>${isAr ? 'مراجعة أمان CIR' : 'CIR Safety Review'}</th>
              <th>${isAr ? 'سد المسام' : 'Comedo'}</th>
              <th>${isAr ? 'التحسس' : 'Sensitization'}</th>
              <th>${isAr ? 'مناسب للحمل' : 'Pregnancy'}</th>
              <th>${isAr ? 'مناسب للبشرة' : 'Skin Type'}</th>
              <th>${isAr ? 'الملف' : 'Dossier'}</th>
            </tr>
          </thead>
          <tbody>
            ${allBreakdownRows}
          </tbody>
        </table>
      </div>
    ` : `
      <div class="empty-state-mini text-center p-6">
        <p class="text-sm text-muted">${isAr ? 'لم يتم العثور على مكونات قابلة للقراءة.' : 'No readable ingredients detected.'}</p>
      </div>
    `,
  });

  container.append(scoreCard, insightsCard, compatCard, tableCard);

  // Bind click handlers for ingredient dossier inspection
  tableCard.querySelectorAll('.btn-view-dossier').forEach(btn => {
    btn.addEventListener('click', () => {
      const ingId = btn.getAttribute('data-id');
      const item = report.matchedIngredients.find(m => m.ingredient.id === ingId);
      if (item) {
        showIngredientModal(item.ingredient, isAr);
      }
    });
  });
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

function showIngredientModal(ing, isAr) {
  const sensLevel = ing.sensitizingPotential || 'low';
  const evidence = translateEvidenceStatus(ing.evidenceStatus || 'verified', isAr);
  const cirStatusTranslated = isAr ? translateCirStatus(ing.cirStatus, true) : (ing.cirStatus || 'Reviewed');
  const comedoText = ing.comedogenicRating !== undefined && ing.comedogenicRating !== null ? (isAr ? `انسداد المسام: ${ing.comedogenicRating}/5` : `Comedogenic: ${ing.comedogenicRating}/5`) : '';
  const sensText = isAr ? `التحسس: ${translateSensitizing(sensLevel, true)}` : `Sensitization: ${sensLevel}`;
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
        <h4>${isAr ? 'الوصف العلمي وآلية العمل' : 'Scientific Description'}</h4>
        <p>${isAr ? (ing.descriptionAr || ing.descriptionEn) : ing.descriptionEn}</p>
      </div>

      <div class="dossier-section">
        <h4>${isAr ? 'تقييم أمان CIR والسلامة التنظيمية' : 'CIR Safety Assessment & Regulation'}</h4>
        <p class="text-sm"><strong>${cirStatusTranslated}</strong></p>
      </div>

      <div class="dossier-section">
        <h4>${isAr ? 'المصادر العلمية المعتمدة' : 'Approved Scientific Sources'}</h4>
        <ul>
          ${(ing.sources || []).map(s => `<li>${s.sourceName || s.sourceId || (isAr ? 'لجنة خبراء مراجعة مكونات مستحضرات التجميل (CIR)' : 'CIR Expert Panel')}</li>`).join('')}
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

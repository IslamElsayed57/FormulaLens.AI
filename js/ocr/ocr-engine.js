/**
 * FormulaLens AI — Cosmetic Label OCR & INCI Text Parser
 * Preprocesses images via HTML5 Canvas (contrast stretching, adaptive thresholding)
 * Recognizes text via Tesseract.js worker with progress callback
 * Intelligently extracts and parses cosmetic INCI ingredient lists
 */

let _tesseractWorker = null;
let _tesseractLoading = null;

/**
 * Ensure Tesseract.js is loaded in the browser environment
 */
async function loadTesseractLibrary() {
  if (window.Tesseract) return window.Tesseract;
  if (_tesseractLoading) return _tesseractLoading;

  _tesseractLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      if (window.Tesseract) {
        resolve(window.Tesseract);
      } else {
        reject(new Error('Tesseract loaded but window.Tesseract is not defined'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load Tesseract.js from CDN. Check internet connection.'));
    document.head.appendChild(script);
  });

  return _tesseractLoading;
}

/**
 * Preprocess image on canvas to optimize OCR for cosmetic packaging:
 * - High contrast
 * - Grayscale conversion
 * - Binarization to eliminate bottle reflections and metallic backgrounds
 */
export async function preprocessImage(imageSource) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Scale up if image is small for better small font recognition
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;
        const maxDim = 2000;
        const minDim = 800;

        if (width < minDim || height < minDim) {
          const scale = Math.max(minDim / width, minDim / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        } else if (width > maxDim || height > maxDim) {
          const scale = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        canvas.width = width;
        canvas.height = height;

        // Draw original
        ctx.drawImage(img, 0, 0, width, height);

        // Get pixel data
        const imgData = ctx.getImageData(0, 0, width, height);
        const d = imgData.data;

        // Grayscale & contrast enhancement
        let minLum = 255;
        let maxLum = 0;

        // First pass: find luminance range
        for (let i = 0; i < d.length; i += 4) {
          const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          if (lum < minLum) minLum = lum;
          if (lum > maxLum) maxLum = lum;
        }

        const range = Math.max(1, maxLum - minLum);

        // Second pass: stretch contrast and apply mild threshold
        for (let i = 0; i < d.length; i += 4) {
          const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          // Contrast stretch
          const normalized = ((lum - minLum) / range) * 255;
          // Slight sharpening / gamma adjustment
          const finalVal = normalized > 128 ? Math.min(255, normalized * 1.05) : Math.max(0, normalized * 0.95);

          d[i] = finalVal;
          d[i + 1] = finalVal;
          d[i + 2] = finalVal;
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      } catch (err) {
        // Fallback to original image if canvas manipulation errors (e.g. CORS)
        resolve(typeof imageSource === 'string' ? imageSource : img.src);
      }
    };

    img.onerror = (e) => reject(new Error('Failed to load image for preprocessing'));

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else if (imageSource instanceof Blob || imageSource instanceof File) {
      img.src = URL.createObjectURL(imageSource);
    } else {
      reject(new Error('Invalid imageSource provided'));
    }
  });
}

/**
 * Recognize text from image with progress tracking
 * @param {string|File|Blob} image - Image URL or file object
 * @param {Object} options - { onProgress, lang }
 * @returns {Promise<string>} Recognized raw text
 */
export async function recognizeText(image, options = {}) {
  const onProgress = options.onProgress || (() => {});
  onProgress({ status: 'preprocessing', progress: 0.1 });

  // Preprocess image
  let processedImageUrl;
  try {
    processedImageUrl = await preprocessImage(image);
  } catch (e) {
    console.warn('[OCR] Preprocessing failed, using original:', e);
    processedImageUrl = image;
  }

  onProgress({ status: 'loading_tesseract', progress: 0.25 });
  const Tesseract = await loadTesseractLibrary();

  onProgress({ status: 'recognizing', progress: 0.4 });

  const worker = await Tesseract.createWorker(['eng', 'ara'], 1, {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        const ocrProgress = 0.4 + (m.progress || 0) * 0.55;
        onProgress({ status: 'recognizing', progress: Math.min(0.95, ocrProgress), details: m });
      }
    },
  });

  try {
    const ret = await worker.recognize(processedImageUrl);
    onProgress({ status: 'completed', progress: 1.0 });
    return ret.data.text || '';
  } finally {
    await worker.terminate();
  }
}

/**
 * Clean and parse cosmetic ingredient lists from raw text
 * Handles cosmetic headers, brackets, percentages, allergens, and common delimiters
 * @param {string} rawText
 * @returns {Array<{ rawName: string, cleanName: string, concentrationHint?: string }>}
 */
export function parseIngredients(rawText) {
  if (!rawText || typeof rawText !== 'string') return [];

  let text = rawText;

  // 1. Remove common ingredient section headers (English, French, Arabic) with any delimiters (: ; - . |)
  text = text.replace(/^[|\s]*(?:ingredients|ingredient list|active ingredients|inactive ingredients|ingr[eé]dients|المكونات|المواد الفعالة)\s*[:;：\-\.\s|]?\s*/im, '');
  text = text.replace(/(?:^|[|\n\r;])\s*(?:ingredients|ingr[eé]dients|المكونات)\s*[:;：\-\.\s|]?\s*/gim, ', ');

  // 2. Remove "May Contain" / "Peut Contenir" sections if trailing, but preserve them as separate items
  text = text.replace(/\[\+\/\-\s*(?:may contain|peut contenir)?:?\s*([^\]]+)\]/gi, ', $1, ');

  // 3. Protect nested commas inside parentheses (e.g., "Water (Aqua, Eau)")
  const parensRegex = /\(([^)]+)\)/g;
  text = text.replace(parensRegex, (match, inner) => {
    return '(' + inner.replace(/,/g, '§COMMA§') + ')';
  });

  // 4. Normalize delimiters:
  // Convert periods followed by space, newline, or capital letter to commas (essential for European labels like Avene/LRP)
  text = text.replace(/\.[\s\n\r]+(?=[A-Z\u0600-\u06FF0-9])/g, ', ');
  text = text.replace(/\.[\s]*$/gm, ', ');
  // Convert bullets, linebreaks, pipes, and semicolons to commas
  text = text.replace(/[\n\r\t•·*|▪▫✦✧;]+/g, ', ');

  // 5. Split by comma
  const rawTokens = text.split(',');

  const results = [];
  const seen = new Set();

  for (let token of rawTokens) {
    // Restore sentinel
    token = token.replace(/§COMMA§/g, ',');
    let raw = token.trim();

    // Clean leading and trailing punctuation, quotes, brackets, and stray pipes
    raw = raw.replace(/^[\s.:\-–—•·*|'"`()]+|[\s.:\-–—•·*|'"`()]+$/g, '');

    if (!raw || raw.length < 2) continue;

    // Check for concentration hint (e.g. "10%", "2.5%", "0.5%")
    let concentrationHint = null;
    const concMatch = raw.match(/(\d+(?:\.\d+)?\s*%)/);
    if (concMatch) {
      concentrationHint = concMatch[1];
    }

    // Generate clean INCI name: strip percentage, strip parenthesis details if just water synonyms
    let clean = raw.replace(/\d+(?:\.\d+)?\s*%/g, '').trim();

    // Strip common filler words
    clean = clean.replace(/^(?:and|contains|with)\s+/i, '');
    clean = clean.replace(/\s+(?:from organic farming|certified organic|organic)\b/gi, '');

    // Skip section titles or generic words that leaked through
    const normalizedKey = clean.toLowerCase();
    if (['ingredients', 'ingredient', 'composition', 'inci'].includes(normalizedKey)) continue;

    // Deduplicate
    if (!seen.has(normalizedKey) && normalizedKey.length >= 2) {
      seen.add(normalizedKey);
      results.push({
        rawName: raw,
        cleanName: clean,
        concentrationHint,
      });
    }
  }

  return results;
}

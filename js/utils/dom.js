/**
 * FormulaLens AI — Safe DOM Utilities
 * All untrusted content must go through these functions.
 * NEVER use innerHTML with untrusted strings.
 */

/**
 * Create an element with attributes and children
 * Children can be: string (text node), Element, or null/undefined (skipped)
 */
export function el(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (value === null || value === undefined) continue;

    if (key === 'class' || key === 'className') {
      element.className = value;
    } else if (key === 'textContent') {
      element.textContent = value;
    } else if (key === 'innerHTML') {
      element.innerHTML = value;
    } else if (key === 'id') {
      element.id = value;
    } else if (key === 'dataset') {
      for (const [dk, dv] of Object.entries(value)) {
        element.dataset[dk] = dv;
      }
    } else if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key === 'style' && typeof value === 'string') {
      element.style.cssText = value;
    } else if (typeof value === 'boolean') {
      if (value) element.setAttribute(key, '');
      else element.removeAttribute(key);
    } else {
      element.setAttribute(key, String(value));
    }
  }

  appendChildren(element, children);
  return element;
}

export const createElement = el;

/**
 * Safely set text content (prevents XSS)
 */
export function setText(element, text) {
  element.textContent = text ?? '';
}

/**
 * Safely append children to an element
 */
export function appendChildren(parent, children) {
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined) continue;
    if (child instanceof Node) {
      parent.appendChild(child);
    } else {
      parent.appendChild(document.createTextNode(String(child)));
    }
  }
}

/**
 * Clear all children of an element
 */
export function clearChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Replace content of an element with new children
 */
export function replaceChildren(element, ...children) {
  clearChildren(element);
  appendChildren(element, children.flat(Infinity));
}

/**
 * Safely create an SVG icon from a predefined library
 * Only allows whitelisted icon names — prevents injection
 */
export function icon(name, attrs = {}) {
  const paths = ICON_PATHS[name];
  if (!paths) {
    console.warn('[DOM] Unknown icon:', name);
    return document.createTextNode('');
  }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.75');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');

  const widthVal = attrs.size || attrs.width || 20;
  const heightVal = attrs.size || attrs.height || 20;
  svg.setAttribute('width', String(widthVal));
  svg.setAttribute('height', String(heightVal));

  if (attrs.class) svg.setAttribute('class', attrs.class);

  // Add paths safely using DOM APIs
  if (typeof paths === 'string') {
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', paths);
    svg.appendChild(pathEl);
  } else if (Array.isArray(paths)) {
    for (const pathData of paths) {
      if (typeof pathData === 'string') {
        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathEl.setAttribute('d', pathData);
        svg.appendChild(pathEl);
      } else if (pathData && typeof pathData === 'object') {
        const tag = pathData.tag || 'path';
        const svgEl = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (const [k, v] of Object.entries(pathData)) {
          if (k !== 'tag') svgEl.setAttribute(k, String(v));
        }
        svg.appendChild(svgEl);
      }
    }
  }

  return svg;
}

/**
 * Render SVG icon as an HTML string
 */
export function renderIcon(name, size = 20, className = '') {
  const svg = icon(name, { size, class: className });
  if (svg instanceof Element) {
    return svg.outerHTML;
  }
  return '';
}

/**
 * Create a text node (explicit helper for clarity)
 */
export function text(str) {
  return document.createTextNode(str ?? '');
}

/**
 * Show/hide an element using 'hidden' class
 */
export function show(element) {
  element?.classList.remove('hidden');
}

export function hide(element) {
  element?.classList.add('hidden');
}

export function toggle(element, visible) {
  if (visible) show(element);
  else hide(element);
}

/**
 * Animate element entrance
 */
export function animateIn(element, animClass = 'animate-fade-in-up') {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    element.classList.add(animClass);
  }
}

/**
 * Format a date for display
 */
export function formatDate(dateStr, lang = 'en') {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Format a number with locale
 */
export function formatNumber(n, lang = 'en') {
  try {
    return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US').format(n);
  } catch {
    return String(n);
  }
}

/**
 * Announce a message to screen readers via the live region
 */
export function announce(message, priority = 'polite') {
  const region = document.getElementById('live-region');
  if (!region) return;
  region.setAttribute('aria-live', priority);
  setText(region, '');
  // Small delay to ensure the clear is registered
  setTimeout(() => setText(region, message), 50);
}

/**
 * Focus trap for modals
 * Returns a cleanup function
 */
export function trapFocus(container) {
  const focusable = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  function handleKeyDown(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }

  container.addEventListener('keydown', handleKeyDown);
  first?.focus();

  return () => container.removeEventListener('keydown', handleKeyDown);
}

// ──────────────────────────────────────────────────────────
// ICON LIBRARY (whitelist of safe SVG path data)
// Only whitelisted icons are rendered — no user-supplied paths
// ──────────────────────────────────────────────────────────
const ICON_PATHS = {
  // Navigation
  'sparkles':       'M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z',
  'scan':           'M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2 M7 12h10',
  'user':           'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
  'alert':          'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4M12 17h.01',
  'close':          'M18 6L6 18M6 6l12 12',
  'home':           'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
  'flask':          [
    'M9 3h6m-6 0v6l-4 9a1 1 0 00.9 1.45h12.2A1 1 0 0019 18L15 9V3',
    { tag: 'path', d: 'M6.8 15h10.4' },
  ],
  'library':        [
    'M3 21V7l9-4 9 4v14',
    'M3 7l9 4 9-4',
    'M9 21V11',
    'M15 21V11',
  ],
  'compare':        'M18 4v16M6 4v16M2 8h4M14 8h8M2 16h4M14 16h8',
  'bookmark':       'M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z',
  'history':        [
    'M3 3v5h5',
    'M3.05 13A9 9 0 106 5.3L3 8',
    'M12 7v5l3 3',
  ],
  'settings':       'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 0022 17.4v1.2a1.65 1.65 0 01-1.12 1.56 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 0015 15.4v-1.2a1.65 1.65 0 00-1.56-1.12 1.65 1.65 0 01-.33-1.82l-.06-.06a2 2 0 01-2.83 2.83l-.06.06A1.65 1.65 0 006.6 15H5.4a1.65 1.65 0 00-1.56 1.12 1.65 1.65 0 01-1.82.33l-.06-.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 000 8.6V7.4A1.65 1.65 0 001.12 5.84a1.65 1.65 0 00.33-1.82L1.39 4a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 006.6 1.5h1.2',

  // Analysis
  'search':         'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  'camera':         'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8z',
  'upload':         'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12',
  'edit':           'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  'check':          'M20 6L9 17l-5-5',
  'check-circle':   'M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3',
  'x':              'M18 6L6 18M6 6l12 12',
  'x-circle':       'M10 10l4 4m0-4l-4 4M12 2a10 10 0 100 20A10 10 0 0012 2z',
  'alert-triangle': 'M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4M12 17h.01',
  'info':           'M12 2a10 10 0 100 20A10 10 0 0012 2z M12 16v-4M12 8h.01',
  'loader':         'M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',

  // UI
  'chevron-right':  'M9 18l6-6-6-6',
  'chevron-left':   'M15 18l-6-6 6-6',
  'chevron-down':   'M6 9l6 6 6-6',
  'chevron-up':     'M18 15l-6-6-6 6',
  'menu':           'M3 12h18M3 6h18M3 18h18',
  'sidebar':        [
    { tag: 'rect', x:'3', y:'3', width:'18', height:'18', rx:'2', ry:'2' },
    'M9 3v18',
  ],
  'sun':            'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42 M12 17a5 5 0 100-10 5 5 0 000 10z',
  'moon':           'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
  'globe':          'M12 2a10 10 0 100 20A10 10 0 0012 2z M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
  'key':            'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
  'eye':            'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12a3 3 0 100-6 3 3 0 000 6z',
  'eye-off':        'M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22',
  'trash':          'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  'download':       'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3',
  'save':           'M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z M17 21v-8H7v8M7 3v5h8',
  'external-link':  'M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3',
  'copy':           'M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2z M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1',
  'refresh':        'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15',
  'plus':           'M12 5v14M5 12h14',
  'minus':          'M5 12h14',
  'filter':         'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  'sort':           'M3 6h18M7 12h10M11 18h2',
  'star':           'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'share':          'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13',
  'zap':            'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  'shield':         'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  'database':       [
    { tag: 'ellipse', cx:'12', cy:'5', rx:'9', ry:'3' },
    'M21 12c0 1.66-4 3-9 3s-9-1.34-9-3',
    'M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5',
  ],
  'package':        [
    'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
    'M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12',
  ],
  'wifi-off':       'M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01',
  'wifi':           'M1.42 9a16 16 0 0121.16 0M5 12.55a11 11 0 0114.08 0M8.53 16.11a6 6 0 016.95 0M12 20h.01',
  'arrow-right':    'M5 12h14M12 5l7 7-7 7',
  'arrow-left':     'M19 12H5M12 19l-7-7 7-7',
  'more-vertical':  'M12 5h.01M12 12h.01M12 19h.01',
  'layout':         [
    { tag: 'rect', x:'3', y:'3', width:'18', height:'18', rx:'2', ry:'2' },
    'M3 9h18M9 21V9',
  ],
  'layers':         'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  'box':            [
    'M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z',
  ],
  'link':           'M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71',
  'clock':          'M12 2a10 10 0 100 20A10 10 0 0012 2z M12 6v6l4 2',
};

export { ICON_PATHS };

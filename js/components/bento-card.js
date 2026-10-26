/**
 * FormulaLens AI — Bento Card Component
 * Renders consistent, accessible, interactive Bento Grid cards
 */

import { createElement, renderIcon } from '../utils/dom.js';

/**
 * Create a Bento Grid Card
 * @param {Object} options
 * @param {string} options.id - Card DOM id
 * @param {string} options.title - Card title
 * @param {string} options.subtitle - Card subtitle
 * @param {string} options.icon - Icon name from dom.js
 * @param {string} options.colSpan - '1' | '2' | '3' | 'full'
 * @param {string} options.rowSpan - '1' | '2'
 * @param {string} options.badge - Badge text
 * @param {string} options.badgeType - 'emerald' | 'mint' | 'amber' | 'rose' | 'neutral'
 * @param {HTMLElement|string|Array} options.content - Card content
 * @param {HTMLElement|Array} options.actions - Header action elements
 * @param {boolean} options.interactive - Adds hover/focus states
 * @param {Function} options.onClick - Click handler
 * @returns {HTMLElement} Bento card element
 */
export function createBentoCard({
  id = null,
  title = '',
  subtitle = '',
  icon = null,
  colSpan = '1',
  rowSpan = '1',
  badge = null,
  badgeType = 'mint',
  content = null,
  actions = null,
  interactive = false,
  onClick = null,
  className = '',
} = {}) {
  const classes = ['bento-card'];
  if (colSpan === '2') classes.push('bento-col-2');
  if (colSpan === '3') classes.push('bento-col-3');
  if (colSpan === 'full') classes.push('bento-col-full');
  if (rowSpan === '2') classes.push('bento-row-2');
  if (interactive) classes.push('bento-interactive');
  if (className) classes.push(className);

  const card = createElement('div', {
    id,
    className: classes.join(' '),
    tabIndex: interactive ? '0' : undefined,
    role: interactive ? 'button' : undefined,
  });

  if (interactive && onClick) {
    card.addEventListener('click', onClick);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(e);
      }
    });
  }

  // Header
  if (title || icon || badge || actions) {
    const header = createElement('div', { className: 'bento-card-header' });

    const titleGroup = createElement('div', { className: 'bento-card-title-group' });

    if (icon) {
      const iconWrap = createElement('div', { className: 'bento-card-icon' });
      iconWrap.innerHTML = renderIcon(icon, 20);
      titleGroup.appendChild(iconWrap);
    }

    const textWrap = createElement('div', { className: 'bento-card-text' });
    if (title) {
      const titleEl = createElement('h3', { className: 'bento-card-title', textContent: title });
      textWrap.appendChild(titleEl);
    }
    if (subtitle) {
      const subEl = createElement('p', { className: 'bento-card-subtitle', textContent: subtitle });
      textWrap.appendChild(subEl);
    }
    titleGroup.appendChild(textWrap);
    header.appendChild(titleGroup);

    // Right-side actions or badge
    const rightSide = createElement('div', { className: 'bento-card-actions' });
    if (badge) {
      const badgeEl = createElement('span', {
        className: `badge badge-${badgeType}`,
        textContent: badge,
      });
      rightSide.appendChild(badgeEl);
    }

    if (actions) {
      if (Array.isArray(actions)) {
        actions.forEach(a => rightSide.appendChild(a));
      } else {
        rightSide.appendChild(actions);
      }
    }

    header.appendChild(rightSide);
    card.appendChild(header);
  }

  // Body content
  const body = createElement('div', { className: 'bento-card-body' });
  if (content) {
    if (typeof content === 'string') {
      body.innerHTML = content;
    } else if (Array.isArray(content)) {
      content.forEach(c => {
        if (typeof c === 'string') {
          const p = createElement('div', { innerHTML: c });
          body.appendChild(p);
        } else if (c instanceof HTMLElement) {
          body.appendChild(c);
        }
      });
    } else if (content instanceof HTMLElement) {
      body.appendChild(content);
    }
  }
  card.appendChild(body);

  return card;
}

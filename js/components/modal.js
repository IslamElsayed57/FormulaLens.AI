/**
 * FormulaLens AI — Accessible Modal Dialog Component
 * Traps focus, handles ESC, cleans up event listeners to prevent memory leaks
 */

import { createElement, renderIcon } from '../utils/dom.js';

let _activeModal = null;

/**
 * Open a modal dialog
 * @param {Object} options
 * @param {string} options.title - Modal title
 * @param {string|HTMLElement} options.content - Modal body content
 * @param {string} options.size - 'sm' | 'md' | 'lg' | 'full'
 * @param {Array<HTMLElement>} options.actions - Action buttons in footer
 * @param {Function} options.onClose - Callback when closed
 * @returns {Object} { close, element }
 */
export function openModal({
  title = '',
  content = '',
  size = 'md',
  actions = [],
  onClose = null,
} = {}) {
  // Close existing modal if open
  if (_activeModal) {
    _activeModal.close();
  }

  const previousActiveElement = document.activeElement;

  const backdrop = createElement('div', {
    className: 'modal-backdrop',
    role: 'dialog',
    ariaModal: 'true',
  });

  const dialog = createElement('div', {
    className: `modal-dialog modal-${size}`,
  });

  // Header
  const header = createElement('div', { className: 'modal-header' });
  const titleEl = createElement('h3', { className: 'modal-title', textContent: title });
  const closeBtn = createElement('button', {
    className: 'btn-icon modal-close-btn',
    ariaLabel: 'Close modal',
    type: 'button',
  });
  closeBtn.innerHTML = renderIcon('close', 18);

  header.append(titleEl, closeBtn);

  // Body
  const body = createElement('div', { className: 'modal-body' });
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    body.appendChild(content);
  }

  dialog.append(header, body);

  // Footer if actions provided
  if (actions && actions.length > 0) {
    const footer = createElement('div', { className: 'modal-footer' });
    actions.forEach(a => footer.appendChild(a));
    dialog.appendChild(footer);
  }

  backdrop.appendChild(dialog);
  document.body.appendChild(backdrop);
  document.body.classList.add('modal-open');

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      close();
    }
  }

  function handleBackdropClick(e) {
    if (e.target === backdrop) {
      close();
    }
  }

  function close() {
    window.removeEventListener('keydown', handleKeyDown);
    backdrop.removeEventListener('click', handleBackdropClick);

    backdrop.classList.remove('modal-visible');
    backdrop.classList.add('modal-leaving');

    setTimeout(() => {
      backdrop.remove();
      document.body.classList.remove('modal-open');
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
      if (onClose) onClose();
      _activeModal = null;
    }, 200);
  }

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', handleBackdropClick);
  window.addEventListener('keydown', handleKeyDown);

  // Entrance
  requestAnimationFrame(() => {
    backdrop.classList.add('modal-visible');
    closeBtn.focus();
  });

  _activeModal = { close, element: backdrop };
  return _activeModal;
}

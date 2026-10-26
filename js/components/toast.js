/**
 * FormulaLens AI — Toast Notification System
 * Non-intrusive, accessible notifications with auto-dismiss and action hooks
 */

import { createElement, renderIcon } from '../utils/dom.js';

let _toastContainer = null;

function getToastContainer() {
  if (!_toastContainer) {
    _toastContainer = document.getElementById('toast-container');
    if (!_toastContainer) {
      _toastContainer = createElement('div', {
        id: 'toast-container',
        className: 'toast-container',
        role: 'region',
        ariaLive: 'polite',
      });
      document.body.appendChild(_toastContainer);
    }
  }
  return _toastContainer;
}

/**
 * Show a toast notification
 * @param {string} message - Notification text
 * @param {Object} options - { type: 'success'|'error'|'warning'|'info', duration: 4000, actionLabel, onAction }
 */
export function showToast(message, options = {}) {
  const {
    type = 'info',
    duration = 4500,
    actionLabel = null,
    onAction = null,
  } = options;

  const container = getToastContainer();

  const iconMap = {
    success: 'check',
    error: 'alert',
    warning: 'alert',
    info: 'sparkles',
  };

  const toast = createElement('div', {
    className: `toast toast-${type}`,
    role: 'alert',
  });

  const iconBox = createElement('div', { className: 'toast-icon' });
  iconBox.innerHTML = renderIcon(iconMap[type] || 'sparkles', 18);

  const msgBox = createElement('div', {
    className: 'toast-message',
    textContent: message,
  });

  toast.append(iconBox, msgBox);

  if (actionLabel && onAction) {
    const actionBtn = createElement('button', {
      className: 'toast-action-btn btn btn-sm btn-ghost',
      textContent: actionLabel,
      type: 'button',
    });
    actionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      onAction();
      dismissToast(toast);
    });
    toast.appendChild(actionBtn);
  }

  const closeBtn = createElement('button', {
    className: 'toast-close-btn',
    ariaLabel: 'Close',
    type: 'button',
  });
  closeBtn.innerHTML = renderIcon('close', 14);
  closeBtn.addEventListener('click', () => dismissToast(toast));
  toast.appendChild(closeBtn);

  container.appendChild(toast);

  // Trigger entrance animation
  requestAnimationFrame(() => {
    toast.classList.add('toast-visible');
  });

  if (duration > 0) {
    const timer = setTimeout(() => {
      dismissToast(toast);
    }, duration);

    toast.addEventListener('mouseenter', () => clearTimeout(timer));
  }

  return toast;
}

function dismissToast(toast) {
  toast.classList.remove('toast-visible');
  toast.classList.add('toast-leaving');
  setTimeout(() => {
    toast.remove();
  }, 250);
}

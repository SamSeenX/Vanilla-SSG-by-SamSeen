import { ThemeManager } from './core/theme-manager.js';

function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('site-nav');
  if (!menuBtn || !nav) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = nav.classList.toggle('is-open');
    menuBtn.classList.toggle('is-active', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open') && !nav.contains(e.target) && !menuBtn.contains(e.target)) {
      nav.classList.remove('is-open');
      menuBtn.classList.remove('is-active');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

function initCopyButtons() {
  const copyBtn = document.getElementById('copy-cmd-btn');
  const codeEl = document.getElementById('copy-cmd-text');
  if (!copyBtn || !codeEl) return;

  copyBtn.addEventListener('click', async () => {
    const text = codeEl.innerText.trim();
    try {
      await navigator.clipboard.writeText(text);
      const originalText = copyBtn.innerText;
      copyBtn.innerText = 'Copied!';
      copyBtn.style.color = '#38bdf8';
      setTimeout(() => {
        copyBtn.innerText = originalText;
        copyBtn.style.color = '';
      }, 2000);
    } catch {
      // Fallback
      copyBtn.innerText = 'Copied!';
      setTimeout(() => { copyBtn.innerText = 'Copy'; }, 2000);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    ThemeManager.init(themeToggleBtn);
  }
  initMobileMenu();
  initCopyButtons();
});

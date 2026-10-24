/**
 * Zero-CLS Theme Manager
 * Toggles data-theme attribute on documentElement with LocalStorage sync.
 */
export class ThemeManager {
  constructor() {
    this.storageKey = 'vanilla_app_theme';
    this.theme = 'light';
  }

  init() {
    const savedTheme = localStorage.getItem(this.storageKey);
    this.theme = savedTheme || 'light';
    this.applyTheme(this.theme);
    this.setupListeners();
  }

  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.storageKey, theme);
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      toggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  toggle() {
    const nextTheme = this.theme === 'dark' ? 'light' : 'dark';
    this.applyTheme(nextTheme);
  }

  setupListeners() {
    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }
  }
}

export const themeManager = new ThemeManager();
export default themeManager;

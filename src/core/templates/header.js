/**
 * Header Sub-Template
 * Renders the top landmark container, brand logo, navigation links, and theme toggle.
 */

import { getNavHtml } from './nav.js';

export function getHeaderHtml(currentPath = '/') {
  const navHtml = getNavHtml(currentPath);

  return `<header class="site-header">
  <div class="header-container">
    <a href="/" class="brand-logo" aria-label="Home">
      <span class="logo-icon">⚡</span>
      <span class="logo-text">VanillaSSG</span>
    </a>
    ${navHtml}
    <div class="header-actions">
      <button id="theme-toggle-btn" class="theme-toggle" aria-label="Toggle theme">🌙</button>
    </div>
  </div>
</header>`;
}

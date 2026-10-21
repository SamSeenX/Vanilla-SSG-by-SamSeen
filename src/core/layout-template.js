/**
 * Core Layout Template Engine
 * Generates semantic header, footer, and complete OpenGraph/SEO metadata.
 */

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Items', href: '/items/item-one.html' },
  { label: 'About', href: '/about.html' },
  { label: 'Contact', href: '/contact.html' }
];

const SITE_URL = 'https://your-domain.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export function getSeoMetaHtml({
  title = 'VanillaSSG: High Performance Static Site Architecture',
  description = 'Production-ready Vanilla JavaScript + Vite static site generator template.',
  path = '/',
  image = DEFAULT_OG_IMAGE,
  type = 'website'
} = {}) {
  const fullUrl = `${SITE_URL}${path}`;
  return `  <link rel="canonical" href="${fullUrl}">
  <meta property="og:site_name" content="VanillaSSG">
  <meta property="og:type" content="${type}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${fullUrl}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">`;
}

export function getHeaderHtml(currentPath = '/') {
  const navLinks = NAV_ITEMS.map((item) => {
    const isActive = (item.href === '/' && (currentPath === '/' || currentPath === '/index.html')) ||
      (item.href !== '/' && currentPath.includes(item.href));
    const activeClass = isActive ? ' class="nav-link active" aria-current="page"' : ' class="nav-link"';
    return `<li><a href="${item.href}"${activeClass}>${item.label}</a></li>`;
  }).join('\n        ');

  return `<header class="site-header">
  <div class="header-container">
    <a href="/" class="brand-logo" aria-label="Home">
      <span class="logo-icon">⚡</span>
      <span class="logo-text">VanillaSSG</span>
    </a>
    <nav class="site-nav" aria-label="Main Navigation">
      <ul class="nav-list">
        ${navLinks}
      </ul>
    </nav>
    <div class="header-actions">
      <button id="theme-toggle-btn" class="theme-toggle" aria-label="Toggle theme">🌙</button>
    </div>
  </div>
</header>`;
}

export function getFooterHtml() {
  const currentYear = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="footer-container">
    <div class="footer-brand">
      <div class="footer-logo">⚡ VanillaSSG</div>
      <p class="footer-tagline">High performance, zero-hydration static site architecture.</p>
    </div>
    <nav class="footer-nav" aria-label="Footer Navigation">
      <div class="footer-col">
        <h4>Navigation</h4>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/items/item-one.html">Collection Demo</a></li>
          <li><a href="/about.html">About</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Trust & Legal</h4>
        <ul>
          <li><a href="/privacy.html">Privacy Policy</a></li>
          <li><a href="/terms.html">Terms of Service</a></li>
          <li><a href="/contact.html">Contact Us</a></li>
        </ul>
      </div>
    </nav>
  </div>
  <div class="footer-bottom">
    <p>&copy; ${currentYear} VanillaSSG Starter. Built for speed, search engines, and developer sanity.</p>
  </div>
</footer>`;
}

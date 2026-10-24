/**
 * Footer Sub-Template
 * Renders the site footer, brand statement, navigation columns, and legal copyright.
 */

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
          <li><a href="/items/">Collection Demo</a></li>
          <li><a href="/about.html">About</a></li>
          <li><a href="/changelog.html">Changelog</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Trust & Legal</h4>
        <ul>
          <li><a href="/privacy.html">Privacy Policy</a></li>
          <li><a href="/terms.html">Terms of Service</a></li>
          <li><a href="https://github.com/SamSeenX/Vanilla-SSG-by-SamSeen/issues" target="_blank" rel="noopener noreferrer">Contact Us ↗</a></li>
        </ul>
      </div>
    </nav>
  </div>
  <div class="footer-bottom">
    <p>&copy; ${currentYear} VanillaSSG Starter. Built for speed, search engines, and developer sanity.</p>
  </div>
</footer>`;
}

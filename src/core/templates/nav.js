/**
 * Navigation Sub-Template
 * Manages navigation items, active link states, and accessible nav list markup.
 */

export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Items', href: '/items/' },
  { label: 'About', href: '/about.html' },
  { label: 'Contact', href: '/contact.html' }
];

export function getNavHtml(currentPath = '/') {
  const navLinks = NAV_ITEMS.map((item) => {
    const isRoot = item.href === '/';
    const isActive = isRoot
      ? (currentPath === '/' || currentPath === '/index.html')
      : currentPath.startsWith(item.href);
    const activeClass = isActive ? ' class="nav-link active" aria-current="page"' : ' class="nav-link"';
    return `<li><a href="${item.href}"${activeClass}>${item.label}</a></li>`;
  }).join('\n        ');

  return `<nav class="site-nav" aria-label="Main Navigation">
      <ul class="nav-list">
        ${navLinks}
      </ul>
    </nav>`;
}

/**
 * Automated XML Sitemap Generator
 * Extracts real filesystem modification timestamps (mtime) and builds clean canonical URLs,
 * strictly excluding error pages and prioritizing directory-based routes.
 */
import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { SITE_URL } from './site-config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const PUBLIC_DIR = resolve(ROOT_DIR, 'public');
const SITEMAP_PATH = resolve(PUBLIC_DIR, 'sitemap.xml');
const BASE_URL = SITE_URL;

function findHtmlPages() {
  const pages = [];
  const rootFiles = fs.readdirSync(ROOT_DIR);

  // Scan root pages
  rootFiles.forEach(file => {
    if (!file.endsWith('.html')) return;
    // Strictly exclude 404 error page from sitemap
    if (file === '404.html') return;

    const filePath = resolve(ROOT_DIR, file);
    const stat = fs.statSync(filePath);
    const mtimeIso = stat.mtime.toISOString().split('T')[0];

    let urlPath = file === 'index.html' ? '/' : `/${file}`;
    let priority = '0.8';
    let changefreq = 'weekly';

    if (urlPath === '/') {
      priority = '1.0';
      changefreq = 'daily';
    } else if (file === 'privacy.html' || file === 'terms.html') {
      priority = '0.3';
      changefreq = 'monthly';
    }

    pages.push({ loc: `${BASE_URL}${urlPath}`, lastmod: mtimeIso, changefreq, priority });
  });

  // Scan items directory for collection index and pretty item routes
  const itemsDir = resolve(ROOT_DIR, 'items');
  if (fs.existsSync(itemsDir)) {
    // Collection index
    const indexPath = resolve(itemsDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      const stat = fs.statSync(indexPath);
      pages.push({
        loc: `${BASE_URL}/items/`,
        lastmod: stat.mtime.toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.9'
      });
    }

    // Subdirectories (pretty URLs: /items/<slug>/)
    const entries = fs.readdirSync(itemsDir, { withFileTypes: true });
    entries.forEach(entry => {
      if (entry.isDirectory()) {
        const itemFile = resolve(itemsDir, entry.name, 'index.html');
        if (fs.existsSync(itemFile)) {
          const stat = fs.statSync(itemFile);
          pages.push({
            loc: `${BASE_URL}/items/${entry.name}/`,
            lastmod: stat.mtime.toISOString().split('T')[0],
            changefreq: 'weekly',
            priority: '0.8'
          });
        }
      }
    });
  }

  return pages;
}

export function generateSitemap() {
  const pages = findHtmlPages();
  const xmlEntries = pages.map((p) => `  <url>
    <loc>${p.loc}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n');

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>
`;

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  fs.writeFileSync(SITEMAP_PATH, xmlContent, 'utf8');
  console.log(`[Sitemap Generator] Generated clean canonical sitemap.xml with ${pages.length} URLs.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSitemap();
}

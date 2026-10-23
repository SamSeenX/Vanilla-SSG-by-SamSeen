/**
 * Automated XML Sitemap Generator
 * Extracts real filesystem modification timestamps (mtime) and builds valid sitemap.xml.
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

const SCAN_DIRS = ['', 'items'];

function findHtmlPages() {
  const pages = [];

  SCAN_DIRS.forEach((dir) => {
    const fullDir = resolve(ROOT_DIR, dir);
    if (!fs.existsSync(fullDir)) return;

    const files = fs.readdirSync(fullDir);
    files.forEach((file) => {
      if (!file.endsWith('.html')) return;

      const filePath = resolve(fullDir, file);
      const stat = fs.statSync(filePath);
      const mtimeIso = stat.mtime.toISOString().split('T')[0];

      let urlPath = dir ? `/${dir}/${file}` : (file === 'index.html' ? '/' : `/${file}`);
      let priority = '0.8';
      let changefreq = 'weekly';

      if (urlPath === '/') {
        priority = '1.0';
        changefreq = 'daily';
      } else if (file === 'privacy.html' || file === 'terms.html') {
        priority = '0.3';
        changefreq = 'monthly';
      } else if (file === 'index.html' && dir === 'items') {
        priority = '0.9';
        changefreq = 'weekly';
      }

      pages.push({
        loc: `${BASE_URL}${urlPath}`,
        lastmod: mtimeIso,
        changefreq,
        priority
      });
    });
  });

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
  console.log(`[Sitemap Generator] Generated sitemap.xml with ${pages.length} URLs using file mtime.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSitemap();
}

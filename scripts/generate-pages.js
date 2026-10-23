/**
 * Static Page & Collection Generator
 * Ingests content files from content/items/ and builds detail pages plus items/index.html.
 */
import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  getHeaderHtml,
  getFooterHtml,
  getSeoMetaHtml,
  getArticleSchema,
  getBreadcrumbSchema,
  renderSchemaTag
} from '../src/core/layout-template.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const CONTENT_DIR = resolve(ROOT_DIR, 'content', 'items');
const ITEMS_DIR = resolve(ROOT_DIR, 'items');

function loadItems() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.json'));
  return files.map(file => {
    const raw = fs.readFileSync(resolve(CONTENT_DIR, file), 'utf8');
    return JSON.parse(raw);
  });
}

function generateItemPage(item) {
  const currentPath = `/items/${item.id}.html`;
  const headerHtml = getHeaderHtml(currentPath);
  const footerHtml = getFooterHtml();
  const seoMetaHtml = getSeoMetaHtml({
    title: `${item.title} | VanillaSSG`,
    description: item.description,
    path: currentPath,
    type: 'article'
  });

  const articleSchema = getArticleSchema({
    title: item.title,
    description: item.description,
    publishedDate: item.publishedDate,
    path: currentPath
  });

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Items', url: '/items/' },
    { name: item.title, url: currentPath }
  ]);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${item.title} | VanillaSSG</title>
  <meta name="description" content="${item.description}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="stylesheet" href="/src/styles/main.css">
${seoMetaHtml}
  ${renderSchemaTag(articleSchema)}
  ${renderSchemaTag(breadcrumbsSchema)}
</head>
<body>
  ${headerHtml}
  <main class="container">
    <article class="page-header">
      <span class="badge" style="color: var(--accent); font-weight: 600; text-transform: uppercase; font-size: 0.85rem;">${item.category}</span>
      <h1>${item.title}</h1>
      <p style="color: var(--text-secondary);">${item.tagline}</p>
    </article>
    <div class="prose">
      <p>${item.description}</p>
      <p>This static page was generated automatically during the build step using a lightweight Node script. Search engine crawlers can index every word instantly without needing a JavaScript execution engine.</p>
      <p><a href="/items/" class="btn btn-secondary">&larr; Back to Collection</a></p>
    </div>
  </main>
  ${footerHtml}
  <script type="module" src="/src/main.js"></script>
</body>
</html>`;
}

function generateArchivePage(items) {
  const currentPath = '/items/';
  const headerHtml = getHeaderHtml(currentPath);
  const footerHtml = getFooterHtml();
  const seoMetaHtml = getSeoMetaHtml({
    title: 'Items Collection & Architecture Guides | VanillaSSG',
    description: 'Explore the full collection of static site architecture guides, SEO techniques, and best practices.',
    path: currentPath,
    type: 'website'
  });

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Items', url: currentPath }
  ]);

  const cardsHtml = items.map(item => `      <div class="card">
        <span class="badge" style="color: var(--accent); font-weight: 600; font-size: 0.8rem;">${item.category}</span>
        <h3 style="margin-top: 0.5rem;"><a href="/items/${item.id}.html">${item.title}</a></h3>
        <p>${item.tagline}</p>
        <a href="/items/${item.id}.html" class="btn btn-secondary" style="margin-top: 1rem; display: inline-block;">Read Guide &rarr;</a>
      </div>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Items Collection & Architecture Guides | VanillaSSG</title>
  <meta name="description" content="Explore the full collection of static site architecture guides, SEO techniques, and best practices.">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="stylesheet" href="/src/styles/main.css">
${seoMetaHtml}
  ${renderSchemaTag(breadcrumbsSchema)}
</head>
<body>
  ${headerHtml}
  <main class="container">
    <header class="page-header">
      <h1>Items Collection</h1>
      <p style="color: var(--text-secondary);">Browse pre-rendered architectural guides and high-performance vanilla patterns.</p>
    </header>
    <div class="features-grid">
${cardsHtml}
    </div>
  </main>
  ${footerHtml}
  <script type="module" src="/src/main.js"></script>
</body>
</html>`;
}

export function generatePages() {
  if (!fs.existsSync(ITEMS_DIR)) {
    fs.mkdirSync(ITEMS_DIR, { recursive: true });
  }

  const items = loadItems();
  items.forEach(item => {
    const filePath = resolve(ITEMS_DIR, `${item.id}.html`);
    fs.writeFileSync(filePath, generateItemPage(item), 'utf8');
  });

  const archivePath = resolve(ITEMS_DIR, 'index.html');
  fs.writeFileSync(archivePath, generateArchivePage(items), 'utf8');

  console.log(`[Pages Generator] Built ${items.length} item pages and items/index.html.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generatePages();
}

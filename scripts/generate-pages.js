import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getHeaderHtml, getFooterHtml, getSeoMetaHtml } from '../src/core/layout-template.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const ITEMS_DIR = resolve(ROOT_DIR, 'items');

const SAMPLE_ITEMS = [
  {
    id: 'item-one',
    title: 'Zero Hydration Architecture',
    tagline: 'Why shipping pure HTML beats waiting for mega-bundles to hydrate.',
    description: 'Learn how pre-rendering dynamic data at build time eliminates Cumulative Layout Shifts and delivers 100/100 Lighthouse performance metrics.',
    category: 'Architecture',
    publishedDate: '2026-01-15'
  },
  {
    id: 'item-two',
    title: 'Google AdSense & SEO Optimization',
    tagline: 'Guarantee crawler indexing and eliminate ad container layout shifts.',
    description: 'A deep dive into static HTML crawling benefits, semantic landmark tags, and explicit dimensions to safeguard your AdSense revenue and Core Web Vitals.',
    category: 'Monetization & SEO',
    publishedDate: '2026-02-10'
  },
  {
    id: 'item-three',
    title: 'The Sub-200-Line Codebase Rule',
    tagline: 'Modular simplicity that keeps your codebase clean and AI-friendly.',
    description: 'Why strict file size limits prevent spaghetti dependencies and maintain effortless refactoring throughout the entire software lifecycle.',
    category: 'Best Practices',
    publishedDate: '2026-03-01'
  }
];

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
  const schemaJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': item.title,
    'description': item.description,
    'datePublished': item.publishedDate,
    'author': {
      '@type': 'Organization',
      'name': 'VanillaSSG Community'
    }
  }, null, 2);

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
  <script type="application/ld+json">
${schemaJson}
  </script>
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
      <p><a href="/" class="btn btn-secondary">&larr; Back to Home</a></p>
    </div>
  </main>
  ${footerHtml}
  <script type="module" src="/src/main.js"></script>
</body>
</html>`;
}

function main() {
  if (!fs.existsSync(ITEMS_DIR)) {
    fs.mkdirSync(ITEMS_DIR, { recursive: true });
  }

  SAMPLE_ITEMS.forEach((item) => {
    const filePath = resolve(ITEMS_DIR, `${item.id}.html`);
    const content = generateItemPage(item);
    fs.writeFileSync(filePath, content, 'utf8');
  });
}

main();

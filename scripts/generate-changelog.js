/**
 * Automated Changelog Page Generator
 * Parses CHANGELOG.md and compiles a static changelog.html page matching the architectural theme.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderMarkdown } from './markdown-parser.js';
import { getHeaderHtml } from '../src/core/templates/header.js';
import { getFooterHtml } from '../src/core/templates/footer.js';
import { getSeoMetaHtml } from '../src/core/templates/seo.js';
import { getWebSiteSchema } from '../src/core/templates/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const CHANGELOG_MD_PATH = path.join(ROOT_DIR, 'CHANGELOG.md');
const OUTPUT_HTML_PATH = path.join(ROOT_DIR, 'changelog.html');

export function generateChangelogPage() {
  if (!fs.existsSync(CHANGELOG_MD_PATH)) {
    console.warn('[Changelog Generator] CHANGELOG.md not found.');
    return;
  }

  const rawMarkdown = fs.readFileSync(CHANGELOG_MD_PATH, 'utf8');
  const compiledContent = renderMarkdown(rawMarkdown);

  const title = 'Release Changelog | VanillaSSG';
  const description = 'Complete version release history and architectural changelog for VanillaSSG.';

  const seoMeta = getSeoMetaHtml({
    title,
    description,
    path: '/changelog.html',
    type: 'article'
  });

  const schemaJson = `  <script type="application/ld+json">
  ${JSON.stringify(getWebSiteSchema(), null, 2)}
  </script>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
${seoMeta}
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="alternate icon" href="/favicon.ico">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <script>(function(){var s=localStorage.getItem('vanilla_app_theme');if(s==='dark'){document.documentElement.setAttribute('data-theme','dark');}})();</script>
  <link rel="stylesheet" href="/src/styles/main.css">
${schemaJson}
</head>
<body>
  ${getHeaderHtml('/changelog.html')}

  <main class="container">
    <div class="page-header">
      <div class="status-pill">
        <span class="status-dot"></span>
        VERSION TRACKER
      </div>
      <h1>Release Changelog</h1>
      <p>Continuous evolution, performance benchmarks, and architectural updates.</p>
    </div>

    <div class="prose changelog-body">
      ${compiledContent}
    </div>
  </main>

  ${getFooterHtml()}
  <script type="module" src="/src/main.js"></script>
</body>
</html>`;

  fs.writeFileSync(OUTPUT_HTML_PATH, html, 'utf8');
  console.log('[Changelog Generator] Successfully generated changelog.html');
}

generateChangelogPage();

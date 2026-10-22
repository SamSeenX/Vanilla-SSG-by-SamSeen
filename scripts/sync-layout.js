import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { getHeaderHtml, getFooterHtml } from '../src/core/layout-template.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const SCAN_DIRS = ['', 'items'];

function syncFile(filePath, urlPath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const header = getHeaderHtml(urlPath);
  const footer = getFooterHtml();

  const headerRegex = /<header class="site-header">[\s\S]*?<\/header>/;
  const footerRegex = /<footer class="site-footer">[\s\S]*?<\/footer>/;

  let updated = content;

  // Ensure theme pre-activation script in head to prevent FOUC / white flash
  if (!updated.includes('vanilla_app_theme')) {
    const themeScript = `<script>(function(){var s=localStorage.getItem('vanilla_app_theme'),p=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(!s&&p)){document.documentElement.setAttribute('data-theme','dark');}})();</script>`;
    updated = updated.replace(
      '<link rel="stylesheet"',
      `${themeScript}\n  <link rel="stylesheet"`
    );
  }

  if (headerRegex.test(updated)) {
    updated = updated.replace(headerRegex, header);
  }
  if (footerRegex.test(updated)) {
    updated = updated.replace(footerRegex, footer);
  }

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
  }
}

function syncAll() {
  SCAN_DIRS.forEach((dir) => {
    const targetDir = resolve(ROOT_DIR, dir);
    if (!fs.existsSync(targetDir)) return;

    const files = fs.readdirSync(targetDir);
    files.forEach((file) => {
      if (file.endsWith('.html')) {
        const fullPath = resolve(targetDir, file);
        const urlPath = dir ? `/${dir}/${file}` : (file === 'index.html' ? '/' : `/${file}`);
        syncFile(fullPath, urlPath);
      }
    });
  });
}

syncAll();

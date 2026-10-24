import fs from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { getHeaderHtml, getFooterHtml } from '../src/core/layout-template.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');

function getHtmlFiles(dir = '') {
  const fullPath = join(ROOT_DIR, dir);
  if (!fs.existsSync(fullPath)) return [];
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  let files = [];

  entries.forEach(entry => {
    const rel = dir ? join(dir, entry.name) : entry.name;
    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(rel);
    } else if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== 'public' && entry.name !== 'src') {
      files = files.concat(getHtmlFiles(rel));
    }
  });

  return files;
}

function syncFile(relPath) {
  const filePath = resolve(ROOT_DIR, relPath);
  const norm = relPath.replace(/\\/g, '/');
  let urlPath = norm === 'index.html' ? '/' : (norm.endsWith('/index.html') ? `/${norm.replace(/index\.html$/, '')}` : `/${norm}`);

  const content = fs.readFileSync(filePath, 'utf8');
  const header = getHeaderHtml(urlPath);
  const footer = getFooterHtml();

  const headerRegex = /<header class="site-header">[\s\S]*?<\/header>/;
  const footerRegex = /<footer class="site-footer">[\s\S]*?<\/footer>/;

  let updated = content;

  // Ensure theme pre-activation script in head to prevent FOUC
  if (!updated.includes('vanilla_app_theme')) {
    const themeScript = `<script>(function(){var s=localStorage.getItem('vanilla_app_theme');if(s==='dark'){document.documentElement.setAttribute('data-theme','dark');}})();</script>`;
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

export function syncLayout() {
  const files = getHtmlFiles();
  files.forEach(syncFile);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncLayout();
}

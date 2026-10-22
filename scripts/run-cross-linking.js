/**
 * Cross-Reference Runner Script
 * Scans content and editorial HTML files, injecting contextual cross-reference links.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { crossReferenceDict } from './cross-reference-dict.js';
import { crossLinkHtml } from './cross-link-engine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SCAN_DIRS = ['', 'items'];

export function runCrossLinking() {
  let processedCount = 0;

  SCAN_DIRS.forEach(dir => {
    const dirPath = path.join(ROOT_DIR, dir);
    if (!fs.existsSync(dirPath)) return;

    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      if (!file.endsWith('.html')) return;
      // Skip legal / policy pages if desired
      if (file === 'privacy.html' || file === 'terms.html') return;

      const filePath = path.join(dirPath, file);
      const urlPath = dir ? `/${dir}/${file}` : (file === 'index.html' ? '/' : `/${file}`);

      const originalHtml = fs.readFileSync(filePath, 'utf8');
      const linkedHtml = crossLinkHtml(originalHtml, urlPath, crossReferenceDict);

      if (linkedHtml !== originalHtml) {
        fs.writeFileSync(filePath, linkedHtml, 'utf8');
      }
      processedCount++;
    });
  });

  console.log(`[Cross-Reference Engine] Processed ${processedCount} content pages.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCrossLinking();
}

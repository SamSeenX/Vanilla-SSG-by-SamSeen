/**
 * Dynamic Robots.txt Generator
 * Syncs crawler directives and sitemap URL from site-config.js.
 */
import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { SITEMAP_URL } from './site-config.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const PUBLIC_DIR = resolve(ROOT_DIR, 'public');
const ROBOTS_PATH = resolve(PUBLIC_DIR, 'robots.txt');

export function generateRobots() {
  const content = `User-agent: *
Allow: /

Sitemap: ${SITEMAP_URL}
`;

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  fs.writeFileSync(ROBOTS_PATH, content, 'utf8');
  console.log(`[Robots Generator] Synced robots.txt pointing to ${SITEMAP_URL}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateRobots();
}

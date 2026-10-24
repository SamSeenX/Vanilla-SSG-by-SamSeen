/**
 * Picture Element Sub-Template
 * Emits zero-hydration responsive <picture> markup with AVIF and WebP fallbacks.
 * Prevents Cumulative Layout Shift by computing intrinsic width and height attributes.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'src', 'core', 'image-manifest.json');

let cachedManifest = null;

function getManifest() {
  if (cachedManifest) return cachedManifest;
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      cachedManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
      return cachedManifest;
    } catch {
      return {};
    }
  }
  return {};
}

export function renderPicture({
  name,
  alt = '',
  className = '',
  loading = 'lazy',
  decoding = 'async',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 1200px'
} = {}) {
  const cleanName = path.parse(name).name;
  const manifest = getManifest();
  const meta = manifest[cleanName] || { width: 1200, height: 800 };

  const classAttr = className ? ` class="${className}"` : '';
  const cleanAlt = (alt || cleanName).replace(/"/g, '&quot;');

  return `<picture${classAttr}>
  <source type="image/avif" srcset="/images/480w/${cleanName}.avif 480w, /images/1200w/${cleanName}.avif 1200w" sizes="${sizes}">
  <source type="image/webp" srcset="/images/480w/${cleanName}.webp 480w, /images/1200w/${cleanName}.webp 1200w" sizes="${sizes}">
  <img src="/images/1200w/${cleanName}.jpg" alt="${cleanAlt}" width="${meta.width}" height="${meta.height}" loading="${loading}" decoding="${decoding}">
</picture>`;
}

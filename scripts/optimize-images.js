/**
 * Automated Responsive Image Optimization Engine
 * Converts raw assets in src/assets/images to 480w & 1200w AVIF, WebP, and JPEG.
 * Maintains zero-CLS aspect ratio metadata in src/core/image-manifest.json.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SRC_DIR = path.join(ROOT_DIR, 'src', 'assets', 'images');
const PUBLIC_IMG_DIR = path.join(ROOT_DIR, 'public', 'images');
const MANIFEST_PATH = path.join(ROOT_DIR, 'src', 'core', 'image-manifest.json');

const TARGETS = [
  { dir: '480w', width: 480, quality: { avif: 70, webp: 80, jpeg: 80 } },
  { dir: '1200w', width: 1200, quality: { avif: 75, webp: 82, jpeg: 82 } }
];

const VALID_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tiff']);

async function optimize() {
  if (!fs.existsSync(SRC_DIR)) {
    fs.mkdirSync(SRC_DIR, { recursive: true });
  }

  TARGETS.forEach(t => {
    const targetPath = path.join(PUBLIC_IMG_DIR, t.dir);
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }
  });

  const files = fs.readdirSync(SRC_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return VALID_EXTS.has(ext);
  });

  if (files.length === 0) {
    console.log('[Image Optimizer] No source images in src/assets/images/. Skipping.');
    if (!fs.existsSync(MANIFEST_PATH)) {
      fs.writeFileSync(MANIFEST_PATH, JSON.stringify({}, null, 2), 'utf8');
    }
    return;
  }

  let manifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch {
      manifest = {};
    }
  }

  for (const file of files) {
    const inputPath = path.join(SRC_DIR, file);
    const basename = path.parse(file).name;
    const metadata = await sharp(inputPath).metadata();
    const origWidth = metadata.width || 1200;
    const origHeight = metadata.height || 800;

    manifest[basename] = {
      aspectRatio: Number((origWidth / origHeight).toFixed(4)),
      width: origWidth,
      height: origHeight
    };

    for (const target of TARGETS) {
      const targetWidth = Math.min(target.width, origWidth);
      const outDir = path.join(PUBLIC_IMG_DIR, target.dir);

      // AVIF
      await sharp(inputPath)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .avif({ quality: target.quality.avif, effort: 4 })
        .toFile(path.join(outDir, `${basename}.avif`));

      // WebP
      await sharp(inputPath)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .webp({ quality: target.quality.webp, effort: 4 })
        .toFile(path.join(outDir, `${basename}.webp`));

      // JPEG Fallback
      await sharp(inputPath)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .jpeg({ quality: target.quality.jpeg, mozjpeg: true })
        .toFile(path.join(outDir, `${basename}.jpg`));
    }

    console.log(`[Image Optimizer] Generated 6 variants for ${file}`);
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`[Image Optimizer] Synced image manifest with ${Object.keys(manifest).length} entries.`);
}

optimize().catch(err => {
  console.error('[Image Optimizer Error]', err);
  process.exit(1);
});

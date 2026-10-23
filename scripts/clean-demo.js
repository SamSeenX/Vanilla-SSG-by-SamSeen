/**
 * Template Cleaner & Demo Reset Script
 * Run by downstream developers (via 'npm run clean:demo') to strip demo articles,
 * reset placeholder branding, and initialize a pristine single-post starter kit.
 */
import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateOgCards } from './generate-og-cards.js';
import { generatePages } from './generate-pages.js';
import { generateRobots } from './generate-robots.js';
import { generateSitemap } from './generate-sitemap.js';
import { generateFeed } from './generate-feed.js';
import { syncSeoMeta } from './sync-seo-meta.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const CONTENT_DIR = resolve(ROOT_DIR, 'content', 'items');
const ITEMS_DIR = resolve(ROOT_DIR, 'items');
const OG_DIR = resolve(ROOT_DIR, 'public', 'og');
const SITE_CONFIG_PATH = resolve(__dirname, 'site-config.js');
const DICT_PATH = resolve(__dirname, 'cross-reference-dict.js');

const STARTER_ARTICLE = `---
id: hello-world
title: Welcome to Your New Static Site
tagline: A clean, blazingly fast publication built with VanillaSSG.
description: Start publishing content using lightweight Markdown and zero-hydration static architecture.
category: Getting Started
publishedDate: ${new Date().toISOString().split('T')[0]}
---

Welcome to your new static website!

## Getting Started

1. **Write Content**: Edit this article or add new \`.md\` files inside \`content/items/\`.
2. **Configure Domain**: Set your production domain in \`scripts/site-config.js\`.
3. **Customize Layout**: Adjust header and navigation links in \`src/core/templates/nav.js\`.
4. **Deploy Free**: Ship to Cloudflare Pages or GitHub Pages with zero hosting fees.
`;

const CLEAN_SITE_CONFIG = `/**
 * Centralized Site Configuration
 * Update SITE_URL, SITE_NAME, and SITE_DOMAIN for your project.
 */
export const SITE_URL = 'https://your-domain.com';
export const SITE_DOMAIN = 'your-domain.com';
export const SITE_NAME = 'MyStaticSite';
export const SITEMAP_URL = \`\${SITE_URL}/sitemap.xml\`;
export const OG_IMAGE_URL = \`\${SITE_URL}/og-thumbnail.png\`;
`;

const CLEAN_DICT = `/**
 * Cross-Reference Dictionary
 * Add keyword-to-URL mappings here to automatically cross-link matching terms.
 */
export const crossReferenceDict = [];
`;

export function cleanDemo() {
  console.log('[Template Cleaner] Resetting demo content to clean starter state...');

  // 1. Wipe content/items and write starter hello-world.md
  if (fs.existsSync(CONTENT_DIR)) {
    const files = fs.readdirSync(CONTENT_DIR);
    files.forEach(f => fs.unlinkSync(resolve(CONTENT_DIR, f)));
  } else {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
  fs.writeFileSync(resolve(CONTENT_DIR, 'hello-world.md'), STARTER_ARTICLE, 'utf8');

  // 2. Wipe generated item directories in items/
  if (fs.existsSync(ITEMS_DIR)) {
    const entries = fs.readdirSync(ITEMS_DIR, { withFileTypes: true });
    entries.forEach(entry => {
      const full = resolve(ITEMS_DIR, entry.name);
      if (entry.isDirectory()) {
        fs.rmSync(full, { recursive: true, force: true });
      } else if (entry.name !== 'index.html') {
        fs.unlinkSync(full);
      }
    });
  }

  // 3. Wipe generated OG cards
  if (fs.existsSync(OG_DIR)) {
    const ogFiles = fs.readdirSync(OG_DIR);
    ogFiles.forEach(f => fs.unlinkSync(resolve(OG_DIR, f)));
  }

  // 4. Reset site-config.js and cross-reference-dict.js
  fs.writeFileSync(SITE_CONFIG_PATH, CLEAN_SITE_CONFIG, 'utf8');
  fs.writeFileSync(DICT_PATH, CLEAN_DICT, 'utf8');

  // 5. Rebuild starter assets
  generateOgCards();
  generatePages();
  generateRobots();
  generateSitemap();
  generateFeed();
  syncSeoMeta();

  console.log('[Template Cleaner] Clean starter kit initialized successfully!');
  console.log('[Template Cleaner] Next step: update scripts/site-config.js with your domain.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  cleanDemo();
}

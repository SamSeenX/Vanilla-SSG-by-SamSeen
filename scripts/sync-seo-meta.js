/**
 * Automated SEO & OpenGraph Metadata Synchronizer
 * Injects clean OpenGraph, Twitter card, robots directives, and theme-color meta tags
 * while preserving noindex directives on error pages and handling subdirectory paths.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SITE_URL, SITE_NAME, OG_IMAGE_URL } from './site-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function getHtmlFiles(dir = '') {
  const fullPath = path.join(ROOT_DIR, dir);
  if (!fs.existsSync(fullPath)) return [];
  const entries = fs.readdirSync(fullPath, { withFileTypes: true });
  let files = [];

  entries.forEach(entry => {
    const rel = dir ? path.join(dir, entry.name) : entry.name;
    if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(rel);
    } else if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== 'public' && entry.name !== 'src') {
      files = files.concat(getHtmlFiles(rel));
    }
  });

  return files;
}

function generateMetaBlock(title, desc, canonicalUrl, isWebsite, is404) {
  const cleanTitle = (title || SITE_NAME).replace(/"/g, '&quot;');
  const cleanDesc = (desc || 'High-performance static site architecture with vanilla JavaScript.').replace(/"/g, '&quot;');
  const ogType = isWebsite ? 'website' : 'article';
  const robotsDirective = is404
    ? '<meta name="robots" content="noindex, nofollow">'
    : '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">';

  return `  <!-- Search Engine Directives -->
  ${robotsDirective}
  <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)">
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">

  <!-- Canonical & OpenGraph -->
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:locale" content="en_US">
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${cleanTitle}">
  <meta property="og:description" content="${cleanDesc}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${OG_IMAGE_URL}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:alt" content="${SITE_NAME} Emblem">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${cleanTitle}">
  <meta name="twitter:description" content="${cleanDesc}">
  <meta name="twitter:image" content="${OG_IMAGE_URL}">`;
}

function processHtmlFile(relPath) {
  const fullPath = path.join(ROOT_DIR, relPath);
  let content = fs.readFileSync(fullPath, 'utf8');
  const is404 = relPath === '404.html';

  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : SITE_NAME;

  const descMatch = content.match(/<meta\s+name="description"\s+content="([\s\S]*?)"/i);
  const desc = descMatch ? descMatch[1].trim() : '';

  const canonMatch = content.match(/<link\s+rel="canonical"\s+href="([\s\S]*?)"/i);
  let canonicalUrl = canonMatch ? canonMatch[1].trim() : '';
  if (!canonicalUrl) {
    const normPath = relPath.replace(/\\/g, '/');
    if (normPath === 'index.html') {
      canonicalUrl = `${SITE_URL}/`;
    } else if (normPath.endsWith('/index.html')) {
      canonicalUrl = `${SITE_URL}/${normPath.replace(/index\.html$/, '')}`;
    } else {
      canonicalUrl = `${SITE_URL}/${normPath}`;
    }
  }

  const isWebsite = relPath === 'index.html' || relPath.endsWith('index.html');
  const metaBlock = generateMetaBlock(title, desc, canonicalUrl, isWebsite, is404);

  // Strip existing comments related to SEO directives to eliminate accumulation
  content = content.replace(/\s*<!--\s*(?:Search Engine|OpenGraph|Twitter|Canonical)[^>]*-->/gi, '');

  // Strip existing og, twitter, robots, or theme-color meta tags
  content = content.replace(/\s*<meta\s+(?:property="og:[^"]*"|name="twitter:[^"]*"|name="robots"|name="theme-color")[^>]*>/gi, '');

  // Insert cleanly right before the favicon or stylesheet link
  if (content.includes('<link rel="icon"')) {
    content = content.replace('<link rel="icon"', `${metaBlock}\n  <link rel="icon"`);
  } else if (content.includes('<link rel="stylesheet"')) {
    content = content.replace('<link rel="stylesheet"', `${metaBlock}\n  <link rel="stylesheet"`);
  }

  content = content.replace(/<head>([\s\S]*?)<\/head>/i, (m, headInner) => {
    const cleanInner = headInner.replace(/\n{3,}/g, '\n\n');
    return `<head>${cleanInner}</head>`;
  });

  fs.writeFileSync(fullPath, content, 'utf8');
}

export function syncSeoMeta() {
  const files = getHtmlFiles();
  let count = 0;
  files.forEach(f => {
    processHtmlFile(f);
    count++;
  });
  console.log(`[SEO Sync] Synced clean metadata across ${count} HTML pages.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncSeoMeta();
}

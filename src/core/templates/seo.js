/**
 * SEO & OpenGraph Sub-Template
 * Standardizes robots directives, theme colors, canonical links, and side-by-side social cards.
 */

import { SITE_URL, SITE_NAME, OG_IMAGE_URL } from '../../../scripts/site-config.js';

export function getSeoMetaHtml({
  title = 'VanillaSSG: High Performance Static Site Architecture',
  description = 'Production-ready Vanilla JavaScript + Vite static site generator template.',
  path = '/',
  image = OG_IMAGE_URL,
  type = 'website'
} = {}) {
  const cleanTitle = (title || SITE_NAME).replace(/"/g, '&quot;');
  const cleanDesc = (description || 'High-performance static site architecture with vanilla JavaScript.').replace(/"/g, '&quot;');
  const fullUrl = path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  return `  <!-- Search Engine Directives -->
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)">
  <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">

  <!-- Canonical & OpenGraph -->
  <link rel="canonical" href="${fullUrl}">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:locale" content="en_US">
  <meta property="og:type" content="${type}">
  <meta property="og:title" content="${cleanTitle}">
  <meta property="og:description" content="${cleanDesc}">
  <meta property="og:url" content="${fullUrl}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="256">
  <meta property="og:image:height" content="256">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:alt" content="${SITE_NAME} Emblem">

  <!-- Twitter Compact Card (Side-by-Side Thumbnail) -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${cleanTitle}">
  <meta name="twitter:description" content="${cleanDesc}">
  <meta name="twitter:image" content="${image}">`;
}

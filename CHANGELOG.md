# Changelog

All notable changes to VanillaSSG are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-11-07

### Added
- **Agentic Browsing & AI Discoverability**: Implemented compliant `public/llms.txt` documentation manifest following the official standard with required `# Title` header and verified links.
- **Agentic Resource Discovery (ARD)**: Added machine-readable `public/.well-known/ard.json` manifest linked via `<link rel="ard">` in `src/core/templates/seo.js` to eliminate malformed HTML-fallback 404 errors during AI agent crawls.
- **LLM Content Manifest Link**: Registered `<link rel="alternate" type="text/plain" href="/llms.txt">` in HTML document heads for automated agent indexation.
- **Framework Update Manager**: Added `scripts/check-updates.js` (cached 24-hr GitHub release checker) and `scripts/update-framework.js` (`npm run update`) to allow downstream sites to pull template upgrades safely via Git upstream merge.

### Fixed
- **Cumulative Layout Shift (CLS) on Hero Element**: Locked `.hero-image-wrap`, `.responsive-figure`, and `<img>` to explicit `aspect-ratio: 16 / 9` and `width: 100%` inline and in stylesheet rules, eliminating layout movement during viewport resize and mobile agent crawls.
- **Smart Asset Inlining**: Upgraded `vite.config.js` to automatically inline tiny runtime JS modules (under 5 KB) alongside critical CSS (under 20 KB), eliminating chained render-blocking requests in Lighthouse audits.

---

## [1.1.0] - 2026-10-24

### Added
- **Automated Responsive Image Pipeline**: Integrated `sharp` to compile master assets from `src/assets/images/` into 6 modern variants across `public/images/480w/` and `public/images/1200w/`.
- **Modern Format Support**: Automated simultaneous AVIF and WebP generation alongside highly compressed JPEG fallbacks.
- **Zero-CLS Layout Registry**: Built `src/core/image-manifest.json` recording native dimensions and aspect ratios to prevent Cumulative Layout Shifts.
- **Markdown Image Transformer**: Updated `scripts/markdown-parser.js` to automatically convert markdown images into zero-hydration responsive `<picture>` tags.
- **Picture Sub-Template**: Created reusable `src/core/templates/picture.js` component for static page templates.
- **Multi-Platform Favicons**: Added pre-rendered 32x32 `favicon.ico` and 180x180 `apple-touch-icon.png` in kinetic lime and signal orange.
- **Public Changelog**: Added `CHANGELOG.md` and dedicated static `/changelog.html` showcase page.

---

## [1.0.3] - 2026-10-23

### Changed
- **Contact Workflow**: Replaced legacy contact form page with direct GitHub Issues links across all navigation menus and footers.
- **Route Pruning**: Removed `contact.html` to eliminate dead form inputs and maintenance overhead.
- **Sitemap Sync**: Updated canonical sitemap from 9 to 8 verified routes.

---

## [1.0.2] - 2026-10-23

### Fixed
- **WhatsApp Link Previews**: Constrained OpenGraph thumbnail dimensions to 256x256 under 300KB to reliably trigger compact side-by-side cards.
- **XML Parsing Exception**: Replaced invalid HTML `&bull;` entities in `public/og-thumbnail.svg` with native unicode bullets to prevent crawler parse errors.

### Added
- **Automated 256x256 Thumbnail Engine**: Added high-density raster generation pipeline via `rsvg-convert`.

---

## [1.0.1] - 2026-10-23

### Added
- **Architectural Spec-Sheet Theme**: Complete visual overhaul featuring a technical grid aesthetic, monospaced metadata badges, and high-contrast palettes.
- **Kinetic Color System**: Introduced Kinetic Lime Green (`#22c55e`) primary and Signal Orange (`#f97316`) accent tokens.
- **Clean Demo Reset**: Added `scripts/clean-demo.js` (`npm run clean:demo`) allowing developers to wipe starter content in one command.
- **Open Source Licensing**: Added official MIT `LICENSE` file and declared package metadata.

---

## [1.0.0] - 2026-10-21

### Added
- **Zero-Hydration SSG Engine**: Production-ready static site generator built on top of Vite and vanilla JavaScript with zero runtime framework overhead.
- **Custom Markdown Compiler**: Zero-dependency parser with YAML frontmatter support, word count calculation, and reading time estimation.
- **Pretty URL Generator**: Automated pretty routing (`/items/<slug>/index.html`) alongside flat alias compatibility.
- **Full SEO & Syndication Suite**: Automated dynamic sitemaps, robots.txt, and RSS 2.0 feed generation with live filesystem timestamps.
- **Cloudflare Edge Ready**: Zero-cost serverless hosting compatibility on Cloudflare Pages.

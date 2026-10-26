<p align="center">
  <br>
  <span style="font-size: 3.5rem;">⚡</span>
  <h1 align="center">VanillaSSG</h1>
  <p align="center"><strong>The Minimalist, Zero-Hydration Static Web Standard</strong></p>
  <p align="center">
    Pre-rendered static HTML &bull; Modular sub-templates &bull; Automated SEO &bull; Zero runtime JS payload
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Lighthouse-100%2F100-success?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Lighthouse 100/100">
    <img src="https://img.shields.io/badge/Client_Payload-0_KB-blue?style=for-the-badge" alt="Zero Runtime">
    <img src="https://img.shields.io/badge/Sub--200--Line-Enforced-orange?style=for-the-badge" alt="Sub-200-Line Limit">
    <img src="https://img.shields.io/badge/Bundler-Vite_6-purple?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6">
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License">
  </p>
</p>

---

### The Modern Web Dilemma: Why VanillaSSG Exists

Modern web publishing has drifted into unnecessary framework bloat. Shipping hundreds of kilobytes of client-side JavaScript runtimes just to display static text and articles introduces critical penalties: sluggish mobile rendering, search crawler indexation timeouts, and sudden layout shifts (CLS) that damage organic rankings and trigger Google AdSense revenue reductions. Monolithic dynamic apps also force creators into paying recurring $20 to $100+ monthly server hosting fees, VPS instances, and database maintenance costs for simple content sites. Monolithic codebases also saturate AI context windows, causing hallucinations, broken builds, and fragile refactoring loops for vibe coders.

**VanillaSSG returns to rock-solid web fundamentals.** Every page is pre-rendered as physical static HTML with zero hydration overhead, automated Google-friendly SEO metadata, dynamic vector social preview cards, and an enforced sub-200-line modular architecture that both humans and AI agents can build upon with total confidence. Best of all, pure static distribution allows you to host your entire website with zero monthly hosting fees on global edge platforms like Cloudflare Pages and GitHub Pages.

---

> [!TIP]
> ### 🤖 Quick Prompt for AI Coding Agents & Vibe Coders
> Copy and paste this single instruction block directly into Cursor, Claude, Antigravity, or ChatGPT to work on or extend this project:
>
> ```text
> You are working on VanillaSSG, a high-performance, zero-hydration static site generator built with Vite and vanilla JavaScript.
>
> Mandatory Rules:
> 1. Strict 200-Line Limit: Every source file (.js, .css, .html) must strictly stay under 200 lines. Keep code modular, decoupled, and single-purpose.
> 2. Layout Sub-Templates: All layout components live in `src/core/templates/` (`nav.js`, `header.js`, `footer.js`, `seo.js`, `schema.js`). Always update them there rather than hardcoding markup in static HTML.
> 3. Content Publishing: Add articles as Markdown files with YAML frontmatter inside `content/items/<slug>.md`. The build script automatically computes word counts, reading times, JSON-LD schemas, and generates clean pretty routes (`/items/<slug>/index.html`).
> 4. SEO Directives: Never add `noindex` except to `404.html`. Sitemaps use real file modification dates (mtime). Dynamic vector OG cards are auto-generated to `public/og/<slug>.svg`.
> 5. Commands: Run `npm run dev` for local development and `npm run build` for complete multi-page generation and asset bundling.
> ```

---

## Quick Navigation

[Benchmark Comparison](#-benchmark-comparison) &bull;
[Architecture Pipeline](#-architecture-pipeline) &bull;
[Key Features](#-key-features) &bull;
[Project Structure](#-project-structure) &bull;
[Developer Walkthrough](#-developer-walkthrough) &bull;
[Deployment](#-deployment)

---

## 📊 Benchmark Comparison

Why choose VanillaSSG over heavy JavaScript frameworks for content sites:

| Metric | VanillaSSG | Next.js / Nuxt | Astro | Hugo |
| :--- | :--- | :--- | :--- | :--- |
| **Initial JS Payload** | **0 KB** | 70 to 180+ KB | ~15 to 40 KB | **0 KB** |
| **Lighthouse Score** | **100 / 100** | 80 to 95 | 95 to 100 | **100 / 100** |
| **Hydration Delay** | **Instant (0 ms)** | 200 to 600 ms | Partial | **Instant (0 ms)** |
| **Google AdSense CLS** | **0.00 (Flawless)** | Variable / Risky | Low | Low |
| **Image Pipeline** | **Automated 6-Variant AVIF/WebP** | Manual / Heavy Plugins | Sharp integration | Basic |
| **Mobile Image Weight** | **5KB to 10KB (97% Reduction)** | Heavy (unoptimized) | Medium | Dependent on source |
| **Monthly Hosting Cost** | **$0 / month (Free Edge)** | $20 to $100+/mo (VPS/DB) | Low to Free | **$0 / month** |
| **Tooling & Language** | **Pure JS + Vite** | React/Vue Runtime | Custom `.astro` | Go Templates |
| **File Limit Guard** | **Sub-200 Lines** | Monolith Friendly | Monolith Friendly | Monolith Friendly |

---

## 🏗 Architecture Pipeline

```text
  content/items/*.md (YAML Frontmatter + Markdown)
         │
         ▼
  scripts/generate-pages.js ──► scripts/markdown-parser.js
         │                      (Computes word count & reading time)
         │
         ├──► Renders clean HTML with sub-templates:
         │    ├── src/core/templates/nav.js (Active route logic)
         │    ├── src/core/templates/header.js (Landmarks & branding)
         │    ├── src/core/templates/footer.js (Legal & columns)
         │    ├── src/core/templates/seo.js (Meta tags & cards)
         │    └── src/core/templates/schema.js (Article & BreadcrumbList)
         │
         ├──► items/<slug>/index.html (Pretty folder URL)
         ├──► items/<slug>.html (Compatibility alias)
         ├──► public/og/<slug>.svg (Dynamic vector social cards)
         ├──► public/sitemap.xml (Real file mtime timestamps)
         ├──► public/feed.xml (RSS 2.0 channel syndication)
         └──► public/robots.txt (Crawler directives synced to domain)
```

---

## ✨ Key Features

### 🧩 1. Modular Sub-Templates
All layouts are decoupled into focused, single-responsibility files located in `src/core/templates/`:
* **`nav.js`**: Central link registry and active link state computation.
* **`header.js`**: Semantic header landmark, accessible brand logo, and theme switcher hook.
* **`footer.js`**: Trust and legal links, multi-column navigation, and copyright.
* **`seo.js`**: Canonical tags, theme-color meta, and Twitter OpenGraph integration.
* **`schema.js`**: Automated JSON-LD structured schemas (`WebSite`, `Article`, `BreadcrumbList`).

### 📝 2. Zero-Dependency Markdown Compiler
Write articles in clean Markdown with YAML frontmatter inside `content/items/`:
```markdown
---
id: zero-hydration-guide
title: Zero Hydration Architecture
tagline: Why shipping pure HTML beats waiting for mega-bundles to hydrate.
description: Complete breakdown of pre-rendered static architectures.
category: Architecture
publishedDate: 2026-01-15
---

Pre-rendering dynamic data at build time eliminates Cumulative Layout Shifts.
```
* Generates reading metrics (word count and estimated reading minutes).
* Automatically injects `wordCount` and `timeRequired` into Google Article schema.

### 🌐 3. Pretty URLs & Clean Routing
* Compiles each post to `items/<slug>/index.html` for clean URLs (`/items/<slug>/`).
* Preserves `items/<slug>.html` as backward-compatible fallback aliases.
* Sitemap and canonical tags always prioritize clean directory routes.

### 🎨 4. Dynamic Vector Social Cards
* Auto-renders branded 1200x630 SVG social preview cards into `public/og/<slug>.svg`.
* Each article gets a unique card styled with its category badge and title.

### 🤖 5. Automated Crawl Signals & 404 Guard
* **Dynamic Robots**: `scripts/generate-robots.js` links the sitemap to your active domain.
* **Real Timestamps**: `scripts/generate-sitemap.js` reads actual filesystem `mtime` dates.
* **404 Crawler Protection**: `404.html` includes `<meta name="robots" content="noindex, nofollow">` and is strictly excluded from sitemaps.
* **RSS 2.0 Syndication**: Full XML RSS feed generated automatically at `public/feed.xml`.

### 🔗 6. Contextual Cross-Reference Engine
* `scripts/cross-link-engine.js` injects automatic internal links from `scripts/cross-reference-dict.js`.
* Skips headings, code blocks, and existing links to protect HTML integrity.

### ⚡ 7. Automated Responsive Image Optimization Engine
Drop raw master images (PNG, JPEG, WebP) into `src/assets/images/`. During build, `scripts/optimize-images.js` automatically compiles them using `sharp` into structured resolution directories:
* **`public/images/480w/`**: Generates AVIF, WebP, and compressed JPEG thumbnails (5KB to 10KB) for mobile viewports and collection cards.
* **`public/images/1200w/`**: Generates full-resolution AVIF, WebP, and JPEG graphics (20KB to 35KB) for crisp desktop displays.
* **Zero Cumulative Layout Shift (CLS)**: Extracts native image dimensions and aspect ratios into `src/core/image-manifest.json`.
* **Markdown Integration**: Automatically transforms `![Alt](/images/photo.png)` into zero-hydration responsive `<picture>` markup.

#### 📈 Real-World Image Optimization Benchmark

| Variant | Resolution | Format | File Size | Bandwidth Reduction | Target Audience |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Raw Master Source** | 2400 × 1350 | PNG | **252 KB** | Baseline | Local source (`src/assets/`) |
| **Desktop AVIF** | 1200 × 675 | AVIF | **23 KB** | **90.9% reduction** | Modern desktop browsers |
| **Desktop WebP** | 1200 × 675 | WebP | **22 KB** | **91.3% reduction** | High-performance desktop |
| **Desktop JPEG** | 1200 × 675 | JPEG | **37 KB** | **85.3% reduction** | Legacy browser fallback |
| **Mobile AVIF** | 480 × 270 | AVIF | **6.1 KB** | **97.6% reduction** | Mobile cellular networks |
| **Mobile WebP** | 480 × 270 | WebP | **5.4 KB** | **97.8% reduction** | Lightning-fast mobile cards |
| **Mobile JPEG** | 480 × 270 | JPEG | **7.9 KB** | **96.9% reduction** | Universal mobile fallback |

### 🚀 8. Advanced Vite Production Minification
* **HTML Minification**: Automatically collapses redundant whitespace and strips HTML comments in production without breaking code blocks or JSON-LD scripts.
* **Modern ES2022 Target**: Prevents injection of legacy polyfill overhead for smaller, faster ES module execution.
* **Console & Debugger Stripping**: Automatically drops all `console.log` and `debugger` statements via `esbuild` during production builds.
* **Zero-Polyfill Module Preloading**: Strips unnecessary modulepreload polyfills on modern browsers.
* **Immutable Asset Hashing**: Emits assets with content hashes (`assets/[name]-[hash].[ext]`) for 1-year browser cache optimization on edge CDNs.

---

## 📁 Project Structure

```text
vanilla-ssg-template/
├── 404.html                   # Dedicated error page with noindex guard
├── index.html                 # Landing page with responsive hero picture
├── about.html                 # Philosophy and background
├── changelog.html             # Release history and version tracker
├── CHANGELOG.md               # Standard Keep a Changelog tracking file
├── content/items/*.md         # Raw Markdown articles
├── src/assets/images/         # Raw author images (PNG, JPEG)
├── public/images/             # Automated 480w & 1200w AVIF/WebP/JPEG variants
├── privacy.html               # AdSense-compliant privacy policy
├── terms.html                 # Terms of service
├── package.json               # Vite config and generator pipeline
├── vite.config.js             # Multi-page scanner and layout consistency plugin
├── content/
│   └── items/                 # Editorial Markdown articles
│       ├── item-one.md
│       ├── item-two.md
│       └── item-three.md
├── items/                     # Compiled pretty routes & collection archive
│   ├── index.html             # Archive collection listing
│   ├── item-one/
│   │   └── index.html         # Pretty URL (/items/item-one/)
│   └── item-one.html          # Fallback alias
├── public/
│   ├── favicon.svg            # Default vector logo
│   ├── feed.xml               # Auto-generated RSS 2.0 feed
│   ├── robots.txt             # Auto-generated crawler directives
│   ├── sitemap.xml            # Auto-generated XML sitemap
│   └── og/                    # Dynamic vector SVG social cards
├── scripts/
│   ├── site-config.js         # Central site URL, name, and branding
│   ├── markdown-parser.js     # Markdown & frontmatter compiler (< 80 lines)
│   ├── generate-og-cards.js    # Dynamic SVG social card generator
│   ├── generate-pages.js      # Page generator & collection builder
│   ├── generate-robots.js     # Dynamic robots.txt sync
│   ├── generate-sitemap.js    # Sitemap generator using real mtimes
│   ├── generate-feed.js       # RSS 2.0 feed builder
│   ├── cross-link-engine.js    # Internal cross-reference engine
│   ├── cross-reference-dict.js# Keyword dictionary for auto-linking
│   ├── sync-layout.js         # Layout synchronization utility
│   └── sync-seo-meta.js       # SEO meta tags deduplication & sync
└── src/
    ├── main.js                # Minimal client bootstrapper
    ├── core/
    │   ├── event-bus.js       # Pub-sub event messenger (< 40 lines)
    │   ├── theme-manager.js    # Zero-CLS theme manager (< 45 lines)
    │   ├── layout-template.js # Façade exporting modular sub-templates
    │   └── templates/         # Modular layout sub-templates (< 65 lines each)
    │       ├── nav.js         # Navigation menu & active route detection
    │       ├── header.js      # Landmark header & branding
    │       ├── footer.js      # Columns, links, & copyright
    │       ├── seo.js         # Canonical tags & social card meta
    │       └── schema.js      # JSON-LD structured data generators
    └── styles/
        ├── tokens.css         # Theme variables & color palette
        ├── main.css           # Base typography & layout
        ├── layout.css         # Header, nav, & footer styling
        └── components.css     # Buttons, cards, & badges
```

---

## 🧹 Using as a Template: Reset & Customization

When you create a new repository from this starter, you have two quick options to clear out our demo articles and configure your own brand:

### Option A: One-Command Automated Reset (Recommended)
Run this command in your cloned project:
```bash
npm run clean:demo
```
This script automatically:
* Replaces the 3 sample articles in `content/items/` with a clean `hello-world.md` starter.
* Cleans out generated demo directories in `items/` and old SVG cards in `public/og/`.
* Resets `scripts/site-config.js` to generic placeholders (`your-domain.com`).
* Clears the sample keyword dictionary in `scripts/cross-reference-dict.js`.
* Rebuilds all sitemaps, RSS feeds, and pages so your new site runs immediately.

### Option B: Manual Customization Checklist
If you prefer configuring by hand, review these four files:
1. **`scripts/site-config.js`**: Update `SITE_URL`, `SITE_DOMAIN`, and `SITE_NAME`.
2. **`content/items/`**: Replace the sample markdown files with your own articles.
3. **`src/core/templates/nav.js`**: Update navigation items to point to your new pages.
4. **`public/favicon.svg` & `public/og-thumbnail.png`**: Swap with your brand logos.

---

## 🚀 Developer Walkthrough

### 1. Configure Branding
Set your domain and brand name in `scripts/site-config.js`:
```javascript
export const SITE_URL = 'https://your-domain.com';
export const SITE_DOMAIN = 'your-domain.com';
export const SITE_NAME = 'VanillaSSG';
```

### 2. Add Content
Create a new Markdown file inside `content/items/`:
```bash
touch content/items/my-article.md
```
Add YAML frontmatter (`id`, `title`, `tagline`, `description`, `category`, `publishedDate`), then write your body copy in regular Markdown.

### 3. Local Development
```bash
npm run dev
```
Runs the full generator pipeline and boots the Vite dev server with instant hot reload.

### 4. Build for Production
```bash
npm run build
```
Compiles markdown, builds vector OG cards, outputs sitemap, syncs layout, and emits production static assets into `dist/`.

### 5. Keeping Your Site Updated
When updates and architectural improvements are published to the upstream VanillaSSG template:
```bash
npm run update
```
This safely fetches and merges the latest core improvements from `upstream/main` without disturbing your custom articles, images, or branding.

### 6. Automatic Lighthouse 100 Guardrails
VanillaSSG comes pre-configured with zero-config performance guardrails:
* **Smart Asset Inlining**: Critical CSS (under 20 KB) and tiny runtime JS (under 5 KB) are automatically inlined directly into HTML during production builds, eliminating render-blocking chains.
* **Responsive Visual Pipeline**: Multi-resolution AVIF and WebP generation with density-aware picture markup (`sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px"`) prevents high-DPR mobile devices from over-fetching desktop assets.
* **Strict Semantic Hierarchy**: Layout sub-templates enforce WCAG AAA contrast ratios and sequential heading structures (`h1` -> `h2` -> `h3`) out of the box.

---

## ☁️ Zero-Cost Global Edge Deployment ($0/month)

Because the generated `dist/` directory is 100% pure static HTML, CSS, and SVG, you never need to pay for backend servers, VPS instances, or container compute runtimes. Deploy worldwide on free edge CDN networks with unlimited bandwidth and automatic SSL:

* **Cloudflare Pages (Recommended)**: Set build command to `npm run build` and output directory to `dist`. Enjoy unlimited bandwidth and global CDN edge routing with zero monthly fees.
* **Vercel**: Set framework preset to `Vite` and output directory to `dist` for instantaneous static edge deploys.
* **Netlify**: Set publish directory to `dist` and build command to `npm run build`.
* **GitHub Pages**: Deploy directly from the `dist` folder or automated GitHub Actions with zero hosting costs.

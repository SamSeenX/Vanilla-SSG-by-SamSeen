# VanillaSSG: The Minimalist Static Web Standard

A production-grade, zero-hydration static site generator built on Vite, modern ES6 modules, and clean modular CSS.

Modern web publishing often ships megabytes of client framework code just to show static articles. VanillaSSG gives you the ultimate alternative: pre-rendered static HTML, sub-200-line modular components, automatic search engine optimization, and instant 100/100 Core Web Vitals.

---

## Quick Prompt for AI Coding Agents & Vibe Coders

Copy and paste this single prompt directly into Cursor, Claude, Antigravity, ChatGPT, or your favorite AI coding assistant when starting or extending this project:

```text
You are working on VanillaSSG, a high-performance, zero-hydration static site generator built with Vite and vanilla JavaScript.

Core Rules & Standards:
1. Strict 200-Line Limit: Every source file (.js, .css, .html) must strictly stay under 200 lines. Keep code modular, decoupled, and single-purpose.
2. Layout Sub-Templates: All layout components live in `src/core/templates/` (`nav.js`, `header.js`, `footer.js`, `seo.js`, `schema.js`). Always update them there rather than hardcoding markup in static HTML.
3. Content Publishing: Add articles as Markdown files with YAML frontmatter inside `content/items/<slug>.md`. The build script automatically computes word counts, reading times, JSON-LD schemas, and generates clean pretty routes (`/items/<slug>/index.html`).
4. SEO Directives: Never add `noindex` except to `404.html`. Sitemaps use real file modification dates (mtime). Dynamic vector OG cards are auto-generated to `public/og/<slug>.svg`.
5. Commands: Run `npm run dev` for local development and `npm run build` for complete multi-page generation and asset bundling.
```

---

## Architectural Principles

* **Static First**: Every page is emitted as pure, valid HTML on disk. Bots and users receive complete content on the first byte.
* **Zero Client Runtime**: No React, Vue, Svelte, or runtime hydration overhead. Client JavaScript is strictly additive for lightweight UI interactions like theme toggling.
* **Strict Sub-200-Line Limit**: Every JavaScript module and stylesheet stays strictly under 200 lines. This keeps the codebase modular, clean, and effortless to audit.
* **Built-in SEO & Monetization**: Automated OpenGraph cards, Twitter cards, RSS 2.0 feed, valid Schema.org JSON-LD (WebSite, Article, BreadcrumbList), zero-CLS design tokens, and publisher trust pages (Privacy, Terms, About, Contact, 404).

---

## Project Structure

```text
vanilla-ssg-template/
├── 404.html                # Branded error page with crawler noindex guard
├── index.html              # Landing page
├── about.html              # Philosophy and about page
├── contact.html            # Accessible contact form
├── privacy.html            # AdSense-compliant privacy policy
├── terms.html              # Terms of service
├── package.json            # Vite config and generator pipeline
├── vite.config.js          # Multi-page scanner and layout consistency plugin
├── content/
│   └── items/              # Markdown articles with YAML frontmatter
│       ├── item-one.md
│       ├── item-two.md
│       └── item-three.md
├── items/                  # Generated pretty directory routes
│   ├── index.html          # Collection archive listing
│   ├── item-one/
│   │   └── index.html      # Pretty route (/items/item-one/)
│   └── item-one.html       # Backward-compatible alias
├── public/
│   ├── favicon.svg         # Default vector logo
│   ├── feed.xml            # Auto-generated RSS 2.0 feed
│   ├── og-thumbnail.png    # Default social card thumbnail
│   ├── robots.txt          # Auto-generated crawler directives
│   ├── sitemap.xml         # Auto-generated XML sitemap with file mtimes
│   └── og/                 # Auto-generated per-article SVG social cards
├── scripts/
│   ├── site-config.js      # Central site URL, name, and branding
│   ├── markdown-parser.js  # Zero-dependency Markdown & frontmatter compiler
│   ├── generate-og-cards.js # Dynamic vector SVG social preview generator
│   ├── generate-pages.js   # Pre-renders markdown items to pretty static HTML
│   ├── generate-robots.js  # Dynamic robots.txt sync
│   ├── generate-sitemap.js # Sitemap generator with real filesystem mtimes
│   ├── generate-feed.js    # RSS 2.0 feed generator
│   ├── cross-link-engine.js # Automated internal linking engine
│   ├── cross-reference-dict.js # Keyword dictionary for internal linking
│   ├── sync-layout.js      # Layout synchronization utility
│   └── sync-seo-meta.js    # SEO metadata injector with deduplication
└── src/
    ├── main.js             # Client bootstrapper
    ├── core/
    │   ├── event-bus.js    # Pub-sub event messenger
    │   ├── theme-manager.js # Zero-CLS dark and light theme toggle
    │   ├── layout-template.js # Façade re-exporting layout sub-templates
    │   └── templates/      # Modular sub-templates (< 70 lines each)
    │       ├── nav.js      # Navigation menu and active link states
    │       ├── header.js   # Top branding, navigation bar, theme button
    │       ├── footer.js   # Multi-column footer and copyright
    │       ├── seo.js      # Meta tags, canonical links, social cards
    │       └── schema.js   # JSON-LD structured data generators
    └── styles/
        ├── tokens.css      # CSS variables and color palettes
        ├── main.css        # Base typography and container layout
        ├── layout.css      # Header, navigation, and footer styling
        └── components.css  # Buttons, cards, and interactive widgets
```

---

## Complete Features Breakdown

### 1. Modular Sub-Templates (`src/core/templates/`)
Layouts are split into single-responsibility sub-templates:
* **`nav.js`**: Centralized link definitions and automatic active route detection.
* **`header.js`**: Consistent header landmark, brand logo, and theme switcher hook.
* **`footer.js`**: Columnar layout for navigation, trust pages, and copyright notice.
* **`seo.js`**: Complete OpenGraph, Twitter summary, theme colors, and canonical links.
* **`schema.js`**: Generates Google-compliant `WebSite`, `Article`, and `BreadcrumbList` schemas.

### 2. Native Markdown Frontmatter Compiler
Write content in clean Markdown (`content/items/<slug>.md`) with YAML frontmatter:
```markdown
---
id: my-new-post
title: How We Achieved 100 on Lighthouse
tagline: Step by step guide to zero-hydration static architectures.
description: Learn how eliminating client-side UI frameworks creates instant websites.
category: Performance
publishedDate: 2026-04-01
---

Your editorial article content goes here in regular markdown.
```
The compiler automatically handles:
* Headings (`#`, `##`, `###`), bold (`**`), italics (`*`), code (`` ` ``), links, and unordered lists.
* Word counts and estimated reading time calculation (e.g. `2 min read`).
* Automatic injection into Google `Article` schema (`wordCount`, `timeRequired`).

### 3. Pretty URLs (Clean Directory Routing)
Pages are compiled to directory indexes:
* `/items/my-new-post/index.html` (served cleanly as `/items/my-new-post/`)
* `/items/my-new-post.html` (legacy flat alias)
* Canonical tags and sitemap entries automatically adopt clean paths.

### 4. Dynamic Vector Social Cards
Every article automatically gets a dedicated 1200x630 vector SVG social preview card generated inside `public/og/<slug>.svg` with matching typography, category badge, and site branding.

### 5. Automated Crawl Signals & Sitemap
* **Dynamic `robots.txt`**: Automatically generated from `scripts/site-config.js`.
* **Real File `mtime`**: `sitemap.xml` reads true file modification times rather than stamping today's date on unchanged files.
* **Crawler Protection**: `404.html` includes `<meta name="robots" content="noindex, nofollow">` and is strictly omitted from sitemaps.
* **RSS 2.0 Syndication**: `public/feed.xml` updates automatically with every build.

### 6. Automated Internal Cross-Linking
The cross-reference engine (`scripts/cross-link-engine.js`) matches terms from `scripts/cross-reference-dict.js` and injects contextual internal links into page content without breaking headings, existing anchor tags, or code snippets.

---

## Step-by-Step Developer Guide

### 1. Configure Your Site
Open `scripts/site-config.js` and update your production domain and brand name:
```javascript
export const SITE_URL = 'https://your-domain.com';
export const SITE_DOMAIN = 'your-domain.com';
export const SITE_NAME = 'VanillaSSG';
```

### 2. Add a New Article
Create a markdown file in `content/items/`:
```bash
touch content/items/my-first-article.md
```
Add YAML frontmatter (`id`, `title`, `tagline`, `description`, `category`, `publishedDate`), then write your article.

### 3. Update Navigation Links
To add or modify navigation items, edit `NAV_ITEMS` in `src/core/templates/nav.js`. The layout synchronization pipeline will immediately update every page on the site.

### 4. Run Development Server
```bash
npm run dev
```
This runs all generation scripts and launches Vite with instant local reloading.

### 5. Build for Production
```bash
npm run build
```
Builds the complete static site into the `dist/` folder ready for edge deployment.

---

## Deployment

Deploy the `dist/` directory with zero backend configuration on any static hosting provider:

* **Cloudflare Pages**: Build command `npm run build`, output directory `dist`
* **Vercel**: Framework preset `Vite`, output directory `dist`
* **Netlify**: Publish directory `dist`, build command `npm run build`
* **GitHub Pages**: Upload `dist/` folder via standard GitHub Pages action

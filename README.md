# VanillaSSG: The Minimalist Static Web Standard

A production-grade, zero-hydration static site generator built on Vite, modern ES6 modules, and clean modular CSS.

---

## The Manifesto: Why We Built This

Modern frontend development has drifted into unnecessary complexity. Content-driven websites, documentation portals, and affiliate resources often ship megabytes of client-side JavaScript runtimes just to render static text and images.

This creates critical pain points for web publishers:

1. **The Hydration Tax**: Frameworks render HTML on the server, then re-download hundreds of kilobytes of runtime code just to attach event listeners to a page that was already legible.
2. **SEO and Search Crawler Penalties**: Client-side rendering and complex hydration pipelines can cause search bot timeouts, indexing delays, and reduced crawl efficiency.
3. **Google AdSense Rejections**: Dynamic layouts and late-loading framework components trigger Cumulative Layout Shifts (CLS), violating Core Web Vitals and risking ad revenue penalties.
4. **Maintenance Fragility**: Every major framework upgrade introduces breaking configuration changes, obsolete plugins, and dependency bloat.

**VanillaSSG solves this by returning to web fundamentals without sacrificing developer ergonomics.**

---

## Architectural Principles

* **Static First**: Every page is emitted as pure, valid HTML on disk. Bots and users receive complete content on the first byte.
* **Zero Client Runtime**: No React, no Vue, no Svelte, no hydration cycles. Client JavaScript is strictly additive for lightweight UI state like theme toggles.
* **Strict Sub-200-Line Limit**: Every JavaScript file and CSS stylesheet stays strictly under 200 lines. This keeps the codebase modular, easy to audit, and ideal for AI pair-programming.
* **Built-in Monetization & SEO Readiness**: Includes pre-configured JSON-LD structured schemas, zero-CLS design tokens, and mandatory publisher trust pages (Privacy, Terms, About, Contact).

---

## Project Structure

```text
vanilla-ssg-template/
├── .project_rules.md       # AI agent development rules for this repo
├── index.html              # Landing page
├── about.html              # About page
├── contact.html            # Accessible contact form
├── privacy.html            # AdSense-compliant privacy policy
├── terms.html              # Terms of service
├── package.json            # Vite configuration and scripts
├── vite.config.js          # Multi-page scanner and layout injection
├── public/
│   ├── favicon.svg         # Default vector icon
│   ├── og-image.png        # Standard 1200x630 social preview banner
│   ├── robots.txt          # Crawler instructions
│   └── sitemap.xml         # Auto-generated XML sitemap
├── scripts/
│   ├── generate-pages.js   # Pre-render dynamic data to static HTML
│   ├── generate-sitemap.js # Auto-discover and generate XML sitemap
│   └── sync-layout.js      # Layout synchronization utility
└── src/
    ├── main.js             # Client bootstrapper
    ├── core/
    │   ├── event-bus.js    # Lightweight pub-sub messenger (< 50 lines)
    │   ├── layout-template.js # Universal header and footer markup
    │   └── theme-manager.js # Zero-CLS dark and light theme toggle
    └── styles/
        ├── tokens.css      # CSS custom properties and color palettes
        └── main.css        # Responsive base styling (< 200 lines)
```

---

## How It Works

### 1. Build-Time Static Generation
Instead of complex template compilers, `scripts/generate-pages.js` uses native Node and standard JavaScript template literals to output physical `.html` files in dedicated folders like `items/`. You have full programmatic control over metadata, categories, and Schema.org JSON-LD markup.

### 2. Auto-Discovery Multi-Page Build
The `vite.config.js` file scans the root directory and collection folders, registering every `.html` file as a distinct Rollup entry point. You never have to manually update build configuration when adding new articles.

### 3. Layout Consistency Hook
The custom `layoutConsistencyPlugin` hook in Vite automatically injects the canonical header, footer, and navigation bar during development and production builds. Changing navigation links in `src/core/layout-template.js` instantly reflects across the entire website.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
Generates dynamic collection pages and launches Vite dev server with Hot Module Replacement:
```bash
npm run dev
```

### 3. Build for Production
Generates all pages, synchronizes layouts, and outputs optimized static assets into the `dist/` folder:
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

---

## Deployment

The output in `dist/` is 100% static and can be deployed with zero configuration on:

* **Cloudflare Pages**: Set build command to `npm run build` and output directory to `dist`.
* **Vercel**: Framework preset `Vite`, output directory `dist`.
* **Netlify**: Publish directory `dist`.
* **GitHub Pages**: Deploy the `dist` branch or upload via GitHub Actions.

---

## Using This Template for New Projects

To create a new project using this template:

### Option A: Via GitHub (Recommended)
Click the green **"Use this template"** button at the top of the [GitHub Repository](https://github.com/SamSeenX/Vanilla-SSG-by-SamSeen) and select **"Create a new repository"**.

### Option B: Via Command Line (degit)
Scaffold instantly without cloning Git history:
```bash
npx degit SamSeenX/Vanilla-SSG-by-SamSeen my-new-project
cd my-new-project
npm install
npm run dev
```

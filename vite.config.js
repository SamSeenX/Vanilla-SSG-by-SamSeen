import fs from 'fs';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { getHeaderHtml, getFooterHtml } from './src/core/layout-template.js';

function getHtmlInputs() {
  const inputs = {};
  const scanDirs = ['', 'pages', 'items'];
  
  scanDirs.forEach((dir) => {
    const fullDir = resolve(__dirname, dir);
    if (!fs.existsSync(fullDir)) return;
    
    const entries = fs.readdirSync(fullDir, { withFileTypes: true });
    entries.forEach((entry) => {
      if (entry.name === 'dist' || entry.name === 'node_modules') return;
      if (entry.isFile() && entry.name.endsWith('.html')) {
        const file = entry.name;
        const key = dir ? `${dir}_${file.replace('.html', '')}` : (file === 'index.html' ? 'main' : file.replace('.html', ''));
        inputs[key] = resolve(fullDir, file);
      } else if (entry.isDirectory()) {
        const subIndex = resolve(fullDir, entry.name, 'index.html');
        if (fs.existsSync(subIndex)) {
          inputs[`${dir}_${entry.name}`] = subIndex;
        }
      }
    });
  });
  
  return inputs;
}

function minifyHtml(html) {
  const preserved = [];
  let processed = html.replace(/<(pre|code|script\b[^>]*)>([\s\S]*?)<\/\1>/gi, (match) => {
    preserved.push(match);
    return `__PRESERVED_${preserved.length - 1}__`;
  });

  processed = processed.replace(/<!--[\s\S]*?-->/g, '');
  processed = processed.replace(/>\s+</g, '><');
  processed = processed.replace(/[ \t\r\n]+/g, ' ');

  preserved.forEach((block, idx) => {
    processed = processed.replace(`__PRESERVED_${idx}__`, block);
  });

  return processed.trim();
}

function layoutConsistencyPlugin(isProd) {
  return {
    name: 'layout-consistency-plugin',
    transformIndexHtml(html, ctx) {
      let urlPath = ctx.path || '/';
      if (urlPath === '/index.html') urlPath = '/';

      const header = getHeaderHtml(urlPath);
      const footer = getFooterHtml();

      const headerRegex = /<header class="site-header">[\s\S]*?<\/header>/;
      const footerRegex = /<footer class="site-footer">[\s\S]*?<\/footer>/;

      let result = html;
      if (!result.includes('favicon.svg')) {
        result = result.replace(
          '<link rel="stylesheet"',
          '<link rel="icon" type="image/svg+xml" href="/favicon.svg">\n  <link rel="stylesheet"'
        );
      }
      if (headerRegex.test(result)) {
        result = result.replace(headerRegex, header);
      }
      if (footerRegex.test(result)) {
        result = result.replace(footerRegex, footer);
      }

      return isProd ? minifyHtml(result) : result;
    }
  };
}

function smartCssInlinerPlugin(isProd) {
  const INLINE_SIZE_LIMIT = 20 * 1024; // 20 KB threshold

  return {
    name: 'smart-css-inliner-plugin',
    enforce: 'post',
    apply: 'build',
    closeBundle() {
      if (!isProd) return;
      const distDir = resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) return;

      const assetsDir = resolve(distDir, 'assets');
      if (!fs.existsSync(assetsDir)) return;

      const cssFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.css'));
      if (cssFiles.length === 0) return;

      const cssFileName = cssFiles[0];
      const cssPath = resolve(assetsDir, cssFileName);
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      const cssSize = Buffer.byteLength(cssContent, 'utf8');

      const htmlFiles = [];
      function collectHtml(dir) {
        fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
          const res = resolve(dir, entry.name);
          if (entry.isDirectory() && entry.name !== 'assets') {
            collectHtml(res);
          } else if (entry.isFile() && entry.name.endsWith('.html')) {
            htmlFiles.push(res);
          }
        });
      }
      collectHtml(distDir);

      const linkRegex = new RegExp(`<link[^>]+href="[/]?[^"]*${cssFileName}"[^>]*>`, 'gi');

      htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        if (cssSize <= INLINE_SIZE_LIMIT) {
          content = content.replace(linkRegex, `<style>${cssContent}</style>`);
        } else {
          content = content.replace(linkRegex, `<link rel="preload" href="/assets/${cssFileName}" as="style"><link rel="stylesheet" href="/assets/${cssFileName}">`);
        }
        // Move JS module script to end of body to prevent critical path latency
        const jsRegex = /<script\s+type="module"\s+crossorigin\s+src="(\/assets\/[^"]+\.js)"><\/script>/gi;
        const jsMatch = content.match(jsRegex);
        if (jsMatch && jsMatch.length > 0) {
          content = content.replace(jsRegex, '');
          content = content.replace('</body>', `${jsMatch.join('')}</body>`);
        }
        fs.writeFileSync(file, content, 'utf8');
      });

      console.log(`[Smart CSS Inliner] Processed ${htmlFiles.length} HTML files (${cssSize <= INLINE_SIZE_LIMIT ? 'Inlined CSS' : 'Preloaded External CSS'}).`);
    }
  };
}

export default defineConfig(({ command, mode }) => {
  const isProd = command === 'build' || mode === 'production';

  return {
    plugins: [
      layoutConsistencyPlugin(isProd),
      smartCssInlinerPlugin(isProd)
    ],
    esbuild: {
      drop: isProd ? ['console', 'debugger'] : []
    },
    build: {
      target: 'es2022',
      minify: 'esbuild',
      cssMinify: true,
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      modulePreload: {
        polyfill: false
      },
      rollupOptions: {
        input: getHtmlInputs(),
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    }
  };
});

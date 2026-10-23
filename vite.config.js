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

export default defineConfig(({ command, mode }) => {
  const isProd = command === 'build' || mode === 'production';

  return {
    plugins: [layoutConsistencyPlugin(isProd)],
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

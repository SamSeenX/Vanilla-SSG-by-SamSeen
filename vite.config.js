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

function layoutConsistencyPlugin() {
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
      return result;
    }
  };
}

export default defineConfig({
  plugins: [layoutConsistencyPlugin()],
  build: {
    rollupOptions: {
      input: getHtmlInputs()
    }
  }
});

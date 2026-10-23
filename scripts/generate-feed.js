/**
 * RSS 2.0 Feed Generator
 * Ingests Markdown content and emits public/feed.xml with clean canonical article URLs.
 */
import fs from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { SITE_URL, SITE_NAME } from './site-config.js';
import { parseFrontmatter } from './markdown-parser.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(__dirname, '..');
const CONTENT_DIR = resolve(ROOT_DIR, 'content', 'items');
const PUBLIC_DIR = resolve(ROOT_DIR, 'public');
const FEED_PATH = resolve(PUBLIC_DIR, 'feed.xml');

export function generateFeed() {
  if (!fs.existsSync(CONTENT_DIR)) return;

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  const items = files.map(file => {
    const raw = fs.readFileSync(resolve(CONTENT_DIR, file), 'utf8');
    const { data } = parseFrontmatter(raw);
    return data;
  });

  const rssItems = items.map(item => `    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${SITE_URL}/items/${item.id}/</link>
      <guid>${SITE_URL}/items/${item.id}/</guid>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${new Date(item.publishedDate).toUTCString()}</pubDate>
    </item>`).join('\n');

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} Feed</title>
    <link>${SITE_URL}</link>
    <description>Latest content and architecture updates from ${SITE_NAME}.</description>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${rssItems}
  </channel>
</rss>
`;

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  fs.writeFileSync(FEED_PATH, xmlContent, 'utf8');
  console.log(`[RSS Feed] Generated feed.xml with ${items.length} items using clean URLs.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateFeed();
}

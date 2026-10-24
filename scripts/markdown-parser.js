/**
 * Lightweight Zero-Dependency Markdown & Frontmatter Parser
 * Extracts YAML frontmatter key-values and parses core Markdown syntax into clean HTML.
 */

export function parseFrontmatter(rawContent) {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = rawContent.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content: rawContent.trim() };
  }

  const yamlBlock = match[1];
  const markdownBody = match[2].trim();
  const data = {};

  yamlBlock.split(/\r?\n/).forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      data[key] = value;
    }
  });

  return { data, content: markdownBody };
}

export function renderMarkdown(markdown) {
  let html = markdown;

  // Headings
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

  // Inline Code
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');

  // Images - converts local /images/ paths to high-efficiency picture markup
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, (match, alt, src) => {
    const isLocal = src.startsWith('/images/') || !src.startsWith('http');
    if (!isLocal) {
      return `<img src="${src}" alt="${alt}" loading="lazy" decoding="async">`;
    }
    const cleanBasename = src.replace(/^\/images\/(?:(?:480w|1200w)\/)?/, '').replace(/\.[^/.]+$/, '');
    return `<picture class="responsive-figure">
  <source type="image/avif" srcset="/images/480w/${cleanBasename}.avif 480w, /images/1200w/${cleanBasename}.avif 1200w" sizes="(max-width: 640px) 100vw, 1200px">
  <source type="image/webp" srcset="/images/480w/${cleanBasename}.webp 480w, /images/1200w/${cleanBasename}.webp 1200w" sizes="(max-width: 640px) 100vw, 1200px">
  <img src="/images/1200w/${cleanBasename}.jpg" alt="${alt}" loading="lazy" decoding="async">
</picture>`;
  });

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2">$1</a>');

  // Unordered list items
  html = html.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // Paragraphs
  const blocks = html.split(/\n{2,}/);
  const formattedBlocks = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('<h') || trimmed.startsWith('<ul') || trimmed.startsWith('<li') || trimmed.startsWith('<picture')) {
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
  });

  return formattedBlocks.filter(Boolean).join('\n');
}

export function calculateReadingMetrics(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return {
    wordCount: words,
    readingTimeMinutes: minutes,
    readingTimeLabel: `${minutes} min read`
  };
}

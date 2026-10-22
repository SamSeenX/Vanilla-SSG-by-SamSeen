/**
 * Generic Cross-Reference Linking Engine
 * Tokenizes HTML and uses single-pass regex replacement to safely inject
 * contextual internal links without nesting, breaking tags, or matching headings.
 */

export function crossLinkHtml(html, currentPath, dict) {
  const normalizedCurrent = '/' + currentPath.replace(/^\//, '').replace(/\\/g, '/');

  // Identify terms belonging to the current page to protect against self-referencing
  const ownTerms = dict
    .filter(i => {
      const itemPath = '/' + i.url.replace(/^\//, '');
      return itemPath === normalizedCurrent || normalizedCurrent.endsWith(itemPath);
    })
    .map(i => i.term)
    .sort((a, b) => b.length - a.length);

  // Usable terms pointing to OTHER pages
  const usableDict = dict.filter(item => {
    const itemPath = '/' + item.url.replace(/^\//, '');
    return itemPath !== normalizedCurrent && !normalizedCurrent.endsWith(itemPath);
  });

  if (usableDict.length === 0) return html;

  // Build lookup map: lowercase term -> { url, label }
  const termMap = new Map();
  usableDict.forEach(item => {
    termMap.set(item.term.toLowerCase(), item);
  });

  // Sort terms by length descending for regex alternation
  const termsSorted = Array.from(termMap.keys()).sort((a, b) => b.length - a.length);
  const escapedTerms = termsSorted.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const combinedRegex = new RegExp(`\\b(${escapedTerms.join('|')})\\b`, 'gi');

  const linkedUrls = new Set();

  const mainOpenMatch = html.match(/<main\b[^>]*>/i);
  const mainCloseMatch = html.match(/<\/main>/i);
  if (!mainOpenMatch || !mainCloseMatch) return html;

  const mainStartIndex = mainOpenMatch.index + mainOpenMatch[0].length;
  const mainEndIndex = mainCloseMatch.index;

  const preMain = html.slice(0, mainStartIndex);
  const mainContent = html.slice(mainStartIndex, mainEndIndex);
  const postMain = html.slice(mainEndIndex);

  const tokens = mainContent.split(/(<[^>]+>)/g);

  let insideLink = 0;
  let insideHeading = 0;
  let insideCode = 0;
  let insideScript = 0;
  let insideNav = 0;
  let insideProtectedDiv = 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!token) continue;

    if (token.startsWith('<')) {
      const lower = token.toLowerCase();

      if (/^<a\b/i.test(lower)) insideLink++;
      else if (/^<\/a>/i.test(lower)) insideLink = Math.max(0, insideLink - 1);

      if (/^<h[1-6]\b/i.test(lower)) insideHeading++;
      else if (/^<\/h[1-6]>/i.test(lower)) insideHeading = Math.max(0, insideHeading - 1);

      if (/^<(code|pre)\b/i.test(lower)) insideCode++;
      else if (/^<\/(code|pre)>/i.test(lower)) insideCode = Math.max(0, insideCode - 1);

      if (/^<(script|style|svg)\b/i.test(lower)) insideScript++;
      else if (/^<\/(script|style|svg)>/i.test(lower)) insideScript = Math.max(0, insideScript - 1);

      if (/^<(nav|button)\b/i.test(lower)) insideNav++;
      else if (/^<\/(nav|button)>/i.test(lower)) insideNav = Math.max(0, insideNav - 1);

      if (/<div\b[^>]*class="[^"]*(breadcrumbs|site-nav|header|footer)[^"]*"/i.test(token)) {
        insideProtectedDiv++;
      } else if (insideProtectedDiv > 0 && /^<\/div>/i.test(lower)) {
        insideProtectedDiv--;
      }

      continue;
    }

    if (insideLink > 0 || insideHeading > 0 || insideCode > 0 || insideScript > 0 || insideNav > 0 || insideProtectedDiv > 0) {
      continue;
    }

    let text = token;
    const masks = [];

    // Mask page's own entity terms so sub-words don't match inside them
    ownTerms.forEach((term, idx) => {
      const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const r = new RegExp(`\\b(${esc})\\b`, 'gi');
      text = text.replace(r, (m) => {
        const maskKey = `___PROTECTED_OWN_${idx}_${masks.length}___`;
        masks.push({ key: maskKey, value: m });
        return maskKey;
      });
    });

    // Single-pass replacement over pure text token
    text = text.replace(combinedRegex, (match) => {
      const item = termMap.get(match.toLowerCase());
      if (!item) return match;
      if (linkedUrls.has(item.url)) return match;

      linkedUrls.add(item.url);
      return `<a href="${item.url}" class="cross-ref-link" title="Explore ${item.label}">${match}</a>`;
    });

    // Restore masked own terms
    for (let m = masks.length - 1; m >= 0; m--) {
      text = text.replace(masks[m].key, masks[m].value);
    }

    tokens[i] = text;
  }

  return preMain + tokens.join('') + postMain;
}

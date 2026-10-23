/**
 * Structured Data (JSON-LD) Sub-Template
 * Generates valid schema.org objects for WebSite, Article, and BreadcrumbList.
 */

import { SITE_URL, SITE_NAME } from '../../../scripts/site-config.js';

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': SITE_NAME,
    'url': SITE_URL,
    'description': 'High performance, zero-hydration static site architecture.'
  };
}

export function getArticleSchema({ title, description, publishedDate, path, wordCount, readingTimeMinutes }) {
  const fullUrl = path.startsWith('http') ? path : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': title,
    'description': description,
    'datePublished': publishedDate,
    'mainEntityOfPage': fullUrl,
    'author': {
      '@type': 'Organization',
      'name': `${SITE_NAME} Community`
    }
  };

  if (wordCount) {
    schema.wordCount = wordCount;
  }
  if (readingTimeMinutes) {
    schema.timeRequired = `PT${readingTimeMinutes}M`;
  }

  return schema;
}

export function getBreadcrumbSchema(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((crumb, index) => {
      const crumbUrl = crumb.url.startsWith('http')
        ? crumb.url
        : `${SITE_URL}${crumb.url.startsWith('/') ? crumb.url : `/${crumb.url}`}`;
      return {
        '@type': 'ListItem',
        'position': index + 1,
        'name': crumb.name,
        'item': crumbUrl
      };
    })
  };
}

export function renderSchemaTag(schemaObject) {
  return `<script type="application/ld+json">\n${JSON.stringify(schemaObject, null, 2)}\n</script>`;
}

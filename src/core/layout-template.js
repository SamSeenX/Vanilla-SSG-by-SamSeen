/**
 * Core Layout Template Engine Façade
 * Aggregates modular sub-templates for backward-compatible consumption.
 */

export { NAV_ITEMS, getNavHtml } from './templates/nav.js';
export { getHeaderHtml } from './templates/header.js';
export { getFooterHtml } from './templates/footer.js';
export { getSeoMetaHtml } from './templates/seo.js';
export {
  getWebSiteSchema,
  getSoftwareApplicationSchema,
  getArticleSchema,
  getBreadcrumbSchema,
  renderSchemaTag
} from './templates/schema.js';

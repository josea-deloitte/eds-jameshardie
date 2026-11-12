/* Pure helpers for structured data and head metadata (no DOM access, unit tested). */

export const SITE_NAME = 'James Hardie';
export const SITE_ORIGIN = 'https://www.jameshardie.com';

/**
 * Resolves a possibly protocol-relative or relative URL to an absolute https URL.
 * @param {string} value URL from a meta tag
 * @param {string} base Page URL used to resolve relative values
 * @returns {string} absolute URL, or '' when the value cannot be parsed
 */
export function toAbsoluteUrl(value, base) {
  if (!value) return '';
  try {
    return new URL(value, base).href;
  } catch {
    return '';
  }
}

/**
 * Removes duplicate, empty and case-insensitive repeated keywords.
 * @param {string} content comma separated keywords
 * @returns {string} de-duplicated, comma separated keywords
 */
export function dedupeKeywords(content) {
  const seen = new Set();
  return (content || '')
    .split(',')
    .map((k) => k.trim())
    .filter((k) => {
      const key = k.toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .join(', ');
}

export function buildOrganization(logoUrl) {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_ORIGIN,
  };
  if (logoUrl) org.logo = logoUrl;
  return org;
}

export function buildWebSite() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_ORIGIN,
  };
}

const titleCase = (segment) => decodeURIComponent(segment)
  .replace(/[-_]+/g, ' ')
  .replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Builds a BreadcrumbList from the URL path. The last crumb uses the page title.
 * @returns {object|null} null on the home page (nothing to crumb)
 */
export function buildBreadcrumb(pathname, pageTitle, origin = SITE_ORIGIN) {
  const segments = pathname.split('/').filter(Boolean);
  if (!segments.length) return null;
  const items = [{ name: 'Home', url: `${origin}/` }];
  segments.forEach((segment, i) => {
    const last = i === segments.length - 1;
    items.push({
      name: last && pageTitle ? pageTitle : titleCase(segment),
      url: `${origin}/${segments.slice(0, i + 1).join('/')}`,
    });
  });
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Builds an Article from page metadata; returns null without a headline.
 */
export function buildArticle({
  headline, description, image, url, published, modified,
}) {
  if (!headline) return null;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    mainEntityOfPage: url,
    publisher: { '@type': 'Organization', name: SITE_NAME },
  };
  if (description) article.description = description;
  if (image) article.image = [image];
  if (published) article.datePublished = published;
  if (modified) article.dateModified = modified;
  return article;
}

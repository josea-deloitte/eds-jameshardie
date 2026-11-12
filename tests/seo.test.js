import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  toAbsoluteUrl, dedupeKeywords, buildBreadcrumb, buildArticle, buildOrganization,
} from '../scripts/seo.js';

test('toAbsoluteUrl resolves protocol-relative and relative URLs', () => {
  const base = 'https://www.jameshardie.com/a/b';
  assert.equal(toAbsoluteUrl('//images.example.com/x.jpg', base), 'https://images.example.com/x.jpg');
  assert.equal(toAbsoluteUrl('/media/x.jpg', base), 'https://www.jameshardie.com/media/x.jpg');
  assert.equal(toAbsoluteUrl('', base), '');
});

test('dedupeKeywords drops empties and case-insensitive repeats', () => {
  assert.equal(dedupeKeywords('siding, Siding, , trim,trim '), 'siding, trim');
  assert.equal(dedupeKeywords(undefined), '');
});

test('buildBreadcrumb returns null on the home page', () => {
  assert.equal(buildBreadcrumb('/', 'Home'), null);
});

test('buildBreadcrumb builds ordered crumbs and titles the last one', () => {
  const list = buildBreadcrumb('/products/fiber-cement-siding', 'Fiber Cement Siding | James Hardie');
  const names = list.itemListElement.map((i) => i.name);
  assert.deepEqual(names, ['Home', 'Products', 'Fiber Cement Siding | James Hardie']);
  assert.equal(list.itemListElement[2].position, 3);
  assert.equal(list.itemListElement[1].item, 'https://www.jameshardie.com/products');
});

test('buildArticle needs a headline and omits empty fields', () => {
  assert.equal(buildArticle({}), null);
  const article = buildArticle({ headline: 'H', url: 'https://x.test/a' });
  assert.equal(article.headline, 'H');
  assert.equal('image' in article, false);
});

test('buildOrganization includes the logo only when given', () => {
  assert.equal('logo' in buildOrganization(), false);
  assert.equal(buildOrganization('https://x.test/l.png').logo, 'https://x.test/l.png');
});

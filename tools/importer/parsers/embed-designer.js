/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-designer.
 * Source: div.base-container-background wrapping #hover-website-embed with a
 * hover.to designer iframe and a footer bar holding the "Hover" logo link.
 *
 * Output: one cell -> [optional heading (iframe title), link to the designer
 * embed-container URL, "Hover" attribution link].
 *
 * The iframe URL carries runtime/session params injected by the Hover loader
 * script (consent flags, embeddedAt, GA/Amplitude ids). Only the stable
 * configuration params are kept.
 */
const KEEP_PARAMS = ['isEmbed', 'embedConfigId', 'colorMode', 'aff_org_id'];

function cleanEmbedUrl(src) {
  try {
    const url = new URL(src, 'https://hover.to');
    const clean = new URL(`${url.origin}${url.pathname}`);
    KEEP_PARAMS.forEach((k) => {
      if (url.searchParams.has(k)) clean.searchParams.set(k, url.searchParams.get(k));
    });
    return clean.toString();
  } catch (e) {
    return src;
  }
}

export default function parse(element, { document }) {
  const cell = [];

  const iframe = element.querySelector('iframe[src*="hover.to"]');
  if (iframe) {
    const title = (iframe.getAttribute('title') || '').trim();
    if (title) {
      const h2 = document.createElement('h2');
      h2.textContent = title;
      cell.push(h2);
    }
    const href = cleanEmbedUrl(iframe.getAttribute('src'));
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = href;
    p.append(a);
    cell.push(p);
  }

  // Attribution link: the source anchor only holds an SVG logo (no text), so
  // rebuild it with a text label.
  const footerLink = element.querySelector('#hover-website-embed-footer a[href], a#hover-website-embed-footer-logo');
  if (footerLink && footerLink.getAttribute('href')) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = footerLink.getAttribute('href');
    a.textContent = footerLink.textContent.trim() || 'Hover';
    p.append(a);
    cell.push(p);
  }

  const cells = [[cell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-designer', cells });
  element.replaceWith(block);
}

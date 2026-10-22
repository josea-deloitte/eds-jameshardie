/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-social.
 * Source: Sprinklr gallery mount div.swe_embed#sprinklr-embed-{clientId}-{embedId}
 * (posts are rendered at runtime by the Sprinklr script; rendered posts are not
 * authored content). An empty sibling div.swe_embed_controls is removed too.
 *
 * Output: one cell -> link to
 * https://gallery.sprinklr.com/clients/{clientId}/embeds/{embedId}/script.js
 */
const DEFAULT_CLIENT_ID = '24392';

export default function parse(element, { document }) {
  const id = element.id || '';
  let clientId = DEFAULT_CLIENT_ID;
  let embedId = '';

  const match = id.match(/^sprinklr-embed-(\d+)-(.+)$/);
  if (match) {
    [, clientId, embedId] = match;
  } else {
    // fall back to the class token sprinklr-embed-{clientId}-{embedId}
    const cls = [...element.classList].find((c) => /^sprinklr-embed-\d+-/.test(c));
    const m = cls && cls.match(/^sprinklr-embed-(\d+)-(.+)$/);
    if (m) [, clientId, embedId] = m;
  }

  // Remove the empty Sprinklr controls mount next to the gallery
  const parent = element.parentElement;
  if (parent) {
    parent.querySelectorAll(':scope > .swe_embed_controls').forEach((c) => {
      if (!c.textContent.trim()) c.remove();
    });
  }

  const cell = [];
  if (embedId) {
    const src = `https://gallery.sprinklr.com/clients/${clientId}/embeds/${embedId}/script.js`;
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = src;
    a.textContent = src;
    p.append(a);
    cell.push(p);
  }

  const cells = [[cell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-social', cells });
  element.replaceWith(block);
}

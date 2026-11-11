import { createOptimizedPicture } from '../../scripts/aem.js';

const ICON_VARIANTS = ['icon', 'popular-link'];
const LINK_VARIANTS = ['help', 'popular-link'];

/**
 * Cards block. Each row is a card: an optional image/icon cell plus a body cell
 * (title, text, optional link/CTA). Variants: icon, help, popular-link, stat, product.
 * @param {Element} block The cards block element
 */
export default function decorate(block) {
  const isIcon = ICON_VARIANTS.some((v) => block.classList.contains(v));
  const isLinked = LINK_VARIANTS.some((v) => block.classList.contains(v));

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      const hasMedia = div.children.length === 1 && div.querySelector('picture, .icon');
      if (hasMedia && isIcon) div.className = 'cards-card-icon';
      else if (hasMedia) div.className = 'cards-card-image';
      else if (div.textContent.trim() || div.children.length) div.className = 'cards-card-body';
      else div.remove(); // omitted/empty cell
    });
    const links = li.querySelectorAll('.cards-card-body a[href]');
    if (isLinked && links.length === 1) li.classList.add('cards-card-linked');
    if (li.children.length) ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    if (/\.svg(\?|$)/i.test(img.src)) return; // keep vector icons as authored
    img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]));
  });
  block.replaceChildren(ul);
}

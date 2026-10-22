/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-hotspot.
 * Source: Splide carousel (div.slim .splide) of product photos. Each slide has
 * one or more hotspot <button>s (inline style "left: x%; top: y%") each followed
 * by a popover div holding H5 product name, color paragraph and "View product" link.
 *
 * Output: one row per slide -> [image] | [per hotspot: H5, "x% y%" position paragraph, color p, link].
 *
 * Position: source left/top is the top-left corner of a 40px button inside a
 * 410x516 (desktop) slide; the block centers its button on the point, so the
 * values are shifted by half the button size to keep the visual position.
 */
const BUTTON_HALF_PX = 20;
const SLIDE_W = 410;
const SLIDE_H = 516;

function readPosition(btn) {
  const style = btn.getAttribute('style') || '';
  const left = style.match(/left:\s*(-?[\d.]+)%/i);
  const top = style.match(/top:\s*(-?[\d.]+)%/i);
  if (!left || !top) return null;
  const x = parseFloat(left[1]) + (BUTTON_HALF_PX / SLIDE_W) * 100;
  const y = parseFloat(top[1]) + (BUTTON_HALF_PX / SLIDE_H) * 100;
  const fmt = (n) => String(Math.round(Math.max(0, Math.min(100, n)) * 10) / 10);
  return `${fmt(x)}% ${fmt(y)}%`;
}

export default function parse(element, { document }) {
  const cells = [];

  const slides = [...element.querySelectorAll('li.splide__slide')]
    .filter((li) => !li.classList.contains('splide__slide--clone'));

  slides.forEach((slide) => {
    // Image cell: product photo (skip data: SVG icons in buttons/links)
    const img = [...slide.querySelectorAll('img')]
      .find((i) => !(i.getAttribute('src') || '').startsWith('data:') && !i.closest('button, a'));
    const imageCell = [];
    if (img) {
      const pic = document.createElement('img');
      pic.src = img.getAttribute('src');
      pic.alt = img.getAttribute('alt') || '';
      imageCell.push(pic);
    }

    // Hotspot cell: each popover is anchored by its heading (h5)
    const hotspotCell = [];
    [...slide.querySelectorAll('h5')].forEach((srcHeading) => {
      const popover = srcHeading.closest('div.absolute') || srcHeading.parentElement;
      let btn = popover ? popover.previousElementSibling : null;
      if (btn && btn.tagName !== 'BUTTON') btn = null;

      const h5 = document.createElement('h5');
      h5.innerHTML = srcHeading.innerHTML.trim();
      hotspotCell.push(h5);

      const pos = btn ? readPosition(btn) : null;
      if (pos) {
        const p = document.createElement('p');
        p.textContent = pos;
        hotspotCell.push(p);
      }

      const scope = srcHeading.parentElement;
      const color = scope ? scope.querySelector('p') : null;
      if (color && color.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = color.textContent.trim();
        hotspotCell.push(p);
      }

      const link = scope ? scope.querySelector('a[href]') : null;
      if (link) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = link.getAttribute('href');
        a.textContent = link.textContent.trim() || 'View product';
        p.append(a);
        hotspotCell.push(p);
      }
    });

    if (!imageCell.length && !hotspotCell.length) return;
    cells.push([imageCell, hotspotCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hotspot', cells });
  element.replaceWith(block);
}

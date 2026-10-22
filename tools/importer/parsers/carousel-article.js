/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-article.
 * Source: Splide carousel of blog article cards (li.splide__slide).
 * Output: one row per slide -> [image] | [H3 linked title, paragraph of category links].
 */
export default function parse(element, { document }) {
  const cells = [];

  // Real slides only (skip Splide loop clones if present)
  const slides = [...element.querySelectorAll('li.splide__slide')]
    .filter((li) => !li.classList.contains('splide__slide--clone'));

  slides.forEach((slide) => {
    // Article link wraps the image and the title; tag pills are separate links
    const pillLinks = [...slide.querySelectorAll('a[id^="topic-pill"]')];
    const articleLink = [...slide.querySelectorAll('a[href]')].find((a) => !pillLinks.includes(a));
    const href = articleLink ? articleLink.getAttribute('href') : '';

    // Image cell: article photo (skip the inline SVG arrow icon)
    const img = [...slide.querySelectorAll('img')]
      .find((i) => !(i.getAttribute('src') || '').startsWith('data:'));
    const imageCell = [];
    if (img) {
      const pic = document.createElement('img');
      pic.src = img.getAttribute('src');
      pic.alt = img.getAttribute('alt') || '';
      imageCell.push(pic);
    }

    // Content cell: H3 title linked to the article + category pill links
    const contentCell = [];
    const srcTitle = slide.querySelector('h3, .card-title');
    if (srcTitle) {
      const h3 = document.createElement('h3');
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.innerHTML = srcTitle.innerHTML.trim();
        h3.append(a);
      } else {
        h3.innerHTML = srcTitle.innerHTML.trim();
      }
      contentCell.push(h3);
    }

    if (pillLinks.length) {
      const p = document.createElement('p');
      pillLinks.forEach((pill, i) => {
        if (i > 0) p.append(document.createTextNode(' '));
        const a = document.createElement('a');
        a.href = pill.getAttribute('href');
        a.textContent = pill.textContent.trim();
        p.append(a);
      });
      contentCell.push(p);
    }

    if (!imageCell.length && !contentCell.length) return;
    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-article', cells });
  element.replaceWith(block);
}

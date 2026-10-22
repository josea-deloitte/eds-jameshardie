/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-video.
 * Source: Splide carousel (div.my-10 > div.splide) of portrait video cards.
 * Each li.splide__slide holds a react-player <video src poster> and an H5 title.
 *
 * Output: one row per slide -> [poster image] | [H5 title, link to MP4].
 */
export default function parse(element, { document }) {
  const cells = [];

  const slides = [...element.querySelectorAll('li.splide__slide')]
    .filter((li) => !li.classList.contains('splide__slide--clone'));

  slides.forEach((slide) => {
    const video = slide.querySelector('video');
    const source = video ? video.querySelector('source[src]') : null;
    const videoSrc = (video && video.getAttribute('src')) || (source && source.getAttribute('src')) || '';
    const srcTitle = slide.querySelector('h5, h4, h3');

    // Poster cell: video poster attribute, or a real <img> fallback
    const posterCell = [];
    let posterSrc = video ? video.getAttribute('poster') : '';
    let posterAlt = '';
    if (!posterSrc) {
      const img = [...slide.querySelectorAll('img')]
        .find((i) => !(i.getAttribute('src') || '').startsWith('data:'));
      if (img) {
        posterSrc = img.getAttribute('src');
        posterAlt = img.getAttribute('alt') || '';
      }
    }
    if (posterSrc) {
      const img = document.createElement('img');
      img.src = posterSrc;
      img.alt = posterAlt || (srcTitle ? srcTitle.textContent.trim() : '');
      posterCell.push(img);
    }

    // Content cell: H5 title + link to the MP4
    const contentCell = [];
    if (srcTitle) {
      const h5 = document.createElement('h5');
      h5.innerHTML = srcTitle.innerHTML.trim();
      contentCell.push(h5);
    }
    if (videoSrc) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = videoSrc;
      a.textContent = videoSrc;
      p.append(a);
      contentCell.push(p);
    }

    if (!posterCell.length && !contentCell.length) return;
    cells.push([posterCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-video', cells });
  element.replaceWith(block);
}

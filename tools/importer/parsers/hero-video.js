/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-video.
 * Source: div.hero-video-overlay with a poster <img> (.hero-cover), a react-player
 * <video src> background, and a content column (H1, subheading div, CTA link).
 *
 * Output (1 column):
 *   Row 1: poster image + link to the MP4
 *   Row 2: H1, subheading paragraph, CTA link (bold when it is a primary button)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: poster + video link
  const mediaCell = [];
  const posterImg = element.querySelector('.hero-cover img')
    || [...element.querySelectorAll('img')].find((i) => !(i.getAttribute('src') || '').startsWith('data:') && !i.closest('button, a'));
  const video = element.querySelector('video');
  const videoSrc = video
    ? (video.getAttribute('src') || (video.querySelector('source[src]') || { getAttribute: () => '' }).getAttribute('src'))
    : '';
  const posterSrc = (posterImg && posterImg.getAttribute('src')) || (video && video.getAttribute('poster')) || '';
  if (posterSrc) {
    const img = document.createElement('img');
    img.src = posterSrc;
    img.alt = (posterImg && posterImg.getAttribute('alt')) || '';
    mediaCell.push(img);
  }
  if (videoSrc) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = videoSrc;
    a.textContent = videoSrc;
    p.append(a);
    mediaCell.push(p);
  }
  if (mediaCell.length) cells.push([mediaCell]);

  // Row 2: text content
  const contentCell = [];
  const heading = element.querySelector('h1, h2');
  const contentRoot = heading ? heading.parentElement : element;
  if (heading) {
    const h1 = document.createElement('h1');
    h1.innerHTML = heading.innerHTML.trim();
    contentCell.push(h1);
  }

  // Subheading: text blocks in the content column that are not the heading or CTA
  [...contentRoot.children].forEach((child) => {
    if (child === heading || child.tagName === 'A' || child.querySelector('a, h1, h2')) return;
    if (!child.textContent.trim()) return;
    const p = document.createElement('p');
    p.innerHTML = child.innerHTML.trim();
    contentCell.push(p);
  });

  // CTA(s)
  [...contentRoot.querySelectorAll('a[href]')].forEach((cta) => {
    const text = cta.textContent.trim();
    if (!text) return;
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = cta.getAttribute('href');
    a.textContent = text;
    if (/button-primary|bg-primary-color-pure/.test(cta.className || '')) {
      const strong = document.createElement('strong');
      strong.append(a);
      p.append(strong);
    } else {
      p.append(a);
    }
    contentCell.push(p);
  });

  if (contentCell.length) cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-video', cells });
  element.replaceWith(block);
}

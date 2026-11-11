import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Hero block. Authoring: row 1 = image (optional), row 2 = content
 * (optional eyebrow paragraph, H1, paragraph, buttons).
 * Tolerates a single row, or image and content in the same row.
 * Buttons are decorated globally from bold/italic links.
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const picture = block.querySelector('picture');
  const contentCell = cells.find((cell) => cell.querySelector('h1, h2, p:not(:has(picture))'))
    || null;

  const media = document.createElement('div');
  media.className = 'hero-media';
  if (picture) {
    const img = picture.querySelector('img');
    const optimized = img
      ? createOptimizedPicture(img.src, img.alt, true, [{ media: '(min-width: 1024px)', width: '2000' }, { width: '750' }])
      : picture;
    media.append(optimized);
  }

  const content = document.createElement('div');
  content.className = 'hero-content';
  if (contentCell) {
    contentCell.querySelectorAll('picture').forEach((pic) => {
      if (pic.parentElement.tagName === 'P' && !pic.parentElement.textContent.trim()) {
        pic.parentElement.remove();
      } else {
        pic.remove();
      }
    });
    content.append(...contentCell.childNodes);
    const heading = content.querySelector('h1, h2');
    const prev = heading?.previousElementSibling;
    if (prev && prev.tagName === 'P' && !prev.querySelector('a')) prev.classList.add('hero-eyebrow');
  }

  block.classList.toggle('hero-has-media', !!picture);
  block.replaceChildren(...(picture ? [media] : []), content);
}

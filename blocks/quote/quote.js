import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Quote block. Row 1 = portrait image (optional), row 2 = quote text,
 * row 3 = author name (first line) and role (second line).
 * Rows are identified by content so omitted rows do not break the block.
 * @param {Element} block The quote block element
 */
export default function decorate(block) {
  const rows = [...block.children].map((row) => row.firstElementChild || row);
  const imageCell = rows.find((cell) => cell.querySelector('picture, img'));
  const textCells = rows.filter((cell) => cell !== imageCell && cell.textContent.trim());
  const [quoteCell, authorCell] = textCells;

  const figure = document.createElement('figure');
  figure.className = 'quote-figure';

  if (imageCell) {
    const img = imageCell.querySelector('img');
    const media = document.createElement('div');
    media.className = 'quote-image';
    media.append(createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]));
    figure.append(media);
  }

  const content = document.createElement('div');
  content.className = 'quote-content';

  if (quoteCell) {
    const blockquote = document.createElement('blockquote');
    blockquote.className = 'quote-text';
    blockquote.append(...quoteCell.childNodes);
    content.append(blockquote);
  }

  if (authorCell) {
    const caption = document.createElement('figcaption');
    caption.className = 'quote-author';
    const lines = authorCell.innerHTML
      .split(/<br\s*\/?>|<\/p>\s*<p[^>]*>/i)
      .map((html) => {
        const span = document.createElement('span');
        span.innerHTML = html.replace(/<\/?p[^>]*>/gi, '').trim();
        return span;
      })
      .filter((span) => span.textContent.trim());
    if (lines[0]) lines[0].className = 'quote-author-name';
    if (lines[1]) lines[1].className = 'quote-author-role';
    caption.append(...lines);
    content.append(caption);
  }

  figure.append(content);
  block.replaceChildren(figure);
}

import { toClassName } from '../../scripts/aem.js';

/**
 * Applies section metadata to its parent section when the backend has not
 * already done so (e.g. local preview of .plain.html content).
 * "style" values become section classes, other keys become data attributes.
 * @param {Element} block The section-metadata block element
 */
export default function decorate(block) {
  const section = block.closest('.section');
  if (section) {
    [...block.children].forEach((row) => {
      const [keyCell, valueCell] = row.children;
      const key = toClassName(keyCell?.textContent || '');
      const value = valueCell?.textContent.trim() || '';
      if (!key || !value) return;
      if (key === 'style') {
        value.split(',').map((s) => toClassName(s.trim())).filter(Boolean)
          .forEach((cls) => section.classList.add(cls));
      } else {
        section.dataset[key.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
      }
    });
  }
  (block.parentElement?.classList.contains('section-metadata-wrapper') ? block.parentElement : block).remove();
}

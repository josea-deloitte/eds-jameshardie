import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK = 'gallery';

/**
 * Reads one authored row: picture, optional caption text and optional link.
 * @param {Element} row the authored row
 * @returns {object|null} item data, or null when the row has no image
 */
function parseRow(row) {
  const img = row.querySelector('picture img, img');
  if (!img) return null;
  const textLink = [...row.querySelectorAll('a[href]')].find((a) => !a.querySelector('img'));
  const imgLink = img.closest('a[href]');
  const link = textLink || imgLink;
  const caption = [...row.querySelectorAll('p')]
    .filter((p) => !p.querySelector('picture, img, a') && p.textContent.trim())
    .map((p) => p.textContent.trim())
    .join(' ');
  return {
    src: img.currentSrc || img.src,
    alt: img.getAttribute('alt') || '',
    caption,
    href: link ? link.href : '',
    linkText: textLink && textLink.textContent.trim() ? textLink.textContent.trim() : 'Learn more',
  };
}

/** Image path without any query string, so createOptimizedPicture can size it. */
function bigSource(src) {
  return new URL(src, window.location.href).pathname;
}

function getDialog(block, items) {
  let dialog = block.querySelector(`:scope > .${BLOCK}-dialog`);
  if (dialog) return dialog;

  dialog = document.createElement('dialog');
  dialog.className = `${BLOCK}-dialog`;
  dialog.setAttribute('aria-label', 'Image gallery');
  dialog.innerHTML = `
    <button type="button" class="${BLOCK}-close" aria-label="Close gallery"></button>
    <button type="button" class="${BLOCK}-prev" aria-label="Previous image"></button>
    <figure class="${BLOCK}-figure">
      <div class="${BLOCK}-stage"></div>
      <figcaption class="${BLOCK}-caption"></figcaption>
    </figure>
    <button type="button" class="${BLOCK}-next" aria-label="Next image"></button>
    <p class="${BLOCK}-status" aria-live="polite"></p>`;

  const stage = dialog.querySelector(`.${BLOCK}-stage`);
  const caption = dialog.querySelector(`.${BLOCK}-caption`);
  const status = dialog.querySelector(`.${BLOCK}-status`);
  const prev = dialog.querySelector(`.${BLOCK}-prev`);
  const next = dialog.querySelector(`.${BLOCK}-next`);
  dialog.index = 0;

  dialog.showItem = (index) => {
    const count = items.length;
    dialog.index = ((index % count) + count) % count;
    const item = items[dialog.index];
    const picture = createOptimizedPicture(
      bigSource(item.src),
      item.alt,
      true,
      [{ media: '(width >= 1024px)', width: '2000' }, { width: '1000' }],
    );
    stage.replaceChildren(picture);
    caption.replaceChildren();
    if (item.caption) {
      const text = document.createElement('span');
      text.textContent = item.caption;
      caption.append(text);
    }
    if (item.href) {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.linkText;
      caption.append(a);
    }
    caption.hidden = !caption.childElementCount;
    status.textContent = `Image ${dialog.index + 1} of ${count}`;
  };

  const step = (dir) => dialog.showItem(dialog.index + dir);
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  dialog.querySelector(`.${BLOCK}-close`).addEventListener('click', () => dialog.close());
  if (items.length < 2) {
    prev.hidden = true;
    next.hidden = true;
  }

  dialog.addEventListener('keydown', (e) => {
    if (items.length < 2) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    }
  });
  // a click on the backdrop (the dialog element itself) closes
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove(`${BLOCK}-open`);
    stage.replaceChildren();
    if (dialog.returnFocusTo && dialog.returnFocusTo.isConnected) dialog.returnFocusTo.focus();
  });

  block.append(dialog);
  return dialog;
}

export default function decorate(block) {
  const items = [...block.children].map(parseRow).filter(Boolean);

  const list = document.createElement('ul');
  list.className = `${BLOCK}-grid`;

  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = `${BLOCK}-item`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = `${BLOCK}-trigger`;
    const label = item.alt || item.caption || `Image ${index + 1}`;
    button.setAttribute('aria-label', `View larger: ${label}`);
    button.setAttribute('aria-haspopup', 'dialog');

    const featured = block.classList.contains('featured') && index === 0;
    const picture = createOptimizedPicture(
      bigSource(item.src),
      item.alt,
      false,
      featured
        ? [{ media: '(width >= 1024px)', width: '1000' }, { width: '700' }]
        : [{ media: '(width >= 1024px)', width: '500' }, { width: '400' }],
    );
    button.append(picture);
    li.append(button);
    list.append(li);

    button.addEventListener('click', () => {
      const dialog = getDialog(block, items);
      dialog.returnFocusTo = button;
      dialog.showItem(index);
      document.body.classList.add(`${BLOCK}-open`);
      dialog.showModal();
      dialog.querySelector(`.${BLOCK}-close`).focus();
    });
  });

  block.replaceChildren(list);
}

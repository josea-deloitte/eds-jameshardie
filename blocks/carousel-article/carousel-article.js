import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK = 'carousel-article';

/**
 * Wires prev/next arrows and the progress bar to a horizontally scrolling track.
 * @param {Element} block the block element
 * @param {Element} track the scrolling list
 */
function bindCarousel(block, track) {
  const prev = block.querySelector(`.${BLOCK}-prev`);
  const next = block.querySelector(`.${BLOCK}-next`);
  const bar = block.querySelector(`.${BLOCK}-progress`);
  const slides = () => [...track.children];

  const offsetOf = (slide) => slide.offsetLeft - track.firstElementChild.offsetLeft;

  const currentIndex = () => {
    const list = slides();
    const idx = list.findIndex((s) => offsetOf(s) >= track.scrollLeft - 2);
    return idx < 0 ? list.length - 1 : idx;
  };

  const go = (dir) => {
    const list = slides();
    if (!list.length) return;
    const target = Math.max(0, Math.min(list.length - 1, currentIndex() + dir));
    track.scrollTo({ left: offsetOf(list[target]), behavior: 'smooth' });
  };

  let ticking = false;
  const update = () => {
    ticking = false;
    const max = track.scrollWidth - track.clientWidth;
    const overflow = max > 1;
    block.classList.toggle('no-overflow', !overflow);
    prev.disabled = !overflow || track.scrollLeft <= 1;
    next.disabled = !overflow || track.scrollLeft >= max - 1;
    // like the source (Splide): bar = (current position + 1) / number of positions
    const list = slides();
    const positions = list.filter((s) => offsetOf(s) < max - 1).length + 1;
    const index = track.scrollLeft >= max - 1
      ? positions - 1
      : Math.min(currentIndex(), positions - 1);
    const ratio = overflow ? (index + 1) / positions : 1;
    bar.style.setProperty('--carousel-progress', `${ratio * 100}%`);
  };
  const schedule = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  track.addEventListener('scroll', schedule, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(schedule).observe(track);
  window.addEventListener('resize', schedule);
  update();
}

// source icons (stroke follows currentColor)
const ARROW_ICON = '<svg width="18" height="16" viewBox="0 0 18 16" fill="none" aria-hidden="true" focusable="false"><path d="M16.5 8L1.5 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 1L1.5 8L8.5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const CARD_ICON = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M4 20.25L19.91 4.34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.91003 4.33997H19.91V19.34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function buildControls() {
  const controls = document.createElement('div');
  controls.className = `${BLOCK}-controls`;
  controls.innerHTML = `
    <div class="${BLOCK}-nav">
      <button type="button" class="${BLOCK}-prev" aria-label="Previous slide">${ARROW_ICON}</button>
      <button type="button" class="${BLOCK}-next" aria-label="Next slide">${ARROW_ICON}</button>
    </div>
    <div class="${BLOCK}-progress" aria-hidden="true"><span></span></div>`;
  return controls;
}

/**
 * Only same-origin (media bus) images can be resized via query params;
 * external sources such as images.ctfassets.net reject them.
 */
function isOptimizable(src) {
  try {
    return new URL(src, window.location.href).origin === window.location.origin;
  } catch (e) {
    return false;
  }
}

/**
 * Builds one article card from an authored row (image cell + content cell).
 * Tolerates a single cell holding everything, or extra cells.
 */
function buildCard(row) {
  const li = document.createElement('li');
  li.className = `${BLOCK}-slide`;

  const picture = row.querySelector('picture');
  const media = document.createElement('div');
  media.className = `${BLOCK}-image`;
  if (picture) {
    const wrapper = picture.parentElement;
    const img = picture.querySelector('img');
    const optimized = img && isOptimizable(img.src)
      ? createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 1024px)', width: '750' }, { width: '600' }])
      : picture;
    // appending moves the authored picture; only a replacement needs the original removed
    if (optimized !== picture) picture.remove();
    media.append(optimized);
    if (wrapper && wrapper.tagName === 'P' && !wrapper.children.length && !wrapper.textContent.trim()) {
      wrapper.remove();
    }
  }

  const body = document.createElement('div');
  body.className = `${BLOCK}-body`;
  [...row.children].forEach((cell) => body.append(...cell.childNodes));
  [...body.children].forEach((el) => {
    if (!el.textContent.trim() && !el.querySelector('img, a')) el.remove();
  });

  const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
  const titleLink = heading ? heading.querySelector('a[href]') : body.querySelector('a[href]');
  if (heading) heading.classList.add(`${BLOCK}-title`);
  if (titleLink) {
    titleLink.classList.add(`${BLOCK}-title-link`);
    // wrap the title text so it can be line-clamped next to the icon
    const text = document.createElement('span');
    text.className = `${BLOCK}-title-text`;
    text.append(...titleLink.childNodes);
    const arrow = document.createElement('span');
    arrow.className = `${BLOCK}-arrow`;
    arrow.setAttribute('aria-hidden', 'true');
    arrow.innerHTML = CARD_ICON;
    titleLink.append(text, arrow);
    if (media.firstElementChild) {
      // make the image clickable without adding a second tab stop
      const imgLink = document.createElement('a');
      // keep the authored (relative) href so both links resolve identically
      imgLink.setAttribute('href', titleLink.getAttribute('href'));
      imgLink.tabIndex = -1;
      imgLink.setAttribute('aria-hidden', 'true');
      imgLink.append(...media.childNodes);
      media.append(imgLink);
    }
  }

  // remaining links are category tags
  body.querySelectorAll('a[href]').forEach((a) => {
    if (a === titleLink) return;
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    a.classList.add(`${BLOCK}-tag`);
    const p = a.closest('p');
    if (p) {
      p.classList.remove('button-wrapper');
      p.classList.add(`${BLOCK}-tags`);
    }
  });

  if (media.firstElementChild) li.append(media);
  li.append(body);
  return li;
}

export default function decorate(block) {
  const rows = [...block.children];
  const track = document.createElement('ul');
  track.className = `${BLOCK}-track`;

  rows.forEach((row) => {
    if (!row.textContent.trim() && !row.querySelector('picture')) return;
    track.append(buildCard(row));
  });

  const viewport = document.createElement('div');
  viewport.className = `${BLOCK}-viewport`;
  viewport.append(track);

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  if (!block.getAttribute('aria-label')) block.setAttribute('aria-label', 'Articles');
  block.replaceChildren(viewport, buildControls());

  if (!track.children.length) return;
  bindCarousel(block, track);
}

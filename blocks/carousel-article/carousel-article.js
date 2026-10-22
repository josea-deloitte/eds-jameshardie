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
    const { scrollLeft, clientWidth, scrollWidth } = track;
    const ratio = scrollWidth ? (scrollLeft + clientWidth) / scrollWidth : 1;
    bar.style.setProperty('--carousel-progress', `${Math.min(1, ratio) * 100}%`);
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

function buildControls() {
  const controls = document.createElement('div');
  controls.className = `${BLOCK}-controls`;
  controls.innerHTML = `
    <div class="${BLOCK}-progress" aria-hidden="true"><span></span></div>
    <div class="${BLOCK}-nav">
      <button type="button" class="${BLOCK}-prev" aria-label="Previous slide"></button>
      <button type="button" class="${BLOCK}-next" aria-label="Next slide"></button>
    </div>`;
  return controls;
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
    const optimized = img
      ? createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 1024px)', width: '750' }, { width: '600' }])
      : picture;
    media.append(optimized);
    picture.remove();
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
    const arrow = document.createElement('span');
    arrow.className = `${BLOCK}-arrow`;
    arrow.setAttribute('aria-hidden', 'true');
    titleLink.append(arrow);
    if (media.firstElementChild) {
      // make the image clickable without adding a second tab stop
      const imgLink = document.createElement('a');
      imgLink.href = titleLink.href;
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

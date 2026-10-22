import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK = 'carousel-hotspot';

// "40% 60%", "40, 60", "x: 40, y: 60", "x=40 y=60" -> left/top percentages
const POSITION_RE = /^\s*(?:x\s*[:=]\s*)?(\d{1,3}(?:\.\d+)?)\s*%?\s*(?:[,;/]|\s)\s*(?:y\s*[:=]\s*)?(\d{1,3}(?:\.\d+)?)\s*%?\s*$/i;

// fallback positions when an author omits coordinates
const DEFAULT_POSITIONS = [[50, 50], [30, 35], [70, 65], [25, 70], [75, 30]];

const clamp = (n) => Math.max(4, Math.min(96, n));

let hotspotId = 0;

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

function closeAll(block, except) {
  block.querySelectorAll(`.${BLOCK}-hotspot.is-open`).forEach((spot) => {
    if (spot === except) return;
    spot.classList.remove('is-open');
    const btn = spot.querySelector(`.${BLOCK}-hotspot-button`);
    const card = spot.querySelector(`.${BLOCK}-hotspot-card`);
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (card) card.hidden = true;
  });
}

/**
 * Splits the hotspot cell into groups. Each heading starts a new group;
 * anything before the first heading belongs to the first group.
 */
function splitGroups(nodes) {
  const groups = [];
  let current = null;
  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
    const isHeading = node.nodeType === Node.ELEMENT_NODE && /^H[1-6]$/.test(node.tagName);
    if (!current || (isHeading && current.some((n) => /^H[1-6]$/.test(n.tagName || '')))) {
      current = [];
      groups.push(current);
    }
    current.push(node);
  });
  return groups.filter((g) => g.some((n) => n.textContent.trim() || (n.querySelector && n.querySelector('a, img'))));
}

function buildHotspot(block, group, index) {
  hotspotId += 1;
  const id = `${BLOCK}-card-${hotspotId}`;

  let pos = null;
  const content = [];
  group.forEach((node) => {
    const match = !pos && node.nodeType === Node.ELEMENT_NODE && node.tagName === 'P'
      && !node.querySelector('a, img') ? node.textContent.match(POSITION_RE) : null;
    if (match) pos = [parseFloat(match[1]), parseFloat(match[2])];
    else content.push(node);
  });
  const [x, y] = (pos || DEFAULT_POSITIONS[index % DEFAULT_POSITIONS.length]).map(clamp);

  const spot = document.createElement('div');
  spot.className = `${BLOCK}-hotspot`;
  spot.style.setProperty('--hotspot-x', `${x}%`);
  spot.style.setProperty('--hotspot-y', `${y}%`);
  if (x > 55) spot.classList.add('is-left');
  if (y > 55) spot.classList.add('is-up');

  const heading = content.find((n) => /^H[1-6]$/.test(n.tagName || ''));
  const label = heading ? heading.textContent.trim() : 'product';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = `${BLOCK}-hotspot-button`;
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', id);
  button.setAttribute('aria-label', `Show details: ${label}`);

  const card = document.createElement('div');
  card.className = `${BLOCK}-hotspot-card`;
  card.id = id;
  card.hidden = true;
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-label', label);

  const close = document.createElement('button');
  close.type = 'button';
  close.className = `${BLOCK}-hotspot-close`;
  close.setAttribute('aria-label', 'Close');

  const body = document.createElement('div');
  body.className = `${BLOCK}-hotspot-body`;
  body.append(...content);
  if (heading) heading.classList.add(`${BLOCK}-hotspot-title`);
  body.querySelectorAll('a[href]').forEach((a) => {
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    a.classList.add(`${BLOCK}-hotspot-link`);
    const p = a.closest('p');
    if (p) p.classList.remove('button-wrapper');
  });

  card.append(close, body);
  spot.append(button, card);

  const setOpen = (open) => {
    if (open) closeAll(block, spot);
    spot.classList.toggle('is-open', open);
    button.setAttribute('aria-expanded', String(open));
    card.hidden = !open;
  };
  button.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!spot.classList.contains('is-open'));
  });
  close.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(false);
    button.focus();
  });
  card.addEventListener('click', (e) => e.stopPropagation());
  spot.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && spot.classList.contains('is-open')) {
      setOpen(false);
      button.focus();
    }
  });
  return spot;
}

/**
 * Builds a slide from an authored row: first cell image, second cell hotspot groups.
 * If everything sits in one cell, the picture is pulled out and the rest is treated
 * as hotspot content.
 */
function buildSlide(block, row) {
  const li = document.createElement('li');
  li.className = `${BLOCK}-slide`;

  const stage = document.createElement('div');
  stage.className = `${BLOCK}-stage`;

  const picture = row.querySelector('picture');
  if (picture) {
    const wrapper = picture.parentElement;
    const img = picture.querySelector('img');
    const optimized = img
      ? createOptimizedPicture(img.src, img.alt || '', false, [{ media: '(min-width: 1024px)', width: '1200' }, { width: '750' }])
      : picture;
    stage.append(optimized);
    picture.remove();
    if (wrapper && wrapper.tagName === 'P' && !wrapper.children.length && !wrapper.textContent.trim()) {
      wrapper.remove();
    }
  }

  const nodes = [];
  [...row.children].forEach((cell) => nodes.push(...cell.childNodes));
  splitGroups(nodes).forEach((group, idx) => stage.append(buildHotspot(block, group, idx)));

  li.append(stage);
  return li;
}

export default function decorate(block) {
  const track = document.createElement('ul');
  track.className = `${BLOCK}-track`;

  [...block.children].forEach((row) => {
    if (!row.textContent.trim() && !row.querySelector('picture')) return;
    track.append(buildSlide(block, row));
  });

  const viewport = document.createElement('div');
  viewport.className = `${BLOCK}-viewport`;
  viewport.append(track);

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  if (!block.getAttribute('aria-label')) block.setAttribute('aria-label', 'Products');
  block.replaceChildren(viewport, buildControls());

  document.addEventListener('click', () => closeAll(block));
  track.addEventListener('scroll', () => closeAll(block), { passive: true });

  if (!track.children.length) return;
  bindCarousel(block, track);
}

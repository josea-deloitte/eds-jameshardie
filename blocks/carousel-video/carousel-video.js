import { createOptimizedPicture } from '../../scripts/aem.js';

const BLOCK = 'carousel-video';
const VIDEO_RE = /\.(mp4|webm|ogg|ogv|mov|m4v)([?#]|$)/i;

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

function stopVideo(dialog) {
  const video = dialog.querySelector('video');
  if (video && video.getAttribute('src')) {
    video.pause();
    video.removeAttribute('src');
    video.load();
  }
}

function getDialog(block) {
  let dialog = block.querySelector(`:scope > .${BLOCK}-player`);
  if (dialog) return dialog;
  dialog = document.createElement('dialog');
  dialog.className = `${BLOCK}-player`;
  dialog.setAttribute('aria-label', 'Video player');
  dialog.innerHTML = `
    <button type="button" class="${BLOCK}-player-close" aria-label="Close video"></button>
    <video controls playsinline></video>`;
  dialog.querySelector(`.${BLOCK}-player-close`).addEventListener('click', () => dialog.close());
  // click on the backdrop (outside the video) closes
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    stopVideo(dialog);
    document.body.classList.remove(`${BLOCK}-player-open`);
    if (dialog.returnFocusTo) dialog.returnFocusTo.focus();
  });
  block.append(dialog);
  return dialog;
}

function openPlayer(block, src, title, opener) {
  const dialog = getDialog(block);
  const video = dialog.querySelector('video');
  video.src = src;
  video.setAttribute('aria-label', title || 'Video');
  dialog.returnFocusTo = opener;
  document.body.classList.add(`${BLOCK}-player-open`);
  dialog.showModal();
  const p = video.play();
  if (p && p.catch) p.catch(() => { /* user can press play */ });
}

/**
 * Builds one video card from an authored row (poster cell + title/link cell).
 */
function buildCard(block, row) {
  const li = document.createElement('li');
  li.className = `${BLOCK}-slide`;

  const links = [...row.querySelectorAll('a[href]')];
  const videoLink = links.find((a) => VIDEO_RE.test(a.getAttribute('href') || '')) || links[0];
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  let titleText = heading ? heading.textContent.trim() : '';
  if (!titleText && videoLink && videoLink.textContent.trim() !== videoLink.href) {
    titleText = videoLink.textContent.trim();
  }

  const picture = row.querySelector('picture');
  const img = picture && picture.querySelector('img');

  const card = document.createElement(videoLink ? 'button' : 'div');
  card.className = `${BLOCK}-card`;
  if (videoLink) {
    card.type = 'button';
    card.setAttribute('aria-label', `Play video${titleText ? `: ${titleText}` : ''}`);
  }

  if (img) {
    const poster = createOptimizedPicture(img.src, img.alt || '', false, [{ media: '(min-width: 1024px)', width: '600' }, { width: '450' }]);
    poster.classList.add(`${BLOCK}-poster`);
    card.append(poster);
  }

  if (videoLink) {
    const play = document.createElement('span');
    play.className = `${BLOCK}-play`;
    play.setAttribute('aria-hidden', 'true');
    card.append(play);
  }

  if (titleText || heading) {
    const title = document.createElement('span');
    title.className = `${BLOCK}-title`;
    if (heading) title.append(...heading.childNodes);
    else title.textContent = titleText;
    title.querySelectorAll('a').forEach((a) => a.replaceWith(...a.childNodes));
    card.append(title);
  }

  if (videoLink) {
    const { href } = videoLink;
    if (VIDEO_RE.test(href)) {
      card.addEventListener('click', () => openPlayer(block, href, titleText, card));
    } else {
      // not a video file: behave like a normal link
      card.addEventListener('click', () => { window.location.href = href; });
    }
  }

  li.append(card);
  return li;
}

export default function decorate(block) {
  const track = document.createElement('ul');
  track.className = `${BLOCK}-track`;

  [...block.children].forEach((row) => {
    if (!row.textContent.trim() && !row.querySelector('picture')) return;
    track.append(buildCard(block, row));
  });

  const viewport = document.createElement('div');
  viewport.className = `${BLOCK}-viewport`;
  viewport.append(track);

  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'carousel');
  if (!block.getAttribute('aria-label')) block.setAttribute('aria-label', 'Videos');
  block.replaceChildren(viewport, buildControls());

  if (!track.children.length) return;
  bindCarousel(block, track);
}

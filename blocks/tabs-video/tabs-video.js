import { toClassName } from '../../scripts/aem.js';

const VIDEO_RE = /\.(mp4|webm|ogg|ogv|mov|m4v)([?#]|$)/i;

let tabsId = 0;

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function removeWithEmptyParents(el, stop) {
  let node = el;
  while (node.parentElement && node.parentElement !== stop
    && node.parentElement.children.length === 1
    && node.parentElement.textContent.trim() === node.textContent.trim()) {
    node = node.parentElement;
  }
  node.remove();
}

function setState(media, playing) {
  media.classList.toggle('is-paused', !playing);
  const button = media.querySelector('.tabs-video-toggle');
  if (button) {
    button.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
    button.setAttribute('aria-pressed', String(!playing));
  }
}

function play(media, force = false) {
  const video = media.querySelector('video');
  if (!video) return;
  if (!video.getAttribute('src')) video.src = video.dataset.src;
  if (!force && (media.dataset.userPaused === 'true' || prefersReducedMotion())) {
    setState(media, false);
    return;
  }
  const p = video.play();
  setState(media, true);
  if (p && p.catch) p.catch(() => setState(media, false));
}

function pause(media) {
  const video = media.querySelector('video');
  if (video && !video.paused) video.pause();
}

function buildMedia(videoLink, picture) {
  const media = document.createElement('div');
  media.className = 'tabs-video-media';
  if (picture) media.append(picture);
  if (!videoLink) return media;

  const video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('tabindex', '-1');
  video.preload = 'none';
  video.dataset.src = videoLink.href;
  const img = picture && picture.querySelector('img');
  if (img) video.poster = img.currentSrc || img.src;
  media.append(video);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'tabs-video-toggle';
  button.addEventListener('click', () => {
    if (video.paused) {
      media.dataset.userPaused = 'false';
      play(media, true);
    } else {
      media.dataset.userPaused = 'true';
      video.pause();
      setState(media, false);
    }
  });
  media.append(button);
  setState(media, !prefersReducedMotion());
  return media;
}

/**
 * Splits a panel cell into text and media. The first link pointing to a video
 * file becomes the panel video; everything else stays as text content.
 */
function buildPanel(cells) {
  const text = document.createElement('div');
  text.className = 'tabs-video-text';
  cells.forEach((cell) => text.append(...cell.childNodes));

  const videoLink = [...text.querySelectorAll('a[href]')]
    .find((a) => VIDEO_RE.test(a.getAttribute('href') || ''));
  const picture = text.querySelector('picture');
  if (videoLink) removeWithEmptyParents(videoLink, text);
  if (picture) {
    const wrapper = picture.parentElement;
    picture.remove();
    if (wrapper && wrapper !== text && !wrapper.children.length && !wrapper.textContent.trim()) {
      wrapper.remove();
    }
  }
  const media = (videoLink || picture) ? buildMedia(videoLink, picture) : null;
  return { text, media };
}

export default function decorate(block) {
  tabsId += 1;
  const tablist = document.createElement('div');
  tablist.className = 'tabs-video-list';
  tablist.setAttribute('role', 'tablist');

  const panels = [];
  const buttons = [];
  const usedIds = new Set();

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (!cells.length || !row.textContent.trim()) {
      row.remove();
      return;
    }
    const labelCell = cells.length > 1 ? cells.shift() : null;
    const labelText = labelCell ? labelCell.textContent.trim() : `Tab ${buttons.length + 1}`;
    let id = `${tabsId}-${toClassName(labelText) || buttons.length + 1}`;
    while (usedIds.has(id)) id = `${id}-${buttons.length + 1}`;
    usedIds.add(id);

    const { text, media } = buildPanel(cells);
    const panel = document.createElement('div');
    panel.className = 'tabs-video-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.append(text);
    if (media) panel.append(media);
    else panel.classList.add('no-media');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'tabs-video-tab';
    button.id = `tab-${id}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panel.id);
    const label = document.createElement('span');
    label.className = 'tabs-video-label';
    if (labelCell) {
      // keep inline formatting, drop block wrappers
      const inner = labelCell.querySelector('h1, h2, h3, h4, h5, h6, p');
      label.append(...(inner && labelCell.children.length === 1 ? inner : labelCell).childNodes);
    } else {
      label.textContent = labelText;
    }
    button.append(label);

    tablist.append(button);
    buttons.push(button);
    panels.push(panel);
    row.replaceWith(panel);
  });

  if (!panels.length) return;

  let inView = false;
  let active = 0;

  const activate = (index, focus = false) => {
    active = index;
    buttons.forEach((btn, i) => {
      const selected = i === index;
      btn.setAttribute('aria-selected', String(selected));
      btn.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
      const media = panels[i].querySelector('.tabs-video-media');
      if (media) {
        if (selected && inView) play(media);
        else pause(media);
      }
    });
    if (focus) buttons[index].focus();
  };

  buttons.forEach((btn, i) => {
    btn.addEventListener('click', () => activate(i));
    btn.addEventListener('keydown', (e) => {
      let next = null;
      if (e.key === 'ArrowRight') next = (i + 1) % buttons.length;
      if (e.key === 'ArrowLeft') next = (i - 1 + buttons.length) % buttons.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = buttons.length - 1;
      if (next !== null) {
        e.preventDefault();
        activate(next, true);
      }
    });
  });

  block.prepend(tablist);
  activate(0);

  // only stream/play the active video while the block is on screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      inView = entries.some((e) => e.isIntersecting);
      const media = panels[active].querySelector('.tabs-video-media');
      if (!media) return;
      if (inView) play(media);
      else pause(media);
    }, { rootMargin: '200px 0px' }).observe(block);
  } else {
    inView = true;
    activate(0);
  }
}

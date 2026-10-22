const VIDEO_RE = /\.(mp4|webm|ogg|ogv|mov|m4v)([?#]|$)/i;

function isVideoLink(a) {
  return !!a && VIDEO_RE.test(a.getAttribute('href') || '');
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Removes an element and any wrapper that becomes empty because of it.
 * @param {Element} el element to remove
 * @param {Element} stop ancestor that must never be removed
 */
function removeWithEmptyParents(el, stop) {
  let node = el;
  while (node.parentElement && node.parentElement !== stop
    && node.parentElement.children.length === 1
    && node.parentElement.textContent.trim() === node.textContent.trim()) {
    node = node.parentElement;
  }
  node.remove();
}

function setPlaying(block, button, playing) {
  block.classList.toggle('is-paused', !playing);
  button.setAttribute('aria-label', playing ? 'Pause background video' : 'Play background video');
  button.setAttribute('aria-pressed', String(!playing));
}

function buildVideo(src, poster) {
  const video = document.createElement('video');
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('tabindex', '-1');
  video.preload = 'none';
  if (poster) video.poster = poster;
  video.dataset.src = src;
  return video;
}

function attachVideo(block, video, button) {
  const start = () => {
    video.src = video.dataset.src;
    video.preload = 'auto';
    if (prefersReducedMotion()) {
      setPlaying(block, button, false);
      return;
    }
    video.addEventListener('playing', () => block.classList.add('is-video-ready'), { once: true });
    const p = video.play();
    if (p && p.catch) p.catch(() => setPlaying(block, button, false));
  };
  // keep the poster image as LCP; stream the video once the page has loaded
  if (document.readyState === 'complete') setTimeout(start, 0);
  else window.addEventListener('load', () => setTimeout(start, 0), { once: true });
}

export default function decorate(block) {
  const picture = block.querySelector('picture');
  const videoLink = [...block.querySelectorAll('a[href]')].find(isVideoLink);
  const videoSrc = videoLink ? videoLink.href : '';

  const media = document.createElement('div');
  media.className = 'hero-video-media';
  if (picture) {
    const wrapper = picture.parentElement;
    media.append(picture);
    if (wrapper && wrapper.tagName === 'P' && !wrapper.children.length && !wrapper.textContent.trim()) {
      wrapper.remove();
    }
  }
  if (videoLink) removeWithEmptyParents(videoLink, block);

  // everything left (in any row/cell) is foreground content
  const content = document.createElement('div');
  content.className = 'hero-video-content';
  [...block.querySelectorAll(':scope > div > div')].forEach((cell) => {
    if (cell.textContent.trim() || cell.querySelector('img, a')) {
      content.append(...cell.childNodes);
    }
  });

  block.replaceChildren(media, content);
  if (!picture) block.classList.add('no-poster');

  if (!videoSrc) return;

  const img = picture && picture.querySelector('img');
  const poster = img ? (img.currentSrc || img.src) : '';
  const video = buildVideo(videoSrc, poster);
  media.append(video);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'hero-video-toggle';
  setPlaying(block, button, true);
  button.addEventListener('click', () => {
    if (!video.src) video.src = video.dataset.src;
    if (video.paused) {
      const p = video.play();
      if (p && p.catch) p.catch(() => setPlaying(block, button, false));
      setPlaying(block, button, true);
      block.classList.add('is-video-ready');
    } else {
      video.pause();
      setPlaying(block, button, false);
    }
  });
  block.append(button);

  attachVideo(block, video, button);
}

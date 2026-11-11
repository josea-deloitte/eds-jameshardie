const VIDEO_LINK = 'a[href$=".mp4" i], a[href$=".webm" i], a[href$=".mp4?" i]';

/**
 * Replaces a video link (plus optional poster picture) in a cell with a
 * native <video controls>. Never autoplays.
 * @param {Element} col The column cell
 * @returns {boolean} true when a video was created
 */
function buildVideo(col) {
  const link = col.querySelector(VIDEO_LINK);
  if (!link) return false;
  const src = link.href;
  const poster = col.querySelector('picture img');
  const video = document.createElement('video');
  video.controls = true;
  video.preload = 'none';
  video.playsInline = true;
  if (poster) video.poster = poster.currentSrc || poster.src;
  video.setAttribute('aria-label', link.textContent.trim() || poster?.alt || 'Video');
  const source = document.createElement('source');
  source.src = src;
  source.type = /\.webm(\?|$)/i.test(src) ? 'video/webm' : 'video/mp4';
  video.append(source);
  const fallback = document.createElement('a');
  fallback.href = src;
  fallback.textContent = link.textContent.trim() || 'Watch the video';
  video.append(fallback);

  const wrapper = document.createElement('div');
  wrapper.className = 'columns-video';
  wrapper.append(video);
  col.querySelectorAll('picture').forEach((pic) => {
    const p = pic.closest('p') || pic;
    p.remove();
  });
  (link.closest('p') || link).remove();
  col.prepend(wrapper);
  col.classList.add('columns-video-col');
  return true;
}

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);
  const isVideo = block.classList.contains('video');
  const isEyebrow = block.classList.contains('eyebrow');

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      if (isVideo && buildVideo(col)) return;

      // setup image columns
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }

      if (isEyebrow) {
        const heading = col.querySelector('h1, h2, h3, h4');
        const prev = heading?.previousElementSibling;
        if (prev && prev.tagName === 'P' && !prev.querySelector('a, picture')) {
          prev.classList.add('columns-eyebrow');
        }
      }
    });
  });
}

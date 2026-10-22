// https://gallery.sprinklr.com/clients/<clientId>/embeds/<embedId>/script.js
const SPRINKLR_RE = /^\/clients\/(\d+)\/embeds\/([^/]+)\/script\.js$/;
const DEFAULT_CLIENT_ID = '24392';
const GALLERY_HOST = 'gallery.sprinklr.com';

function parseSprinklr(href) {
  try {
    const url = new URL(href, window.location.href);
    if (url.protocol !== 'https:' || url.hostname !== GALLERY_HOST) return null;
    const match = url.pathname.match(SPRINKLR_RE);
    if (!match) return null;
    return { src: url.href, clientId: match[1], embedId: match[2] };
  } catch {
    return null;
  }
}

/**
 * Builds a Sprinklr script URL from a bare embed id (e.g. an author typed only the id).
 */
function fromEmbedId(text) {
  const id = (text || '').trim();
  if (!/^[A-Za-z0-9_=-]{8,}$/.test(id)) return null;
  return {
    src: `https://gallery.sprinklr.com/clients/${DEFAULT_CLIENT_ID}/embeds/${id}/script.js`,
    clientId: DEFAULT_CLIENT_ID,
    embedId: id,
  };
}

// how long to wait for the third-party gallery to render before giving up
const RENDER_TIMEOUT = 10000;

function loadScript(src, onError) {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) return;
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.addEventListener('error', onError, { once: true });
  document.head.append(script);
}

/**
 * Tracks the third-party render. The stage keeps its placeholder until the gallery
 * has content ('is-ready'). If the script cannot run (load error, script-src CSP
 * violation, or nothing rendered by the timeout) the block collapses
 * ('is-unavailable'); the section's own "Follow" link stays as the fallback.
 * A late render still wins and flips the block back to 'is-ready'.
 * @returns {Function} call to mark the gallery as failed
 */
function watchGallery(block, stage, gallery) {
  const fromGallery = (url) => typeof url === 'string' && url.includes(GALLERY_HOST);
  const hasContent = () => gallery.children.length > 0;
  let observer;
  let timer;

  const onViolation = (e) => {
    if (!/^script-src/.test(e.violatedDirective || e.effectiveDirective || '')) return;
    // eslint-disable-next-line no-use-before-define
    if (fromGallery(e.sourceFile) || fromGallery(e.blockedURI)) settle(false);
  };
  const stopListening = () => {
    clearTimeout(timer);
    document.removeEventListener('securitypolicyviolation', onViolation);
  };
  function settle(ok) {
    stage.classList.remove('is-loading');
    stage.removeAttribute('aria-busy');
    block.classList.toggle('is-ready', ok);
    block.classList.toggle('is-unavailable', !ok);
    stopListening();
    if (ok && observer) observer.disconnect();
  }

  if (window.MutationObserver) {
    observer = new MutationObserver(() => { if (hasContent()) settle(true); });
    observer.observe(gallery, { childList: true });
  }
  document.addEventListener('securitypolicyviolation', onViolation);
  timer = setTimeout(() => settle(hasContent()), RENDER_TIMEOUT);
  return () => settle(false);
}

export default function decorate(block) {
  const links = [...block.querySelectorAll('a[href]')];
  let config = null;
  links.some((a) => {
    config = parseSprinklr(a.getAttribute('href'));
    return !!config;
  });
  if (!config) config = fromEmbedId(block.textContent);

  if (!config) {
    block.classList.add('is-empty');
    block.replaceChildren();
    return;
  }

  const { clientId, embedId, src } = config;

  // containers the Sprinklr script looks for by id
  const controls = document.createElement('div');
  controls.id = `sprinklr-embed-control-${clientId}-${embedId}`;
  controls.className = 'swe_embed_controls';

  const gallery = document.createElement('div');
  gallery.id = `sprinklr-embed-${clientId}-${embedId}`;
  gallery.className = 'swe_embed';
  gallery.dataset.filterProduct = '';
  gallery.dataset.filterVariant = '';

  const stage = document.createElement('div');
  stage.className = 'embed-social-stage is-loading';
  stage.append(controls, gallery);
  block.replaceChildren(stage);

  stage.setAttribute('aria-busy', 'true');
  const load = () => {
    const fail = watchGallery(block, stage, gallery);
    loadScript(src, fail);
  };

  if (!('IntersectionObserver' in window)) {
    load();
    return;
  }
  // third-party script is heavy: only fetch it when the gallery is about to be seen
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      load();
    }
  }, { rootMargin: '300px 0px' });
  observer.observe(block);
}

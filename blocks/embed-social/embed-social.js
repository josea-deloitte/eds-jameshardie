// https://gallery.sprinklr.com/clients/<clientId>/embeds/<embedId>/script.js
const SPRINKLR_RE = /^\/clients\/(\d+)\/embeds\/([^/]+)\/script\.js$/;
const DEFAULT_CLIENT_ID = '24392';

function parseSprinklr(href) {
  try {
    const url = new URL(href, window.location.href);
    if (url.protocol !== 'https:' || url.hostname !== 'gallery.sprinklr.com') return null;
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

function loadScript(src) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.append(script);
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

  const load = () => {
    stage.classList.remove('is-loading');
    loadScript(src);
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

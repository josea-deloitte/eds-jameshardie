import { toClassName } from '../../scripts/aem.js';

// Sprinklr: https://gallery.sprinklr.com/clients/<clientId>/embeds/<embedId>/script.js
const SPRINKLR_RE = /^\/clients\/(\d+)\/embeds\/([^/]+)\/script\.js$/;
const SPRINKLR_HOST = 'gallery.sprinklr.com';
const DEFAULT_CLIENT_ID = '24392';
// Stackla (Nosto UGC) fluid embed
const STACKLA_SCRIPT = 'https://assets.stackla.com/media/js/widget/fluid-embed.js';

// how long to wait for the third-party gallery to render before showing the fallback
const RENDER_TIMEOUT = 10000;

/**
 * Reads authored key/value rows (e.g. "Client ID | 24392") into a map of
 * normalized key -> { text, href }. Rows that are not key/value pairs are ignored.
 */
function readRows(block) {
  const rows = {};
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;
    const key = toClassName(cells[0].textContent);
    if (!key) return;
    const a = cells[1].querySelector('a[href]');
    rows[key] = {
      text: cells[1].textContent.trim(),
      href: a ? a.getAttribute('href') : '',
    };
  });
  return rows;
}

function toUrl(href) {
  try {
    return new URL(href, window.location.href);
  } catch {
    return null;
  }
}

function parseSprinklrUrl(href) {
  const url = toUrl(href);
  if (!url || url.protocol !== 'https:' || url.hostname !== SPRINKLR_HOST) return null;
  const match = url.pathname.match(SPRINKLR_RE);
  return match ? { clientId: match[1], embedId: match[2] } : null;
}

const isEmbedId = (text) => /^[A-Za-z0-9_=-]{8,}$/.test(text);

function sprinklrConfig(block, rows) {
  const fromLink = [...block.querySelectorAll('a[href]')]
    .map((a) => parseSprinklrUrl(a.getAttribute('href'))).find(Boolean);
  const clientRow = (rows['client-id'] && rows['client-id'].text) || '';
  let clientId = /^\d+$/.test(clientRow) ? clientRow : DEFAULT_CLIENT_ID;
  let embedId;
  if (fromLink) {
    ({ clientId, embedId } = fromLink);
  } else {
    // "Embed ID" row, or legacy single cell holding only the embed id
    const row = rows['embed-id'] && rows['embed-id'].text;
    embedId = [row, block.textContent.trim()].find((v) => v && isEmbedId(v));
  }
  if (!embedId) return null;
  return {
    provider: 'sprinklr',
    src: `https://${SPRINKLR_HOST}/clients/${clientId}/embeds/${embedId}/script.js`,
    clientId,
    embedId,
  };
}

function stacklaConfig(rows) {
  const dataId = rows['data-id'] && rows['data-id'].text;
  const hash = rows.hash && rows.hash.text;
  if (!/^\d+$/.test(dataId || '') || !/^[A-Za-z0-9]+$/.test(hash || '')) return null;
  const title = (rows.title && rows.title.text) || '';
  return {
    provider: 'stackla', src: STACKLA_SCRIPT, dataId, hash, title,
  };
}

/**
 * Visible fallback: an authored "Fallback link" row, otherwise the first authored
 * link that is not the embed script itself (e.g. the Instagram profile link).
 */
function findFallback(block, rows) {
  const row = rows['fallback-link'];
  if (row && row.href) return { href: row.href, text: row.text || row.href };
  const a = [...block.querySelectorAll('a[href]')].find((link) => {
    const url = toUrl(link.getAttribute('href'));
    return url && !parseSprinklrUrl(url.href) && url.href !== STACKLA_SCRIPT;
  });
  return a ? { href: a.getAttribute('href'), text: a.textContent.trim() || a.href } : null;
}

function buildFallback(fallback) {
  if (!fallback) return null;
  const p = document.createElement('p');
  p.className = 'embed-social-fallback';
  p.hidden = true;
  const a = document.createElement('a');
  a.href = fallback.href;
  a.textContent = fallback.text;
  if (/^https?:/.test(a.href) && new URL(a.href).origin !== window.location.origin) {
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  }
  p.append(a);
  return p;
}

/**
 * Builds the container(s) the provider script looks for and returns the element
 * that will receive the rendered gallery.
 */
function buildContainers(config, stage) {
  if (config.provider === 'stackla') {
    const widget = document.createElement('div');
    widget.className = 'stackla-widget';
    widget.dataset.id = config.dataId;
    widget.dataset.hash = config.hash;
    if (config.title) widget.dataset.title = config.title;
    stage.append(widget);
    return widget;
  }
  const controls = document.createElement('div');
  controls.id = `sprinklr-embed-control-${config.clientId}-${config.embedId}`;
  controls.className = 'swe_embed_controls';
  const gallery = document.createElement('div');
  gallery.id = `sprinklr-embed-${config.clientId}-${config.embedId}`;
  gallery.className = 'swe_embed';
  gallery.dataset.filterProduct = '';
  gallery.dataset.filterVariant = '';
  stage.append(controls, gallery);
  return gallery;
}

/**
 * Tracks the third-party render. The stage keeps its placeholder until the gallery
 * has content ('is-ready'). If the script fails to load or nothing has rendered by
 * the timeout, the stage is replaced by the fallback link ('is-unavailable'); the
 * block collapses when no fallback was authored. A late render still wins.
 * @returns {Function} call to mark the gallery as failed
 */
function watchGallery(block, stage, gallery, fallback) {
  const hasContent = () => gallery.children.length > 0;
  let observer;
  let timer;

  function settle(ok) {
    clearTimeout(timer);
    stage.classList.remove('is-loading');
    stage.removeAttribute('aria-busy');
    block.classList.toggle('is-ready', ok);
    block.classList.toggle('is-unavailable', !ok);
    if (fallback) fallback.hidden = ok;
    if (ok && observer) observer.disconnect();
  }

  if (window.MutationObserver) {
    observer = new MutationObserver(() => { if (hasContent()) settle(true); });
    observer.observe(gallery, { childList: true });
  }
  timer = setTimeout(() => settle(hasContent()), RENDER_TIMEOUT);
  return () => settle(false);
}

function loadScript(src, onError) {
  // already requested by another instance on the page: rely on the render timeout
  if (document.querySelector(`script[src="${src}"]`)) return;
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  script.addEventListener('error', onError, { once: true });
  document.head.append(script);
}

export default function decorate(block) {
  const rows = readRows(block);
  const isStackla = block.classList.contains('stackla') || !!rows['data-id'];
  const config = isStackla ? stacklaConfig(rows) : sprinklrConfig(block, rows);

  if (!config) {
    block.classList.add('is-empty');
    block.replaceChildren();
    return;
  }

  const fallback = buildFallback(findFallback(block, rows));
  const stage = document.createElement('div');
  stage.className = 'embed-social-stage is-loading';
  stage.setAttribute('aria-busy', 'true');
  const gallery = buildContainers(config, stage);
  block.replaceChildren(stage);
  if (fallback) block.append(fallback);

  const load = () => {
    const fail = watchGallery(block, stage, gallery, fallback);
    loadScript(config.src, fail);
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

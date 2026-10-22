const DEFAULT_TITLE = 'Hover home exterior designer';

function isEmbedUrl(url) {
  return url.protocol === 'https:' && /(^|\.)hover\.to$/.test(url.hostname)
    && url.pathname.startsWith('/designer/');
}

function toUrl(href) {
  try {
    return new URL(href, window.location.href);
  } catch {
    return null;
  }
}

function loadIframe(stage, src, title) {
  const iframe = document.createElement('iframe');
  iframe.src = src;
  iframe.title = title;
  iframe.loading = 'lazy';
  iframe.setAttribute('allow', 'fullscreen; clipboard-write; camera');
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  stage.replaceChildren(iframe);
}

export default function decorate(block) {
  const links = [...block.querySelectorAll('a[href]')];
  const parsed = links.map((a) => ({ a, url: toUrl(a.getAttribute('href')) }));
  // the designer URL (embed-container); fall back to the first https link
  const embed = parsed.find(({ url }) => url && isEmbedUrl(url))
    || parsed.find(({ url }) => url && url.protocol === 'https:');

  const stage = document.createElement('div');
  stage.className = 'embed-designer-stage';

  const footer = document.createElement('div');
  footer.className = 'embed-designer-footer';
  parsed.forEach(({ a }) => {
    if (embed && a === embed.a) return;
    a.classList.remove('button', 'primary', 'secondary', 'accent');
    a.classList.add('embed-designer-attribution');
    if (a.target === '_blank') a.rel = 'noopener noreferrer';
    footer.append(a);
  });

  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  const title = (heading && heading.textContent.trim()) || DEFAULT_TITLE;

  block.replaceChildren(stage);
  if (footer.children.length) block.append(footer);

  if (!embed) {
    block.classList.add('is-empty');
    return;
  }

  const src = embed.url.href;
  stage.classList.add('is-loading');
  const load = () => {
    stage.classList.remove('is-loading');
    loadIframe(stage, src, title);
  };

  if (!('IntersectionObserver' in window)) {
    load();
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      observer.disconnect();
      load();
    }
  }, { rootMargin: '400px 0px' });
  observer.observe(block);
}

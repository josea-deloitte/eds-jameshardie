const SECTION_NAMES = ['social', 'links', 'brand', 'legal', 'utility'];

/**
 * Fetches the footer fragment. Tries the local content path first, then the site root (DA/EDS).
 * @returns {Promise<{html: string, base: string}|null>}
 */
async function fetchFooter() {
  // metadata-independent: /content first (localhost), then root (DA/EDS prod)
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return null;
  return { html: await resp.text(), base: new URL(resp.url, window.location.href).href };
}

/**
 * Resolves relative image paths against the fragment URL so they work on any page depth.
 * @param {Element} root fragment root
 * @param {string} base fragment URL
 */
function resolveImages(root, base) {
  root.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (!/^(https?:)?\/\//.test(src) && !src.startsWith('/')) img.src = new URL(src, base).href;
    img.loading = 'lazy';
  });
}

/**
 * Replaces an icon image with its inline SVG so the icon can change color on hover.
 * @param {HTMLImageElement} img icon image
 */
async function inlineIcon(img) {
  try {
    const resp = await fetch(img.src);
    if (!resp.ok) return;
    const tpl = document.createElement('template');
    tpl.innerHTML = (await resp.text()).trim();
    const svg = tpl.content.querySelector('svg');
    if (!svg) return;
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.classList.add('footer-icon');
    img.replaceWith(svg);
  } catch { /* keep the image */ }
}

function createChevron() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('footer-chevron');
  // plus icon: the vertical stroke rotates flat (minus) when the section is open
  [['footer-chevron-h', 'M4 12H20'], ['footer-chevron-v', 'M12 4V20']].forEach(([cls, d]) => {
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', d);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'currentColor');
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-linecap', 'round');
    path.classList.add(cls);
    svg.append(path);
  });
  return svg;
}

function decorateSocial(section) {
  section.className = 'footer-social';
  section.querySelector('ul')?.classList.add('footer-social-list');
  section.querySelectorAll('.footer-social-list a').forEach((a) => {
    const img = a.querySelector('img');
    if (img) a.setAttribute('aria-label', img.alt);
    a.target = '_blank';
    a.rel = 'noopener';
    if (img) inlineIcon(img);
  });
  section.querySelector(':scope > p')?.classList.add('footer-contact');
}

function decorateLinks(section) {
  section.className = 'footer-links';
  const columns = section.querySelector(':scope > ul');
  columns?.classList.add('footer-columns');
  columns?.querySelectorAll(':scope > li').forEach((col, i) => {
    col.classList.add('footer-column');
    const heading = col.querySelector(':scope > p');
    const list = col.querySelector(':scope > ul');
    if (!heading) return;
    // headings toggle their links on mobile (accordion); static on desktop
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'footer-column-heading';
    toggle.setAttribute('aria-expanded', 'false');
    if (list) {
      list.id = `footer-column-${i}`;
      toggle.setAttribute('aria-controls', list.id);
    }
    const label = document.createElement('span');
    label.append(...heading.childNodes);
    toggle.append(label, createChevron());
    toggle.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', toggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
    });
    heading.replaceWith(toggle);
  });
}

function decorateLegal(section) {
  section.className = 'footer-legal';
  section.querySelector(':scope > p')?.classList.add('footer-copyright');
  section.querySelector(':scope > ul')?.classList.add('footer-legal-list');
  // consent preferences link opens the cookie preference center when it is available
  section.querySelectorAll('a[href="#cookie-settings"]').forEach((a) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'footer-consent-button';
    button.textContent = a.textContent;
    button.addEventListener('click', () => window.OneTrust?.ToggleInfoDisplay?.());
    a.replaceWith(button);
  });
}

function decorateUtility(section) {
  section.className = 'footer-utility';
  section.querySelectorAll('li').forEach((li) => {
    const img = li.querySelector('img');
    if (img && !li.querySelector('a')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'footer-location-button';
      button.setAttribute('aria-label', img.alt || 'Location');
      const label = document.createElement('span');
      label.textContent = li.textContent.trim();
      img.alt = '';
      button.append(img, label);
      // reuse the header's location drawer
      button.addEventListener('click', () => document.querySelector('header .nav-location-button')?.click());
      li.replaceChildren(button);
      li.classList.add('footer-utility-location');
      inlineIcon(img);
    } else {
      li.classList.add('footer-utility-pill');
    }
  });
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const fragment = await fetchFooter();
  if (!fragment) return;
  const root = document.createElement('div');
  root.innerHTML = fragment.html;
  resolveImages(root, fragment.base);
  const sections = {};
  [...root.querySelectorAll(':scope > div')].forEach((section, i) => {
    if (SECTION_NAMES[i]) sections[SECTION_NAMES[i]] = section;
  });

  const inner = document.createElement('div');
  inner.className = 'footer-inner';

  const top = document.createElement('div');
  top.className = 'footer-top';
  if (sections.social) {
    decorateSocial(sections.social);
    top.append(sections.social);
  }
  if (sections.links) {
    decorateLinks(sections.links);
    top.append(sections.links);
  }
  inner.append(top);

  if (sections.brand) {
    sections.brand.className = 'footer-brand';
    inner.append(sections.brand);
  }

  const bottom = document.createElement('div');
  bottom.className = 'footer-bottom';
  if (sections.legal) {
    decorateLegal(sections.legal);
    bottom.append(sections.legal);
  }
  if (sections.utility) {
    decorateUtility(sections.utility);
    bottom.append(sections.utility);
  }
  inner.append(bottom);

  block.textContent = '';
  block.append(inner);
}

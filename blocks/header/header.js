// desktop layout starts at 1024px, matching the source site's breakpoint
const isDesktop = window.matchMedia('(min-width: 1024px)');

const ZIP_STORAGE_KEY = 'jh-zip';
const SECTION_NAMES = ['promo', 'utility', 'brand', 'sections', 'tools', 'search', 'location', 'cart', 'mobile'];

/**
 * Fetches the nav fragment. Tries the local content path first, then the site root (DA/EDS).
 * @returns {Promise<{html: string, base: string}|null>}
 */
async function fetchNav() {
  // metadata-independent: /content first (localhost), then root (DA/EDS prod)
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
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
    img.loading = 'eager';
  });
}

/**
 * Renders ® and ™ marks as superscripts, matching the source typography
 * (the source superscripts marks in links and the promo banner, not in headings).
 * @param {Element} root fragment root
 * @param {boolean} linksOnly only convert marks inside links
 */
function superscriptMarks(root, linksOnly = true) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    const parent = walker.currentNode.parentElement;
    // the source only superscripts marks inside links
    const inScope = !linksOnly || parent.closest('a');
    if (/[®™]/.test(walker.currentNode.textContent) && inScope && !parent.closest('sup')) {
      nodes.push(walker.currentNode);
    }
  }
  nodes.forEach((node) => {
    const frag = document.createDocumentFragment();
    node.textContent.split(/([®™])/).forEach((part) => {
      if (!part) return;
      if (part === '®' || part === '™') {
        const sup = document.createElement('sup');
        sup.textContent = part;
        frag.append(sup);
      } else {
        frag.append(part);
      }
    });
    node.replaceWith(frag);
  });
}

function createButton(className, label, content = '') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.setAttribute('aria-label', label);
  if (content) button.append(content);
  return button;
}

function textOf(section, index) {
  const el = section?.querySelectorAll(':scope > p, :scope > h2, :scope > h3')[index];
  return el ? el.textContent.trim() : '';
}

/* ---------- overlays (search, drawers) ---------- */

let backdrop;

function closeOverlays() {
  document.querySelectorAll('.nav-overlay[aria-hidden="false"]').forEach((overlay) => {
    overlay.setAttribute('aria-hidden', 'true');
  });
  backdrop?.classList.remove('is-visible');
  document.body.classList.remove('nav-overlay-open');
}

function openOverlay(overlay, withBackdrop = true) {
  closeOverlays();
  overlay.setAttribute('aria-hidden', 'false');
  if (withBackdrop) backdrop.classList.add('is-visible');
  document.body.classList.add('nav-overlay-open');
  overlay.querySelector('input, button')?.focus();
}

function buildOverlay(name, title) {
  const overlay = document.createElement('div');
  overlay.className = `nav-overlay nav-${name}`;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-hidden', 'true');
  if (title) overlay.setAttribute('aria-label', title);
  const close = createButton('nav-overlay-close', `Close ${title || name}`);
  close.addEventListener('click', closeOverlays);
  overlay.append(close);
  return overlay;
}

function buildSearch(section) {
  const overlay = buildOverlay('search', 'search');
  const form = document.createElement('form');
  form.className = 'nav-search-form';
  form.setAttribute('role', 'search');
  form.action = section?.querySelector('a')?.getAttribute('href') || '/search/';
  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = textOf(section, 0);
  input.setAttribute('aria-label', input.placeholder || 'Search');
  const submit = createButton('nav-search-submit', section?.querySelector('a')?.textContent.trim() || 'Search');
  submit.type = 'submit';
  form.append(input, submit);
  overlay.append(form);
  return overlay;
}

function getZip() {
  try {
    return localStorage.getItem(ZIP_STORAGE_KEY);
  } catch {
    return null;
  }
}

function buildLocation(section, defaultZip, onChange) {
  const heading = section?.querySelector('h2')?.textContent.trim() || '';
  const overlay = buildOverlay('location', heading);
  overlay.classList.add('nav-drawer');
  const h2 = document.createElement('h2');
  h2.textContent = heading;

  const current = document.createElement('div');
  current.className = 'nav-location-current';
  const currentZip = document.createElement('p');
  currentZip.className = 'nav-location-zip';
  const currentLabel = textOf(section, 1);
  const currentNote = document.createElement('p');
  currentNote.textContent = textOf(section, 2);
  current.append(currentZip, currentNote);

  const form = document.createElement('form');
  form.className = 'nav-location-form';
  const label = document.createElement('label');
  label.textContent = textOf(section, 3);
  label.htmlFor = 'nav-zip-input';
  const field = document.createElement('div');
  field.className = 'nav-location-field';
  const input = document.createElement('input');
  input.id = 'nav-zip-input';
  input.type = 'text';
  input.inputMode = 'numeric';
  input.autocomplete = 'postal-code';
  input.maxLength = 5;
  input.placeholder = textOf(section, 4);
  field.append(input);
  const useCurrent = createButton('nav-location-geo', textOf(section, 5), textOf(section, 5));
  const submit = createButton('nav-location-submit', textOf(section, 6), textOf(section, 6));
  submit.type = 'submit';
  submit.disabled = true;
  form.append(label, field, useCurrent, submit);

  const render = () => {
    currentZip.textContent = `${currentLabel} ${getZip() || defaultZip}`;
  };
  render();

  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '');
    submit.disabled = input.value.length !== 5;
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.length !== 5) return;
    try {
      localStorage.setItem(ZIP_STORAGE_KEY, input.value);
    } catch { /* storage unavailable */ }
    render();
    onChange(input.value);
    input.value = '';
    submit.disabled = true;
    closeOverlays();
  });
  useCurrent.addEventListener('click', () => {
    // reverse geocoding is provided by the site's location service; let it resolve the zip
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      document.dispatchEvent(new CustomEvent('jh:geolocate', { detail: { latitude: pos.coords.latitude, longitude: pos.coords.longitude } }));
    });
  });

  overlay.append(h2, current, form);
  return overlay;
}

function buildCart(section) {
  const heading = section?.querySelector('h2')?.textContent.trim() || '';
  const overlay = buildOverlay('cart', heading);
  overlay.classList.add('nav-drawer');
  const top = document.createElement('div');
  top.className = 'nav-cart-header';
  const h2 = document.createElement('h2');
  h2.textContent = heading;
  top.append(h2);
  const body = document.createElement('div');
  body.className = 'nav-cart-empty';
  const paragraphs = [...(section?.querySelectorAll(':scope > p') || [])].filter((p) => !p.querySelector('img'));
  const icon = section?.querySelector('img');
  if (icon) body.append(icon);
  const h3 = section?.querySelector('h3');
  if (h3) body.append(h3);
  const note = paragraphs[0];
  if (note) body.append(note);
  const ctaLabel = paragraphs[1]?.textContent.trim();
  const footer = document.createElement('div');
  footer.className = 'nav-cart-footer';
  if (ctaLabel) {
    const cta = createButton('nav-cart-cta', ctaLabel, ctaLabel);
    cta.addEventListener('click', closeOverlays);
    footer.append(cta);
  }
  overlay.append(top, body, footer);
  return overlay;
}

/* ---------- megamenu ---------- */

function closeAllPanels(sections, except) {
  sections.querySelectorAll(':scope > ul > li[aria-expanded="true"]').forEach((item) => {
    if (item !== except) item.setAttribute('aria-expanded', 'false');
  });
}

function decoratePanel(panel, trigger, onBack, onClose) {
  panel.classList.add('nav-panel');
  // mobile slide-in header: back to the main list + close the menu
  const head = document.createElement('div');
  head.className = 'nav-panel-header';
  const back = createButton('nav-panel-back', 'Back to main menu');
  const backLabel = document.createElement('span');
  backLabel.innerHTML = trigger.innerHTML;
  back.append(backLabel);
  back.addEventListener('click', onBack);
  const close = createButton('nav-panel-close', 'Close navigation');
  close.addEventListener('click', onClose);
  head.append(back, close);
  const columns = document.createElement('div');
  columns.className = 'nav-panel-columns';
  [...panel.children].forEach((col) => {
    if (col.querySelector('img')) {
      col.classList.add('nav-panel-feature');
      const card = document.createElement('a');
      const link = col.querySelector('a[href]');
      card.href = link.getAttribute('href');
      card.className = 'nav-feature-card';
      const img = col.querySelector('img');
      const title = document.createElement('div');
      title.className = 'nav-feature-title';
      const titleText = document.createElement('span');
      titleText.append(...[...col.querySelectorAll('a')].pop().childNodes);
      title.append(titleText);
      card.append(img, title);
      col.replaceChildren(card);
    } else {
      col.classList.add('nav-panel-column');
      const heading = col.querySelector(':scope > p');
      if (heading) {
        // headings toggle their links on mobile (multi-expand accordion)
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'nav-panel-heading';
        toggle.innerHTML = heading.innerHTML;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.addEventListener('click', () => {
          if (isDesktop.matches) return;
          toggle.setAttribute('aria-expanded', toggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        });
        heading.replaceWith(toggle);
      }
      col.querySelectorAll('strong > a').forEach((a) => {
        a.classList.add('nav-panel-cta');
        a.closest('li').classList.add('nav-panel-cta-item');
      });
      columns.append(col);
    }
  });
  panel.prepend(head, columns);
}

function decorateSections(sections, onCloseMenu) {
  const list = sections.querySelector(':scope > ul');
  if (!list) return;
  [...list.children].forEach((item, index) => {
    const label = item.querySelector(':scope > p');
    const panel = item.querySelector(':scope > ul');
    item.classList.add('nav-item');
    if (!label || !panel) return;
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'nav-item-trigger';
    trigger.id = `nav-trigger-${index}`;
    trigger.setAttribute('aria-controls', `nav-panel-${index}`);
    trigger.innerHTML = label.innerHTML;
    label.replaceWith(trigger);
    panel.id = `nav-panel-${index}`;
    item.classList.add('nav-drop');
    item.setAttribute('aria-expanded', 'false');

    const open = () => {
      closeAllPanels(sections, item);
      item.setAttribute('aria-expanded', 'true');
    };
    const close = () => item.setAttribute('aria-expanded', 'false');
    decoratePanel(panel, trigger, () => {
      close();
      trigger.focus();
    }, onCloseMenu);

    let hovering = false;
    trigger.addEventListener('click', () => {
      const expanded = item.getAttribute('aria-expanded') === 'true';
      // on desktop a hovered panel stays open when its trigger is clicked
      if (expanded && !(isDesktop.matches && hovering)) close();
      else open();
    });
    item.addEventListener('mouseenter', () => {
      hovering = true;
      if (isDesktop.matches) open();
    });
    item.addEventListener('mouseleave', () => {
      hovering = false;
      if (isDesktop.matches) close();
    });
  });
}

/* ---------- mobile menu ---------- */

function toggleMenu(nav, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const sections = nav.querySelector('.nav-sections');
  if (expanded && sections) closeAllPanels(sections);
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  document.body.classList.toggle('nav-menu-open', !expanded && !isDesktop.matches);
  const button = nav.querySelector('.nav-hamburger button');
  button?.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const fragment = await fetchNav();
  if (!fragment) return;
  const root = document.createElement('div');
  root.innerHTML = fragment.html;
  resolveImages(root, fragment.base);
  superscriptMarks(root);
  const sections = {};
  [...root.querySelectorAll(':scope > div')].forEach((section, i) => {
    if (SECTION_NAMES[i]) sections[SECTION_NAMES[i]] = section;
  });

  block.textContent = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';

  // promo banner
  if (sections.promo) {
    const { promo } = sections;
    promo.className = 'nav-promo';
    superscriptMarks(promo, false);
    const inner = document.createElement('div');
    inner.className = 'nav-promo-inner';
    inner.append(...promo.children);
    // promo links open in a new tab, as on the source site
    inner.querySelectorAll('a[href]').forEach((a) => {
      a.target = '_blank';
      a.rel = 'noopener';
    });
    promo.append(inner);
    const close = createButton('nav-promo-close', 'Close');
    close.addEventListener('click', () => {
      promo.remove();
      // eslint-disable-next-line no-use-before-define
      updateStickyOffset();
    });
    promo.append(close);
    wrapper.append(promo);
  }

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Global');
  nav.setAttribute('aria-expanded', 'false');

  // utility bar
  const zipLabels = [];
  let defaultZip = '';
  const buildLocationButton = (li, img) => {
    defaultZip = defaultZip || li.textContent.trim();
    const button = createButton('nav-location-button', img.alt || 'Location');
    const zipLabel = document.createElement('span');
    zipLabel.textContent = getZip() || defaultZip;
    zipLabels.push(zipLabel);
    img.alt = '';
    button.append(img, zipLabel);
    li.replaceChildren(button);
    li.classList.add('nav-utility-location');
  };
  if (sections.utility) {
    const { utility } = sections;
    utility.className = 'nav-utility';
    const items = utility.querySelectorAll('li');
    items.forEach((li) => {
      const img = li.querySelector('img');
      if (img && !li.querySelector('a')) {
        buildLocationButton(li, img);
      } else {
        li.classList.add('nav-utility-pill');
      }
    });
    nav.append(utility);
  }

  const main = document.createElement('div');
  main.className = 'nav-main';
  const bar = document.createElement('div');
  bar.className = 'nav-bar';

  if (sections.brand) {
    sections.brand.className = 'nav-brand';
    bar.append(sections.brand);
  }
  if (sections.sections) {
    sections.sections.className = 'nav-sections';
    // eslint-disable-next-line no-use-before-define
    decorateSections(sections.sections, () => toggleMenu(nav, false));
    bar.append(sections.sections);
    // mobile-only quick links shown at the bottom of the open menu
    if (sections.mobile) {
      const { mobile } = sections;
      mobile.className = 'nav-mobile-links';
      mobile.querySelectorAll('li').forEach((li) => {
        const img = li.querySelector('img');
        if (img && !li.querySelector('a')) buildLocationButton(li, img);
      });
      sections.sections.append(mobile);
    }
  }

  // tools: search + cart (plus location button mirrored for mobile)
  const overlays = [];
  const searchOverlay = buildSearch(sections.search);
  const locationOverlay = buildLocation(sections.location, defaultZip, (zip) => {
    zipLabels.forEach((label) => { label.textContent = zip; });
  });
  const cartOverlay = buildCart(sections.cart);
  overlays.push(searchOverlay, locationOverlay, cartOverlay);

  if (sections.tools) {
    const { tools } = sections;
    tools.className = 'nav-tools';
    const [searchItem, cartItem] = tools.querySelectorAll('li');
    [[searchItem, searchOverlay, false, 'nav-search-button'], [cartItem, cartOverlay, true, 'nav-cart-button']]
      .forEach(([li, overlay, withBackdrop, cls]) => {
        if (!li) return;
        const img = li.querySelector('img');
        const button = createButton(cls, img?.alt || '');
        if (img) {
          img.alt = '';
          button.append(img);
        }
        button.addEventListener('click', () => openOverlay(overlay, withBackdrop));
        li.replaceChildren(button);
      });
    bar.append(tools);
  }

  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  const hamburgerButton = createButton('', 'Open navigation');
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburgerButton.addEventListener('click', () => toggleMenu(nav));
  hamburger.append(hamburgerButton);
  bar.append(hamburger);

  main.append(bar);
  nav.append(main);
  wrapper.append(nav);
  nav.querySelectorAll('.nav-location-button').forEach((button) => {
    button.addEventListener('click', () => openOverlay(locationOverlay));
  });

  // desktop: sections sit in the bar between logo and tools; mobile: below the pills row
  const placeSections = () => {
    if (!sections.sections) return;
    if (isDesktop.matches) bar.insertBefore(sections.sections, sections.tools || hamburger);
    else nav.append(sections.sections);
  };
  placeSections();

  backdrop = document.createElement('div');
  backdrop.className = 'nav-backdrop';
  backdrop.addEventListener('click', closeOverlays);
  wrapper.append(backdrop, ...overlays);
  block.append(wrapper);

  // sticky: promo + utility scroll away, main bar stays pinned
  const header = block.closest('header');
  function updateStickyOffset() {
    const promo = wrapper.querySelector('.nav-promo');
    const utility = nav.querySelector('.nav-utility');
    const utilityHeight = isDesktop.matches ? (utility?.offsetHeight || 0) : 0;
    const offset = (promo?.offsetHeight || 0) + utilityHeight;
    header?.style.setProperty('--nav-sticky-offset', `-${offset}px`);
  }
  updateStickyOffset();
  window.addEventListener('resize', updateStickyOffset);

  // close panels / overlays
  document.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    closeOverlays();
    if (sections.sections) closeAllPanels(sections.sections);
    if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') toggleMenu(nav, false);
  });
  document.addEventListener('click', (e) => {
    if (!sections.sections || sections.sections.contains(e.target)) return;
    closeAllPanels(sections.sections);
  });

  // reset state when crossing the breakpoint
  isDesktop.addEventListener('change', () => {
    placeSections();
    toggleMenu(nav, false);
    if (sections.sections) closeAllPanels(sections.sections);
    closeOverlays();
    updateStickyOffset();
  });
}

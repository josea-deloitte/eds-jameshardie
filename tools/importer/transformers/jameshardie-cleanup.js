/* eslint-disable */
/* global WebImporter */

/**
 * James Hardie cleanup transformer (Next.js + Tailwind + Contentful source).
 *
 * Removes non-authorable site chrome, third-party widgets, tracking pixels and
 * mobile-only duplicate CTAs. Selectors are taken from migration-work/cleaned.html.
 */

const remove = (root, selectors) => {
  selectors.forEach((sel) => {
    try {
      root.querySelectorAll(sel).forEach((el) => el.remove());
    } catch (e) {
      // ignore selectors unsupported by the DOM implementation
    }
  });
};

// Weglot language switcher (also re-injected at runtime outside the first #main-content child)
const WEGLOT_SELECTORS = [
  '.weglot-container',
  '.weglot_switcher',
  '[id^="weglot"]',
  '[id^="wg-"]',
  '.language-list',
  '.language-option',
];

/**
 * Unwraps Next.js image optimizer URLs (/_next/image?url=<original>&w=..)
 * to the original asset URL so EDS can ingest and optimize the media itself.
 */
const unwrapNextImages = (root) => {
  root.querySelectorAll('img[src*="/_next/image"], source[srcset*="/_next/image"]').forEach((el) => {
    const attr = el.hasAttribute('src') ? 'src' : 'srcset';
    const value = (el.getAttribute(attr) || '').split(/\s+/)[0];
    try {
      const original = new URL(value, 'https://www.jameshardie.com').searchParams.get('url');
      if (original) {
        el.setAttribute(attr, new URL(original, 'https://www.jameshardie.com').href);
        if (attr === 'src') el.removeAttribute('srcset');
      }
    } catch (e) {
      // keep the original value
    }
  });
};

export default function transform(hookName, element, payload) {
  const doc = (payload && payload.document) || element.ownerDocument || document;
  const root = doc.body || element;

  if (hookName === 'beforeTransform') {
    // --- Site chrome (siblings of <main> inside #__next > div) ---
    remove(root, [
      'a[href="#main-content"]', // skip link
      '#announcementBanner', // global promo violator
      'header',
      'header.globalHeader',
      'nav',
      '#__next > div > div.fixed', // mobile menu drawer
      // Global footer: the div.bg-neutral-color-high AFTER </main>.
      // The in-main footnotes (#main-content > div.bg-neutral-color-high) are kept.
      '#main-content ~ div.bg-neutral-color-high',
      'main ~ div.bg-neutral-color-high',
      'footer',
    ]);

    // --- Third-party widgets / modals ---
    remove(root, [
      '#onetrust-consent-sdk',
      '.onetrust-pc-dark-filter',
      '#intercom-container',
      '.intercom-lightweight-app',
      '#hb_chatbot-root',
      '#modal-base-stories-modal',
      'next-route-announcer',
    ]);

    // Weglot language switcher: first child of #main-content holding the container
    const main = root.querySelector('#main-content');
    if (main) {
      const first = main.firstElementChild;
      if (first && (first.matches('.weglot-container, [id^="weglot-switcher"]') || first.querySelector('.weglot-container'))) {
        first.remove();
      }
    }
    remove(root, WEGLOT_SELECTORS);
    unwrapNextImages(root);
    // Weglot re-injects its switcher while the import runs; drop it again on every insert
    const win = doc.defaultView;
    if (win && win.MutationObserver && !win.__jhWeglotObserver) {
      win.__jhWeglotObserver = new win.MutationObserver(() => remove(root, WEGLOT_SELECTORS));
      win.__jhWeglotObserver.observe(root, { childList: true, subtree: true });
    }

    // Everything outside #__next on <body> is tracking / widget mounts
    const next = root.querySelector('#__next');
    if (next && doc.body) {
      [...doc.body.children].forEach((child) => {
        if (child !== next) child.remove();
      });
    }

    // --- Tracking pixels (keep hover.to embed iframe for embed-designer) ---
    root.querySelectorAll('iframe').forEach((iframe) => {
      const src = iframe.getAttribute('src') || '';
      if (/hover\.to/i.test(src)) return;
      if (
        /doubleclick\.net|adsrvr\.org|googletagmanager|facebook\.com\/tr|bat\.bing|linkedin|analytics/i.test(src)
        || iframe.classList.contains('ot-text-resize')
        || /universal_pixel/i.test(iframe.id || '')
        || !src
      ) {
        iframe.remove();
      }
    });
    remove(root, ['[id^="batBeacon"]', 'img[src*="doubleclick.net"]', 'img[src*="adsrvr.org"]', 'img[src*="bat.bing"]']);

    // --- Mobile duplicate CTAs (desktop copies stay) ---
    // rc4: "Why choose James Hardie?" mobile copy (md:hidden) inside div.px-4.lg:px-0
    root.querySelectorAll('#main-content > div.my-10 > div.px-4.lg\\:px-0').forEach((wrap) => {
      if (wrap.querySelector('a.md\\:hidden, a.lg\\:hidden')) wrap.remove();
    });
    // rc9: "Read our blog" mobile copy (lg:hidden) directly under div.pb-12
    root.querySelectorAll('#main-content > div.w-full div.pb-12 > a.lg\\:hidden').forEach((a) => a.remove());

    // --- Non-content elements ---
    remove(root, ['script', 'style', 'noscript', 'link']);
  }

  if (hookName === 'afterTransform') {
    // Final cleanup. Do NOT remove HTML comments (field hints).
    remove(root, [
      'script',
      'style',
      'noscript',
      'link',
      '#onetrust-consent-sdk',
      '#hb_chatbot-root',
      '#intercom-container',
      '.intercom-lightweight-app',
      ...WEGLOT_SELECTORS,
    ]);
    unwrapNextImages(root);

    // Strip tracking / framework attributes
    root.querySelectorAll('*').forEach((el) => {
      [...el.attributes].forEach((attr) => {
        const n = attr.name;
        if (
          n.startsWith('data-gtm')
          || n.startsWith('data-track')
          || n.startsWith('data-analytics')
          || n.startsWith('data-ot-')
          || n === 'onclick'
          || n === 'onload'
        ) {
          el.removeAttribute(n);
        }
      });
    });
  }
}

/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-campaign-landing.js
  var import_campaign_landing_exports = {};
  __export(import_campaign_landing_exports, {
    default: () => import_campaign_landing_default
  });

  // tools/importer/parsers/hero-video.js
  function parse(element, { document: document2 }) {
    const cells = [];
    const mediaCell = [];
    const posterImg = element.querySelector(".hero-cover img") || [...element.querySelectorAll("img")].find((i) => !(i.getAttribute("src") || "").startsWith("data:") && !i.closest("button, a"));
    const video = element.querySelector("video");
    const videoSrc = video ? video.getAttribute("src") || (video.querySelector("source[src]") || { getAttribute: () => "" }).getAttribute("src") : "";
    const posterSrc = posterImg && posterImg.getAttribute("src") || video && video.getAttribute("poster") || "";
    if (posterSrc) {
      const img = document2.createElement("img");
      img.src = posterSrc;
      img.alt = posterImg && posterImg.getAttribute("alt") || "";
      mediaCell.push(img);
    }
    if (videoSrc) {
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.href = videoSrc;
      a.textContent = videoSrc;
      p.append(a);
      mediaCell.push(p);
    }
    if (mediaCell.length) cells.push([mediaCell]);
    const contentCell = [];
    const heading = element.querySelector("h1, h2");
    const contentRoot = heading ? heading.parentElement : element;
    if (heading) {
      const h1 = document2.createElement("h1");
      h1.innerHTML = heading.innerHTML.trim();
      contentCell.push(h1);
    }
    [...contentRoot.children].forEach((child) => {
      if (child === heading || child.tagName === "A" || child.querySelector("a, h1, h2")) return;
      if (!child.textContent.trim()) return;
      const p = document2.createElement("p");
      p.innerHTML = child.innerHTML.trim();
      contentCell.push(p);
    });
    [...contentRoot.querySelectorAll("a[href]")].forEach((cta) => {
      const text = cta.textContent.trim();
      if (!text) return;
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.href = cta.getAttribute("href");
      a.textContent = text;
      if (/button-primary|bg-primary-color-pure/.test(cta.className || "")) {
        const strong = document2.createElement("strong");
        strong.append(a);
        p.append(strong);
      } else {
        p.append(a);
      }
      contentCell.push(p);
    });
    if (contentCell.length) cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-hotspot.js
  var BUTTON_HALF_PX = 20;
  var SLIDE_W = 410;
  var SLIDE_H = 516;
  function readPosition(btn) {
    const style = btn.getAttribute("style") || "";
    const left = style.match(/left:\s*(-?[\d.]+)%/i);
    const top = style.match(/top:\s*(-?[\d.]+)%/i);
    if (!left || !top) return null;
    const x = parseFloat(left[1]) + BUTTON_HALF_PX / SLIDE_W * 100;
    const y = parseFloat(top[1]) + BUTTON_HALF_PX / SLIDE_H * 100;
    const fmt = (n) => String(Math.round(Math.max(0, Math.min(100, n)) * 10) / 10);
    return `${fmt(x)}% ${fmt(y)}%`;
  }
  function parse2(element, { document: document2 }) {
    const cells = [];
    const slides = [...element.querySelectorAll("li.splide__slide")].filter((li) => !li.classList.contains("splide__slide--clone"));
    slides.forEach((slide) => {
      const img = [...slide.querySelectorAll("img")].find((i) => !(i.getAttribute("src") || "").startsWith("data:") && !i.closest("button, a"));
      const imageCell = [];
      if (img) {
        const pic = document2.createElement("img");
        pic.src = img.getAttribute("src");
        pic.alt = img.getAttribute("alt") || "";
        imageCell.push(pic);
      }
      const hotspotCell = [];
      [...slide.querySelectorAll("h5")].forEach((srcHeading) => {
        const popover = srcHeading.closest("div.absolute") || srcHeading.parentElement;
        let btn = popover ? popover.previousElementSibling : null;
        if (btn && btn.tagName !== "BUTTON") btn = null;
        const h5 = document2.createElement("h5");
        h5.innerHTML = srcHeading.innerHTML.trim();
        hotspotCell.push(h5);
        const pos = btn ? readPosition(btn) : null;
        if (pos) {
          const p = document2.createElement("p");
          p.textContent = pos;
          hotspotCell.push(p);
        }
        const scope = srcHeading.parentElement;
        const color = scope ? scope.querySelector("p") : null;
        if (color && color.textContent.trim()) {
          const p = document2.createElement("p");
          p.textContent = color.textContent.trim();
          hotspotCell.push(p);
        }
        const link = scope ? scope.querySelector("a[href]") : null;
        if (link) {
          const p = document2.createElement("p");
          const a = document2.createElement("a");
          a.href = link.getAttribute("href");
          a.textContent = link.textContent.trim() || "View product";
          p.append(a);
          hotspotCell.push(p);
        }
      });
      if (!imageCell.length && !hotspotCell.length) return;
      cells.push([imageCell, hotspotCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-hotspot", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-video.js
  function parse3(element, { document: document2 }) {
    const cells = [];
    const slides = [...element.querySelectorAll("li.splide__slide")].filter((li) => !li.classList.contains("splide__slide--clone"));
    slides.forEach((slide) => {
      const video = slide.querySelector("video");
      const source = video ? video.querySelector("source[src]") : null;
      const videoSrc = video && video.getAttribute("src") || source && source.getAttribute("src") || "";
      const srcTitle = slide.querySelector("h5, h4, h3");
      const posterCell = [];
      let posterSrc = video ? video.getAttribute("poster") : "";
      let posterAlt = "";
      if (!posterSrc) {
        const img = [...slide.querySelectorAll("img")].find((i) => !(i.getAttribute("src") || "").startsWith("data:"));
        if (img) {
          posterSrc = img.getAttribute("src");
          posterAlt = img.getAttribute("alt") || "";
        }
      }
      if (posterSrc) {
        const img = document2.createElement("img");
        img.src = posterSrc;
        img.alt = posterAlt || (srcTitle ? srcTitle.textContent.trim() : "");
        posterCell.push(img);
      }
      const contentCell = [];
      if (srcTitle) {
        const h5 = document2.createElement("h5");
        h5.innerHTML = srcTitle.innerHTML.trim();
        contentCell.push(h5);
      }
      if (videoSrc) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.href = videoSrc;
        a.textContent = videoSrc;
        p.append(a);
        contentCell.push(p);
      }
      if (!posterCell.length && !contentCell.length) return;
      cells.push([posterCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-designer.js
  var KEEP_PARAMS = ["isEmbed", "embedConfigId", "colorMode", "aff_org_id"];
  function cleanEmbedUrl(src) {
    try {
      const url = new URL(src, "https://hover.to");
      const clean2 = new URL(`${url.origin}${url.pathname}`);
      KEEP_PARAMS.forEach((k) => {
        if (url.searchParams.has(k)) clean2.searchParams.set(k, url.searchParams.get(k));
      });
      return clean2.toString();
    } catch (e) {
      return src;
    }
  }
  function parse4(element, { document: document2 }) {
    const cell = [];
    const iframe = element.querySelector('iframe[src*="hover.to"]');
    if (iframe) {
      const title = (iframe.getAttribute("title") || "").trim();
      if (title) {
        const h2 = document2.createElement("h2");
        h2.textContent = title;
        cell.push(h2);
      }
      const href = cleanEmbedUrl(iframe.getAttribute("src"));
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.href = href;
      a.textContent = href;
      p.append(a);
      cell.push(p);
    }
    const footerLink = element.querySelector("#hover-website-embed-footer a[href], a#hover-website-embed-footer-logo");
    if (footerLink && footerLink.getAttribute("href")) {
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.href = footerLink.getAttribute("href");
      a.textContent = footerLink.textContent.trim() || "Hover";
      p.append(a);
      cell.push(p);
    }
    const cells = [[cell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "embed-designer", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-video.js
  var clean = (s) => (s || "").replace(/\s+/g, " ").trim();
  function parse5(element, { document: document2 }) {
    const cells = [];
    const labels = [...element.querySelectorAll('button > h4, button > h3, [role="tab"]')].map((h) => clean(h.textContent)).filter(Boolean);
    const panels = [...element.querySelectorAll(".textImageItem")];
    panels.forEach((panel, i) => {
      let label = labels[i] || "";
      if (label) label = label.charAt(0).toUpperCase() + label.slice(1);
      const body = panel.querySelector(".textImageItemBody") || panel;
      const contentCell = [];
      const srcHeading = body.querySelector("h1, h2, h3");
      if (srcHeading) {
        const h2 = document2.createElement("h2");
        h2.innerHTML = srcHeading.innerHTML.replace(/\s+/g, " ").trim();
        contentCell.push(h2);
        if (!label) label = clean(srcHeading.textContent);
      }
      [...body.children].forEach((child) => {
        if (child === srcHeading || child.tagName === "A" || /^H[1-6]$/.test(child.tagName)) return;
        if (!clean(child.textContent)) return;
        if (child.querySelector("ul, ol, p")) {
          const div = document2.createElement("div");
          div.innerHTML = child.innerHTML;
          contentCell.push(...div.childNodes);
        } else {
          const p = document2.createElement("p");
          p.innerHTML = child.innerHTML.trim();
          contentCell.push(p);
        }
      });
      [...body.querySelectorAll(":scope > a[href]")].forEach((cta) => {
        const text = clean(cta.textContent);
        if (!text) return;
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.href = cta.getAttribute("href");
        a.textContent = text;
        p.append(a);
        contentCell.push(p);
      });
      const video = panel.querySelector("video");
      const source = video ? video.querySelector("source[src]") : null;
      const videoSrc = video && video.getAttribute("src") || source && source.getAttribute("src") || "";
      if (videoSrc) {
        const p = document2.createElement("p");
        const a = document2.createElement("a");
        a.href = videoSrc;
        a.textContent = videoSrc;
        p.append(a);
        contentCell.push(p);
      }
      if (!label && !contentCell.length) return;
      cells.push([label, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "tabs-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-social.js
  var DEFAULT_CLIENT_ID = "24392";
  function parse6(element, { document: document2 }) {
    const id = element.id || "";
    let clientId = DEFAULT_CLIENT_ID;
    let embedId = "";
    const match = id.match(/^sprinklr-embed-(\d+)-(.+)$/);
    if (match) {
      [, clientId, embedId] = match;
    } else {
      const cls = [...element.classList].find((c) => /^sprinklr-embed-\d+-/.test(c));
      const m = cls && cls.match(/^sprinklr-embed-(\d+)-(.+)$/);
      if (m) [, clientId, embedId] = m;
    }
    const parent = element.parentElement;
    if (parent) {
      parent.querySelectorAll(":scope > .swe_embed_controls").forEach((c) => {
        if (!c.textContent.trim()) c.remove();
      });
    }
    const cell = [];
    if (embedId) {
      const src = `https://gallery.sprinklr.com/clients/${clientId}/embeds/${embedId}/script.js`;
      const p = document2.createElement("p");
      const a = document2.createElement("a");
      a.href = src;
      a.textContent = src;
      p.append(a);
      cell.push(p);
    }
    const cells = [[cell]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "embed-social", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-article.js
  function parse7(element, { document: document2 }) {
    const cells = [];
    const slides = [...element.querySelectorAll("li.splide__slide")].filter((li) => !li.classList.contains("splide__slide--clone"));
    slides.forEach((slide) => {
      const pillLinks = [...slide.querySelectorAll('a[id^="topic-pill"]')];
      const articleLink = [...slide.querySelectorAll("a[href]")].find((a) => !pillLinks.includes(a));
      const href = articleLink ? articleLink.getAttribute("href") : "";
      const img = [...slide.querySelectorAll("img")].find((i) => !(i.getAttribute("src") || "").startsWith("data:"));
      const imageCell = [];
      if (img) {
        const pic = document2.createElement("img");
        pic.src = img.getAttribute("src");
        pic.alt = img.getAttribute("alt") || "";
        imageCell.push(pic);
      }
      const contentCell = [];
      const srcTitle = slide.querySelector("h3, .card-title");
      if (srcTitle) {
        const h3 = document2.createElement("h3");
        if (href) {
          const a = document2.createElement("a");
          a.href = href;
          a.innerHTML = srcTitle.innerHTML.trim();
          h3.append(a);
        } else {
          h3.innerHTML = srcTitle.innerHTML.trim();
        }
        contentCell.push(h3);
      }
      if (pillLinks.length) {
        const p = document2.createElement("p");
        pillLinks.forEach((pill, i) => {
          if (i > 0) p.append(document2.createTextNode(" "));
          const a = document2.createElement("a");
          a.href = pill.getAttribute("href");
          a.textContent = pill.textContent.trim();
          p.append(a);
        });
        contentCell.push(p);
      }
      if (!imageCell.length && !contentCell.length) return;
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/jameshardie-cleanup.js
  var remove = (root, selectors) => {
    selectors.forEach((sel) => {
      try {
        root.querySelectorAll(sel).forEach((el) => el.remove());
      } catch (e) {
      }
    });
  };
  var WEGLOT_SELECTORS = [
    ".weglot-container",
    ".weglot_switcher",
    '[id^="weglot"]',
    '[id^="wg-"]',
    ".language-list",
    ".language-option"
  ];
  var unwrapNextImages = (root) => {
    root.querySelectorAll('img[src*="/_next/image"], source[srcset*="/_next/image"]').forEach((el) => {
      const attr = el.hasAttribute("src") ? "src" : "srcset";
      const value = (el.getAttribute(attr) || "").split(/\s+/)[0];
      try {
        const original = new URL(value, "https://www.jameshardie.com").searchParams.get("url");
        if (original) {
          el.setAttribute(attr, new URL(original, "https://www.jameshardie.com").href);
          if (attr === "src") el.removeAttribute("srcset");
        }
      } catch (e) {
      }
    });
  };
  function transform(hookName, element, payload) {
    const doc = payload && payload.document || element.ownerDocument || document;
    const root = doc.body || element;
    if (hookName === "beforeTransform") {
      remove(root, [
        'a[href="#main-content"]',
        // skip link
        "#announcementBanner",
        // global promo violator
        "header",
        "header.globalHeader",
        "nav",
        "#__next > div > div.fixed",
        // mobile menu drawer
        // Global footer: the div.bg-neutral-color-high AFTER </main>.
        // The in-main footnotes (#main-content > div.bg-neutral-color-high) are kept.
        "#main-content ~ div.bg-neutral-color-high",
        "main ~ div.bg-neutral-color-high",
        "footer"
      ]);
      remove(root, [
        "#onetrust-consent-sdk",
        ".onetrust-pc-dark-filter",
        "#intercom-container",
        ".intercom-lightweight-app",
        "#hb_chatbot-root",
        "#modal-base-stories-modal",
        "next-route-announcer"
      ]);
      const main = root.querySelector("#main-content");
      if (main) {
        const first = main.firstElementChild;
        if (first && (first.matches('.weglot-container, [id^="weglot-switcher"]') || first.querySelector(".weglot-container"))) {
          first.remove();
        }
      }
      remove(root, WEGLOT_SELECTORS);
      unwrapNextImages(root);
      const win = doc.defaultView;
      if (win && win.MutationObserver && !win.__jhWeglotObserver) {
        win.__jhWeglotObserver = new win.MutationObserver(() => remove(root, WEGLOT_SELECTORS));
        win.__jhWeglotObserver.observe(root, { childList: true, subtree: true });
      }
      const next = root.querySelector("#__next");
      if (next && doc.body) {
        [...doc.body.children].forEach((child) => {
          if (child !== next) child.remove();
        });
      }
      root.querySelectorAll("iframe").forEach((iframe) => {
        const src = iframe.getAttribute("src") || "";
        if (/hover\.to/i.test(src)) return;
        if (/doubleclick\.net|adsrvr\.org|googletagmanager|facebook\.com\/tr|bat\.bing|linkedin|analytics/i.test(src) || iframe.classList.contains("ot-text-resize") || /universal_pixel/i.test(iframe.id || "") || !src) {
          iframe.remove();
        }
      });
      remove(root, ['[id^="batBeacon"]', 'img[src*="doubleclick.net"]', 'img[src*="adsrvr.org"]', 'img[src*="bat.bing"]']);
      root.querySelectorAll("#main-content > div.my-10 > div.px-4.lg\\:px-0").forEach((wrap) => {
        if (wrap.querySelector("a.md\\:hidden, a.lg\\:hidden")) wrap.remove();
      });
      root.querySelectorAll("#main-content > div.w-full div.pb-12 > a.lg\\:hidden").forEach((a) => a.remove());
      remove(root, ["script", "style", "noscript", "link"]);
    }
    if (hookName === "afterTransform") {
      remove(root, [
        "script",
        "style",
        "noscript",
        "link",
        "#onetrust-consent-sdk",
        "#hb_chatbot-root",
        "#intercom-container",
        ".intercom-lightweight-app",
        ...WEGLOT_SELECTORS
      ]);
      unwrapNextImages(root);
      root.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          const n = attr.name;
          if (n.startsWith("data-gtm") || n.startsWith("data-track") || n.startsWith("data-analytics") || n.startsWith("data-ot-") || n === "onclick" || n === "onload") {
            el.removeAttribute(n);
          }
        });
      });
    }
  }

  // tools/importer/transformers/jameshardie-sections.js
  var MARKER = "data-excat-section-id";
  function findSectionElement(root, section) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const sel of selectors) {
      if (!sel) continue;
      try {
        const el = root.querySelector(sel);
        if (el) return el;
      } catch (e) {
      }
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;
    const doc = payload && payload.document || element.ownerDocument || document;
    const root = doc.body || element;
    if (hookName === "beforeTransform") {
      const resolved = sections.map((s) => findSectionElement(root, s));
      const firstIndex = resolved.findIndex((el) => !!el);
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        const el = resolved[i];
        if (!el) continue;
        const isFirst = i === firstIndex;
        if (isFirst && !section.style) continue;
        const hr = doc.createElement("hr");
        if (section.style) hr.setAttribute(MARKER, section.id);
        if (isFirst) hr.setAttribute("data-excat-first-section", "true");
        el.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      const markers = [...root.querySelectorAll(`hr[${MARKER}]`)];
      const byId = new Map(markers.map((hr) => [hr.getAttribute(MARKER), hr]));
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = byId.get(section.id);
        let anchor = null;
        if (marker) {
          let node = marker.nextElementSibling;
          let last = marker;
          while (node && node.tagName !== "HR") {
            last = node;
            node = node.nextElementSibling;
          }
          anchor = last;
        } else {
          anchor = findSectionElement(root, section);
        }
        if (!anchor) continue;
        const meta = WebImporter.Blocks.createBlock(doc, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(meta);
      }
      markers.forEach((hr) => {
        if (hr.getAttribute("data-excat-first-section") === "true") {
          hr.remove();
        } else {
          hr.removeAttribute(MARKER);
        }
      });
    }
  }

  // tools/importer/import-campaign-landing.js
  var PAGE_TEMPLATE = {
    "name": "campaign-landing",
    "description": "Rich media landing page led by a full-width video hero, followed by tabbed media sections, card grids, embeds and a closing carousel",
    "urls": [
      "https://www.jameshardie.com/"
    ],
    "blocks": [
      {
        "name": "hero-video",
        "instances": [
          "div.hero-video-overlay"
        ]
      },
      {
        "name": "carousel-hotspot",
        "instances": [
          "div.slim .splide"
        ]
      },
      {
        "name": "carousel-video",
        "instances": [
          "div.my-10 > div.splide"
        ]
      },
      {
        "name": "embed-designer",
        "instances": [
          'div.base-container-background:has(iframe[src*="hover.to"])'
        ]
      },
      {
        "name": "tabs-video",
        "instances": [
          "div.mx-auto.flex.flex-col.justify-center:has(.textImageItem)"
        ]
      },
      {
        "name": "embed-social",
        "instances": [
          "div.swe_embed"
        ]
      },
      {
        "name": "carousel-article",
        "instances": [
          '.splide:has(a[href*="/blog/"])'
        ]
      }
    ],
    "sections": [
      {
        "id": "rc2",
        "name": "Video hero",
        "selector": [
          "#main-content > div.hero-video-overlay"
        ],
        "style": null,
        "blocks": [
          "hero-video"
        ],
        "defaultContent": []
      },
      {
        "id": "rc3",
        "name": "Explore our products",
        "selector": [
          "#main-content > div.slim"
        ],
        "style": null,
        "blocks": [
          "carousel-hotspot"
        ],
        "defaultContent": [
          "div.slim > div.relative > div.inner-container:first-child"
        ]
      },
      {
        "id": "rc4",
        "name": "Discover what sets us apart",
        "selector": [
          "#main-content > div.my-10"
        ],
        "style": null,
        "blocks": [
          "carousel-video"
        ],
        "defaultContent": [
          "div.my-10 > div.block"
        ]
      },
      {
        "id": "rc5",
        "name": "Hover designer embed",
        "selector": [
          "#main-content > div.base-container-background"
        ],
        "style": null,
        "blocks": [
          "embed-designer"
        ],
        "defaultContent": []
      },
      {
        "id": "rc6",
        "name": "Hardie Designer intro",
        "selector": [
          "#main-content > div.items-center.bg-transparent"
        ],
        "style": "centered",
        "blocks": [],
        "defaultContent": [
          "div.items-center.bg-transparent div.flex.flex-col.text-center"
        ]
      },
      {
        "id": "rc7",
        "name": "Hardie Designer feature tabs",
        "selector": [
          "#main-content > div.m-auto.flex.flex-col"
        ],
        "style": null,
        "blocks": [
          "tabs-video"
        ],
        "defaultContent": []
      },
      {
        "id": "rc8",
        "name": "Social gallery",
        "selector": [
          "#main-content > div.w-full:has(div.swe_embed)"
        ],
        "style": "light",
        "blocks": [
          "embed-social"
        ],
        "defaultContent": [
          "div.inner-container:has(div.swe_embed) > div.block"
        ]
      },
      {
        "id": "rc9",
        "name": "Latest blog articles",
        "selector": [
          "#main-content > div.w-full:has(div.pb-12)"
        ],
        "style": "beige",
        "blocks": [
          "carousel-article"
        ],
        "defaultContent": [
          "div.pb-12 > div.block"
        ]
      },
      {
        "id": "rc10",
        "name": "Footnote - Freedonia",
        "selector": [
          "#main-content > div.bg-neutral-color-high:has(.pt-2)"
        ],
        "style": "dark, footnote",
        "blocks": [],
        "defaultContent": [
          "div.bg-neutral-color-high .italic.pt-2"
        ]
      },
      {
        "id": "rc11",
        "name": "Footnote - fire rating",
        "selector": [
          "#main-content > div.bg-neutral-color-high:not(:has(.pt-2))"
        ],
        "style": "dark, footnote",
        "blocks": [],
        "defaultContent": [
          "div.bg-neutral-color-high .italic:not(.pt-2)"
        ]
      }
    ]
  };
  var parsers = {
    "hero-video": parse,
    "carousel-hotspot": parse2,
    "carousel-video": parse3,
    "embed-designer": parse4,
    "tabs-video": parse5,
    "embed-social": parse6,
    "carousel-article": parse7
  };
  var transformers = [
    transform,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        document2.querySelectorAll(selector).forEach((element) => {
          pageBlocks.push({ name: blockDef.name, selector, element });
        });
      });
    });
    return pageBlocks;
  }
  var import_campaign_landing_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document: document2, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document2.createElement("hr"));
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document2.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }];
    }
  };
  return __toCommonJS(import_campaign_landing_exports);
})();

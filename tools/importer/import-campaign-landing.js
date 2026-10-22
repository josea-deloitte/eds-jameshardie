/* eslint-disable */
/* global WebImporter */

import heroVideoParser from './parsers/hero-video.js';
import carouselHotspotParser from './parsers/carousel-hotspot.js';
import carouselVideoParser from './parsers/carousel-video.js';
import embedDesignerParser from './parsers/embed-designer.js';
import tabsVideoParser from './parsers/tabs-video.js';
import embedSocialParser from './parsers/embed-social.js';
import carouselArticleParser from './parsers/carousel-article.js';

import jameshardieCleanupTransformer from './transformers/jameshardie-cleanup.js';
import jameshardieSectionsTransformer from './transformers/jameshardie-sections.js';

const PAGE_TEMPLATE = {
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
        "div.base-container-background:has(iframe[src*=\"hover.to\"])"
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
        ".splide:has(a[href*=\"/blog/\"])"
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

const parsers = {
  'hero-video': heroVideoParser,
  'carousel-hotspot': carouselHotspotParser,
  'carousel-video': carouselVideoParser,
  'embed-designer': embedDesignerParser,
  'tabs-video': tabsVideoParser,
  'embed-social': embedSocialParser,
  'carousel-article': carouselArticleParser,
};

// cleanup first, then sections
const transformers = [
  jameshardieCleanupTransformer,
  jameshardieSectionsTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((fn) => {
    try { fn(hookName, element, enhancedPayload); }
    catch (e) { console.error(`Transformer failed at ${hookName}:`, e); }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (!parser) return;
      try { parser(block.element, { document, url, params }); }
      catch (e) { console.error(`Failed to parse ${block.name} (${block.selector}):`, e); }
    });

    executeTransformers('afterTransform', main, payload);

    main.appendChild(document.createElement('hr'));
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) },
    }];
  },
};

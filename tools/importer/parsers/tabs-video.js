/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-video.
 * Source: tab bar of <button><h4>label</h4></button> followed by one panel per tab
 * (.textImageItem, inactive panels wrapped in div.hidden but present in the DOM).
 * Each panel: .textImageItemBody (H2, span text, optional CTA link) and
 * .textImageItemImage (react-player <video src>). The video poster is a generic
 * site fallback image, so it is not authored.
 *
 * Output: one row per tab -> [label] | [H2, paragraph, optional CTA, link to MP4].
 * Labels and panels are paired by document order.
 */
const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();

export default function parse(element, { document }) {
  const cells = [];

  const labels = [...element.querySelectorAll('button > h4, button > h3, [role="tab"]')]
    .map((h) => clean(h.textContent))
    .filter(Boolean);
  const panels = [...element.querySelectorAll('.textImageItem')];

  panels.forEach((panel, i) => {
    let label = labels[i] || '';
    // source lowercases some labels and capitalizes via CSS
    if (label) label = label.charAt(0).toUpperCase() + label.slice(1);

    const body = panel.querySelector('.textImageItemBody') || panel;
    const contentCell = [];

    const srcHeading = body.querySelector('h1, h2, h3');
    if (srcHeading) {
      const h2 = document.createElement('h2');
      h2.innerHTML = srcHeading.innerHTML.replace(/\s+/g, ' ').trim();
      contentCell.push(h2);
      if (!label) label = clean(srcHeading.textContent);
    }

    // Body text: direct text children (span/div/p) that are not heading or link
    [...body.children].forEach((child) => {
      if (child === srcHeading || child.tagName === 'A' || /^H[1-6]$/.test(child.tagName)) return;
      if (!clean(child.textContent)) return;
      if (child.querySelector('ul, ol, p')) {
        // rich text: keep block structure
        const div = document.createElement('div');
        div.innerHTML = child.innerHTML;
        contentCell.push(...div.childNodes);
      } else {
        const p = document.createElement('p');
        p.innerHTML = child.innerHTML.trim();
        contentCell.push(p);
      }
    });

    // Optional CTA link(s)
    [...body.querySelectorAll(':scope > a[href]')].forEach((cta) => {
      const text = clean(cta.textContent);
      if (!text) return;
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.getAttribute('href');
      a.textContent = text;
      p.append(a);
      contentCell.push(p);
    });

    // Video link
    const video = panel.querySelector('video');
    const source = video ? video.querySelector('source[src]') : null;
    const videoSrc = (video && video.getAttribute('src')) || (source && source.getAttribute('src')) || '';
    if (videoSrc) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = videoSrc;
      a.textContent = videoSrc;
      p.append(a);
      contentCell.push(p);
    }

    if (!label && !contentCell.length) return;
    cells.push([label, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-video', cells });
  element.replaceWith(block);
}

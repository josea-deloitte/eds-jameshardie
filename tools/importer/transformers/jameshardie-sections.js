/* eslint-disable */
/* global WebImporter */

/**
 * James Hardie sections transformer.
 *
 * beforeTransform: inserts <hr> section breaks before every non-first section
 * (while the original section elements still exist) and marks breaks of styled
 * sections with data-excat-section-id. A styled first section gets a temporary
 * marked <hr>.
 * afterTransform: inserts a Section Metadata block (style) at the end of each
 * styled section, then removes markers and the first section's temporary <hr>.
 */

const MARKER = 'data-excat-section-id';

function findSectionElement(root, section) {
  const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
  for (const sel of selectors) {
    if (!sel) continue;
    try {
      const el = root.querySelector(sel);
      if (el) return el;
    } catch (e) {
      // unsupported selector, try next
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const template = payload && payload.template;
  const sections = template && Array.isArray(template.sections) ? template.sections : [];
  if (sections.length < 2) return;

  const doc = (payload && payload.document) || element.ownerDocument || document;
  const root = doc.body || element;

  if (hookName === 'beforeTransform') {
    // Resolve elements up front so later inserts don't affect matching
    const resolved = sections.map((s) => findSectionElement(root, s));
    const firstIndex = resolved.findIndex((el) => !!el);

    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      const el = resolved[i];
      if (!el) continue;
      const isFirst = i === firstIndex;
      if (isFirst && !section.style) continue;

      const hr = doc.createElement('hr');
      if (section.style) hr.setAttribute(MARKER, section.id);
      if (isFirst) hr.setAttribute('data-excat-first-section', 'true');
      el.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    const markers = [...root.querySelectorAll(`hr[${MARKER}]`)];
    const byId = new Map(markers.map((hr) => [hr.getAttribute(MARKER), hr]));

    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = byId.get(section.id);
      let anchor = null;

      if (marker) {
        // Section ends right before the next <hr> (section break) after the marker
        let node = marker.nextElementSibling;
        let last = marker;
        while (node && node.tagName !== 'HR') {
          last = node;
          node = node.nextElementSibling;
        }
        anchor = last;
      } else {
        anchor = findSectionElement(root, section);
      }
      if (!anchor) continue;

      const meta = WebImporter.Blocks.createBlock(doc, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(meta);
    }

    markers.forEach((hr) => {
      if (hr.getAttribute('data-excat-first-section') === 'true') {
        hr.remove();
      } else {
        hr.removeAttribute(MARKER);
      }
    });
  }
}

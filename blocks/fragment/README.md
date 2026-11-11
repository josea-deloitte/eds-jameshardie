# Fragment

## 1. Purpose and where it is used
Reuses content authored once under `/fragments/` on any page, for example a shared call-to-action band or disclaimer. Header and footer content live in `/nav` and `/footer`, not here.

## 2. DA table structure
Two ways, both inside the page:
1. Auto: put a link to a `/fragments/...` page alone in a paragraph. It is replaced by the fragment's content automatically; no block is written.
2. Explicit: header row `Fragment`, one cell holding the link (or the plain path text).

| Cell | Required | Notes |
|---|---|---|
| Link or path starting with `/` (e.g. `/fragments/cta-band`) | Yes | Must be a path on this site (not `//` or an external URL). If the page does not exist, nothing shows |

If the fragment is the only content of its section, the fragment's sections replace that section (their section styles apply). Otherwise the content is merged into the current section.

## 3. Variants
No variants.

## 4. Formatting rules
- Fragment pages are normal DA pages in `/fragments/`; they may contain blocks and section-metadata.
- Relative images in the fragment resolve against the fragment's folder.
- Do not link a fragment from inside itself.

## 5. Section styles
Style the fragment's own sections inside the fragment page. When the Fragment is alone in its section, the fragment's sections replace that section, so the host section's metadata is dropped.

## 6. Copy-ready example
| Fragment |
|---|
| /fragments/cta-band |

Or a paragraph containing only a link to `/fragments/cta-band`.

Common mistakes
- Other text in the same paragraph as the auto link (only a link on its own line is replaced).
- Previewing/publishing the page but not the fragment.
- Typing the path without the leading `/`.

## 7. Accessibility notes
Keep headings in the fragment compatible with every page that uses it (avoid H1). Link text and image alt text must make sense out of context, since the same text appears on many pages.

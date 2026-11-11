# Footer

## 1. Purpose and where it is used
The site footer on every page: social links and phone number, four link columns, logo, legal line and location button. It is not placed in a page. It is built from one document called `footer` at the site root (`/footer` in DA). A page can point to a different document with a `footer` metadata row.

## 2. DA table structure
The `footer` document has no block table. It is a series of sections separated by `---` dividers, **in this fixed order**.

| # | Section | Content |
|---|---|---|
| 1 | Social and contact | `H3` heading ("Follow James Hardie"), a list of social links, each an icon image (alt text = network name), then a paragraph: bold "Contact Us" and a phone link. |
| 2 | Link columns | A list; each item is a paragraph (column heading) plus a nested list of links. 4 columns on the live site. Headings collapse into an accordion on mobile. |
| 3 | Brand | A linked logo image (link to `/`). |
| 4 | Legal | A copyright paragraph, then a list of legal links. A link to `#cookie-settings` opens the cookie preferences. |
| 5 | Utility | A list with a location icon item showing the ZIP code (opens the header location drawer). |

Required: none; every section is optional and is skipped when absent. Do not reorder.

## 3. Variants
None.

## 4. Formatting rules
- Images: SVG icons and logo. Social icon alt text is the link label, so write "Facebook", "YouTube" and so on.
- Broken imports (`about:error`): social links fall back to the network name as text, other images are hidden. Replace them with real images when possible.
- Links: relative site paths for internal pages; external links in the social list open in a new tab.
- Copyright: type the text out; the year is not updated automatically.

## 5. Section styles
Section Metadata is not used in `footer`.

## 6. Example and common mistakes
```
(social)  ### Follow James Hardie
          - [(icon) Facebook](https://www.facebook.com/jameshardie)
          **Contact Us** [1-888-J-HARDIE](tel:1-888-J-HARDIE)
---
(links)   - Quick Links
            - [Request a Quote](/request-siding-quote)
          - Homeowner Help
            - [Hardie Designer Tool](/hardie-designer)
---
(brand)   [(logo)](/)
---
(legal)   (c) 2026 James Hardie Building Products Inc.
          - [Privacy Policy](/privacy-policy)
          - [Cookie settings](#cookie-settings)
---
(utility) - (location icon) 60601
```
Common mistakes:
- Putting links directly under the heading without a nested list.
- Leaving out a divider so two sections merge and shift the order.
- Typing a social link without an image or text: the link has no name.

## 7. Accessibility notes for authors
- Column headings are buttons on mobile; keep them short and unique.
- Every social link needs a name (alt text or text), or screen readers announce nothing.
- Use plain link text such as "Privacy Policy".
- Transitions are removed for visitors who prefer reduced motion.

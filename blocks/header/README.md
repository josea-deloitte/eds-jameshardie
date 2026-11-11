# Header

## 1. Purpose and where it is used
The site header on every page: announcement banner, utility bar (Get a Quote, Find a Contractor, location), logo, mega-menu navigation, search and cart. It is not placed in a page. It is built from one document called `nav` at the site root (`/nav` in DA). A page can point to a different document with a `nav` metadata row (for example `/nav-landing`).

## 2. DA table structure
The `nav` document has no block table. It is a series of sections separated by `---` dividers, **in this fixed order**. Omit a section by leaving it out only from the end; do not reorder.

| # | Section | Content |
|---|---|---|
| 1 | Announcement banner (optional) | A paragraph with the message (bold lead-in allowed), then a paragraph containing only a link. Shown as a dark green band with a close button. |
| 2 | Utility bar | A list: `Get a Quote` link, `Find a Contractor` link, then an item with a location icon and the default ZIP code. Shown as a dark (#333) bar with white 16px text on desktop. |
| 3 | Brand | A linked logo image; the link goes to `/`. |
| 4 | Main navigation | A list with one item per top menu (4 on the live site). See below. |
| 5 | Tools | A list of two items: search icon, cart icon (alt text becomes the button label). |
| 6 | Search | Paragraph: placeholder text. Paragraph: a link to the search page (link text is the button label). |
| 7 | Location drawer | `H2` title, then paragraphs in order: "Current ZIP:" label, helper text, ZIP field label, ZIP placeholder, "Use my current location", "Update my location". |
| 8 | Cart drawer | `H2` title, icon image, `H3` empty-state heading, paragraph, paragraph (button label). |
| 9 | Mobile quick links (optional) | A list: icon + label items linking to Get a Quote and Find a Contractor, and the location item. Shown at the bottom of the mobile menu. |

Main navigation list (section 4):
- Top-level item: a paragraph with the menu name (becomes the button), followed by a nested list = the panel.
- Panel columns (each nested item): a paragraph heading plus a list of links = one link column (15 columns on the live site). Put **bold links** (`**[See All Products](/product-catalog)**`) at the end of a column for the green call-to-action link.
- Promo card (each nested item with an image): a linked image and a linked caption = a feature card (4 on the live site).
- An item with only a link (no nested list) is shown as a plain link.

Required: sections 3 and 4. If the `nav` document is missing the header stays empty. Missing optional sections are skipped, except that search, location and cart drawers render with empty text if sections 6-8 are missing.

## 3. Variants
None.

## 4. Formatting rules
- Images: SVG logo and icons; icon alt text is used as the button label, so write "Open search modal", "Open shopping cart", "Open Location menu".
- Do not leave the image as a broken import (`about:error`). Broken images are hidden so no broken icon appears, but the card shows text only and the cart and location icons will be missing until real images are added. Search falls back to a built-in icon.
- Links: relative site paths (`/find-a-contractor`). Promo-banner links open in a new tab.
- Trademark characters are automatically shown as superscripts inside links.

## 5. Section styles
Section Metadata is not used in `nav`.

## 6. Example and common mistakes
```
(banner)   **See the difference.** Order color samples.
           [Get free samples](/statement-collection-colors)
---
(utility)  - [Get a Quote](/request-siding-quote)
           - [Find a Contractor](/find-a-contractor)
           - (location icon) 60601
---
(brand)    [(logo)](/)
---
(main)     - Our Products
             - By Siding Type
               - [Plank Lap Siding](/product-catalog/...)
               - **[See All Products](/product-catalog)**
             - [(image)](/product-catalog) / [Download our catalog](/request-james-hardie-catalog)
```
Common mistakes:
- Deleting the banner and keeping the rest: sections shift position. Leave an empty section (a blank `---` block) to keep the order.
- Putting the menu name and links in the same paragraph: the name must be its own paragraph above the nested list.
- Adding more than one level of nesting inside a column.
- Editing the `/nav` copy in `/content/`; DA publishes `/nav`.

## 7. Accessibility notes for authors
- Menu buttons, the mobile menu and drawers are keyboard operable; Escape closes them.
- Write descriptive link text; avoid duplicate names that go to different pages.
- Give logo and icon images meaningful alt text. Promo-card images should have alt text, or empty alt if the caption says the same.
- Animations are removed for visitors who prefer reduced motion.

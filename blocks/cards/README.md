# Cards

## 1. Purpose and where it is used
A grid of cards. Used for value propositions, help topics, popular links, statistics and product listings on the home page and landing pages.

## 2. DA table structure
| Cards | |
|---|---|
| (image or icon) | Title, text, link |
| (image or icon) | Title, text, link |

- One row per card, two cells: image/icon (optional) and text (required).
- Leave the image cell empty for a text-only card; an empty cell is dropped.
- Title: H3 (H2 for `stat`). Text: one short paragraph. Link: optional.

## 3. Variants
Add in the header: `Cards (icon)`.

| Variant | Content | Look |
|---|---|---|
| (none) | image, title, text, link | Bordered cards with a shadow |
| `icon` | icon, H3, text, optional button | Centered, no border (value propositions) |
| `help` | optional image, title, text, link | Green-bordered card, whole card links |
| `popular-link` | icon, title, text, "See more" link | Light card, whole card links |
| `stat` | H2 figure (e.g. 30), text | Large green number, no icon or border |
| `product` | image, title, text, button | Square product image, button at the bottom |

## 4. Formatting rules
- Images: at least 750px wide, 4:3 landscape (product: square on white). Icons: SVG or square image, shown at 48px; use `:icon-name:` where an icon exists.
- Links: in `help` and `popular-link` use exactly one link in the text; the whole card becomes clickable. In `icon` and `product` use a **bold** link for a green button.
- Headings: H3 for card titles, H2 only in `stat`.

## 5. Section styles
`light` or `beige` behind `icon` and `stat`; `beige` behind `popular-link`. Cards keep their own background inside `dark` and `primary-band` sections.

## 6. Example and common mistakes
| Cards (popular-link) | |
|---|---|
| :icon-brush: | ### Colors / Browse our palette. / [See more](/colors) |
| :icon-tools: | ### Installation / Guides for contractors. / [See more](/installation) |

Common mistakes:
- Two links in a clickable card (only one is allowed).
- Putting the image in the same cell as the text.
- Skipping heading levels.
- Very long text: keep to about 20 words.

## 7. Accessibility notes
- Informative images need alt text; icons that repeat the title can have empty alt.
- Link text must be meaningful on its own; avoid repeating identical "See more" labels where the card title does not clarify them.
- Card text must keep 4.5:1 contrast; do not use pale text colours.

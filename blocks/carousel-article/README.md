# Carousel Article

## 1. Purpose and where it is used
A sliding row of article cards (image, linked title, optional short description, category tags) with previous/next arrows and a progress bar. Used for the "Read our blog" rail on the home page and on pages that feature recent articles. For video cards use `Carousel Video`; for product photos with pop-up details use `Carousel Hotspot`.

## 2. DA table structure
| Carousel Article | |
|---|---|
| (image) | ### [Article title](/blog/article-path) |
| | Optional one or two sentences describing the article. |
| | [Category](/blog/category) [Another category](/blog/other) |

One row per card, two cells per row.

- Cell 1, image (optional): one landscape picture. Without it the card shows text only.
- Cell 2, content: an `H3` (or other heading) containing the link to the article (required for a clickable card), then an optional description, then optional category links.
- Description (optional): a plain paragraph with no links. It is limited to three lines on the card. Omit it and the card looks like the original title-and-tags card.
- Category links (optional): any other links in the cell; each shows as an outlined pill.
- Empty rows are ignored. A card with no heading link is shown but is not clickable.

## 3. Variants
No variants. The look of the surrounding band comes from the section style (see section 5).

## 4. Formatting rules
- Images: landscape, at least 750px wide. Add alt text that describes the picture, or leave alt empty only if the image is purely decorative.
- Title: keep under about 70 characters; it is cut at two lines. The registered mark and trademark characters may be used in text.
- Links: do not make them bold or italic here; buttons are not used inside cards.
- Heading above the block: put an `H2`/`H3` and an optional "Read our blog" link above the table in the same section; they are laid out as a heading row on desktop.
- Icons are added by the block; do not type `:icon:` codes in cards.

## 5. Section styles
Put a Section Metadata table in the same section.

| Style | Result |
|---|---|
| `beige` | Sand band behind the cards (used on the home page) |
| `light` | Light grey-beige band |
| `padding none`, `padding small`, `padding medium` | Adjusts spacing above and below |

## 6. Example and common mistakes
| Carousel Article | |
|---|---|
| ![Light grey house with white trim](house.jpg) | ### [How to choose a siding color](/blog/explore-exterior-design/choosing-siding-colors) |
| | Start with the architecture and the light around your home. |
| | [Design](/blog/explore-exterior-design) |

| Section Metadata | |
|---|---|
| Style | beige |

Common mistakes:
- Putting the image and text in separate rows. Use one row per card.
- Linking the description paragraph. Any paragraph with a link is treated as a category tag, not a description.
- Using a heading without a link and expecting a clickable card.
- Very tall or portrait images. They are cropped to a landscape frame.

## 7. Accessibility notes for authors
- Give every image meaningful alt text. The image link repeats the title link, so keyboard users only tab once per card.
- Write link text that names the article, not "Read more".
- The carousel is announced as "Articles" with previous/next buttons; keep the number of cards reasonable (about 10 or fewer).
- Users who prefer reduced motion get instant scrolling and no zoom on hover.

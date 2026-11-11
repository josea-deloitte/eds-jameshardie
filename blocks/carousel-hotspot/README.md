# Carousel Hotspot

## 1. Purpose and where it is used
A sliding row of large product photos with (+) buttons placed on the products. Selecting a button opens a small card with the product name, color and a "View product" link. The first button starts open. Used for the "shop the look" rail on the home page. For article cards use `Carousel Article`; for video cards use `Carousel Video`.

## 2. DA table structure
| Carousel Hotspot | |
|---|---|
| (product photo) | ##### Hardie Plank lap siding |
| | 40% 60% |
| | Arctic White |
| | [View product](/product-catalog/exterior-siding-products/hardie-plank-lap-siding) |

One row per slide, two cells per row.

- Cell 1, photo (required): one tall product photo. Slides have a fixed size (315x464 on phones, 410x516 on desktop), so the photo is cropped to fit.
- Cell 2, hotspots: one group per hotspot. Each group starts with a heading (the product name), followed by an optional position, optional color and optional link.
- Position (optional): where the (+) button sits on the photo, as percentages from the top-left, for example `40% 60%`, `40, 60` or `x: 40, y: 60`. Without a position the hotspots get default spots.
- Color (optional): a plain paragraph.
- Link (optional): shown as "View product". Without it the card has no link.
- A slide can have several hotspots; repeat the group. Empty rows are ignored.

## 3. Variants
No variants.

## 4. Formatting rules
- Images: portrait, at least 820px wide. Keep the products in the middle of the picture because edges can be cropped. Always add alt text describing the scene.
- Product name: a heading, one per hotspot.
- Position: numbers only; keep hotspots at least 10 percent apart so buttons do not overlap.
- Links: plain links, not buttons.

## 5. Section styles
| Style | Result |
|---|---|
| `light` or `beige` | Tinted band |
| `padding none`, `padding small`, `padding medium` | Adjusts spacing |

An intro heading, paragraph and call-to-action link placed above the table in the same section form the intro row.

## 6. Example and common mistakes
| Carousel Hotspot | |
|---|---|
| ![Modern home with gray lap siding](look-1.jpg) | ##### Hardie Plank lap siding |
| | 45% 55% |
| | Iron Gray |
| | [View product](/product-catalog/exterior-siding-products/hardie-plank-lap-siding) |

Common mistakes:
- Putting the position before the product name: every group must start with the heading.
- Writing the position as a word ("center"). Use numbers.
- Using a landscape photo: the important area may be cropped away.
- Leaving the link text vague: use "View product" or the product name.

## 7. Accessibility notes for authors
- Each (+) button is a keyboard button announced as expanded or collapsed; Escape closes the open card and returns focus to its button.
- Photos need alt text that describes what is shown; hotspot cards carry the product details, so do not repeat them in the alt text.
- Use specific link text for the product link.
- Reduced-motion users get instant scrolling and no fade effects.

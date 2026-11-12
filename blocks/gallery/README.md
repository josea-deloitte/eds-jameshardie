# Gallery

## 1. Purpose and where it is used
A grid of photos that open larger in a lightbox. Used on "Start your siding project" (Step 2, "Where inspiration meets design", 12 images with one featured image and a "Browse images" button).

## 2. DA table structure
| Gallery | |
|---|---|
| Picture | Optional caption, optional link |

- One row per image. A row can have one cell or several; all content is read from the row.
- Required: a picture. A row without a picture is ignored.
- Optional: a plain text paragraph (caption, shown in the lightbox) and a link (shown under the image in the lightbox as a text link; the link text is used as its label, or "Learn more" for an image link).
- The section heading, intro and the "Browse images" button are normal content in the same section: heading and intro above the table, the button below it. They are not part of the block.

## 3. Variants
Add in the header: `Gallery (featured)`.

| Variant | Look |
|---|---|
| (none) | Equal square tiles: 2 columns on phones, 3 on tablets, 4 on desktop |
| `featured` | The first row's image is larger and takes 2 columns by 2 rows (so it fills a 2x2 area); the rest are normal tiles |

## 4. Formatting rules
- Images: at least 1600px wide for the lightbox; tiles are cropped to squares, so keep the subject centred. Always add alt text, it is the tile label for screen readers.
- Captions: plain paragraphs only (no links or images). Keep short.
- Links: use descriptive text, for example "See this project".
- Buttons: bold = primary, italic = secondary, both = accent, for the CTA below the block (add large through the project's large button style where available).

## 5. Section styles
Use `beige` or `light` (the live page uses `#F6F5F3`, which is `light`). Keep default padding. Put the H2 and intro in default content above the table.

## 6. Example and common mistakes
| Gallery (featured) | |
|---|---|
| ![Modern farmhouse with deep ocean siding](image-1.jpg) | Modern farmhouse in Deep Ocean |
| ![Craftsman home with arctic white trim](image-2.jpg) | [See this project](/project-1) |
| ![Coastal home with sandstone beige](image-3.jpg) | |

Common mistakes:
- Putting several images in one row: only the first picture of each row is used. Use one row per image.
- Leaving out alt text.
- Using links or bold text in captions; only plain text is kept.
- Placing the heading or button inside the table.

## 7. Accessibility notes
- Each tile is a button named "View larger: " plus the alt text, so alt text must describe the image.
- The lightbox traps focus, closes with Esc, the close button or a click outside the image, and returns focus to the tile. Arrow keys and the previous/next buttons move between images; the current position is announced.
- Motion is removed for visitors who prefer reduced motion.

# Quote

## 1. Purpose and where it is used
A testimonial with a portrait, a quotation and the author. Used on Build with Hardie for the contractor quote (John Schiegg).

## 2. DA table structure
| Quote | |
|---|---|
| (portrait image) | |
| Quotation text | |
| Author name<br>Role or company | |

- Row 1: portrait image. Optional; without it the text uses the full width.
- Row 2: quotation, one paragraph, without quotation marks needed. Required.
- Row 3: author name on the first line, role or company on the second line. Optional but recommended; role is optional.
- Rows are detected by content, so an omitted image row does not break the block.

## 3. Variants
None. Layout is image left, text right on desktop (1024px and wider), stacked on mobile.

## 4. Formatting rules
- Images: square or portrait photo, at least 600px wide; always add alt text (for example the author name).
- Links and buttons: not used in this block.
- Headings: do not use headings; the quotation is styled automatically.
- Icons: not used.
- Author: put name and role on separate lines (new line in the same cell).

## 5. Section styles
Use `beige` or `light` in section-metadata for the contrast shown on the live site.

## 6. Example and common mistakes
| Quote | |
|---|---|
| ![John Schiegg](/media/john-schiegg.jpg) | |
| We have built our reputation on high-quality homes, and Hardie products help us maintain it. | |
| John Schiegg<br>Builder | |

Common mistakes:
- Placing the image and quotation in the same row.
- Putting name and role on one line.
- Using a long quotation (keep under about 40 words).
- Forgetting the section style, leaving the quote on plain white.

## 7. Accessibility notes
- Give the portrait meaningful alt text, such as the person's name; use empty alt only if the name is shown beside it and you prefer to hide the image.
- The quote is exposed as a quotation with the author as its caption.
- Quote and author text keep 4.5:1 contrast on beige and light sections; do not use the block on dark sections.

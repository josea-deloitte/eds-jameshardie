# Columns

## 1. Purpose and where it is used
Side-by-side text and media. Used on landing pages for image/text features, video explainers and alternating feature lists.

## 2. DA table structure
| Columns | |
|---|---|
| Text or image | Text or image |

- One row per band; two or three cells per row give 2 or 3 columns (the first row sets the count; keep rows equal).
- A cell with only a picture becomes an image column. On mobile, images show first, then text.
- An empty cell leaves an empty column on desktop.

## 3. Variants
Add in the header: `Columns (alternate)`.

| Variant | Look |
|---|---|
| (none) | Equal columns |
| `eyebrow` | A short plain paragraph above a heading becomes a small green uppercase label |
| `video` | A cell with an MP4/WebM link (plus an optional picture as poster) becomes a video with controls; never autoplays |
| `alternate` | Image side flips on every second row on desktop |
| `split-3-1` | First cell takes three quarters, second one quarter |

## 4. Formatting rules
- Images: at least 1000px wide; add alt text.
- Video: put the full `.mp4` URL as a link on its own line; add a poster picture in the same cell. Link text becomes the video's accessible name (for example "Watch the installation video").
- Eyebrow: plain text (no link) directly above the heading.
- Buttons: bold = primary, italic = secondary.

## 5. Section styles
`light` or `beige` for feature bands; `dark` suits `video`. Use `padding none` plus `no-mobile-padding` for edge-to-edge media.

## 6. Example and common mistakes
| Columns (video, eyebrow) | |
|---|---|
| ![Poster](poster.jpg) and [Watch the installation video](https://example.com/video.mp4) | INSTALLATION / ## Install with confidence / Short intro. / **Learn more** |

Common mistakes:
- A YouTube link in the `video` variant: only direct MP4/WebM links are supported; use the Embed block for hosted video.
- Rows with different numbers of cells.
- Image and long text in one cell, which prevents the image-column layout.
- Expecting autoplay: videos start only when the visitor presses play.

## 7. Accessibility notes
- Alt text on images; empty alt for decoration.
- Provide captions or a transcript link next to every video, and give the video link descriptive text.
- Reading order follows the table, not the visual side of the image.

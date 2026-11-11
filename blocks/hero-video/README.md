# Hero Video

## 1. Purpose and where it is used
Full-bleed hero with a muted, looping background video, a poster image, a dark overlay, headline, text and a button, plus a pause/play button. Used at the top of the home page ("Design an exterior you'll love coming home to", button "Start your design"). Use the Hero block for a static image.

## 2. DA table structure
Header row: `Hero Video`.

| Row / cell | Required | Notes |
|---|---|---|
| Poster image | Recommended | Shown while the video loads and when the visitor prefers reduced motion. Without it the block uses a dark background |
| Link to the video file (`.mp4`, `.webm`, ...) | Yes for video | Same cell as the image or its own. The link is hidden; the video plays behind the text. Without it the block is a static hero |
| Text cell: H1, paragraph, button | H1 required | Any other cell content is treated as foreground text |

## 3. Variants
- Default is white text, left aligned (the live home hero).
- `white` and `left` can be added explicitly: `Hero Video (white, left)`.
- `center` centers the text.

## 4. Formatting rules
- Images: poster at least 1600px wide, same framing as the video. The video is decorative, so no key information goes in it.
- Buttons: bold link = primary green button, italic = secondary, bold+italic = accent.
- Headings: exactly one H1 per page.
- Keep text short; it sits over moving video.

## 5. Section styles
No section style needed: the block fills the width. Do not add a section background.

## 6. Copy-ready example
| Hero Video (white, left) |
|---|
| (poster image) [video](https://example.com/hero.mp4) |
| # Design an exterior you'll love coming home to |
| As North America's #1 brand of siding, Hardie fiber cement products offer leading beauty and lasting resilience. |
| **[Start your design](/hardie-designer/)** |

Common mistakes
- Linking a YouTube/Vimeo page instead of a direct video file (ignored).
- No poster image (flash of dark background).
- More than one H1, or long paragraphs.
- Expecting autoplay with reduced motion: the video does not play; the visitor can press play.

## 7. Accessibility notes
The background video is hidden from screen readers; never put key information only in the video. The pause/play button is keyboard operable and labelled. Videos must not flash. Button text must say where it goes ("Start your design").

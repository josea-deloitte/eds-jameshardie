# Tabs Video

## 1. Purpose and where it is used
Centered tab bar where each tab shows text with a video next to it (above the text on mobile). Used on the home page (Get design ideas / Discover materials / Save and share / Make it real) with looping muted clips, and with the `controls` variant on the Hardie Trim-Over installation page for videos the visitor starts.

## 2. DA table structure
Header row: `Tabs Video`. One row per tab, two cells.

| Cell | Required | Notes |
|---|---|---|
| Cell 1: tab label | Yes | Short; inline bold is kept. If the row has one cell the tab is named "Tab N" |
| Cell 2: H2, paragraph(s), optional button/link | Yes | Panel text |
| Cell 2: link to a video file (`.mp4`, `.webm`, ...) | No | Hidden link; plays in the video box. Without video the text uses the full width |
| Cell 2: image | No | Poster for the video, or the panel image if there is no video |

Only the selected tab is visible; only its video plays, and only while on screen.

## 3. Variants
- Default: autoplay, muted, looping, with a pause/play button. Does not autoplay when the visitor prefers reduced motion.
- `controls` (alias `no-autoplay`): no autoplay, no loop, native video controls with sound, poster shown. Use for instructional videos. Add as `Tabs Video (controls)`.

## 4. Formatting rules
- Images: 16:9 poster, at least 1280px wide; alt text describes the scene.
- Links and buttons: bold = primary, italic = secondary, both = accent.
- Headings: H2 for the panel title; do not use H1.
- Keep tab labels short so they fit on mobile.

## 5. Section styles
Works on default, `light` or `dark` section backgrounds; use `padding-medium` for the live spacing.

## 6. Copy-ready example
| Tabs Video (controls) | |
|---|---|
| Overview | ## Install in four steps<br>Short description.<br>(poster image)<br>[video](https://example.com/overview.mp4) |
| Tools | ## What you need<br>Short description.<br>[video](https://example.com/tools.mp4) |

Common mistakes
- Putting the label and the content in one cell.
- Linking a YouTube/Vimeo page (treated as a normal link, no video).
- Using the default variant for narrated videos (it is muted); use `controls`.
- Very long tab labels.

## 7. Accessibility notes
Provide captions (or a transcript link in the panel text) for any video with speech. The tab bar works by keyboard: Tab to the selected tab, Left/Right arrows, Home and End to move. Autoplaying clips are decorative and hidden from screen readers; in the `controls` variant the video is named with the tab label.

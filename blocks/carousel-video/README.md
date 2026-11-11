# Carousel Video

## 1. Purpose and where it is used
A sliding row of video cards. Each card shows a poster image with a play button; selecting it opens the video in a full-screen player. Used for the brand video rail on the home page and for the Trim-Over installation page testimonials (body text variant). For article cards use `Carousel Article`.

## 2. DA table structure
| Carousel Video | |
|---|---|
| (poster image) | ##### Card title |
| | [Watch the video](https://example.com/video.mp4) |

One row per card. The block reads cells by content, so cell order does not matter.

- Poster image (recommended): one picture. Without it the card is a dark box.
- Video link (required to play): a link whose address ends in `.mp4`, `.webm`, `.ogg`, `.mov` or `.m4v`. The link text is used as the title if there is no heading.
- Title (recommended): a heading, shown over the poster (default) or below it (body text variant).
- A link that is not a video file opens as a normal page link.
- A card with no link is shown but does nothing.
- Empty rows are ignored.

## 3. Variants
Add in the header: `Carousel Video (body text)`.

| Variant | Look | Use when |
|---|---|---|
| (none) | Tall 9:16 poster cards, title over the image | Short vertical brand videos |
| `body text` | Wider 16:9 poster; headline and body text below the poster, no overlay | Testimonials where each video needs a short quote or description |

Body text row: poster image, video link, a heading (headline) and one or more plain paragraphs (body).

## 4. Formatting rules
- Images: poster in the video's shape. Default variant: vertical 9:16, at least 450px wide. Body text variant: landscape 16:9, at least 800px wide. Add alt text.
- Headline: one heading per card. Links inside the heading are removed.
- Body text (body text variant only): plain paragraphs, each under about 40 words. Paragraphs containing links or images are not used as body text.
- Upload video files as MP4 (or another browser format). Page links such as YouTube are not played in the dialog.

## 5. Section styles
| Style | Result |
|---|---|
| `light` or `beige` | Tinted band behind the cards |
| `padding none`, `padding small`, `padding medium` | Adjusts spacing |

A heading and a link above the table, in the same section, form the section header.

## 6. Example and common mistakes
| Carousel Video (body text) | |
|---|---|
| ![Contractor on a ladder](poster.jpg) | ##### A faster install |
| | Our crew finished in two days. |
| | [Play video](https://example.com/trim-over-1.mp4) |

Common mistakes:
- Linking a YouTube or Vimeo page: it navigates away instead of opening the player.
- Using a long URL as the link text with no heading: add a heading so the card has a readable title.
- Adding body paragraphs in the default variant: they are ignored. Use `body text`.
- Portrait posters in the body text variant: they are cropped to landscape.

## 7. Accessibility notes for authors
- Cards with a video link are real buttons labeled "Play video: title", reachable with Tab and operated with Enter or Space. Escape closes the player.
- Write a unique title for every card so the button label is meaningful.
- Provide captions or a transcript for each video (captions in the video file, or a transcript linked on the page).
- Give posters alt text, or leave it empty if the title already describes the image.
- Reduced-motion users get instant scrolling and no zoom effects.

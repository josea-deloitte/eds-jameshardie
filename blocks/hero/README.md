# Hero

## 1. Purpose and where it is used
Large page-opening banner with headline, short copy and call-to-action buttons. Used at the top of the home page and most landing pages. For a looping background video use `Hero Video` instead.

## 2. DA table structure
| Hero | |
|---|---|
| (image) | |
| Eyebrow text, then `# Headline`, paragraph, **Primary button** | |

- Row 1, image (optional): one picture. If omitted the hero is a solid dark band.
- Row 2, content (required): optional eyebrow line directly above the heading, `H1` headline, paragraph(s), one or more buttons.
- A single-row hero with only content works. The image and content may also share one row.

## 3. Variants
Add in the header: `Hero (dark)`. Combine with commas, for example `Hero (dark, wide-content)`.

| Variant | Look | Use when |
|---|---|---|
| (none) | Full-bleed image behind the text, dark overlay, white left-aligned text | Photographic page opener |
| `dark` | Charcoal background, white text on the left, image on the right (stacked on mobile) | Product or feature pages |
| `image-right` | White background, dark text on the left, image on the right | Light, editorial pages |
| `white-left` | White background, dark left-aligned text, image below the text | Text-led pages |
| `wide-content` | Lets the text span more of the band; add to any variant | Long headlines |

## 4. Formatting rules
- Images: landscape, at least 2000px wide for the default variant; 1200px for split variants. Add alt text for informative images.
- Buttons: link alone on its own line. **Bold** = primary (green), *italic* = secondary (outline), bold + italic = accent tag.
- Headline: exactly one H1 per page. Eyebrow: a plain paragraph without links immediately above the H1.

## 5. Section styles
The hero fills the full width of its section; no section style is needed. Use `padding none` on the section to remove spacing above or below.

## 6. Example and common mistakes
| Hero (dark) | |
|---|---|
| ![Fiber cement siding on a modern home](hero.jpg) | |
| NEW FOR 2026 / # Built for the way you live / Siding that lasts. / **Explore products** / *Find a contractor* | |

Common mistakes:
- Putting the eyebrow below the headline (it will not be styled as an eyebrow).
- Two H1s on a page.
- Plain links for buttons: they must be bold or italic.
- A very busy image with the default variant: use `dark` instead.

## 7. Accessibility notes
- Describe the image in alt text, or leave alt empty if it only decorates.
- Button text must make sense alone ("Explore products", not "Click here").
- Keep the headline short; do not put essential text inside the image.

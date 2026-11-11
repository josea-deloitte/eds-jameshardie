# Embed Designer

## 1. Purpose and where it is used
Embeds the Hover home exterior designer in a large frame (600px tall on mobile, 800px on desktop) with a light footer bar for the Hover attribution link. Used on the home page and Hardie Designer page. The frame loads only when scrolled near; a plain link to the designer shows until then.

## 2. DA table structure
Header row: `Embed Designer`. One cell is enough.

| Cell | Required | Notes |
|---|---|---|
| Link to the Hover embed URL (`https://hover.to/designer/embed-container?...`) | Yes | If no hover.to link is found, the first https link is used; with no link the block is empty |
| Other links (for example the "Hover" logo link) | No | Shown centered in the footer bar |
| Heading | No | Used as the frame title for screen readers and as the placeholder link text. Default: "Hover home exterior designer" |

## 3. Variants
No variants.

## 4. Formatting rules
- Links: plain links; button styling (bold/italic) is removed in the footer bar.
- Headings: use one heading only to set the frame title (it is not shown).
- No images or icons are used.

## 5. Section styles
Section Metadata `style` = `padding-medium` as needed. Frame and footer use the full width of the section.

## 6. Copy-ready example
| Embed Designer |
|---|
| ### Design your exterior with Hover |
| https://hover.to/designer/embed-container?colorMode=dark |
| [Hover](https://hover.to/wr/properties) |

Common mistakes
- Using a non-https link (ignored).
- Putting the Hover link in the same paragraph as the embed URL; keep them as separate links.
- Expecting the heading to display on the page.

## 7. Accessibility notes
Always set a meaningful heading so the frame has a unique title. The placeholder link is keyboard reachable. The designer itself is third-party; offer an alternative path (for example a contractor link) in text nearby.

# Embed Social

## 1. Purpose and where it is used
Shows a live social-photo gallery (Instagram posts) from Sprinklr. Used on the home page ("More than 10 million homes feature Hardie products") and on Start Your Siding Project. The heading and the Instagram "Follow" link are normal text above the block. The live site's CMS calls this component "Stackla", but it renders a Sprinklr embed (client 24392). The Sprinklr script loads only when the block nears the screen.

## 2. DA table structure
Header row: `Embed Social`. Then one key / value row per setting.

| Row | Required | Notes |
|---|---|---|
| Embed URL (link to the Sprinklr `script.js`) or `Embed ID` | Yes (one of them) | Without it the block is hidden |
| `Client ID` | No | Defaults to `24392`. A full script URL already contains the client ID |
| `Fallback link` | No | Link shown if the gallery cannot load |

If the gallery is blocked or has not rendered after 10 seconds, the gallery area is replaced by the Fallback link. With no Fallback link the block disappears and the Follow link in the section remains.

Known limitation: the Sprinklr script uses `eval`, which the site's Content Security Policy (`head.html`) does not allow. Until the CSP is relaxed for it, the gallery will not render and the Fallback link is shown.

## 3. Variants
None.

## 4. Formatting rules
- Cells hold plain text or one link; no images, headings or bold needed.
- Put the heading and the Follow button in default content above the block, not inside the table.
- Links: any non-embed link in the block is used as the fallback if no `Fallback link` row exists.

## 5. Section styles
Use Section Metadata `style` = `light` (warm grey band, matches the live site). Add `padding-medium` for the live spacing.

## 6. Copy-ready example
| Embed Social | |
|---|---|
| Embed URL | https://gallery.sprinklr.com/clients/24392/embeds/ZW1iZWQ6NjYwYTg5MTU2NGZiMGI1NTEzMzI4OGEw/script.js |
| Client ID | 24392 |
| Fallback link | [Follow James Hardie on Instagram](https://www.instagram.com/jameshardie/) |

Common mistakes
- Pasting a Sprinklr link that is not an `https://gallery.sprinklr.com/clients/.../script.js` URL (block is hidden).
- Putting the heading inside the table.
- Leaving out the Fallback link, so the block disappears when the gallery cannot load.

## 7. Accessibility notes
The gallery content comes from the provider; check alt text there. Write a descriptive Fallback link text (for example "Follow James Hardie on Instagram"). Never rely on the gallery as the only way to reach the Instagram profile.

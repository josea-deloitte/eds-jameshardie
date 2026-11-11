# Embed Social

## 1. Purpose and where it is used
Shows a live social-photo gallery (Instagram posts) from a third-party provider. Used on the home page ("More than 10 million homes feature Hardie products") and on Start Your Siding Project. The heading and the Instagram "Follow" link are normal text above the block. Two providers are supported: Sprinklr (default) and Stackla (variant `stackla`). The provider script loads only when the block nears the screen.

## 2. DA table structure
Header row: `Embed Social` (Sprinklr) or `Embed Social (stackla)`. Then one key / value row per setting.

Sprinklr
| Row | Required | Notes |
|---|---|---|
| Embed URL (link to the Sprinklr `script.js`) or `Embed ID` | Yes (one of them) | Without it the block is hidden |
| `Client ID` | No | Defaults to `24392`. A full script URL already contains the client ID |
| `Fallback link` | No | Link shown if the gallery cannot load |

Stackla
| Row | Required | Notes |
|---|---|---|
| `Data ID` | Yes | Digits only, e.g. `104422` |
| `Hash` | Yes | Letters/digits, e.g. `64a6f737e82d8` |
| `Title` | No | Widget name, e.g. `JH Passport Grid` |
| `Fallback link` | No | Link shown if the gallery cannot load |

If the gallery is blocked or has not rendered after 10 seconds, the gallery area is replaced by the Fallback link. With no Fallback link the block disappears and the Follow link in the section remains.

## 3. Variants
- (none) Sprinklr gallery.
- `stackla` Stackla gallery (needs Data ID and Hash).

## 4. Formatting rules
- Cells hold plain text or one link; no images, headings or bold needed.
- Put the heading and the Follow button in default content above the block, not inside the table.
- Links: any non-embed link in the block is used as the fallback if no `Fallback link` row exists.

## 5. Section styles
Use Section Metadata `style` = `light` (warm grey band, matches the live site). Add `padding-medium` for the live spacing.

## 6. Copy-ready example
| Embed Social (stackla) | |
|---|---|
| Data ID | 104422 |
| Hash | 64a6f737e82d8 |
| Title | JH Passport Grid |
| Fallback link | [Follow James Hardie](https://www.instagram.com/jameshardie/) |

Sprinklr:

| Embed Social | |
|---|---|
| Embed URL | https://gallery.sprinklr.com/clients/24392/embeds/ZW1iZWQ6NjYwYTg5MTU2NGZiMGI1NTEzMzI4OGEw/script.js |
| Client ID | 24392 |

Common mistakes
- Typing Stackla IDs without the `stackla` variant (a Data ID row also switches it on, but add the variant for clarity).
- Spaces or text in Data ID / Hash.
- Pasting a Sprinklr link that is not an `https://gallery.sprinklr.com/clients/.../script.js` URL (block is hidden).
- Putting the heading inside the table.

## 7. Accessibility notes
The gallery content comes from the provider; check alt text there. Write a descriptive Fallback link text (for example "Follow James Hardie on Instagram"). Never rely on the gallery as the only way to reach the Instagram profile.

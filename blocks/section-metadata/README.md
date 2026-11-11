# Section Metadata

## 1. Purpose and where it is used
Sets the look of a whole section (background colour, spacing). It is not shown on the page. Used on every page of the live site, for example the beige and light bands on the home page and the green "primary" heading band.

## 2. DA table structure
| Section Metadata | |
|---|---|
| Style | beige |

- Header row: `Section Metadata`. Each following row is a key (left cell) and a value (right cell).
- Required: at least one row. A row with an empty key or value is ignored.
- Place the table at the bottom of the section it controls (before the `---` divider that ends the section).
- Any key other than `Style` is stored on the section as a data attribute (for example `Anchor`).

## 3. Variants
Values for the `Style` row. Combine several with commas, for example `dark, padding small`.

| Style value | Result |
|---|---|
| `beige` | Beige background, dark text |
| `light` | Light grey-beige background, dark text |
| `dark` | Charcoal (#333) background, white text |
| `primary-band` | James Hardie green band, white text, inverted buttons |
| `padding none` | No top/bottom spacing |
| `padding small` | Reduced spacing |
| `padding medium` | Generous spacing |
| `no-mobile-padding` | Removes spacing and side gutters on phones and tablets (full-bleed media) |
| `centered` | Centers default content in a narrow column |

## 4. Formatting rules
Values are plain text. Use lowercase words from the table above; spelling must match.

## 5. Section styles that pair with blocks
- Hero (dark theme) and Cards (icon, stat): `light` or `beige`.
- Cards (popular-link): `beige`. Columns (video): `dark`.
- Headings and links inside `dark` and `primary-band` sections turn white automatically; do not recolour text.

## 6. Example and common mistakes
| Section Metadata | |
|---|---|
| Style | primary-band, padding small |

Common mistakes:
- Putting the table in the middle of a section: it affects the whole section, not only the content below it.
- Misspelled values (`primaryband` does not work; `primary-band` and `Primary Band` do).
- Using two background styles in one section; the last one in the stylesheet wins.
- Expecting green text on a `beige` band; buttons keep their own colours.

## 7. Accessibility notes
- Text colours are set for you and meet the 4.5:1 contrast ratio on every style; do not paste coloured text on top.
- Colour alone must not carry meaning; keep headings and labels in the text.

# Widget

## 1. Purpose and where it is used
Loads a small custom integration from the code repository's `/widgets/` folder into the page. Intended for app-like integrations that are not generic embeds, for example a contractor ZIP-code search (find-a-contractor). No widgets ship yet. After loading, the block takes the widget's name as its class.

## 2. DA table structure
Header row: `Widget`. One cell:

| Cell | Required | Notes |
|---|---|---|
| Link whose path starts with `/widgets/` (e.g. `/widgets/contractor-search`) | Yes | Extra `?key=value` parameters become `data-key` attributes the widget can read (e.g. `?resultsUrl=...`). Without a link nothing renders |

A link to `/widgets/...` alone in a paragraph on any page is turned into this block automatically.

Developer contract: the link `/widgets/<path>/<name>` loads `/widgets/<path>/<name>.html` (required; injected as the block markup; a non-200 response is logged and nothing is shown), `<name>.css`, and `<name>.js` whose default export `decorate(widget)` runs afterwards. The wrapper and container classes are renamed to `<name>-wrapper` and `<name>-container`. A contractor-search widget can host a ZIP form in the HTML and call or link to `contractors.jameshardie.com` from its JS; label, placeholder, results URL and disclaimer can be supplied as `data-` parameters or authored in the HTML. Avoid widget names that match an existing block name (that block's CSS would apply).

## 3. Variants
No variants. Each widget is its own variant by name.

## 4. Formatting rules
- Link text is not shown; use the widget name.
- Do not bold or italicize the link (it would become a button before loading).
- No images or headings inside the table.

## 5. Section styles
Use the section for spacing and background (`light`, `padding-medium`); the widget draws only its own content.

## 6. Copy-ready example
| Widget |
|---|
| [contractor-search](/widgets/contractor-search?resultsUrl=https://contractors.jameshardie.com/) |

Common mistakes
- Link not starting with `/widgets/`, or pointing to a widget that is not deployed (nothing renders; check the browser console).
- Using a full external URL for an external app; use Embed or link out instead.
- Expecting several widgets in one cell.

## 7. Accessibility notes
Add a heading above the widget describing it. Widget developers must provide labelled form fields, keyboard operation and visible focus, announce results and errors in a live region, and keep the disclaimer text readable.

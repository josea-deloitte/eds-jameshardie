# Accordion

## 1. Purpose and where it is used
An expandable list of questions and answers. Used for the FAQ page (about 73 items) and the Trim-Over installation method page (6 items next to a side column).

## 2. DA table structure
| Accordion | |
|---|---|
| Question text | Answer text, lists, links |
| Question text | Answer text, lists, links |

- One row per item with two cells: question (required) and answer (required in practice).
- Question: plain text. Bold or links in this cell are dropped, so keep it plain.
- Answer: paragraphs, bulleted or numbered lists, links, and bold text.
- Omitted cells: a row with both cells empty is skipped. A missing answer shows a question with an empty panel; a missing question shows a plus icon with no label.

## 3. Variants
Add in the header: `Accordion (open-first)` or `Accordion (open-first, exclusive)`.

| Variant | Look |
|---|---|
| (none) | All items closed; several can be open together |
| `open-first` | The first item is open on load |
| `exclusive` | Opening an item closes the others |

## 4. Formatting rules
- Images: avoid images in answers; if needed, add alt text.
- Links: normal links appear green and underlined. Do not use bold/italic button links here.
- Headings: do not use headings in questions or answers; the question is the heading.
- Icons: the plus and minus are added automatically; do not type `:icon-name:`.

## 5. Section styles
Works on the default (white) and `light` sections. Inside a two-column layout it fills its column, so place it in the wide column (3/4) beside a side panel.

## 6. Example and common mistakes
| Accordion (open-first, exclusive) | |
|---|---|
| What are the benefits of fiber cement siding? | It is durable, water resistant and fire resistant. |
| How long does it last? | Hardie products carry a 30-year limited warranty. See [warranty details](/warranty). |

Common mistakes:
- Putting question and answer in the same cell.
- Adding one table per question instead of one table with many rows.
- Starting an answer with a heading.
- Writing very long questions; keep to one sentence.

## 7. Accessibility notes
- Each item is a native expandable control, so it works with keyboard (Enter/Space) and screen readers.
- Write questions that make sense without the answer.
- Link text in answers must be meaningful; avoid "click here".
- Motion is reduced automatically for visitors who prefer less motion.

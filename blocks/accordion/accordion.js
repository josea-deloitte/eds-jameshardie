/**
 * Accordion block. Each row is an item: cell 1 = question, cell 2 = answer.
 * Decorates to native details/summary. Variants: open-first, exclusive.
 * @param {Element} block The accordion block element
 */
export default function decorate(block) {
  const exclusive = block.classList.contains('exclusive');
  const openFirst = block.classList.contains('open-first');
  const items = [];

  [...block.children].forEach((row) => {
    const [labelCell, bodyCell] = [...row.children];
    const label = labelCell ? labelCell.textContent.trim() : '';
    const hasBody = bodyCell && (bodyCell.textContent.trim() || bodyCell.querySelector('img, picture'));
    if (!label && !hasBody) return; // empty row

    const details = document.createElement('details');
    details.className = 'accordion-item';

    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    const text = document.createElement('span');
    text.className = 'accordion-item-text';
    text.textContent = label;
    summary.append(text);

    const body = document.createElement('div');
    body.className = 'accordion-item-body';
    if (bodyCell) body.append(...bodyCell.childNodes);

    details.append(summary, body);
    items.push(details);
  });

  if (openFirst && items.length) items[0].open = true;

  if (exclusive) {
    items.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        items.forEach((other) => {
          if (other !== item) other.open = false;
        });
      });
    });
  }

  block.replaceChildren(...items);
}

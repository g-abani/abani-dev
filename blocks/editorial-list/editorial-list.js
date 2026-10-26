export default function init(el) {
  [...el.children].forEach((row) => {
    const entry = document.createElement('article');
    entry.className = 'editorial-entry';
    entry.append(...row.firstElementChild.childNodes);
    const first = entry.firstElementChild;
    if (first?.tagName === 'P' && !first.querySelector('a')) first.classList.add('entry-label');
    const heading = entry.querySelector('h2, h3');
    if (heading) {
      heading.id ||= `entry-${crypto.randomUUID()}`;
      entry.setAttribute('aria-labelledby', heading.id);
    }
    row.replaceWith(entry);
  });
}

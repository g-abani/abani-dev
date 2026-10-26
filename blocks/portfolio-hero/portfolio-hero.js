export default function init(el) {
  const row = el.firstElementChild;
  row.classList.add('portfolio-hero-layout');
  const [copy, visual] = row.children;
  copy.classList.add('portfolio-hero-copy');
  copy.querySelector('p')?.classList.add('eyebrow');
  const actions = copy.querySelector('p:last-child');
  if (actions?.querySelector('a')) actions.classList.add('portfolio-hero-actions');
  if (visual) visual.classList.add('portfolio-hero-visual');
}

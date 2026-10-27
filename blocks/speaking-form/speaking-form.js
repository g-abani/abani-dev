export default function init(el) {
  const link = el.querySelector('a[href]');
  if (!link) throw new Error('Speaking form block requires a Google Forms responder link.');

  const url = new URL(link.href);
  if (url.origin !== 'https://docs.google.com' || !/^\/forms\/d\/e\/[^/]+\/viewform$/.test(url.pathname)) {
    throw new Error('Speaking form block requires a Google Forms responder link.');
  }

  link.href = `${url.origin}${url.pathname}`;
  link.target = '_blank';
  link.rel = 'noopener';
  link.textContent = 'Open the speaking enquiry form in a new tab';

  url.search = '';
  url.searchParams.set('embedded', 'true');

  const iframe = document.createElement('iframe');
  iframe.src = url.toString();
  iframe.title = 'Speaking enquiry form';
  iframe.loading = 'lazy';

  const fallback = document.createElement('p');
  fallback.className = 'speaking-form-fallback';
  fallback.append(link);
  el.replaceChildren(fallback, iframe);
}

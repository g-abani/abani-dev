export default function init(el) {
  const link = el.querySelector('a[href]');
  if (!link) throw new Error('Speaking form block requires a Google Forms responder link.');

  const url = new URL(link.href);
  if (url.origin !== 'https://docs.google.com' || !/^\/forms\/d\/e\/[^/]+\/viewform$/.test(url.pathname)) {
    throw new Error('Speaking form block requires a Google Forms responder link.');
  }

  url.search = '';
  url.searchParams.set('embedded', 'true');

  const opener = document.createElement('button');
  opener.className = 'speaking-form-opener';
  opener.type = 'button';
  opener.textContent = 'Request a speaking engagement';
  link.replaceWith(opener);

  const directLink = document.createElement('a');
  directLink.href = `${url.origin}${url.pathname}`;
  directLink.target = '_blank';
  directLink.rel = 'noopener';
  directLink.textContent = 'Open the form in a new tab';

  const fallback = document.createElement('p');
  fallback.className = 'speaking-form-fallback';
  fallback.append(directLink);

  const dialog = document.createElement('dialog');
  dialog.className = 'speaking-form-dialog';
  dialog.setAttribute('aria-label', 'Speaking enquiry form');

  const closeButton = document.createElement('button');
  closeButton.className = 'speaking-form-close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close form');
  closeButton.textContent = '×';
  closeButton.addEventListener('click', () => dialog.close());

  const heading = document.createElement('h2');
  heading.textContent = 'Speaking enquiry';

  const header = document.createElement('div');
  header.className = 'speaking-form-dialog-header';
  header.append(heading, closeButton);

  const iframe = document.createElement('iframe');
  iframe.title = 'Speaking enquiry form';
  iframe.loading = 'lazy';

  dialog.append(header, iframe, fallback);
  opener.addEventListener('click', () => {
    dialog.showModal();
    if (!iframe.hasAttribute('src')) iframe.src = url.toString();
  });

  el.replaceChildren(opener, dialog);
}

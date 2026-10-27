import { expect } from '@esm-bundle/chai';
import init from '../../blocks/speaking-form/speaking-form.js';

describe('speaking form', () => {
  it('opens the lazy, titled responder form in a modal', () => {
    const el = document.createElement('div');
    el.innerHTML = '<p><a href="https://docs.google.com/forms/d/e/example/viewform?usp=publish-editor">Open form</a></p>';
    document.body.append(el);

    init(el);

    const opener = el.querySelector('.speaking-form-opener');
    const dialog = el.querySelector('dialog');
    const iframe = el.querySelector('iframe');
    expect(opener.textContent).to.equal('Request a speaking engagement');
    expect(dialog.open).to.equal(false);
    expect(dialog.getAttribute('aria-label')).to.equal('Speaking enquiry form');
    expect(iframe.hasAttribute('src')).to.equal(false);
    expect(iframe.title).to.equal('Speaking enquiry form');
    expect(iframe.loading).to.equal('lazy');
    expect(el.querySelector('.speaking-form-fallback a').href).to.equal('https://docs.google.com/forms/d/e/example/viewform');

    opener.click();
    expect(dialog.open).to.equal(true);
    expect(iframe.src).to.equal('https://docs.google.com/forms/d/e/example/viewform?embedded=true');

    el.querySelector('.speaking-form-close').click();
    expect(dialog.open).to.equal(false);
    el.remove();
  });

  it('rejects links that are not Google Forms responder URLs', () => {
    const el = document.createElement('div');
    el.innerHTML = '<p><a href="https://example.com/form">Open form</a></p>';

    expect(() => init(el)).to.throw('Speaking form block requires a Google Forms responder link.');
  });
});

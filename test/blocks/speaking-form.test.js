import { expect } from '@esm-bundle/chai';
import init from '../../blocks/speaking-form/speaking-form.js';

describe('speaking form', () => {
  it('embeds the responder form with a lazy, titled iframe', () => {
    const el = document.createElement('div');
    el.innerHTML = '<p><a href="https://docs.google.com/forms/d/e/example/viewform?usp=publish-editor">Open form</a></p>';

    init(el);

    const iframe = el.querySelector('iframe');
    expect(iframe.src).to.equal('https://docs.google.com/forms/d/e/example/viewform?embedded=true');
    expect(iframe.title).to.equal('Speaking enquiry form');
    expect(iframe.loading).to.equal('lazy');
    expect(el.querySelector('a').href).to.equal('https://docs.google.com/forms/d/e/example/viewform');
    expect(el.querySelector('a').target).to.equal('_blank');
  });

  it('rejects links that are not Google Forms responder URLs', () => {
    const el = document.createElement('div');
    el.innerHTML = '<p><a href="https://example.com/form">Open form</a></p>';

    expect(() => init(el)).to.throw('Speaking form block requires a Google Forms responder link.');
  });
});

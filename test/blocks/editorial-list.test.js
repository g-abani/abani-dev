import { expect } from '@esm-bundle/chai';
import init from '../../blocks/editorial-list/editorial-list.js';

describe('editorial list', () => {
  it('gives each publication an accessible heading and preserves its destination', () => {
    const el = document.createElement('div');
    el.innerHTML = '<div><div><p>IEEE RECCAP · 2026</p><h3><a href="https://ieeexplore.ieee.org/document/11723634/">Context optimization</a></h3><p>Research summary</p></div></div>';
    init(el);
    const entry = el.querySelector('article');
    expect(entry.getAttribute('aria-labelledby')).to.equal(entry.querySelector('h3').id);
    expect(entry.querySelector('a').href).to.equal('https://ieeexplore.ieee.org/document/11723634/');
    expect(entry.querySelector('.entry-label').textContent).to.equal('IEEE RECCAP · 2026');
  });

  it('keeps separate entries for multiple authored rows', () => {
    const el = document.createElement('div');
    el.innerHTML = '<div><div><h3>First talk</h3></div></div><div><div><h3>Second talk</h3></div></div>';
    init(el);
    const entries = [...el.querySelectorAll('article')];
    expect(entries).to.have.lengthOf(2);
    expect(entries[0].getAttribute('aria-labelledby')).not.to.equal(entries[1].getAttribute('aria-labelledby'));
  });
});

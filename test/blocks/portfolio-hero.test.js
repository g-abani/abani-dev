import { expect } from '@esm-bundle/chai';
import { setViewport } from '@web/test-runner-commands';
import init from '../../blocks/portfolio-hero/portfolio-hero.js';

describe('portfolio hero on mobile', () => {
  it('keeps the introduction and actions within a narrow viewport', async () => {
    await setViewport({ width: 390, height: 844 });
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/blocks/portfolio-hero/portfolio-hero.css';
    const loaded = new Promise((resolve) => { style.onload = resolve; });
    document.head.append(style);
    await loaded;
    const el = document.createElement('div');
    el.innerHTML = '<div><div><p>Abani Behera</p><h1>Building intelligent enterprise systems.</h1><p>Enterprise architecture and Agentic AI.</p><p><a href="/projects">Explore my work</a> <a href="/speaking">Speaking</a></p></div><div><p>Architecture. Intelligence. Experience.</p></div></div>';
    document.body.append(el);
    init(el);
    expect(el.querySelectorAll('h1')).to.have.lengthOf(1);
    expect(el.querySelectorAll('.portfolio-hero-actions a')).to.have.lengthOf(2);
    expect(el.scrollWidth).to.be.at.most(document.documentElement.clientWidth);
    expect(getComputedStyle(el.firstElementChild).gridTemplateColumns.split(' ')).to.have.lengthOf(1);
    el.remove();
    style.remove();
  });
});

import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setViewport } from '@web/test-runner-commands';
import initAnalytics from '../../scripts/utils/analytics.js';

describe('analytics consent', () => {
  const measurementId = 'G-TEST123456';
  let append;
  let googleScripts;
  const buttons = () => document.querySelectorAll('.analytics-consent button');

  beforeEach(() => {
    localStorage.removeItem('analytics-consent');
    googleScripts = [];
    const original = document.head.append.bind(document.head);
    append = sinon.stub(document.head, 'append').callsFake((element) => {
      if (element.tagName === 'SCRIPT' && element.src.includes('googletagmanager.com')) {
        googleScripts.push(element);
        element.onload();
      } else original(element);
    });
  });

  afterEach(() => {
    sinon.restore();
    document.querySelectorAll('.analytics-consent, .analytics-settings, link[href="/styles/analytics.css"]').forEach((element) => element.remove());
    localStorage.removeItem('analytics-consent');
    delete window.dataLayer;
    delete window.gtag;
    delete window[`ga-disable-${measurementId}`];
    document.cookie = '_ga=; Max-Age=0; Path=/';
  });

  it('does not contact Google or initialize tracking before consent or after rejection', async () => {
    await initAnalytics(measurementId);
    expect(googleScripts).to.have.length(0);
    expect(window.gtag).to.equal(undefined);
    const notice = document.querySelector('.analytics-consent a');
    expect(notice.getAttribute('href')).to.equal('/privacy');
    expect(notice.textContent).to.equal('Privacy & Cookies');
    buttons()[1].click();
    expect(localStorage.getItem('analytics-consent')).to.equal('denied');
    expect(googleScripts).to.have.length(0);
    expect(document.querySelector('.analytics-consent').hidden).to.equal(true);
  });

  it('loads one Google tag after acceptance with advertising denied', async () => {
    await initAnalytics(measurementId);
    buttons()[0].click();
    expect(googleScripts).to.have.length(1);
    expect(googleScripts[0].src).to.equal(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`);
    expect(localStorage.getItem('analytics-consent')).to.equal('granted');
    const calls = window.dataLayer.map((entry) => [...entry]);
    expect(calls[0]).to.deep.equal(['consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    }]);
    expect(calls[1][2].analytics_storage).to.equal('granted');
    expect(calls.filter(([command]) => command === 'config')).to.have.length(1);
    expect(calls[3][2].page_location).to.equal(`${location.origin}${location.pathname}`);
  });

  ['granted', 'denied'].forEach((choice) => {
    it(`remembers ${choice} consent on the next page`, async () => {
      localStorage.setItem('analytics-consent', choice);
      await initAnalytics(measurementId);
      expect(document.querySelector('.analytics-consent').hidden).to.equal(true);
      expect(googleScripts).to.have.length(choice === 'granted' ? 1 : 0);
    });
  });

  it('allows withdrawal, clears GA cookies, and does not duplicate configuration on reacceptance', async () => {
    await initAnalytics(measurementId);
    buttons()[0].click();
    document.cookie = '_ga=test; Path=/';
    document.querySelector('.analytics-settings').click();
    expect(document.activeElement).to.equal(buttons()[0]);
    buttons()[1].click();
    expect(window[`ga-disable-${measurementId}`]).to.equal(true);
    expect(document.cookie).not.to.include('_ga=');
    expect(window.dataLayer.at(-1)[2].analytics_storage).to.equal('denied');
    document.querySelector('.analytics-settings').click();
    buttons()[0].click();
    expect(window[`ga-disable-${measurementId}`]).to.equal(false);
    expect(googleScripts).to.have.length(1);
    expect(window.dataLayer.filter((entry) => entry[0] === 'config')).to.have.length(1);
  });

  it('supports consent when browser storage is blocked', async () => {
    sinon.stub(Storage.prototype, 'getItem').throws(new Error('Blocked'));
    sinon.stub(Storage.prototype, 'setItem').throws(new Error('Blocked'));
    await initAnalytics(measurementId);
    buttons()[0].click();
    expect(googleScripts).to.have.length(1);
  });

  it('keeps the panel and controls within a mobile viewport', async () => {
    await setViewport({ width: 320, height: 568 });
    await initAnalytics(measurementId);
    const panel = document.querySelector('.analytics-consent').getBoundingClientRect();
    const settings = document.querySelector('.analytics-settings').getBoundingClientRect();
    expect(panel.left).to.be.at.least(0);
    expect(panel.right).to.be.at.most(320);
    expect(panel.bottom).to.be.at.most(settings.top);
    expect(append.called).to.equal(true);
    await setViewport({ width: 1024, height: 768 });
  });
});

import loadScript from './script.js';

export default async function initAnalytics(measurementId) {
  const storageKey = 'analytics-consent';
  let started = false;
  const storage = (method, ...args) => {
    try {
      return localStorage[method](storageKey, ...args);
    } catch {
      return null;
    }
  };
  const choice = storage('getItem');

  const consent = (analyticsStorage) => ({
    analytics_storage: analyticsStorage,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  const start = () => {
    window[`ga-disable-${measurementId}`] = false;
    if (started) {
      window.gtag('consent', 'update', consent('granted'));
      return;
    }
    started = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args) { window.dataLayer.push(args); };
    window.gtag('consent', 'default', consent('denied'));
    window.gtag('consent', 'update', consent('granted'));
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: `${window.location.origin}${window.location.pathname}`,
      page_referrer: document.referrer.split(/[?#]/)[0],
    });
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${measurementId}`).catch(() => {});
  };

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = '/styles/analytics.css';
  await new Promise((resolve) => {
    stylesheet.onload = resolve;
    stylesheet.onerror = resolve;
    document.head.append(stylesheet);
  });

  const panel = document.createElement('section');
  panel.className = 'analytics-consent';
  panel.setAttribute('aria-label', 'Analytics cookies');
  const text = document.createElement('p');
  text.textContent = 'Allow Google Analytics cookies to help understand visits to this site? Analytics is optional. Advertising storage and personalization stay off.';
  const notice = document.createElement('a');
  notice.href = '/privacy';
  notice.textContent = 'Privacy & Cookies';
  text.append(' ', notice);
  const actions = document.createElement('div');
  const settings = document.createElement('button');
  settings.type = 'button';
  settings.className = 'analytics-settings';
  settings.textContent = 'Cookie settings';
  settings.setAttribute('aria-expanded', 'false');

  const save = (value) => {
    storage('setItem', value);
    if (value === 'granted') start();
    else {
      window[`ga-disable-${measurementId}`] = true;
      if (started) window.gtag('consent', 'update', consent('denied'));
      document.cookie.split(';').forEach((cookie) => {
        const name = cookie.trim().split('=')[0];
        if (!/^_ga(?:_|$)/.test(name)) return;
        const expired = `${name}=; Max-Age=0; Path=/`;
        document.cookie = expired;
        const parts = window.location.hostname.split('.');
        while (parts.length > 1) {
          document.cookie = `${expired}; Domain=${parts.join('.')}`;
          parts.shift();
        }
      });
    }
    panel.hidden = true;
    settings.setAttribute('aria-expanded', 'false');
    settings.focus();
  };
  ['Accept analytics', 'Reject analytics'].forEach((label, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', () => save(index === 0 ? 'granted' : 'denied'));
    actions.append(button);
  });
  panel.append(text, actions);
  panel.hidden = choice === 'granted' || choice === 'denied';
  settings.setAttribute('aria-expanded', String(!panel.hidden));
  settings.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
    settings.setAttribute('aria-expanded', String(!panel.hidden));
    if (!panel.hidden) actions.querySelector('button').focus();
  });
  document.body.append(panel, settings);
  if (choice === 'granted') start();
}

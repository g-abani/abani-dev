import ENV from './utils/env.js';

async function loadSidekick() {
  const getSk = () => document.querySelector('aem-sidekick');

  const sk = getSk() || await new Promise((resolve) => {
    document.addEventListener('sidekick-ready', () => resolve(getSk()));
  });
  if (sk) import('../tools/sidekick/sidekick.js').then((mod) => mod.default(sk));
}

(function loadLazy() {
  import('./utils/lazyhash.js');
  import('./utils/footer.js').then(({ default: footer }) => footer());

  const analytics = { measurementId: 'G-VRSEVFLQQB', hostnames: ['abani.dev'] };
  const params = new URLSearchParams(window.location.search);
  if (analytics.measurementId && analytics.hostnames.includes(window.location.hostname)
    && params.get('martech') !== 'off' && !params.has('dapreview') && !params.has('quick-edit')
    && window.self === window.top) {
    import('./utils/analytics.js').then(({ default: init }) => init(analytics.measurementId));
  }

  // Author facing tools
  if (ENV !== 'prod') {
    import('../tools/scheduler/scheduler.js');
    loadSidekick();
  }
}());

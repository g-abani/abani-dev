import { expect } from '@esm-bundle/chai';
import { loadPage } from '../../scripts/scripts.js';

describe('scripts.js', () => {
  before(async () => {
    document.body.innerHTML = `
      <main>
        <div><img src="test.jpg" loading="lazy"></div>
        <div class="metadata"><div><p>title</p><p>About</p></div></div>
      </main>`;
    await loadPage();
  });

  describe('decorateArea', () => {
    it('should remove page metadata from the content area', () => {
      expect(document.querySelector('main .metadata')).to.be.null;
    });

    it('should remove loading attribute from first image', () => {
      const img = document.querySelector('img');
      expect(img.hasAttribute('loading')).to.be.false;
    });

    it('should set fetchPriority to high', () => {
      const img = document.querySelector('img');
      expect(img.fetchPriority).to.equal('high');
    });
  });
});

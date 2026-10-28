import products from '../products.json';
import { renderCatalogGarment } from '../engine/dither.js';
import { navigateTo } from '../router/router.js';

export function renderFeaturedCollection() {
  const totalCount = String(products.length).padStart(2, '0');

  // Curated product sequence: 6 products forming 2 rows of 3 on desktop, 3 rows of 2 on mobile
  const catalogOrder = ['BEY-005', 'BEY-002', 'BEY-006', 'BEY-004', 'BEY-001', 'BEY-003'];
  const featuredProducts = catalogOrder.map(id => products.find(p => p.id === id) || products[0]);

  return `
    <section class="featured-collection" id="featured-collection" aria-labelledby="fc-heading">
      <!-- Compact Collection Header -->
      <header class="fc-header">
        <div class="fc-header-top">
          <div class="fc-meta-pill">
            <span class="fc-meta-dot" aria-hidden="true">■</span>
            <span>BEYOND® / RELEASE_001</span>
            <span class="fc-meta-sep" aria-hidden="true">/</span>
            <span>${totalCount} PIECES</span>
          </div>
          <a href="/shop" class="fc-view-all" data-link aria-label="View all ${totalCount} pieces in shop">
            <span>VIEW ALL</span>
            <span class="fc-arrow" aria-hidden="true">↗</span>
          </a>
        </div>

        <div class="fc-header-headline-row">
          <h2 id="fc-heading" class="fc-title">THE CONCRETE STUDY.</h2>
          <span class="fc-header-sub" aria-hidden="true">RESTRICTED PRODUCT ARCHIVE // AW26</span>
        </div>
      </header>

      <!-- Compact 3-Column Desktop / 2-Column Mobile Grid -->
      <div class="fc-grid">
        ${featuredProducts.map((p, idx) => `
          <article class="fc-card" data-id="${p.id}">
            <!-- Top Identification Bar -->
            <div class="fc-card-top">
              <span class="fc-card-id">${p.id}</span>
              <span class="fc-card-cat">${p.category}</span>
            </div>

            <!-- Consistent 4:5 Media Container -->
            <div class="fc-card-media" role="link" tabindex="0" aria-label="View details for ${p.name}">
              ${p.image ? `
                <img 
                  src="${p.image}" 
                  alt="${p.name}" 
                  class="fc-img" 
                  loading="${idx < 3 ? 'eager' : 'lazy'}" 
                  draggable="false"
                />
              ` : `
                <canvas class="fc-canvas" id="fc-cv-${p.id}" role="img" aria-label="${p.name}"></canvas>
              `}
              <span class="fc-crosshair" aria-hidden="true">+</span>
            </div>

            <!-- Compact Card Info -->
            <div class="fc-card-info">
              <div class="fc-info-primary">
                <h3 class="fc-name">
                  <a href="/product/${p.id}" data-link title="${p.name}">${p.name}</a>
                </h3>
                <span class="fc-price">$${p.price}</span>
              </div>

              <div class="fc-info-secondary">
                ${p.colorways && p.colorways.length > 1 ? `
                  <div class="fc-colorways" role="group" aria-label="Color options for ${p.name}">
                    ${p.colorways.map((c, i) => `
                      <button 
                        type="button" 
                        class="fc-color-btn ${i === 0 ? 'active' : ''}" 
                        data-color-idx="${i}" 
                        aria-pressed="${i === 0}"
                        title="${c.name}"
                      >
                        ${c.name}
                      </button>
                    `).join('')}
                  </div>
                ` : `
                  <span class="fc-single-color">${p.colorways && p.colorways[0] ? p.colorways[0].name : 'Black'}</span>
                `}
                <a href="/product/${p.id}" class="fc-arrow-link" data-link aria-label="View ${p.name}">
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}

export function initFeaturedCollection() {
  const cards = document.querySelectorAll('.fc-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const id = card.dataset.id;
    const product = products.find(p => p.id === id);
    if (!product) return;

    const media = card.querySelector('.fc-card-media');
    const canvas = card.querySelector('.fc-canvas');
    const colorBtns = card.querySelectorAll('.fc-color-btn');

    let selectedTone = product.colorways && product.colorways[0] ? product.colorways[0].tone : 0.9;

    const drawCanvas = () => {
      if (canvas && product.garmentType) {
        // High buffer resolution for razor-sharp micro-dither and visible silhouettes
        renderCatalogGarment(canvas, product.garmentType, selectedTone, 320, 400);
      }
    };

    drawCanvas();

    // Click on media to open product detail page
    if (media) {
      media.addEventListener('click', () => {
        navigateTo(`/product/${product.id}`);
      });
      media.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigateTo(`/product/${product.id}`);
        }
      });
    }

    // Interactive colorway switching
    colorBtns.forEach((btn, idx) => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        colorBtns.forEach(b => {
          const isSelected = b === btn;
          b.setAttribute('aria-pressed', isSelected);
          b.classList.toggle('active', isSelected);
        });
        if (product.colorways && product.colorways[idx]) {
          selectedTone = product.colorways[idx].tone || 0.9;
          drawCanvas();
        }
      });
    });
  });
}

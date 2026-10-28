import products from '../products.json';
import { garment, renderPhoto } from '../engine/dither.js';
import { addItem } from '../store/cart.js';
import { showToast } from '../components/toast.js';

export function renderProduct(productId) {
  const product = products.find(p => p.id === productId) || products[0];
  const origIndex = products.findIndex(p => p.id === product.id);
  const related = products.filter(p => p.id !== product.id).slice(0, 3);

  return `
    <article class="product-view" aria-labelledby="prod-title">
      <a href="/shop" class="product-back" data-link>← Back to Catalog</a>

      <div class="product-layout">
        <div class="product-media">
          <canvas id="main-product-canvas" role="img" aria-label="${product.name}"></canvas>
        </div>

        <div class="product-details">
          <span class="tiny dim">${product.id} / DROP_001 / ${String(origIndex + 1).padStart(2, '0')}</span>
          <h1 id="prod-title">${product.name}</h1>
          <span class="price">$${product.price}</span>

          <div class="product-meta-block">
            <span class="label">COLORWAY</span>
            <div class="row" role="group" aria-label="Colorway">
              ${product.colorways.map((c, i) => `
                <button class="sw" type="button" data-idx="${i}" aria-pressed="${i === 0}">${c.name}</button>
              `).join('')}
            </div>
          </div>

          <div class="product-meta-block">
            <span class="label">SIZE SPEC</span>
            <div class="row" role="group" aria-label="Size selection">
              ${product.sizes.map(s => `
                <button class="sz" type="button" data-size="${s}" aria-pressed="false">${s}</button>
              `).join('')}
            </div>
          </div>

          <div class="product-meta-block">
            <span class="label">QUANTITY</span>
            <div class="qty-control">
              <button class="qty-btn" id="prod-qty-dec" type="button" aria-label="Decrease quantity">−</button>
              <span class="qty-val" id="prod-qty-val">1</span>
              <button class="qty-btn" id="prod-qty-inc" type="button" aria-label="Increase quantity">+</button>
            </div>
          </div>

          <div style="margin-top: 32px;">
            <button class="cta" id="prod-add-btn" type="button" style="width: 100%; justify-content: space-between;">
              Add to Bag
            </button>
          </div>

          <div style="margin-top: 32px; border-top: 1px solid var(--c2); padding-top: 20px;">
            <span class="label">GARMENT NOTES</span>
            <p style="color: var(--c4); line-height: 1.6; font-size: 14px; margin: 0;">
              ${product.description}
            </p>
          </div>
        </div>
      </div>

      <section class="related-section">
        <h2>You may also like</h2>
        <div class="related-grid">
          ${related.map((rel, i) => `
            <div class="p" style="transform: rotate(${i % 2 === 0 ? '-1.5deg' : '1.5deg'});">
              <canvas id="rel-cv-${rel.id}" role="img" aria-label="${rel.name}"></canvas>
              <div class="info">
                <h3><a href="/product/${rel.id}" data-link>${rel.name}</a></h3>
                <span class="pr">$${rel.price}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </article>
  `;
}

export function initProduct(productId) {
  const product = products.find(p => p.id === productId) || products[0];
  const cv = document.getElementById('main-product-canvas');
  const swatches = document.querySelectorAll('.sw');
  const sizes = document.querySelectorAll('.sz');
  const addBtn = document.getElementById('prod-add-btn');
  const qtyValEl = document.getElementById('prod-qty-val');
  const decBtn = document.getElementById('prod-qty-dec');
  const incBtn = document.getElementById('prod-qty-inc');

  let selectedColorIdx = 0;
  let selectedSize = null;
  let qty = 1;

  const drawMain = () => {
    if (!cv) return;
    if (product.image) {
      renderPhoto(cv, product.image, 560, 672);
    } else {
      const tone = product.colorways[selectedColorIdx]?.tone || 0.9;
      garment(cv, product.garmentType, tone, 4, 200, 240);
    }
  };

  drawMain();

  swatches.forEach((sw, idx) => {
    sw.addEventListener('click', () => {
      selectedColorIdx = idx;
      swatches.forEach(s => s.setAttribute('aria-pressed', s === sw));
      drawMain();
    });
  });

  sizes.forEach(sz => {
    sz.addEventListener('click', () => {
      selectedSize = sz.dataset.size;
      sizes.forEach(s => s.setAttribute('aria-pressed', s === sz));
    });
  });

  if (incBtn) {
    incBtn.addEventListener('click', () => {
      qty++;
      if (qtyValEl) qtyValEl.textContent = qty;
    });
  }

  if (decBtn) {
    decBtn.addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        if (qtyValEl) qtyValEl.textContent = qty;
      }
    });
  }

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (!selectedSize) {
        showToast(`Select a size for ${product.name}.`);
        return;
      }
      const colorName = product.colorways[selectedColorIdx].name;
      addItem(product, colorName, selectedSize, qty);
      showToast(`Added ${qty} × ${product.name} (${colorName}, size ${selectedSize}) to bag.`);
    });
  }

  // Draw related products
  const related = products.filter(p => p.id !== product.id).slice(0, 3);
  related.forEach(rel => {
    const relCv = document.getElementById(`rel-cv-${rel.id}`);
    if (relCv) {
      if (rel.image) {
        renderPhoto(relCv, rel.image, 560, 672);
      } else {
        garment(relCv, rel.garmentType, rel.colorways[0]?.tone || 0.9, 4);
      }
    }
  });
}

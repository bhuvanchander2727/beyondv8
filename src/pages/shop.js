import products from '../products.json';
import { content } from '../content.js';
import { renderCatalogGarment } from '../engine/dither.js';
import { addItem } from '../store/cart.js';
import { showToast } from '../components/toast.js';
import { navigateTo } from '../router/router.js';

let activeCategory = 'all';
let activeSize = 'all';
let activeSort = 'default';

// Maintain selected colorway per product ID in memory
const selectedColorMap = new Map();

export function renderShop() {
  const totalCount = products.length;
  const countStr = String(totalCount).padStart(2, '0');

  // Calculate live category counts
  const catCounts = {
    all: totalCount,
    tees: products.filter(p => p.category === 'tees').length,
    hoodies: products.filter(p => p.category === 'hoodies').length,
    jackets: products.filter(p => p.category === 'jackets').length
  };

  return `
    <section class="shop-section" id="shop-section" aria-labelledby="shop-main-heading">
      <div class="shop-inner">
        <!-- 1. Compact Editorial Header -->
      <header class="shop-header">
        <div class="shop-header-top">
          <div class="shop-meta-pill">
            <span class="shop-meta-dot" aria-hidden="true">■</span>
            <span>${content.shop.badge}</span>
            <span class="shop-meta-sep" aria-hidden="true">//</span>
            <span id="shop-header-count">${countStr} PIECES</span>
          </div>
          <span class="shop-meta-season">AW26 // 17.3850° N</span>
        </div>

        <div class="shop-header-main">
          <div class="shop-title-col">
            <h1 id="shop-main-heading" class="shop-title">${content.shop.title}</h1>
            <span class="shop-subtitle">${content.shop.subtitle}</span>
          </div>
          <p class="shop-header-desc">
            ${content.shop.description}
          </p>
        </div>
      </header>

      <!-- 2. Functional Shopping Toolbar -->
      <div class="shop-toolbar" role="region" aria-label="Catalog filters and sorting">
        <div class="shop-filter-bar">
          <span class="shop-toolbar-label" aria-hidden="true">CATEGORY:</span>
          <div class="shop-filter-pills" role="group" aria-label="Category filter">
            <button 
              type="button" 
              class="shop-filter-pill ${activeCategory === 'all' ? 'active' : ''}" 
              data-cat="all" 
              aria-pressed="${activeCategory === 'all'}"
            >
              ALL <span class="pill-count">(${catCounts.all})</span>
            </button>
            <button 
              type="button" 
              class="shop-filter-pill ${activeCategory === 'tees' ? 'active' : ''}" 
              data-cat="tees" 
              aria-pressed="${activeCategory === 'tees'}"
            >
              TEES <span class="pill-count">(${catCounts.tees})</span>
            </button>
            <button 
              type="button" 
              class="shop-filter-pill ${activeCategory === 'hoodies' ? 'active' : ''}" 
              data-cat="hoodies" 
              aria-pressed="${activeCategory === 'hoodies'}"
            >
              HOODIES <span class="pill-count">(${catCounts.hoodies})</span>
            </button>
            <button 
              type="button" 
              class="shop-filter-pill ${activeCategory === 'jackets' ? 'active' : ''}" 
              data-cat="jackets" 
              aria-pressed="${activeCategory === 'jackets'}"
            >
              JACKETS <span class="pill-count">(${catCounts.jackets})</span>
            </button>
          </div>
        </div>

        <div class="shop-controls-bar">
          <div class="shop-control-item">
            <label for="shop-size-filter" class="shop-control-label">SIZE:</label>
            <select id="shop-size-filter" class="shop-select" aria-label="Filter by size">
              <option value="all" ${activeSize === 'all' ? 'selected' : ''}>ALL SIZES</option>
              <option value="S" ${activeSize === 'S' ? 'selected' : ''}>SIZE S</option>
              <option value="M" ${activeSize === 'M' ? 'selected' : ''}>SIZE M</option>
              <option value="L" ${activeSize === 'L' ? 'selected' : ''}>SIZE L</option>
              <option value="XL" ${activeSize === 'XL' ? 'selected' : ''}>SIZE XL</option>
            </select>
          </div>

          <div class="shop-control-item">
            <label for="shop-sort-select" class="shop-control-label">SORT:</label>
            <select id="shop-sort-select" class="shop-select" aria-label="Sort products">
              <option value="default" ${activeSort === 'default' ? 'selected' : ''}>DEFAULT ARCHIVE</option>
              <option value="price-asc" ${activeSort === 'price-asc' ? 'selected' : ''}>PRICE: LOW → HIGH</option>
              <option value="price-desc" ${activeSort === 'price-desc' ? 'selected' : ''}>PRICE: HIGH → LOW</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 3. Status Bar (Count & Reset) -->
      <div class="shop-status-bar">
        <span class="shop-counter" id="shop-counter-text">SHOWING ${totalCount} OF ${totalCount} PIECES</span>
        <button id="shop-reset-filters" class="shop-reset-btn" type="button" ${activeCategory === 'all' && activeSize === 'all' && activeSort === 'default' ? 'hidden' : ''}>
          RESET FILTERS ✕
        </button>
      </div>

      <!-- 4. Disciplined Brutalist Product Grid (3-Col Desktop / 2-Col Mobile) -->
      <div class="shop-grid" id="product-grid" role="region" aria-label="Product listings">
        <!-- Rendered dynamically -->
      </div>
      </div>
    </section>
  `;
}

function getProcessedProducts() {
  let list = [...products];

  // 1. Filter Category
  if (activeCategory !== 'all') {
    list = list.filter(p => p.category === activeCategory);
  }

  // 2. Filter Size
  if (activeSize !== 'all') {
    list = list.filter(p => p.sizes && p.sizes.includes(activeSize));
  }

  // 3. Sort
  if (activeSort === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (activeSort === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  }

  return list;
}

export function initShop() {
  const grid = document.getElementById('product-grid');
  const sortSelect = document.getElementById('shop-sort-select');
  const sizeSelect = document.getElementById('shop-size-filter');
  const filterBtns = document.querySelectorAll('.shop-filter-pill');
  const resetBtn = document.getElementById('shop-reset-filters');
  const counterText = document.getElementById('shop-counter-text');

  // Listeners for sorting and filtering
  if (sortSelect) {
    sortSelect.addEventListener('change', e => {
      activeSort = e.target.value;
      updateStatusAndRender();
    });
  }

  if (sizeSelect) {
    sizeSelect.addEventListener('change', e => {
      activeSize = e.target.value;
      updateStatusAndRender();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      activeCategory = e.currentTarget.dataset.cat;
      filterBtns.forEach(b => {
        const isCurrent = b === e.currentTarget;
        b.setAttribute('aria-pressed', isCurrent);
        b.classList.toggle('active', isCurrent);
      });
      updateStatusAndRender();
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      activeCategory = 'all';
      activeSize = 'all';
      activeSort = 'default';

      if (sortSelect) sortSelect.value = 'default';
      if (sizeSelect) sizeSelect.value = 'all';
      filterBtns.forEach(b => {
        const isAll = b.dataset.cat === 'all';
        b.setAttribute('aria-pressed', isAll);
        b.classList.toggle('active', isAll);
      });

      updateStatusAndRender();
    });
  }

  function updateStatusAndRender() {
    const isFiltered = activeCategory !== 'all' || activeSize !== 'all' || activeSort !== 'default';
    if (resetBtn) {
      resetBtn.hidden = !isFiltered;
    }
    renderProducts();
  }

  function renderProducts() {
    if (!grid) return;
    const items = getProcessedProducts();

    if (counterText) {
      counterText.textContent = `SHOWING ${items.length} OF ${products.length} PIECES`;
    }

    if (items.length === 0) {
      grid.innerHTML = `
        <div class="shop-empty-state">
          <p class="empty-headline">NO GARMENTS FOUND</p>
          <p class="empty-desc">${content.shop.emptyFilter}</p>
          <button type="button" class="shop-empty-reset" id="empty-reset-action">RESET ALL FILTERS</button>
        </div>
      `;
      const emptyReset = document.getElementById('empty-reset-action');
      if (emptyReset && resetBtn) {
        emptyReset.addEventListener('click', () => resetBtn.click());
      }
      return;
    }

    grid.innerHTML = items.map((p, idx) => {
      const selectedColorIdx = selectedColorMap.get(p.id) || 0;
      const activeColor = p.colorways && p.colorways[selectedColorIdx] ? p.colorways[selectedColorIdx].name : 'Default';

      return `
        <article class="shop-card" data-id="${p.id}" data-category="${p.category}">
          <!-- Top Identification Bar -->
          <div class="shop-card-top">
            <span class="shop-card-id">${p.id}</span>
            <span class="shop-card-cat">${p.category.toUpperCase()}</span>
          </div>

          <!-- 4:5 Consistent Media Presentation -->
          <div class="shop-card-media" role="link" tabindex="0" aria-label="View details for ${p.name}">
            ${p.image ? `
              <img 
                src="${p.image}" 
                alt="${p.name}" 
                class="shop-card-img" 
                loading="${idx < 3 ? 'eager' : 'lazy'}" 
                draggable="false"
              />
            ` : `
              <canvas 
                class="shop-card-canvas" 
                id="shop-cv-${p.id}" 
                role="img" 
                aria-label="${p.name}"
              ></canvas>
            `}

            <span class="shop-card-crosshair" aria-hidden="true">+</span>

            <!-- Compact Quick Add Size Drawer (Hidden by default, slides up on trigger) -->
            <div class="shop-quick-drawer" id="quick-drawer-${p.id}" aria-hidden="true">
              <div class="shop-quick-drawer-header">
                <span class="shop-quick-title">SELECT SIZE:</span>
                <button type="button" class="shop-quick-close" aria-label="Close size selector">✕</button>
              </div>
              <div class="shop-quick-sizes" role="group" aria-label="Sizes for ${p.name}">
                ${p.sizes.map(s => `
                  <button 
                    type="button" 
                    class="shop-size-pill" 
                    data-size="${s}" 
                    aria-label="Add size ${s} to bag"
                  >
                    ${s}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Compact Editorial Product Card Info -->
          <div class="shop-card-info">
            <div class="shop-info-main">
              <h3 class="shop-product-name">
                <a href="/product/${p.id}" data-link title="${p.name}">${p.name}</a>
              </h3>
              <span class="shop-product-price">$${p.price}</span>
            </div>

            <div class="shop-info-actions">
              <!-- Colorway Selector / Indicator -->
              <div class="shop-colorways" role="group" aria-label="Color options for ${p.name}">
                ${p.colorways && p.colorways.length > 1 ? p.colorways.map((c, ci) => `
                  <button 
                    type="button" 
                    class="shop-color-btn ${ci === selectedColorIdx ? 'active' : ''}" 
                    data-color-idx="${ci}" 
                    data-color-name="${c.name}"
                    aria-pressed="${ci === selectedColorIdx}" 
                    title="Color: ${c.name}"
                  >
                    <span class="color-dot" aria-hidden="true"></span>
                    <span class="color-name">${c.name}</span>
                  </button>
                `).join('') : `
                  <span class="shop-single-color">COLOR: ${activeColor.toUpperCase()}</span>
                `}
              </div>

              <!-- Compact Quick Add Button -->
              <button 
                type="button" 
                class="shop-quick-add-btn" 
                data-id="${p.id}"
                aria-expanded="false"
                aria-controls="quick-drawer-${p.id}"
                aria-label="Quick add ${p.name} to bag"
              >
                <span class="quick-add-text">+ QUICK ADD</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach card-level behaviors & draw studio vector canvases
    grid.querySelectorAll('.shop-card').forEach(card => {
      const id = card.dataset.id;
      const product = products.find(p => p.id === id);
      if (!product) return;

      const media = card.querySelector('.shop-card-media');
      const canvas = card.querySelector('.shop-card-canvas');
      const colorBtns = card.querySelectorAll('.shop-color-btn');
      const quickAddBtn = card.querySelector('.shop-quick-add-btn');
      const quickDrawer = card.querySelector('.shop-quick-drawer');
      const closeDrawerBtn = card.querySelector('.shop-quick-close');
      const sizePills = card.querySelectorAll('.shop-size-pill');

      let currentSelectedIdx = selectedColorMap.get(id) || 0;

      // Draw studio vector garment on high-resolution buffer
      const drawCanvas = () => {
        if (canvas && product.garmentType) {
          const tone = product.colorways && product.colorways[currentSelectedIdx] 
            ? product.colorways[currentSelectedIdx].tone 
            : 0.9;
          // Render at 480x600 for sharp 4:5 studio look
          renderCatalogGarment(canvas, product.garmentType, tone, 480, 600);
        }
      };

      drawCanvas();

      // Click media to open product detail page (unless clicking drawer)
      if (media) {
        media.addEventListener('click', e => {
          if (e.target.closest('.shop-quick-drawer')) return;
          navigateTo(`/product/${product.id}`);
        });

        media.addEventListener('keydown', e => {
          if (e.target.closest('.shop-quick-drawer')) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigateTo(`/product/${product.id}`);
          }
        });
      }

      // Colorway switching
      colorBtns.forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          const idx = parseInt(btn.dataset.colorIdx, 10);
          currentSelectedIdx = idx;
          selectedColorMap.set(id, idx);

          colorBtns.forEach(b => {
            const isSelected = b === btn;
            b.setAttribute('aria-pressed', isSelected);
            b.classList.toggle('active', isSelected);
          });

          drawCanvas();
        });
      });

      // Quick Add Drawer Toggle
      const openDrawer = () => {
        // Close other open drawers first
        document.querySelectorAll('.shop-quick-drawer.open').forEach(dr => {
          if (dr !== quickDrawer) {
            dr.classList.remove('open');
            dr.setAttribute('aria-hidden', 'true');
            const parentCard = dr.closest('.shop-card');
            if (parentCard) {
              const btn = parentCard.querySelector('.shop-quick-add-btn');
              if (btn) btn.setAttribute('aria-expanded', 'false');
            }
          }
        });

        quickDrawer.classList.add('open');
        quickDrawer.setAttribute('aria-hidden', 'false');
        quickAddBtn.setAttribute('aria-expanded', 'true');
      };

      const closeDrawer = () => {
        quickDrawer.classList.remove('open');
        quickDrawer.setAttribute('aria-hidden', 'true');
        quickAddBtn.setAttribute('aria-expanded', 'false');
      };

      if (quickAddBtn) {
        quickAddBtn.addEventListener('click', e => {
          e.stopPropagation();
          const isOpen = quickDrawer.classList.contains('open');
          if (isOpen) {
            closeDrawer();
          } else {
            openDrawer();
          }
        });
      }

      if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', e => {
          e.stopPropagation();
          closeDrawer();
        });
      }

      // Size Pill selection for immediate cart addition
      sizePills.forEach(pill => {
        pill.addEventListener('click', e => {
          e.stopPropagation();
          const size = pill.dataset.size;
          const colorName = product.colorways && product.colorways[currentSelectedIdx]
            ? product.colorways[currentSelectedIdx].name
            : 'Standard';

          // Add item to cart store
          addItem(product, colorName, size, 1);

          // Visual confirmation on button
          const originalText = quickAddBtn.innerHTML;
          quickAddBtn.innerHTML = '<span class="quick-add-text quick-add-success">✓ ADDED</span>';
          quickAddBtn.classList.add('added');

          showToast(`Added ${product.name} (${colorName} / ${size}) to bag.`);

          // Auto-close drawer
          setTimeout(() => {
            closeDrawer();
            setTimeout(() => {
              quickAddBtn.innerHTML = originalText;
              quickAddBtn.classList.remove('added');
            }, 600);
          }, 400);
        });
      });
    });
  }

  // Close drawers when clicking anywhere outside
  document.addEventListener('click', e => {
    if (!e.target.closest('.shop-card')) {
      document.querySelectorAll('.shop-quick-drawer.open').forEach(dr => {
        dr.classList.remove('open');
        dr.setAttribute('aria-hidden', 'true');
        const parentCard = dr.closest('.shop-card');
        if (parentCard) {
          const btn = parentCard.querySelector('.shop-quick-add-btn');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });
    }
  });

  // Initial render
  renderProducts();
}

import { getCart, updateQty, removeItem, getSubtotal } from '../store/cart.js';
import { garment } from '../engine/dither.js';
import { navigateTo } from '../router/router.js';

let drawerElement = null;
let overlayElement = null;
let lastFocusedElement = null;

export function renderCartDrawer() {
  return `
    <div class="cart-overlay" id="cart-overlay" aria-hidden="true"></div>
    <aside class="cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping Bag">
      <div class="cart-drawer-header">
        <h2>BAG (<span id="drawer-count">0</span>)</h2>
        <button class="cart-close-btn" id="cart-close-btn" type="button" aria-label="Close bag">✕</button>
      </div>
      <div class="cart-items" id="cart-items-container">
        <!-- populated dynamically -->
      </div>
      <div class="cart-drawer-footer">
        <div class="cart-subtotal">
          <span>SUBTOTAL</span>
          <span id="cart-subtotal-val">$0</span>
        </div>
        <button class="cta" id="cart-checkout-btn" type="button" style="width: 100%; justify-content: space-between;">
          Proceed to Checkout
        </button>
      </div>
    </aside>
  `;
}

function updateDrawerContents() {
  const container = document.getElementById('cart-items-container');
  const countEl = document.getElementById('drawer-count');
  const subtotalEl = document.getElementById('cart-subtotal-val');
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  if (!container) return;

  const items = getCart();
  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = getSubtotal();

  if (countEl) countEl.textContent = totalCount;
  if (subtotalEl) subtotalEl.textContent = `$${subtotal}`;
  if (checkoutBtn) checkoutBtn.disabled = items.length === 0;

  if (items.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <p>Your bag is currently empty.</p>
        <button class="btn-sec" id="empty-shop-btn" type="button" style="margin-top: 16px;">
          Explore DROP_001
        </button>
      </div>
    `;
    const emptyBtn = container.querySelector('#empty-shop-btn');
    if (emptyBtn) {
      emptyBtn.addEventListener('click', () => {
        closeCartDrawer();
        navigateTo('/shop');
      });
    }
    return;
  }

  container.innerHTML = items.map((item, idx) => `
    <div class="cart-item" data-index="${idx}">
      ${item.product.image 
        ? `<img src="${item.product.image}" alt="${item.product.name}" />`
        : `<canvas class="cart-thumb-cv" data-type="${item.product.garmentType}" data-tone="${item.product.colorways.find(c => c.name === item.colorway)?.tone || 0.9}"></canvas>`
      }
      <div class="cart-item-info">
        <h4>${item.product.name}</h4>
        <p>${item.colorway} / SIZE ${item.size}</p>
        <span class="item-price">$${item.product.price}</span>
      </div>
      <div class="cart-item-actions">
        <div class="qty-control">
          <button class="qty-btn" data-action="dec" data-index="${idx}" aria-label="Decrease quantity">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" data-action="inc" data-index="${idx}" aria-label="Increase quantity">+</button>
        </div>
        <button class="cart-remove-btn" data-action="remove" data-index="${idx}" type="button">Remove</button>
      </div>
    </div>
  `).join('');

  // Render dithered canvases for vector garments
  container.querySelectorAll('.cart-thumb-cv').forEach(cv => {
    const type = cv.dataset.type;
    const tone = parseFloat(cv.dataset.tone);
    garment(cv, type, tone, 4, 80, 96);
  });

  // Attach item action handlers
  container.querySelectorAll('button[data-action]').forEach(btn => {
    btn.addEventListener('click', e => {
      const action = e.currentTarget.dataset.action;
      const idx = parseInt(e.currentTarget.dataset.index, 10);
      if (action === 'inc') updateQty(idx, 1);
      else if (action === 'dec') updateQty(idx, -1);
      else if (action === 'remove') removeItem(idx);
    });
  });
}

export function openCartDrawer() {
  drawerElement = document.getElementById('cart-drawer');
  overlayElement = document.getElementById('cart-overlay');
  if (!drawerElement || !overlayElement) return;

  lastFocusedElement = document.activeElement;
  updateDrawerContents();

  drawerElement.classList.add('active');
  overlayElement.classList.add('active');
  overlayElement.setAttribute('aria-hidden', 'false');

  const closeBtn = document.getElementById('cart-close-btn');
  if (closeBtn) closeBtn.focus();

  document.addEventListener('keydown', handleKeyDown);
}

export function closeCartDrawer() {
  if (!drawerElement) drawerElement = document.getElementById('cart-drawer');
  if (!overlayElement) overlayElement = document.getElementById('cart-overlay');
  if (!drawerElement || !overlayElement) return;

  drawerElement.classList.remove('active');
  overlayElement.classList.remove('active');
  overlayElement.setAttribute('aria-hidden', 'true');

  document.removeEventListener('keydown', handleKeyDown);

  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

function handleKeyDown(e) {
  if (e.key === 'Escape') {
    closeCartDrawer();
    return;
  }

  // Focus trap
  if (e.key === 'Tab' && drawerElement) {
    const focusable = drawerElement.querySelectorAll('button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  }
}

export function initCartDrawer() {
  drawerElement = document.getElementById('cart-drawer');
  overlayElement = document.getElementById('cart-overlay');

  const closeBtn = document.getElementById('cart-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);

  if (overlayElement) overlayElement.addEventListener('click', closeCartDrawer);

  const checkoutBtn = document.getElementById('cart-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      closeCartDrawer();
      navigateTo('/checkout');
    });
  }

  window.addEventListener('cart-updated', () => {
    if (drawerElement && drawerElement.classList.contains('active')) {
      updateDrawerContents();
    }
  });
}

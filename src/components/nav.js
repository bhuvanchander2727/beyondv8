import { getItemCount } from '../store/cart.js';
import { openCartDrawer } from './cartDrawer.js';

export function renderNav() {
  const count = getItemCount();
  return `
    <nav class="site-nav" aria-label="Primary">
      <a href="/" class="nav-logo" aria-label="BEYOND home">
        <svg class="mk" viewBox="0 0 40 40" fill="none" stroke="#f0eee8" stroke-width="1.6">
          <path d="M20 3 37 15.5 30.5 36h-21L3 15.5Z"/>
        </svg>
      </a>
      <a class="wm" href="/">Beyond</a>
      <ul>
        <li><a href="/shop" data-link>Shop</a></li>
        <li><a href="/about" data-link>About</a></li>
        <li><a href="/contact" data-link>Contact</a></li>
        <li>
          <button id="bagbtn" type="button" aria-label="View shopping bag with ${count} items">
            Bag (<span id="bagn">${count}</span>)
          </button>
        </li>
      </ul>
    </nav>
  `;
}

export function initNav() {
  const bagBtn = document.getElementById('bagbtn');
  if (bagBtn) {
    bagBtn.addEventListener('click', () => {
      openCartDrawer();
    });
  }

  // Sync bag count on cart changes
  window.addEventListener('cart-updated', () => {
    const bagn = document.getElementById('bagn');
    if (bagn) {
      bagn.textContent = getItemCount();
    }
  });
}

export function updateNavActive(currentPath) {
  document.querySelectorAll('#nav-root nav li a, nav.site-nav li a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPath || (currentPath.startsWith('/shop') && href === '/shop') || (currentPath.startsWith('/product') && href === '/shop')) {
      a.setAttribute('aria-current', 'page');
    } else {
      a.removeAttribute('aria-current');
    }
  });
}

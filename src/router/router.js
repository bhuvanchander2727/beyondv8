import { renderHome, initHome } from '../pages/home.js';
import { renderShop, initShop } from '../pages/shop.js';
import { renderProduct, initProduct } from '../pages/product.js';
import { renderAbout, initAbout } from '../pages/about.js';
import { renderContact, initContact } from '../pages/contact.js';
import { renderCheckout, initCheckout } from '../pages/checkout.js';
import { renderNotFound, initNotFound } from '../pages/notFound.js';
import { updateNavActive } from '../components/nav.js';
import { bgBuild } from '../engine/background.js';
import products from '../products.json';

const routes = [
  { path: '/', render: renderHome, init: initHome, bg: 'home', title: 'BEYOND — DROP_001 / The Concrete Study' },
  { path: '/shop', render: renderShop, init: initShop, bg: 'shop', title: 'Shop — BEYOND' },
  { path: '/about', render: renderAbout, init: initAbout, bg: 'about', title: 'About — BEYOND' },
  { path: '/contact', render: renderContact, init: initContact, bg: 'home', title: 'Contact — BEYOND' },
  { path: '/checkout', render: renderCheckout, init: initCheckout, bg: 'shop', title: 'Checkout — BEYOND' }
];

export function navigateTo(url) {
  window.history.pushState(null, null, url);
  handleRoute();
}

export function handleRoute() {
  const path = window.location.pathname;
  const appContainer = document.getElementById('app-main');
  if (!appContainer) return;

  // Check product route match: /product/:id
  const productMatch = path.match(/^\/product\/([^/]+)$/);
  if (productMatch) {
    const productId = productMatch[1];
    const product = products.find(p => p.id === productId);
    document.title = product ? `${product.name} — BEYOND` : 'Product — BEYOND';
    appContainer.innerHTML = renderProduct(productId);
    initProduct(productId);
    updateNavActive(path);
    window.scrollTo(0, 0);
    bgBuild('product');
    return;
  }

  // Exact routes match
  const matchedRoute = routes.find(r => r.path === path);
  if (matchedRoute) {
    document.title = matchedRoute.title;
    appContainer.innerHTML = matchedRoute.render();
    matchedRoute.init();
    updateNavActive(path);
    window.scrollTo(0, 0);
    bgBuild(matchedRoute.bg);
    return;
  }

  // 404 Fallback
  document.title = '404 — BEYOND';
  appContainer.innerHTML = renderNotFound();
  initNotFound();
  updateNavActive(path);
  window.scrollTo(0, 0);
  bgBuild('home');
}

export function initRouter() {
  window.navigateTo = navigateTo;
  window.addEventListener('popstate', handleRoute);

  // Global link click interceptor for SPA navigation
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Only intercept local paths starting with / or #
    if (href.startsWith('/') && !href.startsWith('/assets/')) {
      e.preventDefault();
      navigateTo(href);
    } else if (href.startsWith('#')) {
      // Internal anchors like #shop or #about or #top
      const targetHash = href;
      if (targetHash === '#shop') {
        e.preventDefault();
        navigateTo('/shop');
      } else if (targetHash === '#about') {
        e.preventDefault();
        navigateTo('/about');
      } else if (targetHash === '#top') {
        e.preventDefault();
        if (window.location.pathname !== '/') {
          navigateTo('/');
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }
  });

  handleRoute();
}

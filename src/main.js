import './styles/index.css';
import './styles/hero.css';
import './styles/ticker.css';
import './styles/featured.css';
import './styles/manifesto.css';
import './styles/video.css';
import './styles/contactSheet.css';
import './styles/shop.css';
import './styles/about.css';
import './styles/cart.css';
import './styles/footer.css';

import { initBackground } from './engine/background.js';
import { renderNav, initNav } from './components/nav.js';
import { renderCartDrawer, initCartDrawer } from './components/cartDrawer.js';
import { renderFooter, initFooter } from './components/footer.js';
import { initRouter } from './router/router.js';

document.addEventListener('DOMContentLoaded', () => {
  // Mount base UI components
  const navRoot = document.getElementById('nav-root');
  if (navRoot) {
    navRoot.innerHTML = renderNav();
    initNav();
  }

  const drawerRoot = document.getElementById('drawer-root');
  if (drawerRoot) {
    drawerRoot.innerHTML = renderCartDrawer();
    initCartDrawer();
  }

  const footerRoot = document.getElementById('footer-root');
  if (footerRoot) {
    footerRoot.innerHTML = renderFooter();
    initFooter();
  }

  // Initialize concrete background canvas engine
  initBackground();

  // Initialize client-side SPA routing
  initRouter();
});

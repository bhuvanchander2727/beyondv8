import { content } from '../content.js';

export function renderFooter() {
  const brand = content.brand;

  return `
    <footer class="beyond-footer" role="contentinfo" aria-label="BEYOND site footer">
      <!-- Subtle Analog Film / Darkroom Paper Grain -->
      <div class="ft-grain" aria-hidden="true"></div>

      <div class="ft-inner">
        <!-- ==================================================================
             LAYER 01 — NEWSLETTER: STAY OUTSIDE THE LINES.
             ================================================================== -->
        <section class="ft-layer-newsletter" aria-labelledby="ft-nl-heading">
          <div class="ft-nl-content">
            <div class="ft-nl-header">
              <span class="ft-nl-badge">COMMUNIQUE // DROP_001</span>
              <h2 id="ft-nl-heading" class="ft-nl-title">STAY OUTSIDE THE LINES.</h2>
              <p class="ft-nl-sub">Get notified about upcoming releases.</p>
            </div>

            <form class="ft-nl-form" id="ft-newsletter-form" novalidate>
              <div class="ft-nl-input-wrap">
                <label for="ft-email-input" class="sr-only">Email address for release notifications</label>
                <input 
                  type="email" 
                  id="ft-email-input" 
                  name="email" 
                  class="ft-nl-input" 
                  placeholder="ENTER EMAIL ADDRESS" 
                  autocomplete="email" 
                  required 
                  aria-describedby="ft-nl-status"
                />
                <button type="submit" class="ft-nl-btn" id="ft-email-submit">
                  <span>JOIN PROTOCOL</span>
                  <span class="ft-nl-arrow" aria-hidden="true">→</span>
                </button>
              </div>
              <div class="ft-nl-status" id="ft-nl-status" role="status" aria-live="polite"></div>
            </form>
          </div>
        </section>

        <!-- ==================================================================
             LAYER 02 — NAVIGATION: EXPLORE, SUPPORT, LEGAL
             ================================================================== -->
        <nav class="ft-layer-nav" aria-label="Footer navigation">
          <div class="ft-nav-cols">
            <!-- Col 1: Brand Identifier & Technical Specs -->
            <div class="ft-nav-col ft-col-brand">
              <div class="ft-brand-mark">
                <span class="ft-brand-name">BEYOND®</span>
                <span class="ft-brand-spec">[STUDIO STUDY // AW26]</span>
              </div>
              <p class="ft-brand-bio">
                Independent underground streetwear label. Built from the unfinished. Heavyweight textiles, raw edge construction, and an uncompromised 1-bit industrial aesthetic.
              </p>
              <div class="ft-coords-pill">
                <span>LOC: ${brand.coordinates}</span>
                <span class="ft-sep" aria-hidden="true">/</span>
                <span>${brand.season}</span>
              </div>
            </div>

            <!-- Col 2: EXPLORE -->
            <div class="ft-nav-col">
              <h3 class="ft-nav-heading">EXPLORE</h3>
              <ul class="ft-nav-list">
                <li><a href="/shop" class="ft-link" data-link>Shop All</a></li>
                <li><span class="ft-link ft-unlinked" title="Collections route pending creation">Collections <span class="ft-pending-badge" aria-label="Route pending">[PENDING]</span></span></li>
                <li><a href="/about" class="ft-link" data-link>Our Story</a></li>
              </ul>
            </div>

            <!-- Col 3: SUPPORT -->
            <div class="ft-nav-col">
              <h3 class="ft-nav-heading">SUPPORT</h3>
              <ul class="ft-nav-list">
                <li><span class="ft-link ft-unlinked" title="Size guide page pending integration">Size Guide <span class="ft-pending-badge" aria-label="Route pending">[PENDING]</span></span></li>
                <li><span class="ft-link ft-unlinked" title="Shipping & Returns page pending integration">Shipping & Returns <span class="ft-pending-badge" aria-label="Route pending">[PENDING]</span></span></li>
                <li><a href="/contact" class="ft-link" data-link>Contact</a></li>
              </ul>
            </div>

            <!-- Col 4: LEGAL -->
            <div class="ft-nav-col">
              <h3 class="ft-nav-heading">LEGAL</h3>
              <ul class="ft-nav-list">
                <li><span class="ft-link ft-unlinked" title="Privacy policy page pending integration">Privacy Policy <span class="ft-pending-badge" aria-label="Route pending">[PENDING]</span></span></li>
                <li><span class="ft-link ft-unlinked" title="Terms & conditions page pending integration">Terms & Conditions <span class="ft-pending-badge" aria-label="Route pending">[PENDING]</span></span></li>
              </ul>
            </div>
          </div>
        </nav>

        <!-- ==================================================================
             LAYER 03 — OVERSIZED WORDMARK: BEYOND
             ================================================================== -->
        <section class="ft-layer-wordmark" aria-label="Brand identity and copyright">
          <div class="ft-wordmark-wrap">
            <span class="ft-wordmark" aria-hidden="true">BEYOND</span>
          </div>

          <div class="ft-bottom-meta">
            <div class="ft-meta-left">
              <span>${brand.copyright}</span>
              <span class="ft-meta-sep" aria-hidden="true">//</span>
              <span>INDEPENDENT EXPERIMENTAL APPAREL</span>
            </div>
            <div class="ft-meta-right">
              <span>${brand.coordinates} // DROP_001 // THE CONCRETE STUDY</span>
              <span class="ft-meta-sep" aria-hidden="true">//</span>
              <a href="#top" class="ft-top-link" aria-label="Scroll back to top of page">[BACK TO TOP ↑]</a>
            </div>
          </div>
        </section>
      </div>
    </footer>
  `;
}

export function initFooter() {
  const form = document.getElementById('ft-newsletter-form');
  const input = document.getElementById('ft-email-input');
  const status = document.getElementById('ft-nl-status');
  if (!form || !input || !status) return;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value.trim();

    if (!val) {
      status.className = 'ft-nl-status ft-status-error';
      status.textContent = '[ERROR: EMAIL FIELD CANNOT BE EMPTY]';
      input.focus();
      return;
    }

    if (!emailRegex.test(val)) {
      status.className = 'ft-nl-status ft-status-error';
      status.textContent = '[ERROR: INVALID FORMAT — PLEASE ENTER A VALID EMAIL ADDRESS]';
      input.focus();
      return;
    }

    // Input is valid. DO NOT fake a successful subscription service.
    // Present an honest, protocol-ready status indicating backend endpoint is needed.
    status.className = 'ft-nl-status ft-status-ready';
    status.textContent = `[PROTOCOL READY // API NOT CONFIGURED: ${val.toUpperCase()} LOGGED CLIENTSIDE — CONNECT MAILCHIMP / KLAVIYO ENDPOINT]`;
    console.info(`[BEYOND Newsletter Protocol]: Valid email entered: <${val}>. UI is ready. Connect newsletter webhook/API.`);
    
    input.value = '';
  });

  input.addEventListener('input', () => {
    if (status.textContent) {
      status.textContent = '';
      status.className = 'ft-nl-status';
    }
  });

  const topLink = document.querySelector('.ft-top-link');
  if (topLink) {
    topLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

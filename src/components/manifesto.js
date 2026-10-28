import { content } from '../content.js';

export function renderBrandManifesto() {
  const brandName = content.brand.name; // BEYOND
  const season = content.brand.season; // AW26
  const coordinates = content.brand.coordinates; // 17.3850° N

  return `
    <section class="brand-manifesto bm-reveal" id="manifesto" aria-labelledby="manifesto-heading">
      <!-- Subtle Paper Grain Overlay (5-8% opacity) -->
      <div class="bm-grain" aria-hidden="true"></div>

      <!-- Top Technical Margin Strip -->
      <header class="bm-top-strip">
        <div class="bm-tag-group">
          <span class="bm-pill">MANIFESTO_001</span>
          <span class="bm-coord">${coordinates} // STUDIO STUDY</span>
        </div>
        <div class="bm-meta-right">
          <span class="bm-mono-meta">${brandName}® / INDEPENDENT LABEL</span>
          <span class="bm-mono-meta">${season} // DROP_001</span>
        </div>
      </header>

      <!-- Main Asymmetric Composition Grid -->
      <div class="bm-grid">
        <!-- Left / Dominant Column: Massive Main Statement -->
        <div class="bm-main-statement">
          <h2 id="manifesto-heading" class="bm-title">
            <span class="bm-line bm-line-1">NOT MADE TO</span>
            <span class="bm-line bm-line-2">BLEND IN.</span>
          </h2>
        </div>

        <!-- Right / Supporting Column: Secondary Statement, Verified Body Copy, & Action -->
        <div class="bm-supporting">
          <div class="bm-sub-wrap">
            <span class="bm-rule" aria-hidden="true"></span>
            <h3 class="bm-sub-heading">BUILT FROM THE UNFINISHED.</h3>
          </div>

          <p class="bm-body">
            BEYOND is an independent streetwear label. Every piece begins as a rough study and is finished by wear. Grounded in heavyweight textiles, raw edge construction, and an uncompromised 1-bit industrial aesthetic.
          </p>

          <div class="bm-footer-row">
            <div class="bm-specs" role="group" aria-label="Verified specifications">
              <span class="bm-spec-item">[SPEC: 280–480 GSM]</span>
              <span class="bm-spec-item">[DROP_001]</span>
              <span class="bm-spec-item">[SMALL RUNS]</span>
            </div>
            <a href="/about" class="bm-link" data-link aria-label="Read full brand essay on the about page">
              <span>READ FULL ESSAY</span>
              <span class="bm-link-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Bottom Technical Hairline & Edge Marker -->
      <footer class="bm-bottom-strip" aria-hidden="true">
        <span class="bm-corner-cross">+</span>
        <span>${brandName}® // THE CONCRETE STUDY</span>
        <span class="bm-corner-cross">+</span>
      </footer>
    </section>
  `;
}

export function initBrandManifesto() {
  const manifestoEl = document.querySelector('.brand-manifesto');
  if (!manifestoEl) return;

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    manifestoEl.classList.add('visible');
    return;
  }

  // Graceful intersection observer reveal
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(manifestoEl);
  } else {
    manifestoEl.classList.add('visible');
  }
}

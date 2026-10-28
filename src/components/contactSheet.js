import { content } from '../content.js';

export function renderContactSheet() {
  const cs = content.contactSheet;

  return `
    <section class="contact-sheet-section cs-reveal" id="contact-sheet" aria-labelledby="cs-heading">
      <!-- Subtle Analog Film Grain Texture -->
      <div class="cs-grain" aria-hidden="true"></div>

      <div class="cs-inner">
        <!-- Archival Contact Sheet Header Strip -->
        <header class="cs-header">
          <div class="cs-header-left">
            <span class="cs-badge">${cs.badge}</span>
            <span class="cs-archival-label">${cs.label}</span>
          </div>
          <div class="cs-header-center">
            <h2 id="cs-heading" class="cs-title">${cs.heading}</h2>
          </div>
          <div class="cs-header-right">
            <span class="cs-meta">${cs.meta}</span>
            <span class="cs-dot" aria-hidden="true">✦</span>
            <span class="cs-frame-count">${cs.frameMeta}</span>
          </div>
        </header>

        <!-- 35mm Analog Filmstrip Artifact -->
        <div class="cs-strip-container" role="region" aria-label="35mm Filmstrip Contact Sheet">
          <!-- Top Film Rebate Bar -->
          <div class="cs-rebate cs-rebate-top" aria-hidden="true">
            <span class="cs-rebate-code">BEYOND 400TX</span>
            <span class="cs-sprockets">▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪</span>
            <span class="cs-rebate-code">SAFETY FILM // AW26</span>
          </div>

          <!-- Single Horizontal Photographic Strip -->
          <div class="cs-strip" id="cs-strip" tabindex="0" role="list" aria-label="Scrollable photographic contact strip">
            ${cs.frames.map((frame, index) => `
              <figure 
                class="cs-frame" 
                data-index="${index}" 
                role="listitem" 
                tabindex="0" 
                aria-label="Frame ${frame.frameNum}: ${frame.caption}. Tap to enlarge."
              >
                <!-- Frame Header: Numbering & Edge Mark -->
                <div class="cs-frame-edge cs-frame-edge-top" aria-hidden="true">
                  <span class="cs-frame-num">${frame.frameNum}</span>
                  <span class="cs-edge-mark">▷ ${frame.edgeCode}</span>
                </div>

                <!-- Frame Photograph Window -->
                <div class="cs-photo-window">
                  <img 
                    src="${frame.src}" 
                    alt="${frame.alt}" 
                    class="cs-img" 
                    loading="lazy" 
                    draggable="false" 
                  />
                  <span class="cs-loupe-icon" aria-hidden="true">+</span>
                </div>

                <!-- Frame Footer: Archival Caption -->
                <figcaption class="cs-frame-edge cs-frame-edge-bottom">
                  <span class="cs-frame-caption">${frame.caption}</span>
                  <span class="cs-film-brand" aria-hidden="true">400TX</span>
                </figcaption>
              </figure>
            `).join('')}
          </div>

          <!-- Bottom Film Rebate Bar -->
          <div class="cs-rebate cs-rebate-bottom" aria-hidden="true">
            <span class="cs-rebate-code">17.3850° N</span>
            <span class="cs-sprockets">▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪ ▪</span>
            <span class="cs-rebate-code">ROLL 001 // ISO 400</span>
          </div>
        </div>

        <!-- Archival Technical Footer Strip -->
        <footer class="cs-footer" aria-hidden="true">
          <span class="cs-mark">+</span>
          <span>${content.brand.name}® // PHOTOGRAPHIC ARCHIVE // RAW SILVER GELATIN CONTACT SHEET</span>
          <span class="cs-mark">+</span>
        </footer>
      </div>

      <!-- Minimalist Tap-to-Enlarge Lightbox Modal -->
      <div class="cs-lightbox" id="cs-lightbox" role="dialog" aria-modal="true" aria-label="Photographic Frame Viewer" hidden>
        <div class="cs-lightbox-backdrop" id="cs-lightbox-backdrop"></div>
        <div class="cs-lightbox-dialog">
          <header class="cs-lb-header">
            <span class="cs-lb-index" id="cs-lb-index">01 / 05</span>
            <span class="cs-lb-title">${cs.heading} — ${cs.label}</span>
            <button class="cs-lb-close" id="cs-lb-close" type="button" aria-label="Close image viewer">
              <span>[CLOSE]</span> ✕
            </button>
          </header>
          <div class="cs-lb-body">
            <button class="cs-lb-nav cs-lb-prev" id="cs-lb-prev" type="button" aria-label="Previous photograph">
              ‹
            </button>
            <div class="cs-lb-media-wrap">
              <img class="cs-lb-img" id="cs-lb-img" src="" alt="" />
              <p class="cs-lb-caption" id="cs-lb-caption"></p>
            </div>
            <button class="cs-lb-nav cs-lb-next" id="cs-lb-next" type="button" aria-label="Next photograph">
              ›
            </button>
          </div>
          <footer class="cs-lb-footer" aria-hidden="true">
            <span>USE ← / → KEYS TO NAVIGATE // ESC TO CLOSE</span>
            <span>${content.brand.coordinates} // BEYOND® 400TX</span>
          </footer>
        </div>
      </div>
    </section>
  `;
}

export function initContactSheet() {
  const sectionEl = document.querySelector('.contact-sheet-section');
  if (!sectionEl) return;

  const frames = content.contactSheet.frames;
  const frameEls = sectionEl.querySelectorAll('.cs-frame');
  const lightbox = document.getElementById('cs-lightbox');
  const lbBackdrop = document.getElementById('cs-lightbox-backdrop');
  const lbImg = document.getElementById('cs-lb-img');
  const lbCaption = document.getElementById('cs-lb-caption');
  const lbIndex = document.getElementById('cs-lb-index');
  const lbClose = document.getElementById('cs-lb-close');
  const lbPrev = document.getElementById('cs-lb-prev');
  const lbNext = document.getElementById('cs-lb-next');

  let currentIndex = 0;
  let lastFocusedEl = null;

  // Viewport reveal animation (IntersectionObserver)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    sectionEl.classList.add('visible');
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    });
    observer.observe(sectionEl);
  } else {
    sectionEl.classList.add('visible');
  }

  // Update lightbox content
  const updateLightbox = (index) => {
    if (index < 0) index = frames.length - 1;
    if (index >= frames.length) index = 0;
    currentIndex = index;

    const frame = frames[currentIndex];
    if (lbImg) {
      lbImg.src = frame.src;
      lbImg.alt = frame.alt;
    }
    if (lbCaption) {
      lbCaption.textContent = `${frame.frameNum} // ${frame.caption}`;
    }
    if (lbIndex) {
      lbIndex.textContent = `[${String(currentIndex + 1).padStart(2, '0')} / ${String(frames.length).padStart(2, '0')}]`;
    }
  };

  // Open lightbox
  const openLightbox = (index, triggerEl) => {
    if (!lightbox) return;
    lastFocusedEl = triggerEl;
    updateLightbox(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    if (lbClose) lbClose.focus();
  };

  // Close lightbox
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedEl && typeof lastFocusedEl.focus === 'function') {
      lastFocusedEl.focus();
    }
  };

  // Attach tap/click listeners to frames
  frameEls.forEach((frameEl, idx) => {
    frameEl.addEventListener('click', () => {
      openLightbox(idx, frameEl);
    });

    frameEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(idx, frameEl);
      }
    });
  });

  // Lightbox controls
  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
  if (lbPrev) lbPrev.addEventListener('click', () => updateLightbox(currentIndex - 1));
  if (lbNext) lbNext.addEventListener('click', () => updateLightbox(currentIndex + 1));

  // Keyboard navigation within lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.hidden) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      updateLightbox(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      updateLightbox(currentIndex + 1);
    }
  });
}

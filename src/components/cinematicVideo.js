import { content } from '../content.js';

export function renderCinematicVideo() {
  const v = content.video;

  return `
    <section class="cinematic-video-section cv-reveal" id="motion-study" aria-labelledby="cv-heading">
      <!-- Subtle Paper/Film Grain Texture Overlay -->
      <div class="cv-grain" aria-hidden="true"></div>

      <div class="cv-inner">
        <!-- Top Editorial Technical Header Strip -->
        <header class="cv-header">
          <div class="cv-header-left">
            <span class="cv-badge">${v.badge}</span>
            <h2 id="cv-heading" class="cv-label">${v.label}</h2>
          </div>
          <div class="cv-header-right">
            <span class="cv-subtitle">${v.subtitle}</span>
            <span class="cv-dot" aria-hidden="true">✦</span>
            <span class="cv-coords">${content.brand.coordinates} // AW26</span>
          </div>
        </header>

        <!-- Wide Cinematic Video Container (Integrated 16:9 Aspect Ratio) -->
        <div class="cv-frame">
          <!-- Corner Registration Crosshairs (+) -->
          <span class="cv-cross cv-cross-tl" aria-hidden="true">+</span>
          <span class="cv-cross cv-cross-tr" aria-hidden="true">+</span>
          <span class="cv-cross cv-cross-bl" aria-hidden="true">+</span>
          <span class="cv-cross cv-cross-br" aria-hidden="true">+</span>

          <!-- HTML5 Inline Fashion Video with Poster Fallback -->
          <video
            class="cv-video"
            id="beyond-campaign-video"
            autoplay
            muted
            loop
            playsinline
            webkit-playsinline="true"
            preload="metadata"
            poster="${v.posterSrc}"
            aria-label="${v.altText}"
          >
            <source src="${v.videoSrc}" type="video/mp4" />
            <source src="${v.fallbackSrc}" type="video/mp4" />
            Your browser does not support HTML5 video playback.
          </video>

          <!-- Premium Cinematic Editorial Text Overlay (Integrated in Upper Negative Space) -->
          <div class="cv-text-overlay" aria-hidden="true">
            <span class="cv-overlay-label">${v.overlayLabel}</span>
            <h3 class="cv-overlay-title">${v.overlayTitle}</h3>
            <span class="cv-overlay-sub">${v.overlaySubtitle}</span>
          </div>

          <!-- Accessible Keyboard-Only Motion Control (WCAG 2.2.2 - Visible Only On Tab Focus) -->
          <button 
            class="cv-a11y-toggle" 
            type="button" 
            id="cv-a11y-toggle" 
            aria-label="Pause background video motion" 
            aria-pressed="false"
          >
            Pause background video
          </button>
        </div>

        <!-- Technical Editorial Edge Marker -->
        <footer class="cv-footer" aria-hidden="true">
          <span class="cv-corner-mark">+</span>
          <span>${content.brand.name}® // CINEMATIC ARCHIVE // THE CONCRETE STUDY</span>
          <span class="cv-corner-mark">+</span>
        </footer>
      </div>
    </section>
  `;
}

export function initCinematicVideo() {
  const sectionEl = document.querySelector('.cinematic-video-section');
  const videoEl = document.getElementById('beyond-campaign-video');
  const a11yToggle = document.getElementById('cv-a11y-toggle');
  if (!sectionEl || !videoEl) return;

  let isUserPaused = false;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sync accessible state for keyboard control
  const updateA11yState = (paused) => {
    if (!a11yToggle) return;
    if (paused) {
      a11yToggle.textContent = 'Play background video';
      a11yToggle.setAttribute('aria-label', 'Play background video motion');
      a11yToggle.setAttribute('aria-pressed', 'true');
    } else {
      a11yToggle.textContent = 'Pause background video';
      a11yToggle.setAttribute('aria-label', 'Pause background video motion');
      a11yToggle.setAttribute('aria-pressed', 'false');
    }
  };

  // Accessibility: Honor prefers-reduced-motion
  if (prefersReducedMotion) {
    videoEl.pause();
    isUserPaused = true;
    updateA11yState(true);
    sectionEl.classList.add('visible');
  } else {
    // Attempt continuous muted autoplay on load
    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        updateA11yState(false);
      }).catch(() => {
        // Autoplay policy prevented playback until interaction
        updateA11yState(true);
      });
    }
  }

  // Accessible keyboard motion toggle listener
  if (a11yToggle) {
    a11yToggle.addEventListener('click', () => {
      if (videoEl.paused) {
        videoEl.play();
        isUserPaused = false;
        updateA11yState(false);
      } else {
        videoEl.pause();
        isUserPaused = true;
        updateA11yState(true);
      }
    });
  }

  // Viewport-aware playback & text overlay reveal (IntersectionObserver)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sectionEl.classList.add('visible');
          if (!isUserPaused && !prefersReducedMotion && videoEl.paused) {
            videoEl.play().catch(() => {});
            updateA11yState(false);
          }
        } else {
          // Pause when scrolled out of view to preserve resources
          if (!videoEl.paused) {
            videoEl.pause();
          }
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    observer.observe(sectionEl);
  } else {
    sectionEl.classList.add('visible');
  }
}

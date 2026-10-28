import { content } from '../content.js';
import founders from '../data/founders.json';

export function renderAbout() {
  const { opening, story, founders: foundersHeader, philosophy, closing, specs } = content.about;

  return `
    <article class="about-page" id="about-page" aria-labelledby="about-opening-title">

      <!-- =========================================================================
           SECTION 01: THE OPENING STATEMENT
           ========================================================================= -->
      <section class="about-sec about-sec-opening" aria-labelledby="about-opening-title">
        <div class="about-inner">
          <div class="about-meta-row">
            <div class="about-pill">
              <span class="about-pill-dot" aria-hidden="true">■</span>
              <span>${opening.badge}</span>
              <span class="about-pill-sep" aria-hidden="true">//</span>
              <span>${opening.sub}</span>
            </div>
            <span class="about-mono-coords">${content.brand.season} // ${content.brand.coordinates}</span>
          </div>

          <div class="about-opening-hero">
            <h1 id="about-opening-title" class="about-title-reveal">
              <span class="reveal-mask-line"><span>BUILT FROM</span></span>
              <span class="reveal-mask-line"><span>THE UNFINISHED.</span></span>
            </h1>

            <div class="about-opening-lead-wrap">
              <p class="about-opening-lead">
                ${opening.lead}
              </p>
              <div class="about-opening-specs">
                <span class="spec-label">TEXTILE ARCHIVE SPEC:</span>
                <span class="spec-val">280–480 GSM CUSTOM-MILLED COTTON // RAW EDGE ACCENTS // LIMITED SERIALIZATION</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- =========================================================================
           SECTION 02: THE STORY (Asymmetric Split with Warm Contrast)
           ========================================================================= -->
      <section class="about-sec about-sec-story" id="about-story" aria-labelledby="story-title">
        <div class="about-inner">
          <div class="story-layout">
            <!-- Visual Column: Authentic Boutique Photography with Shutter Reveal -->
            <div class="story-media-col" data-reveal="vertical">
              <div class="story-media-frame">
                <img 
                  src="${story.photo}" 
                  alt="The physical BEYOND boutique architectural interior" 
                  class="story-img"
                  loading="lazy"
                  draggable="false"
                />
                <div class="story-media-overlay" aria-hidden="true"></div>
                <span class="story-corner-crosshair top-l" aria-hidden="true">+</span>
                <span class="story-corner-crosshair bottom-r" aria-hidden="true">+</span>
                <div class="story-media-caption">
                  <span>${story.photoCaption}</span>
                </div>
              </div>
            </div>

            <!-- Narrative Column -->
            <div class="story-content-col" data-reveal="fade-up">
              <div class="story-tag-pill">
                <span class="story-dot" aria-hidden="true">■</span>
                <span>${story.badge}</span>
              </div>

              <h2 id="story-title" class="story-heading">${story.headline}</h2>

              <div class="story-prose">
                ${story.paragraphs.map(p => `<p>${p}</p>`).join('')}
              </div>

              <div class="story-specs-table">
                ${specs.slice(0, 4).map(s => `
                  <div class="story-spec-row">
                    <span class="story-spec-dt">${s.label}</span>
                    <span class="story-spec-dd">${s.value}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- =========================================================================
           SECTION 03: FOUNDERS & CO-FOUNDERS (Underground Magazine Portraits)
           ========================================================================= -->
      <section class="about-sec about-sec-founders" id="about-founders" aria-labelledby="founders-title">
        <div class="about-inner">
          <header class="founders-header" data-reveal="fade-up">
            <div class="founders-meta-bar">
              <div class="about-pill">
                <span class="about-pill-dot" aria-hidden="true">■</span>
                <span>${foundersHeader.badge}</span>
                <span class="about-pill-sep" aria-hidden="true">//</span>
                <span>${foundersHeader.sub}</span>
              </div>
              <span class="founders-count-mono">${String(founders.length).padStart(2, '0')} PROFILES</span>
            </div>

            <div class="founders-title-wrap">
              <h2 id="founders-title" class="founders-title">
                <span class="founders-line">THE MINDS</span>
                <span class="founders-line">BEHIND BEYOND.</span>
              </h2>
              <p class="founders-header-note">
                The creative directors, architects, and studio operators shaping the label's material research.
              </p>
            </div>
          </header>

          <!-- Dynamic Editorial Portrait Grid -->
          <div class="founders-grid">
            ${founders.map((f, idx) => `
              <article class="founder-card" data-id="${f.id}" data-reveal="shutter" style="--delay: ${idx * 0.15}s">
                <!-- Background Typography Watermark -->
                <span class="founder-watermark" aria-hidden="true">0${idx + 1}</span>

                <!-- Photographic Portrait Container with Shutter Reveal -->
                <div class="founder-portrait-wrap" role="region" aria-label="Portrait of ${f.name}">
                  <span class="f-cross top-l" aria-hidden="true">⌜</span>
                  <span class="f-cross top-r" aria-hidden="true">⌝</span>
                  <span class="f-cross bottom-l" aria-hidden="true">⌞</span>
                  <span class="f-cross bottom-r" aria-hidden="true">⌟</span>
                  <span class="f-rec-tag" aria-hidden="true">REC_0${idx + 1}</span>

                  <!-- Portrait Image with Clean Fallback -->
                  <div class="founder-img-box">
                    <img 
                      src="${f.image}" 
                      alt="Portrait of ${f.name}, ${f.role}" 
                      class="founder-img"
                      loading="lazy"
                      draggable="false"
                      onerror="this.onerror=null; this.src='${f.imageFallback}';"
                    />
                  </div>

                  <!-- Interactive Biographical Overlay Panel (Desktop hover / Mobile tap) -->
                  <div class="founder-bio-panel" id="bio-panel-${f.id}">
                    ${f.isPlaceholder ? `
                      <div class="founder-placeholder-banner">
                        <span class="banner-tag">EDITABLE CONFIG</span>
                        <span class="banner-hint">Update in <code>src/data/founders.json</code></span>
                      </div>
                    ` : ''}

                    <p class="founder-bio-text">${f.bio}</p>

                    ${f.quote ? `
                      <blockquote class="founder-quote">
                        ${f.quote}
                      </blockquote>
                    ` : ''}

                    ${f.social ? `
                      <a href="${f.social.url}" class="founder-social-link" target="_blank" rel="noopener noreferrer" aria-label="Visit ${f.name} on ${f.social.platform}">
                        <span>${f.social.platform} ${f.social.handle}</span>
                        <span class="f-link-arrow" aria-hidden="true">↗</span>
                      </a>
                    ` : ''}
                  </div>

                  <!-- Mobile Tap Toggle Indicator -->
                  <button 
                    type="button" 
                    class="founder-mobile-toggle" 
                    aria-expanded="false" 
                    aria-controls="bio-panel-${f.id}"
                    aria-label="Toggle biography for ${f.name}"
                  >
                    <span class="toggle-text">VIEW BIO</span>
                    <span class="toggle-icon">+</span>
                  </button>
                </div>

                <!-- Essential Name & Role (Always visible & legible) -->
                <div class="founder-card-footer">
                  <div class="founder-name-row">
                    <h3 class="founder-name">${f.name}</h3>
                    <span class="founder-id-mono">BEY_IND/0${idx + 1}</span>
                  </div>
                  <span class="founder-role">${f.role}</span>
                </div>
              </article>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- =========================================================================
           SECTION 04: THE DESIGN PHILOSOPHY (Three Connected Editorial Pillars)
           ========================================================================= -->
      <section class="about-sec about-sec-philosophy" id="about-philosophy" aria-labelledby="phil-title">
        <div class="about-inner">
          <header class="philosophy-header" data-reveal="fade-up">
            <div class="about-pill">
              <span class="about-pill-dot" aria-hidden="true">■</span>
              <span>${philosophy.badge}</span>
              <span class="about-pill-sep" aria-hidden="true">//</span>
              <span>${philosophy.sub}</span>
            </div>
            <h2 id="phil-title" class="philosophy-title">${philosophy.headline}</h2>
          </header>

          <div class="philosophy-grid">
            ${philosophy.pillars.map((pil, pi) => `
              <div class="philosophy-card" data-reveal="fade-up" style="--delay: ${pi * 0.12}s">
                <div class="phil-top-bar">
                  <span class="phil-tag">${pil.tag}</span>
                  <span class="phil-coord">ARCHIVE // SPEC</span>
                </div>

                <!-- Pillar Visual Frame -->
                <div class="phil-media-frame">
                  <img 
                    src="${pil.image}" 
                    alt="${pil.title} detail study" 
                    class="phil-img"
                    loading="lazy"
                    draggable="false"
                  />
                  <span class="phil-corner" aria-hidden="true">+</span>
                </div>

                <div class="phil-body">
                  <h3 class="phil-title">${pil.title}</h3>
                  <p class="phil-desc">${pil.desc}</p>
                  <span class="phil-caption">${pil.caption}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- =========================================================================
           SECTION 05: CLOSING STATEMENT (Working Outlined CTA)
           ========================================================================= -->
      <section class="about-sec about-sec-closing" aria-labelledby="closing-title">
        <div class="about-inner closing-inner" data-reveal="fade-up">
          <div class="about-pill">
            <span class="about-pill-dot" aria-hidden="true">■</span>
            <span>${closing.badge}</span>
            <span class="about-pill-sep" aria-hidden="true">//</span>
            <span>${closing.sub}</span>
          </div>

          <h2 id="closing-title" class="closing-title">
            <span class="closing-line">NOT MADE</span>
            <span class="closing-line">TO BLEND IN.</span>
          </h2>

          <div class="closing-cta-wrap">
            <a href="/shop" class="about-cta" data-link aria-label="Explore the collection in the shop">
              <span>${closing.cta}</span>
              <svg class="about-cta-arr" width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M2.5 8H13.5M9.5 4L13.5 8L9.5 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </article>
  `;
}

export function initAbout() {
  const page = document.getElementById('about-page');
  if (!page) return;

  // Trigger clipped mask opening reveal after slight delay for smooth entry
  requestAnimationFrame(() => {
    setTimeout(() => {
      page.classList.add('loaded');
    }, 60);
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Setup lightweight IntersectionObserver for scroll-triggered editorial reveals
  const revealElements = page.querySelectorAll('[data-reveal]');
  
  if (prefersReduced) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  } else if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '20px 0px -20px 0px',
      threshold: 0.02
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if IntersectionObserver not available
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // Mobile tap interactions for founder portrait cards
  const mobileToggles = page.querySelectorAll('.founder-mobile-toggle');
  mobileToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const wrap = toggle.closest('.founder-portrait-wrap');
      if (!wrap) return;

      const isOpen = wrap.classList.contains('bio-open');
      
      // Close any other open mobile panels first
      page.querySelectorAll('.founder-portrait-wrap.bio-open').forEach(w => {
        if (w !== wrap) {
          w.classList.remove('bio-open');
          const t = w.querySelector('.founder-mobile-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });

      wrap.classList.toggle('bio-open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
      const toggleText = toggle.querySelector('.toggle-text');
      if (toggleText) {
        toggleText.textContent = isOpen ? 'VIEW BIO' : 'CLOSE BIO';
      }
    });
  });

  // Close open mobile bio drawers when tapping outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.founder-card')) {
      page.querySelectorAll('.founder-portrait-wrap.bio-open').forEach(w => {
        w.classList.remove('bio-open');
        const t = w.querySelector('.founder-mobile-toggle');
        if (t) {
          t.setAttribute('aria-expanded', 'false');
          const toggleText = t.querySelector('.toggle-text');
          if (toggleText) toggleText.textContent = 'VIEW BIO';
        }
      });
    }
  });
}

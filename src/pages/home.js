import { content } from '../content.js';
import { initHero } from '../engine/hero.js';
import { renderAnnouncementTicker } from '../components/ticker.js';
import { renderFeaturedCollection, initFeaturedCollection } from '../components/featuredCollection.js';
import { renderBrandManifesto, initBrandManifesto } from '../components/manifesto.js';
import { renderCinematicVideo, initCinematicVideo } from '../components/cinematicVideo.js';
import { renderContactSheet, initContactSheet } from '../components/contactSheet.js';

export function renderHome() {
  return `
    <header class="hero" id="top">
      <div class="herobg" aria-hidden="true">
        <div class="herobg-img"></div>
        <div class="herobg-overlay"></div>
        <div class="hgrid"></div>
      </div>
      <div class="model" aria-hidden="false">
        <div class="model-shadow" aria-hidden="true"></div>
        <img 
          src="/assets/hero/hero-model.png" 
          alt="${content.hero.modelAlt}" 
          width="682" 
          height="1024" 
          draggable="false" 
          loading="eager"
          fetchpriority="high"
        />
      </div>
      <button class="tiltbtn tiny" type="button" hidden>${content.hero.tiltPrompt}</button>
      <div class="stk" aria-hidden="true">${content.hero.sticker}</div>
      <span class="tiny corner">${content.brand.season} &nbsp; DROP_001 &nbsp; ${content.brand.coordinates}</span>
      <p class="big" aria-label="${content.brand.wordmark}">
        <span class="ln" aria-hidden="true">Be</span><span aria-hidden="true">yond</span>
      </p>
      <div class="stmt">
        <h1 class="sr-only">${content.hero.headline}</h1>
        <a class="cta" href="/shop" data-link aria-label="${content.hero.cta}">
          <span>${content.hero.cta}</span>
          <svg class="cta-arr" width="13" height="13" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M2.5 8H13.5M9.5 4L13.5 8L9.5 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/>
          </svg>
        </a>
      </div>
      <div class="idx tiny dim">
        <span>${content.hero.scrollText}</span><i></i>
      </div>
    </header>

    ${renderAnnouncementTicker()}
    
    ${renderFeaturedCollection()}

    ${renderCinematicVideo()}

    ${renderBrandManifesto()}

    ${renderContactSheet()}
  `;
}

export function initHome() {
  initHero();
  initFeaturedCollection();
  initCinematicVideo();
  initBrandManifesto();
  initContactSheet();
}

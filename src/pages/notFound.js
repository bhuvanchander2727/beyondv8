import { content } from '../content.js';

export function renderNotFound() {
  return `
    <div class="subpage">
      <div class="notfound-card">
        <h1 class="notfound-code">${content.notFound.code}</h1>
        <h2 style="font-weight: 300; font-size: 24px; margin: 0 0 16px; letter-spacing: .06em;">
          ${content.notFound.headline}
        </h2>
        <p class="dim" style="font-size: 15px; margin-bottom: 30px;">
          ${content.notFound.description}
        </p>
        <a class="cta" href="/" data-link style="justify-content: center;">
          ${content.notFound.cta}
        </a>
      </div>
    </div>
  `;
}

export function initNotFound() {}

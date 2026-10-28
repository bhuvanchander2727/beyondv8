import { content } from '../content.js';

export function renderAnnouncementTicker() {
  const items = content.ticker.announcement;

  const segmentHtml = items.map(item => {
    if (item.type === 'bold') {
      return `<span class="ticker-bold">${item.text}</span>`;
    }
    if (item.type === 'mono') {
      return `<span class="ticker-mono">${item.text}</span>`;
    }
    return `<span class="ticker-sep" aria-hidden="true">${item.text}</span>`;
  }).join('');

  // 3 repeats inside each group gives ~2800px width per group, ensuring
  // full seamless coverage across ultra-wide monitors up to 4K with zero jump.
  const groupHtml = `${segmentHtml}${segmentHtml}${segmentHtml}`;

  return `
    <section class="announcement-ticker" aria-label="Drop Announcement">
      <p class="sr-only">BEYOND® / RELEASE_001 / HEAVY COTTON / BUILT TO WEAR IN / NO EXCESS / 280–480 GSM / DROP_001</p>
      <div class="ticker-track" aria-hidden="true">
        <div class="ticker-group">
          ${groupHtml}
        </div>
        <div class="ticker-group">
          ${groupHtml}
        </div>
      </div>
    </section>
  `;
}

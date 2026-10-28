// 1-bit Bayer 8x8 threshold matrix and procedural garment vector engine

const B = [
  0, 32, 8, 40, 2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44, 4, 36, 14, 46, 6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37,
  63, 31, 55, 23, 61, 29, 53, 21
];

export function dither(cv, bias = 4) {
  const x = cv.getContext('2d', { willReadFrequently: true });
  const w = cv.width;
  const h = cv.height;
  const im = x.getImageData(0, 0, w, h);
  const d = im.data;
  
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const k = (j * w + i) * 4;
      const v = d[k] / 255 + (Math.random() - 0.5) * 0.06;
      const on = v * 64 + bias > B[(j & 7) * 8 + (i & 7)] + 0.5;
      const o = on ? 240 : 23;
      d[k] = o;
      d[k + 1] = on ? 238 : 23;
      d[k + 2] = on ? 232 : 21;
      d[k + 3] = 255;
    }
  }
  x.putImageData(im, 0, 0);
}

const g = v => {
  v = Math.round(v * 255);
  return `rgb(${v},${v},${v})`;
};

const PATH = {
  tee: 'M70 20Q100 42 130 20L182 46 166 88 146 76V222H54V76L34 88 18 46Z',
  over: 'M64 24Q100 44 136 24L196 52 184 110 156 98V224H44V98L16 110 4 52Z',
  hood: 'M60 34Q64 -2 100 -2T140 34L186 62 194 206 166 210 150 112V226H50V112L34 210 6 206 14 62Z',
  jack: 'M58 26 76 12H124L142 26 190 56 194 214 164 216 154 110V226H46V110L36 216 6 214 10 56Z'
};

const FOLDS = {
  tee: [[100, 40, 96, 200], [60, 90, 80, 210]],
  over: [[80, 60, 70, 215], [130, 70, 140, 210], [20, 80, 50, 100]],
  hood: [[100, 30, 100, 220], [70, 120, 60, 220], [40, 70, 30, 190]],
  jack: [[100, 30, 100, 220], [70, 130, 72, 200], [132, 130, 130, 200], [60, 60, 50, 190]]
};

export function garment(cv, type, tone = 0.9, bias = 4, scaleW = 80, scaleH = 96) {
  cv.width = scaleW;
  cv.height = scaleH;
  const x = cv.getContext('2d', { willReadFrequently: true });
  
  x.fillStyle = g(0.1);
  x.fillRect(0, 0, scaleW, scaleH);
  
  const bg = x.createLinearGradient(0, 0, scaleW, scaleH);
  bg.addColorStop(0, g(0.34));
  bg.addColorStop(1, g(0.12));
  x.fillStyle = bg;
  x.fillRect(0, 0, scaleW, scaleH);
  
  x.save();
  const scale = scaleW / 200;
  x.scale(scale, scale);
  
  const p = new Path2D(PATH[type] || PATH.tee);
  const gr = x.createLinearGradient(0, 0, 200, 0);
  gr.addColorStop(0, g(tone * 0.55));
  gr.addColorStop(0.4, g(Math.min(1, tone * 1.12)));
  gr.addColorStop(1, g(tone * 0.5));
  
  x.fillStyle = gr;
  x.fill(p);
  x.clip(p);
  x.lineWidth = 5;
  x.strokeStyle = 'rgba(0,0,0,.28)';
  
  const folds = FOLDS[type] || FOLDS.tee;
  folds.forEach(f => {
    x.beginPath();
    x.moveTo(f[0], f[1]);
    x.quadraticCurveTo((f[0] + f[2]) / 2 + 14, (f[1] + f[3]) / 2, f[2], f[3]);
    x.stroke();
  });
  
  x.lineWidth = 2;
  x.strokeStyle = 'rgba(0,0,0,.5)';
  
  if (type === 'hood' || type === 'jack') {
    x.beginPath();
    x.moveTo(100, type === 'hood' ? 40 : 30);
    x.lineTo(100, 226);
    x.stroke();
  }
  
  if (type === 'hood') {
    x.fillStyle = 'rgba(0,0,0,.6)';
    x.beginPath();
    x.ellipse(100, 34, 24, 18, 0, 0, 7);
    x.fill();
  }
  
  if (type === 'jack') {
    x.strokeRect(62, 140, 26, 26);
    x.strokeRect(112, 140, 26, 26);
    x.fillStyle = 'rgba(0,0,0,.35)';
    x.beginPath();
    x.moveTo(76, 12);
    x.lineTo(100, 48);
    x.lineTo(124, 12);
    x.fill();
  }
  
  if (type === 'tee' || type === 'over') {
    x.fillStyle = 'rgba(0,0,0,.4)';
    x.beginPath();
    x.ellipse(100, 25, 22, 10, 0, 0, 3.15);
    x.fill();
  }
  
  x.restore();
  dither(cv, bias);
}

export function renderPhoto(cv, imageSrc, w = 560, h = 672) {
  cv.width = w;
  cv.height = h;
  cv.classList.add('photo');
  const x = cv.getContext('2d');
  
  const bg = x.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#aaa69b');
  bg.addColorStop(1, '#6e6b63');
  x.fillStyle = bg;
  x.fillRect(0, 0, w, h);
  
  const im = new Image();
  im.onload = () => {
    const r = Math.min((w * 0.88) / im.width, (h * 0.88) / im.height);
    const iw = im.width * r;
    const ih = im.height * r;
    const ix = (w - iw) / 2;
    const iy = (h - ih) / 2;
    
    x.save();
    x.filter = 'blur(10px)';
    x.globalAlpha = 0.45;
    x.fillStyle = '#000';
    x.beginPath();
    x.ellipse(w / 2, iy + ih + 6, iw * 0.38, 14, 0, 0, 7);
    x.fill();
    x.restore();
    
    x.imageSmoothingQuality = 'high';
    x.drawImage(im, ix, iy, iw, ih);
  };
  im.src = imageSrc;
}

export function renderCatalogGarment(cv, type, tone = 0.9, w = 320, h = 400) {
  cv.width = w;
  cv.height = h;
  const x = cv.getContext('2d', { willReadFrequently: true });
  if (!x) return;

  // 1. Clean, dark studio background
  const bg = x.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#1c1b1a');
  bg.addColorStop(0.65, '#121211');
  bg.addColorStop(1, '#0c0c0b');
  x.fillStyle = bg;
  x.fillRect(0, 0, w, h);

  // Subtle studio pedestal radial glow
  const spot = x.createRadialGradient(w / 2, h * 0.46, 12, w / 2, h * 0.46, w * 0.44);
  spot.addColorStop(0, 'rgba(240, 238, 233, 0.07)');
  spot.addColorStop(1, 'rgba(0, 0, 0, 0)');
  x.fillStyle = spot;
  x.fillRect(0, 0, w, h);

  // 2. Center and scale garment path so the entire garment is visible
  const targetW = 200;
  const targetH = 240;
  const scale = Math.min((w * 0.78) / targetW, (h * 0.78) / targetH);
  const offsetX = (w - targetW * scale) / 2;
  const offsetY = (h - targetH * scale) / 2;

  // 3. Ground contact shadow
  x.save();
  x.filter = 'blur(10px)';
  x.fillStyle = 'rgba(0, 0, 0, 0.55)';
  x.beginPath();
  x.ellipse(w / 2, offsetY + 230 * scale, 64 * scale, 10 * scale, 0, 0, Math.PI * 2);
  x.fill();
  x.restore();

  // 4. Draw garment vector with colorway tone
  x.save();
  x.translate(offsetX, offsetY);
  x.scale(scale, scale);

  const p = new Path2D(PATH[type] || PATH.tee);
  const gr = x.createLinearGradient(0, 0, targetW, 0);
  gr.addColorStop(0, g(tone * 0.56));
  gr.addColorStop(0.35, g(Math.min(0.96, tone * 1.14)));
  gr.addColorStop(0.65, g(tone * 0.85));
  gr.addColorStop(1, g(tone * 0.5));

  x.fillStyle = gr;
  x.fill(p);

  // Clip to garment for interior seams and folds
  x.save();
  x.clip(p);

  // Fold lines
  x.lineWidth = 4.5;
  x.strokeStyle = 'rgba(0,0,0,.26)';
  const folds = FOLDS[type] || FOLDS.tee;
  folds.forEach(f => {
    x.beginPath();
    x.moveTo(f[0], f[1]);
    x.quadraticCurveTo((f[0] + f[2]) / 2 + 12, (f[1] + f[3]) / 2, f[2], f[3]);
    x.stroke();
  });

  x.lineWidth = 1.8;
  x.strokeStyle = 'rgba(0,0,0,.45)';
  folds.forEach(f => {
    x.beginPath();
    x.moveTo(f[0], f[1]);
    x.quadraticCurveTo((f[0] + f[2]) / 2 + 12, (f[1] + f[3]) / 2, f[2], f[3]);
    x.stroke();
  });

  // Center zip for hoodie & jacket
  if (type === 'hood' || type === 'jack') {
    x.beginPath();
    x.moveTo(100, type === 'hood' ? 40 : 30);
    x.lineTo(100, 226);
    x.lineWidth = 2.5;
    x.strokeStyle = 'rgba(0,0,0,.5)';
    x.stroke();
  }

  // Hood opening
  if (type === 'hood') {
    x.fillStyle = 'rgba(0,0,0,.55)';
    x.beginPath();
    x.ellipse(100, 34, 24, 18, 0, 0, Math.PI * 2);
    x.fill();
  }

  // Jacket pockets & lapel
  if (type === 'jack') {
    x.strokeStyle = 'rgba(0,0,0,.4)';
    x.lineWidth = 2;
    x.strokeRect(62, 140, 26, 26);
    x.strokeRect(112, 140, 26, 26);
    x.fillStyle = 'rgba(0,0,0,.3)';
    x.beginPath();
    x.moveTo(76, 12);
    x.lineTo(100, 48);
    x.lineTo(124, 12);
    x.fill();
  }

  // Tee & Oversized collar
  if (type === 'tee' || type === 'over') {
    x.fillStyle = 'rgba(0,0,0,.35)';
    x.beginPath();
    x.ellipse(100, 25, 22, 10, 0, 0, Math.PI * 2);
    x.fill();
  }

  x.restore(); // end clip

  // Sharp garment outline
  x.lineWidth = 2.5;
  x.strokeStyle = 'rgba(0,0,0,.6)';
  x.stroke(p);

  x.restore(); // end scale

  // 5. Restrained micro-dither texture specifically over the garment
  // Preserves full edge sharpness and silhouettes while keeping BEYOND's 1-bit texture
  const im = x.getImageData(0, 0, w, h);
  const d = im.data;
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const k = (j * w + i) * 4;
      // Only apply texture to the illuminated garment area
      const lum = (d[k] + d[k + 1] + d[k + 2]) / 3;
      if (lum > 32) {
        const pattern = B[(j & 7) * 8 + (i & 7)] / 64;
        const diff = (pattern - 0.5) * 28;
        d[k] = Math.max(10, Math.min(245, d[k] + diff));
        d[k + 1] = Math.max(10, Math.min(245, d[k + 1] + diff));
        d[k + 2] = Math.max(10, Math.min(245, d[k + 2] + diff));
      }
    }
  }
  x.putImageData(im, 0, 0);
}

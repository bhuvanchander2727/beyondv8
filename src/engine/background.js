// Living wall concrete engine with 1-bit Bayer dithering, stencils, seams, and cursor flashlight

const PX = 6;
let currentView = 'home';
let baseImageData = null;
let lightX = -1;
let lightY = 0;
let bgWidth = 0;
let bgHeight = 0;
let bgRafId = 0;
let resizeTimer = null;
let lastWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

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

let canvas = null;
let ctx = null;

const gg = (v, a = 1) => `rgba(${v * 255 | 0},${v * 255 | 0},${v * 255 | 0},${a})`;
const rr = (a, b) => a + Math.random() * (b - a);
const sm = t => t * t * (3 - 2 * t);

function wall(W, H, lv) {
  const L = [];
  const S = Math.max(W, H);
  for (let o = 0; o < 6; o++) {
    const n = 3 << o;
    const a = [];
    for (let i = 0; i < (n + 1) ** 2; i++) a.push(Math.random());
    L.push([n, a]);
  }
  
  const im = ctx.createImageData(W, H);
  const d = im.data;
  
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const u = (i / S) * 0.98;
      const v = (j / S) * 0.98;
      let r = 0, t = 0, m = 0.5;
      
      for (const [n, a] of L) {
        const fx = u * n, fy = v * n;
        const ix = fx | 0, iy = fy | 0;
        const tx = sm(fx - ix), ty = sm(fy - iy);
        const w = n + 1;
        const p = a[iy * w + ix], q = a[iy * w + ix + 1];
        const e = a[(iy + 1) * w + ix], f = a[(iy + 1) * w + ix + 1];
        r += m * ((p + (q - p) * tx) * (1 - ty) + (e + (f - e) * tx) * ty);
        t += m;
        m *= 0.55;
      }
      
      let c = 0.3 + (r / t) * 0.55 * lv + (Math.random() - 0.5) * 0.13;
      if (Math.random() < 0.012) c -= 0.3;
      
      const k = (j * W + i) * 4;
      d[k] = d[k + 1] = d[k + 2] = c * 255;
      d[k + 3] = 255;
    }
  }
  ctx.putImageData(im, 0, 0);
}

function stencil(vw) {
  const x = ctx;
  x.save();
  x.translate(vw * 0.05, 56);
  x.rotate(-0.06);
  x.font = '700 30px sans-serif';
  x.fillStyle = gg(0.04, 0.92);
  x.fillText('BEY-001', 0, 0);
  x.fillStyle = gg(0.5, 0.9);
  for (const px of [20, 48, 76, 104]) x.fillRect(px, -27, 2, 31);
  x.restore();
  
  x.save();
  x.translate(vw * 0.36, 26);
  x.rotate(0.5);
  x.fillStyle = gg(0.97, 0.95);
  x.beginPath();
  x.moveTo(-26, -6);
  x.lineTo(6, -6);
  x.lineTo(6, -16);
  x.lineTo(28, 0);
  x.lineTo(6, 16);
  x.lineTo(6, 6);
  x.lineTo(-26, 6);
  x.fill();
  x.restore();
  
  x.strokeStyle = gg(0.04);
  x.lineWidth = 2;
  x.beginPath();
  x.arc(vw * 0.9, 92, 14, 0, 7);
  x.moveTo(vw * 0.9 - 22, 92);
  x.lineTo(vw * 0.9 + 22, 92);
  x.moveTo(vw * 0.9, 70);
  x.lineTo(vw * 0.9, 114);
  x.stroke();
}

function seams(vw) {
  const x = ctx;
  const cw = vw / 3;
  x.fillStyle = gg(0.05, 0.6);
  for (let c = 1; c < 3; c++) x.fillRect(c * cw - 1, 0, 2, 130);
  x.fillRect(0, 64, vw, 2);
  
  x.fillStyle = gg(0.95, 0.35);
  for (let c = 1; c < 3; c++) x.fillRect(c * cw + 1, 0, 2, 130);
  x.fillRect(0, 66, vw, 2);
  
  for (let c = 0; c < 3; c++) {
    for (let r = 0; r < 2; r++) {
      for (const hx of [0.2, 0.8]) {
        for (const hy of [0.22, 0.78]) {
          const X = c * cw + hx * cw;
          const Y = r * 65 + hy * 65;
          x.fillStyle = gg(0.9, 0.5);
          x.beginPath();
          x.arc(X, Y, 5.5, 0, 7);
          x.fill();
          x.fillStyle = gg(0.03);
          x.beginPath();
          x.arc(X, Y, 3.5, 0, 7);
          x.fill();
        }
      }
    }
  }
}

function star(X, Y, s, c) {
  const x = ctx;
  x.fillStyle = c;
  x.fillRect(X - s / 2, Y - s * 1.5, s, s * 3);
  x.fillRect(X - s * 1.5, Y - s / 2, s * 3, s);
  x.fillRect(X - s, Y - s, s * 2, s * 2);
}

function scribble(X, Y, R, ds) {
  const x = ctx;
  x.strokeStyle = gg(0.97, 0.95);
  x.lineWidth = 2.4;
  x.beginPath();
  for (let a = 0; a < 19; a += 0.2) {
    const r = (R + Math.sin(a * 1.7) * 3 + a * 0.5) * ds;
    x.lineTo(X + Math.cos(a) * r * 1.15, Y + Math.sin(a) * r * 0.85);
  }
  x.stroke();
}

function stamp(X, Y, rot, ds) {
  const x = ctx;
  x.save();
  x.translate(X, Y);
  x.rotate(rot);
  x.scale(ds, ds);
  x.strokeStyle = gg(0.04);
  x.fillStyle = gg(0.04);
  x.lineWidth = 3;
  x.strokeRect(-46, -20, 92, 40);
  x.lineWidth = 1.2;
  x.strokeRect(-42, -16, 84, 32);
  x.font = '700 15px sans-serif';
  x.textAlign = 'center';
  x.fillText('NOT FOR', 0, -2);
  x.fillText('RESALE', 0, 14);
  x.restore();
}

function doodles(vw, v) {
  const ds = Math.min(1, vw / 200);
  const L = gg(0.97);
  const D = gg(0.04);
  
  if (v === 'home') {
    star(vw * 0.12, 100, 3, L);
    star(vw * 0.27, 20, 4, L);
    star(vw * 0.46, 60, 3, D);
    star(vw * 0.82, 16, 3, L);
    star(vw * 0.74, 116, 4, L);
    scribble(vw * 0.76, 44, 14, ds);
    stamp(vw * 0.55, 102, -0.12, ds);
  } else if (v === 'shop' || v === 'product') {
    star(vw * 0.05, 30, 3, L);
    star(vw * 0.95, 100, 4, L);
    star(vw * 0.5, 16, 3, D);
    star(vw * 0.62, 112, 3, L);
    stamp(vw * 0.86, 24, 0.1, ds);
  } else {
    star(vw * 0.1, 24, 4, L);
    star(vw * 0.9, 110, 3, L);
    star(vw * 0.45, 100, 3, D);
    scribble(vw * 0.82, 40, 13, ds);
    stamp(vw * 0.14, 100, -0.1, ds);
  }
}

export function bgBuild(viewName) {
  if (viewName) currentView = viewName;
  if (!canvas) canvas = document.getElementById('bg');
  if (!canvas) return;
  if (!ctx) ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  const W = Math.ceil(window.innerWidth / PX);
  const H = Math.ceil(window.innerHeight / PX);
  const v = currentView;
  const k = H / 130;
  const vw = W / k;
  
  bgWidth = canvas.width = W;
  bgHeight = canvas.height = H;
  
  const intensity = v === 'shop' || v === 'product' ? 0.55 : v === 'about' ? 0.8 : 1.3;
  wall(W, H, intensity);
  
  ctx.save();
  ctx.scale(k, k);
  
  if (v === 'home') {
    stencil(vw);
    doodles(vw, v);
  } else if (v === 'shop' || v === 'product') {
    seams(vw);
    doodles(vw, v);
  } else {
    seams(vw);
    stencil(vw);
    doodles(vw, v);
  }
  
  ctx.restore();
  baseImageData = ctx.getImageData(0, 0, W, H);
  bgRender();
}

export function bgRender() {
  if (!ctx || !baseImageData) return;
  ctx.putImageData(baseImageData, 0, 0);
  
  if (lightX >= 0) {
    const gr = ctx.createRadialGradient(lightX, lightY, 1, lightX, lightY, bgHeight * 0.26);
    gr.addColorStop(0, gg(1, 0.42));
    gr.addColorStop(1, gg(1, 0));
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = gr;
    ctx.fillRect(0, 0, bgWidth, bgHeight);
    ctx.globalCompositeOperation = 'source-over';
  }
  
  const im = ctx.getImageData(0, 0, bgWidth, bgHeight);
  const d = im.data;
  
  for (let j = 0; j < bgHeight; j++) {
    for (let i = 0; i < bgWidth; i++) {
      const k = (j * bgWidth + i) * 4;
      const v = Math.max(0, Math.min(1, ((d[k] / 255) - 0.5) * 1.7 + 0.5));
      const on = v * 64 > B[(j & 7) * 8 + (i & 7)] + 0.5;
      d[k] = on ? 118 : 68;
      d[k + 1] = on ? 116 : 67;
      d[k + 2] = on ? 110 : 63;
      d[k + 3] = 255;
    }
  }
  ctx.putImageData(im, 0, 0);
}

export function initBackground() {
  canvas = document.getElementById('bg');
  if (!canvas) return;
  ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  bgBuild('home');
  
  window.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch' || !baseImageData || document.visibilityState === 'hidden') return;
    lightX = (e.clientX / window.innerWidth) * bgWidth;
    lightY = (e.clientY / window.innerHeight) * bgHeight;
    
    if (!bgRafId) {
      bgRafId = requestAnimationFrame(() => {
        bgRafId = 0;
        bgRender();
      });
    }
  }, { passive: true });
  
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (Math.abs(window.innerWidth - lastWidth) > 40) {
        lastWidth = window.innerWidth;
        bgBuild();
      }
    }, 250);
  });
}

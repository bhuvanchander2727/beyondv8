// Hero effects: 3D model cursor tilt, gyro, touch drag, scroll parallax, and wordmark auto-fit

export function initHero(container = document) {
  const hero = container.querySelector('.hero');
  const model = container.querySelector('.model');
  const herobg = container.querySelector('.herobg');
  const big = container.querySelector('.big');
  const tiltBtn = container.querySelector('.tiltbtn');
  
  // 1. Auto-fit giant wordmark so it never clips on any screen
  const fitWordmark = () => {
    if (!big || !big.parentElement) return;
    big.style.setProperty('--fit', '1');
    const w = big.getBoundingClientRect().width;
    const targetW = big.parentElement.clientWidth * 0.94;
    if (w > 0) {
      big.style.setProperty('--fit', Math.min(1, targetW / w).toFixed(3));
    }
  };
  
  fitWordmark();
  window.addEventListener('resize', fitWordmark);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitWordmark);
  }

  // Check reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Typography, navigation, buttons, and sticker remain visually stable (no cursor jitter)
  if (big) {
    big.style.setProperty('--px', '0');
    big.style.setProperty('--py', '0');
  }

  // 2. Parallax: Background moves very subtly, Model moves slightly more to create believable depth
  if ((!model && !herobg) || prefersReduced) return;

  let tx = 0, ty = 0;
  let cx = 0, cy = 0;
  let rafId = 0;
  let isGyroActive = false;
  
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));

  const applyParallax = (x, y) => {
    const mxVal = x.toFixed(3);
    const myVal = y.toFixed(3);
    if (hero) {
      hero.style.setProperty('--mx', mxVal);
      hero.style.setProperty('--my', myVal);
    }
    if (model) {
      model.style.setProperty('--mx', mxVal);
      model.style.setProperty('--my', myVal);
    }
    if (herobg) {
      herobg.style.setProperty('--mx', mxVal);
      herobg.style.setProperty('--my', myVal);
    }
  };

  const tick = () => {
    rafId = 0;
    if (document.visibilityState === 'hidden') return;
    // Restrained easing for smooth, luxurious cinematic movement
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    applyParallax(cx, cy);
    if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
      rafId = requestAnimationFrame(tick);
    }
  };

  const setPos = (x, y) => {
    tx = x;
    ty = y;
    if (!rafId && document.visibilityState !== 'hidden') {
      rafId = requestAnimationFrame(tick);
    }
  };

  // Pointer & Touch handlers
  window.addEventListener('pointermove', e => {
    if (isGyroActive) return;
    setPos((e.clientX / window.innerWidth - 0.5) * 2, (e.clientY / window.innerHeight - 0.5) * 2);
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    if (!isGyroActive) setPos(0, 0);
  });

  window.addEventListener('touchmove', e => {
    if (isGyroActive) return;
    const t = e.touches[0];
    if (t) {
      setPos((t.clientX / window.innerWidth - 0.5) * 2, (t.clientY / window.innerHeight - 0.5) * 2);
    }
  }, { passive: true });

  // Scroll parallax
  let scrollRaf = 0;
  window.addEventListener('scroll', () => {
    if (scrollRaf || document.visibilityState === 'hidden') return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = 0;
      const scVal = cl(window.scrollY / window.innerHeight, 0, 1).toFixed(3);
      if (hero) hero.style.setProperty('--sc', scVal);
      if (model) model.style.setProperty('--sc', scVal);
      if (herobg) herobg.style.setProperty('--sc', scVal);
    });
  }, { passive: true });

  // Mobile DeviceOrientation (Gyroscope)
  const onOrientation = e => {
    if (e.gamma == null || e.beta == null) return;
    isGyroActive = true;
    setPos(cl(e.gamma / 22, -1, 1), cl((e.beta - 50) / 22, -1, 1));
  };

  const DOE = window.DeviceOrientationEvent;
  if (DOE && typeof DOE.requestPermission === 'function') {
    if (tiltBtn && window.matchMedia('(pointer: coarse)').matches) {
      tiltBtn.hidden = false;
      tiltBtn.addEventListener('click', () => {
        DOE.requestPermission().then(res => {
          if (res === 'granted') {
            window.addEventListener('deviceorientation', onOrientation);
          }
          tiltBtn.hidden = true;
        }).catch(() => {
          tiltBtn.hidden = true;
        });
      });
    }
  } else if (DOE) {
    window.addEventListener('deviceorientation', onOrientation);
  }

  // Tab visibility: pause heavy animations
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && !rafId) {
      rafId = requestAnimationFrame(tick);
    }
  });
}

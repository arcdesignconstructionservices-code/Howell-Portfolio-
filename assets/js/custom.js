/* Additions on top of the iPortfolio template: footer year, contact form, animated hero background. */
document.querySelectorAll('#year').forEach(n => n.textContent = new Date().getFullYear());

/* Contact form: opens the visitor's email app addressed to Howell */
const CONTACT_EMAIL = 'howellsayson@gmail.com';
const form = document.getElementById('form');
if (form) form.addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(form);
  const body = `${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`;
  location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(f.get('subject'))}&body=${encodeURIComponent(body)}`;
});

/* Light / dark theme toggle (default dark, remembered) */
(function themeToggle() {
  const btn = document.getElementById('themeToggle'); if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

/* ---------- Hero: parallax, cursor glow, particles, counters, "More" chips ---------- */
(function heroInteractive() {
  const hero = document.getElementById('hero'); if (!hero) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // parallax + spotlight
  if (!reduce) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      hero.style.setProperty('--px', (x - .5).toFixed(3));
      hero.style.setProperty('--py', (y - .5).toFixed(3));
      hero.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      hero.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    hero.addEventListener('mouseleave', () => { hero.style.setProperty('--px', 0); hero.style.setProperty('--py', 0); });
  }

  // count-up numbers
  document.querySelectorAll('.hero-stats [data-to]').forEach(el => {
    const to = +el.dataset.to;
    if (reduce) { el.textContent = to; return; }
    const t0 = performance.now() + 1500, dur = 1400;
    (function tick(now) {
      const p = Math.min(Math.max((now - t0) / dur, 0), 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
  });

  // "More" chips toggle
  const more = document.getElementById('techMore'), extra = document.getElementById('techExtra');
  if (more && extra) {
    const toggle = () => {
      const open = extra.classList.toggle('open');
      more.setAttribute('aria-expanded', open);
      more.lastChild.textContent = open ? ' Less' : ' More';
    };
    more.addEventListener('click', toggle);
    more.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  }

  // floating particles
  const cv = hero.querySelector('.hero-fx'); if (!cv || reduce) return;
  const ctx = cv.getContext('2d'); let w, h, dots = [];
  function size() {
    const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height; cv.width = w * d; cv.height = h * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    dots = Array.from({ length: Math.min(50, Math.floor(w / 30)) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 2 + .6, v: Math.random() * .35 + .12, a: Math.random() * 6.28 }));
  }
  addEventListener('resize', size); size();
  (function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      d.y -= d.v; d.a += .02;
      if (d.y < -5) { d.y = h + 5; d.x = Math.random() * w; }
      ctx.fillStyle = 'rgba(80,190,245,' + (.25 + Math.sin(d.a) * .2) + ')';
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 7); ctx.fill();
    }
    requestAnimationFrame(frame);
  })();
})();

/* ---------- Hero portrait: remove the studio background in the browser (real cut-out) ---------- */
(function portraitCutout() {
  const hero = document.getElementById('hero');
  const img = hero && hero.querySelector('.hero-person');
  if (!img) return;

  function run() {
    const w = img.naturalWidth, h = img.naturalHeight;
    if (!w || !h) return;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    let data;
    try { data = ctx.getImageData(0, 0, w, h); } catch (e) { return; } // file:// -> keep CSS fallback
    const px = data.data;

    // background reference colour: average of the top corners
    let r = 0, g = 0, b = 0, n = 0;
    for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++) for (const ox of [0, w - 12]) {
      const i = ((y * w) + x + ox) * 4; r += px[i]; g += px[i + 1]; b += px[i + 2]; n++;
    }
    r /= n; g /= n; b /= n;
    const TOL = 40 * 40;
    const near = i => { const dr = px[i] - r, dg = px[i + 1] - g, db = px[i + 2] - b; return dr * dr + dg * dg + db * db < TOL; };

    // flood fill from the top, left and right edges only (never from the bottom: the white shirt lives there)
    const bg = new Uint8Array(w * h);
    const stack = [];
    const inside = (x, y) => y < h * 0.55 || x < w * 0.34 || x > w * 0.66; // never reach the white shirt
    const seed = (x, y) => { const p = y * w + x; if (!bg[p] && inside(x, y) && near(p * 4)) { bg[p] = 1; stack.push(p); } };
    for (let x = 0; x < w; x++) seed(x, 0);
    for (let y = 0; y < h; y++) { seed(0, y); seed(w - 1, y); }
    while (stack.length) {
      const p = stack.pop(), x = p % w, y = (p / w) | 0;
      if (x > 0) seed(x - 1, y);
      if (x < w - 1) seed(x + 1, y);
      if (y > 0) seed(x, y - 1);
      if (y < h - 1) seed(x, y + 1);
    }

    // alpha = foreground, eroded by 2px (kills the light halo), then softened
    let a = new Float32Array(w * h);
    for (let p = 0; p < a.length; p++) a[p] = bg[p] ? 0 : 1;
    const erode = () => {
      const o = a.slice();
      for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
        const p = y * w + x;
        if (a[p] && (!a[p - 1] || !a[p + 1] || !a[p - w] || !a[p + w])) o[p] = 0;
      }
      a = o;
    };
    erode(); erode();
    for (let pass = 0; pass < 2; pass++) {
      const o = new Float32Array(a.length);
      for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
        const p = y * w + x;
        o[p] = (a[p] * 4 + a[p - 1] + a[p + 1] + a[p - w] + a[p + w]) / 8;
      }
      a = o;
    }
    for (let p = 0; p < a.length; p++) px[p * 4 + 3] = Math.round(a[p] * 255);
    ctx.putImageData(data, 0, 0);

    c.toBlob(blob => {
      if (!blob) return;
      img.src = URL.createObjectURL(blob);
      hero.classList.add('cutout');
    }, 'image/png');
  }

  if (img.complete && img.naturalWidth) run(); else img.addEventListener('load', run, { once: true });
})();

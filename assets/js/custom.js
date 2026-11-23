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

/* Hero: animated background (template colors: #040b14 + #149ddd) */
(function heroBackground() {
  const cv = document.getElementById('heroCanvas'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, pts = [], orbs = [], mouse = { x: -999, y: -999 }, t = 0;

  function resize() {
    const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(90, Math.floor(w * h / 14000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45, r: Math.random() * 1.6 + .6 }));
    orbs = [
      { x: .2, y: .3, r: .35, c: '20,157,221', s: .0006, p: 0 },
      { x: .8, y: .7, r: .4, c: '14,100,150', s: .0008, p: 2 },
      { x: .6, y: .2, r: .25, c: '120,200,240', s: .0005, p: 4 }
    ];
  }
  const host = cv.parentElement;
  host.addEventListener('mousemove', e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  host.addEventListener('mouseleave', () => { mouse.x = mouse.y = -999; });
  addEventListener('resize', resize);
  resize();

  (function frame() {
    t++;
    ctx.fillStyle = '#040b14'; ctx.fillRect(0, 0, w, h);
    for (const o of orbs) {
      const x = (o.x + Math.sin(t * o.s * 6 + o.p) * .08) * w, y = (o.y + Math.cos(t * o.s * 5 + o.p) * .08) * h, r = o.r * Math.max(w, h);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${o.c},.32)`); g.addColorStop(1, `rgba(${o.c},0)`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      if (Math.hypot(p.x - mouse.x, p.y - mouse.y) < 160) { p.x += (p.x - mouse.x) * .01; p.y += (p.y - mouse.y) * .01; }
      ctx.fillStyle = 'rgba(200,235,255,.85)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 140) {
        const near = Math.hypot((pts[i].x + pts[j].x) / 2 - mouse.x, (pts[i].y + pts[j].y) / 2 - mouse.y) < 180;
        ctx.strokeStyle = `rgba(${near ? '255,255,255' : '20,157,221'},${(1 - d / 140) * (near ? .6 : .32)})`;
        ctx.lineWidth = near ? 1.1 : .7;
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
      }
    }
    if (!reduce) requestAnimationFrame(frame);
  })();
})();

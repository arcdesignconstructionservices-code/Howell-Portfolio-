// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Rotating headline words
const words = ['intelligent software', 'AI agents', 'smart automations', 'custom AI products'];
const typed = document.getElementById('typed');
let w = 0, c = 0, del = false;
(function tick() {
  const word = words[w];
  typed.textContent = word.slice(0, c);
  if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); }
  if (del && c === 0) { del = false; w = (w + 1) % words.length; }
  c += del ? -1 : 1;
  setTimeout(tick, del ? 35 : 70);
})();

// Scroll reveal + count-up
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  io.unobserve(e.target);
}), { threshold: .15 });
document.querySelectorAll('.card, .steps li, h2').forEach(el => { el.classList.add('reveal'); io.observe(el); });

document.querySelectorAll('[data-count]').forEach(el => {
  const target = +el.dataset.count; let n = 0;
  const step = setInterval(() => {
    n++; el.textContent = n + (target > 5 ? '+' : '');
    if (n >= target) clearInterval(step);
  }, 900 / target);
});

// Contact form (opens the visitor's email app — change the address below)
const CONTACT_EMAIL = 'hello@example.com';
document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = `${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`;
  location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Project inquiry')}&body=${encodeURIComponent(body)}`;
});

// Animated network background
const cv = document.getElementById('bg'), ctx = cv.getContext('2d');
let pts = [];
function resize() {
  cv.width = innerWidth; cv.height = innerHeight;
  pts = Array.from({ length: Math.min(70, Math.floor(innerWidth / 22)) }, () => ({
    x: Math.random() * cv.width, y: Math.random() * cv.height,
    vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35
  }));
}
addEventListener('resize', resize); resize();
(function draw() {
  ctx.clearRect(0, 0, cv.width, cv.height);
  for (const p of pts) {
    p.x = (p.x + p.vx + cv.width) % cv.width; p.y = (p.y + p.vy + cv.height) % cv.height;
    ctx.fillStyle = 'rgba(124,92,255,.7)'; ctx.fillRect(p.x, p.y, 2, 2);
  }
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
    if (d < 130) { ctx.strokeStyle = `rgba(34,211,238,${.14 * (1 - d / 130)})`; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
  }
  requestAnimationFrame(draw);
})();

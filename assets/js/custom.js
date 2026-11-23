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

/* About: typing code animation */
(function () {
  const out = document.getElementById('codeOut');
  if (!out) return;
  const file = document.getElementById('codeFile'), lang = document.getElementById('codeLang');
  const snippets = [
    { f: 'howell.ts', l: 'TypeScript', c:
`// who am I?
const howell = {
  name: "Howell S. Valeros",
  role: "AI Automation Developer",
  stack: ["TypeScript", "React", "SQL", "PostgreSQL"],
  location: "Pasig City, PH",
  available: true,
};

function build(idea: string) {
  const plan = ai.assist(idea);
  return deploy(plan);
}` },
    { f: 'pipeline.py', l: 'Python', c:
`# automate the boring stuff
import pandas as pd

def run_pipeline(source):
    df = pd.read_sql(source, conn)
    df = df.dropna().drop_duplicates()
    df["status"] = "ready"
    df.to_sql("reports", conn)
    return len(df)

print(run_pipeline("dispatch_data"))` },
    { f: 'query.sql', l: 'PostgreSQL', c:
`-- keep the data clean
SELECT p.name, COUNT(t.id) AS tasks
FROM platforms p
JOIN tasks t ON t.platform_id = p.id
WHERE t.status = 'done'
GROUP BY p.name
ORDER BY tasks DESC;` }
  ];
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const KW = /^(const|function|return|import|as|def|from|SELECT|FROM|JOIN|WHERE|GROUP BY|ORDER BY|ON|AS|DESC|COUNT|true)$/;
  const hl = s => s.replace(/(\/\/.*|#.*|--.*)|("[^"]*"?)|\b(GROUP BY|ORDER BY|\w+)\b(\()?|([\s\S])/g, (m, c, str, w, p, o) => {
    if (c) return '<span class="tk-c">' + esc(c) + '</span>';
    if (str) return '<span class="tk-s">' + esc(str) + '</span>';
    if (w) return (KW.test(w) ? '<span class="tk-k">' + w + '</span>' : p ? '<span class="tk-f">' + w + '</span>' : /^\d+$/.test(w) ? '<span class="tk-n">' + w + '</span>' : w) + (p || '');
    return esc(o);
  });
  let si = 0, i = 0;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function tick() {
    const s = snippets[si];
    if (i === 0) { file.textContent = s.f; lang.textContent = s.l; }
    if (reduce) i = s.c.length; else i += 2;
    out.innerHTML = hl(s.c.slice(0, i));
    if (i < s.c.length) return setTimeout(tick, 28);
    setTimeout(() => { i = 0; si = (si + 1) % snippets.length; out.innerHTML = ''; tick(); }, 2600);
  }
  tick();
})();

/* Stats + Skills: reveal, bar fill and % count-up */
(function () {
  const stats = document.getElementById('stats'), skills = document.getElementById('skills');
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; io.unobserve(el); el.classList.add('in');
    if (el.id === 'skills') el.querySelectorAll('.progress').forEach((p, i) => {
      const bar = p.querySelector('.progress-bar'), val = p.querySelector('.val');
      const to = +bar.getAttribute('aria-valuenow'), delay = i * 150;
      setTimeout(() => {
        bar.style.width = to + '%';
        const t0 = performance.now();
        (function step(t) {
          const k = Math.min((t - t0) / 1600, 1);
          val.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + '%';
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      }, delay);
    });
  }), { threshold: 0.25 });
  [stats, skills].forEach(s => s && io.observe(s));
})();

/* Resume: staggered reveal */
(function () {
  const r = document.getElementById('resume');
  if (!r) return;
  r.querySelectorAll('.resume-item').forEach((it, i) => {
    it.style.setProperty('--d', (i * 0.18) + 's');
    it.querySelectorAll('li').forEach((li, j) => li.style.setProperty('--li', (0.35 + j * 0.12) + 's'));
  });
  new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { r.classList.add('in'); o.disconnect(); } }), { threshold: 0.15 }).observe(r);
})();

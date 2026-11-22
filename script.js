/* ---------- Works: built at Torero Global Outsourcing Corp. ---------- */
const WORKS = [
  {
    type: 'platform', name: 'Driver Registry', short: 'Registry', mono: 'DR', kind: 'Data platform',
    colors: ['#0b2a6b', '#1d4ed8'],
    blurb: 'One trusted record per driver for every tool, synced daily and protected by safety checks.',
    points: [
      'IDs link drivers, never names, so records cannot be mixed up.',
      'Daily snapshots are applied, held or refused, and a partial pull never marks drivers as gone.',
      'Restricted to admins, with sensitive personal data deliberately excluded.'
    ],
    stack: ['TanStack Start', 'React', 'PostgreSQL', 'Docker', 'Railway']
  },
  {
    type: 'platform', name: 'Send Back Planner', short: 'Planner', mono: 'SB', kind: 'Dispatch command center',
    colors: ['#071230', '#2563eb'],
    blurb: 'Prepare, monitor and publish daily send-back plans so every returned package is accounted for.',
    points: [
      'Shift telemetry, risk monitoring and notifications in one view.',
      'Automatic refresh with shared daily state in its own Postgres database.',
      'Responsive, with a persistent dark mode.'
    ],
    stack: ['TanStack Start', 'React', 'Recharts', 'PostgreSQL', 'Zod']
  },
  {
    type: 'platform', name: 'Last Mile Library', short: 'Library', mono: 'LL', kind: 'Interactive SOP library',
    colors: ['#0a1a3f', '#3b82f6'],
    blurb: 'A digital library where every department is a book and every SOP is a volume you open.',
    points: [
      'Designed as an architectural library, not another file manager.',
      'Upload, add, edit and delete PDF and Word documents per department.',
      'Gateway sign-in, plus "Most viewed" and recently viewed shelves.'
    ],
    stack: ['TanStack Start', 'React', 'Supabase', 'Tailwind', 'SSO']
  },
  {
    type: 'platform', name: 'TGO Ticketing System', short: 'Tickets', mono: 'TK', kind: 'Ticketing · PWA',
    colors: ['#0b1f55', '#1e40af'],
    blurb: 'Internal support ticketing that installs on phones as an app.',
    points: [
      'Installable PWA, packaged as an Android app through a Trusted Web Activity.',
      'Single sign-on through the company gateway.',
      'PostgreSQL-backed with server functions for every action.'
    ],
    stack: ['TanStack Start', 'PWA', 'Android TWA', 'PostgreSQL', 'Nixpacks']
  },
  {
    type: 'platform', name: 'Dispatch Coach Central', short: 'Coaching', mono: 'DC', kind: 'Coaching management',
    colors: ['#02153b', '#1d4ed8'],
    blurb: 'A coaching hub that helps dispatch leads track performance and follow up with the right people.',
    points: [
      'Clear performance tiers: good, warning and critical.',
      'Gateway sign-in with per-tool access control.',
      'Light and dark themes built on the company palette.'
    ],
    stack: ['TanStack Start', 'React', 'Tailwind', 'PostgreSQL', 'SSO']
  },
  {
    type: 'platform', name: 'Workblocks', short: 'Workblocks', mono: 'WB', kind: 'Capacity reporting',
    colors: ['#0a2c63', '#60a5fa'],
    blurb: 'Turns a monthly plan export into a validated snapshot and the weekly capacity report.',
    points: [
      'Import, validate and save a snapshot of the plan.',
      'Week-over-week comparison to see what changed.',
      'Password-protected deletes and automatic table setup on first run.'
    ],
    stack: ['TanStack Start', 'React', 'PostgreSQL', 'Recharts', 'Railway']
  },
  {
    type: 'site', name: 'tgocorp.com', mono: 'TGO', kind: 'WordPress website',
    colors: ['#05070d', '#0b2a6b'], url: 'https://tgocorp.com/',
    blurb: 'The company website for Torero Global Outsourcing Corp.: who they are, what they do and how to reach them.',
    points: ['Designed and built on WordPress.', 'Public face of the company.'],
    stack: ['WordPress']
  },
  {
    type: 'site', name: 'lastmilesupport.com', mono: 'LMS', kind: 'WordPress website',
    colors: ['#05070d', '#1d4ed8'], url: 'https://lastmilesupport.com/',
    blurb: 'The brand website for Last Mile Support, and the home domain for its internal tools.',
    points: ['Designed and built on WordPress.', 'Domain shared with the single sign-on gateway and tools.'],
    stack: ['WordPress']
  }
];
const PLATFORMS = WORKS.filter(w => w.type === 'platform');

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  parent && parent.appendChild(n);
  return n;
};
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
$('#year').textContent = new Date().getFullYear();

/* ---------- Work cards + modal ---------- */
const cards = $('#cards'), modal = $('#modal');
WORKS.forEach((w, i) => {
  const b = document.createElement('button');
  b.className = 'work reveal';
  b.dataset.type = w.type;
  b.style.setProperty('--c1', w.colors[0]);
  b.style.setProperty('--c2', w.colors[1]);
  b.innerHTML = `
    <div class="cover"><span class="num">${String(i + 1).padStart(2, '0')}</span><span class="mono">${w.mono}</span></div>
    <div class="body">
      <span class="tag">${w.kind}</span>
      <h3>${w.name}</h3>
      <p>${w.blurb}</p>
      <span class="open">${w.url ? 'View details' : 'Open case'} <b>→</b></span>
    </div>`;
  b.addEventListener('click', () => openWork(w));
  cards.appendChild(b);
});

function openWork(w) {
  $('#mKind').textContent = w.kind;
  $('#mTitle').textContent = w.name;
  $('#mBlurb').textContent = w.blurb;
  $('#mPoints').innerHTML = w.points.map(p => `<li>${p}</li>`).join('');
  $('#mStack').innerHTML = w.stack.map(s => `<span>${s}</span>`).join('');
  const cover = $('#mCover');
  cover.style.setProperty('--c1', w.colors[0]);
  cover.style.setProperty('--c2', w.colors[1]);
  cover.innerHTML = `<span class="mono">${w.mono}</span>`;
  const link = $('#mLink');
  link.hidden = !w.url;
  if (w.url) link.href = w.url;
  modal.showModal();
}
$('#mClose').addEventListener('click', () => modal.close());
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

$('#filters').addEventListener('click', e => {
  const btn = e.target.closest('button'); if (!btn) return;
  document.querySelectorAll('#filters button').forEach(x => x.classList.toggle('on', x === btn));
  document.querySelectorAll('.work').forEach(c => c.classList.toggle('hide', btn.dataset.f !== 'all' && c.dataset.type !== btn.dataset.f));
});

/* ---------- Ecosystem map ---------- */
const svg = $('#map'), mapCard = $('#mapCard');
const CX = 450, CY = 260, RX = 330, RY = 175, nodes = [];
const linkLayer = svgEl('g', {}, svg);
const core = svgEl('g', { class: 'core' }, svg);
svgEl('circle', { class: 'ring', cx: CX, cy: CY, r: 60 }, core);
svgEl('circle', { cx: CX, cy: CY, r: 60 }, core);
svgEl('text', { x: CX, y: CY - 3 }, core).textContent = 'LMS';
svgEl('text', { x: CX, y: CY + 14 }, core).textContent = 'GATEWAY';

PLATFORMS.forEach((p, i) => {
  const a = (-90 + i * (360 / PLATFORMS.length)) * Math.PI / 180;
  const x = CX + RX * Math.cos(a), y = CY + RY * Math.sin(a);
  const link = svgEl('path', { class: 'link pulse', d: `M${CX},${CY} L${x},${y}` }, linkLayer);
  const g = svgEl('g', { class: 'node', tabindex: 0, role: 'button', 'aria-label': p.name }, svg);
  svgEl('circle', { cx: x, cy: y, r: 42 }, g);
  svgEl('text', { class: 'nn', x, y: y + 8 }, g).textContent = p.mono;
  svgEl('text', { x, y: y + (y > CY ? 70 : -56) }, g).textContent = p.short.toUpperCase();
  nodes.push({ g, link });
  const show = () => setNode(i);
  g.addEventListener('mouseenter', show);
  g.addEventListener('focus', show);
  g.addEventListener('click', show);
});

function setNode(i) {
  nodes.forEach((n, k) => n.g.classList.toggle('active', k === i));
  const p = PLATFORMS[i] || { name: 'LMS Gateway', kind: 'Single sign-on', blurb: 'One login for every tool. Each app checks your session and your access to that specific tool, and locks itself if the gateway is missing.' };
  mapCard.classList.remove('swap'); void mapCard.offsetWidth; mapCard.classList.add('swap');
  mapCard.innerHTML = `<span class="tag">${p.kind}</span><h3>${p.name}</h3><p>${p.blurb}</p>`;
}
setNode(-1);

/* ---------- Scroll effects ---------- */
const bar = $('#progress'), nav = $('#nav');
addEventListener('scroll', () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  nav.classList.toggle('scrolled', h.scrollTop > 30);
}, { passive: true });

let counted = false;
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  if (!counted && e.target.id === 'heroCard') { counted = true; countUp(); }
  io.unobserve(e.target);
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach((n, i) => { n.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(n); });

function countUp() {
  document.querySelectorAll('[data-count]').forEach(n => {
    const t = +n.dataset.count; let c = 0;
    const id = setInterval(() => { n.textContent = ++c; if (c >= t) clearInterval(id); }, 700 / t);
  });
}

/* ---------- Hero card tilt ---------- */
const heroCard = $('#heroCard');
if (!reduce && matchMedia('(pointer:fine)').matches) {
  heroCard.addEventListener('mousemove', e => {
    const r = heroCard.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    heroCard.style.transform = `perspective(900px) rotateY(${x * 9}deg) rotateX(${-y * 7}deg)`;
  });
  heroCard.addEventListener('mouseleave', () => heroCard.style.transform = '');
}

/* ---------- Contact form (opens the visitor's email app) ---------- */
const CONTACT_EMAIL = 'hello@example.com'; // <- put your real address here
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = `${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`;
  location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Project inquiry')}&body=${encodeURIComponent(body)}`;
});

/* ---------- Background: blue constellation ---------- */
const cv = $('#bg'), ctx = cv.getContext('2d');
let pts = [], mouse = { x: -999, y: -999 };
function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  pts = Array.from({ length: Math.min(60, Math.floor(innerWidth / 24)) }, () => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25
  }));
}
addEventListener('resize', resize);
addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
resize();
(function frame() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const p of pts) {
    p.x = (p.x + p.vx + innerWidth) % innerWidth;
    p.y = (p.y + p.vy + innerHeight) % innerHeight;
    if (Math.hypot(p.x - mouse.x, p.y - mouse.y) < 140) { p.x += (p.x - mouse.x) * .004; p.y += (p.y - mouse.y) * .004; }
    ctx.fillStyle = 'rgba(110,160,255,.6)';
    ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, 7); ctx.fill();
  }
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
    if (d < 130) {
      ctx.strokeStyle = `rgba(110,160,255,${(1 - d / 130) * .22})`;
      ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
    }
  }
  if (!reduce) requestAnimationFrame(frame);
})();

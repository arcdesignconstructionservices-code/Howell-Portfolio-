/* ---------- Data: the six platforms built at Torero Global Outsourcing Corp. ---------- */
const PROJECTS = [
  {
    name: 'Driver Registry', short: 'Registry', kind: 'Data platform',
    blurb: 'One trusted record per driver for every tool, synced daily and protected by safety checks.',
    points: [
      'IDs link drivers, never names, so records cannot be mixed up.',
      'Daily snapshots are applied, held or refused, and a partial pull never marks drivers as gone.',
      'Restricted to admins, with sensitive personal data deliberately excluded.'
    ],
    stack: ['TanStack Start', 'React', 'PostgreSQL', 'Docker', 'Railway']
  },
  {
    name: 'Send Back Planner', short: 'Planner', kind: 'Dispatch command center',
    blurb: 'Prepare, monitor and publish daily send-back plans so every returned package is accounted for.',
    points: [
      'Shift telemetry, risk monitoring and notifications in one view.',
      'Automatic refresh with shared daily state in its own Postgres database.',
      'Responsive, with a persistent dark mode.'
    ],
    stack: ['TanStack Start', 'React', 'Recharts', 'PostgreSQL', 'Zod']
  },
  {
    name: 'Last Mile Library', short: 'Library', kind: 'Interactive SOP library',
    blurb: 'A digital library where every department is a book and every SOP is a volume you open.',
    points: [
      'Designed as an architectural library, not another file manager.',
      'Upload, add, edit and delete PDF and Word documents per department.',
      'Gateway sign-in, usage-based "Most viewed" and recently viewed shelves.'
    ],
    stack: ['TanStack Start', 'React', 'Supabase', 'Tailwind', 'SSO']
  },
  {
    name: 'TGO Ticketing System', short: 'Tickets', kind: 'Ticketing · PWA',
    blurb: 'Internal support ticketing that installs on phones as an app.',
    points: [
      'Installable PWA, packaged as an Android app through a Trusted Web Activity.',
      'Single sign-on through the company gateway.',
      'PostgreSQL-backed with server functions for every action.'
    ],
    stack: ['TanStack Start', 'PWA', 'Android TWA', 'PostgreSQL', 'Nixpacks']
  },
  {
    name: 'Dispatch Coach Central', short: 'Coaching', kind: 'Coaching management',
    blurb: 'A coaching hub that helps dispatch leads track performance and follow up with the right people.',
    points: [
      'Clear performance tiers: good, warning and critical.',
      'Gateway sign-in with per-tool access control.',
      'Light and dark themes built on the company palette.'
    ],
    stack: ['TanStack Start', 'React', 'Tailwind', 'PostgreSQL', 'SSO']
  },
  {
    name: 'Workblocks', short: 'Workblocks', kind: 'Capacity reporting',
    blurb: 'Turns a monthly plan export into a validated snapshot and the weekly capacity report.',
    points: [
      'Import, validate and save a snapshot of the plan.',
      'Week-over-week comparison to see what changed.',
      'Password-protected deletes and automatic table setup on first run.'
    ],
    stack: ['TanStack Start', 'React', 'PostgreSQL', 'Recharts', 'Railway']
  }
];

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  parent && parent.appendChild(n);
  return n;
};
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

$('#year').textContent = new Date().getFullYear();

/* ---------- Theme ---------- */
const root = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved) root.dataset.theme = saved;
$('#theme').addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('theme', next);
  drawBg();
});

/* ---------- Work index ---------- */
const index = $('#index');
PROJECTS.forEach((p, i) => {
  const li = document.createElement('li');
  li.className = 'row reveal';
  const n = String(i + 1).padStart(2, '0');
  li.innerHTML = `
    <button class="row-head" aria-expanded="false">
      <span class="n">${n}</span>
      <h3>${p.name}</h3>
      <span class="kind">${p.kind}</span>
      <span class="plus" aria-hidden="true">+</span>
    </button>
    <div class="row-body"><div>
      <div class="detail">
        <span></span>
        <div><p>${p.blurb}</p><ul>${p.points.map(x => `<li>${x}</li>`).join('')}</ul></div>
        <div class="tags">${p.stack.map(s => `<span>${s}</span>`).join('')}</div>
      </div>
    </div></div>`;
  const btn = $('.row-head', li);
  btn.addEventListener('click', () => {
    const open = !li.classList.contains('open');
    index.querySelectorAll('.row.open').forEach(r => {
      r.classList.remove('open'); $('.row-head', r).setAttribute('aria-expanded', 'false');
    });
    if (open) { li.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
    setActiveNode(open ? i : -1);
  });
  index.appendChild(li);
});

/* ---------- Ecosystem map ---------- */
const svg = $('#map');
const card = $('#mapCard');
const CX = 450, CY = 260, RX = 330, RY = 175;
const nodes = [];

const defs = el('defs', {}, svg);
// links first so nodes sit on top
const linkLayer = el('g', {}, svg);
const core = el('g', { class: 'core' }, svg);
el('circle', { class: 'ring', cx: CX, cy: CY, r: 60 }, core);
el('circle', { cx: CX, cy: CY, r: 60 }, core);
el('text', { x: CX, y: CY - 3 }, core).textContent = 'LMS';
el('text', { x: CX, y: CY + 15 }, core).textContent = 'GATEWAY';

PROJECTS.forEach((p, i) => {
  const a = (-90 + i * (360 / PROJECTS.length)) * Math.PI / 180;
  const x = CX + RX * Math.cos(a), y = CY + RY * Math.sin(a);
  const link = el('path', { class: 'link', d: `M${CX},${CY} L${x},${y}` }, linkLayer);
  const g = el('g', { class: 'node', tabindex: 0, role: 'button', 'aria-label': p.name }, svg);
  el('circle', { cx: x, cy: y, r: 42 }, g);
  el('text', { class: 'num', x, y: y + 7 }, g).textContent = ['i', 'ii', 'iii', 'iv', 'v', 'vi'][i];
  el('text', { x, y: y + (y > CY ? 70 : -56) }, g).textContent = p.short.toUpperCase();
  nodes.push({ g, link });
  const show = () => setActiveNode(i, true);
  g.addEventListener('mouseenter', show);
  g.addEventListener('focus', show);
  g.addEventListener('click', show);
});

function setActiveNode(i, fromMap) {
  nodes.forEach((n, k) => {
    n.g.classList.toggle('active', k === i);
    n.link.classList.toggle('pulse', k === i);
  });
  const p = PROJECTS[i] || { name: 'LMS Gateway', kind: 'Single sign-on', blurb: 'One login for every tool. Each app checks your session and your access to that specific tool, and locks itself if the gateway is missing.' };
  card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap');
  card.innerHTML = `<span class="k">${p.kind}</span><h3>${p.name}</h3><p>${p.blurb}</p>`;
}
setActiveNode(-1);
nodes.forEach(n => n.link.classList.add('pulse'));

/* ---------- Scroll: progress, nav shadow, reveal, count-up ---------- */
const bar = $('#progress'), nav = $('#nav');
addEventListener('scroll', () => {
  const h = document.documentElement;
  bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  nav.classList.toggle('scrolled', h.scrollTop > 30);
}, { passive: true });

const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  if (e.target.matches('.numbers')) countUp();
  io.unobserve(e.target);
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach((n, i) => {
  n.style.transitionDelay = (i % 4) * 70 + 'ms';
  io.observe(n);
});

function countUp() {
  document.querySelectorAll('[data-count]').forEach(n => {
    const t = +n.dataset.count; let c = 0;
    const id = setInterval(() => { n.textContent = ++c; if (c >= t) clearInterval(id); }, 700 / t);
  });
}

/* ---------- Portrait tilt + magnetic buttons ---------- */
const portrait = $('#portrait'), arch = $('.arch');
if (!reduce && matchMedia('(pointer:fine)').matches) {
  portrait.addEventListener('mousemove', e => {
    const r = portrait.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    arch.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
  });
  portrait.addEventListener('mouseleave', () => arch.style.transform = '');
  document.querySelectorAll('.magnetic').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .22}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`;
    });
    b.addEventListener('mouseleave', () => b.style.transform = '');
  });
}

/* ---------- Contact form (opens the visitor's email app) ---------- */
const CONTACT_EMAIL = 'hello@example.com'; // <- put your real address here
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = `${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`;
  location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Project inquiry')}&body=${encodeURIComponent(body)}`;
});

/* ---------- Background: soft drifting constellation in the palette ---------- */
const cv = $('#bg'), ctx = cv.getContext('2d');
let pts = [], mouse = { x: -999, y: -999 }, ink = '185,165,149';
function drawBg() { ink = root.dataset.theme === 'dark' ? '185,165,149' : '138,117,101'; }
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
resize(); drawBg();
(function frame() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const p of pts) {
    p.x = (p.x + p.vx + innerWidth) % innerWidth;
    p.y = (p.y + p.vy + innerHeight) % innerHeight;
    const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
    if (dm < 140) { p.x += (p.x - mouse.x) * .004; p.y += (p.y - mouse.y) * .004; }
    ctx.fillStyle = `rgba(${ink},.55)`;
    ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, 7); ctx.fill();
  }
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
    if (d < 130) {
      ctx.strokeStyle = `rgba(${ink},${(1 - d / 130) * .22})`;
      ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
    }
  }
  if (!reduce) requestAnimationFrame(frame);
})();

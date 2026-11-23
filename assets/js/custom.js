/* ---------- Works: built at Torero Global Outsourcing Corp. ---------- */
const WORKS = [
  { type: 'platform', name: 'Driver Registry', short: 'Registry', mono: 'DR', kind: 'Data platform', colors: ['#0b2a6b', '#1d4ed8'],
    blurb: 'One trusted record per driver for every tool, synced daily and protected by safety checks.',
    points: ['IDs link drivers, never names, so records cannot be mixed up.', 'Daily snapshots are applied, held or refused, and a partial pull never marks drivers as gone.', 'Restricted to admins, with sensitive personal data deliberately excluded.'],
    stack: ['TanStack Start', 'React', 'PostgreSQL', 'Docker', 'Railway'] },
  { type: 'platform', name: 'Send Back Planner', short: 'Planner', mono: 'SB', kind: 'Dispatch command center', colors: ['#071230', '#2563eb'],
    blurb: 'Prepare, monitor and publish daily send-back plans so every returned package is accounted for.',
    points: ['Shift telemetry, risk monitoring and notifications in one view.', 'Automatic refresh with shared daily state in its own Postgres database.', 'Responsive, with a persistent dark mode.'],
    stack: ['TanStack Start', 'React', 'Recharts', 'PostgreSQL', 'Zod'] },
  { type: 'platform', name: 'Last Mile Library', short: 'Library', mono: 'LL', kind: 'Interactive SOP library', colors: ['#0a1a3f', '#3b82f6'],
    blurb: 'A digital library where every department is a book and every SOP is a volume you open.',
    points: ['Designed as an architectural library, not another file manager.', 'Upload, add, edit and delete PDF and Word documents per department.', 'Gateway sign-in, plus "Most viewed" and recently viewed shelves.'],
    stack: ['TanStack Start', 'React', 'Supabase', 'Tailwind', 'SSO'] },
  { type: 'platform', name: 'TGO Ticketing System', short: 'Tickets', mono: 'TK', kind: 'Ticketing · PWA', colors: ['#0b1f55', '#1e40af'],
    blurb: 'Internal support ticketing that installs on phones as an app.',
    points: ['Installable PWA, packaged as an Android app through a Trusted Web Activity.', 'Single sign-on through the company gateway.', 'PostgreSQL-backed with server functions for every action.'],
    stack: ['TanStack Start', 'PWA', 'Android TWA', 'PostgreSQL', 'Nixpacks'] },
  { type: 'platform', name: 'Dispatch Coach Central', short: 'Coaching', mono: 'DC', kind: 'Coaching management', colors: ['#02153b', '#1d4ed8'],
    blurb: 'A coaching hub that helps dispatch leads track performance and follow up with the right people.',
    points: ['Clear performance tiers: good, warning and critical.', 'Gateway sign-in with per-tool access control.', 'Light and dark themes built on the company palette.'],
    stack: ['TanStack Start', 'React', 'Tailwind', 'PostgreSQL', 'SSO'] },
  { type: 'platform', name: 'Workblocks', short: 'Workblocks', mono: 'WB', kind: 'Capacity reporting', colors: ['#0a2c63', '#60a5fa'],
    blurb: 'Turns a monthly plan export into a validated snapshot and the weekly capacity report.',
    points: ['Import, validate and save a snapshot of the plan.', 'Week-over-week comparison to see what changed.', 'Password-protected deletes and automatic table setup on first run.'],
    stack: ['TanStack Start', 'React', 'PostgreSQL', 'Recharts', 'Railway'] },
  { type: 'site', name: 'tgocorp.com', mono: 'TGO', kind: 'WordPress website', colors: ['#02040b', '#0b2a6b'], url: 'https://tgocorp.com/',
    blurb: 'The company website for Torero Global Outsourcing Corp.: who they are, what they do and how to reach them.',
    points: ['Designed and built on WordPress.', 'Public face of the company.'], stack: ['WordPress'] },
  { type: 'site', name: 'lastmilesupport.com', mono: 'LMS', kind: 'WordPress website', colors: ['#02040b', '#1d4ed8'], url: 'https://lastmilesupport.com/',
    blurb: 'The brand website for Last Mile Support, and the home domain for its internal tools.',
    points: ['Designed and built on WordPress.', 'Domain shared with the single sign-on gateway and tools.'], stack: ['WordPress'] }
];
const PLATFORMS = WORKS.filter(w => w.type === 'platform');

const $ = (s, r = document) => r.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
$('#year').textContent = new Date().getFullYear();

/* ---------- Cards + modal ---------- */
const cards = $('#cards');
WORKS.forEach((w, i) => {
  const col = document.createElement('div');
  col.className = `col-lg-4 col-md-6 isotope-item filter-${w.type}`;
  col.innerHTML = `
    <button class="work-card" style="--c1:${w.colors[0]};--c2:${w.colors[1]}" aria-label="Open ${w.name}">
      <div class="cover"><span class="num">${String(i + 1).padStart(2, '0')}</span><span class="mono">${w.mono}</span></div>
      <div class="body">
        <span class="tag">${w.kind}</span>
        <h4>${w.name}</h4>
        <p>${w.blurb}</p>
        <span class="open">${w.url ? 'View details' : 'Open case'} <i class="bi bi-arrow-right"></i></span>
      </div>
    </button>`;
  col.querySelector('button').addEventListener('click', () => openWork(w));
  cards.appendChild(col);
});

let modalInstance;
function openWork(w) {
  $('#mKind').textContent = w.kind;
  $('#mTitle').textContent = w.name;
  $('#mBlurb').textContent = w.blurb;
  $('#mPoints').innerHTML = w.points.map(p => `<li>${p}</li>`).join('');
  $('#mStack').innerHTML = w.stack.map(s => `<span>${s}</span>`).join('');
  const cover = $('#mCover');
  cover.style.setProperty('--c1', w.colors[0]);
  cover.style.setProperty('--c2', w.colors[1]);
  cover.innerHTML = `<span class="mono" style="color:#fff;position:relative;font-size:3rem;font-weight:800">${w.mono}</span>`;
  const link = $('#mLink');
  link.hidden = !w.url;
  if (w.url) link.href = w.url;
  modalInstance = modalInstance || new bootstrap.Modal($('#workModal'));
  modalInstance.show();
}

/* ---------- Ecosystem map ---------- */
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}, parent) => {
  const n = document.createElementNS(NS, tag);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  parent && parent.appendChild(n);
  return n;
};
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
  svgEl('path', { class: 'link pulse', d: `M${CX},${CY} L${x},${y}` }, linkLayer);
  const g = svgEl('g', { class: 'node', tabindex: 0, role: 'button', 'aria-label': p.name }, svg);
  svgEl('circle', { cx: x, cy: y, r: 42 }, g);
  svgEl('text', { class: 'nn', x, y: y + 8 }, g).textContent = p.mono;
  svgEl('text', { x, y: y + (y > CY ? 70 : -56) }, g).textContent = p.short.toUpperCase();
  nodes.push(g);
  const show = () => setNode(i);
  g.addEventListener('mouseenter', show);
  g.addEventListener('focus', show);
  g.addEventListener('click', show);
});
function setNode(i) {
  nodes.forEach((g, k) => g.classList.toggle('active', k === i));
  const p = PLATFORMS[i] || { name: 'LMS Gateway', kind: 'Single sign-on', blurb: 'One login for every tool. Each app checks your session and your access to that specific tool, and locks itself if the gateway is missing.' };
  mapCard.classList.remove('swap'); void mapCard.offsetWidth; mapCard.classList.add('swap');
  mapCard.innerHTML = `<span class="tag" style="background:rgba(110,160,255,.14);color:#6ea0ff;border-color:rgba(110,160,255,.3)">${p.kind}</span><h3>${p.name}</h3><p>${p.blurb}</p>`;
}
setNode(-1);

/* ---------- Contact form (opens the visitor's email app) ---------- */
const CONTACT_EMAIL = 'hello@example.com'; // <- put your real address here
$('#form').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const body = `${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`;
  location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(f.get('subject'))}&body=${encodeURIComponent(body)}`;
});

/* ---------- Hero: animated background (flowing blue network + glow orbs) ---------- */
(function heroBackground() {
  const cv = $('#heroCanvas'); if (!cv) return;
  const ctx = cv.getContext('2d');
  let w, h, pts = [], orbs = [], mouse = { x: -999, y: -999 }, t = 0;

  function resize() {
    const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(90, Math.floor(w * h / 14000));
    pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45, r: Math.random() * 1.6 + .6 }));
    orbs = [
      { x: .2, y: .3, r: .35, c: '29,78,216', s: .0006, p: 0 },
      { x: .8, y: .7, r: .4, c: '11,42,107', s: .0008, p: 2 },
      { x: .6, y: .2, r: .25, c: '110,160,255', s: .0005, p: 4 }
    ];
  }
  cv.parentElement.addEventListener('mousemove', e => {
    const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  cv.parentElement.addEventListener('mouseleave', () => { mouse.x = mouse.y = -999; });
  addEventListener('resize', resize);
  resize();

  function frame() {
    t++;
    ctx.clearRect(0, 0, w, h);
    // drifting glow orbs
    for (const o of orbs) {
      const x = (o.x + Math.sin(t * o.s * 6 + o.p) * .08) * w, y = (o.y + Math.cos(t * o.s * 5 + o.p) * .08) * h, r = o.r * Math.max(w, h);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${o.c},.35)`); g.addColorStop(1, `rgba(${o.c},0)`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }
    // particles
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      if (dm < 160) { p.x += (p.x - mouse.x) * .01; p.y += (p.y - mouse.y) * .01; }
      ctx.fillStyle = 'rgba(190,215,255,.85)';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
    }
    // links (brighter near the cursor)
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < 140) {
        const near = Math.hypot((pts[i].x + pts[j].x) / 2 - mouse.x, (pts[i].y + pts[j].y) / 2 - mouse.y) < 180;
        ctx.strokeStyle = `rgba(${near ? '255,255,255' : '110,160,255'},${(1 - d / 140) * (near ? .6 : .3)})`;
        ctx.lineWidth = near ? 1.1 : .7;
        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
      }
    }
    if (!reduce) requestAnimationFrame(frame);
  }
  frame();
})();

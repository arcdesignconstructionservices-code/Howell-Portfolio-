/* Fills portfolio-details.html from the WORKS list, using ?w=<slug> */
(function () {
  const slug = new URLSearchParams(location.search).get('w');
  const idx = Math.max(0, WORKS.findIndex(x => x.slug === slug));
  const w = WORKS[idx];
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  document.title = w.name + ' — Howell Valeros';
  $('#dHead').textContent = w.name; $('#dHeadKind').textContent = w.kind; $('#dCrumb').textContent = w.name;
  $('#dKind').textContent = w.type === 'client' ? 'Client work' : w.type === 'site' ? 'Website' : 'Platform';
  $('#dTag').innerHTML = '<i class="bi ' + (w.type === 'client' ? 'bi-briefcase' : w.type === 'site' ? 'bi-globe2' : 'bi-layers') + '"></i> ' + esc(w.kind);
  $('#dStatus').innerHTML = /in progress|in development/i.test(w.kind + ' ' + w.points.join(' ')) ? '<span class="pd-live"><i></i> In progress</span>' : '<span class="pd-live on"><i></i> Live</span>';
  $('#dStack').innerHTML = w.stack.map(s => '<span>' + esc(s) + '</span>').join('');
  $('#dTitle').textContent = w.name;
  $('#dBlurb').textContent = w.blurb;
  $('#dPoints').innerHTML = w.points.map(p => '<li><i class="bi bi-check2-circle"></i><span>' + esc(p) + '</span></li>').join('');
  if (w.url) { const u = $('#dUrl'); u.hidden = false; u.href = w.url; }

  // media: single image, or auto-rotating gallery with thumbnails
  const ext = w.type === 'client' ? '.jpg' : '.svg';
  const srcs = (w.imgs || [w.slug]).map(n => 'assets/img/portfolio/' + n + ext);
  const img = $('#dImg'); img.alt = w.name; img.src = srcs[0];
  if (w.type === 'client' && !w.imgs) $('#dMedia').classList.add('photo');
  if (w.imgs) $('#dMedia').classList.add('shot');
  if (srcs.length > 1) {
    const th = $('#dThumbs'); th.hidden = false; let i = 0, paused = false;
    srcs.forEach((s, k) => { const b = document.createElement('button'); b.type = 'button'; b.innerHTML = '<img src="' + s + '" alt="">'; b.onclick = () => go(k); th.appendChild(b); });
    const go = k => { i = k; img.style.opacity = 0; setTimeout(() => { img.src = srcs[i]; img.style.opacity = 1; }, 220); [...th.children].forEach((b, j) => b.classList.toggle('on', j === i)); };
    go(0);
    $('#dMedia').addEventListener('mouseenter', () => paused = true); $('#dMedia').addEventListener('mouseleave', () => paused = false);
    setInterval(() => { if (!paused && !document.hidden) go((i + 1) % srcs.length); }, 3500);
  }

  // previous / next project
  const p = WORKS[(idx + WORKS.length - 1) % WORKS.length], n = WORKS[(idx + 1) % WORKS.length];
  const card = (x, dir) => '<a class="pd-nav-' + dir + '" href="portfolio-details.html?w=' + x.slug + '"><small>' + (dir === 'prev' ? '<i class="bi bi-arrow-left"></i> Previous' : 'Next <i class="bi bi-arrow-right"></i>') + '</small><b>' + esc(x.name) + '</b><span>' + esc(x.kind) + '</span></a>';
  $('#dNav').innerHTML = card(p, 'prev') + card(n, 'next');

  document.querySelectorAll('#year').forEach(e => e.textContent = new Date().getFullYear());
})();

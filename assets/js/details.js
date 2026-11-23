/* Fills portfolio-details.html from the WORKS list, using ?w=<slug> */
(function () {
  const slug = new URLSearchParams(location.search).get('w');
  const w = WORKS.find(x => x.slug === slug) || WORKS[0];
  const $ = s => document.querySelector(s);
  document.title = w.name + ' — Howell Valeros';
  $('#dImg').src = 'assets/img/portfolio/' + w.slug + (w.type === 'client' ? '.jpg' : '.svg');
  $('#dImg').alt = w.name;
  if (w.imgs && w.imgs.length > 1) {
    const box = $('#dImg').parentElement, dots = document.createElement('div');
    dots.className = 'd-dots'; box.style.position = 'relative'; box.appendChild(dots);
    const srcs = w.imgs.map(n => 'assets/img/portfolio/' + n + '.jpg'); let i = 0;
    srcs.forEach((s, k) => { const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Image ' + (k + 1)); b.onclick = () => { go(k); }; dots.appendChild(b); new Image().src = s; });
    function go(k) { i = k; const im = $('#dImg'); im.style.opacity = 0; setTimeout(() => { im.src = srcs[i]; im.style.opacity = 1; }, 250); [...dots.children].forEach((b, j) => b.classList.toggle('on', j === i)); }
    $('#dImg').style.transition = 'opacity .35s'; go(0);
    setInterval(() => go((i + 1) % srcs.length), 3500);
  }
  $('#dKind').textContent = w.kind;
  $('#dStack').textContent = w.stack.join(', ');
  $('#dTitle').textContent = w.name;
  $('#dBlurb').textContent = w.blurb;
  $('#dPoints').innerHTML = w.points.map(p => '<li>' + p + '</li>').join('');
  if (w.url) {
    $('#dUrlRow').hidden = false;
    $('#dUrl').href = w.url;
    $('#dUrl').textContent = w.url.replace(/^https?:\/\//, '');
  }
  document.querySelectorAll('#year').forEach(n => n.textContent = new Date().getFullYear());
})();

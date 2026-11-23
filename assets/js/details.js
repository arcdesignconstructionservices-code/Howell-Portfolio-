/* Fills portfolio-details.html from the WORKS list, using ?w=<slug> */
(function () {
  const slug = new URLSearchParams(location.search).get('w');
  const w = WORKS.find(x => x.slug === slug) || WORKS[0];
  const $ = s => document.querySelector(s);
  document.title = w.name + ' — Howell Valeros';
  $('#dImg').src = 'assets/img/portfolio/' + w.slug + '.svg';
  $('#dImg').alt = w.name;
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

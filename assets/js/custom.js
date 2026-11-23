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

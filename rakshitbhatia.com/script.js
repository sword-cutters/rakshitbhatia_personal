const glow = document.querySelector('.cursor-glow');
if (glow) {
  window.addEventListener('pointermove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('#site-nav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  siteNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && siteNav.classList.contains('open')) {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
      navToggle.focus();
    }
  });
}
const observer = new IntersectionObserver(entries => entries.forEach((entry, i) => { if (entry.isIntersecting) { setTimeout(() => entry.target.classList.add('in-view'), i * 55); observer.unobserve(entry.target); } }), { threshold: 0, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
const nav = document.querySelector('.nav');
const progress = document.querySelector('.scroll-progress');
const heroArt = document.querySelector('.hero-art');
window.addEventListener('scroll', () => { const max = document.documentElement.scrollHeight - innerHeight; progress.style.width = `${(scrollY / max) * 100}%`; nav.classList.toggle('scrolled', scrollY > 16); }, { passive: true });
document.querySelector('.hero').addEventListener('pointermove', e => { const x = (e.clientX / innerWidth - .5) * 12; const y = (e.clientY / innerHeight - .5) * 12; heroArt.style.transform = `translate(${x}px, calc(-43% + ${y}px))`; });
window.addEventListener('load', () => setTimeout(() => document.querySelector('.loader').classList.add('done'), 550));
document.querySelectorAll('.track-button').forEach(button => button.addEventListener('click', () => { const track = button.dataset.track; document.querySelectorAll('.track-button').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-selected', item === button); }); document.querySelectorAll('.track-copy').forEach(panel => panel.classList.toggle('active', panel.dataset.panel === track)); }));

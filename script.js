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
function animateLensPanel(panel) {
  if (!panel) return;
  panel.querySelectorAll('.lens-count[data-count]').forEach(el => {
    const end = +el.dataset.count, prefix = el.dataset.prefix || '', suffix = el.dataset.suffix || '', start = performance.now();
    const run = now => {
      const p = Math.min((now - start) / 1100, 1);
      el.textContent = prefix + Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  });
  panel.querySelectorAll('.lens-metric').forEach(metric => {
    metric.classList.remove('in-view');
    void metric.offsetWidth;
    metric.classList.add('in-view');
  });
}
document.querySelectorAll('.track-button').forEach(button => button.addEventListener('click', () => { const track = button.dataset.track; document.querySelectorAll('.track-button').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-selected', item === button); }); document.querySelectorAll('.track-copy').forEach(panel => panel.classList.toggle('active', panel.dataset.panel === track)); animateLensPanel(document.querySelector('.track-copy.active')); }));
const trackStage = document.querySelector('.track-stage');
if (trackStage) {
  const lensObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { animateLensPanel(document.querySelector('.track-copy.active')); lensObserver.unobserve(entry.target); }
  }), { threshold: .4 });
  lensObserver.observe(trackStage);
}

const recSlider = document.querySelector('.rec-slider');
if (recSlider) {
  const recSlides = [...recSlider.querySelectorAll('.rec-slide')];
  const recDotsBox = recSlider.querySelector('.rec-dots');
  recSlides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'rec-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to recommendation ${i + 1}`);
    dot.addEventListener('click', () => showRec(i));
    recDotsBox.appendChild(dot);
  });
  const recDots = [...recDotsBox.children];
  let recIndex = 0;
  function showRec(i) {
    recIndex = (i + recSlides.length) % recSlides.length;
    recSlides.forEach((slide, idx) => slide.classList.toggle('active', idx === recIndex));
    recDots.forEach((dot, idx) => dot.classList.toggle('active', idx === recIndex));
  }
  recSlider.querySelector('.rec-prev').addEventListener('click', () => showRec(recIndex - 1));
  recSlider.querySelector('.rec-next').addEventListener('click', () => showRec(recIndex + 1));
  recSlider.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') showRec(recIndex - 1);
    if (e.key === 'ArrowRight') showRec(recIndex + 1);
  });
  let recTimer = setInterval(() => showRec(recIndex + 1), 6500);
  recSlider.addEventListener('pointerenter', () => clearInterval(recTimer));
  recSlider.addEventListener('pointerleave', () => { recTimer = setInterval(() => showRec(recIndex + 1), 6500); });
}

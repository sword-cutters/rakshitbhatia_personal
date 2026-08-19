(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const robot = document.querySelector('.robot-buddy');
  if (!robot || reduce) return;

  const eyes = robot.querySelectorAll('.robot-eye i');
  const speech = robot.querySelector('.robot-speech');
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const HOVER_LINES = [
    'Hey, nice to meet you 👋',
    'Catch me if you can 😄',
    "You've got great taste in cursors.",
    'Systems nominal. Also, hi.',
    'Rakshit built me — pretty neat, right?',
    'Running on curiosity and caffeine ☕',
    "I'm fast, but he's faster at shipping code."
  ];
  let lastLine = -1;
  function say(text, duration = 2600) {
    if (!speech) return;
    speech.textContent = text;
    speech.style.setProperty('--bx', '0px');
    const rect = speech.getBoundingClientRect();
    const margin = 10;
    let shift = 0;
    if (rect.left < margin) shift = margin - rect.left;
    else if (rect.right > innerWidth - margin) shift = (innerWidth - margin) - rect.right;
    speech.style.setProperty('--bx', shift + 'px');
    speech.classList.add('show');
    clearTimeout(say.timer);
    say.timer = setTimeout(() => speech.classList.remove('show'), duration);
  }
  function sayRandomHoverLine() {
    let i = Math.floor(Math.random() * HOVER_LINES.length);
    if (HOVER_LINES.length > 1 && i === lastLine) i = (i + 1) % HOVER_LINES.length;
    lastLine = i;
    say(HOVER_LINES[i]);
  }

  const bounds = () => ({
    left: 16,
    right: innerWidth - robot.offsetWidth - 16,
    top: 100,
    bottom: innerHeight - robot.offsetHeight - 60
  });

  function perimeterPoint(d, b) {
    const w = Math.max(0, b.right - b.left);
    const h = Math.max(0, b.bottom - b.top);
    const L = 2 * w + 2 * h || 1;
    d = ((d % L) + L) % L;
    if (d < w) return { x: b.left + d, y: b.top, dir: 'right' };
    d -= w;
    if (d < h) return { x: b.right, y: b.top + d, dir: 'down' };
    d -= h;
    if (d < w) return { x: b.right - d, y: b.bottom, dir: 'left' };
    d -= w;
    return { x: b.left, y: b.bottom - d, dir: 'up' };
  }

  const TANGENTS = { right: { x: 1, y: 0 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, up: { x: 0, y: -1 } };
  const state = { d: Math.random() * (2 * innerWidth + 2 * innerHeight), dir: 1, travel: 'right' };
  robot.style.bottom = 'auto';
  robot.classList.add('walking');

  const SPEED = 110;
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(64, now - last) / 1000;
    last = now;
    state.d += SPEED * dt * state.dir;
    const b = bounds();
    const p = perimeterPoint(state.d, b);
    robot.style.left = p.x + 'px';
    robot.style.top = p.y + 'px';
    state.travel = p.dir;
    if (p.dir === 'right') robot.classList.remove('facing-left');
    if (p.dir === 'left') robot.classList.add('facing-left');
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  let lastScrollY = scrollY;
  addEventListener('scroll', () => {
    const dy = Math.abs(scrollY - lastScrollY);
    lastScrollY = scrollY;
    state.d += Math.min(40, dy * 0.15);
  }, { passive: true });

  let jumpTimer, reverseTimer, talkCooldown = false;
  addEventListener('pointermove', e => {
    const r = robot.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = clamp((e.clientX - cx) / 40, -3, 3);
    const dy = clamp((e.clientY - cy) / 40, -3, 3);
    eyes.forEach(eye => { eye.style.transform = `translate(${dx}px, ${dy}px)`; });

    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    if (dist < 75) {
      const tangent = TANGENTS[state.travel];
      const dot = (cx - e.clientX) * tangent.x + (cy - e.clientY) * tangent.y;
      state.dir = dot < 0 ? -1 : 1;
      clearTimeout(reverseTimer);
      reverseTimer = setTimeout(() => { state.dir = 1; }, 1100);
      if (!robot.classList.contains('jump')) {
        robot.classList.add('jump');
        clearTimeout(jumpTimer);
        jumpTimer = setTimeout(() => robot.classList.remove('jump'), 450);
      }
      if (!talkCooldown) {
        talkCooldown = true;
        sayRandomHoverLine();
        setTimeout(() => { talkCooldown = false; }, 3400);
      }
    }
  });

  if (speech) {
    addEventListener('load', () => {
      setTimeout(() => say('Hello! 👋', 3200), 1300);
    });
  }
})();

/* SkillUP shared motion layer: scroll reveals, hover lift, count-up numbers,
   filling bars, header shadow and answer celebrations. Safe to load on any page. */
(() => {
  const d = document;
  const root = d.documentElement;
  const script = d.currentScript;
  const base = script ? script.src.replace(/js\/skillup-motion\.js.*$/, '') : '';

  if (!d.querySelector('link[href*="skillup-motion.css"]')) {
    const link = d.createElement('link');
    link.rel = 'stylesheet';
    link.href = base + 'css/skillup-motion.css';
    d.head.appendChild(link);
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) return;
  root.classList.add('su-motion');

  const SKIP = 'header, nav, footer, dialog, form, [data-no-motion], .reveal, [data-aos]';
  const COUNT_TEXT = /^(\d{1,3}(?:,\d{3})*|\d+)(\+|%)?$/;
  const COUNT_CLASS = /(num|stat|count|value|metric|big)/i;
  const BAR_CLASS = /(bar|fill|progress|meter)/i;
  const watchedGrids = new WeakSet();

  const revealObserver = new IntersectionObserver((entries) => {
    let i = 0;
    entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
      .forEach((e) => {
        const el = e.target;
        revealObserver.unobserve(el);
        if (el.classList.contains('su-reveal')) el.style.setProperty('--su-d', Math.min(i++, 8) * 70 + 'ms');
        el.classList.add('su-in');
        if (el.dataset.suCount !== undefined) countUp(el);
        el.addEventListener('animationend', () => el.style.removeProperty('--su-d'), { once: true });
      });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  function isSkipped(el) {
    return !el || el.closest(SKIP) !== null;
  }

  function addReveal(el) {
    if (!(el instanceof HTMLElement) || el.classList.contains('su-reveal') || isSkipped(el)) return;
    if (/^(SCRIPT|STYLE|TEMPLATE|BR|INPUT|SELECT|TEXTAREA|OPTION)$/.test(el.tagName)) return;
    el.classList.add('su-reveal');
    const interactive = el.matches('a[href], button, [role="button"], [onclick]') || getComputedStyle(el).cursor === 'pointer';
    if (interactive) {
      el.classList.add('su-lift');
      if (getComputedStyle(el).transitionDuration.split(',').every((t) => parseFloat(t) === 0)) el.classList.add('su-lift-t');
    }
    revealObserver.observe(el);
  }

  function watchGrid(grid) {
    if (watchedGrids.has(grid)) return;
    watchedGrids.add(grid);
    Array.from(grid.children).forEach(addReveal);
    new MutationObserver((records) => {
      records.forEach((r) => r.addedNodes.forEach(addReveal));
    }).observe(grid, { childList: true });
  }

  function countUp(el) {
    const target = parseFloat(el.dataset.suCount);
    const suffix = el.dataset.suSuffix || '';
    const useCommas = el.dataset.suCommas === '1';
    const start = performance.now();
    const duration = 1200;
    let last = '';
    const write = (v) => {
      last = (useCommas ? Math.round(v).toLocaleString('en-AU') : String(Math.round(v))) + suffix;
      el.textContent = last;
    };
    write(0);
    const tick = (now) => {
      if (el.textContent !== last) return; // page script changed the value; stop.
      const p = Math.min((now - start) / duration, 1);
      write(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function setupCounters(scope) {
    scope.querySelectorAll('[data-count], strong, b, span, div, h2, h3, p').forEach((el) => {
      if (el.dataset.suCount !== undefined || el.children.length || isSkipped(el)) return;
      const text = el.textContent.trim();
      const explicit = el.hasAttribute('data-count');
      if (!explicit && !(COUNT_CLASS.test(el.className) && COUNT_TEXT.test(text))) return;
      const m = explicit ? [null, el.getAttribute('data-count'), el.dataset.suffix || ''] : text.match(COUNT_TEXT);
      if (!m) return;
      const value = parseFloat(String(m[1]).replace(/,/g, ''));
      if (!value) return;
      el.dataset.suCount = String(value);
      el.dataset.suSuffix = m[2] || '';
      el.dataset.suCommas = String(m[1]).includes(',') ? '1' : '0';
      revealObserver.observe(el);
    });
  }

  function setupBars(scope) {
    scope.querySelectorAll('[style*="width"], [data-fill]').forEach((el) => {
      if (isSkipped(el)) return;
      if (el.hasAttribute('data-fill')) el.style.width = el.getAttribute('data-fill');
      else if (!BAR_CLASS.test(el.className) || !/width:\s*\d/.test(el.getAttribute('style') || '')) return;
      el.classList.add('su-bar');
      revealObserver.observe(el);
    });
  }

  function setupReveals(scope) {
    scope.querySelectorAll('[data-reveal]').forEach(addReveal);
    const candidates = scope.querySelectorAll('div, section, ul, ol');
    for (let i = 0; i < candidates.length && i < 2500; i++) {
      const el = candidates[i];
      if (el.children.length < 2 || isSkipped(el)) continue;
      const cs = getComputedStyle(el);
      const isGrid = cs.display.includes('grid') || (cs.display.includes('flex') && cs.flexWrap === 'wrap');
      if (isGrid && !el.closest('.su-reveal')) watchGrid(el);
    }
  }

  function headerShadow() {
    root.classList.toggle('su-scrolled', window.scrollY > 8);
  }

  const CONFETTI = ['#2f6bff', '#17bd7c', '#ff9f1c', '#7c5cff', '#28c0f0'];
  function confetti(target) {
    const rect = target.getBoundingClientRect();
    const layer = d.createElement('div');
    layer.className = 'su-confetti';
    layer.setAttribute('aria-hidden', 'true');
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    for (let i = 0; i < 22; i++) {
      const bit = d.createElement('i');
      bit.style.left = x + 'px';
      bit.style.top = y + 'px';
      bit.style.background = CONFETTI[i % CONFETTI.length];
      layer.appendChild(bit);
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 90;
      bit.animate([
        { translate: '0 0', rotate: '0deg', opacity: 1 },
        { translate: `${Math.cos(angle) * dist}px ${Math.sin(angle) * dist - 40}px`, rotate: `${Math.random() * 540 - 270}deg`, opacity: 1, offset: 0.7 },
        { translate: `${Math.cos(angle) * dist * 1.1}px ${Math.sin(angle) * dist + 30}px`, opacity: 0 }
      ], { duration: 900 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' });
    }
    d.body.appendChild(layer);
    setTimeout(() => layer.remove(), 1400);
  }

  function watchAnswers() {
    d.addEventListener('click', () => {
      const before = new Set(d.querySelectorAll('.correct'));
      const wrongBefore = d.querySelectorAll('.wrong').length;
      setTimeout(() => {
        if (d.querySelectorAll('.wrong').length > wrongBefore) return;
        const fresh = Array.from(d.querySelectorAll('.correct')).find((el) => !before.has(el) && el.offsetParent !== null);
        if (fresh) confetti(fresh);
      }, 60);
    }, true);
  }

  function init() {
    const scope = d.querySelector('main') || d.body;
    setupCounters(scope);
    setupBars(scope);
    setupReveals(scope);
    headerShadow();
    window.addEventListener('scroll', headerShadow, { passive: true });
    watchAnswers();
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init);
  else init();
})();

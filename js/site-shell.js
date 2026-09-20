(() => {
  const root = location.pathname.includes('/YR5/') ? '../' : '';
  const main = document.querySelector('main');
  const pageName = location.pathname.split('/').pop() || 'index.html';
  const legacyPages = new Set([
    'vocabulary-year1-stories.html', 'vocabulary-year3-complete.html',
    'vocabulary-year4-complete.html', 'vocabulary-year5-revision.html',
    'vocabulary-year6-revision.html'
  ]);
  if (legacyPages.has(pageName)) document.body.classList.add('legacy-learning-page');

  if (main && !main.id) main.id = 'main-content';
  if (main && !document.querySelector('.skip-link')) {
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = `#${main.id}`;
    skip.textContent = 'Skip to main content';
    document.body.prepend(skip);
  }

  if (!document.querySelector('link[rel="icon"]')) {
    const icon = document.createElement('link');
    icon.rel = 'icon';
    icon.type = 'image/svg+xml';
    icon.href = `${root}assets/skillup-logo.svg`;
    document.head.appendChild(icon);
  }

  const header = document.querySelector('body > header');
  const nav = header?.querySelector('nav');
  if (header && nav) {
    if (!nav.id) nav.id = 'site-navigation';
    nav.setAttribute('aria-label', nav.getAttribute('aria-label') || 'Main navigation');

    let menu = header.querySelector('.site-menu-button, .home-menu-btn, .menu-toggle, .course-menu');
    if (!menu) {
      menu = document.createElement('button');
      menu.type = 'button';
      menu.className = 'site-menu-button';
      menu.innerHTML = '<span aria-hidden="true">☰</span><span class="sr-only">Menu</span>';
      header.insertBefore(menu, nav);
      menu.addEventListener('click', () => {
        const open = nav.classList.toggle('site-nav-open');
        menu.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      });
    } else {
      menu.setAttribute('aria-controls', nav.id);
      menu.setAttribute('aria-expanded', String(nav.classList.contains('open')));
      menu.addEventListener('click', () => {
        setTimeout(() => {
          const open = nav.classList.contains('open') || nav.classList.contains('site-nav-open');
          menu.setAttribute('aria-expanded', String(open));
          menu.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        });
      });
    }
    menu.setAttribute('aria-controls', nav.id);
    if (!menu.hasAttribute('aria-expanded')) menu.setAttribute('aria-expanded', 'false');

    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      nav.classList.remove('open', 'site-nav-open');
      menu.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-label', 'Open menu');
      menu.focus();
    });
    nav.addEventListener('click', event => {
      if (!event.target.closest('a') || matchMedia('(min-width: 861px)').matches) return;
      nav.classList.remove('open', 'site-nav-open');
      menu.setAttribute('aria-expanded', 'false');
    });
  }

  const liveSelectors = [
    '.feedback', '.vocab-feedback', '.reading-feedback', '.register-message',
    '[id$="Feedback"]', '[id$="Result"]', '#mockMessage', '#finalMessage'
  ];
  document.querySelectorAll(liveSelectors.join(',')).forEach(node => {
    if (!node.hasAttribute('aria-live')) node.setAttribute('aria-live', 'polite');
    if (!node.hasAttribute('role')) node.setAttribute('role', 'status');
  });

  const syncTabs = group => {
    const buttons = [...group.querySelectorAll('button')];
    group.setAttribute('role', 'tablist');
    buttons.forEach(button => {
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', String(button.classList.contains('active')));
      const mode = button.dataset.mode;
      if (mode && document.getElementById(`${mode}Panel`)) button.setAttribute('aria-controls', `${mode}Panel`);
    });
  };
  document.querySelectorAll('.mode-tabs, .skill-tabs').forEach(group => {
    syncTabs(group);
    new MutationObserver(() => syncTabs(group)).observe(group, {
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  });

  if (!document.querySelector('.site-trust-footer')) {
    const footer = document.createElement('div');
    footer.className = 'site-trust-footer';
    footer.innerHTML = `
      <nav aria-label="Information and support">
        <a href="${root}about.html">About</a>
        <a href="${root}parents.html">For parents</a>
        <a href="${root}privacy.html">Privacy</a>
        <a href="${root}terms.html">Terms</a>
        <a href="${root}support.html">Report an issue</a>
      </nav>
      <p>SkillUP is an independent learning resource. It is not an official government examination service.</p>`;
    document.body.appendChild(footer);
  }

  if (!document.querySelector('.back-to-top')) {
    const backToTop = document.createElement('button');
    backToTop.type = 'button';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '<span aria-hidden="true">↑</span><span>Top</span>';
    backToTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
    document.body.appendChild(backToTop);
    const syncBackToTop = () => backToTop.classList.toggle('show', window.scrollY > 700);
    window.addEventListener('scroll', syncBackToTop, {passive: true});
    syncBackToTop();
  }
})();

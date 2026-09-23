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

  if (['selective-practice.html', 'selective.html'].includes(pageName)) {
    if (!document.querySelector('link[href*="selective-color.css"]')) {
      const sel = document.createElement('link');
      sel.rel = 'stylesheet';
      sel.href = `${root}css/selective-color.css`;
      document.head.appendChild(sel);
    }
  }

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

    if (!nav.querySelector('a[href*="accounts.html"]')) {
      const accountsLink = document.createElement('a');
      accountsLink.href = `${root}accounts.html`;
      accountsLink.textContent = 'Accounts';
      accountsLink.className = 'accounts-nav-link';
      nav.insertBefore(accountsLink, nav.querySelector('a[href*="sign-in.html"]') || null);
    }

    if (!nav.querySelector('a[href*="sign-in.html"], a[href*="dashboard.html"]')) {
      const accountLink = document.createElement('a');
      accountLink.href = `${root}sign-in.html`;
      accountLink.textContent = 'Sign in';
      accountLink.className = 'account-nav-link';
      nav.appendChild(accountLink);
    }

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
        <a href="${root}accounts.html">Accounts</a>
        <a href="${root}parents.html">For parents</a>
        <a href="${root}sign-in.html">Sign in</a>
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

  if (pageName === 'index.html' && !document.querySelector('.home-account-preview')) {
    const anchor = document.querySelector('.selective-box, .year-strip');
    if (anchor) {
      const section = document.createElement('section');
      section.className = 'home-account-preview';
      section.innerHTML = `
        <div class="home-account-copy">
          <span>CONNECTED LEARNING</span>
          <h2>One clear view for every learner team</h2>
          <p>Teachers assign SkillUP practice, students see what is due next, and parents follow progress through a calm read-only view.</p>
          <a href="accounts.html">Explore student, teacher and parent accounts →</a>
        </div>
        <div class="home-role-grid">
          <a href="dashboard.html?demo=student"><b>S</b><strong>Student</strong><span>Tasks, due dates and progress</span></a>
          <a href="dashboard.html?demo=teacher"><b>T</b><strong>Teacher</strong><span>Classes, assignments and insights</span></a>
          <a href="dashboard.html?demo=parent"><b>P</b><strong>Parent</strong><span>Linked children and support</span></a>
        </div>`;
      anchor.before(section);
    }
  }

  const loadEnhancement = (scriptPath, stylePath) => {
    if (stylePath && !document.querySelector(`link[data-enhancement="${stylePath}"]`)) {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = `${root}${stylePath}`;
      style.dataset.enhancement = stylePath;
      document.head.appendChild(style);
    }
    if (!document.querySelector(`script[data-enhancement="${scriptPath}"]`)) {
      const script = document.createElement('script');
      script.src = `${root}${scriptPath}`;
      script.dataset.enhancement = scriptPath;
      document.body.appendChild(script);
    }
  };

  if (['vocabulary-year3.html', 'vocabulary-year4.html', 'vocabulary-year5.html', 'vocabulary-year6.html'].includes(pageName)) {
    loadEnhancement('js/vocabulary-six-question.js', 'css/vocabulary-six.css');
  }
  if (pageName === 'english-practice.html') {
    loadEnhancement('js/english-six-question.js', 'css/english-six.css');
  }
  if (new URLSearchParams(location.search).has('assignment')) {
    loadEnhancement('js/assignment-bridge.js', 'css/assignment-bridge.css');
  }
})();

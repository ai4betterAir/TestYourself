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
    if (!document.querySelector('script[src*="selective-writing-vocab-bank.js"]')) {
      const bank = document.createElement('script');
      bank.src = `${root}js/selective-writing-vocab-bank.js`;
      document.body.appendChild(bank);
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
      });
    }
  }

  if (!document.querySelector('.site-trust-footer')) {
    const footer = document.createElement('div');
    footer.className = 'site-trust-footer';
    footer.innerHTML = `<nav aria-label="Information and support"><a href="${root}about.html">About</a><a href="${root}accounts.html">Accounts</a><a href="${root}parents.html">For parents</a><a href="${root}privacy.html">Privacy</a></nav><p>SkillUP is an independent learning resource.</p>`;
    document.body.appendChild(footer);
  }

  const loadEnhancement = (scriptPath, stylePath) => {
    if (stylePath && !document.querySelector(`link[data-enhancement="${stylePath}"]`)) {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = `${root}${stylePath}`;
      style.dataset.enhancement = stylePath;
      document.head.appendChild(style);
    }
    if (scriptPath && !document.querySelector(`script[data-enhancement="${scriptPath}"]`)) {
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
})();

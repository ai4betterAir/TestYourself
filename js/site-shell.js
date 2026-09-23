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
    if (!document.querySelector('link[href*="writing-workshop.css"]')) {
      const wcss = document.createElement('link');
      wcss.rel = 'stylesheet';
      wcss.href = `${root}css/writing-workshop.css`;
      document.head.appendChild(wcss);
    }
    ['js/selective-writing-vocab-bank.js', 'js/selective-writing-workshop.js', 'js/selective-writing-boot.js'].forEach((src) => {
      if (document.querySelector(`script[src*="${src.split('/').pop()}"]`)) return;
      const s = document.createElement('script');
      s.src = `${root}${src}`;
      document.body.appendChild(s);
    });
  }

  if (main && !main.id) main.id = 'main-content';
  if (main && !document.querySelector('.skip-link')) {
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = `#${main.id}`;
    skip.textContent = 'Skip to main content';
    document.body.prepend(skip);
  }

  const header = document.querySelector('body > header');
  const nav = header?.querySelector('nav');
  if (header && nav) {
    if (!nav.id) nav.id = 'site-navigation';
    if (!nav.querySelector('a[href*="accounts.html"]')) {
      const accountsLink = document.createElement('a');
      accountsLink.href = `${root}accounts.html`;
      accountsLink.textContent = 'Accounts';
      nav.insertBefore(accountsLink, nav.querySelector('a[href*="sign-in.html"]') || null);
    }
  }

  if (!document.querySelector('.site-trust-footer')) {
    const footer = document.createElement('div');
    footer.className = 'site-trust-footer';
    footer.innerHTML = `<nav aria-label="Information and support"><a href="${root}about.html">About</a><a href="${root}privacy.html">Privacy</a></nav><p>SkillUP is an independent learning resource.</p>`;
    document.body.appendChild(footer);
  }
})();

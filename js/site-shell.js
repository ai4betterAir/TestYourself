(() => {
  const root = location.pathname.includes('/YR5/') ? '../' : '';
  const main = document.querySelector('main');
  const pageName = location.pathname.split('/').pop() || 'index.html';
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
  if (!document.querySelector('.skip-link') && main) {
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

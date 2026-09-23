(() => {
  const root = location.pathname.includes('/YR5/') ? '../' : '';
  const main = document.querySelector('main');
  const pageName = location.pathname.split('/').pop() || 'index.html';

  if (['selective-practice.html', 'selective.html'].includes(pageName)) {
    ['css/selective-color.css', 'css/vocab-learn.css', 'css/writing-workshop.css'].forEach((href) => {
      if (document.querySelector(`link[href*="${href.split('/').pop()}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${root}${href}`;
      document.head.appendChild(link);
    });
    ['js/selective-writing-vocab-bank.js', 'js/selective-writing-workshop.js', 'js/selective-writing-boot.js'].forEach((src) => {
      if (document.querySelector(`script[src*="${src.split('/').pop()}"]`)) return;
      const s = document.createElement('script');
      s.src = `${root}${src}`;
      document.body.appendChild(s);
    });
  }

  if (main && !main.id) main.id = 'main-content';
})();

(function () {
  const params = new URLSearchParams(location.search);
  const year = params.get('year') === '5' ? '5' : '3';
  const pages = document.querySelectorAll('[data-page]');
  pages.forEach(function (page) {
    const isNaplan = page.dataset.page.startsWith('naplan');
    const active = !isNaplan || page.dataset.page === 'naplan' + year;
    page.hidden = !active;
    const skills = page.querySelector('.skills');
    const tests = page.querySelector('.test-banner');
    if (active) {
      skills.id = 'skills';
      tests.id = 'tests';
      if (isNaplan) document.title = 'Year ' + year + ' NAPLAN practice | Acorn & Shine';
    }
  });
  // Keep a selected year when following Selective practice links.
  if (params.has('year')) {
    document.querySelectorAll('a[href^="selective-practice.html"]').forEach(function (link) {
      const target = new URL(link.href);
      target.searchParams.set('year', params.get('year'));
      link.href = target.pathname.split('/').pop() + target.search;
    });
  }
})();

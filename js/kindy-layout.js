(() => {
  const hero = document.getElementById('practiceHero');
  const stage = document.createElement('section');
  stage.id = 'kindyLesson';
  hero.before(stage);
  const savedTitle = document.title;
  let active = '';
  const nav = document.getElementById('practiceNav');
  const navLinks = [['index.html','Home'],['practice.html?year=K','Practice'],['about.html','About'],['sign-in.html','Sign In']];
  document.querySelector('.mode-tab[data-mode="learn"]').addEventListener('click', () => {
    if (active) stage.querySelector('form').scrollIntoView();
  });
  function update() {
    const slug = grade === 'K' && KINDY_MATHS.has(topic) ? topic : '';
    if (slug === active) return;
    active = slug;
    document.body.classList.toggle('kindy-live', Boolean(slug));
    stage.replaceChildren();
    if (!slug) {
      if (grade !== '1') document.title = savedTitle;
      return;
    }
    nav.querySelectorAll('.k-nav-item').forEach(link => link.remove());
    for (const [href,label] of navLinks) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      link.className = 'k-nav-item';
      nav.append(link);
    }
    stage.append(document.getElementById('k-'+slug).content.cloneNode(true));
    document.title = topicName() + ' · Kindergarten Maths | Acorn & Shine';
    stage.querySelector('.k-start').onclick = event => {
      event.preventDefault();
      document.querySelector('.mode-tab[data-mode="practice"]').click();
      document.getElementById('quiz').scrollIntoView();
    };
    const form = stage.querySelector('form');
    const status = form.querySelector('output');
    form.onchange = () => { status.textContent = ''; };
    form.onsubmit = event => {
      event.preventDefault();
      status.textContent = new FormData(form).get('answer') === form.dataset.answer
        ? 'Correct! ' + form.dataset.explanation : 'Have another look and try again.';
    };
  }
  const previous = render;
  render = function () { previous(); update(); };
  update();
})();

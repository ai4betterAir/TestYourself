function renderSubjectHomepage({year, topics, hrefFor, subject}) {
  const label = year === 'K' ? 'Kindergarten' : 'Year ' + year;
  const mathsCopy = {
    K: 'Build a strong start in maths through fun, hands-on learning.',
    '1': 'Build strong Maths skills for everyday life.',
    '2': 'Build confidence in maths skills for Year 2.',
    '3': 'Build confidence in Maths with practical, hands-on learning.',
    '4': 'Build confidence in Maths with real-world skills for Year 4.',
    '5': 'Build strong mathematical thinking for upper primary.',
    '6': 'Build confidence and fluency in upper primary Maths.'
  };
  const englishCopy = {
    K: 'Discover letters, sounds and your first words.',
    '1': 'Build words, write sentences and share your ideas.',
    '2': 'Build stronger sentences and bring stories to life.',
    '3': 'Shape your ideas into paragraphs and stories.',
    '4': 'Connect ideas and develop your writing voice.',
    '5': 'Write with purpose, structure and confidence.',
    '6': 'Refine your language and make every word count.'
  };
  const isEnglish = subject === 'english';
  const subjectLabel = isEnglish ? 'English' : 'Maths';
  const copy = isEnglish ? englishCopy : mathsCopy;
  const assetFolder = isEnglish ? 'english-homepages' : 'maths-homepages';
  const grade = year === 'K' ? '1' : year;
  const practiceHref = isEnglish
    ? `english-practice.html?grade=${grade}&skill=grammar`
    : `practice.html?year=${year}&mode=practice`;
  const testHref = isEnglish
    ? `english-practice.html?grade=${grade}&skill=grammar#english-test-start`
    : `practice.html?year=${year}&mode=test&count=20`;
  const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'css/maths-homepages.css?v=20261115-english';
  document.head.append(stylesheet);
  document.body.classList.add('maths-homepage');
  document.body.dataset.mathsYear = year;
  document.title = label + ' ' + subjectLabel + ' | Acorn & Shine';
  document.querySelector('meta[name="description"]').content = copy[year];
  const header = document.querySelector('.site-header');
  header.className = 'maths-header';
  header.innerHTML = `
    <a href="index.html" class="maths-brand"><img src="assets/acorn-and-shine-logo-transparent.png" alt="Acorn &amp; Shine"></a>
    <nav aria-label="Main navigation">
      <a href="index.html">Home</a>
      <a href="learning.html?year=${year}">Learn</a>
      <a class="maths-signin" href="sign-in.html">Sign In</a>
    </nav>`;
  const cards = topics.map(([title, description], index) => `
    <a class="maths-topic" href="${escape(hrefFor(title, index))}" aria-label="${escape(title + '. ' + description)}">
      <img src="assets/${assetFolder}/${year}-${index}.webp" alt="" width="360" height="132">
      <h3>${escape(title)}</h3><span aria-hidden="true">→</span>
    </a>`).join('');
  const main = document.querySelector('main');
  main.className = 'maths-main';
  main.innerHTML = `
    <section class="maths-hero">
      <div class="maths-copy">
        <div class="maths-crumb"><a href="index.html">Home</a> / <a href="learning.html?year=${year}">${label}</a> / ${subjectLabel}</div>
        <h1>${label} ${subjectLabel}</h1>
        <p>${copy[year]}</p>
        <div class="maths-actions">
          <a class="maths-button maths-primary" href="#topics">Choose a topic</a>
          <a class="maths-button maths-secondary" href="learning.html?year=${year}">Back to year home</a>
        </div>
      </div>
      <img class="maths-hero-image" src="assets/${assetFolder}/${year}-hero.webp" alt="" width="856" height="367">
    </section>
    <section class="maths-library" id="topics">
      <h2>Choose ${isEnglish ? 'an English' : 'a Maths'} topic</h2>
      <div class="maths-topics">${cards}</div>
      <aside class="maths-practice">
        <h2>Ready to practise?</h2>
        <div class="maths-actions">
          <a class="maths-button" href="${escape(practiceHref)}">${isEnglish ? 'Start practice' : 'Practice · 10 questions'}</a>
          <a class="maths-button" href="${escape(testHref)}">${isEnglish ? 'Try a test' : 'Test · 20 questions'}</a>
        </div>
      </aside>
    </section>`;
  const footer = document.querySelector('footer');
  footer.className = 'maths-footer';
  footer.innerHTML = `<a href="learning.html?year=${year}">All ${label} subjects</a><a href="about.html">About</a><a href="privacy.html">Privacy</a><a href="support.html">Support</a>`;
}

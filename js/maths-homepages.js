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
  const scienceCopy = {
    K: 'Look closely, ask questions and explore your world.',
    '1': 'Discover living things, weather and everyday science.',
    '2': 'Explore how things grow, change and move.',
    '3': 'Investigate patterns and discover how things work.',
    '4': 'Test ideas, gather evidence and explain what you find.',
    '5': 'Connect scientific ideas with the world around you.',
    '6': 'Evaluate evidence and explain a changing world.'
  };
  const gkCopy = {
    K: 'Discover the people, places and wonders around you.',
    '1': 'Meet amazing animals and explore new places.',
    '2': 'Explore countries, communities and stories from the past.',
    '3': 'Connect places, cultures and ideas across our world.',
    '4': 'Discover how places, people and ideas shape our world.',
    '5': 'Explore our world through history, science and society.',
    '6': 'Build a broader understanding of a connected world.'
  };
  const grade = year === 'K' ? '1' : year;
  const presentations = {
    maths: {
      label: 'Maths', copy: mathsCopy,
      topicHeading: 'Choose a Maths topic', callout: 'Ready to practise?',
      practiceHref: `practice.html?year=${year}&mode=practice`,
      practiceLabel: 'Practice · 10 questions',
      testHref: `practice.html?year=${year}&mode=test&count=20`,
      testLabel: 'Test · 20 questions'
    },
    english: {
      label: 'English', copy: englishCopy,
      topicHeading: 'Choose an English topic', callout: 'Ready to practise?',
      practiceHref: `english-practice.html?grade=${grade}&skill=grammar`,
      practiceLabel: 'Start practice',
      testHref: `english-practice.html?grade=${grade}&skill=grammar#english-test-start`,
      testLabel: 'Try a test'
    },
    science: {
      label: 'Science', copy: scienceCopy,
      topicHeading: 'Choose a Science topic', callout: 'Ready to explore?',
      practiceHref: `science-practice.html?year=${year}`,
      practiceLabel: 'Start an activity'
    }
  };
  presentations['general-knowledge'] = {
    label: 'General Knowledge', copy: gkCopy,
    topicHeading: 'Choose a topic to explore', callout: 'A world of discovery',
    practiceHref: '#topics', practiceLabel: 'Explore topics'
  };
  const presentation = presentations[subject];
  const subjectLabel = presentation.label;
  const copy = presentation.copy;
  const assetFolder = subject + '-homepages';
  const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'css/maths-homepages.css?v=20261115-reading';
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
  const cards = topics.map(([title, description], index) => {
    const href = hrefFor(title, index);
    const isReading = subject === 'english' && title === 'Reading';
    const artworkIndex = subject === 'english' ? index - 1 : index;
    const artworkSrc = isReading
      ? `assets/exam-homepages/${Number(year) >= 5 ? 'naplan5' : 'naplan3'}-0.webp`
      : `assets/${assetFolder}/${year}-${artworkIndex}.webp`;
    const artwork = `<img src="${artworkSrc}" alt="" width="480" height="132">`;
    const heading = `<h3>${escape(title)}</h3><span aria-hidden="true">→</span>`;
    if (href === '#') {
      return `<details class="maths-topic maths-overview">
        <summary>${artwork}${heading}</summary>
        <p>${escape(description)}<small>Lessons coming soon</small></p>
      </details>`;
    }
    return `<a class="maths-topic" ${isReading ? 'id="english-reading"' : ''} href="${escape(href)}" aria-label="${escape(title + '. ' + description)}">
      ${artwork}${heading}
    </a>`;
  }).join('');
  const main = document.querySelector('main');
  main.className = 'maths-main';
  main.innerHTML = `
    <section class="maths-hero">
      <div class="maths-copy">
        <div class="maths-crumb"><a href="index.html">Home</a> / <a href="learning.html?year=${year}">${label}</a> / ${subjectLabel}</div>
        <h1>${label}${subject === 'general-knowledge' ? '<br>' : ' '}${subjectLabel}</h1>
        <p>${copy[year]}</p>
        <div class="maths-actions">
          <a class="maths-button maths-primary" href="#topics">Choose a topic</a>
          <a class="maths-button maths-secondary" href="learning.html?year=${year}">Back to year home</a>
        </div>
      </div>
      <img class="maths-hero-image" src="assets/${assetFolder}/${year}-hero.webp" alt="" width="856" height="367">
    </section>
    <section class="maths-library" id="topics">
      <h2>${presentation.topicHeading}</h2>
      <div class="maths-topics">${cards}</div>
      <aside class="maths-practice">
        <h2>${presentation.callout}</h2>
        <div class="maths-actions">
          <a class="maths-button" href="${escape(presentation.practiceHref)}">${presentation.practiceLabel}</a>
          ${presentation.testHref ? `<a class="maths-button" href="${escape(presentation.testHref)}">${presentation.testLabel}</a>` : ''}
        </div>
      </aside>
    </section>`;
  const footer = document.querySelector('footer');
  footer.className = 'maths-footer';
  footer.innerHTML = `<a href="learning.html?year=${year}">All ${label} subjects</a><a href="about.html">About</a><a href="privacy.html">Privacy</a><a href="support.html">Support</a>`;
}

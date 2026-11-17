/* Year 4 and 5 share the main homepage's illustrated learning layout. */
(() => {
  const year = new URLSearchParams(location.search).get('year');
  if (!['4', '5'].includes(year)) return;

  const hub = document.getElementById('year-hub');
  const subjects = hub.querySelector('#subjects');
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'css/year-home-refresh.css?v=20261118';
  document.head.append(stylesheet);
  document.body.classList.add('year-home-refresh');

  const heading = year === '4' ? 'Grow your skills.<br>Explore bigger ideas.' : 'Think bigger.<br>Build your confidence.';
  const description = year === '4'
    ? 'Discover new ideas in Maths, English and Science. Choose a subject and learn at your own pace.'
    : 'Explore fractions, develop your writing and sharpen your reasoning. Your next challenge starts here.';
  const hero = document.createElement('section');
  hero.className = 'year-welcome';
  hero.setAttribute('aria-labelledby', 'year-welcome-title');
  hero.innerHTML = `<div class="year-welcome-copy">
    <a class="year-breadcrumb" href="index.html">Home</a><span class="year-breadcrumb"> / Year ${year}</span>
    <p class="year-label">Year ${year}</p>
    <h1 id="year-welcome-title">${heading}</h1>
    <p class="year-intro">${description}</p>
    <div class="year-welcome-actions"><a href="#subjects">Choose a subject</a><a href="#year-pathways">Explore tests</a></div>
    </div><img src="assets/homepage/year-${year}.webp" alt="" fetchpriority="high"> `;

  const pathways = document.createElement('section');
  pathways.id = 'year-pathways';
  pathways.className = 'year-pathways';
  const exams = year === '4'
    ? [{name:'Opportunity Class', description:'Reading, maths and thinking skills', href:'oc.html', image:'oc'}]
    : [{name:'Year 5 NAPLAN', description:'Reading, writing, language and numeracy', href:'naplan.html?year=5', image:'naplan'},
       {name:'Selective', description:'Reading, maths and thinking skills', href:'selective.html', image:'selective'}];
  pathways.innerHTML = `<h2>Prepare for a test</h2><div class="year-pathway-grid">${exams.map(exam =>
    `<a href="${exam.href}" class="year-pathway ${exam.image}"><div><h3>${exam.name}</h3><p>${exam.description}</p><span>Explore practice &nbsp; →</span></div><img src="assets/homepage/${exam.image}.webp" alt="" loading="lazy"></a>`
  ).join('')}</div>`;
  subjects.querySelector('.section-head').innerHTML = '<h2>Choose your subject</h2><a href="learning.html">Change year →</a>';
  hub.replaceChildren(hero, subjects, pathways);
})();

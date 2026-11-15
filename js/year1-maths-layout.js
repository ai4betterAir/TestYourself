/* Apply the reviewed Year 1 topic design to the real maths lesson engine.
   Keep the original question, scoring, progress and timed-test controllers. */
(function () {
  if (typeof render !== 'function') return;
  const byId = id => document.getElementById(id);
  const hero = byId('practiceHero');
  const workspace = byId('learningWorkspace');
  const panel = byId('learnPanel');
  const layout = panel.querySelector('.learn-layout');
  const guided = panel.querySelector('.guided-box');
  const mistake = panel.querySelector('.mistake-card');
  const remember = panel.querySelector('.remember-card');
  const heading = hero.querySelector('h1');
  const nav = byId('practiceNav');
  const initial = {heading: heading.innerHTML, nav: nav.innerHTML, title: document.title};
  let mounted = false;
  const topicLooks = {
    number: [0, 'Build numbers with tens and ones.'],
    compare: [0, 'Look at the tens, then the ones.'],
    beforeafter: [0, 'Find the number before and after.'],
    skipcount: [0, 'Notice the pattern as you count.'],
    addition: [1, 'Join two groups and count the total.'],
    basicfacts: [1, 'Build facts you can use again.'],
    doubles: [1, 'Two equal groups make a double.'],
    make10: [1, 'Find the parts that make ten.'],
    addsub: [1, 'See how addition and subtraction connect.'],
    missing: [1, 'Find the missing part.'],
    subtraction: [2, 'Take some away and find what is left.'],
    patterns: [3, 'Look for the rule and keep it going.'],
    shapes2d: [3, 'Notice the sides and corners.'],
    shapes3d: [3, 'Explore objects you can hold.'],
    position: [3, 'Describe where things are and how they move.'],
    fractions: [3, 'Share a whole into equal parts.'],
    equalgroups: [1, 'Make small groups with the same number.'],
    sharing: [1, 'Share one at a time so every group is equal.'],
    evenodd: [0, 'Make pairs and look for a leftover.'],
    length: [4, 'Line up the ends and compare.'],
    mass: [4, 'Compare what is heavier and lighter.'],
    capacity: [4, 'Compare how much containers can hold.'],
    money: [5, 'Recognise coins and count their value.'],
    time: [6, 'Read o’clock and half-past times.'],
    calendar: [6, 'Explore days, weeks and months.'],
    data: [7, 'Sort, count and compare information.'],
    chance: [7, 'Think about what can happen.'],
    wordproblems: [8, 'Draw it, work it out and check.'],
    mixed: [8, 'Put your Year 1 maths skills to work.']
  };
  function mount() {
    mounted = true;
    document.body.classList.add('year1-topic-live');
    nav.innerHTML = '<a href="index.html">Home</a><a class="active" href="practice.html?year=1">Practice</a><a href="about.html">About</a><a href="sign-in.html">Sign In</a><a class="live-signup" href="sign-up.html">Sign Up</a>';
    const crumb = document.createElement('div');
    crumb.className = 'live-crumb';
    crumb.innerHTML = '<a href="index.html">Home</a><span>/</span><a href="learning.html?year=1">Year 1</a><span>/</span><a href="subject.html?year=1&subject=maths">Maths</a>';
    hero.firstElementChild.prepend(crumb);
    const tagline = document.createElement('h2');
    tagline.id = 'liveTopicTagline'; heading.after(tagline);
    const actions = document.createElement('div');
    actions.className = 'live-hero-actions';
    actions.innerHTML = '<a class="primary-action" href="#learningWorkspace">Start learning <span aria-hidden="true">→</span></a><button class="secondary-action" type="button">Start practice</button><a class="live-topic-link" href="#topics">Choose another topic</a>';
    actions.querySelector('button').onclick = () => { document.querySelector('.mode-tab[data-mode="practice"]').click(); workspace.scrollIntoView({behavior:'smooth'}); };
    byId('welcomeText').after(actions);
    const art = document.createElement('img');
    art.id = 'liveTopicArt'; art.alt = 'Year 1 maths learning materials'; art.decoding = 'async';
    hero.appendChild(art);
    const path = document.createElement('div');path.className = 'live-learning-path';
    path.setAttribute('aria-label','Learning steps');
    path.innerHTML = ['Look & learn','Talk it through','Have a go','Check & celebrate'].map((s,i)=>`<div><span>${i+1}</span><b>${s}</b></div>`).join('');
    hero.after(path);
    const title = document.createElement('div');title.className = 'live-workspace-heading';
    title.innerHTML = '<span class="kicker">YOUR LEARNING SPACE</span><h2>Look. Try. Tell us why.</h2><p>Learn with examples, practise 10 questions, then try a timed check.</p>';
    workspace.prepend(title);
    const grid = document.createElement('div');grid.className = 'live-lesson-grid';
    const content = document.createElement('div');content.className = 'live-lesson-content';
    const aside = document.createElement('aside');aside.className = 'live-lesson-aside';aside.setAttribute('aria-label','Learning reminders');
    const model = document.createElement('article');model.id = 'livePlaceValueModel';model.className = 'live-number-model';
    model.innerHTML = '<span class="kicker">BUILD THE NUMBER</span><h3>23 is 2 tens and 3 ones.</h3><div class="live-place-chart"><div><b>TENS</b><div class="live-rods" aria-label="Two groups of ten"><span></span><span></span></div><strong>20</strong></div><div><b>ONES</b><div class="live-ones" aria-label="Three ones"><i></i><i></i><i></i></div><strong>3</strong></div></div><p>20 + 3 = <b>23</b></p>';
    grid.append(content, aside);content.append(model, layout, guided);aside.append(remember,mistake);
    const family = document.createElement('article');family.className = 'live-family-tip';
    family.innerHTML = '<h3>Try this together</h3><p>Use small objects or draw a picture. Ask your child to explain what they notice.</p><a href="subject.html?year=1&subject=maths">All Year 1 maths topics →</a>';
    aside.appendChild(family);panel.appendChild(grid);
    const tabs = document.querySelector('.mode-tabs');tabs.setAttribute('aria-label','Learning mode');
    tabs.querySelectorAll('button').forEach(button=>{button.setAttribute('aria-controls',button.dataset.mode==='learn'?'learnPanel':button.dataset.mode==='practice'?'quiz':'testPanel');});
  }
  function unmount() {
    document.body.classList.remove('year1-topic-live');
    nav.innerHTML = initial.nav;heading.innerHTML = initial.heading;document.title = initial.title;
    hero.querySelector('.live-crumb')?.remove();byId('liveTopicTagline')?.remove();hero.querySelector('.live-hero-actions')?.remove();byId('liveTopicArt')?.remove();
    document.querySelector('.live-learning-path')?.remove();document.querySelector('.live-workspace-heading')?.remove();
    layout.append(mistake,remember);panel.append(layout,guided);panel.querySelector('.live-lesson-grid')?.remove();
    mounted = false;
  }
  function sync() {
    if (String(grade) !== '1') { if(mounted) unmount(); return; }
    if(!mounted) mount();
    const look = topicLooks[topic] || topicLooks.mixed;
    const title = topic === 'number' ? 'Number & place value' : topicName();
    heading.textContent = title;
    byId('liveTopicTagline').textContent = look[1];
    byId('yearTag').textContent = 'YEAR 1 · MATHS';
    byId('welcomeText').textContent = 'Explore '+title.toLowerCase()+'. Look at an example, try a question and talk about your answer.';
    byId('liveTopicArt').src = 'assets/maths-homepages/1-'+look[0]+'.webp';
    byId('livePlaceValueModel').hidden = topic !== 'number';
    document.title = 'Year 1 '+title+' | Acorn & Shine';
    document.querySelectorAll('.mode-tab').forEach(button => button.setAttribute('aria-pressed',String(button.classList.contains('active'))));
  }
  const originalRender = render;
  render = function () { const result = originalRender.apply(this, arguments); sync(); return result; };
  document.querySelectorAll('.mode-tab').forEach(button => button.addEventListener('click',()=>{ if(mounted) document.querySelectorAll('.mode-tab').forEach(b=>b.setAttribute('aria-pressed',String(b===button))); }));
  sync();
})();

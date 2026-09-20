(() => {
  const main = document.querySelector('main');
  if (!main || document.getElementById('vocabularyYearTest')) return;
  if (!document.querySelector('link[href$="vocabulary-test.css"]')) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = 'css/vocabulary-test.css';
    document.head.appendChild(stylesheet);
  }

  const shuffle = values => [...values].sort(() => Math.random() - .5);
  const safe = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const yearMatch = document.title.match(/Year\s+([1-6])/i) || document.body.textContent.match(/YEAR\s+([1-6])/i);
  const year = yearMatch?.[1] || '4';
  let questions = [], answers = [], index = 0, seconds = 1200, timer = null;

  function wordQuestions(groups) {
    const words = groups.flatMap(group => group.w || group.words || []);
    const normalised = words.map(word => Array.isArray(word)
      ? {word: word[0], meaning: word[1]}
      : {word: word.w, meaning: word.m});
    return shuffle(normalised).slice(0, 20).map(item => {
      const distractors = shuffle(normalised.filter(other => other.word !== item.word).map(other => other.meaning)).slice(0, 3);
      return {skill: 'Meaning', question: `What does “${item.word}” mean?`, answer: item.meaning, choices: shuffle([item.meaning, ...distractors])};
    });
  }

  function readingCourseQuestions(course) {
    const words = course.flatMap(lesson => lesson.w.map(word => ({word: word[0], meaning: word[1], example: word[2]})));
    const pool = words.flatMap(item => {
      const meaningChoices = shuffle(words.filter(other => other.word !== item.word).map(other => other.meaning)).slice(0, 3);
      const wordChoices = shuffle(words.filter(other => other.word !== item.word).map(other => other.word)).slice(0, 3);
      const escapedWord = item.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const blank = item.example.replace(new RegExp(escapedWord, 'i'), '_____');
      return [
        {skill: 'Meaning', question: `What does “${item.word}” mean?`, answer: item.meaning, choices: shuffle([item.meaning, ...meaningChoices])},
        {skill: 'Context', question: `Which word best completes the sentence? ${blank}`, answer: item.word, choices: shuffle([item.word, ...wordChoices])}
      ];
    });
    return shuffle(pool).slice(0, 20);
  }

  function generatedQuestions(api) {
    const ids = api.skills.map(skill => Array.isArray(skill) ? skill[0] : skill.id).filter(Boolean);
    const result = [], seen = new Set();
    for (let attempt = 0; attempt < 500 && result.length < 20; attempt++) {
      const skill = ids[Math.floor(Math.random() * ids.length)];
      const raw = api.makeQuestion(skill);
      if (!raw) continue;
      const question = raw.q || raw.text;
      const answer = raw.a ?? raw.answer;
      const choices = [...new Set((raw.c || raw.choices || []).map(String))];
      if (!question || answer === undefined || choices.length < 2 || !choices.includes(String(answer)) || seen.has(question)) continue;
      seen.add(question);
      result.push({skill: 'Vocabulary', question, answer: String(answer), choices: shuffle(choices)});
    }
    return result;
  }

  function buildQuestions() {
    if (window.SKILLUP_Y4_READING_LESSONS) return readingCourseQuestions(window.SKILLUP_Y4_READING_LESSONS);
    if (window.SKILLUP_VOCAB_API?.makeQuestion) return generatedQuestions(window.SKILLUP_VOCAB_API);
    if (typeof LESSONS !== 'undefined' && Array.isArray(LESSONS)) return wordQuestions(LESSONS);
    if (typeof L !== 'undefined' && Array.isArray(L)) return wordQuestions(L);
    return [];
  }

  const launch = document.createElement('button');
  launch.type = 'button';
  launch.className = 'vbtn primary vocabulary-test-launch';
  launch.textContent = 'Take 20-question Year Test';
  const launchHost = document.querySelector('.hero-actions, .subnav, .lesson-heading') || main;
  launchHost.appendChild(launch);

  const section = document.createElement('section');
  section.id = 'vocabularyYearTest';
  section.className = 'vocabulary-year-test';
  section.hidden = true;
  section.innerHTML = `
    <div class="vocabulary-test-head"><div><span>YEAR ${safe(year)} VOCABULARY TEST</span><h2>20-question independent test</h2></div><b id="vocabularyTestClock">20:00</b></div>
    <div id="vocabularyTestBody">
      <div class="vocabulary-test-progress"><span id="vocabularyTestCount"></span><i id="vocabularyTestBar"></i></div>
      <span class="question-type" id="vocabularyTestSkill"></span>
      <h3 id="vocabularyTestQuestion"></h3>
      <div class="vocab-answers" id="vocabularyTestAnswers"></div>
      <div class="vocabulary-test-actions"><button id="vocabularyTestPrevious">← Previous</button><button id="vocabularyTestClose">Back to lessons</button><button class="primary" id="vocabularyTestNext">Next →</button></div>
    </div>
    <div id="vocabularyTestResult" class="vocabulary-test-result" role="status" aria-live="polite" hidden></div>`;
  main.appendChild(section);
  const element = id => document.getElementById(id);

  function render() {
    const question = questions[index];
    element('vocabularyTestCount').textContent = `Question ${index + 1} of 20`;
    element('vocabularyTestBar').style.width = `${(index + 1) * 5}%`;
    element('vocabularyTestSkill').textContent = question.skill.toUpperCase();
    element('vocabularyTestQuestion').textContent = question.question;
    element('vocabularyTestAnswers').innerHTML = question.choices.map((choice, choiceIndex) => `<button type="button" data-choice="${choiceIndex}" class="${answers[index] === choiceIndex ? 'selected' : ''}">${safe(choice)}</button>`).join('');
    element('vocabularyTestAnswers').querySelectorAll('button').forEach(button => button.onclick = () => {
      answers[index] = Number(button.dataset.choice);
      render();
    });
    element('vocabularyTestPrevious').disabled = index === 0;
    element('vocabularyTestNext').textContent = index === 19 ? 'Finish test ✓' : 'Next →';
  }

  function updateClock() {
    element('vocabularyTestClock').textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    if (seconds <= 0) finish();
    seconds--;
  }

  function start() {
    questions = buildQuestions();
    if (questions.length < 20) {
      alert('This course needs more unique questions before the Year Test can start.');
      return;
    }
    questions = questions.slice(0, 20);
    answers = Array(20).fill(null);
    index = 0;
    seconds = 1200;
    section.hidden = false;
    element('vocabularyTestBody').hidden = false;
    element('vocabularyTestResult').hidden = true;
    clearInterval(timer);
    updateClock();
    timer = setInterval(updateClock, 1000);
    render();
    section.scrollIntoView({behavior: 'smooth', block: 'start'});
  }

  function close() {
    clearInterval(timer);
    section.hidden = true;
    launch.scrollIntoView({behavior: 'smooth', block: 'center'});
    launch.focus();
  }

  function finish() {
    clearInterval(timer);
    let score = 0;
    questions.forEach((question, questionIndex) => {
      const chosen = answers[questionIndex] === null ? null : question.choices[answers[questionIndex]];
      if (String(chosen) === String(question.answer)) score++;
    });
    const percent = Math.round(score / 20 * 100);
    localStorage.setItem(`skillup-vocabulary-test-${year}`, JSON.stringify({score, total: 20, percent, date: new Date().toISOString()}));
    element('vocabularyTestBody').hidden = true;
    const result = element('vocabularyTestResult');
    result.hidden = false;
    result.innerHTML = `<span>FINAL MARK</span><strong>${score} / 20</strong><b>${percent}%</b><p>${percent >= 85 ? 'Excellent vocabulary knowledge!' : percent >= 70 ? 'Strong result. Review unfamiliar words before trying again.' : percent >= 50 ? 'Good effort. Return to Learn and Practice, then take another test.' : 'Spend more time in Learn and Practice before another test.'}</p><div class="vocabulary-test-actions"><button id="vocabularyTestReturn">Back to lessons</button><button class="primary" id="vocabularyTestAgain">New test</button></div>`;
    element('vocabularyTestReturn').onclick = close;
    element('vocabularyTestAgain').onclick = start;
  }

  launch.onclick = start;
  element('vocabularyTestClose').onclick = close;
  element('vocabularyTestPrevious').onclick = () => { if (index > 0) { index--; render(); } };
  element('vocabularyTestNext').onclick = () => { if (index < 19) { index++; render(); } else finish(); };
})();

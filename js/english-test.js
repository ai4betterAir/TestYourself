(() => {
  const host = document.querySelector('.english-workspace');
  const activity = document.getElementById('activityPanel');
  const lessonGrid = document.getElementById('lessonGrid');
  const workspaceHead = document.querySelector('.workspace-head');
  if (!host || !activity || !lessonGrid || !workspaceHead || typeof DATA === 'undefined') return;

  const shuffle = values => [...values].sort(() => Math.random() - .5);
  const safe = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let questions = [], answers = [], index = 0, timer = null, seconds = 1200;

  const startButton = document.createElement('button');
  startButton.type = 'button';
  startButton.className = 'english-test-launch';
  startButton.textContent = 'Take Year English Test · 20 questions';
  workspaceHead.appendChild(startButton);

  const panel = document.createElement('section');
  panel.className = 'english-test-panel';
  panel.hidden = true;
  panel.innerHTML = `
    <div class="english-test-top">
      <div><span>YEAR ENGLISH TEST</span><h2 id="englishTestTitle">20-question test</h2></div>
      <div class="english-test-clock" id="englishTestClock" aria-label="Time remaining">20:00</div>
    </div>
    <div id="englishTestBody">
      <div class="english-test-progress"><span id="englishTestCount">Question 1 of 20</span><i id="englishTestBar"></i></div>
      <span class="english-test-skill" id="englishTestSkill"></span>
      <div class="english-test-context" id="englishTestContext" hidden></div>
      <h3 id="englishTestQuestion"></h3>
      <div class="answers" id="englishTestAnswers"></div>
      <div class="english-test-actions">
        <button class="secondary" id="englishTestPrevious">← Previous</button>
        <button class="secondary" id="englishTestExit">Back to lessons</button>
        <button class="primary" id="englishTestNext">Next →</button>
      </div>
    </div>
    <div class="english-test-result" id="englishTestResult" role="status" aria-live="polite" hidden></div>`;
  host.appendChild(panel);

  const element = id => document.getElementById(id);

  function questionPools(year) {
    const reading = (DATA.reading[year] || []).flatMap(lesson => lesson.qs.map(question => ({
      skill: 'Reading', context: lesson.p, question: question[0], choices: question[1], answer: question[1][question[2]]
    })));
    const grammar = (DATA.grammar[year] || []).flatMap(lesson => lesson.qs.map(question => ({
      skill: 'Grammar', question: question[0], choices: question[1], answer: question[1][question[2]]
    })));
    const spelling = (DATA.spelling[year] || []).flatMap(lesson => lesson.words.map(word => {
      const choices = spellingVariants(word);
      return {skill: 'Spelling', question: 'Which spelling is correct?', choices, answer: word};
    }));
    return {reading, grammar, spelling};
  }

  function chooseQuestions(year) {
    const pools = questionPools(year);
    return shuffle([
      ...shuffle(pools.reading).slice(0, 8),
      ...shuffle(pools.grammar).slice(0, 6),
      ...shuffle(pools.spelling).slice(0, 6)
    ]).map(question => ({...question, choices: shuffle(question.choices)}));
  }

  function showCourse() {
    clearInterval(timer);
    panel.hidden = true;
    lessonGrid.hidden = false;
    activity.hidden = false;
    workspaceHead.scrollIntoView({behavior: 'smooth', block: 'start'});
  }

  function render() {
    const question = questions[index];
    element('englishTestCount').textContent = `Question ${index + 1} of ${questions.length}`;
    element('englishTestBar').style.width = `${((index + 1) / questions.length) * 100}%`;
    element('englishTestSkill').textContent = question.skill.toUpperCase();
    element('englishTestQuestion').textContent = question.question;
    const context = element('englishTestContext');
    context.hidden = !question.context;
    context.textContent = question.context || '';
    element('englishTestAnswers').innerHTML = question.choices.map((choice, choiceIndex) =>
      `<button type="button" data-choice="${choiceIndex}" class="${answers[index] === choiceIndex ? 'selected' : ''}">${safe(choice)}</button>`
    ).join('');
    element('englishTestAnswers').querySelectorAll('button').forEach(button => button.onclick = () => {
      answers[index] = Number(button.dataset.choice);
      render();
    });
    element('englishTestPrevious').disabled = index === 0;
    element('englishTestNext').textContent = index === questions.length - 1 ? 'Finish test ✓' : 'Next →';
  }

  function updateClock() {
    const minutes = Math.floor(seconds / 60);
    const remaining = String(seconds % 60).padStart(2, '0');
    element('englishTestClock').textContent = `${minutes}:${remaining}`;
    if (seconds <= 0) finish();
    seconds--;
  }

  function start() {
    questions = chooseQuestions(grade);
    if (questions.length !== 20) return;
    answers = Array(20).fill(null);
    index = 0;
    seconds = 1200;
    lessonGrid.hidden = true;
    activity.hidden = true;
    panel.hidden = false;
    element('englishTestBody').hidden = false;
    element('englishTestResult').hidden = true;
    element('englishTestTitle').textContent = `Year ${grade} English · 20 questions`;
    clearInterval(timer);
    updateClock();
    timer = setInterval(updateClock, 1000);
    render();
    panel.scrollIntoView({behavior: 'smooth', block: 'start'});
  }

  function finish() {
    clearInterval(timer);
    const bySkill = {};
    let score = 0;
    questions.forEach((question, questionIndex) => {
      const chosen = answers[questionIndex] === null ? null : question.choices[answers[questionIndex]];
      const correct = chosen === question.answer;
      score += correct ? 1 : 0;
      bySkill[question.skill] ||= {correct: 0, total: 0};
      bySkill[question.skill].total++;
      bySkill[question.skill].correct += correct ? 1 : 0;
    });
    const percent = Math.round(score / 20 * 100);
    localStorage.setItem(`skillup-english-test-${grade}`, JSON.stringify({score, total: 20, percent, date: new Date().toISOString()}));
    element('englishTestBody').hidden = true;
    const result = element('englishTestResult');
    result.hidden = false;
    result.innerHTML = `
      <span>FINAL MARK</span><strong>${score} / 20</strong><b>${percent}%</b>
      <p>${percent >= 85 ? 'Excellent English work!' : percent >= 70 ? 'Strong result. Review the weaker skill below.' : percent >= 50 ? 'Good effort. Review the lessons, then try again.' : 'Return to the lessons and practise before another test.'}</p>
      <div class="english-test-breakdown">${Object.entries(bySkill).map(([name, value]) => `<div><span>${name}</span><b>${value.correct}/${value.total}</b></div>`).join('')}</div>
      <div class="english-test-actions"><button class="secondary" id="englishTestReview">Back to lessons</button><button class="primary" id="englishTestAgain">New test</button></div>`;
    element('englishTestReview').onclick = showCourse;
    element('englishTestAgain').onclick = start;
  }

  startButton.onclick = start;
  element('englishTestExit').onclick = showCourse;
  element('englishTestPrevious').onclick = () => { if (index > 0) { index--; render(); } };
  element('englishTestNext').onclick = () => {
    if (index < questions.length - 1) { index++; render(); }
    else finish();
  };
})();

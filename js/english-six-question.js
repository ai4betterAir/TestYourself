(() => {
  if (typeof DATA === 'undefined' || typeof currentLessons !== 'function') return;

  const $ = id => document.getElementById(id);

  const questionData = question => {
    if (skill === 'spelling') {
      return {prompt: question.q, choices: question.c, answer: question.a, tip: question.hint};
    }
    return {prompt: question[0], choices: question[1], answer: question[1][question[2]], tip: question[3]};
  };

  const renderBatch = (items, type, summary) => {
    const host = $(type === 'reading' ? 'readingActivity' : 'quizActivity');
    const lessonData = currentLessons()[lesson];
    const list = document.createDocumentFragment();
    items.forEach((item, index) => {
      const q = questionData(item);
      const card = document.createElement('article');
      card.className = 'question-card';

      const meta = document.createElement('div');
      meta.className = 'question-meta';
      const number = document.createElement('span');
      number.textContent = `QUESTION ${index + 1} OF ${items.length}`;
      const label = document.createElement('b');
      label.textContent = type === 'reading'
        ? (index === items.length - 1 ? 'THINK ABOUT THE WHOLE TEXT' : 'FIND EVIDENCE')
        : (skill === 'spelling' ? 'SPELLING CHECK' : 'APPLY THE RULE');
      meta.append(number, label);

      const heading = document.createElement('h3');
      heading.textContent = q.prompt;
      const answers = document.createElement('div');
      answers.className = 'answers';
      const feedback = document.createElement('div');
      feedback.className = 'feedback';
      feedback.setAttribute('role', 'status');
      feedback.setAttribute('aria-live', 'polite');

      q.choices.forEach((choice, choiceIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = choice;
        button.onclick = () => {
          if (card.dataset.answered === 'true') return;
          card.dataset.answered = 'true';
          completed += 1;
          const correctIndex = q.choices.findIndex(value => String(value) === String(q.answer));
          const correct = choiceIndex === correctIndex;
          if (correct) {
            score += 1;
            button.classList.add('correct');
            feedback.textContent = type === 'reading' ? '✓ Correct — well read.' : '✓ Correct!';
          } else {
            button.classList.add('wrong');
            answers.children[correctIndex]?.classList.add('correct');
            feedback.textContent = type === 'reading'
              ? `Not quite. ${q.tip}`
              : `Not quite. Review the rule: ${q.tip}`;
          }
          [...answers.children].forEach(option => { option.disabled = true; });
          summary.textContent = completed === items.length
            ? `Practice complete: ${score} / ${items.length} correct.`
            : `${completed} of ${items.length} questions answered.`;
          if (completed === items.length) setDone(lesson);
        };
        answers.appendChild(button);
      });

      card.append(meta, heading, answers, feedback);
      list.appendChild(card);
    });
    return list;
  };

  let completed = 0;
  let score = 0;

  function renderReadingBatch() {
    showOnly('readingActivity');
    const current = currentLessons()[lesson];
    $('learnTitle').textContent = 'Reading strategy';
    $('learnText').textContent = current.learn;
    $('passageLevel').textContent = `YEAR ${grade} READING`;
    $('passageTitle').textContent = current.t;
    $('passageText').textContent = current.p;
    completed = 0;
    score = 0;
    const host = $('readingActivity');
    host.innerHTML = '';
    const passage = document.createElement('div');
    passage.className = 'passage-card';
    passage.innerHTML = `<span>YEAR ${grade} READING</span><h3></h3><p></p>`;
    passage.querySelector('h3').textContent = current.t;
    passage.querySelector('p').textContent = current.p;
    const help = document.createElement('p');
    help.className = 'batch-help';
    help.textContent = `Answer all ${current.qs.length} questions below. Each answer gives immediate feedback.`;
    const listWrap = document.createElement('div');
    listWrap.className = 'batch-question-list';
    const summary = document.createElement('div');
    summary.className = 'batch-summary';
    summary.setAttribute('role', 'status');
    summary.setAttribute('aria-live', 'polite');
    const list = renderBatch(current.qs, 'reading', summary);
    listWrap.appendChild(list);
    host.append(passage, help, listWrap, summary);
    window.__skillupEnglishBatchSummary = summary;
  }

  function renderQuizBatch() {
    showOnly('quizActivity');
    const current = currentLessons()[lesson];
    const items = skill === 'spelling' ? spellingQuestions(current) : current.qs;
    $('learnTitle').textContent = current.t;
    $('learnText').textContent = current.learn;
    completed = 0;
    score = 0;
    const host = $('quizActivity');
    host.innerHTML = '';
    const help = document.createElement('p');
    help.className = 'batch-help';
    help.textContent = `Answer all ${items.length} questions below. Each answer gives immediate feedback.`;
    const listWrap = document.createElement('div');
    listWrap.className = 'batch-question-list';
    const summary = document.createElement('div');
    summary.className = 'batch-summary';
    summary.setAttribute('role', 'status');
    summary.setAttribute('aria-live', 'polite');
    const list = renderBatch(items, 'quiz', summary);
    listWrap.appendChild(list);
    host.append(help, listWrap, summary);
    window.__skillupEnglishBatchSummary = summary;
  }

  const oldRenderActivity = renderActivity;
  renderActivity = function renderConsistentActivity() {
    if (skill === 'reading') renderReadingBatch();
    else if (skill === 'writing') oldRenderActivity();
    else renderQuizBatch();
  };

  renderAll();
})();

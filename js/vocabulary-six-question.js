(() => {
  const api = window.SKILLUP_VOCAB_API;
  if (!api || !document.getElementById('practice')) return;

  const $ = id => document.getElementById(id);
  const setSize = 6;
  let skillIndex = 0;
  let questions = [];

  const activeSkill = () => {
    const cards = [...document.querySelectorAll('#vocabGrid .skill-card')];
    const active = cards.findIndex(card => card.classList.contains('active'));
    return api.skills[Math.max(0, active < 0 ? skillIndex : active)][0];
  };

  const buildMarkup = () => {
    const practice = $('practice');
    const previousLevel = $('levelSelect')?.value || 'medium';
    practice.innerHTML = `
      <div class="practice-toolbar"><div><span id="skillTag">SYNONYMS</span><h2 id="practiceTitle">Vocabulary Challenge</h2></div>
        <label>Level <select id="levelSelect"><option value="easy">Easy</option><option value="medium" selected>Medium</option><option value="hard">Hard</option><option value="advanced">Advanced</option></select></label>
      </div>
      <div class="six-question-help">Answer all six questions below. Each answer gives immediate feedback.</div>
      <div class="six-question-set" id="sixQuestionSet"></div>
      <div class="six-question-summary" id="sixQuestionSummary" role="status" aria-live="polite"></div>
      <button id="newSet" class="vbtn secondary" type="button">↻ New set of 6</button>`;
    $('levelSelect').value = previousLevel;
  };

  const render = () => {
    const currentSkill = activeSkill();
    const skill = api.skills.find(item => item[0] === currentSkill) || api.skills[0];
    questions = Array.from({length: setSize}, () => api.makeQuestion(skill[0]));
    $('skillTag').textContent = skill[2].toUpperCase();
    $('practiceTitle').textContent = `${skill[2]} Challenge`;
    const host = $('sixQuestionSet');
    const summary = $('sixQuestionSummary');
    let answered = 0;
    let score = 0;
    host.innerHTML = '';
    summary.textContent = '';

    questions.forEach((question, questionIndex) => {
      const card = document.createElement('article');
      card.className = 'six-question-card';
      const number = document.createElement('span');
      number.className = 'six-question-number';
      number.textContent = `QUESTION ${questionIndex + 1} OF ${setSize}`;
      const heading = document.createElement('h3');
      heading.textContent = question.q;
      const answers = document.createElement('div');
      answers.className = 'six-answers';
      const feedback = document.createElement('p');
      feedback.className = 'six-question-feedback';
      feedback.setAttribute('role', 'status');
      feedback.setAttribute('aria-live', 'polite');

      question.c.forEach((choice, choiceIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = choice;
        button.onclick = () => {
          if (card.dataset.answered === 'true') return;
          card.dataset.answered = 'true';
          answered++;
          const correctIndex = question.c.indexOf(question.a);
          const correct = choiceIndex === correctIndex;
          if (correct) {
            score++;
            button.classList.add('correct');
            feedback.textContent = '✓ Correct! Great word work.';
          } else {
            button.classList.add('wrong');
            answers.children[correctIndex]?.classList.add('correct');
            feedback.textContent = `Not quite. The best answer is “${question.a}”.`;
          }
          [...answers.children].forEach(item => { item.disabled = true; });
          summary.textContent = answered === setSize
            ? `Set complete: ${score} / ${setSize} correct. Select “New set of 6” for more practice.`
            : `${answered} of ${setSize} questions answered.`;
        };
        answers.appendChild(button);
      });
      card.append(number, heading, answers, feedback);
      host.appendChild(card);
    });
  };

  const bind = () => {
    document.querySelectorAll('#vocabGrid .skill-card').forEach((card, index) => {
      card.addEventListener('click', () => { skillIndex = index; setTimeout(render, 0); });
    });
    $('levelSelect').addEventListener('change', render);
    $('newSet').addEventListener('click', render);
  };

  buildMarkup();
  bind();
  render();
})();

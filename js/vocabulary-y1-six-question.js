(() => {
  const sixShuffle = values => [...values].sort(() => Math.random() - 0.5);
  const makeQuestions = lesson => {
    const allWords = L.flatMap(item => item.w);
    return sixShuffle(lesson.w).slice(0, 6).map(word => {
      const distractors = sixShuffle(
        allWords.filter(item => item[0] !== word[0]).map(item => item[1])
      ).slice(0, 3);
      return {word: word[0], meaning: word[1], choices: sixShuffle([word[1], ...distractors])};
    });
  };

  show = function showSixQuestions(index) {
    const lesson = L[index];
    document.getElementById('title').textContent = `Lesson ${lesson.n}: ${lesson.t}`;
    tabs.querySelectorAll('button').forEach((button, buttonIndex) => {
      button.classList.toggle('active', buttonIndex === index);
      button.setAttribute('aria-pressed', buttonIndex === index ? 'true' : 'false');
    });

    box.innerHTML = `<div class="story-text">${lesson.s}</div><h2>New Words</h2><div class="words">${lesson.w.map(word => `<div class="word"><strong>${word[0]}</strong>${word[1]}</div>`).join('')}</div><div class="quiz"><h2>Quick Practice · 6 Questions</h2><p class="six-question-help">Answer all six questions below. Each answer gives immediate feedback.</p><div class="lesson-question-set" id="sixQuestionSet"></div><div class="six-question-summary" id="sixQuestionSummary" role="status" aria-live="polite"></div><button class="vbtn secondary" id="newSixQuestionSet" type="button">New set of 6 ↻</button></div>`;

    const renderSet = () => {
      const questions = makeQuestions(lesson);
      const host = document.getElementById('sixQuestionSet');
      const summary = document.getElementById('sixQuestionSummary');
      let answered = 0;
      let score = 0;
      host.innerHTML = '';
      summary.textContent = '';

      questions.forEach((question, questionIndex) => {
        const card = document.createElement('article');
        card.className = 'lesson-question';
        const number = document.createElement('span');
        number.className = 'lesson-question-number';
        number.textContent = `QUESTION ${questionIndex + 1} OF 6`;
        const heading = document.createElement('h3');
        heading.textContent = `What does “${question.word}” mean?`;
        const choices = document.createElement('div');
        choices.className = 'choices';
        const feedback = document.createElement('p');
        feedback.className = 'lesson-question-feedback';
        feedback.setAttribute('role', 'status');
        feedback.setAttribute('aria-live', 'polite');

        question.choices.forEach(choice => {
          const button = document.createElement('button');
          button.type = 'button';
          button.textContent = choice;
          button.onclick = () => {
            if (card.dataset.answered === 'true') return;
            card.dataset.answered = 'true';
            answered++;
            const correct = choice === question.meaning;
            if (correct) {
              score++;
              button.classList.add('correct');
              feedback.textContent = '✓ Correct! Great reading.';
            } else {
              button.classList.add('wrong');
              [...choices.children].find(item => item.textContent === question.meaning)?.classList.add('correct');
              feedback.textContent = `Not quite. The answer is “${question.meaning}”.`;
            }
            [...choices.children].forEach(item => { item.disabled = true; });
            summary.textContent = answered === questions.length
              ? `Set complete: ${score} / 6 correct. Select “New set of 6” for more practice.`
              : `${answered} of 6 questions answered.`;
          };
          choices.appendChild(button);
        });

        card.appendChild(number);
        card.appendChild(heading);
        card.appendChild(choices);
        card.appendChild(feedback);
        host.appendChild(card);
      });
    };

    renderSet();
    document.getElementById('newSixQuestionSet').onclick = renderSet;
  };

  show(0);
})();

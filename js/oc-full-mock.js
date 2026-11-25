(() => {
  const sections = [
    { name: 'Reading', count: 14, minutes: 40, bank: window.SKILLUP_READING },
    { name: 'Mathematical Reasoning', count: 35, minutes: 40, bank: window.TY_YEAR4 },
    { name: 'Thinking Skills', count: 30, minutes: 30, bank: window.SKILLUP_THINKING }
  ];
  const byId = id => document.getElementById(id);
  const session = byId('session');
  const paper = byId('paper');
  const next = byId('next');
  let sectionIndex = 0;
  let index = 0;
  let deadline = 0;
  let timer;
  let questions = [];
  let answers = [];
  const completed = [];

  function add(parent, tag, content) {
    const element = document.createElement(tag);
    element.textContent = content;
    parent.append(element);
    return element;
  }
  function displayQuestion() {
    const section = sections[sectionIndex];
    const q = questions[index];
    byId('exam-title').textContent = section.name + ' · Question ' + (index + 1) + ' of ' + questions.length;
    paper.replaceChildren();
    add(paper, 'p', q.text);
    if (q.image) {
      const image = document.createElement('img');
      image.src = q.image;
      image.alt = q.imageAlt || 'Reasoning diagram';
      image.style.maxWidth = '100%';
      paper.append(image);
    }
    q.choices.forEach(choice => {
      const label = add(paper, 'label', String(choice));
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'response';
      radio.checked = answers[index] === choice;
      radio.onchange = () => { answers[index] = choice; };
      label.prepend(radio);
    });
    byId('previous').disabled = index === 0;
    next.textContent = index === questions.length - 1 ? 'Finish section' : 'Next question';
  }
  function tick() {
    const left = Math.ceil((deadline - Date.now()) / 1000);
    if (left <= 0) return finishSection();
    byId('clock').textContent = 'Time remaining · ' + Math.floor(left / 60) + ':' + String(left % 60).padStart(2,'0');
  }
  function startSection() {
    const section = sections[sectionIndex];
    const unique = new Map();
    for (let attempts = 0; unique.size < section.count && attempts < 3000; attempts++) {
      const q = section.bank.question('mixed');
      if (q.choices.some(choice => String(choice) === String(q.answer))) unique.set(q.text, q);
    }
    questions = [...unique.values()];
    answers = Array(questions.length).fill(null);
    index = 0;
    deadline = Date.now() + section.minutes * 60000;
    next.hidden = byId('previous').hidden = false;
    next.onclick = () => {
      if (index === questions.length - 1) return finishSection();
      index++;
      displayQuestion();
    };
    displayQuestion();
    tick();
    timer = setInterval(tick, 1000);
  }
  function finishSection() {
    clearInterval(timer);
    completed.push({ questions, answers });
    sectionIndex++;
    byId('previous').hidden = true;
    byId('clock').textContent = '';
    paper.replaceChildren();
    if (sectionIndex < sections.length) {
      byId('exam-title').textContent = sections[sectionIndex - 1].name + ' complete';
      add(paper, 'p', 'Your next section is ' + sections[sectionIndex].name + '. Its timer starts when you are ready.');
      next.textContent = 'Start ' + sections[sectionIndex].name;
      next.onclick = startSection;
      return;
    }
    byId('exam-title').textContent = 'Your mock exam results';
    completed.forEach((part, i) => {
      const score = part.questions.filter((q, j) => String(part.answers[j]) === String(q.answer)).length;
      add(paper, 'h3', sections[i].name + ' · ' + score + ' / ' + part.questions.length);
      part.questions.forEach((q,j) => {
        const row = add(paper, 'details', '');
        add(row, 'summary', 'Question ' + (j + 1) + ' · ' + (String(part.answers[j]) === String(q.answer) ? 'Correct' : 'Review'));
        add(row, 'p', q.text);
        if(q.image){const diagram=document.createElement('img');diagram.src=q.image;diagram.alt=q.imageAlt||'Question diagram';diagram.style.maxWidth='100%';row.append(diagram);}
        if(q.explanation||q.tip)add(row,'p',q.explanation||q.tip);
        add(row, 'p', 'Your answer: ' + (part.answers[j] ?? 'Unanswered'));
        add(row, 'p', 'Correct answer: ' + q.answer);
      });
    });
    next.hidden = true;
    byId('begin').hidden = false;
    byId('begin').textContent = 'Start another mock exam';
  }
  byId('previous').onclick = () => { if (index > 0) { index--; displayQuestion(); } };
  byId('begin').onclick = () => {
    completed.length = 0;
    sectionIndex = 0;
    byId('begin').hidden = true;
    session.hidden = false;
    startSection();
    session.focus();
    session.scrollIntoView();
  };
})();

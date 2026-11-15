const sample = document.querySelector('form[data-correct]');
const feedback = sample.querySelector('[role=status]');
sample.addEventListener('change', () => { feedback.textContent = ''; });
sample.addEventListener('submit', event => {
  event.preventDefault();
  const correct = new FormData(sample).get('choice') === sample.dataset.correct;
  feedback.textContent = correct ? 'Correct! ' + sample.dataset.explanation : 'Try again. Look for a clue in the question.';
});

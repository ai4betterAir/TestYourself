// Shared, year-matched question selection for family homework.
const loads = new Map();
const load = path => {
  if (!loads.has(path)) loads.set(path, new Promise((resolve, reject) => {
    const script = document.createElement('script'); script.src = path;
    script.onload = resolve; script.onerror = () => { loads.delete(path); reject(new Error('Could not load the question bank. Please try again.')); };
    document.head.append(script);
  }));
  return loads.get(path);
};
export const subjects = ['Maths', 'English', 'Science'];
const sample = list => list[Math.floor(Math.random() * list.length)];
const shuffle = list => {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
};
const kindyEnglish = [
  ['letters', 'Letters and sounds', [
    ['Which letter starts the word sun?', 's', ['s', 'm', 't']],
    ['Which word starts with b?', 'ball', ['ball', 'sun', 'cat']],
    ['Which letter starts the word dog?', 'd', ['d', 'b', 's']],
    ['Which word starts with m?', 'moon', ['moon', 'cat', 'dog']]
  ]],
  ['rhyming', 'Rhyming words', [
    ['Which word rhymes with cat?', 'hat', ['hat', 'dog', 'sun']],
    ['Which word rhymes with sun?', 'run', ['run', 'cat', 'bed']],
    ['Which word rhymes with bed?', 'red', ['red', 'dog', 'hat']],
    ['Which word rhymes with dog?', 'log', ['log', 'sun', 'bed']]
  ]],
  ['reading', 'Simple reading', [
    ['Mia has a red hat. What colour is the hat?', 'red', ['red', 'blue', 'green']],
    ['The cat is on the mat. Where is the cat?', 'on the mat', ['on the mat', 'in a box', 'on a bed']],
    ['Sam has two dogs. How many dogs does Sam have?', 'two', ['two', 'one', 'three']],
    ['The dog can run. What can the dog do?', 'run', ['run', 'read', 'write']]
  ]]
];
function normalise(q, topic) {
  const choices = [...new Set((q.choices || q.options).map(String))];
  const answer = String(q.answer);
  if (!q.text || choices.length < 2 || !choices.includes(answer)) throw new Error('This question is unavailable. Choose another topic.');
  const shuffled = shuffle(choices);
  return {text: q.text, passage: q.passage || '', choices: shuffled, answer: shuffled.indexOf(answer), hint: q.tip || q.hint || q.explanation || '', topic};
}
export async function getHomeworkBank(year, subject) {
  if (!['K','1','2','3','4','5','6'].includes(year) || !subjects.includes(subject)) throw new Error('Choose a valid school year and subject.');
  if (subject === 'Maths') {
    for (const file of ['year1-bank', 'year1-wordproblems', 'year3to5-bank', 'year4-bank', 'year2-bank', 'year6-bank', 'kindy-bank', 'question-quality-fixes']) await load('js/' + file + '.js');
    const bank = year === 'K' ? window.KINDY_MATHS : year === '1' ? window.TY_YEAR1 : year === '2' ? window.TY_YEAR2 : year === '6' ? window.TY_YEAR6 : window.TY_YEARS345;
    const topics = (['3','4','5'].includes(year) ? bank.topics[year] : bank.topics).filter(t => !/mixed/i.test(t[0])).map(t => ({id:t[0], label:t[2]}));
    return {topics, question: id => normalise(['3','4','5'].includes(year) ? bank.question(year, id) : bank.question(id), id)};
  }
  if (subject === 'Science') {
    await load('js/science-bank.js');
    const questions = window.SKILLUP_SCIENCE[year];
    return {topics:[...new Set(questions.map(q => q.topic))].map(id => ({id, label:id})), question:id => normalise(sample(questions.filter(q => q.topic === id)), id)};
  }
  if (year === 'K') return {topics:kindyEnglish.map(([id,label]) => ({id,label})), question:id => {
    const [text, answer, choices] = sample(kindyEnglish.find(t => t[0] === id)[2]);
    return normalise({text, answer, choices, hint:'Say the words slowly, or reread the sentence.'}, id);
  }};
  await load('js/english-data.js');
  // DATA is the same classic-script lexical binding used by the English course.
  const data = DATA;
  const pool = [];
  for (const skill of ['reading','grammar','spelling']) {
    for (const [index, lesson] of (data[skill][year] || []).entries()) {
      const id = skill + ':' + index;
      let questions;
      if (skill === 'spelling') questions = lesson.words.map(word => {
        const variants = [word, word + word.slice(-1), word.slice(1), word + 'e'];
        return {text:'Which spelling is correct?', answer:word, choices:variants, hint:lesson.learn};
      });
      else questions = (lesson.qs || []).map(q => ({text:q[0], choices:q[1], answer:q[1][q[2]], hint:q[3], passage:lesson.p || ''}));
      if (questions.length) pool.push({id, label:skill[0].toUpperCase() + skill.slice(1) + ' · ' + (lesson.t || lesson.title), questions});
    }
  }
  return {topics:pool.map(({id,label}) => ({id,label})), question:id => normalise(sample(pool.find(t => t.id === id).questions), id)};
}
export function makeHomework(bank, topicIds, count) {
  if (![10,20].includes(count) || !topicIds.length || topicIds.some(id => !bank.topics.some(t => t.id === id))) throw new Error('Choose at least one available topic.');
  const questions = [], seen = new Set(); let attempts = 0;
  // Cycle through the chosen topics so every selected topic is represented.
  while (questions.length < count && attempts++ < count * 35) {
    const id = topicIds[questions.length % topicIds.length], question = bank.question(id);
    const key = question.topic + '|' + question.text + '|' + question.passage;
    if (seen.has(key) && attempts < count * 15) continue;
    seen.add(key); questions.push(question);
  }
  if (questions.length !== count) throw new Error('Could not prepare this question set. Please try again.');
  return shuffle(questions);
}

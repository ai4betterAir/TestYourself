import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function domContext() {
  const elements = new Map();
  const makeElement = () => ({
    innerHTML: '', textContent: '', value: 'medium', hidden: false, disabled: false,
    style: {}, dataset: {}, children: [],
    classList: {add() {}, remove() {}, toggle() {}, contains() { return false; }},
    appendChild(child) { this.children.push(child); return child; },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    setAttribute() {}, addEventListener() {}, scrollIntoView() {}
  });
  const document = {
    getElementById(id) { if (!elements.has(id)) elements.set(id, makeElement()); return elements.get(id); },
    querySelectorAll() { return []; },
    querySelector() { return null; },
    createElement() { return makeElement(); },
    head: makeElement(), body: makeElement()
  };
  const storage = new Map();
  const context = {
    window: {}, document, console,
    localStorage: {getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value)},
    location: {search: '', pathname: '/'},
    history: {replaceState() {}},
    URLSearchParams, setInterval, clearInterval, setTimeout, clearTimeout,
    alert() {}, matchMedia: () => ({matches: false})
  };
  context.window = context;
  vm.createContext(context);
  return context;
}

function run(relative, context) {
  vm.runInContext(fs.readFileSync(path.join(root, relative), 'utf8'), context, {filename: relative});
}

for (const [relative, expected] of [
  ['js/vocabulary-y3.js', 14], ['js/vocabulary-y4.js', 25],
  ['js/vocabulary-y5.js', 12], ['js/vocabulary-y6.js', 12]
]) {
  const context = domContext();
  run(relative, context);
  const api = context.SKILLUP_VOCAB_API;
  if (!api?.skills || typeof api.makeQuestion !== 'function') {
    failures.push(`${relative}: test API is unavailable`);
    continue;
  }
  if (api.skills.length < expected) failures.push(`${relative}: expected at least ${expected} skills, found ${api.skills.length}`);
  let valid = 0;
  for (const skill of api.skills) {
    const id = Array.isArray(skill) ? skill[0] : skill.id;
    for (let sample = 0; sample < 30; sample++) {
      const question = api.makeQuestion(id);
      const choices = question?.c || question?.choices || [];
      const answer = question?.a ?? question?.answer;
      if (question && choices.length >= 2 && choices.map(String).includes(String(answer))) valid++;
    }
  }
  if (valid < api.skills.length * 25) failures.push(`${relative}: too many invalid test questions (${valid} valid)`);
  const skillIds = api.skills.map(skill => Array.isArray(skill) ? skill[0] : skill.id);
  for (const type of ['context', 'cloze']) {
    if (!skillIds.includes(type)) continue;
    const prompts = new Set(Array.from({length: 100}, () => api.makeQuestion(type)?.q));
    if (prompts.size < 4) failures.push(`${relative}: ${type} questions need more varied, meaningful prompts (found ${prompts.size})`);
  }
}

for (const [relative, fragment] of [
  ['js/vocabulary-y3.js', 'The story says the character was'],
  ['js/vocabulary-y4.js', 'The class had an ${w[0]} to take part'],
  ['js/vocabulary-y5.js', 'described the situation as “${row[0]}”'],
  ['js/vocabulary-y6.js', 'The ${row[0]} student showed this quality']
]) {
  if (fs.readFileSync(path.join(root, relative), 'utf8').includes(fragment)) failures.push(`${relative}: generic context template remains`);
}

{
  const context = domContext();
  run('js/vocabulary-y2.js', context);
  vm.runInContext('window.__COURSE=LESSONS', context);
  const words = context.__COURSE.flatMap(lesson => lesson.words);
  if (context.__COURSE.length !== 12 || words.length !== 120) failures.push(`Year 2 Vocabulary: expected 12 lessons and 120 words, found ${context.__COURSE.length} and ${words.length}`);
  const practiceQuestions = context.document.getElementById('questionList').children;
  if (practiceQuestions.length !== 6) failures.push(`Year 2 Vocabulary: expected 6 visible practice questions, found ${practiceQuestions.length}`);
}

{
  const context = domContext();
  run('js/vocabulary-y1-stories.js', context);
  run('js/vocabulary-y1-stories-31-40.js', context);
  run('js/vocabulary-y1-stories-11-20.js', context);
  vm.runInContext('window.__COURSE=L', context);
  const words = context.__COURSE.flatMap(lesson => lesson.w);
  if (context.__COURSE.length < 20 || words.length < 160) failures.push(`Year 1 Vocabulary: insufficient course material for a 20-question test`);
}

{
  const context = domContext();
  run('js/vocabulary-y4-reading.js', context);
  const course = context.SKILLUP_Y4_READING_LESSONS;
  const words = course?.flatMap(lesson => lesson.w) || [];
  if (course?.length !== 26 || words.length !== 130) failures.push(`Year 4 Reading Vocabulary: expected 26 lessons and 130 words`);
}

{
  const context = {window: {}, document: {getElementById() { return null; }}, Event: class Event {}};
  vm.createContext(context);
  const firstLine = fs.readFileSync(path.join(root, 'js/english-course.js'), 'utf8').split('\n')[0];
  vm.runInContext(firstLine, context);
  run('js/english-course-expansion.js', context);
  vm.runInContext('window.__DATA=DATA', context);
  for (const year of ['1','2','3','4','5','6']) {
    const yearData = Object.fromEntries(Object.entries(context.window.__DATA).map(([skill, years]) => [skill, years[year]]));
    const counts = Object.fromEntries(Object.entries(yearData).map(([skill, lessons]) => [skill, lessons.length]));
    if (counts.reading < 6 || counts.grammar < 7 || counts.spelling < 8 || counts.writing < 6) {
      failures.push(`Year ${year} English: expected at least 27 lessons; found ${JSON.stringify(counts)}`);
    }
    const reading = yearData.reading.reduce((total, lesson) => total + lesson.qs.length, 0);
    const grammar = yearData.grammar.reduce((total, lesson) => total + lesson.qs.length, 0);
    const spelling = yearData.spelling.reduce((total, lesson) => total + lesson.words.length, 0);
    if (reading < 8 || grammar < 6 || spelling < 6) failures.push(`Year ${year} English: insufficient balanced test pool`);
    for (const [skill, lessons] of Object.entries(yearData)) {
      const titles = lessons.map(lesson => lesson.title || lesson.t);
      if (new Set(titles).size !== titles.length) failures.push(`Year ${year} ${skill}: duplicate lesson title`);
      for (const lesson of lessons) {
        if (!(lesson.title || lesson.t) || (skill !== 'writing' && !lesson.learn)) failures.push(`Year ${year} ${skill}: lesson missing title or teaching note`);
        for (const question of lesson.qs || []) {
          const [prompt, choices, answer] = question;
          if (!prompt || choices?.length !== 4 || !Number.isInteger(answer) || answer < 0 || answer > 3) failures.push(`Year ${year} ${skill}: invalid question structure in ${lesson.t}`);
          if (choices && new Set(choices.map(choice => String(choice).trim())).size !== choices.length) failures.push(`Year ${year} ${skill}: duplicate choices in ${lesson.t}`);
        }
        if (skill === 'spelling' && (lesson.words?.length !== 5 || new Set(lesson.words.map(word => word.toLowerCase())).size !== 5)) failures.push(`Year ${year} spelling: invalid word set in ${lesson.t}`);
        if (skill === 'writing' && (lesson.plan?.length !== 3 || lesson.check?.length !== 4 || !lesson.goal || !lesson.prompt)) failures.push(`Year ${year} writing: incomplete guidance in ${lesson.title}`);
      }
    }
  }
}

const ordering = {
  'practice.html': ['js/year5-tests.js', 'js/question-quality-fixes.js', 'js/practice.js', 'js/site-shell.js'],
  'selective-practice.html': ['js/year5-tests.js', 'js/question-quality-fixes.js', 'js/selective-practice.js', 'js/site-shell.js'],
  'english-practice.html': ['js/english-course.js', 'js/english-course-expansion.js', 'js/english-test.js', 'js/site-shell.js'],
  'vocabulary-year4-reading.html': ['js/vocabulary-y4-reading.js', 'js/vocabulary-test.js', 'js/site-shell.js']
};
for (const [relative, scripts] of Object.entries(ordering)) {
  const html = fs.readFileSync(path.join(root, relative), 'utf8');
  let previous = -1;
  for (const script of scripts) {
    const position = html.indexOf(script);
    if (position < 0 || position <= previous) failures.push(`${relative}: incorrect script order for ${script}`);
    previous = position;
  }
}

if (failures.length) {
  console.error(`Course test validation failed with ${failures.length} issue(s):`);
  failures.forEach(failure => console.error(` - ${failure}`));
  process.exit(1);
}

console.log('✓ English and Vocabulary test pools, generator APIs and script ordering passed.');

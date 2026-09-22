import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const context = {window: {}, console};
vm.createContext(context);

for (const relative of [
  'js/year1-bank.js', 'js/year3to5-bank.js', 'js/year4-bank.js',
  'js/year3-mathletics.js', 'js/year2-bank.js', 'js/year5-tests.js',
  'js/year6-bank.js', 'js/question-quality-fixes.js'
]) {
  vm.runInContext(fs.readFileSync(path.join(root, relative), 'utf8'), context, {filename: relative});
}

const failures = [];
let generated = 0;
const topicId = topic => Array.isArray(topic) ? topic[0] : topic.id || topic.key || topic.slug || topic.name;

function validate(question, label) {
  generated++;
  if (!question || typeof question !== 'object') {
    failures.push(`${label}: generator did not return a question object`);
    return;
  }
  const choices = question.choices || question.options || [];
  const answer = question.answer ?? question.correctAnswer ?? question.correct;
  const text = String(question.text || question.question || question.q || '');
  const unique = new Set(choices.map(String));
  if (choices.length < 2) failures.push(`${label}: fewer than two choices — ${text}`);
  if (unique.size !== choices.length) failures.push(`${label}: duplicate choices — ${text}`);
  if (!unique.has(String(answer))) failures.push(`${label}: answer missing from choices — ${text}`);
  if (/word form/i.test(text) && /^[\d,.$\s-]+$/.test(String(answer))) failures.push(`${label}: word-form answer is numeric — ${text}`);
  const equalGroups = text.match(/^([\d,]+) books are packed equally into (\d+) boxes/i);
  if (equalGroups && Number(equalGroups[1].replace(/,/g, '')) % Number(equalGroups[2]) !== 0) failures.push(`${label}: equal grouping is not divisible — ${text}`);
  if (/How much remains/i.test(text) && /^\$-/.test(String(answer))) failures.push(`${label}: unintended negative money answer — ${text}`);
}

const simpleApis = ['TY_YEAR1', 'TY_YEAR2', 'TY_YEAR4', 'TY_YEAR3_MATHLETICS', 'TY_YEAR5_TESTS', 'TY_YEAR6'];
for (const name of simpleApis) {
  const api = context.window[name];
  if (!api?.topics || typeof api.question !== 'function') continue;
  for (const topic of api.topics) {
    const id = topicId(topic);
    if (!id) continue;
    for (let sample = 0; sample < 600; sample++) validate(api.question(id), `${name}/${id}`);
  }
}

const multi = context.window.TY_YEARS345;
if (multi?.topics && typeof multi.question === 'function') {
  for (const grade of ['3', '4', '5']) {
    for (const topic of multi.topics[grade] || []) {
      const id = topicId(topic);
      if (!id) continue;
      for (let sample = 0; sample < 600; sample++) validate(multi.question(grade, id), `TY_YEARS345/${grade}/${id}`);
    }
  }
}

if (failures.length) {
  console.error(`Question validation failed with ${failures.length} issue(s) across ${generated.toLocaleString()} generated questions.`);
  failures.slice(0, 20).forEach(failure => console.error(` - ${failure}`));
  process.exit(1);
}

console.log(`✓ ${generated.toLocaleString()} generated questions passed structural and targeted semantic checks.`);

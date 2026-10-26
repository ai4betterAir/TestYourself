import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context=vm.createContext({window:{}});
for(const file of ['js/selective-visual-bank.js','js/selective-thinking-bank.js']){
  vm.runInContext(fs.readFileSync(file,'utf8'),context,{filename:file});
}
const visuals=context.window.SKILLUP_VISUAL;
assert.equal(visuals.questions.length,110,'Exactly 110 original visual questions are required');
assert.equal(new Set(visuals.questions.map(q=>q.id)).size,110,'Question IDs must be unique');
const groups=new Map();
for (const q of visuals.questions){
  groups.set(q.subtype,(groups.get(q.subtype)||0)+1);
  assert.equal(q.topic,'visual');
  assert.deepEqual(Array.from(q.choices),['A','B','C','D']);
  assert.ok(q.choices.includes(q.answer),q.id+' missing answer');
  assert.ok(q.imageAlt.length>=45,q.id+' requires a substantial alt description');
  assert.ok(q.tip.length>=20,q.id+' missing explanation');
  assert.ok(/^assets\/selective\/thinking\/TS-(?:VIS|CUBE|OCS|OCM|OCP|OCO|OCC)-\d{3}\.svg$/.test(q.image),q.id+' invalid path');
  assert.ok(fs.existsSync(q.image),q.id+' missing SVG');
  const svg=fs.readFileSync(q.image,'utf8');
  assert.ok(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'),q.id+' invalid SVG header');
  assert.ok(svg.includes('</svg>'),q.id+' missing SVG closing tag');
  assert.ok(!/<(?:image|script|foreignObject)\b/i.test(svg),q.id+' embeds unsafe content');
}
assert.equal(groups.size,11,'Expected eleven visual reasoning styles');
for(const [type,count] of groups)assert.equal(count,10,type+' must have ten questions');
assert.ok(context.window.SKILLUP_THINKING.topics.some(t=>t[0]==='visual'),'Visual topic not linked to Thinking Skills');
assert.ok(context.window.SKILLUP_THINKING.topics.some(t=>t[0]==='cube'),'Cube topic not linked to Thinking Skills');
for(let i=0;i<100;i++){
  const q=context.window.SKILLUP_THINKING.question('visual',i%2?'5':'6');
  assert.ok(q.image&&q.choices.includes(q.answer),'Thinking Skills bank must return image questions');
}
const html=fs.readFileSync('selective-practice.html','utf8');
for(const id of ['questionFigure','questionImage','mockQuestionFigure','mockQuestionImage'])assert.ok(html.includes('id="'+id+'"'),id+' missing from HTML');
const script=fs.readFileSync('js/selective-practice.js','utf8');
assert.ok(script.includes("renderVisual('questionFigure'"),'Practice image display missing');
assert.ok(script.includes("renderVisual('mockQuestionFigure'"),'Mock image display missing');
console.log('Passed: 110 SVG puzzles, eleven categories, accessible alt text and practice/mock integration.');

import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const sandbox=vm.createContext({window:{}});
for(const path of ['js/science-bank.js','js/science-visuals-2026.js']){
 vm.runInContext(fs.readFileSync(path,'utf8'),sandbox,{filename:path});
}
const original=sandbox.window.SKILLUP_SCIENCE, V=sandbox.window.SKILLUP_SCIENCE_VISUALS;
assert.ok(V&&original,'Science data/diagram bank missing');
const gradeTopics={};
for(const year of ['K','1','2','3','4','5','6']){
 const base=original[year],added=V.enrich(year);
 assert.equal(base.length,20,'Original year question count changed');
 assert.ok(added.length>=5,'Missing additional illustrated questions in '+year);
 const all=[...base,...added];
 const topics=[...new Set(all.map(q=>q.topic))];
 gradeTopics[year]=topics;
 for(const q of all){
  assert.equal(q.options.length,4,'Expected four options: '+year+' '+q.text);
  assert.equal(new Set(q.options).size,4,'Duplicated options: '+year+' '+q.text);
  assert.ok(q.options.includes(q.answer),'Answer missing: '+year+' '+q.text);
  assert.ok(q.explanation.length>=14,'Explanation too short: '+q.text);
  const visual=V.illustrate(q);
  assert.ok(visual.svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'),q.text);
  assert.ok(visual.svg.endsWith('</svg>'),q.text);
  assert.ok(visual.svg.length>250,'Empty drawing');
  assert.ok(visual.alt.length>38,'Missing useful alt text');
  assert.ok(!/<(?:script|foreignObject|image)\b/i.test(visual.svg),'Unsafe SVG');
 }
 for(const topic of topics){
  const subset=all.filter(q=>q.topic===topic);
  assert.ok(subset.length>=2,'Topic needs more than one different question: '+year+' '+topic);
  assert.ok(V.thumbnail(topic).startsWith('<svg'));
  assert.ok(V.description(topic).length>20);
 }
 console.log('Science grade',year,'passed: '+all.length+' original questions in '+topics.length+' topics');
}
const pattern=[...original['3'],...V.enrich('3')].filter(q=>q.topic==='Patterns in nature');
assert.ok(pattern.length>=10,'Year 3 Patterns in nature needs 10+ distinct questions');
assert.equal(new Set(pattern.map(q=>q.text)).size,pattern.length,'Patterns questions repeated');
assert.ok(new Set(pattern.map(q=>V.illustrate(q).svg)).size>=7,'Too few visual types in Patterns in nature');
const html=fs.readFileSync('science-practice.html','utf8'),js=fs.readFileSync('js/science-practice.js','utf8');
for(const id of ['questionImage','questionFigure','testImage','testFigure','practiceExplanation','yearSelect','testQuestionTotal','notebookArt']){
 assert.ok(html.includes('id="'+id+'"'),id+' missing from page');
}
assert.ok(js.includes("const seen=new Set()"),'Question-set deduplication absent');
assert.ok(js.includes("uri.searchParams.set('topic',t)"),'Topic links not retained');
assert.ok(js.includes("document.createElement('details')"),'Accessible review not present');
console.log('Year 3 Patterns in nature: '+pattern.length+' non-repeating questions with original illustrations');

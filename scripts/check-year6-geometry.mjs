import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const ctx=vm.createContext({window:{}});
vm.runInContext(fs.readFileSync('js/geometry-visuals.js','utf8'),ctx);
const bank=ctx.window.SKILLUP_GEOMETRY;
const families=[
 'Year 6 supplementary angles','Year 6 vertically opposite angles',
 'Year 6 regular polygon interior angles','Year 6 regular polygon exterior angles',
 'Year 6 composite shape area','Year 6 shaded region area',
 'Year 6 surface area of prisms','Year 6 prism volume','Year 6 cube nets',
 'Year 6 counting unit cubes','Year 6 coordinate reflection',
 'Year 6 coordinate translation','Year 6 circle circumference'
];
const routes=[
 'geometry','angles','symmetry','coordinates','perimeterarea','volume',
 'solids','circles','scale','y6polygons','y6angles','y6nets','y6composite','y6blocks','y6surface'
];
let observed=new Set();
for(const topic of routes){
 assert.ok(bank.hasTopic('6',topic),'Missing Year 6 topic '+topic);
 for(let i=0;i<130;i++){
  const q=bank.question('6',topic);
  assert.ok(families.includes(q.geometryFamily),'Incorrect Year 6 family '+q.geometryFamily);
  observed.add(q.geometryFamily);
  assert.equal(q.choices.length,4,topic);
  assert.equal(new Set(q.choices).size,4,'Duplicated answers '+topic);
  assert.ok(q.choices.includes(q.answer),'Answer missing from options '+topic);
  assert.ok(q.diagramSvg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'));
  assert.ok(q.diagramSvg.endsWith('</svg>'));
  assert.ok(q.diagramSvg.length>600&&q.imageAlt.length>=35);
  assert.ok(q.tip.length>18&&q.explanation.length>20);
  assert.ok(!/<(?:script|foreignObject|image)\b/i.test(q.diagramSvg));
  if(q.geometryFamily==='Year 6 cube nets'){
    const face=q.text.match(/face ([A-F])\?/)[1];
    assert.equal(q.answer,{A:'C',B:'D',E:'F'}[face],'Cube net opposite faces are incorrect');
  }
  if(q.geometryFamily==='Year 6 regular polygon exterior angles'){
    const sides=Number(q.text.match(/regular (\d+)-sided/)[1]);
    assert.equal(q.answer,`${360/sides}°`);
  }
  if(q.geometryFamily==='Year 6 regular polygon interior angles'){
    const sides=Number(q.text.match(/regular (\d+)-sided/)[1]);
    assert.equal(q.answer,`${(sides-2)*180/sides}°`);
  }
 }
 console.log('Year 6 original figures passed:',topic);
}
assert.deepEqual([...observed].sort(),families.sort(),'Some figure types not generated');
for(const topic of ['geometry','angles','perimeterarea']){
 for(let i=0;i<25;i++){
  const q=bank.question('5',topic);
  assert.ok(!q.geometryFamily.startsWith('Year 6'),'Year 5 question bank has changed');
 }
}
assert.equal(bank.hasTopic('5','y6nets'),false,'Year 6 advanced topic leaked to Year 5');
console.log('All 13 Year 6 figure families verified; younger year isolation verified.');

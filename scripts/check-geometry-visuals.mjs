import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const context=vm.createContext({window:{}});
vm.runInContext(fs.readFileSync('js/geometry-visuals.js','utf8'),context,{filename:'js/geometry-visuals.js'});
const api=context.window.SKILLUP_GEOMETRY;
assert.ok(api && api.question);
const grades=[
 ['1',['shapes2d','shapes3d','position']],
 ['2',['g2geometry','shapes2d','shapes3d','area']],
 ['3',['perimeter','g2advancedgeometry']],
 ['4',['geometry','perimeterarea']],
 ['5',['geometry','angles','symmetry','coordinates','perimeterarea','volume','solids','circles']],
 ['6',['geometry','angles','symmetry','coordinates','perimeterarea','volume']]
];
const seen=new Set();
for(const [grade,topics] of grades){
 for(const topic of topics){
  assert.ok(api.hasTopic(grade,topic),`Missing topic ${grade}/${topic}`);
  for(let i=0;i<35;i++){
   const q=api.question(grade,topic);
   assert.ok(q,`${grade}/${topic} returned no question`);
   assert.ok(q.choices.length===4,`Must have four options ${grade}/${topic}`);
   assert.ok(new Set(q.choices).size===4,`Duplicate choices ${grade}/${topic}: ${q.text}`);
   assert.ok(q.choices.includes(q.answer),`Answer not among options ${grade}/${topic}`);
   assert.ok(q.explanation.length>=15 && q.tip.length>10);
   assert.ok(q.diagramSvg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'));
   assert.ok(q.diagramSvg.endsWith('</svg>'));
   assert.ok(q.diagramSvg.length>250 && q.imageAlt.length>20);
   assert.ok(!/<(?:script|foreignObject|image)\b/i.test(q.diagramSvg));
   seen.add(q.geometryFamily);
  }
  console.log(`Geometry bank passes Year ${grade}: ${topic}`);
 }
}
assert.ok(seen.size>=11,`Only ${seen.size} diagram families generated`);
assert.equal(api.hasTopic('5','fractions'),false,'Other topics must not be replaced');
const practice=fs.readFileSync('practice.html','utf8');
const js=fs.readFileSync('js/practice.js','utf8');
const flow=fs.readFileSync('js/math-learning-v2.js','utf8');
for(const id of ['practiceGeometryFigure','guidedGeometryFigure','testGeometryFigure'])
 assert.ok(practice.includes(`id="${id}"`),'Missing diagram holder '+id);
assert.ok(js.includes("params.get('year')"),'year=5 legacy link must be supported');
assert.ok(js.includes("renderImage('practiceGeometryFigure'"));
assert.ok(flow.includes("renderImage('guidedGeometryFigure'"));
assert.ok(flow.includes("renderImage('testGeometryFigure'"));
assert.ok(flow.includes('geometry-review'));
console.log(`All illustrated geometry checks passed. ${seen.size} distinct diagram families across 6 grades.`);

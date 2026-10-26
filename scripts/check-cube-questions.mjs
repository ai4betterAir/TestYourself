import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const questions=JSON.parse(fs.readFileSync('data/cube-thinking-spec.json','utf8')).questions;
const names=['▲','★','●','◆','■','+'];
const normals={'▲':[0,0,1],'★':[0,0,-1],'●':[0,1,0],'◆':[0,-1,0],'■':[1,0,0],'+':[-1,0,0]};
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const equal=(a,b)=>a.every((v,i)=>v===b[i]);
const valid=(triple)=>{
  assert.equal([...triple].length,3,'Cube corner must have exactly three faces');
  const [top,front,right]=[...triple].map(s=>normals[s]);
  assert.ok(top&&front&&right,'Unknown face symbol');
  return equal(cross(right,front),top);
};
assert.equal(questions.length,10);
assert.equal(new Set(questions.map(x=>x.id)).size,10);
const answerKey=['B','C','D','A','A','C','B','D','B','C'];
const modes={foundation:0,intermediate:0,challenge:0};
for(const [i,q] of questions.entries()){
 assert.equal(q.id,'TS-CUBE-'+String(i+1).padStart(3,'0'));
 assert.equal(q.answer,answerKey[i],'Blueprint answer key mismatch');
 assert.equal(q.subtype,'Cube & Dice Rotation');
 assert.equal(q.choices.join(''),'ABCD');
 assert.equal(q.cubeSpec.options.length,4,'Each question must have four choices');
 assert.ok(q.text.length>30&&q.explanation.length>60&&q.tip.length>30,'Incomplete content');
 assert.ok(q.imageAlt.length>60);
 assert.ok(fs.existsSync(q.image)&&fs.existsSync(q.imageMobile),'Missing responsive SVG '+q.id);
 for(const file of [q.image,q.imageMobile]){
   const svg=fs.readFileSync(file,'utf8');
   assert.ok(svg.includes('</svg>'),'Malformed SVG '+file);
   assert.ok(svg.includes('<title')&&!/<(?:script|foreignObject|image)\b/i.test(svg),'Unsafe SVG');
   assert.ok(svg.includes('role="img"'),'Missing accessible image role');
 }
 modes[q.difficulty]++;
 const c=q.cubeSpec;
 if(c.ref) assert.ok(valid(c.ref),'Invalid reference cube');
 if(c.views) assert.ok(c.views.length===2&&c.views.every(valid),'Invalid reference views');
 const expectedIndex='ABCD'.indexOf(q.answer);
 if(c.kind.endsWith('opposite')){
  const target=normals[c.target];
  const opposite=names.find(name=>equal(normals[name],target.map(v=>-v)));
  assert.ok(opposite,'Opposite face missing');
  assert.equal(c.options.indexOf(opposite),expectedIndex,'Incorrect opposite-face option');
 }else{
   const flags=c.options.map(valid);
   const want=!c.kind.includes('impossible');
   assert.deepEqual(flags.map((f,j)=>f===want?j:null).filter(x=>x!==null),[expectedIndex],
      q.id+' has no unique correct answer under cube rotational symmetry');
 }
}
assert.deepEqual(modes,{foundation:3,intermediate:4,challenge:3});
const ctx=vm.createContext({window:{}});
for(const file of ['js/selective-visual-bank.js','js/selective-thinking-bank.js']){
 vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:file});
}
assert.equal(ctx.window.SKILLUP_VISUAL.questions.length,60);
assert.ok(ctx.window.SKILLUP_THINKING.topics.some(t=>t[0]==='cube'));
for(let i=0;i<150;i++){
 const q=ctx.window.SKILLUP_THINKING.question('cube',i%2?'5':'6');
 assert.ok(q.id.startsWith('TS-CUBE-'),'Cube topic returned unrelated question');
 if(i%2)assert.notEqual(q.difficulty,'challenge','Year 5 foundation filtering failed');
}
console.log('Cube geometry validated: 10 uniquely answered questions, 20 responsive SVGs, 24-rotation invariants, difficulty filtering.');

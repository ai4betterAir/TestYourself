import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const spec=JSON.parse(fs.readFileSync('data/oc-figures-option-a-spec.json','utf8'));
const questions=spec.questions;
const TYPES={symmetry:'Symmetry and Reflection',matching:'Matching Figures',patterns:'Simple Visual Patterns',oddone:'Odd One Out',counting:'Counting Shapes'};
const ids=new Set();
const pattern=(pts)=>pts.map(p=>[p.x,p.y,p.kind,p.color].join('/')).sort().join('|');
const turn=(p,kind)=> {
 const {x,y,...rest}=p;
 if(kind==='original')return {x,y,...rest};
 if(kind==='mirrorV')return {x:3-x,y,...rest};
 if(kind==='mirrorH')return {x,y:3-y,...rest};
 if(kind==='rotate90')return {x:3-y,y:x,...rest};
 if(kind==='rotate180')return {x:3-x,y:3-y,...rest};
 throw Error('Unknown transformation '+kind);
};
const isLine=(cells)=>cells.length===3 && (
 cells.every(([x])=>x===cells[0][0])||
 cells.every(([,y])=>y===cells[0][1])||
 cells.every(([x,y])=>x===y)||
 cells.every(([x,y])=>x+y===2)
);
const mirrorVertical=(cells)=>{
 const k=cells.map(v=>v.join(','));
 return cells.every(([x,y])=>k.includes([2-x,y].join(',')));
};
const catalogue=new Map();
const difficulty={foundation:0,intermediate:0,challenge:0};
assert.equal(questions.length,50);
for(const q of questions){
 assert.ok(!ids.has(q.id),'Duplicate '+q.id);
 ids.add(q.id);
 const s=q.figureSpec;
 assert.equal(q.name,TYPES[s.family],'Category mismatch '+q.id);
 catalogue.set(s.family,(catalogue.get(s.family)||0)+1);
 difficulty[q.difficulty]++;
 assert.equal(q.topic,'visual');
 assert.equal(q.choices.join(''),'ABCD');
 assert.ok(q.explanation.length>60&&q.tip.length>30&&q.text.length>25);
 assert.ok(q.imageAlt.length>=60);
 assert.ok(fs.existsSync(q.image),'Missing '+q.image);
 assert.ok(fs.existsSync(q.imageMobile),'Missing '+q.imageMobile);
 for(const f of [q.image,q.imageMobile]){
   const raw=fs.readFileSync(f,'utf8');
   assert.ok(raw.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'),f);
   assert.ok(raw.includes('role="img"')&&raw.includes('</svg>'),f);
   assert.ok(!/<(?:script|image|foreignObject)\b/i.test(raw),f);
 }
 const idx='ABCD'.indexOf(q.answer);
 assert.ok(idx>=0);
 if(s.family==='symmetry'){
   const desired=s.axis==='vertical'?'mirrorV':'mirrorH';
   assert.equal(s.methods[idx],desired,'Mirror answer mismatch: '+q.id);
   assert.equal(new Set(s.methods.map(m=>pattern(s.reference.map(p=>turn(p,m))))).size,4,'Duplicate symmetry options');
 }
 if(s.family==='matching'){
   assert.equal(s.methods[idx],'original','Exact match answer mismatch');
   assert.equal(new Set(s.methods.map(m=>pattern(s.reference.map(p=>turn(p,m))))).size,4,'Duplicate matching choices');
 }
 if(s.family==='patterns'){
   const seq=s.sequence,opts=s.options;
   assert.equal(seq.length,3);
   const next=(seq[2].dir+s.step)%4;
   const nextColor=seq[1].color;
   assert.equal(opts[idx].dir,next,'Arrow orientation mismatch '+q.id);
   assert.equal(opts[idx].color,nextColor,'Arrow color mismatch '+q.id);
   assert.equal(new Set(opts.map(o=>o.dir+'-'+o.color)).size,4,'Duplicate pattern choices');
 }
 if(s.family==='oddone'){
   const ok=s.options.map(c=>s.mode==='straight'?isLine(c):mirrorVertical(c));
   assert.deepEqual(ok.map((b,j)=>!b?j:null).filter(x=>x!==null),[idx],'Odd one out lacks unique answer '+q.id);
 }
 if(s.family==='counting'){
   assert.equal(s.symbols.length,16);
   assert.equal(s.symbols.filter(x=>x===s.target).length,s.count,'Counting answer wrong');
   assert.equal(s.options[idx],s.count,'Counting letter wrong');
   assert.equal(new Set(s.options).size,4,'Counting options repeated');
 }
}
assert.equal(catalogue.size,5);
for(const [type,count] of catalogue)assert.equal(count,10,type);
assert.deepEqual(difficulty,{foundation:20,intermediate:15,challenge:15});
const ctx=vm.createContext({window:{}});
for(const f of ['js/selective-visual-bank.js','js/selective-thinking-bank.js']){
 vm.runInContext(fs.readFileSync(f,'utf8'),ctx,{filename:f});
}
assert.equal(ctx.window.SKILLUP_VISUAL.questions.length,110,'Total visual bank regression');
const choices=['ocfigures','symmetry','figurematch','visualpatterns','figureodd','shapecount'];
for(const topic of choices){
 assert.ok(ctx.window.SKILLUP_THINKING.topics.some(t=>t[0]===topic),'Topic missing '+topic);
 for(let i=0;i<30;i++){
   const q=ctx.window.SKILLUP_THINKING.question(topic,i%2?'5':'6');
   assert.ok(q.id.startsWith('TS-OC'),'Wrong question route '+topic);
   assert.equal(q.choices.join(''),'ABCD','Wrong button order '+topic);
   if(topic!=='ocfigures')assert.equal(q.name,TYPES[{symmetry:'symmetry',figurematch:'matching',visualpatterns:'patterns',figureodd:'oddone',shapecount:'counting'}[topic]]);
 }
}
console.log('Passed 50 new Option A questions (5 × 10), logical keys, 100 SVG assets, 110 total images, and every topic.');

import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const root=new URL('../../',import.meta.url),text=f=>fs.readFileSync(new URL(f,root),'utf8');
const source=text('js/exam-homework-bank.js').replaceAll('export ','');const context=vm.createContext({Math});vm.runInContext(source,context);
const {examProgrammes,getExamHomeworkBank,makeExamHomework}=context;
assert.equal(examProgrammes('2').length,0);assert.equal(examProgrammes('4')[0],'OC');assert.equal(examProgrammes('6')[0],'Selective');
for(const [year,programme] of [['4','OC'],['5','Selective'],['6','Selective']]){
 const bank=getExamHomeworkBank(year,programme);
 for(const q of bank.questions){assert.equal(new Set(q.choices).size,4);assert.ok(q.answer>=0&&q.answer<4);}
 for(const count of [10,20,30]){const sections=count===30?['reading','maths','thinking']:['maths','thinking'];const qs=makeExamHomework(bank,sections,count);assert.equal(qs.length,count);assert.equal(new Set(qs.map(q=>q.topic+'|'+q.text+'|'+q.passage)).size,count);if(count===30)for(const id of sections)assert.equal(qs.filter(q=>q.topic===id).length,10);}
 // Independent arithmetic checks for each parameterised numerical question family.
 for(const q of bank.questions.filter(q=>q.topic==='maths')){
  const nums=q.text.match(/\d+/g).map(Number);let expected;
  if(q.text.includes('pencils'))expected=nums[0]*nums[1]-nums[2];
  else if(q.text.includes('Tickets'))expected=nums[0]*nums[2]+nums[1]*nums[3];
  else if(q.text.includes('tank'))expected=nums[0]*3/4;
  else expected=2*(nums[0]+nums[1]);
  assert.equal(Number(q.choices[q.answer].replace(/[^\d.]/g,'')),expected,q.text);
 }
}
assert.throws(()=>getExamHomeworkBank('3','Selective'),/Year/);
const dom=new JSDOM(text('dashboard.html'),{url:'https://example.test/dashboard.html?demo=parent&homework-preview=1',runScripts:'outside-only'}),w=dom.window;
Object.assign(w,{supabase:null,subjects:['Maths','English','Science'],getHomeworkBank:async()=>({topics:[{id:'x',label:'Topic'}]}),friendlyError:e=>e.message});
vm.runInContext('const loadAssignmentActivity=async()=>({rows:[],notice:""});const renderAssignmentBoard=()=>{};'+source+'\n'+text('js/family-homework-dashboard.js').replace(/^import .*;\n/gm,''),dom.getInternalVMContext());
await new Promise(resolve=>setTimeout(resolve,0));
assert.ok(w.document.getElementById('homeworkProgramme').textContent.includes('Selective'));
w.document.getElementById('homeworkProgramme').value='Selective';await w.updateTopics();
w.document.getElementById('homeworkMode').value='full';await w.updateTopics();
assert.equal(w.document.querySelectorAll('[name="homeworkTopic"]:checked').length,3);assert.equal(w.document.getElementById('homeworkCount').value,'30');
await w.publish({preventDefault(){}});assert.match(w.document.getElementById('homeworkMessage').textContent,/30 questions.*Selective/);
w.document.getElementById('homeworkChild').value='preview-year4';w.updateProgrammes();await w.updateTopics();
assert.ok(w.document.getElementById('homeworkProgramme').textContent.includes('OC'));assert.ok(!w.document.getElementById('homeworkProgramme').textContent.includes('Selective'));
dom.window.close();console.log('PASS: unique exam sets, independently verified numerical keys, all three sections, year-specific form and write-free preview.');

import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const root=new URL('../../',import.meta.url);
const source=file=>fs.readFileSync(new URL(file,root),'utf8').replace(/^import .*;\n/gm,'');
const questions=Array.from({length:10},(_,i)=>({text:`Question ${i+1}`,choices:['Yes','No'],hint:'Think carefully.',topic:'addition',passage:''}));
const child={id:'33333333-3333-4333-8333-333333333333',full_name:'Child',year_level:'2'};
const homework={id:'55555555-5555-4555-8555-555555555555',student_id:child.id,title:'Addition homework',subject:'Maths',year_level:'2',topic_ids:['addition'],questions,due_at:new Date(Date.now()+864e5).toISOString(),allow_late:true};
function result(data){return {data,error:null};}
function query(data){return {select(){return this;},eq(){return this;},in(){return this;},is(){return this;},order(){return Promise.resolve(result(data));},maybeSingle(){return Promise.resolve(result(data));},then(resolve,reject){return Promise.resolve(result(data)).then(resolve,reject);}};}
{
 const dom=new JSDOM(fs.readFileSync(new URL('dashboard.html',root),'utf8'),{url:'https://example.test/dashboard.html',runScripts:'outside-only'});const w=dom.window;let sent;
 Object.assign(w,{supabase:{auth:{getUser:async()=>result({user:{id:'parent'}})},from:table=>query(table==='guardian_links'?[{student_id:child.id}]:table==='profiles'?[child]:[]),rpc:async(name,input)=>{sent={name,input};return result('new-id');}},getProfile:async()=>({role:'parent',status:'active'}),friendlyError:e=>e.message,formatDate:d=>d,subjects:['Maths','English','Science'],getHomeworkBank:async()=>({topics:[{id:'addition',label:'Addition'},{id:'subtraction',label:'Subtraction'}]}),makeHomework:(bank,ids,count)=>Array.from({length:count},(_,i)=>({...questions[0],topic:ids[i%ids.length],answer:0}))});
 vm.runInContext(source('js/family-homework-dashboard.js').replace(/init\(\)\.catch\([\s\S]*$/,'globalThis.initialiseFamilyHomework=init;'),dom.getInternalVMContext());
 await w.initialiseFamilyHomework();
 assert.equal(w.document.querySelectorAll('[data-family-homework-open]').length,2);
 w.document.querySelector('[data-family-homework-open]').click();await w.updateTopics();
 assert.match(w.document.getElementById('homeworkYear').textContent,/Year 2/);
 w.document.getElementById('homeworkTitle').value='Family maths';
 await w.publish({preventDefault(){}});
 assert.equal(sent.name,'create_family_homework');assert.equal(sent.input.child_input,child.id);assert.equal(sent.input.year_input,'2');assert.equal(sent.input.questions_input.length,10);
 w.document.getElementById('homeworkMode').value='mixed';await w.updateTopics();sent=null;
 await w.publish({preventDefault(){}});assert.equal(sent,null);assert.match(w.document.getElementById('homeworkMessage').textContent,/at least two/);
 w.document.querySelectorAll('[name="homeworkTopic"]')[1].checked=true;
 await w.publish({preventDefault(){}});assert.equal(sent.input.topics_input.length,2);
 dom.window.close();
}
{
 const dom=new JSDOM(fs.readFileSync(new URL('dashboard.html',root),'utf8'),{url:'https://example.test/dashboard.html',runScripts:'outside-only'});const w=dom.window;let sent;
 const cls={id:'class-2',name:'Year 2 class',year_level:'2'};
 Object.assign(w,{supabase:{auth:{getUser:async()=>result({user:{id:'teacher'}})},from:table=>query(table==='classes'?[cls]:table==='class_members'?[{class_id:cls.id,student_id:child.id}]:table==='profiles'?[{...child,year_level:'3'}]:[]),rpc:async(name,input)=>{sent={name,input};return result(1);}},getProfile:async()=>({role:'teacher',status:'active'}),friendlyError:e=>e.message,formatDate:d=>d,subjects:['Maths','English','Science'],getHomeworkBank:async()=>({topics:[{id:'addition',label:'Addition'},{id:'subtraction',label:'Subtraction'}]}),makeHomework:(bank,ids,count)=>Array.from({length:count},(_,i)=>({...questions[0],topic:ids[i%ids.length],answer:0}))});
 vm.runInContext(source('js/family-homework-dashboard.js').replace(/init\(\)\.catch\([\s\S]*$/,'globalThis.initialiseFamilyHomework=init;'),dom.getInternalVMContext());
 await w.initialiseFamilyHomework();w.document.querySelector('[data-family-homework-open]').click();await w.updateTopics();
 assert.match(w.document.getElementById('homeworkYear').textContent,/Year 2/);assert.equal(w.document.querySelectorAll('[name="homeworkStudent"]:checked').length,1);
 w.document.getElementById('homeworkTitle').value='Class revision';
 await w.publish({preventDefault(){}});assert.equal(sent.name,'create_teacher_homework');assert.equal(sent.input.class_input,cls.id);assert.equal(sent.input.students_input[0],child.id);assert.equal(sent.input.year_input,'2');assert.equal(sent.input.child_input,undefined);
 w.document.querySelector('[name="homeworkStudent"]').checked=false;sent=null;await w.publish({preventDefault(){}});assert.equal(sent,null);assert.match(w.document.getElementById('homeworkMessage').textContent,/at least one enrolled/);
 dom.window.close();
}
{
 const dom=new JSDOM(fs.readFileSync(new URL('family-homework.html',root),'utf8'),{url:'https://example.test/family-homework.html?id='+homework.id,runScripts:'outside-only'});const w=dom.window;let sent;
 Object.assign(w,{supabase:{from:()=>query(structuredClone(homework)),rpc:async(name,input)=>{sent={name,input};return result({score:7,total:10});}},requireUser:async()=>({id:child.id}),getProfile:async()=>({role:'student',status:'active'}),friendlyError:e=>e.message,formatDate:d=>d});
 vm.runInContext(source('js/family-homework.js').replace(/init\(\)\.catch\([\s\S]*$/,'globalThis.initialiseHomework=init;'),dom.getInternalVMContext());
 await w.initialiseHomework();assert.equal(w.document.querySelectorAll('[name="answer"]').length,2);
 await w.submit();assert.equal(sent,undefined);assert.match(w.document.getElementById('homeworkStatus').textContent,/Answer all/);
 w.document.getElementById('homeworkHint').click();assert.equal(w.document.getElementById('homeworkHintText').hidden,false);
 for(let i=0;i<10;i++){
   w.document.querySelector(`[data-question="${i}"]`).click();const input=w.document.querySelector('[name="answer"]');input.checked=true;input.dispatchEvent(new w.Event('change'));
 }
 assert.match(w.document.querySelector('.homework-progress').textContent,/10 answered/);
 await w.submit();assert.equal(sent.name,'submit_family_homework');assert.equal(sent.input.answers_input.length,10);assert.match(w.document.getElementById('homeworkApp').textContent,/7 \/ 10/);
 dom.window.close();
}
console.log('PASS: guardian and teacher forms, class-year matching, recipient and mixed validation, student navigation, hint and submission result.');

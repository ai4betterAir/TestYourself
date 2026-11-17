import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const root=new URL('../../',import.meta.url);
const boardSource='(function(){'+fs.readFileSync(new URL('js/assignment-board.js',root),'utf8').replace(/^import .*;\n/gm,'').replaceAll('export ','')+';Object.assign(globalThis,{loadAssignmentActivity,renderAssignmentBoard});})();\n';
const reviewSource='(function(){'+fs.readFileSync(new URL('js/homework-review.js',root),'utf8').replaceAll('export ','')+';Object.assign(globalThis,{renderHomeworkReview,sampleHomeworkReview});})();\n';
const source=file=>(file==='js/family-homework.js'?reviewSource:'')+(file==='js/family-homework-dashboard.js'?boardSource:'')+(file==='js/family-homework-dashboard.js'?fs.readFileSync(new URL('js/exam-homework-bank.js',root),'utf8').replaceAll('export ','')+'\n':'')+fs.readFileSync(new URL(file,root),'utf8').replace(/^import .*;\n/gm,'');
const questions=Array.from({length:10},(_,i)=>({text:`Question ${i+1}`,choices:['Yes','No'],hint:'Think carefully.',topic:'addition',passage:''}));
const child={id:'33333333-3333-4333-8333-333333333333',full_name:'Child',year_level:'2'};
const homework={id:'55555555-5555-4555-8555-555555555555',student_id:child.id,title:'Addition homework',subject:'Maths',year_level:'2',topic_ids:['addition'],questions,due_at:new Date(Date.now()+864e5).toISOString(),allow_late:true};
function result(data){return {data,error:null};}
function query(data){return {select(){return this;},eq(){return this;},in(){return this;},is(){return this;},order(){return Promise.resolve(result(data));},maybeSingle(){return Promise.resolve(result(data));},then(resolve,reject){return Promise.resolve(result(data)).then(resolve,reject);}};}
{
 const dom=new JSDOM(fs.readFileSync(new URL('dashboard.html',root),'utf8'),{url:'https://example.test/dashboard.html',runScripts:'outside-only'});const w=dom.window;let sent;
 Object.assign(w,{ensureTeacherGroups:async()=>{},supabase:{auth:{getUser:async()=>result({user:{id:'parent'}})},from:table=>query(table==='guardian_links'?[{student_id:child.id}]:table==='profiles'?[child]:[]),rpc:async(name,input)=>{if(name==='get_homework_activity')return result([]);sent={name,input};return result('new-id');}},getProfile:async()=>({role:'parent',status:'active'}),friendlyError:e=>e.message,formatDate:d=>d,subjects:['Maths','English','Science'],getHomeworkBank:async()=>({topics:[{id:'addition',label:'Addition'},{id:'subtraction',label:'Subtraction'}]}),makeHomework:(bank,ids,count)=>Array.from({length:count},(_,i)=>({...questions[0],topic:ids[i%ids.length],answer:0}))});
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
 Object.assign(w,{ensureTeacherGroups:async()=>{},supabase:{auth:{getUser:async()=>result({user:{id:'teacher'}})},from:table=>query(table==='classes'?[cls]:table==='class_members'?[{class_id:cls.id,student_id:child.id}]:table==='profiles'?[{...child,year_level:'3'}]:[]),rpc:async(name,input)=>{if(name==='get_homework_activity')return result([]);sent={name,input};return result(1);}},getProfile:async()=>({role:'teacher',status:'active'}),friendlyError:e=>e.message,formatDate:d=>d,subjects:['Maths','English','Science'],getHomeworkBank:async()=>({topics:[{id:'addition',label:'Addition'},{id:'subtraction',label:'Subtraction'}]}),makeHomework:(bank,ids,count)=>Array.from({length:count},(_,i)=>({...questions[0],topic:ids[i%ids.length],answer:0}))});
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
 Object.assign(w,{ensureTeacherGroups:async()=>{},supabase:{from:()=>query(structuredClone(homework)),rpc:async(name,input)=>{if(name==='review_family_homework')return result({score:7,total:10,questions:questions.map((q,i)=>({...q,number:i+1,chosen_index:0,correct_index:i<7?0:1,is_correct:i<7,explanation:'A strategy.'}))});sent={name,input};return result({score:7,total:10});}},requireUser:async()=>({id:child.id}),getProfile:async()=>({role:'student',status:'active'}),friendlyError:e=>e.message,formatDate:d=>d});
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

{
 const dom=new JSDOM(fs.readFileSync(new URL('dashboard.html',root),'utf8'),{url:'https://example.test/dashboard.html',runScripts:'outside-only'});const w=dom.window;let sent;
 Object.assign(w,{supabase:{auth:{getUser:async()=>result({user:{id:child.id}})},rpc:async(name,input)=>{if(name==='request_teacher_connection'){sent={name,input};return result('pending');}return result([{teacher_name:'Ms Green',teacher_email:'teacher@example.com',status:'pending',group_names:[]}]);}},getProfile:async()=>({role:'student',status:'active'}),friendlyError:e=>e.message,ensureTeacherGroups:async()=>{}});
 vm.runInContext(source('js/teacher-connections.js').replace(/init\(\)\.catch\([\s\S]*$/,'globalThis.initialiseTeacherConnections=init;'),dom.getInternalVMContext());
 await w.initialiseTeacherConnections();w.document.querySelector('[data-invite-teacher]').click();
 assert.equal(w.document.getElementById('teacherInviteModal').hidden,false);
 w.document.getElementById('teacherEmail').value='teacher@example.com';w.document.getElementById('teacherInviteMessage').value='Please add me to maths.';
 await w.document.getElementById('teacherInviteForm').onsubmit({preventDefault(){}});
 assert.equal(sent.name,'request_teacher_connection');assert.equal(sent.input.teacher_email_input,'teacher@example.com');assert.match(w.document.getElementById('teacherInviteStatus').textContent,/Request sent/);
 assert.match(w.document.querySelector('[data-student-teacher-list]').textContent,/Waiting for teacher/);dom.window.close();
}
{
 const dom=new JSDOM(fs.readFileSync(new URL('dashboard.html',root),'utf8'),{url:'https://example.test/dashboard.html',runScripts:'outside-only'});const w=dom.window;let sent;
 const groups=[{id:'group-1',name:'NAPLAN Year 3',group_type:'class'},{id:'group-2',name:'Maths batch',group_type:'batch'}];
 Object.assign(w,{supabase:{auth:{getUser:async()=>result({user:{id:'teacher'}})},from:()=>query(groups),rpc:async(name,input)=>{
   if(name==='list_teacher_connection_requests')return result([{request_id:'request-1',student_id:child.id,full_name:'Child',email:'student@example.com',skillup_id:'SU-12345678',year_level:'3',message:'Please connect.'}]);
   if(name==='list_teacher_students')return result([{student_id:child.id,full_name:'Child',email:'student@example.com',skillup_id:'SU-12345678',groups:[{id:'group-2',name:'Maths batch'}]}]);
   sent={name,input};return result(true);
 }},getProfile:async()=>({role:'teacher',status:'active'}),friendlyError:e=>e.message,ensureTeacherGroups:async()=>{}});
 let code=source('js/teacher-connections.js').replace(/init\(\)\.catch\([\s\S]*$/,'globalThis.initialiseTeacherConnections=init;');
 code=code.replace("const refreshPeople=()=>location.assign('dashboard.html?section=people');","const refreshPeople=()=>{globalThis.refreshedPeople=true;};");
 vm.runInContext(code,dom.getInternalVMContext());await w.initialiseTeacherConnections();
 const card=w.document.querySelector('[data-connection-request]');card.querySelector('[data-request-group]').value='group-1';
 await card.querySelector('[data-accept-request]').onclick();assert.equal(sent.name,'respond_teacher_connection');assert.equal(sent.input.class_input,'group-1');assert.equal(sent.input.accept_input,true);
 const roster=w.document.querySelector('[data-roster-student]');roster.querySelector('[data-placement-destination]').value='group-1';roster.querySelector('[data-placement-source]').value='group-2';
 await roster.querySelector('[data-save-placement]').onclick();assert.equal(sent.name,'place_teacher_student');assert.equal(sent.input.source_input,'group-2');assert.equal(sent.input.destination_input,'group-1');assert.equal(w.refreshedPeople,true);dom.window.close();
}
console.log('PASS: student teacher-invitation form, pending status, teacher acceptance with placement, and student group-move controls.');

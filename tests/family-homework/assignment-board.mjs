import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const root=new URL('../../',import.meta.url),dom=new JSDOM('<div id="board"></div>',{url:'https://example.test/dashboard.html',runScripts:'outside-only'}),w=dom.window;
const now=new Date().toISOString(),future=new Date(Date.now()+864e5).toISOString();
let response={questions:[{text:'2 + 2?',choices:['4','5']}],answers:[0],submitted_at:now};
const query=data=>({select(){return this;},eq(){return this;},in(){return this;},order(){return this;},maybeSingle:async()=>({data,error:null}),then:resolve=>Promise.resolve({data,error:null}).then(resolve)});
Object.assign(w,{supabase:{from:()=>query(response),rpc:async()=>({data:null,error:{message:'not installed'}})},formatDate:d=>d});
vm.runInContext(fs.readFileSync(new URL('js/assignment-board.js',root),'utf8').replace(/^import .*;\n/gm,'').replaceAll('export ',''),dom.getInternalVMContext());
const homework=[{id:'h1',student_id:'child',parent_id:'parent',title:'Family fractions',subject:'Maths',questions:Array(10),due_at:future,allow_late:true,submitted_at:now,score:8}];
const assignments=[{id:'a1',teacher_id:'teacher',class_id:'c1',title:'Reading task',subject:'English',resource_url:'english-practice.html',status:'published',due_at:future,allow_late:true}];
const people=[{id:'child',full_name:'Alex',role:'student'},{id:'parent',full_name:'Sam',role:'parent'},{id:'teacher',full_name:'Ms Taylor',role:'teacher'}];
const rows=w.mergeAssignmentActivity(homework,assignments,[],[{class_id:'c1',student_id:'child'}],[],people,'student','child');
assert.equal(rows.length,2);const host=w.document.getElementById('board');
w.renderAssignmentBoard(host,rows,'student');assert.match(host.textContent,/You have 1 assignment to complete/);assert.match(host.textContent,/From Ms Taylor/);assert.match(host.textContent,/8.*10.*80%/);
host.querySelector('[data-board-filter="completed"]').click();assert.equal(host.querySelectorAll('.assignment-board-card').length,1);assert.match(host.textContent,/Family fractions/);
w.renderAssignmentBoard(host,rows,'parent');assert.match(host.textContent,/1 assignment completed/);assert.match(host.textContent,/Alex/);
host.querySelector('[data-board-review]').click();await new Promise(resolve=>setTimeout(resolve,0));assert.match(host.textContent,/Student answer: 4/);
const submitted=w.mergeAssignmentActivity([],assignments,[{assignment_id:'a1',student_id:'child',attempt_no:1,submitted_at:now,score:17,max_score:20}],[],[],people,'teacher','teacher');assert.equal(submitted.length,1);assert.equal(submitted[0].score,17);
w.renderAssignmentBoard(host,submitted,'teacher');assert.match(host.textContent,/1 submission received/);assert.match(host.textContent,/17.*20.*85%/);
const other=w.mergeAssignmentActivity([],assignments,[],[{class_id:'c1',student_id:'other'}],[{assignment_id:'a1',student_id:'child'}],people,'parent','parent');assert.equal(other.length,0);
assert.equal(w.assignmentState({...homework[0],submitted_at:null,due_at:'2020-01-01',allow_late:false}),'closed');
// Dashboard totals must use the same combined feed, including completed family homework.
for(const id of ['insightPanel','primaryPanelTitle','primaryPanel','progressPanel','fullProgress','workContent']){const n=w.document.createElement('div');n.id=id;w.document.body.append(n);}
Object.assign(w,{$:id=>w.document.getElementById(id),profile:{role:'teacher'},assignmentBoardRows:rows,classes:[],classMembers:[],children:[people[0]],leaderboardRows:[],user:{id:'child'},metrics:list=>{w.latestMetrics=list;},subjectProgress:list=>list.length+' scored',scoreSummary:list=>list.length+' scored',empty:(a,b)=>a+b});
const dashboard=fs.readFileSync(new URL('js/dashboard.js',root),'utf8');vm.runInContext(dashboard.slice(dashboard.indexOf('function applyAssignmentBoardSummary()'),dashboard.indexOf('function assignmentState(')),dom.getInternalVMContext());
w.applyAssignmentBoardSummary();assert.equal(w.latestMetrics.find(m=>m.label==='Submissions').value,1);assert.match(w.document.getElementById('insightPanel').textContent,/1 submission received/);
w.profile.role='parent';w.applyAssignmentBoardSummary();assert.equal(w.latestMetrics.find(m=>m.label==='Submitted').value,1);assert.equal(w.latestMetrics.find(m=>m.label==='Average').value,'80%');
w.profile.role='student';w.applyAssignmentBoardSummary();assert.equal(w.latestMetrics.find(m=>m.label==='Marks achieved').value,8);assert.match(w.document.getElementById('fullProgress').textContent,/1.*Submitted assignments/);
console.log('PASS: combined homework/activity board, sender notification, per-child submitted scores, filters, private answer review, targeted recipients and submitted legacy attempts.');dom.window.close();

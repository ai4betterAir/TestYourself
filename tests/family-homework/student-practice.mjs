import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
import {newSession,progress,choose,check,move} from '../../js/student-practice-model.js';
import {practiceStore} from '../../js/student-practice-store.js';
const root=new URL('../../',import.meta.url),owner='student-a';
const questions=Array.from({length:10},(_,i)=>({text:'Question '+i,answer:1,choices:['A','B','C'],topic:'addition',hint:'Read carefully.'}));
const row=newSession('session-a',owner,'2','Maths',['addition'],['Addition'],questions);
choose(row,1);check(row);check(row);assert.deepEqual(progress(row.state),{answered:1,correct:1,total:10,complete:false});choose(row,0);assert.equal(row.state.answers[0],1);move(row,1);
const cache=new Map(),storage={getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v)};
function result(data){return {data,error:null};}
function query(data,error=null){return {select(){return this;},eq(){return this;},order(){return this;},limit(){return Promise.resolve({data,error});},maybeSingle(){return Promise.resolve({data,error});}};}
const client={from:()=>query(null,{message:'offline'}),rpc:async()=>result({version:1})};
const store=practiceStore(client,owner,storage);assert.ok(store.write(row));assert.equal((await store.load(row.id)).state.cursor,1);assert.equal((await store.list()).rows.length,1);
const other=practiceStore(client,'student-b',storage);assert.equal(await other.load(row.id),null);assert.equal((await other.list()).rows.length,0);
const remote=structuredClone(row);remote.version=2;remote.unsynced=false;
const updated=practiceStore({from:()=>query(remote),rpc:client.rpc},owner,storage);assert.equal((await updated.load(row.id)).version,2);
let saved,saveCount=0;
const source=file=>fs.readFileSync(new URL(file,root),'utf8').replace(/^import .*;\n/gm,'');
const fixture=async(url,loaded)=>{
 const dom=new JSDOM(fs.readFileSync(new URL('student-practice.html',root),'utf8'),{url,runScripts:'outside-only'}),w=dom.window;
 Object.assign(w,{structuredClone,supabase:{},requireUser:async()=>({id:owner}),getProfile:async()=>({role:'student',status:'active',year_level:'2'}),practiceStore:()=>({write:()=>true,load:async()=>structuredClone(loaded),save:async(snapshot)=>{saved=structuredClone(snapshot);saveCount++;return {version:snapshot.version+1};}}),getHomeworkBank:async()=>({topics:[{id:'addition',label:'Addition'}]}),makeHomework:()=>structuredClone(questions),progress,label:r=>r.topic_labels[0],newSession,choose,check,move,YEARS:['K','1','2','3','4','5','6'],SUBJECTS:['Maths','English','Science']});
 vm.runInContext(source('js/student-practice-session.js').replace(/init\(\)\.catch\([\s\S]*$/,'globalThis.initialisePractice=init;globalThis.waitForSaves=()=>queue;'),dom.getInternalVMContext());await w.initialisePractice();await w.waitForSaves();return {dom,w};
};
const first=await fixture('https://example.test/student-practice.html?year=2&subject=Maths&topics=%5B%22addition%22%5D');
let w=first.w;const input=w.document.querySelectorAll('[name="practiceAnswer"]')[1];input.checked=true;input.dispatchEvent(new w.Event('change'));w.document.getElementById('practiceCheck').click();w.document.getElementById('practiceNext').click();await w.waitForSaves();
assert.equal(saved.state.cursor,1);assert.equal(saved.state.answers[0],1);assert.equal(saved.state.checked[0],true);assert.equal(saved.state.questions[0].text,'Question 0');
const restored=await fixture('https://example.test/student-practice.html?session=saved-session',{...saved,student_id:owner,unsynced:false});
assert.match(restored.w.document.querySelector('.sp-session-meta').textContent,/Question 2 of 10/);
restored.w.document.getElementById('practicePrevious').click();assert.equal(restored.w.document.querySelectorAll('[name="practiceAnswer"]:disabled').length,3);assert.equal(restored.w.document.querySelectorAll('[name="practiceAnswer"]')[1].checked,true);
first.dom.window.close();restored.dom.window.close();
let destination;
const routerContext={URL,URLSearchParams,location:{search:'?year=3&topic=fractions&assignment=abc',href:'https://example.test/practice.html?year=3&topic=fractions&assignment=abc',hash:'#quiz',replace:url=>destination=url}};
vm.runInNewContext(source('js/practice-router.js'),routerContext);assert.equal(destination,'https://example.test/maths-practice.html?year=3&topic=fractions&assignment=abc#quiz');
const html=fs.readFileSync(new URL('practice.html',root),'utf8');assert.ok(html.includes('Continue'));assert.ok(html.includes('practiceTopicGrid'));assert.ok(html.includes('practice-router.js'));
console.log('PASS: exact question/answer resume, locked checked answers, independent student browser storage, newer cloud versions, saved cursor and legacy maths/assignment routing.');

{
 const dom=new JSDOM(fs.readFileSync(new URL('practice.html',root),'utf8'),{url:'https://example.test/practice.html?preview=1',runScripts:'outside-only'}),w=dom.window;
 Object.assign(w,{supabase:{},requireUser:async()=>{throw Error('Preview must not read an account');},getProfile:async()=>{throw Error('Preview must not read profiles');},subjects:['Maths','English','Science'],progress,label:r=>r.topic_labels[0],getHomeworkBank:async()=>({topics:Array.from({length:12},(_,i)=>({id:'topic'+i,label:'Topic '+i}))})});
 vm.runInContext(source('js/student-practice-hub.js').replace(/init\(\)\.catch\([\s\S]*$/,'globalThis.initialiseHub=init;'),dom.getInternalVMContext());await w.initialiseHub();
 assert.equal(w.document.querySelectorAll('.sp-topic-card').length,8);assert.match(w.document.getElementById('practiceGate').textContent,/Design preview/);
 w.document.getElementById('showAllPracticeTopics').click();assert.equal(w.document.querySelectorAll('.sp-topic-card').length,12);
 const mix=w.document.querySelectorAll('[data-mix-topic]');for(const input of [mix[0],mix[1]]){input.checked=true;input.dispatchEvent(new w.Event('change'));}
 assert.equal(w.document.getElementById('startMixedPractice').disabled,false);
 w.document.getElementById('topicSearch').value='Topic 11';w.document.getElementById('topicSearch').dispatchEvent(new w.Event('input'));assert.equal(w.document.querySelectorAll('.sp-topic-card').length,1);
 assert.match(w.document.getElementById('continuePractice').textContent,/3 of 10/);dom.window.close();
}
console.log('PASS: compact hub shortcuts, expand-all, full-bank search, mixed selection and sample-only design preview.');

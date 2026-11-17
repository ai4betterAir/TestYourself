import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
const root=new URL('../../',import.meta.url),read=f=>fs.readFileSync(new URL(f,root),'utf8');
const home=new JSDOM(read('selective-reading.html'));
assert.equal([...home.window.document.querySelectorAll('a')].find(a=>a.textContent==='Start practice').getAttribute('href'),'selective-reading-practice.html?start=1');
function workspace(file,url,files){
 const dom=new JSDOM(read(file),{url,runScripts:'outside-only'}),w=dom.window;
 w.scrollTo=()=>{};w.setInterval=()=>1;w.clearInterval=()=>{};
 w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
 w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'));};
 for(const file of files)vm.runInContext(read('js/'+file),dom.getInternalVMContext());
 return dom;
}
const banks=['selective-reading-bank.js','selective-reading-quick-bank.js','selective-reading-practice-boot.js','selective-practice.js'];
const dom=workspace('selective-reading-practice.html','https://example.test/selective-reading-practice.html?start=1',banks),w=dom.window,d=w.document;
assert.equal(d.body.dataset.stream,'reading');assert.equal(d.getElementById('practiceDialog').open,true);assert.equal(d.querySelectorAll('[data-stream="math"]').length,0);assert.equal(d.querySelectorAll('[data-stream="writing"]').length,0);assert.match(d.title,/Reading/);
assert.ok(d.getElementById('readingPassage').textContent.length>30);assert.ok(!d.getElementById('question').textContent.includes('QUESTION'));assert.equal(w.TY_YEAR6,undefined);
d.getElementById('backToTopics').click();assert.equal(d.getElementById('practiceDialog').open,false);d.querySelector('[data-topic="inference"]').click();assert.equal(d.getElementById('practiceDialog').open,true);assert.match(w.location.search,/topic=inference/);
d.getElementById('answers').querySelector('button').click();d.getElementById('check').click();assert.ok(d.getElementById('feedback').textContent);d.getElementById('next').click();assert.match(d.getElementById('practiceDialogProgress').textContent,/Question 2/);
d.getElementById('backToTopics').click();d.querySelector('[data-view="mock"]').click();d.getElementById('startMock').click();assert.equal(d.getElementById('mockQuiz').hidden,false);assert.ok(d.getElementById('mockReadingPassage').textContent.length>30);dom.window.close();
const quick=workspace('selective-reading-practice.html','https://example.test/selective-reading-practice.html?topic=quick',banks);assert.ok(quick.window.document.getElementById('readingPassage').textContent.length>30);quick.window.close();
const routeSource=read('js/selective-reading-route.js');
for(const [search,expected] of [['?stream=reading','selective-reading-practice.html?start=1#activity'],['?stream=reading&topic=inference&assignment=abc','selective-reading-practice.html?topic=inference&assignment=abc#activity'],['?stream=reading&exam=oc',null],['?stream=thinking',null]]){
 let target=null;vm.runInNewContext(routeSource,{URLSearchParams,location:{search,hash:'#activity',replace:value=>{target=value;}}});assert.equal(target,expected);
}
// Existing maths / OC workspaces must still initialise with the shared engine.
const maths=workspace('selective-practice.html','https://example.test/selective-practice.html?stream=math',['year3to5-bank.js','year5-tests.js','year6-bank.js','selective-mr-extra-bank.js','selective-practice.js']);assert.equal(maths.window.document.body.dataset.stream,'math');assert.equal(maths.window.document.getElementById('readingPassage').hidden,true);maths.window.close();
const oc=workspace('selective-practice.html','https://example.test/selective-practice.html?exam=oc&stream=reading',banks);assert.equal(oc.window.document.body.dataset.exam,'oc');assert.equal(oc.window.document.body.dataset.stream,'reading');assert.match(oc.window.document.getElementById('heroTag').textContent,/OC/);oc.window.close();
console.log('PASS: Reading Start practice opens the first question, reading-only controls, topic selection, separate passage, feedback/next, reading mock, legacy routes and preserved maths workspace.');

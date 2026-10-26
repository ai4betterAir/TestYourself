/* SkillUP Science Studio — shared K–6 practice and assessment controller. */
(function(){
'use strict';
const params=new URLSearchParams(location.search);
const core=window.SKILLUP_SCIENCE||{};
const visuals=window.SKILLUP_SCIENCE_VISUALS;
const $=id=>document.getElementById(id);
let year=params.get('year')||params.get('grade')||localStorage.getItem('skillupYear')||'1';
if(!core[year])year='1';
const label=year==='K'?'Kindy':'Year '+year;
const all=[...core[year],...(visuals?.enrich(year)||[])];
const topics=[...new Set(all.map(q=>q.topic))];
let topic=params.get('topic')||'mixed';
if(!topics.includes(topic))topic='mixed';
let mode='practice',questions=[],index=0,selected=null,score=0,reviewed=new Map();
let timer=null,seconds=1200,testAnswers=[];
const questionKey=q=>q.text+' | '+q.topic;
function shuffle(a){
 const out=[...a];
 for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}
 return out;
}
function pickSet(size,scoped){
 const source=scoped==='mixed'?all:all.filter(q=>q.topic===scoped);
 const seen=new Set();
 const unique=source.filter(q=>{
  const k=questionKey(q);if(seen.has(k))return false;seen.add(k);return true;
 });
 return shuffle(unique).slice(0,size).map(q=>({...q,options:shuffle(q.options)}));
}
function saveProgress(){
 try{
  const key='tyScienceProgress', data=JSON.parse(localStorage.getItem(key)||'{}');
  data[year]={score,total:questions.length,date:new Date().toISOString(),mode,topic};
  localStorage.setItem(key,JSON.stringify(data));
 }catch(e){/* Private browsing may restrict local storage. */}
}
function showFigure(figureId,imgId,q){
 const fig=$(figureId),img=$(imgId);
 if(!fig||!img)return;
 const item=q?visuals?.illustrate(q):null;
 if(!item){fig.hidden=true;img.removeAttribute('src');img.alt='';return}
 img.src='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(item.svg);
 img.alt=item.alt;
 fig.hidden=false;
}
function optionButton(value,i,selectedValue,onclick){
 const b=document.createElement('button');
 b.type='button';b.dataset.value=value;
 const letter=document.createElement('span');letter.className='choice-letter';letter.textContent='ABCD'[i];letter.setAttribute('aria-hidden','true');
 const txt=document.createElement('span');txt.textContent=value;
 b.append(letter,txt);b.setAttribute('aria-pressed',String(selectedValue===value));
 if(selectedValue===value)b.classList.add('selected');
 b.addEventListener('click',()=>onclick(value,b));
 return b;
}
function renderOptions(hostId,q,selectedValue,onselect){
 const host=$(hostId);host.replaceChildren();
 q.options.forEach((v,i)=>host.appendChild(optionButton(v,i,selectedValue,onselect)));
}
function selectHost(host,value){
 host.querySelectorAll('button').forEach(b=>{const yes=b.dataset.value===value;b.classList.toggle('selected',yes);b.setAttribute('aria-pressed',String(yes))});
}
function setTopic(t){
 if(t!=='mixed'&&!topics.includes(t))t='mixed';
 topic=t;
 $('activeTopicLabel').textContent=t==='mixed'?'All science topics':t;
 $('topicDescription').textContent=t==='mixed'?'Discover life, materials, Earth, energy and scientific thinking.':(visuals?.description(t)||'Explore this science topic.');
 $('notebookArt').innerHTML=visuals?.thumbnail(t==='mixed'?(topics[0]||'Investigations'):t)||'';
 const n=t==='mixed'?all.length:all.filter(q=>q.topic===t).length;
 $('topicCount').textContent=n+' original questions available';
 document.querySelectorAll('.topic-pill').forEach(b=>{
  const active=b.dataset.topic===t;
  b.classList.toggle('active',active);
  b.setAttribute('aria-pressed',String(active));
 });
 const uri=new URL(location.href);
 if(t==='mixed')uri.searchParams.delete('topic');else uri.searchParams.set('topic',t);
 uri.searchParams.set('year',year);uri.searchParams.delete('grade');
 history.replaceState(null,'',uri.pathname+uri.search+uri.hash);
 reset();
}
function buildTopics(){
 const host=$('topicPills');host.replaceChildren();
 for(const t of ['mixed',...topics]){
  const n=t==='mixed'?all.length:all.filter(q=>q.topic===t).length;
  const b=document.createElement('button');b.type='button';b.className='topic-pill';
  b.dataset.topic=t;
  const span=document.createElement('span');span.textContent=t==='mixed'?'All topics':t;
  const badge=document.createElement('span');badge.className='pill-count';badge.textContent=n;
  b.append(span,badge);
  b.addEventListener('click',()=>{setTopic(t);$('work').scrollIntoView({behavior:'smooth',block:'start'})});
  host.appendChild(b);
 }
}
function setMode(next){
 if(!['practice','test'].includes(next))return;
 mode=next;
 document.querySelectorAll('.mode').forEach(b=>{
  const active=b.dataset.mode===mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));
 });
 $('practicePanel').hidden=mode!=='practice';
 $('testPanel').hidden=mode!=='test';
 reset();
}
function reset(){
 if(timer){clearInterval(timer);timer=null}
 index=0;selected=null;score=0;reviewed=new Map();testAnswers=[];seconds=1200;
 questions=pickSet(mode==='practice'?10:20,topic);
 $('score').textContent='0 / 0';
 if(mode==='practice')renderPractice();
 else{
  $('testIntro').hidden=false;$('testBody').hidden=true;$('testResult').hidden=true;
  $('timer').textContent='20:00';$('timer').classList.remove('urgent');
  $('testQuestionTotal').textContent=String(questions.length);
 }
}
function renderPractice(){
 const q=questions[index];if(!q)return;
 $('count').textContent=(index+1)+' / '+questions.length;
 $('bar').style.width=((index+1)/questions.length*100)+'%';
 $('topic').textContent=q.topic;$('question').textContent=q.text;
 $('feedback').textContent='';$('feedback').className='feedback';
 $('practiceExplanation').hidden=true;$('practiceExplanation').textContent='';
 const previous=reviewed.get(index);
 selected=previous?.selected??null;
 renderOptions('options',q,selected,(v,b)=>{
  if(reviewed.has(index))return;
  selected=v;selectHost($('options'),v);
 });
 if(previous){
  applyMarkClasses($('options'),q,previous.selected);
  $('feedback').textContent=previous.correct?'Correct — nicely observed!':'The correct answer is '+q.answer+'.';
  $('feedback').className=previous.correct?'feedback good':'feedback bad';
  $('practiceExplanation').textContent=q.explanation;
  $('practiceExplanation').hidden=false;
 }
 $('check').disabled=!!previous;
 $('next').textContent=index===questions.length-1?'Start another round ↻':'Next question →';
 $('score').textContent=score+' / '+reviewed.size;
 showFigure('questionFigure','questionImage',q);
}
function applyMarkClasses(host,q,choice){
 host.querySelectorAll('button').forEach(b=>{
  const value=b.dataset.value;
  b.disabled=true;
  b.classList.toggle('correct',value===q.answer);
  b.classList.toggle('wrong',value===choice&&value!==q.answer);
 });
}
function markPractice(){
 const q=questions[index];if(!q)return;
 if(selected===null){$('feedback').textContent='Choose one of the answers first.';return}
 if(reviewed.has(index))return;
 const correct=selected===q.answer;
 reviewed.set(index,{selected,correct});if(correct)score++;
 applyMarkClasses($('options'),q,selected);
 $('feedback').className=correct?'feedback good':'feedback bad';
 $('feedback').textContent=correct?'Correct! You spotted it.':'Not quite — the correct answer is '+q.answer+'.';
 $('practiceExplanation').textContent=q.explanation;$('practiceExplanation').hidden=false;
 $('score').textContent=score+' / '+reviewed.size;$('check').disabled=true;saveProgress();
}
function startTest(){
 if(!questions.length)return;
 $('testIntro').hidden=true;$('testBody').hidden=false;$('testResult').hidden=true;
 index=0;seconds=1200;testAnswers=Array(questions.length).fill(null);
 renderTest();if(timer)clearInterval(timer);
 timer=setInterval(()=>{
  if(seconds>0)seconds--;updateTimer();
  if(seconds===0)finishTest();
 },1000);
}
function updateTimer(){
 const m=String(Math.floor(seconds/60)).padStart(2,'0'),s=String(seconds%60).padStart(2,'0');
 $('timer').textContent=m+':'+s;$('timer').classList.toggle('urgent',seconds<120);
}
function renderTest(){
 const q=questions[index];if(!q)return;
 $('testCount').textContent='Question '+(index+1)+' of '+questions.length;
 $('testTopic').textContent=q.topic;$('testQuestion').textContent=q.text;
 renderOptions('testOptions',q,testAnswers[index],v=>{testAnswers[index]=v;selectHost($('testOptions'),v);renderDots()});
 showFigure('testFigure','testImage',q);renderDots();
 $('testPrev').disabled=index===0;
 $('testNext').textContent=index===questions.length-1?'Finish test →':'Next →';
}
function renderDots(){
 const host=$('dots');host.replaceChildren();
 questions.forEach((q,i)=>{
  const b=document.createElement('button');b.type='button';b.textContent=String(i+1);
  b.className=i===index?'current':testAnswers[i]!==null?'answered':'';
  b.setAttribute('aria-label','Go to question '+(i+1));
  b.onclick=()=>{index=i;renderTest()};host.appendChild(b);
 });
}
function finishTest(){
 if(timer){clearInterval(timer);timer=null}
 score=testAnswers.reduce((n,a,i)=>n+(a===questions[i].answer?1:0),0);
 $('testBody').hidden=true;$('testIntro').hidden=true;$('testResult').hidden=false;
 $('finalMark').textContent=score+' / '+questions.length;
 const pct=Math.round(score/questions.length*100);
 $('finalPct').textContent=pct+'%';
 $('finalMessage').textContent=pct>=80?'Excellent observations!':pct>=50?'Good work. Review the science explanations and practise again.':'Every attempt helps you learn. Review the diagrams and try again.';
 const list=$('reviewList');list.replaceChildren();
 questions.forEach((q,i)=>{
  const good=testAnswers[i]===q.answer;
  const details=document.createElement('details');details.className=good?'ok':'miss';
  const summary=document.createElement('summary');summary.textContent=(i+1)+'. '+(good?'Correct':'Review')+' — '+q.text;
  const report=document.createElement('p');
  const you=document.createElement('strong');you.textContent='Your answer: ';
  const correct=document.createElement('strong');correct.textContent='Correct answer: ';
  report.append(you,document.createTextNode((testAnswers[i]||'Not answered')+'  ·  '),correct,document.createTextNode(q.answer));
  const explanation=document.createElement('p');explanation.textContent=q.explanation;
  details.append(summary,report);
  const artwork=visuals?.illustrate(q);
  if(artwork){
   const figure=document.createElement('figure');figure.className='review-figure';
   const image=document.createElement('img');image.alt=artwork.alt;image.loading='lazy';
   image.src='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(artwork.svg);
   figure.appendChild(image);details.appendChild(figure);
  }
  details.appendChild(explanation);list.appendChild(details);
 });
 $('score').textContent=score+' / '+questions.length;
 saveProgress();
}
function boot(){
 document.body.dataset.year=year;
 $('yearLabel').textContent=label;$('yearLabel2').textContent=label;
 $('yearSelect').value=year;
 $('heroTitle').replaceChildren(document.createTextNode(label+' '),(()=>{
  const span=document.createElement('span');span.textContent='Science Studio';return span;
 })());
 $('heroCopy').textContent='Explore the natural world through original diagrams, observations and science questions created for '+label+'.';
 $('learningBack').href='learning.html?year='+encodeURIComponent(year);
 $('hubBack').href='learning.html?year='+encodeURIComponent(year);
 document.title=label+' Science Studio | SkillUP';
 buildTopics();setTopic(topic);
 $('yearSelect').onchange=e=>{
  const next=e.target.value,newTopics=new Set((core[next]||[]).map(q=>q.topic));
  const targetTopic=newTopics.has(topic)?topic:null;
  location.href='science-practice.html?year='+encodeURIComponent(next)+(targetTopic?'&topic='+encodeURIComponent(targetTopic):'');
 };
 document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
 $('check').onclick=markPractice;
 $('next').onclick=()=>{if(index+1<questions.length){index++;renderPractice()}else reset()};
 $('startTest').onclick=startTest;
 $('testPrev').onclick=()=>{if(index>0){index--;renderTest()}};
 $('testNext').onclick=()=>{if(index+1<questions.length){index++;renderTest()}else finishTest()};
 $('finishEarly').onclick=finishTest;
 $('again').onclick=reset;
}
boot();
window.SKILLUP_SCIENCE_STUDIO={getState:()=>({year,topic,mode,index,total:questions.length,score,reviewed:reviewed.size}),topics,questionCount:topicName=>all.filter(q=>topicName==='mixed'||q.topic===topicName).length};
})();

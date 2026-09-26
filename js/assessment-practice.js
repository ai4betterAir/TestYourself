(function(){
const $=id=>document.getElementById(id);
const shuffle=a=>[...a].sort(()=>Math.random()-.5);

const ADV_Y4_FOR_N3=new Set(['placevalue','addsubconcepts','addition','multiplication','division','measurement','data','fractionconcepts','geometry','perimeterarea']);
const ADV_Y3_FOR_OC=new Set(['multiplication','division','fractions','time','measurement','perimeter','data','wordproblems']);

const configs={
  naplan:{
    title:'NAPLAN Numeracy',
    tag:'NAPLAN',
    summary:'Core skills + challenge practice',
    copy:'A single NAPLAN numeracy pool with core skills, mixed questions, challenge practice and extension work.',
    accent:'Build. Practise. Test.',
    practiceTarget:24,mockTarget:35,minutes:40,
    sources:[
      {key:'ncore',label:'Core practice',tone:'blue'},
      {key:'nchallenge',label:'Challenge practice',tone:'violet'},
      {key:'nextension',label:'Extension practice',tone:'green'}
    ]
  },
  naplan3:{
    title:'NAPLAN Year 3 Numeracy',
    tag:'NAPLAN YEAR 3',
    summary:'Core skills + challenge practice',
    copy:'A broad NAPLAN practice pool combining core skills with progressively harder challenge questions.',
    accent:'Then test them.',
    practiceTarget:20,mockTarget:30,minutes:35,
    sources:[
      {key:'y3',label:'Core practice',tone:'blue'},
      {key:'y4adv',label:'Challenge practice',tone:'violet'}
    ]
  },
  naplan5:{
    title:'NAPLAN Year 5 Numeracy',
    tag:'NAPLAN YEAR 5',
    summary:'Core skills + mixed extension',
    copy:'A broad NAPLAN practice pool combining core, mixed and extension questions.',
    accent:'Build. Stretch. Test.',
    practiceTarget:24,mockTarget:35,minutes:40,
    sources:[
      {key:'y4',label:'Core practice',tone:'violet'},
      {key:'y5',label:'Mixed practice',tone:'blue'},
      {key:'y5extra',label:'Extension practice',tone:'green'}
    ]
  },
  oc4:{
    title:'OC Mathematical Reasoning',
    tag:'OPPORTUNITY CLASS',
    summary:'Core reasoning + challenge practice',
    copy:'A separate OC reasoning pool that builds from core skills into more challenging mixed questions.',
    accent:'Think deeper. Reason faster.',
    practiceTarget:24,mockTarget:35,minutes:35,
    sources:[
      {key:'y3adv',label:'Core reasoning',tone:'gold'},
      {key:'y4',label:'Challenge reasoning',tone:'violet'}
    ]
  }
};

function allTopics(){
  const y3=(window.TY_YEARS345?.topics?.['3']||[]).filter(x=>x[0]!=='mixed');
  const y5=(window.TY_YEARS345?.topics?.['5']||[]).filter(x=>x[0]!=='mixed');
  const y4=(window.TY_YEAR4?.topics||[]).filter(x=>x[0]!=='mixed');
  const y5extra=(window.TY_YEAR5_TESTS?.topics||[]).filter(x=>x[0]!=='mixed');
  return {y3,y4,y5,y5extra};
}

function buildPool(mode){
  const {y3,y4,y5,y5extra}=allTopics();
  if(mode==='naplan'){
    return [
      ...y3.map(t=>entry('ncore','Core practice',t)),
      ...y4.map(t=>entry('nchallenge','Challenge practice',t)),
      ...y5.map(t=>entry('nchallenge','Challenge practice',t)),
      ...y5extra.map(t=>entry('nextension','Extension practice',t))
    ];
  }
  if(mode==='naplan3'){
    return [
      ...y3.map(t=>entry('y3','Core practice',t)),
      ...y4.filter(t=>ADV_Y4_FOR_N3.has(t[0])).map(t=>entry('y4adv','Challenge practice',t))
    ];
  }
  if(mode==='naplan5'){
    return [
      ...y4.map(t=>entry('y4','Core practice',t)),
      ...y5.map(t=>entry('y5','Mixed practice',t)),
      ...y5extra.map(t=>entry('y5extra','Extension practice',t))
    ];
  }
  return [
    ...y3.filter(t=>ADV_Y3_FOR_OC.has(t[0])).map(t=>entry('y3adv','Core reasoning',t)),
    ...y4.map(t=>entry('y4','Challenge reasoning',t))
  ];
}

function entry(source,sourceLabel,t){
  return {source,sourceLabel,id:t[0],icon:t[1],name:t[2],desc:t[3]};
}

function sourceQuestion(e){
  let q;
  if(e.source==='y3'||e.source==='y3adv') q=window.TY_YEARS345.question('3',e.id);
  else if(e.source==='y4'||e.source==='y4adv') q=window.TY_YEAR4.question(e.id);
  else if(e.source==='y5') q=window.TY_YEARS345.question('5',e.id);
  else if(e.source==='ncore') q=window.TY_YEARS345.question('3',e.id);
  else if(e.source==='nchallenge'){
    const y4ids=new Set((window.TY_YEAR4?.topics||[]).map(x=>x[0]));
    q=y4ids.has(e.id)?window.TY_YEAR4.question(e.id):window.TY_YEARS345.question('5',e.id);
  }
  else if(e.source==='nextension') q=window.TY_YEAR5_TESTS.question(e.id);
  else q=window.TY_YEAR5_TESTS.question(e.id);
  return normalize(q,e);
}

function normalize(q,e){
  const answer=String(q.answer);
  let choices=Array.isArray(q.choices)?q.choices.map(String):[];
  if(!choices.includes(answer))choices.unshift(answer);
  choices=[...new Set(choices)];
  while(choices.length<4){
    const n=Number(q.answer);
    if(Number.isFinite(n))choices.push(String(n+choices.length));
    else choices.push('Not enough information '+choices.length);
    choices=[...new Set(choices)];
  }
  return {...q,answer,choices:shuffle(choices.slice(0,4)),_entry:e,_source:e.sourceLabel,_topic:e.name};
}

function safeQuestion(e){
  let q,guard=0;
  do{q=sourceQuestion(e);guard++;}while((!q.text||q.choices.length<2)&&guard<20);
  return q;
}

function qs(sel){return document.querySelector(sel)}
function qsa(sel){return [...document.querySelectorAll(sel)]}

const lockedMode=document.body.dataset.lockedMode||'';
const requestedView=new URLSearchParams(location.search).get('view')==='mock'?'mock':'practice';
let mode=lockedMode||new URLSearchParams(location.search).get('mode')||'naplan';
if(!configs[mode])mode=lockedMode||'naplan3';
let pool=[],topicKey='mixed',view='practice';
let current=null,selected=null,checked=false,score=0,attempted=0,qnum=1;

function cfg(){return configs[mode]}
function currentPool(){
  if(topicKey==='mixed')return pool;
  return pool.filter(e=>key(e)===topicKey);
}
function key(e){return e.source+'::'+e.id}

function setMode(next){
  mode=lockedMode|| (configs[next]?next:'naplan3');
  pool=buildPool(mode);
  topicKey='mixed';score=0;attempted=0;qnum=1;
  if(!lockedMode){
    const page=location.pathname.split('/').pop()||'assessment-practice.html';
    history.replaceState(null,'',page+'?mode='+encodeURIComponent(mode));
  }
  document.body.dataset.assessmentMode=mode;
  qsa('[data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
  $('heroAccent').textContent=cfg().accent;
  $('summaryTag').textContent=cfg().tag;
  $('summaryCount').textContent=pool.length+' skill groups';
  $('summaryTitle').textContent=cfg().summary;
  $('summaryCopy').textContent=cfg().copy;
  $('workspaceTitle').textContent=cfg().title;
  $('mockTitle').textContent=cfg().title+' Mock';
  $('mockDescription').textContent=cfg().mockTarget+' mixed questions from this separate assessment pool.';
  $('mockQuestions').textContent=cfg().mockTarget;
  $('mockMinutes').textContent=cfg().minutes;
  $('mockTimer').textContent=cfg().minutes+':00';
  document.title=cfg().title+' | SkillUP';
  renderSources();
  renderTopics();
  nextPractice(true);
  showMockIntro();
}

function renderSources(){
  const counts={};
  pool.forEach(e=>counts[e.source]=(counts[e.source]||0)+1);
  $('sourceBars').innerHTML=cfg().sources.map(s=>{
    const n=counts[s.key]||0;
    const pct=Math.round(n/pool.length*100);
    return '<div class="source-row '+s.tone+'"><span><b>'+s.label+'</b><em>'+n+' groups</em></span><i><u style="width:'+pct+'%"></u></i></div>';
  }).join('');
}

function renderTopics(){
  $('topicCount').textContent=pool.length;
  const groups={};
  pool.forEach(e=>(groups[e.sourceLabel]??=[]).push(e));
  $('topicGroups').innerHTML=Object.entries(groups).map(([label,items])=>
    '<section class="topic-group"><h3>'+label+'</h3>'+items.map(e=>
      '<button class="topic-choice '+(topicKey===key(e)?'active':'')+'" data-topic="'+key(e)+'"><strong>'+e.icon+' '+e.name+'</strong><small>'+e.desc+'</small></button>'
    ).join('')+'</section>'
  ).join('');
  qsa('.topic-choice').forEach(b=>b.onclick=()=>{
    topicKey=b.dataset.topic;
    qnum=1;score=attempted=0;
    renderTopics();
    nextPractice(true);
    qs('.question-card').scrollIntoView({behavior:'smooth',block:'start'});
  });
}

function randomEntry(list){
  return list[Math.floor(Math.random()*list.length)];
}

function nextPractice(reset=false){
  if(reset){qnum=1}
  const list=currentPool();
  current=safeQuestion(randomEntry(list));
  selected=null;checked=false;
  $('questionSource').textContent=current._source;
  $('questionTopic').textContent=current._topic;
  $('questionNumber').textContent='QUESTION '+qnum+' OF '+cfg().practiceTarget;
  $('questionText').textContent=current.text;
  $('practiceScore').textContent=score+' / '+attempted;
  $('practiceBar').style.width=Math.round((qnum-1)/cfg().practiceTarget*100)+'%';
  $('feedbackBox').hidden=true;
  $('feedbackBox').className='feedback-box';
  $('feedbackBox').textContent='';
  $('checkAnswer').hidden=false;
  $('nextQuestion').hidden=true;
  renderAnswers('answerGrid',current.choices,(button,value)=>{
    if(checked)return;
    qsa('#answerGrid button').forEach(x=>x.classList.remove('selected'));
    button.classList.add('selected');selected=String(value);
  });
}

function renderAnswers(hostId,choices,handler){
  const host=$(hostId);host.innerHTML='';
  choices.forEach(v=>{
    const b=document.createElement('button');b.textContent=v;
    b.onclick=()=>handler(b,v);host.appendChild(b);
  });
}

$('showHint').onclick=()=>{
  $('feedbackBox').hidden=false;
  $('feedbackBox').className='feedback-box hint';
  $('feedbackBox').textContent='Hint: '+(current.tip||'Work through the problem one step at a time.');
};
$('checkAnswer').onclick=()=>{
  if(selected===null){
    $('feedbackBox').hidden=false;$('feedbackBox').className='feedback-box hint';$('feedbackBox').textContent='Choose an answer first.';return;
  }
  checked=true;attempted++;
  const ok=String(selected)===String(current.answer);
  if(ok)score++;
  qsa('#answerGrid button').forEach(b=>{
    b.disabled=true;
    if(String(b.textContent)===String(current.answer))b.classList.add('correct');
    else if(b.classList.contains('selected'))b.classList.add('wrong');
  });
  $('practiceScore').textContent=score+' / '+attempted;
  $('feedbackBox').hidden=false;
  $('feedbackBox').className='feedback-box '+(ok?'correct':'wrong');
  $('feedbackBox').innerHTML=ok?'<b>✓ Correct.</b> '+(current.explanation||current.tip||'Well done.'):'<b>Correct answer: '+current.answer+'</b><br>'+(current.explanation||current.tip||'Review the steps and try the next question.');
  $('checkAnswer').hidden=true;$('nextQuestion').hidden=false;
};
$('nextQuestion').onclick=()=>{
  qnum=qnum>=cfg().practiceTarget?1:qnum+1;
  nextPractice();
};

qsa('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
qsa('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
$('startMixed').onclick=()=>{setView('practice');topicKey='mixed';renderTopics();nextPractice(true);qs('.assessment-workspace').scrollIntoView({behavior:'smooth'})};
$('jumpMock').onclick=()=>{setView('mock');qs('.assessment-workspace').scrollIntoView({behavior:'smooth'})};

function setView(v){
  view=v;
  qsa('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
  $('practiceView').hidden=v!=='practice';
  $('mockView').hidden=v!=='mock';
  if(v==='mock')showMockIntro();
}

let mockQs=[],mockAnswers=[],mockIndex=0,mockSeconds=0,mockTimerHandle=null;
function makeMock(){
  const total=cfg().mockTarget,seen=new Set();mockQs=[];mockAnswers=Array(total).fill(null);
  let guard=0;
  while(mockQs.length<total&&guard++<2500){
    const e=randomEntry(pool),q=safeQuestion(e),k=q.text+'|'+q.answer;
    if(seen.has(k))continue;seen.add(k);mockQs.push(q);
  }
  while(mockQs.length<total)mockQs.push(safeQuestion(randomEntry(pool)));
  mockIndex=0;mockSeconds=cfg().minutes*60;
}
function showMockIntro(){
  clearInterval(mockTimerHandle);
  $('mockIntro').hidden=false;$('mockCard').hidden=true;$('mockResult').hidden=true;
  $('mockTimer').textContent=cfg().minutes+':00';
}
function tick(){
  const m=Math.floor(mockSeconds/60),s=mockSeconds%60;
  $('mockTimer').textContent=m+':'+String(s).padStart(2,'0');
}
function renderMock(){
  const q=mockQs[mockIndex];
  $('mockSource').textContent=q._source;$('mockTopic').textContent=q._topic;
  $('mockNumber').textContent='QUESTION '+(mockIndex+1)+' OF '+cfg().mockTarget;
  $('mockQuestionText').textContent=q.text;
  $('mockBar').style.width=Math.round((mockIndex+1)/cfg().mockTarget*100)+'%';
  $('mockAnswerGrid').innerHTML='';
  q.choices.forEach((v,i)=>{
    const b=document.createElement('button');b.textContent=v;
    if(mockAnswers[mockIndex]===i)b.classList.add('selected');
    b.onclick=()=>{mockAnswers[mockIndex]=i;renderMock()};
    $('mockAnswerGrid').appendChild(b);
  });
  $('mockPrev').disabled=mockIndex===0;
  $('mockNext').textContent=mockIndex===cfg().mockTarget-1?'Finish mock':'Next →';
}
function startMock(){
  clearInterval(mockTimerHandle);makeMock();
  $('mockIntro').hidden=true;$('mockCard').hidden=false;$('mockResult').hidden=true;
  renderMock();tick();
  mockTimerHandle=setInterval(()=>{mockSeconds--;tick();if(mockSeconds<=0)finishMock()},1000);
}
function finishMock(){
  clearInterval(mockTimerHandle);
  let totalScore=0;const byLevel={},wrong=[];
  mockQs.forEach((q,i)=>{
    const correctIndex=q.choices.findIndex(v=>String(v)===String(q.answer));
    const ok=mockAnswers[i]===correctIndex;
    if(ok)totalScore++;
    byLevel[q._source]??={right:0,total:0};byLevel[q._source].total++;if(ok)byLevel[q._source].right++;
    if(!ok)wrong.push({q:q.text,a:q.answer,c:mockAnswers[i]===null?'No answer':q.choices[mockAnswers[i]],level:q._source,topic:q._topic});
  });
  const pct=Math.round(totalScore/cfg().mockTarget*100);
  $('mockCard').hidden=true;$('mockResult').hidden=false;
  $('mockMark').textContent=totalScore+'/'+cfg().mockTarget;
  $('mockResultTitle').textContent=pct>=85?'Excellent preparation':pct>=70?'Strong progress':pct>=50?'Keep building':'Return to practice first';
  $('mockResultCopy').textContent='You scored '+pct+'%. Review the breakdown below, especially the harder source level.';
  $('levelBreakdown').innerHTML=Object.entries(byLevel).map(([name,v])=>'<div class="result-line"><span>'+name+'</span><b>'+v.right+' / '+v.total+'</b><i><u style="width:'+Math.round(v.right/v.total*100)+'%"></u></i></div>').join('');
  $('mistakeReview').innerHTML=wrong.length?wrong.slice(0,12).map((x,i)=>'<details><summary>'+(i+1)+'. '+x.topic+'</summary><p>'+x.q+'</p><p>Your answer: <b>'+x.c+'</b></p><p>Correct answer: <b>'+x.a+'</b></p></details>').join(''):'<p class="perfect">✓ No mistakes. Excellent work.</p>';
}
$('startMock').onclick=startMock;$('retryMock').onclick=startMock;
$('mockPrev').onclick=()=>{if(mockIndex>0){mockIndex--;renderMock()}};
$('mockNext').onclick=()=>{if(mockIndex===cfg().mockTarget-1)finishMock();else{mockIndex++;renderMock()}};

setMode(mode);
if(requestedView==='mock')setView('mock');
})();
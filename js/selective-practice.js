(function(){
const $=id=>document.getElementById(id),shuffle=a=>[...a].sort(()=>Math.random()-.5);
let stream='math',mode='mix',topic='mixed',current=null,selected=null,score=0,attempted=0,qnum=1,view='practice';
const y5base=()=>window.TY_YEARS345?.topics?.['5']||[],y5extra=()=>window.TY_YEAR5_TESTS?.topics||[],y6=()=>window.TY_YEAR6?.topics||[],thinking=()=>window.SKILLUP_THINKING?.topics||[];
function unique(list){const seen=new Set();return list.filter(x=>{if(seen.has(x[0]))return false;seen.add(x[0]);return true})}
function practiceTarget(){return stream==='thinking'?30:20}
function mockTarget(){return stream==='thinking'?30:20}
function mockDuration(){return stream==='thinking'?1800:1500}
function modeLabel(){if(stream==='thinking')return mode==='5'?'Foundation':mode==='6'?'Challenge':'Mixed Thinking';return mode==='5'?'Year 5':mode==='6'?'Year 6':'Year 5–6'}
function topicsFor(m){
 if(stream==='thinking')return thinking();
 if(m==='5')return unique([...y5base(),...y5extra()]);
 if(m==='6')return y6();
 return unique([...y5base(),...y5extra(),...y6()].filter(x=>x[0]!=='mixed'));
}
function sourceFor(id,preferred){
 if(preferred==='6')return['6',window.TY_YEAR6];
 if(preferred==='5'){const ex=new Set(y5extra().map(x=>x[0]));return ex.has(id)?['5',window.TY_YEAR5_TESTS]:['5',window.TY_YEARS345]}
 const candidates=[];
 if(y5base().some(x=>x[0]===id))candidates.push(['5',window.TY_YEARS345]);
 if(y5extra().some(x=>x[0]===id))candidates.push(['5',window.TY_YEAR5_TESTS]);
 if(y6().some(x=>x[0]===id))candidates.push(['6',window.TY_YEAR6]);
 return candidates[Math.floor(Math.random()*candidates.length)]||['6',window.TY_YEAR6];
}
function make(id=topic){
 if(stream==='thinking'){
   const use=id==='mixed'?'mixed':id;
   const q=window.SKILLUP_THINKING.question(use,mode);
   return {...q,_year:modeLabel(),_topic:q.topic,_name:q.name||thinking().find(x=>x[0]===q.topic)?.[2]||q.topic};
 }
 let use=id;
 if(use==='mixed'){const pool=topicsFor(mode).filter(x=>x[0]!=='mixed');use=pool[Math.floor(Math.random()*pool.length)][0]}
 const [yr,src]=sourceFor(use,mode==='mix'?null:mode);
 let q=yr==='5'&&src===window.TY_YEARS345?src.question('5',use):src.question(use);
 q={...q,_year:'Year '+yr,_topic:use,_name:(topicsFor(mode).find(x=>x[0]===use)?.[2]||use)};
 return q;
}
function updateHeader(){
 const isThinking=stream==='thinking';
 $('heroTag').textContent=isThinking?'SELECTIVE · THINKING SKILLS':'NSW SELECTIVE · MATHEMATICAL REASONING';
 $('heroTitle').innerHTML=isThinking?'Think clearly.<br><span>Reason carefully.</span>':'Build reasoning.<br><span>Then test it.</span>';
 $('heroDesc').textContent=isThinking?'Practice original SkillUP questions based on common selective and Opportunity Class thinking-skill formats: logic, evidence, ordering, arrangements, time, rates, data and arguments.':'Focused Year 5–6 mathematical reasoning practice using the SkillUP question banks. This is SkillUP practice, not an official NSW test.';
 $('mockTabLabel').textContent=isThinking?'30-question Mock':'20-question Mock';
 $('mode5').textContent=isThinking?'Foundation Thinking':'Year 5 Foundation';
 $('mode6').textContent=isThinking?'Challenge Thinking':'Year 6 Challenge';
 $('modeMix').textContent=isThinking?'Mixed Thinking':'Mixed Year 5–6';
 $('notice').innerHTML=isThinking?'The uploaded trial papers use a <b>30-question / 30-minute</b> Thinking Skills format. SkillUP follows that timing for its new, rewritten questions. Use Practice for hints, then try the timed mock.':'Use <b>Practice</b> to learn from hints. Use <b>Mock</b> when you are ready to work without hints and receive a result breakdown.';
 $('practiceHeading').textContent=isThinking?'Choose a Thinking Skills topic, or use Mixed Thinking':'Choose a skill, or use Mixed Selective';
 $('practiceSub').textContent=isThinking?'Question styles include conditional logic, strongest conclusion, ordering, seating, time, number reasoning, data, probability and arguments.':'Practise one topic at a time with a short hint after each question.';
 $('mockTitle').textContent=isThinking?'30-question Thinking Skills Mock':'20-question SkillUP Mock';
 $('mockIntroText').textContent=isThinking?'30 mixed Thinking Skills questions. No hints. 30-minute timer. You can move between questions before finishing.':'20 mixed mathematical reasoning questions. No hints. 25-minute timer. You can move between questions before finishing.';
 document.querySelectorAll('.streambar button').forEach(b=>b.classList.toggle('active',b.dataset.stream===stream));
}
function buildTopics(){
 const list=topicsFor(mode),target=practiceTarget();
 $('topicCount').textContent=list.filter(x=>x[0]!=='mixed').length;
 $('topics').innerHTML='';
 const mixed=document.createElement('button');mixed.className='topic '+(topic==='mixed'?'active':'');mixed.innerHTML=`<b>⚡ ${stream==='thinking'?'Mixed Thinking':'Mixed Selective'}</b><span>${stream==='thinking'?'Random questions across all thinking-skill categories':'Random questions across all available maths skills'}</span>`;mixed.onclick=()=>choose('mixed');$('topics').appendChild(mixed);
 list.filter(x=>x[0]!=='mixed').forEach(x=>{const b=document.createElement('button');b.className='topic '+(topic===x[0]?'active':'');b.innerHTML=`<b>${x[1]} ${x[2]}</b><span>${x[3]}</span>`;b.onclick=()=>choose(x[0]);$('topics').appendChild(b)});
 $('qnum').textContent=`${qnum} / ${target}`;
}
function choose(id){topic=id;qnum=1;score=attempted=0;buildTopics();nextQ();$('practiceView').scrollIntoView({behavior:'smooth'})}
function renderAnswers(hostId,q,clickHandler){const host=$(hostId);host.innerHTML='';shuffle(q.choices).forEach(v=>{const b=document.createElement('button');b.textContent=v;b.onclick=()=>clickHandler(b,v);host.appendChild(b)})}
function nextQ(){
 current=make();selected=null;
 $('question').textContent=current.text;
 $('tip').textContent='💡 '+(current.tip||'Use your best reasoning.');
 $('feedback').textContent='';
 $('badge').textContent=topic==='mixed'?(stream==='thinking'?'Mixed Thinking':'Mixed Selective'):current._name;
 $('level').textContent=current._year||modeLabel();
 $('qnum').textContent=`${qnum} / ${practiceTarget()}`;
 $('score').textContent=`${score} / ${attempted}`;
 renderAnswers('answers',current,(b)=>{const host=$('answers');host.querySelectorAll('button').forEach(z=>z.classList.remove('selected'));b.classList.add('selected');selected=b});
}
function setView(v){
 view=v;document.querySelectorAll('.top-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
 $('practiceView').hidden=v!=='practice';$('mockView').hidden=v!=='mock';
 if(v==='mock')showMockIntro();else{$('timerText').textContent='—'}
}
function setStream(s){
 stream=s;topic='mixed';score=attempted=0;qnum=1;mode='mix';
 document.querySelectorAll('.modebar button').forEach(b=>b.classList.toggle('active',b.dataset.mode==='mix'));
 updateHeader();buildTopics();nextQ();showMockIntro();setView('practice');
}
document.querySelectorAll('.streambar button').forEach(b=>b.onclick=()=>setStream(b.dataset.stream));
document.querySelectorAll('.top-tabs button').forEach(b=>b.onclick=()=>setView(b.dataset.view));
document.querySelectorAll('.modebar button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.modebar button').forEach(x=>x.classList.remove('active'));b.classList.add('active');mode=b.dataset.mode;topic='mixed';score=attempted=0;qnum=1;buildTopics();nextQ();showMockIntro()});
$('check').onclick=()=>{
 if(!selected){$('feedback').textContent='Choose an answer first.';return}
 if(selected.dataset.checked)return;
 attempted++;
 const ok=String(selected.textContent)===String(current.answer);
 if(ok){score++;selected.classList.add('correct');$('feedback').textContent='✓ Correct!'}
 else{selected.classList.add('wrong');[...$('answers').children].find(b=>String(b.textContent)===String(current.answer))?.classList.add('correct');$('feedback').textContent=`Answer: ${current.answer}`}
 selected.dataset.checked='1';$('score').textContent=`${score} / ${attempted}`;
};
$('next').onclick=()=>{const target=practiceTarget();qnum=qnum>=target?1:qnum+1;nextQ()};
let mockQs=[],mockAnswers=[],mockIndex=0,mockSeconds=1500,mockTimer=null;
function showMockIntro(){clearInterval(mockTimer);mockSeconds=mockDuration();$('mockIntro').hidden=false;$('mockQuiz').hidden=true;$('mockResult').hidden=true;tick()}
function buildMock(){
 const total=mockTarget();mockQs=[];mockAnswers=Array(total).fill(null);mockIndex=0;mockSeconds=mockDuration();const seen=new Set();let guard=0;
 while(mockQs.length<total&&guard++<600){const q=make('mixed'),key=q.text+'|'+q.answer;if(seen.has(key))continue;seen.add(key);mockQs.push(q)}
 while(mockQs.length<total)mockQs.push(make('mixed'));
}
function tick(){const m=Math.floor(mockSeconds/60),s=mockSeconds%60;$('mockTimer').textContent=`${m}:${String(s).padStart(2,'0')}`;$('timerText').textContent=$('mockTimer').textContent}
function renderMock(){
 const q=mockQs[mockIndex],total=mockTarget();
 $('mockCount').textContent=`Question ${mockIndex+1} of ${total} · ${q._year||modeLabel()} · ${q._name}`;
 $('mockQuestion').textContent=q.text;$('mockAnswers').innerHTML='';
 q.choices.forEach((v,i)=>{const b=document.createElement('button');b.textContent=v;if(mockAnswers[mockIndex]===i)b.classList.add('selected');b.onclick=()=>{mockAnswers[mockIndex]=i;renderMock()};$('mockAnswers').appendChild(b)});
 $('mockPrev').disabled=mockIndex===0;$('mockNext').textContent=mockIndex===total-1?'Finish Mock':'Next →';
}
function startMock(){clearInterval(mockTimer);buildMock();$('mockIntro').hidden=true;$('mockResult').hidden=true;$('mockQuiz').hidden=false;renderMock();tick();mockTimer=setInterval(()=>{mockSeconds--;tick();if(mockSeconds<=0)finishMock()},1000)}
function finishMock(){
 clearInterval(mockTimer);let totalScore=0;const by={},wrong=[];
 mockQs.forEach((q,i)=>{const ci=q.choices.findIndex(v=>String(v)===String(q.answer)),ok=mockAnswers[i]===ci;totalScore+=ok?1:0;by[q._name]??={r:0,t:0};by[q._name].t++;if(ok)by[q._name].r++;else wrong.push({q:q.text,a:q.answer,c:mockAnswers[i]===null?'No answer':q.choices[mockAnswers[i]],n:q._name})});
 const total=mockTarget(),pct=Math.round(totalScore/total*100);
 $('mockQuiz').hidden=true;$('mockResult').hidden=false;$('mockMark').textContent=`${totalScore}/${total}`;
 $('mockMessage').textContent=pct>=85?'Excellent reasoning. Review any missed questions, then try another mock.':pct>=70?'Strong result — review the mistakes below.':pct>=50?'Good foundation — practise the weaker topics before trying again.':'Return to Practice with hints, then try another mock.';
 $('mockBreakdown').innerHTML=Object.entries(by).sort((a,b)=>(a[1].r/a[1].t)-(b[1].r/b[1].t)).map(([n,v])=>`<p><b>${n}</b> — ${v.r}/${v.t}</p>`).join('');
 $('mockReview').innerHTML=wrong.length?wrong.map((x,i)=>`<details><summary>${i+1}. ${x.n}: ${x.q}</summary><p>Your answer: <b>${x.c}</b></p><p>Correct answer: <b>${x.a}</b></p></details>`).join(''):'<p>✓ No mistakes.</p>';
 localStorage.setItem(`skillup-selective-${stream}-last`,JSON.stringify({score:totalScore,total,pct,date:new Date().toISOString()}));
}
$('startMock').onclick=startMock;$('retryMock').onclick=startMock;$('mockPrev').onclick=()=>{if(mockIndex){mockIndex--;renderMock()}};$('mockNext').onclick=()=>{if(mockIndex===mockTarget()-1)finishMock();else{mockIndex++;renderMock()}};
updateHeader();buildTopics();nextQ();setView('practice');
})();
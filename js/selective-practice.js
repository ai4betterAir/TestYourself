(function(){
const $=id=>document.getElementById(id),shuffle=a=>[...a].sort(()=>Math.random()-.5);
let stream='math',mode='mix',topic='mixed',current=null,selected=null,score=0,attempted=0,qnum=1,view='practice';
const y5base=()=>window.TY_YEARS345?.topics?.['5']||[],y5extra=()=>window.TY_YEAR5_TESTS?.topics||[],y6=()=>window.TY_YEAR6?.topics||[],thinking=()=>window.SKILLUP_THINKING?.topics||[],mrExtra=()=>window.SKILLUP_MR_EXTRA?.topics||[],reading=()=>window.SKILLUP_READING?.topics||[];
function unique(list){const seen=new Set();return list.filter(x=>{if(seen.has(x[0]))return false;seen.add(x[0]);return true})}
function practiceTarget(){return stream==='thinking'||stream==='reading'?30:20}
function mockTarget(){if(stream==='math')return 35;return 30}
function mockDuration(){if(stream==='math')return 2400;if(stream==='reading')return 2100;return 1800}
function modeLabel(){
 if(stream==='thinking')return mode==='5'?'Foundation Thinking':mode==='6'?'Challenge Thinking':'Mixed Thinking';
 if(stream==='reading')return mode==='5'?'Reading Core':mode==='6'?'Reading Challenge':'Mixed Reading';
 return mode==='5'?'Year 5':mode==='6'?'Year 6':'Year 5–6';
}
function topicsFor(m){
 if(stream==='thinking')return thinking();
 if(stream==='reading')return reading();
 if(m==='5')return unique([...y5base(),...y5extra(),...mrExtra()]);
 if(m==='6')return unique([...y6(),...mrExtra()]);
 return unique([...y5base(),...y5extra(),...y6(),...mrExtra()].filter(x=>x[0]!=='mixed'));
}
function sourceFor(id,preferred){
 if(mrExtra().some(x=>x[0]===id))return['Selective',window.SKILLUP_MR_EXTRA];
 if(preferred==='6')return['6',window.TY_YEAR6];
 if(preferred==='5'){const ex=new Set(y5extra().map(x=>x[0]));return ex.has(id)?['5',window.TY_YEAR5_TESTS]:['5',window.TY_YEARS345]}
 const candidates=[];
 if(y5base().some(x=>x[0]===id))candidates.push(['5',window.TY_YEARS345]);
 if(y5extra().some(x=>x[0]===id))candidates.push(['5',window.TY_YEAR5_TESTS]);
 if(y6().some(x=>x[0]===id))candidates.push(['6',window.TY_YEAR6]);
 if(mrExtra().some(x=>x[0]===id))candidates.push(['Selective',window.SKILLUP_MR_EXTRA]);
 return candidates[Math.floor(Math.random()*candidates.length)]||['Selective',window.SKILLUP_MR_EXTRA];
}
function make(id=topic){
 if(stream==='thinking'){
   const q=window.SKILLUP_THINKING.question(id==='mixed'?'mixed':id,mode);
   return {...q,_year:modeLabel(),_topic:q.topic,_name:q.name||thinking().find(x=>x[0]===q.topic)?.[2]||q.topic};
 }
 if(stream==='reading'){
   const q=window.SKILLUP_READING.question(id==='mixed'?'mixed':id,mode);
   return {...q,_year:modeLabel(),_topic:q.topic,_name:q.name||reading().find(x=>x[0]===q.topic)?.[2]||q.topic};
 }
 let use=id;
 if(use==='mixed'){const pool=topicsFor(mode).filter(x=>x[0]!=='mixed');use=pool[Math.floor(Math.random()*pool.length)][0]}
 const [yr,src]=sourceFor(use,mode==='mix'?null:mode);
 let q;
 if(src===window.SKILLUP_MR_EXTRA)q=src.question(use);
 else q=yr==='5'&&src===window.TY_YEARS345?src.question('5',use):src.question(use);
 q={...q,_year:yr==='Selective'?'Selective':('Year '+yr),_topic:use,_name:(topicsFor(mode).find(x=>x[0]===use)?.[2]||q.name||use)};
 return q;
}
function updateHeader(){
 const isThinking=stream==='thinking',isReading=stream==='reading';
 $('heroTag').textContent=isThinking?'SELECTIVE · THINKING SKILLS':isReading?'SELECTIVE · READING':'NSW SELECTIVE · MATHEMATICAL REASONING';
 $('heroTitle').innerHTML=isThinking?'Think clearly.<br><span>Reason carefully.</span>':isReading?'Read closely.<br><span>Find the evidence.</span>':'Build reasoning.<br><span>Then test it.</span>';
 $('heroDesc').textContent=isThinking?'Practice original SkillUP questions based on common selective and Opportunity Class thinking-skill formats: logic, evidence, ordering, arrangements, time, rates, data and arguments.':isReading?'Selective-style reading practice with original SkillUP passages: paired texts, inference, vocabulary in context, purpose, poetry, cohesion, sentence placement and multiple extracts.':'Focused Year 5–6 mathematical reasoning with the existing SkillUP banks plus new selective-style multi-step, rate, fraction, percentage, geometry, data, algebra, time and spatial reasoning.';
 $('mockTabLabel').textContent=isThinking||isReading?'30-question Mock':'35-question Mock';
 $('mode5').textContent=isThinking?'Foundation Thinking':isReading?'Reading Core':'Year 5 Foundation';
 $('mode6').textContent=isThinking?'Challenge Thinking':isReading?'Reading Challenge':'Year 6 Textbook + Selective';
 $('modeMix').textContent=isThinking?'Mixed Thinking':isReading?'Mixed Reading':'Mixed Year 5–6';
 $('notice').innerHTML=isThinking?'Thinking Skills uses a <b>30-question / 30-minute</b> SkillUP mock. Practice includes hints; the mock removes hints.':isReading?'Reading practice uses <b>original SkillUP passages</b> shaped around common selective formats found in the uploaded material. The SkillUP mock has 30 questions and a 35-minute timer.':'The uploaded Mathematical Reasoning material commonly uses <b>35 questions in 40 minutes</b>. SkillUP now offers that full mock length, while Practice remains shorter and topic-focused.';
 $('practiceHeading').textContent=isThinking?'Choose a Thinking Skills topic, or use Mixed Thinking':isReading?'Choose a Reading skill, or use Mixed Reading':'Choose a skill, or use Mixed Selective';
 $('practiceSub').textContent=isThinking?'Question styles include conditional logic, strongest conclusion, ordering, seating, time, number reasoning, data, probability and arguments.':isReading?'Practise paired texts, inference, vocabulary, purpose, poetry, sequence, sentence placement and multiple-extract matching.':mode==='6'?'Practise the eight major Grade 6 textbook topic groups plus Selective extension skills.':'Practise one topic at a time with a short hint after each question.';
 $('mockTitle').textContent=isThinking?'30-question Thinking Skills Mock':isReading?'30-question Selective Reading Mock':'35-question Mathematical Reasoning Mock';
 $('mockIntroText').textContent=isThinking?'30 mixed Thinking Skills questions. No hints. 30-minute timer. You can move between questions before finishing.':isReading?'30 mixed Reading questions. No hints. 35-minute timer. Passages and questions are original SkillUP material.':'35 mixed mathematical reasoning questions. No hints. 40-minute timer. You can move between questions before finishing.';
 $('sourceNote').textContent=isThinking?'SkillUP Thinking Skills questions are newly written and adapted from common selective/OC reasoning formats. They are not copied test-paper questions and are not official NSW questions.':isReading?'SkillUP Reading uses newly written passages and questions while following the uploaded materials’ common structures such as paired texts, inference, vocabulary, literary technique, cohesion and multi-extract comparison.':mode==='6'?'This menu includes eight broad topic groups from the Grade 6 textbook and additional Selective reasoning topics. All practice questions are newly written for SkillUP.':'SkillUP Mathematical Reasoning combines the existing Year 5–6 banks with newly written selective-style problems inspired by the uploaded books and trial papers. Numbers, wording and contexts are changed.';
 document.querySelectorAll('.streambar button').forEach(b=>b.classList.toggle('active',b.dataset.stream===stream));
}
function buildTopics(){
 const list=topicsFor(mode),target=practiceTarget();
 $('topicCount').textContent=list.filter(x=>x[0]!=='mixed').length;
 $('topics').innerHTML='';
 const mixed=document.createElement('button');mixed.className='topic '+(topic==='mixed'?'active':'');mixed.innerHTML=`<b>⚡ ${stream==='thinking'?'Mixed Thinking':stream==='reading'?'Mixed Reading':'Mixed Selective'}</b><span>${stream==='thinking'?'Random questions across all thinking-skill categories':stream==='reading'?'Random questions across all reading-skill categories':'Random questions across all available maths skills'}</span>`;mixed.onclick=()=>choose('mixed');$('topics').appendChild(mixed);
 list.filter(x=>x[0]!=='mixed').forEach(x=>{const b=document.createElement('button');b.className='topic '+(topic===x[0]?'active':'');b.innerHTML=`<b>${x[1]} ${x[2]}</b><span>${x[3]}</span>`;b.onclick=()=>choose(x[0]);$('topics').appendChild(b)});
 $('qnum').textContent=`${qnum} / ${target}`;
}
function choose(id){topic=id;qnum=1;score=attempted=0;buildTopics();nextQ();window.scrollTo({top:document.querySelector('.quiz').offsetTop-80,behavior:'smooth'})}
function renderAnswers(hostId,q,clickHandler){const host=$(hostId);host.innerHTML='';shuffle(q.choices).forEach(v=>{const b=document.createElement('button');b.textContent=v;b.onclick=()=>clickHandler(b,v);host.appendChild(b)})}
function nextQ(){
 current=make();selected=null;
 $('question').textContent=current.text;
 $('tip').textContent='💡 '+(current.tip||'Use your best reasoning.');
 $('feedback').textContent='';
 $('badge').textContent=topic==='mixed'?(stream==='thinking'?'Mixed Thinking':stream==='reading'?'Mixed Reading':'Mixed Selective'):current._name;
 $('level').textContent=current._year||modeLabel();
 $('qnum').textContent=`${qnum} / ${practiceTarget()}`;
 $('score').textContent=`${score} / ${attempted}`;
 renderAnswers('answers',current,(b)=>{const host=$('answers');host.querySelectorAll('button').forEach(z=>z.classList.remove('selected'));b.classList.add('selected');selected=b});
}
function setView(v){view=v;document.querySelectorAll('.top-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.view===v));$('practiceView').hidden=v!=='practice';$('mockView').hidden=v!=='mock';if(v==='mock')showMockIntro();else $('timerText').textContent='—'}
function setStream(s){stream=s;topic='mixed';score=attempted=0;qnum=1;mode='mix';document.querySelectorAll('.modebar button').forEach(b=>b.classList.toggle('active',b.dataset.mode==='mix'));updateHeader();buildTopics();nextQ();showMockIntro();setView('practice')}
document.querySelectorAll('.streambar button').forEach(b=>b.onclick=()=>setStream(b.dataset.stream));
document.querySelectorAll('.top-tabs button').forEach(b=>b.onclick=()=>setView(b.dataset.view));
document.querySelectorAll('.modebar button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.modebar button').forEach(x=>x.classList.remove('active'));b.classList.add('active');mode=b.dataset.mode;topic='mixed';score=attempted=0;qnum=1;updateHeader();buildTopics();nextQ();showMockIntro()});
$('check').onclick=()=>{if(!selected){$('feedback').textContent='Choose an answer first.';return}if(selected.dataset.checked)return;attempted++;const ok=String(selected.textContent)===String(current.answer);if(ok){score++;selected.classList.add('correct');$('feedback').textContent='✓ Correct!'}else{selected.classList.add('wrong');[...$('answers').children].find(b=>String(b.textContent)===String(current.answer))?.classList.add('correct');$('feedback').textContent=`Answer: ${current.answer}`}selected.dataset.checked='1';$('score').textContent=`${score} / ${attempted}`};
$('next').onclick=()=>{const target=practiceTarget();qnum=qnum>=target?1:qnum+1;nextQ()};
let mockQs=[],mockAnswers=[],mockIndex=0,mockSeconds=1500,mockTimer=null;
function showMockIntro(){clearInterval(mockTimer);mockSeconds=mockDuration();$('mockIntro').hidden=false;$('mockQuiz').hidden=true;$('mockResult').hidden=true;tick()}
function buildMock(){const total=mockTarget();mockQs=[];mockAnswers=Array(total).fill(null);mockIndex=0;mockSeconds=mockDuration();const seen=new Set();let guard=0;while(mockQs.length<total&&guard++<1200){const q=make('mixed'),key=q.text+'|'+q.answer;if(seen.has(key))continue;seen.add(key);mockQs.push(q)}while(mockQs.length<total)mockQs.push(make('mixed'))}
function tick(){const m=Math.floor(mockSeconds/60),s=mockSeconds%60;$('mockTimer').textContent=`${m}:${String(s).padStart(2,'0')}`;$('timerText').textContent=$('mockTimer').textContent}
function renderMock(){const q=mockQs[mockIndex],total=mockTarget();$('mockCount').textContent=`Question ${mockIndex+1} of ${total} · ${q._year||modeLabel()} · ${q._name}`;$('mockQuestion').textContent=q.text;$('mockAnswers').innerHTML='';q.choices.forEach((v,i)=>{const b=document.createElement('button');b.textContent=v;if(mockAnswers[mockIndex]===i)b.classList.add('selected');b.onclick=()=>{mockAnswers[mockIndex]=i;renderMock()};$('mockAnswers').appendChild(b)});$('mockPrev').disabled=mockIndex===0;$('mockNext').textContent=mockIndex===total-1?'Finish Mock':'Next →'}
function startMock(){clearInterval(mockTimer);buildMock();$('mockIntro').hidden=true;$('mockResult').hidden=true;$('mockQuiz').hidden=false;renderMock();tick();mockTimer=setInterval(()=>{mockSeconds--;tick();if(mockSeconds<=0)finishMock()},1000)}
function finishMock(){clearInterval(mockTimer);let totalScore=0;const by={},wrong=[];mockQs.forEach((q,i)=>{const ci=q.choices.findIndex(v=>String(v)===String(q.answer)),ok=mockAnswers[i]===ci;totalScore+=ok?1:0;by[q._name]??={r:0,t:0};by[q._name].t++;if(ok)by[q._name].r++;else wrong.push({q:q.text,a:q.answer,c:mockAnswers[i]===null?'No answer':q.choices[mockAnswers[i]],n:q._name})});const total=mockTarget(),pct=Math.round(totalScore/total*100);$('mockQuiz').hidden=true;$('mockResult').hidden=false;$('mockMark').textContent=`${totalScore}/${total}`;$('mockMessage').textContent=pct>=85?'Excellent reasoning. Review any missed questions, then try another mock.':pct>=70?'Strong result — review the mistakes below.':pct>=50?'Good foundation — practise the weaker topics before trying again.':'Return to Practice with hints, then try another mock.';$('mockBreakdown').innerHTML=Object.entries(by).sort((a,b)=>(a[1].r/a[1].t)-(b[1].r/b[1].t)).map(([n,v])=>`<p><b>${n}</b> — ${v.r}/${v.t}</p>`).join('');$('mockReview').innerHTML=wrong.length?wrong.map((x,i)=>`<details><summary>${i+1}. ${x.n}: ${x.q}</summary><p>Your answer: <b>${x.c}</b></p><p>Correct answer: <b>${x.a}</b></p></details>`).join(''):'<p>✓ No mistakes.</p>';localStorage.setItem(`skillup-selective-${stream}-last`,JSON.stringify({score:totalScore,total,pct,date:new Date().toISOString()}))}
$('startMock').onclick=startMock;$('retryMock').onclick=startMock;$('mockPrev').onclick=()=>{if(mockIndex){mockIndex--;renderMock()}};$('mockNext').onclick=()=>{if(mockIndex===mockTarget()-1)finishMock();else{mockIndex++;renderMock()}};
updateHeader();buildTopics();nextQ();setView('practice');
})();

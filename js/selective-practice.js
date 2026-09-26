(function(){
const $=id=>document.getElementById(id),shuffle=a=>[...a].sort(()=>Math.random()-.5);
const pageParams=new URLSearchParams(location.search);
const exam=pageParams.get('exam')==='oc'?'oc':'selective';
const requestedStream=pageParams.get('stream');
let stream=['math','thinking','reading','writing'].includes(requestedStream)?requestedStream:'math',mode='mix',topic='mixed',current=null,selected=null,score=0,attempted=0,qnum=1,view='practice';
const y5base=()=>window.TY_YEARS345?.topics?.['5']||[],y5extra=()=>window.TY_YEAR5_TESTS?.topics||[],y6=()=>window.TY_YEAR6?.topics||[],thinking=()=>window.SKILLUP_THINKING?.topics||[],writing=()=>window.SKILLUP_WRITING_VOCAB?.topics||[],mrExtra=()=>window.SKILLUP_MR_EXTRA?.topics||[],reading=()=>window.SKILLUP_READING?.topics||[];
function unique(list){const seen=new Set();return list.filter(x=>{if(seen.has(x[0]))return false;seen.add(x[0]);return true})}
function practiceTarget(){return stream==='writing'?16:stream==='thinking'||stream==='reading'?30:20}
function mockTarget(){if(stream==='writing')return 20;if(stream==='math')return 35;return 30}
function mockDuration(){if(stream==='writing')return 1200;if(stream==='math')return 2400;if(stream==='reading')return 2100;return 1800}
function modeLabel(){
 if(exam==='oc'){
   if(stream==='thinking')return mode==='5'?'Core Thinking':mode==='6'?'Challenge Thinking':'Mixed OC Thinking';
   if(stream==='reading')return mode==='5'?'Reading Core':mode==='6'?'Reading Challenge':'Mixed OC Reading';
   return 'OC Practice';
 }
 if(stream==='writing')return 'Writing vocabulary';
 if(stream==='thinking')return mode==='5'?'Foundation Thinking':mode==='6'?'Challenge Thinking':'Mixed Thinking';
 if(stream==='reading')return mode==='5'?'Reading Core':mode==='6'?'Reading Challenge':'Mixed Reading';
 return mode==='5'?'Year 5':mode==='6'?'Year 6':'Year 5–6';
}
function topicsFor(m){
 if(stream==='writing')return writing();
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
 if(stream==='writing'){
   const q=window.SKILLUP_WRITING_VOCAB.question(id==='mixed'?'mixed':id);
   return {...q,_year:'Writing vocabulary',_topic:q.topic,_name:q.name||writing().find(x=>x[0]===q.topic)?.[2]||q.topic};
 }
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
function paintLearn(){
 const box=$('vocabLearn');
 if(!box)return;
 if(stream!=='writing'||!window.SKILLUP_WRITING_VOCAB){box.hidden=true;return}
 const card=window.SKILLUP_WRITING_VOCAB.learn();
 box.hidden=false;
 box.innerHTML=`<span class="kicker">LEARN THIS WORD</span><h3>${card.title}</h3><p><b>Meaning:</b> ${card.meaning}</p><p><b>In a sentence:</b> ${card.example}</p><p><b>How to use it:</b> ${card.use}</p><p><b>Tone:</b> ${card.tone}</p>`;
}
function updateHeader(){
 const isThinking=stream==='thinking',isReading=stream==='reading',isWriting=stream==='writing';
 if(exam==='oc'){
   document.title='OC Practice | SkillUP';
   document.body.dataset.exam='oc';
   const home=$('examHome');if(home){home.href='oc.html';home.textContent='OC';}
   $('heroTag').textContent=isThinking?'OC · THINKING SKILLS':isReading?'OC · READING':'OC · MATHEMATICAL REASONING';
   $('heroTitle').innerHTML=isThinking?'Think clearly.<br><span>Reason carefully.</span>':isReading?'Read closely.<br><span>Find the evidence.</span>':'Build reasoning.<br><span>Then test it.</span>';
   $('heroDesc').textContent=isThinking?'Focused OC thinking-skills practice with logic, evidence, ordering and reasoning questions.':isReading?'Focused OC reading practice with original SkillUP passages, inference and vocabulary in context.':'Use the dedicated OC mathematical reasoning pool.';
   $('mockTabLabel').textContent=isThinking||isReading?'30-question OC Mock':'OC Mock';
   $('mode5').textContent=isThinking?'Core Thinking':isReading?'Reading Core':'Core';
   $('mode6').textContent=isThinking?'Challenge Thinking':isReading?'Reading Challenge':'Challenge';
   $('modeMix').textContent=isThinking?'Mixed OC Thinking':isReading?'Mixed OC Reading':'Mixed OC';
   $('notice').innerHTML='Use <b>Practice</b> to learn from hints. Use <b>Mock</b> when you are ready to work without hints.';
   $('practiceHeading').textContent=isThinking?'Choose an OC Thinking Skills topic':isReading?'Choose an OC Reading skill':'Choose an OC reasoning skill';
   $('practiceSub').textContent=isThinking?'Logic, evidence, ordering and arguments.':isReading?'Paired texts, inference and vocabulary in context.':'Focused OC reasoning practice.';
   $('mockTitle').textContent=isThinking?'30-question OC Thinking Skills Mock':isReading?'30-question OC Reading Mock':'OC Mathematical Reasoning Mock';
   $('mockIntroText').textContent='Mixed OC practice questions. No hints. Move between questions before finishing.';
   $('sourceNote').textContent='SkillUP OC practice is independent and does not reproduce official NSW Opportunity Class test questions.';
 }else{
   document.title='Selective Practice | SkillUP';
   const home=$('examHome');if(home){home.href='selective.html';home.textContent='Selective';}
   $('heroTag').textContent=isWriting?'SELECTIVE · WRITING VOCABULARY':isThinking?'SELECTIVE · THINKING SKILLS':isReading?'SELECTIVE · READING':'NSW SELECTIVE · MATHEMATICAL REASONING';
   $('heroTitle').innerHTML=isWriting?'Use precise words.<br><span>Then write with them.</span>':isThinking?'Think clearly.<br><span>Reason carefully.</span>':isReading?'Read closely.<br><span>Find the evidence.</span>':'Build reasoning.<br><span>Then test it.</span>';
   $('heroDesc').textContent=isWriting?'Learn high-value writing words such as cognitive, fascination, convey and evaluate. See the meaning, a model sentence and how to use the word, then practise.' :isThinking?'Practice original SkillUP questions based on common selective thinking-skill formats.':isReading?'Selective-style reading practice with original SkillUP passages.':'Focused Year 5–6 mathematical reasoning practice.';
   $('mockTabLabel').textContent=isWriting?'20-word Mock':isThinking||isReading?'30-question Mock':'35-question Mock';
   $('mode5').textContent=isWriting?'Core words':isThinking?'Foundation Thinking':isReading?'Reading Core':'Year 5 Foundation';
   $('mode6').textContent=isWriting?'Challenge words':isThinking?'Challenge Thinking':isReading?'Reading Challenge':'Year 6 Textbook + Selective';
   $('modeMix').textContent=isWriting?'Mixed words':isThinking?'Mixed Thinking':isReading?'Mixed Reading':'Mixed Year 5–6';
   $('notice').innerHTML=isWriting?'First read the <b>Learn this word</b> card. Then answer the practice question. The mock has 20 questions and 20 minutes.':'Use <b>Practice</b> to learn from hints. Use <b>Mock</b> when you are ready.';
   $('practiceHeading').textContent=isWriting?'Choose a writing-vocabulary skill':isThinking?'Choose a Thinking Skills topic':isReading?'Choose a Reading skill':'Choose a skill, or use Mixed Selective';
   $('practiceSub').textContent=isWriting?'Meaning, model sentences, fill-the-blank and tone.':isThinking?'Logic, evidence, ordering and arguments.':isReading?'Paired texts, inference and vocabulary in context.':'Practise one topic at a time with a short hint after each question.';
   $('mockTitle').textContent=isWriting?'20-question Writing Vocabulary Mock':isThinking?'30-question Thinking Skills Mock':isReading?'30-question Selective Reading Mock':'35-question Mathematical Reasoning Mock';
   $('mockIntroText').textContent=isWriting?'20 mixed writing-vocabulary questions. 20 minutes. No learn card during the mock.':'Mixed questions. No hints. Move between questions before finishing.';
   $('sourceNote').textContent=isWriting?'Writing Vocabulary uses original SkillUP word cards and sentences for precise written language.':'SkillUP Selective practice is independent and does not reproduce official NSW test questions.';
 }
 document.querySelectorAll('.streambar button').forEach(b=>b.classList.toggle('active',b.dataset.stream===stream));
}
function buildTopics(){
 const list=topicsFor(mode),target=practiceTarget();
 $('topicCount').textContent=list.filter(x=>x[0]!=='mixed').length;
 $('topics').innerHTML='';
 const mixed=document.createElement('button');mixed.className='topic '+(topic==='mixed'?'active':'');mixed.innerHTML=`<b>⚡ ${stream==='writing'?'Mixed writing words':stream==='thinking'?(exam==='oc'?'Mixed OC Thinking':'Mixed Thinking'):stream==='reading'?(exam==='oc'?'Mixed OC Reading':'Mixed Reading'):(exam==='oc'?'Mixed OC':'Mixed Selective')}</b><span>${stream==='writing'?'Meaning, usage, context and tone':stream==='thinking'?'Random thinking-skill questions':'Random questions across available skills'}</span>`;mixed.onclick=()=>choose('mixed');$('topics').appendChild(mixed);
 list.filter(x=>x[0]!=='mixed').forEach(x=>{const b=document.createElement('button');b.className='topic '+(topic===x[0]?'active':'');b.innerHTML=`<b>${x[1]} ${x[2]}</b><span>${x[3]}</span>`;b.onclick=()=>choose(x[0]);$('topics').appendChild(b)});
 $('qnum').textContent=`${qnum} / ${target}`;
}
function choose(id){topic=id;qnum=1;score=attempted=0;buildTopics();nextQ();showQuiz()}
function renderAnswers(hostId,q,clickHandler){const host=$(hostId);host.innerHTML='';shuffle(q.choices).forEach(v=>{const b=document.createElement('button');b.textContent=v;b.onclick=()=>clickHandler(b,v);host.appendChild(b)})}
function nextQ(){
 current=make();selected=null;paintLearn();
 $('question').textContent=current.text;
 $('tip').textContent='💡 '+(current.tip||'Use your best reasoning.');
 $('feedback').textContent='';
 $('badge').textContent=topic==='mixed'?(stream==='writing'?'Mixed writing words':stream==='thinking'?(exam==='oc'?'Mixed OC Thinking':'Mixed Thinking'):stream==='reading'?(exam==='oc'?'Mixed OC Reading':'Mixed Reading'):(exam==='oc'?'Mixed OC':'Mixed Selective')):current._name;
 $('level').textContent=current._year||modeLabel();
 $('qnum').textContent=`${qnum} / ${practiceTarget()}`;
 $('score').textContent=`${score} / ${attempted}`;
 renderAnswers('answers',current,(b)=>{const host=$('answers');host.querySelectorAll('button').forEach(z=>z.classList.remove('selected'));b.classList.add('selected');selected=b});
}
function setView(v){view=v;document.querySelectorAll('.top-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.view===v));$('practiceView').hidden=v!=='practice';$('mockView').hidden=v!=='mock';if(v==='mock')showMockIntro();else $('timerText').textContent='—'}
function showTopics(){const pv=$('practiceView');if(pv)pv.classList.remove('answering');const bt=$('backToTopics');if(bt)bt.hidden=true;window.scrollTo({top:(pv?.offsetTop||0)-90,behavior:'smooth'})}
function showQuiz(){const pv=$('practiceView');if(pv)pv.classList.add('answering');const bt=$('backToTopics');if(bt)bt.hidden=false;const quiz=document.querySelector('.quiz');if(quiz)window.scrollTo({top:quiz.offsetTop-90,behavior:'smooth'})}
function setStream(s){
 if(exam==='oc'&&s==='math'){location.href='assessment-practice.html?mode=oc4';return}
 stream=s;topic='mixed';score=attempted=0;qnum=1;mode='mix';
 document.querySelectorAll('.modebar button').forEach(b=>b.classList.toggle('active',b.dataset.mode==='mix'));
 updateHeader();buildTopics();nextQ();showMockIntro();setView('practice');showTopics();
}
function ensureWritingButton(){
 if(exam==='oc')return;
 const bar=document.querySelector('.streambar');
 if(!bar||bar.querySelector('[data-stream="writing"]'))return;
 const b=document.createElement('button');b.dataset.stream='writing';b.textContent='✍️ Writing Vocabulary';bar.appendChild(b);b.onclick=()=>setStream('writing');
 if(!$('vocabLearn')){const box=document.createElement('aside');box.id='vocabLearn';box.className='vocab-learn';box.hidden=true;const quiz=document.querySelector('#practiceView .quiz')||document.querySelector('.quiz');if(quiz)quiz.parentNode.insertBefore(box,quiz)}
}
document.querySelectorAll('.streambar button').forEach(b=>{
 if(exam==='oc'&&b.dataset.stream==='math'){b.textContent='🔢 OC Mathematical Reasoning';b.onclick=()=>location.href='assessment-practice.html?mode=oc4';}
 else b.onclick=()=>setStream(b.dataset.stream);
});
{const _bt=$('backToTopics');if(_bt)_bt.onclick=()=>showTopics();}
document.querySelectorAll('.top-tabs button').forEach(b=>b.onclick=()=>setView(b.dataset.view));
document.querySelectorAll('.modebar button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.modebar button').forEach(x=>x.classList.remove('active'));b.classList.add('active');mode=b.dataset.mode;topic='mixed';score=attempted=0;qnum=1;updateHeader();buildTopics();nextQ();showMockIntro();showTopics()});
$('check').onclick=()=>{if(!selected){$('feedback').textContent='Choose an answer first.';return}if(selected.dataset.checked)return;attempted++;const ok=String(selected.textContent)===String(current.answer);if(ok){score++;selected.classList.add('correct');$('feedback').textContent='✓ Correct!'}else{selected.classList.add('wrong');[...$('answers').children].find(b=>String(b.textContent)===String(current.answer))?.classList.add('correct');$('feedback').textContent=`Answer: ${current.answer}`}selected.dataset.checked='1';$('score').textContent=`${score} / ${attempted}`};
$('next').onclick=()=>{const target=practiceTarget();qnum=qnum>=target?1:qnum+1;nextQ()};
let mockQs=[],mockAnswers=[],mockIndex=0,mockSeconds=1500,mockTimer=null;
function showMockIntro(){clearInterval(mockTimer);mockSeconds=mockDuration();$('mockIntro').hidden=false;$('mockQuiz').hidden=true;$('mockResult').hidden=true;tick()}
function buildMock(){const total=mockTarget();mockQs=[];mockAnswers=Array(total).fill(null);mockIndex=0;mockSeconds=mockDuration();const seen=new Set();let guard=0;while(mockQs.length<total&&guard++<1200){const q=make('mixed'),key=q.text+'|'+q.answer;if(seen.has(key))continue;seen.add(key);mockQs.push(q)}while(mockQs.length<total)mockQs.push(make('mixed'))}
function tick(){const m=Math.floor(mockSeconds/60),s=mockSeconds%60;$('mockTimer').textContent=`${m}:${String(s).padStart(2,'0')}`;$('timerText').textContent=$('mockTimer').textContent}
function renderMock(){const q=mockQs[mockIndex],total=mockTarget();$('mockCount').textContent=`Question ${mockIndex+1} of ${total} · ${q._year||modeLabel()} · ${q._name}`;$('mockQuestion').textContent=q.text;$('mockAnswers').innerHTML='';q.choices.forEach((v,i)=>{const b=document.createElement('button');b.textContent=v;if(mockAnswers[mockIndex]===i)b.classList.add('selected');b.onclick=()=>{mockAnswers[mockIndex]=i;renderMock()};$('mockAnswers').appendChild(b)});$('mockPrev').disabled=mockIndex===0;$('mockNext').textContent=mockIndex===total-1?'Finish Mock':'Next →'}
function startMock(){clearInterval(mockTimer);buildMock();$('mockIntro').hidden=true;$('mockResult').hidden=true;$('mockQuiz').hidden=false;renderMock();tick();mockTimer=setInterval(()=>{mockSeconds--;tick();if(mockSeconds<=0)finishMock()},1000)}
function finishMock(){clearInterval(mockTimer);let totalScore=0;const by={},wrong=[];mockQs.forEach((q,i)=>{const ci=q.choices.findIndex(v=>String(v)===String(q.answer)),ok=mockAnswers[i]===ci;totalScore+=ok?1:0;by[q._name]??={r:0,t:0};by[q._name].t++;if(ok)by[q._name].r++;else wrong.push({q:q.text,a:q.answer,c:mockAnswers[i]===null?'No answer':q.choices[mockAnswers[i]],n:q._name})});const total=mockTarget(),pct=Math.round(totalScore/total*100);$('mockQuiz').hidden=true;$('mockResult').hidden=false;$('mockMark').textContent=`${totalScore}/${total}`;$('mockMessage').textContent=pct>=85?'Excellent. Review any missed words, then write two of them in a paragraph.':pct>=70?'Strong result — review the missed words below.':pct>=50?'Revisit the Learn card, then try again.':'Return to Practice with the learn cards first.';$('mockBreakdown').innerHTML=Object.entries(by).sort((a,b)=>(a[1].r/a[1].t)-(b[1].r/b[1].t)).map(([n,v])=>`<p><b>${n}</b> — ${v.r}/${v.t}</p>`).join('');$('mockReview').innerHTML=wrong.length?wrong.map((x,i)=>`<details><summary>${i+1}. ${x.n}: ${x.q}</summary><p>Your answer: <b>${x.c}</b></p><p>Correct answer: <b>${x.a}</b></p></details>`).join(''):'<p>✓ No mistakes.</p>';localStorage.setItem(`skillup-${exam}-${stream}-last`,JSON.stringify({score:totalScore,total,pct,date:new Date().toISOString()}))}
$('startMock').onclick=startMock;$('retryMock').onclick=startMock;$('mockPrev').onclick=()=>{if(mockIndex){mockIndex--;renderMock()}};$('mockNext').onclick=()=>{if(mockIndex===mockTarget()-1)finishMock();else{mockIndex++;renderMock()}};
if(exam==='oc'&&stream==='writing')stream='thinking';
ensureWritingButton();
updateHeader();buildTopics();nextQ();setView('practice');
})();

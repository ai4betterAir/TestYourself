(function(){
const $=id=>document.getElementById(id),shuffle=a=>[...a].sort(()=>Math.random()-.5);
const pageParams=new URLSearchParams(location.search);
const exam=pageParams.get('exam')==='oc'?'oc':'selective';
const requestedStream=pageParams.get('stream');
const requestedView=pageParams.get('view')==='mock'?'mock':'practice';
const visualTopicIds=new Set(['visual','cube','ocfigures','symmetry','figurematch','visualpatterns','figureodd','shapecount']);
const thinkingTopicIds=new Set((window.SKILLUP_THINKING?.topics||[]).map(t=>t[0]));
let stream=['math','thinking','reading','writing'].includes(requestedStream)?requestedStream:'math',mode='mix',topic=(requestedStream==='thinking'&&thinkingTopicIds.has(pageParams.get('topic')))?pageParams.get('topic'):'mixed',current=null,selected=null,score=0,attempted=0,qnum=1,view=requestedView;
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
 document.body.dataset.stream=stream;
 const isThinking=stream==='thinking',isReading=stream==='reading',isWriting=stream==='writing';
 if(exam==='oc'){
   document.title='OC Practice | SkillUP';
   document.body.dataset.exam='oc';
   const home=$('examHome');if(home){home.href='oc.html';home.textContent='OC';}
   const sw=$('examSwitch');if(sw){sw.hidden=false;sw.querySelectorAll('[data-oc-stream]').forEach(a=>a.classList.toggle('active',a.dataset.ocStream===stream));}
   const streambar=$('streambar');if(streambar)streambar.setAttribute('aria-hidden','true');
   $('heroTag').textContent=isThinking?'OC · THINKING SKILLS':isReading?'OC · READING':'OC · MATHEMATICAL REASONING';
   $('heroTitle').innerHTML=isThinking?'Think clearly.<br><span>Reason carefully.</span>':isReading?'Read closely.<br><span>Find the evidence.</span>':'Build reasoning.<br><span>Then test it.</span>';
   $('heroDesc').textContent=isThinking?'OC Thinking Skills includes logical reasoning, figure patterns, symmetry, shape puzzles and cube rotations.':isReading?'Focused OC reading practice with original SkillUP passages, inference and vocabulary in context.':'Use the dedicated OC mathematical reasoning pool.';
   $('mockTabLabel').textContent=isThinking||isReading?'30-question OC Mock':'OC Mock';
   $('mode5').textContent=isThinking?'Core Thinking':isReading?'Reading Core':'Core';
   $('mode6').textContent=isThinking?'Challenge Thinking':isReading?'Reading Challenge':'Challenge';
   $('modeMix').textContent=isThinking?'Mixed OC Thinking':isReading?'Mixed OC Reading':'Mixed OC';
   $('notice').innerHTML='Use <b>Practice</b> to learn from hints. Use <b>Mock</b> when you are ready to work without hints.';
   $('practiceHeading').textContent=isThinking?'Choose an OC Thinking Skills topic':isReading?'Choose an OC Reading skill':'Choose an OC reasoning skill';
   $('practiceSub').textContent=isThinking?'Logic, evidence, ordering, visual sequences, figure matching, symmetry and cube rotations.':isReading?'Paired texts, inference and vocabulary in context.':'Focused OC reasoning practice.';
   $('mockTitle').textContent=isThinking?'30-question OC Thinking Skills Mock':isReading?'30-question OC Reading Mock':'OC Mathematical Reasoning Mock';
   $('mockIntroText').textContent='Mixed OC practice questions. No hints. Move between questions before finishing.';
   $('sourceNote').textContent='SkillUP OC practice is independent and does not reproduce official NSW Opportunity Class test questions.';
 }else{
   document.body.dataset.exam='selective';
   const sw=$('examSwitch');if(sw)sw.hidden=true;
   const streambar=$('streambar');if(streambar)streambar.removeAttribute('aria-hidden');
   document.title='Selective Practice | SkillUP';
   const home=$('examHome');if(home){home.href='selective.html';home.textContent='Selective';}
   $('heroTag').textContent=isWriting?'SELECTIVE · WRITING VOCABULARY':isThinking?'SELECTIVE · THINKING SKILLS':isReading?'SELECTIVE · READING':'NSW SELECTIVE · MATHEMATICAL REASONING';
   $('heroTitle').innerHTML=isWriting?'Use precise words.<br><span>Then write with them.</span>':isThinking?'Think clearly.<br><span>Reason carefully.</span>':isReading?'Read closely.<br><span>Find the evidence.</span>':'Build reasoning.<br><span>Then test it.</span>';
   $('heroDesc').textContent=isWriting?'Learn high-value writing words such as cognitive, fascination, convey and evaluate. See the meaning, a model sentence and how to use the word, then practice.' :isThinking?'Selective Thinking Skills includes logic, non-verbal figure patterns, cube rotations, symmetry and visual reasoning.':isReading?'Selective-style reading practice with original SkillUP passages.':'Focused Year 5–6 mathematical reasoning practice.';
   $('mockTabLabel').textContent=isWriting?'20-word Mock':isThinking||isReading?'30-question Mock':'35-question Mock';
   $('mode5').textContent=isWriting?'Core words':isThinking?'Foundation Thinking':isReading?'Reading Core':'Year 5 Foundation';
   $('mode6').textContent=isWriting?'Challenge words':isThinking?'Challenge Thinking':isReading?'Reading Challenge':'Year 6 Textbook + Selective';
   $('modeMix').textContent=isWriting?'Mixed words':isThinking?'Mixed Thinking':isReading?'Mixed Reading':'Mixed Year 5–6';
   $('notice').innerHTML=isWriting?'First read the <b>Learn this word</b> card. Then answer the practice question. The mock has 20 questions and 20 minutes.':'Use <b>Practice</b> to learn from hints. Use <b>Mock</b> when you are ready.';
   $('practiceHeading').textContent=isWriting?'Choose a writing-vocabulary skill':isThinking?'Choose a Thinking Skills topic':isReading?'Choose a Reading skill':'Choose a skill, or use Mixed Selective';
   $('practiceSub').textContent=isWriting?'Meaning, model sentences, fill-the-blank and tone.':isThinking?'Logic, evidence, ordering, visual sequences, figure matching, symmetry and cube rotations.':isReading?'Paired texts, inference and vocabulary in context.':'Practice one topic at a time with a short hint after each question.';
   $('mockTitle').textContent=isWriting?'20-question Writing Vocabulary Mock':isThinking?'30-question Thinking Skills Mock':isReading?'30-question Selective Reading Mock':'35-question Mathematical Reasoning Mock';
   $('mockIntroText').textContent=isWriting?'20 mixed writing-vocabulary questions. 20 minutes. No learn card during the mock.':'Mixed questions. No hints. Move between questions before finishing.';
   $('sourceNote').textContent=isWriting?'Writing Vocabulary uses original SkillUP word cards and sentences for precise written language.':'SkillUP Selective practice is independent and does not reproduce official NSW test questions.';
 }
 document.querySelectorAll('.streambar button').forEach(b=>b.classList.toggle('active',b.dataset.stream===stream));
}
function buildTopics(){
 const list=topicsFor(mode),target=practiceTarget(),host=$('topics');
 const entries=list.filter(x=>x[0]!=='mixed');
 $('topicCount').textContent=entries.length;
 host.replaceChildren();
 const mixed=document.createElement('button');
 mixed.type='button';
 mixed.className='topic '+(topic==='mixed'?'active':'');
 mixed.dataset.topic='mixed';
 const mixedName=stream==='writing'?'Mixed writing words':stream==='thinking'?(exam==='oc'?'Mixed OC Thinking':'Mixed Thinking'):stream==='reading'?(exam==='oc'?'Mixed OC Reading':'Mixed Reading'):(exam==='oc'?'Mixed OC':'Mixed Selective');
 const title=document.createElement('b');title.textContent='⚡ '+mixedName;
 const sub=document.createElement('span');sub.textContent=stream==='writing'?'Meaning, usage, context and tone':stream==='thinking'?'Logic and figure reasoning together':'Random questions across available skills';
 mixed.append(title,sub);
 mixed.setAttribute('aria-pressed',String(topic==='mixed'));
 mixed.onclick=()=>choose('mixed');
 host.appendChild(mixed);
 function appendTopic(entry){
  const b=document.createElement('button');b.type='button';b.dataset.topic=entry[0];
  b.className='topic '+(topic===entry[0]?'active':'');
  const label=document.createElement('b');label.textContent=entry[1]+' '+entry[2];
  const desc=document.createElement('span');desc.textContent=entry[3];
  b.append(label,desc);
  b.setAttribute('aria-pressed',String(topic===entry[0]));
  b.onclick=()=>choose(entry[0]);host.appendChild(b);
 }
 function addGroup(name,description){
  const group=document.createElement('div');group.className='thinking-topic-heading';
  const heading=document.createElement('h3');heading.textContent=name;
  const desc=document.createElement('p');desc.textContent=description;
  group.append(heading,desc);host.appendChild(group);
 }
 if(stream==='thinking'){
  addGroup('Verbal & Logical Reasoning','Logic, evidence, ordering, family relationships, assumptions and numerical thinking');
  entries.filter(x=>!visualTopicIds.has(x[0])).forEach(appendTopic);
  addGroup('Visual & Non-verbal Reasoning','Figure patterns, rotations, cube and dice puzzles, symmetry, matching, odd one out and counting shapes');
  entries.filter(x=>visualTopicIds.has(x[0])).forEach(appendTopic);
 }else entries.forEach(appendTopic);
 $('qnum').textContent=`${qnum} / ${target}`;
}
function saveSelectionToUrl(){
 const params=new URLSearchParams(location.search);
 params.set('stream',stream);
 if(topic==='mixed')params.delete('topic');
 else params.set('topic',topic);
 history.replaceState(null,'',location.pathname+'?'+params.toString()+location.hash);
}
function choose(id){topic=id;qnum=1;score=attempted=0;saveSelectionToUrl();buildTopics();nextQ();showQuiz()}
function renderAnswers(hostId,q,clickHandler){const host=$(hostId);host.innerHTML='';(q.image?q.choices:shuffle(q.choices)).forEach(v=>{const b=document.createElement('button');b.textContent=v;b.onclick=()=>clickHandler(b,v);host.appendChild(b)})}
function renderVisual(figureId,imageId,q){
 const figure=$(figureId),img=$(imageId);
 if(!figure||!img)return;
 // Only locally maintained SVG/PNG assets may be displayed by this component.
 const source=(q?.imageMobile && window.matchMedia('(max-width:650px)').matches) ? q.imageMobile : q?.image;
 if(typeof source!=='string'||!/^assets\/selective\/thinking\/[a-zA-Z0-9_-]+\.(svg|png)$/.test(source)){
   figure.hidden=true;
   figure.closest('.quiz')?.classList.remove('visual-problem');
   img.removeAttribute('src');
   img.alt='';
   figure.querySelector('.visual-full-link')?.removeAttribute('href');
   return;
 }
 img.alt=q.imageAlt||'Visual reasoning diagram';
 img.onerror=()=>{figure.hidden=true;};
 figure.closest('.quiz')?.classList.add('visual-problem');
 img.src=source;
 const zoom=figure.querySelector('.visual-full-link');
 if(zoom)zoom.href=source;
 figure.hidden=false;
}
let lastPracticePageScroll=0,lastPracticeTopic='mixed',dialogWasOpen=false;
function practiceDialogState(){return !!$('practiceDialog')?.open}
function updatePracticeDialogHeader(){
 const title=$('practiceDialogTitle'),eyebrow=$('practiceDialogHelp'),progress=$('practiceDialogProgress');
 if(title)title.textContent=current?._name||((stream==='thinking')?'Thinking Skills':'Practice');
 if(eyebrow)eyebrow.textContent='SKILLUP · '+(exam==='oc'?'OC':'SELECTIVE')+' · '+(stream==='thinking'?'THINKING SKILLS':stream.toUpperCase());
 if(progress)progress.textContent='Question '+qnum+' of '+practiceTarget();
}
function restorePracticeScreen(){
 const holder=$('practiceDialogQuestionHost');
 const quiz=holder?.querySelector('.quiz');
 if(quiz)$('practiceView').appendChild(quiz);
 document.body.classList.remove('practice-dialog-active');
 $('practiceView')?.classList.remove('answering');
 const close=$('backToTopics');if(close)close.hidden=true;
 if(!dialogWasOpen)return;
 dialogWasOpen=false;
 const target=[...document.querySelectorAll('#topics button[data-topic]')].find(b=>b.dataset.topic===lastPracticeTopic);
 if(target)target.focus({preventScroll:true});
 window.scrollTo({top:lastPracticePageScroll,behavior:'instant'});
}
function closePracticeDialog(){
 const dialog=$('practiceDialog');
 if(dialog?.open)dialog.close();
 restorePracticeScreen();
}
function nextQ(){
 current=make();selected=null;paintLearn();
 $('question').textContent=current.text;
 renderVisual('questionFigure','questionImage',current);
 const worked=$('cubeExplanation');if(worked){worked.hidden=true;worked.textContent='';}
 $('tip').textContent='💡 '+(current.tip||'Use your best reasoning.');
 $('feedback').textContent='';
 $('badge').textContent=topic==='mixed'?(stream==='writing'?'Mixed writing words':stream==='thinking'?(exam==='oc'?'Mixed OC Thinking':'Mixed Thinking'):stream==='reading'?(exam==='oc'?'Mixed OC Reading':'Mixed Reading'):(exam==='oc'?'Mixed OC':'Mixed Selective')):current._name;
 $('level').textContent=current._year||modeLabel();
 $('qnum').textContent=`${qnum} / ${practiceTarget()}`;
 $('score').textContent=`${score} / ${attempted}`;
 updatePracticeDialogHeader();
 if(practiceDialogState())$('practiceDialogScroll').scrollTop=0;
 renderAnswers('answers',current,(b)=>{const host=$('answers');host.querySelectorAll('button').forEach(z=>z.classList.remove('selected'));b.classList.add('selected');selected=b});
}
function setView(v){
 if(v!=='practice'&&practiceDialogState())closePracticeDialog();
 view=v;
 document.querySelectorAll('.top-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
 $('practiceView').hidden=v!=='practice';$('mockView').hidden=v!=='mock';
 if(v==='mock')showMockIntro();else $('timerText').textContent='—';
}
function showTopics(){closePracticeDialog()}
function showQuiz(){
 const dialog=$('practiceDialog'),holder=$('practiceDialogQuestionHost');
 const quiz=$('practiceView').querySelector('.quiz')||holder?.querySelector('.quiz');
 if(!dialog||!holder||!quiz)return;
 if(!dialog.open){
  lastPracticePageScroll=window.scrollY;
  lastPracticeTopic=topic;
  holder.appendChild(quiz);
  dialog.showModal();
  dialogWasOpen=true;
  document.body.classList.add('practice-dialog-active');
 }
 $('practiceView').classList.add('answering');
 $('backToTopics').hidden=false;
 updatePracticeDialogHeader();
 $('practiceDialogScroll').scrollTop=0;
 $('backToTopics').focus({preventScroll:true});
}
function setStream(s){
 if(exam==='oc'&&s==='math'){location.href='assessment-practice.html?mode=oc4';return}
 stream=s;topic='mixed';score=attempted=0;qnum=1;mode='mix';
 saveSelectionToUrl();
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
{const _bt=$('backToTopics');if(_bt)_bt.onclick=showTopics;}
{const dialog=$('practiceDialog');if(dialog){
 dialog.addEventListener('cancel',e=>{e.preventDefault();closePracticeDialog()});
 dialog.addEventListener('close',restorePracticeScreen);
}}
document.querySelectorAll('.top-tabs button').forEach(b=>b.onclick=()=>setView(b.dataset.view));
document.querySelectorAll('.modebar button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.modebar button').forEach(x=>x.classList.remove('active'));b.classList.add('active');mode=b.dataset.mode;topic='mixed';score=attempted=0;qnum=1;updateHeader();buildTopics();nextQ();showMockIntro();showTopics()});
$('check').onclick=()=>{if(!selected){$('feedback').textContent='Choose an answer first.';return}if(selected.dataset.checked)return;attempted++;const ok=String(selected.textContent)===String(current.answer);if(ok){score++;selected.classList.add('correct');$('feedback').textContent='✓ Correct!'}else{selected.classList.add('wrong');[...$('answers').children].find(b=>String(b.textContent)===String(current.answer))?.classList.add('correct');$('feedback').textContent=`Answer: ${current.answer}`}selected.dataset.checked='1';$('score').textContent=`${score} / ${attempted}`};
$('check').addEventListener('click',()=> {
  const box=$('cubeExplanation');
  if(!box || !selected?.dataset.checked) return;
  const explanation=current?.explanation;
  box.textContent=explanation||'';
  box.hidden=!explanation;
});
$('next').onclick=()=>{const target=practiceTarget();qnum=qnum>=target?1:qnum+1;nextQ()};
let mockQs=[],mockAnswers=[],mockIndex=0,mockSeconds=1500,mockTimer=null;
function showMockIntro(){clearInterval(mockTimer);mockSeconds=mockDuration();$('mockIntro').hidden=false;$('mockQuiz').hidden=true;$('mockResult').hidden=true;tick()}
function buildMock(){const total=mockTarget();mockQs=[];mockAnswers=Array(total).fill(null);mockIndex=0;mockSeconds=mockDuration();const seen=new Set();let guard=0;while(mockQs.length<total&&guard++<1200){const q=make(stream==='thinking'&&topic!=='mixed'?topic:'mixed'),key=q.text+'|'+q.answer;if(seen.has(key))continue;seen.add(key);mockQs.push(q)}while(mockQs.length<total)mockQs.push(make(stream==='thinking'&&topic!=='mixed'?topic:'mixed'))}
function tick(){const m=Math.floor(mockSeconds/60),s=mockSeconds%60;$('mockTimer').textContent=`${m}:${String(s).padStart(2,'0')}`;$('timerText').textContent=$('mockTimer').textContent}
function renderMock(){const q=mockQs[mockIndex],total=mockTarget();$('mockCount').textContent=`Question ${mockIndex+1} of ${total} · ${q._year||modeLabel()} · ${q._name}`;$('mockQuestion').textContent=q.text;renderVisual('mockQuestionFigure','mockQuestionImage',q);$('mockAnswers').innerHTML='';q.choices.forEach((v,i)=>{const b=document.createElement('button');b.textContent=v;if(mockAnswers[mockIndex]===i)b.classList.add('selected');b.onclick=()=>{mockAnswers[mockIndex]=i;renderMock()};$('mockAnswers').appendChild(b)});$('mockPrev').disabled=mockIndex===0;$('mockNext').textContent=mockIndex===total-1?'Finish Mock':'Next →'}
function startMock(){clearInterval(mockTimer);buildMock();$('mockIntro').hidden=true;$('mockResult').hidden=true;$('mockQuiz').hidden=false;renderMock();tick();mockTimer=setInterval(()=>{mockSeconds--;tick();if(mockSeconds<=0)finishMock()},1000)}
function finishMock(){clearInterval(mockTimer);let totalScore=0;const by={},wrong=[];mockQs.forEach((q,i)=>{const ci=q.choices.findIndex(v=>String(v)===String(q.answer)),ok=mockAnswers[i]===ci;totalScore+=ok?1:0;by[q._name]??={r:0,t:0};by[q._name].t++;if(ok)by[q._name].r++;else wrong.push({q:q.text,a:q.answer,c:mockAnswers[i]===null?'No answer':q.choices[mockAnswers[i]],n:q._name,image:q.image||null,imageMobile:q.imageMobile||null,imageAlt:q.imageAlt||'',explanation:q.explanation||''})});const total=mockTarget(),pct=Math.round(totalScore/total*100);$('mockQuiz').hidden=true;$('mockResult').hidden=false;$('mockMark').textContent=`${totalScore}/${total}`;$('mockMessage').textContent=pct>=85?'Excellent. Review any missed words, then write two of them in a paragraph.':pct>=70?'Strong result — review the missed words below.':pct>=50?'Revisit the Learn card, then try again.':'Return to Practice with the learn cards first.';$('mockBreakdown').innerHTML=Object.entries(by).sort((a,b)=>(a[1].r/a[1].t)-(b[1].r/b[1].t)).map(([n,v])=>`<p><b>${n}</b> — ${v.r}/${v.t}</p>`).join('');$('mockReview').innerHTML=wrong.length?wrong.map((x,i)=>`<details><summary>${i+1}. ${x.n}: ${x.q}</summary><p>Your answer: <b>${x.c}</b></p><p>Correct answer: <b>${x.a}</b></p></details>`).join(''):'<p>✓ No mistakes.</p>';// Show the actual diagram alongside a missed visual question in mock review.
wrong.forEach((w,i)=>{
  if(!w.image||!/^assets\/selective\/thinking\/[a-zA-Z0-9_-]+\.(svg|png)$/.test(w.image))return;
  const detail=$('mockReview').querySelectorAll('details')[i];
  if(!detail)return;
  const img=document.createElement('img');
  img.className='review-figure';
  img.src=(w.imageMobile&&window.matchMedia('(max-width:650px)').matches)?w.imageMobile:w.image;
  img.alt=w.imageAlt||'Visual reasoning diagram';
  detail.appendChild(img);
  if(w.explanation){
    const explanation=document.createElement('p');
    explanation.className='cube-review-explanation';
    explanation.textContent=w.explanation;
    detail.appendChild(explanation);
  }
});
localStorage.setItem(`skillup-${exam}-${stream}-last`,JSON.stringify({score:totalScore,total,pct,date:new Date().toISOString()}))}
$('startMock').onclick=startMock;$('retryMock').onclick=startMock;$('mockPrev').onclick=()=>{if(mockIndex){mockIndex--;renderMock()}};$('mockNext').onclick=()=>{if(mockIndex===mockTarget()-1)finishMock();else{mockIndex++;renderMock()}};
if(exam==='oc'&&stream==='writing')stream='thinking';
ensureWritingButton();
updateHeader();buildTopics();nextQ();setView(requestedView);
if(requestedStream==='thinking'&&thinkingTopicIds.has(pageParams.get('topic'))&&requestedView==='practice')showQuiz();
})();

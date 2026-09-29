(function(){
  const bank=window.SKILLUP_SCIENCE||{}, params=new URLSearchParams(location.search);
  let year=params.get('year')||params.get('grade')||localStorage.getItem('skillupYear')||'1';
  if(!bank[year]) year='1';
  const label=year==='K'?'Kindy':'Year '+year;
  const all=bank[year];
  const topics=[...new Set(all.map(q=>q.topic))];
  const $=id=>document.getElementById(id);
  let mode='practice', topic=params.get('topic')||'mixed', questions=[], index=0, selected=null, score=0, reviewed=new Set(), timer=null, seconds=1200, testAnswers=[];
  const profile=(()=>{try{return JSON.parse(localStorage.getItem('tyProfile')||'{}')}catch(e){return {}}})();
  $('yearLabel').textContent=label;
  $('studentName').textContent=profile.studentName||'Learner';
  $('yearSelect').value=year;
  $('topicSelect').innerHTML='<option value="mixed">Mixed topics</option>'+topics.map(t=>'<option value="'+t+'">'+t+'</option>').join(''); $('topicSelect').value=topics.includes(topic)?topic:'mixed'; topic=topics.includes(topic)?topic:'mixed';
  function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
  function pickSet(size, scoped){
    const source=scoped==='mixed'?all:all.filter(q=>q.topic===scoped);
    const pool=source.length?source:all;
    const out=[];let shuffled=shuffle(pool),i=0;
    while(out.length<size){if(i>=shuffled.length){shuffled=shuffle(pool);i=0}out.push(shuffled[i++])}
    return out;
  }
  function saveProgress(){
    const key='tyScienceProgress';
    let data={};try{data=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){}
    data[year]={score, total:questions.length, date:new Date().toISOString(), mode};
    localStorage.setItem(key,JSON.stringify(data));
  }
  function setMode(next){mode=next;document.querySelectorAll('.mode').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));$('practicePanel').hidden=mode!=='practice';$('testPanel').hidden=mode!=='test';$('resultPanel').hidden=true;reset()}
  function reset(){
    clearInterval(timer);timer=null;seconds=1200;index=0;selected=null;score=0;reviewed=new Set();testAnswers=[];
    if(mode==='practice'){questions=pickSet(10,topic);renderPractice()}else{questions=pickSet(20,topic);$('testIntro').hidden=false;$('testBody').hidden=true;$('testResult').hidden=true;$('timer').textContent='20:00'}
  }
  function renderPractice(){
    const q=questions[index]; $('count').textContent=(index+1)+' / '+questions.length; $('bar').style.width=((index+1)/questions.length*100)+'%'; $('topic').textContent=q.topic; $('question').textContent=q.text; $('feedback').textContent='';$('explanation').hidden=true;selected=null;
    const host=$('options');host.innerHTML='';shuffle(q.options).forEach(opt=>{const b=document.createElement('button');b.textContent=opt;b.onclick=()=>{if(reviewed.has(index))return;host.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');selected=opt};host.appendChild(b)});
    $('score').textContent=score+' / '+reviewed.size;
    document.querySelectorAll('.step').forEach((b,i)=>b.classList.toggle('current',i===index));
  }
  function markPractice(){
    if(selected===null){$('feedback').textContent='Choose an answer first.';return}
    if(reviewed.has(index))return;
    const q=questions[index],ok=selected===q.answer;reviewed.add(index);if(ok)score++;
    $('options').querySelectorAll('button').forEach(b=>{b.disabled=true;if(b.textContent===q.answer)b.classList.add('correct');if(b.textContent===selected&&selected!==q.answer)b.classList.add('wrong')});
    $('feedback').textContent=ok?'Correct — well done.':'Not quite. The correct answer is '+q.answer+'.';$('feedback').className=ok?'feedback good':'feedback bad';$('score').textContent=score+' / '+reviewed.size;saveProgress();
  }
  function startTest(){
    $('testIntro').hidden=true;$('testBody').hidden=false;testAnswers=Array(questions.length).fill(null);index=0;seconds=1200;renderTest();timer=setInterval(()=>{seconds--;updateTimer();if(seconds<=0){clearInterval(timer);finishTest()}},1000)
  }
  function updateTimer(){const m=String(Math.floor(seconds/60)).padStart(2,'0'),s=String(seconds%60).padStart(2,'0');$('timer').textContent=m+':'+s;$('timer').classList.toggle('urgent',seconds<120)}
  function renderTest(){
    const q=questions[index];$('testCount').textContent='Question '+(index+1)+' of '+questions.length;$('testTopic').textContent=q.topic;$('testQuestion').textContent=q.text;
    const host=$('testOptions');host.innerHTML='';shuffle(q.options).forEach(opt=>{const b=document.createElement('button');b.textContent=opt;if(testAnswers[index]===opt)b.classList.add('selected');b.onclick=()=>{testAnswers[index]=opt;host.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');renderDots()};host.appendChild(b)});
    renderDots();
  }
  function renderDots(){const h=$('dots');h.innerHTML='';questions.forEach((q,i)=>{const b=document.createElement('button');b.textContent=i+1;b.className=i===index?'current':(testAnswers[i]!==null?'answered':'');b.onclick=()=>{index=i;renderTest()};h.appendChild(b)})}
  function finishTest(){
    clearInterval(timer);timer=null;score=testAnswers.reduce((n,a,i)=>n+(a===questions[i].answer?1:0),0);$('testBody').hidden=true;$('testResult').hidden=false;$('finalMark').textContent=score+' / '+questions.length;$('finalPct').textContent=Math.round(score/questions.length*100)+'%';$('finalMessage').textContent=score>=16?'Excellent science thinking.':score>=10?'Good work — review the explanations and try again.':'Keep practising. Every review builds your science skills.';$('reviewList').innerHTML=questions.map((q,i)=>'<details class="'+(testAnswers[i]===q.answer?'ok':'miss')+'"><summary>'+(i+1)+'. '+(testAnswers[i]===q.answer?'Correct':'Review')+' — '+q.text+'</summary><p><b>Your answer:</b> '+(testAnswers[i]||'Not answered')+'<br><b>Correct answer:</b> '+q.answer+'<br>'+q.explanation+'</p></details>').join('');saveProgress()
  }
  $('yearSelect').onchange=e=>{location.href='science-practice.html?year='+encodeURIComponent(e.target.value)};
  $('topicSelect').onchange=e=>{topic=e.target.value;reset()};
  document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
  $('check').onclick=markPractice;$('next').onclick=()=>{index=(index+1)%questions.length;renderPractice()};$('restart').onclick=reset;$('startTest').onclick=startTest;$('testPrev').onclick=()=>{if(index>0){index--;renderTest()}};$('testNext').onclick=()=>{if(index<questions.length-1){index++;renderTest()}else finishTest()};$('finishEarly').onclick=finishTest;$('again').onclick=()=>{reset();$('testResult').hidden=true;$('testIntro').hidden=false};
  function boot(){setMode('practice');document.title=label+' Science Practice | SkillUP';$('heroTitle').textContent=label+' Science';$('heroCopy').textContent='Explore the natural world with age-appropriate questions, feedback and review.';topics.forEach((t,i)=>{const b=document.createElement('button');b.textContent=t;b.className='topic-pill';b.onclick=()=>{$('topicSelect').value=t;topic=t;reset();document.getElementById('work').scrollIntoView({behavior:'smooth'})};$('topicPills').appendChild(b)})}
  boot();
})();
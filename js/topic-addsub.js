(() => {
  const p = new URLSearchParams(location.search);
  if (p.get('year') !== '2' || p.get('subject') !== 'maths' || p.get('lesson') !== '1') return;
  const host = document.querySelector('.early-work');
  if (!host) return;
  const nav = document.querySelector('header nav');
  nav.innerHTML = '<a href="index.html">Home</a><a href="learning.html?year=2">Year 2</a><a href="subject.html?year=2&subject=maths">Maths</a><a href="about.html">About</a><a href="sign-in.html">Sign In</a>';
  document.querySelector('.early-next').hidden = true;
  const tabs = document.createElement('div');
  tabs.className = 'topic-tabs';
  tabs.setAttribute('role','tablist');
  tabs.setAttribute('aria-label','Lesson mode');
  const panels = {learn:host};
  host.id = 'activity';
  host.setAttribute('role','region');
  host.setAttribute('aria-label','Learn addition and subtraction');
  const make = (tag,text,parent) => { const e=document.createElement(tag); e.textContent=text; if(parent)parent.append(e); return e; };
  for (const key of ['practice','test']) {
    const panel=make('section','');
    panel.className='topic-session'; panel.id='topic-'+key; panel.hidden=true;
    panel.setAttribute('role','tabpanel'); host.after(panel); panels[key]=panel;
  }
  const modal=make('dialog','',document.body);
  modal.className='topic-modal';
  modal.setAttribute('aria-label','Addition and subtraction workspace');
  const bar=make('div','',modal);bar.className='topic-modal-bar';
  make('strong','Year 2 · Addition & subtraction',bar);
  const close=make('button','Back to lesson',bar);close.type='button';
  const slot=document.createComment('Lesson tabs');
  host.before(slot);
  const content=make('div','',modal);content.className='topic-modal-content';
  Object.values(panels).forEach(panel=>content.append(panel));
  let returnFocus=null;
  function restore() {
    slot.after(tabs);
    document.body.classList.remove('topic-modal-open');
    returnFocus?.focus();
  }
  close.onclick=()=>modal.close();
  modal.addEventListener('close',restore);
  let mode='learn';
  function select(key, open=true) {
    mode=key;
    if(open && !modal.open) {
      returnFocus=document.activeElement;
      bar.after(tabs);
      document.body.classList.add('topic-modal-open');
      modal.showModal();
    }
    content.scrollTop=0;
    for (const [id,panel] of Object.entries(panels)) {
      panel.hidden=id!==key;
      const tab=document.getElementById('tab-'+id);
      if(tab){tab.setAttribute('aria-selected',String(id===key)); tab.tabIndex=id===key || (key==='learn' && id==='practice')?0:-1;}
    }
  }
  for (const [key,name] of [['practice','Practice'],['test','Test Yourself']]) {
    const b=make('button',name,tabs); b.id='tab-'+key; b.type='button';
    b.setAttribute('role','tab'); b.setAttribute('aria-controls',panels[key].id);
    panels[key].setAttribute('aria-labelledby',b.id);
    b.onclick=()=>select(key);
    b.onkeydown=e=>{
      const ids=['practice','test']; let i=ids.indexOf(key);
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
      e.preventDefault();
      i=e.key==='Home'?0:e.key==='End'?1:(i+1)%2;
      select(ids[i]);document.getElementById('tab-'+ids[i]).focus();
    };
  }
  slot.after(tabs);
  const examples=[
    {title:'Make the next ten',sum:'29 + 4 = 33',steps:['Split 4 into 1 and 3.','29 + 1 = 30','30 + 3 = 33'],q:'39 + 5 = ?',answer:'44',choices:['43','44','45'],hint:'Add 1 to reach 40, then add the remaining 4.'},
    {title:'Add the ones',sum:'36 + 3 = 39',steps:['36 is 3 tens and 6 ones.','6 ones + 3 ones = 9 ones.','Keep 3 tens: 30 + 9 = 39.'],q:'42 + 5 = ?',answer:'47',choices:['45','47','57'],hint:'Keep 4 tens. Add 5 to the 2 ones.'},
    {title:'Subtract through a ten',sum:'43 − 6 = 37',steps:['Split 6 into 3 and 3.','43 − 3 = 40','40 − 3 = 37'],q:'52 − 7 = ?',answer:'45',choices:['45','49','55'],hint:'Subtract 2 to reach 50, then subtract the remaining 5.'},
    {title:'Find the missing part',sum:'□ + 8 = 25',steps:['Use subtraction to find the missing part.','25 − 8 = 17','Check: 17 + 8 = 25.'],q:'□ + 6 = 24',answer:'18',choices:['16','18','30'],hint:'Subtract 6 from 24. Then check your answer by adding 6.'}
  ];
  let exampleIndex=0;
  function renderLearning() {
    const ex=examples[exampleIndex];host.replaceChildren();
    const model=make('article','',host);
    make('p','Example '+(exampleIndex+1)+' of '+examples.length,model).className='example-count';
    make('h2',ex.title,model);
    make('div',ex.sum,model).className='example-equation';
    const steps=make('ol','',model);ex.steps.forEach(line=>make('li',line,steps));
    const tryIt=make('section','',host);tryIt.className='learning-try';
    make('h2','Try it',tryIt);
    let chosen=null;
    const feedback=make('p','');feedback.setAttribute('role','status');
    choices(tryIt,{...ex,text:ex.q},null,v=>{chosen=v;feedback.textContent='';});
    const check=make('button','Check answer',tryIt);check.className='action';
    check.onclick=()=>{feedback.textContent=chosen===null?'Choose an answer first.':chosen===ex.answer?'Correct! '+ex.hint:'Try again. '+ex.hint;};
    tryIt.append(feedback);
    const controls=make('div','',host);controls.className='learning-controls';
    const prev=make('button','Previous example',controls);prev.disabled=exampleIndex===0;prev.onclick=()=>{exampleIndex--;renderLearning();};
    const next=make('button','Next example',controls);next.disabled=exampleIndex===examples.length-1;next.onclick=()=>{exampleIndex++;renderLearning();};
    const ready=make('button','Ready to practise',controls);ready.onclick=()=>select('practice');
  }
  renderLearning();
  const start=document.querySelector('.early-hero .action'); start.textContent='Start learning'; start.onclick=event=>{event.preventDefault();select('learn');};
  const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  function question(kind) {
    let a=rnd(12,79),b=rnd(2,19),text,answer,hint,why;
    if(kind===0){text=a+' + '+b+' = ?';answer=a+b;if(b<10 && a%10+b<10){hint='Keep '+Math.floor(a/10)+' tens. Add '+b+' to the '+a%10+' ones.';why=a+' + '+b+' = '+answer+'. The tens stay the same.';}
      else if(b<10 && a%10!==0){const gap=10-a%10;hint='Add '+gap+' to reach '+(a+gap)+', then add the remaining '+(b-gap)+'.';why=a+' + '+gap+' = '+(a+gap)+'; '+(a+gap)+' + '+(b-gap)+' = '+answer+'.';}
      else {hint='Add '+(b-b%10)+' first'+(b%10?', then add '+b%10+'.':'.');why=a+' + '+b+' = '+answer+'.';}}
    if(kind===1){text=a+' − '+b+' = ?';if(b>a)b=2;text=a+' − '+b+' = ?';answer=a-b;hint='Subtract tens first, then ones. You can count up to check.';why=answer+' + '+b+' = '+a+', so '+a+' − '+b+' = '+answer+'.';}
    if(kind===2){answer=rnd(4,30);text='□ + '+b+' = '+(answer+b)+'. What is missing?';hint='Subtract the known part from the total.';why=(answer+b)+' − '+b+' = '+answer+'.';}
    if(kind===3){b=Math.min(b,a);answer=a-b;text='There are '+a+' books on a shelf. '+b+' are borrowed. How many remain?';hint='The total decreases when books are borrowed.';why=a+' − '+b+' = '+answer+' books.';}
    if(kind===4){answer=a+b;text='A class collects '+a+' cans on Monday and '+b+' on Tuesday. How many altogether?';hint='Altogether asks you to combine the two groups.';why=a+' + '+b+' = '+answer+' cans.';}
    if(kind===5){a=rnd(20,70);b=rnd(2,9);answer=a-b;text='One ribbon is '+a+' cm long. Another is '+b+' cm shorter. How long is the shorter ribbon?';hint='Shorter means subtract the difference.';why=a+' − '+b+' = '+answer+' cm.';}
    const values=new Set([answer]);while(values.size<4)values.add(Math.max(0,answer+rnd(-12,12)));
    return {text,answer:String(answer),choices:[...values].sort(()=>Math.random()-.5).map(String),hint,why};
  }
  function set(count) {const rows=[],seen=new Set();while(rows.length<count){const q=question(rows.length%6);if(seen.has(q.text))continue;seen.add(q.text);rows.push(q);}return rows;}
  function choices(parent,q,value,onSelect,disabled=false) {
    const f=make('fieldset','',parent);make('legend',q.text,f);
    q.choices.forEach(v=>{
      const l=make('label','',f),r=make('input','',l);r.type='radio';r.name='response';r.value=v;r.checked=v===value;r.disabled=disabled;
      make('span',v,l);r.onchange=()=>onSelect(v);
    });
  }
  const practice=panels.practice;let qs=set(10),index=0,marks=Array(10).fill(null),picked=null,missed=false;
  function renderPractice() {
    practice.replaceChildren();const q=qs[index];
    make('h2','Addition & subtraction practice',practice);
    make('p','Question '+(index+1)+' of 10 · '+marks.filter(x=>x===true).length+' correct',practice);
    const status=make('p','');status.setAttribute('role','status');
    choices(practice,q,picked,v=>{picked=v;status.textContent='';},marks[index]!==null);
    const controls=make('div','',practice);controls.className='topic-controls';
    const hint=make('button','Hint',controls),check=make('button','Check answer',controls),reveal=make('button','Show solution',controls),next=make('button',index===9?'Finish practice':'Next question',controls);
    reveal.hidden=!missed;check.disabled=marks[index]!==null;next.disabled=marks[index]===null;
    hint.onclick=()=>{status.textContent=q.hint;};
    reveal.onclick=()=>{marks[index]=false;renderPractice();};
    check.onclick=()=>{
      if(picked===null){status.textContent='Choose an answer first.';return;}
      if(picked===q.answer){marks[index]=true;renderPractice();}
      else {missed=true;reveal.hidden=false;status.textContent='Try again. '+q.hint;}
    };
    practice.append(status);
    if(marks[index]!==null)status.textContent=(marks[index]?'Correct! ':'Answer: '+q.answer+'. ')+q.why;
    next.onclick=()=>{if(index<9){index++;picked=null;missed=false;renderPractice();}else{practice.replaceChildren();make('h2','Practice complete',practice);make('p',marks.filter(Boolean).length+' of 10 solved correctly. Try the topic test when you are ready.',practice);practice.append(fresh());}};
    function fresh(){const b=make('button','New practice set');b.onclick=()=>{qs=set(10);marks=Array(10).fill(null);index=0;picked=null;missed=false;renderPractice();};return b;}
    controls.append(fresh());
  }
  renderPractice();
  const test=panels.test;let testQs=[],answers=[],ti=0,deadline=0,timer=null,running=false;
  function tick(){const left=Math.max(0,Math.ceil((deadline-Date.now())/1000));const clock=document.getElementById('topic-clock');if(clock)clock.textContent='Time left '+Math.floor(left/60)+':'+String(left%60).padStart(2,'0');if(left===0)finish();}
  function renderTest(){
    test.replaceChildren();make('h2','Test Yourself · Addition & subtraction',test);
    const clock=make('p','',test);clock.id='topic-clock';tick();if(!running)return;
    const counter=make('p','Question '+(ti+1)+' of 20 · '+answers.filter(x=>x!==null).length+' answered',test);
    choices(test,testQs[ti],answers[ti],v=>{answers[ti]=v;counter.textContent='Question '+(ti+1)+' of 20 · '+answers.filter(x=>x!==null).length+' answered';});
    const controls=make('div','',test);controls.className='topic-controls';
    const prev=make('button','Previous',controls);prev.disabled=ti===0;prev.onclick=()=>{ti--;renderTest();};
    const next=make('button',ti===19?'Review questions':'Next question',controls);next.onclick=()=>{ti=ti===19?0:ti+1;renderTest();};
    const dots=make('nav','',test);dots.setAttribute('aria-label','Test questions');dots.className='topic-dots';
    testQs.forEach((q,i)=>{const b=make('button',String(i+1)+(answers[i]!==null?' ✓':''),dots);b.setAttribute('aria-label','Question '+(i+1));if(i===ti)b.setAttribute('aria-current','step');b.onclick=()=>{ti=i;renderTest();};});
    const submit=make('button','Submit test',test);submit.onclick=()=>{
      const missing=answers.filter(x=>x===null).length;
      if(!missing){finish();return;}
      submit.disabled=true;make('p',missing+' unanswered. Submit now or return to the questions.',test);
      const confirm=make('button','Submit with unanswered questions',test);confirm.onclick=finish;
      const back=make('button','Keep answering',test);back.onclick=renderTest;
    };
  }
  function finish(){
    if(!running)return;running=false;clearInterval(timer);test.replaceChildren();
    const score=testQs.filter((q,i)=>q.answer===answers[i]).length;
    make('h2','Your result · '+score+' / 20',test);make('p',Math.round(score/20*100)+'% · Review each answer below.',test);
    testQs.forEach((q,i)=>{const d=make('details','',test);make('summary',(i+1)+'. '+q.text+' · '+(answers[i]===q.answer?'Correct':'Review'),d);make('p','Your answer: '+(answers[i]??'Unanswered'),d);make('p','Correct answer: '+q.answer+'. '+q.why,d);});
    const again=make('button','Try another test',test);again.onclick=intro;
  }
  function intro(){
    test.replaceChildren();make('h2','Test Yourself · Addition & subtraction',test);
    make('p','20 questions · 20 minutes · This topic only. Your timer starts when you press Start test. You can change answers and move between questions.',test);
    const b=make('button','Start test',test);b.onclick=()=>{testQs=set(20);answers=Array(20).fill(null);ti=0;deadline=Date.now()+20*60000;running=true;renderTest();timer=setInterval(tick,1000);};
  }
  intro();select('practice',false);
})();

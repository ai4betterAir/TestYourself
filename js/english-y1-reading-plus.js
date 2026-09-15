(function(){
  const source=window.SKILLUP_Y1_VOCAB_READING||[];
  const baseCount=lessons.length;
  const mix=a=>[...a].sort(()=>Math.random()-.5);
  const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  function fillFromStory(x){const target=x.v[0][0];const parts=x.s.match(/[^.!?]+[.!?]?/g)||[x.s];const sentence=parts.find(p=>new RegExp(`\\b${esc(target)}\\b`,'i').test(p))||parts[0];return [sentence.trim().replace(new RegExp(`\\b${esc(target)}\\b`,'i'),'____'),target]}
  const extras=source.map((x,i)=>{
    const other=mix(source.filter(y=>y!==x)).slice(0,3).map(y=>y.summary);
    const mains=mix([x.summary,...other]);
    return {t:x.t,s:x.s,w:x.v.map(v=>v[0]),fill:fillFromStory(x),main:[...mains,mains.indexOf(x.summary)],q:x.detail,vocab:x.v,infer:x.infer,source:'Vocabulary Story',sourceNo:x.n};
  });
  lessons.push(...extras);
  let filter='all';
  const oldRender=render;
  const oldNext=document.getElementById('nextLesson').onclick;
  function visibleIndexes(){return lessons.map((_,i)=>i).filter(i=>filter==='all'||(filter==='everyday'?i<baseCount:i>=baseCount))}
  renderButtons=function(){
    const host=document.getElementById('lessonButtons');
    const ids=visibleIndexes();
    host.innerHTML=ids.map(i=>{const x=lessons[i],label=i<baseCount?`${i+1}. ${x.t}`:`V${x.sourceNo}. ${x.t}`;return `<button class="${i===current?'active':''}" data-i="${i}">${label}</button>`}).join('');
    host.querySelectorAll('button').forEach(b=>b.onclick=()=>{current=+b.dataset.i;render()});
    document.querySelectorAll('#readingFilters button').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));
  };
  function extraChoice(id,items,answer,feedback){
    const box=document.getElementById(id);box.innerHTML=items.map((x,i)=>`<button data-i="${i}">${String.fromCharCode(65+i)}. ${x}</button>`).join('');
    box.querySelectorAll('button').forEach(b=>b.onclick=()=>{box.querySelectorAll('button').forEach(z=>z.classList.remove('correct','wrong'));if(+b.dataset.i===answer){b.classList.add('correct');document.getElementById(feedback).textContent='✓ Correct! Nice thinking.'}else{b.classList.add('wrong');box.querySelector(`[data-i="${answer}"]`)?.classList.add('correct');document.getElementById(feedback).textContent='Read that part again and look for a clue.'}});
  }
  function renderExtras(){
    const x=lessons[current],sourceBadge=document.getElementById('readingSource');
    const vocabBlock=document.getElementById('vocabQuestionBlock'),inferBlock=document.getElementById('inferQuestionBlock');
    if(x.source==='Vocabulary Story'){
      sourceBadge.hidden=false;sourceBadge.textContent=`VOCABULARY STORY · V${x.sourceNo}`;
      vocabBlock.hidden=false;inferBlock.hidden=false;
      const q=x.vocab[Math.floor(Math.random()*x.vocab.length)],wrong=mix(source.flatMap(y=>y.v.map(v=>v[1])).filter(v=>v!==q[1])).slice(0,3),opts=mix([q[1],...wrong]);
      document.getElementById('vocabQuestion').innerHTML=`In this story, what does <strong>${q[0]}</strong> mean?`;
      document.getElementById('vocabFeedback').textContent='';extraChoice('vocabChoices',opts,opts.indexOf(q[1]),'vocabFeedback');
      document.getElementById('inferQuestion').textContent=x.infer[0];document.getElementById('inferFeedback').textContent='';extraChoice('inferChoices',x.infer[1],x.infer[2],'inferFeedback');
    }else{
      sourceBadge.hidden=true;vocabBlock.hidden=true;inferBlock.hidden=true;
    }
    document.getElementById('progress').textContent=`Reading ${current+1} of ${lessons.length}`;
  }
  render=function(){oldRender();renderExtras()};
  document.querySelectorAll('#readingFilters button').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;const ids=visibleIndexes();if(!ids.includes(current))current=ids[0]||0;render()});
  document.getElementById('nextLesson').onclick=()=>{const ids=visibleIndexes(),at=ids.indexOf(current);current=ids[(at+1)%ids.length];render();document.querySelector('.lesson').scrollIntoView({behavior:'smooth',block:'start'})};
  render();
})();
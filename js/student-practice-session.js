import {supabase,requireUser,getProfile} from './supabase-client.js?v=profile-setup-fix';
import {getHomeworkBank,makeHomework} from './homework-bank.js';
import {practiceStore} from './student-practice-store.js';
import {progress,label,newSession,choose,check,move,YEARS,SUBJECTS} from './student-practice-model.js';
const host=document.getElementById('studentPracticeSession'),saveStatus=document.getElementById('sessionSaveStatus');
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let preview=false;
let session,store,queue=Promise.resolve(),pending=0,saveError=false,review=false;
function persist(){
  if(preview){saveStatus.textContent="Design preview · Your answers are not saved.";return;}
  session.updated_at=new Date().toISOString();session.unsynced=true;
  const local=store.write(session),snapshot=structuredClone(session);pending++;
  saveStatus.textContent=local?'Saved in this browser · syncing…':'Saving to your account…';
  queue=queue.then(async()=>{
    try{snapshot.version=session.version;const result=await store.save(snapshot);session.version=result.version;saveError=false;}
    catch(error){saveError=true;saveStatus.textContent=error?.code==='40001'?'This session changed in another tab. Refresh to load the latest saved version.':local?'Saved in this browser. Account sync is unavailable right now.':'Could not save progress. Keep this tab open and check your connection.';}
    finally{pending--;session.unsynced=saveError||pending>0;store.write(session);if(!pending&&!saveError)saveStatus.textContent='Saved to your account ✓';}
  });
}
function render(focus=false){
  const state=session.state,p=progress(state),q=state.questions[state.cursor],finished=p.complete;
  if(finished&&!review){
    host.innerHTML=`<span class="sp-eyebrow">PRACTICE COMPLETE</span><h1>${esc(label(session))}</h1><p class="sp-finish-score">${p.correct} / ${p.total}</p><p>Well done for finishing. Review your answers, or choose your next topic.</p><div class="sp-session-actions"><a class="sp-primary" href="practice.html">Back to my practice →</a><button class="sp-outline" id="reviewPractice" type="button">Review answers</button></div>`;
    document.getElementById('reviewPractice').onclick=()=>{review=true;render();};return;
  }
  const checked=state.checked[state.cursor];
  host.innerHTML=`<span class="sp-eyebrow">${esc(session.subject)} · ${session.year_level==='K'?'KINDERGARTEN':'YEAR '+session.year_level}</span><h1>${esc(label(session))}</h1><div class="sp-session-meta"><span>Question ${state.cursor+1} of ${p.total} · ${p.answered} checked</span><span>${p.correct} correct${finished?' · Review':''}</span></div>${q.passage?`<p class="sp-session-passage">${esc(q.passage)}</p>`:''}<h2 class="sp-session-question" tabindex="-1">${esc(q.text)}</h2><fieldset style="border:0;padding:0;margin:0"><legend class="sp-sr-only">Choose one answer</legend><div class="sp-session-answers">${q.choices.map((text,i)=>`<label class="sp-session-answer ${checked&&i===q.answer?'correct':checked&&i===state.answers[state.cursor]?'wrong':''}"><input type="radio" name="practiceAnswer" value="${i}" ${state.answers[state.cursor]===i?'checked':''} ${checked?'disabled':''}><span>${esc(text)}</span></label>`).join('')}</div></fieldset><div class="sp-session-actions"><button class="sp-outline" id="practiceHint" type="button">Hint</button><button class="sp-primary sp-check" id="practiceCheck" type="button" ${checked?'disabled':''}>Check answer</button><button class="sp-outline" id="practicePrevious" type="button" ${state.cursor===0?'disabled':''}>Previous</button><button class="sp-primary" id="practiceNext" type="button" ${state.cursor===p.total-1?'disabled':''}>Next question →</button></div><p id="practiceHintText" class="sp-session-hint" hidden>${esc(q.hint||'Take your time. Read the question again and work through it one step at a time.')}</p><p id="practiceFeedback" class="sp-session-feedback" role="status">${checked?(state.answers[state.cursor]===q.answer?'✓ Correct. Well done!':'<strong>Correct answer: '+esc(q.choices[q.answer])+'</strong><br>'+esc(practiceWorking(q.text,q.choices[q.answer],q.explanation||q.hint||''))):''}</p><nav class="sp-session-dots" aria-label="Practice questions">${state.questions.map((_,i)=>`<button type="button" data-practice-question="${i}" class="${state.checked[i]?'checked':''}" aria-current="${i===state.cursor}" aria-label="Question ${i+1}${state.checked[i]?', checked':''}">${i+1}</button>`).join('')}</nav><p class="sp-save-note">You can leave and return through My practice. Checked answers stay locked, so your score is counted once.</p>${finished?'<a class="sp-outline" href="practice.html">Choose another topic →</a>':''}`;
  host.querySelectorAll('[name="practiceAnswer"]').forEach(input=>input.onchange=()=>{choose(session,Number(input.value));persist();});
  document.getElementById('practiceCheck').onclick=()=>{if(!check(session)){document.getElementById('practiceFeedback').textContent='Choose an answer first.';return;}if(progress(state).complete && state.answers[state.cursor]!==q.answer)review=true;persist();render();};
  if(finished&&review){
    const finish=document.createElement('button');
    finish.className='sp-outline';finish.textContent='View practice score';
    finish.onclick=()=>{review=false;render();};
    host.querySelector('.sp-session-actions').append(finish);
  }
  document.getElementById('practiceHint').onclick=()=>{const hint=document.getElementById('practiceHintText');hint.hidden=!hint.hidden;};
  document.getElementById('practicePrevious').onclick=()=>{move(session,state.cursor-1);if(!finished)persist();render(true);};
  document.getElementById('practiceNext').onclick=()=>{move(session,state.cursor+1);if(!finished)persist();render(true);};
  host.querySelectorAll('[data-practice-question]').forEach(button=>button.onclick=()=>{move(session,Number(button.dataset.practiceQuestion));if(!finished)persist();render(true);});
  if(focus)host.querySelector('.sp-session-question').focus();
}
async function init(){
  if(new URLSearchParams(location.search).get('preview')==='1'){
    preview=true;const bank=await getHomeworkBank('2','Maths'),topic=bank.topics.find(t=>t.id==='g2facts')||bank.topics[0];
    session=newSession('preview','preview','2','Maths',[topic.id],[topic.label],makeHomework(bank,[topic.id],10));
    session.state.checked.fill(true,0,3);for(let i=0;i<3;i++)session.state.answers[i]=session.state.questions[i].answer;session.state.cursor=3;
    persist();render();return;
  }
  if(!supabase)throw new Error('Sign-in is temporarily unavailable.');
  const user=await requireUser();if(!user)return;const profile=await getProfile(user.id);
  if(profile.role!=='student'||profile.status!=='active')throw new Error('Sign in with an active student account to save your practice.');
  store=practiceStore(supabase,user.id);const params=new URLSearchParams(location.search),id=params.get('session');
  if(id){session=await store.load(id);if(!session)throw new Error('This saved practice is unavailable. Return to My practice and choose a topic.');saveStatus.textContent=session.unsynced?'Loaded your saved browser progress.':'Loaded your saved practice.';if(session.unsynced)persist();}
  else{
    const year=params.get('year')||profile.year_level||'1',subject=params.get('subject')||'Maths';
    if(!YEARS.includes(year)||!SUBJECTS.includes(subject))throw new Error('Choose a valid year and subject from My practice.');
    let ids;try{ids=JSON.parse(params.get('topics')||'[]');}catch{throw new Error('Choose a topic from My practice.');}
    if(!Array.isArray(ids)||!ids.length||ids.length>10||new Set(ids).size!==ids.length)throw new Error('Choose 1 to 10 topics from My practice.');
    const bank=await getHomeworkBank(year,subject);const questions=makeHomework(bank,ids,10),labels=ids.map(id=>bank.topics.find(t=>t.id===id).label);
    session=newSession(crypto.randomUUID(),user.id,year,subject,ids,labels,questions);
    history.replaceState(null,'','student-practice.html?session='+session.id);persist();
  }
  render();
}
init().catch(error=>{host.replaceChildren();const heading=document.createElement('h1');heading.textContent='Practice unavailable';const text=document.createElement('p');text.textContent=error.message||'Please refresh and try again.';const link=document.createElement('a');link.href='practice.html';link.className='sp-primary';link.textContent='Back to my practice';host.append(heading,text,link);});

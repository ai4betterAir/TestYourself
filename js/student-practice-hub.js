import {supabase,getProfile} from './supabase-client.js?v=profile-setup-fix';
import {getHomeworkBank,subjects} from './homework-bank.js';
import {practiceStore} from './student-practice-store.js';
import {progress,label,YEARS} from './student-practice-model.js';
const $=id=>document.getElementById(id);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let year='1',subject='Maths',bank,loadVersion=0,selected=new Set(),expanded=false;
const yearName=value=>value==='K'?'Kindergarten':'Year '+value;
function startUrl(ids){const p=new URLSearchParams({year,subject,topics:JSON.stringify(ids)});return 'student-practice.html?'+p.toString();}
function resumeUrl(row){if(new URLSearchParams(location.search).get('preview')==='1')return 'student-practice.html?preview=1';return 'student-practice.html?session='+encodeURIComponent(row.id);}
function mixState(){const count=selected.size;$('mixCount').textContent=count?count+' topics selected · 10 questions':'Select 2–10 topics for mixed practice.';$('startMixedPractice').disabled=count<2||count>10;}
function renderTopics(){
  const term=$('topicSearch').value.trim().toLowerCase(),matches=bank?.topics.filter(t=>t.label.toLowerCase().includes(term))||[],topics=term||expanded?matches:matches.slice(0,8);
  $('showAllPracticeTopics').hidden=Boolean(term)||matches.length<=8;
  $('showAllPracticeTopics').textContent=expanded?'Show fewer topics':'Show all '+matches.length+' topics';
  $('showAllPracticeTopics').onclick=()=>{expanded=!expanded;renderTopics();};
  $('practiceTopicGrid').innerHTML=topics.length?topics.map(t=>`<article class="sp-topic-card"><span class="sp-topic-symbol" aria-hidden="true">${subject==='Maths'?'123':subject==='English'?'Aa':'✧'}</span><h3>${esc(t.label)}</h3><div class="sp-topic-card-bottom"><a href="${esc(startUrl([t.id]))}">Practise →</a><label><input type="checkbox" data-mix-topic="${esc(t.id)}" ${selected.has(t.id)?'checked':''}> Add to mix</label></div></article>`).join(''):'<p class="sp-empty">No topics match your search. Try another word.</p>';
  $('practiceTopicGrid').querySelectorAll('[data-mix-topic]').forEach(input=>input.onchange=()=>{
    if(input.checked&&selected.size>=10){input.checked=false;$('topicStatus').textContent='Choose up to 10 topics for a 10-question mix.';return;}
    if(input.checked)selected.add(input.dataset.mixTopic);else selected.delete(input.dataset.mixTopic);
    $('topicStatus').textContent='';mixState();
  });
}
async function loadTopics(){
  const version=++loadVersion;bank=null;expanded=false;selected.clear();mixState();$('topicStatus').textContent='Loading '+subject.toLowerCase()+' topics…';$('practiceTopicGrid').innerHTML='';
  $('practiceSubjects').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.subject===subject)));
  $('hubMathsLessons').href='maths-practice.html?grade='+year;
  $('hubVocabulary').href=year==='K'?'subject.html?year=K&subject=vocabulary':'vocabulary-year'+year+'.html';
  $('hubKnowledge').href='subject.html?year='+year+'&subject=general-knowledge';
  try{const loaded=await getHomeworkBank(year,subject);if(version!==loadVersion)return;bank=loaded;$('topicStatus').textContent=bank.topics.length+' topics · '+yearName(year);renderTopics();}
  catch(error){if(version===loadVersion)$('topicStatus').textContent='Topics could not load. Choose a subject again or refresh the page.';}
}
function renderHistory(rows){
  const active=rows.find(row=>!progress(row.state).complete),host=$('continuePractice');
  if(active){const p=progress(active.state);host.innerHTML=`<span class="sp-eyebrow">CONTINUE WHERE YOU LEFT OFF</span><h2>${esc(label(active))}</h2><p>${esc(active.subject)} · ${yearName(active.year_level)} · Your questions and answers are saved.</p><div class="sp-progress-track"><span style="width:${p.answered/p.total*100}%"></span></div><span class="sp-progress-label">${p.answered} of ${p.total} questions checked · Question ${active.state.cursor+1} ready to open</span><div class="sp-continue-actions"><a class="sp-primary" href="${resumeUrl(active)}">Continue practice →</a><a href="#practiceSubjects">Choose another topic</a></div>`;}
  else host.innerHTML='<span class="sp-eyebrow">YOUR NEXT SMALL STEP</span><h2>Ready when you are.</h2><p>Choose a topic below. We’ll save your questions and place so you can come back anytime.</p><div class="sp-continue-actions"><a class="sp-primary" href="#practiceSubjects">Choose a topic →</a></div>';
  $('recentPractice').innerHTML=rows.length?rows.slice(0,9).map(row=>{const p=progress(row.state);return `<article class="sp-recent-card"><span class="sp-badge ${p.complete?'complete':''}">${p.complete?'COMPLETED':'IN PROGRESS'}</span><h3>${esc(label(row))}</h3><p>${esc(row.subject)} · ${yearName(row.year_level)} · ${p.complete?p.correct+'/'+p.total+' correct':p.answered+'/'+p.total+' checked'}</p><a href="${resumeUrl(row)}">${p.complete?'Review answers':'Continue'} →</a></article>`;}).join(''):'<p class="sp-empty">Your recent practice will appear here after you start your first topic.</p>';
}
async function previewHub(){
  year='2';$('hubYear').value=year;
  $('practiceGate').textContent='Design preview · Sample student data. Sign in to use your own saved practice.';
  $('practiceGreeting').textContent='Welcome back, Alex.';$('practiceHub').hidden=false;$('practiceSignOut').hidden=true;
  $('practiceSubjects').innerHTML=subjects.map(s=>`<button type="button" data-subject="${s}" aria-pressed="${s===subject}">${s}</button>`).join('');
  $('practiceSubjects').querySelectorAll('button').forEach(b=>b.onclick=()=>{subject=b.dataset.subject;loadTopics();});
  $('hubYear').onchange=()=>{year=$('hubYear').value;loadTopics();};$('topicSearch').oninput=renderTopics;
  $('startMixedPractice').onclick=()=>location.assign('student-practice.html?preview=1');
  const q={text:'34 + 12 = ?',answer:0,choices:['46','44','48'],topic:'g2facts'};
  renderHistory([{id:'sample',subject:'Maths',year_level:'2',topic_labels:['Addition and subtraction'],state:{questions:Array(10).fill(q),answers:[0,0,0,null,null,null,null,null,null,null],checked:[true,true,true,false,false,false,false,false,false,false],cursor:3}}]);
  $('practiceStats').innerHTML='<div><strong>3</strong><span>Completed · sample</span></div><div><strong>1</strong><span>In progress · sample</span></div><div><strong>2</strong><span>School year</span></div>';
  $('practiceSaveNote').textContent='Preview only. Your account progress is shown after student sign-in.';
  await loadTopics();
}
async function init(){
  if(['grade','year','topic','focus','mode','assignment'].some(k=>new URLSearchParams(location.search).has(k)))return;
  if(new URLSearchParams(location.search).get('preview')==='1'){document.getElementById('publicPractice')?.setAttribute('hidden','');return previewHub();}
  if(!supabase)throw new Error('Sign-in is temporarily unavailable. Please try again shortly.');
  const {data}=await supabase.auth.getUser();
  const user=data?.user;if(!user)return;
  const profile=await getProfile(user.id);
  if(profile.role!=='student'||profile.status!=='active'){$('practiceGate').hidden=false;$('practiceGate').innerHTML='This practice hub is for active student accounts. <a href="dashboard.html">Open your dashboard →</a>';return;}
  document.getElementById('publicPractice')?.setAttribute('hidden','');
  $('practiceSignOut').hidden=false;
  try{localStorage.setItem('tyProfile',JSON.stringify({studentName:profile.full_name,grade:profile.year_level||'1',guest:false,cloudAccount:true}));}catch{}
  year=YEARS.includes(profile.year_level)?profile.year_level:'1';$('hubYear').value=year;
  $('practiceGreeting').textContent='Welcome back, '+(profile.full_name.trim().split(/\s+/)[0]||'learner')+'.';
  $('practiceSubjects').innerHTML=subjects.map(s=>`<button type="button" data-subject="${s}" aria-pressed="${s===subject}">${s}</button>`).join('');
  $('practiceSubjects').querySelectorAll('button').forEach(b=>b.onclick=()=>{subject=b.dataset.subject;loadTopics();});
  $('hubYear').onchange=()=>{year=$('hubYear').value;loadTopics();};$('topicSearch').oninput=renderTopics;
  $('startMixedPractice').onclick=()=>{if(bank&&selected.size>=2&&selected.size<=10)location.assign(startUrl([...selected]));};
  $('practiceSignOut').onclick=async()=>{await supabase.auth.signOut();location.replace('sign-in.html');};
  $('practiceGate').hidden=true;$('practiceHub').hidden=false;
  const store=practiceStore(supabase,user.id);const history=await store.list();renderHistory(history.rows);
  let complete=history.rows.filter(r=>progress(r.state).complete).length,active=history.rows.length-complete,scope='Recent';
  if(history.cloud){
    const counts=await Promise.allSettled(['completed','active'].map(status=>supabase.from('student_practice_sessions').select('id',{count:'exact',head:true}).eq('student_id',user.id).eq('status',status)));
    if(counts.every(r=>r.status==='fulfilled'&&!r.value.error&&Number.isInteger(r.value.count))){complete=counts[0].value.count;active=counts[1].value.count;scope='';}
  }
  $('practiceStats').innerHTML=`<div><strong>${complete}</strong><span>${scope} completed</span></div><div><strong>${active}</strong><span>${scope} in progress</span></div><div><strong>${esc(profile.year_level||'1')}</strong><span>School year</span></div>`;
  $('practiceSaveNote').textContent=history.cloud?'Progress is saved to your account. Pending changes are also kept in this browser.':'Cross-device saving is unavailable. New practice can still be saved in this browser.';
  await loadTopics();
}
init().catch(error=>{$('practiceGate').hidden=false;$('practiceGate').textContent=error.message||'Your practice could not load. Please refresh or sign in again.';});

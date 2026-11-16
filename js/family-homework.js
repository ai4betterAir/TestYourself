import {supabase, requireUser, getProfile, friendlyError, formatDate} from './supabase-client.js?v=profile-setup-fix';
const host=document.getElementById('homeworkApp');
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let work, answers=[],index=0,busy=false;
const draftKey=id=>'acorn-family-homework-'+id;
const status=text=>{const out=document.getElementById('homeworkStatus');if(out)out.textContent=text;};
function saveDraft(){try{localStorage.setItem(draftKey(work.id),JSON.stringify(answers));}catch{}}
function result() {
  host.innerHTML=`<p>HOMEWORK COMPLETE</p><h1>${esc(work.title)}</h1><p class="homework-score">${work.score} / ${work.questions.length}</p><p>Your result has been saved. Your guardian can see it on their dashboard.</p><a class="primary-button" href="dashboard.html">Back to dashboard</a>`;
}
function render(focus=false) {
  if(work.submitted_at)return result();
  const q=work.questions[index],answered=answers.filter(Number.isInteger).length;
  host.innerHTML=`<p>${esc(work.subject)} · ${work.year_level==='K'?'Kindergarten':'Year '+esc(work.year_level)} · ${work.topic_ids.length>1?'Mixed topics':'Topic homework'}</p><h1>${esc(work.title)}</h1>${work.instructions?`<p class="homework-notice">${esc(work.instructions)}</p>`:''}<div class="homework-progress"><span>Question ${index+1} of ${work.questions.length} · ${answered} answered</span><span>Due ${esc(formatDate(work.due_at,true))}</span></div>${q.passage?`<p class="homework-passage">${esc(q.passage)}</p>`:''}<h2 class="homework-question" tabindex="-1">${esc(q.text)}</h2><fieldset style="border:0;padding:0;margin:0"><legend class="panel-subtitle">Choose one answer</legend><div class="homework-answers">${q.choices.map((choice,i)=>`<label class="homework-answer"><input type="radio" name="answer" value="${i}" ${answers[index]===i?'checked':''}><span>${esc(choice)}</span></label>`).join('')}</div></fieldset><div class="homework-actions">${q.hint?'<button type="button" class="secondary-button" id="homeworkHint">Show hint</button>':''}<button class="secondary-button" id="homeworkPrevious" type="button" ${index===0?'disabled':''}>Previous</button><button class="primary-button" id="homeworkNext" type="button" ${index===work.questions.length-1?'disabled':''}>Next question</button></div><p id="homeworkHintText" class="homework-hint" hidden>${esc(q.hint)}</p><nav class="homework-nav" aria-label="Homework questions">${work.questions.map((_,i)=>`<button type="button" data-question="${i}" class="${Number.isInteger(answers[i])?'answered':''}" aria-current="${index===i}" aria-label="Question ${i+1}${Number.isInteger(answers[i])?', answered':''}">${i+1}</button>`).join('')}</nav><button type="button" class="primary-button" id="homeworkSubmit">Submit homework</button><p id="homeworkStatus" role="status"></p><p class="panel-subtitle">You can move between questions. Your answers are saved on this browser until you submit.</p>`;
  host.querySelectorAll('[name="answer"]').forEach(input=>input.onchange=()=>{
    answers[index]=Number(input.value);saveDraft();
    const nav=host.querySelector(`[data-question="${index}"]`);nav.classList.add('answered');nav.setAttribute('aria-label','Question '+(index+1)+', answered');
    host.querySelector('.homework-progress span').textContent=`Question ${index+1} of ${work.questions.length} · ${answers.filter(Number.isInteger).length} answered`;
  });
  host.querySelectorAll('[data-question]').forEach(button=>button.onclick=()=>{index=Number(button.dataset.question);render(true);});
  document.getElementById('homeworkPrevious').onclick=()=>{index--;render(true);};
  document.getElementById('homeworkNext').onclick=()=>{index++;render(true);};
  const hint=document.getElementById('homeworkHint');if(hint)hint.onclick=()=>{const text=document.getElementById('homeworkHintText');text.hidden=!text.hidden;hint.textContent=text.hidden?'Show hint':'Hide hint';};
  document.getElementById('homeworkSubmit').onclick=submit;
  if(focus)host.querySelector('.homework-question').focus();
}
async function submit() {
  if(busy)return;
  if(answers.some(a=>!Number.isInteger(a)))return status('Answer all questions before submitting. Use the numbered buttons to find unanswered questions.');
  busy=true;host.querySelectorAll('button,input').forEach(n=>n.disabled=true);status('Saving your result…');
  try{
    const {data,error}=await supabase.rpc('submit_family_homework',{homework_input:work.id,answers_input:answers});
    if(error)throw error;
    work.score=data.score;work.submitted_at=new Date().toISOString();
    try{localStorage.removeItem(draftKey(work.id));}catch{}
    result();
  }catch(error){render();status(friendlyError(error));}
  finally{busy=false;}
}
async function init(){
  if(!supabase)throw new Error('The account service is not configured.');
  const user=await requireUser();if(!user)return;
  const profile=await getProfile(user.id);
  if(profile.role!=='student'||profile.status!=='active')throw new Error('Sign in with the student account assigned this homework.');
  const id=new URLSearchParams(location.search).get('id');
  if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id||''))throw new Error('Open your homework from the dashboard.');
  const {data,error}=await supabase.from('family_homework').select('*').eq('id',id).eq('student_id',user.id).maybeSingle();
  if(error)throw error;if(!data)throw new Error('This homework is not available to your account.');
  work=data;
  if(!work.submitted_at&&!work.allow_late&&new Date(work.due_at)<new Date())throw new Error('The due date has passed and this homework is closed.');
  answers=Array(work.questions.length).fill(null);
  try{const draft=JSON.parse(localStorage.getItem(draftKey(work.id)));if(Array.isArray(draft)&&draft.length===answers.length)answers=draft.map((a,i)=>Number.isInteger(a)&&a>=0&&a<work.questions[i].choices.length?a:null);}catch{}
  render();
}
init().catch(error=>{host.replaceChildren();const title=document.createElement('h1');title.textContent='Homework unavailable';const text=document.createElement('p');text.textContent=friendlyError(error);host.append(title,text);});

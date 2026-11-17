// One board for topic homework and older activity-link assignments. All reads use account RLS.
import {supabase, formatDate} from './supabase-client.js?v=profile-setup-fix';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeResource=value=>{try{const url=new URL(value,location.href);return url.origin===location.origin&&url.pathname.endsWith('.html')?url:null;}catch{return null;}};
export function assignmentState(item,now=Date.now()) {
 if(item.submitted_at)return 'completed';
 if(item.opens_at&&new Date(item.opens_at).getTime()>now)return 'scheduled';
 if(item.closed||(!item.allow_late&&new Date(item.due_at).getTime()<now))return 'closed';
 if(new Date(item.due_at).getTime()<now)return 'overdue';
 return 'waiting';
}
export function mergeAssignmentActivity(homework,assignments,submissions,members,targets,people,role,userId) {
 const name=id=>people.find(p=>p.id===id)?.full_name;
 const rows=homework.map(h=>({...h,kind:'homework',key:'homework:'+h.id,total:h.total??h.questions?.length,sender_name:h.sender_name||name(h.teacher_id||h.parent_id)||(h.teacher_id?'your teacher':'your guardian'),student_name:h.student_name||name(h.student_id)||'Student'}));
 for(const a of assignments){
  if(!['published','closed'].includes(a.status))continue;
  const selected=targets.filter(t=>t.assignment_id===a.id).map(t=>t.student_id);
  const ids=role==='student'?[userId]:[...new Set([...members.filter(m=>m.class_id===a.class_id).map(m=>m.student_id),...submissions.filter(s=>s.assignment_id===a.id).map(s=>s.student_id)])];
  for(const id of ids){
   if(selected.length&&!selected.includes(id))continue;
   // Parent fallback people contains only approved linked children, never classmates.
   if(role==='parent'&&!people.some(p=>p.id===id&&p.role!=='teacher'&&p.role!=='parent'))continue;
   const attempts=submissions.filter(s=>s.assignment_id===a.id&&s.student_id===id);
   const submitted=attempts.filter(s=>s.submitted_at).sort((x,y)=>new Date(y.submitted_at)-new Date(x.submitted_at))[0];
   const latest=submitted||attempts.sort((x,y)=>(y.attempt_no||0)-(x.attempt_no||0))[0];
   rows.push({...a,id:a.id,key:'activity:'+a.id+':'+id,kind:'activity',student_id:id,student_name:name(id)||'Student',sender_name:name(a.teacher_id)||'your teacher',submitted_at:submitted?.submitted_at,score:submitted?.score,total:submitted?.max_score,closed:a.status==='closed',submission_status:latest?.status});
  }
 }
 return rows.sort((a,b)=>Number(!!a.submitted_at)-Number(!!b.submitted_at)||(a.submitted_at?new Date(b.submitted_at)-new Date(a.submitted_at):new Date(a.due_at)-new Date(b.due_at)));
}
export function renderSubmissionAnswers(box,questions,{notice=''}={}) {
 box.innerHTML=`${notice?`<p class="homework-notice">${esc(notice)}</p>`:''}<ol class="assignment-board-answers">${questions.map((q,i)=>{
  const marked=typeof q.is_correct==='boolean';
  const chosen=q.choices?.[q.chosen_index]??'No answer recorded';
  return `<li class="${marked?(q.is_correct?'submission-correct':'submission-incorrect'):''}"><div class="submission-answer-heading"><strong>${esc(q.text)}</strong>${marked?`<span class="submission-answer-status">${q.is_correct?'✓ Correct':'✗ Incorrect'}</span>`:''}</div><p>Student answer: <strong>${esc(chosen)}</strong></p>${marked&&!q.is_correct?`<p class="submission-correction">Correct answer: <strong>${esc(q.choices[q.correct_index])}</strong></p>`:''}${q.explanation?`<details class="submission-strategy"><summary>View strategy</summary><p>${esc(q.explanation)}</p></details>`:''}</li>`;
 }).join('')}</ol>`;
}
export function renderAssignmentBoard(host,rows,role,{filter='all',notice='',preview=false}={}) {
 host.dataset.boardFilter=filter;
 const waiting=rows.filter(x=>['waiting','overdue'].includes(assignmentState(x))).length,completed=rows.filter(x=>x.submitted_at).length;
 const shown=rows.filter(x=>filter==='all'||(filter==='completed'?!!x.submitted_at:['waiting','overdue','scheduled','closed'].includes(assignmentState(x))));
 const title=role==='student'?`You have ${waiting} assignment${waiting===1?'':'s'} to complete`:role==='teacher'?`${completed} submission${completed===1?'':'s'} received`:`${completed} assignment${completed===1?'':'s'} completed`;
 host.innerHTML=`<div class="assignment-board-banner"><div><span class="homework-eyebrow">YOUR ASSIGNMENT BOARD</span><h3>${title}</h3><p>${role==='student'?'Work from your family and teachers, together in one place.':'Track each student separately. Submitted scores and answers stay with their assignment.'}</p></div><button type="button" class="secondary-button" data-board-refresh>↻ Refresh</button></div><div class="assignment-board-toolbar"><div role="group" aria-label="Filter assignments">${[['all','All work'],['waiting','To do'],['completed','Submitted']].map(([id,label])=>`<button type="button" data-board-filter="${id}" aria-pressed="${filter===id}">${label}</button>`).join('')}</div><span class="assignment-board-updated" role="status">${esc(notice||(preview?'Sample information':'Updated '+new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})))}</span></div><div class="assignment-board-grid">${shown.map(item=>{
  const state=assignmentState(item),complete=state==='completed';
  let action='';
  if(role==='student'){
   let href=item.kind==='homework'?'family-homework.html?id='+encodeURIComponent(item.id):null;
   if(item.kind==='activity'){const url=safeResource(item.resource_url);if(url){url.searchParams.set('assignment',item.id);href=url.pathname+url.search+url.hash;}}
   if(href&&!preview)action=`<a class="primary-link" href="${esc(href)}">${complete?'View result':'Open assignment'} →</a>`;
  }else if(complete&&item.kind==='homework')action=`<button type="button" class="secondary-button" data-board-review="${esc(item.id)}">View submission</button>`;
  const labels={waiting:'To do',overdue:'Overdue',scheduled:'Not open yet',closed:'Closed',completed:'Submitted'};
  return `<article class="assignment-board-card ${complete?'is-submitted':''}"><div class="assignment-board-top"><span>${item.teacher_id?'Teacher assignment':'Family assignment'}</span><strong class="assignment-board-state ${state}">${labels[state]}</strong></div><h3>${esc(item.title)}</h3><p class="assignment-board-person">${role==='student'?`From ${esc(item.sender_name)}`:`${esc(item.student_name)} · From ${esc(item.sender_name)}`}</p><p>${esc(item.subject)}${item.year_level?' · '+(item.year_level==='K'?'Kindergarten':'Year '+esc(item.year_level)):''}${item.total?' · '+Number(item.total)+(item.kind==='homework'?' questions':' marks'):''}</p><p>${complete?'Submitted '+esc(formatDate(item.submitted_at,true)):'Due '+esc(formatDate(item.due_at,true))}</p>${complete?`<div class="assignment-board-score">${item.score!=null&&item.total?`${Number(item.score)} <small>/ ${Number(item.total)} · ${Math.round(Number(item.score)/Number(item.total)*100)}%</small>`:'Received · Awaiting marking'}</div>`:''}<div class="assignment-board-actions">${action}</div><div data-review-for="${esc(item.id)}" hidden></div></article>`;
 }).join('')||'<p class="assignment-board-empty">No assignments in this view yet. New work and submitted results will appear here.</p>'}</div>`;
 host.querySelectorAll('[data-board-filter]').forEach(button=>button.onclick=()=>renderAssignmentBoard(host,rows,role,{filter:button.dataset.boardFilter,notice,preview}));
 host.querySelector('[data-board-refresh]').onclick=()=>host.dispatchEvent(new CustomEvent('assignment-board-refresh',{bubbles:true}));
 host.querySelectorAll('[data-board-review]').forEach(button=>button.onclick=async()=>{
  const box=button.closest('article').querySelector('[data-review-for]');
  if(!box.hidden){box.hidden=true;button.textContent='View submission';return;}
  box.hidden=false;button.textContent='Hide submission';
  if(preview){renderSubmissionAnswers(box,[{text:'4/5 × 3/6 = ?',choices:['2/5','7/30','3/5','1/5'],chosen_index:1,correct_index:0,is_correct:false,explanation:'Multiply the numerators and denominators: 12/30 simplifies to 2/5.'},{text:'7 ÷ 1/4 = ?',choices:['28','7/4','7','14'],chosen_index:0,correct_index:0,is_correct:true}],{notice:'Sample submitted answers · No student account data is used.'});return;}
  box.textContent='Loading marked answers…';
  try {
    const review=await supabase.rpc('review_family_homework',{homework_input:button.dataset.boardReview});
    if(!review.error&&Array.isArray(review.data?.questions)){
      renderSubmissionAnswers(box,review.data.questions);return;
    }
    // Older database setups still show the saved choices, never guessed correctness.
    const {data,error}=await supabase.from('family_homework').select('questions,answers,submitted_at').eq('id',button.dataset.boardReview).maybeSingle();
    if(error||!data?.submitted_at){box.textContent='The submitted answers could not load. Refresh and try again.';return;}
    renderSubmissionAnswers(box,data.questions.map((q,i)=>({...q,chosen_index:data.answers?.[i]})),{notice:'Per-question marking is not available yet. The site owner needs to update the question-review setup. These are the saved student answers.'});
  } catch(error){box.textContent='The submitted answers could not load. Refresh and try again.';}

 });
}
export async function loadAssignmentActivity(role,userId) {
 const homeworkQuery=await supabase.from('family_homework').select('id,parent_id,teacher_id,class_id,student_id,title,subject,year_level,due_at,allow_late,submitted_at,score,questions').order('due_at');
 const [assignments,submissions,members,targets]=await Promise.all([
  supabase.from('assignments').select('*'),supabase.from('submissions').select('*'),supabase.from('class_members').select('class_id,student_id'),supabase.from('assignment_targets').select('assignment_id,student_id')
 ]);
 let homework=homeworkQuery.data||[],people=[];
 // Optional names RPC exposes names only for homework the caller can already access.
 try{const names=await supabase.rpc('get_homework_activity');if(!names.error&&Array.isArray(names.data))homework=names.data;}catch{}
 const ids=[...new Set([...homework.flatMap(h=>[h.student_id,h.parent_id,h.teacher_id]),...(members.data||[]).map(m=>m.student_id),...(submissions.data||[]).map(s=>s.student_id)].filter(Boolean))];
 if(ids.length){const result=await supabase.from('profiles').select('id,full_name,role').in('id',ids);people=result.data||[];}
 const errors=[homeworkQuery.error,assignments.error,submissions.error,members.error,targets.error].filter(Boolean);
 const rows=mergeAssignmentActivity(homework,assignments.data||[],submissions.data||[],members.data||[],targets.data||[],people,role,userId);
 return {rows,notice:errors.length?'Some work could not load. Refresh or check the homework SQL setup.':''};
}

import {supabase, getProfile, friendlyError, formatDate} from './supabase-client.js?v=profile-setup-fix';
import {subjects, getHomeworkBank, makeHomework} from './homework-bank.js';
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let profile, children = [], classList = [], classMembers = [], bank, bankVersion = 0, busy = false;
const isTeacher = () => profile?.role === 'teacher';
const target = () => isTeacher() ? classList.find(c => c.id === $('homeworkClass')?.value) : children.find(c => c.id === $('homeworkChild')?.value);
function renderClassRecipients() {
  const ids = new Set(classMembers.filter(m => m.class_id === $('homeworkClass').value).map(m => m.student_id));
  const students = children.filter(c => ids.has(c.id));
  $('homeworkStudents').innerHTML = students.length ? students.map(c => `<label class="homework-topic"><input type="checkbox" name="homeworkStudent" value="${c.id}" checked><span>${esc(c.full_name)}</span></label>`).join('') : '<p>No active students enrolled in this class yet.</p>';
}
const $ = id => document.getElementById(id);
const yearLabel = year => year === 'K' ? 'Kindergarten' : 'Year ' + year;
function dueValue() { const date = new Date(Date.now() + 7*864e5); date.setMinutes(date.getMinutes()-date.getTimezoneOffset()); return date.toISOString().slice(0,16); }
function openForm() {
  $('familyHomeworkModal').hidden = false;
  $('homeworkMessage').textContent = '';
  if (isTeacher() ? !classList.length : !children.length) { $('homeworkMessage').textContent = isTeacher() ? 'Create a class and enrol students first.' : 'Link a child and have the connection approved first.'; return; }
  if (isTeacher()) renderClassRecipients();
  updateTopics();
}
async function updateTopics() {
  const version = ++bankVersion; bank = null;
  const child = target();
  $('homeworkTopics').textContent = 'Loading topics…'; $('homeworkPublish').disabled = true;
  $('homeworkYear').textContent = child?.year_level ? yearLabel(child.year_level) : 'Set a school year in the student profile or class first.';
  if (!child?.year_level) { $('homeworkTopics').textContent = ''; return; }
  try {
    const loaded = await getHomeworkBank(child.year_level, $('homeworkSubject').value);
    if (version !== bankVersion) return;
    bank = loaded; const mixed = $('homeworkMode').value === 'mixed';
    $('homeworkTopics').innerHTML = bank.topics.map((topic,index) => `<label class="homework-topic"><input type="${mixed?'checkbox':'radio'}" name="homeworkTopic" value="${esc(topic.id)}" ${index===0?'checked':''}><span>${esc(topic.label)}</span></label>`).join('');
    $('homeworkPublish').disabled = !bank.topics.length || busy;
  } catch(error) { if (version===bankVersion) $('homeworkTopics').textContent=error.message; }
}
async function publish(event) {
  event.preventDefault(); if (busy || !bank) return;
  const out = $('homeworkMessage'); out.classList.remove('success'); out.textContent='';
  const child = target();
  const topicIds = [...document.querySelectorAll('[name="homeworkTopic"]:checked')].map(node=>node.value);
  const count = Number($('homeworkCount').value), due = new Date($('homeworkDue').value);
  if (!child?.year_level) return out.textContent='Choose a child or class with a school year set.';
  const students = isTeacher() ? [...document.querySelectorAll('[name="homeworkStudent"]:checked')].map(n=>n.value) : [];
  if (isTeacher() && !students.length) return out.textContent='Choose at least one enrolled student.';
  if (!topicIds.length || topicIds.length > count) return out.textContent='Choose 1 to '+count+' topics.';
  if ($('homeworkMode').value==='mixed' && topicIds.length<2) return out.textContent='Choose at least two topics for mixed homework.';
  if (!Number.isFinite(due.getTime()) || due<=new Date()) return out.textContent='Choose a future due date.';
  busy=true; $('homeworkPublish').disabled=true; out.textContent='Preparing homework…';
  try {
    const questions=makeHomework(bank,topicIds,count);
    const {error}=await supabase.rpc(isTeacher() ? 'create_teacher_homework' : 'create_family_homework', {
      ...(isTeacher() ? {class_input:child.id,students_input:students} : {child_input:child.id}), year_input:child.year_level, subject_input:$('homeworkSubject').value,
      topics_input:topicIds, title_input:$('homeworkTitle').value.trim(), instructions_input:$('homeworkInstructions').value.trim(),
      due_input:due.toISOString(), allow_late_input:$('homeworkAllowLate').checked, questions_input:questions
    });
    if(error) throw error;
    out.classList.add('success'); out.textContent=isTeacher() ? 'Homework assigned to '+students.length+' students. Results will appear here as they submit.' : 'Homework assigned. It is now on your child’s dashboard.';
    await refresh();
  } catch(error) { out.textContent=friendlyError(error); }
  finally { busy=false; $('homeworkPublish').disabled=!bank; }
}
function setupModal() {
  const modal=document.createElement('div'); modal.id='familyHomeworkModal'; modal.className='modal'; modal.hidden=true;
  modal.innerHTML=`<section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="familyHomeworkTitle"><div class="modal-heading"><h2 id="familyHomeworkTitle">Assign homework</h2><button class="modal-close" id="closeFamilyHomework" type="button" aria-label="Close homework form">×</button></div><form id="familyHomeworkForm" class="dashboard-form"><label>Child<select id="homeworkChild" required>${children.map(c=>`<option value="${c.id}">${esc(c.full_name)}</option>`).join('')}</select></label><p class="notice">School year: <strong id="homeworkYear"></strong> · From the student’s profile.</p><label>Title<input id="homeworkTitle" required maxlength="120" placeholder="This week’s homework"></label><div class="form-row"><label>Subject<select id="homeworkSubject">${subjects.map(s=>`<option>${s}</option>`).join('')}</select></label><label>Homework type<select id="homeworkMode"><option value="topic">One topic</option><option value="mixed">Mixed topics</option></select></label></div><fieldset><legend>Topics</legend><div id="homeworkTopics" class="homework-topics"></div></fieldset><p class="panel-subtitle">Mixed homework combines selected topics within this subject. Small question banks may repeat questions for revision.</p><div class="form-row"><label>Questions<select id="homeworkCount"><option value="10">10 questions</option><option value="20">20 questions</option></select></label><label>Due date<input id="homeworkDue" type="datetime-local" value="${dueValue()}" required></label></div><label>Instructions<textarea id="homeworkInstructions" maxlength="1000" rows="3"></textarea></label><label class="checkbox-row"><input id="homeworkAllowLate" type="checkbox" checked><span>Allow completion after the due date</span></label><button id="homeworkPublish" class="primary-button" type="submit">Assign to child</button><p id="homeworkMessage" class="form-message" role="status" aria-live="polite"></p></form></section>`;
  document.body.append(modal);
  if (isTeacher()) {
    $('familyHomeworkTitle').textContent='Assign class homework';
    $('homeworkChild').disabled=true; $('homeworkChild').closest('label').hidden=true;
    const classField=document.createElement('label');classField.innerHTML=`Class<select id="homeworkClass" required>${classList.map(c=>`<option value="${c.id}">${esc(c.name)} · ${yearLabel(c.year_level)}</option>`).join('')}</select>`;
    $('familyHomeworkForm').prepend(classField);
    const recipients=document.createElement('fieldset');recipients.innerHTML='<legend>Students · uncheck anyone you do not want to assign</legend><div id="homeworkStudents" class="homework-topics"></div>';
    classField.after(recipients);
    $('homeworkPublish').textContent='Assign to selected students';
    $('homeworkYear').parentElement.lastChild.textContent=' · From the selected class.';
    $('homeworkClass').onchange=()=>{renderClassRecipients();updateTopics();};
  }
  $('closeFamilyHomework').onclick=()=>{if(!busy){modal.hidden=true;document.querySelector('[data-family-homework-open]')?.focus();}};
  modal.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&!busy){modal.hidden=true;document.querySelector('[data-family-homework-open]')?.focus();}
    if(event.key==='Tab'){const focusable=[...modal.querySelectorAll('button,input,select,textarea,a[href]')].filter(n=>!n.disabled);const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
  });
  for(const id of ['homeworkChild','homeworkSubject','homeworkMode']) $(id).onchange=updateTopics;
  $('familyHomeworkForm').onsubmit=publish;
}
async function refresh() {
  const {data:work,error}=await supabase.from('family_homework').select('id,student_id,teacher_id,class_id,title,subject,year_level,topic_ids,due_at,allow_late,submitted_at,score,questions').order('due_at');
  document.querySelectorAll('[data-family-homework-list]').forEach(host=>{
    if(error){host.textContent='Homework is not available yet. The site owner needs to run both the family-homework and teacher-homework SQL setup scripts.';return;}
    host.innerHTML=work.length?`<div class="task-list">${work.map(item=>{
      const child=children.find(c=>c.id===item.student_id),closed=!item.allow_late&&new Date(item.due_at)<new Date();
      const status=item.submitted_at?'Completed':closed?'Closed':new Date(item.due_at)<new Date()?'Overdue':'To do';
      const details=`${item.teacher_id?'Teacher · ':'Family · '}${item.subject} · ${yearLabel(item.year_level)} · ${item.topic_ids.length>1?'Mixed topics':'One topic'} · ${item.questions.length} questions`;
      return `<article class="task-card"><div><h3>${esc(item.title)}</h3><p>${child?esc(child.full_name)+' · ':''}${esc(details)}</p><p>Due ${esc(formatDate(item.due_at,true))} · <strong>${status}</strong>${item.submitted_at?' · '+item.score+'/'+item.questions.length:''}</p></div>${profile.role==='student'?`<a class="primary-link" href="family-homework.html?id=${item.id}">${item.submitted_at?'View result':'Open homework'}</a>`:''}</article>`;
    }).join('')}</div>`:'<p class="panel-subtitle">No family homework yet.</p>';
  });
}
async function init() {
  if(new URLSearchParams(location.search).has('demo')||!supabase)return;
  const {data,error}=await supabase.auth.getUser(); if(error||!data.user)return;
  profile=await getProfile(data.user.id);if(!['student','parent','teacher'].includes(profile.role)||profile.status!=='active')return;
  if(isTeacher()){
    const classes=await supabase.from('classes').select('id,name,year_level').eq('teacher_id',data.user.id).is('archived_at',null);if(classes.error)throw classes.error;
    classList=classes.data;
    if(classList.length){
      const members=await supabase.from('class_members').select('class_id,student_id').in('class_id',classList.map(c=>c.id));if(members.error)throw members.error;classMembers=members.data;
      const ids=[...new Set(classMembers.map(m=>m.student_id))];
      if(ids.length){const people=await supabase.from('profiles').select('id,full_name,year_level').in('id',ids).eq('role','student').eq('status','active');if(people.error)throw people.error;children=people.data;}
    }
    setupModal();
  }
  if(profile.role==='parent'){
    const links=await supabase.from('guardian_links').select('student_id').eq('parent_id',data.user.id).eq('status','approved');if(links.error)throw links.error;
    const ids=links.data.map(l=>l.student_id);
    if(ids.length){const result=await supabase.from('profiles').select('id,full_name,year_level').in('id',ids).eq('role','student').eq('status','active');if(result.error)throw result.error;children=result.data;}
    setupModal();
  }
  for(const section of ['overviewSection','workSection']){
    const panel=document.createElement('article');panel.className='panel family-homework-panel';
    panel.innerHTML=`<div class="panel-heading"><div><h2>${isTeacher()?'Class topic homework':profile.role==='parent'?'Family and class homework':'Homework from your family and teachers'}</h2><p class="panel-subtitle">${isTeacher()?'Assign one topic or a mix, then see each student’s result.':profile.role==='parent'?'Assign year-level topics and follow completion.':'Complete the work your guardian or teacher assigned.'}</p></div>${profile.role!=='student'?'<button class="primary-button" data-family-homework-open type="button">＋ Assign homework</button>':''}</div><div data-family-homework-list>Loading homework…</div>`;
    $(section).prepend(panel);
    panel.querySelector('[data-family-homework-open]')?.addEventListener('click',()=>{openForm();$('closeFamilyHomework').focus();});
  }
  await refresh();
}
init().catch(error=>{console.error('Family homework:',error.message);});

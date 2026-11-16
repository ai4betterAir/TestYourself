import {supabase,getProfile,friendlyError} from './supabase-client.js?v=profile-setup-fix';
import {ensureTeacherGroups} from './teacher-groups-api.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let profile,groups=[];
const groupOptions=()=>groups.map(g=>`<option value="${g.id}">${esc(g.name)} · ${esc(g.group_type||'class')}</option>`).join('');
const refreshPeople=()=>location.assign('dashboard.html?section=people');
function openPeople(){document.getElementById('peopleNav').click();document.querySelector('[data-connections-people]')?.scrollIntoView({block:'start',behavior:'smooth'});}
async function checked(promise){const result=await promise;if(result.error)throw result.error;return result.data||[];}
function panels(teacher){
  for(const section of ['overviewSection','peopleSection']){
    const panel=document.createElement('article');panel.className='panel family-homework-panel';panel.dataset.connectionsPanel=section;
    if(section==='peopleSection')panel.dataset.connectionsPeople='true';
    panel.innerHTML=teacher
      ? `<div class="panel-heading"><div><h2>${section==='overviewSection'?'Student connection requests':'Students and learning groups'}</h2><p class="panel-subtitle">Accept student requests and organise your learners into classes, batches or subject groups.</p></div>${section==='overviewSection'?'<button type="button" class="secondary-button" data-view-students>Manage students</button>':''}</div><div data-teacher-request-list>Loading requests…</div>${section==='peopleSection'?'<h3>Your students</h3><p class="panel-subtitle">Add keeps existing groups. Move removes enrolment from the selected source group.</p><div data-teacher-roster>Loading students…</div>':''}`
      : '<div class="panel-heading"><div><h2>Teacher connections</h2><p class="panel-subtitle">Ask a registered teacher to connect and add you to a learning group.</p></div><button type="button" class="primary-button" data-invite-teacher>Invite a teacher</button></div><div data-student-teacher-list>Loading connections…</div>';
    document.getElementById(section).prepend(panel);
    panel.querySelector('[data-view-students]')?.addEventListener('click',openPeople);
    panel.querySelector('[data-invite-teacher]')?.addEventListener('click',()=>{document.getElementById('teacherInviteModal').hidden=false;document.getElementById('teacherEmail').focus();});
  }
}
function inviteModal(){
  const modal=document.createElement('div');modal.id='teacherInviteModal';modal.className='modal';modal.hidden=true;
  modal.innerHTML='<section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="teacherInviteTitle"><div class="modal-heading"><h2 id="teacherInviteTitle">Invite a teacher</h2><button type="button" class="modal-close" id="closeTeacherInvite" aria-label="Close teacher invitation">×</button></div><p>Enter the email your teacher uses to sign in. The request appears in their dashboard. They must already have a teacher account; no email is sent.</p><form id="teacherInviteForm" class="dashboard-form"><label>Teacher email<input id="teacherEmail" type="email" required maxlength="254" autocomplete="off"></label><label>Message (optional)<textarea id="teacherInviteMessage" maxlength="300" rows="3" placeholder="Please add me to your Year 4 maths group."></textarea></label><button id="sendTeacherInvite" type="submit" class="primary-button">Send connection request</button><p id="teacherInviteStatus" class="form-message" role="status" aria-live="polite"></p></form></section>';
  document.body.append(modal);
  const close=()=>{if(!document.getElementById('sendTeacherInvite').disabled){modal.hidden=true;document.querySelector('[data-invite-teacher]')?.focus();}};
  document.getElementById('closeTeacherInvite').onclick=close;
  modal.onkeydown=event=>{if(event.key==='Escape')close();if(event.key==='Tab'){const nodes=[...modal.querySelectorAll('button,input,textarea')].filter(n=>!n.disabled),first=nodes[0],last=nodes.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}};
  document.getElementById('teacherInviteForm').onsubmit=async event=>{
    event.preventDefault();const button=document.getElementById('sendTeacherInvite'),out=document.getElementById('teacherInviteStatus');if(button.disabled)return;
    button.disabled=true;out.classList.remove('success');out.textContent='Sending request…';
    try{const status=await checked(supabase.rpc('request_teacher_connection',{teacher_email_input:document.getElementById('teacherEmail').value.trim(),message_input:document.getElementById('teacherInviteMessage').value.trim()}));out.classList.add('success');out.textContent=status==='accepted'?'You are already connected to this teacher.':'Request sent. Your teacher can accept it from their dashboard.';await studentConnections();}
    catch(error){out.textContent=friendlyError(error);}finally{button.disabled=false;}
  };
}
async function studentConnections(){
  const data=await checked(supabase.rpc('list_my_teacher_connections'));
  document.querySelectorAll('[data-student-teacher-list]').forEach(host=>{
    host.innerHTML=data.length?'<div class="task-list">'+data.map(row=>`<article class="task-card"><div><h3>${esc(row.teacher_name)}</h3><p>${esc(row.teacher_email)}</p><p><strong>${esc(row.status==='accepted'?'Connected':row.status==='pending'?'Waiting for teacher':'Declined')}</strong>${row.group_names?.length?' · '+row.group_names.map(esc).join(', '):row.status==='accepted'?' · Your teacher can place you in a group.':''}</p></div></article>`).join('')+'</div>':'<p class="panel-subtitle">No teacher connections yet. Invite a teacher or join using their class code.</p>';
  });
}
async function teacherConnections(){
  const [requests,roster]=await Promise.all([checked(supabase.rpc('list_teacher_connection_requests')),checked(supabase.rpc('list_teacher_students'))]);
  document.querySelectorAll('[data-teacher-request-list]').forEach(host=>{
    host.innerHTML=requests.length?'<div class="task-list">'+requests.map(row=>`<article class="connection-request" data-connection-request="${row.request_id}"><div><b>${esc(row.full_name)}</b><p>${esc(row.email)} · ${esc(row.skillup_id)} · ${row.year_level==='K'?'Kindergarten':'Year '+esc(row.year_level||'not set')}</p>${row.message?`<p>${esc(row.message)}</p>`:''}<label>Place in a group<select data-request-group><option value="">Accept to student list · choose group later</option>${groupOptions()}</select></label><div class="homework-actions"><button type="button" class="primary-button" data-accept-request>Accept student</button><button type="button" class="secondary-button" data-decline-request>Decline</button></div><p data-request-status role="status"></p></div></article>`).join('')+'</div>':'<p class="panel-subtitle">No pending student requests. Students can invite you using your teacher email.</p>';
    host.querySelectorAll('[data-accept-request],[data-decline-request]').forEach(button=>button.onclick=async()=>{
      const card=button.closest('[data-connection-request]'),out=card.querySelector('[data-request-status]');card.querySelectorAll('button').forEach(b=>b.disabled=true);out.textContent='Saving…';
      try{await checked(supabase.rpc('respond_teacher_connection',{request_input:card.dataset.connectionRequest,accept_input:button.hasAttribute('data-accept-request'),class_input:card.querySelector('[data-request-group]').value||null}));out.textContent='Saved. Refreshing your students…';refreshPeople();}
      catch(error){out.textContent=friendlyError(error);card.querySelectorAll('button').forEach(b=>b.disabled=false);}
    });
  });
  const host=document.querySelector('[data-teacher-roster]');
  host.innerHTML=roster.length?'<div class="task-list">'+roster.map(row=>`<article class="task-card" data-roster-student="${row.student_id}"><div style="width:100%"><h3>${esc(row.full_name)}</h3><p>${esc(row.email)} · ${esc(row.skillup_id)}</p><p>Groups: ${row.groups.length?row.groups.map(g=>esc(g.name)).join(', '):'Not placed yet'}</p><div class="form-row"><label>Destination group<select data-placement-destination><option value="">Choose a group</option>${groupOptions()}</select></label><label>Placement<select data-placement-source><option value="">Add · keep existing groups</option>${row.groups.map(g=>`<option value="${g.id}">Move from ${esc(g.name)}</option>`).join('')}</select></label></div><button type="button" class="secondary-button" data-save-placement>Save placement</button><p data-placement-status role="status"></p></div></article>`).join('')+'</div>':'<p class="panel-subtitle">No connected students yet. Add a registered student by email or ID, or accept an incoming request.</p>';
  host.querySelectorAll('[data-save-placement]').forEach(button=>button.onclick=async()=>{
    const card=button.closest('[data-roster-student]'),out=card.querySelector('[data-placement-status]'),destination=card.querySelector('[data-placement-destination]').value;
    if(!destination)return out.textContent='Choose a destination group.';
    button.disabled=true;out.textContent='Saving placement…';
    try{await checked(supabase.rpc('place_teacher_student',{student_input:card.dataset.rosterStudent,destination_input:destination,source_input:card.querySelector('[data-placement-source]').value||null}));out.textContent='Placement saved.';refreshPeople();}
    catch(error){out.textContent=friendlyError(error);button.disabled=false;}
  });
}
async function init(){
  if(!supabase||new URLSearchParams(location.search).has('demo'))return;
  const auth=await supabase.auth.getUser();if(auth.error||!auth.data.user)return;
  profile=await getProfile(auth.data.user.id);if(!['teacher','student'].includes(profile.role)||profile.status!=='active')return;
  panels(profile.role==='teacher');
  try{
    if(profile.role==='teacher'){
      await ensureTeacherGroups(supabase);
      groups=await checked(supabase.from('classes').select('id,name,year_level,group_type,programme').eq('teacher_id',auth.data.user.id).is('archived_at',null).order('created_at'));
      await teacherConnections();
    }else{inviteModal();await studentConnections();}
  }catch(error){document.querySelectorAll('[data-teacher-request-list],[data-teacher-roster],[data-student-teacher-list]').forEach(host=>host.textContent='Connections setup is incomplete. The site owner needs to run the teacher-groups-and-requests SQL script in Supabase.');console.error('Teacher connections:',error.message);}
}
init().catch(error=>console.error('Teacher connections:',error.message));

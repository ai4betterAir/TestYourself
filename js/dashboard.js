import { supabase, isSupabaseConfigured, showSetupNotice, requireUser, getProfile, formatDate, friendlyError } from './supabase-client.js?v=20260921';

const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
let user, profile, classes = [], classMembers = [], assignments = [], submissions = [], children = [];
const requestedDemo = new URLSearchParams(location.search).get('demo');
const demoRole = ['student','teacher','parent'].includes(requestedDemo) ? requestedDemo : null;

if (demoRole || !isSupabaseConfigured) {
  renderDemo(demoRole || 'student');
} else {
  init().catch(showFatal);
}

function renderDemo(role) {
  document.body.dataset.dashboardRole = role;
  const now = Date.now(), iso = offset => new Date(now + offset * 864e5).toISOString();
  user = {id: role === 'student' ? 'demo-student' : 'demo-user'};
  profile = {id:user.id,full_name:role === 'teacher' ? 'Ms Taylor' : role === 'parent' ? 'Jordan’s family' : 'Jordan Lee',role,status:'active',year_level:'4',skillup_id:role==='student'?'SU-48291735':null,created_at:iso(-60)};
  classes = [{id:'class-4b',teacher_id:'demo-user',name:'4B Maths',subject:'Maths',year_level:'4',join_code:'UP4B26'},{id:'class-eng',teacher_id:'demo-user',name:'Year 4 English',subject:'English',year_level:'4',join_code:'READ42'}];
  classMembers = [
    {class_id:'class-4b',student_id:'demo-student'},{class_id:'class-4b',student_id:'student-2'},{class_id:'class-4b',student_id:'student-3'},
    {class_id:'class-4b',student_id:'student-4'},{class_id:'class-eng',student_id:'demo-student'},{class_id:'class-eng',student_id:'student-5'}
  ];
  assignments = [
    {id:'fractions-review',teacher_id:'demo-user',class_id:'class-4b',title:'Fractions review',subject:'Maths',resource_url:'practice.html?grade=4',opens_at:iso(-2),due_at:iso(1),allow_late:true,status:'published'},
    {id:'reading-main-idea',teacher_id:'demo-user',class_id:'class-eng',title:'Finding the main idea',subject:'English',resource_url:'english-practice.html?grade=4&skill=reading',opens_at:iso(-1),due_at:iso(4),allow_late:false,status:'published'},
    {id:'vocabulary-context',teacher_id:'demo-user',class_id:'class-eng',title:'Vocabulary in context',subject:'Vocabulary',resource_url:'vocabulary-year4.html',opens_at:iso(-8),due_at:iso(-3),allow_late:true,status:'published'}
  ];
  submissions = role === 'teacher' ? [
    {assignment_id:'fractions-review',student_id:'demo-student',status:'submitted',submitted_at:iso(-.2),score:17,max_score:20},
    {assignment_id:'fractions-review',student_id:'student-2',status:'submitted',submitted_at:iso(-.1),score:14,max_score:20},
    {assignment_id:'fractions-review',student_id:'student-3',status:'graded',submitted_at:iso(-1),score:19,max_score:20},
    {assignment_id:'vocabulary-context',student_id:'student-4',status:'submitted',submitted_at:iso(-3),score:5,max_score:6},
    {assignment_id:'vocabulary-context',student_id:'student-5',status:'submitted',submitted_at:iso(-4),score:4,max_score:6}
  ] : [
    {assignment_id:'vocabulary-context',student_id:'demo-student',status:'graded',submitted_at:iso(-4),score:5,max_score:6},
    {assignment_id:'reading-main-idea',student_id:'demo-student',status:'submitted',submitted_at:iso(-.4),score:4,max_score:6}
  ];
  children = role === 'parent' ? [{id:'demo-student',full_name:'Jordan Lee',year_level:'4'}] : [];
  $('userName').textContent = profile.full_name;
  $('userRole').textContent = role === 'parent' ? 'Parent / guardian preview' : `${role} preview`;
  $('profileName').value = profile.full_name;
  $('profileYear').value = '4';
  $('profileYearField').hidden = role !== 'student';
  renderStudentIdentity();
  configureRole();
  render();
  ['mainAction','workAction','peopleAction'].forEach(id => {
    $(id).hidden = true;
    $(id).style.display = 'none';
  });
  $('setupNotice').hidden = true;
  $('statusBanner').hidden = false;
  $('statusBanner').className = 'status-banner preview';
  $('statusBanner').innerHTML = `<span><strong>Preview mode</strong> — realistic sample information, with no account or personal data.</span><span class="preview-switch"><a class="${role==='student'?'active':''}" href="dashboard.html?demo=student">Student</a><a class="${role==='teacher'?'active':''}" href="dashboard.html?demo=teacher">Teacher</a><a class="${role==='parent'?'active':''}" href="dashboard.html?demo=parent">Parent</a></span>`;
  document.querySelectorAll('.quick-action[type="button"], .quick-action:not(a)').forEach(button => { button.disabled = true; });
  document.querySelectorAll('#profileForm input,#profileForm select,#profileForm button').forEach(control => { control.disabled = true; });
  $('profileMessage').textContent = 'Profile editing is disabled in preview mode.';
  $('signOut').textContent = 'Exit preview';
  bindDemoEvents();
}

function bindDemoEvents() {
  document.querySelectorAll('.dashboard-nav button').forEach(button => button.addEventListener('click',()=>showSection(button.dataset.section, button.textContent)));
  $('mobileNav').onclick=()=> $('sidebar').classList.toggle('open');
  $('signOut').onclick=()=>location.href='accounts.html';
}

async function init() {
  user = await requireUser();
  if (!user) return;
  profile = await getProfile(user.id);
  document.body.dataset.dashboardRole = profile.role || 'student';
  $('userName').textContent = profile.full_name;
  $('userRole').textContent = profile.role === 'parent' ? 'Parent / guardian' : profile.role;
  $('profileName').value = profile.full_name || '';
  $('profileYear').value = profile.year_level || '1';
  $('profileYearField').hidden = profile.role !== 'student';
  renderStudentIdentity();
  if (profile.role === 'teacher' && profile.status !== 'active') {
    $('statusBanner').className = 'status-banner pending';
    $('statusBanner').hidden = false;
    $('statusBanner').textContent = 'Your email is verified. Teacher tools will unlock after SkillUP approves the account.';
  }
  await loadRoleData();
  configureRole(); render(); bindEvents();
}

async function loadRoleData() {
  if (profile.role === 'teacher') {
    ({ data: classes = [] } = await supabase.from('classes').select('*').eq('teacher_id', user.id).order('created_at'));
    const classIds = classes.map(item => item.id);
    if (classIds.length) ({ data: classMembers = [] } = await supabase.from('class_members').select('class_id,student_id,joined_at').in('class_id', classIds));
    ({ data: assignments = [] } = await supabase.from('assignments').select('*').eq('teacher_id', user.id).order('due_at', { ascending: false }));
    if (assignments.length) ({ data: submissions = [] } = await supabase.from('submissions').select('*').in('assignment_id', assignments.map(item => item.id)));
  } else if (profile.role === 'student') {
    localStorage.setItem('tyProfile', JSON.stringify({
      studentName: profile.full_name,
      grade: profile.year_level || '1',
      guest: false,
      cloudAccount: true,
      createdAt: profile.created_at
    }));
    ({ data: classMembers = [] } = await supabase.from('class_members').select('class_id,student_id,joined_at').eq('student_id', user.id));
    const classIds = classMembers.map(item => item.class_id);
    if (classIds.length) ({ data: classes = [] } = await supabase.from('classes').select('*').in('id', classIds));
    ({ data: assignments = [] } = await supabase.from('assignments').select('*').order('due_at', { ascending: true }));
    ({ data: submissions = [] } = await supabase.from('submissions').select('*').eq('student_id', user.id));
  } else if (profile.role === 'parent') {
    const { data: links = [] } = await supabase.from('guardian_links').select('student_id').eq('parent_id', user.id).eq('status', 'approved');
    const ids = links.map(item => item.student_id);
    if (ids.length) {
      ({ data: children = [] } = await supabase.from('profiles').select('id,full_name,year_level').in('id', ids));
      ({ data: assignments = [] } = await supabase.from('assignments').select('*').order('due_at', { ascending: true }));
      ({ data: submissions = [] } = await supabase.from('submissions').select('*').in('student_id', ids));
    }
  }
}

function configureRole() {
  const teacher = profile.role === 'teacher', student = profile.role === 'student';
  $('workNav').textContent = teacher ? 'Assignments' : 'My work';
  $('peopleNav').textContent = teacher ? 'Classes & students' : student ? 'My classes' : 'My children';
  $('mainAction').hidden = !teacher || profile.status !== 'active';
  $('mainAction').textContent = '＋ Create assignment';
  $('mainAction').dataset.open = 'assignmentModal';
  $('workAction').hidden = !teacher || profile.status !== 'active';
  $('workAction').textContent = '＋ Create assignment';
  $('workAction').dataset.open = 'assignmentModal';
  $('peopleAction').hidden = false;
  $('peopleAction').textContent = teacher ? '＋ Create class' : student ? 'Join a class' : 'Link a child';
  $('peopleAction').dataset.open = teacher ? 'classModal' : student ? 'joinModal' : 'familyModal';
  $('addStudentAction').hidden = !teacher || profile.status !== 'active';
  $('addStudentAction').textContent = '＋ Add student';
  $('addStudentAction').dataset.open = 'addStudentModal';
  $('workTitle').textContent = teacher ? 'Assignments' : 'My work';
  $('peopleTitle').textContent = teacher ? 'Classes and students' : student ? 'My classes' : 'My children';
  $('peopleSubtitle').textContent = teacher ? 'Manage class codes and enrolments' : student ? 'Classes you have joined' : 'Read-only progress for linked children';
}

function render() {
  if (profile.role === 'teacher') renderTeacher();
  else if (profile.role === 'student') renderStudent();
  else renderParent();
  renderWork(); renderPeople(); renderProgress();
}

function assignmentState(item, submission) {
  if (submission?.status === 'graded') return 'graded';
  if (submission?.submitted_at) return 'submitted';
  const now = Date.now(), opens = item.opens_at ? new Date(item.opens_at).getTime() : 0, due = item.due_at ? new Date(item.due_at).getTime() : Infinity;
  if (opens > now) return 'scheduled';
  if (due < now) return 'overdue';
  return 'open';
}

function metrics(items) { $('metricGrid').innerHTML = items.map(item => `<article class="metric"><span>${esc(item.label)}</span><strong>${esc(item.value)}</strong><small>${esc(item.note || '')}</small></article>`).join(''); }

function renderTeacher() {
  const studentIds = new Set(classMembers.map(item => item.student_id));
  const dueSoon = assignments.filter(item => item.due_at && new Date(item.due_at) > new Date() && new Date(item.due_at) < new Date(Date.now() + 7*864e5)).length;
  const submitted = submissions.filter(item => item.submitted_at).length;
  metrics([{label:'Active classes',value:classes.length,note:'Across SkillUP'},{label:'Students',value:studentIds.size,note:'Unique learners'},{label:'Due this week',value:dueSoon,note:'Published work'},{label:'Submissions',value:submitted,note:'Ready to review'}]);
  $('primaryPanelTitle').textContent = 'Assignment activity';
  $('primaryPanel').innerHTML = assignmentTable(assignments.slice(0,6), true);
  $('progressPanel').innerHTML = scoreSummary(submissions);
  $('quickActions').innerHTML = `<button class="quick-action" data-open="assignmentModal"><strong>Create an assignment</strong><span>Choose content, students and a due date</span></button><button class="quick-action" data-open="addStudentModal"><strong>Add student by SkillUP ID</strong><span>Enter a student’s permanent ID and choose a class</span></button><button class="quick-action" data-open="classModal"><strong>Create a class</strong><span>Generate a private student join code</span></button>`;
  $('insightPanel').innerHTML = submitted ? `<strong>${submitted} submitted attempt${submitted === 1 ? '' : 's'}</strong>Open Assignments to see who has finished and who may need a reminder.` : '<strong>No submissions yet</strong>Publish an assignment to start building class insights.';
}

function renderStudent() {
  const byAssignment = new Map(submissions.map(item => [item.assignment_id, item]));
  const open = assignments.filter(item => ['open','overdue'].includes(assignmentState(item, byAssignment.get(item.id))));
  const complete = submissions.filter(item => item.submitted_at);
  const scored = complete.filter(item => item.max_score);
  const average = scored.length ? Math.round(scored.reduce((sum,item) => sum + Number(item.score)/Number(item.max_score)*100,0)/scored.length) : 0;
  metrics([{label:'To do',value:open.length,note:'Current assignments'},{label:'Due soon',value:open.filter(item => item.due_at && new Date(item.due_at) < new Date(Date.now()+2*864e5)).length,note:'Next 48 hours'},{label:'Completed',value:complete.length,note:'Submitted work'},{label:'Average',value:scored.length ? `${average}%` : '—',note:'Scored submissions'}]);
  $('primaryPanelTitle').textContent = 'What to do next';
  $('primaryPanel').innerHTML = taskCards(open.slice(0,5), byAssignment);
  $('progressPanel').innerHTML = scoreSummary(submissions);
  $('quickActions').innerHTML = `<a class="quick-action" href="index.html"><strong>Practise independently</strong><span>Explore the SkillUP learning library</span></a><button class="quick-action" data-open="joinModal"><strong>Join a class</strong><span>Use the code from your teacher</span></button><button class="quick-action" data-open="familyModal"><strong>Parent connections</strong><span>Share your SkillUP ID and approve parent requests</span></button>`;
  $('insightPanel').innerHTML = scored.length ? `<strong>${average}% recent accuracy</strong>${average >= 80 ? 'Strong work. Keep practising the skills behind any missed questions.' : 'Review feedback and try a short practice set before the next assignment.'}` : '<strong>Your first result will appear here</strong>Complete an assigned test to build a useful progress picture.';
}

function renderParent() {
  const childIds = new Set(children.map(item => item.id));
  const childSubs = submissions.filter(item => childIds.has(item.student_id));
  const scored = childSubs.filter(item => item.max_score);
  const avg = scored.length ? Math.round(scored.reduce((s,x)=>s+Number(x.score)/Number(x.max_score)*100,0)/scored.length) : 0;
  const overdue = assignments.filter(item => assignmentState(item, childSubs.find(s => s.assignment_id === item.id)) === 'overdue').length;
  metrics([{label:'Linked children',value:children.length,note:'Family connections'},{label:'Upcoming',value:assignments.filter(item => new Date(item.due_at)>new Date()).length,note:'Assigned work'},{label:'Overdue',value:overdue,note:'May need attention'},{label:'Average',value:scored.length?`${avg}%`:'—',note:'Scored work'}]);
  $('primaryPanelTitle').textContent = 'Family learning overview';
  $('primaryPanel').innerHTML = children.length ? taskCards(assignments.slice(0,6), new Map(childSubs.map(x=>[x.assignment_id,x])), true) : empty('No child linked yet','Use a private family code from your child’s dashboard.');
  $('progressPanel').innerHTML = scoreSummary(childSubs);
  $('quickActions').innerHTML = `<button class="quick-action" data-open="familyModal"><strong>Link a child by SkillUP ID</strong><span>Enter the permanent ID shown in your child’s dashboard</span></button><a class="quick-action" href="parents.html"><strong>Parent guide</strong><span>Help with learning without adding pressure</span></a>`;
  $('insightPanel').innerHTML = children.length ? `<strong>${children.length === 1 ? esc(children[0].full_name) : 'Family summary'}</strong>Focus first on overdue work, then celebrate consistent completion and effort.` : '<strong>Connect securely</strong>A family code links only the child who generated it and expires automatically.';
}

function assignmentTable(list, teacher = false) {
  if (!list.length) return empty('No assignments yet', teacher ? 'Create the first assignment for a class.' : 'New work from your teacher will appear here.');
  return `<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Assignment</th><th>Due</th><th>Status</th>${teacher?'<th>Submitted</th>':'<th>Score</th>'}</tr></thead><tbody>${list.map(item => { const related = submissions.filter(x=>x.assignment_id===item.id), own = related.find(x=>x.student_id===user.id); const state=assignmentState(item,own); return `<tr><td><div class="item-title">${esc(item.title)}</div><div class="item-sub">${esc(item.subject || 'SkillUP activity')}</div></td><td>${formatDate(item.due_at,true)}</td><td><span class="status-pill ${state}">${state}</span></td><td>${teacher?`${related.filter(x=>x.submitted_at).length} received`:(own?.max_score?`${own.score}/${own.max_score}`:'—')}</td></tr>`}).join('')}</tbody></table></div>`;
}

function taskCards(list, byAssignment, parentView = false) {
  if (!list.length) return empty('You are all caught up','There is no current work needing attention.');
  return `<div class="task-list">${list.map(item => { const sub=byAssignment.get(item.id), state=assignmentState(item,sub); const href=parentView?'#':`${item.resource_url}${item.resource_url.includes('?')?'&':'?'}assignment=${item.id}`; return `<article class="task-card"><div><h3>${esc(item.title)}</h3><p>${formatDate(item.due_at,true)} · <span class="status-pill ${state}">${state}</span></p></div>${parentView?'':`<a class="primary-link" href="${esc(href)}">${sub?.submitted_at?'Review':'Start'}</a>`}</article>`}).join('')}</div>`;
}

function scoreSummary(list) {
  const scored = list.filter(item => item.max_score).slice(-6).reverse();
  if (!scored.length) return empty('No scored work yet','Accuracy and progress will appear after a scored submission.');
  return `<div class="task-list">${scored.map(item=>{const pct=Math.round(Number(item.score)/Number(item.max_score)*100);return `<div><div class="panel-heading"><span class="item-title">${formatDate(item.submitted_at)}</span><strong>${pct}%</strong></div><div class="progress-bar"><span style="width:${pct}%"></span></div></div>`}).join('')}</div>`;
}

function renderWork() { $('workContent').innerHTML = assignmentTable(assignments, profile.role === 'teacher'); }

function renderPeople() {
  if (profile.role === 'teacher') {
    $('peopleContent').innerHTML = classes.length ? `<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Class</th><th>Year</th><th>Students</th><th>Join code</th></tr></thead><tbody>${classes.map(c=>`<tr><td class="item-title">${esc(c.name)}</td><td>Year ${esc(c.year_level)}</td><td>${classMembers.filter(m=>m.class_id===c.id).length}</td><td><strong>${esc(c.join_code)}</strong></td></tr>`).join('')}</tbody></table></div>` : empty('No classes yet','Create a class to receive a private student join code.');
  } else if (profile.role === 'student') {
    $('peopleContent').innerHTML = classes.length ? `<div class="task-list">${classes.map(c=>`<article class="task-card"><div><h3>${esc(c.name)}</h3><p>${esc(c.subject)} · Year ${esc(c.year_level)}</p></div><span class="status-pill active">Joined</span></article>`).join('')}</div>` : empty('You have not joined a class','Ask your teacher for a six-character class code.');
  } else {
    $('peopleContent').innerHTML = children.length ? `<div class="task-list">${children.map(c=>`<article class="task-card"><div><h3>${esc(c.full_name)}</h3><p>Year ${esc(c.year_level)}</p></div><span class="status-pill active">Linked</span></article>`).join('')}</div>` : empty('No child linked','Enter your child’s SkillUP ID to send a connection request.');
  }
}

function renderProgress() {
  const list = submissions.filter(item=>item.max_score), completed=submissions.filter(item=>item.submitted_at).length;
  const average=list.length?Math.round(list.reduce((s,x)=>s+Number(x.score)/Number(x.max_score)*100,0)/list.length):0;
  $('fullProgress').innerHTML = `<div class="metric-grid"><article class="metric"><span>Completed</span><strong>${completed}</strong><small>Submissions</small></article><article class="metric"><span>Average accuracy</span><strong>${list.length?`${average}%`:'—'}</strong><small>Scored work</small></article><article class="metric"><span>On-time rate</span><strong>${completed?'—':'—'}</strong><small>Available after due work</small></article><article class="metric"><span>Current focus</span><strong>${list.length?(average>=80?'Extend':'Review'):'Start'}</strong><small>Suggested next step</small></article></div>${scoreSummary(submissions)}`;
}

function empty(title,text){return `<div class="empty-state"><strong>${esc(title)}</strong>${esc(text)}</div>`}

function bindEvents() {
  document.querySelector('#assignmentModal .secondary-button').textContent = 'Cancel';
  document.querySelectorAll('.dashboard-nav button').forEach(button => button.addEventListener('click',()=>showSection(button.dataset.section, button.textContent)));
  document.addEventListener('click', event => {
    const opener=event.target.closest('[data-open]'); if(opener) openModal(opener.dataset.open);
    const closer=event.target.closest('[data-close]'); if(closer) closeModal(closer.dataset.close);
  });
  $('mobileNav').onclick=()=> $('sidebar').classList.toggle('open');
  $('signOut').onclick=async()=>{await supabase.auth.signOut();location.replace('sign-in.html')};
  $('profileForm').addEventListener('submit', saveProfile);
  $('classForm').addEventListener('submit', createClass);
  $('assignmentForm').addEventListener('submit', createAssignment);
  $('assignmentClass').addEventListener('change', renderRecipients);
  $('recipientMode').addEventListener('change', renderRecipients);
  $('joinForm').addEventListener('submit', joinClass);
  $('addStudentForm').addEventListener('submit', addStudentBySkillupId);
  $('copySkillupId').addEventListener('click', copyStudentSkillupId);
}

function showSection(name,title){document.querySelectorAll('.dashboard-section').forEach(x=>x.classList.toggle('active',x.id===`${name}Section`));document.querySelectorAll('.dashboard-nav button').forEach(x=>x.classList.toggle('active',x.dataset.section===name));$('pageTitle').textContent=title;$('sidebar').classList.remove('open')}
function openModal(id){$(id).hidden=false;if(id==='assignmentModal')prepareAssignment();if(id==='addStudentModal')prepareAddStudent();if(id==='familyModal')renderFamilyModal()}
function closeModal(id){$(id).hidden=true}

function renderStudentIdentity(){
  const card=$('studentIdentityCard');
  if(!card)return;
  const isStudent=profile?.role==='student';
  card.hidden=!isStudent;
  if(!isStudent)return;
  $('studentSkillupId').textContent=profile.skillup_id || 'ID pending';
}

async function copyStudentSkillupId(){
  const value=profile?.skillup_id;
  if(!value)return;
  try{
    await navigator.clipboard.writeText(value);
    $('copySkillupId').textContent='Copied';
    setTimeout(()=>$('copySkillupId').textContent='Copy ID',1200);
  }catch{
    window.prompt('Copy your SkillUP ID:',value);
  }
}

function prepareAddStudent(){
  $('addStudentClass').innerHTML='<option value="">Choose a class</option>'+classes.map(c=>`<option value="${c.id}">${esc(c.name)} · Year ${esc(c.year_level)}</option>`).join('');
  $('addStudentSkillupId').value='';
  $('addStudentMessage').textContent='';
}

async function addStudentBySkillupId(event){
  event.preventDefault();
  const out=$('addStudentMessage');
  out.classList.remove('success');
  out.textContent='';
  const {error}=await supabase.rpc('add_student_to_class_by_skillup_id',{
    class_uuid:$('addStudentClass').value,
    skillup_id_input:$('addStudentSkillupId').value.trim().toUpperCase()
  });
  if(error)return out.textContent=friendlyError(error);
  out.classList.add('success');
  out.textContent='Student added to the class.';
  setTimeout(()=>location.reload(),650);
}

function prepareAssignment(){ $('assignmentClass').innerHTML='<option value="">Choose a class</option>'+classes.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');const due=new Date(Date.now()+7*864e5);due.setMinutes(due.getMinutes()-due.getTimezoneOffset());$('assignmentDue').value=due.toISOString().slice(0,16);renderRecipients() }

async function getStudentProfiles(ids){if(!ids.length)return[];const {data=[]}=await supabase.from('profiles').select('id,full_name,year_level').in('id',ids);return data}
async function renderRecipients(){const box=$('recipientList');if($('recipientMode').value!=='selected'||!$('assignmentClass').value){box.hidden=true;box.innerHTML='';return}const ids=classMembers.filter(x=>x.class_id===$('assignmentClass').value).map(x=>x.student_id),people=await getStudentProfiles(ids);box.hidden=false;box.innerHTML=people.length?people.map(x=>`<label><input type="checkbox" name="recipient" value="${x.id}"><span>${esc(x.full_name)}</span></label>`).join(''):empty('No students in this class','Share the class code first.')}

async function createClass(event){event.preventDefault();const out=$('classMessage');out.textContent='';const {error}=await supabase.from('classes').insert({teacher_id:user.id,name:$('className').value.trim(),subject:$('classSubject').value,year_level:$('classYear').value});if(error)return out.textContent=friendlyError(error);out.classList.add('success');out.textContent='Class created.';setTimeout(()=>location.reload(),500)}

async function createAssignment(event){event.preventDefault();const out=$('assignmentMessage');out.textContent='';const classId=$('assignmentClass').value;const cls=classes.find(x=>x.id===classId);const {data,error}=await supabase.from('assignments').insert({teacher_id:user.id,class_id:classId,title:$('assignmentTitle').value.trim(),instructions:$('assignmentInstructions').value.trim(),subject:cls?.subject||'SkillUP',resource_url:$('assignmentResource').value,opens_at:$('assignmentOpens').value?new Date($('assignmentOpens').value).toISOString():new Date().toISOString(),due_at:new Date($('assignmentDue').value).toISOString(),allow_late:$('allowLate').checked,status:'published'}).select().single();if(error)return out.textContent=friendlyError(error);if($('recipientMode').value==='selected'){const ids=[...document.querySelectorAll('input[name="recipient"]:checked')].map(x=>x.value);if(!ids.length){await supabase.from('assignments').delete().eq('id',data.id);return out.textContent='Choose at least one student.'}const {error:targetError}=await supabase.from('assignment_targets').insert(ids.map(student_id=>({assignment_id:data.id,student_id})));if(targetError)return out.textContent=friendlyError(targetError)}out.classList.add('success');out.textContent='Assignment published.';setTimeout(()=>location.reload(),600)}

async function joinClass(event){event.preventDefault();const out=$('joinMessage');const {error}=await supabase.rpc('join_class_by_code',{code_input:$('joinCode').value.trim().toUpperCase()});if(error)return out.textContent=friendlyError(error);out.classList.add('success');out.textContent='Class joined.';setTimeout(()=>location.reload(),500)}

async function renderFamilyModal(){
  const box=$('familyContent');
  if(profile.role==='student'){
    const id=profile.skillup_id || 'ID pending';
    const {data:requests=[],error}=await supabase.rpc('list_pending_guardian_requests');
    box.innerHTML=`
      <div class="skillup-share-card">
        <span>YOUR PERMANENT SKILLUP ID</span>
        <strong>${esc(id)}</strong>
        <p>Share this with a teacher or parent only when you want them to connect to your account.</p>
        <button class="secondary-button" id="copyFamilySkillupId" type="button">Copy SkillUP ID</button>
      </div>
      <div class="connection-requests">
        <h3>Parent connection requests</h3>
        ${error?'<p class="form-message">'+esc(friendlyError(error))+'</p>':requests.length?requests.map(r=>`<article class="connection-request"><div><b>${esc(r.full_name||'Parent account')}</b><span>Wants to connect to your learning progress</span></div><div><button class="secondary-button approve-parent" data-parent="${r.parent_id}" type="button">Approve</button><button class="danger-button decline-parent" data-parent="${r.parent_id}" type="button">Decline</button></div></article>`).join(''):'<p class="panel-subtitle">No pending requests.</p>'}
      </div>`;
    const copy=$('copyFamilySkillupId');
    if(copy)copy.onclick=copyStudentSkillupId;
    box.querySelectorAll('.approve-parent,.decline-parent').forEach(button=>{
      button.onclick=async()=>{
        button.disabled=true;
        const {error:respondError}=await supabase.rpc('respond_guardian_link',{
          parent_uuid_input:button.dataset.parent,
          approve_input:button.classList.contains('approve-parent')
        });
        if(respondError){button.disabled=false;return alert(friendlyError(respondError));}
        renderFamilyModal();
      };
    });
  }else if(profile.role==='parent'){
    box.innerHTML=`
      <form id="claimFamilyForm" class="dashboard-form">
        <div class="skillup-id-help"><span>SKILLUP ID</span><strong>Ask your child for the ID shown on their dashboard.</strong><p>Example: SU-48291735. Your child must approve the connection before you can see their progress.</p></div>
        <label>Child’s SkillUP ID<input id="familySkillupId" required maxlength="11" autocomplete="off" style="text-transform:uppercase" placeholder="SU-48291735"></label>
        <button class="primary-button" type="submit">Send connection request</button>
        <p id="familyMessage" class="form-message"></p>
      </form>`;
    $('claimFamilyForm').onsubmit=async event=>{
      event.preventDefault();
      const out=$('familyMessage');
      out.classList.remove('success');
      const {error}=await supabase.rpc('request_guardian_link_by_skillup_id',{
        skillup_id_input:$('familySkillupId').value.trim().toUpperCase()
      });
      out.textContent=error?friendlyError(error):'Request sent. Your child needs to approve it from their dashboard.';
      out.classList.toggle('success',!error);
    };
  }else{
    box.innerHTML='<p>Family connections are available from student and parent accounts.</p>';
  }
}

async function saveProfile(event){event.preventDefault();const updates={full_name:$('profileName').value.trim(),updated_at:new Date().toISOString()};if(profile.role==='student')updates.year_level=$('profileYear').value;const {error}=await supabase.from('profiles').update(updates).eq('id',user.id);$('profileMessage').textContent=error?friendlyError(error):'Profile updated.';$('profileMessage').classList.toggle('success',!error)}
function showFatal(error){$('setupNotice').hidden=false;$('setupNotice').textContent=friendlyError(error)}

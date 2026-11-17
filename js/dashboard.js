import { ensureTeacherGroups } from './teacher-groups-api.js';
import { supabase, isSupabaseConfigured, showSetupNotice, requireUser, getProfile, formatDate, friendlyError } from './supabase-client.js?v=20260921';

const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
let user, profile, classes = [], classMembers = [], assignments = [], submissions = [], children = [], leaderboardRows = [];
let assignmentBoardRows=null;
document.addEventListener('assignment-board-data',event=>{if(event.detail?.complete){assignmentBoardRows=event.detail.rows;applyAssignmentBoardSummary();}});
const requestedDemo = new URLSearchParams(location.search).get('demo');
const demoRole = ['student','teacher','parent'].includes(requestedDemo) ? requestedDemo : null;
const LOCAL_ACCOUNTS = 'skillupLocalAccounts';
const LOCAL_SESSION = 'skillupLocalSession';
const LOCAL_LINKS = 'skillupLocalGuardianLinks';
const readLocal = (key, fallback = []) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
const writeLocal = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const normalizeSkillupId = value => { const raw = String(value || '').trim().toUpperCase(); return /^\\d{8}$/.test(raw) ? `SU-${raw}` : raw; };

if (demoRole || !isSupabaseConfigured) {
  renderDemo(demoRole || 'student');
} else {
  init().catch(showFatal);
}

function renderDemo(role) {
  document.body.dataset.dashboardRole = role;
  const now = Date.now(), iso = offset => new Date(now + offset * 864e5).toISOString();
  let localSession = null;
  try { if (!demoRole) localSession = JSON.parse(localStorage.getItem('skillupLocalSession') || 'null'); } catch {}
  const previewRole = localSession?.role || role;
  user = {id: previewRole === 'student' ? 'demo-student' : 'demo-user'};
  const localAccounts = readLocal(LOCAL_ACCOUNTS);
  const localAccount = localAccounts.find(item => item.email === localSession?.email);
  profile = {id:user.id,full_name:localSession?.fullName || (previewRole === 'teacher' ? 'Ms Taylor' : previewRole === 'parent' ? 'Jordan’s family' : 'Jordan Lee'),role:previewRole,status:'active',year_level:localSession?.yearLevel || '4',skillup_id:localSession?.skillupId || localAccount?.skillupId || (previewRole==='student'?'SU-48291735':null),email:localSession?.email || localAccount?.email || null,created_at:iso(-60)};
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
  if (previewRole === 'student') {
    const scored = submissions.filter(item => item.student_id === 'demo-student' && item.max_score);
    const answered = scored.reduce((sum, item) => sum + Number(item.max_score || 0), 0);
    const marks = scored.reduce((sum, item) => sum + Number(item.score || 0), 0);
    const mark = answered ? Math.round(marks / answered * 100) : 0;
    leaderboardRows = [
      {student_id:'student-2',display_name:'Aisha K.',average_percent:94,completed_tests:8,total_points:752,badge_level:'Platinum',rank_position:1},
      {student_id:'demo-student',display_name:profile.full_name,average_percent:mark || 85,completed_tests:scored.length || 2,total_points:marks || 17,badge_level:(mark || 85)>=90?'Platinum':(mark || 85)>=80?'Gold':'Silver',rank_position:2},
      {student_id:'student-3',display_name:'Noah R.',average_percent:81,completed_tests:6,total_points:486,badge_level:'Gold',rank_position:3},
      {student_id:'student-4',display_name:'Mia T.',average_percent:76,completed_tests:5,total_points:380,badge_level:'Silver',rank_position:4}
    ];
  } else if (previewRole === 'parent') {
    const links = readLocal(LOCAL_LINKS);
    const approved = links.filter(link => link.parentEmail === profile.email && link.status === 'approved');
    children = approved.map(link => { const child = localAccounts.find(item => item.email === link.studentEmail); return child ? {id:child.email,full_name:child.fullName,year_level:child.yearLevel || '4',skillup_id:child.skillupId} : null; }).filter(Boolean);
    if (!localSession) children = [{id:'demo-student',full_name:'Alex',year_level:'4'}];
  } else children = [];
  $('userName').textContent = profile.full_name;
  $('userRole').textContent = previewRole === 'student' ? `Student preview · ${profile.skillup_id || 'ID pending'}` : previewRole === 'parent' ? 'Parent / guardian preview' : `${previewRole} preview`;
  $('profileName').value = profile.full_name;
  $('profileYear').value = '4';
  $('profileYearField').hidden = role !== 'student';
  renderStudentIdentity();
  configureRole();
  render();
  ['mainAction','workAction','addStudentAction'].forEach(id => { $(id).hidden = true; $(id).style.display = 'none'; });
  if (previewRole === 'teacher') {
    $('mainAction').hidden = false;
    $('mainAction').style.display = '';
    $('mainAction').disabled = true;
    $('mainAction').title = 'Create assignments from an active teacher account.';
  }
  $('peopleAction').hidden = false;
  $('peopleAction').style.display = '';
  if (previewRole === 'teacher') { $('peopleAction').hidden = true; $('peopleAction').style.display = 'none'; }
  $('setupNotice').hidden = true;
  $('statusBanner').hidden = false;
  $('statusBanner').className = 'status-banner preview';
  $('statusBanner').innerHTML = localSession
    ? `<span><strong>Local account mode</strong> — signed in as ${esc(profile.full_name)}. This account is saved only in this browser.</span><span class="preview-switch"><a href="sign-in.html">Switch account</a></span>`
    : `<span><strong>Preview mode</strong> — realistic sample information, with no account or personal data.</span><span class="preview-switch"><a class="${role==='student'?'active':''}" href="dashboard.html?demo=student">Student</a><a class="${role==='teacher'?'active':''}" href="dashboard.html?demo=teacher">Teacher</a><a class="${role==='parent'?'active':''}" href="dashboard.html?demo=parent">Parent</a></span>`;
  if (!localSession) document.querySelectorAll('.quick-action[type="button"], .quick-action:not(a)').forEach(button => { button.disabled = true; });
  document.querySelectorAll('#profileForm input,#profileForm select,#profileForm button').forEach(control => { control.disabled = true; });
  $('profileMessage').textContent = 'Profile editing is disabled in preview mode.';
  $('signOut').textContent = 'Exit preview';
  bindDemoEvents();
}

function bindDemoEvents() {
  document.querySelectorAll('.dashboard-nav button').forEach(button => button.addEventListener('click',()=>showSection(button.dataset.section, button.textContent)));
  $('mobileNav').onclick=()=> $('sidebar').classList.toggle('open');
  $('signOut').onclick=()=>{ if (readLocal(LOCAL_SESSION, null)) { localStorage.removeItem(LOCAL_SESSION); location.href='sign-in.html'; } else location.href='accounts.html'; };
  if($('copySkillupId')) $('copySkillupId').onclick=copyStudentSkillupId;
  document.addEventListener('click', event => { const opener=event.target.closest('[data-open]'); if(opener) openModal(opener.dataset.open); const closer=event.target.closest('[data-close]'); if(closer) closeModal(closer.dataset.close); });
  if($('peopleAction')) $('peopleAction').onclick=()=>openModal('familyModal');
}

async function init() {
  user = await requireUser();
  if (!user) return;
  profile = await getProfile(user.id);
  if (['admin', 'masteradmin'].includes(user.app_metadata?.role)) {
    location.replace('masteradmin.html');
    return;
  }
  document.body.dataset.dashboardRole = profile.role || 'student';
  $('userName').textContent = profile.full_name;
  $('userRole').textContent = profile.role === 'student' ? `Student · ${profile.skillup_id || 'ID pending'}` : profile.role === 'parent' ? 'Parent / guardian' : profile.role;
  $('profileName').value = profile.full_name || '';
  $('profileYear').value = profile.year_level || '1';
  $('profileYearField').hidden = profile.role !== 'student';
  renderStudentIdentity();
  if (profile.role === 'teacher' && profile.status !== 'active') {
    $('statusBanner').className = 'status-banner pending';
    $('statusBanner').hidden = false;
    $('statusBanner').textContent = profile.status === 'suspended'
      ? 'Your teacher account is suspended. Contact the site owner for help.'
      : 'Teacher activation setup is incomplete. The site owner needs to run the teacher-auto-approval SQL script.';
  }
  if (profile.role === 'teacher' && profile.status === 'active') {
    try { await ensureTeacherGroups(supabase); }
    catch { $('statusBanner').hidden=false; $('statusBanner').className='status-banner pending'; $('statusBanner').textContent='Learning group setup is incomplete. Run the teacher-groups-and-requests SQL script in Supabase.'; }
  }
  await loadRoleData();
  configureRole(); render(); bindEvents();
  if (new URLSearchParams(location.search).get('section') === 'people') showSection('people', $('peopleNav').textContent);
}

async function loadRoleData() {
  if (profile.role === 'teacher') {
    ({ data: classes = [] } = await supabase.from('classes').select('*').eq('teacher_id', user.id).is('archived_at',null).order('created_at'));
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
    const leaderboard = await supabase.rpc('get_student_leaderboard', { year_level_input: profile.year_level || '1', period_input: 'all' });
    leaderboardRows = leaderboard.data || [];
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
  $('portalRole').textContent = profile.role[0].toUpperCase() + profile.role.slice(1);
  $('portalSignOut').onclick = () => $('signOut').click();
  $('pageTitle').textContent = teacher ? 'Teacher dashboard' : student ? 'Student dashboard' : 'Parent dashboard';
  $('welcomeText').textContent = teacher
    ? 'See where your class is progressing and who needs support.'
    : student ? 'Your next learning step starts here.' : 'Follow your child’s progress and find their next learning step.';
  const overviewNav = document.querySelector('[data-section="overview"]');
  if (overviewNav) overviewNav.textContent = student ? 'Dashboard' : 'Overview';

  $('workNav').textContent = teacher ? 'Assignments' : 'My work';
  $('peopleNav').textContent = teacher ? 'Groups & students' : student ? 'My classes' : 'My children';
  $('mainAction').hidden = !teacher || profile.status !== 'active';
  $('mainAction').textContent = '＋ Create assignment';
  $('mainAction').dataset.open = 'assignmentModal';
  $('workAction').hidden = !teacher || profile.status !== 'active';
  $('workAction').textContent = '＋ Create assignment';
  $('workAction').dataset.open = 'assignmentModal';
  $('peopleAction').hidden = false;
  $('peopleAction').textContent = teacher ? '＋ Create group' : student ? 'Join a class' : 'Link a child';
  $('peopleAction').dataset.open = teacher ? 'classModal' : student ? 'joinModal' : 'familyModal';
  $('addStudentAction').hidden = !teacher || profile.status !== 'active';
  $('addStudentAction').textContent = '＋ Add student';
  $('addStudentAction').dataset.open = 'addStudentModal';
  $('workTitle').textContent = teacher ? 'Assignments' : 'My work';
  $('peopleTitle').textContent = teacher ? 'Groups and students' : student ? 'My classes' : 'My children';
  $('peopleSubtitle').textContent = teacher ? 'Manage classes, batches, subjects and student requests' : student ? 'Classes you have joined' : 'Read-only progress for linked children';
}

function render() {
  if (profile.role === 'teacher') renderTeacher();
  else if (profile.role === 'student') renderStudent();
  else renderParent();
  renderWork(); renderPeople(); renderProgress();
  applyAssignmentBoardSummary();
}

function applyAssignmentBoardSummary() {
  if(!profile||!assignmentBoardRows)return;
  const rows=assignmentBoardRows,complete=rows.filter(r=>r.submitted_at),scored=complete.filter(r=>r.score!=null&&Number(r.total)>0);
  const pending=rows.filter(r=>!r.submitted_at),overdue=pending.filter(r=>new Date(r.due_at)<new Date());
  const average=scored.length?Math.round(scored.reduce((sum,r)=>sum+Number(r.score)/Number(r.total)*100,0)/scored.length):0;
  const marks=scored.reduce((sum,r)=>sum+Number(r.score),0),total=scored.reduce((sum,r)=>sum+Number(r.total),0);
  const adapted=scored.map(r=>({assignment_id:r.id,student_id:r.student_id,subject:r.subject,score:r.score,max_score:r.total,submitted_at:r.submitted_at}));
  if(profile.role==='teacher'){
    metrics([{label:'Active classes',value:classes.length,note:'Your learning groups'},{label:'Students',value:new Set(classMembers.map(m=>m.student_id)).size,note:'Unique learners'},{label:'Awaiting submission',value:pending.length,note:'Student assignments'},{label:'Submissions',value:complete.length,note:'Saved results received'}]);
    $('insightPanel').innerHTML=complete.length?`<strong>${complete.length} submission${complete.length===1?'':'s'} received</strong>View scores and submitted homework answers on your assignment board.`:'<strong>Waiting for submissions</strong>Published work is listed on your assignment board.';
  }else if(profile.role==='parent'){
    metrics([{label:'Linked children',value:children.length,note:'Family connections'},{label:'To complete',value:pending.length,note:'Family and class work'},{label:'Submitted',value:complete.length,note:'Saved results received'},{label:'Average',value:scored.length?average+'%':'—',note:'Submitted scored work'}]);
  }else{
    const rank=leaderboardRows.find(r=>r.student_id===user?.id)?.rank_position||'—';
    metrics([{label:'Acorn & Shine mark',value:total?Math.round(marks/total*100)+'/100':'—',note:'Submitted accuracy'},{label:'Questions answered',value:total,note:'Completed scored work'},{label:'Marks achieved',value:marks,note:'Total correct marks'},{label:'Leaderboard rank',value:rank,note:'Year-level ranking'}]);
    $('insightPanel').innerHTML=total?`<strong>${Math.round(marks/total*100)}/100 Acorn & Shine mark</strong>Your submitted assignment scores are saved. Keep going with the work on your board.`:'<strong>Your next learning step</strong>Open an assignment from your board to get started.';
  }
  if(profile.role!=='student'){
    $('primaryPanelTitle').textContent='Recent assignment activity';
    const recent=[...rows].sort((a,b)=>new Date(b.submitted_at||b.created_at||b.due_at)-new Date(a.submitted_at||a.created_at||a.due_at)).slice(0,6);
    $('primaryPanel').innerHTML=recent.length?`<div class="task-list">${recent.map(r=>`<article class="task-card"><div><h3>${esc(r.title)}</h3><p>${esc(r.student_name)} · ${r.submitted_at?'Submitted '+formatDate(r.submitted_at,true):'Due '+formatDate(r.due_at,true)}</p></div><strong>${r.submitted_at?(r.score!=null&&r.total?Number(r.score)+'/'+Number(r.total):'Received'):'To do'}</strong></article>`).join('')}</div>`:empty('No assigned work yet','Assignments and submitted results will appear here.');
  }
  $('progressPanel').innerHTML=profile.role==='student'?scoreSummary(adapted):subjectProgress(adapted);
  $('fullProgress').innerHTML=`<div class="metric-grid"><article class="metric"><span>Completed</span><strong>${complete.length}</strong><small>Submitted assignments</small></article><article class="metric"><span>Average accuracy</span><strong>${scored.length?average+'%':'—'}</strong><small>Scored work</small></article><article class="metric"><span>Still to do</span><strong>${pending.length}</strong><small>Assigned work</small></article><article class="metric"><span>Past due</span><strong>${overdue.length}</strong><small>Not submitted</small></article></div>${scoreSummary(adapted)}`;
  $('workContent').innerHTML='<p class="panel-subtitle">Use the assignment board above to open work, filter submissions and review results.</p>';
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
  metrics([{label:'Active classes',value:classes.length,note:'Across Acorn & Shine'},{label:'Students',value:studentIds.size,note:'Unique learners'},{label:'Due this week',value:dueSoon,note:'Published work'},{label:'Submissions',value:submitted,note:'Ready to review'}]);
  $('primaryPanelTitle').textContent = 'Assignment activity';
  $('primaryPanel').innerHTML = assignmentTable(assignments.slice(0,6), true);
  $('progressPanel').innerHTML = subjectProgress(submissions);
  $('progressPanel').closest('.panel').querySelector('h2').textContent = 'Class progress by subject';
  $('quickActions').innerHTML = `<button class="quick-action" data-open="assignmentModal"><strong>Create an assignment</strong><span>Choose content, students and a due date</span></button><button class="quick-action" data-open="addStudentModal"><strong>Add student by email or ID</strong><span>Enter the registered student email or ID and choose a group</span></button><button class="quick-action" data-open="classModal"><strong>Create a learning group</strong><span>Set up a class, batch, subject or custom group</span></button>`;
  $('insightPanel').innerHTML = submitted ? `<strong>${submitted} submitted attempt${submitted === 1 ? '' : 's'}</strong>Open Assignments to see who has finished and who may need a reminder.` : '<strong>No submissions yet</strong>Publish an assignment to start building class insights.';
}

function renderStudent() {
  const byAssignment = new Map(submissions.map(item => [item.assignment_id, item]));
  const open = assignments.filter(item => ['open','overdue'].includes(assignmentState(item, byAssignment.get(item.id))));
  const complete = submissions.filter(item => item.submitted_at);
  const scored = complete.filter(item => item.max_score);
  const questionsAnswered = scored.reduce((sum,item) => sum + Number(item.max_score || 0), 0);
  const marksAchieved = scored.reduce((sum,item) => sum + Number(item.score || 0), 0);
  const weightedMark = questionsAnswered ? Math.round(marksAchieved / questionsAnswered * 100) : 0;
  const average = scored.length ? Math.round(scored.reduce((sum,item) => sum + Number(item.score)/Number(item.max_score)*100,0)/scored.length) : 0;
  const ownRow = leaderboardRows.find(row => row.student_id === user.id || row.display_name === profile.full_name);
  const rank = ownRow?.rank_position || '—';
  metrics([{label:'Acorn & Shine mark',value:weightedMark ? `${weightedMark}/100` : '—',note:'Weighted accuracy'},{label:'Questions answered',value:questionsAnswered,note:'Completed questions'},{label:'Marks achieved',value:marksAchieved,note:'Total correct marks'},{label:'Leaderboard rank',value:rank,note:'Year-level ranking'}]);
  $('primaryPanelTitle').textContent = 'Leaderboard';
  const leaders = leaderboardRows.slice().sort((a,b) => Number(a.rank_position || 999) - Number(b.rank_position || 999)).slice(0,8);
  $('primaryPanel').innerHTML = leaders.length ? `<div class="task-list">${leaders.map(row => {
    const isYou = row.student_id === user.id || row.display_name === profile.full_name;
    const badge = row.badge_level || 'Bronze';
    return `<article class="task-card${isYou ? ' current' : ''}"><div><h3>${row.rank_position || '—'}. ${esc(row.display_name || 'Student')}${isYou ? ' · You' : ''}</h3><p>${esc(badge)} · ${Number(row.completed_tests || 0)} tests · ${Number(row.total_points || 0)} points</p></div><strong>${Number(row.average_percent || 0)}%</strong></article>`;
  }).join('')}</div>` : empty('No leaderboard results yet','Complete a scored test to appear here.');
  $('progressPanel').innerHTML = scoreSummary(submissions);
  $('quickActions').innerHTML = `<a class="quick-action" href="practice.html"><strong>My practice</strong><span>Continue a saved session or choose another topic</span></a><button class="quick-action" data-open="joinModal"><strong>Join a class</strong><span>Use the code from your teacher</span></button><button class="quick-action" data-open="familyModal"><strong>Parent connections</strong><span>Share your Acorn & Shine ID and approve parent requests</span></button>`;
  $('insightPanel').innerHTML = scored.length ? `<strong>${weightedMark}/100 Acorn & Shine mark</strong>${average >= 80 ? 'Strong work. Keep answering questions to improve your position.' : 'Review feedback and complete more questions to build your mark.'}` : '<strong>Your leaderboard starts here</strong>Complete a scored test to receive a Acorn & Shine mark.';
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
  $('progressPanel').innerHTML = subjectProgress(childSubs);
  $('progressPanel').closest('.panel').querySelector('h2').textContent = 'Learning progress';
  $('quickActions').innerHTML = `<button class="quick-action" data-open="familyModal"><strong>Link a child by Acorn & Shine ID</strong><span>Enter the permanent ID shown in your child’s dashboard</span></button><a class="quick-action" href="parents.html"><strong>Parent guide</strong><span>Help with learning without adding pressure</span></a>`;
  $('insightPanel').innerHTML = children.length ? `<strong>${children.length === 1 ? esc(children[0].full_name) : 'Family summary'}</strong>Focus first on overdue work, then celebrate consistent completion and effort.` : '<strong>Connect securely</strong>A family code links only the child who generated it and expires automatically.';
}

function assignmentTable(list, teacher = false) {
  if (!list.length) return empty('No assignments yet', teacher ? 'Create the first assignment for a class.' : 'New work from your teacher will appear here.');
  return `<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Assignment</th><th>Due</th><th>Status</th>${teacher?'<th>Submitted</th>':'<th>Score</th>'}</tr></thead><tbody>${list.map(item => { const related = submissions.filter(x=>x.assignment_id===item.id), own = related.find(x=>x.student_id===user.id); const state=assignmentState(item,own); return `<tr><td><div class="item-title">${esc(item.title)}</div><div class="item-sub">${esc(item.subject || 'Acorn & Shine activity')}</div></td><td>${formatDate(item.due_at,true)}</td><td><span class="status-pill ${state}">${state}</span></td><td>${teacher?`${related.filter(x=>x.submitted_at).length} received`:(own?.max_score?`${own.score}/${own.max_score}`:'—')}</td></tr>`}).join('')}</tbody></table></div>`;
}

function taskCards(list, byAssignment, parentView = false) {
  if (!list.length) return empty('You are all caught up','There is no current work needing attention.');
  return `<div class="task-list">${list.map(item => { const sub=byAssignment.get(item.id), state=assignmentState(item,sub); const href=parentView?'#':`${item.resource_url}${item.resource_url.includes('?')?'&':'?'}assignment=${item.id}`; return `<article class="task-card"><div><h3>${esc(item.title)}</h3><p>${formatDate(item.due_at,true)} · <span class="status-pill ${state}">${state}</span></p></div>${parentView?'':`<a class="primary-link" href="${esc(href)}">${sub?.submitted_at?'Review':'Start'}</a>`}</article>`}).join('')}</div>`;
}

function subjectProgress(list) {
  const groups = new Map();
  list.filter(item => Number(item.max_score) > 0).forEach(item => {
    const assignment = assignments.find(row => row.id === item.assignment_id);
    const subject = item.subject || assignment?.subject || 'Learning';
    const group = groups.get(subject) || {score: 0, total: 0};
    group.score += Number(item.score || 0);
    group.total += Number(item.max_score);
    groups.set(subject, group);
  });
  if (!groups.size) return empty('No scored work yet', 'Subject results will appear after a completed activity.');
  return '<p class="panel-subtitle">Average recorded result</p>' + [...groups].map(([subject, result]) => {
    const percent = Math.max(0, Math.min(100, Math.round(result.score / result.total * 100)));
    return `<div class="subject-progress-row"><b>${esc(subject)}</b><div class="progress-bar"><span style="width:${percent}%"></span></div><strong>${percent}%</strong></div>`;
  }).join('');
}

function scoreSummary(list) {
  const scored = list.filter(item => item.max_score).slice(-6).reverse();
  if (!scored.length) return empty('No scored work yet','Accuracy and progress will appear after a scored submission.');
  return `<div class="task-list">${scored.map(item=>{const pct=Math.round(Number(item.score)/Number(item.max_score)*100);return `<div><div class="panel-heading"><span class="item-title">${formatDate(item.submitted_at)}</span><strong>${pct}%</strong></div><div class="progress-bar"><span style="width:${pct}%"></span></div></div>`}).join('')}</div>`;
}

function renderWork() { $('workContent').innerHTML = assignmentTable(assignments, profile.role === 'teacher'); }

function renderPeople() {
  if (profile.role === 'teacher') {
    $('peopleContent').innerHTML = classes.length ? `<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Learning group</th><th>Year</th><th>Students</th><th>Join code</th></tr></thead><tbody>${classes.map(c=>`<tr><td class="item-title">${esc(c.name)}<small class="item-sub">${esc(c.group_type || 'class')} · ${esc(c.programme || 'K6')}</small></td><td>Year ${esc(c.year_level)}</td><td>${classMembers.filter(m=>m.class_id===c.id).length}</td><td><strong>${esc(c.join_code)}</strong></td></tr>`).join('')}</tbody></table></div>` : empty('No classes yet','Create a class to receive a private student join code.');
  } else if (profile.role === 'student') {
    $('peopleContent').innerHTML = classes.length ? `<div class="task-list">${classes.map(c=>`<article class="task-card"><div><h3>${esc(c.name)}</h3><p>${esc(c.subject)} · Year ${esc(c.year_level)}</p></div><span class="status-pill active">Joined</span></article>`).join('')}</div>` : empty('You have not joined a class','Ask your teacher for a six-character class code.');
  } else {
    $('peopleContent').innerHTML = children.length ? `<div class="task-list">${children.map(c=>`<article class="task-card"><div><h3>${esc(c.full_name)}</h3><p>Year ${esc(c.year_level)}</p></div><span class="status-pill active">Linked</span></article>`).join('')}</div>` : empty('No child linked','Enter your child’s Acorn & Shine ID to send a connection request.');
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
  const updateGroupYear = () => { const programme=$('classProgramme').value; const allowed=programme==='Selective'?['5','6']:programme==='NAPLAN3'?['3']:programme==='NAPLAN5'?['5']:programme==='OC4'?['4']:['K','1','2','3','4','5','6']; for(const option of $('classYear').options){option.disabled=!allowed.includes(option.value);option.hidden=option.disabled;} if(!allowed.includes($('classYear').value)) $('classYear').value=allowed[0]; };
  $('classProgramme').addEventListener('change',updateGroupYear); updateGroupYear();
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
    window.prompt('Copy your Acorn & Shine ID:',value);
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
  const {error}=await supabase.rpc('add_student_to_group_by_identifier',{
    class_input:$('addStudentClass').value,
    identifier_input:$('addStudentSkillupId').value.trim()
  });
  if(error)return out.textContent=friendlyError(error);
  out.classList.add('success');
  out.textContent='Student added to the class.';
  setTimeout(()=>location.reload(),650);
}

function prepareAssignment(){ $('assignmentClass').innerHTML='<option value="">Choose a class</option>'+classes.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('');const due=new Date(Date.now()+7*864e5);due.setMinutes(due.getMinutes()-due.getTimezoneOffset());$('assignmentDue').value=due.toISOString().slice(0,16);renderRecipients() }

async function getStudentProfiles(ids){if(!ids.length)return[];const {data=[]}=await supabase.from('profiles').select('id,full_name,year_level').in('id',ids);return data}
async function renderRecipients(){const box=$('recipientList');if($('recipientMode').value!=='selected'||!$('assignmentClass').value){box.hidden=true;box.innerHTML='';return}const ids=classMembers.filter(x=>x.class_id===$('assignmentClass').value).map(x=>x.student_id),people=await getStudentProfiles(ids);box.hidden=false;box.innerHTML=people.length?people.map(x=>`<label><input type="checkbox" name="recipient" value="${x.id}"><span>${esc(x.full_name)}</span></label>`).join(''):empty('No students in this class','Share the class code first.')}

async function createClass(event){event.preventDefault();const out=$('classMessage');out.textContent='';const {error}=await supabase.from('classes').insert({teacher_id:user.id,name:$('className').value.trim(),subject:$('classSubject').value,year_level:$('classYear').value,group_type:$('classGroupType').value,programme:$('classProgramme').value});if(error)return out.textContent=friendlyError(error);out.classList.add('success');out.textContent='Learning group created.';setTimeout(()=>location.reload(),500)}

async function createAssignment(event){event.preventDefault();const out=$('assignmentMessage');out.textContent='';const classId=$('assignmentClass').value;const cls=classes.find(x=>x.id===classId);const {data,error}=await supabase.from('assignments').insert({teacher_id:user.id,class_id:classId,title:$('assignmentTitle').value.trim(),instructions:$('assignmentInstructions').value.trim(),subject:cls?.subject||'Acorn & Shine',resource_url:$('assignmentResource').value,opens_at:$('assignmentOpens').value?new Date($('assignmentOpens').value).toISOString():new Date().toISOString(),due_at:new Date($('assignmentDue').value).toISOString(),allow_late:$('allowLate').checked,status:'published'}).select().single();if(error)return out.textContent=friendlyError(error);if($('recipientMode').value==='selected'){const ids=[...document.querySelectorAll('input[name="recipient"]:checked')].map(x=>x.value);if(!ids.length){await supabase.from('assignments').delete().eq('id',data.id);return out.textContent='Choose at least one student.'}const {error:targetError}=await supabase.from('assignment_targets').insert(ids.map(student_id=>({assignment_id:data.id,student_id})));if(targetError)return out.textContent=friendlyError(targetError)}out.classList.add('success');out.textContent='Assignment published.';setTimeout(()=>location.reload(),600)}

async function joinClass(event){event.preventDefault();const out=$('joinMessage');const {error}=await supabase.rpc('join_class_by_code',{code_input:$('joinCode').value.trim().toUpperCase()});if(error)return out.textContent=friendlyError(error);out.classList.add('success');out.textContent='Class joined.';setTimeout(()=>location.reload(),500)}

async function renderFamilyModal(){
  const box=$('familyContent');
  if (demoRole) {
    box.innerHTML = '<p>Family links are managed from your signed-in account.</p><a class="primary-button" href="sign-in.html">Sign in</a>';
    return;
  }
  if(!supabase){
    const accounts=readLocal(LOCAL_ACCOUNTS), links=readLocal(LOCAL_LINKS);
    if(profile.role==='student'){
      const requests=links.filter(link=>link.studentEmail===profile.email&&link.status==='pending');
      box.innerHTML=`<div class="skillup-share-card"><span>YOUR PERMANENT SKILLUP ID</span><strong>${esc(profile.skillup_id||'ID pending')}</strong><p>Share this ID with a parent or teacher only when you want them to connect.</p><button class="secondary-button" id="copyFamilySkillupId" type="button">Copy Acorn & Shine ID</button></div><div class="connection-requests"><h3>Parent connection requests</h3>${requests.length?requests.map(r=>{const parent=accounts.find(a=>a.email===r.parentEmail);return `<article class="connection-request"><div><b>${esc(parent?.fullName||'Parent account')}</b><span>Wants to connect to your learning progress</span></div><div><button class="secondary-button approve-parent" data-parent="${esc(r.parentEmail)}" type="button">Approve</button><button class="danger-button decline-parent" data-parent="${esc(r.parentEmail)}" type="button">Decline</button></div></article>`}).join(''):'<p class="panel-subtitle">No pending requests.</p>'}</div>`;
      if($('copyFamilySkillupId')) $('copyFamilySkillupId').onclick=copyStudentSkillupId;
      box.querySelectorAll('.approve-parent,.decline-parent').forEach(button=>button.onclick=()=>{const next=links.map(link=>link.studentEmail===profile.email&&link.parentEmail===button.dataset.parent&&link.status==='pending'?{...link,status:button.classList.contains('approve-parent')?'approved':'declined'}:link);writeLocal(LOCAL_LINKS,next);location.reload();});
    } else if(profile.role==='parent'){
      box.innerHTML=`<form id="claimFamilyForm" class="dashboard-form"><div class="skillup-id-help"><span>SKILLUP ID</span><strong>Ask your child for the ID shown on their dashboard.</strong><p>Example: SU-48291735. Your child must approve the connection before you can see progress.</p></div><label>Child’s Acorn & Shine ID<input id="familySkillupId" required maxlength="11" autocomplete="off" style="text-transform:uppercase" placeholder="SU-48291735"></label><button class="primary-button" type="submit">Send connection request</button><p id="familyMessage" class="form-message"></p></form>`;
      $('claimFamilyForm').onsubmit=event=>{event.preventDefault();const out=$('familyMessage');const code=normalizeSkillupId($('familySkillupId').value);if(!profile.email)return out.textContent='This is the sample preview. Sign in to your parent account before linking a real student.';const child=accounts.find(a=>a.role==='student'&&a.skillupId===code);if(!child)return out.textContent='Student Acorn & Shine ID not found in this browser. Use the same browser for preview accounts, or connect Supabase for cross-device accounts.';if(child.email===profile.email)return out.textContent='A parent account cannot link to itself.';const next=links.filter(link=>!(link.parentEmail===profile.email&&link.studentEmail===child.email)).concat({parentEmail:profile.email,studentEmail:child.email,status:'pending',requestedAt:new Date().toISOString()});writeLocal(LOCAL_LINKS,next);out.textContent='Request sent. Your child must approve it from their dashboard.';out.classList.add('success');};
    } else box.innerHTML='<p>Family connections are available from student and parent accounts.</p>';
    return;
  }
  if(profile.role==='student'){
    const id=profile.skillup_id || 'ID pending';
    const {data:requests=[],error}=await supabase.rpc('list_pending_guardian_requests');
    box.innerHTML=`
      <div class="skillup-share-card">
        <span>YOUR PERMANENT SKILLUP ID</span>
        <strong>${esc(id)}</strong>
        <p>Share this with a teacher or parent only when you want them to connect to your account.</p>
        <button class="secondary-button" id="copyFamilySkillupId" type="button">Copy Acorn & Shine ID</button>
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
        <label>Child’s Acorn & Shine ID<input id="familySkillupId" required maxlength="11" autocomplete="off" style="text-transform:uppercase" placeholder="SU-48291735"></label>
        <button class="primary-button" type="submit">Send connection request</button>
        <p id="familyMessage" class="form-message"></p>
      </form>`;
    $('claimFamilyForm').onsubmit=async event=>{
      event.preventDefault();
      const out=$('familyMessage');
      out.classList.remove('success');
      const {error}=await supabase.rpc('request_guardian_link_by_skillup_id',{
        skillup_id_input:normalizeSkillupId($('familySkillupId').value)
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

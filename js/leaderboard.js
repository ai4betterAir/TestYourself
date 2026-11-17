import { supabase, isSupabaseConfigured, requireUser, getProfile } from './supabase-client.js?v=20260923';

const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? '').replace(/[&<>'"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const periodLabels = { week: 'This week', month: 'This month', all: 'All time' };
let currentPeriod = 'week';
let rows = [];
let currentStudentId = null;
let currentYear = '5';

const sampleRows = [
  {student_id:'demo-1',display_name:'Tom W.',year_level:'5',average_percent:96,completed_tests:8,total_points:768,badge_level:'Platinum',rank_position:1},
  {student_id:'demo-2',display_name:'Mila K.',year_level:'5',average_percent:91,completed_tests:7,total_points:637,badge_level:'Platinum',rank_position:2},
  {student_id:'demo-3',display_name:'Aisha S.',year_level:'5',average_percent:86,completed_tests:6,total_points:516,badge_level:'Gold',rank_position:3},
  {student_id:'demo-student',display_name:'Jordan L.',year_level:'5',average_percent:82,completed_tests:5,total_points:410,badge_level:'Gold',rank_position:4},
  {student_id:'demo-4',display_name:'Ravi P.',year_level:'5',average_percent:78,completed_tests:5,total_points:390,badge_level:'Silver',rank_position:5},
  {student_id:'demo-5',display_name:'Ella N.',year_level:'5',average_percent:73,completed_tests:4,total_points:292,badge_level:'Silver',rank_position:6},
  {student_id:'demo-6',display_name:'Sofia C.',year_level:'5',average_percent:68,completed_tests:4,total_points:272,badge_level:'Bronze',rank_position:7}
];

const badge = (percent) => percent >= 90 ? 'Platinum' : percent >= 80 ? 'Gold' : percent >= 70 ? 'Silver' : 'Bronze';
const badgeClass = (name) => String(name || 'Bronze').toLowerCase();
const initials = (name) => String(name || 'Student').split(/\s+/).map((x) => x[0]).join('').slice(0,2).toUpperCase();
const yearLabel = (year) => year === 'K' ? 'Kindergarten' : 'Year ' + year;
const periodStart = (period) => period === 'month' ? '30 days' : period === 'all' ? 'all time' : '7 days';

function setText(id, value) {
  const node = $(id);
  if (node) { node.textContent = value; node.removeAttribute('data-countup'); }
}
function tag(text, icon, className='') {
  return '<span class="lb-tag ' + className + '"><svg><use href="assets/skillup-icons.svg#' + icon + '"/></svg> ' + esc(text) + '</span>';
}
function badgePill(name) {
  return '<span class="lb-badge-pill ' + badgeClass(name) + '">' + esc(name) + '</span>';
}
function renderHero(own, total) {
  const rank = own?.rank_position || '—';
  const avg = own?.average_percent == null ? null : Number(own.average_percent);
  setText('lbHeroRank', rank);
  setText('lbHeroTotal', 'of ' + total + ' in ' + yearLabel(currentYear));
  setText('lbHeroSummary', avg == null
    ? 'Complete a practice set to receive your first year-level result.'
    : 'Your average is ' + avg.toFixed(1) + '%. You are ranked against students in your ' + yearLabel(currentYear) + ' cohort.');
  setText('lbLeague', avg == null ? 'Not yet placed' : (own.badge_level || badge(avg)) + ' League');
  setText('lbLeagueSub', avg == null ? yearLabel(currentYear) : 'Based on your ' + periodStart(currentPeriod) + ' performance');
  const tags = $('lbHeroTags');
  if (tags) tags.innerHTML = tag(avg == null ? 'No result yet' : avg.toFixed(1) + '% average', 'target') + tag((own?.completed_tests || 0) + ' completed sets', 'naplan') + tag((own?.badge_level || (avg == null ? 'Starter' : badge(avg))) + ' badge', 'trophy');
}
function renderMetrics(own) {
  setText('lbMetricRank', own?.rank_position || '—');
  setText('lbMetricPoints', own ? Math.round(Number(own.total_points || 0)).toLocaleString() : '0');
  setText('lbMetricTests', own?.completed_tests || '0');
}
function renderPodium(top) {
  const node = $('lbPodium'); if (!node) return;
  node.innerHTML = [top[1], top[0], top[2]].filter(Boolean).map((r, index) => {
    const place = index === 0 ? 2 : index === 1 ? 1 : 3;
    return '<div class="podium-card podium-' + place + '"><span class="crown">' + place + '</span><span class="avatar">' + esc(initials(r.display_name)) + '</span><b>' + esc(r.display_name) + '</b><span>' + yearLabel(r.year_level) + '</span><div class="xp">' + Math.round(Number(r.average_percent || 0)) + '<small>%</small></div><div class="stand">' + place + '</div><div class="lb-podium-badge">' + badgePill(r.badge_level) + '</div></div>';
  }).join('') || '<p class="lb-empty">No completed results in this group yet.</p>';
}
function renderList(list, own) {
  const node = $('lbList');
  if (!node) return;
  const visible = list.slice(0, 10);
  if (own && !visible.some(row => row.student_id === own.student_id)) visible.push(own);
  node.innerHTML = visible.map(row => {
    const me = row.student_id === currentStudentId;
    return `<tr class="${me ? 'is-you' : ''}"><td>${Number(row.rank_position) || '—'}</td><td>${esc(me ? 'You' : initials(row.display_name))}</td><td>${esc(yearLabel(row.year_level))}</td><td>${Number(row.total_points) || 0}</td><td>${Number(row.completed_tests) || 0}</td></tr>`;
  }).join('') || '<tr><td colspan="5">No completed test results in this period yet.</td></tr>';
}
function renderRewards(own) {
  const node = $('lbRewards'); if (!node) return;
  const avg = own?.average_percent == null ? 0 : Number(own.average_percent);
  const items = [
    {name:'Bronze Starter',desc:'Complete your first scored test.',on:!!own},
    {name:'Silver Scholar',desc:'Reach 70% average in your year-level results.',on:avg >= 70},
    {name:'Gold Achiever',desc:'Reach 80% average in your year-level results.',on:avg >= 80},
    {name:'Platinum Expert',desc:'Reach 90% average in your year-level results.',on:avg >= 90}
  ];
  node.innerHTML = items.map((x) => '<div class="reward ' + (x.on ? '' : 'locked') + '"><span class="ic ' + badgeClass(x.name.split(' ')[0]).charAt(0) + '"><svg><use href="assets/skillup-icons.svg#' + (x.on ? 'trophy' : 'shield') + '"/></svg></span><div><b>' + x.name + '</b><span>' + x.desc + '</span></div></div>').join('');
}
function renderAll() {
  const own = rows.find((r) => r.student_id === currentStudentId) || null;
  renderHero(own, rows.length);
  renderMetrics(own);
  renderPodium(rows.slice(0,3));
  renderList(rows, own);
  renderRewards(own);
  setText('lbYearChip', yearLabel(currentYear));
  setText('lbTopHeading', 'Top students in ' + yearLabel(currentYear));
  setText('lbTopSub', 'Highest-performing students in this year level · ' + periodLabels[currentPeriod]);
  setText('lbFullSub', yearLabel(currentYear) + ' · ' + periodLabels[currentPeriod]);
}
function bindFilters() {
  document.querySelectorAll('[data-time]').forEach((button) => button.addEventListener('click', async () => {
    document.querySelectorAll('[data-time]').forEach((b) => b.classList.remove('active'));
    button.classList.add('active');
    currentPeriod = button.dataset.time || 'week';
    await load();
  }));
  document.querySelectorAll('[data-scope]').forEach((button) => button.addEventListener('click', () => {
    if (button.dataset.scope !== 'year') {
      alert('Leaderboard comparisons are limited to your year level so students are compared fairly by age.');
      document.querySelectorAll('[data-scope]').forEach((b) => b.classList.toggle('active', b.dataset.scope === 'year'));
    }
  }));
}
async function renderAssignedHomework(preview=false) {
  const host=$('lbHomeworkList');if(!host)return;
  const sample=[{id:'sample',title:'Selective · Reading and reasoning',subject:'Selective',teacher_id:null,questions:Array(20),due_at:new Date(Date.now()+864e5).toISOString(),submitted_at:null}];
  let work=sample;
  if(!preview){
    const result=await supabase.from('family_homework').select('id,title,subject,teacher_id,due_at,submitted_at,score,questions').eq('student_id',currentStudentId).order('due_at');
    if(result.error){host.textContent='Assignments could not load. Check the homework database setup or try again.';return;}
    work=result.data||[];
  }
  host.innerHTML=work.length?work.map(item=>`<article><div><h3>${esc(item.title)}</h3><p>${item.teacher_id?'Teacher':'Family'} assignment · ${esc(item.subject)} · ${item.questions.length} questions</p><p>${item.submitted_at?`Completed · ${Number(item.score)}/${item.questions.length}`:'To do · Due '+esc(new Date(item.due_at).toLocaleDateString())}</p></div>${preview?'<span>Sample assignment</span>':`<a href="family-homework.html?id=${encodeURIComponent(item.id)}">${item.submitted_at?'View result':'Start assignment'} →</a>`}</article>`).join(''):'<p>No homework assigned yet. Parent and teacher assignments will appear here.</p>';
}
async function load() {
  if (new URLSearchParams(location.search).get('demo') === 'student' || !isSupabaseConfigured || !supabase) {
    rows = sampleRows.map(row => ({...row, year_level: currentYear}));
    currentStudentId = 'demo-student';
    setText('lbModeBanner', 'Sample rankings · Preview data');
    $('lbYearSelect').value = currentYear;
    renderAll();
    await renderAssignedHomework(true);
    return;
  }
  const user = await requireUser();
  if (!user) return;
  currentStudentId = user.id;
  const profile = await getProfile(user.id);
  currentYear = profile.year_level || '5';
  setText('lbUserName', profile.full_name || 'Student');
  $('lbYearSelect').value = currentYear;
  $('lbYearSelect').disabled = true;
  setText('lbUserRole', 'Student · ' + yearLabel(currentYear));
  const { data, error } = await supabase.rpc('get_student_leaderboard', { year_level_input: currentYear, period_input: currentPeriod });
  if (error) {
    rows = [];
    setText('lbModeBanner', 'Your secure leaderboard is ready after the Supabase leaderboard migration is applied.');
  } else {
    rows = data || [];
    setText('lbModeBanner', 'Live results · Submitted tests and homework count after the homework leaderboard migration is applied. Comparisons stay within your school year.');
  }
  renderAll();
  await renderAssignedHomework();
}
$('lbYearSelect').value = currentYear;
$('lbYearSelect').addEventListener('change', async event => { currentYear = event.target.value; await load(); });
bindFilters();
load().catch((error) => {
  setText('lbModeBanner', error.message || 'Leaderboard could not load right now.');
});

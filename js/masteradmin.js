import { supabase, isSupabaseConfigured, getProfile } from './supabase-client.js?v=profile-setup-fix';

const $ = id => document.getElementById(id);
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const previewOnly = new URLSearchParams(location.search).get('preview') === '1';
let authorised = false;
let selectedRole = 'teacher';
let viewSequence = 0;
const pages = [
  ['Home', 'index.html'], ['Year hubs', 'learning.html'],
  ['Subject hubs', 'subject.html?year=3&subject=english'],
  ['Sign In', 'sign-in.html'], ['Sign Up', 'sign-up.html'], ['About', 'about.html'],
  ['Leaderboard', 'leaderboard.html?demo=student']
];
const views = {
  overview: ['Workspace overview', 'Review dashboard layouts, public pages and learning content.'],
  previews: ['Dashboard previews', 'Open each experience to review its layout and navigation.'],
  pages: ['Website pages', 'Choose a year and subject to review the corresponding page.'],
  users: ['Users & roles', 'Review the roles and status of registered accounts.'],
  questions: ['Question banks', 'Review the learning activities and their source banks.'],
  results: ['Results & activity', 'Review recorded student submissions.'],
  design: ['Design settings', 'Review the shared palette and dashboard viewport styles.']
};

function linkList(items) {
  return items.map(([label, href]) => `<a class="admin-page-link" href="${escape(href)}" target="_blank" rel="noopener">${escape(label)} <span>→</span></a>`).join('');
}

function sizePreview() {
  const frame = $('dashboardPreview');
  const width = frame.classList.contains('mobile-preview') ? 390 : 1280;
  const scale = Math.min(1, Math.max(0, frame.parentElement.clientWidth - 24) / width);
  frame.style.width = width + 'px';
  frame.style.transform = 'scale(' + scale + ')';
  frame.parentElement.style.height = (900 * scale + 82) + 'px';
}
function selectRole(role) {
  selectedRole = role;
  const label = role[0].toUpperCase() + role.slice(1);
  $('previewTitle').textContent = label + ' dashboard · Preview';
  const url = 'dashboard.html?demo=' + role;
  $('dashboardPreview').src = url;
  $('dashboardPreview').title = label + ' dashboard preview';
  $('openPreview').href = url;
  sizePreview();
  document.querySelectorAll('[data-role]').forEach(button => {
    const selected = button.dataset.role === role;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}
function table(columns, rows) {
  return `<div class="admin-table-wrap"><table><thead><tr>${columns.map(column => `<th>${escape(column)}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.map(row => `<tr>${row.map(value => `<td>${escape(value)}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${columns.length}">No records available.</td></tr>`}</tbody></table></div>`;
}
function pageCatalogue() {
  const yearOptions = ['K','1','2','3','4','5','6'].map(year => `<option value="${year}" ${year === '3' ? 'selected' : ''}>${year === 'K' ? 'Kindergarten' : 'Year ' + year}</option>`).join('');
  const subjects = [['maths','Maths'],['english','English'],['vocabulary','Vocabulary'],['science','Science'],['general-knowledge','General Knowledge']];
  $('adminContent').innerHTML = `<div class="admin-catalogue">${linkList(pages)}</div><h2>Year and subject pages</h2><div class="catalogue-controls"><label>Year<select id="catalogueYear">${yearOptions}</select></label><label>Subject<select id="catalogueSubject">${subjects.map(([id,label]) => `<option value="${id}">${label}</option>`).join('')}</select></label><a class="primary" id="catalogueOpen" target="_blank" rel="noopener">Open page ↗</a></div><div class="admin-catalogue">${linkList([['OC','oc.html'],['Selective','selective.html'],['Year 3 NAPLAN','naplan.html?year=3'],['Year 5 NAPLAN','naplan.html?year=5'],['Parent guide','parents.html']])}</div>`;
  const update = () => { $('catalogueOpen').href = 'subject.html?year=' + $('catalogueYear').value + '&subject=' + $('catalogueSubject').value; };
  $('catalogueYear').onchange = update;
  $('catalogueSubject').onchange = update;
  update();
}
async function renderRecords(view, sequence) {
  if (!authorised) {
    $('adminContent').innerHTML = '<h2>Live records require developer access</h2><p>This design preview uses sample dashboards. Sign in with an active administrator account to review live records.</p><a class="primary" href="sign-in.html?next=masteradmin.html">Developer sign in</a>';
    return;
  }
  $('adminContent').textContent = 'Loading records…';
  const users = view === 'users';
  const query = users
    ? supabase.from('profiles').select('full_name,email,role,status,year_level').order('created_at', {ascending:false}).limit(100)
    : supabase.from('submissions').select('assignment_id,status,score,max_score,submitted_at').order('submitted_at', {ascending:false}).limit(100);
  const {data, error} = await query;
  if (sequence !== viewSequence) return;
  if (error) throw error;
  const rows = users
    ? (data || []).map(row => [row.full_name,row.email,row.role,row.status,row.year_level || '—'])
    : (data || []).map(row => [row.assignment_id,row.status,row.max_score ? row.score + '/' + row.max_score : '—',row.submitted_at ? new Date(row.submitted_at).toLocaleDateString('en-AU') : '—']);
  $('adminContent').innerHTML = '<p>Showing up to 100 recent records.</p>' + table(users ? ['Name','Email','Role','Status','Year'] : ['Assignment','Status','Score','Submitted'], rows);
}
async function showView(view) {
  if (!(view in views) || $('adminWorkspace').hidden) return;
  const sequence = ++viewSequence;
  $('adminTitle').textContent = views[view][0];
  $('adminIntro').textContent = views[view][1];
  document.querySelectorAll('.admin-sidebar [data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === view));
  $('adminPreviews').hidden = view !== 'previews';
  $('adminContent').hidden = view === 'previews';
  try {
    if (view === 'previews') return;
    if (view === 'pages') return pageCatalogue();
    if (view === 'users' || view === 'results') return await renderRecords(view, sequence);
    if (view === 'overview') {
      $('adminContent').innerHTML = `<h2>Review every experience</h2><div class="admin-catalogue">${linkList([['Student dashboard','dashboard.html?demo=student'],['Teacher dashboard','dashboard.html?demo=teacher'],['Parent dashboard','dashboard.html?demo=parent'],...pages])}</div>`;
    }
    if (view === 'questions') {
      $('adminContent').innerHTML = `<h2>Learning content</h2><p>Open an activity or inspect its existing source bank.</p><div class="admin-catalogue">${linkList([['Maths activities','practice.html'],['English activities','english-practice.html'],['Science activities','science-practice.html'],['Country Capitals','country-capitals.html'],['Maths source','js/year3to5-bank.js'],['English source','js/english-course-expansion.js'],['Science source','js/science-bank.js']])}</div>`;
    }
    if (view === 'design') {
      $('adminContent').innerHTML = '<h2>Acorn &amp; Shine palette</h2><div class="palette"><span style="background:#09164d;color:white">Navy · #09164D</span><span style="background:#008578;color:white">Teal · #008578</span><span style="background:#f8b515">Gold · #F8B515</span></div><h2>Dashboard viewport</h2><p>Choose a preview width, then open Dashboard previews.</p><div class="admin-preview-tabs"><button id="desktopPreview">Desktop</button><button id="mobilePreview">Mobile</button></div>';
      $('desktopPreview').onclick = () => { $('dashboardPreview').classList.remove('mobile-preview'); showView('previews'); };
      $('mobilePreview').onclick = () => { $('dashboardPreview').classList.add('mobile-preview'); showView('previews'); };
    }
  } catch (error) {
    if (sequence === viewSequence) $('adminContent').textContent = error.message || 'These records could not be loaded.';
  }
}

async function initialise() {
  $('pageQuickLinks').innerHTML = linkList(pages);
  new ResizeObserver(sizePreview).observe($('dashboardPreview').parentElement);
  document.querySelectorAll('[data-role]').forEach(button => { button.onclick = () => selectRole(button.dataset.role); });
  document.querySelectorAll('[data-view]').forEach(button => { button.onclick = () => showView(button.dataset.view); });
  $('adminSignOut').onclick = async () => {
    if (!previewOnly && supabase) await supabase.auth.signOut();
    location.replace('sign-in.html');
  };
  if (previewOnly) {
    $('adminGate').innerHTML = '<strong>Design preview.</strong> Dashboard previews use sample data. Live records require developer sign-in.';
    $('adminWorkspace').hidden = false;
    $('adminSignOut').textContent = 'Exit preview';
    selectRole(selectedRole);
    return;
  }
  if (!isSupabaseConfigured || !supabase) throw new Error('Connect the account service to use live developer access.');
  const {data, error} = await supabase.auth.getUser();
  if (error || !data.user) {
    location.replace('sign-in.html?next=masteradmin.html');
    return;
  }
  const claim = data.user.app_metadata?.role;
  const profile = await getProfile(data.user.id);
  if (!['admin','masteradmin'].includes(claim) || profile.role !== 'admin' || profile.status !== 'active') {
    throw new Error('Developer access needs an active admin profile and an administrator claim assigned in Supabase.');
  }
  authorised = true;
  $('adminGate').hidden = true;
  $('adminWorkspace').hidden = false;
  selectRole(selectedRole);
}
initialise().catch(error => {
  $('adminGate').replaceChildren();
  $('adminGate').append(document.createTextNode(error.message || 'Developer access could not be checked.'));
  const link = document.createElement('a');
  link.href = 'masteradmin.html?preview=1';
  link.textContent = ' Review the design preview →';
  $('adminGate').append(link);
});

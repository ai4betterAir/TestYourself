import { supabase, isSupabaseConfigured, requireUser, getProfile, formatDate } from './supabase-client.js?v=20260923';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function mountBox() {
  if (document.getElementById('writingInbox')) return document.getElementById('writingInbox');
  const host = document.getElementById('insightPanel') || document.getElementById('primaryPanel') || document.querySelector('main');
  if (!host) return null;
  const box = document.createElement('section');
  box.id = 'writingInbox';
  box.innerHTML = '<h3>Student writing</h3><div id="writingInboxList">Loading writing…</div>';
  host.after(box);
  return box;
}

async function init() {
  if (!isSupabaseConfigured || !supabase) {
    const demo = new URLSearchParams(location.search).get('demo');
    if (demo === 'teacher' || demo === 'parent') {
      const box = mountBox();
      if (box) box.querySelector('#writingInboxList').innerHTML = '<article class="task-card"><div><h3>Screens before bed · Introduction</h3><p>Jordan Lee · 86 words · preview</p><p>An hour of screen light at night steals the next morning’s focus. Screens should stay off in the last hour before bed.</p></div></article>';
    }
    return;
  }
  const user = await requireUser();
  if (!user) return;
  const profile = await getProfile(user.id);
  const box = mountBox();
  if (!box) return;
  let query = supabase.from('writing_pieces').select('id,student_id,topic,section,body,word_count,created_at').order('created_at', { ascending: false }).limit(20);
  const { data, error } = await query;
  if (error) {
    box.querySelector('#writingInboxList').textContent = error.message;
    return;
  }
  const rows = data || [];
  const ids = [...new Set(rows.map((r) => r.student_id))];
  let names = {};
  if (ids.length) {
    const { data: people } = await supabase.from('profiles').select('id,full_name').in('id', ids);
    (people || []).forEach((p) => { names[p.id] = p.full_name; });
  }
  if (!rows.length) {
    box.querySelector('#writingInboxList').innerHTML = profile.role === 'student'
      ? '<p>Your sent writing will appear here after you use Send to dashboard.</p>'
      : '<p>No student writing yet. Students send from Selective → Writing → Send to dashboard.</p>';
    return;
  }
  box.querySelector('#writingInboxList').innerHTML = rows.map((r) =>
    `<article class="task-card writing-piece"><div><h3>${esc(r.topic)} · ${esc(r.section)}</h3><p>${esc(names[r.student_id] || 'Student')} · ${r.word_count} words · ${formatDate(r.created_at, true)}</p><pre class="writing-body">${esc(r.body)}</pre></div></article>`
  ).join('');
}

init().catch((err) => {
  const box = mountBox();
  if (box) box.querySelector('#writingInboxList').textContent = err.message || 'Could not load writing.';
});

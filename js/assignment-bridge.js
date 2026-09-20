(() => {
  const assignmentId = new URLSearchParams(location.search).get('assignment');
  if (!assignmentId || !/^[0-9a-f-]{36}$/i.test(assignmentId)) return;
  const root = location.pathname.includes('/YR5/') ? '../' : '';
  let captured = null;

  const originalSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function(key, value) {
    originalSetItem.call(this, key, value);
    if (!/mark|test|progress|last/i.test(String(key))) return;
    try {
      const result = JSON.parse(value);
      const score = Number(result.score);
      const total = Number(result.total ?? result.attempted);
      if (Number.isFinite(score) && Number.isFinite(total) && total > 0) {
        captured = { score, total };
        const button = document.getElementById('assignmentSubmit');
        if (button) button.textContent = `Submit ${score}/${total}`;
      }
    } catch (_) {}
  };

  const loadConfig = () => new Promise(resolve => {
    if (window.SKILLUP_SUPABASE) return resolve();
    const script = document.createElement('script');
    script.src = `${root}js/supabase-config.js`;
    script.onload = resolve;
    script.onerror = resolve;
    document.head.appendChild(script);
  });

  const announce = (text, error = false) => {
    document.querySelector('.assignment-bridge-message')?.remove();
    const node = document.createElement('div');
    node.className = `assignment-bridge-message${error ? ' error' : ''}`;
    node.setAttribute('role','status');
    node.textContent = text;
    document.body.appendChild(node);
    setTimeout(() => node.remove(), 5000);
  };

  (async () => {
    await loadConfig();
    const module = await import(`${root}js/supabase-client.js`);
    if (!module.supabase) return;
    const { data: auth } = await module.supabase.auth.getUser();
    if (!auth.user) {
      const next = encodeURIComponent(location.pathname.split('/').pop() + location.search);
      location.replace(`${root}sign-in.html?next=${next}`);
      return;
    }
    const { data: assignment, error } = await module.supabase.from('assignments').select('id,title,due_at,allow_late').eq('id',assignmentId).single();
    if (error || !assignment) return announce('This assignment is unavailable for this account.', true);
    const bar = document.createElement('aside');
    bar.className = 'assignment-bridge';
    bar.setAttribute('aria-label','Current assignment');
    bar.innerHTML = `<div class="assignment-bridge-copy"><strong>${String(assignment.title).replace(/[&<>"']/g,'')}</strong><span>Due ${module.formatDate(assignment.due_at,true)} · Complete the activity, then submit.</span></div><a href="${root}dashboard.html">Dashboard</a><button id="assignmentSubmit" type="button">Submit completed work</button>`;
    document.body.appendChild(bar);
    document.getElementById('assignmentSubmit').onclick = async event => {
      event.currentTarget.disabled = true;
      const { error: submitError } = await module.supabase.rpc('record_assignment_submission', {
        assignment_uuid: assignmentId,
        score_input: captured?.score ?? null,
        max_score_input: captured?.total ?? null
      });
      event.currentTarget.disabled = false;
      if (submitError) return announce(module.friendlyError(submitError), true);
      announce(captured ? `Submitted ${captured.score}/${captured.total}.` : 'Assignment marked as submitted.');
      event.currentTarget.textContent = 'Submitted ✓';
    };
  })().catch(() => announce('Could not connect this activity to the assignment.', true));
})();

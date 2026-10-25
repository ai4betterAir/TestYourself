(() => {
  const root = location.pathname.includes('/YR5/') ? '../' : '';
  const main = document.querySelector('main');
  const pageName = location.pathname.split('/').pop() || 'index.html';

  if (['selective-practice.html', 'selective.html'].includes(pageName)) {
    ['css/selective-color.css', 'css/vocab-learn.css', 'css/writing-workshop.css'].forEach((href) => {
      if (document.querySelector(`link[href*="${href.split('/').pop()}"]`)) return;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `${root}${href}`;
      document.head.appendChild(link);
    });
    ['js/selective-writing-vocab-bank.js', 'js/selective-writing-workshop.js', 'js/selective-writing-boot.js', 'js/selective-writing-punct-help.js', 'js/selective-writing-save.js'].forEach((src) => {
      if (document.querySelector(`script[src*="${src.split('/').pop()}"]`)) return;
      const s = document.createElement('script');
      s.src = `${root}${src}`;
      document.body.appendChild(s);
    });
  }

  if (main && !main.id) main.id = 'main-content';

  const localSessionKey = 'skillupLocalSession';
  const readLocalSession = () => {
    try { return JSON.parse(localStorage.getItem(localSessionKey) || 'null'); } catch { return null; }
  };
  const dashboardHref = `${root}dashboard.html`;
  const roleLabel = role => role === 'parent' ? 'Parent' : role === 'teacher' ? 'Teacher' : 'Student';

  const renderAccountNav = (session) => {
    const actions = document.querySelector('.nav-actions');
    if (!actions || !session?.fullName) return;
    const name = String(session.fullName).trim();
    const role = roleLabel(session.role);
    actions.innerHTML = `
      <a class="link-signin site-account-link" href="${dashboardHref}" aria-label="Open your ${role} dashboard">
        <span>${name}</span><small>${role} dashboard</small>
      </a>
      <a class="link-signup site-signout" href="#" role="button">Sign out</a>
    `;
    const signOut = actions.querySelector('.site-signout');
    signOut?.addEventListener('click', async event => {
      event.preventDefault();
      localStorage.removeItem(localSessionKey);
      try {
        const moduleUrl = new URL(`${root}js/supabase-client.js?v=20260927`, location.href).href;
        const client = await import(moduleUrl);
        if (client.supabase) await client.supabase.auth.signOut();
      } catch {}
      location.reload();
    });
  };

  if (!document.getElementById('site-account-nav-style')) {
    const style = document.createElement('style');
    style.id = 'site-account-nav-style';
    style.textContent = '.site-account-link{display:inline-flex!important;align-items:center;gap:7px;line-height:1.05}.site-account-link small{font-size:.68rem;opacity:.72;font-weight:800}.site-signout{cursor:pointer}';
    document.head.appendChild(style);
  }

  const local = readLocalSession();
  if (local) renderAccountNav(local);

  // Supabase sessions are persistent across pages. Read them when the real
  // account service is configured, without blocking the public learning page.
  try {
    const moduleUrl = new URL(`${root}js/supabase-client.js?v=20260927`, location.href).href;
    import(moduleUrl).then(async client => {
      if (!client.supabase) return;
      const { data } = await client.supabase.auth.getSession();
      const session = data?.session;
      if (!session?.user) return;
      const profile = await client.getProfile(session.user.id).catch(() => null);
      if (profile) renderAccountNav({ fullName: profile.full_name || session.user.email, role: profile.role });
    }).catch(() => {});
  } catch {}
})();

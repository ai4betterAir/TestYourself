/* SkillUP 2026 — shared navigation and progressive accessibility enhancements.
   Does not modify question banks, grading, saved work, or authentication state. */
(() => {
  'use strict';
  function init() {
    if (!document.body || document.getElementById('su26-topbar')) return;
    const file = location.pathname.split('/').pop() || 'index.html';
    const root = /\/YR5\//.test(location.pathname) ? '../' : '';
    const isDashboard = file === 'dashboard.html';
    document.body.classList.add('su26-theme');
    if (isDashboard) return; // Keep dashboard's sidebar and account navigation intact.
    const currentYear = new URLSearchParams(location.search).get('year');
    const inLearning = /^(learning|subject|learn|maths|english|vocabulary|science|general-knowledge|practice|english-practice|science-practice|word-problems|algebra|assessment-practice|year\d+-.+)\.html$/.test(file) || !!currentYear;
    const routes = [
      ['Home','index.html',['index.html']],
      ['Learning','learning.html',['learning.html','subject.html','learn.html','maths.html','english.html','vocabulary.html','science.html','general-knowledge.html']],
      ['NAPLAN','naplan.html',['naplan.html','naplan-practice.html']],
      ['OC','oc.html',['oc.html','oc-practice.html']],
      ['Selective','selective.html',['selective.html','selective-practice.html']],
      ['Parents','parents.html',['parents.html']],
      ['Teachers','accounts.html?role=teacher',['accounts.html']]
    ];
    const makeLink = (label, url, active) => {
      const a = document.createElement('a');
      a.textContent = label;
      a.href = root + url;
      if (active) a.setAttribute('aria-current','page');
      return a;
    };
    const header = document.createElement('header');
    header.id = 'su26-topbar';
    const inner = document.createElement('div');
    inner.className = 'su26-inner';
    const brand = document.createElement('a');
    brand.className = 'su26-logo';
    brand.href = root + 'index.html';
    brand.setAttribute('aria-label','SkillUP home');
    const logo = document.createElement('img');
    logo.src = root + 'assets/skillup-logo.svg';
    logo.alt = 'SkillUP';
    brand.appendChild(logo);
    const nav = document.createElement('nav');
    nav.className = 'su26-links';
    nav.id = 'su26-navigation';
    nav.setAttribute('aria-label','Main navigation');
    for (const [label,href,files] of routes) {
      let active = files.includes(file);
      if (label === 'Learning' && !routes.some(r => r !== routes[1] && r[2].includes(file)) && inLearning) active = true;
      nav.appendChild(makeLink(label,href,active));
    }
    const actions = document.createElement('div');
    actions.className = 'su26-actions';
    const signin = makeLink('Sign in','sign-in.html',false);
    signin.className = 'su26-signin';
    const start = makeLink('Start learning','learning.html',false);
    start.className = 'su26-start';
    actions.append(signin,start);
    const toggle = document.createElement('button');
    toggle.type='button';
    toggle.className='su26-toggle';
    toggle.setAttribute('aria-controls',nav.id);
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open navigation menu');
    toggle.textContent='☰';
    function closeMenu(){
      header.classList.remove('su26-open');
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Open navigation menu');
      toggle.textContent='☰';
    }
    toggle.addEventListener('click',()=>{
      const open=header.classList.toggle('su26-open');
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');
      toggle.textContent=open?'×':'☰';
    });
    nav.addEventListener('click',event=>{
      if(event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown',event=>{if(event.key==='Escape') closeMenu()});
    document.addEventListener('click',event=>{if(!header.contains(event.target)) closeMenu()});
    inner.append(brand,nav,actions,toggle);
    header.appendChild(inner);
    if(inLearning && !['sign-in.html','sign-up.html'].includes(file)){
      const yearbar=document.createElement('nav');
      yearbar.className='su26-yearbar';
      yearbar.setAttribute('aria-label','Choose a school year');
      const sub=document.createElement('div');
      sub.className='su26-yearbar-inner';
      const caption=document.createElement('b');
      caption.textContent='Choose year';
      sub.append(caption);
      for(const y of ['K','1','2','3','4','5','6']){
        sub.append(makeLink(y==='K'?'Kindy':'Year '+y,
          'learning.html?year='+encodeURIComponent(y),currentYear===y));
      }
      yearbar.appendChild(sub);
      header.appendChild(yearbar);
    }
    const skip=document.createElement('a');
    skip.href='#main-content';
    skip.className='su26-skip';
    skip.textContent='Skip to main content';
    skip.style.cssText='position:absolute;left:12px;top:-100px;z-index:10001;padding:12px 16px;background:#fff;color:#14243f;border:2px solid #315fdf;border-radius:10px;font-weight:800';
    skip.addEventListener('focus',()=>{skip.style.top='8px'});
    skip.addEventListener('blur',()=>{skip.style.top='-100px'});
    const main=document.querySelector('main');
    if(main && !main.id) main.id='main-content';
    document.body.prepend(header);
    document.body.prepend(skip);
    document.body.classList.add('su26-ready');

    // Local demonstration sessions are not proof of authentication.
    // Prefer an actual Supabase session when configured.
    try {
      const moduleUrl=new URL(root+'js/supabase-client.js',location.href).href;
      import(moduleUrl).then(async module=>{
        if(!module.supabase) return;
        const result=await module.supabase.auth.getSession();
        if(result?.data?.session?.user){
          signin.href=root+'dashboard.html';
          signin.textContent='Dashboard';
          signin.setAttribute('aria-label','Open your dashboard');
        }
      }).catch(()=>{});
    } catch {}

    // Mark illustrative activity visuals, without claiming saved progress.
    document.querySelectorAll('.dashboard-live').forEach(node=>{
      node.textContent='EXAMPLE';
      node.setAttribute('aria-label','Example learning activities');
    });
    document.querySelectorAll('a[href="#"]').forEach(a=>{
      if(a.matches('.su26-links a')) return;
      if(!a.hasAttribute('aria-label') && !a.textContent.trim()) a.setAttribute('aria-label','More information');
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
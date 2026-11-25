window.SelectiveLayout = (() => {
 function node(tag, text, cls) {
   const el=document.createElement(tag);
   if(text) el.textContent=text;
   if(cls) el.className=cls;
   return el;
 }
 function anchor(label,url) {const a=node('a',label);a.href=url;return a}
 function mount(host,title,items,active,topicUrl) {
   document.body.classList.add('selective-layout');
   const header=document.querySelector('.sel-header');
   const nav=header.querySelector('nav');
   nav.replaceChildren(anchor('Home','index.html'),anchor('Practice','practice.html'),anchor('About','about.html'));
   const account=node('div',null,'nav-actions');
   account.append(anchor('Sign in','sign-in.html'),anchor('Sign up','sign-up.html'));header.append(account);
   const crumb=node('div',null,'sl-crumb');crumb.append(anchor('Selective','selective.html'),' / '+title);
   const titleEl=node('h1',title,'sl-title');
   const grid=node('div',null,'sl-grid'),side=node('aside',null,'sl-side'),main=node('div',null,'sl-content');
   host.prepend(crumb,titleEl,grid);grid.append(side,main);
   const heading=node('h2',({ 'Mathematical Reasoning':'Maths','Thinking Skills':'Thinking' }[title]||title)+' topics');
   const search=node('input');search.type='search';search.placeholder='Search topics…';search.setAttribute('aria-label','Search '+title+' topics');
   const list=node('nav',null,'sl-list');list.setAttribute('aria-label',title+' topics');
   for(const [id,label] of items){const a=anchor(label,topicUrl(id));if(id===active)a.setAttribute('aria-current','page');list.append(a)}
   const empty=node('p','No matching topics');empty.hidden=true;
   search.oninput=()=>{const term=search.value.trim().toLowerCase();for(const a of list.children)a.hidden=!a.textContent.toLowerCase().includes(term);empty.hidden=Array.from(list.children).some(a=>!a.hidden)};
   const picker=node('details',null,'sl-picker'), summary=node('summary','Choose topic');
   picker.append(summary,heading,search,list,empty);side.append(picker);
   const desktop=matchMedia('(min-width:741px)');
   function resizePicker(){picker.open=desktop.matches}
   resizePicker();desktop.addEventListener('change',resizePicker);
   const selected=list.querySelector('[aria-current]');if(selected) list.scrollTop=Math.max(0,selected.offsetTop-list.offsetTop-list.clientHeight/2);
   return main;
 }
 function activities(label,url,active) {
   const nav=node('nav',null,'sl-activities');nav.setAttribute('aria-label','Topic activities');nav.append(node('strong','Explore '+label));
   for(const [key,name] of [['learn','Learn'],['practice','Practice'],['mock','Test']]){const a=anchor(name,url(key));if(active===key)a.setAttribute('aria-current','page');nav.append(a)}
   return nav;
 }
 return {node,anchor,mount,activities};
})();
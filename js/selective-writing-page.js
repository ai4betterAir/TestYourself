(() => {
 const lessons=[["openings","Narrative openings","Begin with an event that gives the reader a question to carry into the next paragraph.","The school bell rang on a Sunday morning.","The invitation arrived forty years late.","At the first ring, Nina counted the empty swings. At the second, one began to move.","What does the character notice first? Add one detail that makes it surprising."],["character","Character","Reveal a trait through a choice, an action or a line of dialogue.","Two students find a wallet after school. Show how their reactions differ.","A nervous captain must choose who takes the final shot.","Milo counted the notes. Ana turned the wallet over to find a name.","Give each character a different action. Let readers infer the trait."],["setting","Setting","Choose sensory details that show where the character is and how the place feels.","Describe a familiar playground just after a storm.","Describe an empty library before it opens.","Rain dripped from the climbing frame. Under the slide, a dry patch of sand still held yesterday’s footprints.","Use two senses. Choose details your character would actually notice."],["dialogue","Dialogue","Give each speaker a purpose. Start a new paragraph when the speaker changes.","Write a conversation in which one friend is keeping a surprise.","Write a disagreement about a mysterious noise.","“Why is your bag moving?” asked Jess.\\nLuca tightened the zip. “Could we talk outside?”","What does each speaker want? Read the conversation aloud."],["paragraphs","Paragraphing","Group sentences around one moment or idea. Begin a new paragraph when time, place or focus shifts.","Describe the last minute before a race and the first minute afterwards.","Show how a quiet room changes when an unexpected guest arrives.","Before the whistle, all I heard was my breathing.\\n\\nAfterwards, the cheers seemed to follow me all the way home.","Decide where the shift happens. Use the paragraph break to emphasise it."],["persuasion","Persuasive writing","State a clear position, support it with a reason and explain how your example helps the audience.","Persuade your school to introduce a weekly outdoor lesson.","Write to the principal about a lunchtime quiet space.","A quiet corner would give pupils a place to recharge. Even ten minutes with a book could help someone return to class ready to listen.","Who is your audience? Explain why your reason matters to them."],["vocabulary","Vocabulary","Choose precise verbs and concrete nouns to make meaning clearer.","Rewrite ‘She went across the room’ in two ways to show different moods. Explain your choices.","Describe someone entering the playground without using ‘walked’ or ‘went’.","She crept past the desks. Changing ‘crept’ to ‘strode’ suggests confidence instead of caution.","Which word carries the mood? Check that your verb fits the scene."],["editing","Editing","Revise for meaning first, then check sentence boundaries, punctuation and spelling.","Edit this run-on sentence and explain your changes: We missed the bus it started to rain we ran home.","Improve this sentence for clarity: When Ali met Tom he was holding his bag.","We missed the bus. When it started to rain, we ran home. The full stop separates the events, and ‘when’ clarifies their order.","Read it aloud. Check who did what and where each complete thought ends."]];
 const {mount,node,activities,anchor}=SelectiveLayout;
 const params=new URLSearchParams(location.search);
 const chosen=lessons.find(l=>l[0]===params.get('topic'));
 const phase=chosen?({learn:'learn',practice:'practice',mock:'mock'}[params.get('view')]||'learn'):'practice';
 const href=(id,mode)=>id==='mixed'?'selective-writing.html':'selective-writing.html?topic='+encodeURIComponent(id)+'&view='+mode;
 const main=mount(document.querySelector('.sl-wrap'),'Writing',[['mixed','Mixed prompts'],...lessons.map(l=>[l[0],l[1]])],chosen?.[0]||'mixed',id=>href(id,'learn'));
 const card=node('article',null,'sl-card');main.append(card);
 const pick=()=>lessons[Math.floor(Math.random()*lessons.length)];
 let lesson=chosen||pick(),index=Math.random()<0.5?3:4,foot;
 function render(){
   card.replaceChildren();const [id,label,method,,,example,tip]=lesson;
   const key='acorn-selective-writing:'+id+':'+index+':'+phase;
   card.append(node('h2',phase==='learn'?label:phase==='mock'?label+' test':'Writing prompt'),node('p',label,'sl-tag'));
   card.append(node('p',phase==='learn'?method:lesson[index]));
   if(phase==='learn'){
     card.append(node('h3','Worked example'),node('p',example),node('h3','Try this strategy'),node('p',tip),anchor('Practise this skill →',href(id,'practice')));
   }else{
     const box=node('textarea');box.setAttribute('aria-label','Your written response');box.placeholder='Start your response here…';
     try{box.value=localStorage.getItem(key)||''}catch{}
     const count=node('p'),status=node('p');status.setAttribute('role','status');
     function updateCount(){const words=box.value.trim().split(/\s+/).filter(Boolean).length;count.textContent=words+(words===1?' word':' words')}
     box.oninput=()=>{updateCount();status.textContent=''};updateCount();
     const tools=node('div',null,'sl-tools'),hint=node('p',tip);hint.hidden=true;
     function button(label,action){const b=node('button',label);b.type='button';b.onclick=action;tools.append(b);return b}
     if(phase!=='mock')button('Show planning tips',e=>{hint.hidden=!hint.hidden;e.currentTarget.textContent=hint.hidden?'Show planning tips':'Hide planning tips'});
     function save(){try{localStorage.setItem(key,box.value);status.textContent='Draft saved on this device.';return true}catch{status.textContent='This browser could not save your draft.';return false}}
     button('Save draft',save).className='sl-primary';
     if(phase==='mock'){
       button('Finish and review',()=>{if(!box.value.trim()){status.textContent='Write a response before reviewing.';box.focus();return}if(save()){hint.hidden=false;hint.textContent='Review your response: '+tip+' Example: '+example;status.textContent='Response saved for self-review.'}});
     }else button('Next prompt →',()=>{if(box.value&&!save())return;if(!chosen){const other=lessons.filter(l=>l!==lesson);lesson=other[Math.floor(Math.random()*other.length)]}index=index===3?4:3;render()});
     card.append(box,count,tools,hint,status);
   }
   const nav=activities(label,mode=>href(id,mode),chosen?phase:'');if(foot)foot.replaceWith(nav);else main.append(nav);foot=nav;
 }
 render();
 main.append(anchor('Writing vocabulary questions','selective-practice.html?stream=writing&vocab=1'));

})();
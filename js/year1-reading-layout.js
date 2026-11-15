/* Presentation layer for the existing 60-reading Year 1 library. */
(function () {
  const el = id => document.getElementById(id);
  const modes = ['read','words','questions'];
  const panelIds = {read:'readingReadPanel',words:'readingWordPanel',questions:'readingQuestionPanel'};
  function setMode(mode, focus = false) {
    modes.forEach(key => {
      const active = key === mode;
      el(panelIds[key]).hidden = !active;
      const tab = el('readingTab-'+key);
      tab.setAttribute('aria-selected', String(active));tab.tabIndex = active ? 0 : -1;
    });
    if(focus) el('readingTab-'+mode).focus();
  }
  modes.forEach((mode,index) => {
    const tab = el('readingTab-'+mode);
    tab.onclick = () => setMode(mode);
    tab.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
      setMode(modes[next],true);
    });
  });
  document.querySelectorAll('[data-reading-mode]').forEach(button=>button.onclick=()=>{setMode(button.dataset.readingMode,true);});
  const search = el('readingSearch');
  function searchLibrary() {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    const select = el('readingLessonSelect');select.replaceChildren();
    el('lessonButtons').querySelectorAll('button').forEach(button=>{
      const visible = button.textContent.toLocaleLowerCase().includes(query);
      button.hidden = !visible;
      if(visible){
        count++;
        const option = document.createElement('option');option.value=button.dataset.i;option.textContent=button.textContent;option.selected=Number(button.dataset.i)===current;select.append(option);
      }
      if(Number(button.dataset.i)===current)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');
    });
    el('readingMatches').textContent=count+' '+(count===1?'reading':'readings')+(query?' found':' in this collection');
    el('readingEmpty').hidden=count>0;select.disabled=count===0;
    if(count && !Array.from(select.options).some(option=>Number(option.value)===current))select.selectedIndex=-1;
    document.querySelectorAll('#readingFilters button').forEach(button=>button.setAttribute('aria-pressed',String(button.classList.contains('active'))));
  }
  search.addEventListener('input',searchLibrary);
  el('readingLessonSelect').onchange=event=>{const index=Number(event.target.value);if(Number.isInteger(index)&&lessons[index]){current=index;render();}};
  const previousRender = render;
  render = function () {
    previousRender();
    const lesson = lessons[current];
    el('storyWordCount').textContent=lesson.s.trim().split(/\s+/).length;
    el('readingSummary').textContent=lesson.source==='Vocabulary Story'?'A longer story with word meanings and extra thinking questions.':'Read slowly. Picture the story in your mind.';
    el('readingStoryCopy').textContent=lesson.s;
    el('mainFeedback').textContent='';
    el('readingWordMeanings').replaceChildren();
    if(lesson.vocab){lesson.vocab.forEach(([word,meaning])=>{const row=document.createElement('div');const term=document.createElement('b');term.textContent=word;const definition=document.createElement('span');definition.textContent=meaning;row.append(term,definition);el('readingWordMeanings').append(row);});}
    el('totalReadings').textContent=lessons.length;
    el('readingStoryCopy').closest('details').open=false;
    searchLibrary();setMode('read');
  };
  el('mainChoices').addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;el('mainFeedback').textContent=button.classList.contains('correct')?'Correct! You found the main idea.':'Look at what the whole story is mostly about. Read it again and try another answer.';});
  el('fillInput').addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();el('fillCheck').click();}});
  render();
})();

function earlyTopicPage(year, subject, index) {
  const subjects = {maths:'Maths',english:'English',reading:'Reading',vocabulary:'Vocabulary',science:'Science','general-knowledge':'General Knowledge'};
  const colours = {maths:['#e0f4fa','#07597d'],english:['#ffeadb','#924627'],reading:['#e0efe6','#276749'],vocabulary:['#f0e6fa','#704187'],science:['#def1ef','#17675c'],'general-knowledge':['#fff0ce','#865510']};
  const slug = text => text.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const esc = text => String(text).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const label = year==='K'?'Kindergarten':'Year '+year;
  const group = subject==='general-knowledge'?'gk':subject;
  const rows = year==='K'?kindergartenActivities[subject]:year==='1'?year1Topics.filter(t=>t.id.startsWith(group+'-')):(year==='6'?year6Lessons:Number(year)<=3?year23Lessons:year45Lessons)[year]?.[subject];
  if (!rows || !Number.isInteger(index) || !rows[index]) return null;
  const row=rows[index];
  let title, model, question, answers, correct, explanation, lead, image;
  if (year==='K') {
    [title,model,question]=row;
    correct=index%3;
    answers=row.slice(4);
    answers.splice(correct,0,row[3]);
    explanation=row[3]+'. '+model;
    lead=kindergartenLeads[subject][index];
    const folder=['reading','vocabulary'].includes(subject)?'english':subject;
    image=folder+'-homepages/K-'+index+'.webp';
  } else {
    ({title,question,answers,correct,explain:explanation,tag:lead,image}=row);
    model=row.lesson.model;
  }
  const subjectUrl='subject.html?year='+year+'&subject='+subject;
  const id=slug(title);
  let more=''; let action='';
  if(subject==='maths'){more='practice.html?year='+year+'&topic='+id+'&mode=practice';action='Start maths practice';}
  if(subject==='science'){more='science-practice.html?year='+year+'&topic='+encodeURIComponent(title);action='Open science practice';}
  if(year==='1' && subject==='english'){
    const skill=({spelling:'spelling',writing:'writing'})[id]||'grammar';
    more='english-practice.html?grade=1&skill='+skill;action='More English practice';
  }
  if(year==='1' && subject==='reading'){more='english-year1-reading.html';action='Open the reading library';}
  if(year==='1' && subject==='vocabulary'){more='vocabulary-year1-stories.html';action='Explore vocabulary stories';}
  if (['2','3','4','5','6'].includes(year)) {
    if (subject==='english') {
      const skill=/spell/i.test(id)?'spelling':/writ|edit|paragraph/i.test(id)?'writing':'grammar';
      more='english-practice.html?grade='+year+'&skill='+skill;
      action='More English practice';
    }
    if (subject==='reading') {
      more=year==='2'?'english-year2-reading.html':'english-practice.html?grade='+year+'&skill=reading';
      action='More reading practice';
    }
    if (subject==='vocabulary') {
      more='vocabulary-year'+year+'.html';
      action='More vocabulary practice';
    }
    if (subject==='general-knowledge' && id==='country-capitals') {
      more='country-capitals.html';
      action='Practise country capitals';
    }
  }
  const nextIndex=(index+1)%rows.length;
  const nextTitle=year==='K'?rows[nextIndex][0]:rows[nextIndex].title;
  function route(i) {

    return 'early-topic.html?year='+year+'&subject='+subject+'&lesson='+i;
  }
  const sectionLabel=subject==='reading'?'Read together':subject==='science'?'Look closely':subject==='maths'?'Work it out':'Explore together';
  const [tint,ink]=colours[subject];
  const header='<header><a href="index.html"><img src="assets/acorn-and-shine-logo-transparent.png" alt="Acorn &amp; Shine"></a><nav aria-label="Main navigation"><a href="index.html">Home</a><a href="practice.html?year='+year+'">Practice</a><a href="about.html">About</a><a href="sign-in.html">Sign In</a></nav></header>';
  const html=header+`<main style="--tint:${tint};--ink:${ink}"><section class="early-hero"><div><nav class="crumb" aria-label="Breadcrumb"><a href="learning.html?year=${year}">${label}</a> / ${subject==='reading'?'<a href="subject.html?year='+year+'&amp;subject=english">English</a> / ':''}<a href="${esc(subjectUrl)}">${subjects[subject]}</a></nav><h1>${esc(title)}</h1><p>${esc(lead)}</p><a class="action" href="#activity">Try the activity</a></div><img src="assets/${esc(image)}" alt=""></section>
  <section class="early-work" id="activity"><article><h2>${sectionLabel}</h2><p>${esc(model)}</p></article><form data-key="${correct}"><fieldset><legend>${esc(question)}</legend>${answers.map((v,i)=>'<label><input required type="radio" name="choice" value="'+i+'"><span>'+esc(v)+'</span></label>').join('')}</fieldset><button class="action">Check answer</button><output aria-live="polite"></output></form></section>
  <nav class="early-next" aria-label="Continue learning"><a href="${esc(subjectUrl)}">← All ${subjects[subject]} topics</a>${more?'<a href="'+esc(more)+'">'+action+' →</a>':''}<a href="${esc(route(nextIndex))}">Next · ${esc(nextTitle)} →</a></nav></main>`;
  return {title,html,explanation};
}
const kindergartenLeads={
 maths:['Count a group of objects.','Find the missing number.','Join two groups together.','Recognise shapes by their features.','Spot the part that repeats.','Compare lengths using equal units.'],
 english:['Listen for a starting sound.','Blend sounds to read a word.','Build a complete thought.','Write a name with a capital.','Give a sentence an ending.','Choose words for a useful label.'],
 reading:['Blend sounds together.','Use a scene to find meaning.','Retell events in order.','Meet the characters in a story.','Find a detail in the text.','Match your voice to the story.'],
 vocabulary:['Discover words you hear at school.','Name the things around you.','Find words that show actions.','Describe how something feels.','Sort words that belong together.','Use a story to discover a word.'],
 science:['Notice how living things grow.','Look for signs of moving air.','Choose a material for a purpose.','Investigate how objects move.','Discover how shadows form.','Describe what you can observe.'],
 'general-knowledge':['Meet the people in your neighbourhood.','Discover an Australian animal.','Identify animals by their features.','Notice changes after rain.','Explore ways people celebrate.','Find everyday tools that help us.']
};

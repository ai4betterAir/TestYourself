(function(){
const q=new URLSearchParams(location.search);
let year=q.get('year')||localStorage.getItem('skillupYear')||'1';
if(!['K','1','2','3','4','5','6'].includes(year))year='1';
let subject=q.get('subject')||'maths';
const subjects={
 maths:{label:'Maths',icon:'maths',tag:'Think clearly. Solve confidently.',copy:'Build number sense, calculation skills, measurement, geometry and problem solving at the right level.'},
 english:{label:'English',icon:'english',tag:'Write clearly. Use language well.',copy:'Build grammar, spelling, writing and language skills with structured practice.'},
 reading:{label:'Reading',icon:'reading',tag:'Read. Understand. Think.',copy:'Develop fluency, comprehension and confidence with age-appropriate texts.'},
 vocabulary:{label:'Vocabulary',icon:'vocab',tag:'Discover words. Use them well.',copy:'Grow word meaning, spelling and confident word choice through focused practice.'},
 science:{label:'Science',icon:'science',tag:'Explore. Ask. Discover.',copy:'Investigate living things, materials, forces, Earth and the world around us.'},
 'general-knowledge':{label:'General Knowledge',icon:'gk',tag:'Discover the wider world.',copy:'Learn about Australia, places, nature, communities, culture and everyday knowledge.'}
};
if(!subjects[subject])subject='maths';
const label=year==='K'?'Kindy':'Year '+year;
const meta=subjects[subject];
document.body.dataset.subject=subject;
document.title=label+' '+meta.label+' | SkillUP';
document.getElementById('hero-year').textContent=label;
document.getElementById('hero-subject').textContent=meta.label;
document.getElementById('hero-tagline').textContent=meta.tag;
document.getElementById('hero-copy').textContent=meta.copy;
document.getElementById('eyebrow').textContent=label.toUpperCase()+' · '+meta.label.toUpperCase();
document.getElementById('crumb-label').textContent=label+' '+meta.label;
document.getElementById('topics-title').textContent='Choose a '+meta.label+' topic';
document.getElementById('return-title').textContent='Continue your '+label+' learning journey';
document.getElementById('year-link').href='learning.html?year='+encodeURIComponent(year);
document.getElementById('back-year').href='learning.html?year='+encodeURIComponent(year);
document.getElementById('back-year').textContent='Back to '+label;
document.getElementById('return-link').href='learning.html?year='+encodeURIComponent(year);
document.querySelector('#hero-icon use').setAttribute('href','assets/skillup-icons.svg#'+meta.icon);

const maths={
 K:[['Counting','Count objects and recognise numbers.'],['Number order','Put numbers in the correct order.'],['Simple addition','Join small groups together.'],['Shapes','Recognise common 2D and 3D shapes.'],['Patterns','Copy and continue simple patterns.'],['Measurement','Compare length, size and capacity.']],
 '1':[['Number & place value','Count, read, write and compare numbers.'],['Addition','Add numbers with confidence.'],['Subtraction','Take away and find differences.'],['Shapes & patterns','Recognise shapes and continue patterns.'],['Measurement','Explore length, mass and capacity.'],['Money','Recognise and use Australian coins.'],['Time','Read clocks and understand days.'],['Data & graphs','Collect, sort and show information.'],['Problem solving','Use maths in everyday situations.']],
 '2':[['Numbers to 1000','Read, order and partition larger numbers.'],['Addition & subtraction','Use efficient written and mental strategies.'],['Multiplication','Build equal groups and arrays.'],['Fractions','Explore halves, quarters and eighths.'],['Measurement','Measure length, mass and capacity.'],['Time & money','Use clocks, calendars and Australian money.'],['Geometry','Explore shapes, position and transformations.'],['Data','Read and create simple displays.']],
 '3':[['Place value','Work confidently with larger whole numbers.'],['Addition & subtraction','Apply written and mental strategies.'],['Multiplication & division','Build facts and solve equal-group problems.'],['Fractions','Represent and compare common fractions.'],['Measurement','Length, area, mass and capacity.'],['Time & money','Solve practical time and money problems.'],['Geometry','Angles, shapes and location.'],['Data & chance','Read graphs and describe simple chance.']],
 '4':[['Whole numbers','Use place value with larger numbers.'],['Four operations','Solve multi-step calculation problems.'],['Fractions & decimals','Connect fractions and decimal notation.'],['Measurement','Perimeter, area, mass and capacity.'],['Geometry','Angles, symmetry and 2D/3D shapes.'],['Time & money','Solve real-world time and financial problems.'],['Data & chance','Interpret displays and simple probability.'],['Problem solving','Choose strategies for unfamiliar problems.']],
 '5':[['Whole numbers','Read, compare and calculate with large numbers.'],['Operations','Use efficient strategies for all four operations.'],['Fractions & decimals','Compare, add and represent fractions and decimals.'],['Percentages','Connect common fractions, decimals and percentages.'],['Measurement','Area, perimeter, volume and units.'],['Geometry','Angles, transformations and coordinates.'],['Data & chance','Interpret data and probability situations.'],['Problem solving','Apply maths in multi-step contexts.']],
 '6':[['Number & place value','Work flexibly with large numbers and decimals.'],['Fractions, decimals & percentages','Convert, compare and calculate.'],['Operations','Solve complex multi-step calculations.'],['Patterns & algebra','Describe patterns and unknown values.'],['Measurement','Area, volume, scale and unit conversions.'],['Geometry','Angles, coordinates and transformations.'],['Data & chance','Analyse data and probability.'],['Problem solving','Reason through unfamiliar real-world problems.']]
};
const english={
 K:[['Letters & sounds','Recognise letters and common sounds.'],['Words','Build and read simple words.'],['Sentences','Understand what makes a sentence.'],['Capital letters','Use capitals for names and sentence starts.'],['Full stops','Know when a sentence ends.'],['Early writing','Write simple words and messages.']],
 '1':[['Sentences','Build complete simple sentences.'],['Grammar','Use nouns, verbs and simple sentence rules.'],['Spelling','Practise common words and sound patterns.'],['Writing','Plan and write short texts.'],['Phonics','Connect letters and sounds.'],['Punctuation','Use capitals, full stops and question marks.']],
 '2':[['Sentence structure','Build stronger simple and compound sentences.'],['Grammar','Use nouns, verbs, adjectives and pronouns.'],['Spelling patterns','Apply common letter and sound patterns.'],['Punctuation','Use capitals, commas and sentence punctuation.'],['Writing','Write clear recounts, descriptions and stories.'],['Editing','Check spelling, punctuation and meaning.']],
 '3':[['Grammar','Use sentence parts and verb tense accurately.'],['Punctuation','Apply dialogue and sentence punctuation.'],['Spelling','Use patterns, prefixes and suffixes.'],['Paragraphs','Group related ideas clearly.'],['Writing','Plan narratives, information and persuasive texts.'],['Editing','Improve clarity, grammar and spelling.']],
 '4':[['Complex sentences','Use clauses and varied sentence structures.'],['Grammar','Control tense, agreement and word classes.'],['Spelling','Apply morphology and word patterns.'],['Punctuation','Use direct speech and commas accurately.'],['Writing','Develop structured paragraphs and texts.'],['Editing','Improve cohesion, vocabulary and accuracy.']],
 '5':[['Grammar & cohesion','Connect ideas clearly across sentences.'],['Punctuation','Use punctuation for meaning and clarity.'],['Spelling','Use roots, prefixes and suffixes.'],['Paragraph structure','Organise ideas logically.'],['Writing','Develop persuasive, informative and imaginative texts.'],['Editing','Refine vocabulary, grammar and structure.']],
 '6':[['Sentence control','Use varied and sophisticated sentence structures.'],['Grammar','Apply accurate tense, agreement and cohesion.'],['Spelling & morphology','Use roots and word families strategically.'],['Punctuation','Control punctuation for meaning and effect.'],['Writing','Plan and craft extended texts for audience and purpose.'],['Editing','Revise for precision, flow and impact.']]
};
const reading={
 K:[['Sounds & words','Blend sounds and recognise simple words.'],['Picture clues','Use pictures to support meaning.'],['Story order','Put simple events in order.'],['Characters','Talk about who is in a story.'],['Key details','Find simple information in a text.'],['Read aloud','Build confidence and fluency.']],
 '1':[['Reading library','Explore short Year 1 passages.'],['Main idea','Find what a short text is mostly about.'],['Characters','Understand who is in the story.'],['Sequence','Put story events in the right order.'],['Find information','Answer questions using the text.'],['New words','Work out simple words from context.']],
 '2':[['Fluency','Read smoothly with growing expression.'],['Main idea','Identify the central message or topic.'],['Sequence','Order events and information.'],['Characters & setting','Explain key story elements.'],['Literal meaning','Find information stated in the text.'],['Simple inference','Use clues to work out unstated meaning.']],
 '3':[['Main ideas','Identify important ideas and supporting details.'],['Inference','Use evidence to work out implied meaning.'],['Vocabulary in context','Explain word meaning from the text.'],['Text structure','Recognise how information is organised.'],['Characters & viewpoint','Explain motives and perspectives.'],['Summarising','Retell key information concisely.']],
 '4':[['Evidence','Support answers with details from the text.'],['Inference','Combine clues with background knowledge.'],['Vocabulary','Interpret precise and figurative language.'],['Author purpose','Explain why a text was created.'],['Text features','Use headings, diagrams and structure.'],['Summarising','Select the most important information.']],
 '5':[['Critical comprehension','Analyse ideas, evidence and viewpoints.'],['Inference','Make deeper evidence-based interpretations.'],['Vocabulary & figurative language','Explain nuanced word choice.'],['Author techniques','Identify how writers influence readers.'],['Compare texts','Connect ideas across different sources.'],['Summarise & synthesise','Combine key ideas accurately.']],
 '6':[['Critical reading','Evaluate claims, evidence and perspectives.'],['Complex inference','Interpret subtle clues and implications.'],['Language analysis','Explain figurative and persuasive choices.'],['Text comparison','Compare structure, purpose and viewpoint.'],['Evidence','Select strong textual evidence.'],['Synthesis','Combine ideas from multiple texts.']]
};
const vocab={
 K:[['Everyday words','Build useful words for home and school.'],['Naming words','Name common people, places and things.'],['Action words','Recognise common verbs.'],['Describing words','Use simple adjectives.'],['Word groups','Sort words into simple categories.'],['Words in stories','Learn new words through short texts.']],
 '1':[['Story words','Learn useful words through short stories.'],['Word meanings','Understand what new words mean.'],['Synonyms','Find words with similar meanings.'],['Antonyms','Find words with opposite meanings.'],['Spelling','Practise writing new words correctly.'],['Words in context','Choose the right word for a sentence.']],
 '2':[['Core word meanings','Learn useful Year 2 vocabulary.'],['Synonyms & antonyms','Build stronger word relationships.'],['Word families','Connect related words.'],['Context clues','Use sentence clues to understand meaning.'],['Spelling patterns','Practise common word patterns.'],['Using new words','Choose precise words in sentences.']],
 '3':[['Meanings in context','Use text clues to infer meanings.'],['Synonyms & shades','Compare similar words and strength of meaning.'],['Antonyms','Build opposite-word relationships.'],['Prefixes & suffixes','Use word parts to unlock meaning.'],['Word families','Connect roots and related forms.'],['Precise word choice','Choose words that best fit the context.']],
 '4':[['Context & nuance','Interpret meaning and shades of meaning.'],['Roots & affixes','Use roots, prefixes and suffixes.'],['Synonyms & antonyms','Expand word relationships.'],['Multiple meanings','Recognise words with more than one meaning.'],['Academic vocabulary','Build words used across school subjects.'],['Word choice','Use precise vocabulary for purpose.']],
 '5':[['Advanced context','Infer meaning from complex sentences.'],['Morphology','Use roots and affixes strategically.'],['Word relationships','Explore synonyms, antonyms and analogies.'],['Figurative language','Understand non-literal word use.'],['Academic vocabulary','Develop high-utility school vocabulary.'],['Precision','Choose effective words for audience and purpose.']],
 '6':[['Nuanced meaning','Distinguish subtle differences between words.'],['Roots & origins','Use morphology and etymology clues.'],['Word relationships','Explore advanced synonyms, antonyms and analogies.'],['Figurative language','Interpret imagery and idiomatic meaning.'],['Academic vocabulary','Build transition-ready subject vocabulary.'],['Precision & tone','Choose words to shape meaning and tone.']]
};
const scienceCommon={
 K:[['Living things','Explore plants, animals and what they need.'],['Weather','Notice daily weather and seasonal change.'],['Materials','Explore familiar materials and objects.'],['Movement','Observe how things move.'],['Earth & sky','Notice the Sun, Moon and sky.'],['Investigating','Ask simple questions and observe carefully.']],
 '1':[['Living things','Explore plants, animals and their needs.'],['Our bodies & senses','Learn how we use our senses.'],['Weather & seasons','Observe changes in weather and seasons.'],['Materials','Explore what everyday objects are made from.'],['Earth & sky','Discover the Sun, Moon and our planet.'],['Forces & movement','Explore pushes, pulls and movement.']],
 '2':[['Life cycles','Explore growth and change in living things.'],['Habitats','Learn how environments support life.'],['Materials','Compare materials and their properties.'],['Forces','Explore pushes, pulls and movement.'],['Earth & weather','Observe weather and Earth processes.'],['Investigations','Ask questions, predict and record observations.']],
 '3':[['Living world','Explore survival, environments and relationships.'],['Material world','Compare solids, liquids and material properties.'],['Physical world','Explore heat, light, forces and movement.'],['Earth & space','Learn about Earth, Sun and natural processes.'],['Patterns in nature','Observe cycles, change and cause.'],['Scientific investigations','Plan fair observations and record evidence.']],
 '4':[['Living systems','Explore adaptations and ecosystems.'],['Materials & change','Investigate properties and transformations.'],['Forces & energy','Explore forces, heat and energy transfer.'],['Earth systems','Study weather, landforms and natural change.'],['Sustainability','Explore resources and responsible choices.'],['Investigations','Plan, measure, compare and explain evidence.']],
 '5':[['Living world','Investigate adaptations and interdependence.'],['Material world','Explore states, mixtures and material change.'],['Physical world','Investigate light, electricity, forces and energy.'],['Earth & space','Explore the solar system and Earth processes.'],['Sustainability','Connect science with environmental decisions.'],['Scientific inquiry','Design investigations and interpret results.']],
 '6':[['Living systems','Explore complex relationships in ecosystems.'],['Materials','Investigate reversible and irreversible change.'],['Energy & forces','Analyse electricity, energy and motion.'],['Earth & space','Study Earth systems and space science.'],['Science & society','Connect science with technology and decisions.'],['Scientific inquiry','Evaluate evidence and communicate conclusions.']]
};
const gkCommon={
 K:[['My community','Learn about familiar people and places.'],['Australia','Recognise simple Australian symbols and places.'],['Animals','Discover common animals.'],['Nature','Explore land, water and plants.'],['Celebrations','Learn about familiar cultural events.'],['Everyday facts','Build useful knowledge about daily life.']],
 '1':[['Australia','Learn about Australia, states and symbols.'],['World & places','Discover countries, landmarks and maps.'],['Animals','Meet animals from Australia and the world.'],['Nature','Explore oceans, forests and environments.'],['Community','Learn about helpers, places and everyday life.'],['Fun facts','Discover interesting facts about our world.']],
 '2':[['Australia','States, territories, landmarks and symbols.'],['World geography','Continents, oceans and countries.'],['Animals & habitats','Connect animals with where they live.'],['People & communities','Explore roles, places and cultures.'],['History basics','Learn simple stories from the past.'],['Interesting facts','Build broad everyday knowledge.']],
 '3':[['Australia & regions','Explore states, landscapes and communities.'],['World geography','Use maps, continents and oceans.'],['History & culture','Discover people, events and traditions.'],['Nature & environment','Explore ecosystems and natural features.'],['Science & inventions','Learn about useful discoveries and technology.'],['Current knowledge','Build awareness of the wider world.']],
 '4':[['Australian geography','Explore regions, climate and landmarks.'],['World geography','Countries, capitals, landforms and maps.'],['History & culture','Learn about significant people and traditions.'],['Environment','Understand ecosystems and global environments.'],['Science & technology','Explore inventions and discoveries.'],['Civics & society','Learn how communities and institutions work.']],
 '5':[['Australia','Geography, government, history and culture.'],['World knowledge','Countries, capitals, regions and landmarks.'],['History','Connect key periods, people and events.'],['Environment','Explore global ecosystems and sustainability.'],['Science & innovation','Discover major ideas and inventions.'],['Civics & society','Understand institutions, communities and citizenship.']],
 '6':[['Australia & civics','Build knowledge of geography, history and government.'],['World geography','Countries, regions, capitals and global patterns.'],['History & culture','Connect significant events, people and ideas.'],['Environment','Explore sustainability and global challenges.'],['Science & innovation','Understand influential discoveries and technologies.'],['Global awareness','Build transition-ready knowledge of the wider world.']]
};
const banks={maths,english,reading,vocabulary:vocab,science:scienceCommon,'general-knowledge':gkCommon};
const topics=banks[subject][year]||banks[subject]['1'];
const topicTotal=document.getElementById('topic-total');
if(topicTotal) topicTotal.textContent=topics.length;
const dashboardTitle=document.getElementById('dashboard-title');
const dashboardKicker=document.getElementById('dashboard-kicker');
if(dashboardTitle) dashboardTitle.textContent='Start your '+meta.label+' journey.';
if(dashboardKicker) dashboardKicker.textContent=label.toUpperCase()+' · '+meta.label.toUpperCase()+' FLOW';

function hrefFor(title,index){
 const slug=title.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 if(subject==='maths')return 'practice.html?year='+encodeURIComponent(year)+'&topic='+encodeURIComponent(slug);
 if(subject==='english'){
   const skill=/spell/i.test(title)?'spelling':/writ|edit|paragraph/i.test(title)?'writing':/phon|sentence|grammar|punct/i.test(title)?'grammar':'reading';
   return 'english-practice.html?grade='+(year==='K'?'1':year)+'&skill='+skill;
 }
 if(subject==='reading'){
   if(year==='1')return 'english-year1-reading.html';
   if(year==='2')return 'english-year2-reading.html';
   return 'english-practice.html?grade='+(year==='K'?'1':year)+'&skill=reading';
 }
 if(subject==='vocabulary'){
   if(year==='1')return 'vocabulary-year1-stories.html';
   if(['2','3','4','5','6'].includes(year))return 'vocabulary-year'+year+'.html';
   return 'vocabulary.html';
 }
 return '#';
}
const previewIds=['preview-1','preview-2','preview-3'];
previewIds.forEach((id,i)=>{
 const a=document.getElementById(id);
 const t=topics[i];
 if(!a||!t)return;
 a.href=hrefFor(t[0],i);
 a.querySelector('b').textContent=t[0];
 if(a.getAttribute('href')==='#')a.addEventListener('click',e=>e.preventDefault());
});
const previewCards=previewIds.map(id=>document.getElementById(id)).filter(Boolean);
if(previewCards.length&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
 let pi=0;
 setInterval(()=>{
   previewCards.forEach(c=>c.classList.remove('is-active'));
   pi=(pi+1)%previewCards.length;
   previewCards[pi].classList.add('is-active');
 },2400);
}

const grid=document.getElementById('topic-grid');
topics.forEach((t,i)=>{
 const a=document.createElement('a');a.className='topic-card';a.href=hrefFor(t[0],i);
 if((subject==='science'||subject==='general-knowledge'))a.classList.add('coming');
 a.innerHTML='<span class="num">'+String(i+1).padStart(2,'0')+'</span><h3>'+t[0]+'</h3><p>'+t[1]+'</p><span class="status">'+((subject==='science'||subject==='general-knowledge')?'TOPIC OVERVIEW · LESSONS COMING SOON':'OPEN TOPIC')+'</span>';
 if(a.getAttribute('href')==='#')a.addEventListener('click',e=>e.preventDefault());
 grid.appendChild(a);
});
const topicCards=[...document.querySelectorAll('.topic-card:not(.coming)')];
if(topicCards.length&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
 let activeTopic=0;
 topicCards[activeTopic].classList.add('auto-featured');
 setInterval(()=>{
   topicCards.forEach(card=>card.classList.remove('auto-featured'));
   activeTopic=(activeTopic+1)%topicCards.length;
   topicCards[activeTopic].classList.add('auto-featured');
 },2600);
}
})();
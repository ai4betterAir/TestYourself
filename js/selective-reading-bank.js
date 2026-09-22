(function(){
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
const Q=(topic,name,passage,text,answer,choices,tip,level='mix')=>({topic,name,passage,text,answer,choices,tip,level});
const topics=[
 ['paired','⇄','Paired Texts','Compare ideas, attitudes and details across two texts'],
 ['inference','🔎','Inference','Use clues to work out what is implied'],
 ['vocab','Aa','Vocabulary in Context','Work out word meaning from the passage'],
 ['purpose','🎯','Purpose & Tone','Identify why a writer wrote something and how it sounds'],
 ['poetry','♪','Poetry','Imagery, mood, figurative language and meaning'],
 ['sequence','↪','Sequence & Cohesion','Follow events and connect ideas logically'],
 ['sentence','＋','Sentence Placement','Choose the sentence that best fills a gap'],
 ['matching','▤','Multiple Extracts','Match a statement to the correct short extract']
];
const bank=[];
function addSet(topic,name,passage,questions){questions.forEach(q=>bank.push(Q(topic,name,passage,...q)))}
addSet('paired','Paired Texts',`TEXT A — The Last Train\nMaya liked the railway station best after sunset. During the day it was full of footsteps and announcements, but at night the empty platforms seemed to hold their breath. She often waited for the final train simply to watch the lights arrive through the darkness.\n\nTEXT B — The Early Bus\nNoah preferred the bus stop at dawn. The streets were almost silent, shop windows were dark, and the first birds could be heard above the hum of the engine. For him, the city felt most alive just before everyone else woke up.`,[
 ['What idea is shared by both texts?','Quiet times can make familiar places feel special',['Quiet times can make familiar places feel special','Public transport is usually late','Cities are frightening at night','Travelling alone is always enjoyable'],'Look for the idea that appears in both, not just one.','5'],
 ['How do Maya and Noah mainly differ?','They prefer different times of day',['They prefer different times of day','Only Maya likes the city','Noah dislikes public transport','Maya travels every night'],'Compare the preference stated in each text.','5'],
 ['Which detail best shows that Noah enjoys the calm atmosphere?','He notices the first birds above the engine',['He notices the first birds above the engine','The bus has an engine','The shops are closed','The streets have shops'],'Choose the detail that shows his positive response to the quiet.','6'],
 ['The phrase “hold their breath” in Text A suggests the platforms seem…','still and expectant',['still and expectant','dangerously crowded','very cold','full of smoke'],'This is personification: the station is described as if it were waiting.','6']
]);
addSet('inference','Inference',`When Aria reached the classroom, every chair was pushed under the tables except one. A half-finished poster lay beside it, and a ruler had rolled onto the floor. She picked up the ruler and smiled. “Leo was definitely here before me,” she said.`,[
 ['What can be inferred about Leo?','He had been working on the poster',['He had been working on the poster','He had cleaned every table','He had taken all the chairs away','He had gone home sick'],'Use the unusual chair, poster and ruler as clues.','5'],
 ['Why does Aria smile?','She recognises signs of Leo’s work',['She recognises signs of Leo’s work','She dislikes the poster','She wants the ruler','The classroom is empty'],'Her conclusion comes from familiar evidence.','5'],
 ['Which detail is the strongest clue that someone was working recently?','The half-finished poster',['The half-finished poster','The tables','The classroom','The smile'],'A half-finished task most directly shows recent activity.','6'],
 ['Which statement is NOT supported by the passage?','Leo finished the poster',['Leo finished the poster','Someone used a ruler','Most chairs were pushed in','Aria arrived after someone else'],'The poster is explicitly unfinished.','6']
]);
addSet('vocab','Vocabulary in Context',`The path narrowed as the hikers climbed. At first they chatted loudly, but the steep slope soon made them conserve their breath. By the time they reached the ridge, even the most energetic member of the group was speaking in short sentences.`,[
 ['What does “conserve” most nearly mean here?','save',['save','waste','measure','hide'],'Use the context: the climb is tiring, so they try not to use too much breath.','5'],
 ['What does “ridge” most likely mean?','a high narrow line of land',['a high narrow line of land','a deep river','a building','a road tunnel'],'The hikers climb upward and reach a landform.','5'],
 ['Why are the hikers speaking less?','The climb is physically demanding',['The climb is physically demanding','They are angry','They are lost','Talking is not allowed'],'Use the link between the steep slope and shorter speech.','6'],
 ['Which word best describes the change in the group?','tired',['tired','confused','bored','frightened'],'The passage repeatedly points to effort and breath.','5']
]);
addSet('purpose','Purpose & Tone',`Our school should plant more shade trees along the western edge of the playground. On hot afternoons, that part of the yard has almost no shelter. Trees would not only provide shade but could also cool nearby surfaces and create habitat for small birds. The project would take time, but its benefits would last for many years.`,[
 ['What is the main purpose of the passage?','To persuade the school to plant more trees',['To persuade the school to plant more trees','To explain how birds migrate','To entertain with a story','To describe a storm'],'Look for the recommendation and supporting reasons.','5'],
 ['What is the tone of the passage?','practical and persuasive',['practical and persuasive','angry and mocking','mysterious and fearful','humorous and silly'],'The writer makes a calm recommendation using reasons.','6'],
 ['Which sentence gives a long-term reason for the proposal?','The project would take time, but its benefits would last for many years.',['The project would take time, but its benefits would last for many years.','On hot afternoons, that part of the yard has almost no shelter.','Our school should plant more shade trees.','Trees are living things.'],'Choose the sentence that directly mentions future benefits.','5'],
 ['Which additional evidence would best strengthen the argument?','A temperature comparison between shaded and unshaded parts of the playground',['A temperature comparison between shaded and unshaded parts of the playground','A list of students’ favourite colours','A map of another country','The school bell timetable'],'Strong evidence should directly test the claimed cooling benefit.','6']
]);
addSet('poetry','Poetry',`Night Station\n\nThe platform wears a silver coat,\nwhile windows blink awake.\nA whistle cuts the sleeping air,\nand shadows start to shake.\n\nThen wheels begin their steady song,\nthe dark gives way to light.\nThe train collects the waiting town\nand carries it through night.`,[
 ['Which technique is used in “The platform wears a silver coat”?','personification',['personification','rhyme only','a factual definition','a question'],'The platform is given a human action: wearing.','5'],
 ['What creates the idea that the station is becoming active?','Windows blink awake and shadows start to shake',['Windows blink awake and shadows start to shake','The poem has two stanzas','The word platform is used','The train is at night'],'Look for movement and waking imagery.','6'],
 ['What mood is strongest at the beginning?','quiet and expectant',['quiet and expectant','furious','comic','hopeless'],'The station is asleep-like, but something is about to happen.','5'],
 ['What does “the train collects the waiting town” suggest?','Many people from the town board the train',['Many people from the town board the train','The whole town is physically lifted','The train owns the town','The town is empty forever'],'Interpret the figurative language, not literally.','6']
]);
addSet('sequence','Sequence & Cohesion',`First, Daniel filled the seed tray with soil. He pressed one sunflower seed into each small section and covered them lightly. After watering the tray, he placed it near the sunny window. Three days later he checked it and saw no shoots, but he kept the soil damp. By the end of the week, several green tips had appeared.`,[
 ['What happened immediately before Daniel placed the tray near the window?','He watered the tray',['He watered the tray','He saw green tips','He filled the tray with soil','He checked it three days later'],'Follow the event order exactly.','5'],
 ['Why did Daniel keep the soil damp?','He was continuing to care for the seeds while waiting for them to grow',['He was continuing to care for the seeds while waiting for them to grow','He wanted to wash away the seeds','The tray was broken','He had already harvested flowers'],'Use the surrounding events to infer his purpose.','6'],
 ['Which event happened last?','Several green tips appeared',['Several green tips appeared','Daniel watered the tray','Daniel planted the seeds','Daniel filled the tray with soil'],'Look for the final time marker.','5'],
 ['Which word best connects the third and fourth sentences?','Afterwards',['Afterwards','However','Instead','Because'],'The relationship is sequence in time.','5']
]);
addSet('sentence','Sentence Placement',`The school robotics team had one week to prepare for the regional challenge. [1] On Monday they tested the wheels and discovered that one motor was weaker than the other. [2] By Wednesday the robot could travel in a straight line. [3] The team then programmed the arm to lift small blocks. [4] On Friday afternoon, they completed a full practice run.`,[
 ['Where would this sentence fit best: “They replaced the faulty motor and adjusted the speed settings.”','After sentence [2] marker — between the motor problem and the Wednesday result',['After sentence [2] marker — between the motor problem and the Wednesday result','Before the first sentence','After the final sentence','Between the Wednesday result and programming the arm'],'The new sentence solves the motor problem before the robot succeeds.','6'],
 ['Which event most clearly shows the team solved its first problem?','The robot could travel in a straight line by Wednesday',['The robot could travel in a straight line by Wednesday','They had one week','They programmed the arm','They practised on Friday'],'Connect the motor problem to the later result.','5'],
 ['What is the main organising pattern of the paragraph?','chronological order',['chronological order','comparison','cause only','question and answer'],'The paragraph uses Monday, Wednesday and Friday.','5'],
 ['Which sentence would make the BEST final sentence?','The team felt ready for the regional challenge.',['The team felt ready for the regional challenge.','Monday came before Tuesday.','The robot had wheels.','Some blocks are heavy.'],'A conclusion should connect the successful practice back to the goal.','6']
]);
const extracts=[
 {id:'A',text:'I keep a notebook beside my bed because ideas often arrive just before I sleep. Some are only a sentence; others become whole stories by morning.'},
 {id:'B',text:'Reading on paper helps me notice details I sometimes miss on a screen. I turn back, underline a phrase and think about why the writer chose it.'},
 {id:'C',text:'Our book club rarely agrees. One person loves the ending, another dislikes it, and that difference is exactly why our discussions are interesting.'},
 {id:'D',text:'When I reread a childhood favourite, the story is unchanged but I am not. I notice different jokes, different worries and different characters.'}
];
const multiPass=`EXTRACT A\n${extracts[0].text}\n\nEXTRACT B\n${extracts[1].text}\n\nEXTRACT C\n${extracts[2].text}\n\nEXTRACT D\n${extracts[3].text}`;
addSet('matching','Multiple Extracts',multiPass,[
 ['Which extract is mainly about generating ideas for writing?','Extract A',['Extract A','Extract B','Extract C','Extract D'],'Look for the writer who records ideas.','5'],
 ['Which extract focuses on close reading strategies?','Extract B',['Extract A','Extract B','Extract C','Extract D'],'Look for actions such as underlining and rereading a phrase.','5'],
 ['Which extract shows that disagreement can improve discussion?','Extract C',['Extract A','Extract B','Extract C','Extract D'],'The extract explicitly values different opinions.','6'],
 ['Which extract is about how a reader changes over time?','Extract D',['Extract A','Extract B','Extract C','Extract D'],'The story stays the same, but the reader changes.','6']
]);
window.SKILLUP_READING={topics,question(id='mixed',mode='mix'){
 let pool=id==='mixed'?bank:bank.filter(q=>q.topic===id);
 if(!pool.length)pool=bank;
 const q=pick(pool);
 return {...q,text:`${q.passage}\n\nQUESTION\n${q.text}`,choices:shuffle(q.choices),_level:q.level};
}};
})();
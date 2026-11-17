// Original Acorn & Shine questions. These are not official past examination papers.
export const examSections = [{id:'reading',label:'Reading',note:'Inference, meaning and evidence'}, {id:'maths',label:'Mathematical reasoning',note:'Multi-step numerical problems'}, {id:'thinking',label:'Thinking skills',note:'Logic, deductions and patterns'}];
export function examProgrammes(year) { return year === '4' ? ['OC'] : ['5','6'].includes(year) ? ['Selective'] : []; }
const shuffle = list => {const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
function question(text,correct,distractors,topic,hint,passage='') {
 const choices=shuffle([String(correct),...distractors.map(String)]);
 if(new Set(choices).size!==4)throw new Error('Answer choices must be distinct.');
 return {text,choices,answer:choices.indexOf(String(correct)),topic,hint,passage};
}
const stories=[
 ['The unlit sign','Each evening, Leila passed a repair shop whose sign had stopped glowing. On Friday she found its owner repairing a neighbour’s lamp while three customers waited. “I keep meaning to fix my own sign,” he said, smiling. Leila decided that the dark sign did not tell the whole story.',
  [['Why does the dark sign not tell the whole story?','The shop is busy despite its unlit sign.',['The shop has permanently closed.','The owner dislikes all electric lights.','Leila has never seen the shop before.']],['What does the owner’s behaviour suggest?','He gives customers’ repairs priority over his sign.',['He cannot repair any electrical item.','He has forgotten where his shop is.','He wants customers to stop visiting.']],['Which detail best supports the idea that people trust the shop?','Three customers are waiting.',['The sign is dark.','It is Friday.','Leila walks in the evening.']],['Which title best captures the main idea?','More than appearances',['An empty street','The last electric lamp','Leila’s new business']]]],
 ['A different route','The usual footbridge was closed, so the class took a longer path beside the wetland. At first Noah complained about the extra walk. Then he noticed tiny footprints in the mud and a bird building a nest. He asked the teacher whether they could return by the same path the following week.',
  [['Why does Noah ask to return?','He has discovered things he wants to observe again.',['He wants to prove the bridge is open.','He has lost the class map.','He wants to avoid every outdoor activity.']],['How does Noah’s attitude change?','From frustration to curiosity',['From confidence to fear','From interest to boredom','From joy to anger']],['Which event causes the class to change its route?','The footbridge is closed.',['A bird loses its nest.','Noah forgets his shoes.','The teacher cancels the walk.']],['What is a reasonable message of the story?','An inconvenience can lead to a worthwhile discovery.',['A longer route is always dangerous.','Complaining repairs bridges.','Wetlands have no interesting wildlife.']]]],
 ['The trial garden','The school planted two equal garden beds with the same seeds. One bed received mulch; the other did not. Both received the same measured amount of water. After a warm week, the mulched bed’s soil stayed damp longer. The students planned another trial before making a recommendation.',
  [['Why is the same amount of water used?','To make the comparison fairer',['To guarantee identical plant growth','To test different seed varieties','To remove the need for observations']],['What does the damp soil suggest?','Mulch may reduce water loss in these conditions.',['Mulch creates water from nothing.','Every garden must use the same plants.','Unmulched soil can never grow plants.']],['Why plan another trial?','To check whether the pattern happens again',['To avoid recording any results','To ensure the first trial is forgotten','To change every condition at once']],['Which claim goes beyond the evidence?','Mulch always doubles crop production.',['The students used two beds.','The water amounts were equal.','The mulched soil stayed damp longer.']]]],
 ['The quiet performance','Just before the concert, the power failed. The audience murmured as the speakers fell silent. Arun put down his microphone, moved closer to the front row and began to sing. Gradually the room became still. Afterwards, one listener said she had heard the words more clearly than ever.',
  [['What does Arun do when the power fails?','He adapts his performance to the situation.',['He leaves without speaking.','He asks everyone to sing instead.','He waits for the concert to end.']],['Why does the room become still?','The audience is paying attention to the song.',['Everyone has fallen asleep.','The audience has left the building.','The speakers have become louder.']],['What does the listener’s comment imply?','The simpler performance helped her focus on the lyrics.',['She could not hear any words.','The singer used a louder microphone.','She disliked hearing a live voice.']],['Which description best fits Arun?','Resourceful',['Indifferent','Careless','Unprepared to sing']]]],
 ['The borrowed map','Tessa borrowed her grandfather’s old map for a walk. A lane marked on it ended at a new fence. Rather than cross the fence, she checked a current noticeboard and found a public path around the field. At home she pencilled a note on a separate sheet and placed it beside the map.',
  [['Why does Tessa check the noticeboard?','She needs current information about an accessible route.',['She wants to damage the old map.','She has forgotten who owns the map.','She wants to climb the new fence.']],['What does the new fence reveal?','The old map may no longer match all present conditions.',['Every path on the map is wrong.','The field has disappeared.','No public paths exist nearby.']],['Why is the separate note useful?','It records an update while preserving the old map.',['It proves the fence is temporary.','It replaces every future map.','It changes the owner of the field.']],['Which conclusion is best supported?','Tessa uses both older and current sources thoughtfully.',['Tessa never trusts written information.','Her grandfather built the fence.','The walk takes exactly an hour.']]]]
];
function pool(programme) {
 const advanced=programme==='Selective', out=[];
 for(const [title,passage,items] of stories)for(const [text,answer,wrong] of items)out.push(question(text,answer,wrong,'reading','Find the detail in the passage that supports your choice.',title+'\n\n'+passage));
 // Each family uses distinct parameters and an exact, independently checkable key.
 for(let n=2;n<18;n++) {
  const packs=n+3, each=advanced?12:8, used=advanced?n*3:n*2, total=packs*each-used;
  out.push(question(`${packs} boxes each contain ${each} pencils. After ${used} pencils are given away, how many remain?`,total,[total-1,total+1,total+each],'maths',`First multiply ${packs} by ${each}, then subtract ${used}.`));
  const adults=n+2, children=2*n, adultPrice=advanced?15:10, childPrice=advanced?9:6, cost=adults*adultPrice+children*childPrice;
  out.push(question(`Tickets cost $${adultPrice} for adults and $${childPrice} for children. What is the total cost for ${adults} adults and ${children} children?`,'$'+cost,['$'+(cost+childPrice),'$'+(cost-adultPrice),'$'+(cost+adultPrice)],'maths','Calculate the adult and child costs separately, then add them.'));
  if(advanced){const amount=n*20, answer=amount*3/4;
   out.push(question(`A tank holds ${amount} litres when full. It is three quarters full. How many litres are in the tank?`,answer+' L',[(amount/4)+' L',(amount/2)+' L',(amount*5/4)+' L'],'maths','Find one quarter by dividing by 4, then multiply by 3.'));
  }else{const length=n+5,width=n+1,answer=2*(length+width);
   out.push(question(`A rectangular garden is ${length} m long and ${width} m wide. What is its perimeter?`,answer+' m',[(length*width)+' m',(length+width)+' m',(answer+2)+' m'],'maths','The perimeter is twice the length plus twice the width.'));
  }
  const step=advanced?n+3:n+1, start=n*2, next=start+4*step;
  out.push(question(`A sequence starts ${start}, ${start+step}, ${start+2*step}, ${start+3*step}. The same number is added each time. What comes next?`,next,[next+step,next-1,next+1],'thinking','Compare two neighbouring terms to find the repeated increase.'));
 }
 const names=['Aria','Ben','Chloe','Dev','Eli','Finn','Grace','Hana','Ivy','Jude','Kai','Luca','Mina','Noah','Omar','Pia'];
 for(let n=0;n<16;n++) {
  const a=names[n],b=names[(n+1)%16],c=names[(n+2)%16],d=names[(n+3)%16];
  out.push(question(`${a}, ${b}, ${c} and ${d} finish a race with no ties. ${a} finishes before ${b}; ${b} before ${c}; and ${c} before ${d}. Who finishes third?`,c,[a,b,d],'thinking','Place each runner in order using all three comparisons.'));
  const total=12+n, blue=3+n, both=2, red=total-blue+both;
  out.push(question(`Every one of ${total} badges is red, blue, or both. ${blue} badges are blue, including ${both} that are also red. How many badges are red?`,red,[red-2,red+2,total+blue],'thinking',`There are ${blue-both} blue-only badges. Subtract those from the total.`));
 }
 return out;
}
export function getExamHomeworkBank(year,programme) {
 if(!examProgrammes(year).includes(programme))throw new Error('OC is available for Year 4; Selective for Years 5 and 6.');
 const questions=pool(programme);
 return {topics:examSections,programme,questions,question:id=>{const available=questions.filter(q=>q.topic===id);return available[Math.floor(Math.random()*available.length)];}};
}
export function makeExamHomework(bank,sections,count) {
 if(![10,20,30].includes(count)||!sections.length||new Set(sections).size!==sections.length||sections.some(id=>!examSections.some(s=>s.id===id)))throw new Error('Choose available sections.');
 if(count===30&&sections.length!==3)throw new Error('The full practice set includes all three sections.');
 const groups=Object.fromEntries(sections.map(id=>[id,shuffle(bank.questions.filter(q=>q.topic===id))]));
 const result=[];
 for(let i=0;i<count;i++){const section=sections[i%sections.length],q=groups[section].pop();if(!q)throw new Error('Not enough unique questions in this section. Choose a shorter set.');result.push({...q});}
 // Keep each section together so the student has a clear paper structure.
 return sections.flatMap(id=>result.filter(q=>q.topic===id));
}

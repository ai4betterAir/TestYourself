(function(){
const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[rnd(0,a.length-1)];
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
const Q=(text,answer,choices,tip,topic,name)=>({text,answer,choices:shuffle([...new Set(choices.map(String))]),tip,topic,name});
const names=['Ava','Ben','Chloe','Daniel','Ella','Finn','Grace','Hugo','Isla','Jack','Kai','Lina','Mia','Noah','Omar','Priya','Ruby','Sam'];
function threeNames(){return shuffle(names).slice(0,3)}
function fourNames(){return shuffle(names).slice(0,4)}
const topics=[
 ['logic','◆','Logic & Conditions','If–then rules, must/could/cannot conclusions'],
 ['evidence','✓','Evidence & Conclusions','Choose what is supported by the information'],
 ['order','↕','Ordering & Ranking','Tallest, youngest, race order and relative position'],
 ['seating','○','Seating & Arrangement','Seats, circles and position clues'],
 ['time','◷','Time & Scheduling','Durations, timetables and repeated events'],
 ['number','123','Number Reasoning','Shares, ages, equations and hidden values'],
 ['rate','→','Rate & Proportion','Speed, work rate, reading and production'],
 ['data','▥','Data & Tables','Totals, missing values and interpreting information'],
 ['probability','?','Probability & Chance','Simple probability and possible outcomes'],
 ['family','⌂','Family Relationships','Work out how people are related'],
 ['argument','⚖','Arguments & Assumptions','Best support, objection and assumption'],
 ['sets','⊂','Sets & Classification','All, some, none and category reasoning']
];
function logic(level){
 const type=rnd(0,5),[a,b]=threeNames();
 if(type===0){return Q(`Whenever ${a} brings an umbrella, it is raining. Today ${a} did not bring an umbrella. What can you conclude?`,'Not enough information',['It is definitely not raining','It is definitely raining','Not enough information','It rained yesterday'],'The rule tells what happens when an umbrella is brought. It does not tell what happens every time it rains.','logic','Logic & Conditions')}
 if(type===1){return Q(`If the science room is open, the hallway light is on. The hallway light is off. What must be true?`,'The science room is closed',['The science room is closed','The science room is open','The light is broken','Not enough information'],'Use the contrapositive: if open means light on, light off means not open.','logic','Logic & Conditions')}
 if(type===2){return Q(`Only students who return the permission note may join the excursion. ${a} is joining the excursion. What must be true?`,`${a} returned the permission note`,[`${a} returned the permission note`,`${a} forgot the note`,`${a} is the oldest student`,'Nothing can be concluded'],'“Only students who…” means joining requires the note.','logic','Logic & Conditions')}
 if(type===3){return Q(`If alarm 1 sounds, the event is either a fire drill or an earthquake drill. Alarm 2 is used only for fire drills. Alarm 2 is sounding. What is the best conclusion?`,'It is a fire drill',['It is a fire drill','It is an earthquake drill','It must be both drills','There is no drill'],'Alarm 2 has a single stated use.','logic','Logic & Conditions')}
 if(type===4){return Q(`Every time ${a} finishes swimming, ${a} buys a juice. Today ${a} bought a juice. Which statement is correct?`,'We cannot be sure that swimming happened',['Swimming definitely happened','We cannot be sure that swimming happened','Swimming definitely did not happen','The pool was closed'],'Buying juice can happen for other reasons unless the reverse rule is stated.','logic','Logic & Conditions')}
 return Q(`A club rule says: “Members may enter the games room only after signing in.” ${a} is inside the games room. What follows?`,`${a} signed in`,[`${a} signed in`,`${a} won a game`,`${a} arrived first`,'Nothing follows'],'Being in the room requires signing in.','logic','Logic & Conditions');
}
function evidence(level){
 const type=rnd(0,4);
 if(type===0)return Q('All red kites are large. Some large kites are expensive. Which conclusion is definitely true?','All red kites are large',['All red kites are large','All expensive kites are red','Some red kites are expensive','No large kite is cheap'],'Choose only what is directly guaranteed by the statements.','evidence','Evidence & Conclusions');
 if(type===1)return Q('A school added shaded areas to the playground. During hot days, more students now stay outside at lunch. Which statement is best supported?','Shade can make the playground more comfortable on hot days',['Shade can make the playground more comfortable on hot days','All students dislike indoor areas','The playground is colder than a classroom','Students only play outside in summer'],'Use the change described as evidence, without adding extra claims.','evidence','Evidence & Conclusions');
 if(type===2)return Q('The library extended its opening hours. In the following month, evening visits increased. Which conclusion is most reasonable?','Longer opening hours may have allowed more evening visits',['Longer opening hours may have allowed more evening visits','Every visitor prefers evenings','The library removed all daytime sessions','The number of books doubled'],'Pick the conclusion that fits the evidence but does not overclaim.','evidence','Evidence & Conclusions');
 if(type===3)return Q('All metal blocks in a box are magnetic. This block came from the box and is metal. What conclusion is supported?','The block is magnetic',['The block is magnetic','The block is blue','All magnetic things are metal','The box contains only one block'],'Apply the given rule directly.','evidence','Evidence & Conclusions');
 return Q('Some gardeners are teachers. All teachers at the centre wear name tags. Which statement must be true?','Some gardeners wear name tags',['Some gardeners wear name tags','All gardeners are teachers','No teacher is a gardener','All people with name tags are gardeners'],'The gardeners who are teachers must follow the teacher rule.','evidence','Evidence & Conclusions');
}
function order(level){
 const [a,b,c,d]=fourNames(),type=rnd(0,4);
 if(type===0){return Q(`${a} is taller than ${b}. ${b} is taller than ${c}. Who is shortest?`,c,[a,b,c,'Cannot tell'],'Put them in order from tallest to shortest.','order','Ordering & Ranking')}
 if(type===1){return Q(`${a} is younger than ${b}, but older than ${c}. Who is the oldest?`,b,[a,b,c,'They are the same age'],'Translate each comparison into an age order.','order','Ordering & Ranking')}
 if(type===2){return Q(`In a race, ${a} finished before ${b}. ${c} finished after ${b}. Which runner definitely finished first among these three?`,a,[a,b,c,'Cannot tell'],'Use the before/after chain.','order','Ordering & Ranking')}
 if(type===3){return Q(`${a} is heavier than ${b}. ${c} is lighter than ${b}. ${d} is heavier than ${a}. Who is heaviest?`,d,[a,b,c,d],'Build one chain using all four clues.','order','Ordering & Ranking')}
 return Q(`${a} scored more points than ${b}. ${b} scored fewer than ${c}. Which statement must be true?`,`${a} scored more than ${b}`,[`${a} scored more than ${b}`,`${a} scored more than ${c}`,`${c} scored more than ${a}`,`${b} scored the most`],'Only use comparisons that are directly guaranteed.','order','Ordering & Ranking');
}
function seating(level){
 const [a,b,c,d]=fourNames(),type=rnd(0,3);
 if(type===0)return Q(`Four students sit in a row. ${a} sits immediately left of ${b}. ${c} sits at the far left. ${d} sits at the far right. Who is second from the left?`,a,[a,b,c,d],'Place the fixed end seats first, then the adjacent pair.','seating','Seating & Arrangement');
 if(type===1)return Q(`Four people sit around a round table. ${a} sits opposite ${b}. ${c} sits to the right of ${a}. Who sits to the left of ${a}?`,d,[a,b,c,d],'With four seats, the remaining person must occupy the other side of A.','seating','Seating & Arrangement');
 if(type===2)return Q(`Five seats are in a row. ${a} is in the middle. ${b} sits immediately left of ${a}. ${c} sits immediately right of ${a}. Which position can ${d} occupy?`,'An end seat',['An end seat','The middle seat','Immediately left of the middle','Immediately right of the middle'],'Three centre seats are already fixed.','seating','Seating & Arrangement');
 return Q(`Around a round table, ${a} is opposite ${b}. ${c} is immediately right of ${b}. Who is immediately left of ${b}?`,d,[a,b,c,d],'In a four-seat circle, once opposite and right positions are set, one seat remains.','seating','Seating & Arrangement');
}
function time(level){
 const type=rnd(0,4);
 if(type===0){const startH=rnd(7,9),prep=rnd(10,20),walk=rnd(8,15),wait=rnd(3,8),total=prep+walk+wait;let h=startH,m=15+total;h+=Math.floor(m/60);m%=60;const ans=`${h}:${String(m).padStart(2,'0')}`;return Q(`At ${startH}:15, Mia begins getting ready. She takes ${prep} minutes to get ready, ${walk} minutes to walk to the bus stop and waits ${wait} minutes for the bus. At what time does the bus arrive?`,ans,[ans,`${startH}:${String(15+walk).padStart(2,'0')}`,`${h}:${String((m+10)%60).padStart(2,'0')}`,`${startH+1}:00`],'Add each duration to the start time.','time','Time & Scheduling')}
 if(type===1){const d=rnd(2,4),count=rnd(4,6);return Q(`A study group meets every ${d} days. The first meeting is on Monday. How many days after Monday is the ${count}th meeting?`,(count-1)*d,[String((count-1)*d),String(count*d),String((count-2)*d),String(count+d)],'There are one fewer gaps than meetings.','time','Time & Scheduling')}
 if(type===2){return Q('A movie starts at 6:35 pm and lasts 1 hour 45 minutes. When does it finish?','8:20 pm',['8:20 pm','7:20 pm','8:10 pm','8:35 pm'],'Add 1 hour, then 45 minutes.','time','Time & Scheduling')}
 if(type===3){return Q('A train leaves every 20 minutes starting at 8:00 am. Which of these is NOT a departure time?','9:10 am',['8:40 am','9:00 am','9:10 am','9:20 am'],'List the times by adding 20 minutes repeatedly.','time','Time & Scheduling')}
 return Q('A lesson begins at 10:25 am. It ends 55 minutes later. What time does it end?','11:20 am',['11:20 am','11:10 am','10:80 am','12:20 pm'],'Bridge to the next hour, then add the remaining minutes.','time','Time & Scheduling');
}
function number(level){
 const type=rnd(0,5),[a,b]=threeNames();
 if(type===0){const n=rnd(4,8),each=rnd(3,7),left=rnd(1,4),total=n*each+left;return Q(`${total} tokens are shared equally among some students. Each student gets ${each} tokens and ${left} are left over. How many students are there?`,n,[n,n+1,n-1,each],'Remove the leftovers, then divide by the number each receives.','number','Number Reasoning')}
 if(type===1){const x=rnd(4,12);return Q(`A + B = ${x+7}, A = ${x}. What is B?`,7,['7',String(x+7),String(x-7),String(x)],'Substitute the known value of A.','number','Number Reasoning')}
 if(type===2){const younger=rnd(8,12),gap=rnd(3,6),older=younger+gap;return Q(`${a} is ${gap} years older than ${b}. Together they are ${older+younger} years old. How old is ${b}?`,younger,[younger,older,gap,older+younger],'Think of the younger age as x and the older as x + gap.','number','Number Reasoning')}
 if(type===3){const people=3,total=18;return Q('Three friends share 18 cupcakes. Each gets at least 1. Which amount could one friend receive?','10',['10','17','18','0'],'The other two people must still get at least one each.','number','Number Reasoning')}
 if(type===4){const x=rnd(3,8);return Q(`If 2A = ${2*x} and A + B = ${x+5}, what is B?`,5,['5',String(x),String(x+5),String(2*x)],'Find A first, then substitute into A + B.','number','Number Reasoning')}
 return Q('A box contains only red, blue and green counters. There are 4 red, 3 blue and 5 green. How many counters are not blue?',9,['9','8','7','12'],'Add the red and green counters.','number','Number Reasoning');
}
function rate(level){
 const type=rnd(0,4);
 if(type===0){const per=rnd(3,6),mins=rnd(2,5),target=per*rnd(4,8);const t=target/per*mins;return Q(`A printer produces ${per} cards every ${mins} minutes. At the same rate, how many minutes will it take to print ${target} cards?`,t,[t,t+mins,t-mins,target/per],'Find how many equal batches are needed.','rate','Rate & Proportion')}
 if(type===1){return Q('A reader finishes 4 pages in 3 minutes. At the same rate, how many pages can be read in 30 minutes?',40,['40','30','34','120'],'30 minutes is 10 groups of 3 minutes.','rate','Rate & Proportion')}
 if(type===2){return Q('A workshop makes 240 parts in 4 days. At the same daily rate, how many parts are made in 7 days?',420,['420','280','360','480'],'Find the one-day rate first.','rate','Rate & Proportion')}
 if(type===3){return Q('A cyclist travels 18 km in 1.5 hours. At the same speed, how far in 4 hours?',48,['48 km','36 km','54 km','72 km'],'Find kilometres per hour, then multiply by 4.','rate','Rate & Proportion')}
 return Q('A recipe uses 3 cups of flour for 12 muffins. How many cups are needed for 20 muffins?',5,['5','4','6','8'],'Scale the recipe proportionally.','rate','Rate & Proportion');
}
function data(level){
 const type=rnd(0,4);
 if(type===0)return Q('At a fundraiser, girls sold 18 cakes and boys sold 27 cakes. How many cakes were sold altogether?',45,['45','9','36','54'],'Add the two groups.','data','Data & Tables');
 if(type===1)return Q('A class survey has 12 votes for dogs, 9 for cats and 4 for birds. What fraction of the 25 votes were for cats?','9/25',['9/25','12/25','4/25','9/21'],'Use cat votes over total votes.','data','Data & Tables');
 if(type===2)return Q('A table shows 46 chocolates sold in total. Girls sold 19. How many did boys sell?',27,['27','65','23','19'],'Subtract the girls total from the overall total.','data','Data & Tables');
 if(type===3)return Q('A survey total is 100. 27 chose option A, 33 chose option B and 18 chose option C. How many chose option D?',22,['22','28','18','12'],'Subtract the known groups from 100.','data','Data & Tables');
 return Q('A school recorded 35 bus riders on Monday, 42 on Tuesday and 38 on Wednesday. Which day had the most riders?','Tuesday',['Monday','Tuesday','Wednesday','They were equal'],'Compare the three totals.','data','Data & Tables');
}
function probability(level){
 const type=rnd(0,3);
 if(type===0)return Q('A class has 18 boys and 12 girls. One student is chosen at random. What is the probability of choosing a girl?','2/5',['2/5','3/5','1/3','12/18'],'Probability = favourable outcomes ÷ total outcomes.','probability','Probability & Chance');
 if(type===1)return Q('A fair six-sided die is rolled. What is the probability of rolling a number greater than 4?','1/3',['1/3','1/2','2/3','1/6'],'The favourable results are 5 and 6.','probability','Probability & Chance');
 if(type===2)return Q('A bag has 3 red, 5 blue and 2 green counters. Which colour is most likely to be chosen?','Blue',['Red','Blue','Green','All equally likely'],'The colour with the most counters is most likely.','probability','Probability & Chance');
 return Q('A spinner has 8 equal sections: 4 yellow, 2 red and 2 blue. What is the probability of not landing on yellow?','1/2',['1/2','1/4','3/4','2/3'],'Count all non-yellow sections over the total.','probability','Probability & Chance');
}
function family(level){
 const type=rnd(0,4),[a,b,c,d]=fourNames();
 if(type===0)return Q(`${a} is ${b}'s mother. ${b} is ${c}'s brother. How is ${a} related to ${c}?`,'Mother',['Mother','Sister','Aunt','Grandmother'],'If B and C are siblings, B’s mother is also C’s mother.','family','Family Relationships');
 if(type===1)return Q(`${a} is the father of ${b}. ${b} is the mother of ${c}. How is ${a} related to ${c}?`,'Grandfather',['Grandfather','Uncle','Brother','Father'],'Move two generations down from A to C.','family','Family Relationships');
 if(type===2)return Q(`${a} and ${b} are sisters. ${b}'s son is ${c}. How is ${a} related to ${c}?`,'Aunt',['Aunt','Mother','Cousin','Grandmother'],'A parent’s sister is an aunt.','family','Family Relationships');
 if(type===3)return Q(`${a}'s brother is ${b}. ${b}'s daughter is ${c}. What is ${c} to ${a}?`,'Niece',['Niece','Sister','Aunt','Mother'],'A brother’s daughter is a niece.','family','Family Relationships');
 return Q(`${a} is married to ${b}. ${b}'s sister is ${c}. How is ${c} related to ${a}?`,'Sister-in-law',['Sister-in-law','Cousin','Mother-in-law','Niece'],'A spouse’s sister is a sister-in-law.','family','Family Relationships');
}
function argument(level){
 const type=rnd(0,5);
 if(type===0)return Q('Claim: Walking to school can improve fitness. Which statement best supports the claim?','Walking regularly provides physical activity',['Walking regularly provides physical activity','Some students own bicycles','School starts at 9 am','Rain can make roads wet'],'Choose the statement directly linked to fitness.','argument','Arguments & Assumptions');
 if(type===1)return Q('Claim: The park should have more shade trees. Which argument best supports the claim?','Shade can make the park safer and more comfortable on hot days',['Shade can make the park safer and more comfortable on hot days','Trees have many different leaf shapes','Some people prefer indoor games','The park has a gate'],'Look for a relevant benefit that supports the proposal.','argument','Arguments & Assumptions');
 if(type===2)return Q('Claim: Homework should always be done online. Which is the strongest argument against this claim?','Not every student has reliable internet access',['Not every student has reliable internet access','Computers can display colours','Some websites are interesting','Online documents can use large fonts'],'A strong objection identifies a real problem with the claim.','argument','Arguments & Assumptions');
 if(type===3)return Q('A student says, “The road is flat, so the whole Earth must be flat.” What is the main problem with this reasoning?','A small local view does not prove the shape of the whole Earth',['A small local view does not prove the shape of the whole Earth','Flat roads do not exist','All roads are curved','The Earth is made only of land'],'The evidence is too limited for the large conclusion.','argument','Arguments & Assumptions');
 if(type===4)return Q('A café sold more soup on a cold day than on a warm day. Which is the most reasonable explanation?','Cold weather may increase demand for hot food',['Cold weather may increase demand for hot food','Soup is always cheaper than every other meal','Nobody eats soup in warm weather','The café changed its name'],'Choose a plausible explanation without making an extreme claim.','argument','Arguments & Assumptions');
 return Q('Claim: Wearing a helmet reduces cycling injuries. Which evidence would best support the claim?','A study comparing injury rates of helmeted and non-helmeted cyclists',['A study comparing injury rates of helmeted and non-helmeted cyclists','A list of bicycle colours','A map of cycling paths','A survey of favourite sports'],'Best evidence should directly test the claim.','argument','Arguments & Assumptions');
}
function sets(level){
 const type=rnd(0,5);
 if(type===0)return Q('All squares are rectangles. All rectangles are quadrilaterals. Which conclusion must be true?','All squares are quadrilaterals',['All squares are quadrilaterals','All quadrilaterals are squares','No rectangle is a square','All rectangles are squares'],'Follow the category chain from squares to rectangles to quadrilaterals.','sets','Sets & Classification');
 if(type===1)return Q('All poets are writers. Some writers are teachers. Which conclusion is guaranteed?','All poets are writers',['All poets are writers','Some poets are teachers','All teachers are poets','No writer is a teacher'],'Only one statement is directly guaranteed.','sets','Sets & Classification');
 if(type===2)return Q('Some musicians are athletes. All athletes exercise regularly. Which conclusion must be true?','Some musicians exercise regularly',['Some musicians exercise regularly','All musicians are athletes','All athletes are musicians','No musician exercises'],'The musicians who are athletes inherit the athlete property.','sets','Sets & Classification');
 if(type===3)return Q('No reptiles are mammals. All dolphins are mammals. Which statement must be true?','No dolphins are reptiles',['No dolphins are reptiles','All reptiles are dolphins','Some dolphins are reptiles','All mammals are dolphins'],'If the categories cannot overlap, dolphins cannot be reptiles.','sets','Sets & Classification');
 if(type===4)return Q('All blue cards are numbered. Some numbered cards are large. What can be concluded about blue cards being large?','Nothing definite',['All blue cards are large','No blue cards are large','Some blue cards are large','Nothing definite'],'The “some large” numbered cards may or may not be blue.','sets','Sets & Classification');
 return Q('Some doctors are researchers. All researchers read scientific papers. What must be true?','Some doctors read scientific papers',['Some doctors read scientific papers','All doctors are researchers','No doctors read scientific papers','All paper readers are doctors'],'The doctors who are researchers follow the researcher rule.','sets','Sets & Classification');
}
const makers={logic,evidence,order,seating,time,number,rate,data,probability,family,argument,sets};
function question(topic='mixed',level='mix'){
 let id=topic;
 if(id==='mixed')id=pick(topics)[0];
 const q=makers[id](level);
 // ensure exactly four choices wherever possible and the answer is present
 if(!q.choices.includes(String(q.answer)))q.choices[0]=String(q.answer);
 q.choices=shuffle([...new Set(q.choices)]);
 while(q.choices.length<4){q.choices.push(`Option ${q.choices.length+1}`)}
 q.choices=q.choices.slice(0,4);
 if(!q.choices.includes(String(q.answer)))q.choices[0]=String(q.answer);
 q.choices=shuffle(q.choices);
 return q;
}
window.SKILLUP_THINKING={topics,question};
})();
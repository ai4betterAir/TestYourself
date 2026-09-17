// Topic 19: Year 5 Multi-Step Problem Solving & Reasoning.
// Newly written SkillUP material using the uploaded Grade 5 problem-solving model and strategy lessons as the curriculum reference.
(function(){
  if(!window.SKILLUP_MATH)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const money=n=>`$${Number(n).toFixed(2)}`;
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    let k=1;while(rest.length<3){const v=String(k++);if(v!==ans&&!rest.includes(v))rest.push(v);}
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,explanation};
  }
  function question(){
    const m=R(0,23);let a,b,c,d,ans;
    if(m===0){a=R(70,150);b=R(6,12);const boxes=Math.ceil(a/b),left=boxes*b-a;ans=`${boxes} boxes, ${left} unused`;return Q(`${a} badges are needed. They come ${b} to a box. How many boxes must be bought, and how many badges from the last box will be unused?`,ans,[ans,`${Math.floor(a/b)} boxes, ${a%b} unused`,`${boxes} boxes, ${a%b} unused`,`${boxes+1} boxes, ${left} unused`],'Interpret the remainder in the context. You may need to round the number of boxes up.',`${a} ÷ ${b} = ${Math.floor(a/b)} remainder ${a%b}, so ${boxes} boxes are needed. The last box has ${left} unused.`);}
    if(m===1){b=R(4,9);c=R(5,14);a=b*c+R(1,b-1);ans=c;return Q(`${a} students are placed into teams of ${b}. Only full teams can compete. How many full teams can be made?`,ans,[ans,c+1,a%b,b],'Here the remainder does not make another full team.',`${a} ÷ ${b} = ${c} remainder ${a%b}, so there are ${c} full teams.`);}
    if(m===2){a=R(260,520);b=R(70,160);c=R(10,40);ans=a-b-c;return Q(`A book has ${a} pages. Mia has read ${b} pages and will skip ${c} pages of reference material. How many pages remain to be read?`,ans,[ans,a-b,a-c,b+c],'List the facts, then use more than one step.',`${b}+${c}=${b+c} pages are already read or skipped. ${a}-${b+c}=${ans}.`);}
    if(m===3){a=R(3,7);b=R(250,650)/100;c=R(100,450)/100;ans=a*b+c;return Q(`${a} identical notebooks cost ${money(b)} each and a pen costs ${money(c)}. What is the total cost?`,money(ans),[money(ans),money(a+b+c),money(a*b),money((a+1)*b+c)],'Multiply for the repeated cost, then add the extra item.',`${a}×${money(b)}=${money(a*b)}; plus ${money(c)} gives ${money(ans)}.`);}
    if(m===4){a=R(4,10);b=R(5,18);c=R(2,7);const start=R(20,60);const final=(start+a)*c-b;ans=start;return Q(`A number is increased by ${a}, multiplied by ${c}, then decreased by ${b}. The final result is ${final}. What was the starting number?`,ans,[ans,start+a,final+b,Math.floor(final/c)],'Work backward and undo the operations in reverse order.',`Start with ${final}. Add ${b}, divide by ${c}, then subtract ${a}. The starting number is ${start}.`);}
    if(m===5){const original=pick([40,50,60,80,100]);const discount=pick([5,10,15]);const tax=pick([2,4,6]);const final=original-discount+tax;ans=money(original);return Q(`After a ${money(discount)} discount and then ${money(tax)} tax, an item costs ${money(final)}. What was its original price?`,ans,[ans,money(final-discount-tax),money(final+discount+tax),money(original+tax)],'Work backward: undo the tax first, then undo the discount.',`${money(final)}-${money(tax)}+${money(discount)}=${money(original)}.`);}
    if(m===6){const total=pick([20,25,30,35]);const trikes=R(5,total-5);const bikes=total-trikes;const wheels=3*trikes+2*bikes;ans=`${bikes} bicycles and ${trikes} tricycles`;return Q(`A hire shop has ${total} vehicles, all bicycles or tricycles, with ${wheels} wheels altogether. How many of each are there?`,ans,[ans,`${trikes} bicycles and ${bikes} tricycles`,`${bikes+1} bicycles and ${trikes-1} tricycles`,`${bikes-1} bicycles and ${trikes+1} tricycles`],'A table of possible combinations reveals a pattern in the wheel totals.',`${bikes}×2 + ${trikes}×3 = ${wheels}, and ${bikes}+${trikes}=${total}.`);}
    if(m===7){a=R(1,4);b=R(1,5);const terms=R(5,8);let total=0,last=a;for(let i=0;i<terms;i++){total+=last;last+=b;}ans=total;return Q(`A reward starts at $${a} on day 1 and increases by $${b} each day. How much is received altogether over ${terms} days?`,money(ans),[money(ans),money(last),money(a+b*terms),money(ans-b)],'Make a table of each day's amount and keep a running total.',`The daily amounts form an arithmetic pattern; their total is ${money(ans)}.`);}
    if(m===8){const names=['Ali','Ben','Cara'];const vals=shuffle([12,18,24]);const clues=[`${names[0]} scored more than ${names[1]}`,`${names[2]} scored less than ${names[0]}`];const sorted=[...vals].sort((x,y)=>y-x);const mapping={};mapping[names[0]]=sorted[0];mapping[names[1]]=sorted[1];mapping[names[2]]=sorted[2];ans=`${names[0]}: ${mapping[names[0]]}, ${names[1]}: ${mapping[names[1]]}, ${names[2]}: ${mapping[names[2]]}`;return Q(`Three students scored 12, 18 and 24 points. ${clues[0]}. ${clues[1]}. Which assignment fits all clues?`,ans,[ans,`${names[0]}: 18, ${names[1]}: 24, ${names[2]}: 12`,`${names[0]}: 12, ${names[1]}: 18, ${names[2]}: 24`,`${names[0]}: 24, ${names[1]}: 12, ${names[2]}: 18`],'Use logical reasoning to eliminate choices that break a clue.',`The only assignment satisfying both clues is ${ans}.`);}
    if(m===9){return Q('A problem says: “A bus carries 48 students. Each ticket costs $3. The bus is blue. How much do all tickets cost?” Which fact is not needed?','The bus is blue',['The bus is blue','48 students','$3 per ticket','The number of tickets'],'Separate useful facts from extra information.','The colour of the bus does not affect the ticket total.');}
    if(m===10){a=R(2,5);b=R(3,8);ans=a*12*b;return Q(`A club buys ${a} dozen juice boxes for each of ${b} groups. How many juice boxes are bought altogether?`,ans,[ans,a*b,a*12,a*b*10],'Look for hidden information: one dozen means 12.',`${a} dozen = ${a*12}; then ${a*12}×${b}=${ans}.`);}
    if(m===11){a=R(3,9);b=R(4,12);c=R(2,8);ans=(a*b)-c;return Q(`Which number sentence matches this story? “There are ${a} trays with ${b} muffins on each tray. ${c} muffins are eaten.”`,`${a} × ${b} − ${c}`,[`${a} × ${b} − ${c}`,`${a} + ${b} − ${c}`,`${a} × (${b} − ${c})`,`${a} + ${b} + ${c}`],'Translate each part of the story into an operation before calculating.',`${a} equal groups of ${b} means multiply, then subtract the ${c} eaten.`);}
    if(m===12){a=R(190,410);b=R(190,410);const exact=a+b;const est=Math.round(a/100)*100+Math.round(b/100)*100;ans=Math.abs(exact-est)<=100?'reasonable':'not reasonable';return Q(`A student estimates ${a}+${b} as ${est}. Is this estimate reasonable?`,ans,[ans,ans==='reasonable'?'not reasonable':'reasonable','exact only','cannot tell'],'Round the addends yourself and compare the estimate with the exact answer.',`${a}+${b}=${exact}; ${est} is close enough to be a ${ans} estimate.`);}
    if(m===13){const sum=pick([30,40,50,60]);const diff=pick([4,6,8,10]);if((sum+diff)%2)return question();const high=(sum+diff)/2,low=sum-high;ans=`${low} and ${high}`;return Q(`Two whole numbers add to ${sum} and differ by ${diff}. What are the numbers?`,ans,[ans,`${low-1} and ${high+1}`,`${diff} and ${sum-diff}`,`${sum/2} and ${sum/2}`],'Guess and test systematically, or use the sum and difference together.',`${low}+${high}=${sum} and ${high}-${low}=${diff}.`);}
    if(m===14){const target=pick([20,25,30]);const options=[[2,5],[5,2],[10,1],[1,10]];const good=options.filter(x=>x[0]*5+x[1]*2===target);if(!good.length)return question();const g=good[0];ans=`${g[0]} five-dollar notes and ${g[1]} two-dollar coins`;return Q(`Which combination makes exactly $${target}?`,ans,[ans,'2 five-dollar notes and 2 two-dollar coins','1 five-dollar note and 5 two-dollar coins','3 five-dollar notes and 1 two-dollar coin'],'Use guess and test or an organized list, checking the total each time.',`${g[0]}×$5 + ${g[1]}×$2 = $${target}.`);}
    if(m===15){a=R(2,6);b=R(2,6);const total=a+b;ans=total+1;return Q(`How many different whole-number splits are there for ${total} counters between two labelled boxes if either box may be empty?`,ans,[ans,total,total-1,total+2],'Make an organized list: 0 and total, 1 and total−1, and so on.',`There are ${total+1} ordered splits from 0:${total} through ${total}:0.`);}
    if(m===16){const total=pick([40,60,80,100]);const p=pick([20,25,50]);const marked=total*p/100;const left=total-marked;ans=left;return Q(`${p}% of ${total} cards are marked. The rest are unmarked. How many are unmarked?`,ans,[ans,marked,total-p,total],'Combine percent reasoning with subtraction.',`${p}% of ${total}=${marked}; ${total}-${marked}=${left}.`);}
    if(m===17){a=pick([2,3,4]);b=pick([3,4,5]);c=R(2,6);const first=a*c,second=b*c;const p=pick([20,25,50]);const selected=second*p/100;if(!Number.isInteger(selected))return question();ans=selected;return Q(`Red and blue counters are in the ratio ${a}:${b}. A batch has ${first} red and ${second} blue counters. If ${p}% of the blue counters are removed, how many blue counters are removed?`,ans,[ans,second-selected,first*p/100,p],'Use the ratio first, then apply the percent to the correct quantity.',`${p}% of ${second}=${selected}.`);}
    if(m===18){const startH=R(7,9),startM=pick([0,15,30]);const work=pick([120,150,180]);const br=pick([15,30,45]);const elapsed=work+br;const total=startH*60+startM+elapsed;const hh=Math.floor(total/60),mm=total%60;ans=`${hh}:${String(mm).padStart(2,'0')}`;return Q(`A study session starts at ${startH}:${String(startM).padStart(2,'0')}. It includes ${work} minutes of work and a ${br}-minute break. When does it finish?`,ans,[ans,`${Math.floor((startH*60+startM+work)/60)}:${String((startH*60+startM+work)%60).padStart(2,'0')}`,`${hh+1}:${String(mm).padStart(2,'0')}`,`${startH}:${String((startM+br)%60).padStart(2,'0')}`],'Use more than one step: combine the durations, then add to the start time.',`Total elapsed time is ${elapsed} minutes, so the finish time is ${ans}.`);}
    if(m===19){const scale=pick([2,5,10]);const out=R(3,9),back=R(2,8);ans=`${scale*(out+back)} km`;return Q(`On a map, 1 cm represents ${scale} km. A route is ${out} cm out and ${back} cm back by a different road. What is the total actual distance?`,ans,[ans,`${scale*out} km`,`${out+back} km`,`${scale*Math.abs(out-back)} km`],'Add the map distances, then apply the scale.',`${out}+${back}=${out+back} cm; ×${scale}=${scale*(out+back)} km.`);}
    if(m===20){const L=pick([20,24,28,32]),W=pick([12,16,20]);const finalL=L/2,finalW=W/2;ans=`${2*(finalL+finalW)} cm`;return Q(`A ${L} cm by ${W} cm sheet is folded in half lengthways and then in half widthways. What is the perimeter of the final rectangle?`,ans,[ans,`${L+W} cm`,`${2*(L+W)} cm`,`${finalL*finalW} cm`],'Draw a picture or halve each dimension before finding perimeter.',`Final dimensions are ${finalL} cm by ${finalW} cm, so perimeter = ${ans}.`);}
    if(m===21){const mean=pick([60,70,80]);const vals=[mean-10,mean-5,mean+5];const missing=mean*4-vals.reduce((x,y)=>x+y,0);ans=missing;return Q(`Four scores have a mean of ${mean}. Three scores are ${vals.join(', ')}. What is the fourth score?`,ans,[ans,mean,missing+5,missing-5],'Use the mean to find the total of all four scores, then subtract the known scores.',`Total needed = ${mean}×4=${mean*4}; known total = ${vals.reduce((x,y)=>x+y,0)}; missing score = ${ans}.`);}
    if(m===22){const total=pick([12,18,24,30]);const used1=pick([1,2,3])/6;const used2=pick([1,2])/4;const amount1=total*used1,amount2=total*used2;if(!Number.isInteger(amount1)||!Number.isInteger(amount2)||amount1+amount2>=total)return question();ans=total-amount1-amount2;return Q(`A ${total} L tank uses ${used1} of its capacity in the morning and ${used2} of its capacity in the afternoon. How many litres remain?`,`${ans} L`,[`${ans} L`,`${total-amount1} L`,`${total-amount2} L`,`${amount1+amount2} L`],'Find each fraction of the whole, then subtract both amounts from the total.',`Morning uses ${amount1} L and afternoon uses ${amount2} L, leaving ${ans} L.`);}
    const z=pick([
      ['You know the final result and need the starting value.','Work Backward'],
      ['You need to compare many possible combinations systematically.','Make a Table'],
      ['A problem contains several clues that rule out possibilities.','Logical Reasoning'],
      ['A problem needs two or more different operations.','Use More Than One Step'],
      ['You need to show a shape or spatial situation clearly.','Use a Model/Diagram']
    ]);ans=z[1];return Q(`Which strategy is most useful? ${z[0]}`,ans,[ans,'Guess and Test','Interpret the Remainder','Find a Percent'],'Match the structure of the problem to a suitable strategy.',`${ans} directly fits this type of problem.`);
  }

  if(window.TY_YEAR5_TESTS){
    window.TY_YEAR5_TESTS.topics=window.TY_YEAR5_TESTS.topics.filter(x=>x[0]!=='wordproblems');
    const i=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='ratiopercent');
    window.TY_YEAR5_TESTS.topics.splice(i>=0?i+1:window.TY_YEAR5_TESTS.topics.length-1,0,['wordproblems','🧩','Multi-Step Problem Solving & Reasoning','Choose strategies, use several steps, work backward, interpret remainders and check answers']);
    const oldQ=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=t=>t==='wordproblems'?question():oldQ(t);
  }

  const oldLearn=window.SKILLUP_MATH.learn;
  const oldEnhanced=window.SKILLUP_MATH.enhanced;
  window.SKILLUP_MATH.learn=function(g,t,fallback){
    if(String(g)==='5'&&t==='wordproblems')return{
      title:'Multi-Step Problem Solving & Reasoning',
      concept:'Strong problem solving is not only about calculating. First understand the situation, identify useful facts and the question, choose a strategy, carry out the plan, and check whether the answer is reasonable. Different problems may need different strategies or more than one strategy.',
      steps:[
        'Visualise the situation. List the facts, identify the exact question, and notice any extra or hidden information.',
        'Choose a plan. Useful strategies include logical reasoning, interpret the remainder, use more than one step, make a table, find a pattern, make an organised list, draw a picture or model, guess and test, work backward, write a number sentence or equation, and combine strategies.',
        'For a multi-step problem, decide the order of operations before calculating. Each step should answer part of the overall question.',
        'Interpret remainders in context. A remainder may mean round up, report what is left, or ignore the incomplete group, depending on the question.',
        'When the final result is known but the start is unknown, work backward using inverse operations in reverse order.',
        'Tables and organised lists help when many possibilities must be checked. Look for a pattern so you do not test choices randomly.',
        'Use estimation before or after computing to decide whether an answer is reasonable.',
        'Check that you answered the actual question, used the correct units, and did not use irrelevant information.'
      ],
      examples:[
        {q:'115 items come 9 to a box. How many boxes are needed?',steps:['115 ÷ 9 = 12 remainder 7.','Twelve boxes are not enough because 7 items still need a box.','Round up to 13 boxes.'],answer:'13 boxes'},
        {q:'A 341-page book has 128 pages read and 19 pages skipped. How many remain?',steps:['Combine what is already completed: 128 + 19 = 147.','Subtract from the total: 341 − 147 = 194.'],answer:'194 pages'},
        {q:'A number is increased by 5, doubled, then decreased by 3 to give 27. Find the number.',steps:['Work backward from 27.','Undo −3 by adding 3: 30.','Undo ×2 by dividing by 2: 15.','Undo +5 by subtracting 5: 10.'],answer:'10'},
        {q:'There are 25 bicycles/tricycles and 60 wheels. How can a table help?',steps:['List possible numbers of bicycles and tricycles that total 25.','Calculate the wheels for each row.','Stop when the total reaches 60.'],answer:'A systematic table reveals the matching combination.'},
        {q:'A $20 item is 10% off, then $1.08 tax is added.',steps:['Find the discount: 10% of $20 = $2.','Sale price = $18.','Add tax: $18 + $1.08 = $19.08.'],answer:'$19.08'}
      ],
      mistake:'Do not grab the first numbers you see and calculate immediately. First decide what the question is asking and whether every fact is actually needed.',
      quick:'Before finalising, ask: Did I answer the question? Is the answer reasonable? Are the units correct?'
    };
    return oldLearn(g,t,fallback);
  };
  window.SKILLUP_MATH.enhanced=function(g,t){return String(g)==='5'&&t==='wordproblems'?question():oldEnhanced(g,t)};
})();
// Topic 10 upgrade: Year 5 Probability & Statistics.
// Newly written SkillUP material covering the Year 5 curriculum and problem-solving style.
(function(){
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
  const frac=(n,d)=>{const g=gcd(n,d);return `${n/g}/${d/g}`};
  function Q(text,answer,choices,tip,explanation){const ans=String(answer);let c=uniq((choices||[]).map(String));if(!c.includes(ans))c.unshift(ans);return{text,answer:ans,choices:shuffle(c).slice(0,4),tip,explanation};}
  function median(vals){const a=[...vals].sort((x,y)=>x-y),m=Math.floor(a.length/2);return a.length%2?a[m]:(a[m-1]+a[m])/2;}
  function modeOf(vals){const m=new Map();vals.forEach(v=>m.set(v,(m.get(v)||0)+1));const best=Math.max(...m.values());const modes=[...m].filter(x=>x[1]===best).map(x=>x[0]);return best===1?'no mode':modes.sort((a,b)=>a-b).join(' and ');}
  function topicQuestion(){
    const mode=R(0,21);let a,b,c,d,total,ans,vals;
    if(mode===0){a=R(1,5);b=R(1,5);c=R(1,5);total=a+b+c;ans=frac(a,total);return Q(`A bag has ${a} red, ${b} blue and ${c} green counters. What is P(red)?`,ans,[ans,frac(b,total),frac(c,total),frac(a,b+c)],'Probability = favourable outcomes ÷ total equally likely outcomes.',`There are ${a} favourable red counters out of ${total}, so P(red) = ${ans}.`);}
    if(mode===1){a=R(1,5);b=R(1,5);c=R(1,5);total=a+b+c;ans=frac(b+c,total);return Q(`A bag has ${a} red, ${b} blue and ${c} green counters. What is P(not red)?`,ans,[ans,frac(a,total),frac(b,total),frac(c,total)],'Count every outcome that is not red.',`${b+c} of the ${total} counters are not red, so the probability is ${ans}.`);}
    if(mode===2){a=pick([1,2,3,4]);total=pick([6,8,10]);const trials=pick([60,80,100,120]);ans=Math.round(a/total*trials);return Q(`An event has probability ${a}/${total}. About how many times would you expect it in ${trials} trials?`,ans,[ans,Math.round((total-a)/total*trials),trials-a,total*a],'Expected frequency ≈ probability × number of trials.',`${a}/${total} × ${trials} ≈ ${ans}.`);}
    if(mode===3){const first=pick([2,3,4]),second=pick([2,3,4,6]);ans=first*second;return Q(`An experiment has ${first} possible outcomes for the first event and ${second} for the second. How many ordered outcomes are in the sample space?`,ans,[ans,first+second,Math.max(first,second),ans+first],'A tree diagram has one branch for each second-event outcome from every first-event branch.',`${first} × ${second} = ${ans} ordered outcomes.`);}
    if(mode===4){const sides1=pick([2,3,4]),sides2=pick([2,3,5]);total=sides1*sides2;ans=frac(1,total);return Q(`Two independent spinners have ${sides1} and ${sides2} equal sections. What is the probability of one specified ordered pair of results?`,ans,[ans,frac(1,sides1+sides2),frac(2,total),frac(1,Math.max(sides1,sides2))],'For independent equally likely events, multiply the single-event probabilities.',`P(one specified pair) = 1/${sides1} × 1/${sides2} = ${ans}.`);}
    if(mode===5){a=R(2,5);b=R(2,5);total=a+b;ans=frac(a,total)*0;const num=a*b,den=total*(total-1),f=frac(num,den);return Q(`A bag has ${a} red and ${b} blue counters. Two counters are drawn without replacement. What is P(red then blue)?`,f,[f,frac(a*b,total*total),frac(a,total),frac(b,total)],'Without replacement, the total number of counters decreases after the first draw.',`P(red then blue) = ${a}/${total} × ${b}/${total-1} = ${f}.`);}
    if(mode===6){vals=[R(5,20),R(5,20),R(5,20),R(5,20),R(5,20)];ans=Math.max(...vals)-Math.min(...vals);return Q(`Find the range of ${vals.join(', ')}.`,ans,[ans,Math.max(...vals),Math.min(...vals),ans+1],'Range = greatest value − least value.',`${Math.max(...vals)} − ${Math.min(...vals)} = ${ans}.`);}
    if(mode===7){vals=[R(5,30),R(5,30),R(5,30),R(5,30),R(5,30)];ans=median(vals);return Q(`Find the median of ${vals.join(', ')}.`,ans,[ans,Math.min(...vals),Math.max(...vals),Math.round(vals.reduce((s,x)=>s+x,0)/vals.length)],'Order the values first, then take the middle value.',`In order, the middle value is ${ans}.`);}
    if(mode===8){const base=R(6,16);vals=[base,R(3,20),base,R(3,20),R(3,20)];ans=modeOf(vals);return Q(`Find the mode of ${vals.join(', ')}.`,ans,[ans,'no mode',String(Math.max(...vals)),String(Math.min(...vals))],'The mode is the value that occurs most often.',`${ans} occurs most often.`);}
    if(mode===9){const m=R(8,30),offsets=[-3,-1,1,3];vals=offsets.map(x=>m+x);ans=m;return Q(`Find the mean of ${vals.join(', ')}.`,ans,[ans,m+1,m-1,vals.reduce((s,x)=>s+x,0)],'Add all values, then divide by the number of values.',`The total is ${m*4}; ${m*4} ÷ 4 = ${m}.`);}
    if(mode===10){const n=4,target=R(10,30);const first=[R(5,25),R(5,25),R(5,25)];const missing=target*n-first.reduce((s,x)=>s+x,0);if(missing<1||missing>50)return topicQuestion();ans=missing;return Q(`The mean of four scores is ${target}. Three scores are ${first.join(', ')}. What is the missing score?`,ans,[ans,ans+4,Math.max(0,ans-4),target],'Work backwards: total needed = mean × number of values.',`Required total = ${target} × 4 = ${target*4}. Subtract the known scores to get ${ans}.`);}
    if(mode===11){const freqs=[R(2,8),R(2,8),R(2,8),R(2,8)];ans=freqs.reduce((s,x)=>s+x,0);return Q(`A frequency table has category frequencies ${freqs.join(', ')}. How many observations are there altogether?`,ans,[ans,Math.max(...freqs),freqs[3],ans+5],'Add the frequencies to find the total number of observations.',`${freqs.join(' + ')} = ${ans}.`);}
    if(mode===12){const freqs=[R(2,6),R(2,6),R(2,6),R(2,6)];const cum=[freqs[0],freqs[0]+freqs[1],freqs[0]+freqs[1]+freqs[2],freqs.reduce((s,x)=>s+x,0)];const idx=R(1,3);ans=cum[idx];return Q(`Frequencies are ${freqs.join(', ')}. What is the cumulative frequency after category ${idx+1}?`,ans,[ans,freqs[idx],cum[idx-1],cum[3]],'Cumulative frequency is a running total.',`Add the first ${idx+1} frequencies: ${freqs.slice(0,idx+1).join(' + ')} = ${ans}.`);}
    if(mode===13){const data=[70,80,80,85,90,90,90,95,100];const score=pick([70,80,85,90,95,100]);ans=data.filter(x=>x===score).length;return Q(`A line plot represents the scores ${data.join(', ')}. How many Xs should be above ${score}?`,ans,[ans,ans+1,Math.max(0,ans-1),data.length],'Each X represents one occurrence of that value.',`${score} appears ${ans} time${ans===1?'':'s'}.`);}
    if(mode===14){const core=[42,44,45,45,46,47,48],out=pick([10,80]);vals=[...core,out];ans=out;return Q(`Which value is the outlier in ${vals.join(', ')}?`,ans,[ans,45,47,42],'An outlier lies well away from the main cluster of data.',`${out} is far from the other values, so it is the outlier.`);}
    if(mode===15){const intervals=['0–9','10–19','20–29','30–39'];const freq=[R(1,5),R(5,10),R(2,7),R(1,4)];const max=Math.max(...freq);ans=intervals[freq.indexOf(max)];return Q(`A histogram has frequencies ${freq.join(', ')} for intervals ${intervals.join(', ')}. Which interval has the greatest frequency?`,ans,intervals,'The tallest histogram bar represents the greatest frequency.',`${ans} has frequency ${max}, the largest value.`);}
    if(mode===16){const q='changes in temperature over seven days';ans='line graph';return Q(`Which graph is most suitable for showing ${q}?`,ans,[ans,'bar graph','circle graph','pictograph'],'Use a line graph to show change or trend over time.','A line graph makes rises and falls over time easy to see.');}
    if(mode===17){ans='circle graph';return Q('Which graph is most suitable for showing how a class budget is divided among several categories?',ans,[ans,'line graph','line plot','histogram'],'A circle graph shows how parts relate to a whole.','The whole circle represents the total budget and sectors show its parts.');}
    if(mode===18){const days=[R(20,40),R(30,50),R(40,60),R(25,45)];let maxRise=-Infinity,idx=0;for(let i=1;i<days.length;i++){const rise=days[i]-days[i-1];if(rise>maxRise){maxRise=rise;idx=i;}}ans=`Day ${idx} to Day ${idx+1}`;return Q(`A line graph has values ${days.join(', ')} for Days 1–4. Between which consecutive days is the greatest increase?`,ans,[ans,'Day 1 to Day 2','Day 2 to Day 3','Day 3 to Day 4'],'Compare consecutive differences, not just the highest point.',`The largest increase is ${maxRise} from ${ans}.`);}
    if(mode===19){ans='The vertical scale starts too high and exaggerates the change';return Q('A bar graph comparing 98 and 100 starts its vertical axis at 97 instead of 0. Why could this be misleading?',ans,[ans,'The bars should be horizontal','The categories need alphabetical order','Bar graphs cannot show two values'],'A truncated scale can make a small difference look much larger.','Starting very near the data values exaggerates the visual difference.');}
    if(mode===20){const p=pick([0,0.25,0.5,0.75,1]);let label=p===0?'impossible':p===1?'certain':p===0.5?'equally likely':p<0.5?'unlikely':'likely';ans=label;return Q(`An event has probability ${p}. Which description fits best?`,ans,[ans,'impossible','unlikely','likely','certain'],'Probabilities near 0 are unlikely; near 1 are likely. 0 is impossible and 1 is certain.',`${p} is described as ${label}.`);}
    const heads=2,totalOut=4;ans=frac(3,4);return Q('Two fair coins are tossed. What is the probability of getting at least one head?',ans,[ans,'1/4','1/2','1'],'List HH, HT, TH, TT, or use the complement of no heads.','Three of the four outcomes have at least one head, so the probability is 3/4.');
  }

  if(window.TY_YEARS345?.topics?.['5']){
    const row=window.TY_YEARS345.topics['5'].find(x=>x[0]==='data');
    if(row){row[1]='▤';row[2]='Probability & Statistics';row[3]='Probability, tree diagrams, averages, frequency tables, line plots, histograms and graphs';}
  }
  if(window.TY_YEAR5_TESTS){
    if(!window.TY_YEAR5_TESTS.topics.some(x=>x[0]==='data')){
      const i=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='decimals');
      window.TY_YEAR5_TESTS.topics.splice(i>=0?i+1:8,0,['data','▤','Probability & Statistics','Probability, data summaries, plots, histograms and graph interpretation']);
    }
    const oldQuestion=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=function(t){return t==='data'?topicQuestion():oldQuestion(t)};
  }
  if(window.SKILLUP_MATH){
    const oldLearn=window.SKILLUP_MATH.learn,oldEnhanced=window.SKILLUP_MATH.enhanced;
    window.SKILLUP_MATH.learn=function(g,t,fallback){
      if(String(g)==='5'&&t==='data')return{
        title:'Probability & Statistics',
        concept:'Probability describes how likely an event is. Statistics helps us collect, organise, summarise and interpret data. We can use sample spaces, tree diagrams, frequency tables, averages and graphs to make sense of information.',
        steps:[
          'For equally likely outcomes, probability = favourable outcomes ÷ total possible outcomes. A probability of 0 is impossible and 1 is certain.',
          'Use a tree diagram or organised list when an experiment has more than one event. With replacement events are independent; without replacement the second probability changes.',
          'Organise survey results with tally marks, frequencies and cumulative frequencies.',
          'Range = greatest − least. Median is the middle value after ordering. Mean = total ÷ number of values. Mode is the most frequent value.',
          'Use line plots to show repeated numerical values and spot clusters or outliers. Histograms group numerical data into equal, non-overlapping intervals.',
          'Choose graphs for purpose: bar graphs compare categories, line graphs show change over time, and circle graphs show parts of a whole.'
        ],
        examples:[
          {q:'A bag has 3 red, 2 blue and 5 green counters. Find P(red).',steps:['There are 10 counters altogether.','There are 3 favourable red outcomes.','Probability = 3 ÷ 10.'],answer:'3/10'},
          {q:'Two fair coins are tossed. Find P(at least one head).',steps:['Sample space: HH, HT, TH, TT.','Three outcomes contain at least one head.'],answer:'3/4'},
          {q:'Find the range, median, mean and mode of 6, 8, 8, 10, 13.',steps:['Range: 13 − 6 = 7.','Median: ordered middle value = 8.','Mean: (6 + 8 + 8 + 10 + 13) ÷ 5 = 9.','Mode: 8 occurs most often.'],answer:'Range 7; Median 8; Mean 9; Mode 8'},
          {q:'Which graph should show daily temperature across one week?',steps:['The values are measured across time.','We want to see rises, falls and trends.'],answer:'Line graph'},
          {q:'A histogram groups scores into 0–9, 10–19, 20–29 and 30–39.',steps:['Intervals must not overlap.','Bars touch because the intervals represent continuous grouped numerical data.','The tallest bar shows the interval with greatest frequency.'],answer:'Read frequency from the height of each touching bar'}
        ],
        mistake:'Do not use favourable outcomes over the wrong total. For median, always order the data first. Mean, median and mode are different ideas. Histogram bars touch; ordinary bar-graph bars are separated. Without replacement, the second probability changes.',
        quick:'Probability: favourable ÷ total. Data: organise → summarise → graph → interpret.'
      };
      return oldLearn?oldLearn(g,t,fallback):null;
    };
    window.SKILLUP_MATH.enhanced=function(g,t){if(String(g)==='5'&&t==='data')return topicQuestion();return oldEnhanced?oldEnhanced(g,t):null;};
  }
})();
// Selective Topic 10: Probability & Statistics Reasoning.
// Newly written SkillUP questions inspired by the uploaded Grade 5 probability/statistics chapter.
(function(){
  if(!window.SKILLUP_MR_EXTRA)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)],shuffle=a=>[...a].sort(()=>Math.random()-.5),uniq=a=>[...new Set(a.map(String))];
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),frac=(n,d)=>{const g=gcd(n,d);return `${n/g}/${d/g}`};
  const Q=(text,answer,choices,tip)=>({text,answer:String(answer),choices:shuffle(uniq(choices)),tip,topic:'sel_prob_stats',name:'Probability & Statistics'});
  const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
  function question(){
    const t=R(0,14);let a,b,c,total,ans,vals;
    if(t===0){a=R(2,6);b=R(2,6);total=a+b;ans=frac(a*b,total*(total-1));return Q(`A bag has ${a} red and ${b} blue counters. Two are drawn without replacement. What is P(red then blue)?`,ans,[ans,frac(a*b,total*total),frac(a,total),frac(b,total)],'Without replacement, reduce the total after the first draw.');}
    if(t===1){const pNum=pick([1,2,3]),pDen=pick([4,5,6,8]);const trials=pDen*R(12,30);ans=pNum*trials/pDen;return Q(`An event has probability ${pNum}/${pDen}. In ${trials} trials, what is the expected number of occurrences?`,ans,[ans,trials-ans,pNum*pDen,trials/pNum],'Expected frequency = probability × number of trials.');}
    if(t===2){const n1=pick([2,3,4]),n2=pick([3,4,5]),n3=pick([2,3]);ans=n1*n2*n3;return Q(`A three-stage experiment has ${n1}, ${n2} and ${n3} possible outcomes at each stage. How many ordered outcomes are possible?`,ans,[ans,n1+n2+n3,n1*n2+n3,n1+n2*n3],'Multiply the number of branches at each stage.');}
    if(t===3){ans='3/4';return Q('Two fair coins are tossed. What is the probability of at least one head?','3/4',['3/4','1/4','1/2','1'],'Use the complement: only TT has no heads.');}
    if(t===4){a=R(3,8);b=R(3,8);c=R(3,8);total=a+b+c;ans=frac(b+c,total);return Q(`A box contains ${a} red, ${b} blue and ${c} yellow tokens. What is P(not red)?`,ans,[ans,frac(a,total),frac(b,total),frac(c,total)],'Complement probability counts every outcome outside the named event.');}
    if(t===5){const target=R(15,35);const known=[R(10,35),R(10,35),R(10,35),R(10,35)];const missing=target*5-known.reduce((s,x)=>s+x,0);if(missing<0||missing>60)return question();ans=missing;return Q(`Five scores have mean ${target}. Four scores are ${known.join(', ')}. What is the fifth score?`,ans,[ans,ans+5,Math.max(0,ans-5),target],'Total required = mean × number of scores.');}
    if(t===6){const a1=R(18,30),a2=R(18,30),a3=R(18,30),a4=R(18,30);vals=[a1,a2,a3,a4,80];const before=mean(vals.slice(0,4));const after=mean(vals);ans=after>before?'increases':'decreases';return Q(`The data ${vals.slice(0,4).join(', ')} have one new value, 80, added. What happens to the mean?`,ans,[ans,ans==='increases'?'decreases':'increases','stays exactly the same','cannot be determined'],'A large outlier above the existing values pulls the mean upward.');}
    if(t===7){vals=[4,6,7,8,8,9,10];const out=50;const med1=8,med2=(8+8)/2;ans='The mean changes much more than the median';return Q(`The set ${vals.join(', ')} gets an extra value ${out}. Which statement is best?`,ans,[ans,'The median changes much more than the mean','Neither mean nor median changes','Both become 50'],'Outliers usually affect the mean more strongly than the median.');}
    if(t===8){const freq=[R(2,6),R(3,8),R(4,9),R(2,7)];const cum=[freq[0],freq[0]+freq[1],freq[0]+freq[1]+freq[2],freq.reduce((s,x)=>s+x,0)];ans=cum[2];return Q(`A frequency table has frequencies ${freq.join(', ')}. What is the cumulative frequency after the third interval?`,ans,[ans,freq[2],cum[1],cum[3]],'Cumulative frequency is the running total up to that interval.');}
    if(t===9){const intervals=['0–9','10–19','20–29','30–39'];const f=[R(1,4),R(5,9),R(2,7),R(1,5)];const max=Math.max(...f);ans=intervals[f.indexOf(max)];return Q(`A histogram has frequencies ${f.join(', ')} across intervals ${intervals.join(', ')}. Which interval contains the modal class?`,ans,intervals,'The modal class is the interval with the tallest bar.');}
    if(t===10){ans='line graph';return Q('Which graph is most suitable for showing how rainfall changes month by month across one year?',ans,[ans,'circle graph','pictograph','single-number table'],'Use line graphs for change and trend over time.');}
    if(t===11){ans='The scale makes a small difference look much larger';return Q('Two bars represent 98 and 100, but the vertical axis begins at 97. What is the main problem?',ans,[ans,'The categories are too short','There are too many bars','A bar graph cannot compare values'],'A truncated axis can exaggerate a small difference visually.');}
    if(t===12){const m=R(12,28);vals=[m-4,m-2,m,m+2,m+4];ans=m;return Q(`The ordered data are ${vals.join(', ')}. Which value is both the median and the mean?`,ans,[ans,m-2,m+2,m+4],'For a symmetric arithmetic sequence, the centre value equals both mean and median.');}
    if(t===13){const p=pick([0.2,0.25,0.4,0.6,0.75,0.8]);ans=(1-p).toFixed(2).replace(/0+$/,'').replace(/\.$/,'');return Q(`P(A) = ${p}. What is P(not A)?`,ans,[ans,String(p),String(Math.min(1,p+0.1)),String(Math.max(0,p-0.1))],'An event and its complement add to 1.');}
    const data=[8,9,9,10,10,10,11,12,35];ans=35;return Q(`Which value is the outlier in ${data.join(', ')}?`,ans,[ans,10,12,8],'Look for a value far from the main cluster.');
  }
  if(!window.SKILLUP_MR_EXTRA.topics.some(x=>x[0]==='sel_prob_stats')){
    const i=window.SKILLUP_MR_EXTRA.topics.findIndex(x=>x[0]==='sel_decimals');
    window.SKILLUP_MR_EXTRA.topics.splice(i>=0?i+1:10,0,['sel_prob_stats','▤','Probability & Statistics','Multi-event probability, averages, outliers, cumulative frequency, histograms and graph reasoning']);
  }
  const old=window.SKILLUP_MR_EXTRA.question.bind(window.SKILLUP_MR_EXTRA);
  window.SKILLUP_MR_EXTRA.question=id=>id==='sel_prob_stats'?question():old(id);
})();
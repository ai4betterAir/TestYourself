// Topic 25: Year 5 Comparative Graphs & Data Displays.
// Newly written SkillUP material based on the Grade 5 double line/double bar graph enrichment lesson.
(function(){
  if(!window.SKILLUP_MATH)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    let k=1;while(rest.length<3){const v=String(k++);if(v!==ans&&!rest.includes(v))rest.push(v);}
    return{text,answer:ans,choices:shuffle([ans,...rest]),tip,explanation};
  }
  const cats=['Fantasy','Folk Tales','Science Fiction','Sports'];
  const periods=['Q1','Q2','Q3','Q4'];
  function barData(){let a=[R(5,12),R(5,12),R(5,12),R(5,12)],b=[R(5,12),R(5,12),R(5,12),R(5,12)];const k=R(0,3);b[k]=a[k];return{a,b};}
  function lineData(){const a=[R(72,88),R(78,92),R(80,95),R(82,98)],b=[R(70,90),R(75,94),R(78,96),R(80,98)];const k=R(0,3);b[k]=a[k];return{a,b};}
  const txt=(labels,a,b,n1='A',n2='B')=>`${n1}: ${labels.map((x,i)=>x+' '+a[i]).join(', ')}; ${n2}: ${labels.map((x,i)=>x+' '+b[i]).join(', ')}`;
  function argmax(arr){let k=0;for(let i=1;i<arr.length;i++)if(arr[i]>arr[k])k=i;return k;}
  function argmin(arr){let k=0;for(let i=1;i<arr.length;i++)if(arr[i]<arr[k])k=i;return k;}
  function question(){
    const m=R(0,19);let d,k,ans,diffs,changes,totalA,totalB;
    if(m===0){d=barData();k=d.a.findIndex((v,i)=>v===d.b[i]);ans=cats[k];return Q(`Two classes were compared by a double bar graph. ${txt(cats,d.a,d.b,'Class 5A','Class 5B')}. In which category are the class totals equal?`,ans,cats,'Compare the two bars for the same category.',`Both classes have ${d.a[k]} students for ${ans}.`);}
    if(m===1){d=barData();diffs=d.a.map((v,i)=>v-d.b[i]);k=argmax(diffs);ans=cats[k];return Q(`Use the class data: ${txt(cats,d.a,d.b,'Class 5A','Class 5B')}. In which category does Class 5A exceed Class 5B by the greatest amount?`,ans,cats,'Subtract Class 5B from Class 5A for each category.',`The greatest positive difference is in ${ans}.`);}
    if(m===2){d=barData();k=argmax(d.a);ans=cats[k];return Q(`Class 5A data: ${cats.map((x,i)=>x+' '+d.a[i]).join(', ')}. Which category is most preferred?`,ans,cats,'Find the tallest Class 5A bar.',`${ans} has the greatest value, ${d.a[k]}.`);}
    if(m===3){d=barData();k=argmin(d.b);ans=cats[k];return Q(`Class 5B data: ${cats.map((x,i)=>x+' '+d.b[i]).join(', ')}. Which category is least preferred?`,ans,cats,'Find the smallest Class 5B value.',`${ans} has the least value, ${d.b[k]}.`);}
    if(m===4){d=barData();k=R(0,3);ans=Math.abs(d.a[k]-d.b[k]);return Q(`In ${cats[k]}, Class 5A has ${d.a[k]} students and Class 5B has ${d.b[k]}. What is the difference?`,ans,[ans,ans+1,ans+2,d.a[k]+d.b[k]],'Find the absolute difference between the two bars.',`|${d.a[k]} − ${d.b[k]}| = ${ans}.`);}
    if(m===5){d=barData();k=R(0,3);ans=d.a[k]+d.b[k];return Q(`For ${cats[k]}, Class 5A has ${d.a[k]} students and Class 5B has ${d.b[k]}. How many students altogether?`,ans,[ans,d.a[k],d.b[k],Math.abs(d.a[k]-d.b[k])],'Add the two sets for the same category.',`${d.a[k]} + ${d.b[k]} = ${ans}.`);}
    if(m===6){d=lineData();k=d.a.findIndex((v,i)=>v===d.b[i]);ans=periods[k];return Q(`Math: ${periods.map((x,i)=>x+' '+d.a[i]).join(', ')}; Science: ${periods.map((x,i)=>x+' '+d.b[i]).join(', ')}. In which quarter are the marks equal?`,ans,periods,'Look for the same value in both data sets at the same quarter.',`Both marks are ${d.a[k]} in ${ans}.`);}
    if(m===7){d=lineData();const lows=periods.filter((x,i)=>d.b[i]<d.a[i]);ans=lows.length?lows.join(', '):'none';return Q(`Math: ${d.a.join(', ')} for Q1–Q4; Science: ${d.b.join(', ')} for Q1–Q4. In which quarter(s) is Science below Math?`,ans,[ans,'Q1 only','Q2 and Q3','none'],'Compare the two values quarter by quarter.',`Science is below Math in ${ans}.`);}
    if(m===8){d=lineData();diffs=d.a.map((v,i)=>Math.abs(v-d.b[i]));k=argmax(diffs);ans=periods[k];return Q(`Math: ${d.a.join(', ')}; Science: ${d.b.join(', ')} for Q1–Q4. In which quarter is the gap between the two subjects greatest?`,ans,periods,'Compute the absolute difference in each quarter.',`${ans} has the largest gap of ${diffs[k]} marks.`);}
    if(m===9){d=lineData();changes=[];for(let i=1;i<4;i++)changes.push(Math.abs(d.a[i]-d.a[i-1]));k=argmax(changes)+1;ans=`${periods[k-1]} to ${periods[k]}`;return Q(`Math marks are ${d.a.join(', ')} for Q1–Q4. Between which consecutive quarters is the largest change?`,ans,[ans,'Q1 to Q2','Q2 to Q3','Q3 to Q4'],'Compare consecutive differences.',`The largest change is from ${periods[k-1]} to ${periods[k]}.`);}
    if(m===10)return Q('Which graph is usually better for comparing how two data sets change over time?','double line graph',['double line graph','double bar graph','circle graph','pictograph only'],'Time trends are naturally shown with lines.','A double line graph lets two time-based trends be compared on the same grid.');
    if(m===11)return Q('Which graph is usually better for comparing two groups across categories such as favourite book types?','double bar graph',['double bar graph','double line graph','number line','tree diagram'],'Categories are compared side by side with bars.','A double bar graph is well suited to two groups across the same categories.');
    if(m===12)return Q('Why does a double graph need a key?','to identify which line or bar set represents each data set',['to identify which line or bar set represents each data set','to show the title only','to replace the scale','to give the final answer'],'The two sets must be distinguishable.','The key tells which visual mark belongs to each data set.');
    if(m===13){d=barData();totalA=d.a.reduce((x,y)=>x+y,0);totalB=d.b.reduce((x,y)=>x+y,0);ans=totalA>totalB?'Class 5A':totalB>totalA?'Class 5B':'equal totals';return Q(`Across all four categories, Class 5A has ${d.a.join(', ')} and Class 5B has ${d.b.join(', ')}. Which class has the greater total?`,ans,[ans,'Class 5A','Class 5B','equal totals'],'Add all four values for each class.',`Totals are ${totalA} and ${totalB}, so ${ans}.`);}
    if(m===14){d=lineData();const chA=d.a[3]-d.a[0],chB=d.b[3]-d.b[0];ans=chA>chB?'Math':chB>chA?'Science':'same increase';return Q(`Math changes from ${d.a[0]} to ${d.a[3]}; Science changes from ${d.b[0]} to ${d.b[3]}. Which subject increases more from Q1 to Q4?`,ans,[ans,'Math','Science','same increase'],'Compare final minus initial for each subject.',`Math changes by ${chA}; Science changes by ${chB}.`);}
    if(m===15){d=lineData();k=R(0,3);ans=d.a[k]-d.b[k];return Q(`At ${periods[k]}, Math is ${d.a[k]} and Science is ${d.b[k]}. What is Math − Science?`,ans,[ans,Math.abs(ans),-ans,d.a[k]+d.b[k]],'Subtract in the order asked.',`${d.a[k]} − ${d.b[k]} = ${ans}.`);}
    if(m===16){const a=[4,6,8,10],b=[10,8,6,4];return Q(`Set A over four periods is ${a.join(', ')}. Set B is ${b.join(', ')}. What trend is shown?`,'A increases while B decreases',['A increases while B decreases','both increase','both decrease','both stay constant'],'Read each sequence from left to right.','Set A rises each period while Set B falls.');}
    if(m===17){const a=[5,7,9,11],b=[6,8,10,12];return Q(`Two lines show A: ${a.join(', ')} and B: ${b.join(', ')}. What stays constant?`,'B is always 1 greater than A',['B is always 1 greater than A','A is always 2 greater than B','the values are always equal','the gap doubles each time'],'Compare the gap at every period.','Each matching B value is exactly 1 more than A.');}
    if(m===18){d=barData();k=R(0,3);const bigger=d.a[k]>d.b[k]?'Class 5A':d.b[k]>d.a[k]?'Class 5B':'equal';return Q(`For ${cats[k]}, the values are Class 5A = ${d.a[k]}, Class 5B = ${d.b[k]}. Which statement is correct?`,bigger,[bigger,'Class 5A','Class 5B','equal'],'Compare the paired values only.',`${bigger} has the larger value for ${cats[k]}, unless the pair is equal.`);}
    return Q('A double line graph and a double bar graph have what important feature in common?','they compare two data sets on the same grid',['they compare two data sets on the same grid','they can show only one data set','they do not need a scale','they are both circle graphs'],'Think about why they are called double graphs.','Both display two separate data sets on one grid so they can be compared.');
  }
  if(window.TY_YEAR5_TESTS){
    window.TY_YEAR5_TESTS.topics=window.TY_YEAR5_TESTS.topics.filter(x=>x[0]!=='comparative_graphs');
    const i=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='solid_views');
    window.TY_YEAR5_TESTS.topics.splice(i>=0?i+1:window.TY_YEAR5_TESTS.topics.length,0,['comparative_graphs','▥','Comparative Graphs & Data Displays','Double line and double bar graphs, differences, totals and trends']);
    const oldQ=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=t=>t==='comparative_graphs'?question():oldQ(t);
  }
  const oldLearn=window.SKILLUP_MATH.learn,oldEnhanced=window.SKILLUP_MATH.enhanced;
  window.SKILLUP_MATH.learn=function(g,t,fallback){
    if(String(g)==='5'&&t==='comparative_graphs')return{
      title:'Comparative Graphs & Data Displays',
      concept:'Double line graphs and double bar graphs compare two related data sets on the same grid. The key identifies the two sets so you can compare equal values, differences, totals, highest and lowest values, and trends.',
      steps:[
        'A double bar graph compares two groups across the same categories using paired bars.',
        'A double line graph compares how two sets of values change across an ordered sequence such as time.',
        'Always read the title, labels, scale and key before comparing values.',
        'To compare a category or time point, read both values at the same position.',
        'Look for equal values, the greatest or smallest values, and the size of the gap between the two sets.',
        'For time data, compare changes between consecutive periods and describe overall trends such as increasing, decreasing or staying level.',
        'You can also add values across categories to compare totals for the two groups.'
      ],
      examples:[
        {q:'Class A has 9 fantasy readers and Class B has 12. How many more does Class B have?',steps:['Compare the paired values.','12 − 9 = 3.'],answer:'3'},
        {q:'Math marks are 82, 85, 88, 91 and Science marks are 80, 85, 87, 90. When are they equal?',steps:['Compare matching positions.','Both are 85 at the second point.'],answer:'Second period'},
        {q:'Which graph would you use to compare two students’ scores across four school terms?',steps:['The horizontal axis represents ordered time.','We want to compare two changing trends.'],answer:'Double line graph'}
      ]
    };
    return oldLearn(g,t,fallback);
  };
  window.SKILLUP_MATH.enhanced=function(g,t){if(String(g)==='5'&&t==='comparative_graphs')return question();return oldEnhanced(g,t);};
})();
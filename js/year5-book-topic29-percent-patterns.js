// Topic 29: Year 5 Percent Patterns.
(function(){
  if(!window.SKILLUP_MATH)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,pick=a=>a[R(0,a.length-1)],shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
  const frac=(n,d)=>{const g=gcd(n,d);n/=g;d/=g;return d===1?String(n):n+'/'+d;};
  const uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip,explanation){const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);let k=1;while(rest.length<3){const v=(k++*5)+'%';if(v!==ans&&!rest.includes(v))rest.push(v);}return{text,answer:ans,choices:shuffle([ans,...rest]),tip,explanation};}
  const integerPerc=[2,4,5,8,10,12,15,20,25,28,30,40,45,50,60,65,70,75,80,100];
  const reverse=[['1/50','2%'],['1/25','4%'],['1/20','5%'],['1/10','10%'],['1/5','20%'],['1/4','25%'],['3/10','30%'],['1/2','50%'],['3/4','75%'],['4/5','80%'],['1','100%']];
  const pats=[
    [[10,20,30,40],['1/10','1/5','3/10','2/5']],
    [[20,40,60,80],['1/5','2/5','3/5','4/5']],
    [[25,50,75,100],['1/4','1/2','3/4','1']],
    [[15,30,45,60],['3/20','3/10','9/20','3/5']],
    [[12,24,36,48],['3/25','6/25','9/25','12/25']],
    [[8,16,32,64],['2/25','4/25','8/25','16/25']]
  ];
  function question(){const m=R(0,15);let p,ans,seq,i;
    if(m===0){p=pick(integerPerc);ans=frac(p,100);return Q('Write '+p+'% as a fraction in simplest form.',ans,[ans,p+'/100',frac(Math.max(1,p-5),100),frac(Math.min(100,p+5),100)],'Percent means per hundred. Write p/100, then simplify.',p+'% = '+p+'/100 = '+ans+'.');}
    if(m===1){p=pick(reverse);return Q('Which percent is equivalent to '+p[0]+'?',p[1],[p[1],String(parseFloat(p[1])*2)+'%',String(Math.max(1,parseFloat(p[1])/2))+'%','100%'],'Write the fraction with denominator 100 or use an equivalent percent benchmark.',p[0]+' = '+p[1]+'.');}
    if(m===2){p=pick(pats);i=R(0,3);ans=p[1][i];return Q('In the pattern '+p[0].map(x=>x+'%').join(', ')+', which fraction is equivalent to '+p[0][i]+'%?',ans,[ans,p[1][(i+1)%4],p[1][(i+2)%4],p[1][(i+3)%4]],'Convert the chosen percent to a fraction over 100 and simplify.',p[0][i]+'% = '+ans+'.');}
    if(m===3){p=pick(pats);i=R(0,3);ans=p[0][i]+'%';return Q('In the matching fraction pattern '+p[1].join(', ')+', which percent corresponds to '+p[1][i]+'?',ans,p[0].map(x=>x+'%'),'Match the terms in the same positions.',p[1][i]+' = '+ans+'.');}
    if(m===4){seq=pick([[10,20,30,40,50],[20,40,60,80,100],[25,50,75,100,125],[15,30,45,60,75],[12,24,36,48,60],[8,16,32,64,128]]);ans=seq[4]+'%';return Q('Continue the percent pattern: '+seq.slice(0,4).map(x=>x+'%').join(', ')+', …',ans,[ans,(seq[4]-5)+'%',(seq[4]+5)+'%',seq[3]+'%'],'Find the rule connecting the terms.',ans+' continues the same pattern.');}
    if(m===5)return Q('If 1/8 = 12.5%, what percent is 3/8?','37.5%',['37.5%','25%','24%','62.5%'],'Three eighths is 3 times one eighth. Multiply 12.5% by 3.','3 × 12.5% = 37.5%.');
    if(m===6)return Q('If 1/3 = 33⅓%, what percent is 2/3?','66⅔%',['66⅔%','33⅓%','50%','75%'],'Two thirds is twice one third.','2 × 33⅓% = 66⅔%.');
    if(m===7)return Q('The book shows 5%, 25%, 45%, 65%. What is the common increase?','20 percentage points',['20 percentage points','5 percentage points','10 percentage points','25 percentage points'],'Subtract consecutive terms: 25 − 5, 45 − 25, and 65 − 45.','Each term increases by 20 percentage points.');
    if(m===8)return Q('The book shows 10%, 30%, 50%, 70%. What is the common increase?','20 percentage points',['20 percentage points','10 percentage points','30 percentage points','40 percentage points'],'Compare consecutive terms.','Each term increases by 20 percentage points.');
    if(m===9)return Q('The pattern 4%, 32%, 60%, 88% increases by how much each time?','28 percentage points',['28 percentage points','24 percentage points','32 percentage points','14 percentage points'],'Subtract consecutive terms.','32−4 = 28, 60−32 = 28, and 88−60 = 28.');
    if(m===10)return Q('Which fraction is equivalent to 28%?','7/25',['7/25','7/20','14/25','28/25'],'28% = 28/100; simplify by 4.','28/100 = 7/25.');
    if(m===11)return Q('Which fraction is equivalent to 65%?','13/20',['13/20','13/25','6/10','7/20'],'65% = 65/100; simplify by 5.','65/100 = 13/20.');
    if(m===12)return Q('If 5% = 1/20, which fraction matches 25% in the same pattern?','5/20',['5/20','1/25','25/20','4/20'],'25% is 5 times 5%, so multiply 1/20 by 5.','25% = 5/20 = 1/4.');
    if(m===13)return Q('If 4% = 1/25, which fraction matches 28% in the same pattern?','7/25',['7/25','4/25','28/25','1/7'],'28% is 7 times 4%.','28% = 7/25.');
    if(m===14)return Q('Which statement is always true about a whole-number percent p%?','p% = p/100',['p% = p/100','p% = 100/p','p% = p/10','p% = p × 100'],'Percent means “per hundred.”','So p% can always be written as p/100 before simplifying.');
    p=pick([[12,24,36,48],[8,16,32,64],[5,20,35,50],[4,32,60,88]]);i=R(0,3);ans=frac(p[i],100);return Q('What simplified fraction is equivalent to '+p[i]+'%?',ans,[ans,p[i]+'/100',frac(Math.max(1,p[i]-4),100),frac(Math.min(100,p[i]+4),100)],'Write the percent over 100 and simplify.',p[i]+'% = '+ans+'.');
  }
  if(window.TY_YEAR5_TESTS){
    window.TY_YEAR5_TESTS.topics=window.TY_YEAR5_TESTS.topics.filter(x=>x[0]!=='percent_patterns');
    const i=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='fractions_decimals');
    window.TY_YEAR5_TESTS.topics.splice(i>=0?i+1:window.TY_YEAR5_TESTS.topics.length,0,['percent_patterns','%','Percent Patterns','Equivalent percent-fraction patterns, benchmark percents and missing-term reasoning']);
    const oldQ=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);window.TY_YEAR5_TESTS.question=t=>t==='percent_patterns'?question():oldQ(t);
  }
  const oldLearn=window.SKILLUP_MATH.learn,oldEnhanced=window.SKILLUP_MATH.enhanced;
  window.SKILLUP_MATH.learn=function(g,t,fallback){if(String(g)==='5'&&t==='percent_patterns')return{
    title:'Percent Patterns',
    concept:'Percent means “per hundred.” The book uses repeating numerical patterns to connect percents with equivalent fractions and to make conversions faster.',
    steps:[
      'Write a whole-number percent p% as p/100, then simplify the fraction.',
      'Look for benchmark families such as 10%, 20%, 30%, 40% and 25%, 50%, 75%, 100%.',
      'When a percent pattern is multiplied by the same number, multiply the matching fraction by the same number.',
      'Use known benchmarks such as 5% = 1/20, 10% = 1/10, 25% = 1/4 and 50% = 1/2.',
      'For fractional percent benchmarks, use the same pattern idea: if 1/8 = 12.5%, then 3/8 = 37.5%.'
    ],
    examples:[
      {q:'Convert 30% to a fraction.',steps:['30% = 30/100.','Simplify by 10.'],answer:'3/10'},
      {q:'Continue 10%, 20%, 30%, 40%.',steps:['The pattern increases by 10 percentage points each time.'],answer:'50%'},
      {q:'If 1/8 = 12.5%, what is 3/8?',steps:['Multiply both equivalent values by 3.','3 × 12.5% = 37.5%.'],answer:'37.5%'}
    ]
  };return oldLearn(g,t,fallback);};
  window.SKILLUP_MATH.enhanced=function(g,t){if(String(g)==='5'&&t==='percent_patterns')return question();return oldEnhanced(g,t);};
})();
// Topic 29: Selective Percent Patterns.
(function(){
  const mr=window.SKILLUP_MR_EXTRA;if(!mr)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,pick=a=>a[R(0,a.length-1)],shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),frac=(n,d)=>{const g=gcd(n,d);n/=g;d/=g;return d===1?String(n):n+'/'+d;};
  const uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip){const ans=String(answer);let rest=uniq(choices.map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);let k=1;while(rest.length<3){const v=(k++*7)+'%';if(v!==ans&&!rest.includes(v))rest.push(v);}return{text,answer:ans,choices:shuffle([ans,...rest]),tip,topic:'sel_percent_patterns',name:'Percent Patterns'};}
  function question(){const m=R(0,13);let p,ans,n;
    if(m===0)return Q('If 1/8 = 12.5%, what percent is 5/8?','62.5%',['62.5%','50%','37.5%','75%'],'Five eighths is 5 times one eighth.');
    if(m===1)return Q('If 1/3 = 33⅓%, what percent is 2/3?','66⅔%',['66⅔%','33⅓%','60%','75%'],'Double both equivalent values.');
    if(m===2)return Q('Which fraction is equivalent to 45%?','9/20',['9/20','4/5','5/9','11/20'],'45% = 45/100; simplify.');
    if(m===3)return Q('Which fraction is equivalent to 32%?','8/25',['8/25','4/25','16/25','8/20'],'32% = 32/100; simplify by 4.');
    if(m===4)return Q('Complete the pattern: 12%, 24%, 36%, 48%, …','60%',['60%','52%','56%','72%'],'The common increase is 12 percentage points.');
    if(m===5)return Q('Complete the pattern: 5%, 20%, 35%, 50%, …','65%',['65%','55%','60%','70%'],'The common increase is 15 percentage points.');
    if(m===6)return Q('The sequence 4%, 32%, 60%, 88% has what common difference?','28 percentage points',['28 percentage points','24 percentage points','32 percentage points','14 percentage points'],'Subtract consecutive terms.');
    if(m===7){p=pick([12,28,36,48,60,64,88]);ans=frac(p,100);return Q('Write '+p+'% as a fraction in simplest form.',ans,[ans,p+'/100',frac(Math.max(1,p-4),100),frac(Math.min(100,p+4),100)],'Write the percent over 100 and simplify.');}
    if(m===8)return Q('A pattern starts 10%, 30%, 50%, 70%. What is the 6th term?','110%',['110%','90%','100%','120%'],'The step is +20. The 5th term is 90%, then 110%.');
    if(m===9)return Q('If 4% = 1/25, what fraction matches 60% in the same pattern?','15/25',['15/25','60/25','4/15','12/25'],'60% is 15 times 4%, so multiply 1/25 by 15.');
    if(m===10)return Q('If 5% = 1/20, what fraction matches 65% in the same pattern?','13/20',['13/20','65/20','5/13','12/20'],'65% is 13 times 5%.');
    if(m===11)return Q('Which is larger?','3/4 = 75%',['3/4 = 75%','2/3 = 66⅔%','They are equal','Cannot be compared'],'Use the equivalent percent benchmarks.');
    if(m===12){n=pick([3,5,7]);ans=(n*12.5)+'%';return Q('If 1/8 = 12.5%, what percent is '+n+'/8?',ans,[ans,((n-1)*12.5)+'%',((n+1)*12.5)+'%',n+'%'],'Multiply 12.5% by the numerator.');}
    return Q('Why are percent patterns useful?','They let known percent-fraction equivalents scale to new equivalents',['They let known percent-fraction equivalents scale to new equivalents','They make every percent a whole number','They remove denominators','They only work for 100%'],'Scale both equivalent forms by the same factor.');
  }
  mr.topics=mr.topics.filter(x=>x[0]!=='sel_percent_patterns');
  const i=mr.topics.findIndex(x=>x[0]==='sel_fractions_decimals');
  mr.topics.splice(i>=0?i+1:mr.topics.length,0,['sel_percent_patterns','%','Percent Patterns','Equivalent fraction-percent families, missing terms and scaled benchmark reasoning']);
  const old=mr.question.bind(mr);mr.question=id=>id==='sel_percent_patterns'?question():old(id);
})();
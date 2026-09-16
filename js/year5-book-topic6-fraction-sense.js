// Topic 6 upgrade: Year 5 Fraction Sense & Comparison.
// Newly written SkillUP material based on the uploaded Grade 5 book's structure and difficulty.
(function(){
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
  const lcm=(a,b)=>Math.abs(a*b)/gcd(a,b);
  function simp(n,d){const g=gcd(n,d);return [n/g,d/g]}
  const ftxt=(n,d)=>`${n}/${d}`;
  function mixed(n,d){const w=Math.floor(n/d),r=n%d;if(!r)return String(w);const s=simp(r,d);return `${w} ${s[0]}/${s[1]}`}
  function Q(text,answer,choices,tip,explanation){const ans=String(answer);let c=uniq((choices||[]).map(String));if(!c.includes(ans))c.unshift(ans);return{text,answer:ans,choices:shuffle(c).slice(0,4),tip,explanation}}
  function topicQuestion(){
    const mode=R(0,17);let n,d,a,b,c,e,ans,arr,L;
    if(mode===0){
      [n,d]=pick([[1,8],[2,9],[3,10],[5,12],[7,16]]);ans='Closer to 0';
      return Q(`Which benchmark is ${ftxt(n,d)} closest to?`,ans,[ans,'Closer to 1/2','Closer to 1','Exactly 1/2'],'A fraction much smaller than half is closer to 0.',`${ftxt(n,d)} is much less than 1/2, so it is closest to 0.`);
    }
    if(mode===1){
      [n,d]=pick([[5,11],[7,15],[9,20],[11,23],[13,25]]);ans='Closer to 1/2';
      return Q(`Which benchmark is ${ftxt(n,d)} closest to?`,ans,['Closer to 0',ans,'Closer to 1','Exactly 1'],'Double the numerator and compare it with the denominator.',`Twice ${n} is ${2*n}, which is close to ${d}, so ${ftxt(n,d)} is close to 1/2.`);
    }
    if(mode===2){
      [n,d]=pick([[8,9],[11,12],[14,15],[19,20],[24,25]]);ans='Closer to 1';
      return Q(`Which benchmark is ${ftxt(n,d)} closest to?`,ans,['Closer to 0','Closer to 1/2',ans,'Exactly 1/2'],'If numerator and denominator are close, the fraction is close to 1.',`${n} is close to ${d}, so ${ftxt(n,d)} is close to 1.`);
    }
    if(mode===3){
      [n,d]=pick([[2,3],[3,5],[4,7],[5,8],[7,9]]);const k=pick([2,3,4]);ans=ftxt(n*k,d*k);
      return Q(`Which fraction is equivalent to ${ftxt(n,d)}?`,ans,[ans,ftxt(n+k,d+k),ftxt(n*k,d),ftxt(n,d*k)],'Multiply numerator and denominator by the same non-zero number.',`${ftxt(n,d)} × ${k}/${k} = ${ans}.`);
    }
    if(mode===4){
      [n,d]=pick([[3,4],[5,6],[7,8],[2,5],[4,9]]);const k=pick([2,3,4,5]);a=n*k;ans=d*k;
      return Q(`${ftxt(n,d)} = ${a}/□. What number belongs in the box?`,ans,[ans,d*k+k,d,ans-1],'Whatever multiplies the numerator must also multiply the denominator.',`${n} × ${k} = ${a}, so ${d} × ${k} = ${ans}.`);
    }
    if(mode===5){
      [n,d]=pick([[18,24],[12,30],[21,28],[24,36],[35,50],[42,56]]);const s=simp(n,d);ans=ftxt(s[0],s[1]);
      return Q(`Write ${ftxt(n,d)} in lowest terms.`,ans,[ans,ftxt(n/gcd(n,d)+1,d/gcd(n,d)),ftxt(n,d),ftxt(s[0]*2,s[1]*2)],'Divide numerator and denominator by their GCF.',`GCF(${n}, ${d}) = ${gcd(n,d)}. Divide both by ${gcd(n,d)} to get ${ans}.`);
    }
    if(mode===6){
      [n,d]=pick([[5,8],[7,10],[9,14],[11,15],[13,18]]);ans=gcd(n,d)===1?'Yes':'No';
      return Q(`Is ${ftxt(n,d)} already in lowest terms?`,ans,[ans,ans==='Yes'?'No':'Yes'],'A fraction is in lowest terms when numerator and denominator share no factor greater than 1.',`GCF(${n}, ${d}) = ${gcd(n,d)}, so the answer is ${ans}.`);
    }
    if(mode===7){
      a=R(1,6);n=R(1,7);d=pick([4,5,6,8,10]);if(n>=d)n=d-1;ans=`${a} ${n}/${d}`;
      return Q(`Which expression is a mixed number?`,ans,[ans,ftxt(a*d+n,d),String(a+n),`${a}/${n}`],'A mixed number has a whole-number part and a proper fraction part.',`${ans} has a whole number and a proper fraction.`);
    }
    if(mode===8){
      d=pick([3,4,5,6,8]);const w=R(1,6),r=R(1,d-1);n=w*d+r;ans=mixed(n,d);
      return Q(`Write ${ftxt(n,d)} as a mixed number in simplest form.`,ans,[ans,`${w+1} ${r}/${d}`,`${w} ${d-r}/${d}`,String(Math.round(n/d))],'Divide the numerator by the denominator. Quotient = whole number; remainder = new numerator.',`${n} ÷ ${d} = ${w} R${r}, so ${ftxt(n,d)} = ${ans}.`);
    }
    if(mode===9){
      a=R(1,6);d=pick([3,4,5,6,8]);n=R(1,d-1);ans=ftxt(a*d+n,d);
      return Q(`Write ${a} ${n}/${d} as an improper fraction.`,ans,[ans,ftxt(a+n,d),ftxt(a*d,d+n),ftxt(a*d-n,d)],'Multiply the whole number by the denominator, then add the numerator.',`${a} × ${d} + ${n} = ${a*d+n}, so ${a} ${n}/${d} = ${ans}.`);
    }
    if(mode===10){
      a=R(2,10);d=pick([3,4,5,6,8]);n=R(1,d-1);ans=n/d<0.5?String(a):String(a+1);
      return Q(`Round ${a} ${n}/${d} to the nearest whole number.`,ans,[ans,String(a),String(a+1),String(a+2)],'Compare the fraction part with 1/2.',`${ftxt(n,d)} is ${n/d<0.5?'less than':'at least'} 1/2, so round ${n/d<0.5?'down':'up'} to ${ans}.`);
    }
    if(mode===11){
      const pairs=pick([[[3,4],[5,8]],[[2,3],[3,5]],[[5,6],[7,9]],[[4,7],[5,9]],[[7,10],[2,3]]]);const x=pairs[0],y=pairs[1];ans=x[0]*y[1]>y[0]*x[1]?ftxt(x[0],x[1]):ftxt(y[0],y[1]);
      return Q(`Which fraction is greater: ${ftxt(x[0],x[1])} or ${ftxt(y[0],y[1])}?`,ans,[ftxt(x[0],x[1]),ftxt(y[0],y[1])],'Use a common denominator or compare cross-products.',`${x[0]} × ${y[1]} = ${x[0]*y[1]} and ${y[0]} × ${x[1]} = ${y[0]*x[1]}; therefore ${ans} is greater.`);
    }
    if(mode===12){
      d=pick([6,8,10,12]);a=R(1,d-2);b=R(a+1,d-1);ans=ftxt(b,d);
      return Q(`Which is greater: ${ftxt(a,d)} or ${ftxt(b,d)}?`,ans,[ftxt(a,d),ftxt(b,d)],'With like denominators, compare numerators.',`Both denominators are ${d}; ${b} > ${a}, so ${ans} is greater.`);
    }
    if(mode===13){
      arr=pick([[[1,2],[2,3],[3,4]],[[2,5],[3,5],[4,5]],[[1,3],[5,8],[3,4]],[[2,7],[1,2],[5,7]]]);const sorted=[...arr].sort((x,y)=>x[0]/x[1]-y[0]/y[1]);ans=sorted.map(x=>ftxt(x[0],x[1])).join(' < ');
      return Q(`Order these fractions from least to greatest: ${arr.map(x=>ftxt(x[0],x[1])).join(', ')}`,ans,[ans,[...sorted].reverse().map(x=>ftxt(x[0],x[1])).join(' < '),arr.map(x=>ftxt(x[0],x[1])).join(' < ')],'Rename with a common denominator or use benchmark fractions.',`Least to greatest: ${ans}.`);
    }
    if(mode===14){
      const x=pick([[1,4],[1,3],[2,5],[3,8]]),y=pick([[5,6],[7,8],[9,10],[4,5]]);ans=ftxt(y[0],y[1]);
      return Q(`Without finding a common denominator, which is greater: ${ftxt(x[0],x[1])} or ${ftxt(y[0],y[1])}?`,ans,[ftxt(x[0],x[1]),ftxt(y[0],y[1])],'Use benchmarks: one fraction is below 1/2 and the other is above 1/2.',`${ftxt(x[0],x[1])} is below 1/2 while ${ftxt(y[0],y[1])} is above 1/2.`);
    }
    if(mode===15){
      d=pick([4,5,6,8,10]);n=d;ans='Equal to 1';
      return Q(`How should ${ftxt(n,d)} be described?`,ans,[ans,'Less than 1','Greater than 1','A mixed number'],'A fraction equals 1 when numerator = denominator.',`${d}/${d} = 1.`);
    }
    if(mode===16){
      const x=pick([[4,9],[5,11],[7,15],[9,19]]);ans='Less than 1/2';
      return Q(`Is ${ftxt(x[0],x[1])} less than, equal to, or greater than 1/2?`,ans,[ans,'Equal to 1/2','Greater than 1/2','Equal to 1'],'Double the numerator and compare with the denominator.',`2 × ${x[0]} = ${2*x[0]} < ${x[1]}, so ${ftxt(x[0],x[1])} < 1/2.`);
    }
    const x=pick([[5,8],[7,12],[9,14],[11,16]]),y=pick([[2,3],[3,5],[5,7],[7,10]]);L=lcm(x[1],y[1]);const X=x[0]*(L/x[1]),Y=y[0]*(L/y[1]);ans=X>Y?ftxt(x[0],x[1]):ftxt(y[0],y[1]);
    return Q(`Use the least common denominator to compare ${ftxt(x[0],x[1])} and ${ftxt(y[0],y[1])}. Which is greater?`,ans,[ftxt(x[0],x[1]),ftxt(y[0],y[1])],`LCD = ${L}. Rename both fractions with denominator ${L}.`,`${ftxt(x[0],x[1])} = ${X}/${L} and ${ftxt(y[0],y[1])} = ${Y}/${L}; therefore ${ans} is greater.`);
  }

  if(window.TY_YEAR5_TESTS){
    const row=window.TY_YEAR5_TESTS.topics?.find(x=>x[0]==='fractions');
    if(row){row[1]='¾';row[2]='Fraction Sense & Comparison';row[3]='Benchmarks, equivalent fractions, simplest form, mixed/improper fractions and ordering';}
    const oldQuestion=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=function(t){return t==='fractions'?topicQuestion():oldQuestion(t)};
  }

  if(window.SKILLUP_MATH){
    const oldLearn=window.SKILLUP_MATH.learn;
    const oldEnhanced=window.SKILLUP_MATH.enhanced;
    window.SKILLUP_MATH.learn=function(g,t,fallback){
      if(String(g)==='5'&&t==='fractions'){
        return {
          title:'Fraction Sense & Comparison',
          concept:'Fraction sense means understanding the size of a fraction, not just calculating with it. Use benchmarks such as 0, 1/2 and 1, make equivalent fractions, simplify with the GCF, rename improper fractions and mixed numbers, and compare or order fractions using common denominators.',
          steps:[
            'Estimate a fraction using 0, 1/2 and 1. If the numerator is much smaller than the denominator, it is near 0; if doubling the numerator is close to the denominator, it is near 1/2; if numerator and denominator are close, it is near 1.',
            'Equivalent fractions are made by multiplying or dividing numerator and denominator by the same non-zero number.',
            'To write a fraction in lowest terms, divide numerator and denominator by their greatest common factor.',
            'A mixed number has a whole-number part and a proper fraction part. To rename an improper fraction, divide numerator by denominator and use the remainder as the new numerator.',
            'To compare like denominators, compare numerators. For unlike denominators, use an LCD to make equivalent fractions.',
            'To order several fractions, rename them with a common denominator or use clear benchmarks first.'
          ],
          examples:[
            {q:'Which benchmark is 7/12 closest to?',steps:['Half of 12 is 6.','The numerator 7 is close to 6.','So 7/12 is close to 1/2.'],answer:'Closer to 1/2'},
            {q:'Write 18/24 in lowest terms.',steps:['GCF(18, 24) = 6.','18 ÷ 6 = 3.','24 ÷ 6 = 4.'],answer:'3/4'},
            {q:'Write 22/6 as a mixed number.',steps:['22 ÷ 6 = 3 remainder 4.','Write 3 4/6.','Simplify 4/6 to 2/3.'],answer:'3 2/3'},
            {q:'Compare 5/6 and 1/2.',steps:['LCD of 6 and 2 is 6.','1/2 = 3/6.','5/6 > 3/6.'],answer:'5/6 > 1/2'},
            {q:'Order 1/3, 2/9 and 1/4 from least to greatest.',steps:['LCD of 3, 9 and 4 is 36.','1/3 = 12/36, 2/9 = 8/36, 1/4 = 9/36.','Compare the numerators 8, 9 and 12.'],answer:'2/9 < 1/4 < 1/3'}
          ],
          mistake:'Do not compare fractions only by looking at denominators. A larger denominator does not automatically mean a larger fraction. When simplifying, divide the numerator and denominator by the same number. When comparing mixed numbers, compare whole-number parts first.',
          quick:'Benchmark size → make equivalents → simplify → rename mixed/improper fractions → compare → order.'
        };
      }
      return oldLearn?oldLearn(g,t,fallback):null;
    };
    window.SKILLUP_MATH.enhanced=function(g,t){if(String(g)==='5'&&t==='fractions')return topicQuestion();return oldEnhanced?oldEnhanced(g,t):null;};
  }
})();
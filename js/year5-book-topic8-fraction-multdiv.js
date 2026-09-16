// Topic 8 upgrade: Year 5 Multiply & Divide Fractions.
// Newly written SkillUP material using the uploaded Grade 5 book as a curriculum/style reference.
(function(){
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
  function simp(n,d){if(d<0){n=-n;d=-d}const g=gcd(Math.abs(n),Math.abs(d));return[n/g,d/g]}
  function frac(n,d){const s=simp(n,d);return s[1]===1?String(s[0]):`${s[0]}/${s[1]}`}
  function mixed(n,d){const s=simp(n,d);n=s[0];d=s[1];const sign=n<0?'-':'';n=Math.abs(n);const w=Math.floor(n/d),r=n%d;if(!r)return sign+String(w);return w?`${sign}${w} ${r}/${d}`:`${sign}${r}/${d}`}
  const imp=(w,n,d)=>w*d+n;
  function Q(text,answer,choices,tip,explanation){const ans=String(answer);let c=uniq((choices||[]).map(String));if(!c.includes(ans))c.unshift(ans);return{text,answer:ans,choices:shuffle(c).slice(0,4),tip,explanation}}
  function topicQuestion(){
    const mode=R(0,19);let a,b,c,d,e,f,w,n,ans,A,B;
    if(mode===0){
      a=R(1,5);b=R(a+1,9);c=R(1,5);d=R(c+1,9);ans=frac(a*c,b*d);
      return Q(`${a}/${b} × ${c}/${d} = ?`,ans,[ans,frac(a+c,b+d),frac(a*c,b+d),frac(a+c,b*d)],'Multiply numerator by numerator and denominator by denominator, then simplify.',`${a}×${c} over ${b}×${d} gives ${a*c}/${b*d} = ${ans}.`);
    }
    if(mode===1){
      [a,b,c,d]=pick([[4,9,3,8],[6,15,10,21],[8,21,14,15],[12,25,10,18]]);ans=frac(a*c,b*d);
      return Q(`Use common factors before multiplying: ${a}/${b} × ${c}/${d} = ?`,ans,[ans,frac(a*c,b*d),frac(a+c,b+d),frac(Math.abs(a-c),Math.abs(b-d)||1)],'Cancel common factors between a numerator and the opposite denominator before multiplying.',`Cross-simplifying first makes the arithmetic smaller; the product is ${ans}.`);
    }
    if(mode===2){
      a=R(1,8);b=pick([3,4,5,6,8,10]);if(a>=b)a=b-1;c=R(2,12);ans=mixed(a*c,b);
      return Q(`${a}/${b} × ${c} = ?`,ans,[ans,frac(a*c,b),mixed(a*(c+1),b),frac(a,b*c)],'Write the whole number as c/1, then multiply.',`${a}/${b} × ${c}/1 = ${a*c}/${b} = ${ans}.`);
    }
    if(mode===3){
      a=R(2,10);b=pick([3,4,5,6,8]);c=R(1,b-1);ans=mixed(a*c,b);
      return Q(`What is ${c}/${b} of ${a}?`,ans,[ans,frac(c,b+a),mixed((a+1)*c,b),String(a)],'In fraction problems, “of” means multiply.',`${c}/${b} × ${a} = ${ans}.`);
    }
    if(mode===4){
      a=R(12,60);b=pick([3,4,5,6]);c=R(1,b-1);ans=a*c/b;if(!Number.isInteger(ans))return topicQuestion();
      return Q(`${c}/${b} of ${a} students join a club. How many students is that?`,ans,[ans,a-c,Math.floor(a/b),a],'Find a fraction of a whole number by multiplying.',`${c}/${b} × ${a} = ${ans}.`);
    }
    if(mode===5){
      w=R(1,5);b=pick([3,4,5,6,8]);n=R(1,b-1);a=R(1,5);c=pick([2,3,4,5,6]);A=imp(w,n,b);ans=mixed(A*c,b);
      return Q(`${w} ${n}/${b} × ${c} = ?`,ans,[ans,mixed(A*(c+1),b),`${w*c} ${n}/${b}`,frac(A*c,b)],'Rename the mixed number as an improper fraction first.',`${w} ${n}/${b} = ${A}/${b}; ${A}/${b} × ${c} = ${ans}.`);
    }
    if(mode===6){
      const d1=pick([3,4,5,6]),d2=pick([3,4,5,6]);const w1=R(1,4),w2=R(1,4),n1=R(1,d1-1),n2=R(1,d2-1);A=imp(w1,n1,d1);B=imp(w2,n2,d2);ans=mixed(A*B,d1*d2);
      return Q(`${w1} ${n1}/${d1} × ${w2} ${n2}/${d2} = ?`,ans,[ans,mixed(A+B,d1+d2),`${w1*w2} ${n1*n2}/${d1*d2}`,frac(A*B,d1*d2)],'Convert both mixed numbers to improper fractions, simplify if possible, then multiply.',`${w1} ${n1}/${d1} = ${A}/${d1} and ${w2} ${n2}/${d2} = ${B}/${d2}; product = ${ans}.`);
    }
    if(mode===7){
      a=R(1,8);b=R(a+1,10);ans=`${b}/${a}`;
      return Q(`What is the reciprocal of ${a}/${b}?`,ans,[ans,`${a}/${b}`,`${b+1}/${a}`,`${a+1}/${b}`],'Swap numerator and denominator.',`${a}/${b} × ${b}/${a} = 1, so the reciprocal is ${ans}.`);
    }
    if(mode===8){
      a=R(2,12);ans=`1/${a}`;
      return Q(`What is the reciprocal of ${a}?`,ans,[ans,String(a),`${a}/1`,`1/${a+1}`],'Write the whole number as a/1, then invert it.',`${a} = ${a}/1, so its reciprocal is 1/${a}.`);
    }
    if(mode===9){
      a=R(2,9);b=R(1,8);if(a===b)b++;ans=a===b?String(a):'1';
      const x=pick([[2,3],[3,5],[4,7],[5,8]]);return Q(`What is ${x[0]}/${x[1]} × ${x[1]}/${x[0]}?`,'1',['1',`${x[0]}/${x[1]}`,`${x[1]}/${x[0]}`,String(x[0]+x[1])],'Reciprocals multiply to 1.','A number multiplied by its reciprocal equals 1.');
    }
    if(mode===10){
      a=R(2,8);b=pick([2,3,4,5,6]);c=R(1,b-1);ans=mixed(a*b,c);
      return Q(`${a} ÷ ${c}/${b} = ?`,ans,[ans,mixed(a*c,b),frac(a,c*b),String(Math.floor(a/(c/b)))],'Keep the dividend, change ÷ to ×, and use the reciprocal of the divisor.',`${a} × ${b}/${c} = ${ans}.`);
    }
    if(mode===11){
      a=R(1,7);b=R(a+1,9);c=R(1,7);d=R(c+1,9);ans=mixed(a*d,b*c);
      return Q(`${a}/${b} ÷ ${c}/${d} = ?`,ans,[ans,frac(a*c,b*d),frac(a*d,b*c),frac(a+c,b+d)],'Multiply by the reciprocal of the divisor.',`${a}/${b} × ${d}/${c} = ${ans}.`);
    }
    if(mode===12){
      a=R(1,8);b=R(a+1,10);c=R(2,6);ans=frac(a,b*c);
      return Q(`${a}/${b} ÷ ${c} = ?`,ans,[ans,frac(a*c,b),frac(a,b+c),frac(a*c,b*c)],'Rename the whole-number divisor as c/1 and multiply by 1/c.',`${a}/${b} × 1/${c} = ${ans}.`);
    }
    if(mode===13){
      w=R(1,5);b=pick([3,4,5,6,8]);n=R(1,b-1);c=R(1,b-1);A=imp(w,n,b);ans=mixed(A,b*c);
      return Q(`${w} ${n}/${b} ÷ ${c} = ?`,ans,[ans,mixed(A*c,b),frac(A,b*c),`${w} ${n}/${b*c}`],'Rename the mixed number, then multiply by the reciprocal of the whole number.',`${A}/${b} × 1/${c} = ${ans}.`);
    }
    if(mode===14){
      w=R(1,5);b=pick([3,4,5,6]);n=R(1,b-1);c=R(1,5);d=R(c+1,7);A=imp(w,n,b);ans=mixed(A*d,b*c);
      return Q(`${w} ${n}/${b} ÷ ${c}/${d} = ?`,ans,[ans,mixed(A*c,b*d),frac(A*d,b*c),`${w} ${n}/${b}`],'Convert the mixed number to an improper fraction and multiply by the reciprocal.',`${A}/${b} × ${d}/${c} = ${ans}.`);
    }
    if(mode===15){
      const d1=pick([2,3,4,5]),d2=pick([2,3,4,5]);const w1=R(2,6),w2=R(1,w1),n1=R(1,d1-1),n2=R(1,d2-1);A=imp(w1,n1,d1);B=imp(w2,n2,d2);ans=mixed(A*d2,d1*B);
      return Q(`${w1} ${n1}/${d1} ÷ ${w2} ${n2}/${d2} = ?`,ans,[ans,mixed(A*B,d1*d2),frac(A*d2,d1*B),String(Math.round((A/d1)/(B/d2)))],'Rename both mixed numbers, then multiply by the reciprocal of the divisor.',`(${A}/${d1}) × (${d2}/${B}) = ${ans}.`);
    }
    if(mode===16){
      a=R(2,8);b=pick([2,3,4,5,6]);c=R(1,b-1);ans=Math.floor(a/(c/b));
      return Q(`A ${a}-m rope is cut into pieces of ${c}/${b} m. About how many full pieces can be made?`,ans,[ans,Math.max(1,ans-1),ans+1,a],'Divide total length by the length of one piece.',`${a} ÷ ${c}/${b} = ${mixed(a*b,c)}, so ${ans} full pieces can be made.`);
    }
    if(mode===17){
      w=R(2,8);b=pick([2,3,4,5,6]);n=R(1,b-1);const val=w+n/b;ans=n/b>=.5?w+1:w;
      return Q(`Estimate ${w} ${n}/${b} × 3 by rounding the mixed number first.`,ans*3,[ans*3,w*3,(w+1)*3,ans*3+3],'Round the mixed number to the nearest whole number, then multiply.',`${w} ${n}/${b} ≈ ${ans}; ${ans} × 3 = ${ans*3}.`);
    }
    if(mode===18){
      w=R(6,14);b=pick([2,3,4,5,6]);n=R(1,b-1);const divisor=pick([2,3,4]);const rounded=n/b>=.5?w+1:w;ans=Math.round(rounded/divisor);
      return Q(`Estimate ${w} ${n}/${b} ÷ ${divisor} by rounding first.`,ans,[ans,Math.max(1,ans-1),ans+1,rounded],'Round the mixed number to a nearby whole number, then divide.',`${w} ${n}/${b} ≈ ${rounded}; ${rounded} ÷ ${divisor} ≈ ${ans}.`);
    }
    a=R(20,60);b=pick([3,4,5,6]);c=R(1,b-1);const used=a*c/b;if(!Number.isInteger(used))return topicQuestion();const left=a-used;
    return Q(`${c}/${b} of ${a} L of water is used. How many litres remain?`,`${left} L`,[`${left} L`,`${used} L`,`${a} L`,`${Math.abs(a-left)} L`],'First multiply to find the amount used, then subtract from the total.',`${c}/${b} × ${a} = ${used} L used; ${a} − ${used} = ${left} L remain.`);
  }

  if(window.TY_YEAR5_TESTS){
    if(!window.TY_YEAR5_TESTS.topics.some(x=>x[0]==='fraction_multdiv')){
      const i=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='fraction_addsub');
      window.TY_YEAR5_TESTS.topics.splice(i>=0?i+1:7,0,['fraction_multdiv','×÷','Multiply & Divide Fractions','Fraction products, mixed numbers, reciprocals, fraction division and estimation']);
    }
    const oldQuestion=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=function(t){return t==='fraction_multdiv'?topicQuestion():oldQuestion(t)};
  }

  if(window.SKILLUP_MATH){
    const oldLearn=window.SKILLUP_MATH.learn;
    const oldEnhanced=window.SKILLUP_MATH.enhanced;
    window.SKILLUP_MATH.learn=function(g,t,fallback){
      if(String(g)==='5'&&t==='fraction_multdiv')return {
        title:'Multiply & Divide Fractions',
        concept:'Fraction multiplication finds a part of a part, so “of” usually means multiply. Fraction division asks how many groups of one fraction fit into another. Mixed numbers are renamed as improper fractions, and division becomes multiplication by the reciprocal of the divisor.',
        steps:[
          'For fraction × fraction, multiply the numerators and multiply the denominators, then simplify.',
          'Use common factors before multiplying when possible. Cancelling first keeps the numbers smaller and the product simpler.',
          'For a whole number, write it over 1. For a mixed number, rename it as an improper fraction before multiplying or dividing.',
          'A reciprocal is made by swapping numerator and denominator. A non-zero number multiplied by its reciprocal equals 1.',
          'For division, keep the first number, change ÷ to ×, and multiply by the reciprocal of the divisor.',
          'Estimate mixed-number products and quotients by rounding or using compatible numbers so you can check whether an exact answer is reasonable.'
        ],
        examples:[
          {q:'2/3 × 3/5',steps:['Multiply numerators: 2 × 3 = 6.','Multiply denominators: 3 × 5 = 15.','Simplify 6/15 by dividing by 3.'],answer:'2/5'},
          {q:'3/4 of 20',steps:['“Of” means multiply.','3/4 × 20/1 = 60/4.','60 ÷ 4 = 15.'],answer:'15'},
          {q:'2 1/3 × 1 1/2',steps:['2 1/3 = 7/3.','1 1/2 = 3/2.','7/3 × 3/2 = 7/2.','Rename 7/2 as a mixed number.'],answer:'3 1/2'},
          {q:'3/5 ÷ 2/3',steps:['Keep 3/5.','Change ÷ to ×.','Use the reciprocal 3/2.','3/5 × 3/2 = 9/10.'],answer:'9/10'},
          {q:'2 1/2 ÷ 1/4',steps:['2 1/2 = 5/2.','Reciprocal of 1/4 is 4/1.','5/2 × 4 = 20/2.'],answer:'10'}
        ],
        mistake:'Do not add numerators or denominators when multiplying. In division, only invert the divisor, not the dividend. Zero has no reciprocal. Always rename mixed numbers before using the reciprocal rule.',
        quick:'Multiply: straight across and simplify. Divide: keep → change → reciprocal → multiply → simplify → rename.'
      };
      return oldLearn?oldLearn(g,t,fallback):null;
    };
    window.SKILLUP_MATH.enhanced=function(g,t){if(String(g)==='5'&&t==='fraction_multdiv')return topicQuestion();return oldEnhanced?oldEnhanced(g,t):null;};
  }
})();
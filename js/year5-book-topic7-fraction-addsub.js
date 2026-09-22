// Topic 7 upgrade: Year 5 Add & Subtract Fractions.
// Newly written SkillUP material covering the Year 5 curriculum and problem-solving style.
(function(){
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
  const lcm=(a,b)=>Math.abs(a*b)/gcd(a,b);
  const lcmAll=a=>a.reduce((x,y)=>lcm(x,y));
  function simp(n,d){if(d<0){n=-n;d=-d}const g=gcd(Math.abs(n),Math.abs(d));return[n/g,d/g]}
  function frac(n,d){const s=simp(n,d);return s[1]===1?String(s[0]):`${s[0]}/${s[1]}`}
  function mixedFromImproper(n,d){const sign=n<0?'-':'';n=Math.abs(n);const w=Math.floor(n/d),r=n%d;if(!r)return sign+String(w);const s=simp(r,d);return w?`${sign}${w} ${s[0]}/${s[1]}`:`${sign}${s[0]}/${s[1]}`}
  function improper(w,n,d){return w*d+n}
  function Q(text,answer,choices,tip,explanation){const ans=String(answer);let c=uniq((choices||[]).map(String));if(!c.includes(ans))c.unshift(ans);return{text,answer:ans,choices:shuffle(c).slice(0,4),tip,explanation}}
  function addFrac(a,b,c,d){return [a*d+c*b,b*d]}
  function subFrac(a,b,c,d){return [a*d-c*b,b*d]}
  function topicQuestion(){
    const mode=R(0,20);let a,b,c,d,e,f,L,n,ans,x,y,z,w1,w2,n1,n2,d1,d2,total,diff;
    if(mode===0){
      d=pick([5,6,7,8,9,10,12]);a=R(1,d-2);b=R(1,d-a);if(a+b>=d)b=Math.max(1,d-a-1);ans=frac(a+b,d);
      return Q(`${a}/${d} + ${b}/${d} = ?`,ans,[ans,frac(a+b,d*2),frac(Math.abs(a-b),d),frac(a+b+1,d)],'With like denominators, add the numerators and keep the denominator.',`${a}/${d} + ${b}/${d} = ${a+b}/${d} = ${ans}.`);
    }
    if(mode===1){
      d=pick([6,8,10,12,14,15,18]);a=R(2,d-2);b=R(1,d-1);if(a+b<=d){b=Math.min(d-1,d-a+R(1,3))}ans=mixedFromImproper(a+b,d);
      return Q(`${a}/${d} + ${b}/${d} = ?`,ans,[ans,frac(a+b,d),mixedFromImproper(a+b-1,d),mixedFromImproper(a+b+1,d)],'Add the numerators. If the sum is at least 1, rename the improper fraction as a mixed number.',`${a}/${d} + ${b}/${d} = ${a+b}/${d} = ${ans}.`);
    }
    if(mode===2){
      [d1,d2]=pick([[2,3],[3,4],[4,5],[5,6],[6,8],[8,12],[9,12]]);n1=R(1,d1-1);n2=R(1,d2-1);L=lcm(d1,d2);x=n1*(L/d1);y=n2*(L/d2);ans=mixedFromImproper(x+y,L);
      return Q(`${n1}/${d1} + ${n2}/${d2} = ?`,ans,[ans,frac(n1+n2,d1+d2),frac(x+y,L*2),mixedFromImproper(Math.abs(x-y),L)],`LCD(${d1}, ${d2}) = ${L}. Rename both fractions with denominator ${L}.`,`${n1}/${d1} = ${x}/${L} and ${n2}/${d2} = ${y}/${L}; sum = ${x+y}/${L} = ${ans}.`);
    }
    if(mode===3){
      const den=shuffle([3,4,6,8,12]).slice(0,3);d1=den[0];d2=den[1];d=den[2];n1=R(1,d1-1);n2=R(1,d2-1);n=R(1,d-1);L=lcmAll([d1,d2,d]);x=n1*(L/d1);y=n2*(L/d2);z=n*(L/d);ans=mixedFromImproper(x+y+z,L);
      return Q(`${n1}/${d1} + ${n2}/${d2} + ${n}/${d} = ?`,ans,[ans,frac(n1+n2+n,d1+d2+d),mixedFromImproper(x+y+z+1,L),mixedFromImproper(Math.max(1,x+y+z-1),L)],`Find one LCD for all three denominators: ${L}.`,`${n1}/${d1} = ${x}/${L}, ${n2}/${d2} = ${y}/${L}, ${n}/${d} = ${z}/${L}; total = ${ans}.`);
    }
    if(mode===4){
      d=pick([4,5,6,8,10]);w1=R(1,5);w2=R(1,5);n1=R(1,d-1);n2=R(1,d-1);total=improper(w1,n1,d)+improper(w2,n2,d);ans=mixedFromImproper(total,d);
      return Q(`${w1} ${n1}/${d} + ${w2} ${n2}/${d} = ?`,ans,[ans,`${w1+w2} ${frac(n1+n2,d)}`,mixedFromImproper(total+d,d),mixedFromImproper(Math.max(1,total-d),d)],'Add the whole numbers and fraction parts. Rename if the fraction sum is at least 1.',`As improper fractions the total numerator is ${total}; the sum is ${ans}.`);
    }
    if(mode===5){
      [d1,d2]=pick([[2,3],[3,4],[4,6],[5,8],[6,9]]);w1=R(1,5);w2=R(1,4);n1=R(1,d1-1);n2=R(1,d2-1);L=lcm(d1,d2);total=(improper(w1,n1,d1)*(L/d1))+(improper(w2,n2,d2)*(L/d2));ans=mixedFromImproper(total,L);
      return Q(`${w1} ${n1}/${d1} + ${w2} ${n2}/${d2} = ?`,ans,[ans,`${w1+w2} ${frac(n1+n2,d1+d2)}`,mixedFromImproper(total+L,L),mixedFromImproper(Math.max(1,total-L),L)],`Use LCD ${L}, then add the whole and fractional parts.`,`Rename both mixed numbers with denominator ${L}; the sum is ${ans}.`);
    }
    if(mode===6){
      d=pick([6,8,9,10,12]);a=R(2,d-1);b=R(1,a-1);ans=frac(a-b,d);
      return Q(`${a}/${d} − ${b}/${d} = ?`,ans,[ans,frac(a-b,d*2),frac(a+b,d),frac(a-b+1,d)],'With like denominators, subtract the numerators and keep the denominator.',`${a}/${d} − ${b}/${d} = ${a-b}/${d} = ${ans}.`);
    }
    if(mode===7){
      [d1,d2]=pick([[2,3],[3,4],[4,5],[5,6],[6,8],[8,12],[9,12]]);n1=R(1,d1-1);n2=R(1,d2-1);if(n1/d1<n2/d2){[n1,n2]=[n2,n1];[d1,d2]=[d2,d1]}L=lcm(d1,d2);x=n1*(L/d1);y=n2*(L/d2);ans=frac(x-y,L);
      return Q(`${n1}/${d1} − ${n2}/${d2} = ?`,ans,[ans,frac(Math.abs(n1-n2),Math.max(d1,d2)),frac(x+y,L),frac(Math.max(1,x-y+1),L)],`LCD(${d1}, ${d2}) = ${L}. Rename before subtracting.`,`${n1}/${d1} = ${x}/${L} and ${n2}/${d2} = ${y}/${L}; difference = ${ans}.`);
    }
    if(mode===8){
      d=pick([4,5,6,8,10]);w1=R(4,9);w2=R(1,w1-1);n1=R(2,d-1);n2=R(1,n1-1);diff=improper(w1,n1,d)-improper(w2,n2,d);ans=mixedFromImproper(diff,d);
      return Q(`${w1} ${n1}/${d} − ${w2} ${n2}/${d} = ?`,ans,[ans,mixedFromImproper(diff+d,d),mixedFromImproper(Math.max(1,diff-d),d),`${w1-w2} ${frac(n1+n2,d)}`],'Subtract fraction parts first, then whole-number parts, and simplify.',`The difference is ${ans}.`);
    }
    if(mode===9){
      d=pick([4,5,6,8,10]);w1=R(3,8);w2=R(1,w1-1);n1=R(1,Math.max(1,Math.floor(d/3)));n2=R(Math.min(d-1,n1+1),d-1);diff=improper(w1,n1,d)-improper(w2,n2,d);ans=mixedFromImproper(diff,d);
      return Q(`${w1} ${n1}/${d} − ${w2} ${n2}/${d} = ?`,ans,[ans,mixedFromImproper(diff+d,d),mixedFromImproper(Math.max(1,diff-1),d),`${w1-w2} ${frac(Math.abs(n1-n2),d)}`],'The top fraction is too small. Rename 1 whole as a fraction with the same denominator, then subtract.',`${w1} ${n1}/${d} = ${w1-1} ${n1+d}/${d}; after subtracting, the answer is ${ans}.`);
    }
    if(mode===10){
      w1=R(3,9);d=pick([3,4,5,6,8]);w2=R(1,w1-1);n2=R(1,d-1);diff=w1*d-improper(w2,n2,d);ans=mixedFromImproper(diff,d);
      return Q(`${w1} − ${w2} ${n2}/${d} = ?`,ans,[ans,mixedFromImproper(diff+d,d),String(w1-w2),`${w1-w2} ${n2}/${d}`],'Rename the whole-number minuend by borrowing 1 whole before subtracting.',`${w1} = ${w1-1} ${d}/${d}; subtract ${w2} ${n2}/${d} to get ${ans}.`);
    }
    if(mode===11){
      w1=R(1,8);w2=R(1,8);d1=pick([3,4,5,6,8]);d2=pick([3,4,5,6,8]);n1=R(1,d1-1);n2=R(1,d2-1);const exact=improper(w1,n1,d1)/d1+improper(w2,n2,d2)/d2;const est=(n1/d1>=.5?w1+1:w1)+(n2/d2>=.5?w2+1:w2);ans=String(est);
      return Q(`Estimate ${w1} ${n1}/${d1} + ${w2} ${n2}/${d2} by rounding each mixed number to the nearest whole number.`,ans,[ans,String(Math.round(exact)),String(est+1),String(Math.max(0,est-1))],'For each mixed number, compare the fraction part with 1/2.',`${w1} ${n1}/${d1} rounds to ${n1/d1>=.5?w1+1:w1}; ${w2} ${n2}/${d2} rounds to ${n2/d2>=.5?w2+1:w2}; estimate = ${est}.`);
    }
    if(mode===12){
      w1=R(5,12);w2=R(1,w1-2);d1=pick([3,4,5,6,8]);d2=pick([3,4,5,6,8]);n1=R(1,d1-1);n2=R(1,d2-1);const A=n1/d1>=.5?w1+1:w1,B=n2/d2>=.5?w2+1:w2;ans=String(A-B);
      return Q(`Estimate ${w1} ${n1}/${d1} − ${w2} ${n2}/${d2} by rounding to whole numbers.`,ans,[ans,String(Math.max(0,A-B+1)),String(Math.max(0,A-B-1)),String(w1-w2)],'Round each mixed number first, then subtract.',`${w1} ${n1}/${d1} ≈ ${A} and ${w2} ${n2}/${d2} ≈ ${B}; estimated difference = ${A-B}.`);
    }
    if(mode===13){
      [d1,d2]=pick([[3,4],[4,5],[5,6],[6,8]]);n1=R(1,d1-1);n2=R(1,d2-1);L=lcm(d1,d2);x=n1*(L/d1);y=n2*(L/d2);total=x+y;ans=frac(y,L);
      return Q(`${n1}/${d1} + □ = ${frac(total,L)}. What is □?`,ans,[ans,frac(x,L),frac(total,L),frac(Math.abs(total-y+1),L)],'Work backward with the inverse operation: missing addend = total − known addend.',`${frac(total,L)} − ${n1}/${d1} = ${ans}.`);
    }
    if(mode===14){
      [d1,d2]=pick([[3,4],[4,5],[5,6],[6,8]]);n1=R(1,d1-1);n2=R(1,d2-1);L=lcm(d1,d2);x=n1*(L/d1);y=n2*(L/d2);if(x<y){[x,y]=[y,x];[n1,n2]=[n2,n1];[d1,d2]=[d2,d1]}diff=x-y;ans=frac(y,L);
      return Q(`${n1}/${d1} − □ = ${frac(diff,L)}. What is □?`,ans,[ans,frac(diff,L),frac(x,L),frac(Math.max(1,y+1),L)],'Work backward: missing subtrahend = starting amount − difference.',`${n1}/${d1} − ${frac(diff,L)} = ${ans}.`);
    }
    if(mode===15){
      const A=pick([[3,4],[5,6],[7,8],[4,5]]),B=pick([[1,6],[1,8],[1,4],[2,15]]);const N=A[0]*B[1]+B[0]*A[1],D=A[1]*B[1];ans=mixedFromImproper(N,D);
      return Q(`Maya walked ${A[0]}/${A[1]} km in the morning and ${B[0]}/${B[1]} km in the afternoon. How far did she walk altogether?`,`${ans} km`,[`${ans} km`,`${frac(Math.abs(A[0]*B[1]-B[0]*A[1]),D)} km`,`${frac(A[0]+B[0],A[1]+B[1])} km`,'1 km'],'“Altogether” means add. Use a common denominator first.',`The total distance is ${ans} km.`);
    }
    if(mode===16){
      const A=pick([[7,8],[5,6],[11,12],[9,10]]),B=pick([[1,4],[1,3],[5,12],[2,5]]);let N=A[0]*B[1]-B[0]*A[1],D=A[1]*B[1];if(N<=0)return topicQuestion();ans=frac(N,D);
      return Q(`A container held ${A[0]}/${A[1]} L of juice. ${B[0]}/${B[1]} L was used. How much remained?`,`${ans} L`,[`${ans} L`,`${frac(A[0]*B[1]+B[0]*A[1],D)} L`,`${frac(Math.abs(A[0]-B[0]),Math.max(A[1],B[1]))} L`,'0 L'],'“Remained” means subtract. Rename the fractions with a common denominator.',`${A[0]}/${A[1]} − ${B[0]}/${B[1]} = ${ans} L.`);
    }
    if(mode===17){
      const A=pick([[2,3],[3,4],[4,5],[5,6]]),B=pick([[1,2],[1,3],[2,5],[3,8]]);const N=A[0]*B[1]+B[0]*A[1],D=A[1]*B[1];const s=simp(N,D);const value=s[0]/s[1];ans=value>1?'Greater than 1':value===1?'Exactly 1':'Less than 1';
      return Q(`Without fully calculating, is ${A[0]}/${A[1]} + ${B[0]}/${B[1]} less than, equal to, or greater than 1?`,ans,[ans,'Less than 1','Exactly 1','Greater than 1'],'Use benchmark fractions and compare the sum with one whole.',`The sum is ${frac(N,D)}, so it is ${ans.toLowerCase()}.`);
    }
    if(mode===18){
      const den=pick([6,8,10,12]);a=R(1,den-2);b=R(1,den-a-1);c=R(1,Math.max(1,den-a-b));if(a+b+c>den)return topicQuestion();ans=frac(a+b+c,den);
      return Q(`A project used ${a}/${den}, then ${b}/${den}, then ${c}/${den} of a roll of tape. What fraction of the roll was used altogether?`,ans,[ans,frac(a+b,den),frac(a+b+c,den*2),frac(den-(a+b+c),den)],'All denominators match, so add the numerators.',`${a}+${b}+${c}=${a+b+c}; total used = ${ans}.`);
    }
    if(mode===19){
      w1=R(3,8);d=pick([4,5,6,8]);n1=R(1,d-1);const usedW=R(1,w1-1),usedN=R(1,d-1);const start=improper(w1,n1,d),used=improper(usedW,usedN,d);if(used>=start)return topicQuestion();diff=start-used;ans=mixedFromImproper(diff,d);
      return Q(`A board was ${w1} ${n1}/${d} m long. ${usedW} ${usedN}/${d} m was cut off. How much remained?`,`${ans} m`,[`${ans} m`,`${mixedFromImproper(start+used,d)} m`,`${mixedFromImproper(Math.abs(start-used)+d,d)} m`,`${w1-usedW} m`],'Subtract mixed numbers. Rename one whole if the top fraction is too small.',`The remaining length is ${ans} m.`);
    }
    const a1=pick([[2,3],[3,4],[4,5]]),a2=pick([[1,6],[1,8],[1,5]]),a3=pick([[1,4],[1,3],[2,5]]);L=lcmAll([a1[1],a2[1],a3[1]]);x=a1[0]*(L/a1[1]);y=a2[0]*(L/a2[1]);z=a3[0]*(L/a3[1]);ans=mixedFromImproper(x+y-z,L);
    return Q(`Evaluate ${a1[0]}/${a1[1]} + ${a2[0]}/${a2[1]} − ${a3[0]}/${a3[1]}.`,ans,[ans,mixedFromImproper(x+y+z,L),frac(Math.abs(x-y-z),L),frac(x+y-z,L*2)],`Use LCD ${L} for all three fractions.`,`Rename all fractions with denominator ${L}, then calculate left to right: answer = ${ans}.`);
  }

  if(window.TY_YEAR5_TESTS){
    if(!window.TY_YEAR5_TESTS.topics.some(x=>x[0]==='fraction_addsub')){
      const i=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='fractions');
      window.TY_YEAR5_TESTS.topics.splice(i>=0?i+1:6,0,['fraction_addsub','＋⁄−','Add & Subtract Fractions','Like/unlike denominators, mixed numbers, renaming, estimation and word problems']);
    }
    const oldQuestion=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=function(t){return t==='fraction_addsub'?topicQuestion():oldQuestion(t)};
  }

  if(window.SKILLUP_MATH){
    const oldLearn=window.SKILLUP_MATH.learn;
    const oldEnhanced=window.SKILLUP_MATH.enhanced;
    window.SKILLUP_MATH.learn=function(g,t,fallback){
      if(String(g)==='5'&&t==='fraction_addsub'){
        return {
          title:'Add & Subtract Fractions',
          concept:'Fractions can be added or subtracted only after the parts are the same size. With like denominators, work with the numerators. With unlike denominators, first use the least common denominator (LCD) to make equivalent fractions. Mixed numbers may need renaming when a fractional sum reaches one whole or when the top fraction is too small to subtract.',
          steps:[
            'Like denominators: add or subtract the numerators, keep the common denominator, then simplify.',
            'Unlike denominators: find the LCD, rename each fraction as an equivalent fraction, then add or subtract and simplify.',
            'For three fractions, use one LCD that works for all denominators.',
            'When adding mixed numbers, add the whole numbers and fraction parts. If the fraction sum is at least 1, rename it and add the extra whole.',
            'When subtracting mixed numbers, if the minuend fraction is smaller than the subtrahend fraction, rename 1 whole as an equivalent fraction before subtracting.',
            'Estimate mixed-number sums and differences by rounding each mixed number to the nearest whole number; use the estimate to check whether the exact answer is sensible.'
          ],
          examples:[
            {q:'3/8 + 4/8',steps:['The denominators are already the same.','Add the numerators: 3 + 4 = 7.','Keep denominator 8.'],answer:'7/8'},
            {q:'2/3 + 3/4',steps:['LCD of 3 and 4 is 12.','2/3 = 8/12 and 3/4 = 9/12.','8/12 + 9/12 = 17/12.','Rename the improper fraction.'],answer:'1 5/12'},
            {q:'2 5/6 + 3 3/4',steps:['LCD of 6 and 4 is 12.','2 5/6 = 2 10/12 and 3 3/4 = 3 9/12.','10/12 + 9/12 = 19/12 = 1 7/12.','Add the extra whole to 2 + 3.'],answer:'6 7/12'},
            {q:'5 1/4 − 2 3/4',steps:['The fraction 1/4 is smaller than 3/4.','Rename 5 1/4 as 4 5/4.','5/4 − 3/4 = 2/4 = 1/2.','4 − 2 = 2.'],answer:'2 1/2'},
            {q:'Estimate 7 5/8 + 4 2/5',steps:['7 5/8 rounds to 8 because 5/8 ≥ 1/2.','4 2/5 rounds to 4 because 2/5 < 1/2.','8 + 4 = 12.'],answer:'About 12'}
          ],
          mistake:'Do not add or subtract denominators. For unlike denominators, make equivalent fractions first. When subtracting mixed numbers, rename before subtracting if the top fraction is too small. Always simplify the final fraction or mixed number.',
          quick:'Same-size parts first → LCD if needed → calculate → rename mixed/improper answers → simplify → estimate to check.'
        };
      }
      return oldLearn?oldLearn(g,t,fallback):null;
    };
    window.SKILLUP_MATH.enhanced=function(g,t){if(String(g)==='5'&&t==='fraction_addsub')return topicQuestion();return oldEnhanced?oldEnhanced(g,t):null;};
  }
})();
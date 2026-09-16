// Selective Topic 4: Division Reasoning.
// Newly written SkillUP questions based on reasoning styles from the uploaded Grade 5 division chapter.
(function(){
  if(!window.SKILLUP_MR_EXTRA)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const fmt=n=>Number(n).toLocaleString('en-AU');
  const uniq=a=>[...new Set(a.map(String))];
  const Q=(text,answer,choices,tip)=>({text,answer:String(answer),choices:shuffle(uniq(choices)),tip,topic:'sel_division',name:'Division Reasoning'});
  const near=(n,p)=>Math.round(n/p)*p;
  function question(){
    const t=R(0,13);let d,q,r,n,ans,a,b;
    if(t===0){
      d=R(5,18);q=R(20,90);r=R(1,d-1);n=d*q+r;ans=q+1;
      return Q(`${fmt(n)} students are travelling in minibuses that each hold ${d}. What is the least number of minibuses required?`,ans,[ans,q,q+2,r],'A non-zero remainder means one more whole vehicle is needed.');
    }
    if(t===1){
      d=R(6,19);q=R(30,120);r=R(1,d-1);n=d*q+r;
      return Q(`${fmt(n)} stickers are shared equally among ${d} students. Which statement is correct?`,`${q} each, ${r} left over`,[`${q} each, ${r} left over`,`${q+1} each, none left`,`${r} each, ${q} left over`,`${q} each, ${d-r} left over`],'Write the quotient and interpret the remainder separately.');
    }
    if(t===2){
      d=R(12,29);q=R(20,80);r=R(0,d-1);n=d*q+r;ans=n;
      return Q(`A division has divisor ${d}, quotient ${q} and remainder ${r}. What is the dividend?`,fmt(ans),[fmt(ans),fmt(d+q+r),fmt(d*q),fmt((q+1)*d+r)],'Dividend = divisor × quotient + remainder.');
    }
    if(t===3){
      d=R(4,12);q=R(50,200);n=d*q;ans=d;
      return Q(`${fmt(n)} ÷ □ = ${q}. What number belongs in the box?`,ans,[ans,q,n,Math.max(1,d-1)],'Use the inverse multiplication fact: divisor × quotient = dividend.');
    }
    if(t===4){
      d=pick([6,7,8,9]);n=R(1400,9800);const compatible=near(n,d*100);ans=Math.round(compatible/d);
      return Q(`Which is the best estimate for ${fmt(n)} ÷ ${d}?`,fmt(ans),[fmt(ans),fmt(Math.floor(n/d)),fmt(ans+500),fmt(Math.max(1,ans-500))],'Choose a nearby compatible dividend that divides easily by the divisor.');
    }
    if(t===5){
      const candidates=[312,420,684,936,1248,1530,2376,4212];n=pick(candidates);const tests=[2,3,4,5,9,10];const good=tests.filter(x=>n%x===0);const bad=tests.filter(x=>n%x!==0);ans=pick(good);
      return Q(`Which number is a factor of ${fmt(n)}?`,ans,[ans,...shuffle(bad).slice(0,3)],'Use divisibility rules to eliminate choices quickly.');
    }
    if(t===6){
      d=R(21,69);q=R(30,120);r=R(0,d-1);n=d*q+r;ans=r?`${q} R${r}`:`${q}`;
      return Q(`${fmt(n)} ÷ ${d} = ?`,ans,[ans,String(q+1),String(Math.max(1,q-1)),r?`${q} R${Math.max(0,r-1)}`:`${q} R1`],'Estimate each quotient digit, then multiply, subtract and compare.');
    }
    if(t===7){
      d=R(24,75);q=R(1000,4000);n=d*q;const digits=String(q).length;ans=digits;
      return Q(`Without doing the full division, how many digits will the quotient of ${fmt(n)} ÷ ${d} have?`,digits,[digits,Math.max(1,digits-1),digits+1,1],'Estimate the size of the quotient using rounded values.');
    }
    if(t===8){
      d=R(5,15);r=R(1,d-1);ans=`0 to ${d-1}`;
      return Q(`A number is divided by ${d}. Which range contains every possible remainder?`,ans,[ans,`1 to ${d}`,`0 to ${d}`,`${d} to ${2*d-1}`],'Every remainder must be at least 0 and smaller than the divisor.');
    }
    if(t===9){
      d=R(12,35);q=R(3,15);n=d*q;const total=n/100;ans=`$${(total/d).toFixed(2)}`;
      return Q(`${d} identical notebooks cost $${total.toFixed(2)} altogether. What is the unit price?`,ans,[ans,`$${(total/q).toFixed(2)}`,`$${(total*d).toFixed(2)}`,`$${(total/d+1).toFixed(2)}`],'Unit price = total cost ÷ number of items.');
    }
    if(t===10){
      const x=R(2,9),y=R(2,9),z=R(2,9);n=x*y*z;ans=n/y+z;
      return Q(`Evaluate ${fmt(n)} ÷ ${y} + ${z}.`,ans,[ans,n/(y+z),(n/y)*z,n-y+z],'Division comes before addition.');
    }
    if(t===11){
      d=R(7,18);q=R(40,120);r=R(1,d-1);n=d*q+r;
      return Q(`A calculator shows ${fmt(n)} ÷ ${d}. Which answer is impossible?`,`${q} R${d}`,[`${q} R${d}`,`${q} R${r}`,`${q}`,`${q+1}`],'A remainder can never be equal to the divisor.');
    }
    if(t===12){
      d=pick([12,15,18,24,25]);q=R(100,220);n=d*q;
      return Q(`A warehouse packs ${fmt(n)} items equally into boxes of ${d}. How many full boxes are made?`,q,[q,q+1,Math.max(1,q-1),d],'This is exact division because the total is a multiple of the box size.');
    }
    d=R(20,60);q=R(60,180);r=R(1,d-1);n=d*q+r;const rounded=near(n,d*10);ans=Math.round(rounded/d);
    return Q(`A quick estimate is needed for ${fmt(n)} ÷ ${d}. Which is the most useful strategy?`,`Use ${fmt(rounded)} ÷ ${d} ≈ ${fmt(ans)}`,[`Use ${fmt(rounded)} ÷ ${d} ≈ ${fmt(ans)}`,`Add ${fmt(n)} + ${d}`,`Multiply ${fmt(n)} × ${d}`,`Round ${d} to 0`],'Use a nearby compatible dividend that is easy to divide by the divisor.');
  }
  if(!window.SKILLUP_MR_EXTRA.topics.some(x=>x[0]==='sel_division')){
    const i=window.SKILLUP_MR_EXTRA.topics.findIndex(x=>x[0]==='sel_multiplication');
    window.SKILLUP_MR_EXTRA.topics.splice(i>=0?i+1:3,0,['sel_division','÷','Division Reasoning','Remainders, compatible estimates, divisibility, unit rates and long-division reasoning']);
  }
  const old=window.SKILLUP_MR_EXTRA.question.bind(window.SKILLUP_MR_EXTRA);
  window.SKILLUP_MR_EXTRA.question=id=>id==='sel_division'?question():old(id);
})();
// Topic 4 upgrade: Year 5 Division.
// Newly written SkillUP material using the uploaded Grade 5 book as a curriculum/style reference.
(function(){
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const fmt=n=>Number(n).toLocaleString('en-AU');
  const money=n=>`$${Number(n).toFixed(2)}`;
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);let c=uniq((choices||[]).map(String));if(!c.includes(ans))c.unshift(ans);
    return {text,answer:ans,choices:shuffle(c).slice(0,4),tip,explanation};
  }
  const divText=(n,d)=>{const q=Math.floor(n/d),r=n%d;return r?`${q} R${r}`:`${q}`};
  function topicQuestion(){
    const mode=R(0,19);let a,b,c,q,r,n,ans;
    if(mode===0){
      b=R(3,12);q=R(3,12);n=b*q;
      return Q(`${fmt(n)} objects are separated into equal groups of ${b}. How many groups are made?`,q,[q,b,n,q+1],'Division separates a total into equal groups.',`${fmt(n)} ÷ ${b} = ${q}, because ${q} × ${b} = ${fmt(n)}.`);
    }
    if(mode===1){
      b=R(2,12);q=R(2,12);n=b*q;
      return Q(`Which multiplication fact checks ${fmt(n)} ÷ ${b} = ${q}?`,`${q} × ${b} = ${fmt(n)}`,[`${q} × ${b} = ${fmt(n)}`,`${q} + ${b} = ${q+b}`,`${fmt(n)} × ${b} = ${fmt(n*b)}`,`${q} × ${q} = ${q*q}`],'Division is the inverse of multiplication.',`${fmt(n)} ÷ ${b} = ${q} is checked by ${q} × ${b} = ${fmt(n)}.`);
    }
    if(mode===2){
      const cases=[['84 ÷ 1','84','Dividing by 1 leaves the dividend unchanged.'],['57 ÷ 57','1','A non-zero number divided by itself equals 1.'],['0 ÷ 9','0','Zero divided by a non-zero number equals 0.']];const z=pick(cases);
      return Q(`${z[0]} = ?`,z[1],[z[1],'0','1','undefined'],z[2],z[2]);
    }
    if(mode===3){
      const base=pick([[48,6],[63,7],[72,8],[45,9],[54,6]]);const scale=pick([10,100,1000]);n=base[0]*scale;b=base[1];q=n/b;
      return Q(`${fmt(n)} ÷ ${b} = ?`,fmt(q),[fmt(q),fmt(q/10),fmt(q*10),fmt(base[0]/base[1])],'Use the related basic fact, then follow the place-value pattern.',`${base[0]} ÷ ${b} = ${base[0]/base[1]}, so ${fmt(n)} ÷ ${b} = ${fmt(q)}.`);
    }
    if(mode===4){
      b=R(3,9);q=R(100,999);r=R(0,b-1);n=b*q+r;ans=divText(n,b);
      return Q(`${fmt(n)} ÷ ${b} = ?`,ans,[ans,String(q),`${q+1}`,r?`${q} R${Math.max(0,r-1)}`:`${q-1} R1`],'Use long division and write any remainder after the quotient.',`${fmt(n)} = ${b} × ${q}${r?` + ${r}`:''}, so the quotient is ${ans}.`);
    }
    if(mode===5){
      b=pick([4,5,6,8]);q=pick([102,103,104,2005,3004]);r=R(0,b-1);n=b*q+r;ans=divText(n,b);
      return Q(`${fmt(n)} ÷ ${b} = ?`,ans,[ans,`${String(q).replace(/0/g,'')} R${r}`,`${q+10}${r?` R${r}`:''}`,String(Math.floor(n/b))],'If a place cannot be divided, a zero may be needed in that place of the quotient.',`${fmt(n)} ÷ ${b} = ${ans}. Keep every required zero in the quotient.`);
    }
    if(mode===6){
      b=R(2,9);q=R(200,1500);n=b*q;
      return Q(`Use short division: ${fmt(n)} ÷ ${b} = ?`,fmt(q),[fmt(q),fmt(q+10),fmt(Math.max(1,q-10)),fmt(q*b)],'Divide one digit at a time and carry each small remainder to the next place.',`${fmt(n)} ÷ ${b} = ${fmt(q)}. Check: ${fmt(q)} × ${b} = ${fmt(n)}.`);
    }
    if(mode===7){
      const rules=[
        [2,'its ones digit is even'],[3,'the sum of its digits is divisible by 3'],[4,'the number formed by its last two digits is divisible by 4'],[5,'its ones digit is 0 or 5'],[9,'the sum of its digits is divisible by 9'],[10,'its ones digit is 0']
      ];const z=pick(rules);
      return Q(`Which rule tests divisibility by ${z[0]}?`,z[1],[z[1],'its first digit is even','its digits are in increasing order','it has an even number of digits'],`Think about the standard divisibility rule for ${z[0]}.`,z[1][0].toUpperCase()+z[1].slice(1)+'.');
    }
    if(mode===8){
      const pool=[312,405,728,936,1245,1530,2408,3168];a=pick(pool);const divisors=[2,3,4,5,9,10];const good=divisors.filter(d=>a%d===0);ans=pick(good);
      return Q(`Which of these numbers is definitely a divisor of ${fmt(a)}?`,ans,[ans,...shuffle(divisors.filter(d=>d!==ans)).slice(0,3)],'Use divisibility rules before doing long division.',`${fmt(a)} ÷ ${ans} is a whole number, so ${ans} is a divisor.`);
    }
    if(mode===9){
      b=R(4,9);q=R(200,800);n=b*q+R(0,b-1);const compatible=Math.round(n/(b*100))*b*100;ans=compatible/b;
      return Q(`Estimate ${fmt(n)} ÷ ${b} using a nearby compatible number.`,fmt(ans),[fmt(ans),fmt(Math.floor(n/b)),fmt(ans+100),fmt(Math.max(0,ans-100))],'Choose a nearby number that divides easily by the divisor.',`${fmt(n)} is close to ${fmt(compatible)}, and ${fmt(compatible)} ÷ ${b} = ${fmt(ans)}.`);
    }
    if(mode===10){
      b=R(12,19);q=R(12,45);r=R(0,b-1);n=b*q+r;ans=divText(n,b);
      return Q(`${fmt(n)} ÷ ${b} = ?`,ans,[ans,String(q),`${q+1}`,r?`${q} R${Math.max(0,r-1)}`:`${q-1} R1`],'Estimate the quotient digit, multiply, subtract, compare, then bring down.',`${fmt(n)} = ${b} × ${q}${r?` + ${r}`:''}; quotient ${ans}.`);
    }
    if(mode===11){
      b=R(21,89);q=R(20,180);r=R(0,b-1);n=b*q+r;ans=divText(n,b);
      return Q(`${fmt(n)} ÷ ${b} = ?`,ans,[ans,String(q),`${q+1}`,r?`${q} R${Math.min(b-1,r+1)}`:`${q-1} R1`],'For a 2-digit divisor, estimate each quotient digit, then multiply and compare.',`${fmt(n)} = ${b} × ${q}${r?` + ${r}`:''}.`);
    }
    if(mode===12){
      b=R(22,79);q=R(1000,4999);r=R(0,b-1);n=b*q+r;ans=divText(n,b);
      return Q(`${fmt(n)} ÷ ${b} = ?`,ans,[ans,String(q),`${q+10}`,r?`${q} R${Math.max(0,r-1)}`:`${q-1} R1`],'Repeat the long-division cycle until every dividend digit has been used.',`${fmt(n)} = ${b} × ${fmt(q)}${r?` + ${r}`:''}.`);
    }
    if(mode===13){
      b=R(3,18);q=R(2,20);n=b*q;const total=(n/100).toFixed(2);ans=money((n/100)/b);
      return Q(`${b} identical items cost $${total}. What is the cost of one item?`,ans,[ans,money((n/100)*b),money((n/100)/q),money((n/100)/b+1)],'Unit price means total cost ÷ number of items.',`$${total} ÷ ${b} = ${ans} per item.`);
    }
    if(mode===14){
      b=R(6,15);q=R(20,80);r=R(1,b-1);n=b*q+r;ans=q+1;
      return Q(`${fmt(n)} students need vans that hold ${b} students each. What is the least number of vans needed?`,ans,[ans,q,r,q+2],'A remainder means another whole van is needed.',`${fmt(n)} ÷ ${b} = ${q} R${r}. The remainder needs one more van, so ${ans} vans are needed.`);
    }
    if(mode===15){
      b=R(5,12);q=R(20,100);r=R(1,b-1);n=b*q+r;ans=r;
      return Q(`${fmt(n)} cards are shared equally among ${b} students. How many cards are left over?`,ans,[ans,q,b-r,r+1],'The remainder tells how many objects are left after making equal groups.',`${fmt(n)} ÷ ${b} = ${q} R${r}, so ${r} cards are left.`);
    }
    if(mode===16){
      b=R(3,9);q=R(100,800);r=R(0,b-1);n=b*q+r;const check=b*q+r;
      return Q(`Which equation correctly checks ${fmt(n)} ÷ ${b} = ${q}${r?` R${r}`:''}?`,`${b} × ${q} + ${r} = ${fmt(check)}`,[`${b} × ${q} + ${r} = ${fmt(check)}`,`${b} + ${q} + ${r} = ${fmt(check)}`,`${q} ÷ ${b} = ${fmt(check)}`,`${b} × ${r} + ${q} = ${fmt(check)}`],'Check division with divisor × quotient + remainder = dividend.',`${b} × ${q} + ${r} = ${fmt(n)}.`);
    }
    if(mode===17){
      b=R(4,20);r=R(1,b-1);ans=`less than ${b}`;
      return Q(`If a number is divided by ${b}, what must always be true about the remainder?`,ans,[ans,`greater than ${b}`,`equal to ${b}`,'always zero'],'A remainder must be smaller than the divisor.',`Possible remainders are 0 through ${b-1}.`);
    }
    if(mode===18){
      const x=R(2,9),y=R(2,9),z=R(2,9);n=x*y*z;ans=n/y+z;
      return Q(`Compute ${fmt(n)} ÷ ${y} + ${z}.`,ans,[ans,n/(y+z),(n/y)*z,n-y+z],'Do division before addition.',`${fmt(n)} ÷ ${y} = ${n/y}; then ${n/y} + ${z} = ${ans}.`);
    }
    b=R(20,80);q=R(100,700);n=b*q;const digits=String(q).length;
    return Q(`Without doing full long division, how many digits will the quotient of ${fmt(n)} ÷ ${b} have?`,digits,[digits,Math.max(1,digits-1),digits+1,1],'Estimate the quotient by rounding the dividend and divisor.',`The quotient is about ${fmt(q)}, so it has ${digits} digits.`);
  }

  if(window.TY_YEAR5_TESTS){
    if(!window.TY_YEAR5_TESTS.topics.some(x=>x[0]==='division')){
      const i=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='multiplication');
      window.TY_YEAR5_TESTS.topics.splice(i>=0?i+1:3,0,['division','÷','Division','Inverse facts, long division, divisibility, estimation, remainders and 2-digit divisors']);
    }
    const oldQuestion=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=function(t){return t==='division'?topicQuestion():oldQuestion(t)};
  }

  if(window.SKILLUP_MATH){
    const oldLearn=window.SKILLUP_MATH.learn;
    const oldEnhanced=window.SKILLUP_MATH.enhanced;
    window.SKILLUP_MATH.learn=function(g,t,fallback){
      if(String(g)==='5'&&t==='division'){
        return {
          title:'Division',
          concept:'Division separates a total into equal groups or finds how many equal groups can be made. It is the inverse of multiplication. Strong division uses related multiplication facts, place value, estimation, long-division steps and careful interpretation of remainders.',
          steps:[
            'Connect division to multiplication: dividend ÷ divisor = quotient, and divisor × quotient + remainder = dividend.',
            'Use basic facts and place-value patterns to divide multiples of 10, 100 and 1000 mentally.',
            'For long division, decide where the quotient begins, then estimate, divide, multiply, subtract, compare and bring down.',
            'Write a zero in the quotient when a place value cannot be divided but later digits still remain.',
            'Use compatible numbers to estimate before dividing by larger divisors.',
            'Interpret the remainder in context: sometimes keep it, sometimes report what is left, and sometimes round the quotient up.'
          ],
          examples:[
            {q:'866 ÷ 7',steps:['7 goes into 8 once.','Continue through the tens and ones using divide → multiply → subtract → bring down.','The quotient is 123 with 5 left over.','Check: 123 × 7 + 5 = 866.'],answer:'123 R5'},
            {q:'826 ÷ 8',steps:['8 goes into 8 once.','There are not enough tens after subtracting, so write 0 in the tens place of the quotient.','Continue with the ones.','Check the quotient by multiplication.'],answer:'103 R2'},
            {q:'Estimate 2,075 ÷ 7',steps:['Choose a nearby compatible number divisible by 7.','2,100 is close to 2,075.','2,100 ÷ 7 = 300.'],answer:'About 300'},
            {q:'1,825 ÷ 23',steps:['23 does not fit into 18, so begin with 182.','Estimate the tens digit of the quotient.','Repeat divide, multiply, subtract and bring down.','Check with 23 × quotient + remainder.'],answer:'79 R8'},
            {q:'377 stamps, 12 per page: how many pages are needed?',steps:['377 ÷ 12 = 31 R5.','31 pages are full, but 5 stamps still need a place.','The remainder means another page is needed.'],answer:'32 pages'}
          ],
          mistake:'A remainder can never be equal to or greater than the divisor. Do not drop a zero from the quotient when a place value has no groups. In a real problem, do not automatically ignore the remainder—decide what it means.',
          quick:'Estimate → divide → multiply → subtract → compare → bring down → repeat → check and interpret the remainder.'
        };
      }
      return oldLearn?oldLearn(g,t,fallback):null;
    };
    window.SKILLUP_MATH.enhanced=function(g,t){
      if(String(g)==='5'&&t==='division')return topicQuestion();
      return oldEnhanced?oldEnhanced(g,t):null;
    };
  }
})();
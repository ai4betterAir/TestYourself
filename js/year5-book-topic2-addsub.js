// Topic 2 upgrade: Year 5 Addition, Subtraction & Estimation.
// Newly written SkillUP material covering the Year 5 curriculum and problem-solving style.
(function(){
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const fmt=n=>Number(n).toLocaleString('en-AU');
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);let c=uniq(choices||[]);if(!c.includes(ans))c.unshift(ans);
    return {text,answer:ans,choices:shuffle(c).slice(0,4),tip,explanation};
  }
  function nearest(n,place){return Math.round(n/place)*place}
  function topicQuestion(){
    const mode=R(0,15);let a,b,c,d,ans,p;
    if(mode===0){
      a=R(10000,9999999);p=pick([10,100,1000,10000,100000]);ans=nearest(a,p);
      return Q(`Round ${fmt(a)} to the nearest ${fmt(p)}.`,fmt(ans),[fmt(ans),fmt(ans+p),fmt(Math.max(0,ans-p)),fmt(nearest(a,p*10))],`Find the ${fmt(p)} place, then look one digit to the right.`,`${fmt(a)} is closest to ${fmt(ans)} when rounded to the nearest ${fmt(p)}.`);
    }
    if(mode===1){
      a=R(1000,99999)/1000;p=pick([1,0.1,0.01]);ans=Math.round(a/p)*p;const dp=p===1?0:p===0.1?1:2;
      return Q(`Round ${a.toFixed(3)} to the nearest ${p===1?'whole number':p===0.1?'tenth':'hundredth'}.`,ans.toFixed(dp),[ans.toFixed(dp),(ans+p).toFixed(dp),Math.max(0,ans-p).toFixed(dp),a.toFixed(dp)],'Use the same rounding rule for decimals: look one place to the right.',`${a.toFixed(3)} rounds to ${ans.toFixed(dp)}.`);
    }
    if(mode===2){
      a=R(1000,99999)/100;p=pick([1,10,100]);ans=Math.round(a/p)*p;
      return Q(`Round $${a.toFixed(2)} to the nearest ${p===1?'dollar':p===10?'ten dollars':'hundred dollars'}.`,`$${ans.toFixed(0)}`,[`$${ans.toFixed(0)}`,`$${(ans+p).toFixed(0)}`,`$${Math.max(0,ans-p).toFixed(0)}`,`$${Math.floor(a).toFixed(0)}`],'For money, round the same way as whole numbers.',`$${a.toFixed(2)} is about $${ans.toFixed(0)}.`);
    }
    if(mode===3){
      const cases=[
        ['7 + 19 = 19 + 7','Commutative Property','Changing the order of addends does not change the sum.'],
        ['(4 + 6) + 9 = 4 + (6 + 9)','Associative Property','Changing the grouping of addends does not change the sum.'],
        ['38 + 0 = 38','Identity Property','Adding zero leaves a number unchanged.']
      ];const x=pick(cases);
      return Q(`Which addition property is shown by ${x[0]}?`,x[1],[x[1],'Commutative Property','Associative Property','Identity Property'],x[2],x[2]);
    }
    if(mode===4){
      const vals=[R(10,90),R(10,90),R(10,90),R(10,90)];ans=vals.reduce((s,x)=>s+x,0);
      return Q(`Use a mental shortcut to add: ${vals.join(' + ')}`,ans,[ans,ans+10,ans-10,ans+20],'Look for pairs that make friendly tens or hundreds.',`Reorder and group helpful pairs. The total is ${ans}.`);
    }
    if(mode===5){
      const vals=[R(1200,8900),R(700,4900),R(800,5900)];const fronts=vals.map(x=>Math.floor(x/1000)*1000);ans=fronts.reduce((s,x)=>s+x,0);
      return Q(`Use front-end estimation for ${vals.map(fmt).join(' + ')}. What is the rough estimate?`,fmt(ans),[fmt(ans),fmt(ans+1000),fmt(Math.max(0,ans-1000)),fmt(vals.reduce((s,x)=>s+x,0))],'Add the thousands first and replace the remaining digits with zeros.',`${fronts.map(fmt).join(' + ')} = ${fmt(ans)}.`);
    }
    if(mode===6){
      a=R(4500,9800);b=R(1200,a-500);const ra=nearest(a,1000),rb=nearest(b,1000);ans=ra-rb;
      return Q(`Estimate ${fmt(a)} − ${fmt(b)} by rounding both numbers to the nearest thousand.`,fmt(ans),[fmt(ans),fmt(a-b),fmt(ans+1000),fmt(Math.max(0,ans-1000))],'Round first, then subtract the rounded values.',`${fmt(a)} ≈ ${fmt(ra)} and ${fmt(b)} ≈ ${fmt(rb)}; ${fmt(ra)} − ${fmt(rb)} = ${fmt(ans)}.`);
    }
    if(mode===7){
      a=R(100,9999);b=R(100,9999);c=R(100,9999);d=R(10,999);ans=a+b+c+d;
      return Q(`${fmt(a)} + ${fmt(b)} + ${fmt(c)} + ${fmt(d)} = ?`,fmt(ans),[fmt(ans),fmt(ans+100),fmt(ans-100),fmt(a+b+c)],'Align place values and regroup when needed.',`${fmt(a)} + ${fmt(b)} + ${fmt(c)} + ${fmt(d)} = ${fmt(ans)}.`);
    }
    if(mode===8){
      const base=pick([3000,4000,5000,6000,7000,8000,9000,10000]);b=R(111,base-1);ans=base-b;
      return Q(`${fmt(base)} − ${fmt(b)} = ?`,fmt(ans),[fmt(ans),fmt(ans+100),fmt(Math.max(0,ans-100)),fmt(base-b+10)],'When zeros block the subtraction, regroup across the zeros before subtracting.',`Regroup across the zeros, then subtract. ${fmt(base)} − ${fmt(b)} = ${fmt(ans)}.`);
    }
    if(mode===9){
      a=R(50000,950000);b=R(20000,800000);c=R(10000,700000);ans=a+b+c;
      return Q(`Find the exact sum: ${fmt(a)} + ${fmt(b)} + ${fmt(c)}.`,fmt(ans),[fmt(ans),fmt(nearest(ans,100000)),fmt(ans+1000),fmt(ans-1000)],'Estimate first, then add exactly and compare your answer with the estimate.',`The exact sum is ${fmt(ans)}. A rounded estimate helps confirm the size is sensible.`);
    }
    if(mode===10){
      a=R(500000,990000);b=R(100000,a-10000);ans=a-b;
      return Q(`Find the exact difference: ${fmt(a)} − ${fmt(b)}.`,fmt(ans),[fmt(ans),fmt(nearest(ans,100000)),fmt(ans+1000),fmt(Math.max(0,ans-1000))],'Estimate first, then subtract exactly with regrouping where necessary.',`${fmt(a)} − ${fmt(b)} = ${fmt(ans)}.`);
    }
    if(mode===11){
      b=R(500,9000);c=R(200,7000);ans=b+c;
      return Q(`A missing number satisfies □ − ${fmt(b)} = ${fmt(c)}. What is □?`,fmt(ans),[fmt(ans),fmt(Math.abs(b-c)),fmt(b),fmt(c)],'Undo subtraction by adding the difference and subtrahend.',`${fmt(c)} + ${fmt(b)} = ${fmt(ans)}, so the missing minuend is ${fmt(ans)}.`);
    }
    if(mode===12){
      a=R(20000,90000);b=R(10000,70000);const exact=a+b,estimate=nearest(a,10000)+nearest(b,10000);
      return Q(`Without calculating exactly, which is the most reasonable estimate for ${fmt(a)} + ${fmt(b)}?`,fmt(estimate),[fmt(estimate),fmt(exact),fmt(estimate+50000),fmt(Math.max(0,estimate-50000))],'Round both numbers to the nearest ten-thousand.',`${fmt(a)} ≈ ${fmt(nearest(a,10000))} and ${fmt(b)} ≈ ${fmt(nearest(b,10000))}; estimate = ${fmt(estimate)}.`);
    }
    if(mode===13){
      a=R(200,900);b=R(200,900);c=R(200,900);ans=a+b+c;
      return Q(`Three walking tracks are ${a} m, ${b} m and ${c} m long. What is their combined length?`,`${fmt(ans)} m`,[`${fmt(ans)} m`,`${fmt(a+b)} m`,`${fmt(ans+100)} m`,`${fmt(Math.max(a,b,c))} m`],'The question asks for a combined total, so add all three lengths.',`${a} + ${b} + ${c} = ${ans} m.`);
    }
    if(mode===14){
      a=R(50000,95000);b=R(20000,a-5000);ans=a-b;
      return Q(`A stadium seats ${fmt(a)} people. Another seats ${fmt(b)}. How many more people can the larger stadium seat?`,fmt(ans),[fmt(ans),fmt(a+b),fmt(ans+1000),fmt(Math.max(0,ans-1000))],'“How many more” asks for the difference, so subtract.',`${fmt(a)} − ${fmt(b)} = ${fmt(ans)}.`);
    }
    a=R(100000000,250000000);b=R(50000000,a-10000000);ans=nearest(a-b,1000000);
    return Q(`A region has about ${fmt(a)} km² total area and ${fmt(b)} km² is water. About how much land is there, to the nearest million?`,fmt(ans),[fmt(ans),fmt(nearest(a+b,1000000)),fmt(ans+1000000),fmt(Math.max(0,ans-1000000))],'Subtract first, then round the result to the nearest million.',`${fmt(a)} − ${fmt(b)} = ${fmt(a-b)}, which is about ${fmt(ans)} to the nearest million.`);
  }

  if(window.TY_YEAR5_TESTS){
    const row=window.TY_YEAR5_TESTS.topics?.find(x=>x[0]==='rounding');
    if(row){row[1]='±';row[2]='Addition, Subtraction & Estimation';row[3]='Rounding, mental strategies, exact sums/differences and checking reasonableness';}
    const oldQuestion=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=function(t){return t==='rounding'?topicQuestion():oldQuestion(t)};
  }

  if(window.SKILLUP_MATH){
    const oldLearn=window.SKILLUP_MATH.learn;
    const oldEnhanced=window.SKILLUP_MATH.enhanced;
    window.SKILLUP_MATH.learn=function(g,t,fallback){
      if(String(g)==='5'&&t==='rounding'){
        return {
          title:'Addition, Subtraction & Estimation',
          concept:'Strong number work uses two answers: a sensible estimate and an exact calculation. Estimation tells you roughly what to expect; place-value addition and subtraction give the exact answer. Addition properties can also make mental calculations faster.',
          steps:[
            'Estimate first by rounding or using the front digits so you know roughly how large the answer should be.',
            'For exact addition, align place values and regroup whenever a column totals 10 or more.',
            'For exact subtraction, align place values and regroup before subtracting when the top digit is too small; regroup across zeros when necessary.',
            'Use mental shortcuts such as changing the order or grouping of addends when that creates friendly numbers.',
            'Compare the exact answer with your estimate. If they are far apart, check the calculation.'
          ],
          examples:[
            {q:'Round 73,684 to the nearest thousand.',steps:['The thousands digit is 3.','Look at the hundreds digit: 6.','Because 6 is 5 or more, round the thousands up.'],answer:'74,000'},
            {q:'Estimate 4,386 + 2,741 + 3,208 using the front thousands.',steps:['4,386 → about 4,000','2,741 → about 2,000','3,208 → about 3,000','4,000 + 2,000 + 3,000 = 9,000'],answer:'About 9,000'},
            {q:'50,002 − 18,746',steps:['Regroup across the zeros before subtracting.','12 − 6 = 6; 9 − 4 = 5; 9 − 7 = 2; 4 − 8 cannot, so continue the regroup correctly through the place values.','Complete the aligned subtraction and check by addition.'],answer:'31,256'}
          ],
          mistake:'Do not treat an estimate as the exact answer. When subtracting across zeros, regroup through every required place before subtracting. Keep decimal points and place values aligned.',
          quick:'Estimate → calculate exactly → compare. A good exact answer should be close to the estimate.'
        };
      }
      return oldLearn?oldLearn(g,t,fallback):null;
    };
    window.SKILLUP_MATH.enhanced=function(g,t){
      if(String(g)==='5'&&t==='rounding')return topicQuestion();
      return oldEnhanced?oldEnhanced(g,t):null;
    };
  }
})();
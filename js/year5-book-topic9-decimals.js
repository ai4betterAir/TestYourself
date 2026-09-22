// Topic 9 upgrade: Year 5 Decimals.
// Newly written SkillUP material covering the Year 5 curriculum and problem-solving style.
(function(){
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const f=(n,dp=2)=>Number(n).toFixed(dp);
  const Q=(text,answer,choices,tip,explanation)=>{const ans=String(answer);let c=uniq((choices||[]).map(String));if(!c.includes(ans))c.unshift(ans);return{text,answer:ans,choices:shuffle(c).slice(0,4),tip,explanation}};
  function topicQuestion(){
    const mode=R(0,18);let a,b,c,ans,p;
    if(mode===0){a=R(1,9999)/100; b=R(1,9999)/100; ans=f(a+b);return Q(`${f(a)} + ${f(b)} = ?`,ans,[ans,f(Math.abs(a-b)),f(a+b+1),f(a+b+.1)],'Line up decimal points before adding.',`${f(a)} + ${f(b)} = ${ans}.`)}
    if(mode===1){a=R(500,9999)/100;b=R(1,Math.floor(a*100)-1)/100;if(b>a)[a,b]=[b,a];ans=f(a-b);return Q(`${f(a)} − ${f(b)} = ?`,ans,[ans,f(a+b),f(a-b+.1),f(Math.max(0,a-b-1))],'Write zeros if needed so place values line up.',`${f(a)} − ${f(b)} = ${ans}.`)}
    if(mode===2){a=R(100,9999)/100;b=R(100,9999)/100;ans=String(Math.round(a)+Math.round(b));return Q(`Estimate ${f(a)} + ${f(b)} by rounding each number to the nearest whole number.`,ans,[ans,String(Math.round(a+b)),String(Math.floor(a)+Math.floor(b)),String(Math.ceil(a)+Math.ceil(b))],'Round each addend first, then add.',`${f(a)} ≈ ${Math.round(a)} and ${f(b)} ≈ ${Math.round(b)}; estimate ${ans}.`)}
    if(mode===3){a=R(500,9999)/100;b=R(100,Math.floor(a*100)-1)/100;ans=String(Math.round(a)-Math.round(b));return Q(`Estimate ${f(a)} − ${f(b)} by rounding to whole numbers.`,ans,[ans,String(Math.round(a-b)),String(Math.floor(a)-Math.floor(b)),String(Math.ceil(a)-Math.ceil(b))],'Round first, then subtract.',`${f(a)} ≈ ${Math.round(a)}, ${f(b)} ≈ ${Math.round(b)}; estimate ${ans}.`)}
    if(mode===4){a=R(1,999)/100;p=pick([10,100,1000]);ans=String(Number((a*p).toFixed(6)));return Q(`${a} × ${p} = ?`,ans,[ans,String(a),String(Number((a/p).toFixed(6))),String(Number((a*p*10).toFixed(6)))],'Multiplying by 10, 100 or 1000 shifts digits left in place value.',`${a} × ${p} = ${ans}.`)}
    if(mode===5){a=R(100,9999)/100;p=pick([10,100,1000]);ans=String(Number((a/p).toFixed(6)));return Q(`${a} ÷ ${p} = ?`,ans,[ans,String(a),String(Number((a*p).toFixed(6))),String(Number((a/p/10).toFixed(6)))],'Dividing by 10, 100 or 1000 shifts digits right in place value.',`${a} ÷ ${p} = ${ans}.`)}
    if(mode===6){a=R(11,899)/100;b=R(2,12);ans=f(a*b);return Q(`${a} × ${b} = ?`,ans,[ans,f(a+b),f(a*b+1),f(a*b-.1)],'Multiply as whole numbers, then place the decimal using place value.',`${a} × ${b} = ${ans}.`)}
    if(mode===7){a=R(11,499)/100;b=R(11,399)/100;ans=f(a*b,4).replace(/0+$/,'').replace(/\.$/,'');const wrong1=f((Math.round(a*100)*Math.round(b*100))/100,2);return Q(`${a} × ${b} = ?`,ans,[ans,wrong1,String(Number((a*b*10).toFixed(4))),String(Number((a*b/10).toFixed(4)))],'Multiply without decimals first, then count the total decimal places in both factors.',`${a} × ${b} = ${ans}.`)}
    if(mode===8){a=R(10,499)/10;b=R(2,9);ans=f(a/b,2);a=Number(ans)*b;return Q(`${f(a,2)} ÷ ${b} = ?`,ans,[ans,f(a*b),f(a/b+1),f(a/b-.1)],'Divide as with whole numbers and keep the decimal point aligned in the quotient.',`${f(a,2)} ÷ ${b} = ${ans}.`)}
    if(mode===9){a=R(1,900)/100;b=pick([10,100]);const exact=a*b;ans=String(Number(exact.toFixed(4)));return Q(`A number multiplied by ${b} equals ${ans}. What is the number?`,String(a),[String(a),String(Number((a*10).toFixed(4))),String(Number((a/10).toFixed(4))),String(exact)],'Undo multiplication with division.',`${ans} ÷ ${b} = ${a}.`)}
    if(mode===10){a=R(100,999)/100;b=R(2,15);ans=f(a*b);return Q(`${b} notebooks cost $${f(a)} each. What is the total cost?`,`$${ans}`,[`$${ans}`,`$${f(a+b)}`,`$${f(a*b+1)}`,`$${f(a*b-.5)}`],'Total cost = number of items × cost per item.',`${b} × $${f(a)} = $${ans}.`)}
    if(mode===11){b=R(2,12);a=R(100,999)/100;const total=a*b;ans=`$${f(a)}`;return Q(`${b} identical items cost $${f(total)} altogether. What is the cost of one item?`,ans,[ans,`$${f(total/b+1)}`,`$${f(total)}`,`$${f(a*b)}`],'Unit price = total cost ÷ number of items.',`$${f(total)} ÷ ${b} = ${ans}.`)}
    if(mode===12){a=R(100,999)/100;b=R(100,999)/100;c=R(100,999)/100;ans=f(a+b-c);return Q(`A tank held ${f(a)} L, then ${f(b)} L was added and ${f(c)} L was used. How much is left?`,`${ans} L`,[`${ans} L`,`${f(a+b+c)} L`,`${f(a-b+c)} L`,`${f(Math.abs(a+b-c)+1)} L`],'Follow the story in order: add what enters, subtract what is used.',`${f(a)} + ${f(b)} − ${f(c)} = ${ans} L.`)}
    if(mode===13){a=R(1,999)/1000;const vals=[a,a+.001,a+.01,a+.1].map(x=>Number(x.toFixed(3)));ans=String(Math.max(...vals));return Q(`Which is greatest: ${vals.join(', ')}?`,ans,vals.map(String),'Compare tenths, then hundredths, then thousandths.',`${ans} has the greatest place-value sequence.`)}
    if(mode===14){a=R(100,999)/100;b=R(100,999)/100;const exact=a*b;ans=String(Math.round(a)*Math.round(b));return Q(`Estimate ${a} × ${b} by rounding each factor to the nearest whole number.`,ans,[ans,String(Math.round(exact)),String(Math.floor(a)*Math.floor(b)),String(Math.ceil(a)*Math.ceil(b))],'Round each factor, then multiply.',`${a} ≈ ${Math.round(a)} and ${b} ≈ ${Math.round(b)}; estimate ${ans}.`)}
    if(mode===15){b=R(2,9);const q=R(10,90)/10;a=q*b;ans=String(Number(q.toFixed(1)));return Q(`Estimate/check: ${f(a,1)} ÷ ${b} = ?`,ans,[ans,String(Number((q+1).toFixed(1))),String(Number((q-1).toFixed(1))),String(Number((a*b).toFixed(1)))],'Think of the multiplication fact that reverses the division.',`${b} × ${ans} = ${f(a,1)}, so the quotient is ${ans}.`)}
    if(mode===16){a=R(100,999)/100;b=R(100,999)/100;ans=a>b?'>':a<b?'<':'=';return Q(`Choose the correct symbol: ${f(a)} □ ${f(b)}`,ans,['>','<','='],'Compare digits from left to right by place value.',`${f(a)} ${ans} ${f(b)}.`)}
    if(mode===17){const whole=R(1,20),tenths=R(1,9),hund=R(1,9),thou=R(1,9);ans=(whole+tenths/10+hund/100+thou/1000).toFixed(3);return Q(`Write as a decimal: ${whole} + ${tenths}/10 + ${hund}/100 + ${thou}/1000`,ans,[ans,(whole+tenths/100+hund/10+thou/1000).toFixed(3),(whole+tenths/10+hund/1000+thou/100).toFixed(3),String(whole)],'Put each part in its correct decimal place.',`The number is ${ans}.`)}
    a=R(100,999)/100;b=R(2,8);c=R(1,5)/10;ans=f(a*b+c);return Q(`Evaluate ${a} × ${b} + ${c}.`,ans,[ans,f((a+c)*b),f(a*(b+c)),f(a+b+c)],'Multiply before adding.',`${a} × ${b} = ${f(a*b)}; then + ${c} = ${ans}.`)
  }
  if(window.TY_YEAR5_TESTS){
    const row=window.TY_YEAR5_TESTS.topics?.find(x=>x[0]==='decimals');
    if(row){row[2]='Decimals';row[3]='Place value, four operations, estimation, powers of ten and money';}
    const oldQ=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=t=>t==='decimals'?topicQuestion():oldQ(t);
  }
  if(window.SKILLUP_MATH){
    const oldLearn=window.SKILLUP_MATH.learn,oldEnhanced=window.SKILLUP_MATH.enhanced;
    window.SKILLUP_MATH.learn=function(g,t,fallback){
      if(String(g)==='5'&&t==='decimals')return{
        title:'Decimals',
        concept:'Decimals extend place value to tenths, hundredths and thousandths. The same whole-number ideas still work, but the decimal point keeps every digit in the correct place. Year 5 decimal work includes addition, subtraction, multiplication, division, estimation and money.',
        steps:[
          'Read and compare decimals by place value: ones, tenths, hundredths, thousandths.',
          'For addition and subtraction, line up decimal points and add zeros when helpful.',
          'For multiplication, multiply first and then place the decimal using the number of decimal places or place-value reasoning.',
          'For division by a whole number, keep the decimal point aligned in the quotient.',
          'Multiplying or dividing by 10, 100 and 1000 changes place value predictably.',
          'Estimate first so you can check whether the exact answer is sensible.'
        ],
        examples:[
          {q:'3.6 + 0.47',steps:['Write 3.60 + 0.47.','Add hundredths, tenths and ones in aligned columns.'],answer:'4.07'},
          {q:'5.2 − 1.87',steps:['Write 5.20 − 1.87.','Regroup across the decimal places.'],answer:'3.33'},
          {q:'2.4 × 1.3',steps:['24 × 13 = 312.','There are 2 decimal places altogether.','Place the decimal two places from the right.'],answer:'3.12'},
          {q:'1.62 ÷ 3',steps:['Divide 162 hundredths by 3.','Keep the decimal point aligned in the quotient.'],answer:'0.54'},
          {q:'0.38 × 100',steps:['Each digit moves two places to a greater place value.'],answer:'38'}
        ],
        mistake:'Do not line up the last digits when adding or subtracting—line up decimal points. When multiplying decimals, do not simply copy the decimal position from one factor. When dividing by 10, 100 or 1000, do not add or remove zeros blindly; think about place value.',
        quick:'Line up for +/−. Count/think place value for ×. Keep decimal alignment for ÷. Estimate to check.'
      };
      return oldLearn?oldLearn(g,t,fallback):null;
    };
    window.SKILLUP_MATH.enhanced=(g,t)=>String(g)==='5'&&t==='decimals'?topicQuestion():(oldEnhanced?oldEnhanced(g,t):null);
  }
})();
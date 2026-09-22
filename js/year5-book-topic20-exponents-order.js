// Topic 20: Year 5 Exponents & Order of Operations.
// Newly written SkillUP material covering Year 5 exponent enrichment and order-of-operations lessons as the curriculum reference.
(function(){
  if(!window.SKILLUP_MATH)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const pow=(a,b)=>Math.pow(a,b);
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);
    let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);
    rest=shuffle(rest).slice(0,3);
    let k=1;
    while(rest.length<3){const v=String(Number.isFinite(Number(ans))?Number(ans)+k:k);k++;if(v!==ans&&!rest.includes(v))rest.push(v);}
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,explanation};
  }
  function question(){
    const m=R(0,23);let a,b,c,d,ans;
    if(m===0){a=R(2,8);b=R(2,5);ans=`${a}^${b}`;return Q(`Write ${Array(b).fill(a).join(' × ')} using an exponent.`,ans,[ans,`${b}^${a}`,`${a*b}`,`${a}+${b}`],'The base is the repeated factor; the exponent tells how many times it is used.',`${a} is used as a factor ${b} times, so the expression is ${ans}.`);}
    if(m===1){a=R(2,9);b=R(2,4);ans=pow(a,b);return Q(`What is ${a}^${b}?`,ans,[ans,a*b,pow(a,b-1),pow(b,a)],'An exponent means repeated multiplication, not multiplication by the exponent.',`${a}^${b} = ${Array(b).fill(a).join(' × ')} = ${ans}.`);}
    if(m===2){a=R(2,9);return Q(`What is ${a}^1?`,a,[a,1,0,a*a],'Any number to the first power is itself.',`${a}^1 = ${a}.`);}
    if(m===3){a=R(2,9);return Q(`What is ${a}^0?`,1,[1,0,a,a*a],'Any nonzero number to the zero power equals 1.',`${a}^0 = 1.`);}
    if(m===4){a=R(2,9);ans=a*a;return Q(`What is ${a} squared?`,ans,[ans,a*2,a*a*a,a+2],'“Squared” means power 2.',`${a}^2 = ${a} × ${a} = ${ans}.`);}
    if(m===5){a=R(2,6);ans=a*a*a;return Q(`What is ${a} cubed?`,ans,[ans,a*3,a*a,a*a*a*a],'“Cubed” means power 3.',`${a}^3 = ${a} × ${a} × ${a} = ${ans}.`);}
    if(m===6){b=R(2,6);ans=pow(10,b);return Q(`What is 10^${b}?`,ans,[ans,b*10,pow(10,b-1),pow(10,b+1)],'A power of 10 has as many zeros as the exponent.',`10^${b} = ${ans.toLocaleString()}.`);}
    if(m===7){a=pick([4,8,9,16,25,27,32,36,49,64,81,125]);const pairs=[];for(let base=2;base<=9;base++)for(let exp=2;exp<=4;exp++)if(pow(base,exp)===a)pairs.push(`${base}^${exp}`);if(!pairs.length)return question();ans=pairs[0];return Q(`Which power equals ${a}?`,ans,[ans,'2^2','3^2','5^2'],'Evaluate each power and compare.',`${ans} = ${a}.`);}
    if(m===8){a=R(2,7);b=R(2,4);c=R(1,12);ans=pow(a,b)+c;return Q(`${a}^${b} + ${c} = ?`,ans,[ans,pow(a,b+c),a*b+c,pow(a,b)-c],'Evaluate the exponent before addition.',`${a}^${b}=${pow(a,b)}, then ${pow(a,b)}+${c}=${ans}.`);}
    if(m===9){a=R(2,7);b=R(2,4);c=R(2,8);ans=pow(a,b)*c;return Q(`${c} × ${a}^${b} = ?`,ans,[ans,pow(c*a,b),c*a*b,pow(a,b)+c],'Evaluate the power before multiplying.',`${a}^${b}=${pow(a,b)}; ${c}×${pow(a,b)}=${ans}.`);}
    if(m===10){a=R(2,9);b=R(2,9);c=R(2,8);ans=a+b*c;return Q(`${a} + ${b} × ${c} = ?`,ans,[ans,(a+b)*c,a*b+c,a+b+c],'Multiply before you add.',`${b}×${c}=${b*c}; ${a}+${b*c}=${ans}.`);}
    if(m===11){a=R(2,9);b=R(2,9);c=R(2,8);ans=(a+b)*c;return Q(`(${a} + ${b}) × ${c} = ?`,ans,[ans,a+b*c,a*b+c,a+b+c],'Do the operation inside parentheses first.',`${a}+${b}=${a+b}; then ${a+b}×${c}=${ans}.`);}
    if(m===12){a=R(20,60);b=pick([2,3,4,5,6]);c=R(2,8);const divisible=Math.floor(a/b)*b;a=divisible;ans=a/b+c;return Q(`${a} ÷ ${b} + ${c} = ?`,ans,[ans,a/(b+c),(a+c)/b,a/b*c],'Division comes before addition.',`${a}÷${b}=${a/b}; then add ${c} to get ${ans}.`);}
    if(m===13){a=R(20,60);b=pick([2,3,4,5,6]);c=R(2,8);a=Math.floor(a/b)*b;ans=a/(b+c);if(!Number.isInteger(ans))return question();return Q(`${a} ÷ (${b} + ${c}) = ?`,ans,[ans,a/b+c,(a+c)/b,a/(b*c)],'Parentheses change what is done first.',`${b}+${c}=${b+c}; ${a}÷${b+c}=${ans}.`);}
    if(m===14){a=R(2,8);b=R(2,6);c=R(2,5);d=R(1,9);ans=a*b+c*d;return Q(`${a} × ${b} + ${c} × ${d} = ?`,ans,[ans,(a*b+c)*d,a*(b+c)*d,a+b+c+d],'Do both multiplications before the addition.',`${a}×${b}=${a*b} and ${c}×${d}=${c*d}; total ${ans}.`);}
    if(m===15){a=R(2,9);b=R(2,9);c=R(2,6);ans=(a+b)*c;return Q(`Which expression has value ${ans}?`,`(${a} + ${b}) × ${c}`,[`(${a} + ${b}) × ${c}`,`${a} + ${b} × ${c}`,`${a} × ${b} + ${c}`,`${a} + ${b} + ${c}`],'Check how parentheses affect the order.',`(${a}+${b})×${c}=${a+b}×${c}=${ans}.`);}
    if(m===16){a=R(2,9);b=R(2,9);c=R(2,6);ans=a+b*c;return Q(`Where should parentheses NOT be added if the value must remain ${ans}?`,`${a} + (${b} × ${c})`,[`${a} + (${b} × ${c})`,`(${a} + ${b}) × ${c}`,`(${a} + ${b} × ${c})`,`(${a} + ${b}) + ${c}`],'Multiplication already happens before addition.',`${a}+(${b}×${c}) has the same value as ${a}+${b}×${c}.`);}
    if(m===17){const n=R(2,10);const expression=`${n} + 3 × 4`;ans=n+12;return Q(`A student evaluates ${expression} as ${(n+3)*4}. What mistake did the student make?`,'Added before multiplying',['Added before multiplying','Multiplied before adding','Forgot the exponent','Divided instead of multiplying'],'Use the order of operations to diagnose the error.',`The multiplication 3×4 should be done before adding ${n}.`);}
    if(m===18){a=R(2,6);b=R(2,4);c=R(2,6);ans=pow(a,b)-c;return Q(`${a}^${b} − ${c} = ?`,ans,[ans,pow(a,b-c),a*b-c,pow(a,b)+c],'Evaluate the power first, then subtract.',`${a}^${b}=${pow(a,b)}; ${pow(a,b)}−${c}=${ans}.`);}
    if(m===19){a=R(2,5);b=R(2,4);c=R(2,6);ans=(pow(a,b)+c)*2;return Q(`2 × (${a}^${b} + ${c}) = ?`,ans,[ans,2*pow(a,b)+c,pow(2*a,b)+c,pow(a,b)+2*c],'Inside parentheses, evaluate the exponent before addition; then multiply.',`${a}^${b}=${pow(a,b)}, so 2×(${pow(a,b)}+${c})=${ans}.`);}
    if(m===20){a=R(2,6);b=R(2,4);ans=pow(a,b);return Q(`Which repeated multiplication matches ${a}^${b}?`,Array(b).fill(a).join(' × '),[Array(b).fill(a).join(' × '),`${a} × ${b}`,Array(a).fill(b).join(' × '),`${a}+${a}`],'The exponent counts repeated factors.',`${a}^${b} uses ${a} as a factor ${b} times.`);}
    if(m===21){a=R(2,9);b=R(2,9);c=R(2,5);ans=a*(b+c);return Q(`${a} × (${b} + ${c}) = ?`,ans,[ans,a*b+c,(a+b)*c,a+b+c],'Parentheses first, then multiplication.',`${b}+${c}=${b+c}; ${a}×${b+c}=${ans}.`);}
    if(m===22){a=R(2,6);b=R(2,4);c=R(2,5);ans=pow(a,b)+pow(c,2);return Q(`${a}^${b} + ${c}^2 = ?`,ans,[ans,pow(a+c,b),a*b+c*2,pow(a,b)*pow(c,2)],'Evaluate each exponent first, then add.',`${a}^${b}=${pow(a,b)} and ${c}^2=${pow(c,2)}; sum=${ans}.`);}
    a=R(2,6);b=R(2,4);c=R(2,8);d=R(2,7);ans=pow(a,b)+c*d;return Q(`Evaluate ${a}^${b} + ${c} × ${d}.`,ans,[ans,(pow(a,b)+c)*d,pow(a,b+c)*d,a*b+c*d],'Powers first, then multiplication, then addition.',`${a}^${b}=${pow(a,b)}; ${c}×${d}=${c*d}; ${pow(a,b)}+${c*d}=${ans}.`);
  }

  if(window.TY_YEARS345&&window.TY_YEARS345.topics&&window.TY_YEARS345.topics['5']){
    window.TY_YEARS345.topics['5'].forEach(row=>{if(row[0]==='powers'){row[1]='x²';row[2]='Exponents & Order of Operations';row[3]='Powers, repeated multiplication, parentheses and multi-operation expressions';}});
  }
  if(window.TY_YEAR5_TESTS){
    window.TY_YEAR5_TESTS.topics=window.TY_YEAR5_TESTS.topics.filter(x=>x[0]!=='operations'&&x[0]!=='powers');
    const idx=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='wordproblems');
    window.TY_YEAR5_TESTS.topics.splice(idx>=0?idx:window.TY_YEAR5_TESTS.topics.length-1,0,['powers','x²','Exponents & Order of Operations','Powers, repeated multiplication, parentheses and multi-operation expressions']);
    const oldQ=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=t=>t==='powers'?question():oldQ(t);
  }

  const oldLearn=window.SKILLUP_MATH.learn;
  const oldEnhanced=window.SKILLUP_MATH.enhanced;
  window.SKILLUP_MATH.learn=function(g,t,fallback){
    if(String(g)==='5'&&t==='powers')return{
      title:'Exponents & Order of Operations',
      concept:'An exponent is a short way to show repeated multiplication. In an expression with more than one operation, the order of operations tells which calculation to do first so everyone gets the same answer.',
      steps:[
        'In a power such as 2^6, 2 is the base and 6 is the exponent. The exponent tells how many times the base is used as a factor.',
        'A number to the first power equals itself. Any nonzero number to the zero power equals 1.',
        'Squared means power 2 and cubed means power 3.',
        'Evaluate powers before the ordinary multiplication, division, addition or subtraction around them.',
        'Do operations inside parentheses first.',
        'After parentheses and powers, multiply or divide from left to right.',
        'Then add or subtract from left to right.',
        'Use estimation or an inverse/checking method to decide whether your final result is reasonable.'
      ],
      examples:[
        {q:'Write 3 × 3 × 3 × 3 using an exponent.',steps:['The repeated factor is 3.','It appears 4 times.'],answer:'3^4'},
        {q:'Find 5^3.',steps:['5^3 means 5 × 5 × 5.','25 × 5 = 125.'],answer:'125'},
        {q:'Evaluate 7 + 4 × 3.',steps:['Multiply first: 4 × 3 = 12.','Then add: 7 + 12 = 19.'],answer:'19'},
        {q:'Evaluate (7 + 4) × 3.',steps:['Parentheses first: 7 + 4 = 11.','Then multiply: 11 × 3 = 33.'],answer:'33'},
        {q:'Evaluate 2^4 + 3 × 5.',steps:['Power first: 2^4 = 16.','Multiply: 3 × 5 = 15.','Add: 16 + 15 = 31.'],answer:'31'}
      ]
    };
    return oldLearn?oldLearn(g,t,fallback):null;
  };
  window.SKILLUP_MATH.enhanced=function(g,t){
    if(String(g)==='5'&&t==='powers')return question();
    return oldEnhanced?oldEnhanced(g,t):null;
  };
})();

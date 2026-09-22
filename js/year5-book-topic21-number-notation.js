// Topic 21: Year 5 Roman Numerals & Scientific Notation.
// Newly written SkillUP material covering Year 5 Roman numeral lesson and scientific-notation enrichment as the curriculum reference.
(function(){
  if(!window.SKILLUP_MATH)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const romanMap=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
  function roman(n){let s='';for(const [v,r] of romanMap){while(n>=v){s+=r;n-=v;}}return s;}
  function romanValue(s){const val={I:1,V:5,X:10,L:50,C:100,D:500,M:1000};let total=0;for(let i=0;i<s.length;i++){const a=val[s[i]],b=val[s[i+1]]||0;total+=a<b?-a:a;}return total;}
  function coeffText(n){return String(Number(n.toFixed(3)));}
  function sciFromParts(c,e){return `${coeffText(c)} × 10^${e}`;}
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    let k=1;while(rest.length<3){const v=`${ans} ${k++}`;if(!rest.includes(v))rest.push(v);}
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,explanation};
  }
  function question(){
    const m=R(0,21);let a,b,c,e,n,ans;
    if(m===0){const set=pick([['I',1],['V',5],['X',10],['L',50],['C',100],['D',500],['M',1000]]);return Q(`What value does the Roman numeral ${set[0]} represent?`,set[1],[set[1],set[1]*2,Math.max(1,set[1]/5),set[1]*10],'Recall the basic Roman numeral symbols.',`${set[0]} represents ${set[1]}.`);}
    if(m===1){n=R(1,3999);ans=roman(n);return Q(`Write ${n.toLocaleString()} as a Roman numeral.`,ans,[ans,roman(Math.max(1,n-1)),roman(Math.min(3999,n+1)),roman(Math.max(1,n-10))],'Build the number from the largest Roman numeral values first.',`${n.toLocaleString()} is written ${ans}.`);}
    if(m===2){n=R(1,3999);a=roman(n);return Q(`Write ${a} in standard form.`,n,[n,n+10,Math.max(1,n-10),n+100],'Add values when a smaller symbol follows a larger one; subtract when a smaller symbol comes before a larger one.',`${a} = ${n}.`);}
    if(m===3){a=R(20,1200);b=R(20,1200);if(a===b)return question();ans=a>b?roman(a):roman(b);return Q(`Which Roman numeral has the greater value: ${roman(a)} or ${roman(b)}?`,ans,[roman(a),roman(b)],'Convert both numerals to standard numbers before comparing.',`${roman(a)}=${a} and ${roman(b)}=${b}.`);}
    if(m===4){const set=pick([['IV',4],['IX',9],['XL',40],['XC',90],['CD',400],['CM',900]]);return Q(`What is the value of ${set[0]}?`,set[1],[set[1],set[1]+10,Math.max(1,set[1]-10),set[1]*2],'A smaller numeral before a larger numeral is subtracted.',`${set[0]} = ${set[1]}.`);}
    if(m===5){const good=pick(['VIII','XXX','CCC','DCC','MCC']);const bad=pick(['IIII','XXXX','CCCC','VV']);return Q('Which Roman numeral follows the rule that a symbol is not repeated more than three times?',good,[good,bad,'IIII','XXXX'],'Check repeated symbols carefully.',`${good} follows the repetition rule.`);}
    if(m===6){n=R(1500,2099);ans=roman(n);return Q(`A building was completed in ${n}. How would that year be written in Roman numerals?`,ans,[ans,roman(n-10),roman(n+1),roman(n-1)],'Break the year into thousands, hundreds, tens and ones.',`${n} = ${ans}.`);}
    if(m===7){a=R(10,300);b=R(5,150);ans=a+b;return Q(`${roman(a)} + ${roman(b)} has what value in standard form?`,ans,[ans,a,b,Math.abs(a-b)],'Convert each Roman numeral, then add.',`${roman(a)}=${a} and ${roman(b)}=${b}; ${a}+${b}=${ans}.`);}
    if(m===8){a=R(50,500);b=R(1,a-1);ans=a-b;return Q(`${roman(a)} − ${roman(b)} has what value in standard form?`,ans,[ans,a+b,a,b],'Convert each numeral, then subtract.',`${a}-${b}=${ans}.`);}
    if(m===9){n=pick([14,19,24,39,44,49,90,94,99,400,444,900,944]);ans=roman(n);return Q(`Which Roman numeral correctly represents ${n}?`,ans,[ans,roman(Math.max(1,n-5)),roman(n+1),roman(Math.max(1,n-1))],'Watch for subtractive pairs such as IV, IX, XL, XC, CD and CM.',`${n} = ${ans}.`);}
    if(m===10){c=R(10,99)/10;e=R(2,8);n=Math.round(c*Math.pow(10,e));ans=sciFromParts(c,e);return Q(`Write ${n.toLocaleString()} in scientific notation.`,ans,[ans,sciFromParts(c,e-1),sciFromParts(c/10,e+1),`${coeffText(c*10)} × 10^${e}`],'Move the decimal point so the first factor is at least 1 but less than 10.',`${n.toLocaleString()} = ${ans}.`);}
    if(m===11){c=R(10,99)/10;e=R(2,8);n=Math.round(c*Math.pow(10,e));return Q(`Write ${sciFromParts(c,e)} in standard form.`,n.toLocaleString(),[n.toLocaleString(),Math.round(c*Math.pow(10,e-1)).toLocaleString(),Math.round(c*Math.pow(10,e+1)).toLocaleString(),Math.round(c*e).toLocaleString()],'Multiply the coefficient by the power of 10.',`${sciFromParts(c,e)} = ${n.toLocaleString()}.`);}
    if(m===12){const good=R(10,99)/10,e1=R(2,7);return Q('Which expression is written correctly in scientific notation?',sciFromParts(good,e1),[sciFromParts(good,e1),`${coeffText(good*10)} × 10^${e1-1}`,`0.${R(1,9)} × 10^${e1+1}`,`${R(10,50)} × 10^${e1}`],'The first factor must be at least 1 but less than 10.',`${sciFromParts(good,e1)} has a first factor between 1 and 10.`);}
    if(m===13){a=R(1,9);e=R(3,8);n=a*Math.pow(10,e);ans=e;return Q(`${n.toLocaleString()} = ${a} × 10^?. What is the exponent?`,ans,[ans,e-1,e+1,a],'Count how many places the decimal point moves from the standard number to the coefficient.',`${n.toLocaleString()} = ${a} × 10^${e}.`);}
    if(m===14){e=R(1,8);n=Math.pow(10,e);return Q(`Which power of 10 equals ${n.toLocaleString()}?`,`10^${e}`,[`10^${e}`,`10^${e-1}`,`10^${e+1}`,`${e}^10`],'For powers of 10, the exponent matches the number of zeros.',`${n.toLocaleString()} = 10^${e}.`);}
    if(m===15){e=R(3,7);a=R(10,49)/10;b=R(50,99)/10;ans=sciFromParts(b,e);return Q(`Which is greater: ${sciFromParts(a,e)} or ${sciFromParts(b,e)}?`,ans,[sciFromParts(a,e),sciFromParts(b,e)],'With equal powers of 10, compare the first factors.',`${coeffText(b)}>${coeffText(a)}, so ${ans} is greater.`);}
    if(m===16){a=R(10,99)/10;b=R(10,99)/10;e=R(2,6);const e2=e+1;ans=sciFromParts(b,e2);return Q(`Which is greater: ${sciFromParts(a,e)} or ${sciFromParts(b,e2)}?`,ans,[sciFromParts(a,e),sciFromParts(b,e2)],'Because both first factors are between 1 and 10, the larger power of 10 gives the larger positive number.',`${ans} has the larger power of 10.`);}
    if(m===17){a=R(1,9);e=R(3,8);n=a*Math.pow(10,e);return Q(`${a} × 10^${e} equals which standard number?`,n.toLocaleString(),[n.toLocaleString(),(a*Math.pow(10,e-1)).toLocaleString(),(a*Math.pow(10,e+1)).toLocaleString(),`${a}${e}`],'Multiply by the power of 10.',`${a} × 10^${e} = ${n.toLocaleString()}.`);}
    if(m===18){c=R(10,99)/10;e=R(2,7);ans=sciFromParts(c,e);return Q(`Which is the correct scientific notation for ${Math.round(c*Math.pow(10,e)).toLocaleString()}?`,ans,[ans,`${coeffText(c*10)} × 10^${e}`,`${coeffText(c/10)} × 10^${e}`,`${coeffText(c)} + 10^${e}`],'The first factor must be between 1 and 10 and the expression must be a product.',`${ans} is correctly normalised.`);}
    if(m===19){const perSecond=pick([2000,3000,4000,5000]);const seconds=pick([60,120,300,600]);n=perSecond*seconds;e=Math.floor(Math.log10(n));c=n/Math.pow(10,e);ans=sciFromParts(c,e);return Q(`A signal travels ${perSecond.toLocaleString()} m each second for ${seconds} seconds. How far does it travel, in scientific notation?`,ans,[ans,sciFromParts(c,e-1),sciFromParts(c,e+1),n.toLocaleString()],'Find the total distance first, then rewrite it in scientific notation.',`${perSecond.toLocaleString()}×${seconds}=${n.toLocaleString()}=${ans}.`);}
    if(m===20){const first=pick([120000,250000,360000,480000]);const increase=pick([20000,30000,50000,70000]);n=increase;e=Math.floor(Math.log10(n));c=n/Math.pow(10,e);ans=sciFromParts(c,e);return Q(`A population rises from ${first.toLocaleString()} to ${(first+increase).toLocaleString()}. Express the increase in scientific notation.`,ans,[ans,sciFromParts(c,e-1),sciFromParts(c,e+1),sciFromParts((first+increase)/Math.pow(10,Math.floor(Math.log10(first+increase))),Math.floor(Math.log10(first+increase)))],'Subtract first, then write the difference in scientific notation.',`Increase=${increase.toLocaleString()}=${ans}.`);}
    e=R(3,8);a=R(1,9);n=a*Math.pow(10,e);return Q(`In ${a} × 10^${e}, what does the exponent ${e} tell you?`,`${a} is multiplied by ${Math.pow(10,e).toLocaleString()}`,[`${a} is multiplied by ${Math.pow(10,e).toLocaleString()}`,`${a} is multiplied by ${e}`,`There are ${a} zeros`,`The number equals ${a+e}`],'A power of 10 tells the place-value scale.',`10^${e}=${Math.pow(10,e).toLocaleString()}, so the coefficient is multiplied by that amount.`);
  }

  if(window.TY_YEAR5_TESTS){
    window.TY_YEAR5_TESTS.topics=window.TY_YEAR5_TESTS.topics.filter(x=>x[0]!=='numbernotation');
    const idx=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='powers');
    window.TY_YEAR5_TESTS.topics.splice(idx>=0?idx+1:window.TY_YEAR5_TESTS.topics.length-1,0,['numbernotation','Ⅹ','Roman Numerals & Scientific Notation','Roman numeral rules, standard form, powers of ten and compact notation for large numbers']);
    const oldQ=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=t=>t==='numbernotation'?question():oldQ(t);
  }

  const oldLearn=window.SKILLUP_MATH.learn;
  const oldEnhanced=window.SKILLUP_MATH.enhanced;
  window.SKILLUP_MATH.learn=function(g,t,fallback){
    if(String(g)==='5'&&t==='numbernotation')return{
      title:'Roman Numerals & Scientific Notation',
      concept:'Roman numerals use letters to represent numbers. Scientific notation is a compact way to write very large numbers as a number from 1 up to, but not including, 10 multiplied by a power of 10.',
      steps:[
        'Know the main Roman numeral values: I=1, V=5, X=10, L=50, C=100, D=500 and M=1000.',
        'When a Roman numeral symbol is repeated or a smaller value comes after a larger value, add the values.',
        'When a smaller Roman numeral comes before a larger one, subtract the smaller value. Common pairs are IV, IX, XL, XC, CD and CM.',
        'A Roman numeral symbol is not repeated more than three times in a row.',
        'To write a standard number as a Roman numeral, work from the greatest place values down to the smallest.',
        'Scientific notation has two factors: the first is at least 1 but less than 10; the second is a power of 10.',
        'To write a large whole number in scientific notation, move the decimal point until only one nonzero digit is to its left. The number of places moved becomes the exponent.',
        'To return to standard form, multiply the first factor by the power of 10.'
      ],
      examples:[
        {q:'Write XLIV in standard form.',steps:['XL means 50−10=40.','IV means 5−1=4.','40+4=44.'],answer:'44'},
        {q:'Write 944 as a Roman numeral.',steps:['900=CM.','40=XL.','4=IV.','Join the parts.'],answer:'CMXLIV'},
        {q:'Write 93,000,000 in scientific notation.',steps:['Move the decimal point so the first factor is 9.3.','The decimal moved 7 places.'],answer:'9.3 × 10^7'},
        {q:'Write 5.051 × 10^3 in standard form.',steps:['10^3=1,000.','5.051×1,000 moves the decimal 3 places right.'],answer:'5,051'},
        {q:'Which is larger: 4.8 × 10^5 or 7.1 × 10^4?',steps:['The first number uses 10^5.','The second uses 10^4.','For positive scientific-notation numbers, the larger power of 10 is larger here.'],answer:'4.8 × 10^5'}
      ]
    };
    return oldLearn?oldLearn(g,t,fallback):null;
  };
  window.SKILLUP_MATH.enhanced=function(g,t){if(String(g)==='5'&&t==='numbernotation')return question();return oldEnhanced?oldEnhanced(g,t):null;};
})();

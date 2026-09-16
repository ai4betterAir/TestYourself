// Topic 1 upgrade: Year 5 Place Value & Numeration.
// Question styles are newly written for SkillUP, using the uploaded Grade 5 book only as a curriculum/style reference.
(function(){
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const fmt=n=>Number(n).toLocaleString('en-AU');
  const unique=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);
    let c=unique(choices||[]);
    if(!c.includes(ans))c.unshift(ans);
    const fallback=['They are equal','Cannot be determined','None of these','0'];
    for(const v of fallback){if(c.length>=4)break;if(!c.includes(v))c.push(v)}
    return {text,answer:ans,choices:shuffle(c.slice(0,4)),tip,explanation};
  }
  const places=[
    [1,'ones'],[10,'tens'],[100,'hundreds'],[1000,'thousands'],[10000,'ten-thousands'],[100000,'hundred-thousands'],
    [1000000,'millions'],[10000000,'ten-millions'],[100000000,'hundred-millions'],[1000000000,'billions'],[10000000000,'ten-billions']
  ];
  function expanded(n){
    const s=String(Math.trunc(n)),out=[];
    for(let i=0;i<s.length;i++){
      const d=Number(s[i]),p=10**(s.length-i-1);
      if(d)out.push(fmt(d*p));
    }
    return out.join(' + ');
  }
  function roman(n){
    const map=[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    let out='';for(const [v,s] of map){while(n>=v){out+=s;n-=v}}return out;
  }
  function placeQuestion(){
    const mode=R(0,13);
    let n,p,d,a,b,c,ans;
    if(mode===0){
      n=R(120000000,8999999999); p=pick(places.filter(x=>x[0]<=1000000000))[0]; d=Math.floor(n/p)%10;
      if(d===0)return placeQuestion(); ans=d*p;
      return Q(`In ${fmt(n)}, what is the value of the digit ${d}?`,fmt(ans),[fmt(ans),String(d),fmt(d*p*10),fmt(Math.max(1,d*p/10))],`Find the digit's place, then multiply ${d} by that place value.`,`${d} is in a place worth ${fmt(p)}. So ${d} × ${fmt(p)} = ${fmt(ans)}.`);
    }
    if(mode===1){
      n=R(1000000,9999999999); const opts=places.filter(x=>x[0]<=n); [p]=pick(opts); d=Math.floor(n/p)%10;if(d===0)return placeQuestion();
      const name=places.find(x=>x[0]===p)[1];
      return Q(`In ${fmt(n)}, which place contains the digit ${d}?`,name,[name,'thousands','hundred-thousands','millions','ten-millions'],'Read the number in periods from left to right.',`The digit ${d} represents ${fmt(d*p)}, so it is in the ${name} place.`);
    }
    if(mode===2){
      n=R(1000000,9999999999); ans=expanded(n);
      return Q(`Which is the correct expanded form of ${fmt(n)}?`,ans,[ans,expanded(n+1000),expanded(n+100000),expanded(Math.max(1,n-10000))],'Write only the non-zero place values and add them.',`Each non-zero digit contributes its place value. That gives ${ans}.`);
    }
    if(mode===3){
      n=R(1000000,9999999999); const e=expanded(n);
      return Q(`What number is shown by this expanded form?\n${e}`,fmt(n),[fmt(n),fmt(n+1000),fmt(n+10000),fmt(Math.max(1,n-100000))],'Add the place-value parts together.',`Combining all the expanded parts gives ${fmt(n)}.`);
    }
    if(mode===4){
      a=R(100000000,9999999999); b=a+pick([-1,1])*R(1000,9000000); if(b<0)b=a+R(1000,9000000); ans=Math.max(a,b);
      return Q(`Which number is greater?\n${fmt(a)}   or   ${fmt(b)}`,fmt(ans),[fmt(a),fmt(b),'They are equal','Cannot be determined'],'Compare from the left. The first different digit decides.',`Reading from the greatest place value, ${fmt(ans)} has the larger digit at the first place where the numbers differ.`);
    }
    if(mode===5){
      a=R(1000000,900000000); b=a+R(1000,900000); c=Math.max(1,a-R(1000,900000)); const vals=[a,b,c].sort((x,y)=>x-y); ans=vals.map(fmt).join(' < ');
      const wrong1=[...vals].reverse().map(fmt).join(' < '), wrong2=[fmt(vals[0]),fmt(vals[2]),fmt(vals[1])].join(' < '),wrong3=[fmt(vals[1]),fmt(vals[0]),fmt(vals[2])].join(' < ');
      return Q(`Which order is correct from least to greatest?\nNumbers: ${[a,b,c].map(fmt).join(', ')}`,ans,[ans,wrong1,wrong2,wrong3],'Compare the greatest place first, then move right only when digits are equal.',`The correct ascending order is ${ans}.`);
    }
    if(mode===6){
      const whole=R(1,90),tenths=R(0,9),hund=R(0,9),thou=R(1,9); const val=(whole+tenths/10+hund/100+thou/1000).toFixed(3); ans=(thou/1000).toFixed(3);
      return Q(`In ${val}, what is the value of the digit ${thou} in the thousandths place?`,ans,[ans,(thou/100).toFixed(2),(thou/10).toFixed(1),String(thou)],'Digits after the decimal are tenths, hundredths, then thousandths.',`${thou} thousandths = ${thou}/1000 = ${ans}.`);
    }
    if(mode===7){
      const base=pick([0.4,0.7,0.23,0.65,1.5,2.8]); const s=String(base); ans=base.toFixed(3);
      return Q(`Which decimal has the same value as ${s}?`,ans,[ans,(base+0.01).toFixed(3),(base+0.1).toFixed(3),(base*10).toFixed(3)],'Zeros added at the end of a decimal do not change its value.',`${s}, ${base.toFixed(2)} and ${base.toFixed(3)} are equivalent decimals.`);
    }
    if(mode===8){
      const base=R(1000,999000)/1000,delta=pick([0.001,0.01,0.1]),dir=Math.random()<.5?1:-1,target=base+dir*delta,wording=dir>0?'greater':'less'; ans=target.toFixed(3);
      return Q(`What number is ${delta} ${wording} than ${base.toFixed(3)}?`,ans,[ans,(base-dir*delta).toFixed(3),(base+delta*10).toFixed(3),base.toFixed(3)],'Change only the place named by the amount.',`${base.toFixed(3)} ${dir>0?'+':'−'} ${delta} = ${ans}.`);
    }
    if(mode===9){
      n=R(100000000,9000000000); p=pick([1000,10000,100000,1000000]); const dir=Math.random()<.5?1:-1; ans=n+dir*p;
      return Q(`Starting with ${fmt(n)}, what number is ${fmt(p)} ${dir>0?'greater':'less'}?`,fmt(ans),[fmt(ans),fmt(n+dir*p*10),fmt(n-dir*p),fmt(n)],'Add or subtract exactly one place-value amount.',`${fmt(n)} ${dir>0?'+':'−'} ${fmt(p)} = ${fmt(ans)}.`);
    }
    if(mode===10){
      const digits=shuffle([2,4,6,7,8,9]).slice(0,4),limit=8,available=digits.filter(x=>x<limit); if(!available.length)return placeQuestion(); const first=Math.max(...available),rest=digits.filter(x=>x!==first).sort((x,y)=>y-x); ans=Number(String(first)+rest.join(''));
      return Q(`Use the digits ${digits.join(', ')} once each. What is the greatest 4-digit number less than 8,000?`,fmt(ans),[fmt(ans),fmt(Number([...digits].sort((x,y)=>y-x).join(''))),fmt(Number([...digits].sort((x,y)=>x-y).join(''))),fmt(ans-9)],'The thousands digit must be less than 8. Then make the remaining places as large as possible.',`Choose ${first} for the thousands place, then arrange the remaining digits from greatest to least: ${fmt(ans)}.`);
    }
    if(mode===11){
      n=pick([49,58,76,94,145,263,388,649,944,1950]); ans=roman(n);
      return Q(`Which Roman numeral represents ${n}?`,ans,[ans,roman(Math.max(1,n-1)),roman(n+1),roman(Math.max(1,n-10))],'Build the numeral from the largest Roman values first.',`${n} is written as ${ans}.`);
    }
    if(mode===12){
      const m=pick([2,3,4,5,6,8]); ans=m*1000000;
      return Q(`How many thousands are equal to ${m} billion?`,fmt(ans),[fmt(ans),fmt(m*1000),fmt(m*100000),fmt(m*10000000)],'1 billion = 1,000,000 thousands.',`${m} billion = ${m} × 1,000,000 thousands = ${fmt(ans)} thousands.`);
    }
    const start=R(20,800)/1000,step=pick([0.001,0.002,0.005,0.01]),seq=[start,start+step,start+2*step,start+3*step]; ans=(start+4*step).toFixed(3);
    return Q(`What comes next?\n${seq.map(x=>x.toFixed(3)).join(', ')}, ?`,ans,[ans,(start+5*step).toFixed(3),(start+3*step).toFixed(3),(start+4*step+0.01).toFixed(3)],`The pattern increases by ${step.toFixed(3)} each time.`,`${seq[3].toFixed(3)} + ${step.toFixed(3)} = ${ans}.`);
  }

  if(window.TY_YEAR5_TESTS){
    const row=window.TY_YEAR5_TESTS.topics?.find(x=>x[0]==='numeration');
    if(row){row[2]='Place Value & Numeration';row[3]='Billions, expanded form, decimals, compare/order and number reasoning';}
    const oldQuestion=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=function(t){return t==='numeration'?placeQuestion():oldQuestion(t)};
  }

  if(window.SKILLUP_MATH){
    const oldLearn=window.SKILLUP_MATH.learn;
    const oldEnhanced=window.SKILLUP_MATH.enhanced;
    window.SKILLUP_MATH.learn=function(g,t,fallback){
      if(String(g)==='5'&&t==='numeration'){
        return {
          title:'Place Value & Numeration',
          concept:'Large numbers are organised into periods of three digits: billions, millions, thousands and ones. The position of a digit tells its value. The same place-value idea continues to tenths, hundredths and thousandths after the decimal point.',
          steps:[
            'Separate large numbers into 3-digit periods and read from the greatest period to the ones period.',
            'To find a digit’s value, identify its place and multiply the digit by that place value.',
            'Expanded form shows the value of every non-zero digit; zero-value places may be omitted.',
            'For decimals, read places to the right as tenths, hundredths and thousandths.',
            'To compare numbers, start at the greatest place and move right until the digits differ.'
          ],
          examples:[
            {q:'What is the value of 7 in 4,372,615,089?',steps:['The 7 is in the ten-millions place.','Ten-millions = 10,000,000.','7 × 10,000,000 = 70,000,000.'],answer:'70,000,000'},
            {q:'Write 6,040,205,013 in expanded form.',steps:['6 billions = 6,000,000,000','4 ten-millions = 40,000,000','2 hundred-thousands = 200,000','5 thousands = 5,000','1 ten = 10 and 3 ones = 3'],answer:'6,000,000,000 + 40,000,000 + 200,000 + 5,000 + 10 + 3'},
            {q:'Which is greater: 27.406 or 27.460?',steps:['Whole-number parts are equal: 27.','Tenths are equal: 4.','Compare hundredths: 0 < 6.'],answer:'27.460'}
          ],
          mistake:'Do not compare numbers by length alone or by the last digit. Start at the greatest place value. For decimals, remember 0.4 = 0.40 = 0.400.',
          quick:'Think in place-value columns: billions | millions | thousands | ones | tenths | hundredths | thousandths.'
        };
      }
      return oldLearn?oldLearn(g,t,fallback):null;
    };
    window.SKILLUP_MATH.enhanced=function(g,t){
      if(String(g)==='5'&&t==='numeration')return placeQuestion();
      return oldEnhanced?oldEnhanced(g,t):null;
    };
  }
})();
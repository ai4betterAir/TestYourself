// Topic 17 upgrade: Year 5 Integers & Negative Numbers.
// Newly written SkillUP material covering Year 5 integer lessons as the curriculum reference.
(function(){
  if(!window.SKILLUP_MATH)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const I=n=>n<0?`−${Math.abs(n)}`:String(n);
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    let k=1;while(rest.length<3){const v=I(k++);if(v!==ans&&!rest.includes(v))rest.push(v);}
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,explanation};
  }
  function topicQuestion(){
    const mode=R(0,23);let a,b,c,ans;
    if(mode===0){
      const z=pick([
        ['8 metres below sea level',-8],['a gain of 6 points',6],['a loss of 11 dollars',-11],['4 floors above ground',4],['7 degrees below zero',-7]
      ]);ans=I(z[1]);return Q(`Which integer represents ${z[0]}?`,ans,[ans,I(-z[1]),'0',I(z[1]+2)],'Positive values are above or gains; negative values are below or losses.',`${z[0]} is represented by ${ans}.`);
    }
    if(mode===1){a=R(-20,20);if(a===0)a=7;ans=I(-a);return Q(`What is the opposite of ${I(a)}?`,ans,[ans,I(a),I(Math.abs(a)),I(-a+1)],'Opposites are the same distance from 0 on different sides.',`The opposite of ${I(a)} is ${ans}.`);}
    if(mode===2){a=R(-15,15);return Q(`Which integer is immediately to the right of ${I(a)} on a number line?`,I(a+1),[I(a+1),I(a-1),I(-a),I(a+2)],'Moving one place right increases an integer by 1.',`${I(a+1)} is one step to the right of ${I(a)}.`);}
    if(mode===3){a=R(-20,15);b=R(-15,20);if(a===b)return topicQuestion();ans=a>b?I(a):I(b);return Q(`Which integer is greater: ${I(a)} or ${I(b)}?`,ans,[I(a),I(b),'They are equal',I(Math.min(a,b)-1)],'On a number line, the integer farther to the right is greater.',`${ans} is farther to the right.`);}
    if(mode===4){const vals=uniq([R(-12,12),R(-12,12),R(-12,12)]).map(Number);if(vals.length<3)return topicQuestion();const sorted=[...vals].sort((x,y)=>x-y);ans=sorted.map(I).join(', ');return Q(`Order these integers from least to greatest: ${vals.map(I).join(', ')}.`,ans,[ans,[...sorted].reverse().map(I).join(', '),[sorted[1],sorted[0],sorted[2]].map(I).join(', '),vals.map(I).join(', ')],'Least to greatest means move from left to right on the number line.',`The order is ${ans}.`);}
    if(mode===5){const vals=uniq([R(-12,12),R(-12,12),R(-12,12)]).map(Number);if(vals.length<3)return topicQuestion();const sorted=[...vals].sort((x,y)=>y-x);ans=sorted.map(I).join(', ');return Q(`Order these integers from greatest to least: ${vals.map(I).join(', ')}.`,ans,[ans,[...sorted].reverse().map(I).join(', '),[sorted[1],sorted[0],sorted[2]].map(I).join(', '),vals.map(I).join(', ')],'Greatest to least means start with the value farthest to the right.',`The order is ${ans}.`);}
    if(mode===6){a=R(2,18);b=R(2,18);ans=I(-(a+b));return Q(`${I(-a)} + ${I(-b)} = ?`,ans,[ans,I(a+b),I(-(Math.abs(a-b))),I(-a+b)],'Like signs: add the sizes and keep the common sign.',`${a}+${b}=${a+b}, and both addends are negative, so the answer is ${ans}.`);}
    if(mode===7){a=R(2,18);b=R(2,18);ans=I(a+b);return Q(`${a} + ${b} = ?`,ans,[ans,I(-(a+b)),I(Math.abs(a-b)),I(a+b+1)],'Like signs: add the values and keep the sign.',`${a}+${b}=${ans}.`);}
    if(mode===8){a=R(3,20);b=R(2,19);if(a===b)b--;const first=Math.random()<.5?a:-a,second=first>0?-b:b;const total=first+second;ans=I(total);return Q(`${I(first)} + ${I(second)} = ?`,ans,[ans,I(-total),I(Math.abs(first)+Math.abs(second)),I(Math.abs(first)-Math.abs(second))],'Unlike signs: subtract the smaller distance from the larger and use the sign of the number farther from zero.',`${I(first)} + ${I(second)} = ${ans}.`);}
    if(mode===9){a=R(3,18);ans='0';return Q(`${a} + ${I(-a)} = ?`,ans,[ans,I(a),I(-a),I(2*a)],'An integer and its opposite add to zero.',`${a} and ${I(-a)} are opposites, so their sum is 0.`);}
    if(mode===10){a=R(-8,12);b=R(3,12);const fall=Math.random()<.5;const total=a+(fall?-b:b);ans=`${I(total)}°C`;return Q(`The temperature is ${I(a)}°C and then ${fall?'falls':'rises'} by ${b}°. What is the new temperature?`,ans,[ans,`${I(a+(fall?b:-b))}°C`,`${I(a)}°C`,`${I(total+(fall?-1:1))}°C`],fall?'A fall is a negative change.':'A rise is a positive change.',`${I(a)} ${fall?'+ '+I(-b):'+ '+b} = ${I(total)}°C.`);}
    if(mode===11){a=R(-12,12);b=R(-10,10);if(b===0)b=4;const total=a-b;ans=I(total);return Q(`${I(a)} − (${I(b)}) = ?`,ans,[ans,I(a+b),I(-total),I(Math.abs(a-b))],'Subtracting an integer is the same as adding its opposite.',`${I(a)} − (${I(b)}) = ${I(a)} + ${I(-b)} = ${ans}.`);}
    if(mode===12){a=R(2,15);b=R(2,15);ans=I(-a-b);return Q(`${I(-a)} − ${b} = ?`,ans,[ans,I(-a+b),I(a+b),I(a-b)],'Subtracting a positive moves left on the number line.',`${I(-a)} − ${b} = ${ans}.`);}
    if(mode===13){a=R(2,15);b=R(2,15);ans=I(a+b);return Q(`${a} − (${I(-b)}) = ?`,ans,[ans,I(a-b),I(-(a+b)),I(b-a)],'Subtracting a negative is the same as adding a positive.',`${a} − (${I(-b)}) = ${a} + ${b} = ${ans}.`);}
    if(mode===14){const z=pick([[-1,-1,'positive'],[-1,1,'negative'],[1,-1,'negative'],[1,1,'positive']]);return Q(`What sign will the product have: ${z[0]<0?'negative':'positive'} × ${z[1]<0?'negative':'positive'}?`,z[2],[z[2],z[2]==='positive'?'negative':'positive','zero','cannot tell'],'Same signs give a positive product; different signs give a negative product.',`The product is ${z[2]}.`);}
    if(mode===15){a=R(2,12);b=R(2,12);const s1=Math.random()<.5?-1:1,s2=Math.random()<.5?-1:1,total=s1*a*s2*b;ans=I(total);return Q(`${I(s1*a)} × ${I(s2*b)} = ?`,ans,[ans,I(-total),I(s1*a+s2*b),I(Math.abs(a*b)+1)],'Multiply the sizes first, then use the sign rule.',`${a}×${b}=${a*b}; the signs make the answer ${ans}.`);}
    if(mode===16){const z=pick([[-1,-1,'positive'],[-1,1,'negative'],[1,-1,'negative'],[1,1,'positive']]);return Q(`What sign will the quotient have: ${z[0]<0?'negative':'positive'} ÷ ${z[1]<0?'negative':'positive'}?`,z[2],[z[2],z[2]==='positive'?'negative':'positive','zero','cannot tell'],'Division uses the same sign rule as multiplication.',`The quotient is ${z[2]}.`);}
    if(mode===17){b=R(2,12);c=R(2,12);const s1=Math.random()<.5?-1:1,s2=Math.random()<.5?-1:1;a=s1*s2*b*c;ans=I(s1*c);return Q(`${I(a)} ÷ ${I(s2*b)} = ?`,ans,[ans,I(-s1*c),I(c),I(b)],'Use the multiplication fact and the integer sign rule.',`${I(s1*c)} × ${I(s2*b)} = ${I(a)}, so the quotient is ${ans}.`);}
    if(mode===18){a=R(2,10);b=R(2,10);const product=-(a*b);ans=I(-b);return Q(`${a} × n = ${I(product)}. What is n?`,ans,[ans,I(b),I(-a),I(product)],'Find the missing factor by dividing the product by the known factor.',`${I(product)} ÷ ${a} = ${ans}.`);}
    if(mode===19){a=pick([40,60,80,120]);const terms=[a,-a/2,a/4,-a/8];ans=I(a/16);return Q(`Find the next term: ${terms.map(I).join(', ')}, ?`,ans,[ans,I(-a/16),I(a/8),I(-a/4)],'Each term is divided by −2.',`${I(-a/8)} ÷ (−2) = ${ans}.`);}
    if(mode===20){a=R(2,8);b=R(2,8);c=R(2,8);const total=(-a)*b+c;ans=I(total);return Q(`Evaluate (${I(-a)} × ${b}) + ${c}.`,ans,[ans,I((-a)*(b+c)),I(a*b+c),I((-a)*b-c)],'Use order of operations: multiply before adding.',`${I(-a)}×${b}=${I(-a*b)}; then add ${c} to get ${ans}.`);}
    if(mode===21){a=R(3,15);b=R(2,12);c=R(1,8);const total=-a-b+c;ans=`${I(total)} m`;return Q(`A diver is ${a} m below sea level, descends ${b} m, then rises ${c} m. What is the final position relative to sea level?`,ans,[ans,`${I(-a+b+c)} m`,`${I(a+b-c)} m`,`${I(-a-b-c)} m`],'Below sea level is negative; descending is another negative change; rising is positive.',`${I(-a)} + ${I(-b)} + ${c} = ${I(total)} m.`);}
    if(mode===22){a=R(10,40);b=R(5,25);c=R(4,20);const total=a-b+c;ans=`$${total}`;return Q(`An account starts with $${a}, then $${b} is withdrawn and $${c} is deposited. What is the final balance?`,ans,[ans,`$${a+b+c}`,`$${Math.abs(a-b-c)}`,`$${a-b}`],'Treat a withdrawal as a negative change and a deposit as a positive change.',`${a} + (${I(-b)}) + ${c} = ${total}.`);}
    if(mode===23){const z=pick([
      ['A negative integer is always less than a positive integer.','always'],
      ['A negative integer is greater than 0.','never'],
      ['Two different negative integers can have a sum of 0.','never'],
      ['An integer multiplied by 0 equals 0.','always']
    ]);return Q(`${z[0]} Is this always, sometimes or never true?`,z[1],[z[1],'always','sometimes','never'],'Use the number line and integer operation rules.',`The statement is ${z[1]} true.`);}
  }

  if(window.TY_YEAR5_TESTS){
    window.TY_YEAR5_TESTS.topics=window.TY_YEAR5_TESTS.topics.filter(x=>x[0]!=='integers');
    const i=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='equations');
    window.TY_YEAR5_TESTS.topics.splice(i>=0?i+1:window.TY_YEAR5_TESTS.topics.length-1,0,['integers','±','Integers & Negative Numbers','Positive and negative integers, number lines and signed operations']);
    const oldQuestion=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=function(t){return t==='integers'?topicQuestion():oldQuestion(t)};
  }

  const oldLearn=window.SKILLUP_MATH.learn;
  const oldEnhanced=window.SKILLUP_MATH.enhanced;
  window.SKILLUP_MATH.learn=function(g,t,fallback){
    if(String(g)==='5'&&t==='integers')return{
      title:'Integers & Negative Numbers',
      concept:'Integers are whole numbers, their opposites and zero. Positive integers are to the right of 0 on a number line, negative integers are to the left, and real-life changes such as gains, losses, rises and falls can be represented with signed numbers.',
      steps:[
        'Positive integers are greater than 0, negative integers are less than 0, and 0 is neither positive nor negative. Every integer has an opposite; the opposite of 0 is 0.',
        'Use the number line to compare integers. A number farther to the right is greater. For negative numbers, the value closer to 0 is greater.',
        'To add integers with the same sign, add their distances from 0 and keep the common sign.',
        'To add integers with different signs, subtract the smaller distance from the larger and use the sign of the number farther from 0. Opposites add to 0.',
        'To subtract integers, add the opposite of the number being subtracted. For example, 5 − (−3) becomes 5 + 3.',
        'For multiplication and division, like signs give a positive answer and unlike signs give a negative answer. Any integer multiplied by 0 is 0.',
        'Model real situations carefully: below sea level, losses, withdrawals and temperature falls are negative changes; rises, gains and deposits are positive changes.'
      ],
      examples:[
        {q:'Which is greater: −3 or −8?',steps:['Locate both numbers on a number line.','−3 is farther to the right than −8.'],answer:'−3'},
        {q:'Find −6 + (−4).',steps:['The signs are the same.','Add 6 + 4 = 10.','Keep the negative sign.'],answer:'−10'},
        {q:'Find −9 + 5.',steps:['The signs are different.','Subtract 9 − 5 = 4.','−9 is farther from 0, so keep the negative sign.'],answer:'−4'},
        {q:'Find 7 − (−5).',steps:['Subtracting a negative means add its opposite.','7 + 5 = 12.'],answer:'12'},
        {q:'Find (−4) × (−6).',steps:['Multiply 4 × 6 = 24.','The signs are the same, so the product is positive.'],answer:'24'},
        {q:'A diver is 7 m below sea level and descends 5 m more.',steps:['Start at −7.','Descending 5 m is a change of −5.','−7 + (−5) = −12.'],answer:'−12 m'}
      ],
      mistake:'Do not decide which negative number is greater by looking only at its digits. On a number line, −2 is greater than −9 because −2 is farther to the right. Also remember that subtracting a negative changes to addition.',
      quick:'Think number line first: right is greater, left is smaller. For × and ÷, same signs → positive; different signs → negative.'
    };
    return oldLearn(g,t,fallback);
  };
  window.SKILLUP_MATH.enhanced=function(g,t){return String(g)==='5'&&t==='integers'?topicQuestion():oldEnhanced(g,t);};
})();
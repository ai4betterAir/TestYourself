// Topic 23: Year 5 Rational Numbers & Number Lines.
// Newly written SkillUP material based on the uploaded Grade 5 Rational Numbers enrichment page.
(function(){
  if(!window.SKILLUP_MATH)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const fmt=n=>Number.isInteger(n)?String(n):String(Number(n.toFixed(2)));
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    let k=1;while(rest.length<3){const v=String(k++);if(v!==ans&&!rest.includes(v))rest.push(v);}
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,explanation};
  }
  function frac(n,d){const g=(a,b)=>b?g(b,a%b):Math.abs(a);const h=g(n,d);return `${n/h}/${d/h}`;}
  function question(){
    const m=R(0,19);let a,b,c,ans;
    if(m===0){a=pick([4,-7,0,12,-3]);return Q(`Which statement about ${a} is true?`,'It is a rational number',['It is a rational number','It is not a number','It cannot be placed on a number line','It has no opposite'],'Whole numbers and integers are included among rational numbers.',`${a} is an integer, and integers are rational numbers.`);}
    if(m===1){a=pick([0.5,-1.25,2.75,-0.4,3.2]);return Q(`Which statement about ${a} is true?`,'It is a rational number',['It is a rational number','It is not rational','It cannot have an opposite','It cannot appear on a number line'],'The book includes terminating decimals among rational numbers.',`${a} is a terminating decimal, so it is rational.`);}
    if(m===2){a=pick([[1,2],[-3,4],[5,8],[-7,3],[9,5]]);ans=`${a[0]}/${a[1]}`;return Q(`Which statement about ${ans} is true?`,'It is a rational number',['It is a rational number','It is never rational','It cannot be negative','It cannot be shown on a number line'],'Fractions are part of the rational-number family.',`${ans} is a fraction, so it is rational.`);}
    if(m===3){a=pick([1.1,-2.5,0.75,-4,6.2]);ans=fmt(-a);return Q(`What is the opposite of ${fmt(a)}?`,ans,[ans,fmt(a),fmt(Math.abs(a)),fmt(a+1)],'Opposites are the same distance from 0 on opposite sides.',`The opposite of ${fmt(a)} is ${ans}.`);}
    if(m===4){return Q('What is the opposite of 0?',0,[0,1,-1,'0.5'],'Zero is at the centre of the number line.',`0 is its own opposite.`);}
    if(m===5){a=pick([0.5,1.25,2.5,3.75]);b=-a;ans=fmt(a);return Q(`Which is greater: ${fmt(b)} or ${fmt(a)}?`,ans,[ans,fmt(b),'They are equal','Cannot be determined'],'On a number line, numbers farther right are greater.',`${fmt(a)} is to the right of ${fmt(b)}, so it is greater.`);}
    if(m===6){a=pick([-3.5,-2.25,-1.5,-0.75]);b=pick([0.5,1.25,2,3.5]);const vals=[a,0,b];ans=vals.map(fmt).join(', ');return Q(`Which list is ordered from least to greatest?`,ans,[ans,[b,0,a].map(fmt).join(', '),[0,a,b].map(fmt).join(', '),[a,b,0].map(fmt).join(', ')],'Move from left to right on the number line.',`${fmt(a)} < 0 < ${fmt(b)}.`);}
    if(m===7){a=pick([1.2,2.5,3.4,4.75]);ans=fmt(-a);return Q(`A diver is ${a} km below sea level. Which rational number represents the position?`,ans,[ans,fmt(a),0,fmt(-a+1)],'Below sea level is represented by a negative number.',`${a} km below sea level is ${ans} km.`);}
    if(m===8){a=pick([12.5,20.5,35.75,48.25]);ans=fmt(a);return Q(`A bank account receives a deposit of $${a.toFixed(2)}. Which rational number represents the change?`,ans,[ans,fmt(-a),0,fmt(a+1)],'A deposit is a positive change.',`The change is +${ans}.`);}
    if(m===9){a=pick([4.5,7.25,9.5,12.75]);ans=fmt(-a);return Q(`A business records a loss of $${a.toFixed(2)}. Which rational number represents the change?`,ans,[ans,fmt(a),0,fmt(-a-1)],'A loss is represented by a negative number.',`The change is ${ans}.`);}
    if(m===10){a=pick([-2.5,-1.5,-0.5,0.5,1.5,2.5]);ans=fmt(-a);return Q(`${fmt(a)} and which number are opposites?`,ans,[ans,fmt(a),0,fmt(a+1)],'Opposites add to 0.',`${fmt(a)} + ${ans} = 0.`);}
    if(m===11){a=pick([[-3,4],[-1,2],[1,4],[3,4],[5,4]]);const v=a[0]/a[1],other=v+0.5;ans=fmt(v);return Q(`Which number is farther left on a number line: ${ans} or ${fmt(other)}?`,ans,[ans,fmt(other),'They are at the same point','Cannot be shown'],'The farther-left number is the smaller number.',`${ans} < ${fmt(other)}, so ${ans} is farther left.`);}
    if(m===12){a=pick([0.2,0.4,0.6,0.8]);ans=fmt(-a);return Q(`A point is ${a} unit to the left of 0. What coordinate does it have?`,ans,[ans,fmt(a),0,fmt(-a-1)],'Left of zero means negative.',`The point is at ${ans}.`);}
    if(m===13){a=R(1,5);b=pick([0.25,0.5,0.75]);ans=fmt(-(a+b));return Q(`A lift is ${a+b} floors below the reference level. Which rational number represents this?`,ans,[ans,fmt(a+b),fmt(-a),fmt(-b)],'Below the reference level is negative.',`${a+b} below is represented by ${ans}.`);}
    if(m===14){a=pick([0.25,0.5,0.75,1.25]);b=-a;ans='0';return Q(`What number lies exactly halfway between ${fmt(b)} and ${fmt(a)}?`,ans,[ans,fmt(a),fmt(b),fmt(a/2)],'Opposite numbers are equally far from 0.',`The midpoint of opposites ${fmt(b)} and ${fmt(a)} is 0.`);}
    if(m===15){a=pick([0.3,0.6,1.2,1.8,2.4]);ans=fmt(Math.abs(a));return Q(`How far is ${fmt(-a)} from 0 on a number line?`,ans,[ans,fmt(-a),0,fmt(a+1)],'Distance is non-negative.',`${fmt(-a)} is ${ans} units from 0.`);}
    if(m===16){a=pick([[1,2],[3,4],[5,2],[7,4]]);const v=a[0]/a[1];ans=fmt(v);return Q(`Which decimal is at the same point as ${a[0]}/${a[1]} on a number line?`,ans,[ans,fmt(v+0.25),fmt(-v),fmt(v+1)],'A fraction and its equivalent decimal name the same rational number.',`${a[0]}/${a[1]} = ${ans}.`);}
    if(m===17){a=pick([0.25,0.5,0.75,1.5,2.25]);ans=frac(Math.round(a*4),4);return Q(`Which fraction represents the same rational number as ${a}?`,ans,[ans,'1/3','2/5','3/5'],'Write the terminating decimal as an equivalent fraction.',`${a} = ${ans}.`);}
    if(m===18){a=pick([-2.5,-1.25,-0.75,0.5,1.75]);b=pick([-2,-1,0,1,2]);c=pick([0.25,0.75,1.5,2.5]);const vals=[a,b,c].sort((x,y)=>y-x);ans=vals.map(fmt).join(', ');return Q(`Which list orders these rational numbers from greatest to least: ${[a,b,c].map(fmt).join(', ')}?`,ans,[ans,[...vals].reverse().map(fmt).join(', '),[b,a,c].map(fmt).join(', '),[c,a,b].map(fmt).join(', ')],'Use their positions on the number line.',`${ans} is the greatest-to-least order.`);}
    a=pick([-3.5,-2.5,-1.5,1.5,2.5,3.5]);ans=fmt(-a);return Q(`A rational number and its opposite have a total of 0. If one number is ${fmt(a)}, what is the other?`,ans,[ans,fmt(a),0,fmt(a*2)],'Opposites cancel each other.',`${fmt(a)} + ${ans} = 0.`);
  }
  if(window.TY_YEAR5_TESTS){
    window.TY_YEAR5_TESTS.topics=window.TY_YEAR5_TESTS.topics.filter(x=>x[0]!=='rational_numbers');
    const i=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='logic_venn');
    window.TY_YEAR5_TESTS.topics.splice(i>=0?i+1:window.TY_YEAR5_TESTS.topics.length,0,['rational_numbers','ℚ','Rational Numbers & Number Lines','Positive and negative rational numbers, opposites, fractions, decimals and number-line reasoning']);
    const oldQ=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=t=>t==='rational_numbers'?question():oldQ(t);
  }
  const oldLearn=window.SKILLUP_MATH.learn,oldEnhanced=window.SKILLUP_MATH.enhanced;
  window.SKILLUP_MATH.learn=function(g,t,fallback){
    if(String(g)==='5'&&t==='rational_numbers')return{
      title:'Rational Numbers & Number Lines',
      concept:'The book extends integer ideas to rational numbers. Whole numbers, integers and fractions are rational numbers, and terminating or repeating decimals can also be rational. Rational numbers have opposites and can be placed on a number line.',
      steps:[
        'Use positive numbers for gains, deposits, upward movement and positions above a reference level.',
        'Use negative numbers for losses, downward movement and positions below a reference level.',
        'Whole numbers, integers and fractions are rational numbers. The book also includes terminating and repeating decimals.',
        'The opposite of a number is the same distance from 0 but on the other side of the number line.',
        'Zero is its own opposite.',
        'On a number line, numbers increase as you move to the right and decrease as you move to the left.',
        'Equivalent fractions and decimals can represent the same rational-number point.'
      ],
      examples:[
        {q:'Represent 2.5 km underwater.',steps:['Underwater means below the reference level.','Below is negative.'],answer:'−2.5'},
        {q:'What is the opposite of −1.1?',steps:['Move the same distance to the other side of 0.'],answer:'1.1'},
        {q:'Which is greater: −0.5 or 0.25?',steps:['−0.5 is left of 0.','0.25 is right of 0.'],answer:'0.25'},
        {q:'Where do 1/2 and 0.5 appear on a number line?',steps:['1/2 = 0.5.','Equivalent forms name the same rational number.'],answer:'At the same point'}
      ]
    };
    return oldLearn(g,t,fallback);
  };
  window.SKILLUP_MATH.enhanced=function(g,t){if(String(g)==='5'&&t==='rational_numbers')return question();return oldEnhanced(g,t);};
})();
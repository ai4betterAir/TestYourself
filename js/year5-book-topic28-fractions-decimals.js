// Topic 28: Year 5 Fractions to Decimals.
(function(){
  if(!window.SKILLUP_MATH)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);
    let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);
    rest=shuffle(rest).slice(0,3);
    let k=1;while(rest.length<3){const v=String(k++/10);if(v!==ans&&!rest.includes(v))rest.push(v);}
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,explanation};
  }
  const term=[
    ['1/2','0.5'],['1/4','0.25'],['3/4','0.75'],['1/5','0.2'],['2/5','0.4'],
    ['1/8','0.125'],['3/8','0.375'],['5/8','0.625'],['7/8','0.875'],
    ['7/20','0.35'],['6/25','0.24'],['49/50','0.98'],['7/40','0.175']
  ];
  const repeat=[
    ['1/3','0.333…'],['2/3','0.666…'],['1/9','0.111…'],['2/9','0.222…'],
    ['3/11','0.2727…'],['4/11','0.3636…'],['5/11','0.4545…']
  ];
  function question(){
    const m=R(0,15);let p,ans;
    if(m===0){p=pick(term);return Q('Rename '+p[0]+' as a decimal.',p[1],[p[1],String(Number(p[1])+0.1),String(Math.max(0,Number(p[1])-0.1)),String(Math.min(1,Number(p[1])+0.2))],'A fraction bar means division, so divide the numerator by the denominator.',p[0]+' = '+p[1]+'.');}
    if(m===1){p=pick([['1/2','5/10','0.5'],['1/4','25/100','0.25'],['3/4','75/100','0.75'],['2/5','4/10','0.4'],['7/20','35/100','0.35']]);return Q('Which power-of-10 fraction helps rename '+p[0]+' as a decimal?',p[1],[p[1],p[0],'1/10','10/100'],'Rename the fraction so the denominator is 10, 100, 1000, and so on.',p[0]+' = '+p[1]+' = '+p[2]+'.');}
    if(m===2){p=pick(repeat);return Q('Rename '+p[0]+' as a decimal.',p[1],[p[1],p[1].replace('…',''), '0.5','1.0'],'Divide numerator by denominator and watch for a repeating remainder pattern.',p[0]+' = '+p[1]+'; the digits continue repeating.');}
    if(m===3){p=pick(term);return Q(p[0]+' gives '+p[1]+'. Is this decimal terminating or repeating?','terminating',['terminating','repeating','whole number only','not a decimal'],'A terminating decimal ends because the division remainder becomes 0.',p[1]+' ends, so it is terminating.');}
    if(m===4){p=pick(repeat);return Q(p[0]+' gives '+p[1]+'. Is this decimal terminating or repeating?','repeating',['terminating','repeating','whole number only','not rational'],'A repeating decimal has digits that repeat indefinitely.',p[1]+' repeats indefinitely.');}
    if(m===5)return Q('What does the fraction bar in a/b mean?','division',['division','addition','multiplication','rounding'],'Read a/b as a divided by b.','A fraction can be renamed as a decimal by dividing a by b.');
    if(m===6)return Q('Which number is a power of 10?','1000',['1000','250','75','12'],'The book lists 1, 10, 100, 1000, … as powers of 10.','1000 is a power of 10.');
    if(m===7){p=pick([['5/10','0.5'],['25/100','0.25'],['75/100','0.75'],['375/1000','0.375'],['4/10','0.4']]);return Q('Rename '+p[0]+' as a decimal.',p[1],[p[1],String(Number(p[1])*10),String(Number(p[1])/10),'1.0'],'A decimal is another way to write a fraction with denominator 10, 100, 1000, and so on.',p[0]+' = '+p[1]+'.');}
    if(m===8){p=pick([['3/8','3 ÷ 8'],['2/5','2 ÷ 5'],['1/9','1 ÷ 9'],['3/11','3 ÷ 11']]);return Q('Which division renames '+p[0]+' as a decimal?',p[1],[p[1],p[1].split(' ÷ ').reverse().join(' ÷ '),'3 + 8','8 − 3'],'The numerator is the dividend and the denominator is the divisor.',p[0]+' means '+p[1]+'.');}
    if(m===9){p=pick(term);return Q('Which statement is true?',[p[0],p[1]].join(' = '),[[p[0],p[1]].join(' = '),p[0]+' > '+p[1],p[0]+' < '+p[1],p[0]+' is not a decimal equivalent'].join('|').split('|'),'Equivalent forms represent the same number.',p[0]+' and '+p[1]+' are equivalent.');}
    if(m===10){p=pick([['1/8','0.125'],['3/8','0.375'],['5/8','0.625'],['7/8','0.875']]);ans=p[0];return Q('Which fraction is equivalent to '+p[1]+'?',ans,[ans,'1/4','2/5','3/5'],'Match the decimal to the result of numerator ÷ denominator.',p[1]+' = '+ans+'.');}
    if(m===11){p=pick(repeat);return Q('Which decimal has a repeating digit pattern?',p[1],[p[1],'0.25','0.4','0.875'],'Look for digits that continue in the same cycle.',p[1]+' has a repeating pattern.');}
    if(m===12){p=pick([['1/3','3'],['2/3','6'],['1/9','1'],['2/9','2']]);return Q('In the decimal for '+p[0]+', which digit repeats?',p[1],[p[1],'0','5','9'],'Carry out the division and identify the recurring digit.',p[0]+' = 0.'+p[1]+p[1]+p[1]+'…');}
    if(m===13){p=pick([['3/11','27'],['4/11','36'],['5/11','45']]);return Q('In the decimal for '+p[0]+', which two-digit block repeats?',p[1],[p[1],p[1].split('').reverse().join(''),'11','00'],'The same block repeats again and again.',p[0]+' has repeating block '+p[1]+'.');}
    if(m===14)return Q('When long division gives a remainder of 0, what kind of decimal results?','terminating',['terminating','repeating','negative','irrational'],'The book states that a terminating decimal results when the remainder is 0.','Remainder 0 means the decimal ends.');
    return Q('When digits repeat indefinitely from some point onward, what kind of decimal is it?','repeating decimal',['repeating decimal','terminating decimal','whole number','mixed number'],'Look for an endless recurring digit pattern.','That is the definition of a repeating decimal used in the book.');
  }
  if(window.TY_YEAR5_TESTS){
    window.TY_YEAR5_TESTS.topics=window.TY_YEAR5_TESTS.topics.filter(x=>x[0]!=='fractions_decimals');
    const i=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='unit_fractions');
    window.TY_YEAR5_TESTS.topics.splice(i>=0?i+1:window.TY_YEAR5_TESTS.topics.length,0,['fractions_decimals','0.5','Fractions to Decimals','Rename fractions as terminating or repeating decimals using powers of 10 or division']);
    const oldQ=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=t=>t==='fractions_decimals'?question():oldQ(t);
  }
  const oldLearn=window.SKILLUP_MATH.learn,oldEnhanced=window.SKILLUP_MATH.enhanced;
  window.SKILLUP_MATH.learn=function(g,t,fallback){
    if(String(g)==='5'&&t==='fractions_decimals')return{
      title:'Fractions to Decimals',
      concept:'Every fraction can be renamed as a decimal. The book shows two methods: use an equivalent fraction with a power-of-10 denominator, or divide the numerator by the denominator.',
      steps:[
        'A fraction bar means division: a/b means a ÷ b.',
        'For some fractions, first rename the fraction with denominator 10, 100, 1000, and so on, then write the matching decimal.',
        'You can always use division: numerator ÷ denominator.',
        'A terminating decimal ends when the division remainder becomes 0.',
        'A repeating decimal has a digit or block of digits that repeats indefinitely.'
      ],
      examples:[
        {q:'Rename 3/8 as a decimal.',steps:['Use division: 3 ÷ 8.','The quotient is 0.375.','The remainder becomes 0, so the decimal terminates.'],answer:'0.375'},
        {q:'Rename 2/5 using a power of 10.',steps:['2/5 = 4/10.','4/10 = 0.4.'],answer:'0.4'},
        {q:'Rename 3/11 as a decimal.',steps:['Use 3 ÷ 11.','The digits 27 repeat.'],answer:'0.2727…'}
      ]
    };
    return oldLearn(g,t,fallback);
  };
  window.SKILLUP_MATH.enhanced=function(g,t){if(String(g)==='5'&&t==='fractions_decimals')return question();return oldEnhanced(g,t);};
})();
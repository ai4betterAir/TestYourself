// Topic 21: Year 5 Number Systems & Enrichment.
// Newly written SkillUP material based on the uploaded Grade 5 Roman numerals and enrichment sections.
(function(){
  if(!window.SKILLUP_MATH)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    let k=1;while(rest.length<3){const v=String(k++);if(v!==ans&&!rest.includes(v))rest.push(v);}
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,explanation};
  }
  const romanMap=[['M',1000],['CM',900],['D',500],['CD',400],['C',100],['XC',90],['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]];
  function toRoman(n){let s='';for(const [r,v] of romanMap){while(n>=v){s+=r;n-=v;}}return s;}
  function fromRoman(s){let total=0;for(let i=0;i<s.length;i++){const a={I:1,V:5,X:10,L:50,C:100,D:500,M:1000}[s[i]],b={I:1,V:5,X:10,L:50,C:100,D:500,M:1000}[s[i+1]]||0;total+=a<b?-a:a;}return total;}
  const tri=n=>n*(n+1)/2;
  function pascalRow(n){let row=[1];for(let k=1;k<=n;k++)row.push(row[k-1]*(n-k+1)/k);return row.map(Math.round);}
  function sci(n){let e=Math.floor(Math.log10(n)),c=n/10**e;return `${Number(c.toFixed(3))} × 10^${e}`;}
  function question(){
    const m=R(0,19);let n,a,b,ans,row;
    if(m===0){const set=pick([['I',1],['V',5],['X',10],['L',50],['C',100],['D',500],['M',1000]]);return Q(`What value does the Roman numeral ${set[0]} represent?`,set[1],[set[1],set[1]*5,Math.max(1,set[1]/5),set[1]*10],'Match the Roman symbol to its value.',`${set[0]} represents ${set[1]}.`);}
    if(m===1){n=R(11,3999);ans=toRoman(n);return Q(`Write ${n} as a Roman numeral.`,ans,[ans,toRoman(Math.max(1,n-1)),toRoman(Math.min(3999,n+1)),toRoman(Math.max(1,n-10))],'Build the number from thousands, hundreds, tens and ones.',`${n} is written ${ans}.`);}
    if(m===2){n=R(20,3999);const r=toRoman(n);return Q(`Write ${r} as a standard number.`,n,[n,n+10,Math.max(1,n-10),n+100],'Read left to right. A smaller symbol before a larger one is subtracted.',`${r} = ${n}.`);}
    if(m===3){const set=pick([['IV',4],['IX',9],['XL',40],['XC',90],['CD',400],['CM',900]]);return Q(`Which standard number matches ${set[0]}?`,set[1],[set[1],set[1]+10,set[1]-1,set[1]+100],'A smaller Roman numeral before a larger one means subtract.',`${set[0]} = ${set[1]}.`);}
    if(m===4){n=pick([4000,5000,7000,9000,12000,25000,48000,73000,96000,125000,340000,780000]);ans=sci(n);return Q(`Which is ${n.toLocaleString()} in scientific notation?`,ans,[ans,`${n} × 10^1`,`${Number((n/100).toFixed(2))} × 10^2`,`${Number((n/1000).toFixed(2))} × 10^2`],'The first factor must be at least 1 but less than 10.',`${n.toLocaleString()} = ${ans}.`);}
    if(m===5){const e=R(2,8),c=pick([2,3,4,5,6,7,8,9]);n=c*10**e;ans=n.toLocaleString();return Q(`What standard number is ${c} × 10^${e}?`,ans,[ans,(c*10**(e-1)).toLocaleString(),(c*10**(e+1)).toLocaleString(),String(c+e)],`10^${e} is 1 followed by ${e} zeros.`,`${c} × 10^${e} = ${ans}.`);}
    if(m===6){n=pick([10,100,1000,10000,100000,1000000,10000000]);const e=Math.round(Math.log10(n));return Q(`${n.toLocaleString()} = 10 to what power?`,e,[e,e-1,e+1,n.toString().length],'Count the zeros after 1.',`${n.toLocaleString()} has ${e} zeros, so it is 10^${e}.`);}
    if(m===7){const c=pick([1.2,2.5,3.4,4.8,5.6,7.2,8.9]),e=R(3,6);n=c*10**e;return Q(`In ${c} × 10^${e}, which number is the exponent?`,e,[e,c,10,n],'The exponent is the small number attached to the power of 10.',`The exponent is ${e}.`);}
    if(m===8){n=R(4,10);ans=n*n;return Q(`What is the ${n}th square number?`,ans,[ans,n*2,tri(n),ans+n],'Square numbers can be arranged in an n by n square.',`${n} × ${n} = ${ans}.`);}
    if(m===9){n=R(4,10);ans=tri(n);return Q(`The triangular numbers begin 1, 3, 6, 10, 15, ... What is the ${n}th triangular number?`,ans,[ans,n*n,tri(n-1),tri(n+1)],'Each triangular number adds the next whole number.',`Add 1+2+...+${n} to get ${ans}.`);}
    if(m===10){n=R(3,8);const seq=[1,4,9,16,25,36,49,64,81];ans=seq[n];return Q(`What comes next in this square-number pattern: ${seq.slice(Math.max(0,n-3),n+1).join(', ')}, ?`,ans,[ans,ans+1,ans+n,tri(n+1)],'Square numbers are 1², 2², 3², 4², ...',`The next square is ${(n+1)}² = ${ans}.`);}
    if(m===11){const seq=[1,3,6,10,15,21,28,36,45,55];n=R(3,7);ans=seq[n+1];return Q(`Continue the triangular-number pattern: ${seq.slice(n-2,n+1).join(', ')}, ?`,ans,[ans,seq[n]+2,seq[n]*2,(n+2)**2],'The amount added increases by 1 each time.',`${seq[n]} + ${n+2} = ${ans}.`);}
    if(m===12){n=R(2,6);row=pascalRow(n);const k=R(1,row.length-2);ans=row[k];return Q(`In Pascal's Triangle, row ${n} is ${row.map((v,i)=>i===k?'?':v).join(', ')}. What is missing?`,ans,[ans,ans+1,Math.max(1,ans-1),row[k-1]+row[k+1]],'Each interior number is the sum of the two numbers directly above it.',`The missing value is ${ans}.`);}
    if(m===13){n=R(1,8);ans=n+1;return Q(`How many numbers are in row ${n} of Pascal's Triangle if row 0 has one number?`,ans,[ans,n,n+2,2*n],'The rows grow by one entry each time.',`Row ${n} contains ${n+1} numbers.`);}
    if(m===14){n=R(1,7);row=pascalRow(n);ans=row.reduce((x,y)=>x+y,0);return Q(`What is the sum of the numbers in row ${n} of Pascal's Triangle: ${row.join(', ')}?`,ans,[ans,ans/2,ans+n,row.length],'Add all entries in the row.',`${row.join(' + ')} = ${ans}.`);}
    if(m===15){n=R(2,7);row=pascalRow(n);return Q(`What is always true about the first and last numbers in a row of Pascal's Triangle?`,'They are both 1',['They are both 1','They are both the row number','They are always even','They are always equal to 0'],'Look at the outer edge of the triangle.','Each row begins and ends with 1.');}
    if(m===16){const a=R(2,8),b=R(2,8);ans=a+b;return Q(`In Pascal's Triangle, two adjacent numbers in one row are ${a} and ${b}. What number appears directly below them between their positions?`,ans,[ans,a*b,Math.abs(a-b),a+b+1],'Every interior number is the sum of the two numbers directly above it.',`${a}+${b}=${ans}.`);}
    if(m===17){n=pick([25,36,49,64,81,100]);ans='square number';return Q(`${n} can be arranged as an equal-sided square array. What type of number is it?`,ans,[ans,'triangular number only','prime number','Roman numeral'],'Square numbers form compact square arrays.',`${n} is a square number.`);}
    if(m===18){const options=[10,15,21,28,36,45];n=pick(options);ans='triangular number';return Q(`${n} appears in the pattern 1, 3, 6, 10, 15, 21, ... What type of pattern number is it?`,ans,[ans,'Roman numeral','scientific notation','prime number'],'Triangular numbers are formed by adding consecutive whole numbers.',`${n} is a triangular number.`);}
    n=pick([2024,2025,2030,2050,1999,1886]);ans=toRoman(n);return Q(`A building displays the year ${n}. Which Roman numeral should it show?`,ans,[ans,toRoman(n-1),toRoman(n+1),toRoman(Math.max(1,n-10))],'Convert thousands, hundreds, tens and ones separately.',`${n} = ${ans}.`);
  }
  if(window.TY_YEAR5_TESTS){
    window.TY_YEAR5_TESTS.topics=window.TY_YEAR5_TESTS.topics.filter(x=>x[0]!=='number_enrichment');
    const i=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='powers');
    window.TY_YEAR5_TESTS.topics.splice(i>=0?i+1:window.TY_YEAR5_TESTS.topics.length-1,0,['number_enrichment','∞','Number Systems & Enrichment','Roman numerals, scientific notation, triangular and square numbers, and Pascal’s Triangle']);
    const oldQ=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=t=>t==='number_enrichment'?question():oldQ(t);
  }
  const oldLearn=window.SKILLUP_MATH.learn,oldEnhanced=window.SKILLUP_MATH.enhanced;
  window.SKILLUP_MATH.learn=function(g,t,fallback){
    if(String(g)==='5'&&t==='number_enrichment')return{
      title:'Number Systems & Enrichment',
      concept:'This topic explores four enrichment ideas from the Grade 5 book: Roman numerals, scientific notation, triangular and square number patterns, and Pascal’s Triangle.',
      steps:[
        'Roman numerals use I, V, X, L, C, D and M. Add values when a smaller or equal symbol follows a larger one; subtract when a smaller symbol comes before a larger symbol.',
        'Common subtractive pairs include IV = 4, IX = 9, XL = 40, XC = 90, CD = 400 and CM = 900.',
        'Scientific notation writes a large number as a number from 1 up to but not including 10 multiplied by a power of 10.',
        'A power of 10 links the exponent to the number of zeros: 10² = 100, 10³ = 1,000, and so on.',
        'Square numbers form square arrays: 1, 4, 9, 16, 25, ... . Triangular numbers form triangular arrays: 1, 3, 6, 10, 15, ... .',
        'In Pascal’s Triangle, each row starts and ends with 1. Every interior number is found by adding the two numbers directly above it.',
        'Use tables and visible patterns to extend triangular, square and Pascal patterns carefully.'
      ],
      examples:[
        {q:'Write XLIV as a standard number.',steps:['XL = 50 − 10 = 40.','IV = 5 − 1 = 4.','40 + 4 = 44.'],answer:'44'},
        {q:'Write 93,000,000 in scientific notation.',steps:['Move the decimal so the first factor is between 1 and 10.','93,000,000 becomes 9.3.','The decimal moved 7 places, so use 10⁷.'],answer:'9.3 × 10⁷'},
        {q:'Continue the triangular numbers 1, 3, 6, 10, 15, ...',steps:['The added amounts are 2, 3, 4, 5.','Add 6 next.'],answer:'21'},
        {q:'Find the missing Pascal value: 1, 4, ?, 4, 1.',steps:['The row is built by adding neighbouring values from the row above.','The middle value is 6.'],answer:'6'}
      ]
    };
    return oldLearn(g,t,fallback);
  };
  window.SKILLUP_MATH.enhanced=function(g,t){if(String(g)==='5'&&t==='number_enrichment')return question();return oldEnhanced(g,t);};
})();
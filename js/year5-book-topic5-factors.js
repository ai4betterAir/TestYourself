// Topic 5 upgrade: Year 5 Factors, Primes, GCF & LCM.
// Newly written SkillUP material covering the Year 5 curriculum and problem-solving style.
(function(){
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const fmt=n=>Number(n).toLocaleString('en-AU');
  const factors=n=>{const out=[];for(let i=1;i<=n;i++)if(n%i===0)out.push(i);return out};
  const isPrime=n=>n>1&&factors(n).length===2;
  const gcd=(a,b)=>b?gcd(b,a%b):a;
  const gcdAll=a=>a.reduce((x,y)=>gcd(x,y));
  const lcm=(a,b)=>a/gcd(a,b)*b;
  const lcmAll=a=>a.reduce((x,y)=>lcm(x,y));
  function primeFactors(n){const out=[];let p=2,x=n;while(x>1){while(x%p===0){out.push(p);x/=p}p++}return out}
  function primeText(n){const f=primeFactors(n),c={};f.forEach(x=>c[x]=(c[x]||0)+1);return Object.entries(c).map(([p,e])=>e===1?p:`${p}^${e}`).join(' × ')}
  function Q(text,answer,choices,tip,explanation){const ans=String(answer);let c=uniq((choices||[]).map(String));if(!c.includes(ans))c.unshift(ans);return{text,answer:ans,choices:shuffle(c).slice(0,4),tip,explanation}}
  function topicQuestion(){
    const mode=R(0,18);let n,a,b,c,ans,arr;
    if(mode===0){
      n=pick([12,18,20,24,30,36,42,48]);arr=factors(n);ans=arr.join(', ');
      return Q(`Which list contains all the factors of ${n}?`,ans,[ans,arr.filter(x=>x!==arr[arr.length-2]).join(', '),`1, ${n}`,arr.slice(0,-1).join(', ')],'A factor divides the number exactly with no remainder.',`The factors of ${n} are ${ans}.`);
    }
    if(mode===1){
      n=pick([18,24,28,30,36,40,45,48]);arr=factors(n);a=pick(arr.filter(x=>x>1&&x<n));b=n/a;ans=`${Math.min(a,b)} × ${Math.max(a,b)}`;
      return Q(`Which factor pair makes ${n}?`,ans,[ans,`${Math.min(a,b)} + ${Math.max(a,b)}`,`${Math.min(a,b)+1} × ${Math.max(1,b-1)}`,`1 × ${n-1}`],'A factor pair must multiply exactly to the target number.',`${a} × ${b} = ${n}.`);
    }
    if(mode===2){
      n=pick([2,3,5,7,11,13,17,19,23,29,31,37,41,43,47]);
      return Q(`Which statement about ${n} is true?`,'It is prime',['It is prime','It is composite','It has exactly 3 factors','It is a multiple of 10'],'A prime number greater than 1 has exactly two factors: 1 and itself.',`${n} has only factors 1 and ${n}, so it is prime.`);
    }
    if(mode===3){
      n=pick([4,6,8,9,10,12,14,15,16,18,20,21,25,27,28,30]);
      return Q(`Which statement about ${n} is true?`,'It is composite',['It is composite','It is prime','It has only one factor','It is neither prime nor composite'],'A composite number greater than 1 has more than two factors.',`${n} has more than two factors, so it is composite.`);
    }
    if(mode===4){
      return Q('How should the number 1 be classified?','Neither prime nor composite',['Neither prime nor composite','Prime','Composite','Both prime and composite'],'Prime numbers have exactly 2 factors; composite numbers have more than 2.','The number 1 has only one factor, so it is neither prime nor composite.');
    }
    if(mode===5){
      n=pick([12,18,20,24,30,36,40,42,48,60]);ans=factors(n).length;
      return Q(`How many positive factors does ${n} have?`,ans,[ans,ans-1,ans+1,2],'List factor pairs carefully; each pair usually gives two factors.',`${n} has factors ${factors(n).join(', ')}, so it has ${ans} positive factors.`);
    }
    if(mode===6){
      n=pick([24,28,36,40,48,50,54,60,72,75,84,90,96,108]);ans=primeText(n);
      return Q(`Which is the prime factorisation of ${n}?`,ans,[ans,`${n} × 1`,factors(n).slice(1,4).join(' × '),primeText(n*2)],'Break the number into factors until every factor is prime.',`${n} = ${ans}.`);
    }
    if(mode===7){
      const base=pick([2,3,5,7]),exp=pick([2,3,4]);ans=Array(exp).fill(base).reduce((x,y)=>x*y,1);
      return Q(`What does ${base}^${exp} mean?`,Array(exp).fill(base).join(' × '),[Array(exp).fill(base).join(' × '),`${base} × ${exp}`,`${exp} × ${exp}`,String(ans)],'The exponent tells how many times the base is used as a factor.',`${base}^${exp} = ${Array(exp).fill(base).join(' × ')} = ${ans}.`);
    }
    if(mode===8){
      [a,b]=pick([[12,18],[16,24],[18,30],[20,28],[24,36],[32,48],[36,54],[40,60]]);ans=gcd(a,b);
      return Q(`What is the greatest common factor (GCF) of ${a} and ${b}?`,ans,[ans,1,ans*2,Math.max(1,ans/2)],'List the factors of both numbers and choose the greatest one they share.',`Common factors include ${factors(a).filter(x=>b%x===0).join(', ')}. The greatest is ${ans}.`);
    }
    if(mode===9){
      [a,b,c]=pick([[12,18,24],[16,28,32],[18,30,42],[20,30,50],[24,36,60]]);ans=gcdAll([a,b,c]);
      return Q(`What is the GCF of ${a}, ${b}, and ${c}?`,ans,[ans,1,ans*2,Math.max(1,ans/2)],'A common factor must divide all three numbers exactly.',`The greatest number that divides ${a}, ${b}, and ${c} is ${ans}.`);
    }
    if(mode===10){
      [a,b]=pick([[4,6],[6,8],[8,12],[9,12],[10,15],[12,18],[14,21],[15,20]]);ans=lcm(a,b);
      return Q(`What is the least common multiple (LCM) of ${a} and ${b}?`,ans,[ans,a*b,Math.max(a,b),gcd(a,b)],'List multiples of both numbers until the first common one appears.',`The first shared non-zero multiple is ${ans}.`);
    }
    if(mode===11){
      [a,b,c]=pick([[2,3,6],[3,4,6],[4,6,8],[5,6,10],[6,8,12],[3,5,10]]);ans=lcmAll([a,b,c]);
      return Q(`What is the LCM of ${a}, ${b}, and ${c}?`,ans,[ans,a*b*c,Math.max(a,b,c),gcdAll([a,b,c])],'Find the smallest number that is a multiple of all three numbers.',`${ans} is divisible by ${a}, ${b}, and ${c}.`);
    }
    if(mode===12){
      a=pick([6,8,9,10,12]);b=pick([8,12,15,18,20]);ans=lcm(a,b);
      return Q(`One light flashes every ${a} seconds and another every ${b} seconds. If they flash together now, after how many seconds will they next flash together?`,ans,[ans,a+b,a*b,gcd(a,b)],'“Together again” is an LCM situation.',`The first common multiple of ${a} and ${b} is ${ans}.`);
    }
    if(mode===13){
      [a,b]=pick([[16,28],[18,24],[20,30],[24,36],[32,48],[36,60]]);ans=gcd(a,b);
      return Q(`A teacher has ${a} red counters and ${b} blue counters. She wants equal-size groups of each colour with none left over. What is the greatest number of counters she can put in each group?`,ans,[ans,lcm(a,b),Math.min(a,b),1],'“Greatest equal group size with none left over” means GCF.',`GCF(${a}, ${b}) = ${ans}.`);
    }
    if(mode===14){
      n=pick([13,17,19,23,29,31]);ans='1 and '+n;
      return Q(`What are the only positive factors of the prime number ${n}?`,ans,[ans,`1, 2 and ${n}`,`2 and ${n}`,`1 only`],'A prime number has exactly two positive factors.',`The only factors are 1 and ${n}.`);
    }
    if(mode===15){
      [a,b]=pick([[6,8],[8,12],[9,15],[10,14],[12,18],[15,25]]);ans=gcd(a,b)*lcm(a,b);
      return Q(`For ${a} and ${b}, what is GCF × LCM?`,ans,[ans,a+b,Math.abs(a-b),lcm(a,b)],'For two positive whole numbers, GCF × LCM equals their product.',`${gcd(a,b)} × ${lcm(a,b)} = ${ans}, which also equals ${a} × ${b}.`);
    }
    if(mode===16){
      n=pick([18,24,30,36,42,48]);const fs=factors(n);a=pick(fs.filter(x=>x>1&&x<n));ans=n/a;
      return Q(`□ × ${a} = ${n}. What is the missing factor?`,ans,[ans,a,n,Math.max(1,ans-1)],'Use division to find the partner in the factor pair.',`${n} ÷ ${a} = ${ans}.`);
    }
    if(mode===17){
      n=pick([30,42,60,70,84,90]);arr=primeFactors(n);ans=arr.filter((x,i)=>arr.indexOf(x)===i).join(', ');
      return Q(`Which list shows the distinct prime factors of ${n}?`,ans,[ans,factors(n).slice(0,3).join(', '),`1, ${n}`,arr.join(', ')],'Prime factors are prime numbers that multiply to make the original number.',`${n} = ${primeText(n)}, so its distinct prime factors are ${ans}.`);
    }
    [a,b]=pick([[6,9],[8,12],[10,15],[12,16],[14,21],[18,24]]);ans=lcm(a,b);
    return Q(`Which number is the smallest positive number divisible by both ${a} and ${b}?`,ans,[ans,gcd(a,b),a*b,Math.max(a,b)],'The smallest shared multiple is the LCM.',`LCM(${a}, ${b}) = ${ans}.`);
  }

  if(window.TY_YEAR5_TESTS){
    const row=window.TY_YEAR5_TESTS.topics?.find(x=>x[0]==='factors');
    if(row){row[1]='ƒ';row[2]='Factors, Primes, GCF & LCM';row[3]='Factors, prime/composite numbers, prime factorisation, GCF and LCM';}
    const oldQuestion=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=function(t){return t==='factors'?topicQuestion():oldQuestion(t)};
  }

  if(window.SKILLUP_MATH){
    const oldLearn=window.SKILLUP_MATH.learn;
    const oldEnhanced=window.SKILLUP_MATH.enhanced;
    window.SKILLUP_MATH.learn=function(g,t,fallback){
      if(String(g)==='5'&&t==='factors'){
        return {
          title:'Factors, Primes, GCF & LCM',
          concept:'Factors multiply to make a number. Prime numbers have exactly two factors, while composite numbers have more than two. Factor trees break composite numbers into prime factors. GCF finds the greatest factor shared by numbers; LCM finds the smallest positive multiple they share.',
          steps:[
            'Find factors in pairs: if a × b = n, then a and b are factors of n.',
            'A prime number is greater than 1 and has exactly two factors: 1 and itself. The number 1 is neither prime nor composite.',
            'Use a factor tree to keep splitting a composite number until every branch ends in a prime number.',
            'For GCF, list the factors of each number, identify the common factors, then choose the greatest one.',
            'For LCM, list multiples of each number and choose the first positive multiple they share.',
            'Use GCF for greatest equal grouping with nothing left over; use LCM for events or patterns that need to happen together again.'
          ],
          examples:[
            {q:'Find all factors of 30.',steps:['Start with 1 × 30.','Then 2 × 15, 3 × 10, and 5 × 6.','Collect every number from the factor pairs.'],answer:'1, 2, 3, 5, 6, 10, 15, 30'},
            {q:'Prime factorise 48.',steps:['Split 48 into 6 × 8.','6 = 2 × 3.','8 = 2 × 2 × 2.','All remaining factors are prime.'],answer:'2^4 × 3'},
            {q:'Find the GCF of 12 and 27.',steps:['Factors of 12: 1, 2, 3, 4, 6, 12.','Factors of 27: 1, 3, 9, 27.','Common factors are 1 and 3.'],answer:'3'},
            {q:'Find the LCM of 3 and 4.',steps:['Multiples of 3: 3, 6, 9, 12, …','Multiples of 4: 4, 8, 12, …','The first shared positive multiple is 12.'],answer:'12'},
            {q:'16 red counters and 28 blue counters are put into equal-size colour groups with none left. What is the greatest group size?',steps:['This asks for the greatest equal group size.','Find GCF(16, 28).','Common factors are 1, 2 and 4.'],answer:'4 counters per group'}
          ],
          mistake:'Do not call 1 a prime number. Do not confuse factors with multiples: factors divide a number, while multiples are produced by multiplying it. GCF must be a factor of every number; LCM must be a multiple of every number.',
          quick:'Factor pairs → prime/composite → prime factorisation → GCF for greatest sharing → LCM for first shared multiple.'
        };
      }
      return oldLearn?oldLearn(g,t,fallback):null;
    };
    window.SKILLUP_MATH.enhanced=function(g,t){if(String(g)==='5'&&t==='factors')return topicQuestion();return oldEnhanced?oldEnhanced(g,t):null;};
  }
})();
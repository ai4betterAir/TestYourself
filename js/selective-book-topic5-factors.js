// Selective Topic 5: Factors, Primes, GCF & LCM Reasoning.
// Newly written SkillUP questions covering Year 5 reasoning.
(function(){
  if(!window.SKILLUP_MR_EXTRA)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const factors=n=>{const out=[];for(let i=1;i<=n;i++)if(n%i===0)out.push(i);return out};
  const isPrime=n=>n>1&&factors(n).length===2;
  const gcd=(a,b)=>b?gcd(b,a%b):a;
  const lcm=(a,b)=>a/gcd(a,b)*b;
  const gcdAll=a=>a.reduce((x,y)=>gcd(x,y));
  const lcmAll=a=>a.reduce((x,y)=>lcm(x,y));
  function primeFactors(n){const out=[];let x=n,p=2;while(x>1){while(x%p===0){out.push(p);x/=p}p++}return out}
  const primeText=n=>{const c={};primeFactors(n).forEach(x=>c[x]=(c[x]||0)+1);return Object.entries(c).map(([p,e])=>e===1?p:`${p}^${e}`).join(' × ')};
  const Q=(text,answer,choices,tip)=>({text,answer:String(answer),choices:shuffle(uniq(choices)),tip,topic:'sel_factors',name:'Factors, Primes, GCF & LCM'});
  function question(){
    const t=R(0,13);let a,b,c,n,ans,arr;
    if(t===0){
      n=pick([36,48,60,72,84,90]);arr=factors(n);ans=arr.length;
      return Q(`How many positive factors does ${n} have?`,ans,[ans,ans-1,ans+1,2],'Pair factors systematically so none are missed.');
    }
    if(t===1){
      n=pick([30,42,60,70,84,90,105]);ans=primeText(n);
      return Q(`Which is the prime factorisation of ${n}?`,ans,[ans,`${n} × 1`,`${primeFactors(n).join(' + ')}`,primeText(n*2)],'A prime factorisation must use only prime factors multiplied together.');
    }
    if(t===2){
      const primes=[2,3,5,7,11,13,17,19,23,29],p=pick(primes),q=pick(primes.filter(x=>x!==p));n=p*q;
      return Q(`${n} is the product of two different prime numbers. Which pair could they be?`,`${Math.min(p,q)} and ${Math.max(p,q)}`,[`${Math.min(p,q)} and ${Math.max(p,q)}`,`1 and ${n}`,`${p+1} and ${Math.max(2,q-1)}`,`${p} and ${q+2}`],'Factor the number, then check that both factors are prime.');
    }
    if(t===3){
      [a,b]=pick([[24,36],[30,45],[32,48],[42,63],[54,72],[60,84]]);ans=gcd(a,b);
      return Q(`Two numbers have GCF ${ans}. Which pair fits?`,`${a} and ${b}`,[`${a} and ${b}`,`${a+1} and ${b}`,`${a} and ${b+1}`,`${a+ans} and ${b+ans}`],'The GCF must divide both numbers, and no larger common factor may divide both.');
    }
    if(t===4){
      [a,b,c]=pick([[18,24,30],[24,36,60],[20,30,50],[28,42,70],[32,48,80]]);ans=gcdAll([a,b,c]);
      return Q(`A teacher has ${a} red, ${b} blue and ${c} green counters. She wants the greatest possible equal group size for each colour with none left. What group size should she use?`,ans,[ans,ans*2,1,lcmAll([a,b,c])],'Greatest equal grouping with no remainder is a GCF problem.');
    }
    if(t===5){
      [a,b]=pick([[6,8],[8,12],[9,15],[10,14],[12,18],[15,20]]);ans=lcm(a,b);
      return Q(`What is the smallest positive number divisible by both ${a} and ${b}?`,ans,[ans,gcd(a,b),a*b,Math.max(a,b)],'The smallest shared positive multiple is the LCM.');
    }
    if(t===6){
      [a,b,c]=pick([[3,4,6],[4,6,8],[5,6,10],[6,8,12],[6,9,15]]);ans=lcmAll([a,b,c]);
      return Q(`Three events repeat every ${a}, ${b} and ${c} minutes. If they occur together now, after how many minutes will they next occur together?`,ans,[ans,a+b+c,a*b*c,gcdAll([a,b,c])],'“Together again” asks for the least common multiple.');
    }
    if(t===7){
      [a,b]=pick([[8,12],[9,15],[10,18],[12,20],[14,21],[16,24]]);ans=a*b;
      return Q(`For the two numbers ${a} and ${b}, what is GCF × LCM?`,ans,[ans,a+b,lcm(a,b),gcd(a,b)],'For two positive whole numbers, GCF × LCM equals the product of the two numbers.');
    }
    if(t===8){
      n=pick([24,36,48,54,72,90]);arr=primeFactors(n);const p=pick(arr);ans=n/p;
      return Q(`${n} has prime factor ${p}. If one factor ${p} is removed from its prime factorisation, what product remains?`,ans,[ans,n,p,n+p],'Divide the original number by that prime factor.');
    }
    if(t===9){
      const primes=[11,13,17,19,23,29,31,37,41,43];n=pick(primes);ans='exactly 2 factors';
      return Q(`Which statement must be true about the prime number ${n}?`,ans,[ans,'exactly 3 factors','an even number of factors greater than 4','it is divisible by 10'],'A prime number has exactly two positive factors.');
    }
    if(t===10){
      n=pick([18,20,24,27,28,30,32,36]);arr=factors(n);const wrong=pick([5,7,11,13].filter(x=>n%x!==0));ans=wrong;
      return Q(`Which number is NOT a factor of ${n}?`,ans,[ans,...shuffle(arr.filter(x=>x>1&&x<n)).slice(0,3)],'A factor must divide the number with no remainder.');
    }
    if(t===11){
      a=pick([4,6,8,9,10,12]);b=pick([6,8,10,12,15,18]);const L=lcm(a,b);ans=2*L;
      return Q(`The first two positive common multiples of ${a} and ${b} are ${L} and what?`,ans,[ans,L+a,L+b,a*b],'Common multiples are multiples of the LCM.');
    }
    if(t===12){
      n=pick([12,18,24,30,36,42]);arr=factors(n);const count=arr.length;ans=count>2?'composite':'prime';
      return Q(`${n} has ${count} positive factors. How should it be classified?`,ans,[ans,ans==='prime'?'composite':'prime','neither','both'],'Prime numbers have exactly two factors; composite numbers have more than two.');
    }
    [a,b]=pick([[12,18],[16,24],[20,30],[24,40],[27,36],[32,48]]);const G=gcd(a,b),L=lcm(a,b);ans=`GCF ${G}, LCM ${L}`;
    return Q(`Which pair of values is correct for ${a} and ${b}?`,ans,[ans,`GCF ${L}, LCM ${G}`,`GCF 1, LCM ${a*b}`,`GCF ${G+1}, LCM ${L}`],'Find shared factors for the GCF and shared multiples for the LCM.');
  }
  if(!window.SKILLUP_MR_EXTRA.topics.some(x=>x[0]==='sel_factors')){
    const i=window.SKILLUP_MR_EXTRA.topics.findIndex(x=>x[0]==='sel_division');
    window.SKILLUP_MR_EXTRA.topics.splice(i>=0?i+1:4,0,['sel_factors','ƒ','Factors, Primes, GCF & LCM','Prime factorisation, factor logic, greatest grouping and repeated-cycle reasoning']);
  }
  const old=window.SKILLUP_MR_EXTRA.question.bind(window.SKILLUP_MR_EXTRA);
  window.SKILLUP_MR_EXTRA.question=id=>id==='sel_factors'?question():old(id);
})();
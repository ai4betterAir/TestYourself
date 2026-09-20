// Selective Topic 6: Fraction Sense & Comparison reasoning.
// Newly written SkillUP questions covering the Year 5 book's fraction chapter.
(function(){
  if(!window.SKILLUP_MR_EXTRA)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,pick=a=>a[R(0,a.length-1)],shuffle=a=>[...a].sort(()=>Math.random()-.5),gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),lcm=(a,b)=>Math.abs(a*b)/gcd(a,b),F=(n,d)=>`${n}/${d}`;
  const Q=(text,answer,choices,tip)=>({text,answer:String(answer),choices:shuffle([...new Set(choices.map(String))]),tip,topic:'sel_fraction_sense',name:'Fraction Sense & Comparison'});
  function simp(n,d){const g=gcd(n,d);return[n/g,d/g]}
  function question(){const t=R(0,11);let a,b,c,d,L,A,B,ans;
    if(t===0){const x=pick([[7,15],[9,19],[11,23],[13,27]]);ans='Less than 1/2';return Q(`Without converting to decimals, how does ${F(x[0],x[1])} compare with 1/2?`,ans,[ans,'Equal to 1/2','Greater than 1/2','Equal to 1'],`Double the numerator: ${2*x[0]} is ${2*x[0]<x[1]?'less than':'greater than'} ${x[1]}.`)}
    if(t===1){const x=pick([[14,15],[23,25],[31,32],[48,50]]);ans='Closer to 1';return Q(`Which benchmark is ${F(x[0],x[1])} closest to?`,ans,['Closer to 0','Closer to 1/2',ans,'Exactly 1/2'],'The numerator and denominator are very close.')}
    if(t===2){a=R(2,8);b=pick([3,4,5,6,8]);c=R(1,b-1);const imp=a*b+c;ans=F(imp,b);return Q(`Which improper fraction is equal to ${a} ${c}/${b}?`,ans,[ans,F(a+c,b),F(a*b,b+c),F(imp+1,b)],'Multiply whole number × denominator, then add numerator.')}
    if(t===3){const x=pick([[18,30],[24,36],[35,49],[42,63],[54,72]]),s=simp(x[0],x[1]);ans=F(s[0],s[1]);return Q(`Which is ${F(x[0],x[1])} in lowest terms?`,ans,[ans,F(x[0],x[1]),F(s[0]*2,s[1]*2),F(s[0]+1,s[1])],'Divide numerator and denominator by their GCF.')}
    if(t===4){const x=pick([[3,4],[5,6],[7,10],[4,9]]),k=R(2,5);ans=x[1]*k;return Q(`${F(x[0],x[1])} = ${x[0]*k}/□. What is □?`,ans,[ans,x[1],ans+k,ans-1],'Equivalent fractions scale numerator and denominator by the same factor.')}
    if(t===5){const p=pick([[[5,8],[7,12]],[[7,10],[2,3]],[[4,7],[5,9]],[[11,15],[3,4]]]);A=p[0];B=p[1];ans=A[0]*B[1]>B[0]*A[1]?F(A[0],A[1]):F(B[0],B[1]);return Q(`Which is greater: ${F(A[0],A[1])} or ${F(B[0],B[1])}?`,ans,[F(A[0],A[1]),F(B[0],B[1])],'Use cross-products or a common denominator.')}
    if(t===6){const arr=pick([[[1,3],[3,8],[1,2]],[[2,5],[5,8],[3,4]],[[1,4],[4,9],[5,6]]]);const s=[...arr].sort((x,y)=>x[0]/x[1]-y[0]/y[1]);ans=s.map(x=>F(x[0],x[1])).join(' < ');return Q(`Order from least to greatest: ${arr.map(x=>F(x[0],x[1])).join(', ')}`,ans,[ans,[...s].reverse().map(x=>F(x[0],x[1])).join(' < '),arr.map(x=>F(x[0],x[1])).join(' < ')],'Benchmarks can help first; use an LCD if needed.')}
    if(t===7){const x=pick([[17,5],[23,6],[29,8],[31,7]]);const w=Math.floor(x[0]/x[1]),r=x[0]%x[1],s=simp(r,x[1]);ans=r?`${w} ${s[0]}/${s[1]}`:String(w);return Q(`Write ${F(x[0],x[1])} as a mixed number in simplest form.`,ans,[ans,`${w+1} ${r}/${x[1]}`,`${w} ${x[1]-r}/${x[1]}`,String(Math.round(x[0]/x[1]))],'Divide numerator by denominator, then simplify the remainder fraction.')}
    if(t===8){const x=pick([[2,3],[3,5],[5,8],[7,9]]),y=pick([[3,4],[5,6],[7,10],[8,9]]);L=lcm(x[1],y[1]);A=x[0]*(L/x[1]);B=y[0]*(L/y[1]);ans=A>B?F(x[0],x[1]):F(y[0],y[1]);return Q(`Using LCD ${L}, which is larger: ${F(x[0],x[1])} or ${F(y[0],y[1])}?`,ans,[F(x[0],x[1]),F(y[0],y[1])],`${F(x[0],x[1])}=${A}/${L} and ${F(y[0],y[1])}=${B}/${L}.`)}
    if(t===9){a=R(2,8);b=pick([3,4,5,6,8]);c=R(1,b-1);ans=c/b<.5?String(a):String(a+1);return Q(`Which whole number is ${a} ${c}/${b} closest to?`,ans,[String(a),String(a+1),String(a-1),String(a+2)],'Compare the fractional part with 1/2.')}
    if(t===10){const x=pick([[5,12],[7,16],[9,20]]),y=pick([[7,8],[9,10],[11,12]]);ans=F(y[0],y[1]);return Q(`Which is greater without using an LCD: ${F(x[0],x[1])} or ${F(y[0],y[1])}?`,ans,[F(x[0],x[1]),F(y[0],y[1])],'One fraction is below 1/2 while the other is close to 1.')}
    const x=pick([[9,9],[12,12],[17,17]]);return Q(`What is the value of ${F(x[0],x[1])}?`,'1',['1','0','1/2','2'],'A fraction equals 1 when numerator and denominator are equal.');
  }
  if(!window.SKILLUP_MR_EXTRA.topics.some(x=>x[0]==='sel_fraction_sense')){
    const i=window.SKILLUP_MR_EXTRA.topics.findIndex(x=>x[0]==='sel_factors');
    window.SKILLUP_MR_EXTRA.topics.splice(i>=0?i+1:5,0,['sel_fraction_sense','¾','Fraction Sense & Comparison','Benchmarks, equivalence, mixed/improper fractions and ordering']);
  }
  const old=window.SKILLUP_MR_EXTRA.question.bind(window.SKILLUP_MR_EXTRA);
  window.SKILLUP_MR_EXTRA.question=id=>id==='sel_fraction_sense'?question():old(id);
})();
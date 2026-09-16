// Selective Topic 8: Fraction Multiplication & Division Reasoning.
(function(){
  if(!window.SKILLUP_MR_EXTRA)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,pick=a=>a[R(0,a.length-1)],shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
  const simp=(n,d)=>{const g=gcd(Math.abs(n),Math.abs(d));return[n/g,d/g]};
  const frac=(n,d)=>{const s=simp(n,d);return s[1]===1?String(s[0]):`${s[0]}/${s[1]}`};
  const mixed=(n,d)=>{const s=simp(n,d);n=s[0];d=s[1];const w=Math.floor(n/d),r=n%d;return r?(w?`${w} ${r}/${d}`:`${r}/${d}`):String(w)};
  const uniq=a=>[...new Set(a.map(String))];
  const Q=(text,answer,choices,tip)=>({text,answer:String(answer),choices:shuffle(uniq(choices)),tip,topic:'sel_fraction_multdiv',name:'Fraction Multiplication & Division'});
  function question(){
    const t=R(0,12);let a,b,c,d,w,n,A,B,ans;
    if(t===0){a=R(1,5);b=R(a+1,9);c=R(1,5);d=R(c+1,9);ans=frac(a*c,b*d);return Q(`Without converting to decimals, find ${a}/${b} × ${c}/${d}.`,ans,[ans,frac(a+c,b+d),frac(a*c,b+d),frac(a+c,b*d)],'Multiply straight across, then simplify.');}
    if(t===1){const x=pick([[6,15,10,21],[8,21,14,15],[12,25,10,18]]);[a,b,c,d]=x;ans=frac(a*c,b*d);return Q(`Which simplified product is equal to ${a}/${b} × ${c}/${d}?`,ans,[ans,frac(a*c,b*d),frac(a+c,b+d),frac(a*d,b*c)],'Cancel common factors across numerator and opposite denominator before multiplying.');}
    if(t===2){a=pick([18,24,30,36,40,48]);b=pick([3,4,5,6,8]);c=R(1,b-1);const value=a*c/b;if(!Number.isInteger(value))return question();return Q(`${c}/${b} of a number is ${value}. What is the number?`,a,[a,value,a-value,value*b],'Work backward by dividing by the fraction, or multiply by its reciprocal.');}
    if(t===3){a=R(2,8);b=pick([2,3,4,5]);c=R(1,b-1);ans=mixed(a*b,c);return Q(`How many ${c}/${b}-metre pieces can be cut from ${a} metres?`,ans,[ans,mixed(a*c,b),String(a),String(Math.floor(a*c/b))],'Number of pieces = total length ÷ piece length.');}
    if(t===4){a=R(1,7);b=R(a+1,9);ans=`${b}/${a}`;return Q(`A number multiplied by ${a}/${b} gives 1. What is the number?`,ans,[ans,`${a}/${b}`,`1/${b}`,String(b-a)],'The missing factor is the reciprocal.');}
    if(t===5){a=R(1,7);b=R(a+1,9);c=R(1,7);d=R(c+1,9);ans=mixed(a*d,b*c);return Q(`${a}/${b} ÷ ${c}/${d} = ?`,ans,[ans,frac(a*c,b*d),frac(a*d,b*c),frac(a+c,b+d)],'Division by a fraction means multiply by its reciprocal.');}
    if(t===6){w=R(2,6);b=pick([3,4,5,6]);n=R(1,b-1);c=R(1,b-1);A=w*b+n;ans=mixed(A,b*c);return Q(`${w} ${n}/${b} ÷ ${c} = ?`,ans,[ans,mixed(A*c,b),frac(A,b*c),`${w} ${n}/${b*c}`],'Rename the mixed number as an improper fraction first.');}
    if(t===7){const d1=pick([2,3,4,5]),d2=pick([2,3,4,5]),w1=R(2,5),w2=R(1,w1),n1=R(1,d1-1),n2=R(1,d2-1);A=w1*d1+n1;B=w2*d2+n2;ans=mixed(A*d2,d1*B);return Q(`${w1} ${n1}/${d1} ÷ ${w2} ${n2}/${d2} = ?`,ans,[ans,mixed(A*B,d1*d2),frac(A*d2,d1*B),String(Math.round((A/d1)/(B/d2)))],'Rename both mixed numbers, then multiply by the reciprocal of the divisor.');}
    if(t===8){a=R(20,60);b=pick([3,4,5,6]);c=R(1,b-1);const used=a*c/b;if(!Number.isInteger(used))return question();const left=a-used;return Q(`${c}/${b} of ${a} L is used. What fraction of the original amount remains?`,frac(left,a),[frac(left,a),frac(used,a),frac(c,b),frac(b-c,b)],'Find the used amount or subtract the used fraction from 1.');}
    if(t===9){const x=pick([[2,3],[3,4],[4,5],[5,6]]);a=x[0];b=x[1];return Q(`Which is greater?`,`6 ÷ ${a}/${b}`,[`6 ÷ ${a}/${b}`,`6 × ${a}/${b}`,'They are equal','Cannot tell'],'Dividing by a number less than 1 makes the result larger; multiplying by it makes the result smaller.');}
    if(t===10){const x=pick([[3,4],[5,6],[7,8]]);a=x[0];b=x[1];return Q(`Which statement must be true about ${a}/${b} × ${a}/${b}?`,'The product is less than each factor',['The product is less than each factor','The product is greater than each factor','The product equals 1','The product is a whole number'],'Multiplying two positive fractions less than 1 makes the value smaller.');}
    if(t===11){w=R(6,14);b=pick([2,3,4,5,6]);n=R(1,b-1);const div=pick([2,3,4]);const rounded=n/b>=.5?w+1:w;const estimate=Math.round(rounded/div);return Q(`Which is the best estimate for ${w} ${n}/${b} ÷ ${div}?`,estimate,[estimate,Math.max(1,estimate-1),estimate+1,rounded],'Round the mixed number to a nearby whole number first.');}
    a=R(2,9);b=pick([3,4,5,6]);c=R(1,b-1);const total=a*b;ans=a;return Q(`A tank is ${c}/${b} full. That amount is ${total*c/b} L. What is the tank's full capacity?`,total,[total,total*c/b,total*b,c*total],'If a fraction of the whole is known, divide the part by that fraction.');
  }
  if(!window.SKILLUP_MR_EXTRA.topics.some(x=>x[0]==='sel_fraction_multdiv')){
    const i=window.SKILLUP_MR_EXTRA.topics.findIndex(x=>x[0]==='sel_fraction_addsub');
    window.SKILLUP_MR_EXTRA.topics.splice(i>=0?i+1:8,0,['sel_fraction_multdiv','×÷','Fraction Multiplication & Division','Products, reciprocals, quotients, mixed numbers and fraction reasoning']);
  }
  const old=window.SKILLUP_MR_EXTRA.question.bind(window.SKILLUP_MR_EXTRA);
  window.SKILLUP_MR_EXTRA.question=id=>id==='sel_fraction_multdiv'?question():old(id);
})();
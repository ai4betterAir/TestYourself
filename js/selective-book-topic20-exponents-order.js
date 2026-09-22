// Topic 20: Selective Mathematical Reasoning — Exponents & Order of Operations.
(function(){
  const mr=window.SKILLUP_MR_EXTRA;
  if(!mr)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const pow=(a,b)=>Math.pow(a,b);
  function Q(text,answer,choices,tip){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    let k=1;while(rest.length<3){const v=String(Number.isFinite(Number(ans))?Number(ans)+k:k);k++;if(v!==ans&&!rest.includes(v))rest.push(v);}
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,topic:'sel_exponents_order',name:'Exponents & Order of Operations'};
  }
  function question(){
    const m=R(0,19);let a,b,c,d,ans;
    if(m===0){a=R(2,7);b=R(2,4);c=R(2,7);ans=pow(a,b)+c;return Q(`${a}^${b} + ${c} = ?`,ans,[ans,a*b+c,pow(a,b+c),pow(a,b)-c],'Evaluate the exponent first.');}
    if(m===1){a=R(2,6);b=R(2,4);c=R(2,6);d=R(2,6);ans=pow(a,b)+c*d;return Q(`${a}^${b} + ${c} × ${d} = ?`,ans,[ans,(pow(a,b)+c)*d,a*b+c*d,pow(a,b+c*d)],'Powers first, then multiplication, then addition.');}
    if(m===2){a=R(3,9);b=R(2,7);c=R(2,6);ans=(a+b)*c;return Q(`Which has the greater value: ${a} + ${b} × ${c} or (${a} + ${b}) × ${c}?`, `(${a} + ${b}) × ${c}`,[`(${a} + ${b}) × ${c}`,`${a} + ${b} × ${c}`,'They are equal','Cannot be determined'],'Evaluate both expressions carefully.');}
    if(m===3){a=R(2,6);b=R(2,4);ans=pow(a,b);return Q(`A power has base ${a} and value ${ans}. What is the exponent?`,b,[b,a,ans,b+1],'Ask how many times the base must be multiplied by itself.');}
    if(m===4){a=pick([16,25,36,49,64,81]);const root=Math.sqrt(a);return Q(`Which expression is another way to write ${a}?`,`${root}^2`,[`${root}^2`,`2^${root}`,`${root}×2`,`10^${root}`],'Recognise perfect squares.');}
    if(m===5){a=pick([8,27,64,125,216]);let root=Math.round(Math.cbrt(a));return Q(`Which expression equals ${a}?`,`${root}^3`,[`${root}^3`,`3^${root}`,`${root}^2`,`${root}×3`],'Recognise perfect cubes.');}
    if(m===6){a=R(2,9);b=R(2,9);c=R(2,6);const target=(a+b)*c;return Q(`Insert one pair of parentheses to make ${a} + ${b} × ${c} equal ${target}.`,`(${a} + ${b}) × ${c}`,[`(${a} + ${b}) × ${c}`,`${a} + (${b} × ${c})`,`(${a} + ${b} × ${c})`,`(${a}) + ${b} × ${c}`],'Parentheses must force addition before multiplication.');}
    if(m===7){a=R(3,8);b=R(2,6);c=R(2,5);const val=a+b*c;return Q(`A student says ${a} + ${b} × ${c} = ${(a+b)*c}. Which statement best explains the error?`,'The student added before multiplying',['The student added before multiplying','The student multiplied before adding','The student should divide first','The student should use an exponent'],'Multiplication has priority over addition.');}
    if(m===8){a=R(2,5);b=R(2,4);c=R(2,6);ans=(pow(a,b)+c)*2;return Q(`2 × (${a}^${b} + ${c}) = ?`,ans,[ans,2*pow(a,b)+c,pow(2*a,b)+c,pow(a,b)+2*c],'Within parentheses, powers come before addition.');}
    if(m===9){a=R(2,6);b=R(2,4);c=R(2,6);ans=pow(a,b)-c;return Q(`${a}^${b} − ${c} = ?`,ans,[ans,pow(a,b-c),a*b-c,pow(a,b)+c],'Power first, then subtraction.');}
    if(m===10){a=R(2,5);b=R(2,4);c=R(2,5);ans=pow(a,b)+pow(c,2);return Q(`${a}^${b} + ${c}^2 = ?`,ans,[ans,pow(a+c,b),a*b+c*2,pow(a,b)*pow(c,2)],'Evaluate both powers before adding.');}
    if(m===11){b=R(3,6);ans=pow(10,b);return Q(`Which number is 10^${b}?`,ans,[ans,b*10,pow(10,b-1),pow(10,b+1)],'A power of ten has the same number of zeros as its exponent.');}
    if(m===12){a=R(2,7);b=R(2,4);const p=pow(a,b);ans=`${a}^${b}`;return Q(`Which power is exactly halfway between ${p-a} and ${p+a} on the number line?`,ans,[ans,`${a}^${b-1}`,`${b}^${a}`,`${a+1}^${b}`],'The midpoint is the average of the two numbers.');}
    if(m===13){a=R(2,6);b=R(2,4);c=R(2,8);const value=pow(a,b)+c;return Q(`If x = ${a}, evaluate x^${b} + ${c}.`,value,[value,a*b+c,pow(a,b+c),value+c],'Substitute first, then use the order of operations.');}
    if(m===14){a=R(2,7);b=R(2,7);c=R(2,5);d=R(2,5);ans=a*b+c*d;return Q(`${a}×${b} + ${c}×${d} = ?`,ans,[ans,(a*b+c)*d,a*(b+c)*d,a+b+c+d],'Do both multiplications before adding.');}
    if(m===15){a=R(2,8);b=R(2,6);c=R(2,5);ans=a*(b+c);return Q(`${a} × (${b}+${c}) = ?`,ans,[ans,a*b+c,(a+b)*c,a+b+c],'Parentheses first.');}
    if(m===16){a=R(2,7);b=R(2,4);ans=pow(a,b);return Q(`Which statement about ${a}^${b} is true?`,`${a} is multiplied by itself ${b} times`,[`${a} is multiplied by itself ${b} times`,`${a} is multiplied by ${b}`,`${b} is multiplied by itself ${a} times`,`The value is ${a+b}`],'The exponent counts repeated factors.');}
    if(m===17){a=R(2,8);b=R(2,8);c=R(2,6);const left=a+b*c,right=(a+b)*c;ans=right-left;return Q(`How much larger is (${a}+${b})×${c} than ${a}+${b}×${c}?`,ans,[ans,right,left,c],'Evaluate both expressions, then subtract.');}
    if(m===18){a=R(2,5);b=R(2,4);c=R(2,6);const inner=pow(a,b)+c;ans=inner*inner;return Q(`Let n = ${a}^${b}+${c}. What is n^2?`,ans,[ans,inner*2,pow(a,b)+c*c,pow(a,b*2)+c],'Find n first, then square the whole result.');}
    a=R(2,6);b=R(2,4);c=R(2,5);d=R(2,6);ans=pow(a,b)+c*d;return Q(`Which operation should be done last in ${a}^${b} + ${c} × ${d}?`,'addition',['addition','exponent','multiplication','division'],'Powers first, multiplication next, addition last.');
  }
  mr.topics=mr.topics.filter(x=>x[0]!=='sel_exponents_order');
  const idx=mr.topics.findIndex(x=>x[0]==='sel_problem_solving');
  mr.topics.splice(idx>=0?idx+1:mr.topics.length,0,['sel_exponents_order','x²','Exponents & Order of Operations','Powers, parentheses, operation priority and multi-step numerical reasoning']);
  const old=mr.question.bind(mr);
  mr.question=function(id){return id==='sel_exponents_order'?question():old(id);};
})();

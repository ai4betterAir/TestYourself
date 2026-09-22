// Selective Topic 16: Algebra, Patterns & Equations Reasoning.
(function(){
  if(!window.SKILLUP_MR_EXTRA)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    while(rest.length<3){const n=String(R(1,40));if(n!==ans&&!rest.includes(n))rest.push(n);}
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,topic:'sel_algebra',name:'Algebra, Patterns & Equations'};
  }
  function question(){
    const t=R(0,19);let a,b,c,d,x,ans;
    if(t===0){a=R(2,7);b=R(2,12);x=R(3,14);c=a*x+b;return Q(`${a}x + ${b} = ${c}. What is x?`,x,[x,x+1,x-1,a],'Undo the addition, then divide by the coefficient.');}
    if(t===1){a=R(2,7);b=R(2,12);x=R(4,15);c=a*x-b;return Q(`${a}x − ${b} = ${c}. What is x?`,x,[x,x+1,x-1,b],'Add the subtracted amount to both sides, then divide.');}
    if(t===2){a=R(2,6);b=R(1,8);x=R(3,12);c=a*x+b;const candidate=pick([x,x+1,x-1]);ans=candidate===x?'Yes':'No';return Q(`Does x=${candidate} make ${a}x + ${b} = ${c} true?`,ans,[ans,ans==='Yes'?'No':'Yes','Only for x=0','Not enough information'],'Substitute the proposed value and compare both sides.');}
    if(t===3){a=R(2,6);b=R(1,9);x=R(2,10);c=a*x+b;return Q(`A machine multiplies a number by ${a}, then adds ${b}. The output is ${c}. What was the input?`,x,[x,c-b,c/a,x+1],'Reverse the operations in reverse order.');}
    if(t===4){a=R(2,5);b=R(1,6);x=R(2,8);c=a*x+b;d=R(2,5);const out=d*c;ans=x;return Q(`A number is multiplied by ${a}, then ${b} is added, then the result is multiplied by ${d}. The final answer is ${out}. What was the starting number?`,ans,[ans,x+1,x-1,c],'Work backwards: divide by the last multiplier, subtract, then divide again.');}
    if(t===5){a=R(2,6);b=R(0,8);const vals=[1,2,3,4].map(n=>a*n+b);ans=`y = ${a}x + ${b}`;return Q(`A function table has inputs 1,2,3,4 and outputs ${vals.join(', ')}. Which rule fits?`,ans,[ans,`y = ${a+b}x`,`y = ${a}x − ${b}`,`y = x + ${a+b}`],'Look at the constant change in output, then check the starting offset.');}
    if(t===6){a=R(2,7);b=R(1,9);const x1=R(1,4),x2=x1+R(2,4);const y1=a*x1+b,y2=a*x2+b;ans=a;return Q(`For a linear rule y=ax+b, the table includes (${x1},${y1}) and (${x2},${y2}). What is a?`,ans,[ans,a+1,Math.max(1,a-1),b],'Change in y divided by change in x gives the multiplier a.');}
    if(t===7){a=R(2,7);b=R(1,9);x=R(3,9);c=a*x+b;ans=b;return Q(`A rule is y = ${a}x + b. When x=${x}, y=${c}. What is b?`,ans,[ans,a,x,c-a*x+1],'Substitute the known x and y, then isolate b.');}
    if(t===8){a=R(3,9);b=R(5,20);const n=R(5,9);ans=b+(n-1)*a;return Q(`A sequence is ${b}, ${b+a}, ${b+2*a}, ... What is term ${n}?`,ans,[ans,b+n*a,b+(n-2)*a,ans+a],'Term n is the first term plus (n−1) equal jumps.');}
    if(t===9){const diff=R(2,7),third=R(10,30),fifth=third+2*diff;ans=diff;return Q(`In an arithmetic sequence, the 3rd term is ${third} and the 5th term is ${fifth}. What is the common difference?`,ans,[ans,2*diff,diff+1,Math.max(1,diff-1)],'From term 3 to term 5 there are two equal jumps.');}
    if(t===10){a=R(2,4);b=R(1,3);const s=R(1,4),t2=a*s+b,t3=a*t2+b,t4=a*t3+b,answer=a*t4+b;return Q(`The pattern is ${s}, ${t2}, ${t3}, ${t4}, ... Each term is made from the previous one using the same two-step rule. What is next?`,answer,[answer,a*t4,t4+b,answer+b],`Test “×${a}, then +${b}”.`);}
    if(t===11){a=R(2,7);b=R(1,10);const n=R(4,9),value=a*n+b;ans=n;return Q(`The nth term of a sequence is ${a}n + ${b}. Which term has value ${value}?`,ans,[ans,n+1,n-1,value],'Set the rule equal to the given value and solve for n.');}
    if(t===12){const sum=pick([40,46,52,58,64]);const diff=pick([6,8,10,12]);if((sum+diff)%2)return question();const large=(sum+diff)/2;ans=large;return Q(`Two numbers add to ${sum} and differ by ${diff}. What is the larger number?`,ans,[ans,sum-large,sum/2,large+diff],'Add the sum and difference, then halve the result.');}
    if(t===13){a=R(2,5);b=R(2,7);const pears=R(2,8),mand=R(2,8);const total1=a*pears+b*mand;const total2=pears+2*b*mand;ans=pears;return Q(`At a school stall, ${a} identical snack packs and ${b} identical drinks cost $${total1}. One snack pack plus ${2*b} drinks costs $${total2}. What is the price of one snack pack?`,`$${ans}`,[`$${ans}`,`$${mand}`,`$${ans+1}`,`$${Math.max(1,ans-1)}`],'Treat the two purchases as two equations and eliminate one item.');}
    if(t===14){a=R(2,6);b=R(2,10);x=R(3,12);const result=a*x+b;return Q(`Which equation matches: “${b} more than ${a} times a number is ${result}”?`,`${a}x + ${b} = ${result}`,[`${a}x + ${b} = ${result}`,`${a}(x+${b}) = ${result}`,`${b}x + ${a} = ${result}`,`${a}x − ${b} = ${result}`],'Translate “a times a number” first, then add b.');}
    if(t===15){a=R(2,6);b=R(2,8);c=R(1,7);x=R(2,10);ans=(a+b)*x+c;return Q(`Evaluate ${a}x + ${b}x + ${c} when x=${x}.`,ans,[ans,a*b*x+c,(a+b)*(x+c),ans-c],'Combine like terms or substitute carefully, then use order of operations.');}
    if(t===16){a=R(2,8);b=R(1,8);x=R(2,10);const y=a*x+b;const x2=x+R(2,4),y2=a*x2+b;ans=y2;return Q(`A function follows one rule. It contains ${x}→${y}. If the rule is y=${a}x+${b}, what output matches input ${x2}?`,ans,[ans,a*x2,y+a,ans+b],'Use the same function rule for every input.');}
    if(t===17){const width=R(6,15),length=2*width+R(1,5),extra=length-2*width;ans=width;return Q(`A rectangle's length is ${extra} cm more than twice its width. Its length is ${length} cm. What is the width?`,`${ans} cm`,[`${ans} cm`,`${length/2} cm`,`${ans+extra} cm`,`${length-extra} cm`],'Write length = 2×width + extra, then solve.');}
    if(t===18){a=R(2,5);b=R(2,10);x=R(3,12);const left=a*x+b,right=(a-1)*x+(x+b);ans='They are equal';return Q(`For x=${x}, compare ${a}x+${b} with ${a-1}x+(x+${b}).`,ans,[ans,'The first is greater','The second is greater','Cannot be determined'],'Simplify the second expression by combining like terms.');}
    const start=R(2,8),mult=R(2,4),add=R(1,5);let v=start;for(let i=0;i<3;i++)v=v*mult+add;ans=v;return Q(`Start with ${start}. Repeat “multiply by ${mult}, then add ${add}” three times. What is the final value?`,ans,[ans,v-add,Math.floor(v/mult),ans+add],'Apply the full rule three separate times; do not combine the repetitions into one step.');
  }

  window.SKILLUP_MR_EXTRA.topics=window.SKILLUP_MR_EXTRA.topics.filter(x=>x[0]!=='sel_patterns');
  const row=window.SKILLUP_MR_EXTRA.topics.find(x=>x[0]==='sel_algebra');
  if(row){row[1]='x';row[2]='Algebra, Patterns & Equations';row[3]='Expressions, reverse operations, function rules, sequences and equation reasoning';}
  else window.SKILLUP_MR_EXTRA.topics.push(['sel_algebra','x','Algebra, Patterns & Equations','Expressions, reverse operations, function rules, sequences and equation reasoning']);
  const old=window.SKILLUP_MR_EXTRA.question.bind(window.SKILLUP_MR_EXTRA);
  window.SKILLUP_MR_EXTRA.question=id=>id==='sel_algebra'?question():old(id);
})();
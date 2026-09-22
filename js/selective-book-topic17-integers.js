// Selective Topic 17: Integers & Negative Numbers Reasoning.
(function(){
  if(!window.SKILLUP_MR_EXTRA)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const I=n=>n<0?`−${Math.abs(n)}`:String(n);
  function Q(text,answer,choices,tip){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    let k=1;while(rest.length<3){const v=I(k++);if(v!==ans&&!rest.includes(v))rest.push(v);}
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,topic:'sel_integers',name:'Integers & Negative Numbers'};
  }
  function question(){
    const t=R(0,17);let a,b,c,d,ans;
    if(t===0){a=R(-8,8);b=R(5,14);c=R(3,11);const final=a-b+c;return Q(`At sunrise the temperature is ${I(a)}°C. It falls ${b}°, then rises ${c}°. What is the final temperature?`,`${I(final)}°C`,[`${I(final)}°C`,`${I(a+b+c)}°C`,`${I(a-b-c)}°C`,`${I(a+c)}°C`],'Treat a fall as a negative change and a rise as a positive change.');}
    if(t===1){a=R(10,35);b=R(15,45);c=R(5,30);const final=a-b+c;return Q(`An account balance is $${a}. A withdrawal of $${b} is made, followed by a deposit of $${c}. What is the new balance?`,`$${I(final)}`,[`$${I(final)}`,`$${a+b+c}`,`$${I(a-b-c)}`,`$${I(a+c)}`],'Withdrawal is negative; deposit is positive.');}
    if(t===2){a=R(3,14);b=R(3,14);const x=-a+b,y=a-b;ans=x>y?I(x):I(y);return Q(`Which is greater: ${I(-a)} + ${b} or ${a} + (${I(-b)})?`,ans,[ans,I(Math.min(x,y)),I(-Math.max(x,y)),I(a+b)],'Evaluate both integer expressions before comparing them.');}
    if(t===3){a=R(3,18);b=R(3,18);const dist=Math.abs((-a)-b);return Q(`What is the distance on a number line between ${I(-a)} and ${b}?`,dist,[dist,a+b+1,Math.abs(a-b),Math.max(a,b)],'Distance across zero is the sum of the distances from zero.');}
    if(t===4){a=R(-15,15);b=R(-15,15);const total=R(-10,10);c=total-a-b;ans=I(c);return Q(`${I(a)} + ${I(b)} + n = ${I(total)}. What is n?`,ans,[ans,I(-c),I(total-a),I(total-b)],'Combine the known integers, then use the inverse operation.');}
    if(t===5){a=R(-10,12);b=R(-12,10);const result=a-b;return Q(`n − (${I(b)}) = ${I(result)}. What is n?`,I(a),[I(a),I(-a),I(result+b+1),I(result-b)],'Undo subtraction by adding the subtracted integer to both sides.');}
    if(t===6){const nums=[pick([-6,-5,-4,-3]),pick([-5,-4,-3,2,3,4]),pick([-3,-2,2,3,4,5])];const prod=nums.reduce((x,y)=>x*y,1);ans=prod>0?'positive':prod<0?'negative':'zero';return Q(`Without calculating the full product, what is the sign of ${nums.map(I).join(' × ')}?`,ans,[ans,ans==='positive'?'negative':'positive','zero','cannot tell'],'An even number of negative factors gives a positive product; an odd number gives a negative product.');}
    if(t===7){a=R(2,6);b=R(2,6);c=R(2,6);const start=-a*b*c,mid=start/(-a),final=mid/b;return Q(`Start with ${I(start)}. Divide by ${I(-a)}, then divide by ${b}. What is the final value?`,I(final),[I(final),I(-final),I(mid),I(start/b)],'Apply the division steps in order and use the sign rules each time.');}
    if(t===8){a=pick([24,32,40,48]);const vals=[a,-a*2,a*4,-a*8];ans=I(a*16);return Q(`Find the next term: ${vals.map(I).join(', ')}, ?`,ans,[ans,I(-a*16),I(a*8),I(-a*4)],'Each term is multiplied by −2.');}
    if(t===9){a=R(2,7);b=R(2,7);c=R(2,7);const value=(-a)*(b-c);return Q(`Evaluate ${I(-a)} × (${b} − ${c}).`,I(value),[I(value),I((-a)*b-c),I(a*(b-c)),I(-a*b+c)],'Calculate the brackets first, then multiply using integer sign rules.');}
    if(t===10){a=R(3,12);b=R(2,8);const totalChange=-a*b;return Q(`A temperature changes by ${I(-a)}° each hour for ${b} hours. What is the total change?`,`${I(totalChange)}°`,[`${I(totalChange)}°`,`${a*b}°`,`${I(-a-b)}°`,`${I(-a)}°`],'Repeated equal change can be modelled with integer multiplication.');}
    if(t===11){a=R(40,120);b=R(4,10);const change=-a/b;return Q(`A quantity decreases by ${a} units equally over ${b} periods. What is the average change per period?`,I(change),[I(change),I(-change),I(a-b),I(-a)],'A decrease is negative. Divide the total change by the number of periods.');}
    if(t===12){a=R(-8,8);b=R(2,6);c=R(2,7);const final=(a-b)*c;const start=final/c+b;return Q(`A number has ${b} subtracted from it, then the result is multiplied by ${c}, giving ${I(final)}. What was the starting number?`,I(start),[I(start),I(-start),I(final/c),I(final+b)],'Reverse the operations: divide first, then add back the amount subtracted.');}
    if(t===13){a=R(-12,4);const nums=[a,a+1,a+2];const sum=nums.reduce((x,y)=>x+y,0);return Q(`Three consecutive integers have middle value ${I(a+1)}. What is their sum?`,I(sum),[I(sum),I(3*(a+1)+1),I(3*a),I(-sum)],'Consecutive integers differ by 1. Add the integer before, the middle integer and the integer after.');}
    if(t===14){a=R(4,15);b=R(3,12);c=R(2,10);const net=-a+b-c;return Q(`A player loses ${a} points, gains ${b}, then loses ${c}. What is the net change?`,I(net),[I(net),I(a+b+c),I(-a-b-c),I(-a+b+c)],'Losses are negative and gains are positive. Add the signed changes.');}
    if(t===15){a=R(2,9);b=R(3,12);const product=-a*b;return Q(`n × ${I(-a)} = ${product}. What is n?`,b,[b,-b,a,product],'Divide the product by the known factor, keeping the integer sign rule in mind.');}
    if(t===16){a=R(2,10);b=R(2,10);const e1=-a+b,e2=-(a+b),e3=a-b;const vals=[[`${I(-a)} + ${b}`,e1],[`${I(-a)} − ${b}`,e2],[`${a} − ${b}`,e3]];vals.sort((x,y)=>y[1]-x[1]);ans=vals[0][0];return Q(`Which expression has the greatest value?`,ans,[ans,...vals.slice(1).map(x=>x[0]),`${a}+${b}`],'Evaluate each expression or compare their positions on the number line.');}
    const z=pick([
      ['A negative number multiplied by a negative number is positive.','always'],
      ['The sum of two negative integers is positive.','never'],
      ['Subtracting a negative integer makes the value larger.','sometimes'],
      ['A positive integer is greater than every negative integer.','always']
    ]);return Q(`${z[0]} Is this always, sometimes or never true?`,z[1],[z[1],'always','sometimes','never'],'Test the statement with integer examples and the sign rules.');
  }

  window.SKILLUP_MR_EXTRA.topics=window.SKILLUP_MR_EXTRA.topics.filter(x=>x[0]!=='sel_integers');
  const i=window.SKILLUP_MR_EXTRA.topics.findIndex(x=>x[0]==='sel_algebra');
  window.SKILLUP_MR_EXTRA.topics.splice(i>=0?i+1:window.SKILLUP_MR_EXTRA.topics.length,0,['sel_integers','±','Integers & Negative Numbers','Signed numbers, number-line reasoning and multi-step integer operations']);
  const old=window.SKILLUP_MR_EXTRA.question.bind(window.SKILLUP_MR_EXTRA);
  window.SKILLUP_MR_EXTRA.question=id=>id==='sel_integers'?question():old(id);
})();
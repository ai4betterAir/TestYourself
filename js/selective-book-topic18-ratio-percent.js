// Selective Topic 18: Ratio, Proportion & Percent Reasoning.
(function(){
  if(!window.SKILLUP_MR_EXTRA)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const money=n=>`$${Number(n).toFixed(2)}`;
  function Q(text,answer,choices,tip){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    let k=1;while(rest.length<3){const v=String(k++);if(v!==ans&&!rest.includes(v))rest.push(v);}
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,topic:'sel_ratio_percent',name:'Ratio, Proportion & Percent'};
  }
  function question(){
    const t=R(0,17);let a,b,c,d,ans;
    if(t===0){a=R(2,7);b=R(3,9);c=R(2,6);return Q(`The ratio of red to blue counters is ${a}:${b}. If there are ${a*c} red counters, how many blue counters are there?`,b*c,[b*c,b+c,a*c,(a+b)*c],'Scale both parts of the ratio by the same factor.');}
    if(t===1){a=R(2,8);b=R(2,8);c=R(2,7);d=R(2,7);const yes=a*d===b*c;ans=yes?'Yes':'No';return Q(`Are ${a}:${b} and ${c}:${d} proportional?`,ans,[ans,yes?'No':'Yes','Only if simplified first','Cannot tell'],'Cross products must be equal for a proportion.');}
    if(t===2){a=R(2,6);b=R(3,9);c=R(3,8);ans=b*c;return Q(`${a} packs contain ${b} cards. At the same rate, ${a*c} packs contain how many cards?`,ans,[ans,b+c,a*c,(a+b)*c],'Use the same scale factor on both quantities.');}
    if(t===3){a=R(2,6);b=R(3,8);c=R(2,6);const total=a*c;ans=b*c;return Q(`A recipe uses ${a} cups of flour for ${b} people. How many people can be served with ${total} cups at the same rate?`,ans,[ans,b+c,total+b,a*b],'Set up an equivalent ratio.');}
    if(t===4){const total=pick([80,100,120,160,200,240]);const pct=pick([15,20,25,30,40,50,60,75]);const part=total*pct/100;if(!Number.isInteger(part))return question();return Q(`${part} of ${total} students chose sport. What percent is this?`,`${pct}%`,[`${pct}%`,`${100-pct}%`,`${part}%`,`${Math.round(part/total)}%`],'Use part ÷ whole × 100.');}
    if(t===5){const pct=pick([10,20,25,40,50,60,75]);const whole=pick([80,100,120,160,200,240]);const part=pct*whole/100;if(!Number.isInteger(part))return question();return Q(`${pct}% of a number is ${part}. What is the number?`,whole,[whole,part*2,part+pct,whole-pct],'Divide the known part by the percent written as a decimal.');}
    if(t===6){const price=pick([60,80,100,120,150,200]);const pct=pick([10,20,25,30,40]);const sale=price*(100-pct)/100;return Q(`A $${price} item is reduced by ${pct}%. What is the sale price?`,money(sale),[money(sale),money(price*pct/100),money(price-pct),money(price+pct)],'Find the discount first, then subtract it from the original price.');}
    if(t===7){const p1=pick([20,25,30,40,50]),p2=pick([20,25,30,40,50]);const x1=pick([40,60,80,100,120]),x2=pick([40,60,80,100,120]);const v1=p1*x1/100,v2=p2*x2/100;ans=v1>v2?'first':v2>v1?'second':'equal';return Q(`Which is greater: ${p1}% of ${x1} or ${p2}% of ${x2}?`,ans,[ans,'first','second','equal'],'Calculate both percentage amounts before comparing.');}
    if(t===8){const price=pick([40,60,80,100]);const pct=pick([10,20,25]);const discounted=price*(100-pct)/100;const tax=pick([5,10]);const final=discounted*(100+tax)/100;return Q(`An item costs $${price}. It is discounted by ${pct}%, then ${tax}% tax is added to the sale price. What is the final price?`,money(final),[money(final),money(price*(100-pct+tax)/100),money(discounted),money(price)],'Apply the discount first, then calculate tax on the reduced price.');}
    if(t===9){const price1=pick([60,80,100,120]),price2=pick([60,80,100,120]);const d1=pick([20,25,30,40]),d2=pick([20,25,30,40]);const s1=price1*(100-d1)/100,s2=price2*(100-d2)/100;ans=s1<s2?'first':s2<s1?'second':'equal';return Q(`Which sale is cheaper: first item $${price1} at ${d1}% off, or second item $${price2} at ${d2}% off?`,ans,[ans,'first','second','equal'],'Find both sale prices, not just the discount percentages.');}
    if(t===10){const total=pick([120,160,200,240,300]);const p=pick([20,25,30,40,50]);const first=total*p/100;const remain=total-first;const second=pick([10,20,25,50]);const secondAmt=remain*second/100;return Q(`A group has ${total} people. ${p}% leave. Then ${second}% of those remaining leave. How many remain?`,remain-secondAmt,[remain-secondAmt,total-first-secondAmt,total*(100-p-second)/100,remain],'Percent changes in sequence use the new remaining total each time.');}
    if(t===11){a=R(2,6);b=R(3,9);c=R(2,5);const total=(a+b)*c;return Q(`A mixture has ratio ${a}:${b}. A batch contains ${total} parts altogether. How many parts are the first ingredient?`,a*c,[a*c,b*c,total-a*c,a+b],'Find the size of one ratio part, then multiply by the first ratio number.');}
    if(t===12){const pct=pick([20,25,40,50,75]);const part=pick([20,30,40,50,60,80]);const whole=part*100/pct;if(!Number.isInteger(whole))return question();return Q(`${part} is ${pct}% of what number?`,whole,[whole,part+pct,part*2,whole-pct],'Use whole = part ÷ percent-as-decimal.');}
    if(t===13){const x=pick([0.125,0.2,0.375,0.625,0.8,1.25]);return Q(`Which percent is equal to ${x}?`,`${x*100}%`,[`${x*100}%`,`${x*10}%`,`${x}%`,`${x*1000}%`],'Move the decimal two places right.');}
    if(t===14){const p=pick([12,18,22,48,52,73]),n=pick([198,203,397,503]);const exact=Math.round(p*n/100);const est=Math.round(p/10)*10/100*Math.round(n/100)*100;return Q(`Which is the better estimate for ${p}% of ${n}?`,est,[est,exact,Math.max(0,est-50),est+100],'Round to a nearby friendly percent and compatible whole number.');}
    if(t===15){const paid=pick([24,30,36,42,48]);const pct=pick([60,75,80]);const original=paid/(pct/100);if(!Number.isInteger(original))return question();return Q(`A sale price of $${paid} is ${pct}% of the original price. What was the original price?`,money(original),[money(original),money(paid*(100-pct)/100),money(paid+pct),money(paid/(1-pct/100))],'The sale price is a percent of the original, so divide by the percent as a decimal.');}
    if(t===16){a=R(2,5);b=R(3,8);const first=R(3,7);const second=first+R(1,4);const out1=a*first+b,out2=a*second+b;return Q(`A table follows a proportional-style rule y=${a}x+${b}. Inputs ${first} and ${second} give outputs ${out1} and ${out2}. What is the increase in output?`,a*(second-first),[a*(second-first),second-first,b,a+b],'The constant multiplier controls how much the output changes when x changes.');}
    const total=pick([100,120,150,200,240]);const pct=pick([10,20,25,30,40]);const amount=total*pct/100;return Q(`A budget allocates ${pct}% of $${total} to savings. The rest is split equally between two other categories. How much goes to each of those categories?`,money((total-amount)/2),[money((total-amount)/2),money(amount),money(total/2),money(total-amount)],'Find the savings amount, subtract from the total, then divide the remainder equally.');
  }

  window.SKILLUP_MR_EXTRA.topics=window.SKILLUP_MR_EXTRA.topics.filter(x=>x[0]!=='sel_ratio_percent');
  const i=window.SKILLUP_MR_EXTRA.topics.findIndex(x=>x[0]==='sel_integers');
  window.SKILLUP_MR_EXTRA.topics.splice(i>=0?i+1:window.SKILLUP_MR_EXTRA.topics.length,0,['sel_ratio_percent','%','Ratio, Proportion & Percent','Equivalent ratios, proportions, percentages, reverse percent and discount reasoning']);
  const old=window.SKILLUP_MR_EXTRA.question.bind(window.SKILLUP_MR_EXTRA);
  window.SKILLUP_MR_EXTRA.question=id=>id==='sel_ratio_percent'?question():old(id);
})();
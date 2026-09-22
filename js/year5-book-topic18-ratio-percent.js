// Topic 18: Year 5 Ratio, Proportion & Percent.
// Newly written SkillUP material covering Year 5 Chapter 13 as the curriculum reference.
(function(){
  if(!window.SKILLUP_MATH)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
  const simp=(a,b)=>{const g=gcd(a,b);return `${a/g}:${b/g}`};
  const frac=(a,b)=>{const g=gcd(a,b);a/=g;b/=g;return b===1?String(a):`${a}/${b}`};
  const money=n=>`$${Number(n).toFixed(2)}`;
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    let k=1;while(rest.length<3){const v=String(k++);if(v!==ans&&!rest.includes(v))rest.push(v);}
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,explanation};
  }
  function question(){
    const m=R(0,23);let a,b,c,d,n,ans;
    if(m===0){a=R(2,9);b=R(2,9);return Q(`There are ${a} red counters and ${b} blue counters. What is the ratio of red to blue?`,`${a}:${b}`,[`${a}:${b}`,`${b}:${a}`,`${a}:${a+b}`,`${a+b}:${b}`],'Keep the order named in the question.',`Red to blue is ${a}:${b}.`);}
    if(m===1){a=R(2,8);b=R(2,8);c=R(2,5);ans=`${a*c}:${b*c}`;return Q(`Which ratio is equivalent to ${a}:${b}?`,ans,[ans,`${a+c}:${b+c}`,`${a*c}:${b}`,`${a}:${b*c}`],'Multiply both parts of a ratio by the same number.',`${a}:${b} × ${c} gives ${ans}.`);}
    if(m===2){a=R(2,10);b=R(2,10);c=R(2,5);ans=simp(a*c,b*c);return Q(`Write ${a*c}:${b*c} in simplest form.`,ans,[ans,`${a}:${b*c}`,`${a*c}:${b}`,`${a+b}:${c}`],'Divide both parts by their greatest common factor.',`${a*c}:${b*c} simplifies to ${ans}.`);}
    if(m===3){a=R(2,7);b=R(3,9);c=R(2,5);ans=a*c;return Q(`Find n: ${a}/${b} = n/${b*c}.`,ans,[ans,a*c+b,a+c,b*c],'Use equivalent ratios: multiply numerator and denominator by the same factor.',`${b}×${c}=${b*c}, so ${a}×${c}=${ans}.`);}
    if(m===4){a=R(2,8);b=R(2,9);c=R(2,6);const x=a*c,y=b*c;return Q(`Do ${a}:${b} and ${x}:${y} form a proportion?`,'Yes',['Yes','No','Only if both are simplified','Cannot tell'],'Equivalent ratios form a proportion.','Both parts were multiplied by the same number, so the ratios are equal.');}
    if(m===5){a=R(2,9);b=R(2,9);c=R(2,8);d=R(2,8);const yes=a*d===b*c;ans=yes?'Yes':'No';return Q(`Do ${a}/${b} and ${c}/${d} form a proportion?`,ans,[ans,yes?'No':'Yes','Only if denominators match','Cannot tell'],'Compare cross products.',`${a}×${d}=${a*d} and ${b}×${c}=${b*c}, so the answer is ${ans}.`);}
    if(m===6){a=R(2,8);b=R(3,10);c=R(2,6);ans=b*c;return Q(`${a} cups serve ${b} people. At the same rate, ${a*c} cups serve how many people?`,ans,[ans,b+c,b*c+a,a*c],'Scale both quantities by the same factor.',`${a}→${a*c} is ×${c}, so ${b}→${b*c}.`);}
    if(m===7){a=pick([2,4,5,10,20,25,50]);b=R(1,a-1);ans=`${Math.round(100*b/a)}%`;return Q(`What percent is ${b} out of ${a}?`,ans,[ans,`${b}%`,`${a-b}%`,`${Math.round(100*a/b)}%`],'Percent means “per hundred”. Convert the fraction to an equivalent amount out of 100.',`${b}/${a} = ${ans}.`);}
    if(m===8){const set=pick([[1,2,'50%'],[1,4,'25%'],[3,4,'75%'],[1,5,'20%'],[2,5,'40%'],[3,5,'60%']]);return Q(`Write ${set[0]}/${set[1]} as a percent.`,set[2],[set[2],'10%','30%','80%'],'Rename the fraction as an equivalent fraction out of 100.',`${set[0]}/${set[1]} = ${set[2]}.`);}
    if(m===9){const p=pick([5,10,20,25,30,40,50,60,75,80]);ans=frac(p,100);return Q(`Write ${p}% as a fraction in simplest form.`,ans,[ans,`${p}/10`,`1/${p}`,`${100-p}/100`],'Write the percent over 100, then simplify.',`${p}% = ${p}/100 = ${ans}.`);}
    if(m===10){const p=pick([5,8,12,25,40,65,75,90]);ans=(p/100).toFixed(2);return Q(`Write ${p}% as a decimal.`,ans,[ans,(p/10).toFixed(2),(p/1000).toFixed(3),String(p)],'Move the decimal point two places left.',`${p}% = ${ans}.`);}
    if(m===11){const dec=pick([0.05,0.12,0.25,0.4,0.65,0.75,0.9,1.2]);ans=`${dec*100}%`;return Q(`Write ${dec} as a percent.`,ans,[ans,`${dec*10}%`,`${dec}%`,`${dec*1000}%`],'Move the decimal point two places right and add %.',`${dec} = ${ans}.`);}
    if(m===12){const p=pick([10,20,25,30,40,50,60,75]);n=pick([40,60,80,100,120,160,200,240]);ans=p*n/100;if(!Number.isInteger(ans))return question();return Q(`Find ${p}% of ${n}.`,ans,[ans,n-p,p+n,Math.round(n*(100-p)/100)],'Write the percent as a decimal or fraction, then multiply.',`${p}% of ${n} = ${p/100}×${n} = ${ans}.`);}
    if(m===13){const p=pick([10,20,25,50]);n=pick([40,60,80,100,120]);const part=p*n/100;ans=n;return Q(`${p}% of a number is ${part}. What is the number?`,ans,[ans,part*2,part+p,n+p],'Work backwards: divide the part by the percent as a decimal.',`${part} ÷ ${p/100} = ${n}.`);}
    if(m===14){const p=pick([20,25,50,75]);n=pick([80,120,160,200]);const part=p*n/100;ans=`${p}%`;return Q(`${part} is what percent of ${n}?`,ans,[ans,`${100-p}%`,`${Math.round(part/n)}%`,`${part}%`],'Divide the part by the whole, then convert to percent.',`${part}/${n} = ${p}/100 = ${p}%.`);}
    if(m===15){const p=pick([19,23,48,52,73]);const n=pick([198,203,397,503]);const est=Math.round(p/10)*10/100*Math.round(n/100)*100;ans=String(est);return Q(`Estimate ${p}% of ${n}.`,ans,[ans,String(Math.round(p*n/100)),String(est+20),String(Math.max(0,est-20))],'Round the percent and number to compatible values first.',`${p}% ≈ ${Math.round(p/10)*10}% and ${n} ≈ ${Math.round(n/100)*100}, giving about ${ans}.`);}
    if(m===16){const price=pick([40,60,80,100,120,200]);const p=pick([10,20,25,30,50]);const disc=price*p/100;if(!Number.isInteger(disc))return question();return Q(`An item costs $${price} and is discounted by ${p}%. What is the discount?`,money(disc),[money(disc),money(price-disc),money(price+disc),money(p)],'Discount = rate of discount × regular price.',`${p}% of $${price} = ${money(disc)}.`);}
    if(m===17){const price=pick([40,60,80,100,120,200]);const p=pick([10,20,25,50]);const sale=price*(100-p)/100;return Q(`An item costs $${price} and is discounted by ${p}%. What is the sale price?`,money(sale),[money(sale),money(price*p/100),money(price+p),money(price-p)],'Find the discount, then subtract it from the regular price.',`Sale price = $${price} − ${money(price*p/100)} = ${money(sale)}.`);}
    if(m===18){const total=pick([100,120,160,200,240,300]);const p=pick([10,20,25,30,40,50]);const part=total*p/100;if(!Number.isInteger(part))return question();return Q(`A school has ${total} students. ${p}% travel by bus. How many travel by bus?`,part,[part,total-part,p,total],'Find the percent of the total.',`${p}% of ${total} = ${part}.`);}
    if(m===19){a=R(2,6);b=R(3,9);c=R(2,6);ans=b*c;return Q(`Pens and pencils are sold in the ratio ${a}:${b}. If ${a*c} pens are sold, how many pencils are sold?`,ans,[ans,a*c,b+c,a+b*c],'Scale both parts of the ratio equally.',`${a}→${a*c} is ×${c}, so ${b}→${b*c}.`);}
    if(m===20){const p1=pick([20,25,30,40]),p2=pick([20,25,30,40]);const a1=pick([40,60,80,100]),a2=pick([40,60,80,100]);const v1=p1*a1/100,v2=p2*a2/100;ans=v1>v2?'first':v2>v1?'second':'equal';return Q(`Compare ${p1}% of ${a1} with ${p2}% of ${a2}. Which is greater?`,ans,[ans,'first','second','equal'],'Calculate each percent amount before comparing.',`${p1}% of ${a1}=${v1}; ${p2}% of ${a2}=${v2}.`);}
    if(m===21){const total=pick([80,100,120,160,200]);const p=pick([20,25,40,50,60,75]);const selected=total*p/100;return Q(`${selected} of ${total} students chose art. What percent chose art?`,`${p}%`,[`${p}%`,`${100-p}%`,`${selected}%`,`${Math.round(selected/total)}%`],'Use part ÷ whole × 100.',`${selected}/${total} = ${p}%.`);}
    if(m===22){const income=pick([2000,2400,3000,3600]);const p=pick([10,15,20,25,30,35]);const amount=income*p/100;return Q(`A family budgets ${p}% of $${income} for one category. How much is budgeted?`,money(amount),[money(amount),money(income-amount),money(p),money(income/p)],'Find the percent of the total income.',`${p}% of $${income} = ${money(amount)}.`);}
    a=R(2,6);b=R(2,9);c=R(2,5);const total=a*c+b*c;ans=`${a*c}:${b*c}`;return Q(`A mixture uses red and blue in the ratio ${a}:${b}. A larger batch uses ${total} parts altogether with the same ratio. Which ratio could represent red:blue in the larger batch?`,ans,[ans,`${a+c}:${b+c}`,`${a*c+b}:${b}`,`${a}:${b*c}`],'Equivalent mixtures keep the same ratio.',`${a}:${b} scaled by ${c} is ${ans}.`);
  }

  if(window.TY_YEAR5_TESTS){
    window.TY_YEAR5_TESTS.topics=window.TY_YEAR5_TESTS.topics.filter(x=>x[0]!=='ratiopercent');
    const i=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='integers');
    window.TY_YEAR5_TESTS.topics.splice(i>=0?i+1:window.TY_YEAR5_TESTS.topics.length-1,0,['ratiopercent','%','Ratio, Proportion & Percent','Equivalent ratios, proportions, percent conversions, percent of a number and discounts']);
    const oldQ=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=t=>t==='ratiopercent'?question():oldQ(t);
  }

  const oldLearn=window.SKILLUP_MATH.learn;
  const oldEnhanced=window.SKILLUP_MATH.enhanced;
  window.SKILLUP_MATH.learn=function(g,t,fallback){
    if(String(g)==='5'&&t==='ratiopercent')return{
      title:'Ratio, Proportion & Percent',
      concept:'A ratio compares two quantities by division. Equivalent ratios have the same value, and a proportion states that two ratios are equal. Percent means “per hundred”, so fractions, decimals and percents are closely connected.',
      steps:[
        'Write ratios in the order asked. A ratio can be written as 3 to 5, 3:5, or 3/5. The order matters.',
        'Simplify a ratio by dividing both parts by the same common factor. Make an equivalent ratio by multiplying or dividing both parts by the same number.',
        'A proportion is an equation showing two equal ratios. You can test a proportion by simplifying both ratios or by checking that the cross products are equal.',
        'To find a missing term in a proportion, scale both parts equally or use cross products.',
        'Percent means per hundred. Convert a fraction to percent by making an equivalent fraction out of 100; convert percent to a fraction by writing it over 100 and simplifying.',
        'Percent to decimal: move the decimal point two places left. Decimal to percent: move it two places right and add the percent sign.',
        'To find a percent of a number, write the percent as a decimal or fraction and multiply. To estimate, use nearby friendly percents such as 10%, 25%, 50% or 75%.',
        'For discounts, first find the percent of the regular price. The sale price is regular price minus discount.'
      ],
      examples:[
        {q:'Simplify the ratio 18:30.',steps:['The greatest common factor of 18 and 30 is 6.','Divide both parts by 6.'],answer:'3:5'},
        {q:'Do 6/9 and 8/12 form a proportion?',steps:['Simplify 6/9 to 2/3.','Simplify 8/12 to 2/3.','The ratios are equal.'],answer:'Yes'},
        {q:'2 cups of rice serve 6 people. How many people do 3 cups serve?',steps:['2 cups → 6 people.','3 cups is 1.5 times as much.','6 × 1.5 = 9.'],answer:'9 people'},
        {q:'Write 3/4 as a percent.',steps:['3/4 = 75/100.','75 out of 100 means 75%.'],answer:'75%'},
        {q:'Write 0.42 as a percent.',steps:['Move the decimal two places right.','Add the percent sign.'],answer:'42%'},
        {q:'Find 25% of 60.',steps:['25% = 1/4.','1/4 of 60 = 15.'],answer:'15'},
        {q:'A $80 item is 25% off. Find the sale price.',steps:['25% of $80 = $20.','$80 − $20 = $60.'],answer:'$60'}
      ],
      mistake:'Do not reverse the order of a ratio. Do not add the same number to both parts to make an equivalent ratio. When finding a sale price, subtract the discount from the original price rather than giving the discount itself.',
      quick:'Check: Can you explain why 4:10 and 6:15 are equivalent, change 0.35 to 35%, and find 20% of 150?'
    };
    return oldLearn(g,t,fallback);
  };
  window.SKILLUP_MATH.enhanced=function(g,t){return String(g)==='5'&&t==='ratiopercent'?question():oldEnhanced(g,t)};
})();
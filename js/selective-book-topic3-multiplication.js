// Selective Topic 3: Multiplication reasoning.
// Newly written SkillUP questions inspired by the multiplication reasoning styles in the uploaded Grade 5 book.
(function(){
  if(!window.SKILLUP_MR_EXTRA)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,pick=a=>a[R(0,a.length-1)],shuffle=a=>[...a].sort(()=>Math.random()-.5),fmt=n=>Number(n).toLocaleString('en-AU');
  const Q=(text,answer,choices,tip)=>({text,answer:String(answer),choices:shuffle([...new Set(choices.map(String))]),tip,topic:'sel_multiplication',name:'Multiplication Reasoning'});
  const near=(n,p)=>Math.round(n/p)*p;
  function question(){const t=R(0,10);let a,b,c,ans;
    if(t===0){a=R(24,96);b=R(12,48);const e=near(a,10)*near(b,10),exact=a*b;ans=Math.abs(exact-e)<Math.abs(exact-(e+500))?fmt(e):fmt(e+500);return Q(`Which is the best estimate for ${a} × ${b}?`,ans,[ans,fmt(exact),fmt(e+500),fmt(Math.max(0,e-500))],'Round both factors to friendly tens and compare the possible estimates.');}
    if(t===1){const product=pick([72,84,96,108,120,144]);const pairs=[];for(let i=1;i<=product;i++)if(product%i===0&&i<=product/i)pairs.push([i,product/i]);const p=pick(pairs.filter(x=>x[0]>1));ans=`${p[0]} and ${p[1]}`;return Q(`Two whole-number factors have product ${product}. Their difference is ${Math.abs(p[1]-p[0])}. Which pair could they be?`,ans,[ans,`1 and ${product-1}`,`2 and ${product-2}`,`${p[0]+1} and ${Math.max(1,p[1]-1)}`],'The pair must satisfy both clues: correct product and correct difference.');}
    if(t===2){a=R(20,80);b=R(10,40);const total=a*b;const missing=pick([a,b]);ans=missing;return Q(`□ × ${missing===a?b:a} = ${fmt(total)}. What is □?`,ans,[ans,ans+1,Math.max(1,ans-1),total],'Reverse the multiplication using division.');}
    if(t===3){a=R(30,90);b=R(12,39);const split=Math.floor(b/10)*10,ones=b%10;ans=a*b;return Q(`A student works out ${a} × ${b} as (${a} × ${split}) + (${a} × ${ones}). What answer should the student get?`,fmt(ans),[fmt(ans),fmt(a*(split+1)),fmt(a+split+ones),fmt(a*split)],'The distributive method is correct: add the two partial products.');}
    if(t===4){a=R(200,900);b=pick([104,205,306,407,508]);ans=a*b;return Q(`What is ${a} × ${b}?`,fmt(ans),[fmt(ans),fmt(ans+a),fmt(ans+1000),fmt(Math.max(0,ans-a))],'The zero digit makes one partial product zero, but the other place values still matter.');}
    if(t===5){const rows=R(18,42),seats=R(24,48),shows=R(2,5);ans=rows*seats*shows;return Q(`A hall has ${rows} rows with ${seats} seats in each row. All seats are filled for ${shows} performances. How many seat-uses are there altogether?`,fmt(ans),[fmt(ans),fmt(rows*seats),fmt(rows+seats+shows),fmt(ans-shows)],'Find the capacity of one performance, then multiply by the number of performances.');}
    if(t===6){const price=R(125,995)/100,qty=R(12,48);ans=price*qty;return Q(`${qty} identical books cost $${price.toFixed(2)} each. What is the total cost?`,`$${ans.toFixed(2)}`,[`$${ans.toFixed(2)}`,`$${(price+qty).toFixed(2)}`,`$${(ans+10).toFixed(2)}`,`$${Math.max(0,ans-10).toFixed(2)}`],'Estimate first, then multiply the price by the quantity and keep two decimal places.');}
    if(t===7){a=R(12,59);b=R(12,59);const exact=a*b,d=String(exact).length;ans=`${d} digits`;return Q(`Without doing the full multiplication first, how many digits will the product ${a} × ${b} have?`,ans,[ans,`${Math.max(1,d-1)} digits`,`${d+1} digits`,'Cannot be determined'],'Estimate the product and compare it with 10, 100, 1,000 and 10,000.');}
    if(t===8){a=pick([30,40,50,60,70,80,90]);b=pick([200,300,400,500,600,700,800]);ans=a*b;return Q(`Which product is equal to ${fmt(ans)}?`,`${a} × ${b}`,[`${a} × ${b}`,`${a/10} × ${b}`,`${a} × ${b/10}`,`${a+10} × ${b}`],'Use the non-zero digits and then account for the place-value zeros.');}
    if(t===9){const n=R(100,499),m=R(100,399),exact=n*m,e=near(n,100)*near(m,100);ans=Math.abs(exact-e)<=50000?'reasonable':'not reasonable';return Q(`A student estimates ${n} × ${m} as ${fmt(e)}. Is this a reasonable estimate?`,ans,['reasonable','not reasonable'],'Compare the rounded-factor estimate with the expected size of the exact product.');}
    a=R(120,950);b=R(15,75);c=R(1000,9000);ans=a*b+c;return Q(`A warehouse receives ${b} cartons with ${a} items in each carton and already has ${fmt(c)} items. How many items are there altogether?`,fmt(ans),[fmt(ans),fmt(a*b),fmt(a+b+c),fmt(ans-c)],'Multiply the new cartons first, then add the existing stock.');
  }
  const topic=['sel_multiplication','×','Multiplication Reasoning','Factors, estimates, partial products, money and multi-step products'];
  if(!window.SKILLUP_MR_EXTRA.topics.some(x=>x[0]==='sel_multiplication')){
    const i=window.SKILLUP_MR_EXTRA.topics.findIndex(x=>x[0]==='sel_estimation');
    window.SKILLUP_MR_EXTRA.topics.splice(i>=0?i+1:2,0,topic);
  }
  const old=window.SKILLUP_MR_EXTRA.question.bind(window.SKILLUP_MR_EXTRA);
  window.SKILLUP_MR_EXTRA.question=id=>id==='sel_multiplication'?question():old(id);
})();
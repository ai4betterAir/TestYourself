// Selective Topic 9: Decimal Reasoning.
// Newly written SkillUP questions inspired by decimal reasoning styles in the uploaded Grade 5 book.
(function(){
  if(!window.SKILLUP_MR_EXTRA)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,pick=a=>a[R(0,a.length-1)],shuffle=a=>[...a].sort(()=>Math.random()-.5),uniq=a=>[...new Set(a.map(String))];
  const f=(n,dp=2)=>Number(n).toFixed(dp);
  const Q=(text,answer,choices,tip)=>({text,answer:String(answer),choices:shuffle(uniq(choices.map(String))),tip,topic:'sel_decimals',name:'Decimal Reasoning'});
  function question(){
    const t=R(0,12);let a,b,c,ans;
    if(t===0){a=R(100,999)/100;b=R(100,999)/100;c=R(100,999)/100;ans=f(a+b-c);return Q(`A water tank contains ${f(a)} L. ${f(b)} L is added, then ${f(c)} L is used. How much remains?`,`${ans} L`,[`${ans} L`,`${f(a+b+c)} L`,`${f(Math.abs(a-b-c))} L`,`${f(a-b+c)} L`],'Translate the story into add, then subtract.');}
    if(t===1){a=R(10,999)/1000;const opts=[a,a+.001,a+.01,a+.1].map(x=>Number(x.toFixed(3)));ans=String(Math.min(...opts));return Q(`Which is the smallest number: ${opts.join(', ')}?`,ans,opts.map(String),'Compare tenths, hundredths and thousandths from left to right.');}
    if(t===2){a=R(100,999)/100;const p=pick([10,100,1000]);ans=String(Number((a*p).toFixed(5)));return Q(`A decimal is multiplied by ${p} and becomes ${ans}. What was the original number?`,String(a),[String(a),String(Number((a/10).toFixed(5))),String(Number((a*10).toFixed(5))),ans],'Reverse the operation by dividing by the same power of ten.');}
    if(t===3){a=R(20,900)/100;b=R(20,900)/100;const exact=a*b;const estimate=Math.round(a)*Math.round(b);ans=Math.abs(exact-estimate)<Math.max(2,exact*.35)?'reasonable':'not reasonable';return Q(`A student estimates ${a} × ${b} as ${estimate}. Is that estimate reasonable?`,ans,['reasonable','not reasonable'],'Compare the rounded factors with the original factors and judge the size of the product.');}
    if(t===4){b=R(2,9);const q=R(10,90)/10;a=Number((q*b).toFixed(1));ans=String(q);return Q(`□ × ${b} = ${a}. What is □?`,ans,[ans,String(Number((q+1).toFixed(1))),String(Number((q-1).toFixed(1))),String(a)],'Use division to undo the multiplication.');}
    if(t===5){const price=R(125,895)/100,items=R(3,9),paid=Math.ceil(price*items/5)*5;const change=paid-price*items;ans=`$${f(change)}`;return Q(`${items} identical items cost $${f(price)} each. You pay $${f(paid)}. What change should you receive?`,ans,[ans,`$${f(paid-price)}`,`$${f(price*items)}`,`$${f(change+1)}`],'Find total cost first, then subtract from the amount paid.');}
    if(t===6){a=R(100,999)/100;b=R(100,999)/100;const x=a+b,y=a*b;ans=x>y?'sum':'product';return Q(`For ${a} and ${b}, which is greater: their sum or their product?`,ans,['sum','product','They are equal','Cannot be determined'],'Compute or estimate both quantities; decimals between 1 and 10 do not follow one fixed rule.');}
    if(t===7){a=R(100,999)/100;b=R(2,9);const total=a*b;ans=f(a);return Q(`${b} equal lengths total ${f(total)} m. What is each length?`,`${ans} m`,[`${ans} m`,`${f(total/b+1)} m`,`${f(total)} m`,`${f(a*b)} m`],'Equal share means divide the total by the number of parts.');}
    if(t===8){const x=R(1,9),y=R(1,9),z=R(1,9);ans=(x+y/10+z/100).toFixed(2);return Q(`A number has ${x} ones, ${y} tenths and ${z} hundredths. What is the number?`,ans,[ans,(x+y/100+z/10).toFixed(2),(x+y+z/100).toFixed(2),`${x}${y}${z}`],'Build the number from place values.');}
    if(t===9){a=R(100,999)/100;b=R(100,999)/100;const exact=a-b;ans=f(exact);return Q(`Which calculation gives the exact distance between ${f(a)} and ${f(b)} on a number line?`,ans,[ans,f(a+b),f(Math.abs(a-b)+1),f(Math.max(a,b))],'Distance between two numbers is the absolute difference.');}
    if(t===10){a=R(10,999)/100;const delta=pick([.01,.1,1]);ans=f(a+3*delta,2);return Q(`A sequence increases by ${delta}: ${f(a,2)}, ${f(a+delta,2)}, ${f(a+2*delta,2)}, ... What is next?`,ans,[ans,f(a+4*delta,2),f(a+2*delta,2),f(a+3*delta+.1,2)],'Find the constant decimal step.');}
    if(t===11){a=R(100,999)/100;b=R(100,999)/100;c=R(100,999)/100;const vals=[a,b,c].sort((x,y)=>x-y);ans=f(vals[1]);return Q(`Which is the middle value when these are ordered: ${[a,b,c].map(x=>f(x)).join(', ')}?`,ans,vals.map(x=>f(x)),'Order by ones first, then tenths and hundredths.');}
    a=R(20,900)/100;b=R(2,8);c=R(1,9)/10;ans=f(a*b-c);return Q(`Evaluate ${a} × ${b} − ${c}.`,ans,[ans,f((a-c)*b),f(a*(b-c)),f(a+b-c)],'Follow order of operations: multiply before subtracting.');
  }
  if(!window.SKILLUP_MR_EXTRA.topics.some(x=>x[0]==='sel_decimals')){
    const i=window.SKILLUP_MR_EXTRA.topics.findIndex(x=>x[0]==='sel_fraction_multdiv');
    window.SKILLUP_MR_EXTRA.topics.splice(i>=0?i+1:8,0,['sel_decimals','.','Decimal Reasoning','Place value, estimation, money, powers of ten and multi-step decimal problems']);
  }
  const old=window.SKILLUP_MR_EXTRA.question.bind(window.SKILLUP_MR_EXTRA);
  window.SKILLUP_MR_EXTRA.question=id=>id==='sel_decimals'?question():old(id);
})();
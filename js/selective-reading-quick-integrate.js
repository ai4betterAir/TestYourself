(function(){
  const quick=window.SKILLUP_READING_QUICK;
  const reading=window.SKILLUP_READING;
  if(quick&&reading){
    if(!reading.topics.some(x=>x[0]==='quick')) reading.topics.unshift(...quick.topics);
    const original=reading.question.bind(reading);
    reading.question=function(id='mixed',mode='mix'){
      if(id==='quick') return quick.question(mode);
      return original(id,mode);
    };
  }

  const mr=window.SKILLUP_MR_EXTRA;
  if(!mr)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const fmt=n=>Number(n).toLocaleString('en-AU');
  const Q=(text,answer,choices,tip)=>({text,answer:String(answer),choices:shuffle([...new Set(choices.map(String))]),tip,topic:'sel_number',name:'Number & Place Value'});
  function numberQuestion(){
    const t=R(0,10);
    if(t===0){
      const n=R(200000000,8999999999),p=pick([1000,10000,100000,1000000,10000000]),d=Math.floor(n/p)%10;if(!d)return numberQuestion();
      const answer=fmt(d*p);
      return Q(`In ${fmt(n)}, the digit ${d} is worth how much?`,answer,[answer,fmt(d*p*10),fmt(Math.max(1,d*p/10)),String(d)],'Identify the exact place value before calculating the digit’s value.');
    }
    if(t===1){
      const base=R(200000000,9000000000),change=pick([10000,100000,1000000]),answer=base+change;
      return Q(`A number is ${fmt(change)} greater than ${fmt(base)}. Which number is it?`,fmt(answer),[fmt(answer),fmt(base+change*10),fmt(base-change),fmt(base)],'Only one place-value amount is being added.');
    }
    if(t===2){
      const a=R(100000000,999999999),b=a+R(1000,500000),c=a-R(1000,500000),d=b+R(1000,500000),vals=[a,b,c,d].sort((x,y)=>x-y),answer=fmt(vals[2]);
      return Q(`Four numbers are ${[a,b,c,d].map(fmt).join(', ')}. Which is the second greatest?`,answer,vals.map(fmt),'Order the numbers first, then choose the one just below the greatest.');
    }
    if(t===3){
      const n=R(100000,900000),d=Math.floor(n/10000)%10,answer=d*100000;
      return Q(`A six-digit number has ${d} in the ten-thousands place. If that digit moved one place to the left, what would its value become?`,fmt(answer),[fmt(answer),fmt(answer/10),fmt(answer/100),String(d)],'Moving a digit one place left multiplies its value by 10.');
    }
    if(t===4){
      const x=R(100,900)/1000,y=x+0.001,answer=`${y.toFixed(3)} is 0.001 greater than ${x.toFixed(3)}`;
      return Q('Which statement is true?',answer,[answer,`${y.toFixed(3)} is 0.01 greater than ${x.toFixed(3)}`,`${x.toFixed(3)} is greater than ${y.toFixed(3)}`,'The two numbers are equal'],'Compare the thousandths place carefully.');
    }
    if(t===5){
      const digits=shuffle([1,3,4,6,7,9]).slice(0,5),possible=digits.filter(x=>x<7);if(!possible.length)return numberQuestion();const first=Math.max(...possible),rest=digits.filter(x=>x!==first).sort((x,y)=>y-x),answer=Number(String(first)+rest.join(''));
      return Q(`Use the digits ${digits.join(', ')} once each. What is the greatest 5-digit number less than 70,000?`,fmt(answer),[fmt(answer),fmt(Number([...digits].sort((x,y)=>y-x).join(''))),fmt(Number([...digits].sort((x,y)=>x-y).join(''))),fmt(answer-90)],'Choose the greatest possible ten-thousands digit below 7, then maximise the remaining places.');
    }
    if(t===6){
      const a=R(2,8),b=R(1,9),c=R(1,9),answer=a*1000000000+b*1000000+c*1000;
      return Q(`Which standard number matches ${a} billion + ${b} million + ${c} thousand?`,fmt(answer),[fmt(answer),fmt(answer+100000),fmt(answer+1000),fmt(answer*10)],'Keep billions, millions, thousands and ones in their correct 3-digit periods.');
    }
    if(t===7){
      const base=R(100,900)/100,delta=pick([0.001,0.01,0.1]),answer=(base-delta).toFixed(3);
      return Q(`What number is ${delta} less than ${base.toFixed(3)}?`,answer,[answer,(base+delta).toFixed(3),(base-delta*10).toFixed(3),base.toFixed(3)],'Subtract in the correct decimal place.');
    }
    if(t===8){
      const h=R(3,8),tens=R(1,9),ones=R(1,9),answer=h*100+tens*10+ones;
      return Q(`I am a 3-digit number. My hundreds digit is ${h}. My tens digit is ${tens}. My ones digit is ${ones}. What number am I?`,answer,[answer,h*100+ones*10+tens,tens*100+h*10+ones,ones*100+tens*10+h],'Match each clue to its place before assembling the number.');
    }
    if(t===9){
      const start=R(40,300)/1000,step=pick([0.002,0.005,0.01]),answer=(start+4*step).toFixed(3);
      return Q(`A decimal pattern is ${start.toFixed(3)}, ${(start+step).toFixed(3)}, ${(start+2*step).toFixed(3)}, ${(start+3*step).toFixed(3)}, … What is the next term?`,answer,[answer,(start+5*step).toFixed(3),(start+3*step).toFixed(3),(start+4*step+0.01).toFixed(3)],'Find the constant difference between consecutive terms.');
    }
    const n=R(100000,999999),thousands=Math.floor(n/1000)%10,hundreds=Math.floor(n/100)%10,tv=thousands*1000,hv=hundreds*100;
    const answer=tv>hv?'thousands digit':hv>tv?'hundreds digit':'They are equal';
    return Q(`In ${fmt(n)}, which is larger: the value of the thousands digit or the value of the hundreds digit?`,answer,['thousands digit','hundreds digit','They are equal','Cannot be determined'],'Compare place values, not just the digit symbols: thousands digit × 1,000 versus hundreds digit × 100.');
  }
  if(!mr.topics.some(x=>x[0]==='sel_number'))mr.topics.unshift(['sel_number','123','Number & Place Value','Large numbers, decimal place value, ordering and digit clues']);
  const oldMr=mr.question.bind(mr);
  mr.question=function(id){return id==='sel_number'?numberQuestion():oldMr(id)};
})();
// Book-informed Selective topics are kept in separate modules for maintainability.
document.write('<script src="js/selective-book-topic2-estimation.js"><\/script>');
document.write('<script src="js/selective-book-topic3-multiplication.js"><\/script>');
document.write('<script src="js/selective-book-topic4-division.js"><\/script>');
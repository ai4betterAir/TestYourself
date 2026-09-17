// Topic 23: Selective Rational Numbers & Number Lines.
(function(){
  const mr=window.SKILLUP_MR_EXTRA;if(!mr)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,pick=a=>a[R(0,a.length-1)],shuffle=a=>[...a].sort(()=>Math.random()-.5),uniq=a=>[...new Set(a.map(String))];
  const fmt=n=>Number.isInteger(n)?String(n):String(Number(n.toFixed(2)));
  function Q(text,answer,choices,tip){const ans=String(answer);let rest=uniq(choices.map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);let k=1;while(rest.length<3){const v=String(k++);if(v!==ans&&!rest.includes(v))rest.push(v);}return{text,answer:ans,choices:shuffle([ans,...rest]),tip,topic:'sel_rational_numbers',name:'Rational Numbers & Number Lines'};}
  function question(){const m=R(0,14);let a,b,c,ans;
    if(m===0){a=pick([-3.75,-2.5,-1.25,0.5,2.75]);ans=fmt(-a);return Q(`Which number is the opposite of ${fmt(a)}?`,ans,[ans,fmt(a),0,fmt(a+1)],'Opposites are equal distances from 0 in opposite directions.');}
    if(m===1){a=pick([-2.75,-1.5,-0.25]);b=pick([0.5,1.25,2.5]);c=pick([-1,0,1]);const s=[a,b,c].sort((x,y)=>x-y);ans=s.map(fmt).join(', ');return Q(`Order ${[a,b,c].map(fmt).join(', ')} from least to greatest.`,ans,[ans,[...s].reverse().map(fmt).join(', '),[b,a,c].map(fmt).join(', '),[c,b,a].map(fmt).join(', ')],'Picture the values from left to right on a number line.');}
    if(m===2){a=pick([0.25,0.5,0.75,1.25,1.5]);ans='They are at the same point';return Q(`What is true about ${a} and its equivalent fraction on a number line?`,ans,[ans,'They must be opposites','The fraction must be negative','They cannot both be rational'],'Equivalent forms represent one rational number.');}
    if(m===3){a=pick([1.2,2.4,3.6,4.8]);b=-a;ans='0';return Q(`What is the midpoint between ${fmt(b)} and ${fmt(a)}?`,ans,[ans,fmt(a/2),fmt(b/2),fmt(a)],'Opposites are symmetric about 0.');}
    if(m===4){a=pick([2.5,4.25,6.75,8.5]);ans=fmt(-a);return Q(`A share price falls ${a} points. Which rational number represents the change?`,ans,[ans,fmt(a),0,fmt(-a-1)],'A fall is negative.');}
    if(m===5){a=pick([10.5,25.25,40.75,55.5]);ans=fmt(a);return Q(`An account receives a deposit of $${a.toFixed(2)}. What signed rational number represents the change?`,ans,[ans,fmt(-a),0,fmt(a+1)],'A deposit is a positive change.');}
    if(m===6){a=pick([-3.5,-2.25,-1.5,-0.75]);b=pick([0.25,1.25,2.5]);ans=fmt(Math.abs(a)>Math.abs(b)?a:b);return Q(`Which is farther from 0: ${fmt(a)} or ${fmt(b)}?`,ans,[ans,fmt(ans===fmt(a)?b:a),'They are equally far','Cannot be determined'],'Compare distance from 0, not which number is greater.');}
    if(m===7){a=pick([-2.5,-1.75,-0.5,0.75,1.5]);b=-a;ans=fmt(a+b);return Q(`${fmt(a)} + ${fmt(b)} = ?`,ans,[ans,fmt(a),fmt(b),fmt(2*a)],'A number plus its opposite equals 0.');}
    if(m===8){a=pick([-1.5,-0.75,0.25,1.25]);b=pick([0.5,1,1.5,2]);c=a+b;ans=fmt(c);return Q(`Start at ${fmt(a)} on a number line and move ${fmt(b)} units right. Where do you land?`,ans,[ans,fmt(a-b),fmt(b-a),fmt(-c)],'Moving right means add.');}
    if(m===9){a=pick([-1.5,-0.75,0.25,1.25]);b=pick([0.5,1,1.5,2]);c=a-b;ans=fmt(c);return Q(`Start at ${fmt(a)} on a number line and move ${fmt(b)} units left. Where do you land?`,ans,[ans,fmt(a+b),fmt(b-a),fmt(-c)],'Moving left means subtract.');}
    if(m===10){const sets=[['−2.5','integer'],['3','integer'],['0','whole number'],['3/4','fraction'],['1.25','terminating decimal']];const [v,t]=pick(sets);ans='rational number';return Q(`${v} is a ${t}. Which larger number family from the book also contains it?`,ans,[ans,'non-number','irrational only','cannot be placed on a number line'],'The book shows whole numbers, integers, fractions and terminating/repeating decimals inside the rational-number family.');}
    if(m===11){a=pick([0.25,0.5,0.75,1.25]);b=pick([0.5,1,1.5]);const x=-a,y=b;ans=fmt(y-x);return Q(`What is the distance between ${fmt(x)} and ${fmt(y)} on a number line?`,ans,[ans,fmt(Math.abs(x+y)),fmt(a+b/2),fmt(y)],'Distance across 0 is the sum of the distances to 0.');}
    if(m===12){a=pick([-3.25,-2.5,-1.75,-0.5]);b=pick([-3,-2,-1,0]);ans=fmt(Math.max(a,b));return Q(`Which is greater: ${fmt(a)} or ${fmt(b)}?`,ans,[ans,fmt(Math.min(a,b)),'They are equal','Cannot tell'],'For negative values, the one farther right is greater.');}
    if(m===13){a=pick([0.2,0.4,0.6,0.8]);b=-a;ans=`${fmt(b)}, 0, ${fmt(a)}`;return Q(`Which order shows an opposite pair with zero between them?`,ans,[ans,`${fmt(a)}, 0, ${fmt(b)}`,`0, ${fmt(b)}, ${fmt(a)}`,`${fmt(b)}, ${fmt(a)}, 0`],'Opposites lie on different sides of 0.');}
    a=pick([-4.5,-3.25,-2.75,2.75,3.25,4.5]);ans=fmt(-a);return Q(`A rational number is ${fmt(a)}. Which number has the same distance from 0 but the opposite sign?`,ans,[ans,fmt(a),0,fmt(Math.abs(a)+1)],'Same distance and opposite sign means the opposite number.');
  }
  mr.topics=mr.topics.filter(x=>x[0]!=='sel_rational_numbers');
  const i=mr.topics.findIndex(x=>x[0]==='sel_logic_venn');
  mr.topics.splice(i>=0?i+1:mr.topics.length,0,['sel_rational_numbers','ℚ','Rational Numbers & Number Lines','Signed rational numbers, opposites, number-line order and equivalent forms']);
  const old=mr.question.bind(mr);mr.question=id=>id==='sel_rational_numbers'?question():old(id);
})();
// Selective Topic 7: Fraction Addition & Subtraction Reasoning.
// Newly written SkillUP questions based on the structure and reasoning styles of the uploaded Grade 5 fraction chapter.
(function(){
  if(!window.SKILLUP_MR_EXTRA)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
  const lcm=(a,b)=>Math.abs(a*b)/gcd(a,b);
  const lcmAll=a=>a.reduce((x,y)=>lcm(x,y));
  function simp(n,d){const g=gcd(Math.abs(n),Math.abs(d));return[n/g,d/g]}
  function frac(n,d){const s=simp(n,d);return s[1]===1?String(s[0]):`${s[0]}/${s[1]}`}
  function mixed(n,d){const w=Math.floor(n/d),r=n%d;if(!r)return String(w);const s=simp(r,d);return w?`${w} ${s[0]}/${s[1]}`:`${s[0]}/${s[1]}`}
  const Q=(text,answer,choices,tip)=>({text,answer:String(answer),choices:shuffle(uniq(choices)),tip,topic:'sel_fraction_addsub',name:'Fraction Addition & Subtraction'});
  function question(){
    const t=R(0,13);let a,b,c,d,e,f,L,x,y,z,ans,w1,w2,n1,n2,d1,d2,total,left;
    if(t===0){
      const A=pick([[2,3],[3,4],[4,5],[5,6]]),B=pick([[1,4],[1,5],[2,7],[3,8]]),C=pick([[1,6],[1,8],[1,10],[2,9]]);L=lcmAll([A[1],B[1],C[1]]);x=A[0]*(L/A[1]);y=B[0]*(L/B[1]);z=C[0]*(L/C[1]);ans=mixed(x+y-z,L);
      return Q(`Evaluate ${A[0]}/${A[1]} + ${B[0]}/${B[1]} − ${C[0]}/${C[1]}.`,ans,[ans,mixed(x+y+z,L),frac(Math.abs(x-y-z),L),frac(x+y-z,L*2)],`Use one LCD (${L}) for all three fractions, then calculate left to right.`);
    }
    if(t===1){
      [d1,d2]=pick([[3,4],[4,5],[5,6],[6,8],[8,12]]);n1=R(1,d1-1);n2=R(1,d2-1);L=lcm(d1,d2);x=n1*(L/d1);y=n2*(L/d2);total=x+y;ans=frac(y,L);
      return Q(`${n1}/${d1} + □ = ${frac(total,L)}. What is □?`,ans,[ans,frac(x,L),frac(total,L),frac(Math.max(1,y+1),L)],'Work backward: subtract the known addend from the total.');
    }
    if(t===2){
      const A=pick([[7,8],[11,12],[9,10],[5,6]]),B=pick([[1,3],[1,4],[2,5],[3,8]]);L=lcm(A[1],B[1]);x=A[0]*(L/A[1]);y=B[0]*(L/B[1]);ans=frac(x-y,L);
      return Q(`A tank was ${A[0]}/${A[1]} full. After some water was used it was ${B[0]}/${B[1]} less full. What fraction of the tank remained?`,ans,[ans,frac(x+y,L),frac(Math.abs(A[0]-B[0]),Math.max(A[1],B[1])),'1/2'],'The amount remaining is starting fraction − fraction used.');
    }
    if(t===3){
      w1=R(4,9);d=pick([4,5,6,8]);n1=R(1,d-2);w2=R(1,w1-1);n2=R(n1+1,d-1);left=(w1*d+n1)-(w2*d+n2);ans=mixed(left,d);
      return Q(`${w1} ${n1}/${d} − ${w2} ${n2}/${d} = ?`,ans,[ans,mixed(left+d,d),`${w1-w2} ${frac(n2-n1,d)}`,mixed(Math.max(1,left-1),d)],'The top fraction is too small, so rename one whole before subtracting.');
    }
    if(t===4){
      const A=pick([[2,3],[3,4],[4,5]]),B=pick([[1,4],[1,6],[2,9]]);L=lcm(A[1],B[1]);x=A[0]*(L/A[1]);y=B[0]*(L/B[1]);const s=x+y;ans=s>L?'Greater than 1':s===L?'Exactly 1':'Less than 1';
      return Q(`Without fully simplifying, how should ${A[0]}/${A[1]} + ${B[0]}/${B[1]} be described?`,ans,['Less than 1','Exactly 1','Greater than 1','Cannot be determined'],'Use benchmark fractions or compare the renamed numerator total with the common denominator.');
    }
    if(t===5){
      const first=pick([[3,4],[5,6],[7,8]]),used=pick([[1,6],[1,4],[2,5]]),added=pick([[1,3],[1,2],[3,8]]);L=lcmAll([first[1],used[1],added[1]]);x=first[0]*(L/first[1]);y=used[0]*(L/used[1]);z=added[0]*(L/added[1]);ans=mixed(x-y+z,L);
      return Q(`A container started ${first[0]}/${first[1]} full. ${used[0]}/${used[1]} of its capacity was used, then ${added[0]}/${added[1]} of its capacity was added. How full is it now?`,ans,[ans,mixed(x+y+z,L),frac(Math.max(0,x-y-z),L),frac(x-y+z,L*2)],`Use LCD ${L}, then follow the events in order: subtract, then add.`);
    }
    if(t===6){
      w1=R(4,9);d1=pick([3,4,5,6,8]);n1=R(1,d1-1);w2=R(1,w1-2);d2=pick([3,4,5,6,8]);n2=R(1,d2-1);const A=n1/d1>=.5?w1+1:w1,B=n2/d2>=.5?w2+1:w2;ans=String(A-B);
      return Q(`Which is the best whole-number estimate for ${w1} ${n1}/${d1} − ${w2} ${n2}/${d2}?`,ans,[ans,String(w1-w2),String(Math.max(0,A-B+1)),String(Math.max(0,A-B-1))],'Round each mixed number to the nearest whole number, then subtract.');
    }
    if(t===7){
      const start=pick([[5,6],[7,8],[9,10]]),leftover=pick([[1,3],[1,4],[2,5]]);L=lcm(start[1],leftover[1]);x=start[0]*(L/start[1]);y=leftover[0]*(L/leftover[1]);if(y>=x)return question();ans=frac(x-y,L);
      return Q(`A roll was ${start[0]}/${start[1]} m long. After a piece was cut off, ${leftover[0]}/${leftover[1]} m remained. How long was the piece cut off?`,`${ans} m`,[`${ans} m`,`${frac(x+y,L)} m`,`${leftover[0]}/${leftover[1]} m`,`${start[0]}/${start[1]} m`],'Work backward: amount cut off = starting length − amount left.');
    }
    if(t===8){
      const A=pick([[1,2],[2,3],[3,4]]),B=pick([[1,3],[1,4],[2,5]]),C=pick([[1,6],[1,8],[1,10]]);L=lcmAll([A[1],B[1],C[1]]);x=A[0]*(L/A[1]);y=B[0]*(L/B[1]);z=C[0]*(L/C[1]);ans=mixed(x+y+z,L);
      return Q(`Three sections of a trail are ${A[0]}/${A[1]} km, ${B[0]}/${B[1]} km and ${C[0]}/${C[1]} km. What is the total length?`,`${ans} km`,[`${ans} km`,`${frac(x+y,L)} km`,`${frac(x+y+z,L*2)} km`,'1 km'],'Use one common denominator for all three lengths.');
    }
    if(t===9){
      d=pick([6,8,10,12]);a=R(1,d-2);b=R(1,d-a-1);left=d-a-b;ans=frac(left,d);
      return Q(`A class used ${a}/${d} of a poster sheet for a graph and ${b}/${d} for a title. What fraction of the sheet is unused?`,ans,[ans,frac(a+b,d),frac(d-a,d),frac(d-b,d)],'Unused part = 1 − total used.');
    }
    if(t===10){
      const A=pick([[3,4],[5,6],[7,8]]),B=pick([[1,6],[1,4],[2,5]]);L=lcm(A[1],B[1]);x=A[0]*(L/A[1]);y=B[0]*(L/B[1]);const exact=frac(x+y,L);ans=`${exact} is reasonable`;
      return Q(`A student estimates ${A[0]}/${A[1]} + ${B[0]}/${B[1]} as about ${Math.round(A[0]/A[1]+B[0]/B[1])}. Which statement best describes the exact answer?`,ans,[ans,`${frac(Math.abs(x-y),L)} is the exact answer`,'The exact answer must be less than both fractions','The denominators should be added'],'Estimate first, then calculate with a common denominator to check reasonableness.');
    }
    if(t===11){
      w1=R(2,6);d=pick([4,5,6,8]);n1=R(1,d-1);const soldW=R(1,w1);const soldN=R(0,d-1);const madeW=R(1,3);const madeN=R(0,d-1);const leftNum=w1*d+n1;const original=leftNum+(soldW*d+soldN)-(madeW*d+madeN);if(original<=0)return question();ans=mixed(original,d);
      return Q(`At the end of a sale, ${w1} ${n1}/${d} trays remained. During the day ${soldW} ${soldN}/${d} trays were sold and ${madeW} ${madeN}/${d} trays were added. How many trays were there at the start?`,ans,[ans,mixed(leftNum+soldW*d+soldN+madeW*d+madeN,d),mixed(Math.max(1,leftNum-soldW*d-soldN),d),mixed(leftNum,d)],'Work backward from the final amount: undo selling by adding, and undo making by subtracting.');
    }
    if(t===12){
      const A=pick([[5,8],[7,10],[9,12]]),B=pick([[1,4],[1,5],[1,6]]);L=lcm(A[1],B[1]);x=A[0]*(L/A[1]);y=B[0]*(L/B[1]);ans=frac(x-y,L);
      return Q(`Which expression gives the distance between ${A[0]}/${A[1]} and ${B[0]}/${B[1]} on a number line?`,`${A[0]}/${A[1]} − ${B[0]}/${B[1]} = ${ans}`,[`${A[0]}/${A[1]} − ${B[0]}/${B[1]} = ${ans}`,`${A[0]+B[0]}/${A[1]+B[1]}`,`${A[0]}/${A[1]} + ${B[0]}/${B[1]} = ${frac(x+y,L)}`,'Multiply the denominators'],'Distance between two positive values is their positive difference.');
    }
    const A=pick([[2,3],[3,4],[4,5]]),B=pick([[1,6],[1,8],[1,5]]);L=lcm(A[1],B[1]);x=A[0]*(L/A[1]);y=B[0]*(L/B[1]);ans=frac(x+y,L);
    return Q(`A student says ${A[0]}/${A[1]} + ${B[0]}/${B[1]} = ${(A[0]+B[0])}/${A[1]+B[1]}. What is the correct sum?`,ans,[ans,`${A[0]+B[0]}/${A[1]+B[1]}`,frac(Math.abs(x-y),L),frac(x+y,L*2)],'Do not add denominators. Rename both fractions with a common denominator first.');
  }

  if(!window.SKILLUP_MR_EXTRA.topics.some(x=>x[0]==='sel_fraction_addsub')){
    const i=window.SKILLUP_MR_EXTRA.topics.findIndex(x=>x[0]==='sel_fraction_sense');
    window.SKILLUP_MR_EXTRA.topics.splice(i>=0?i+1:7,0,['sel_fraction_addsub','＋⁄−','Fraction Addition & Subtraction','Multi-step fractions, mixed-number renaming, estimation and work-backward reasoning']);
  }
  const old=window.SKILLUP_MR_EXTRA.question.bind(window.SKILLUP_MR_EXTRA);
  window.SKILLUP_MR_EXTRA.question=id=>id==='sel_fraction_addsub'?question():old(id);
})();
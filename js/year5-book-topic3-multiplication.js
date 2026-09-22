// Topic 3 upgrade: Year 5 Multiplication.
// Newly written SkillUP material covering the Year 5 curriculum and problem-solving style.
(function(){
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const fmt=n=>Number(n).toLocaleString('en-AU');
  const money=n=>`$${Number(n).toFixed(2)}`;
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);let c=uniq((choices||[]).map(String));if(!c.includes(ans))c.unshift(ans);
    return {text,answer:ans,choices:shuffle(c).slice(0,4),tip,explanation};
  }
  function near(n,p){return Math.round(n/p)*p}
  function topicQuestion(){
    const mode=R(0,17);let a,b,c,ans,x,y;
    if(mode===0){
      a=R(3,9);b=R(3,10);ans=a*b;
      return Q(`${a} equal groups have ${b} objects in each group. How many objects are there altogether?`,ans,[ans,a+b,ans-a,ans+b],'Equal groups can be represented by multiplication.',`${a} groups × ${b} in each group = ${ans}.`);
    }
    if(mode===1){
      a=R(3,12);b=R(3,12);ans=a*b;
      return Q(`Which multiplication sentence matches ${a} groups of ${b}?`,`${a} × ${b} = ${ans}`,[`${a} × ${b} = ${ans}`,`${a} + ${b} = ${a+b}`,`${b} × ${b} = ${b*b}`,`${a} × ${a} = ${a*a}`],'The first factor tells the number of groups and the second tells how many are in each group.',`${a} groups of ${b} means ${a} × ${b} = ${ans}.`);
    }
    if(mode===2){
      a=R(3,12);b=R(3,12);ans=a;
      return Q(`□ × ${b} = ${a*b}. What is the missing factor?`,ans,[ans,b,a*b,Math.max(1,a-1)],'Use the related division fact.',`${a*b} ÷ ${b} = ${a}, so the missing factor is ${a}.`);
    }
    if(mode===3){
      const cases=[
        ['7 × 9 = 9 × 7','Commutative Property','Changing the order of factors does not change the product.'],
        ['(3 × 4) × 5 = 3 × (4 × 5)','Associative Property','Changing the grouping of factors does not change the product.'],
        ['18 × 1 = 18','Identity Property','Multiplying by 1 leaves the number unchanged.'],
        ['43 × 0 = 0','Zero Property','Any number multiplied by 0 has product 0.'],
        ['6 × (20 + 3) = (6 × 20) + (6 × 3)','Distributive Property','Split one factor and multiply each part.']
      ];const z=pick(cases);
      return Q(`Which multiplication property is shown by ${z[0]}?`,z[1],[z[1],'Commutative Property','Associative Property','Identity Property','Distributive Property','Zero Property'],z[2],z[2]);
    }
    if(mode===4){
      a=pick([20,30,40,50,60,70,80,90]);b=R(2,9);ans=a*b;
      return Q(`${a} × ${b} = ?`,ans,[ans,ans/10,ans+10,ans-10],'Multiply the non-zero digits, then include the zero.',`${a/10} × ${b} = ${ans/10}; attach one zero → ${ans}.`);
    }
    if(mode===5){
      a=pick([200,300,400,500,600,700,800,900,2000,3000,4000,5000]);b=pick([3,4,5,6,7,8,9,20,30,40]);ans=a*b;
      return Q(`${fmt(a)} × ${fmt(b)} = ?`,fmt(ans),[fmt(ans),fmt(ans/10),fmt(ans*10),fmt(ans+a)],'Multiply the non-zero digits and account for all place-value zeros.',`${fmt(a)} × ${fmt(b)} = ${fmt(ans)}.`);
    }
    if(mode===6){
      a=R(21,98);b=R(11,49);const ea=near(a,10),eb=near(b,10);ans=ea*eb;
      return Q(`Estimate ${a} × ${b} by rounding each factor to the nearest ten.`,fmt(ans),[fmt(ans),fmt(a*b),fmt(ans+100),fmt(Math.max(0,ans-100))],'Round both factors first, then multiply.',`${a} ≈ ${ea} and ${b} ≈ ${eb}; ${ea} × ${eb} = ${fmt(ans)}.`);
    }
    if(mode===7){
      a=R(101,899);b=R(101,899);const ea=near(a,100),eb=near(b,100);ans=ea*eb;
      return Q(`Estimate ${fmt(a)} × ${fmt(b)} by rounding each factor to the nearest hundred.`,fmt(ans),[fmt(ans),fmt(a*b),fmt(ans+10000),fmt(Math.max(0,ans-10000))],'Round each factor to its greatest useful place before multiplying.',`${fmt(a)} ≈ ${fmt(ea)} and ${fmt(b)} ≈ ${fmt(eb)}; estimate = ${fmt(ans)}.`);
    }
    if(mode===8){
      a=R(1002,9099);b=R(3,9);ans=a*b;
      return Q(`${fmt(a)} × ${b} = ?`,fmt(ans),[fmt(ans),fmt(ans+b),fmt(ans+100),fmt(Math.max(0,ans-100))],'Multiply by place value from ones to thousands, regrouping when needed.',`${fmt(a)} × ${b} = ${fmt(ans)}. Estimate first to check the size of the product.`);
    }
    if(mode===9){
      a=R(21,89);b=R(12,79);ans=a*b;
      return Q(`${a} × ${b} = ?`,fmt(ans),[fmt(ans),fmt(ans+a),fmt(ans+b),fmt(Math.max(0,ans-10))],'Multiply by the ones, multiply by the tens, then add the partial products.',`${a} × ${b} = (${a} × ${b%10}) + (${a} × ${Math.floor(b/10)*10}) = ${fmt(ans)}.`);
    }
    if(mode===10){
      a=R(101,799);b=R(12,69);ans=a*b;
      return Q(`${fmt(a)} × ${b} = ?`,fmt(ans),[fmt(ans),fmt(ans+a),fmt(ans+b*10),fmt(Math.max(0,ans-100))],'Use two partial products: one for the ones digit and one for the tens digit.',`${fmt(a)} × ${b} = ${fmt(a*(b%10))} + ${fmt(a*Math.floor(b/10)*10)} = ${fmt(ans)}.`);
    }
    if(mode===11){
      a=R(102,499);b=R(102,399);ans=a*b;
      return Q(`${fmt(a)} × ${fmt(b)} = ?`,fmt(ans),[fmt(ans),fmt(near(ans,10000)),fmt(ans+a),fmt(Math.max(0,ans-1000))],'Multiply by ones, tens and hundreds, then add the three partial products.',`${fmt(a)} × ${fmt(b)} = ${fmt(ans)}. Compare with a rounded estimate to check reasonableness.`);
    }
    if(mode===12){
      a=R(205,905);b=pick([104,203,305,407,506,608,709]);ans=a*b;
      return Q(`${fmt(a)} × ${fmt(b)} = ?`,fmt(ans),[fmt(ans),fmt(ans+a),fmt(ans+1000),fmt(Math.max(0,ans-a))],'A zero digit contributes a zero partial product. Keep the other partial products in the correct columns.',`${fmt(a)} × ${fmt(b)} = ${fmt(ans)}.`);
    }
    if(mode===13){
      a=R(85,995)/100;b=R(3,12);ans=a*b;
      return Q(`${money(a)} × ${b} = ?`,money(ans),[money(ans),money(a+b),money(ans+1),money(Math.max(0,ans-1))],'Estimate the cost first, multiply as whole numbers, then place the decimal two places from the right.',`${money(a)} × ${b} = ${money(ans)}.`);
    }
    if(mode===14){
      a=R(200,900);b=R(15,60);ans=a*b;
      return Q(`A factory packs ${a} items in each crate. It fills ${b} crates. How many items are packed altogether?`,fmt(ans),[fmt(ans),fmt(a+b),fmt(ans-a),fmt(ans+b)],'Equal-size crates mean multiplication.',`${a} × ${b} = ${fmt(ans)} items.`);
    }
    if(mode===15){
      a=R(20,60);b=R(20,60);c=R(2,5);ans=a*b*c;
      return Q(`A hall has ${a} rows with ${b} seats in each row. It is used for ${c} identical sessions, all full. How many seat-uses are there altogether?`,fmt(ans),[fmt(ans),fmt(a*b),fmt(a+b+c),fmt(ans-c)],'Find one session first, then multiply by the number of sessions.',`${a} × ${b} = ${fmt(a*b)} per session; ${fmt(a*b)} × ${c} = ${fmt(ans)}.`);
    }
    if(mode===16){
      a=pick([12,15,18,20,24,30,36]);const factors=[];for(let i=1;i<=a;i++)if(a%i===0)factors.push(i);x=pick(factors);y=a/x;
      return Q(`Two factors of ${a} differ by ${Math.abs(x-y)}. Which pair could they be?`,`${Math.min(x,y)} and ${Math.max(x,y)}`,[`${Math.min(x,y)} and ${Math.max(x,y)}`,`1 and ${a-1}`,`2 and ${a-2}`,`${Math.max(1,x-1)} and ${y+1}`],'A factor pair must multiply exactly to the target number.',`${x} × ${y} = ${a}, so ${x} and ${y} form a factor pair.`);
    }
    a=R(12,59);b=R(12,59);ans=a*b;const digits=String(ans).length;
    return Q(`Without multiplying exactly first, will ${a} × ${b} have ${digits} digits? Choose the best answer.`,'Yes',[`Yes`,`No, it will have ${Math.max(1,digits-1)} digits`,`No, it will have ${digits+1} digits`,'Not enough information'],'Estimate the product using rounded factors, then compare the estimate with powers of 10.',`${a} × ${b} = ${fmt(ans)}, which has ${digits} digits.`);
  }

  if(window.TY_YEAR5_TESTS){
    if(!window.TY_YEAR5_TESTS.topics.some(x=>x[0]==='multiplication')){
      const i=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='rounding');
      window.TY_YEAR5_TESTS.topics.splice(i>=0?i+1:2,0,['multiplication','×','Multiplication','Factors, properties, mental strategies, estimation and multi-digit products']);
    }
    const oldQuestion=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=function(t){return t==='multiplication'?topicQuestion():oldQuestion(t)};
  }

  if(window.SKILLUP_MATH){
    const oldLearn=window.SKILLUP_MATH.learn;
    const oldEnhanced=window.SKILLUP_MATH.enhanced;
    window.SKILLUP_MATH.learn=function(g,t,fallback){
      if(String(g)==='5'&&t==='multiplication'){
        return {
          title:'Multiplication',
          concept:'Multiplication combines equal groups. The numbers being multiplied are factors and the answer is the product. Strong multiplication uses number properties, place value, estimation and partial products so that large calculations stay understandable and easy to check.',
          steps:[
            'Connect multiplication to equal groups: number of groups × amount in each group = total.',
            'Use multiplication properties and friendly factors to simplify mental calculations.',
            'For 10, 100, 1000 and their multiples, multiply the non-zero parts and then use place value for the zeros.',
            'Estimate the product before doing a large exact calculation so you know the expected size.',
            'For multi-digit multiplication, multiply by each place value separately and add the partial products.',
            'Check the exact product against the estimate. If they are far apart, recheck the place values.'
          ],
          examples:[
            {q:'Use the Distributive Property: 6 × 43',steps:['Split 43 into 40 + 3.','6 × 40 = 240','6 × 3 = 18','240 + 18 = 258'],answer:'258'},
            {q:'Estimate 487 × 113',steps:['Round 487 to about 500.','Round 113 to about 100.','500 × 100 = 50,000'],answer:'About 50,000'},
            {q:'24 × 17',steps:['24 × 7 = 168','24 × 10 = 240','Add the partial products: 168 + 240'],answer:'408'},
            {q:'178 × 126',steps:['178 × 6 = 1,068','178 × 20 = 3,560','178 × 100 = 17,800','Add the three partial products.'],answer:'22,428'}
          ],
          mistake:'Do not forget the place value of a tens or hundreds partial product. A zero inside a multiplier does not mean the whole product is zero; it means that particular place-value partial product is zero.',
          quick:'Equal groups → estimate → partial products → add → check against the estimate.'
        };
      }
      return oldLearn?oldLearn(g,t,fallback):null;
    };
    window.SKILLUP_MATH.enhanced=function(g,t){
      if(String(g)==='5'&&t==='multiplication')return topicQuestion();
      return oldEnhanced?oldEnhanced(g,t):null;
    };
  }
})();
// Topic 16 upgrade: Year 5 Algebra, Patterns & Equations.
// Newly written SkillUP material using the uploaded Grade 5 algebra/function-table chapter as the curriculum reference.
(function(){
  if(!window.SKILLUP_MATH)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    while(rest.length<3){const n=String(R(1,30));if(n!==ans&&!rest.includes(n))rest.push(n);}
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,explanation};
  }
  const frac=(n,d)=>{const g=(a,b)=>b?g(b,a%b):Math.abs(a);const k=g(n,d);n/=k;d/=k;return d===1?String(n):`${n}/${d}`;};
  function topicQuestion(){
    const mode=R(0,25);let a,b,c,x,ans;
    if(mode===0){const set=[['5n + 3','expression'],['4x = 28','equation'],['a − 9','expression'],['3m + 2 = 17','equation']];const z=pick(set);return Q(`Is ${z[0]} an expression or an equation?`,z[1],[z[1],z[1]==='expression'?'equation':'expression','inequality','number sentence with no variable'],'An equation has an equals sign. An expression does not.',`${z[0]} is an ${z[1]}.`);}
    if(mode===1){a=R(3,14);const z=pick([[`a number n increased by ${a}`,`n + ${a}`],[`${a} less than a number n`,`n − ${a}`],[`${a} times a number n`,`${a}n`],[`a number n divided by ${a}`,`n ÷ ${a}`]]);return Q(`Which algebraic expression means “${z[0]}”?`,z[1],[z[1],`${a} − n`,`n × ${a+1}`,`${a} ÷ n`],'Translate the words in their correct order.',`The phrase is written as ${z[1]}.`);}
    if(mode===2){a=R(2,8);b=R(1,6);c=R(1,6);x=R(2,10);ans=a*x-(b+c);return Q(`Evaluate ${a}x − (${b} + ${c}) when x = ${x}.`,ans,[ans,a*x-b+c,a+x-(b+c),a*x-b-c+1],'Substitute the value for x, then use order of operations.',`${a}×${x} − (${b}+${c}) = ${a*x} − ${b+c} = ${ans}.`);}
    if(mode===3){a=R(2,8);b=R(2,8);c=R(1,9);ans=`${a+b}n + ${c}`;return Q(`Simplify ${a}n + ${b}n + ${c}.`,ans,[ans,`${a*b}n + ${c}`,`${a+b+c}n`,`${a+b} + ${c}n`],'Combine only like terms.',`${a}n + ${b}n = ${a+b}n, so the expression is ${ans}.`);}
    if(mode===4){a=R(3,18);x=R(4,25);c=x+a;return Q(`n + ${a} = ${c}. What is n?`,x,[x,x+a,Math.max(0,x-a),c],'Use the inverse operation: subtract the same amount from both sides.',`${c} − ${a} = ${x}, so n = ${x}.`);}
    if(mode===5){a=R(3,18);x=R(a+2,35);c=x-a;return Q(`n − ${a} = ${c}. What is n?`,x,[x,c-a,c+a+1,a],'Addition undoes subtraction.',`${c} + ${a} = ${x}, so n = ${x}.`);}
    if(mode===6){a=R(3,15);x=R(5,28);c=x+a;return Q(`${c} = x + ${a}. What is x?`,x,[x,c+a,c-a+1,a],'The variable may be on either side of the equals sign. Keep both sides balanced.',`${c} − ${a} = ${x}.`);}
    if(mode===7){a=R(2,12);x=R(2,15);c=a*x;return Q(`${a}x = ${c}. What is x?`,x,[x,c,a,x+1],'Division undoes multiplication.',`${c} ÷ ${a} = ${x}.`);}
    if(mode===8){a=R(2,12);x=R(2,15);c=x*a;return Q(`x ÷ ${a} = ${x}. What is x in the equation?`,c,[c,x,a,c+a],'Multiplication undoes division.',`${x} × ${a} = ${c}.`);}
    if(mode===9){const z=pick([['n + 8 = 19','subtract 8'],['n − 6 = 14','add 6'],['5n = 40','divide by 5'],['n ÷ 7 = 3','multiply by 7']]);return Q(`Which inverse operation isolates the variable in ${z[0]}?`,z[1],[z[1],'add 8','multiply by 5','divide by 7'],'Choose the operation that undoes the operation attached to the variable.',`${z[1][0].toUpperCase()+z[1].slice(1)} on both sides.`);}
    if(mode===10){a=R(2,9);b=R(2,12);x=R(2,12);c=a*x+b;return Q(`${a}x + ${b} = ${c}. What is x?`,x,[x,x+1,Math.max(0,x-1),a],'Undo addition first, then multiplication.',`${c} − ${b} = ${a*x}; ${a*x} ÷ ${a} = ${x}.`);}
    if(mode===11){a=R(2,9);b=R(2,12);x=R(3,14);c=a*x-b;return Q(`${a}x − ${b} = ${c}. What is x?`,x,[x,x+1,Math.max(0,x-1),b],'Undo subtraction first, then divide by the coefficient.',`${c} + ${b} = ${a*x}; ${a*x} ÷ ${a} = ${x}.`);}
    if(mode===12){const d=pick([2,3,4,5,6]);const whole=R(1,5);const add=R(1,d-1);const totalN=whole*d+add;ans=whole;return Q(`n + ${add}/${d} = ${frac(totalN,d)}. What is n?`,ans,[ans,frac(totalN,d),frac(whole*d-add,d),String(whole+1)],'Subtract the same fraction from both sides.',`${frac(totalN,d)} − ${add}/${d} = ${whole}.`);}
    if(mode===13){const d=pick([2,3,4,5,6]);x=R(2,12);ans=x*d;return Q(`n ÷ ${d} = ${x}. What is n?`,ans,[ans,x,d,x+d],'Multiply both sides by the divisor.',`${x} × ${d} = ${ans}.`);}
    if(mode===14){a=R(8,22);b=R(6,20);ans=a+b;return Q(`Maya is ${a} years old. Her father is ${b} years older. If f is her father's age, which value solves f − ${b} = ${a}?`,ans,[ans,a,b,Math.abs(a-b)],'Use the equation to work backwards.',`${a} + ${b} = ${ans}.`);}
    if(mode===15){a=R(8,24);b=R(5,18);const area=a*b;return Q(`A rectangle has area ${area} cm² and width ${b} cm. If ${b}L = ${area}, what is L?`,a,[a,b,area,a+b],'Solve the multiplication equation by division.',`${area} ÷ ${b} = ${a} cm.`);}
    if(mode===16){a=R(2,6);b=R(0,8);x=R(1,10);ans=a*x+b;return Q(`A function rule is y = ${a}x + ${b}. What is y when x = ${x}?`,ans,[ans,a+x+b,a*x,ans+a],'Substitute the input value for x.',`y = ${a}×${x} + ${b} = ${ans}.`);}
    if(mode===17){a=R(2,6);b=R(0,8);x=R(2,10);const y=a*x+b;return Q(`For y = ${a}x + ${b}, the output is ${y}. What input x produced it?`,x,[x,y,a,b],'Reverse the rule: subtract the constant, then divide.',`${y} − ${b} = ${a*x}; ${a*x} ÷ ${a} = ${x}.`);}
    if(mode===18){a=R(2,6);b=R(0,8);const vals=[1,2,3].map(v=>`${v}→${a*v+b}`).join(', ');ans=`y = ${a}x + ${b}`;return Q(`Which rule matches this function table: ${vals}?`,ans,[ans,`y = ${a+b}x`,`y = ${a}x − ${b}`,`y = x + ${a+b}`],'Compare how the output changes when the input increases by 1.',`The output increases by ${a}, and when x=1 the value is ${a+b}; this matches ${ans}.`);}
    if(mode===19){a=R(3,12);b=R(10,40);ans=b+4*a;return Q(`Find the next term: ${b}, ${b+a}, ${b+2*a}, ${b+3*a}, ?`,ans,[ans,b+5*a,b+3*a,ans+1],`The pattern adds ${a} each time.`,`${b+3*a} + ${a} = ${ans}.`);}
    if(mode===20){a=R(2,4);b=R(1,4);const s=R(1,5);const t1=s,t2=a*t1+b,t3=a*t2+b,t4=a*t3+b,answer=a*t4+b;return Q(`A pattern follows “multiply by ${a}, then add ${b}”: ${t1}, ${t2}, ${t3}, ${t4}, … What comes next?`,answer,[answer,a*t4,t4+b,answer+b],`Apply both parts of the rule in order.`,`${t4}×${a}+${b} = ${answer}.`);}
    if(mode===21){a=R(2,8);b=R(1,12);const n=R(4,8);ans=a*n+b;return Q(`The nth term is ${a}n + ${b}. What is term ${n}?`,ans,[ans,a+n+b,a*(n-1)+b,ans+a],'Replace n with the term number.',`${a}×${n}+${b} = ${ans}.`);}
    if(mode===22){a=R(2,6);b=R(1,7);x=R(2,9);const y=a*x+b;return Q(`Complete the function pair: ${x} → ? using y = ${a}x + ${b}.`,y,[y,a*x,x+b,y+a],'Use the rule on the input.',`${a}×${x}+${b} = ${y}.`);}
    if(mode===23){a=R(2,9);b=R(2,9);ans=`${a}n − ${b}`;return Q(`Which expression means “${b} less than ${a} times n”?`,ans,[ans,`${b} − ${a}n`,`${a}(n − ${b})`,`${a}n + ${b}`],'“b less than something” means subtract b from that quantity.',`Start with ${a}n, then subtract ${b}: ${ans}.`);}
    if(mode===24){a=R(2,8);b=R(1,10);x=R(2,12);c=a*x+b;const cand=pick([x,x+1]);ans=cand===x?'Yes':'No';return Q(`Does x = ${cand} satisfy ${a}x + ${b} = ${c}?`,ans,[ans,ans==='Yes'?'No':'Yes','Only if x = 0','Cannot be checked'],'Substitute the proposed value into the original equation.',`${a}×${cand}+${b} = ${a*cand+b}. ${a*cand+b===c?'This equals':'This does not equal'} ${c}.`);}
    a=R(2,5);b=R(2,12);x=R(3,12);c=a*x-b;return Q(`A number is multiplied by ${a}, then ${b} is subtracted. The result is ${c}. What was the number?`,x,[x,x+1,Math.max(1,x-1),c],'Reverse the operations: add first, then divide.',`${c}+${b}=${a*x}; ${a*x}÷${a}=${x}.`);
  }

  if(window.TY_YEAR5_TESTS){
    window.TY_YEAR5_TESTS.topics=window.TY_YEAR5_TESTS.topics.filter(x=>x[0]!=='patterns');
    let row=window.TY_YEAR5_TESTS.topics.find(x=>x[0]==='equations');
    if(row){row[1]='x';row[2]='Algebra, Patterns & Equations';row[3]='Expressions, equations, inverse operations, function tables and number patterns';}
    else window.TY_YEAR5_TESTS.topics.push(['equations','x','Algebra, Patterns & Equations','Expressions, equations, inverse operations, function tables and number patterns']);
    const oldQuestion=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=function(t){return t==='equations'?topicQuestion():oldQuestion(t)};
  }

  const oldLearn=window.SKILLUP_MATH.learn;
  const oldEnhanced=window.SKILLUP_MATH.enhanced;
  window.SKILLUP_MATH.learn=function(g,t,fallback){
    if(String(g)==='5'&&t==='equations')return{
      title:'Algebra, Patterns & Equations',
      concept:'Algebra uses letters to stand for numbers. Expressions describe calculations, equations say that two expressions are equal, and function rules connect inputs to outputs. Patterns help you see and describe those rules.',
      steps:[
        'An expression has numbers, variables and operation signs but no equals sign. An equation states that two expressions are equal.',
        'Translate words carefully: “5 more than n” is n + 5, while “5 less than n” is n − 5. Products can be written as 5n.',
        'To evaluate an expression, substitute the given value for each variable and then follow the order of operations.',
        'To solve an equation, isolate the variable with inverse operations. Whatever you do to one side, do the same to the other side.',
        'For two-step equations, undo addition or subtraction first, then undo multiplication or division. Check by substituting your answer back into the original equation.',
        'A function table matches each input with an output. Use the rule to find missing values or inspect the table to work out the rule.',
        'For a number pattern, identify the repeated rule. A rule can often be written algebraically, such as y = 3x + 2.'
      ],
      examples:[
        {q:'Write “7 less than a number n” as an expression.',steps:['Start with the number n.','“7 less than n” means subtract 7 from n.'],answer:'n − 7'},
        {q:'Evaluate 5a − (b + c) when a=4, b=3 and c=1.',steps:['Substitute the values: 5×4 − (3+1).','Calculate brackets first: 20 − 4.'],answer:'16'},
        {q:'Solve x + 7 = 19.',steps:['Subtract 7 from both sides.','x = 19 − 7.','Check: 12 + 7 = 19.'],answer:'x = 12'},
        {q:'Solve 3x + 5 = 26.',steps:['Subtract 5 from both sides: 3x = 21.','Divide both sides by 3.','Check: 3×7 + 5 = 26.'],answer:'x = 7'},
        {q:'A function uses y = 3x + 2. Find y when x=4.',steps:['Substitute x=4.','y = 3×4 + 2.'],answer:'14'},
        {q:'The table has 1→5, 2→8, 3→11. What rule fits?',steps:['Outputs increase by 3 whenever inputs increase by 1.','Try y = 3x + 2: for x=1, y=5; for x=2, y=8.'],answer:'y = 3x + 2'}
      ],
      mistake:'Do not reverse phrases such as “5 less than n”. Do not change only one side of an equation. When evaluating, substitute first and still follow order of operations. Always check a solved equation in the original statement.',
      quick:'Expression: no equals sign. Equation: has an equals sign. Solve by inverse operations and keep both sides balanced. Function rule: input → rule → output.'
    };
    return oldLearn(g,t,fallback);
  };
  window.SKILLUP_MATH.enhanced=function(g,t){return String(g)==='5'&&t==='equations'?topicQuestion():oldEnhanced(g,t);};
})();
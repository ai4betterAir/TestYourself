// Topic 22: Year 5 Logic & Venn Diagrams.
// Newly written SkillUP material covering the Year 5 logic enrichment sections.
(function(){
  if(!window.SKILLUP_MATH)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    let k=1;while(rest.length<3){const v=`Option ${k++}`;if(v!==ans&&!rest.includes(v))rest.push(v);}
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,explanation};
  }
  const facts=[
    ['A square has 4 sides.',true],['A triangle has 4 sides.',false],['A circle is a plane figure.',true],
    ['10 is divisible by 2.',true],['12 is divisible by 3.',true],['4 is a prime number.',false],
    ['5 is a composite number.',false],['All rectangles are quadrilaterals.',true],['No triangles are squares.',true],
    ['Some whole numbers are even.',true],['Every even number is odd.',false],['A cube has 6 faces.',true]
  ];
  function truthWord(v){return v?'True':'False';}
  function question(){
    const m=R(0,19);let f1,f2,ans;
    if(m===0){return Q('Which sentence is a statement in logic?','A square has 4 sides.',['A square has 4 sides.','How many sides has a square?','Draw a square.','Please count the sides.'],'A statement must be a sentence that can be judged true or false.','“A square has 4 sides.” can be judged true or false, so it is a statement.');}
    if(m===1){f1=pick(facts);ans=truthWord(f1[1]);return Q(`Is this statement true or false? ${f1[0]}`,ans,['True','False','Both','Cannot be judged'],'Decide whether the whole sentence is correct.',`${f1[0]} is ${ans.toLowerCase()}.`);}
    if(m===2){f1=pick([['A triangle has 3 sides.','A triangle does not have 3 sides.'],['A square has 4 sides.','A square does not have 4 sides.'],['10 is divisible by 2.','10 is not divisible by 2.'],['A circle is a plane figure.','A circle is not a plane figure.']]);return Q(`What is the negation of: “${f1[0]}”`,f1[1],[f1[1],f1[0],'Both statements together','Neither statement'],'A negation denies the original statement, often by inserting “not”.',`The negation is: “${f1[1]}”`);}
    if(m===3){f1=pick(facts);ans=truthWord(!f1[1]);return Q(`If “${f1[0]}” is ${truthWord(f1[1]).toLowerCase()}, what is the truth value of its negation?`,ans,['True','False','The same as the original','Cannot be decided'],'A statement and its negation have opposite truth values.',`The negation is ${ans.toLowerCase()}.`);}
    if(m===4){return Q('Which Venn-diagram description represents “All vowels are letters of the alphabet”?','The Vowels circle is completely inside the Letters circle.',['The Vowels circle is completely inside the Letters circle.','The two circles do not overlap.','The circles overlap partly only.','The Letters circle is completely inside the Vowels circle.'],'For an “All A are B” statement, every A must lie inside B.','All vowels belong to the set of letters, so Vowels is inside Letters.');}
    if(m===5){return Q('Which description best represents “Some letters are vowels”?','The Letters and Vowels sets have members in common.',['The Letters and Vowels sets have members in common.','The sets must be separate.','Every letter must be a vowel.','No vowel can be a letter.'],'“Some” means at least one member belongs to both sets.','The two sets share at least some members.');}
    if(m===6){return Q('Which description represents “No whole numbers are letters of the alphabet”?','The two sets do not overlap.',['The two sets do not overlap.','One set must be inside the other.','The sets must be identical.','The sets must overlap partly.'],'“No A are B” means the sets have no common members.','The two sets are separate.');}
    if(m===7){return Q('All squares are rectangles. Which Venn relationship matches this?','Squares are inside Rectangles.',['Squares are inside Rectangles.','Rectangles are inside Squares.','Squares and Rectangles never overlap.','The sets are unrelated.'],'For “All A are B”, place A entirely inside B.','Every square belongs to the rectangle set.');}
    if(m===8){return Q('No triangles are squares. What must a matching Venn diagram show?','Triangle and Square circles do not overlap.',['Triangle and Square circles do not overlap.','Triangle circle is inside Square circle.','Square circle is inside Triangle circle.','The circles must be identical.'],'“No” statements mean no shared members.','The sets must be separate.');}
    if(m===9){f1=pick(facts);f2=pick(facts);ans=truthWord(f1[1]&&f2[1]);return Q(`What is the truth value of this compound statement? “${f1[0]} AND ${f2[0]}”`,ans,['True','False','Sometimes true','Cannot be judged'],'An AND statement is true only when both parts are true.',`The first part is ${truthWord(f1[1]).toLowerCase()} and the second is ${truthWord(f2[1]).toLowerCase()}, so the AND statement is ${ans.toLowerCase()}.`);}
    if(m===10){f1=pick(facts);f2=pick(facts);ans=truthWord(f1[1]||f2[1]);return Q(`What is the truth value of this compound statement? “${f1[0]} OR ${f2[0]}”`,ans,['True','False','Only if both are true','Cannot be judged'],'An OR statement is true when at least one part is true.',`The OR statement is ${ans.toLowerCase()}.`);}
    if(m===11){return Q('When is a compound statement using AND true?','Only when both original statements are true.',['Only when both original statements are true.','When either one is true.','Only when both are false.','Whenever one is false.'],'Think of AND as requiring both conditions.','AND is true only if both original statements are true.');}
    if(m===12){return Q('When is a compound statement using OR false?','Only when both original statements are false.',['Only when both original statements are false.','When one statement is true.','When both statements are true.','Whenever the first is true.'],'OR needs at least one true statement to be true.','OR is false only when neither original statement is true.');}
    if(m===13){return Q('Which word should combine two statements if BOTH conditions must be true?','and',['and','or','not','some'],'AND requires both conditions.','Use “and” when both statements must be true.');}
    if(m===14){return Q('Which word should combine two statements if AT LEAST ONE condition may be true?','or',['or','and','not','no'],'OR is true when one or both parts are true.','Use “or” when at least one condition is enough.');}
    if(m===15){return Q('All roses are flowers. Which conclusion follows directly?','Every rose belongs to the flower set.',['Every rose belongs to the flower set.','Every flower is a rose.','No rose is a flower.','Roses and flowers cannot overlap.'],'Read “All A are B” in one direction: A belongs inside B.','The Rose set is inside the Flower set.');}
    if(m===16){return Q('Some plants are green. Which conclusion is supported?','At least one plant is green.',['At least one plant is green.','Every plant is green.','No plant is green.','Every green thing is a plant.'],'“Some” means one or more, not necessarily all.','The statement guarantees at least one green plant.');}
    if(m===17){return Q('Tom, Mia and Lee each chose a different fruit: apple, banana and orange. Tom did not choose apple. Mia chose banana. Which fruit did Lee choose?','apple',['apple','banana','orange','Cannot be decided'],'Use a small table and eliminate choices that are already used or ruled out.','Mia has banana. Tom cannot have apple, so Tom has orange. Lee must have apple.');}
    if(m===18){return Q('Ava, Ben and Cara each have a different pet: cat, dog and fish. Ben has the dog. Ava does not have the fish. What pet does Ava have?','cat',['cat','dog','fish','Cannot be decided'],'Eliminate the used pet and the pet ruled out by the clue.','Dog is already Ben’s. Ava is not fish, so Ava must have the cat.');}
    return Q('Which statement is the negation of “All rectangles are quadrilaterals”?','It is not true that all rectangles are quadrilaterals.',['It is not true that all rectangles are quadrilaterals.','All quadrilaterals are rectangles.','Some rectangles are quadrilaterals.','No rectangles are quadrilaterals.'],'A negation denies the original statement; it does not reverse the two sets.','The direct negation is: “It is not true that all rectangles are quadrilaterals.”');
  }
  if(window.TY_YEAR5_TESTS){
    window.TY_YEAR5_TESTS.topics=window.TY_YEAR5_TESTS.topics.filter(x=>x[0]!=='logic_venn');
    const i=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='number_enrichment');
    window.TY_YEAR5_TESTS.topics.splice(i>=0?i+1:window.TY_YEAR5_TESTS.topics.length,0,['logic_venn','◉','Logic & Venn Diagrams','Statements, negation, All/Some/No relationships, AND/OR logic and deduction']);
    const oldQ=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=t=>t==='logic_venn'?question():oldQ(t);
  }
  const oldLearn=window.SKILLUP_MATH.learn,oldEnhanced=window.SKILLUP_MATH.enhanced;
  window.SKILLUP_MATH.learn=function(g,t,fallback){
    if(String(g)==='5'&&t==='logic_venn')return{
      title:'Logic & Venn Diagrams',
      concept:'Logic helps us decide whether statements are true or false, form negations, show set relationships with Venn diagrams, combine statements with and/or, and solve clues by eliminating impossible choices.',
      steps:[
        'A statement is a sentence that can be judged true or false.',
        'The negation of a statement denies it. A true statement has a false negation, and a false statement has a true negation.',
        'Venn diagrams use circles to show relationships between sets. “All A are B” means A sits inside B; “Some A are B” means the sets share members; “No A are B” means the sets do not overlap.',
        'A compound statement using AND is true only when both original statements are true.',
        'A compound statement using OR is true when at least one original statement is true; it is false only when both are false.',
        'For logic-grid style problems, make a table. Use each clue to mark what is possible and eliminate what cannot be true.'
      ],
      examples:[
        {q:'Negate: “A triangle has 3 sides.”',steps:['A negation denies the original statement.','Insert “not” in a way that reverses the claim.'],answer:'A triangle does not have 3 sides.'},
        {q:'How would a Venn diagram show “All vowels are letters”?',steps:['Every vowel belongs to the set of letters.','So the Vowels circle must sit completely inside the Letters circle.'],answer:'Vowels inside Letters'},
        {q:'True or false: “10 is divisible by 2 AND 12 is divisible by 3.”',steps:['10 is divisible by 2: true.','12 is divisible by 3: true.','AND is true only when both parts are true.'],answer:'True'},
        {q:'Ben has the dog. Ava does not have the fish. Ava, Ben and Cara have different pets: cat, dog and fish. What does Ava have?',steps:['Dog is already used by Ben.','Ava cannot have fish.','Only cat remains for Ava.'],answer:'cat'}
      ]
    };
    return oldLearn(g,t,fallback);
  };
  window.SKILLUP_MATH.enhanced=function(g,t){if(String(g)==='5'&&t==='logic_venn')return question();return oldEnhanced(g,t);};
})();
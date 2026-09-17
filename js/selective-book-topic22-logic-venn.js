// Topic 22: Selective Logic & Venn Diagrams.
(function(){
  const mr=window.SKILLUP_MR_EXTRA;if(!mr)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)],shuffle=a=>[...a].sort(()=>Math.random()-.5),uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip){const ans=String(answer);let rest=uniq(choices.map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);let k=1;while(rest.length<3){const v=`Option ${k++}`;if(v!==ans&&!rest.includes(v))rest.push(v);}return{text,answer:ans,choices:shuffle([ans,...rest]),tip,topic:'sel_logic_venn',name:'Logic & Venn Diagrams'};}
  function question(){const m=R(0,15);let ans;
    if(m===0)return Q('Statement P is true and statement Q is false. What is the truth value of P AND Q?','False',['True','False','Cannot be determined','Both'],'AND is true only when both parts are true.');
    if(m===1)return Q('Statement P is false and statement Q is true. What is the truth value of P OR Q?','True',['True','False','Cannot be determined','Only sometimes true'],'OR is true when at least one part is true.');
    if(m===2)return Q('Which condition makes P OR Q false?','P is false and Q is false',['P is false and Q is false','P is true and Q is false','P is false and Q is true','P is true and Q is true'],'OR is false only when neither part is true.');
    if(m===3)return Q('Which condition makes P AND Q true?','P is true and Q is true',['P is true and Q is true','P is true and Q is false','P is false and Q is true','P is false and Q is false'],'AND requires both statements to be true.');
    if(m===4)return Q('All squares are rectangles. No rectangles are circles. Which conclusion follows?','No squares are circles.',['No squares are circles.','All circles are squares.','Some squares are circles.','All rectangles are squares.'],'If every square is a rectangle and rectangles do not overlap circles, squares cannot overlap circles either.');
    if(m===5)return Q('All robins are birds. Some birds can swim. What can you conclude for certain?','Every robin is a bird.',['Every robin is a bird.','Every bird is a robin.','Every robin can swim.','No robin can swim.'],'Only use what the statements guarantee; “some birds” does not describe every bird.');
    if(m===6)return Q('Some students play chess. Which statement must be true?','At least one student plays chess.',['At least one student plays chess.','Every student plays chess.','No student plays chess.','Only one student plays chess.'],'“Some” guarantees one or more, but not all or exactly one.');
    if(m===7)return Q('No multiples of 5 are odd numbers? Choose the best evaluation.','False',['True','False','Cannot be judged','Both true and false'],'Test a simple example such as 5 or 15.');
    if(m===8)return Q('Ava, Ben and Cara each chose a different badge: star, circle and triangle. Ben chose circle. Cara did not choose star. What did Ava choose?','star',['star','circle','triangle','Cannot be decided'],'Use elimination: remove the badge already used, then apply the remaining clue.');
    if(m===9)return Q('Kai, Leo and Mia each read a different book: red, blue and green. Kai did not read red. Leo read green. Mia did not read blue. Which book did Kai read?','blue',['red','blue','green','Cannot be decided'],'Make a small table and cross out impossible choices.');
    if(m===10)return Q('All A are B, and all B are C. Which conclusion is forced?','All A are C.',['All A are C.','All C are A.','No A are C.','Some C are not B.'],'If A sits inside B and B sits inside C, then A also sits inside C.');
    if(m===11)return Q('No A are B. Some C are A. Which conclusion follows about those C members that are A?','They are not B.',['They are not B.','They must be B.','All C are B.','Nothing can be concluded.'],'Members in A cannot also belong to B.');
    if(m===12)return Q('Which Venn description matches: “Some A are B, but not all A are B”?','A and B overlap, with part of A outside B.',['A and B overlap, with part of A outside B.','A is completely inside B.','A and B do not overlap.','A and B are identical.'],'“Some” requires overlap, while “not all” requires at least part of A outside B.');
    if(m===13)return Q('The statement “A square has 4 sides” is true. Which statement is its negation?','A square does not have 4 sides.',['A square does not have 4 sides.','A rectangle has 4 sides.','A square has 4 angles.','Some squares have 4 sides.'],'A negation directly denies the original statement.');
    if(m===14){ans='True';return Q('Evaluate: “12 is divisible by 3 OR 9 is divisible by 2.”',ans,['True','False','Cannot be determined','Only true if both parts are true'],'For OR, one true part is enough.');}
    return Q('Evaluate: “15 is divisible by 5 AND 14 is divisible by 3.”','False',['True','False','Cannot be determined','Only the first part matters'],'For AND, both parts must be true.');
  }
  mr.topics=mr.topics.filter(x=>x[0]!=='sel_logic_venn');
  const i=mr.topics.findIndex(x=>x[0]==='sel_number_enrichment');
  mr.topics.splice(i>=0?i+1:mr.topics.length,0,['sel_logic_venn','◉','Logic & Venn Diagrams','Negation, All/Some/No set relations, AND/OR truth and deduction']);
  const old=mr.question.bind(mr);mr.question=id=>id==='sel_logic_venn'?question():old(id);
})();
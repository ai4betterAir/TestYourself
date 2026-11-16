// Topic cards map to the existing year-level question banks.
(() => {
  const params=new URLSearchParams(location.search);
  const year=params.get('year'),index=Number(params.get('lesson'));
  if(params.get('subject')!=='maths'||!['K','1','2'].includes(year)||!/^\d+$/.test(params.get('lesson')))return;
  const routes={
    K:[['counting'],['number-order'],['simple-addition'],['shapes'],['patterns'],['measurement']],
    '1':[['number','compare','beforeafter'],['addition'],['subtraction'],['shapes2d','patterns'],['length','mass','capacity'],['money'],['time','calendar'],['data'],['wordproblems']],
    '2':[['g2place1000'],['g2facts','g2add2','g2subtract2'],['g2multdiv'],['g2fractionschance'],['g2measurement'],['g2moneytime'],['g2geometry'],['g2datagraphs']]
  };
  const ids=routes[year][index];if(!ids)return;
  const bank=year==='K'?KINDY_MATHS:year==='1'?TY_YEAR1:TY_YEAR2;
  let cursor=0;
  const generate=()=>{
    const id=ids[cursor++%ids.length];
    let q=bank.question(id);
    const integer=(min,max)=>Math.floor(Math.random()*(max-min+1))+min;
    const numeric=(text,answer,hint)=>{
      const choices=new Set([answer]);while(choices.size<3)choices.add(Math.max(0,answer+integer(-3,3)));
      return {text,answer:String(answer),choices:[...choices].sort(()=>Math.random()-.5).map(String),hint,why:'The answer is '+answer+'. '+hint};
    };
    if(year==='K' && index===0){
      const n=integer(1,20);
      return numeric('Count the dots: '+Array(n).fill('●').join(' '),n,'Point to each dot once and count in order.');
    }
    if(year==='K' && index===1){
      const n=integer(2,20);
      return numeric('Which number is missing? '+(n-2)+', '+(n-1)+', □, '+(n+1),n,'Count on by one. The missing number comes after '+(n-1)+'.');
    }
    if(year==='K' && index===3){
      const shapes=[['○','circles'],['△','triangles'],['□','squares']];
      const target=shapes[integer(0,2)],other=shapes.find(s=>s!==target);
      const n=integer(1,6),m=integer(1,4),row=[...Array(n).fill(target[0]),...Array(m).fill(other[0])].sort(()=>Math.random()-.5);
      return numeric('How many '+target[1]+'? '+row.join(' '),n,'Look for '+target[1]+'. Count only that shape.');
    }
    // Fractions excludes probability questions from the shared chapter.
    if(year==='2'&&index===3){
      for(let tries=0;tries<80&&/likely|chance|certain|impossible|probability/i.test(q.text);tries++)q=bank.question(id);
    }
    return {text:q.text,answer:String(q.answer),choices:q.choices.map(String),hint:q.tip||'Use the worked example, then check your answer.',why:q.explanation||q.tip+' The answer is '+q.answer+'.'};
  };
  const source=earlyTopicPage(year,'maths',index);
  const title=source.title;
  const seed=year==='K'?kindergartenActivities.maths[index]:year==='1'?year1Topics.filter(t=>t.id.startsWith('maths-'))[index]:year23Lessons['2'].maths[index];
  let first;
  if(year==='K')first={title:'Explore '+title,steps:[seed[1]],q:seed[2],answer:seed[3],choices:seed.slice(3,6),sum:seed[1],hint:seed[1]};
  else first={title:'Explore '+title,steps:[seed.lesson.model],q:seed.question,answer:seed.answers[seed.correct],choices:seed.answers,sum:seed.lesson.model,hint:seed.explain};
  window.TOPIC_MATHS={year,title,label:(year==='K'?'Kindergarten':'Year '+year)+' · '+title,generate,first};
})();

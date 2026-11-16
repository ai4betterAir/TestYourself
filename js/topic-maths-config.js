// Topic cards map to the existing year-level question banks.
(() => {
  const params=new URLSearchParams(location.search);
  const year=params.get('year'),index=Number(params.get('lesson'));
  if(params.get('subject')!=='maths'||!['K','1','2','3','4','5'].includes(year)||!/^\d+$/.test(params.get('lesson')))return;
  const routes={
    K:[['counting'],['number-order'],['simple-addition'],['shapes'],['patterns'],['measurement']],
    '1':[['number','compare','beforeafter'],['addition'],['subtraction'],['shapes2d','patterns'],['length','mass','capacity'],['money'],['time','calendar'],['data'],['wordproblems']],
    '2':[['g2place1000'],['g2facts','g2add2','g2subtract2'],['g2multdiv'],['g2fractionschance'],['g2measurement'],['g2moneytime'],['g2geometry'],['g2datagraphs']],
    '3':[['number'],['addition','subtraction'],['multiplication','division'],['fractions'],['measurement','perimeter'],['time','money'],['geometry3'],['data']],
    '4':[['placevalue'],['addition','multiplication','division','division2digit'],['fractionconcepts','fractionoperations','decimals'],['measurement','perimeterarea'],['geometry'],['time-money4'],['data'],['wordproblems4']],
    '5':[['extra:numeration','extra:rounding'],['number','extra:operations'],['fractions','decimals','extra:fractiondecimal'],['percentage'],['extra:measurement','extra:perimeterarea','volume'],['geometry','extra:coordinates','extra:symmetry','extra:angles'],['data','extra:graphs','extra:mean','extra:probability'],['wordproblems','extra:wordproblems']]
  };
  const ids=routes[year][index];if(!ids)return;
  const bank=year==='K'?KINDY_MATHS:year==='1'?TY_YEAR1:year==='2'?TY_YEAR2:year==='4'?TY_YEAR4:{question:id=>id.startsWith('extra:')?TY_YEAR5_TESTS.question(id.slice(6)):TY_YEARS345.question(year,id)};
  let cursor=0;
  const generate=()=>{
    const id=ids[cursor++%ids.length];
    let q;
    const integer=(min,max)=>Math.floor(Math.random()*(max-min+1))+min;
    const numeric=(text,answer,hint)=>{
      const choices=new Set([answer]);while(choices.size<3)choices.add(Math.max(0,answer+integer(-3,3)));
      return {text,answer:String(answer),choices:[...choices].sort(()=>Math.random()-.5).map(String),hint,why:'The answer is '+answer+'. '+hint};
    };
    if(id==='geometry3') {
      const items=[
        ['How many right angles does a rectangle have?','4',['2','3','4','6'],'Look at its four square corners.'],
        ['What turn is one right angle?','A quarter turn',['A quarter turn','A half turn','A full turn'],'Four equal quarter turns make a full turn.'],
        ['Which shape has exactly three straight sides?','Triangle',['Triangle','Square','Circle'],'Count the sides around its outline.'],
        ['A square slides right without turning. What changes?','Its position',['Its position','Its number of sides','Its side lengths'],'Sliding moves a shape while keeping its size and orientation.']
      ];
      const item=items[integer(0,items.length-1)];
      if(integer(0,1))return {text:item[0],answer:item[1],choices:item[2].sort(()=>Math.random()-.5),hint:item[3],why:item[3]};
      const turns=integer(1,8);
      return numeric('How many right angles are in '+turns+' full turns?',turns*4,'There are four right angles in each full turn.');
    }
    if(id==='time-money4') {
      if(integer(0,1)){
        const cents=integer(125,875),paid=1000;
        const answer='$'+((paid-cents)/100).toFixed(2);
        return {text:'A ticket costs $'+(cents/100).toFixed(2)+'. You pay $10. What change do you get?',answer,choices:[answer,'$'+((paid-cents+100)/100).toFixed(2),'$'+((paid-cents-100)/100).toFixed(2)].sort(()=>Math.random()-.5),hint:'Subtract the ticket price from $10. Work in cents if that helps.',why:'1000 cents − '+cents+' cents = '+(1000-cents)+' cents, which is '+answer+'.'};
      }
      const start=integer(9,14)*60+integer(0,11)*5,duration=integer(2,12)*5;
      const time=n=>Math.floor(n/60)+':'+String(n%60).padStart(2,'0');
      const answer=time(start+duration);
      return {text:'A session starts at '+time(start)+' on a 24-hour clock and lasts '+duration+' minutes. When does it finish?',answer,choices:[answer,time(start+duration+10),time(start+duration-10)].sort(()=>Math.random()-.5),hint:'Count forward by minutes, passing to the next hour when needed.',why:'Adding '+duration+' minutes to '+time(start)+' gives '+answer+'.'};
    }
    if(id==='wordproblems4'){
      const groups=integer(3,12),each=integer(8,25),used=integer(2,each);
      return numeric(groups+' boxes contain '+each+' pencils each. '+used+' pencils are used. How many remain?',groups*each-used,'Multiply to find the total, then subtract the pencils used.');
    }
    q=bank.question(id);
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
    const valid=item=>Array.isArray(item.choices)&&new Set(item.choices.map(String)).size>=2&&item.choices.some(v=>String(v)===String(item.answer));
    for(let tries=0;!valid(q)&&tries<100;tries++)q=bank.question(id);
    if(!valid(q))throw new Error('Question bank could not create valid choices for '+id);
    return {text:q.text,answer:String(q.answer),choices:[...new Set(q.choices.map(String))],hint:q.tip||'Use the worked example, then check your answer.',why:q.explanation||q.tip+' The answer is '+q.answer+'.'};
  };
  const source=earlyTopicPage(year,'maths',index);
  const title=source.title;
  const seed=year==='K'?kindergartenActivities.maths[index]:year==='1'?year1Topics.filter(t=>t.id.startsWith('maths-'))[index]:(Number(year)<=3?year23Lessons:year45Lessons)[year].maths[index];
  let first;
  if(year==='K')first={title:'Explore '+title,steps:[seed[1]],q:seed[2],answer:seed[3],choices:seed.slice(3,6),sum:seed[1],hint:seed[1]};
  else first={title:'Explore '+title,steps:[seed.lesson.model],q:seed.question,answer:seed.answers[seed.correct],choices:seed.answers,sum:seed.lesson.model,hint:seed.explain};
  window.TOPIC_MATHS={year,title,label:(year==='K'?'Kindergarten':'Year '+year)+' · '+title,generate,first};
})();

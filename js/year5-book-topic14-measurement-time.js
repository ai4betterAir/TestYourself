// Topic 14 upgrade: Year 5 Measurement, Units & Time.
// Newly written SkillUP material using the uploaded Grade 5 measurement chapters as a curriculum and difficulty reference.
(function(){
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const clean=n=>Number.isInteger(n)?String(n):String(Number(n.toFixed(3)));
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,explanation};
  }
  function fmtClock(mins){
    mins=((mins%1440)+1440)%1440;
    const h24=Math.floor(mins/60),m=mins%60,ampm=h24<12?'A.M.':'P.M.';
    let h=h24%12;if(h===0)h=12;
    return `${h}:${String(m).padStart(2,'0')} ${ampm}`;
  }
  function durationText(mins){const h=Math.floor(mins/60),m=mins%60;return h&&m?`${h} h ${m} min`:h?`${h} h`:`${m} min`;}
  function topicQuestion(){
    const mode=R(0,25);let a,b,c,ans;
    if(mode===0){a=R(2,95)/10;ans=a*1000;return Q(`${clean(a)} km = ? m`,`${clean(ans)} m`,[`${clean(a*100)} m`,`${clean(a*10)} m`,`${clean(a/1000)} m`],'A kilometre is 1,000 metres.',`${clean(a)} × 1000 = ${clean(ans)} m.`);}
    if(mode===1){a=R(20,950)/100;ans=a*1000;return Q(`${clean(a)} kg = ? g`,`${clean(ans)} g`,[`${clean(a*100)} g`,`${clean(a*10)} g`,`${clean(a/1000)} g`],'A kilogram is 1,000 grams.',`${clean(a)} × 1000 = ${clean(ans)} g.`);}
    if(mode===2){a=R(5,95)/10;ans=a*1000;return Q(`${clean(a)} L = ? mL`,`${clean(ans)} mL`,[`${clean(a*100)} mL`,`${clean(a*10)} mL`,`${clean(a/1000)} mL`],'A litre is 1,000 millilitres.',`${clean(a)} × 1000 = ${clean(ans)} mL.`);}
    if(mode===3){a=R(120,9800);ans=a/1000;return Q(`${a} mm = ? m`,`${clean(ans)} m`,[`${clean(a/100)} m`,`${clean(a/10)} m`,`${clean(a*1000)} m`],'To rename a smaller metric unit as a larger unit, divide.',`${a} ÷ 1000 = ${clean(ans)} m.`);}
    if(mode===4){const cases=[['length of an ant','mm'],['width of a book','cm'],['height of a door','m'],['distance between cities','km'],['medicine in a dropper','mL'],['water in a bottle','L'],['mass of a paper clip','g'],['mass of a person','kg']];const z=pick(cases);ans=z[1];return Q(`Which metric unit is most reasonable for the ${z[0]}?`,ans,[ans,'mm','cm','m','km','mL','L','g','kg'],'Choose a unit that matches both what is measured and its size.',`${z[1]} is the most reasonable unit here.`);}
    if(mode===5){const x=R(12,95)/10;const y=R(100,900);ans=x*100>y?`${clean(x)} m`:`${y} cm`;return Q(`Which length is greater: ${clean(x)} m or ${y} cm?`,ans,[ans,ans===`${clean(x)} m`?`${y} cm`:`${clean(x)} m`,'They are equal','Cannot be compared'],'Rename both measurements in the same unit before comparing.',`${clean(x)} m = ${clean(x*100)} cm, so the greater length is ${ans}.`);}
    if(mode===6){a=R(2,8);b=R(1,11);ans=a*12+b;return Q(`${a} ft ${b} in. = ? in.`,`${ans} in.`,[`${a*12} in.`,`${a+b} in.`,`${ans+12} in.`],'1 foot = 12 inches.',`${a} × 12 + ${b} = ${ans} in.`);}
    if(mode===7){a=R(2,7);b=R(0,3);ans=a*4+b;return Q(`${a} gal ${b} qt = ? qt`,`${ans} qt`,[`${a*2+b} qt`,`${a*8+b} qt`,`${a+b} qt`],'1 gallon = 4 quarts.',`${a} × 4 + ${b} = ${ans} qt.`);}
    if(mode===8){a=R(2,15);b=R(0,15);ans=a*16+b;return Q(`${a} lb ${b} oz = ? oz`,`${ans} oz`,[`${a*12+b} oz`,`${a*16} oz`,`${a+b} oz`],'1 pound = 16 ounces.',`${a} × 16 + ${b} = ${ans} oz.`);}
    if(mode===9){const cases=[['1 yard','3 feet'],['1 mile','5280 feet'],['1 quart','2 pints'],['1 gallon','4 quarts'],['1 pound','16 ounces'],['1 ton','2000 pounds']];const z=pick(cases);ans=z[1];return Q(`${z[0]} is equal to which measurement?`,ans,[ans,'10 units','100 units','1000 units'],'Recall the customary-unit relationship.',`${z[0]} = ${z[1]}.`);}
    if(mode===10){a=R(-12,25);b=R(3,14);const rise=Math.random()<0.5;ans=rise?a+b:a-b;return Q(`The temperature is ${a}°C and then ${rise?'rises':'falls'} by ${b}°. What is the new temperature?`,`${ans}°C`,[`${rise?a-b:a+b}°C`,`${Math.abs(ans)}°C`,`${a}°C`],rise?'A rise means add the change.':'A fall means subtract the change.',`${a} ${rise?'+':'−'} ${b} = ${ans}°C.`);}
    if(mode===11){const cases=[['water freezing','0°C'],['normal room temperature','about 20°C'],['a hot summer day','about 35°C'],['water boiling','100°C']];const z=pick(cases);ans=z[1];return Q(`Which is a reasonable temperature for ${z[0]}?`,ans,[ans,'−80°C','5°C','50°C','100°C'],'Use familiar benchmark temperatures.',`${ans} is a reasonable benchmark for ${z[0]}.`);}
    if(mode===12){const unit=pick([['h','min',60],['d','h',24],['wk','d',7],['y','mo',12],['min','s',60]]);a=R(2,9);ans=a*unit[2];return Q(`${a} ${unit[0]} = ? ${unit[1]}`,`${ans} ${unit[1]}`,[`${a+unit[2]} ${unit[1]}`,`${Math.floor(a*unit[2]/2)} ${unit[1]}`,`${a} ${unit[1]}`],'Multiply when renaming a larger time unit as a smaller one.',`${a} × ${unit[2]} = ${ans} ${unit[1]}.`);}
    if(mode===13){a=R(125,350);const h=Math.floor(a/60),m=a%60;ans=durationText(a);return Q(`${a} minutes = ?`,ans,[`${h} h`,`${h+1} h ${m} min`,`${Math.floor(a/100)} h ${a%100} min`],'Divide by 60. The quotient is hours and the remainder is minutes.',`${a} ÷ 60 = ${h} remainder ${m}, so ${ans}.`);}
    if(mode===14){const start=R(7*60,16*60)+pick([0,5,10,15,20,25,30,35,40,45,50,55]);const dur=R(35,210);ans=durationText(dur);return Q(`An activity starts at ${fmtClock(start)} and finishes at ${fmtClock(start+dur)}. How long does it last?`,ans,[durationText(Math.max(5,dur-30)),durationText(dur+30),durationText(dur+60)],'Count the hours and minutes from the start time to the finish time.',`The elapsed time is ${ans}.`);}
    if(mode===15){const start=R(7*60,19*60)+pick([0,10,15,20,30,40,45,50]);const dur=pick([35,50,75,90,105,135,150]);ans=fmtClock(start+dur);return Q(`A lesson starts at ${fmtClock(start)} and lasts ${durationText(dur)}. When does it finish?`,ans,[fmtClock(start+dur-30),fmtClock(start+dur+30),fmtClock(start+dur+60)],'Add the duration to the start time.',`${fmtClock(start)} + ${durationText(dur)} = ${ans}.`);}
    if(mode===16){const finish=R(8*60,21*60)+pick([0,10,15,20,30,40,45,50]);const dur=pick([40,55,75,90,110,135]);ans=fmtClock(finish-dur);return Q(`A trip finishes at ${fmtClock(finish)} after lasting ${durationText(dur)}. When did it start?`,ans,[fmtClock(finish-dur-30),fmtClock(finish-dur+30),fmtClock(finish-dur+60)],'Work backwards by subtracting the duration.',`${fmtClock(finish)} − ${durationText(dur)} = ${ans}.`);}
    if(mode===17){const start=R(21*60,23*60+30);const dur=R(75,240);ans=fmtClock(start+dur);return Q(`A journey starts at ${fmtClock(start)} and lasts ${durationText(dur)}. What is the finishing time?`,ans,[fmtClock(start+dur-60),fmtClock(start+dur+60),fmtClock(start+dur+120)],'When elapsed time passes midnight, continue counting into the next day.',`After ${durationText(dur)}, the finishing time is ${ans}.`);}
    if(mode===18){const base=R(7*60,18*60)+pick([0,15,30,45]);const offset=pick([1,2,3]);const ahead=Math.random()<0.5;ans=fmtClock(base+(ahead?offset:-offset)*60);return Q(`When it is ${fmtClock(base)} in City A, City B is ${offset} hour${offset===1?'':'s'} ${ahead?'ahead':'behind'}. What time is it in City B?`,ans,[fmtClock(base+(ahead?-offset:offset)*60),fmtClock(base+60),fmtClock(base-60)],ahead?'Ahead means add the time difference.':'Behind means subtract the time difference.',`City B time is ${ans}.`);}
    if(mode===19){a=R(1,5);b=R(35,59);c=R(1,4);const d=R(20,55);const total=(a+c)*60+b+d;ans=durationText(total);return Q(`Find the total time: ${a} h ${b} min + ${c} h ${d} min.`,ans,[`${a+c} h ${b+d} min`,durationText(total-60),durationText(total+60)],'Add like units. If minutes reach 60, regroup 60 minutes as 1 hour.',`${b} + ${d} = ${b+d} min. Regroup if needed. Total = ${ans}.`);}
    if(mode===20){a=R(4,9);b=R(0,30);c=R(1,a-1);const d=R(31,59);const total=(a*60+b)-(c*60+d);if(total<=0)return topicQuestion();ans=durationText(total);return Q(`${a} h ${b} min − ${c} h ${d} min = ?`,ans,[durationText(total+60),durationText(Math.max(1,total-60)),`${a-c} h ${Math.abs(b-d)} min`],'If the top minutes are too small, rename 1 hour as 60 minutes before subtracting.',`After regrouping, the difference is ${ans}.`);}
    if(mode===21){a=R(2,8);b=R(0,11);c=R(1,5);const d=R(0,11);const inches=(a+c)*12+b+d,feet=Math.floor(inches/12),inch=inches%12;ans=`${feet} ft ${inch} in.`;return Q(`${a} ft ${b} in. + ${c} ft ${d} in. = ?`,ans,[`${a+c} ft ${b+d} in.`,`${feet+1} ft ${inch} in.`,`${feet} ft ${inch+1} in.`],'Add inches first and regroup 12 inches as 1 foot.',`The total is ${inches} inches = ${ans}.`);}
    if(mode===22){const need=R(70,110),feet=R(7,10),have=feet*12,ans=have>=need?`${have-need} in. left`:`${need-have} in. short`;return Q(`You need ${need} in. of ribbon and have ${feet} ft. What happens after cutting the required length?`,ans,[ans,`${Math.abs(have-need)} ft left`,`${need} in. left`,'Exactly enough'],'Convert feet to inches before comparing.',`${feet} ft = ${have} in. Compare ${have} in. with ${need} in.: ${ans}.`);}
    if(mode===23){const each=pick([125,250,375,500]),count=R(4,16),total=each*count,litres=total/1000;ans=`${clean(litres)} L`;return Q(`${count} students each need ${each} mL of solution. How many litres are needed altogether?`,ans,[`${total} L`,`${clean(litres/10)} L`,`${clean(litres*10)} L`],'First find the total millilitres, then divide by 1,000.',`${count} × ${each} = ${total} mL = ${clean(litres)} L.`);}
    if(mode===24){const units=[['mm','most precise'],['cm','more precise than m'],['m','less precise than cm']];const z=pick(units);ans=z[1];return Q(`For measuring the same small object, using ${z[0]} is best described as:`,ans,[ans,'always the least precise','not a unit of length','the same precision as every other unit'],'For the same object, a smaller measurement unit gives a more precise measurement.',`${z[0]} gives ${z[1]} measurement in this comparison.`);}
    const start=R(6*60,9*60)+pick([0,15,30,45]),work=R(6*60,9*60),breakM=pick([30,45,60]);ans=durationText(work-breakM);return Q(`A worker is on site for ${durationText(work)} but has a ${breakM}-minute unpaid break. How much working time remains?`,ans,[durationText(work),durationText(work+breakM),durationText(Math.max(1,work-breakM-30))],'This is a multi-step time problem: subtract the break from the total elapsed time.',`${durationText(work)} − ${breakM} min = ${ans}.`);
  }

  if(window.TY_YEAR5_TESTS){
    window.TY_YEAR5_TESTS.topics=window.TY_YEAR5_TESTS.topics.filter(x=>x[0]!=='elapsed');
    const row=window.TY_YEAR5_TESTS.topics.find(x=>x[0]==='measurement');
    if(row){row[1]='⌚';row[2]='Measurement, Units & Time';row[3]='Metric and customary units, temperature, elapsed time, time zones and mixed-unit calculations';}
    const oldQuestion=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=function(t){return t==='measurement'?topicQuestion():oldQuestion(t)};
  }

  if(window.SKILLUP_MATH){
    const oldLearn=window.SKILLUP_MATH.learn;
    const oldEnhanced=window.SKILLUP_MATH.enhanced;
    window.SKILLUP_MATH.learn=function(g,t,fallback){
      if(String(g)==='5'&&t==='measurement')return{
        title:'Measurement, Units & Time',
        concept:'Measurement tells how long, heavy, full, hot or cold something is, and time tells when events happen and how long they last. The key skill is choosing sensible units, converting correctly, and keeping like units together when calculating.',
        steps:[
          'Metric measurement is decimal-based. Common units include mm, cm, m and km for length; mL and L for capacity; and mg, g and kg for mass. Multiply when changing a larger metric unit to a smaller one; divide when changing a smaller unit to a larger one.',
          'Choose a unit that fits the size of the object. Smaller units can give more precise measurements when measuring the same object.',
          'The source book also practises customary relationships: 12 in = 1 ft, 3 ft = 1 yd, 4 qt = 1 gal, 16 oz = 1 lb and 2000 lb = 1 ton.',
          'Temperature can be above or below zero. A rise means add; a fall means subtract. Useful Celsius benchmarks include 0°C for freezing water and 100°C for boiling water.',
          'Time relationships include 60 s = 1 min, 60 min = 1 h, 24 h = 1 day, 7 days = 1 week and 12 months = 1 year.',
          'Elapsed time is the amount of time between a start and finish. Count forward to find duration, add duration to find a finish time, or work backwards to find a start time.',
          'For time zones, apply the stated offset carefully. If a place is ahead, add the offset; if it is behind, subtract it.',
          'When adding or subtracting mixed measurements, work with like units and regroup when needed, such as 60 min = 1 h or 12 in = 1 ft.'
        ],
        examples:[
          {q:'3.4 km = ? m',steps:['1 km = 1000 m.','Multiply 3.4 by 1000.'],answer:'3400 m'},
          {q:'2.5 L = ? mL',steps:['1 L = 1000 mL.','2.5 × 1000 = 2500.'],answer:'2500 mL'},
          {q:'The temperature is 6°C and falls by 11°.',steps:['A fall means subtract.','6 − 11 crosses below zero.'],answer:'−5°C'},
          {q:'School starts at 8:30 A.M. and ends at 2:45 P.M.',steps:['8:30 A.M. to 2:30 P.M. is 6 hours.','2:30 P.M. to 2:45 P.M. is 15 minutes.'],answer:'6 h 15 min'},
          {q:'2 h 50 min + 1 h 35 min',steps:['Add minutes: 50 + 35 = 85 min.','Rename 85 min as 1 h 25 min.','Add the extra hour.'],answer:'4 h 25 min'}
        ],
        mistake:'Do not convert by guessing the direction of the decimal point. First identify which unit is larger. Also remember that time and customary measures are not base-10 systems: 60 minutes make an hour, 12 inches make a foot, and 16 ounces make a pound.',
        quick:'Choose the unit → write the conversion relationship → multiply or divide → keep units with every value → estimate whether the result is sensible.'
      };
      return oldLearn?oldLearn(g,t,fallback):null;
    };
    window.SKILLUP_MATH.enhanced=function(g,t){
      if(String(g)==='5'&&t==='measurement')return topicQuestion();
      return oldEnhanced?oldEnhanced(g,t):null;
    };
  }
})();
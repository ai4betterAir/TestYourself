// Selective Topic 14: Measurement, Units & Time Reasoning.
(function(){
  if(!window.SKILLUP_MR_EXTRA)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,topic:'sel_measure_time',name:'Measurement, Units & Time'};
  }
  const pad=n=>String(n).padStart(2,'0');
  const clock=mins=>{mins=((mins%1440)+1440)%1440;let h=Math.floor(mins/60),m=mins%60,ap=h>=12?'P.M.':'A.M.';h%=12;if(!h)h=12;return `${h}:${pad(m)} ${ap}`;};
  const dur=mins=>`${Math.floor(mins/60)} h ${mins%60} min`;
  function question(){
    const t=R(0,15);let a,b,c,ans;
    if(t===0){a=R(12,95)/10;b=R(100,900);const cm=a*100;ans=cm>b?`${a} m`:`${b} cm`;return Q(`Which is longer: ${a} m or ${b} cm?`,ans,[ans,ans===`${a} m`?`${b} cm`:`${a} m`,'They are equal','Cannot be compared'],'Convert to the same unit first.');}
    if(t===1){a=R(1500,9500);ans=`${(a/1000).toFixed(3)} kg`;return Q(`${a} g is equal to:`,ans,[ans,`${a/100} kg`,`${a} kg`,`${a*1000} kg`],'1000 g = 1 kg.');}
    if(t===2){a=pick([125,250,375,500]);b=R(8,24);const total=a*b;ans=`${total/1000} L`;return Q(`${b} students each need ${a} mL of solution. How many litres are needed?`,ans,[ans,`${total} L`,`${total/100} L`,`${total/10000} L`],'Find total millilitres, then divide by 1000.');}
    if(t===3){a=R(4,9);b=R(1,11);c=R(3,7);const have=a*12+b,need=c*12;ans=have-need;return Q(`A rope is ${a} ft ${b} in. long. ${c} ft is cut off. How many inches remain?`,`${ans} in.`,[`${have} in.`,`${need} in.`,`${ans+12} in.`],'Convert everything to inches before subtracting.');}
    if(t===4){a=R(-8,8);b=R(4,15);c=R(3,12);ans=a-b+c;return Q(`A temperature starts at ${a}°C, falls ${b}°, then rises ${c}°. What is the final temperature?`,`${ans}°C`,[`${a+b+c}°C`,`${a-b-c}°C`,`${a+c}°C`],'Track each signed change in order.');}
    if(t===5){const start=R(7*60,14*60)+pick([0,15,30,45]),travel=R(90,240),offset=R(1,3);ans=clock(start+travel+offset*60);return Q(`A flight leaves at ${clock(start)}, lasts ${dur(travel)}, and lands in a city ${offset} hour${offset>1?'s':''} ahead. What is the local arrival time?`,ans,[clock(start+travel),clock(start+travel-offset*60),clock(start+offset*60)],'Add travel time, then the positive time-zone difference.');}
    if(t===6){const finish=8*60+30;const prep=R(20,35),breakfast=R(10,25),travel=R(15,30),total=prep+breakfast+travel;ans=clock(finish-total);return Q(`A student must arrive by 8:30 A.M. Getting ready takes ${prep} min, breakfast ${breakfast} min and travel ${travel} min. What is the latest starting time?`,ans,[clock(finish-total-15),clock(finish-total+15),clock(finish-total+30)],'Add all required time, then work backwards.');}
    if(t===7){a=R(2,5);b=R(35,59);c=R(1,3);const d=R(20,55);const total=(a+c)*60+b+d;ans=dur(total);return Q(`${a} h ${b} min + ${c} h ${d} min = ?`,ans,[`${a+c} h ${b+d} min`,dur(total-60),dur(total+60)],'Regroup every 60 minutes as 1 hour.');}
    if(t===8){a=R(5,9);b=R(0,25);c=R(1,a-1);const d=R(30,59);const total=(a*60+b)-(c*60+d);if(total<=0)return question();ans=dur(total);return Q(`${a} h ${b} min − ${c} h ${d} min = ?`,ans,[dur(total+60),dur(Math.max(1,total-60)),`${a-c} h ${Math.abs(b-d)} min`],'Borrow 1 hour as 60 minutes if needed.');}
    if(t===9){const z=pick([['0.004 km','4 m'],['2.5 L','2500 mL'],['0.75 kg','750 g'],['3.2 m','320 cm']]);return Q(`Which conversion is correct for ${z[0]}?`,z[1],[z[1],'40 m','250 mL','75 g','32 cm'],'Use powers of 10 carefully.');}
    if(t===10){a=R(2,8);const scale=pick([10,100,1000]);ans=`${a*scale}`;return Q(`A measurement becomes ${scale} times as many units when converted to a smaller unit. If the original number is ${a}, what is the new numerical value?`,ans,[ans,`${a/scale}`,`${a+scale}`,`${a}`],'Smaller units mean more units are needed to represent the same quantity.');}
    if(t===11){const base=R(7*60,18*60)+pick([0,15,30,45]),offset=R(1,3),west=Math.random()<.5;ans=clock(base+(west?-offset:offset)*60);return Q(`City B is ${offset} hour${offset>1?'s':''} ${west?'west':'east'} of City A. If City A is ${clock(base)}, what is City B time?`,ans,[clock(base+(west?offset:-offset)*60),clock(base),clock(base+60)],west?'West is earlier.':'East is later.');}
    if(t===12){a=R(3,8);b=R(1,11);const total=a*12+b;const extra=R(10,30);ans=`${total+extra} in.`;return Q(`A board is ${a} ft ${b} in. long and is extended by ${extra} in. What is the new length in inches?`,ans,[`${total} in.`,`${a+b+extra} in.`,`${total+extra+12} in.`],'Convert the mixed measurement to inches first.');}
    if(t===13){a=R(6,20);b=R(2,8);const litres=a*b/1000;ans=`${litres} L`;return Q(`${a} containers each hold ${b} mL. What is the total capacity in litres?`,ans,[ans,`${a*b} L`,`${a+b} L`,`${litres*10} L`],'Multiply first, then convert mL to L.');}
    if(t===14){const start=R(21*60,23*60+30),elapsed=R(90,210);ans=clock(start+elapsed);return Q(`A movie starts at ${clock(start)} and runs for ${dur(elapsed)}. What time does it end?`,ans,[clock(start+elapsed-60),clock(start+elapsed+60),clock(start+elapsed+120)],'Continue counting through midnight if necessary.');}
    const whole=R(2,6),rem=R(1,11);const months=whole*12+rem;ans=`${months} months`;return Q(`${whole} years ${rem} months = ? months`,ans,[`${whole+rem} months`,`${whole*12} months`,`${months+12} months`],'Convert years to months, then add the remaining months.');
  }
  if(!window.SKILLUP_MR_EXTRA.topics.some(x=>x[0]==='sel_measure_time')){
    const i=window.SKILLUP_MR_EXTRA.topics.findIndex(x=>x[0]==='sel_volume3d');
    window.SKILLUP_MR_EXTRA.topics.splice(i>=0?i+1:14,0,['sel_measure_time','⌚','Measurement, Units & Time','Conversions, temperature, elapsed time, time zones and mixed-unit reasoning']);
  }
  const old=window.SKILLUP_MR_EXTRA.question.bind(window.SKILLUP_MR_EXTRA);
  window.SKILLUP_MR_EXTRA.question=id=>id==='sel_measure_time'?question():old(id);
})();
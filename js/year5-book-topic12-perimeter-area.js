// Topic 12 upgrade: Year 5 Perimeter & Area.
// Newly written SkillUP material using the uploaded Grade 5 perimeter/area chapters as a curriculum and difficulty reference.
(function(){
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,explanation};
  }
  const nfmt=n=>Number.isInteger(n)?String(n):Number(n.toFixed(2)).toString();
  function topicQuestion(){
    const mode=R(0,21);let l,w,s,p,a,b,h,ans;
    if(mode===0){l=R(6,30);w=R(3,20);ans=2*(l+w);return Q(`A rectangle is ${l} cm long and ${w} cm wide. What is its perimeter?`,`${ans} cm`,[`${l*w} cm`,`${l+w} cm`,`${2*l+w} cm`],'Perimeter is the distance around the outside.',`P = 2(${l} + ${w}) = ${ans} cm.`);}
    if(mode===1){s=R(4,25);ans=4*s;return Q(`A square has side length ${s} m. Find its perimeter.`,`${ans} m`,[`${s*s} m`,`${2*s} m`,`${s+4} m`],'A square has four equal sides.',`P = 4 × ${s} = ${ans} m.`);}
    if(mode===2){const sides=pick([5,6,8,10]);s=R(3,18);ans=sides*s;return Q(`A regular ${sides===5?'pentagon':sides===6?'hexagon':sides===8?'octagon':'decagon'} has side length ${s} cm. What is its perimeter?`,`${ans} cm`,[`${sides+s} cm`,`${2*s} cm`,`${s*s} cm`],'For a regular polygon, all sides have the same length.',`${sides} × ${s} = ${ans} cm.`);}
    if(mode===3){l=R(8,25);w=R(4,l-1);p=2*(l+w);ans=w;return Q(`A rectangle has perimeter ${p} cm and length ${l} cm. What is its width?`,`${ans} cm`,[`${p-l} cm`,`${p/2} cm`,`${l} cm`],'Half the perimeter equals length + width.',`${p} ÷ 2 = ${p/2}. Then ${p/2} − ${l} = ${ans} cm.`);}
    if(mode===4){l=R(6,24);w=R(3,18);ans=l*w;return Q(`Find the area of a rectangle ${l} m by ${w} m.`,`${ans} m²`,[`${2*(l+w)} m²`,`${l+w} m²`,`${ans} m`],'Area measures square units covering a surface.',`A = length × width = ${l} × ${w} = ${ans} m².`);}
    if(mode===5){s=R(4,22);ans=s*s;return Q(`A square has side length ${s} cm. What is its area?`,`${ans} cm²`,[`${4*s} cm²`,`${2*s} cm²`,`${ans} cm`],'Area of a square = side × side.',`${s} × ${s} = ${ans} cm².`);}
    if(mode===6){a=pick([48,60,72,84,96,108,120]);l=pick([4,6,8,10,12]);if(a%l!==0)return topicQuestion();ans=a/l;return Q(`A rectangle has area ${a} cm² and length ${l} cm. What is its width?`,`${ans} cm`,[`${a-l} cm`,`${a+l} cm`,`${a} cm`],'Use the area formula backwards.',`width = area ÷ length = ${a} ÷ ${l} = ${ans} cm.`);}
    if(mode===7){const s1=R(5,14),l2=s1*2,w2=Math.floor(s1/2);const area1=s1*s1,area2=l2*w2;ans=area1>area2?'square':area2>area1?'rectangle':'They have equal area';return Q(`A square is ${s1} cm by ${s1} cm. A rectangle is ${l2} cm by ${w2} cm. Which has the greater area?`,ans,[ans,'square','rectangle','They have equal area'],'Calculate both areas before comparing.',`Square: ${area1} cm². Rectangle: ${area2} cm². Therefore: ${ans}.`);}
    if(mode===8){l=R(10,24);w=R(8,18);a=R(2,l-2);b=R(2,w-2);ans=l*w-a*b;return Q(`A ${l} m by ${w} m rectangle has a ${a} m by ${b} m rectangular section removed. What area remains?`,`${ans} m²`,[`${l*w+a*b} m²`,`${l*w} m²`,`${a*b} m²`],'For a cut-out shape, subtract the missing rectangle from the whole rectangle.',`${l} × ${w} − ${a} × ${b} = ${l*w} − ${a*b} = ${ans} m².`);}
    if(mode===9){const l1=R(4,12),w1=R(3,10),l2=R(3,10),w2=R(2,8);ans=l1*w1+l2*w2;return Q(`An L-shaped floor can be split into rectangles ${l1} m × ${w1} m and ${l2} m × ${w2} m with no overlap. What is its total area?`,`${ans} m²`,[`${l1*w1} m²`,`${l2*w2} m²`,`${2*(l1+w1+l2+w2)} m²`],'Break a composite figure into rectangles and add their areas.',`${l1*w1} + ${l2*w2} = ${ans} m².`);}
    if(mode===10){b=R(5,20);h=R(3,15);ans=b*h;return Q(`A parallelogram has base ${b} cm and perpendicular height ${h} cm. Find its area.`,`${ans} cm²`,[`${2*(b+h)} cm²`,`${b+h} cm²`,`${b*h/2} cm²`],'Area of a parallelogram = base × perpendicular height.',`${b} × ${h} = ${ans} cm².`);}
    if(mode===11){b=R(6,24);h=R(4,18);if((b*h)%2)return topicQuestion();ans=b*h/2;return Q(`A triangle has base ${b} cm and perpendicular height ${h} cm. What is its area?`,`${ans} cm²`,[`${b*h} cm²`,`${b+h} cm²`,`${2*(b+h)} cm²`],'A triangle is half the area of a parallelogram with the same base and height.',`A = 1/2 × ${b} × ${h} = ${ans} cm².`);}
    if(mode===12){a=pick([30,36,42,48,54,60]);b=pick([6,8,9,10,12]);const height=2*a/b;if(!Number.isInteger(height))return topicQuestion();ans=height;return Q(`A triangle has area ${a} cm² and base ${b} cm. What is its perpendicular height?`,`${ans} cm`,[`${a/b} cm`,`${2*a} cm`,`${a-b} cm`],'Use A = 1/2 × base × height and work backwards.',`height = (2 × ${a}) ÷ ${b} = ${ans} cm.`);}
    if(mode===13){b=R(5,16);h=R(4,12);const para=b*h,tri=para/2;ans=`${nfmt(tri)} cm²`;return Q(`A parallelogram has area ${para} cm². A triangle has the same base and perpendicular height. What is the triangle's area?`,ans,[`${para} cm²`,`${para*2} cm²`,`${nfmt(para/4)} cm²`],'A triangle with the same base and height has half the area of the parallelogram.',`${para} ÷ 2 = ${nfmt(tri)} cm².`);}
    if(mode===14){l=R(8,20);w=R(6,15);const walls=2,area=walls*l*w,cover=pick([40,50,60,80]);ans=Math.ceil(area/cover);return Q(`Two rectangular walls are each ${l} m by ${w} m. One tin of paint covers ${cover} m². What is the minimum number of tins needed?`,ans,[Math.max(1,ans-1),ans+1,area],'Find total area first, then divide by the coverage and round up.',`Total area = 2 × ${l} × ${w} = ${area} m². ${area} ÷ ${cover} = ${(area/cover).toFixed(2)}, so ${ans} tins are needed.`);}
    if(mode===15){const full=R(18,30),cutW=R(3,8),cutH=R(2,6);ans=4*full;return Q(`A square is ${full} cm on each side. A ${cutW} cm by ${cutH} cm rectangular notch is cut from one corner. What happens to the perimeter?`,'It stays the same',[`It decreases by ${2*(cutW+cutH)} cm`,`It increases by ${2*(cutW+cutH)} cm`,'It stays the same','It becomes the area'],'At a corner notch, removed outside lengths are replaced by equal inside lengths.','The two removed edge lengths are replaced by two equal new edge lengths, so the perimeter stays the same.');}
    if(mode===16){const whole=R(20,40),wholeSquares=R(10,25),partial=R(4,12);ans=wholeSquares+partial;return Q(`On a grid, ${wholeSquares} full squares and partial squares worth about ${partial} more square units cover a shape. What is its estimated area?`,`${ans} square units`,[`${wholeSquares} square units`,`${partial} square units`,`${wholeSquares*partial} square units`],'For an irregular grid shape, add whole-square area and the estimated area of partial squares.',`${wholeSquares} + ${partial} ≈ ${ans} square units.`);}
    if(mode===17){ans='cm²';return Q('Which unit is appropriate for the area of a small notebook cover?','cm²',['cm','cm²','cm³','km²'],'Area is measured in square units.','A small surface is appropriately measured in square centimetres, cm².');}
    if(mode===18){l=R(8,25);w=R(5,18);const p1=2*(l+w),a1=l*w;ans=`Perimeter ${p1} cm; area ${a1} cm²`;return Q(`A rectangle is ${l} cm by ${w} cm. Which statement gives both measurements correctly?`,ans,[ans,`Perimeter ${a1} cm; area ${p1} cm²`,`Perimeter ${l+w} cm; area ${a1} cm²`,`Perimeter ${p1} cm²; area ${a1} cm`],'Perimeter uses linear units; area uses square units.',`P = ${p1} cm and A = ${a1} cm².`);}
    if(mode===19){const p=pick([32,40,48,56]),l=R(6,p/2-3),ww=p/2-l;ans=l*ww;return Q(`A rectangle has perimeter ${p} m and length ${l} m. What is its area?`,`${ans} m²`,[`${p*l} m²`,`${p/2} m²`,`${2*(l+ww)} m²`],'Find the missing width from the perimeter before finding area.',`Half the perimeter is ${p/2}. Width = ${p/2} − ${l} = ${ww} m. Area = ${l} × ${ww} = ${ans} m².`);}
    if(mode===20){const area=pick([36,48,60,72]);const pairs=[];for(let x=1;x<=area;x++)if(area%x===0&&x<=area/x)pairs.push([x,area/x]);const z=pick(pairs),per=2*(z[0]+z[1]);ans=`${z[0]} by ${z[1]}`;return Q(`Which whole-number rectangle can have area ${area} square units and perimeter ${per} units?`,ans,[ans,`${z[0]} by ${z[1]+1}`,`${z[0]+1} by ${z[1]}`,`1 by ${area}`],'Use both conditions: product gives area and twice the sum gives perimeter.',`${z[0]} × ${z[1]} = ${area}, and 2(${z[0]} + ${z[1]}) = ${per}.`);}
    b=R(6,18);h=R(4,12);ans=b*h;return Q(`A parallelogram is cut and rearranged into a rectangle without losing any pieces. The parallelogram has base ${b} cm and height ${h} cm. What is the rectangle's area?`,`${ans} cm²`,[`${b*h/2} cm²`,`${2*(b+h)} cm²`,`${b+h} cm²`],'Rearranging without overlap or gaps does not change area.',`The related rectangle has the same base and height, so area = ${b} × ${h} = ${ans} cm².`);
  }

  if(window.TY_YEAR5_TESTS){
    const row=window.TY_YEAR5_TESTS.topics.find(x=>x[0]==='perimeterarea');
    if(row){row[1]='▭';row[2]='Perimeter & Area';row[3]='Perimeter, square measure, rectangles, composite figures, parallelograms and triangles';}
    const oldQuestion=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=function(t){return t==='perimeterarea'?topicQuestion():oldQuestion(t)};
  }

  if(window.SKILLUP_MATH){
    const oldLearn=window.SKILLUP_MATH.learn;
    const oldEnhanced=window.SKILLUP_MATH.enhanced;
    window.SKILLUP_MATH.learn=function(g,t,fallback){
      if(String(g)==='5'&&t==='perimeterarea')return{
        title:'Perimeter & Area',
        concept:'Perimeter measures the distance around a shape. Area measures how many square units cover a surface. Use the correct formula, the correct measurement, and the correct unit for each problem.',
        steps:[
          'Perimeter is the distance around a polygon. Add all outside side lengths. For a rectangle, P = 2(length + width); for a square, P = 4 × side.',
          'Area is measured in square units such as cm², m² and km². On a grid, count full squares and estimate partial squares.',
          'Rectangle area = length × width. Square area = side × side.',
          'For composite figures, split the shape into rectangles and add their areas, or find a large rectangle and subtract the missing part.',
          'Parallelogram area = base × perpendicular height. The sloping side is not the height unless it is perpendicular to the base.',
          'Triangle area = 1/2 × base × perpendicular height. A triangle has half the area of a parallelogram with the same base and height.',
          'Perimeter uses linear units such as cm or m. Area uses square units such as cm² or m².'
        ],
        examples:[
          {q:'A rectangle is 14 cm long and 8 cm wide. Find its perimeter and area.',steps:['Perimeter: 2(14 + 8) = 44 cm.','Area: 14 × 8 = 112 cm².','Notice that the units are different.'],answer:'Perimeter 44 cm; Area 112 cm²'},
          {q:'An L-shape is split into rectangles 8 m × 5 m and 3 m × 4 m.',steps:['First rectangle: 8 × 5 = 40 m².','Second rectangle: 3 × 4 = 12 m².','Add: 40 + 12 = 52 m².'],answer:'52 m²'},
          {q:'A parallelogram has base 9 cm and perpendicular height 6 cm.',steps:['Use base × perpendicular height.','9 × 6 = 54.'],answer:'54 cm²'},
          {q:'A triangle has base 12 cm and perpendicular height 7 cm.',steps:['Multiply base × height: 12 × 7 = 84.','Take half: 84 ÷ 2 = 42.'],answer:'42 cm²'},
          {q:'A rectangle has area 96 cm² and length 12 cm. Find the width.',steps:['Area = length × width.','Width = area ÷ length.','96 ÷ 12 = 8.'],answer:'8 cm'}
        ],
        mistake:'Do not confuse perimeter with area. Do not write square units for perimeter. For triangles and parallelograms, use the perpendicular height, not a sloping side.',
        quick:'Quick check: a 10 cm by 6 cm rectangle has perimeter 32 cm and area 60 cm².'
      };
      return oldLearn?oldLearn(g,t,fallback):null;
    };
    window.SKILLUP_MATH.enhanced=function(g,t){
      if(String(g)==='5'&&t==='perimeterarea')return topicQuestion();
      return oldEnhanced?oldEnhanced(g,t):null;
    };
  }
})();
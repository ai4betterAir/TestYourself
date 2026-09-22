// Selective Topic 12: Perimeter & Area Reasoning.
// Newly written SkillUP questions covering the Year 5 perimeter/area concepts, with harder multi-step reasoning.
(function(){
  if(!window.SKILLUP_MR_EXTRA)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,topic:'sel_perimeter_area',name:'Perimeter & Area'};
  }
  function question(){
    const t=R(0,15);let l,w,p,a,b,h,ans;
    if(t===0){l=R(10,30);w=R(5,20);p=2*(l+w);ans=l*w;return Q(`A rectangle has perimeter ${p} cm and length ${l} cm. What is its area?`,`${ans} cm²`,[`${p*l} cm²`,`${p/2} cm²`,`${2*(l+w)} cm²`],'Find the width from half the perimeter, then use area = length × width.');}
    if(t===1){const area=pick([48,60,72,84,96]);const factors=[];for(let x=2;x<=Math.sqrt(area);x++)if(area%x===0)factors.push([x,area/x]);if(!factors.length)return question();const z=pick(factors),per=2*(z[0]+z[1]);ans=`${z[0]} cm by ${z[1]} cm`;return Q(`A rectangle has area ${area} cm² and perimeter ${per} cm. Which dimensions fit both conditions?`,ans,[ans,`${z[0]+1} cm by ${z[1]} cm`,`1 cm by ${area} cm`,`${z[0]} cm by ${z[1]+1} cm`],'Use both the product for area and twice the sum for perimeter.');}
    if(t===2){l=R(12,28);w=R(8,20);a=R(3,l-3);b=R(2,w-2);ans=l*w-a*b;return Q(`A ${l} m by ${w} m courtyard has a ${a} m by ${b} m garden bed inside it. What area remains uncovered?`,`${ans} m²`,[`${l*w+a*b} m²`,`${l*w} m²`,`${a*b} m²`],'Subtract the inner rectangle from the outer rectangle.');}
    if(t===3){const outerL=R(14,24),outerW=R(10,18),border=2;const innerL=outerL-2*border,innerW=outerW-2*border;ans=outerL*outerW-innerL*innerW;return Q(`A rectangular picture is ${outerL} cm by ${outerW} cm. A border ${border} cm wide runs all the way around the inside. What is the area of the border?`,`${ans} cm²`,[`${outerL*outerW} cm²`,`${innerL*innerW} cm²`,`${2*(outerL+outerW)} cm²`],'Find the area of the whole rectangle and subtract the inner rectangle.');}
    if(t===4){const side=R(8,20),cutW=R(2,side-3),cutH=R(2,side-3);ans=4*side;return Q(`A ${side} cm square has a ${cutW} cm by ${cutH} cm rectangular notch removed from one corner. What is the new perimeter?`,`${ans} cm`,[`${ans+2*(cutW+cutH)} cm`,`${ans-2*(cutW+cutH)} cm`,`${side*side-cutW*cutH} cm`],'At a corner notch, removed outer lengths are replaced by equal inner lengths.');}
    if(t===5){const sides=pick([5,6,8]);const side=R(5,14),gate=R(1,4);ans=sides*side-gate;return Q(`A regular ${sides===5?'pentagonal':sides===6?'hexagonal':'octagonal'} garden has side length ${side} m. A gate ${gate} m wide needs no fence. How much fencing is needed?`,`${ans} m`,[`${sides*side} m`,`${ans+gate} m`,`${side-gate} m`],'Find the full perimeter, then subtract the gate opening.');}
    if(t===6){b=R(8,24);h=R(4,16);const para=b*h,tri=para/2;ans=`${tri} cm²`;return Q(`A parallelogram and a triangle have the same base ${b} cm and perpendicular height ${h} cm. If the parallelogram area is ${para} cm², what is the triangle area?`,ans,[`${para} cm²`,`${para*2} cm²`,`${b+h} cm²`],'A triangle with the same base and height has half the parallelogram area.');}
    if(t===7){const triArea=pick([36,42,48,54,60]);b=pick([6,8,9,10,12]);h=2*triArea/b;if(!Number.isInteger(h))return question();ans=`${h} cm`;return Q(`A triangle has area ${triArea} cm² and base ${b} cm. What is its perpendicular height?`,ans,[`${triArea/b} cm`,`${triArea-b} cm`,`${2*triArea} cm`],'Rearrange A = 1/2 × base × height.');}
    if(t===8){const l1=R(6,14),w1=R(4,10),l2=R(3,8),w2=R(2,7);ans=l1*w1+l2*w2;return Q(`An L-shaped room is split into non-overlapping rectangles ${l1} m × ${w1} m and ${l2} m × ${w2} m. What is its area?`,`${ans} m²`,[`${l1*w1} m²`,`${l2*w2} m²`,`${2*(l1+w1+l2+w2)} m²`],'Split the composite figure into rectangles and add their areas.');}
    if(t===9){const p=pick([36,40,44,48]),half=p/2;const l1=half-4,w1=4,l2=Math.floor(half/2),w2=half-l2;const a1=l1*w1,a2=l2*w2;ans=a1>a2?'the first rectangle':a2>a1?'the second rectangle':'they have the same area';return Q(`Two rectangles both have perimeter ${p} cm. The first is ${l1} cm by ${w1} cm. The second is ${l2} cm by ${w2} cm. Which has the greater area?`,ans,[ans,'the first rectangle','the second rectangle','they have the same area'],'Equal perimeter does not guarantee equal area; calculate both areas.');}
    if(t===10){const wallL=R(8,16),wallH=R(3,6),walls=R(2,4),coverage=pick([20,25,30]);const total=wallL*wallH*walls;ans=Math.ceil(total/coverage);return Q(`${walls} identical walls are each ${wallL} m by ${wallH} m. One tin covers ${coverage} m². What is the minimum number of tins needed?`,ans,[Math.max(1,ans-1),ans+1,total],'Find total wall area, divide by coverage, then round up.');}
    if(t===11){const whole=R(18,35),partial=R(5,12);ans=whole+partial;return Q(`A grid estimate counts ${whole} complete square units and partial squares worth about ${partial} more. What is the best estimate of the area?`,`${ans} square units`,[`${whole} square units`,`${partial} square units`,`${whole*partial} square units`],'Estimated area = whole squares + estimated partial squares.');}
    if(t===12){l=R(8,20);w=R(5,15);const scale=2;ans=(l*scale)*(w*scale);return Q(`A rectangle ${l} cm by ${w} cm is enlarged so both side lengths double. What is the new area?`,`${ans} cm²`,[`${2*l*w} cm²`,`${l*w} cm²`,`${4*(l+w)} cm²`],'Area depends on two dimensions. Doubling both multiplies area by 4.');}
    if(t===13){const base=R(8,18),height=R(5,12);const area=base*height;const newBase=base*2,newHeight=height/2;ans=area;return Q(`A parallelogram has base ${base} cm and height ${height} cm. A second parallelogram has twice the base and half the height. What is its area?`,`${ans} cm²`,[`${area*2} cm²`,`${area/2} cm²`,`${newBase+newHeight} cm²`],'Area = base × height. Doubling one factor and halving the other keeps the product unchanged.');}
    if(t===14){const squareSide=R(6,15),rectL=squareSide*2,rectW=Math.floor(squareSide/2);const sa=squareSide*squareSide,ra=rectL*rectW;ans=sa===ra?'They have the same area':sa>ra?'The square':'The rectangle';return Q(`A square is ${squareSide} cm by ${squareSide} cm. A rectangle is ${rectL} cm by ${rectW} cm. Which has the greater area?`,ans,[ans,'The square','The rectangle','They have the same perimeter'],'Compare the two areas, not the side lengths.');}
    const base=R(10,24),height=R(6,16),cutBase=Math.floor(base/2),big=base*height,cut=cutBase*height/2;ans=big-cut;return Q(`A parallelogram has base ${base} cm and height ${height} cm. A triangular section with base ${cutBase} cm and the same height is removed. What area remains?`,`${ans} cm²`,[`${big} cm²`,`${cut} cm²`,`${big+cut} cm²`],'Find the parallelogram area, then subtract the triangle area.');
  }

  const geo=window.SKILLUP_MR_EXTRA.topics.find(x=>x[0]==='sel_geometry');
  if(geo){geo[1]='∠';geo[2]='Geometry & Angles';geo[3]='Angle sums, polygons, congruence, circles, symmetry, transformations and tessellations';}
  if(!window.SKILLUP_MR_EXTRA.topics.some(x=>x[0]==='sel_perimeter_area')){
    const i=window.SKILLUP_MR_EXTRA.topics.findIndex(x=>x[0]==='sel_geometry');
    window.SKILLUP_MR_EXTRA.topics.splice(i>=0?i+1:12,0,['sel_perimeter_area','▭','Perimeter & Area','Composite shapes, missing dimensions, fencing, area relationships and multi-step reasoning']);
  }
  const old=window.SKILLUP_MR_EXTRA.question.bind(window.SKILLUP_MR_EXTRA);
  window.SKILLUP_MR_EXTRA.question=id=>id==='sel_perimeter_area'?question():old(id);
})();
// Selective Topic 11: Geometry & Angles Reasoning.
// Newly written SkillUP questions covering Year 5 geometry chapter.
(function(){
  if(!window.SKILLUP_MR_EXTRA)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const Q=(text,answer,choices,tip)=>({text,answer:String(answer),choices:shuffle(uniq(choices.map(String))),tip,topic:'sel_geometry',name:'Geometry & Angles'});
  function question(){
    const t=R(0,15);let a,b,c,ans;
    if(t===0){
      a=R(25,75);b=R(25,75);ans=180-a-b;if(ans<=0)return question();
      return Q(`A triangle has angles ${a}° and ${b}°. What is the third angle?`,`${ans}°`,[`${ans}°`,`${a+b}°`,`${180-a}°`,`${180-b}°`],'Triangle angles total 180°.');
    }
    if(t===1){
      a=pick([96,108,120,132]);ans=(180-a)/2;
      return Q(`An isosceles triangle has one angle of ${a}°. What is the measure of each of the other two angles?`,`${ans}°`,[`${ans}°`,`${180-a}°`,`${a/2}°`,`${90-ans}°`],'The equal base angles share the remaining angle sum equally.');
    }
    if(t===2){
      a=R(60,120);b=R(60,120);c=R(60,Math.min(130,300-a-b));ans=360-a-b-c;if(ans<=0||ans>=180)return question();
      return Q(`Three angles of a quadrilateral are ${a}°, ${b}° and ${c}°. What is the fourth angle?`,`${ans}°`,[`${ans}°`,`${180-a}°`,`${360-a-b}°`,`${a+b+c}°`],'Quadrilateral angles total 360°.');
    }
    if(t===3){
      const y=R(15,30),x=2*y;ans=`X = ${x}°, Y = ${y}°`;
      return Q(`Angle X is twice angle Y, and together they make ${x+y}°. What are the two angles?`,ans,[ans,`X = ${y}°, Y = ${x}°`,`X = ${x+y}°, Y = 0°`,`X = ${x-5}°, Y = ${y+5}°`],'Represent Y as one part and X as two equal parts.');
    }
    if(t===4){
      a=R(35,120);ans=`${a}°`;
      return Q(`Two polygons are similar. A corresponding angle in the first polygon is ${a}°. What is the matching angle in the second?`,ans,[ans,`${180-a}°`,`${360-a}°`,`${2*a}°`],'Corresponding angles of similar polygons are equal.');
    }
    if(t===5){
      ans='They are congruent';
      return Q('Two triangles have the same three side lengths and the same three angle measures. Which statement is strongest?',ans,[ans,'They are only similar','They must be perpendicular','They cannot be compared'],'Congruent figures have the same size and shape.');
    }
    if(t===6){
      const cases=[
        ['two pairs of parallel sides and four right angles','rectangle'],
        ['two pairs of parallel sides and four equal sides, but no right angles','rhombus'],
        ['four equal sides and four right angles','square'],
        ['exactly one pair of parallel sides','trapezium']
      ];const z=pick(cases);ans=z[1];
      return Q(`Which quadrilateral matches this description: ${z[0]}?`,ans,[ans,'rectangle','rhombus','square','parallelogram','trapezium'],'Use the most specific set of side, angle and parallel-line properties.');
    }
    if(t===7){
      a=pick([4,6,8,10,12]);ans=(Math.PI*a).toFixed(1);
      return Q(`A circular wheel has diameter ${a} cm. Approximately how far does one full turn move along the ground? Use π ≈ 3.14.`,`${(3.14*a).toFixed(1)} cm`,[`${(3.14*a).toFixed(1)} cm`,`${(2*a).toFixed(1)} cm`,`${(3.14*a/2).toFixed(1)} cm`,`${(a*a).toFixed(1)} cm`],'One full turn covers one circumference: C = πd.');
    }
    if(t===8){
      const d=pick([20,30,40,50]),turns=R(2,6),dist=3.14*d*turns;ans=`${dist.toFixed(1)} cm`;
      return Q(`A wheel has diameter ${d} cm and makes ${turns} complete turns. About how far does it travel? Use π ≈ 3.14.`,ans,[ans,`${(3.14*d).toFixed(1)} cm`,`${(d*turns).toFixed(1)} cm`,`${(2*3.14*d*turns).toFixed(1)} cm`],'Distance = circumference × number of turns.');
    }
    if(t===9){
      const cases=[['a square after a 180° turn','Yes'],['an equilateral triangle after a 180° turn','No'],['a non-square rectangle after a 180° turn','Yes'],['a scalene triangle after a 180° turn','No']];const z=pick(cases);ans=z[1];
      return Q(`Will ${z[0]} look exactly the same?`,ans,[ans,ans==='Yes'?'No':'Yes'],'Half-turn symmetry means unchanged after a 180° rotation.');
    }
    if(t===10){
      ans='90° clockwise';
      return Q('A 270° counterclockwise rotation is equivalent to which clockwise rotation?',ans,[ans,'90° counterclockwise','180° clockwise','270° clockwise'],'Subtract 270° from a full 360° turn.');
    }
    if(t===11){
      const cases=[
        ['every point moves 5 units right','translation'],
        ['a figure becomes its mirror image across a line','reflection'],
        ['a figure turns 90° about a fixed point','rotation']
      ];const z=pick(cases);ans=z[1];
      return Q(`Which transformation occurs when ${z[0]}?`,ans,[ans,'translation','reflection','rotation'],'Slide = translation, mirror flip = reflection, turn = rotation.');
    }
    if(t===12){
      ans='equilateral triangle';
      return Q('Which single regular polygon can tessellate the plane by itself?',ans,[ans,'regular pentagon','regular heptagon','regular nonagon'],'A tessellation must cover the plane without gaps or overlaps.');
    }
    if(t===13){
      const cases=[[4,2],[5,5],[6,9]];const z=pick(cases);ans=z[1];
      return Q(`How many diagonals does a ${z[0]===4?'quadrilateral':z[0]===5?'pentagon':'hexagon'} have?`,ans,[ans,Math.max(0,ans-1),ans+1,z[0]],'A diagonal joins two non-adjacent vertices. Count each distinct diagonal once.');
    }
    if(t===14){
      a=R(20,70);ans=90-a;
      return Q(`Two lines are perpendicular. A ray inside one right angle creates an angle of ${a}°. What is the remaining angle inside that right angle?`,`${ans}°`,[`${ans}°`,`${180-a}°`,`${90+a}°`,`${a}°`],'The two smaller angles partition a 90° angle.');
    }
    a=pick([120,140,160]);const half=(180-a)/2;ans=half;
    return Q(`A triangle has one obtuse angle of ${a}°. The other two angles are equal. What is each of those angles?`,`${ans}°`,[`${ans}°`,`${180-a}°`,`${a/2}°`,`${90-ans}°`],'Subtract the obtuse angle from 180°, then divide the remainder by 2.');
  }

  if(!window.SKILLUP_MR_EXTRA.topics.some(x=>x[0]==='sel_geometry')){
    const i=window.SKILLUP_MR_EXTRA.topics.findIndex(x=>x[0]==='sel_prob_stats');
    window.SKILLUP_MR_EXTRA.topics.splice(i>=0?i+1:11,0,['sel_geometry','∠','Geometry & Angles','Angle sums, polygons, congruence, circles, symmetry, transformations and tessellations']);
  }
  const old=window.SKILLUP_MR_EXTRA.question.bind(window.SKILLUP_MR_EXTRA);
  window.SKILLUP_MR_EXTRA.question=id=>id==='sel_geometry'?question():old(id);
})();
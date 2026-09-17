// Topic 11 upgrade: Year 5 Geometry & Angles.
// Newly written SkillUP material using the uploaded Grade 5 geometry chapter as a curriculum/style reference.
(function(){
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);
    const pool=uniq((choices||[]).map(String)).filter(x=>x!==ans);
    const shown=shuffle([ans,...shuffle(pool).slice(0,3)]);
    return {text,answer:ans,choices:shown,tip,explanation};
  }
  const angleType=n=>n===90?'right':n===180?'straight':n<90?'acute':'obtuse';
  const polygonName={3:'triangle',4:'quadrilateral',5:'pentagon',6:'hexagon',7:'heptagon',8:'octagon',9:'nonagon',10:'decagon'};
  function topicQuestion(){
    const mode=R(0,24);let a,b,c,d,ans;
    if(mode===0){
      a=pick([18,35,62,89,90,104,137,179,180]);ans=angleType(a);
      return Q(`Classify an angle that measures ${a}°.`,ans,[ans,'acute','right','obtuse','straight'],'Acute < 90°, right = 90°, obtuse is between 90° and 180°, straight = 180°.',`${a}° is a ${ans} angle.`);
    }
    if(mode===1){
      a=R(15,75);ans=90-a;
      return Q(`Two angles together make a right angle. One is ${a}°. What is the other angle?`,`${ans}°`,[`${ans}°`,`${90+a}°`,`${180-a}°`,`${a}°`],'A right angle is 90°.',`90° − ${a}° = ${ans}°.`);
    }
    if(mode===2){
      a=R(25,155);ans=180-a;
      return Q(`Two adjacent angles form a straight angle. One measures ${a}°. Find the other.`,`${ans}°`,[`${ans}°`,`${180+a}°`,`${90-a}°`,`${a}°`],'Angles on a straight line total 180°.',`180° − ${a}° = ${ans}°.`);
    }
    if(mode===3){
      a=R(25,80);b=R(25,Math.min(100,150-a));ans=180-a-b;
      return Q(`A triangle has angles ${a}° and ${b}°. What is the third angle?`,`${ans}°`,[`${ans}°`,`${a+b}°`,`${180-a}°`,`${180-b}°`],'The angles of a triangle total 180°.',`180° − ${a}° − ${b}° = ${ans}°.`);
    }
    if(mode===4){
      a=pick([84,96,108,120]);ans=(180-a)/2;
      return Q(`An isosceles triangle has one angle of ${a}°. The other two angles are equal. What is each equal angle?`,`${ans}°`,[`${ans}°`,`${180-a}°`,`${a/2}°`,`${90-ans}°`],'Subtract the known angle from 180°, then split the remainder equally.',`180° − ${a}° = ${180-a}°. ${180-a}° ÷ 2 = ${ans}°.`);
    }
    if(mode===5){
      const cases=[['all three sides equal','equilateral'],['exactly two sides equal','isosceles'],['no sides equal','scalene']];const z=pick(cases);ans=z[1];
      return Q(`Which triangle has ${z[0]}?`,ans,[ans,'equilateral','isosceles','scalene'],'Classify triangles by side lengths.',`${z[0][0].toUpperCase()+z[0].slice(1)} describes an ${ans} triangle.`);
    }
    if(mode===6){
      const cases=[['three acute angles','acute triangle'],['one right angle','right triangle'],['one obtuse angle','obtuse triangle']];const z=pick(cases);ans=z[1];
      return Q(`A triangle has ${z[0]}. How is it classified by angles?`,ans,[ans,'acute triangle','right triangle','obtuse triangle'],'A triangle is named by its largest angle type.',`It is a ${ans}.`);
    }
    if(mode===7){
      a=R(3,10);ans=polygonName[a];
      return Q(`What is the name of a polygon with ${a} sides?`,ans,[ans,'pentagon','hexagon','octagon','decagon'],'Polygon names depend on the number of sides.',`${a} sides make a ${ans}.`);
    }
    if(mode===8){
      ans='all sides equal and all angles equal';
      return Q('Which description defines a regular polygon?',ans,[ans,'only opposite sides equal','all angles acute','exactly one pair of parallel sides'],'A regular polygon has equal side lengths and equal angle measures.','A regular polygon has all sides congruent and all angles congruent.');
    }
    if(mode===9){
      const z=pick([
        ['same shape and same size','congruent'],
        ['same shape but possibly different sizes','similar']
      ]);ans=z[1];
      return Q(`Two figures have the ${z[0]}. Which word best describes them?`,ans,[ans,'congruent','similar','perpendicular'],'Congruent means same size and shape. Similar means same shape, not necessarily the same size.',`The figures are ${ans}.`);
    }
    if(mode===10){
      const cases=[
        ['4 equal sides and 4 right angles','square'],
        ['4 right angles, but not all sides equal','rectangle'],
        ['4 equal sides, but not 4 right angles','rhombus'],
        ['2 pairs of parallel opposite sides','parallelogram'],
        ['exactly 1 pair of parallel sides','trapezium']
      ];const z=pick(cases);ans=z[1];
      return Q(`Which quadrilateral is described by: ${z[0]}?`,ans,[ans,'square','rectangle','rhombus','parallelogram','trapezium'],'Use side, angle and parallel-line properties to classify the shape.',`The description matches a ${ans}.`);
    }
    if(mode===11){
      a=R(55,120);b=R(55,120);c=R(55,Math.min(130,300-a-b));ans=360-a-b-c;if(ans<=0||ans>=180)return topicQuestion();
      return Q(`A quadrilateral has angles ${a}°, ${b}°, ${c}° and x°. Find x.`,`${ans}°`,[`${ans}°`,`${180-a}°`,`${360-a-b}°`,`${a+b+c}°`],'The interior angles of a quadrilateral total 360°.',`x = 360° − (${a}° + ${b}° + ${c}°) = ${ans}°.`);
    }
    if(mode===12){
      a=R(2,20);ans=2*a;
      return Q(`A circle has radius ${a} cm. What is its diameter?`,`${ans} cm`,[`${ans} cm`,`${a} cm`,`${a/2} cm`,`${a+2} cm`],'Diameter = 2 × radius.',`2 × ${a} = ${ans} cm.`);
    }
    if(mode===13){
      a=pick([4,5,6,8,10,12]);ans=(3.14*a).toFixed(2).replace(/\.00$/,'');
      return Q(`A circle has diameter ${a} cm. Using π ≈ 3.14, what is its circumference?`,`${ans} cm`,[`${ans} cm`,`${(3.14*a/2).toFixed(2).replace(/\.00$/,'')} cm`,`${2*a} cm`,`${(a*a).toFixed(0)} cm`],'Circumference = π × diameter.',`3.14 × ${a} = ${ans} cm.`);
    }
    if(mode===14){
      const cases=[['square',4],['rectangle',2],['equilateral triangle',3],['isosceles triangle',1]];const z=pick(cases);ans=z[1];
      return Q(`How many lines of symmetry does a ${z[0]} have?`,ans,[ans,0,1,2,3,4],'A line of symmetry folds a figure into matching halves.',`A ${z[0]} has ${ans} line${ans===1?'':'s'} of symmetry.`);
    }
    if(mode===15){
      const cases=[['rectangle','Yes'],['parallelogram','Yes'],['equilateral triangle','No'],['non-square isosceles triangle','No']];const z=pick(cases);ans=z[1];
      return Q(`Does a ${z[0]} have half-turn (180° rotational) symmetry?`,ans,[ans,ans==='Yes'?'No':'Yes'],'Half-turn symmetry means the figure looks unchanged after a 180° turn.',`${z[0][0].toUpperCase()+z[0].slice(1)}: ${ans}.`);
    }
    if(mode===16){
      const cases=[['slides 4 units right without turning','translation'],['flips across a mirror line','reflection'],['turns 90° around a point','rotation']];const z=pick(cases);ans=z[1];
      return Q(`A shape ${z[0]}. Which transformation occurred?`,ans,[ans,'translation','reflection','rotation'],'Translation = slide, reflection = flip, rotation = turn.',`This movement is a ${ans}.`);
    }
    if(mode===17){
      ans='90° clockwise';
      return Q('Which clockwise rotation is equivalent to a 270° counterclockwise rotation?',ans,[ans,'90° counterclockwise','180° clockwise','270° clockwise'],'A full turn is 360°. 360° − 270° = 90° in the opposite direction.','270° counterclockwise is equivalent to 90° clockwise.');
    }
    if(mode===18){
      ans='a repeating pattern that covers a surface with no gaps and no overlaps';
      return Q('Which description best defines a tessellation?',ans,[ans,'a pattern with overlapping polygons','a pattern made only from circles','any collection of regular polygons'],'A tessellation covers a plane completely without gaps or overlaps.',ans[0].toUpperCase()+ans.slice(1)+'.');
    }
    if(mode===19){
      const cases=[[3,0],[4,2],[5,5],[6,9]];const z=pick(cases);a=z[0];ans=z[1];
      return Q(`How many diagonals can be drawn in a ${polygonName[a]}?`,ans,[ans,Math.max(0,ans-1),ans+1,a],'A diagonal joins two non-adjacent vertices. Count each distinct connection once.',`A ${polygonName[a]} has ${ans} diagonal${ans===1?'':'s'}.`);
    }
    if(mode===20){
      a=R(18,28);ans=2*a;
      return Q(`Angle X is twice angle Y. Together they make ${3*a}°. If Y = ${a}°, what is X?`,`${ans}°`,[`${ans}°`,`${a}°`,`${3*a}°`,`${90-a}°`],'“Twice” means multiply by 2.',`X = 2 × ${a}° = ${ans}°.`);
    }
    if(mode===21){
      a=R(35,120);ans=`${a}°`;
      return Q(`Two polygons are similar. One angle in the first polygon is ${a}°. What is the corresponding angle in the second polygon?`,ans,[ans,`${180-a}°`,`${360-a}°`,`${2*a}°`],'Corresponding angles of similar polygons are equal.',`The corresponding angle is ${a}°.`);
    }
    if(mode===22){
      const cases=[['a line segment from the centre to the circle','radius'],['a chord through the centre','diameter'],['a line segment joining two points on the circle','chord'],['an angle with its vertex at the centre','central angle']];const z=pick(cases);ans=z[1];
      return Q(`Which circle term means ${z[0]}?`,ans,[ans,'radius','diameter','chord','arc','central angle'],'Match the definition to the circle part.',`The correct term is ${ans}.`);
    }
    if(mode===23){
      a=R(2,15)*2;ans=a/2;
      return Q(`The diameter of a circle is ${a} m. What is its radius?`,`${ans} m`,[`${ans} m`,`${a*2} m`,`${a} m`,`${ans+1} m`],'Radius = diameter ÷ 2.',`${a} ÷ 2 = ${ans} m.`);
    }
    ans='four right angles';
    return Q('What do perpendicular lines form at their intersection?',ans,[ans,'four acute angles','two straight angles only','four obtuse angles'],'Perpendicular lines meet at 90°.',`They form ${ans}.`);
  }

  if(window.TY_YEARS345?.topics?.['5']){
    const row=window.TY_YEARS345.topics['5'].find(x=>x[0]==='geometry');
    if(row){row[1]='∠';row[2]='Geometry & Angles';row[3]='Angles, polygons, triangles, quadrilaterals, circles, symmetry and transformations';}
  }
  if(window.TY_YEAR5_TESTS){
    window.TY_YEAR5_TESTS.topics=window.TY_YEAR5_TESTS.topics.filter(x=>!['angles','symmetry'].includes(x[0]));
    const row=window.TY_YEAR5_TESTS.topics.find(x=>x[0]==='geometry');
    if(row){row[1]='∠';row[2]='Geometry & Angles';row[3]='Angles, polygons, triangles, quadrilaterals, circles, symmetry and transformations';}
    const oldQuestion=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=function(t){return t==='geometry'?topicQuestion():oldQuestion(t)};
  }

  if(window.SKILLUP_MATH){
    const oldLearn=window.SKILLUP_MATH.learn;
    const oldEnhanced=window.SKILLUP_MATH.enhanced;
    window.SKILLUP_MATH.learn=function(g,t,fallback){
      if(String(g)==='5'&&t==='geometry')return{
        title:'Geometry & Angles',
        concept:'Geometry describes shapes, angles, lines and movement. In this topic you classify and calculate angles, compare polygons, use triangle and quadrilateral angle sums, identify parts of circles, and reason about symmetry, transformations and tessellations.',
        steps:[
          'Classify angles by size: acute < 90°, right = 90°, obtuse is between 90° and 180°, and straight = 180°. Perpendicular lines meet at right angles.',
          'A polygon is a closed plane figure made from line segments. A regular polygon has all sides equal and all angles equal.',
          'Triangles can be classified by sides (scalene, isosceles, equilateral) or by angles (acute, right, obtuse). Triangle angles total 180°.',
          'Quadrilateral angles total 360°. Use parallel sides, equal sides and right angles to distinguish parallelograms, rectangles, rhombuses, squares and trapeziums.',
          'Congruent figures have the same size and shape. Similar figures have the same shape; corresponding angles are equal even when the sizes differ.',
          'For circles, diameter = 2 × radius and circumference = π × diameter. A radius, diameter, chord, arc and central angle describe different circle parts.',
          'Transformations preserve shape: translation = slide, reflection = flip, rotation = turn. Symmetry and tessellations help describe repeated geometric patterns.'
        ],
        examples:[
          {q:'A triangle has angles 48° and 67°. Find the third angle.',steps:['Triangle angles total 180°.','48° + 67° = 115°.','180° − 115° = 65°.'],answer:'65°'},
          {q:'A quadrilateral has angles 90°, 85°, 110° and x°.',steps:['Quadrilateral angles total 360°.','90° + 85° + 110° = 285°.','360° − 285° = 75°.'],answer:'75°'},
          {q:'Which quadrilateral has four equal sides and four right angles?',steps:['Four equal sides could describe a rhombus.','Four right angles could describe a rectangle.','Having both properties identifies the most specific shape.'],answer:'Square'},
          {q:'A circle has radius 7 cm. Find its diameter.',steps:['Diameter is twice the radius.','2 × 7 = 14.'],answer:'14 cm'},
          {q:'A shape is flipped across a vertical line.',steps:['A slide is a translation.','A turn is a rotation.','A flip across a line is a reflection.'],answer:'Reflection'},
          {q:'Can a pattern be a tessellation if it has gaps?',steps:['A tessellation must cover the plane.','The shapes cannot overlap.','There can be no gaps between shapes.'],answer:'No'}
        ],
        mistake:'Do not decide a shape only from how it looks—use its properties. Triangle angles total 180°, but quadrilateral angles total 360°. Do not confuse radius with diameter, or translation with reflection/rotation.',
        quick:'Angles → shape properties → angle sums → circle parts → symmetry and transformations. Name the rule before calculating.'
      };
      return oldLearn?oldLearn(g,t,fallback):null;
    };
    window.SKILLUP_MATH.enhanced=function(g,t){
      if(String(g)==='5'&&t==='geometry')return topicQuestion();
      return oldEnhanced?oldEnhanced(g,t):null;
    };
  }
})();
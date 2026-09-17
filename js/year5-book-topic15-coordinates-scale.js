// Topic 15 upgrade: Year 5 Coordinates, Scale & Maps.
// Newly written SkillUP material using the uploaded Grade 5 coordinate-plane and scale-map lessons as curriculum references.
(function(){
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,explanation};
  }
  const pt=(x,y)=>`(${x}, ${y})`;
  function quadrant(x,y){
    if(x===0&&y===0)return 'origin';
    if(x===0)return 'y-axis';
    if(y===0)return 'x-axis';
    if(x>0&&y>0)return 'Quadrant I';
    if(x<0&&y>0)return 'Quadrant II';
    if(x<0&&y<0)return 'Quadrant III';
    return 'Quadrant IV';
  }
  function topicQuestion(){
    const mode=R(0,23);let x,y,a,b,c,d,ans;
    if(mode===0){const z=pick([['horizontal axis','x-axis'],['vertical axis','y-axis'],['point where the axes meet','origin']]);return Q(`On a coordinate plane, what is the ${z[0]} called?`,z[1],[z[1],'x-axis','y-axis','origin'],'The x-axis is horizontal, the y-axis is vertical, and they meet at the origin.',`The ${z[0]} is the ${z[1]}.`);}
    if(mode===1){x=pick([-6,-5,-4,-3,3,4,5,6]);y=pick([-6,-5,-4,-3,3,4,5,6]);ans=quadrant(x,y);return Q(`Which quadrant contains the point ${pt(x,y)}?`,ans,['Quadrant I','Quadrant II','Quadrant III','Quadrant IV'],'Look at the signs of x and y.',`${pt(x,y)} lies in ${ans}.`);}
    if(mode===2){x=R(-6,6);y=R(-6,6);const dx=pick([-4,-3,-2,2,3,4]),dy=pick([-4,-3,-2,2,3,4]);ans=pt(x+dx,y+dy);return Q(`Point P is ${pt(x,y)}. It moves ${Math.abs(dx)} units ${dx>0?'right':'left'} and ${Math.abs(dy)} units ${dy>0?'up':'down'}. What are the new coordinates?`,ans,[pt(x-dx,y+dy),pt(x+dx,y-dy),pt(x-dx,y-dy)],'Change x for left/right and y for up/down.',`${pt(x,y)} becomes ${ans}.`);}
    if(mode===3){x=pick([-6,-5,-4,-3,3,4,5,6]);y=R(-6,6);ans=pt(-x,y);return Q(`Point ${pt(x,y)} is reflected across the y-axis. Where does it move?`,ans,[pt(x,-y),pt(-x,-y),pt(x,y)],'A reflection across the y-axis changes the sign of x only.',`${pt(x,y)} → ${ans}.`);}
    if(mode===4){x=R(-7,2);a=R(3,8);y=R(-5,5);ans=a;return Q(`Points A${pt(x,y)} and B${pt(x+a,y)} lie on a horizontal line. How far apart are they?`,`${ans} units`,[`${a+1} units`,`${Math.abs(y)} units`,`${2*a} units`],'For a horizontal segment, subtract the x-coordinates.',`${x+a} − (${x}) = ${a} units.`);}
    if(mode===5){x=R(-5,3);y=R(-5,3);a=R(2,7);b=R(2,7);ans=pt(x,y+b);return Q(`Three vertices of an axis-aligned rectangle are ${pt(x,y)}, ${pt(x+a,y)} and ${pt(x+a,y+b)}. What is the fourth vertex?`,ans,[pt(x+a,y-b),pt(x-a,y+b),pt(x,y-b)],'Match the missing x-coordinate with the left side and the missing y-coordinate with the top side.',`The fourth vertex is ${ans}.`);}
    if(mode===6){x=R(-4,2);y=R(-4,2);a=R(2,7);b=R(2,6);const per=2*(a+b),area=a*b;ans=`Perimeter ${per} units; area ${area} square units`;return Q(`A rectangle has vertices ${pt(x,y)}, ${pt(x+a,y)}, ${pt(x+a,y+b)} and ${pt(x,y+b)}. Find its perimeter and area.`,ans,[`Perimeter ${a+b} units; area ${area} square units`,`Perimeter ${per} units; area ${2*area} square units`,`Perimeter ${area} units; area ${per} square units`],'Find width and height from coordinate differences, then use rectangle formulas.',`Width = ${a}, height = ${b}. P = 2(${a}+${b}) = ${per}; A = ${a}×${b} = ${area}.`);}
    if(mode===7){x=R(-7,7);y=R(-7,7);ans=x===0||y===0?quadrant(x,y):quadrant(x,y);return Q(`Where is the point ${pt(x,y)} located?`,ans,[ans,'x-axis','y-axis','origin','Quadrant I','Quadrant II','Quadrant III','Quadrant IV'],'A zero coordinate places a point on an axis; otherwise use the signs to identify a quadrant.',`${pt(x,y)} is on/in the ${ans}.`);}
    if(mode===8){const scale=pick([2,5,10,20,25,50]);a=R(2,9);ans=a*scale;return Q(`A map scale is 1 cm : ${scale} km. Two towns are ${a} cm apart on the map. What is the actual distance?`,`${ans} km`,[`${a+scale} km`,`${Math.floor(ans/2)} km`,`${scale} km`],'Multiply the map distance by the scale value.',`${a} × ${scale} = ${ans} km.`);}
    if(mode===9){const scale=pick([2,4,5,8,10,12]);a=R(2,9);const actual=a*scale;ans=a;return Q(`On a map, 1 cm represents ${scale} km. An actual distance is ${actual} km. How long should it be on the map?`,`${ans} cm`,[`${actual} cm`,`${scale} cm`,`${a*2} cm`],'Divide the actual distance by the distance represented by 1 cm.',`${actual} ÷ ${scale} = ${a} cm.`);}
    if(mode===10){const map=R(2,8),actual=map*pick([4,5,6,8,10]);ans=actual/map;return Q(`${map} cm on a map represents ${actual} km. What distance does 1 cm represent?`,`${ans} km`,[`${actual} km`,`${map} km`,`${actual+map} km`],'Find the unit scale by dividing actual distance by map distance.',`${actual} ÷ ${map} = ${ans}, so 1 cm represents ${ans} km.`);}
    if(mode===11){const scale=pick([2,3,4,5]),draw=R(2,10),actual=draw*scale;ans=actual;return Q(`A scale drawing uses 1 cm : ${scale} m. A wall is ${draw} cm long in the drawing. What is its actual length?`,`${ans} m`,[`${draw+scale} m`,`${draw} m`,`${ans} cm`],'Use the scale ratio.',`${draw} × ${scale} = ${ans} m.`);}
    if(mode===12){const scale=pick([2,5,10,20]),a=R(2,6),b=R(2,6);ans=(a+b)*scale;return Q(`A route on a map has two legs of ${a} cm and ${b} cm. The scale is 1 cm : ${scale} km. What is the total actual distance?`,`${ans} km`,[`${(a+b)} km`,`${a*b*scale} km`,`${Math.abs(a-b)*scale} km`],'Add the map lengths first, then apply the scale.',`(${a}+${b}) × ${scale} = ${ans} km.`);}
    if(mode===13){const scale=pick([5,10,20]);a=R(2,8);b=R(2,8);ans=a>b?'Route A':b>a?'Route B':'They are equal';return Q(`On the same map, Route A measures ${a} cm and Route B measures ${b} cm. The scale is 1 cm : ${scale} km. Which route is longer in real life?`,ans,['Route A','Route B','They are equal','Cannot be determined'],'Because both routes use the same scale, compare the map lengths directly.',`${a} cm versus ${b} cm gives: ${ans}.`);}
    if(mode===14){const k=pick([2,3,4,5]);a=R(2,8);b=R(2,7);const pDraw=2*(a+b),pActual=pDraw*k;ans=pActual;return Q(`A rectangular garden is ${a} cm by ${b} cm on a scale drawing where 1 cm represents ${k} m. What is the actual perimeter?`,`${ans} m`,[`${a*b*k} m`,`${pDraw} m`,`${2*(a*k+b)} m`],'Convert each side or scale the drawing perimeter.',`Drawing perimeter = ${pDraw} cm. Actual perimeter = ${pDraw} × ${k} = ${ans} m.`);}
    if(mode===15){const k=pick([2,3,4,5]);a=R(2,7);b=R(2,6);const actual=(a*k)*(b*k);ans=actual;return Q(`A rectangle is ${a} cm by ${b} cm on a drawing with scale 1 cm : ${k} m. What is the actual area?`,`${ans} m²`,[`${a*b*k} m²`,`${a*b} m²`,`${2*(a+b)*k} m²`],'Scale both lengths first, then multiply to find area.',`Actual dimensions: ${a*k} m by ${b*k} m. Area = ${ans} m².`);}
    if(mode===16){x=pick([-6,-5,-4,-3,3,4,5,6]);y=pick([-6,-5,-4,-3,3,4,5,6]);const dx=R(-3,3),dy=R(-3,3);ans=pt(x+dx,y+dy);return Q(`A point starts at ${pt(x,y)} and is translated by (${dx>=0?'+':''}${dx}, ${dy>=0?'+':''}${dy}). What is the image?`,ans,[pt(x-dx,y+dy),pt(x+dx,y-dy),pt(x-dx,y-dy)],'Add the translation values to the coordinates.',`${pt(x,y)} + (${dx}, ${dy}) = ${ans}.`);}
    if(mode===17){x=pick([-6,-5,-4,-3,3,4,5,6]);y=pick([-6,-5,-4,-3,3,4,5,6]);ans=pt(x,-y);return Q(`Point ${pt(x,y)} is reflected across the x-axis. What are the new coordinates?`,ans,[pt(-x,y),pt(-x,-y),pt(x,y)],'A reflection across the x-axis changes the sign of y only.',`${pt(x,y)} → ${ans}.`);}
    if(mode===18){x=R(-5,5);y=R(-5,5);ans=pt(0,0);return Q('What are the coordinates of the origin?',ans,['(0, 0)','(1, 0)','(0, 1)','(1, 1)'],'The origin is where the x-axis and y-axis cross.','The origin is (0, 0).');}
    if(mode===19){const x1=R(-6,-2),x2=R(2,6),y=R(-5,5);ans=`${Math.abs(x2-x1)} units`;return Q(`Point A is ${pt(x1,y)} and Point B is ${pt(x2,y)}. What is AB?`,ans,[`${Math.abs(x2+x1)} units`,`${Math.abs(x2-x1)+1} units`,`${Math.abs(x2-x1)-1} units`],'On a horizontal line, distance is the absolute difference of x-coordinates.',`|${x2} − (${x1})| = ${Math.abs(x2-x1)}.`);}
    if(mode===20){x=R(-5,2);y=R(-5,2);a=R(2,6);ans=pt(x,y+a);return Q(`Points ${pt(x,y)} and ${pt(x+a,y)} are adjacent vertices of a square with sides parallel to the axes. Which point could be another vertex above them?`,ans,[pt(x+a,y-a),pt(x-a,y+a),pt(x,y-a)],'A square built above a horizontal side uses the same side length vertically.',`The side length is ${a}, so ${ans} is one possible upper vertex.`);}
    if(mode===21){const mapA=R(2,6),actualA=mapA*pick([5,10,20]),mapB=R(2,6);const scale=actualA/mapA;ans=mapB*scale;return Q(`On one map, ${mapA} cm represents ${actualA} km. How many kilometres does ${mapB} cm represent?`,`${ans} km`,[`${mapA*mapB} km`,`${actualA+mapB} km`,`${scale+mapB} km`],'Find the distance represented by 1 cm, then scale up.',`1 cm represents ${scale} km, so ${mapB} cm represents ${ans} km.`);}
    if(mode===22){const scale=pick([2,5,10]),actual=R(3,9)*scale;const half=actual/2;ans=half/scale;return Q(`A road is ${actual} km long. On a map with scale 1 cm : ${scale} km, what map length represents half the road?`,`${ans} cm`,[`${half} cm`,`${actual/scale} cm`,`${ans*2} cm`],'Find half the actual distance first, then convert using the scale.',`Half is ${half} km. ${half} ÷ ${scale} = ${ans} cm.`);}
    x=R(-4,4);y=R(-4,4);a=R(2,5);b=R(2,5);ans=pt(x+a-b,y+b-a);return Q(`Start at ${pt(x,y)}. Move ${a} right, ${b} up, ${b} left and ${a} down. Where do you finish?`,ans,[pt(x,y),pt(x+a,y+b),pt(x-b,y-a)],'Track x and y changes separately.',`Net x-change = ${a}−${b}; net y-change = ${b}−${a}. Final point: ${ans}.`);
  }

  if(window.TY_YEAR5_TESTS){
    window.TY_YEAR5_TESTS.topics=window.TY_YEAR5_TESTS.topics.filter(x=>x[0]!=='scale');
    let row=window.TY_YEAR5_TESTS.topics.find(x=>x[0]==='coordinates');
    if(!row){row=['coordinates','⌖','Coordinates, Scale & Maps','Coordinate planes, ordered pairs, quadrants, scale drawings and map distances'];window.TY_YEAR5_TESTS.topics.push(row);}
    row[1]='⌖';row[2]='Coordinates, Scale & Maps';row[3]='Coordinate planes, ordered pairs, quadrants, scale drawings and map distances';
    const oldIndex=window.TY_YEAR5_TESTS.topics.indexOf(row);if(oldIndex>=0)window.TY_YEAR5_TESTS.topics.splice(oldIndex,1);
    const after=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='measurement');
    window.TY_YEAR5_TESTS.topics.splice(after>=0?after+1:window.TY_YEAR5_TESTS.topics.length,0,row);
    const oldQuestion=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=function(t){return t==='coordinates'?topicQuestion():oldQuestion(t)};
  }

  if(window.SKILLUP_MATH){
    const oldLearn=window.SKILLUP_MATH.learn;
    const oldEnhanced=window.SKILLUP_MATH.enhanced;
    window.SKILLUP_MATH.learn=function(g,t,fallback){
      if(String(g)==='5'&&t==='coordinates')return{
        title:'Coordinates, Scale & Maps',
        concept:'Coordinates locate points using ordered pairs (x, y). Maps and scale drawings use a fixed ratio so a small pictured distance can represent a much larger real distance.',
        steps:[
          'A coordinate plane has a horizontal x-axis and a vertical y-axis. They meet at the origin, (0, 0).',
          'Read an ordered pair as (x, y): move left or right for x first, then up or down for y.',
          'The four quadrants are determined by the signs of x and y. Points with x = 0 lie on the y-axis; points with y = 0 lie on the x-axis.',
          'For translations, add the horizontal change to x and the vertical change to y. Reflections across an axis change one coordinate sign.',
          'A scale drawing is accurate but different in size. The scale compares a pictured measure with the actual measure.',
          'To find actual distance from a map, multiply by the scale. To find map distance from an actual distance, divide by the scale.',
          'For shapes on a coordinate grid, use coordinate differences to find side lengths before calculating perimeter or area.'
        ],
        examples:[
          {q:'Which quadrant contains (−4, 3)?',steps:['x is negative, so move left.','y is positive, so move up.','Left and up is Quadrant II.'],answer:'Quadrant II'},
          {q:'Point (2, −1) moves 4 right and 3 up.',steps:['x: 2 + 4 = 6.','y: −1 + 3 = 2.'],answer:'(6, 2)'},
          {q:'A map scale is 1 cm : 10 km. Two places are 6 cm apart.',steps:['Each centimetre represents 10 km.','6 × 10 = 60.'],answer:'60 km'},
          {q:'On a map, 1 cm represents 8 km. How many centimetres represent 40 km?',steps:['Use actual distance ÷ scale.','40 ÷ 8 = 5.'],answer:'5 cm'},
          {q:'A rectangle on a coordinate grid is 7 units wide and 4 units high.',steps:['Perimeter = 2(7 + 4) = 22 units.','Area = 7 × 4 = 28 square units.'],answer:'Perimeter 22 units; area 28 square units'}
        ],
        mistake:'Do not swap x and y. Also do not multiply when the question asks you to go from an actual distance back to a map distance—divide by the scale instead.',
        quick:'Remember: x first, then y. Map → real: multiply. Real → map: divide.'
      };
      return oldLearn?oldLearn(g,t,fallback):fallback;
    };
    window.SKILLUP_MATH.enhanced=function(g,t){if(String(g)==='5'&&t==='coordinates')return topicQuestion();return oldEnhanced?oldEnhanced(g,t):null;};
  }
})();

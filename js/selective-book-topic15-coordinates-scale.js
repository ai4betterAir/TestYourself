// Selective Topic 15: Coordinates, Scale & Maps Reasoning.
(function(){
  if(!window.SKILLUP_MR_EXTRA)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  const pt=(x,y)=>`(${x}, ${y})`;
  function Q(text,answer,choices,tip){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,topic:'sel_coords_scale',name:'Coordinates, Scale & Maps'};
  }
  function question(){
    const t=R(0,15);let x,y,a,b,c,ans;
    if(t===0){x=R(-7,1);y=R(-6,2);a=R(3,8);b=R(3,7);ans=pt(x,y+b);return Q(`Three vertices of a rectangle are ${pt(x,y)}, ${pt(x+a,y)} and ${pt(x+a,y+b)}. Which point completes the rectangle?`,ans,[pt(x-a,y+b),pt(x,y-b),pt(x+a,y-b)],'Match vertical sides by x-coordinate and horizontal sides by y-coordinate.');}
    if(t===1){x=R(-5,5);y=R(-5,5);const dx1=R(-4,4),dy1=R(-4,4),dx2=R(-4,4),dy2=R(-4,4);ans=pt(x+dx1+dx2,y+dy1+dy2);return Q(`Point ${pt(x,y)} is translated by (${dx1>=0?'+':''}${dx1}, ${dy1>=0?'+':''}${dy1}) and then by (${dx2>=0?'+':''}${dx2}, ${dy2>=0?'+':''}${dy2}). Where does it finish?`,ans,[pt(x+dx1-dx2,y+dy1+dy2),pt(x+dx1+dx2,y+dy1-dy2),pt(x-dx1-dx2,y-dy1-dy2)],'Combine the x-changes and y-changes separately.');}
    if(t===2){x=pick([-6,-5,-4,-3,3,4,5,6]);y=pick([-6,-5,-4,-3,3,4,5,6]);ans=pt(-x,-y);return Q(`A point ${pt(x,y)} is rotated 180° about the origin. What are its new coordinates?`,ans,[pt(-x,y),pt(x,-y),pt(y,x)],'A half-turn about the origin changes the signs of both coordinates.');}
    if(t===3){const scale=pick([5,8,10,12,15,20]),legs=[R(2,7),R(2,7),R(2,7)],total=legs.reduce((s,v)=>s+v,0)*scale;ans=`${total} km`;return Q(`A map route has three legs measuring ${legs[0]} cm, ${legs[1]} cm and ${legs[2]} cm. The scale is 1 cm : ${scale} km. What is the total real distance?`,ans,[`${legs.reduce((s,v)=>s+v,0)} km`,`${legs.reduce((s,v)=>s+v,0)*scale/2} km`,`${legs[0]*legs[1]*legs[2]} km`],'Add all map distances first, then use the scale.');}
    if(t===4){const map=R(2,8),unit=pick([4,5,6,8,10,12]),actual=map*unit,target=R(2,7);ans=`${target*unit} km`;return Q(`${map} cm on a map represents ${actual} km. How far does ${target} cm represent?`,ans,[`${target*map} km`,`${actual+target} km`,`${unit+target} km`],'First find the real distance represented by 1 cm.');}
    if(t===5){const scale=pick([2,4,5,8,10]),actual=R(4,12)*scale;ans=`${actual/scale} cm`;return Q(`A map uses 1 cm : ${scale} km. A road is ${actual} km long. What length should represent it on the map?`,ans,[`${actual} cm`,`${scale} cm`,`${actual/scale+1} cm`],'Actual → map means divide by the scale.');}
    if(t===6){const k=pick([2,3,4,5]),l=R(3,8),w=R(2,7),area=(l*k)*(w*k);ans=`${area} m²`;return Q(`A floor plan uses 1 cm : ${k} m. A room measures ${l} cm by ${w} cm on the plan. What is its actual area?`,ans,[`${l*w*k} m²`,`${l*w} m²`,`${2*(l+w)*k} m²`],'Scale both dimensions before multiplying. Area does not scale by the length factor only.');}
    if(t===7){const k=pick([2,3,4]),l=R(3,8),w=R(2,7),per=2*(l+w)*k;ans=`${per} m`;return Q(`A rectangular park is ${l} cm by ${w} cm on a drawing with scale 1 cm : ${k} m. What is its actual perimeter?`,ans,[`${2*(l+w)} m`,`${l*w*k} m`,`${per/k} m`],'Find the drawing perimeter and multiply by the scale factor.');}
    if(t===8){x=R(-5,0);y=R(-5,0);a=R(3,8);b=R(2,7);const per=2*(a+b),area=a*b;ans=`${area} square units`;return Q(`A rectangle has vertices ${pt(x,y)}, ${pt(x+a,y)}, ${pt(x+a,y+b)} and ${pt(x,y+b)}. Its perimeter is ${per} units. What is its area?`,ans,[`${per} square units`,`${2*area} square units`,`${a+b} square units`],'Use coordinate differences to recover the side lengths.');}
    if(t===9){const scale=pick([5,10,20]),a=R(2,8),b=R(2,8),c=R(2,8);const route1=(a+b)*scale,route2=c*scale;ans=route1<route2?'Route 1':route2<route1?'Route 2':'Same distance';return Q(`On one map, Route 1 has legs ${a} cm and ${b} cm. Route 2 is ${c} cm. The scale is 1 cm : ${scale} km. Which route is shorter?`,ans,['Route 1','Route 2','Same distance','Cannot be determined'],'Both routes use the same scale, so compare their total map lengths.');}
    if(t===10){x=pick([-6,-5,-4,-3,3,4,5,6]);y=pick([-6,-5,-4,-3,3,4,5,6]);const clue=`x is ${x<0?'negative':'positive'} and y is ${y<0?'negative':'positive'}`;const q=x>0&&y>0?'Quadrant I':x<0&&y>0?'Quadrant II':x<0&&y<0?'Quadrant III':'Quadrant IV';return Q(`A point has this sign pattern: ${clue}. Which quadrant must contain it?`,q,['Quadrant I','Quadrant II','Quadrant III','Quadrant IV'],'Quadrants are determined by the signs of x and y.');}
    if(t===11){x=R(-4,4);y=R(-4,4);a=R(2,6);const p1=pt(x,y),p2=pt(x+a,y);ans=pt(x,y+a);return Q(`Two adjacent vertices of a square are ${p1} and ${p2}. The square lies above this side and its sides are parallel to the axes. Which point is another vertex?`,ans,[pt(x+a,y-a),pt(x-a,y+a),pt(x,y-a)],'The vertical side length must equal the horizontal side length.');}
    if(t===12){const pairs=[[2,18],[3,27],[4,36],[5,45]];const z=pick(pairs),scale=z[1]/z[0],target=R(2,7);ans=`${target*scale} km`;return Q(`A map does not show its scale. You know ${z[0]} cm represents ${z[1]} km. What actual distance does ${target} cm represent?`,ans,[`${target*z[0]} km`,`${z[1]+target} km`,`${scale} km`],'Find the unit rate first: actual distance per 1 cm.');}
    if(t===13){const factor=pick([2,3,4]);const originalArea=R(6,20);ans=`${originalArea*factor*factor} square units`;return Q(`A map drawing is enlarged so every length becomes ${factor} times as long. A region originally has area ${originalArea} square units. What is the new area?`,ans,[`${originalArea*factor} square units`,`${originalArea+factor} square units`,`${originalArea*factor*factor*factor} square units`],'When lengths scale by k, area scales by k².');}
    if(t===14){x=R(-6,6);y=R(-6,6);const dx=pick([-5,-4,-3,3,4,5]),dy=pick([-5,-4,-3,3,4,5]);const after=pt(x+dx,y+dy);ans=`${dx>0?'right':'left'} ${Math.abs(dx)}, ${dy>0?'up':'down'} ${Math.abs(dy)}`;return Q(`Point ${pt(x,y)} moves to ${after}. Which translation describes the move?`,ans,[`${dx>0?'left':'right'} ${Math.abs(dx)}, ${dy>0?'up':'down'} ${Math.abs(dy)}`,`${dx>0?'right':'left'} ${Math.abs(dx)}, ${dy>0?'down':'up'} ${Math.abs(dy)}`,`${dy>0?'right':'left'} ${Math.abs(dy)}, ${dx>0?'up':'down'} ${Math.abs(dx)}`],'Subtract the starting coordinates from the finishing coordinates.');}
    const scale=pick([4,5,8,10]);a=R(3,9);b=R(2,8);const direct=a*scale,detour=(a+b)*scale;ans=`${detour-direct} km`;return Q(`A direct route is ${a} cm on a map. A detour is ${a+b} cm. The scale is 1 cm : ${scale} km. How much farther is the detour in real life?`,ans,[`${b} km`,`${direct} km`,`${detour} km`],'Find the extra map length, then apply the scale.');
  }
  if(!window.SKILLUP_MR_EXTRA.topics.some(x=>x[0]==='sel_coords_scale')){
    const i=window.SKILLUP_MR_EXTRA.topics.findIndex(x=>x[0]==='sel_measure_time');
    window.SKILLUP_MR_EXTRA.topics.splice(i>=0?i+1:15,0,['sel_coords_scale','⌖','Coordinates, Scale & Maps','Quadrants, transformations, missing points, map scales and multi-step distance reasoning']);
  }
  const old=window.SKILLUP_MR_EXTRA.question.bind(window.SKILLUP_MR_EXTRA);
  window.SKILLUP_MR_EXTRA.question=id=>id==='sel_coords_scale'?question():old(id);
})();

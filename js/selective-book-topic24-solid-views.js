// Topic 24: Selective Views & Cross-Sections of Solids.
(function(){
  const mr=window.SKILLUP_MR_EXTRA;if(!mr)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a,pick=a=>a[R(0,a.length-1)],shuffle=a=>[...a].sort(()=>Math.random()-.5),uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip){const ans=String(answer);let rest=uniq(choices.map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);let k=1;while(rest.length<3){const v=String(k++);if(v!==ans&&!rest.includes(v))rest.push(v);}return{text,answer:ans,choices:shuffle([ans,...rest]),tip,topic:'sel_solid_views',name:'Views & Cross-Sections of Solids'};}
  function question(){const m=R(0,13);let l=R(6,15),w=R(3,9),h=R(2,8),r=R(2,7),ans;
    if(m===0){ans=`${w} cm by ${h} cm`;return Q(`A rectangular prism has top view ${l} cm by ${w} cm and front view ${l} cm by ${h} cm. What is its side view?`,ans,[ans,`${l} cm by ${w} cm`,`${l} cm by ${h} cm`,`${l} cm by ${l} cm`],'Match the shared length, then use width and height.');}
    if(m===1){ans=h;return Q(`A box has a ${l} cm by ${w} cm top view. Its front view is ${l} cm by ${h} cm. What is the box height?`,`${ans} cm`,[`${ans} cm`,`${w} cm`,`${l} cm`,`${w+h} cm`],'The front view shows length and height.');}
    if(m===2){ans=w*h;return Q(`A box has top view ${l} cm by ${w} cm and front view ${l} cm by ${h} cm. What is the area of its side view?`,`${ans} cm²`,[`${ans} cm²`,`${l*w} cm²`,`${l*h} cm²`,`${2*(w+h)} cm²`],'Side view area = width × height.');}
    if(m===3){ans=2*r*h;return Q(`A cylinder has radius ${r} cm and height ${h+5} cm. What is the area of a central vertical cross section?`,`${2*r*(h+5)} cm²`,[`${2*r*(h+5)} cm²`,`${r*(h+5)} cm²`,`${2*r+h+5} cm²`,`${4*r*(h+5)} cm²`],'The section is a rectangle with width equal to the diameter.');}
    if(m===4)return Q('A solid has a circular top view and a rectangular front view. Which solid best fits?','cylinder',['cylinder','cube','rectangular prism','square pyramid'],'Think of the circular base and straight side.');
    if(m===5)return Q('A solid shows a square from the top, front and side. Which solid best fits?','cube',['cube','cylinder','cone','triangular prism'],'All visible faces are equal squares.');
    if(m===6){const d=2*r;ans=r;return Q(`A cylinder's central vertical cross section is ${d} cm wide. What is the radius of its circular base?`,`${ans} cm`,[`${ans} cm`,`${d} cm`,`${d+2} cm`,`${Math.max(1,r-1)} cm`],'Cross-section width = diameter.');}
    if(m===7){ans=l*w;return Q(`Two boxes have the same height. Box A has a ${l} cm by ${w} cm top view. Box B has a ${l+2} cm by ${w-1} cm top view. Which top view has greater area?`,(l*w)>(l+2)*(w-1)?'Box A':(l*w)<(l+2)*(w-1)?'Box B':'equal',[ 'Box A','Box B','equal','cannot tell'],'Compare the areas of the two top-view rectangles.');}
    if(m===8){ans='a polygon';return Q('A polyhedron is viewed directly from one flat face. What type of 2D figure must the view be?','a polygon',['a polygon','a circle','an oval','a curved surface'],'Polyhedron faces are polygons.');}
    if(m===9){ans=`${2*r} cm by ${h+4} cm`;return Q(`A central vertical cut through a cylinder has height ${h+4} cm and base radius ${r} cm. Which rectangle is the cross section?`,ans,[ans,`${r} cm by ${h+4} cm`,`${2*r} cm by ${2*r} cm`,`${r} cm by ${r} cm`],'Use diameter × height.');}
    if(m===10){ans=h;return Q(`A box's side view is ${w} cm by ${h} cm and top view is ${l} cm by ${w} cm. What is its height?`,`${ans} cm`,[`${ans} cm`,`${w} cm`,`${l} cm`,`${l-w} cm`],'The side view shows width and height.');}
    if(m===11){ans=l*h;return Q(`A prism has a ${l} cm by ${w} cm top view and a ${w} cm by ${h} cm side view. What is the area of its front view?`,`${ans} cm²`,[`${ans} cm²`,`${l*w} cm²`,`${w*h} cm²`,`${l+w+h} cm²`],'Recover length from the top view and height from the side view.');}
    if(m===12)return Q('Which statement about a cross section is correct?','It is a plane figure made where a plane intersects a solid.',['It is a plane figure made where a plane intersects a solid.','It is always the same as the top view.','It must be a circle.','It is the outside surface area.'],'A cross section comes from slicing through a solid.');
    ans=2*r;return Q(`A cylinder's vertical central cross section is a rectangle ${2*r} cm wide and ${h+6} cm long. What is the diameter of the cylinder?`,`${ans} cm`,[`${ans} cm`,`${r} cm`,`${h+6} cm`,`${2*(h+6)} cm`],'The rectangle width equals the base diameter.');
  }
  mr.topics=mr.topics.filter(x=>x[0]!=='sel_solid_views');
  const i=mr.topics.findIndex(x=>x[0]==='sel_rational_numbers');
  mr.topics.splice(i>=0?i+1:mr.topics.length,0,['sel_solid_views','▱','Views & Cross-Sections of Solids','Top/front/side views, dimension matching and cross-section reasoning']);
  const old=mr.question.bind(mr);mr.question=id=>id==='sel_solid_views'?question():old(id);
})();
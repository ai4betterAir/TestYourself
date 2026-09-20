// Topic 24: Year 5 Views & Cross-Sections of Solid Figures.
// Newly written SkillUP material covering the Year 5 enrichment lesson on views of solids.
(function(){
  if(!window.SKILLUP_MATH)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    let k=1;while(rest.length<3){const v=String(k++);if(v!==ans&&!rest.includes(v))rest.push(v);}
    return{text,answer:ans,choices:shuffle([ans,...rest]),tip,explanation};
  }
  function dims(){let l=R(5,14),w=R(3,9),h=R(2,8);if(w===h)h++;return{l,w,h};}
  function question(){
    const m=R(0,17);let d,ans,r,h,a;
    if(m===0){d=dims();ans=`${d.l} cm by ${d.w} cm rectangle`;return Q(`A rectangular prism is ${d.l} cm long, ${d.w} cm wide and ${d.h} cm high. What is its top view?`,ans,[ans,`${d.l} cm by ${d.h} cm rectangle`,`${d.w} cm by ${d.h} cm rectangle`,'circle'],'A top view uses length and width.',`The top face is ${d.l} cm by ${d.w} cm, so the view is a rectangle.`);}
    if(m===1){d=dims();ans=`${d.l} cm by ${d.h} cm rectangle`;return Q(`A rectangular prism is ${d.l} cm long, ${d.w} cm wide and ${d.h} cm high. What is its front view?`,ans,[ans,`${d.l} cm by ${d.w} cm rectangle`,`${d.w} cm by ${d.h} cm rectangle`,'square'],'A front view uses length and height.',`The front face is ${d.l} cm by ${d.h} cm.`);}
    if(m===2){d=dims();ans=`${d.w} cm by ${d.h} cm rectangle`;return Q(`A rectangular prism is ${d.l} cm long, ${d.w} cm wide and ${d.h} cm high. What is its side view?`,ans,[ans,`${d.l} cm by ${d.h} cm rectangle`,`${d.l} cm by ${d.w} cm rectangle`,'circle'],'A side view uses width and height.',`The side face is ${d.w} cm by ${d.h} cm.`);}
    if(m===3)return Q('What shape is the top view of an upright cylinder?','circle',['circle','rectangle','triangle','pentagon'],'Look straight down at the circular base.','The top of an upright cylinder is a circle.');
    if(m===4)return Q('What shape is the front view of an upright cylinder?','rectangle',['rectangle','circle','triangle','hexagon'],'Ignore the curved surface depth and look straight at the side.','The front view of an upright cylinder is a rectangle.');
    if(m===5)return Q('A cube is viewed from the top, front and side. What shape is seen each time?','square',['square','circle','triangle','rectangle only from the top'],'All faces of a cube are squares.','Each face-on view of a cube is a square.');
    if(m===6)return Q('What is a cross section of a solid figure?','the plane figure made where a plane cuts the solid',['the plane figure made where a plane cuts the solid','the total surface area','the outside edge of the solid','the top view only'],'Think about slicing through a solid.','A cross section is the plane figure formed by the intersection of a plane and the solid.');
    if(m===7){r=R(2,8);h=R(5,14);ans=`${2*r} cm by ${h} cm rectangle`;return Q(`A cylinder has radius ${r} cm and height ${h} cm. A vertical plane passes through the centre of both circular bases. What cross section is formed?`,ans,[ans,`${r} cm by ${h} cm rectangle`,`${2*r} cm by ${2*r} cm square`,`${r} cm radius circle`],'For this vertical cross section, the rectangle width is the diameter and its length is the cylinder height.',`Diameter = 2 × ${r} = ${2*r} cm, so the section is ${2*r} cm by ${h} cm.`);}
    if(m===8){r=R(2,9);return Q(`A vertical cross section through the centre of a cylinder has width ${2*r} cm. What is the radius of the cylinder?`,r,[r,2*r,r+2,Math.max(1,r-1)],'The cross-section width equals the cylinder diameter.','Radius is half the diameter, so '+r+' cm.');}
    if(m===9){r=R(2,7);h=R(5,12);ans=2*r*h;return Q(`A cylinder has radius ${r} cm and height ${h} cm. What is the area of the rectangular cross section made by a vertical plane through its centre?`,`${ans} cm²`,[`${ans} cm²`,`${r*h} cm²`,`${2*r+h} cm²`,`${4*r*h} cm²`],'The cross section is a rectangle: diameter × height.',`${2*r} × ${h} = ${ans} cm².`);}
    if(m===10){d=dims();ans=d.w;return Q(`A box has top view ${d.l} cm by ${d.w} cm and front view ${d.l} cm by ${d.h} cm. What is the box width?`,`${ans} cm`,[`${ans} cm`,`${d.l} cm`,`${d.h} cm`,`${d.w+d.h} cm`],'Match the shared dimension in the two views.','The top view shows length and width, so the width is '+d.w+' cm.');}
    if(m===11){d=dims();ans=`${d.w} cm by ${d.h} cm`;return Q(`A rectangular prism has top view ${d.l} cm by ${d.w} cm and front view ${d.l} cm by ${d.h} cm. What are the dimensions of its side view?`,ans,[ans,`${d.l} cm by ${d.w} cm`,`${d.l} cm by ${d.h} cm`,`${d.w} cm by ${d.l} cm`],'The side uses width and height.',`Side view = ${d.w} cm by ${d.h} cm.`);}
    if(m===12)return Q('When a polyhedron is viewed directly from the top, front or side, what kind of plane figure is seen?','a polygon',['a polygon','always a circle','always an oval','a sphere'],'Its faces are polygons.','A face-on view of a polyhedron is a polygon.');
    if(m===13){d=dims();ans=d.l*d.w;return Q(`A rectangular prism is ${d.l} cm long and ${d.w} cm wide. What is the area of its top view?`,`${ans} cm²`,[`${ans} cm²`,`${d.l*d.h} cm²`,`${d.w*d.h} cm²`,`${2*(d.l+d.w)} cm²`],'The top view is a length-by-width rectangle.',`${d.l} × ${d.w} = ${ans} cm².`);}
    if(m===14){d=dims();ans=d.l*d.h;return Q(`A rectangular prism has length ${d.l} cm and height ${d.h} cm. What is the area of its front view?`,`${ans} cm²`,[`${ans} cm²`,`${d.l*d.w} cm²`,`${d.w*d.h} cm²`,`${d.l+d.h} cm²`],'Front view uses length and height.',`${d.l} × ${d.h} = ${ans} cm².`);}
    if(m===15){d=dims();ans=d.w*d.h;return Q(`A rectangular prism has width ${d.w} cm and height ${d.h} cm. What is the area of its side view?`,`${ans} cm²`,[`${ans} cm²`,`${d.l*d.w} cm²`,`${d.l*d.h} cm²`,`${2*(d.w+d.h)} cm²`],'Side view uses width and height.',`${d.w} × ${d.h} = ${ans} cm².`);}
    if(m===16)return Q('Which pair correctly describes an upright cylinder?','top view: circle; front view: rectangle',['top view: circle; front view: rectangle','top view: rectangle; front view: circle','top view: triangle; front view: square','top view: square; front view: circle'],'Think of the circular base and the straight side view.','An upright cylinder appears circular from above and rectangular from the front.');
    d=dims();a=d.l*d.w;ans=d.h;return Q(`A rectangular prism has top-view area ${a} cm². The top is ${d.l} cm by ${d.w} cm, and the front view is ${d.l} cm by ? cm. If the prism height is ${d.h} cm, what number replaces ?`,ans,[ans,d.w,d.l,d.h+1],'The second front-view dimension is the height.',`Front view uses length × height, so the missing dimension is ${d.h} cm.`);
  }
  if(window.TY_YEAR5_TESTS){
    window.TY_YEAR5_TESTS.topics=window.TY_YEAR5_TESTS.topics.filter(x=>x[0]!=='solid_views');
    const i=window.TY_YEAR5_TESTS.topics.findIndex(x=>x[0]==='rational_numbers');
    window.TY_YEAR5_TESTS.topics.splice(i>=0?i+1:window.TY_YEAR5_TESTS.topics.length,0,['solid_views','▱','Views & Cross-Sections of Solids','Top, front and side views, cross sections, prisms and cylinders']);
    const oldQ=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=t=>t==='solid_views'?question():oldQ(t);
  }
  const oldLearn=window.SKILLUP_MATH.learn,oldEnhanced=window.SKILLUP_MATH.enhanced;
  window.SKILLUP_MATH.learn=function(g,t,fallback){
    if(String(g)==='5'&&t==='solid_views')return{
      title:'Views & Cross-Sections of Solids',
      concept:'A three-dimensional solid can look different from the top, front and side. A cross section is the two-dimensional shape made when a plane cuts through a solid.',
      steps:[
        'For a rectangular prism, the top view uses length and width, the front view uses length and height, and the side view uses width and height.',
        'A cube shows a square from the top, front and side because every face is a square.',
        'An upright cylinder has a circular top view and rectangular front and side views.',
        'When a polyhedron is viewed straight at one face, the view is a polygon because its faces are polygons.',
        'A cross section is the plane figure formed where a plane intersects a solid.',
        'For a vertical cut through the centre of a cylinder, the cross section is a rectangle. Its width is the base diameter and its length is the cylinder height.',
        'Use matching dimensions across different views to work backward and find missing lengths.'
      ],
      examples:[
        {q:'A box is 10 cm long, 6 cm wide and 4 cm high. What is its side view?',steps:['The side view uses width and height.','Width = 6 cm and height = 4 cm.'],answer:'6 cm by 4 cm rectangle'},
        {q:'A cylinder has radius 3 cm and height 8 cm. Find the central vertical cross section.',steps:['Diameter = 2 × 3 = 6 cm.','The rectangle length equals the cylinder height.'],answer:'6 cm by 8 cm rectangle'},
        {q:'A box has a 9 cm by 5 cm top view and a 9 cm by 4 cm front view. What is the side view?',steps:['Top gives length 9 and width 5.','Front gives length 9 and height 4.','Side uses width and height.'],answer:'5 cm by 4 cm'}
      ]
    };
    return oldLearn(g,t,fallback);
  };
  window.SKILLUP_MATH.enhanced=function(g,t){if(String(g)==='5'&&t==='solid_views')return question();return oldEnhanced(g,t);};
})();
(function(){
'use strict';
const R=(lo,hi)=>Math.floor(Math.random()*(hi-lo+1))+lo;
const pick=a=>a[R(0,a.length-1)];
const shuffle=a=>[...a].sort(()=>Math.random()-.5);
const safe=s=>String(s).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
const base=(inside)=>`<svg xmlns="http://www.w3.org/2000/svg" width="760" height="400" viewBox="0 0 760 400" role="img"><rect width="760" height="400" rx="21" fill="#f6faff"/><rect x="3" y="3" width="754" height="394" rx="19" fill="none" stroke="#d7e6f7" stroke-width="3"/><g font-family="Arial,Helvetica,sans-serif">${inside}</g></svg>`;
const rect=(x,y,w,h,fill="#dbeafe",stroke="#4169a0",sw=3)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const line=(x,y,x2,y2,color="#426899",width=4,dash="")=>`<path d="M${x} ${y} L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" ${dash?`stroke-dasharray="${dash}"`:""}/>`;
const label=(x,y,text,size=24,color="#253b61",anchor="middle")=>`<text x="${x}" y="${y}" font-size="${size}" font-weight="750" text-anchor="${anchor}" fill="${color}">${safe(text)}</text>`;
const circle=(cx,cy,r,fill="#ccefff",stroke="#2b78ae",width=3)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const poly=(points,fill="#c7e9dc",stroke="#218a7d")=>`<polygon points="${points.map(p=>p.join(",")).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="4" stroke-linejoin="round"/>`;
const points=(n,cx,cy,r,rotation=-Math.PI/2)=>Array.from({length:n},(_,i)=>[+(cx+r*Math.cos(rotation+i*2*Math.PI/n)).toFixed(2),+(cy+r*Math.sin(rotation+i*2*Math.PI/n)).toFixed(2)]);
const center=()=>circle(378,198,4,"#213657","#213657",1);
const arrow=(x1,y1,x2,y2,col="#526db6")=>line(x1,y1,x2,y2,col,5)+`<path d="M${x2} ${y2} l-12 -6 4 15z" fill="${col}" transform="rotate(${Math.atan2(y2-y1,x2-x1)*180/Math.PI+90} ${x2} ${y2})"/>`;
const names={3:"triangle",4:"square",5:"pentagon",6:"hexagon",7:"heptagon",8:"octagon"};
const colours=["#d7edfc","#f7dded","#d5f3dc","#ffedc7","#dcdafa"];
function diagramShape(kind,x=380,y=190,r=115) {
 if(kind==="circle")return circle(x,y,r);
 if(kind==="rectangle")return rect(x-r*1.13,y-r*.68,r*2.26,r*1.36,"#d5f0e1","#27896b");
 if(kind==="square")return rect(x-r*.82,y-r*.82,r*1.64,r*1.64,"#d8eeff","#386cbd");
 if(kind==="triangle")return poly(points(3,x,y,r),"#fde5ca","#d8843d");
 return poly(points(+Object.keys(names).find(n=>names[n]===kind)||6,x,y,r),"#e5ddff","#8560b2");
}
function shapeName(){
 const n=pick(["triangle","square","rectangle","circle","pentagon","hexagon"]);
 const opts=shuffle([n,...shuffle(["triangle","square","rectangle","circle","pentagon","hexagon"].filter(x=>x!==n)).slice(0,3)]);
 return {text:"Look at the shape. What is its name?",answer:n,choices:opts,tip:"Look at its outline, straight sides and corners.",explanation:`The pictured shape is a ${n}.`,diagram:base(diagramShape(n)),alt:`A large, clearly outlined coloured ${n} centred on a pale background.`,type:"Shape identification"};
}
function shapeSides(){
 const n=pick([3,4,5,6,7,8]);const correct=String(n),opts=shuffle([correct,...[n-1,n+1,n+2].map(String)]);
 return {text:"How many straight sides does the polygon have?",answer:correct,choices:opts,tip:"Follow the outline and count each straight edge once.",explanation:`The polygon has ${n} straight sides.`,diagram:base(poly(points(n,380,191,132)) +label(380,359,"Count the straight edges",19)),alt:`An original ${n}-sided polygon, drawn with visible straight edges.`,type:"Polygon sides"};
}
function solidSketch(which){
 if(which==="cube")return `<g>${poly([[275,145],[390,103],[516,151],[403,201]],"#e3f1ff","#5a83b8")}${poly([[275,145],[403,201],[403,327],[275,266]],"#f4faff","#5a83b8")}${poly([[403,201],[516,151],[516,274],[403,327]],"#bdd7f7","#5a83b8")}</g>`;
 if(which==="cuboid")return `${poly([[258,146],[396,106],[535,146],[398,190]],"#dbefff","#4c75a7")}${poly([[258,146],[398,190],[398,290],[258,247]],"#fff","#4c75a7")}${poly([[398,190],[535,146],[535,246],[398,290]],"#bcd6f4","#4c75a7")}`;
 if(which==="sphere")return circle(380,205,125,"#dce9ff","#547baf",4)+`<ellipse cx="380" cy="205" rx="120" ry="36" fill="none" stroke="#91add2" stroke-width="2" stroke-dasharray="6 7"/><ellipse cx="380" cy="205" rx="36" ry="120" fill="none" stroke="#91add2" stroke-width="2"/><circle cx="334" cy="151" r="19" fill="#fff" opacity=".8"/>`;
 if(which==="cylinder")return rect(280,132,200,170,"#d9eafc","#4176ac",3)+`<ellipse cx="380" cy="132" rx="100" ry="32" fill="#f6fbff" stroke="#4176ac" stroke-width="3"/><path d="M280 300 A100 32 0 0 0 480 300" fill="none" stroke="#4176ac" stroke-width="3"/><path d="M280 300 A100 32 0 0 1 480 300" fill="none" stroke="#83a4c8" stroke-width="2" stroke-dasharray="6 6"/>`;
 if(which==="cone")return `<path d="M380 93 L262 289 Q380 357 498 289 Z" fill="#e9dbfa" stroke="#745aaa" stroke-width="4"/><ellipse cx="380" cy="289" rx="118" ry="32" fill="#ede4ff" stroke="#745aaa" stroke-width="3"/>`;
 if(which==="triangular prism")return `${poly([[280,250],[362,100],[443,250]],"#f9e9c9","#b5863e")}${poly([[362,100],[484,140],[565,289],[443,250]],"#f3c77b","#b5863e")}${poly([[443,250],[565,289],[400,289],[280,250]],"#ffeeca","#b5863e")}`;
 return "";
}
function solid(){
 const n=pick(["cube","cuboid","sphere","cylinder","cone","triangular prism"]);
 const pool=["cube","cuboid","sphere","cylinder","cone","triangular prism"];
 return {text:"Which 3D solid is shown?",answer:n,choices:shuffle([n,...shuffle(pool.filter(x=>x!==n)).slice(0,3)]),tip:"Look for flat faces, edges and curved surfaces.",explanation:`The drawing represents a ${n}. Look at the shape of its surfaces.`,diagram:base(solidSketch(n)),alt:`A three-dimensional illustration of a ${n}, showing its visible faces and curved or straight edges.`,type:"3D solid"};
}
function coordinate(){
 const max=6,px=265,py=325,s=42,x=R(1,6),y=R(1,6);
 let d="";
 for(let i=0;i<=max;i++){
  d+=line(px,py-i*s,px+max*s,py-i*s,"#cbdceb",1.5);
  d+=line(px+i*s,py,px+i*s,py-max*s,"#cbdceb",1.5);
  d+=label(px+i*s,py+29,String(i),15,"#385b80");
  if(i>0)d+=label(px-26,py-i*s+5,String(i),15,"#385b80");
 }
 d+=line(px,py,px+max*s+15,py,"#455f7b",3)+line(px,py,px,py-max*s-15,"#455f7b",3);
 d+=label(px+max*s+27,py+7,"x",19)+label(px-8,py-max*s-28,"y",19);
 d+=circle(px+x*s,py-y*s,9,"#ff9159","#ce5630",2)+label(px+x*s+22,py-y*s-14,"P",18,"#bf4d2c");
 let alternatives=[`${x},${y}`,`${y},${x}`,`${x+1},${y}`,`${x},${Math.max(0,y-1)}`];
 alternatives=[...new Set(alternatives)];while(alternatives.length<4)alternatives.push(`${x},${y+alternatives.length}`);
 return {text:"What are the coordinates of point P?",answer:`(${x}, ${y})`,choices:shuffle(alternatives.map(v=>`(${v.split(",").join(", ")})`)),tip:"Go right to read x, then up to read y.",explanation:`Point P is ${x} squares right and ${y} squares up from the origin, so P = (${x}, ${y}).`,diagram:base(d),alt:`A coordinate grid labelled from zero to six with point P at (${x}, ${y}).`,type:"Coordinates"};
}
function angle(){
 const a=pick([35,55,70,90,110,125,145,180]),cx=300,cy=280,rad=a*Math.PI/180,r=177;
 const ex=cx+r*Math.cos(-rad),ey=cy+r*Math.sin(-rad);
 let d=line(cx,cy,cx+r,cy,"#43699a",6)+line(cx,cy,ex,ey,"#43699a",6);
 const pts=Array.from({length:Math.ceil(a/5)+1},(_,i)=>{const ang=-a*i/Math.ceil(a/5)*Math.PI/180;return [(cx+56*Math.cos(ang)).toFixed(1),(cy+56*Math.sin(ang)).toFixed(1)]});
 d+=`<polyline points="${pts.map(p=>p.join(",")).join(" ")}" fill="none" stroke="#e28a53" stroke-width="4"/>`;
 d+=circle(cx,cy,6,"#d07d44","#d07d44",1)+label(592,150,`${a}°`,52,"#38629d")+label(572,196,"Measured angle",19,"#526f90");
 const kind=a===90?"right":a===180?"straight":a<90?"acute":"obtuse";
 return {text:"What type of angle is illustrated?",answer:kind,choices:shuffle(["acute","right","obtuse","straight"]),tip:"Acute is less than 90°, right is 90°, obtuse is between 90° and 180°.",explanation:`The angle measures ${a}°, so it is ${kind}.`,diagram:base(d),alt:`Two rays forming a ${a}-degree ${kind} angle, marked with a coloured arc.`,type:"Angle classification"};
}
function triangle(){
 const [a,b]=pick([[42,63],[58,72],[35,85],[70,45],[49,57],[67,54]]),c=180-a-b,L=376,tan=x=>Math.tan(x*Math.PI/180),h=L/(1/tan(a)+1/tan(b));
 const B=[170,310],C=[546,310],A=[170+h/tan(a),310-h];
 let d=poly([A,B,C],"#eaf7eb","#288a70")+label(B[0]+54,290,`${a}°`,25,"#31688a")+label(C[0]-54,290,`${b}°`,25,"#31688a")+label(A[0],A[1]+45,"?",29,"#c04f60");
 d+=label(380,366,"Angles in a triangle",18,"#607b96");
 return {text:"What is the missing angle at the top of the triangle?",answer:`${c}°`,choices:shuffle([c,180-a,180-b,a+b].map(x=>`${x}°`)),tip:"The three angles in any triangle add to 180°.",explanation:`180° − ${a}° − ${b}° = ${c}°.`,diagram:base(d),alt:`A triangle with bottom angles ${a} degrees and ${b} degrees and an unknown top angle.`,type:"Triangle angle sum"};
}
function rectangleMetric(which){
 const w=R(3,12),h=R(2,9),x=215,y=97,x2=545,y2=304;
 const area=w*h,perimeter=2*(w+h);
 const answer=which==="area"?area:perimeter;
 let d=rect(x,y,x2-x,y2-y,"#ddf0ff","#416e9e",5);
 d+=label(380,79,`${w} cm`,25)+label(594,209,`${h} cm`,25);
 d+=line(x,y2+18,x2,y2+18,"#a8c4de",2)+line(x-18,y,x-18,y2,"#a8c4de",2);
 const candidate=[answer,w*h,2*(w+h),w+h,w*h+2,2*w+h,answer+4].filter((v,i,arr)=>v>0&&arr.indexOf(v)===i).slice(0,4);
 while(candidate.length<4)candidate.push(answer+candidate.length*3+1);
 return {text:which==="area"?"What is the area of the rectangle?":"What is the perimeter of the rectangle?",answer:`${answer} ${which==="area"?"cm²":"cm"}`,choices:shuffle(candidate.map(v=>`${v} ${which==="area"?"cm²":"cm"}`)),tip:which==="area"?"Area = length × width.":"Perimeter = twice the sum of length and width.",explanation:which==="area"?`Multiply the two side lengths: ${w} × ${h} = ${area} square centimetres.`:`Add the lengths of all four sides: 2 × (${w} + ${h}) = ${perimeter} centimetres.`,diagram:base(d),alt:`A blue rectangle with horizontal side labelled ${w} cm and vertical side labelled ${h} cm.`,type:which==="area"?"Rectangle area":"Rectangle perimeter"};
}
function areaGrid(){
 const rows=R(2,5),cols=R(3,7),sz=40,x=380-cols*sz/2,y=180-rows*sz/2;
 let d=label(380,69,"Each small square = 1 square unit",21);
 for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)d+=rect(x+c*sz,y+r*sz,sz,sz,"#a9dfcb","#2c8876",1.7);
 const answer=rows*cols,candidates=[answer,rows+cols,answer+rows,answer+cols];
 return {text:"How many square units cover the coloured rectangle?",answer:String(answer),choices:shuffle([...new Set(candidates)].slice(0,4).map(String)),tip:"Count the rows and columns of unit squares.",explanation:`There are ${rows} rows and ${cols} columns, so ${rows} × ${cols} = ${answer} square units.`,diagram:base(d),alt:`A rectangle made of ${rows} rows and ${cols} columns of coloured equal-sized unit squares.`,type:"Grid area"};
}
function symmetry(){
 const kind=pick(["square","rectangle","triangle"]);
 const count=kind==="square"?4:kind==="rectangle"?2:3;
 let d=diagramShape(kind,380,190,123);
 d+=label(380,360,"Count all possible reflection lines",20,"#547192");
 const candidates=[String(count),"0","1",String(count===4?2:4)];
 return {text:"How many lines of symmetry does this shape have?",answer:String(count),choices:shuffle([...new Set(candidates)]),tip:"Imagine folding the figure so both halves match exactly.",explanation:`A ${kind} has ${count} line${count===1?"":"s"} of symmetry.`,diagram:base(d),alt:`A centrally positioned ${kind} shown without drawn symmetry lines, for a reflection-symmetry problem.`,type:"Symmetry"};
}
function circleDiameter(){
 const r=R(2,12),x=380,y=205, radius=119;
 let d=circle(x,y,radius,"#f3e6ff","#8963b4",4)+circle(x,y,4,"#7952a1","#7952a1",1);
 d+=line(x,y,x+radius,y,"#cc6e7a",4)+label(x+radius*.55,y-15,`${r} cm`,22,"#a14967")+label(x-12,y+26,"O",18,"#5a4780");
 const candidates=[2*r,r,r*r,2*r+2].filter((v,i,a)=>a.indexOf(v)===i);
 while(candidates.length<4)candidates.push(2*r+candidates.length+5);
 return {text:"The red segment shows the radius. What is the circle's diameter?",answer:`${2*r} cm`,choices:shuffle(candidates.slice(0,4).map(v=>`${v} cm`)),tip:"The diameter passes through the centre and equals two radii.",explanation:`Diameter = 2 × ${r} = ${2*r} cm.`,diagram:base(d),alt:`A purple circle with centre O and a red radius segment labelled ${r} cm.`,type:"Circle parts"};
}
function translation(){
 const dx=R(1,3),dy=R(1,2),grid=42,originX=242,originY=115;
 let d="";
 for(let k=0;k<8;k++){d+=line(originX+k*grid,91,originX+k*grid,345,"#d5e4f1",1.2);d+=line(originX,99+k*grid,originX+7*grid,99+k*grid,"#d5e4f1",1.2);}
 const p=[[0,0],[54,0],[22,-43]].map(([a,b])=>[originX+65+a,originY+164+b]);
 const q=p.map(([x,y])=>[x+dx*grid,y-dy*grid]);
 d+=poly(p,"#d5e9ff","#4878bb")+poly(q,"#d1f6e7","#239a76");
 d+=arrow(originX+100,originY+205,originX+100+dx*grid,originY+205-dy*grid,"#d8795a");
 d+=label(380,366,`Moved ${dx} right and ${dy} up`,21,"#536f92");
 return {text:"Which transformation moves the blue triangle to the green triangle?",answer:"translation",choices:shuffle(["translation","reflection","rotation","enlargement"]),tip:"Look for a slide without a turn or flip.",explanation:"Every vertex moves the same distance in the same direction. This is a translation.",diagram:base(d),alt:`Two identical triangles on a grid, one shifted ${dx} squares to the right and ${dy} squares up, with an orange motion arrow.`,type:"Transformation"};
}
function prismVolume(){
 const a=R(3,8),b=R(2,6),c=R(2,5),vol=a*b*c;
 let d=poly([[231,171],[408,119],[549,158],[373,213]],"#e2f0ff","#5682a9");
 d+=poly([[231,171],[373,213],[373,314],[231,267]],"#f9fcff","#5682a9");
 d+=poly([[373,213],[549,158],[549,254],[373,314]],"#bcd8f0","#5682a9");
 d+=label(298,333,`${a} cm`,22)+label(535,302,`${b} cm`,22)+label(577,207,`${c} cm`,22);
 const wrong=[vol,a*b+a*c+b*c,2*(a*b+a*c+b*c),vol+b+2].filter((v,i,arr)=>arr.indexOf(v)===i);
 while(wrong.length<4)wrong.push(vol+wrong.length+5);
 return {text:"What is the volume of the rectangular prism?",answer:`${vol} cm³`,choices:shuffle(wrong.slice(0,4).map(v=>`${v} cm³`)),tip:"Volume = length × width × height.",explanation:`${a} × ${b} × ${c} = ${vol} cm³.`,diagram:base(d),alt:`A three-dimensional rectangular prism with edge lengths marked ${a}, ${b} and ${c} centimetres.`,type:"Prism volume"};
}
function route(){
 const paths={shapes2d:["shapeName","shapeSides","symmetry"],shapes3d:["solid"],position:["translation","coordinate"],
  g2geometry:["shapeName","shapeSides","solid","symmetry","translation"],
  g2advancedgeometry:["coordinate","translation","symmetry","angle"],
  geometry:["shapeName","shapeSides","solid","symmetry","angle","triangle","coordinate","circle","translation"],
  angles:["angle","triangle"],symmetry:["symmetry","translation"],coordinates:["coordinate","translation"],
  perimeter:["rectanglePerimeter","areaGrid"],perimeterarea:["rectanglePerimeter","rectangleArea","areaGrid"],
  area:["areaGrid","rectangleArea"],volume:["prismVolume","solid"],solids:["solid","prismVolume"],
  circles:["circle","shapeName"],scale:["coordinate","rectanglePerimeter"]};
 return paths;
}
const generators={shapeName,shapeSides,solid,coordinate,angle,triangle,
 rectanglePerimeter:()=>rectangleMetric("perimeter"),rectangleArea:()=>rectangleMetric("area"),
 areaGrid,symmetry,circle:circleDiameter,translation,prismVolume};
const permitted={
 "1":new Set(["shapes2d","shapes3d","position"]),
 "2":new Set(["g2geometry","shapes2d","shapes3d","position","area"]),
 "3":new Set(["g2advancedgeometry","perimeter","shapes2d","shapes3d","geometry"]),
 "4":new Set(["geometry","perimeterarea","perimeter","area","angles","symmetry"]),
 "5":new Set(["geometry","angles","symmetry","coordinates","perimeterarea","volume","solids","circles","scale"]),
 "6":new Set(["geometry","angles","symmetry","coordinates","perimeterarea","volume","solids","circles","scale"])
};
const which=(grade,topic)=> {
 const g=String(grade);
 const map=route();if(!(permitted[g]&&permitted[g].has(topic)&&map[topic]))return null;
 let allowed=map[topic];
 if(g==="1")allowed=allowed.filter(k=>!["coordinate","triangle","angle","prismVolume"].includes(k));
 if(g==="2")allowed=allowed.filter(k=>!["triangle","prismVolume"].includes(k));
 if(g==="3")allowed=allowed.filter(k=>k!=="triangle"&&k!=="prismVolume");
 if(g==="4")allowed=allowed.filter(k=>k!=="prismVolume");
 return allowed.length?allowed:null;
};
function question(grade,topic){
 const allowed=which(grade,topic);
 if(!allowed)return null;
 for(let attempts=0;attempts<15;attempts++){
   const gen=pick(allowed),q=generators[gen]();
   const opts=q.choices.map(String);
   if(opts.length===4&&new Set(opts).size===4&&opts.includes(String(q.answer))&&q.diagram.startsWith("<svg")){
    return {text:q.text,answer:String(q.answer),choices:shuffle(opts),tip:q.tip,explanation:q.explanation,
      diagramSvg:q.diagram,imageAlt:q.alt,geometryFamily:q.type};
   }
 }
 throw Error("Could not construct a unique geometry question for "+grade+"/"+topic);
}
function renderImage(id,q){
 const fig=document.getElementById(id);
 if(!fig)return;
 const img=fig.querySelector("img");
 if(!img)return;
 const svg=q&&typeof q.diagramSvg==="string"&&q.diagramSvg.startsWith('<svg')?q.diagramSvg:null;
 fig.hidden=!svg;
 if(svg){
  img.alt=q.imageAlt||"Geometry diagram";
  img.src="data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(svg);
 }else{img.removeAttribute("src");img.alt="";}
}
window.SKILLUP_GEOMETRY={question,hasTopic:(grade,topic)=>!!which(grade,topic),renderImage,types:Object.keys(generators)};
if(typeof makeQuestion==="function"){
 const previous=makeQuestion;
 makeQuestion=function(){
  const visual=question(grade,topic);
  return visual||previous();
 };
}
if(typeof buildSet==="function"&&typeof grade!=="undefined"&&typeof topic!=="undefined"&&which(grade,topic)){
 buildSet();
 document.getElementById('tryGuidedAgain')?.click();
}
})();

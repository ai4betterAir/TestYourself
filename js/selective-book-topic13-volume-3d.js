// Selective Topic 13: Volume & 3D Measurement Reasoning.
// Newly written SkillUP questions extending the uploaded Grade 5 solid-figure and volume concepts.
(function(){
  if(!window.SKILLUP_MR_EXTRA)return;
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,topic:'sel_volume3d',name:'Volume & 3D Measurement'};
  }
  function question(){
    const t=R(0,15);let l,w,h,v,s,ans;
    if(t===0){l=R(5,14);w=R(3,10);h=R(2,8);v=l*w*h;ans=h;return Q(`A rectangular prism has volume ${v} cm³. Its base is ${l} cm by ${w} cm. What is its height?`,`${ans} cm`,[`${v/(l+w)} cm`,`${l*w} cm`,`${v/l} cm`],'Find the base area, then divide the volume by the base area.');}
    if(t===1){s=pick([4,5,6,8,10]);const sa=6*s*s,vol=s*s*s;ans=`${sa} cm² and ${vol} cm³`;return Q(`A cube has edge ${s} cm. Which pair gives its surface area and volume?`,ans,[ans,`${vol} cm² and ${sa} cm³`,`${4*s*s} cm² and ${s*s} cm³`,`${6*s} cm² and ${3*s} cm³`],'A cube has 6 square faces, while volume uses three dimensions.');}
    if(t===2){l=R(4,10);w=R(3,8);h=R(2,7);v=l*w*h;ans=v*8;return Q(`A ${l}×${w}×${h} cm prism is enlarged so every dimension doubles. What is the new volume?`,`${ans} cm³`,[`${v*2} cm³`,`${v*4} cm³`,`${v} cm³`],'Doubling all three dimensions multiplies volume by 2³ = 8.');}
    if(t===3){const cap=pick([1250,1800,2400,3500,4800]);ans=`${cap/1000} L`;return Q(`A container holds ${cap} cm³ of water. What is its capacity in litres?`,ans,[ans,`${cap} L`,`${cap/100} L`,`${cap*1000} L`],'Use 1 cm³ = 1 mL and 1,000 mL = 1 L.');}
    if(t===4){const amount=pick([2,3,4,5,8]);ans=`${amount} kg`;return Q(`${amount} dm³ of water is in a tank. Approximately what is the mass of the water?`,ans,[ans,`${amount} g`,`${amount*1000} kg`,`${amount/1000} kg`],'Under the standard metric relationship, 1 dm³ of water is about 1 kg.');}
    if(t===5){const base=R(24,80),h=R(3,9);v=base*h;ans=`${base} cm²`;return Q(`A prism has volume ${v} cm³ and height ${h} cm. What is the area of its base?`,ans,[`${v+h} cm²`,`${v*h} cm²`,`${h} cm²`],'Volume = base area × height. Work backwards.');}
    if(t===6){const volume=pick([216,343,512,729,1000]);const edge=Math.round(Math.cbrt(volume));ans=`${edge} cm`;return Q(`A cube has volume ${volume} cm³. What is its edge length?`,ans,[`${edge*edge} cm`,`${edge+1} cm`,`${Math.max(1,edge-1)} cm`],'A cube volume is side³. Find the number whose cube is the volume.');}
    if(t===7){const cases=[['triangular prism','5 faces, 9 edges, 6 vertices'],['cube','6 faces, 12 edges, 8 vertices'],['square pyramid','5 faces, 8 edges, 5 vertices']];const z=pick(cases);ans=z[1];return Q(`Which set of counts belongs to a ${z[0]}?`,ans,[ans,'6 faces, 8 edges, 12 vertices','5 faces, 6 edges, 9 vertices','4 faces, 6 edges, 4 vertices'],'Use the structure of the bases and side faces to count faces, edges and vertices.');}
    if(t===8){ans='six connected squares';return Q('Which collection of faces is required for a cube net?',ans,[ans,'four triangles and one square','two circles and one rectangle','one circle and one triangle'],'A cube has exactly six square faces.');}
    if(t===9){const l1=R(4,9),w1=R(3,7),h1=R(2,6),l2=R(2,6),w2=R(2,5),h2=R(2,5);ans=l1*w1*h1+l2*w2*h2;return Q(`A solid is made from two non-overlapping prisms of ${l1}×${w1}×${h1} cm and ${l2}×${w2}×${h2} cm. What is its total volume?`,`${ans} cm³`,[`${l1*w1*h1} cm³`,`${l2*w2*h2} cm³`,`${l1+w1+h1+l2+w2+h2} cm³`],'Find each prism volume and add the two volumes.');}
    if(t===10){l=R(6,15);w=R(4,10);h=R(3,8);const sa=2*(l*w+l*h+w*h),vol=l*w*h;ans=sa>vol?'surface area number is larger':sa<vol?'volume number is larger':'the numbers are equal';return Q(`For a ${l}×${w}×${h} prism, surface area is ${sa} cm² and volume is ${vol} cm³. Which numerical value is larger?`,ans,[ans,'surface area number is larger','volume number is larger','the numbers are equal'],'Calculate or compare the two numerical values, but remember the units measure different things.');}
    if(t===11){const dims=[[2,6,12],[3,4,12],[4,6,6],[2,8,9]];const z=pick(dims),vol=z[0]*z[1]*z[2];const alternatives=dims.filter(x=>x[0]*x[1]*x[2]===vol&&x.join()!=z.join());if(!alternatives.length)return question();const y=pick(alternatives);ans='Yes';return Q(`One prism measures ${z.join('×')} units and another measures ${y.join('×')} units. Can they have the same volume?`,ans,[ans,'No'],'Different dimensions can still have the same product.');}
    if(t===12){const outer=[R(8,14),R(6,12),R(5,10)],cut=[2,2,2];const big=outer[0]*outer[1]*outer[2],small=8;ans=big-small;return Q(`A solid block is ${outer[0]}×${outer[1]}×${outer[2]} cm. A 2×2×2 cm cube is removed. What volume remains?`,`${ans} cm³`,[`${big} cm³`,`${small} cm³`,`${big+small} cm³`],'Subtract the volume of the removed cube from the original block.');}
    if(t===13){const l=R(12,28),w=R(8,18),h=R(4,12);const rl=Math.round(l/10)*10||10,rw=Math.round(w/10)*10||10,rh=Math.round(h/5)*5||5;ans=rl*rw*rh;return Q(`Using friendly dimensions ${rl}×${rw}×${rh} cm, what is a sensible estimate for a box measuring about ${l}×${w}×${h} cm?`,`${ans} cm³`,[`${l*w*h} cm³`,`${rl*rw} cm³`,`${rl+rw+rh} cm³`],'For a volume estimate, round all three dimensions and multiply them.');}
    if(t===14){const litres=pick([2,3,4,5]);ans=`${litres*1000} cm³`;return Q(`A rectangular tank holds ${litres} L of water. What cubic-centimetre volume does that represent?`,ans,[`${litres} cm³`,`${litres*100} cm³`,`${litres*10000} cm³`],'1 L = 1,000 mL and 1 mL = 1 cm³.');}
    ans='surface area uses square units; volume uses cubic units';return Q('Which statement correctly distinguishes surface area from volume?',ans,[ans,'both use cubic units','surface area uses linear units; volume uses square units','both measure only the outside'],'Surface area covers the outer faces. Volume measures the space inside.');
  }

  if(!window.SKILLUP_MR_EXTRA.topics.some(x=>x[0]==='sel_volume3d')){
    const i=window.SKILLUP_MR_EXTRA.topics.findIndex(x=>x[0]==='sel_perimeter_area');
    window.SKILLUP_MR_EXTRA.topics.splice(i>=0?i+1:13,0,['sel_volume3d','◫','Volume & 3D Measurement','Solid figures, nets, surface area, cubic units, capacity and multi-step volume reasoning']);
  }
  const old=window.SKILLUP_MR_EXTRA.question.bind(window.SKILLUP_MR_EXTRA);
  window.SKILLUP_MR_EXTRA.question=id=>id==='sel_volume3d'?question():old(id);
})();
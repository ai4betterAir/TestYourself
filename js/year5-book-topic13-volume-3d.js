// Topic 13 upgrade: Year 5 Volume & 3D Measurement.
// Newly written SkillUP material using the uploaded Grade 5 solid-figures, surface-area and volume lessons as the curriculum reference.
(function(){
  const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[R(0,a.length-1)];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const uniq=a=>[...new Set(a.map(String))];
  function Q(text,answer,choices,tip,explanation){
    const ans=String(answer);let rest=uniq((choices||[]).map(String)).filter(x=>x!==ans);rest=shuffle(rest).slice(0,3);
    return {text,answer:ans,choices:shuffle([ans,...rest]),tip,explanation};
  }
  function topicQuestion(){
    const mode=R(0,21);let l,w,h,s,v,ans;
    if(mode===0){
      const cases=[
        ['two parallel congruent triangular bases and three rectangular faces','triangular prism'],
        ['one square base and triangular faces meeting at one vertex','square pyramid'],
        ['two congruent circular bases and one curved surface','cylinder'],
        ['one circular base and a curved surface meeting at one vertex','cone'],
        ['one curved surface with no flat faces, edges or vertices','sphere'],
        ['six congruent square faces','cube']
      ];const z=pick(cases);
      return Q(`Which solid figure has ${z[0]}?`,z[1],[z[1],'rectangular prism','cylinder','sphere','square pyramid'],'Use the number and shape of the bases, faces and curved surfaces.',`The description matches a ${z[1]}.`);
    }
    if(mode===1){
      const cases=[['cube',6,12,8],['triangular prism',5,9,6],['square pyramid',5,8,5]];const z=pick(cases);ans=`${z[1]} faces, ${z[2]} edges, ${z[3]} vertices`;
      return Q(`How many faces, edges and vertices does a ${z[0]} have?`,ans,[ans,`${z[1]} faces, ${z[3]} edges, ${z[2]} vertices`,`${z[1]+1} faces, ${z[2]} edges, ${z[3]} vertices`,`${z[1]} faces, ${z[2]+2} edges, ${z[3]-1} vertices`],'Count flat faces first, then where faces meet (edges) and where edges meet (vertices).',`${z[0][0].toUpperCase()+z[0].slice(1)}: ${ans}.`);
    }
    if(mode===2){
      const sides=pick([3,5,6]);const name=sides===3?'triangular prism':sides===5?'pentagonal prism':'hexagonal prism';const faces=sides+2,edges=3*sides,vertices=2*sides;ans=`${faces} faces, ${edges} edges, ${vertices} vertices`;
      return Q(`A ${name} has how many faces, edges and vertices?`,ans,[ans,`${faces-1} faces, ${edges} edges, ${vertices} vertices`,`${faces} faces, ${edges-sides} edges, ${vertices} vertices`,`${faces} faces, ${edges} edges, ${vertices+sides} vertices`],'An n-sided prism has two congruent bases and n rectangular side faces.',`${name}: ${ans}.`);
    }
    if(mode===3){
      ans='six connected squares';
      return Q('Which description could form a net of a cube?','six connected squares',['six connected squares','four connected triangles only','one circle and one rectangle','two circles only'],'A net unfolds every flat face of the solid. A cube has six square faces.','A cube net must contain six squares connected so they can fold into the six faces.');
    }
    if(mode===4){s=R(2,12);ans=6*s*s;return Q(`A cube has edge length ${s} cm. What is its surface area?`,`${ans} cm²`,[`${s*s*s} cm²`,`${4*s*s} cm²`,`${6*s} cm²`],'A cube has 6 equal square faces.',`Surface area = 6 × ${s}² = ${ans} cm².`);}
    if(mode===5){l=R(4,15);w=R(3,10);h=R(2,8);ans=2*(l*w+l*h+w*h);return Q(`A rectangular prism is ${l} cm × ${w} cm × ${h} cm. Find its surface area.`,`${ans} cm²`,[`${l*w*h} cm²`,`${l*w+l*h+w*h} cm²`,`${2*(l+w+h)} cm²`],'Add the areas of all six rectangular faces: 2(lw + lh + wh).',`SA = 2(${l*w} + ${l*h} + ${w*h}) = ${ans} cm².`);}
    if(mode===6){l=R(3,12);w=R(2,10);h=R(2,9);ans=l*w*h;return Q(`A rectangular prism is ${l} cm long, ${w} cm wide and ${h} cm high. What is its volume?`,`${ans} cm³`,[`${2*(l*w+l*h+w*h)} cm³`,`${l*w} cm³`,`${l+w+h} cm³`],'Volume of a rectangular prism = length × width × height.',`V = ${l} × ${w} × ${h} = ${ans} cm³.`);}
    if(mode===7){s=R(2,12);ans=s*s*s;return Q(`A cube has edge length ${s} cm. What is its volume?`,`${ans} cm³`,[`${6*s*s} cm³`,`${s*s} cm³`,`${3*s} cm³`],'A cube has length = width = height = side.',`V = ${s} × ${s} × ${s} = ${ans} cm³.`);}
    if(mode===8){l=R(3,10);w=R(2,8);h=R(2,7);const perLayer=l*w;ans=perLayer*h;return Q(`A prism has ${perLayer} unit cubes in each layer and ${h} equal layers. How many unit cubes fill it?`,ans,[perLayer,h,perLayer+h],'Volume can be counted as cubes per layer × number of layers.',`${perLayer} × ${h} = ${ans} unit cubes.`);}
    if(mode===9){l=R(3,12);w=R(2,9);h=R(2,8);v=l*w*h;ans=h;return Q(`A rectangular prism has volume ${v} cm³, length ${l} cm and width ${w} cm. What is its height?`,`${ans} cm`,[`${v/(l+w)} cm`,`${l*w} cm`,`${v/l} cm`],'Use the volume formula backwards: height = volume ÷ (length × width).',`${v} ÷ (${l} × ${w}) = ${h} cm.`);}
    if(mode===10){const amount=pick([12,25,80,125,240]);ans=`${amount} mL`;return Q(`${amount} cm³ of water has what capacity?`,ans,[ans,`${amount} L`,`${amount*10} mL`,`${amount/10} mL`],'Under standard metric relationships, 1 cm³ holds 1 mL of water.',`${amount} cm³ corresponds to ${amount} mL.`);}
    if(mode===11){const amount=pick([2,4,6,8,12]);ans=`${amount} L`;return Q(`${amount} dm³ of water has what capacity?`,ans,[ans,`${amount*1000} L`,`${amount} mL`,`${amount/1000} L`],'1 dm³ holds 1 L of water.',`${amount} dm³ = ${amount} L.`);}
    if(mode===12){const amount=pick([2,3,5,8]);ans=`${amount} kg`;return Q(`${amount} dm³ of water has approximately what mass under the standard metric relationship?`,ans,[ans,`${amount} g`,`${amount*1000} kg`,`${amount/10} kg`],'1 dm³ of water corresponds to about 1 L and has a mass of about 1 kg.',`${amount} dm³ of water corresponds to about ${amount} kg.`);}
    if(mode===13){const cases=[['a ring','cm³'],['a tissue box','cm³'],['a classroom','m³'],['a large storage room','m³'],['a marble','cm³']];const z=pick(cases);return Q(`Which cubic unit is more reasonable for estimating the volume of ${z[0]}?`,z[1],[z[1],z[1]==='cm³'?'m³':'cm³','km³','mm'],'Choose a unit that matches the size of the object. Volume needs a cubic unit.',`${z[1]} is the more reasonable unit.`);}
    if(mode===14){l=R(4,12);w=R(3,10);h=R(2,8);v=l*w*h;const factors=[];for(let x=1;x<=v;x++)for(let y=x;y<=v;y++){if(v%(x*y)===0){const z=v/(x*y);if(z>=y&&x*y*z===v&&(x!==l||y!==w||z!==h))factors.push([x,y,z]);}if(factors.length>10)break;}if(!factors.length)return topicQuestion();const z=pick(factors);ans='Yes';return Q(`One prism is ${l} × ${w} × ${h} units. Another is ${z[0]} × ${z[1]} × ${z[2]} units. Can they have the same volume?`,ans,[ans,'No'],'Different-looking rectangular prisms can have the same product of length, width and height.',`First volume = ${v}. Second volume = ${z[0]*z[1]*z[2]}. They are equal.`);}
    if(mode===15){l=R(12,28);w=R(8,18);h=R(4,12);const rl=Math.round(l/10)*10||10,rw=Math.round(w/10)*10||10,rh=Math.round(h/5)*5||5;ans=rl*rw*rh;return Q(`Estimate the volume of a box ${l} cm × ${w} cm × ${h} cm by using nearby friendly dimensions ${rl} cm × ${rw} cm × ${rh} cm.`,`${ans} cm³`,[`${l*w*h} cm³`,`${rl*rw} cm³`,`${rl+rw+rh} cm³`],'Estimate each dimension with friendly values, then multiply all three estimates.',`${rl} × ${rw} × ${rh} = ${ans} cm³.`);}
    if(mode===16){ans='1 dm³';return Q('Which is larger: 1 dm³ or 1,000 cm³?','They are equal',['They are equal','1 dm³','1,000 cm³','Cannot be compared'],'1 dm = 10 cm, so 1 dm³ = 10 × 10 × 10 cm³.',`1 dm³ = 1,000 cm³, so they are equal.`);}
    if(mode===17){l=R(2,8);w=R(2,7);h=R(2,6);v=l*w*h;ans=v*8;return Q(`A rectangular prism has dimensions ${l} × ${w} × ${h} cm. All three dimensions are doubled. What is the new volume?`,`${ans} cm³`,[`${v*2} cm³`,`${v*4} cm³`,`${v} cm³`],'Doubling length, width and height multiplies volume by 2 × 2 × 2 = 8.',`Original volume = ${v} cm³. New volume = 8 × ${v} = ${ans} cm³.`);}
    if(mode===18){l=R(4,12);w=R(3,10);h=R(2,8);const sa=2*(l*w+l*h+w*h),vol=l*w*h;ans=`Surface area ${sa} cm²; volume ${vol} cm³`;return Q(`A prism is ${l} cm × ${w} cm × ${h} cm. Which statement gives both measures with correct units?`,ans,[ans,`Surface area ${vol} cm²; volume ${sa} cm³`,`Surface area ${sa} cm³; volume ${vol} cm²`,`Surface area ${l+w+h} cm²; volume ${l*w} cm³`],'Surface area covers faces and uses square units; volume fills space and uses cubic units.',`SA = ${sa} cm² and V = ${vol} cm³.`);}
    if(mode===19){const l1=R(3,8),w1=R(2,6),h1=R(2,5),l2=R(2,6),w2=R(2,5),h2=R(2,5);ans=l1*w1*h1+l2*w2*h2;return Q(`A composite solid is made from two non-overlapping rectangular prisms: ${l1}×${w1}×${h1} cm and ${l2}×${w2}×${h2} cm. What is the total volume?`,`${ans} cm³`,[`${l1*w1*h1} cm³`,`${l2*w2*h2} cm³`,`${l1+w1+h1+l2+w2+h2} cm³`],'Find each prism volume and add because the parts do not overlap.',`${l1*w1*h1} + ${l2*w2*h2} = ${ans} cm³.`);}
    if(mode===20){const cap=pick([1500,2000,2500,3000,4000]);ans=`${cap/1000} L`;return Q(`A tank contains ${cap} cm³ of water. How many litres is that?`,ans,[ans,`${cap} L`,`${cap/100} L`,`${cap*1000} L`],'1,000 cm³ = 1,000 mL = 1 L.',`${cap} cm³ = ${cap} mL = ${cap/1000} L.`);}
    const choices=[['surface area','square units'],['volume','cubic units'],['edge length','linear units']];const z=pick(choices);return Q(`Which type of unit should be used for ${z[0]}?`,z[1],[z[1],'linear units','square units','cubic units'],'Match the measurement to its dimension: length, surface, or space.',`${z[0]} is measured using ${z[1]}.`);
  }

  if(window.TY_YEAR5_TESTS){
    const row=window.TY_YEAR5_TESTS.topics.find(x=>x[0]==='volume');
    if(row){row[1]='cm³';row[2]='Volume & 3D Measurement';row[3]='Solid figures, nets, surface area, cubic measure, capacity and rectangular-prism volume';}
    const oldQuestion=window.TY_YEAR5_TESTS.question.bind(window.TY_YEAR5_TESTS);
    window.TY_YEAR5_TESTS.question=function(t){return t==='volume'?topicQuestion():oldQuestion(t)};
  }

  if(window.SKILLUP_MATH){
    const oldLearn=window.SKILLUP_MATH.learn;
    const oldEnhanced=window.SKILLUP_MATH.enhanced;
    window.SKILLUP_MATH.learn=function(g,t,fallback){
      if(String(g)==='5'&&t==='volume')return{
        title:'Volume & 3D Measurement',
        concept:'Three-dimensional figures have length, width and height. Surface area measures the outside faces in square units, while volume measures the space inside in cubic units. Nets help us see how the faces of a solid fit together.',
        steps:[
          'Identify the solid: prisms have two parallel congruent bases; pyramids have one base and triangular faces meeting at a vertex; cylinders and cones have circular bases; spheres have no flat faces.',
          'A face is a flat surface, an edge is where two faces meet, and a vertex is a point where edges meet. A net is a 2D pattern that folds into a 3D solid.',
          'Surface area is the total area of all outside faces and uses square units such as cm². For a rectangular prism, SA = 2(lw + lh + wh).',
          'Volume is the number of cubic units inside a solid. For a rectangular prism, V = length × width × height. For a cube, V = side³.',
          'Think of volume as cubes per layer × number of layers.',
          'Metric links: 1 cm³ holds 1 mL of water; 1 dm³ holds 1 L of water and has a water mass of about 1 kg under standard conditions.',
          'Choose sensible cubic units and estimate before calculating when exact dimensions are not needed.'
        ],
        examples:[
          {q:'A rectangular prism is 4 cm × 2 cm × 3 cm.',steps:['There are 4 × 2 = 8 cubes in each layer.','There are 3 layers.','8 × 3 = 24.'],answer:'24 cm³'},
          {q:'A cube has edge length 5 cm. Find its surface area and volume.',steps:['Surface area = 6 × 5² = 150 cm².','Volume = 5 × 5 × 5 = 125 cm³.','Surface area uses cm²; volume uses cm³.'],answer:'SA = 150 cm²; V = 125 cm³'},
          {q:'A prism has volume 180 cm³, length 10 cm and width 6 cm. Find the height.',steps:['Use h = V ÷ (l × w).','10 × 6 = 60.','180 ÷ 60 = 3.'],answer:'3 cm'},
          {q:'How much water can 2,500 cm³ hold?',steps:['1 cm³ holds 1 mL.','2,500 cm³ = 2,500 mL.','1,000 mL = 1 L, so 2,500 mL = 2.5 L.'],answer:'2.5 L'},
          {q:'A box is enlarged so length, width and height all double.',steps:['Each dimension is multiplied by 2.','Volume changes by 2 × 2 × 2.','The new volume is 8 times the old volume.'],answer:'Volume × 8'}
        ],
        mistake:'Do not confuse surface area with volume. Surface area uses square units; volume uses cubic units. Do not use a sloping or face measurement as a missing height unless it is actually the perpendicular dimension needed.',
        quick:'3D shape → identify faces/edges/vertices → choose surface area or volume → use the correct formula and unit → check whether the result is reasonable.'
      };
      return oldLearn?oldLearn(g,t,fallback):null;
    };
    window.SKILLUP_MATH.enhanced=function(g,t){
      if(String(g)==='5'&&t==='volume')return topicQuestion();
      return oldEnhanced?oldEnhanced(g,t):null;
    };
  }
})();
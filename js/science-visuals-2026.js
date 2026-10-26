/* Original SkillUP science diagrams and supplemental questions. No external images or people. */
(function(){
'use strict';
const E=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;' ,'"':'&quot;'}[c]));
const T=(x,y,s,size=18,colour='#234c64',weight=800)=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" font-size="'+size+'" font-weight="'+weight+'" fill="'+colour+'" font-family="Arial,Helvetica,sans-serif">'+E(s)+'</text>';
const C=(x,y,r,fill,stroke='none',w=2)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'"/>';
const L=(x,y,X,Y,col='#6b9db2',width=3,dash='')=>'<path d="M'+x+' '+y+'L'+X+' '+Y+'" stroke="'+col+'" stroke-width="'+width+'" stroke-linecap="round" '+(dash?'stroke-dasharray="'+dash+'"':'')+' fill="none"/>';
const R=(x,y,w,h,fill='#fff',rx=12,stroke='#d6e5ef')=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+rx+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="2"/>';
const P=(d,fill,stroke='#3d8b94',w=3)=>'<path d="'+d+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linejoin="round" stroke-linecap="round"/>';
const arrow=(x,y,X,Y,col='#25a6ab')=>L(x,y,X,Y,col,5)+P('M'+X+' '+Y+'l-14 -8 3 16z',col,col,1);
const sun=(x,y,r=36)=>C(x,y,r,'#ffda6e','#f6ad43',3)+Array.from({length:8},(_,i)=>{let a=i*Math.PI/4;return L(x+Math.cos(a)*(r+9),y+Math.sin(a)*(r+9),x+Math.cos(a)*(r+24),y+Math.sin(a)*(r+24),'#f9b740',4)}).join('');
const cloud=(x,y)=>'<g>'+C(x-23,y+8,24,'#fff')+C(x+2,y-7,29,'#fff')+C(x+29,y+9,23,'#fff')+R(x-44,y+4,87,24,'#fff',13,'#fff')+'</g>';
const ground=(x,y,w=125)=>P('M'+x+' '+y+'q'+w/3+' -11 '+w/2+' 0t'+w/2+' 0','none','#58bb9c',4);
const plant=(x,y,s=1,flowers=false)=>'<g transform="translate('+x+' '+y+') scale('+s+')">'+P('M0 0V-68','none','#2b9a71',5)+P('M0 -40Q-56 -50 -50 -78Q-11 -87 0 -48','#91dcad','#359a68',3)+P('M0 -60Q56 -65 45 -98Q6 -86 0 -60','#76c89c','#359a68',3)+(flowers?C(0,-81,14,'#f49cc1')+C(-10,-88,8,'#f8d0df')+C(12,-88,8,'#f8d0df'):'')+ground(-60,0,120)+'</g>';
const earth=(x,y,r=53)=>C(x,y,r,'#58a9df','#2c8ab4',3)+P('M'+(x-r*.5)+' '+(y-r*.6)+'q25 -20 42 4l-6 25-23 4-10 29-25-12z','#9bdc91','#9bdc91',1)+P('M'+(x+r*.1)+' '+(y-r*.6)+'q30 -1 26 28l-21 13 6 19 20 9 12-29z','#a6e6a1','#a6e6a1',1);
const dots=(pts,col='#4b94ca')=>pts.map(([x,y])=>C(x,y,5,col)).join('');
const card=(x,y,symbol,caption,col='#e6f6f8')=>R(x,y,136,123,col,17,'#d5e8ef')+T(x+68,y+63,symbol,39)+T(x+68,y+99,caption,15,'#55778c');
function scene(key){
 switch(key){
 case 'daynight':return sun(126,154,45)+earth(439,153,76)+P('M330 102Q260 152 328 208','none','#21a6a7',4)+T(290,91,'ROTATION',18)+T(129,290,'Sun',23)+T(439,290,'Earth',23)+P('M443 51v-17l-12 10M443 34l12 10','none','#2d93ad',4);
 case 'water':return sun(130,108,31)+cloud(408,99)+P('M74 265Q210 240 340 258Q455 272 551 256v74H74Z','#83d4e8','#3597c1',2)+arrow(235,245,230,139)+arrow(423,139,443,236)+T(232,121,'↑',33,'#189ca4')+T(453,177,'↓',33,'#2086be')+T(294,311,'WATER',21);
 case 'seasons':return [['SUMMER','#fff4d3'],['AUTUMN','#fff0db'],['WINTER','#e1f2ff'],['SPRING','#e8f8ed']].map(([n,col],i)=>{const x=20+i*143;return R(x,86,130,206,col,17)+T(x+65,127,n,15)+(i===0?sun(x+65,201,29):i===2?cloud(x+65,200):plant(x+66,250,.6,i===3))}).join('');
 case 'plant':return card(14,104,'●','Seed')+card(164,104,'🌱','Sprout','#e2f8ed')+card(314,104,'🌿','Plant','#e7fae7')+card(464,104,'✿','Flower','#fcecf3')+[144,294,444].map(x=>arrow(x,167,x+14,167)).join('');
 case 'moon':return Array.from({length:5},(_,i)=>{const cx=87+i*110;let fill=i===0?'#334f74':i===4?'#fce2a6':'#e3edf9';let s=C(cx,169,41,fill,'#61819b',2);if(i===1)s+=P('M'+cx+' 129a40 40 0 0 1 0 80a26 40 0 0 0 0 -80','#ffe6a6','none',0);if(i===2)s+=P('M'+cx+' 129a40 40 0 0 1 0 80Z','#ffe6a6','none',0);if(i===3)s+=P('M'+cx+' 129a40 40 0 0 1 0 80a29 40 0 0 0 0 -80','#ffe6a6','none',0);return s+T(cx,252,['New','Crescent','Half','Gibbous','Full'][i],14)}).join('');
 case 'shadow':return sun(128,100,38)+L(318,267,318,146,'#426b8b',13)+C(318,126,23,'#77b6d7')+P('M318 268Q394 281 486 305','#c5d9e5','#a6c5d8',2)+ground(185,273,255)+T(437,332,'SHADOW',18);
 case 'animal':return card(12,103,'○','Egg')+card(162,103,'〰','Larva','#e8f8e9')+card(312,103,'◐','Pupa','#f4eefd')+card(462,103,'🦋','Adult','#fff4e4')+[143,293,443].map(x=>arrow(x,166,x+13,166)).join('');
 case 'tides':return earth(298,157,72)+C(108,157,40,'#d9deee','#98a9d5',3)+P('M213 155Q297 37 386 155Q296 272 213 155','#b2eaf2','#78c3d8',3)+T(108,260,'Moon',19)+T(296,291,'Ocean tides',20);
 case 'weather':return sun(120,139,38)+cloud(305,133)+C(465,138,41,'#d8ebff','#75aed2',3)+[440,465,490].map(x=>L(x,202,x-12,224,'#398cda',3)).join('')+T(120,287,'SUNNY',18)+T(305,287,'CLOUDY',18)+T(465,287,'RAINY',18);
 case 'habitat':return plant(180,280,1.1,true)+plant(348,280,.85)+sun(479,106,27)+C(475,248,21,'#df9e75')+T(310,341,'Plants · sun · living things',18);
 case 'food':return card(19,105,'🌱','Producer','#e8faea')+arrow(154,174,194,174)+card(205,105,'🐛','Consumer','#ecf7ff')+arrow(345,174,384,174)+card(398,105,'🐦','Predator','#f7f0ff');
 case 'matter':return [0,1,2].map(i=>{let x=41+i*192;let s=R(x,98,165,181,['#eaf7f0','#e7f5ff','#f4eeff'][i],17);let ps=i===0?[[40,42],[70,42],[100,42],[40,72],[70,72],[100,72],[40,102],[70,102],[100,102]]:i===1?[[30,54],[110,42],[55,91],[116,119],[76,133],[44,125],[126,86]]:[[28,24],[120,21],[80,74],[22,137],[142,144]];return s+ps.map(([a,b])=>C(x+a,112+b,8,['#28a986','#2f9dc2','#8b77ce'][i])).join('')+T(x+82,311,['SOLID','LIQUID','GAS'][i],18)}).join('');
 case 'magnet':return P('M188 105v126q0 100 100 100h36q100 0 100-100V105h-51v126q0 48-49 48h-36q-49 0-49-48V105Z','#ed7891','#b74f6a',4)+R(188,93,51,40,'#cbe8ff',4)+R(373,93,51,40,'#cbe8ff',4)+T(215,123,'N',21)+T(400,123,'S',21)+[460,494,528].map((x,i)=>P('M'+x+' '+(180+i*35)+'h15v7h-15z','#8aabb5','#648e9e',1)).join('');
 case 'circuit':return L(140,122,448,122,'#66849e',5)+L(448,122,448,261,'#66849e',5)+L(448,261,140,261,'#66849e',5)+L(140,261,140,122,'#66849e',5)+C(295,122,34,'#fff7df','#e6ac51',4)+P('M283 109q12 -19 24 0q-20 17 0 25q-12 -4-24 0q20 -16 0 -25','#ffd887','#dba64a',2)+L(125,175,125,214,'#445e89',4)+L(156,165,156,222,'#445e89',8)+T(294,343,'A complete circuit',20);
 case 'earth':return earth(298,172,120)+C(298,172,78,'#f0b66a','#e2a05d',2)+C(298,172,46,'#f5db85','#e6bd64',2)+C(298,172,22,'#f2f2dc','#dfd6a3',2)+L(422,135,523,112)+T(528,105,'Crust',18)+L(350,203,511,245)+T(515,268,'Mantle',18)+T(289,337,'Earth layers',19);
 case 'space':return sun(105,175,58)+earth(434,178,64)+P('M260 65Q403 16 533 137Q570 242 430 315Q287 353 259 228','none','#a3b9d5',3)+C(472,95,11,'#c4c7d7')+T(111,301,'Sun',18)+T(437,299,'Earth',18);
 case 'experiment':return R(68,99,142,162,'#fff',12,'#c2dbe9')+R(234,99,142,162,'#fff',12,'#c2dbe9')+R(400,99,142,162,'#fff',12,'#c2dbe9')+[134,304,470].map((x,i)=>R(x-25,133,50,96,['#d9efff','#e3f7df','#ffeacb'][i],3)).join('')+[134,304,470].map((x,i)=>T(x,302,'Trial '+(i+1),17)).join('');
 case 'graph':return L(116,289,116,79,'#7396a9',3)+L(116,289,514,289,'#7396a9',3)+[100,215,332].map((x,i)=>R(x+63,290-[92,156,121][i],73,[92,156,121][i],['#49b6ae','#4e9ed0','#eab66e'][i],4,'none')).join('')+T(292,342,'Compare observations',20);
 case 'sustain':return earth(288,175,112)+P('M139 237Q124 138 209 81','none','#28b38f',7)+P('M438 107Q468 213 371 274','none','#28b38f',7)+T(295,335,'Protect natural resources',20);
 default:return sun(150,145,37)+plant(360,280,1.35)+earth(497,130,40)+T(310,332,'Explore a scientific idea',18);
 }
}
const familyTopic={
 'Patterns in nature':'daynight','Earth & space':'space','Earth & sky':'space','Earth & weather':'weather',
 'Earth systems':'water','Weather':'weather','Weather & seasons':'seasons',
 'Life cycles':'plant','Living things':'plant','Living world':'habitat','Living systems':'food',
 'Habitats':'habitat','Our bodies & senses':'experiment','Movement':'shadow',
 'Forces':'magnet','Forces & movement':'magnet','Forces & energy':'circuit','Energy & forces':'circuit','Physical world':'magnet',
 'Material world':'matter','Materials':'matter','Materials & change':'matter',
 'Investigations':'experiment','Investigating':'experiment','Scientific inquiry':'graph',
 'Sustainability':'sustain','Science & society':'sustain'
};
const descriptions={
 daynight:'Watch the Sun, Earth and repeating natural cycles.',weather:'Look for changes in the weather and sky.',
 seasons:'Observe how seasons and natural conditions change.',water:'Follow water as it moves through Earth’s systems.',
 plant:'Discover how plants grow, develop and reproduce.',habitat:'Explore living things and their surroundings.',
 matter:'Observe the properties and changes of materials.',magnet:'Investigate forces, pushes, pulls and motion.',
 circuit:'Learn about energy, electricity and movement.',space:'Explore our planet, the Moon and the solar system.',
 experiment:'Make careful observations and fair comparisons.',graph:'Compare evidence and record scientific results.',
 sustain:'Learn how our choices affect the environment.'
};
function inferKey(q){
 if(q.diagramKey && scene(q.diagramKey))return q.diagramKey;
 const text=(q.text||'').toLowerCase();
 if(/moon|lunar eclipse/.test(text))return 'moon';
 if(/plant|seed|flower|pollinat/.test(text))return 'plant';
 if(/water cycle|evaporat|condens|precipitat|rainfall/.test(text))return 'water';
 if(/magnet|friction|gravity|push|pull/.test(text))return 'magnet';
 if(/light|shadow|sunshine/.test(text))return 'shadow';
 if(/circuit|electric|lamp/.test(text))return 'circuit';
 if(/mixture|solid|liquid|gas|material|dissolv/.test(text))return 'matter';
 if(/sun|orbit|earth|planet|rotation/.test(text))return 'space';
 if(/test|experiment|measure|variable|fair|observ/.test(text))return 'experiment';
 if(/graph|table|data|evidence/.test(text))return 'graph';
 return familyTopic[q.topic]||'experiment';
}
function svgFor(key){
 const inner=scene(key);
 return '<svg xmlns="http://www.w3.org/2000/svg" width="620" height="365" viewBox="0 0 620 365" role="img"><rect width="620" height="365" rx="22" fill="#ebf9fd"/><rect x="9" y="9" width="602" height="347" rx="18" fill="#f7fdff" stroke="#dcecf1" stroke-width="2"/>'+inner+'</svg>';
}
function add(topic,text,answer,options,explanation,diagramKey){return {topic,text,answer,options,explanation,diagramKey,originalVisual:true}}
const B={
 K:[
 add('Living things','Which part of a young plant usually grows down into the soil?','Roots',['Roots','Flowers','Leaves','Petals'],'Roots grow into soil to anchor the plant and take up water.','plant'),
 add('Weather','Which picture of the sky tells us rain might be coming?','Dark clouds',['Dark clouds','A clear sky','A bright rainbow only','A cloudless night'],'Dark clouds often contain water droplets that may fall as rain.','weather'),
 add('Earth & sky','Which object gives Earth most of its light during the day?','The Sun',['The Sun','The Moon','A rock','A tree'],'The Sun is the source of almost all natural daylight on Earth.','space'),
 add('Materials','What kind of material does water become when it freezes?','A solid',['A solid','A gas','A sound','A light'],'Frozen water is ice, which is a solid.','matter'),
 add('Movement','What can a gentle push do to a toy car?','Make it move',['Make it move','Make it grow','Change it to water','Turn it into soil'],'A push is a force that can start an object moving.','magnet'),
 add('Investigating','What should you do before describing a plant?','Look closely',['Look closely','Close your eyes','Guess without looking','Hide the plant'],'Careful observation helps you notice details.','experiment')],
 '1':[
 add('Living things','What do new seedlings usually grow after their roots?','A stem and leaves',['A stem and leaves','Wheels','Feathers','Metal parts'],'Seedlings grow a stem and leaves to take in light.','plant'),
 add('Weather & seasons','Which season usually follows winter in Australia?','Spring',['Spring','Autumn','Winter again','Summer immediately'],'Spring follows winter each year.','seasons'),
 add('Earth & sky','Which object does Earth travel around?','The Sun',['The Sun','The Moon','Mars','A cloud'],'Earth travels around the Sun once each year.','space'),
 add('Forces & movement','Which action is an example of a pull?','Opening a drawer towards you',['Opening a drawer towards you','Pushing a trolley away','Dropping a stone','Blowing a bubble'],'Pulling moves something towards the source of the force.','magnet'),
 add('Materials','When liquid water freezes it becomes…','Ice',['Ice','Steam','Sand','Smoke'],'Cooling water sufficiently changes it from a liquid into solid ice.','matter')],
 '2':[
 add('Life cycles','What stage comes after a butterfly caterpillar?','Pupa',['Pupa','Egg','Seed','Adult butterfly immediately'],'A caterpillar changes into a pupa before emerging as a butterfly.','animal'),
 add('Habitats','Which part of a pond helps fish breathe?','Dissolved oxygen in water',['Dissolved oxygen in water','Dry sand','Tree bark','Sunlight alone'],'Fish obtain dissolved oxygen from water using gills.','habitat'),
 add('Earth & weather','What happens when warm air containing water vapour cools?','Tiny water droplets can form',['Tiny water droplets can form','All clouds disappear','Water turns into stone','The Sun stops shining'],'Cooling can cause water vapour to condense into droplets.','water'),
 add('Materials','What happens to an ice cube in a warm room?','It melts',['It melts','It grows leaves','It becomes metal','It turns directly into a rock'],'Ice absorbs heat and changes from solid to liquid.','matter'),
 add('Investigations','Why would you measure a seedling every week?','To compare growth over time',['To compare growth over time','To change its species','To make it disappear','To stop it needing water'],'Repeated measurements show how something changes over time.','graph')],
 '3':[
 add('Patterns in nature','What causes the repeating pattern of day and night?','Earth rotating on its axis',['Earth rotating on its axis','The Sun moving around Earth daily','The Moon covering the Sun every night','Clouds switching off sunlight'],'Day and night repeat because Earth turns on its axis about once every 24 hours.','daynight'),
 add('Patterns in nature','When sunlight warms lake water, which process moves it into the air as vapour?','Evaporation',['Evaporation','Freezing','Melting','Deposition'],'Sunlight can supply heat that causes liquid water to evaporate.','water'),
 add('Patterns in nature','Which repeating change takes place across a year in many Australian places?','The four seasons',['The four seasons','The same weather every day','The Sun disappearing each month','Rocks turning into plants'],'Seasons change in a recurring yearly pattern.','seasons'),
 add('Patterns in nature','After a seed germinates, which stage usually grows next?','A seedling',['A seedling','A mature tree instantly','A stone','An empty seed packet'],'A young seedling develops before it grows into a mature plant.','plant'),
 add('Patterns in nature','Why does the Moon appear to change shape through a month?','We see different portions of its sunlit half',['We see different portions of its sunlit half','The Moon is physically changing shape','Clouds always cover exactly half','The Sun stops shining'],'The Moon orbits Earth, changing how much of its illuminated surface we see.','moon'),
 add('Patterns in nature','When the Sun is highest in the sky, a fixed upright object usually has a…','Shorter shadow',['Shorter shadow','Longer shadow than at sunrise','Shadow pointing straight up','Shadow with no direction'],'When the Sun is higher, the shadow of an upright object is generally shorter.','shadow'),
 add('Patterns in nature','When water vapour cools and forms droplets in clouds, the process is…','Condensation',['Condensation','Evaporation','Freezing soil','Photosynthesis'],'Condensation forms tiny liquid droplets when water vapour cools.','water'),
 add('Patterns in nature','Which stage completes the usual butterfly cycle: egg → caterpillar → pupa → ?','Adult butterfly',['Adult butterfly','Seed','Tadpole','Another pupa'],'A butterfly emerges from the pupa as an adult and can lay eggs for the next cycle.','animal'),
 add('Patterns in nature','Which natural pattern is strongly affected by the Moon’s gravity?','The rise and fall of ocean tides',['The rise and fall of ocean tides','The colour of rock minerals','How fast a seed germinates','The number of tree roots'],'The Moon’s gravity, together with the Sun’s, helps produce repeating ocean tides.','tides'),
 add('Patterns in nature','What usually happens to daylight hours from winter towards summer?','They become longer',['They become longer','They always stay exactly the same','The Moon provides all daylight','They disappear overnight'],'As summer approaches, many places in Australia experience longer daylight hours.','seasons'),
 add('Patterns in nature','What is a common reason some birds migrate at certain times of year?','Seasonal food and breeding conditions',['Seasonal food and breeding conditions','To change into other animals','Because Earth stops rotating','To avoid all sunlight'],'Many birds migrate in response to seasonal food, habitat and breeding conditions.','habitat'),
 add('Living world','Which organisms begin most land-based food chains?','Plants',['Plants','Top predators','Plastic objects','Non-living rocks'],'Green plants are producers that make food using light.','food'),
 add('Material world','In which state are particles usually close together but able to move past one another?','Liquid',['Liquid','Solid only','Gas only','Empty space'],'Liquid particles stay close but can slide past each other.','matter'),
 add('Physical world','What do you need to make a simple electric lamp light?','A complete circuit',['A complete circuit','An open switch only','A plastic sheet alone','A disconnected wire'],'Electric current needs a closed path to flow.','circuit'),
 add('Earth & space','Which phase shows the fully illuminated face of the Moon from Earth?','Full Moon',['Full Moon','New Moon','Crescent','First quarter'],'A full Moon occurs when the side facing Earth appears fully illuminated.','moon'),
 add('Investigations','Why would a scientist show measurements on a graph?','To recognise trends',['To recognise trends','To make the numbers vanish','To hide evidence','To change the variables'],'A graph helps people compare measured observations and spot patterns.','graph')],
 '4':[
 add('Living systems','What type of organism makes its own food using sunlight?','A producer',['A producer','A predator only','A decomposer only','A parasite only'],'Plants are producers because they make food using sunlight.','food'),
 add('Materials & change','Which process changes liquid water into water vapour?','Evaporation',['Evaporation','Condensation','Freezing','Crystallisation only'],'Evaporation changes liquid water into a gas.','water'),
 add('Forces & energy','What happens when an electrical circuit is broken?','Current stops flowing',['Current stops flowing','Current speeds up indefinitely','The battery becomes sunlight','The wires turn into magnets'],'A broken circuit does not provide a complete path for current.','circuit'),
 add('Earth systems','What drives most of the water cycle?','Energy from the Sun',['Energy from the Sun','A magnet alone','Metal in rocks','The Moon’s light'],'Solar energy heats water and helps cause evaporation.','water'),
 add('Sustainability','Which action helps conserve resources?','Repairing and reusing items',['Repairing and reusing items','Discarding working objects','Leaving taps running','Wasting food'],'Repairing and reusing can reduce the demand for new raw materials.','sustain'),
 add('Investigations','What is the best way to compare results from three different trials?','Record them in a table',['Record them in a table','Ignore the results','Change every variable','Keep no measurements'],'A table helps organise and compare results from repeated trials.','graph')],
 '5':[
 add('Living world','What do producers provide in a food web?','Energy-rich food',['Energy-rich food','Artificial magnets','Electric wires','Only oxygen-free air'],'Producers capture energy and make food that supports other organisms.','food'),
 add('Material world','Why does stirring often speed up dissolving?','It moves solute and solvent together',['It moves solute and solvent together','It creates new matter','It removes all water','It makes gravity stop'],'Stirring increases contact between solute and solvent particles.','matter'),
 add('Physical world','Which energy change happens in a lit battery-powered torch?','Chemical to electrical to light',['Chemical to electrical to light','Light to soil to heat','Sound to gravity to magnetic','Only motion to water'],'Stored chemical energy is transferred electrically and converted to light and heat.','circuit'),
 add('Earth & space','Why does Earth experience seasons?','Its tilted axis as it orbits the Sun',['Its tilted axis as it orbits the Sun','The Moon changing colour','Earth changing its diameter','The Sun switching off'],'Earth’s axial tilt changes solar illumination across the year.','seasons'),
 add('Sustainability','Why are solar panels considered a renewable-energy technology?','Sunlight is continually supplied',['Sunlight is continually supplied','Solar panels contain fuel oil','They create sunlight','They use no materials'],'Solar panels capture energy from sunlight, a renewable resource.','sustain'),
 add('Scientific inquiry','Which graph is most useful to show temperature changing over time?','A line graph',['A line graph','A single photograph','A map without labels','A paragraph without values'],'Line graphs show how a measured quantity changes over time.','graph')],
 '6':[
 add('Living systems','In a food web, what happens if producers become scarce?','Less energy is available to consumers',['Less energy is available to consumers','Consumers make food from rock','All populations must increase','Decomposers become sunlight'],'Less producer biomass means less energy is available to consumers higher in the food web.','food'),
 add('Materials','What does heating generally do to particle movement in a liquid?','It increases average particle motion',['It increases average particle motion','It permanently removes all particles','It makes every liquid freeze','It stops diffusion'],'Higher temperature usually means greater average particle kinetic energy.','matter'),
 add('Energy & forces','Why can a lamp in one branch of a parallel circuit remain on if another branch opens?','It still has a complete path',['It still has a complete path','There is no electricity anywhere','The battery turns into a lamp','The current must cross open air'],'Separate complete branches can carry current even if another branch is interrupted.','circuit'),
 add('Earth & space','What causes a lunar eclipse?','Earth blocks direct sunlight from reaching the Moon',['Earth blocks direct sunlight from reaching the Moon','The Moon hides behind the Sun','Mars blocks all sunlight every month','The Sun disappears'],'A lunar eclipse occurs when Earth lies between the Sun and the Moon and casts its shadow on the Moon.','space'),
 add('Science & society','Why should another scientist be able to repeat an experiment?','To check the reliability of results',['To check the reliability of results','To avoid evidence','To make the result secret','To guarantee a preferred answer'],'Replicable methods allow other scientists to check findings and identify possible errors.','experiment'),
 add('Scientific inquiry','What should you change in a controlled experiment to test one cause?','One independent variable',['One independent variable','Every factor at once','The conclusion before measuring','Nothing across trials'],'Changing one independent variable while controlling others helps identify its effect.','experiment')]
};
function forTopic(year,topic){return (B[String(year)]||[]).filter(q=>q.topic===topic)}
function enrich(year){return (B[String(year)]||[]).map(q=>({...q,options:[...q.options]}))}
function illustrate(q){const key=inferKey(q);return {svg:svgFor(key),alt:'Original SkillUP science illustration about '+(q.topic||'science').toLowerCase()+'. '+({daynight:'The Sun and rotating Earth.',water:'Water, cloud and circular arrows.',seasons:'Four season panels.',plant:'Stages of a growing plant.',moon:'Five phases of the Moon.',shadow:'A Sun, object and its shadow.',animal:'Egg, caterpillar, pupa and adult butterfly.',tides:'The Moon and ocean water around Earth.',weather:'Sun, cloud and rain panels.',habitat:'Plants, sunshine and living habitats.',food:'Producer and consumer stages.',matter:'Particles in solid, liquid and gas.',magnet:'A horseshoe magnet and small metal objects.',circuit:'A battery, wires and lamp in a complete circuit.',earth:'Cross-section of Earth’s layers.',space:'The Sun and Earth in space.',experiment:'Three samples recorded for a fair test.',graph:'A three-column observation graph.',sustain:'The Earth with sustainability arrows.'}[key]||'A science diagram.')}}
function thumbnail(topic){return svgFor(familyTopic[topic]||'experiment')}
function description(topic){return descriptions[familyTopic[topic]]||'Observe evidence, ask questions and explore scientific ideas.'}
window.SKILLUP_SCIENCE_VISUALS={enrich,forTopic,illustrate,thumbnail,description,svgFor};
})();

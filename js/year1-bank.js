// Test Yourself — Year 1 original practice bank
// Foundation skills selected after reviewing the three supplied Grade 2 resources.
(function(){
const topics=[
['number','123','Numbers to 100','Count, read and understand tens and ones'],
['compare','<>','Compare & Order','More, less, greatest, smallest and ordering'],
['beforeafter','↔','Before & After','One more, one less and missing numbers'],
['skipcount','↗','Skip Counting','Count by 2s, 5s and 10s'],
['addition','+','Addition to 20','Join groups and count on'],
['subtraction','−','Subtraction to 20','Take away and find how many are left'],
['basicfacts','★','Facts to 10','Build quick addition and subtraction recall'],
['doubles','2×','Doubles','Double numbers from 1 to 10'],
['make10','10','Make 10','Number bonds and friendly tens'],
['addsub','↔','Fact Families','Connect addition and subtraction'],
['missing','=','Missing Numbers','Find the number that makes a sentence true'],
['patterns','◆','Patterns','Repeating and simple growing patterns'],
['evenodd','2·4','Pairs: Even & Odd','Make pairs and notice leftovers'],
['equalgroups','●●','Equal Groups','Make small equal groups with objects'],
['sharing','÷','Sharing Equally','Share small collections fairly'],
['fractions','½','Halves & Quarters','Recognise equal parts and half of collections'],
['money','$','Australian Money','Recognise simple coin values and totals'],
['time','◷','Time','O’clock and half past'],
['calendar','▣','Days & Months','Days of the week and months of the year'],
['length','cm','Length','Longer, shorter and informal measurement'],
['mass','⚖','Mass','Heavier and lighter'],
['capacity','◫','Capacity','Full, empty, more and less'],
['shapes2d','△','2D Shapes','Circles, triangles, squares and rectangles'],
['shapes3d','▣','3D Objects','Cube, sphere, cone and cylinder'],
['position','⌖','Position & Direction','Left, right, above, below and turns'],
['data','▥','Data & Picture Graphs','Read simple tables and picture counts'],
['chance','?','Chance','Certain, possible and impossible'],
['wordproblems','ABC','Word Problems','Short real-life problems across Year 1 maths'],
['mixed','⚡','Mixed Challenge','Questions from across Year 1']];
const r=(a,b)=>Math.floor(Math.random()*(b-a+1))+a, sh=a=>[...a].sort(()=>Math.random()-.5);
function cs(ans,step=1){let s=new Set([ans]);while(s.size<4){let v=ans+(Math.random()<.5?-1:1)*r(1,3)*step;if(v>=0)s.add(v)}return sh([...s])}
function Q(text,answer,choices,tip){return{text,answer,choices:sh(choices||cs(answer)),tip}}
function question(t){let a,b,n;if(t==='mixed')t=topics[r(0,topics.length-2)][0];switch(t){
case'number':{n=r(10,99);let tens=Math.floor(n/10),ones=n%10;return Math.random()<.5?Q(`How many tens and ones are in ${n}?`,`${tens} tens and ${ones} ones`,[`${tens} tens and ${ones} ones`,`${ones} tens and ${tens} ones`,`${tens} tens and ${ones+1} ones`,`${tens+1} tens and ${ones} ones`],'The first digit tells the tens. The second tells the ones.'):Q(`What number is ${tens} tens and ${ones} ones?`,n,cs(n,10),'Build the number using tens and ones.')}
case'compare':{a=r(1,99);b=r(1,99);return Q(`Which number is greater: ${a} or ${b}?`,Math.max(a,b),[a,b],'Compare the tens first, then the ones.')}
case'beforeafter':{n=r(2,98);let mode=r(0,2);return mode===0?Q(`What number comes after ${n}?`,n+1,cs(n+1),'Count one more.'):mode===1?Q(`What number comes before ${n}?`,n-1,cs(n-1),'Count one less.'):Q(`Fill the gap: ${n-1}, ?, ${n+1}`,n,cs(n),'The missing number is between the other two.')}
case'skipcount':{let step=[2,5,10][r(0,2)],start=step*r(0,5),seq=[start,start+step,start+2*step,start+3*step],ans=start+4*step;return Q(`What comes next? ${seq.join(', ')}, ?`,ans,cs(ans,step),`Count forward by ${step}s.`)}
case'addition':{a=r(0,12);b=r(0,20-a);return Q(`${a} + ${b} = ?`,a+b,null,'Start with the bigger number and count on.')}
case'subtraction':{a=r(1,20);b=r(0,a);return Q(`${a} − ${b} = ?`,a-b,null,'Take away or count back.')}
case'basicfacts':{if(Math.random()<.5){a=r(0,10);b=r(0,10-a);return Q(`${a} + ${b} = ?`,a+b,null,'Use a fact you know.')}a=r(1,10);b=r(0,a);return Q(`${a} − ${b} = ?`,a-b,null,'Think about the related addition fact.')}
case'doubles':{a=r(1,10);return Q(`Double ${a} is…`,a*2,null,`Double means ${a} + ${a}.`)}
case'make10':{a=r(0,10);return Q(`${a} + ? = 10`,10-a,cs(10-a),'Think about the two parts that make 10.')}
case'addsub':{a=r(1,9);b=r(1,9);n=a+b;return Q(`If ${a} + ${b} = ${n}, which is also true?`,`${n} − ${a} = ${b}`,[`${n} − ${a} = ${b}`,`${n} + ${a} = ${b}`,`${a} − ${b} = ${n}`,`${b} − ${n} = ${a}`],'Addition and subtraction are related.')}
case'missing':{a=r(1,10);b=r(1,10);return Q(`Find □: □ + ${b} = ${a+b}`,a,cs(a),'What number makes both sides equal?')}
case'patterns':{if(Math.random()<.5)return Q('What comes next? red, blue, red, blue, …','red',['red','blue','green','yellow'],'Look for the part that repeats.');a=r(1,10);return Q(`What comes next? ${a}, ${a+2}, ${a+4}, ${a+6}, ?`,a+8,cs(a+8,2),'The pattern grows by 2 each time.')}
case'evenodd':{n=r(1,20);return Q(`Can ${n} objects be put into pairs with none left over?`,n%2===0?'Yes':'No',['Yes','No'],'An even number can be paired with none left over.')}
case'equalgroups':{let g=r(2,4),e=r(1,5);return Q(`${g} equal groups have ${e} counters in each group. How many counters altogether?`,g*e,null,'Add the same group again and again.')}
case'sharing':{let g=r(2,4),e=r(1,5),total=g*e;return Q(`${total} stickers are shared equally among ${g} children. How many does each child get?`,e,null,'Share one at a time until every child has the same number.')}
case'fractions':{if(Math.random()<.5){n=2*r(1,5);return Q(`What is half of ${n}?`,n/2,null,'Half means 2 equal groups.')}return Q('Which fraction means one of 4 equal parts?','one quarter',['one quarter','one half','one whole','one third'],'A quarter is one of four equal parts.')}
case'money':{let coins=[5,10,20,50],x=coins[r(0,3)],y=coins[r(0,3)];return Q(`You have a ${x}c coin and a ${y}c coin. How many cents altogether?`,x+y,cs(x+y,5),'Add the values of the coins.')}
case'time':{let h=r(1,12);if(Math.random()<.5)return Q(`Which digital time shows ${h} o’clock?`,`${h}:00`,[`${h}:00`,`${h}:30`,`${h}:15`,`${h}:45`],'O’clock means zero minutes past the hour.');return Q(`Which digital time shows half past ${h}?`,`${h}:30`,[`${h}:30`,`${h}:00`,`${h}:15`,`${h}:45`],'Half past means 30 minutes past.')}
case'calendar':{const d=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],m=['January','February','March','April','May','June','July','August','September','October','November','December'];if(Math.random()<.5){let i=r(0,5);return Q(`What day comes after ${d[i]}?`,d[i+1],[d[i+1],d[(i+2)%7],d[Math.max(0,i-1)],d[(i+3)%7]],'Say the days of the week in order.')}let i=r(0,10);return Q(`What month comes after ${m[i]}?`,m[i+1],[m[i+1],m[(i+2)%12],m[Math.max(0,i-1)],m[(i+4)%12]],'Say the months in order.')}
case'length':{a=r(2,12);b=r(1,a-1);return Q(`A pencil is ${a} blocks long. A crayon is ${b} blocks long. Which is longer?`,'pencil',['pencil','crayon','They are the same'],'Compare the measurements.')}
case'mass':return Q('A full school bag and one pencil are on a balance. Which is likely heavier?','school bag',['school bag','pencil','They must be equal'],'Heavier objects have more mass.')
case'capacity':return Q('Which container is likely to hold more water?','bucket',['bucket','teaspoon','bottle cap','small cup'],'Capacity means how much a container can hold.')
case'shapes2d':{let arr=[['triangle',3],['square',4],['rectangle',4]];let x=arr[r(0,2)];return Q(`How many straight sides does a ${x[0]} have?`,x[1],cs(x[1]),'Count the sides around the shape.')}
case'shapes3d':return Q('Which 3D object can roll easily in every direction?','sphere',['sphere','cube','rectangular prism','square'],'A sphere has a curved surface all around.')
case'position':{let qs=[['The ball is under the table. Where is the ball?','under'],['You turn right from facing north. Which direction do you face?','east']];let x=qs[r(0,1)];return Q(x[0],x[1],x[1]==='under'?['under','above','inside','left']:['east','west','north','south'],'Use position and direction words carefully.')}
case'data':{a=r(2,8);b=r(1,8);return Q(`A picture graph shows ${a} apples and ${b} bananas. How many pieces of fruit are shown altogether?`,a+b,null,'Add the two categories.')}
case'chance':return Q('Which event is impossible?','A normal week has 8 days',['A normal week has 8 days','The sun rises tomorrow','You choose a red counter from a bag with red and blue counters'],'Impossible means it cannot happen.')
case'wordproblems':{let mode=r(0,8);if(mode===0){a=r(2,12);b=r(1,20-a);return Q(`Ava has ${a} stickers. Her friend gives her ${b} more. How many stickers does Ava have now?`,a+b,null,'The amount grows, so add.')}if(mode===1){a=r(5,20);b=r(1,a);return Q(`There are ${a} birds on a fence. ${b} fly away. How many birds are left?`,a-b,null,'Some leave, so subtract.')}if(mode===2){a=r(3,15);b=r(1,a-1);return Q(`Leo has ${a} toy cars and Mia has ${b}. How many more cars does Leo have?`,a-b,null,'“How many more” asks for the difference.')}if(mode===3){let g=r(2,4),e=r(1,4);return Q(`There are ${g} plates with ${e} cookies on each plate. How many cookies are there altogether?`,g*e,null,'Count equal groups.')}if(mode===4){let g=r(2,4),e=r(1,4);return Q(`${g*e} pencils are shared equally among ${g} students. How many pencils does each student get?`,e,null,'Share equally.')}if(mode===5){n=2*r(1,5);return Q(`Mum cuts ${n} strawberries into 2 equal groups. How many strawberries are in half the collection?`,n/2,null,'Half means 2 equal groups.')}if(mode===6){a=r(2,10);b=r(1,10);return Q(`A ribbon is ${a} blocks long and another ribbon is ${b} blocks long. How many blocks long are they altogether?`,a+b,null,'Add the two lengths.')}if(mode===7){a=r(2,8);b=r(1,8);return Q(`A class graph shows ${a} votes for cats and ${b} votes for dogs. How many votes are there altogether?`,a+b,null,'Add both categories.')}return Q('Sam goes to school in the morning. Is 8:00 a.m. or 8:00 p.m. more sensible?','8:00 a.m.',['8:00 a.m.','8:00 p.m.'],'Morning times use a.m.')}
}return Q('1 + 1 = ?',2,[2,1,3,4],'Count on one.');}
window.TY_YEAR1={topics,question};
})();
/* Grade 2 mixed word-problem extension for Test Yourself.
   Original question generators inspired by the skill coverage of the Grade 2 curriculum sources. */
(function(){
  if(typeof y2==='undefined'||typeof y2q==='undefined') return;

  const wpTopic=['wordproblems','ABC','Word Problems','Real-life problems from every Year 2 maths area'];
  const mixedIndex=y2.findIndex(x=>x[0]==='mixed');
  if(!y2.some(x=>x[0]==='wordproblems')) y2.splice(mixedIndex<0?y2.length:mixedIndex,0,wpTopic);

  const originalY2q=y2q;
  const names=['Ava','Noah','Mia','Liam','Zara','Omar','Leo','Sofia','Jack','Amira','Ethan','Ruby'];
  const things=['stickers','shells','books','marbles','cards','pencils','buttons','toy cars','crayons','beads'];
  const pick=a=>a[rnd(0,a.length-1)];
  const person=()=>pick(names), item=()=>pick(things);
  const cents=v=>`$${(v/100).toFixed(2)}`;
  const wp=(text,answer,opts,tip,skill)=>{let z=q(text,answer,opts,tip);z.skill=skill||'Word Problem';return z};

  function year2WordProblem(){
    let mode=rnd(0,27),a,b,c,n,g,e,who=person(),what=item();
    switch(mode){
      case 0: // addition
        a=rnd(12,68);b=rnd(8,49);
        return wp(`${who} has ${a} ${what}. A friend gives ${who} ${b} more. How many ${what} does ${who} have altogether?`,a+b,null,'Altogether means add the two amounts.','Addition');
      case 1: // subtraction take away
        a=rnd(35,99);b=rnd(8,a-5);
        return wp(`${who} collected ${a} ${what}. ${b} were used. How many ${what} are left?`,a-b,null,'Start with the total and subtract the amount used.','Subtraction');
      case 2: // comparison
        a=rnd(25,85);b=rnd(10,a-3);
        return wp(`${who} read ${a} pages this week. ${person()} read ${b} pages. How many more pages did ${who} read?`,a-b,null,'“How many more” asks for the difference.','Compare');
      case 3: // unknown start
        b=rnd(5,25);n=rnd(30,80);a=n-b;
        return wp(`${who} had some cards. After getting ${b} more cards, ${who} had ${n}. How many cards did ${who} have at the start?`,a,null,'Work backwards: final amount minus the amount added.','Unknown Number');
      case 4: // unknown change
        a=rnd(15,55);n=rnd(a+5,95);b=n-a;
        return wp(`${who} had ${a} beads and then received some more. Now there are ${n} beads. How many were added?`,b,null,'Find the difference between the final amount and the starting amount.','Unknown Number');
      case 5: // multi step
        a=rnd(15,40);b=rnd(10,35);c=rnd(5,Math.min(25,a+b-1));
        return wp(`A class collected ${a} cans on Monday and ${b} on Tuesday. They used ${c} cans for an art project. How many cans are left?`,a+b-c,null,'First add Monday and Tuesday, then subtract what was used.','Two-Step');
      case 6: // equal groups
        g=rnd(2,6);e=rnd(2,8);
        return wp(`There are ${g} tables. Each table has ${e} pencils. How many pencils are there altogether?`,g*e,null,'Equal groups can be solved with repeated addition.','Equal Groups');
      case 7: // sharing division
        g=rnd(2,6);e=rnd(2,8);n=g*e;
        return wp(`${who} shares ${n} strawberries equally among ${g} children. How many strawberries does each child get?`,e,null,'Share the total equally among the groups.','Division / Sharing');
      case 8: // grouping division
        e=rnd(2,5);g=rnd(2,8);n=e*g;
        return wp(`There are ${n} counters. They are put into groups of ${e}. How many groups can be made?`,g,null,'Count how many equal groups of the given size fit in the total.','Division / Grouping');
      case 9: // fraction collection
        b=pick([2,3,4]);e=rnd(2,6);n=b*e;
        return wp(`${who} has ${n} grapes and shares them into ${b} equal groups. What is 1/${b} of ${n}?`,e,null,`Divide ${n} into ${b} equal parts.`,'Fractions');
      case 10: // fraction terminology
        b=pick([2,3,4]);
        return wp(`A sandwich is cut into ${b} equal pieces. What is one piece called?`,b===2?'one half':b===3?'one third':'one quarter',[b===2?'one half':b===3?'one third':'one quarter','one whole','one fifth','two wholes'],'Fractions name equal parts of one whole.','Fractions');
      case 11: // money total Australian
        a=pick([5,10,20,50,100,200]);b=pick([5,10,20,50,100]);c=pick([5,10,20,50]);n=a+b+c;
        return wp(`${who} has coins worth ${a}¢, ${b}¢ and ${c}¢. What is the total value?`,`${n}¢`,[`${n}¢`,`${Math.max(0,n-10)}¢`,`${n+10}¢`,`${n+20}¢`],'Add the values of all the coins.','Money');
      case 12: // money change
        a=pick([100,200,500]);b=rnd(2,Math.floor(a/10)-1)*10;n=a-b;
        return wp(`${who} has ${cents(a)} and buys a snack for ${cents(b)}. How much change should ${who} receive?`,cents(n),[cents(n),cents(b),cents(n+10),cents(Math.max(0,n-10))],'Change = amount paid − cost.','Money');
      case 13: // time elapsed
        a=rnd(1,10);b=pick([15,30,45,60]);
        if(b===60)return wp(`A lesson starts at ${a}:00 and lasts 1 hour. What time does it finish?`,`${a+1}:00`,[`${a+1}:00`,`${a}:30`,`${a+2}:00`,`${a}:15`],'Add one hour to the starting time.','Time');
        return wp(`Reading starts at ${a}:00 and lasts ${b} minutes. What time does it finish?`,`${a}:${String(b).padStart(2,'0')}`,[`${a}:${String(b).padStart(2,'0')}`,`${a}:10`,`${a}:20`,`${a+1}:00`],`Add ${b} minutes to ${a}:00.`,'Time');
      case 14: // am pm
        a=rnd(7,11);
        return wp(`${who} eats breakfast at ${a}:00 in the morning. Should this time be written a.m. or p.m.?`,'a.m.',['a.m.','p.m.'],'Morning times are a.m.','A.M. / P.M.');
      case 15: // calendar
        a=rnd(2,6);
        return wp(`A school project lasts ${a} weeks. How many days is that?`,a*7,null,'There are 7 days in each week.','Calendar');
      case 16: // length total
        a=rnd(15,75);b=rnd(10,55);
        return wp(`One ribbon is ${a} cm long and another is ${b} cm long. What is their total length?`,a+b,null,'Add the two lengths. Keep the unit in centimetres.','Length');
      case 17: // length compare
        a=rnd(40,90);b=rnd(10,a-5);
        return wp(`A blue string is ${a} cm long. A red string is ${b} cm long. How much longer is the blue string?`,a-b,null,'Subtract to find the difference in length.','Length');
      case 18: // area grid
        a=rnd(2,7);b=rnd(2,6);
        return wp(`A small garden picture covers ${a} rows of ${b} equal square tiles. How many square tiles cover the garden?`,a*b,null,'Count equal squares: rows × squares in each row.','Area');
      case 19: // mass
        a=rnd(5,15);b=rnd(1,a-2);
        return wp(`A bag of books balances with ${a} blocks. A toy balances with ${b} blocks. How many blocks heavier is the bag of books?`,a-b,null,'Find the difference between the two masses.','Mass');
      case 20: // capacity
        a=rnd(6,12);b=rnd(2,a-1);
        return wp(`A large jug holds ${a} cups of water. A small jug holds ${b} cups. How many more cups does the large jug hold?`,a-b,null,'Capacity is how much a container can hold. Compare by subtracting.','Capacity');
      case 21: // 2D shape clue
        return wp('A playground sign is a closed shape with 4 equal sides and 4 corners. Which shape could it be?','square',['square','triangle','pentagon','circle'],'Use the shape attributes in the description.','2D Shapes');
      case 22: // 3d clue
        return wp('A toy block has 6 flat square faces. Which 3D object best describes it?','cube',['cube','sphere','cone','cylinder'],'A cube has 6 square faces.','3D Objects');
      case 23: // position
        return wp(`${who} is facing north. ${who} makes a quarter turn clockwise. Which direction is ${who} facing now?`,'East',['East','West','North','South'],'A quarter turn clockwise from north points east.','Position');
      case 24: // data table
        a=rnd(4,10);b=rnd(2,9);c=rnd(1,8);
        return wp(`In a class survey, ${a} children chose apples, ${b} chose bananas and ${c} chose oranges. How many children answered the survey?`,a+b+c,null,'Add all category counts to find the total.','Data');
      case 25: // graph compare verbal
        a=rnd(5,10);b=rnd(1,a-1);
        return wp(`A bar graph shows ${a} votes for soccer and ${b} votes for tennis. How many more votes did soccer receive?`,a-b,null,'Compare the two bars by finding the difference.','Graphs');
      case 26: // chance
        return wp('A bag contains 8 blue counters and no red counters. Which statement is true about picking a red counter without looking?','It is impossible',['It is impossible','It is certain','It is more likely than blue','It must happen'],'An event is impossible when it cannot happen.','Chance');
      default: // place value word problem
        n=rnd(100,999);a=Math.floor(n/100);b=Math.floor(n/10)%10;c=n%10;
        return wp(`A library has ${a} hundreds, ${b} tens and ${c} single books in a display. How many books is that altogether?`,n,null,'Combine the hundreds, tens and ones.','Place Value');
    }
  }

  y2q=function(t){
    if(t==='wordproblems') return year2WordProblem();
    return originalY2q(t);
  };

  // Rebuild once so the new card appears when this extension loads after practice.js.
  if(String(grade)==='2'&&typeof buildTopics==='function'&&typeof buildSet==='function'){
    buildTopics();
    buildSet();
  }
})();

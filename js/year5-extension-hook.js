// Safely extend the existing practice engine for Year 5 without changing other years.
(function(){
  if(!window.TY_YEAR5_TESTS || typeof topicList!=='function' || typeof makeQuestion!=='function') return;
  const oldTopicList=topicList, oldMakeQuestion=makeQuestion, oldYearDescription=yearDescription, oldSetSize=setSize;
  topicList=function(){
    if(grade==='5'){
      const existing=(window.TY_YEARS345&&window.TY_YEARS345.topics&&window.TY_YEARS345.topics['5'])||[];
      const extra=window.TY_YEAR5_TESTS.topics||[];
      const seen=new Set();
      return [...existing,...extra].filter(x=>{if(seen.has(x[0]))return false;seen.add(x[0]);return true;});
    }
    return oldTopicList();
  };
  makeQuestion=function(){
    if(grade==='5' && window.TY_YEAR5_TESTS){
      const extraIds=new Set(window.TY_YEAR5_TESTS.topics.map(x=>x[0]));
      if(extraIds.has(topic)) return window.TY_YEAR5_TESTS.question(topic);
    }
    return oldMakeQuestion();
  };
  yearDescription=function(){
    if(grade==='5') return 'Large numbers, factors and multiples, fractions, decimals, percentages, probability, coordinates, geometry, measurement, averages, equations, rates, graphs and multi-step problem solving.';
    return oldYearDescription();
  };
  setSize=function(){
    if(grade==='5') return 20;
    return oldSetSize();
  };
  if(grade==='5'){buildTopics();buildSet();}
})();
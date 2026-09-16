(function(){
  const quick=window.SKILLUP_READING_QUICK;
  const reading=window.SKILLUP_READING;
  if(!quick||!reading)return;
  if(!reading.topics.some(x=>x[0]==='quick')) reading.topics.unshift(...quick.topics);
  const original=reading.question.bind(reading);
  reading.question=function(id='mixed',mode='mix'){
    if(id==='quick') return quick.question(mode);
    return original(id,mode);
  };
})();
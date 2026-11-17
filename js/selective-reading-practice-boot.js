// Reading-only adapter: do not load the maths/workshop integrations on this page.
(function(){
 const reading=window.SKILLUP_READING,quick=window.SKILLUP_READING_QUICK;
 if(!reading||!quick)return;
 if(!reading.topics.some(t=>t[0]==='quick'))reading.topics.unshift(...quick.topics);
 const original=reading.question.bind(reading);
 reading.question=(id='mixed',mode='mix')=>id==='quick'?quick.question(mode):original(id,mode);
})();

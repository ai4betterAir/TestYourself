import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=new URL('../../',import.meta.url);
const context={window:{},console,Math,document:{createElement(){return{};},head:{append(script){vm.runInContext(fs.readFileSync(new URL(script.src,root),'utf8'),context);script.onload();}}}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('js/homework-bank.js',root),'utf8').replaceAll('export ',''),context);
let topicCount=0;
for(const year of ['K','1','2','3','4','5','6'])for(const subject of ['Maths','English','Science']){
  context.year=year;context.subject=subject;
  const bank=await vm.runInContext('getHomeworkBank(year,subject)',context);
  assert.ok(bank.topics.length);
  for(const topic of bank.topics){
    for(let n=0;n<5;n++){
      const q=bank.question(topic.id);
      assert.ok(q.text);assert.ok(q.answer>=0&&q.answer<q.choices.length);assert.equal(new Set(q.choices).size,q.choices.length);assert.ok(q.choices.every(c=>c.length>0));
    }
    topicCount++;
  }
  const make=vm.runInContext('makeHomework',context);
  assert.equal(make(bank,[bank.topics[0].id],10).length,10);
  const mixed=make(bank,bank.topics.slice(0,3).map(t=>t.id),20);
  assert.equal(mixed.length,20);assert.equal(new Set(mixed.map(q=>q.topic)).size,3);
}
console.log('PASS: '+topicCount+' topics across K–6 Maths, English and Science; single and mixed question sets.');

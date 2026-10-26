import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
const root='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
fs.mkdirSync('science-studio-previews',{recursive:true});
const cases=[
 ['K','Living things','desktop'],['1','Earth & sky','desktop'],['2','Life cycles','desktop'],
 ['3','Patterns in nature','desktop'],['3','Patterns in nature','mobile'],
 ['4','Earth systems','desktop'],['5','Material world','desktop'],
 ['6','Energy & forces','desktop'],['6','Earth & space','mobile']
];
try{
 for(const [year,topic,mode] of cases){
  const mobile=mode==='mobile';
  const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1360,height:950},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',err=>errors.push(err.stack||err.message));
  const url=root+'/science-practice.html?year='+encodeURIComponent(year)+'&topic='+encodeURIComponent(topic);
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(response.status(),200,'HTTP 200 required');
  await page.locator('#question').waitFor({state:'visible',timeout:15000});
  assert.equal(await page.locator('#yearSelect').inputValue(),year);
  assert.equal(await page.locator('.topic-pill.active').getAttribute('data-topic'),topic);
  assert.ok((await page.title()).includes('Science Studio'));
  const img=page.locator('#questionImage');
  const visual=await img.evaluate(x=>({ready:x.complete&&x.naturalWidth>0,src:x.getAttribute('src'),alt:x.alt,width:x.getBoundingClientRect().width,viewport:document.documentElement.clientWidth}));
  assert.ok(visual.ready,'Original diagram not displayed '+year+'/'+topic);
  assert.ok(visual.src.startsWith('data:image/svg+xml;charset=UTF-8,'));
  assert.ok(visual.alt.length>38,'Image must have alternative description');
  assert.ok(visual.width<=visual.viewport+1,'Mobile diagram overflow');
  const expected=await page.evaluate(()=>window.SKILLUP_SCIENCE_STUDIO.getState());
  assert.equal(expected.topic,topic);
  assert.ok(expected.total>=2&&expected.total<=10);
  if(year==='3'&&topic==='Patterns in nature')assert.equal(expected.total,10,'Year3 patterns should have ten different questions');
  const controls=page.locator('#options button');
  assert.equal(await controls.count(),4);
  await page.locator('#questionFigure').scrollIntoViewIfNeeded();
  await page.locator('#questionFigure').screenshot({path:'science-studio-previews/'+year+'-'+topic.replaceAll(' ','-').replaceAll('&','and')+'-'+mode+'.png',animations:'disabled'});
  const q=await page.evaluate(()=>{const b=document.querySelectorAll('#options button');return {answer:window.SKILLUP_SCIENCE_STUDIO?null:null,buttons:[...b].map(x=>x.dataset.value)}});
  const correct=await page.evaluate(()=>{const options=[...document.querySelectorAll('#options button')];const bank=[...window.SKILLUP_SCIENCE[document.querySelector('#yearSelect').value],...window.SKILLUP_SCIENCE_VISUALS.enrich(document.querySelector('#yearSelect').value)];const text=document.querySelector('#question').textContent;return bank.find(q=>q.text===text)?.answer});
  assert.ok(correct,'Current question not in science source bank');
  await controls.filter({has:page.locator('span', {hasText:correct})}).first().click().catch(async()=>{await page.locator('#options button[data-value="'+correct.replaceAll('"','\\"')+'"]').click()});
  await page.locator('#check').click();
  assert.match(await page.locator('#feedback').innerText(),/Correct/);
  assert.equal(await page.locator('#practiceExplanation').isVisible(),true);
  assert.ok((await page.locator('#practiceExplanation').innerText()).length>12);
  await page.locator('#next').click();
  const next=await page.locator('#question').innerText();
  assert.notEqual(next,await page.evaluate(()=>''),'Next question missing');
  if(year==='3'&&mode==='desktop'){
   const texts=await page.evaluate(()=>{const bank=[...window.SKILLUP_SCIENCE['3'],...window.SKILLUP_SCIENCE_VISUALS.enrich('3')].filter(x=>x.topic==='Patterns in nature');return bank.length});
   assert.ok(texts>=10);
   await page.locator('.mode[data-mode="test"]').click();
   await page.locator('#startTest').click();
   await page.locator('#testFigure').waitFor({state:'visible'});
   const total=await page.evaluate(()=>window.SKILLUP_SCIENCE_STUDIO.getState().total);
   assert.equal(total,12,'All unique Patterns questions should be included in scoped test');
   for(let i=0;i<total;i++)await page.locator('#testNext').click();
   await page.locator('#testResult').waitFor({state:'visible'});
   assert.equal(await page.locator('#reviewList details').count(),total,'Review count');
   assert.equal(await page.locator('#reviewList img').count(),total,'All reviews require diagram');
   await page.locator('#reviewList details').first().click();
   await page.locator('#reviewList details').first().screenshot({path:'science-studio-previews/year3-review.png',animations:'disabled'});
  }
  assert.equal(errors.length,0,'JavaScript errors: '+errors.join('; '));
  console.log('PASSED',year,topic,mode,'original science art and question feedback');
  await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto(root+'/science-practice.html?year=6&topic=Earth%20%26%20space',{waitUntil:'domcontentloaded'});
 const dims=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
 assert.ok(dims.scroll<=dims.width+2,'Horizontal layout overflow on mobile');
 await page.close();
}finally{await browser.close()}

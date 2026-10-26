import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
const base='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
fs.mkdirSync('thinking-topic-previews',{recursive:true});
const V=['visual','cube','ocfigures','symmetry','figurematch','visualpatterns','figureodd','shapecount'];
const logical=['logic','evidence','order','seating','time','number','rate','data','probability','family','argument','sets'];
try{
 for(const exam of ['selective','oc']){
  const baseParams=new URLSearchParams({stream:'thinking',...(exam==='oc'?{exam:'oc'}:{})});
  for(const mobile of [false,true]){
   const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1320,height:900}});
   const errors=[];page.on('pageerror',e=>errors.push(e.stack||e.message));
   const response=await page.goto(base+'/selective-practice.html?'+baseParams,{waitUntil:'domcontentloaded',timeout:30000});
   assert.equal(response.status(),200);
   await page.locator('#practiceHeading').waitFor({state:'visible',timeout:13000});
   assert.equal(await page.locator('body').getAttribute('data-stream'),'thinking');
   assert.match(await page.locator('#practiceHeading').innerText(),/Thinking Skills/);
   const headings=await page.locator('#topics .thinking-topic-heading h3').allTextContents();
   assert.deepEqual(headings,['Verbal & Logical Reasoning','Visual & Non-verbal Reasoning']);
   assert.equal(await page.locator('#topics button[data-topic="mixed"]').count(),1);
   for(const id of [...V,...logical])assert.equal(await page.locator('#topics button[data-topic="'+id+'"]').count(),1,'Missing Thinking Skills topic '+id);
   assert.equal(await page.locator('#topicCount').innerText(),'20');
   const sorted=await page.locator('#topics').evaluate(el=>{
    const names=[...el.children].map(c=>c.dataset.topic||c.querySelector('h3')?.textContent);
    return names;
   });
   assert.ok(sorted.indexOf('Visual & Non-verbal Reasoning')<sorted.indexOf('visual'));
   assert.ok(sorted.indexOf('Verbal & Logical Reasoning')<sorted.indexOf('logic'));
   const dims=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(dims.scroll<=dims.width+2,'Layout overflow '+exam+' '+mobile);
   if(exam==='selective'&&mobile===false)await page.locator('#topics').screenshot({path:'thinking-topic-previews/selective-grouped-topics-desktop.png',animations:'disabled'});
   if(exam==='oc'&&mobile)await page.locator('#topics').screenshot({path:'thinking-topic-previews/oc-grouped-topics-mobile.png',animations:'disabled'});
   await page.locator('#topics button[data-topic="ocfigures"]').click();
   assert.equal(new URL(page.url()).searchParams.get('topic'),'ocfigures');
   await page.locator('#questionFigure').waitFor({state:'visible',timeout:15000});
   assert.match(await page.locator('#questionImage').getAttribute('src'),/TS-OC/);
   assert.equal(await page.locator('#answers button').allTextContents().then(x=>x.join('')),'ABCD');
   await page.locator('#backToTopics').click();
   await page.locator('#topics button[data-topic="symmetry"]').click();
   assert.equal(new URL(page.url()).searchParams.get('topic'),'symmetry');
   assert.match(await page.locator('#questionImage').getAttribute('src'),/TS-OCS/);
   await page.locator('#backToTopics').click();
   await page.locator('#topics button[data-topic="logic"]').click();
   assert.equal(new URL(page.url()).searchParams.get('topic'),'logic','Logical topics must remain inside Thinking Skills');
   assert.equal(await page.locator('#questionFigure').isHidden(),true,'Verbal puzzle should not show an unrelated image');
   assert.equal(errors.length,0,errors.join(';'));
   console.log('PASS',exam,mobile?'mobile':'desktop','logical + all 8 visual topics nested under Thinking Skills');
   await page.close();
  }
  const deep=await browser.newPage({viewport:{width:1050,height:800}});
  const url=base+'/selective-practice.html?'+baseParams+'&topic=ocfigures';
  await deep.goto(url,{waitUntil:'domcontentloaded'});
  await deep.locator('#questionFigure').waitFor({state:'visible'});
  assert.equal(await deep.locator('#topics button[data-topic="ocfigures"]').getAttribute('aria-pressed'),'true');
  assert.equal(await deep.locator('body').getAttribute('data-stream'),'thinking');
  await deep.close();
 }
 for(const p of ['selective.html','oc.html']){
   const page=await browser.newPage();
   await page.goto(base+'/'+p,{waitUntil:'domcontentloaded'});
   assert.equal(await page.locator('.sel-chips .chip').filter({hasText:'Visual Figure Skills'}).count(),0,'Standalone Figure Skills chip must be removed');
   const thinking=page.locator('.sel-chips .chip').filter({hasText:'Thinking Skills'});
   assert.equal(await thinking.count(),1);
   assert.match((await thinking.innerText()).toLowerCase(),/visual|figures|patterns/);
   await page.close();
 }
 console.log('All landing pages and Selective/OC Thinking Skills visual + logical topic integration verified.');
}finally{await browser.close()}

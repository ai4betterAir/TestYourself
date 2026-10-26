import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
const base=process.env.SKILLUP_TEST_URL||'http://127.0.0.1:4173';
const topics=['ocfigures','symmetry','figurematch','visualpatterns','figureodd','shapecount'];
fs.mkdirSync('oc-figure-previews',{recursive:true});
const browser=await chromium.launch({headless:true});
try {
 for(const viewport of [{name:'desktop',width:1320,height:900},{name:'mobile',width:390,height:844}]){
  for(const topic of topics){
   const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
   const errs=[];page.on('pageerror',e=>errs.push(e.message));
   const params=new URLSearchParams({exam:'oc',stream:'thinking',topic});
   const response=await page.goto(base+'/selective-practice.html?'+params,{waitUntil:'domcontentloaded',timeout:25000});
   assert.equal(response.status(),200);
   await page.locator('#questionFigure').waitFor({state:'visible',timeout:15000});
   const img=await page.locator('#questionImage').evaluate(img=>({
    loaded:img.complete&&img.naturalWidth>0,
    src:img.getAttribute('src'),
    alt:img.alt,
    width:img.getBoundingClientRect().width,
    viewport:document.documentElement.clientWidth
   }));
   assert.ok(img.loaded,'Image not loaded: '+topic);
   assert.match(img.src,/TS-OC[SMPOC]-\d{3}(-mobile)?\.svg$/,'Wrong image path');
   if(viewport.name==='mobile') assert.ok(img.src.endsWith('-mobile.svg'));
   assert.ok(img.width<=img.viewport+2,'Diagram extends beyond screen');
   assert.ok(img.alt.length>=60);
   assert.equal(await page.locator('#questionFigure .visual-full-link').getAttribute('href'),img.src);
   assert.equal(await page.locator('#answers button').allTextContents().then(xs=>xs.join('')),'ABCD','Options must stay A to D');
   await page.locator('#questionFigure').screenshot({path:'oc-figure-previews/'+topic+'-'+viewport.name+'.png',animations:'disabled'});
   const record=await page.evaluate(src=>window.SKILLUP_VISUAL.questions.find(q=>q.image===src||q.imageMobile===src),img.src);
   assert.ok(record);
   await page.locator('#answers button').filter({hasText:record.answer,exact:true}).click();
   await page.locator('#check').click();
   assert.match(await page.locator('#feedback').innerText(),/Correct/);
   assert.ok(await page.locator('#cubeExplanation').isVisible(),'Worked explanation missing');
   assert.ok((await page.locator('#cubeExplanation').innerText()).length>=60);
   await page.locator('#next').click();
   assert.ok(await page.locator('#cubeExplanation').isHidden());
   if(topic==='ocfigures'&&viewport.name==='desktop'){
     await page.locator('.top-tabs button[data-view="mock"]').click();
     await page.locator('#startMock').click();
     await page.locator('#mockQuestionFigure').waitFor({state:'visible'});
     assert.match(await page.locator('#mockQuestionImage').getAttribute('src'),/TS-OC/);
     for(let i=0;i<30;i++)await page.locator('#mockNext').click();
     await page.locator('#mockResult').waitFor({state:'visible'});
     assert.equal(await page.locator('#mockReview img.review-figure').count(),30,'Missing diagrams in review');
     assert.equal(await page.locator('#mockReview .cube-review-explanation').count(),30,'Missing review explanations');
   }
   assert.equal(errs.length,0,errs.join(';'));
   console.log('Browser passed',topic,viewport.name,img.src);
   await page.close();
  }
 }
 const page=await browser.newPage({viewport:{width:1080,height:760}});
 await page.goto(base+'/selective-practice.html?stream=thinking&topic=ocfigures',{waitUntil:'domcontentloaded'});
 await page.locator('#questionFigure').waitFor({state:'visible'});
 assert.match(await page.locator('#questionImage').getAttribute('src'),/TS-OC/,'Selective direct route');
 await page.close();
}finally{await browser.close()}

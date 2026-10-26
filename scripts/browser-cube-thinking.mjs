import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
const base=process.env.SKILLUP_TEST_URL||'http://127.0.0.1:4173';
fs.mkdirSync('cube-previews',{recursive:true});
const browser=await chromium.launch({headless:true});
try{
 for(const environment of ['selective','oc']){
  for(const screen of ['desktop','mobile']){
   const mobile=screen==='mobile';
   const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1360,height:980},deviceScaleFactor:1});
   const errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const query=new URLSearchParams({stream:'thinking',topic:'cube'});
   if(environment==='oc')query.set('exam','oc');
   const response=await page.goto(base+'/selective-practice.html?'+query.toString(),{waitUntil:'domcontentloaded',timeout:25000});
   assert.equal(response.status(),200,'Page HTTP status');
   await page.locator('#questionFigure').waitFor({state:'visible',timeout:13000});
   assert.ok((await page.locator('#badge').innerText()).includes('Cube'),'Wrong question topic');
   const obj=await page.locator('#questionImage').evaluate(img=>({
      loaded:img.complete&&img.naturalWidth>0,
      src:img.getAttribute('src'),
      alt:img.alt,
      width:img.getBoundingClientRect().width,
      screen:document.documentElement.clientWidth
   }));
   assert.ok(obj.loaded,'Cube SVG failed to load');
   assert.match(obj.src,mobile?/TS-CUBE-\d{3}-mobile\.svg$/:/TS-CUBE-\d{3}\.svg$/);
   assert.ok(obj.width<=obj.screen+2,'Diagram overflows viewport');
   assert.ok(obj.alt.length>60,'Alt text absent');
   assert.equal(await page.locator('#questionFigure .visual-full-link').getAttribute('href'),obj.src);
   await page.locator('#questionFigure').screenshot({path:'cube-previews/'+environment+'-'+screen+'.png',animations:'disabled'});
   const record=await page.evaluate(src=>window.SKILLUP_VISUAL.questions.find(q=>q.image===src||q.imageMobile===src),obj.src);
   assert.ok(record,'Question not in bank');
   await page.locator('#answers button').filter({hasText:new RegExp('^'+record.answer+'$')}).click();
   await page.locator('#check').click();
   assert.match(await page.locator('#feedback').innerText(),/Correct/);
   assert.ok(await page.locator('#cubeExplanation').isVisible(),'Worked explanation not shown');
   assert.ok((await page.locator('#cubeExplanation').innerText()).length>60);
   await page.locator('#next').click();
   assert.ok(await page.locator('#cubeExplanation').isHidden(),'Explanation not cleared between questions');
   // Real mock should retain cube figures.
   await page.locator('.top-tabs button[data-view="mock"]').click();
   await page.locator('#startMock').click();
   await page.locator('#mockQuestionFigure').waitFor({state:'visible',timeout:12000});
   assert.match(await page.locator('#mockQuestionImage').getAttribute('src'),/TS-CUBE-\d{3}(-mobile)?\.svg$/);
   if(environment==='selective'&&!mobile){
    await page.locator('#mockQuestionFigure').screenshot({path:'cube-previews/mock-desktop.png',animations:'disabled'});
    for(let i=0;i<30;i++)await page.locator('#mockNext').click();
    await page.locator('#mockResult').waitFor({state:'visible',timeout:12000});
    assert.equal(await page.locator('#mockReview img.review-figure').count(),30,'Review figures missing');
    assert.equal(await page.locator('#mockReview .cube-review-explanation').count(),30,'Worked reviews missing');
    await page.locator('#mockReview details').first().scrollIntoViewIfNeeded();
    await page.locator('#mockReview details').first().click();
    await page.locator('#mockReview details').first().screenshot({path:'cube-previews/review-desktop.png',animations:'disabled'});
   }
   assert.deepEqual(errors,[],'Browser errors');
   console.log(environment,screen,'passed',obj.src);
   await page.close();
  }
 }
}finally{await browser.close()}

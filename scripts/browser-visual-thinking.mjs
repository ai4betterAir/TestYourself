import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
const base=process.env.SKILLUP_TEST_URL||'http://127.0.0.1:4173';
fs.mkdirSync('visual-previews',{recursive:true});
const browser=await chromium.launch({headless:true});
try {
  for (const cfg of [{label:'desktop',width:1320,height:940},{label:'mobile',width:390,height:844}]){
    const page=await browser.newPage({viewport:{width:cfg.width,height:cfg.height},deviceScaleFactor:1});
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    const response=await page.goto(base+'/selective-practice.html?stream=thinking',{waitUntil:'domcontentloaded',timeout:22000});
    assert.equal(response.status(),200,'Selective page should load');
    const topic=page.locator('#topics button').filter({hasText:'Visual Reasoning'});
    await topic.waitFor({state:'visible',timeout:12000});
    await topic.click();
    await page.locator('#questionFigure').waitFor({state:'visible',timeout:12000});
    const info=await page.locator('#questionImage').evaluate(img=>({loaded:img.complete&&img.naturalWidth>0,src:img.getAttribute('src'),alt:img.alt,width:img.getBoundingClientRect().width,viewport:document.documentElement.clientWidth}));
    assert.ok(info.loaded,'Visual SVG failed to load');
    assert.ok(info.src.startsWith('assets/selective/thinking/TS-VIS-'),'Question did not use local SVG');
    assert.ok(info.alt.length>=45,'Missing accessible description');
    assert.ok(info.width <= info.viewport,'Image exceeds viewport width');
    const zoomHref=await page.locator('#questionFigure .visual-full-link').getAttribute('href');
    assert.equal(zoomHref,info.src,'Zoom link must open the full-resolution SVG');
    await page.locator('#questionFigure').screenshot({path:'visual-previews/practice-'+cfg.label+'.png',animations:'disabled'});
    if(cfg.label==='desktop'){
      const q=await page.evaluate((src)=>window.SKILLUP_VISUAL.questions.find(v=>v.image===src),info.src);
      assert.ok(q,'Current SVG must have a bank record');
      await page.locator('#answers button').filter({hasText:new RegExp('^'+q.answer+'$')}).click();
      await page.locator('#check').click();
      assert.ok((await page.locator('#feedback').innerText()).includes('Correct'),'Practice answer scoring broken');
      await page.locator('.top-tabs button[data-view="mock"]').click();
      await page.locator('#startMock').click();
      await page.locator('#mockQuestionFigure').waitFor({state:'visible',timeout:10000});
      const mockSrc=await page.locator('#mockQuestionImage').getAttribute('src');
      assert.ok(mockSrc.includes('TS-VIS-'),'Visual-only mock should show SVG');
      await page.locator('#mockQuestionFigure').screenshot({path:'visual-previews/mock-desktop.png',animations:'disabled'});
      for(let k=0;k<30;k++)await page.locator('#mockNext').click();
      await page.locator('#mockResult').waitFor({state:'visible',timeout:10000});
      const count=await page.locator('#mockReview .review-figure').count();
      assert.equal(count,30,'All missed mock questions should retain diagrams');
      await page.locator('#mockResult').screenshot({path:'visual-previews/review-desktop.png',animations:'disabled'});
    }
    assert.equal(errors.length,0,'Browser console errors: '+errors.join('; '));
    console.log(cfg.label+' visual practice passed');
    await page.close();
  }
  // Deep links work for both examination pathways without topic-click prerequisites.
  for(const url of [
    '/selective-practice.html?stream=thinking&topic=visual',
    '/selective-practice.html?exam=oc&stream=thinking&topic=visual'
  ]){
    const page=await browser.newPage({viewport:{width:1000,height:800}});
    await page.goto(base+url,{waitUntil:'domcontentloaded',timeout:20000});
    await page.locator('#questionFigure').waitFor({state:'visible',timeout:12000});
    const loaded=await page.locator('#questionImage').evaluate(el=>el.complete&&el.naturalWidth>0);
    assert.ok(loaded,'Visual direct link failed for '+url);
    await page.close();
  }
}finally{await browser.close()}

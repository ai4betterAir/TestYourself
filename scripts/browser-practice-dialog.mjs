import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';

const origin='http://127.0.0.1:4173';
fs.mkdirSync('practice-dialog-previews',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});

async function verifyOpen(page,expectVisual=true){
 const dialog=page.locator('#practiceDialog');
 await dialog.waitFor({state:'visible',timeout:15000});
 assert.equal(await dialog.evaluate(el=>el.open),true,'Native fullscreen dialog should be open');
 assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('practice-dialog-active')),true);
 assert.equal(await page.locator('#backToTopics').isVisible(),true,'Close button must remain visible');
 const bounds=await page.evaluate(()=>{
   const dialog=document.querySelector('#practiceDialog').getBoundingClientRect();
   const close=document.querySelector('#backToTopics').getBoundingClientRect();
   const scroller=document.querySelector('#practiceDialogScroll');
   const question=document.querySelector('#question').getBoundingClientRect();
   return {dialog:{top:dialog.top,height:dialog.height,width:dialog.width},
    close:{top:close.top,right:close.right,bottom:close.bottom},
    question:{top:question.top},
    viewport:{width:innerWidth,height:innerHeight},
    scroller:{scrollTop:scroller.scrollTop,clientHeight:scroller.clientHeight,scrollHeight:scroller.scrollHeight},
    docWidth:document.documentElement.scrollWidth};
 });
 assert.ok(Math.abs(bounds.dialog.top)<3,'Dialog must open at top of browser, not below the fold');
 assert.ok(Math.abs(bounds.dialog.height-bounds.viewport.height)<3,'Dialog must fill viewport');
 assert.ok(bounds.close.top>=0&&bounds.close.bottom<bounds.viewport.height,'Close must be visible without scrolling');
 assert.ok(bounds.close.right<=bounds.viewport.width+1,'Close should not overflow right');
 assert.ok(bounds.question.top<bounds.viewport.height-50,'Question should appear immediately on opening');
 assert.equal(bounds.scroller.scrollTop,0,'Question scroller should start at top');
 if(expectVisual){
   const img=await page.locator('#questionImage').evaluate(el=>({src:el.getAttribute('src'),loaded:el.complete&&el.naturalWidth>0}));
   assert.ok(img.loaded,'SVG should be loaded inside dialog');
   assert.ok(img.src.includes('assets/selective/thinking/'),'Expected original visual question');
   assert.ok(await page.locator('#practiceDialog .visual-problem').count(),'Diagram questions should have compact two-column layout');
 }else{
   assert.equal(await page.locator('#questionFigure').isHidden(),true);
 }
 return bounds;
}
try{
 for(const exam of ['selective','oc']){
   for(const mobile of [false,true]){
     const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1320,height:900},deviceScaleFactor:1});
     const errors=[];page.on('pageerror',e=>errors.push(e.stack||e.message));
     const prefix=exam==='oc'?'exam=oc&':'';
     await page.goto(origin+'/selective-practice.html?'+prefix+'stream=thinking',{waitUntil:'domcontentloaded'});
     const button=page.locator('#topics button[data-topic="ocfigures"]');
     await button.scrollIntoViewIfNeeded();
     const before=await page.evaluate(()=>scrollY);
     await button.click();
     const bounds=await verifyOpen(page,true);
     assert.equal(new URL(page.url()).searchParams.get('topic'),'ocfigures');
     const screenshot='practice-dialog-previews/'+exam+'-'+(mobile?'mobile':'desktop')+'.png';
     await page.screenshot({path:screenshot,animations:'disabled'});
     const bank=await page.locator('#questionImage').getAttribute('src');
     const q=await page.evaluate(src=>window.SKILLUP_VISUAL.questions.find(q=>q.image===src||q.imageMobile===src),bank);
     assert.ok(q,'Original image question must resolve from source bank');
     await page.locator('#answers button').filter({hasText:q.answer,exact:true}).click();
     await page.locator('#check').click();
     assert.match(await page.locator('#feedback').innerText(),/Correct/);
     assert.equal(await page.locator('#cubeExplanation').isVisible(),true);
     if(bounds.scroller.scrollHeight>bounds.scroller.clientHeight+50){
       await page.locator('#practiceDialogScroll').evaluate(el=>el.scrollTop=el.scrollHeight);
       assert.ok(await page.locator('#practiceDialogScroll').evaluate(el=>el.scrollTop)>0,'Need test internal scroll');
     }
     await page.locator('#next').click();
     assert.equal(await page.locator('#practiceDialogScroll').evaluate(el=>el.scrollTop),0,'Next question must reset to top');
     assert.match(await page.locator('#practiceDialogProgress').innerText(),/Question 2 of 30/);
     await page.locator('#backToTopics').click();
     assert.equal(await page.locator('#practiceDialog').evaluate(el=>el.open),false,'Close button did not close dialog');
     assert.equal(await page.locator('#topics button[data-topic="ocfigures"]').isVisible(),true);
     const after=await page.evaluate(()=>scrollY);
     assert.ok(Math.abs(after-before)<22,'Scroll location did not restore: '+before+' vs '+after);
     assert.equal(await page.locator('body').evaluate(el=>el.classList.contains('practice-dialog-active')),false);
     const focus=await page.evaluate(()=>document.activeElement?.dataset.topic);
     assert.equal(focus,'ocfigures','Focus should return to original topic button');
     await page.locator('#topics button[data-topic="symmetry"]').click();
     await verifyOpen(page,true);
     await page.keyboard.press('Escape');
     await page.waitForTimeout(60);
     assert.equal(await page.locator('#practiceDialog').evaluate(el=>el.open),false,'Escape did not close');
     await page.locator('#topics button[data-topic="logic"]').click();
     await verifyOpen(page,false);
     await page.locator('#backToTopics').click();
     assert.deepEqual(errors,[],'Browser page errors for '+exam+'/'+mobile);
     console.log('PASS fullscreen practice, Close, Escape, focus, next scroll and logical/visual switch:',exam,mobile?'mobile':'desktop');
     await page.close();
   }
   const deep=await browser.newPage({viewport:{width:1200,height:880}});
   await deep.goto(origin+'/selective-practice.html?'+(exam==='oc'?'exam=oc&':'')+'stream=thinking&topic=ocfigures',{waitUntil:'domcontentloaded'});
   await verifyOpen(deep,true);
   await deep.locator('#backToTopics').click();
   assert.equal(await deep.locator('#topics button[data-topic="ocfigures"]').getAttribute('aria-pressed'),'true');
   await deep.close();
 }
 for(const stream of ['math','reading']){
   const page=await browser.newPage({viewport:{width:1100,height:790}});
   await page.goto(origin+'/selective-practice.html?stream='+stream,{waitUntil:'domcontentloaded'});
   await page.locator('#topics button[data-topic="mixed"]').click();
   await verifyOpen(page,false);
   await page.locator('#backToTopics').click();
   assert.equal(await page.locator('#practiceDialog').evaluate(el=>el.open),false);
   await page.close();
 }
 const mock=await browser.newPage({viewport:{width:1150,height:820}});
 await mock.goto(origin+'/selective-practice.html?stream=thinking&view=mock',{waitUntil:'domcontentloaded'});
 assert.equal(await mock.locator('#mockView').isVisible(),true);
 assert.equal(await mock.locator('#practiceDialog').evaluate(el=>el.open),false);
 await mock.close();
 console.log('PASS all standalone and deep-linked practice entry points.');
}finally{await browser.close()}

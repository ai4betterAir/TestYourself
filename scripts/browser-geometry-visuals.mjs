import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
const origin='http://127.0.0.1:4173';
fs.mkdirSync('geometry-previews',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const samples=[
 {year:'1',topic:'shapes2d'},
 {year:'2',topic:'g2geometry'},
 {year:'3',topic:'perimeter'},
 {year:'4',topic:'geometry'},
 {year:'5',topic:'geometry'},
 {year:'6',topic:'geometry'},
 {year:'5',topic:'angles'},
 {year:'5',topic:'perimeterarea'},
 {year:'5',topic:'volume'}
];
async function checkImg(page,selector){
 const img=page.locator(selector+' img');
 await img.waitFor({state:'visible',timeout:15000});
 const o=await img.evaluate(x=>({loaded:x.complete&&x.naturalWidth>0,
  src:x.getAttribute('src'),alt:x.alt,
  width:x.getBoundingClientRect().width,
  viewport:document.documentElement.clientWidth}));
 assert.ok(o.loaded,`Diagram did not load ${selector}: ${o.src?.slice(0,50)}`);
 assert.ok(o.src.startsWith('data:image/svg+xml;charset=UTF-8,'));
 assert.ok(o.alt.length>20);
 assert.ok(o.width<=o.viewport+3,'Image too wide on mobile');
 return o;
}
try{
 for(const s of samples){
  for(const mobile of [false,true]){
   if(mobile && !['1','5','6'].includes(s.year))continue;
   const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1250,height:900}});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.addInitScript((g)=>{
     localStorage.setItem('tyProfile',JSON.stringify({grade:g,studentName:'Geometry Tester'}));
   },s.year);
   const url=`${origin}/practice.html?year=${s.year}&topic=${s.topic}`;
   const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
   assert.equal(response.status(),200);
   await page.locator('#learnPanel').waitFor({state:'visible',timeout:15000});
   const selectedGrade=await page.locator('#gradeSelect').inputValue();
   assert.equal(selectedGrade,s.year,'Year= deep link ignored');
   await checkImg(page,'#guidedGeometryFigure');
   await page.locator('#startPractice').click();
   await page.locator('#quiz').waitFor({state:'visible'});
   await checkImg(page,'#practiceGeometryFigure');
   const question=await page.evaluate(()=>questions[idx]);
   assert.ok(question.diagramSvg);
   await page.locator('#answerChoices button').filter({hasText:question.answer,exact:true}).click();
   await page.locator('#checkAnswer').click();
   assert.match(await page.locator('#practiceFeedback').innerText(),/Correct/);
   await page.locator('#explainBtn').click();
   assert.ok(await page.locator('#explainBox').isVisible());
   if(s.year==='5' && s.topic==='geometry'){
     await page.locator('#practiceGeometryFigure').screenshot({path:'geometry-previews/year5-geometry-'+(mobile?'mobile':'desktop')+'.png',animations:'disabled'});
     await page.locator('.mode-tab[data-mode="test"]').click();
     await page.locator('#testScope').selectOption('specific');
     await page.locator('#startTestBtn').click();
     await page.locator('#testBody').waitFor({state:'visible'});
     await checkImg(page,'#testGeometryFigure');
     await page.locator('#testGeometryFigure').screenshot({path:'geometry-previews/year5-test-'+(mobile?'mobile':'desktop')+'.png',animations:'disabled'});
     if(!mobile){
       for(let i=0;i<20;i++)await page.locator('#testNext').click();
       await page.locator('#testResult').waitFor({state:'visible'});
       assert.equal(await page.locator('#answerReview .geometry-diagram').count(),20);
       assert.equal(await page.locator('#answerReview .geometry-review-explanation').count(),20);
     }
   }
   if(s.year==='1'&&s.topic==='shapes2d'&&!mobile){
     await page.locator('#practiceGeometryFigure').screenshot({path:'geometry-previews/year1-shapes-desktop.png',animations:'disabled'});
   }
   assert.deepEqual(errors,[],`Browser errors ${s.year}/${s.topic}`);
   console.log('Passed visual geometry',s.year,s.topic,mobile?'mobile':'desktop');
   await page.close();
  }
 }
 const p=await browser.newPage({viewport:{width:1000,height:780}});
 await p.addInitScript(()=>localStorage.setItem('tyProfile',JSON.stringify({grade:'5',studentName:'Student'})));
 await p.goto(origin+'/practice.html?year=5&topic=fractions',{waitUntil:'domcontentloaded'});
 await p.locator('#startPractice').click();
 assert.ok(await p.locator('#practiceGeometryFigure').isHidden(),'Non-geometry question unexpectedly illustrates geometry');
 await p.close();
}finally{await browser.close()}

import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
const root='http://127.0.0.1:4173';
const cases=[
 ['geometry','desktop'],['geometry','mobile'],
 ['y6angles','desktop'],['y6polygons','desktop'],
 ['y6composite','desktop'],['y6nets','desktop'],['y6nets','mobile'],
 ['y6blocks','desktop'],['y6surface','desktop'],['coordinates','mobile']
];
fs.mkdirSync('year6-geometry-previews',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
try{
 for(const [topic,screen] of cases){
  const page=await browser.newPage({viewport:screen==='mobile'?{width:390,height:844}:{width:1260,height:880}});
  const errors=[];page.on('pageerror',e=>errors.push(e.stack||e.message));
  await page.addInitScript(()=>localStorage.setItem('tyProfile',JSON.stringify({studentName:'Geometry Tester',grade:'6'})));
  const response=await page.goto(root+'/practice.html?year=6&topic='+topic,{waitUntil:'domcontentloaded',timeout:26000});
  assert.equal(response.status(),200);
  assert.equal(await page.locator('#gradeSelect').inputValue(),'6');
  await page.locator('#guidedGeometryFigure img').waitFor({state:'visible',timeout:13000});
  await page.locator('#startPractice').click();
  await page.locator('#practiceGeometryFigure img').waitFor({state:'visible',timeout:13000});
  const question=await page.evaluate(()=>questions[idx]);
  assert.ok(question.geometryFamily.startsWith('Year 6'),'Wrong question generation topic '+topic);
  const rendered=await page.locator('#practiceGeometryFigure img').evaluate(img=>({
   ready:img.complete&&img.naturalWidth>0,
   alt:img.alt, width:img.getBoundingClientRect().width,viewport:document.documentElement.clientWidth
  }));
  assert.ok(rendered.ready,'SVG did not render');
  assert.ok(rendered.width<=rendered.viewport+2,'SVG viewport overflow');
  assert.ok(rendered.alt.length>=35);
  await page.locator('#practiceGeometryFigure').scrollIntoViewIfNeeded();
  await page.locator('#practiceGeometryFigure').screenshot({path:'year6-geometry-previews/'+topic+'-'+screen+'.png',animations:'disabled'});
  await page.locator('#answerChoices button').filter({hasText:question.answer,exact:true}).click();
  await page.locator('#checkAnswer').click();
  assert.match(await page.locator('#practiceFeedback').innerText(),/Correct/);
  await page.locator('#explainBtn').click();
  assert.ok(await page.locator('#explainBox').isVisible(),'Explanation missing');
  if(topic==='geometry' && screen==='desktop'){
   await page.locator('.mode-tab[data-mode="test"]').click();
   await page.locator('#testScope').selectOption('specific');
   await page.locator('#startTestBtn').click();
   await page.locator('#testGeometryFigure img').waitFor({state:'visible',timeout:14000});
   for(let i=0;i<20;i++)await page.locator('#testNext').click();
   await page.locator('#testResult').waitFor({state:'visible'});
   assert.equal(await page.locator('#answerReview .geometry-diagram').count(),20,'Diagrams missing in answers');
  }
  assert.deepEqual(errors,[],'Browser errors '+topic);
  console.log('Browser passed Year 6',topic,screen);
  await page.close();
 }
}finally{await browser.close()}

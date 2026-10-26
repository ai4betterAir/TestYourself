import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
const origin='http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
fs.mkdirSync('science-studio-previews',{recursive:true});
try{
 for(const year of ['K','1','2','3','4','5','6']){
  for(const mobile of year==='3'?[false,true]:[false]){
   const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1360,height:900}});
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(origin+'/science.html?year='+year,{waitUntil:'domcontentloaded',timeout:30000});
   assert.equal(response.status(),200);
   await page.locator('#scienceTopicGrid .science-topic-card').first().waitFor({state:'visible',timeout:10000});
   assert.equal(await page.locator('#yearSelect').inputValue(),year);
   const values=await page.evaluate(()=>{
     const items=[...window.SKILLUP_SCIENCE[document.querySelector('#yearSelect').value],
       ...window.SKILLUP_SCIENCE_VISUALS.enrich(document.querySelector('#yearSelect').value)];
     return [...new Set(items.map(x=>x.topic))];
   });
   assert.equal(await page.locator('.science-topic-card').count(),values.length+1);
   const labels=await page.locator('.science-topic-card h3').allTextContents();
   assert.deepEqual(labels.slice(1),values);
   for(const [i,topic] of values.entries()){
     const link=await page.locator('.science-topic-card').nth(i+1).getAttribute('href');
     assert.ok(link.includes('topic='+encodeURIComponent(topic)),'Bad topic link '+year+'/'+topic);
   }
   const art=await page.locator('.topic-card-visual svg').first().count();
   assert.equal(art,1,'Missing original topic SVG');
   const size=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(size.scroll<=size.width+2,'Science hub overflows '+year);
   assert.equal(errors.length,0,'Browser errors '+errors.join(','));
   if(year==='3')await page.screenshot({path:'science-studio-previews/year3-topic-directory-'+(mobile?'mobile':'desktop')+'.png',animations:'disabled',fullPage:true});
   console.log('Science topic hub passed',year,mobile?'mobile':'desktop',values.length);
   await page.close();
  }
 }
 for(const mobile of [false,true]){
   const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1360,height:900}});
   const url=origin+'/science-practice.html?year=3&topic='+encodeURIComponent('Patterns in nature');
   await page.goto(url,{waitUntil:'domcontentloaded'});
   await page.locator('#questionFigure img').waitFor({state:'visible'});
   const dims=await page.evaluate(()=>({width:document.documentElement.clientWidth,scroll:document.documentElement.scrollWidth}));
   assert.ok(dims.scroll<=dims.width+2,'Practice page overflows screen');
   await page.screenshot({path:'science-studio-previews/year3-practice-full-'+(mobile?'mobile':'desktop')+'.png',animations:'disabled',fullPage:true});
   await page.close();
 }
}finally{await browser.close()}

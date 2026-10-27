import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
fs.mkdirSync('dynamic-question-previews',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const origin='http://127.0.0.1:4173';
try{
 for(const exam of ['selective','oc']){
  for(const mobile of [false,true]){
   const page=await browser.newPage({viewport:mobile?{width:390,height:844}:{width:1480,height:940}});
   const errors=[];page.on('pageerror',error=>errors.push(error.stack||error.message));
   await page.goto(origin+'/selective-practice.html?'+(exam==='oc'?'exam=oc&':'')+'stream=thinking&topic=time',{waitUntil:'domcontentloaded'});
   await page.locator('#practiceDialog').waitFor({state:'visible',timeout:13000});
   const meter=page.locator('#practiceDialogMeter');
   assert.equal(await meter.getAttribute('role'),'progressbar');
   assert.equal(await meter.getAttribute('aria-valuenow'),'1');
   assert.equal(await page.locator('#practiceDialogScore').innerText(),'0 correct');
   assert.equal(await page.locator('#answers button').count(),4);
   assert.deepEqual(await page.locator('#answers button').evaluateAll(elements=>elements.map(e=>e.dataset.key)),['1','2','3','4']);
   assert.equal(await page.locator('#check').isDisabled(),true,'No choice should disable Check Answer');
   const q=page.locator('#question');
   let meet=false;
   for(let tries=0;tries<40;tries++){
    const text=await q.innerText();
    if(/study group meets every \d+ days/.test(text)){
      meet=true;break;
    }
    await page.locator('#next').click();
   }
   assert.equal(meet,true,'Could not generate the illustrated scheduling question');
   const match=(await q.innerText()).match(/meets every (\d+) days.*the (\d+)(?:st|nd|rd|th) meeting/i);
   assert.ok(match,'Scheduling wording unexpected');
   assert.equal(await page.locator('#reasoningCue').isVisible(),true);
   assert.equal(await page.locator('.reasoning-stage').count(),Number(match[2]));
   assert.equal(await page.locator('.reasoning-step-connector').count(),Number(match[2])-1);
   assert.equal(await page.locator('.reasoning-step-connector').first().innerText(),'+'+match[1]+' d');
   assert.equal(await page.locator('.reasoning-stage-day').first().innerText(),'Monday');
   await page.locator('#practiceDialogScroll').evaluate(el=>el.scrollTop=0);
   await page.screenshot({path:'dynamic-question-previews/'+exam+'-scheduling-'+(mobile?'mobile':'desktop')+'.png',animations:'disabled'});
   const dims=await page.evaluate(()=>{
     const dialog=document.querySelector('#practiceDialog').getBoundingClientRect();
     const quiz=document.querySelector('#practiceDialog .quiz').getBoundingClientRect();
     const box=document.querySelector('#practiceDialog .quiz');
     const question=document.querySelector('#question').getBoundingClientRect();
     const cue=document.querySelector('#reasoningCue').getBoundingClientRect();
     const firstAnswer=document.querySelector('#answers button').getBoundingClientRect();
     return {viewport:innerWidth,dialogRight:dialog.right,quizRight:quiz.right,quizLeft:quiz.left,
       quizScrollLeft:box.scrollLeft,questionLeft:question.left,cueLeft:cue.left,firstAnswerLeft:firstAnswer.left,
       scroll:document.querySelector('#practiceDialogScroll').scrollWidth,client:document.querySelector('#practiceDialogScroll').clientWidth};
   });
   assert.ok(dims.dialogRight<=dims.viewport+2&&dims.quizRight<=dims.viewport+2,'Question overflow');
   assert.ok(dims.scroll<=dims.client+2,'Horizontal scroll in question panel');
   assert.equal(dims.quizScrollLeft,0,'Quiz must not scroll sideways after advancing questions');
   assert.ok(dims.questionLeft>=dims.quizLeft+8,'Question text is clipped on the left: '+JSON.stringify(dims));
   assert.ok(dims.cueLeft>=dims.quizLeft+8,'Illustrated timeline is clipped on the left: '+JSON.stringify(dims));
   assert.ok(dims.firstAnswerLeft>=dims.quizLeft+8,'Answer choices are clipped on the left: '+JSON.stringify(dims));
   assert.equal(await page.locator('#answers button').filter({hasText:'Option 4'}).count(),0,'Placeholder distractors should never appear');
   await page.keyboard.press('1');
   assert.equal(await page.locator('#answers button').first().getAttribute('aria-pressed'),'true');
   assert.equal(await page.locator('#check').isEnabled(),true);
   await page.keyboard.press('Enter');
   assert.equal(await page.locator('#check').isDisabled(),true,'After submitting, choice locked');
   const after=await page.locator('#feedback').innerText();
   assert.ok(/Correct|correct answer/i.test(after),'Submission feedback missing '+after);
   const classes=await page.locator('#feedback').getAttribute('class');
   assert.ok(/is-correct|is-wrong/.test(classes),'Submission feedback style absent');
   const firstValue=await page.locator('#answers button').first().getAttribute('aria-pressed');
   await page.keyboard.press('2');
   assert.equal(await page.locator('#answers button').first().getAttribute('aria-pressed'),firstValue,'Answered question should be locked');
   assert.match(await page.locator('#practiceDialogScore').innerText(),/1 correct|0 \/ 1 correct|1 \/ 1 correct/);
   await page.keyboard.press('Enter');
   assert.equal(await page.locator('#feedback').innerText(),'','Next question should clear feedback');
   assert.equal(await page.locator('#check').isDisabled(),true);
   const nextQuestion=await page.locator('#question').innerText();
   assert.equal(await page.locator('#reasoningCue').isVisible(),/meets? every \d+ days?/i.test(nextQuestion),'Timeline should show only for scheduling questions');
   await page.locator('#backToTopics').click();
   assert.equal(await page.locator('#practiceDialog').evaluate(el=>el.open),false);
   assert.deepEqual(errors,[],exam+' page JavaScript errors');
   console.log('PASS',exam,mobile?'mobile':'desktop','timeline, progress, keyboard, feedback and Close');
   await page.close();
  }
 }
 for(const topic of ['ocfigures','cube','logic']){
  const page=await browser.newPage({viewport:{width:1280,height:850}});
  await page.goto(origin+'/selective-practice.html?stream=thinking&topic='+topic,{waitUntil:'domcontentloaded'});
  await page.locator('#practiceDialog').waitFor({state:'visible'});
  assert.equal(await page.locator('#reasoningCue').isHidden(),true,'Other reasoning should not display a time chart');
  assert.equal(await page.locator('#answers button').count(),4);
  if(topic==='ocfigures'||topic==='cube'){
   assert.equal(await page.locator('#questionFigure').isVisible(),true);
   assert.equal(await page.locator('#practiceDialog .visual-problem').count(),1);
   await page.screenshot({path:'dynamic-question-previews/'+topic+'-desktop.png',animations:'disabled'});
  }
  const b=page.locator('#answers button').first();
  const value=await b.innerText();
  await b.click();
  assert.equal(await b.innerText(),value,'Choice visible text should remain unchanged');
  await page.locator('#check').click();
  assert.ok((await page.locator('#feedback').innerText()).length>5);
  await page.locator('#backToTopics').click();
  await page.close();
 }
}finally{await browser.close()}

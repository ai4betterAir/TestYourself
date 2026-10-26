import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';
const origin='http://127.0.0.1:4173';
fs.mkdirSync('home-photo-previews',{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});
const views=[
  {name:'desktop',width:1640,height:950,cols:7},
  {name:'wide',width:2528,height:980,cols:7},
  {name:'user-screenshot',width:1264,height:859,cols:7},
  {name:'laptop',width:1280,height:850,cols:7},
  {name:'tablet',width:810,height:1030,cols:4},
  {name:'mobile',width:390,height:844,cols:2}
];
try{
 for(const view of views){
  const page=await browser.newPage({viewport:{width:view.width,height:view.height},deviceScaleFactor:1});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.stack||e.message));
  const response=await page.goto(origin+'/index.html',{waitUntil:'domcontentloaded',timeout:30000});
  assert.equal(response.status(),200);
  await page.locator('#heroHeadline').waitFor({state:'visible'});
  assert.match(await page.locator('#heroHeadline').innerText(),/Build Skills/);
  assert.match(await page.locator('#heroHeadline').innerText(),/Brighter Tomorrow/);
  const image=page.locator('.hero-photo-illustration img');
  const src=await image.getAttribute('src');
  assert.ok(src.startsWith('https://images.pexels.com/photos/7634592/'),'Wrong photo');
  const photoLoaded=await image.evaluate(img=>new Promise(resolve=>{
    if(img.complete)return resolve(img.naturalWidth>100);
    img.addEventListener('load',()=>resolve(img.naturalWidth>100),{once:true});
    img.addEventListener('error',()=>resolve(false),{once:true});
  }));
  assert.ok(photoLoaded,'The hero photograph failed to load');
  const cards=page.locator('.grade-card');
  assert.equal(await cards.count(),7,'K–6 cards missing');
  const years=await cards.locator('b').allTextContents();
  assert.deepEqual(years,['Kindy','Year 1','Year 2','Year 3','Year 4','Year 5','Year 6']);
  const expected=['K','1','2','3','4','5','6'];
  for(let i=0;i<7;i++)assert.equal(await cards.nth(i).getAttribute('href'),'learning.html?year='+expected[i]);
  assert.equal(await page.locator('.hero-actions .button-primary').getAttribute('href'),'#grades');
  assert.equal(await page.locator('.nav-actions .link-signin').getAttribute('href'),'sign-in.html');
  assert.equal(await page.locator('.nav-actions .link-signup').getAttribute('href'),'sign-up.html');
  assert.ok(await page.locator('#pathways').count(),'Tests navigation lacks target');
  const layout=await page.evaluate(()=>{
    const rect=e=>{const r=e.getBoundingClientRect();return {width:r.width,height:r.height,top:r.top,x:r.x}};
    const first=document.querySelector('.grade-card'),second=document.querySelectorAll('.grade-card')[1];
    return {
      viewport:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,
      hero:rect(document.querySelector('.hero-photo-home')),
      cards:rect(document.querySelector('.grade-grid')),
      gradeShell:rect(document.querySelector('.grade-section>.shell')),
      navShell:rect(document.querySelector('.nav-shell')),
      pathShell:rect(document.querySelector('#pathways .shell')),
      photo:rect(document.querySelector('.hero-photo-illustration')),
      first:rect(first),second:rect(second),
      header:rect(document.querySelector('.site-header'))
    };
  });
  assert.ok(layout.scrollWidth<=layout.viewport+2,'Horizontal overflow '+view.name+': '+JSON.stringify(layout));
  assert.ok(layout.hero.height>=430,'Hero collapsed '+view.name);
  assert.ok(layout.first.width>=135,'Card unreadable '+view.name);
  const shellRatio=layout.gradeShell.width/layout.viewport;
  assert.ok(shellRatio>=.88,'Grade section too narrow at '+view.name+' ratio='+shellRatio);
  if(view.width>1150){
    assert.ok(layout.pathShell.width/layout.viewport>.88,'Pathway cards leave a large unused right side');
    assert.ok(layout.navShell.width/layout.viewport>.88,'Navigation does not span the layout');
  }
  if(view.name==='desktop'||view.name==='laptop')assert.ok(Math.abs(layout.first.top-layout.second.top)<4,'Year cards should be on one row');
  if(view.name==='mobile')assert.ok(Math.abs(layout.first.top-layout.second.top)<4,'Mobile should have 2 cards per row');
  if(view.name==='mobile'){
    await page.locator('#navToggle').click();
    assert.equal(await page.locator('#navToggle').getAttribute('aria-expanded'),'true','Mobile menu did not open');
    assert.ok(await page.locator('.main-nav a[href="practice.html"]').isVisible(),'Mobile navigation missing');
    await page.locator('#navToggle').click();
  }
  // Capture the live first impression before scrolling down to the cards.
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.screenshot({path:'home-photo-previews/'+view.name+'-hero.png',animations:'disabled'});
  await page.locator('#grades').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({path:'home-photo-previews/'+view.name+'.png',animations:'disabled'});
  // Scroll all sections before full-page capture so optional reveal animations have run.
  if(view.name==='desktop'){
    await page.evaluate(async()=>{
      for(let y=0;y<document.documentElement.scrollHeight;y+=450){window.scrollTo(0,y);await new Promise(resolve=>setTimeout(resolve,55));}
      window.scrollTo(0,0);
    });
    await page.waitForTimeout(300);
    await page.screenshot({path:'home-photo-previews/desktop-full.png',animations:'disabled',fullPage:true});
  }
  console.log('Passed homepage',view.name,'photo:',src,'size:',layout.hero.height,'grade columns first-row correct');
  assert.equal(errors.length,0,'Browser JS errors '+view.name+': '+errors.join('\n'));
  await page.close();
 }
}finally{await browser.close()}

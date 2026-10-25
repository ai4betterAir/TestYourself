import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base = process.env.SKILLUP_TEST_URL || 'http://127.0.0.1:4173';
const root = process.cwd();
fs.mkdirSync(path.join(root, 'homepage-preview'), {recursive: true});
const browser = await chromium.launch({headless: true});
let failures = [];
try {
  const desktop = await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
  const response = await desktop.goto(base+'/index.html',{waitUntil:'domcontentloaded',timeout:20000});
  if(!response?.ok()) failures.push('Homepage HTTP '+response?.status());
  await desktop.locator('.year-card').first().waitFor();
  const headline = await desktop.locator('h1').innerText();
  if(!headline.includes('Small steps.') || !headline.includes('Brighter futures.')) failures.push('Hero heading absent');
  if(await desktop.locator('.year-card').count() !== 7) failures.push('Expected seven year links');
  if(await desktop.locator('.subject-card').count() !== 6) failures.push('Expected six subject pathways');
  if(await desktop.locator('.path-card').count() !== 3) failures.push('Expected three test pathways');
  const missing = await desktop.locator('a[href]').evaluateAll(nodes => nodes.filter(a => !a.getAttribute('href')?.trim()).map(a=>a.outerHTML));
  if(missing.length) failures.push('Empty links: '+missing.length);
  await desktop.locator('#subjectYear').selectOption('5');
  const href = await desktop.locator('[data-subject="maths"]').getAttribute('href');
  if(href !== 'subject.html?year=5&subject=maths') failures.push('Year selection did not update Maths link');
  await desktop.locator('#subjectYear').selectOption('K');
  const kindy = await desktop.locator('[data-subject="science"]').getAttribute('href');
  if(kindy !== 'subject.html?year=K&subject=science') failures.push('Kindergarten year selection failed');
  await desktop.locator('#subjectYear').selectOption('');
  await desktop.screenshot({path:'homepage-preview/desktop.png',fullPage:true,animations:'disabled'});
  const mobile = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
  const mobileResponse = await mobile.goto(base+'/index.html',{waitUntil:'domcontentloaded',timeout:20000});
  if(!mobileResponse?.ok()) failures.push('Mobile homepage HTTP '+mobileResponse?.status());
  await mobile.locator('.year-card').first().waitFor();
  const menu=mobile.locator('#mobileMenu');
  if(!await menu.isVisible()) failures.push('Mobile menu button invisible');
  else {
    await menu.click();
    if(!await mobile.locator('#main-nav').isVisible()) failures.push('Mobile menu did not open');
    await mobile.keyboard.press('Escape');
    if(await mobile.locator('#main-nav').isVisible()) failures.push('Mobile menu did not close on Escape');
  }
  const overflow=await mobile.evaluate(()=>document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if(overflow>2) failures.push('Mobile horizontal overflow: '+overflow+'px');
  await mobile.screenshot({path:'homepage-preview/mobile.png',fullPage:true,animations:'disabled'});
  console.log('Homepage screenshots saved to homepage-preview/.');
  await desktop.close();await mobile.close();
} finally {await browser.close();}
if(failures.length){console.error('Homepage checks failed:\n'+failures.join('\n'));process.exit(1);}
console.log('✓ Homepage desktop/mobile, pathways and year-specific subject links passed.');

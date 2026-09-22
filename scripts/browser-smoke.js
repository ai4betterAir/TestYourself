import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = process.env.SKILLUP_TEST_URL || 'http://127.0.0.1:4173';
const pages = fs.readdirSync(root).filter(file => file.endsWith('.html'));
const failures = [];
const browser = await chromium.launch({headless: true});

async function visit(context, file) {
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const response = await page.goto(`${base}/${file}`, {waitUntil: 'networkidle'});
  if (!response?.ok()) failures.push(`${file}: HTTP ${response?.status()}`);
  if (errors.length) failures.push(`${file}: ${errors.join(' | ')}`);
  return page;
}

const desktop = await browser.newContext({viewport: {width: 1280, height: 900}});
for (const file of pages) {
  const page = await visit(desktop, file);
  await page.close();
}
await desktop.close();

for (const device of [
  {name: 'small mobile', viewport: {width: 360, height: 740}, isMobile: true},
  {name: 'large mobile', viewport: {width: 430, height: 932}, isMobile: true},
  {name: 'tablet', viewport: {width: 768, height: 1024}, isMobile: true}
]) {
  const mobile = await browser.newContext({viewport: device.viewport, isMobile: device.isMobile});
  for (const file of pages) {
    const page = await visit(mobile, file);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 2) failures.push(`${file}: ${device.name} has ${overflow}px horizontal overflow`);
    const nav = page.locator('body > header nav').first();
    if (await nav.count()) {
      const menu = page.locator('.site-menu-button, .home-menu-btn, .menu-toggle, .course-menu').first();
      if (!await menu.count() || !await menu.isVisible()) {
        failures.push(`${file}: ${device.name} menu button is not visible`);
      } else {
        await menu.click();
        if (!await nav.isVisible()) failures.push(`${file}: ${device.name} navigation did not open`);
        await page.keyboard.press('Escape');
        if (await nav.isVisible()) failures.push(`${file}: ${device.name} navigation did not close with Escape`);
      }
    }
    await page.close();
  }
  await mobile.close();
}

const interaction = await browser.newContext({viewport: {width: 1100, height: 900}});
{
  const page = await visit(interaction, 'english-practice.html?grade=4&skill=reading');
  await page.locator('.english-test-launch').click();
  if (!await page.locator('.english-test-panel').isVisible()) failures.push('english-practice.html: year test did not open');
  if ((await page.locator('#englishTestCount').textContent()) !== 'Question 1 of 20') failures.push('english-practice.html: year test does not contain 20 questions');
  await page.close();
}

for (const file of ['vocabulary-year1-stories.html','vocabulary-year2.html','vocabulary-year3.html','vocabulary-year4.html','vocabulary-year4-reading.html','vocabulary-year5.html','vocabulary-year6.html']) {
  const page = await visit(interaction, file);
  let dialog = '';
  page.on('dialog', async event => { dialog = event.message(); await event.dismiss(); });
  await page.locator('.vocabulary-test-launch').click();
  await page.waitForTimeout(30);
  if (dialog) failures.push(`${file}: ${dialog}`);
  else if (!await page.locator('#vocabularyYearTest').isVisible()) failures.push(`${file}: year test did not open`);
  else if ((await page.locator('#vocabularyTestCount').textContent()) !== 'Question 1 of 20') failures.push(`${file}: year test does not contain 20 questions`);
  await page.close();
}
await interaction.close();
await browser.close();

if (failures.length) {
  console.error(`Browser smoke test failed with ${failures.length} issue(s):`);
  failures.forEach(failure => console.error(` - ${failure}`));
  process.exit(1);
}
console.log(`✓ Browser smoke test passed for ${pages.length} desktop pages, three responsive sizes, English testing and seven Vocabulary tests.`);

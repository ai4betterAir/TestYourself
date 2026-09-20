import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skip = new Set(['node_modules', '.git']);
const errors = [];
const warnings = [];

function walk(directory) {
  return fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
    if (skip.has(entry.name)) return [];
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  });
}

const files = walk(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));
const jsFiles = files.filter(file => file.endsWith('.js') && !file.includes(`${path.sep}scripts${path.sep}`));

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(root, file);
  const internalAsset = relative.startsWith(`assets${path.sep}`);
  const nestedExample = relative.startsWith(`YR5${path.sep}`);
  const ids = [...html.matchAll(/\sid=["']([^"']+)["']/g)].map(match => match[1]);
  const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
  if (duplicates.length) errors.push(`${relative}: duplicate id(s): ${duplicates.join(', ')}`);

  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    let url = match[1];
    if (!url || url.startsWith('#') || /^(https?:|mailto:|tel:|data:|javascript:)/.test(url)) continue;
    url = url.split('#')[0].split('?')[0];
    if (!url) continue;
    const target = path.resolve(path.dirname(file), url);
    if (!fs.existsSync(target)) errors.push(`${relative}: missing local target ${match[1]}`);
  }

  const visibleBrandText = html
    .replaceAll('https://ai4betterair.github.io/TestYourself/', '')
    .replaceAll('https://github.com/ai4betterAir/TestYourself', '');
  if (/TestYourself|Test Yourself/.test(visibleBrandText) && !internalAsset) {
    errors.push(`${relative}: legacy TestYourself branding remains`);
  }

  if (!internalAsset && !nestedExample) {
    if (!/<meta\s+name=["']description["']/i.test(html)) warnings.push(`${relative}: missing meta description`);
    if (!/<link\s+rel=["']icon["']/i.test(html)) warnings.push(`${relative}: missing favicon`);
    if (!/<link\s+rel=["']apple-touch-icon["']/i.test(html)) warnings.push(`${relative}: missing Apple touch icon`);
    if (!/<link\s+rel=["']manifest["']/i.test(html)) warnings.push(`${relative}: missing web manifest`);
    if (!/<meta\s+property=["']og:image["']/i.test(html)) warnings.push(`${relative}: missing social sharing image`);
    if (!/<meta\s+name=["']twitter:card["']/i.test(html)) warnings.push(`${relative}: missing Twitter/X sharing metadata`);
    if (!/js\/site-shell\.js/.test(html)) warnings.push(`${relative}: shared accessibility and mobile shell is missing`);
  }
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'site.webmanifest'), 'utf8'));
for (const size of ['192x192', '512x512']) {
  const icon = manifest.icons?.find(item => item.sizes === size);
  if (!icon || !fs.existsSync(path.join(root, icon.src))) errors.push(`site.webmanifest: missing ${size} install icon`);
}

const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const file of fs.readdirSync(root).filter(file => {
  if (!file.endsWith('.html') || file === '404.html') return false;
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  return !/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html);
})) {
  const url = file === 'index.html' ? 'https://ai4betterair.github.io/TestYourself/' : `https://ai4betterair.github.io/TestYourself/${file}`;
  if (!sitemap.includes(`<loc>${url}</loc>`)) errors.push(`sitemap.xml: missing ${file}`);
}

for (const file of jsFiles) {
  const check = spawnSync(process.execPath, ['--check', file], {encoding: 'utf8'});
  if (check.status !== 0) errors.push(`${path.relative(root, file)}: JavaScript syntax error\n${check.stderr}`);
}

console.log(`Checked ${htmlFiles.length} HTML files and ${jsFiles.length} JavaScript files.`);
if (warnings.length) {
  console.log('\nWarnings:');
  warnings.forEach(warning => console.log(` - ${warning}`));
}
if (errors.length) {
  console.error('\nErrors:');
  errors.forEach(error => console.error(` - ${error}`));
  process.exit(1);
}
console.log('\n✓ Links, branding, metadata and JavaScript syntax passed.');

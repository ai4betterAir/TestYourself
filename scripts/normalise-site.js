import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const root = path.resolve(__dirname, '..');
const pages = fs.readdirSync(root).filter(file => file.endsWith('.html'));

const descriptions = {
  'algebra.html': 'SkillUP algebra practice with age-appropriate equations, hints and feedback.',
  'english-year1-reading.html': 'SkillUP Year 1 reading passages with vocabulary and comprehension practice.',
  'english-year2-reading.html': 'SkillUP Year 2 reading passages with vocabulary, sequencing and inference questions.',
  'practice.html': 'SkillUP Maths for Kindergarten to Year 6 with lessons, practice and timed tests.',
  'selective-practice.html': 'SkillUP Selective preparation with mathematical reasoning, thinking skills, reading and timed mock tests.',
  'vocabulary-year1-stories.html': 'SkillUP Year 1 vocabulary stories with word meanings and child-friendly practice.',
  'vocabulary-year2.html': 'SkillUP Year 2 vocabulary lessons with meanings, context, spelling and mixed practice.',
  'vocabulary-year3.html': 'SkillUP Year 3 vocabulary learning, practice and timed testing.',
  'vocabulary-year3-complete.html': 'SkillUP Year 3 complete vocabulary library with 240 words and interactive practice.',
  'vocabulary-year4.html': 'SkillUP Year 4 vocabulary learning, practice, reading vocabulary and timed testing.',
  'vocabulary-year4-complete.html': 'SkillUP Year 4 complete vocabulary library with 240 words and interactive revision.',
  'vocabulary-year5-revision.html': 'SkillUP Year 5 vocabulary revision with 240 words, practice and a reading story.',
  'vocabulary-year6-revision.html': 'SkillUP Year 6 vocabulary revision with 240 words, practice and a reading story.',
  'word-problems.html': 'SkillUP word-problem practice for primary students across six difficulty levels.'
};

function addBeforeHeadEnd(html, markup) {
  return html.replace('</head>', `${markup}</head>`);
}

for (const file of pages) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/i)?.[1] || 'SkillUP Learning';
  const description = descriptions[file] || `SkillUP primary learning activities for ${title.replace(/\s*\|\s*SkillUP.*$/i, '')}.`;

  html = html
    .replaceAll('| TestYourself', '| SkillUP')
    .replaceAll('TestYourself', 'SkillUP')
    .replaceAll('https://ai4betterair.github.io/SkillUP/', 'https://ai4betterair.github.io/TestYourself/')
    .replaceAll('github.com/ai4betterAir/SkillUP', 'github.com/ai4betterAir/TestYourself')
    .replaceAll('© 2026 Test Yourself', '© 2026 SkillUP')
    .replaceAll('<span>Test<span>Yourself</span></span>', '<span>Skill<span>UP</span></span>')
    .replaceAll('href="vocabulary-year1.html"', 'href="vocabulary.html"')
    .replaceAll('<span><b>19</b> practice types</span>', '<span><b>14</b> practice types</span>')
    .replaceAll('<span><b>30</b> practice types</span>', '<span><b>25</b> practice types</span>')
    .replaceAll('<span><b>17</b> practice types</span>', '<span><b>12</b> practice types</span>')
    .replaceAll('<span><b>24</b> source lessons</span>', '<span><b>24</b> revision lessons</span>')
    .replaceAll('Every year has Reading, Grammar, Spelling and Writing pathways. Years 1 and 2 now also have larger reading libraries for regular comprehension practice.', 'Every year has 27 guided Reading, Grammar, Spelling and Writing lessons, followed by a balanced 20-question test. Years 1 and 2 also have larger reading libraries for regular comprehension practice.')
    .replaceAll('SkillUP Mathematical Reasoning combines the existing Year 5–6 banks with newly written selective-style problems inspired by the uploaded books and trial papers. Numbers, wording and contexts are changed.', 'SkillUP Mathematical Reasoning uses original practice questions written for this website. It is an independent learning resource and does not reproduce official NSW Selective Test questions.');

  if (file === 'vocabulary-year4-complete.html') {
    html = html
      .replaceAll('Grade 4', 'Year 4')
      .replaceAll('GRADE 4', 'YEAR 4')
      .replace('All 24 lessons from your Year 4 revision book, with meanings and interactive revision.', 'All 24 lessons from the SkillUP Year 4 vocabulary library, with meanings and interactive revision.');
  }

  if (!/<meta\s+name=["']description["']/i.test(html)) {
    html = html.replace(/(<meta\s+name=["']viewport["'][^>]*>)/i, `$1<meta name="description" content="${description}">`);
  }
  if (!/<link\s+rel=["']icon["']/i.test(html)) {
    html = addBeforeHeadEnd(html, '<link rel="icon" type="image/svg+xml" href="assets/skillup-logo.svg">');
  }
  if (!/<link\s+rel=["']apple-touch-icon["']/i.test(html)) {
    html = addBeforeHeadEnd(html, '<link rel="apple-touch-icon" href="assets/skillup-icon-192.png">');
  }
  if (!/<link\s+rel=["']manifest["']/i.test(html)) {
    html = addBeforeHeadEnd(html, '<link rel="manifest" href="site.webmanifest"><meta name="theme-color" content="#3767f0">');
  }
  if (!/<link\s+rel=["']canonical["']/i.test(html) && file !== '404.html') {
    const url = file === 'index.html' ? 'https://ai4betterair.github.io/TestYourself/' : `https://ai4betterair.github.io/TestYourself/${file}`;
    html = addBeforeHeadEnd(html, `<link rel="canonical" href="${url}">`);
  }
  if (!/<meta\s+property=["']og:title["']/i.test(html)) {
    const pageDescription = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1] || description;
    html = addBeforeHeadEnd(html, `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}"><meta property="og:description" content="${pageDescription.replace(/"/g, '&quot;')}"><meta property="og:type" content="website">`);
  }
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i)?.[1];
  const pageDescription = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)?.[1] || description;
  if (canonical && !/<meta\s+property=["']og:url["']/i.test(html)) {
    html = addBeforeHeadEnd(html, `<meta property="og:url" content="${canonical}">`);
  }
  if (!/<meta\s+property=["']og:image["']/i.test(html)) {
    html = addBeforeHeadEnd(html, '<meta property="og:image" content="https://ai4betterair.github.io/TestYourself/assets/skillup-social.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="SkillUP primary learning for Years 1–6">');
  }
  if (!/<meta\s+name=["']twitter:card["']/i.test(html)) {
    html = addBeforeHeadEnd(html, `<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}"><meta name="twitter:description" content="${pageDescription.replace(/"/g, '&quot;')}"><meta name="twitter:image" content="https://ai4betterair.github.io/TestYourself/assets/skillup-social.png">`);
  }

  if (file === 'practice.html' && !html.includes('question-quality-fixes.js')) {
    html = html.replace('<script src="js/practice.js">', '<script src="js/question-quality-fixes.js"></script><script src="js/practice.js">');
  }
  if (file === 'selective-practice.html' && !html.includes('question-quality-fixes.js')) {
    html = html.replace('<script src="js/selective-practice.js">', '<script src="js/question-quality-fixes.js"></script><script src="js/selective-practice.js">');
  }
  if (file === 'english-practice.html' && !html.includes('english-test.js')) {
    html = html.replace('<script src="js/english-course.js"></script>', '<script src="js/english-course.js"></script><script src="js/english-test.js"></script>');
  }
  if (file === 'english-practice.html' && !html.includes('english-course-expansion.js')) {
    html = html.replace('<script src="js/english-test.js"></script>', '<script src="js/english-course-expansion.js"></script><script src="js/english-test.js"></script>');
  }
  if ([
    'vocabulary-year1-stories.html', 'vocabulary-year2.html', 'vocabulary-year3.html',
    'vocabulary-year4.html', 'vocabulary-year4-reading.html', 'vocabulary-year5.html',
    'vocabulary-year6.html'
  ].includes(file) && !html.includes('vocabulary-test.js')) {
    html = html.replace('</body>', '<script src="js/vocabulary-test.js"></script></body>');
  }
  if (!html.includes('js/site-shell.js')) {
    html = html.replace('</body>', '<script src="js/site-shell.js"></script></body>');
  }
  fs.writeFileSync(filePath, html);
}

const exports = [
  ['js/vocabulary-y3.js', 'cards();build()})();', "window.SKILLUP_VOCAB_API={skills,makeQuestion:q};cards();build()})();"],
  ['js/vocabulary-y4.js', 'cards();build()})();', "window.SKILLUP_VOCAB_API={skills,makeQuestion:q};cards();build()})();"],
  ['js/vocabulary-y5.js', 'buildCards();build()})();', "window.SKILLUP_VOCAB_API={skills,makeQuestion:make};buildCards();build()})();"],
  ['js/vocabulary-y6.js', 'buildCards();build()})();', "window.SKILLUP_VOCAB_API={skills,makeQuestion:make};buildCards();build()})();"]
];

for (const [relative, needle, replacement] of exports) {
  const filePath = path.join(root, relative);
  let source = fs.readFileSync(filePath, 'utf8');
  if (!source.includes('SKILLUP_VOCAB_API')) {
    if (!source.includes(needle)) throw new Error(`Could not expose vocabulary test API in ${relative}`);
    source = source.replace(needle, replacement);
    fs.writeFileSync(filePath, source);
  }
}

const contentReplacements = [
  ['The source book also practises', 'This course also practises'],
  ['The book includes terminating decimals', 'Terminating decimals are included'],
  ['The book extends integer ideas', 'This lesson extends integer ideas'],
  ['The book also includes', 'The lesson also includes'],
  ["The book highlights the pattern", 'This question uses the pattern'],
  ['The book asks for different unit fractions', 'The task requires different unit fractions'],
  ['book-informed Year 5 topics', 'expanded Year 5 topics'],
  ['using the uploaded Grade 5 book as a curriculum/style reference', 'covering the Year 5 curriculum and problem-solving style'],
  ['using the uploaded Grade 5', 'covering Year 5'],
  ['based on the uploaded Grade 5', 'covering the Year 5'],
  ['inspired by the uploaded Grade 5', 'covering Year 5'],
  ['based on reasoning styles from the uploaded Grade 5 chapter', 'covering Year 5 reasoning'],
  ['based on the Grade 5', 'covering the Year 5']
];
for (const file of fs.readdirSync(path.join(root, 'js')).filter(file => file.endsWith('.js'))) {
  const filePath = path.join(root, 'js', file);
  let source = fs.readFileSync(filePath, 'utf8');
  const before = source;
  for (const [needle, replacement] of contentReplacements) source = source.replaceAll(needle, replacement);
  if (source !== before) fs.writeFileSync(filePath, source);
}

const targetedReplacements = {
  'vocabulary-y3.js': [
    ["const roots=[['nav','ship or sailing'],['form','shape']]", "const roots=[['nav','ship or sailing'],['form','shape'],['bio','life'],['geo','earth'],['tele','far away'],['port','carry'],['spect','look'],['scrib / script','write']]"],
    ["if(type==='context')return{q:`The story says the character was “${w[0]}”. What does “${w[0]}” most nearly mean?`,a:w[1],c:opts(w[1],[w[2],o[0][1],o[1][2]]),tip:'Use the surrounding idea to work out the meaning.'};return{q:`Choose the best word: The teacher asked us to _____ with the classroom clean-up.`,a:'assist',c:['assist','slumber','orbit','purchase'],tip:'Read the whole sentence before choosing.'}", "if(type==='context'){let c=pick([['After walking all day, Ravi felt drowsy and could barely keep his eyes open.','drowsy','sleepy',['sleepy','angry','hungry','excited']],['The hall was vacant; not one person was inside.','vacant','empty',['empty','crowded','noisy','colourful']],['The overcast sky was covered in grey clouds.','overcast','cloudy',['cloudy','windy','bright','freezing']],['Mina offered to assist by carrying the boxes.','assist','help',['help','watch','hide','delay']],['The sturdy table did not wobble under the heavy books.','sturdy','strong',['strong','tiny','broken','soft']],['A furious customer spoke in a very angry voice.','furious','very angry',['very angry','delighted','sleepy','uncertain']]]);return{q:`Read the sentence: “${c[0]}” What does “${c[1]}” mean?`,a:c[2],c:c[3],tip:'Use the surrounding words and events as clues.'}}let c=pick([['The teacher asked us to _____ with the classroom clean-up.','assist',['assist','slumber','purchase','shiver']],['Dark clouds made the afternoon look _____.','overcast',['overcast','vacant','loyal','annual']],['The tired travellers needed to _____ after the long voyage.','slumber',['slumber','purchase','reply','assist']],['The enormous fossil looked _____ beside the small display case.','mammoth',['mammoth','feeble','vacant','drowsy']],['Please _____ to the invitation before Friday.','reply',['reply','shiver','slumber','purchase']]]);return{q:`Choose the best word: ${c[0]}`,a:c[1],c:c[2],tip:'Read the whole sentence before choosing.'}"],
  ],
  'vocabulary-y4.js': [
    ["const roots=[['aster / astro','star'],['stel / stell','star'],['mar / mari','sea'],['mig / migr','move']]", "const roots=[['aster / astro','star'],['stel / stell','star'],['mar / mari','sea'],['mig / migr','move'],['aqua','water'],['terr','earth or land'],['phon','sound'],['vis / vid','see']]"],
    ["const compounds=[['carefree','care + free'],['caregiver','care + giver'],['caretaker','care + taker'],['childcare','child + care'],['daycare','day + care'],['healthcare','health + care']]", "const compounds=[['carefree','care + free'],['caregiver','care + giver'],['caretaker','care + taker'],['childcare','child + care'],['daycare','day + care'],['healthcare','health + care'],['moonlight','moon + light'],['bookshelf','book + shelf'],['waterproof','water + proof'],['schoolyard','school + yard'],['sunflower','sun + flower'],['lifeguard','life + guard']]"],
    ["if(type==='context')return{q:`Read the clue: “The class had an ${w[0]} to take part.” What does “${w[0]}” most nearly mean?`,a:w[1],c:options(w[1],[w[2],o[0][1],o[1][1]]),tip:'Use words around the unfamiliar word plus what you already know.'};return bankQ(type,general.map(x=>[x[0],x[1]]))", "if(type==='context'){let c=pick([['The competition gave every student an opportunity to present an idea.','opportunity','a chance to do something',['a chance to do something','a rule to follow','a reason to leave','a difficult mistake']],['Kai began to hesitate, pausing before he answered.','hesitate','pause before acting',['pause before acting','speak very loudly','finish immediately','forget completely']],['We maintain the garden by watering and weeding it regularly.','maintain','keep in good condition',['keep in good condition','leave behind','make smaller','measure carefully']],['The puzzling map left us bewildered and unsure where to go.','bewildered','confused',['confused','fortunate','restless','certain']],['The paint mark was permanent, so it could not be washed away.','permanent','lasting',['lasting','temporary','colourful','accidental']],['We were fortunate that the rain stopped before the picnic.','fortunate','lucky',['lucky','furious','careless','exhausted']]]);return{q:`Read the sentence: “${c[0]}” What does “${c[1]}” mean?`,a:c[2],c:c[3],tip:'Use the explanation, contrast or event around the word.'}}return bankQ(type,general.map(x=>[x[0],x[1]]))"],
  ],
  'vocabulary-y5.js': [
    ["if(type==='context')return{q:`The writer described the situation as “${row[0]}”. What does “${row[0]}” most nearly mean?`,a:row[1],c:choices(row[1],[row[2],others[0][1],others[1][2]]),tip:'Use the sentence and your knowledge of the word.'};", "if(type==='context'){let c=pick([['Although new to chess, the novice listened carefully and learned the basic moves.','novice','beginner',['beginner','expert','judge','winner']],['The flimsy shelter shook in the wind because its frame was weak.','flimsy','weak',['weak','sturdy','spacious','valuable']],['The complicated instructions were cumbersome and awkward to use.','cumbersome','awkward',['awkward','brief','accurate','familiar']],['Seeds can remain dormant and inactive until rain arrives.','dormant','inactive',['inactive','plentiful','dangerous','colourful']],['Crossing the flooded creek would be treacherous and unsafe.','treacherous','dangerous',['dangerous','peaceful','ordinary','joyful']],['The daunting climb looked so difficult that several walkers felt discouraged.','daunting','discouraging',['discouraging','simple','beautiful','unexpected']],['The rule is retroactive, so it also applies to events from last month.','retroactive','applying to an earlier time',['applying to an earlier time','lasting for one day','based on a future event','impossible to change']],['Despite the turbulent water, the rescue crew remained calm.','turbulent','disturbed or disorderly',['disturbed or disorderly','perfectly still','shallow and clear','warm and pleasant']]]);return{q:`Read the sentence: “${c[0]}” What does “${c[1]}” most nearly mean?`,a:c[2],c:c[3],tip:'Use definition, example and contrast clues in the sentence.'}}"],
  ],
  'vocabulary-y6.js': [
    ["if(type==='context')return{q:`The ${row[0]} student showed this quality throughout the difficult task. What does “${row[0]}” most nearly mean?`,a:row[1],c:choices(row[1],[row[2],others[0][1],others[1][2]]),tip:'Use both the sentence and what you know about the word.'};return{q:`Choose the best word: The teacher asked us to _____ the information before including it in our report.`,a:'verify',c:['verify','suppress','surmise','pacify'],tip:'Read the whole sentence and choose the word that makes the meaning precise.'}", "if(type==='context'){let c=pick([['Food was abundant after the harvest, with more than enough for the whole town.','abundant','plentiful',['plentiful','scarce','spoiled','expensive']],['The transparent panel was clear enough to see through.','transparent','clear',['clear','opaque','fragile','colourful']],['An impartial referee treats both teams fairly.','impartial','fair',['fair','biased','strict','uncertain']],['The host tried to pacify the arguing guests and help them become calm.','pacify','soothe',['soothe','agitate','separate','question']],['Safety is paramount, so it is more important than finishing quickly.','paramount','supreme in importance',['supreme in importance','optional','temporary','unknown']],['Her laconic reply contained only two brief words.','laconic','brief',['brief','wordy','hostile','uncertain']],['The meticulous editor checked every detail with great care.','meticulous','precise and careful',['precise and careful','careless','generous','impatient']],['Mobile phones are ubiquitous because they can be found almost everywhere.','ubiquitous','widespread',['widespread','rare','short-lived','out of place']]]);return{q:`Read the sentence: “${c[0]}” What does “${c[1]}” most nearly mean?`,a:c[2],c:c[3],tip:'Use examples, explanations and contrasts around the word.'}}let c=pick([['The teacher asked us to _____ the information before including it in our report.','verify',['verify','suppress','surmise','pacify']],['The mediator tried to _____ the upset crowd.','pacify',['pacify','entice','consolidate','suppress']],['The evidence allowed the detective to _____ what may have happened.','surmise',['surmise','verify','pacify','consolidate']],['The editor was careful not to _____ facts that challenged the argument.','suppress',['suppress','entice','verify','pacify']],['The colourful advertisement was designed to _____ customers into the shop.','entice',['entice','consolidate','suppress','surmise']]]);return{q:`Choose the best word: ${c[0]}`,a:c[1],c:c[2],tip:'Read the whole sentence and choose the most precise word.'}"],
  ]
};

for (const [file, replacements] of Object.entries(targetedReplacements)) {
  const filePath = path.join(root, 'js', file);
  let source = fs.readFileSync(filePath, 'utf8');
  for (const [needle, replacement] of replacements) {
    if (source.includes(needle)) source = source.replace(needle, replacement);
    else if (!source.includes(replacement)) throw new Error(`Could not apply vocabulary quality improvement in ${file}`);
  }
  fs.writeFileSync(filePath, source);
}

console.log(`Normalised ${pages.length} top-level HTML pages and vocabulary test APIs.`);

# SkillUP Learning

SkillUP is a static primary-learning website for Kindergarten to Year 6, with:

- Maths lessons, guided practice and timed year tests
- English reading, grammar, spelling and writing with 27 guided lessons per year and timed year tests
- Vocabulary courses, stories, revision libraries and timed year tests
- Selective Mathematical Reasoning, Thinking Skills and Reading practice

The public website is hosted with GitHub Pages from the repository root:

https://ai4betterair.github.io/TestYourself/

## Run locally

From the repository root:

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Validation

Run the full static and content checks before publishing:

```bash
node scripts/normalise-site.js
node scripts/validate-site.js
node scripts/validate-questions.js
node scripts/validate-course-tests.js
```

The browser smoke test checks every page at desktop, two phone sizes and tablet size. It requires Playwright and an installed Chromium browser:

```bash
node scripts/browser-smoke.js
```

The GitHub quality workflow runs all four validators, installs Chromium and performs the responsive browser test before publication.

## Privacy and learner progress

No cloud learner account is required. Optional nicknames, progress, recent scores and saved writing drafts use browser local storage. See `privacy.html` and `parents.html` for the public-facing explanation.

## Content and affiliation

SkillUP is an independent supplementary learning resource. It is not affiliated with the NSW Department of Education, NESA or the official NSW Selective High School Placement Test. Practice questions and explanations are written for SkillUP and are not official test questions.

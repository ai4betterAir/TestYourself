# SkillUP publication checklist

## Automated checks

- Run `node scripts/validate-site.js`.
- Run `node scripts/validate-questions.js`.
- Run `node scripts/validate-course-tests.js`.
- Run `node scripts/browser-smoke.js` with the local HTTP server running.
- Confirm the GitHub `SkillUP site checks` workflow passes on the publication commit.

## Human content sample

Before a major release, an Australian primary teacher or experienced educator should sample every year and subject. For each selected item, check:

- the wording, answer and explanation;
- the year-level difficulty and vocabulary load;
- whether distractors are plausible but clearly incorrect;
- Australian spelling, context and terminology;
- accessibility for learners who need more reading support;
- whether a harder item should be moved to the next year.

Record the page, year, question, decision and reviewer initials. A human sample complements automated checks; it does not need to repeat all generated questions.

## Device and trust review

- Open the home page, one lesson and one test on a current iPhone/iPad and Android phone/tablet.
- Confirm navigation, touch targets, scrolling, test completion and saved progress.
- Confirm Privacy, Terms, Parent and Support wording still matches the deployed services.
- If SkillUP later adds analytics, accounts, advertising, uploads, a contact form or payments, review the privacy and terms pages before release.
- Seek qualified legal advice before institutional or commercial use when legal assurance is required.

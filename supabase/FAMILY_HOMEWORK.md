# Family homework setup

Run `migrations/202611160001_family_homework.sql` in the connected Supabase project's SQL Editor after the existing account and student-ID migrations. The script is transactional and can be rerun. Deploying website files does not apply this database change.

An active guardian with an approved child connection can open **Dashboard → Family homework → Assign homework**. Choose the child, subject, one topic or mixed topics, 10 or 20 questions, instructions and due date. The child's current profile year is used automatically; no teacher class is required. Mixed homework combines topics within one subject. Initial supported subjects are Maths, English (including reading) and Science, K–6. Small banks may repeat questions for revision.

Students see **Homework from your family** on Overview and My work. They can navigate questions, request hints and submit once. The database calculates the score using a separate answer-key table that students cannot read. Parents see completion and scores in Family homework. These records are separate from teacher assignments and their existing progress statistics.

Only the creating guardian and assigned student can read homework while that connection remains approved; active administrators can read records. Other guardians and students cannot read it. Revoking the connection blocks further access. No verification email or SMTP is used by this feature.

For a live check: assign 10 single-topic questions, sign in as that child, complete and submit, then sign back in as guardian and confirm the score. Repeat with mixed topics. These steps require the real project; the included tests run against an isolated database and DOM fixtures.

## Automated checks

Use Node 22 or newer:

```sh
npm --prefix tests/family-homework install
npm --prefix tests/family-homework test
```

The test database is temporary PGlite. Its `auth.uid` stub simulates Supabase JWT user IDs; its test-only random-byte stub is used only to load the existing account migration. No real accounts, emails or project credentials are used.

## Teacher homework

After the family-homework setup, run `migrations/202611160002_teacher_homework.sql`. It adds teacher/class scope without replacing family records. Do not rerun the older family-homework migration after the teacher extension; run migrations in filename order.

Active teachers see **Class topic homework → Assign homework** on Overview and Assignments. Choose an owned, active class, then assign to all checked students or uncheck students to choose a subset. The class year determines the question bank. All selected recipients must be active enrolled students; creation is atomic. Supports the same single/mixed subjects, counts, due date and instructions as family homework. Each student has a separate result. Approved guardians can also see their child's class-topic homework progress. Existing teacher assignments remain available.

Teacher accounts can activate automatically by running `migrations/202611160003_teacher_auto_approval.sql` after the account/student-ID migrations. This does not grant administrator access or change class ownership and enrolment rules.

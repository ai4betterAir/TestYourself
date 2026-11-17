# OC and Selective assignments

Apply `202611170002_exam_homework_leaderboard.sql` in Supabase SQL Editor **after** `202611160001_family_homework.sql` and `202611160002_teacher_homework.sql`. This script is transactional and safe to rerun. Do not rerun the older homework migrations afterwards. The existing account and student-ID setup remains required. GitHub deployment alone does not run SQL.

An approved guardian connection is required. In **Dashboard → Assign homework**, pick a child, then **Learning pathway**. Year 4 offers OC; Years 5–6 offer Selective. Teachers use the selected class's year and can assign to checked, enrolled students. School topics remain available for K–6.

Choose one section, multiple sections (10 or 20 questions), or a full **30-question multiple-choice practice set** (10 Reading, 10 Mathematical reasoning, 10 Thinking skills). Questions are original Acorn & Shine material, not official NSW past papers or a simulation of official test lengths or timings. Full sets here mean the three auto-scored sections; writing is separate and needs human marking. Exam assignments have no hints. Their student interface groups questions by section. Questions and answer order are fixed at assignment creation and keys stay private from students.

All assigned family/teacher homework appears on the student's dashboard and under **Your assignments** on the leaderboard page. Only submitted, server-scored work counts in year-level rankings. Each result contributes its percentage (0–100 points) and one completed work item, just like an existing scored submission. Pending assignments earn no points; retries do not create duplicate results. Existing homework results are included automatically. Self-practice snapshots remain separate. Homework is an informal progress ranking, not a controlled assessment: guardians/teachers choose the questions and difficulty.

Public design preview: `dashboard.html?demo=parent&homework-preview=1`. Sample children only, no account writes. Select the Year 4 sample child to preview OC; the Year 5 sample child offers Selective.

## Assignment board and submission receipts

The dashboard now combines topic homework and older activity assignments into a board on Overview and My work/Assignments. It shows individual learners, who sent the work, due dates, submitted timestamps and saved scores. Teachers/guardians can inspect submitted topic-homework answers directly on the card. Nothing is marked complete until the saved `submitted_at` exists. The board refreshes on focus, return to the tab, navigation to work and every 30 seconds while visible; Refresh provides a manual check.

The board reads existing RLS-protected data immediately; no new SQL is needed for submitted results to display. Optional `202611170003_homework_activity_board.sql` provides sender and student names through a small protected feed, without downloading question banks for the feed itself. Without it, account-visible names are used where available, or “your teacher” / “your guardian”. Apply after family and teacher homework SQL. This RPC mirrors the homework access rules; it returns no email addresses or answer keys.

A missing teacher-group setup no longer prevents existing homework from loading. Errors in the assignment form are shown separately from the board. Public sample boards: `dashboard.html?demo=student`, `dashboard.html?demo=teacher`, `dashboard.html?demo=parent`.

## Student question review

Apply `202611170004_homework_question_review.sql` after family homework, teacher homework and `202611170002_exam_homework_leaderboard.sql`. The optional named activity-board migration is independent. The review setup is safe to rerun.

After submission, students see all questions, their saved choices, correct answers, correct/incorrect labels and a strategy where one was stored. **Review mistakes** filters to incorrect responses. **Try this question again** runs revision in the browser without changing the stored answer, score or leaderboard result. Reopening a completed homework item reloads the canonical submitted answers from the database.

`review_family_homework` only releases answers for the caller's own submitted assignment, with an active student account and the existing family/class access checks. It rejects unfinished work, other students, parents, teachers and anonymous callers. The private answer-key table remains unreadable by authenticated clients.

New homework stores review strategies in that private table, including exam strategies that are withheld during the attempt. Older results retain their correct answer keys; available saved hints are used for review, but explanations removed from older exam sets cannot be recovered. Those questions show a next-step prompt instead of an invented explanation.

Public, sample-only design preview: `family-homework.html?preview=review`.

## Marked submissions for guardians and teachers

Apply `202611170005_guardian_teacher_question_review.sql` **after** `202611170004_homework_question_review.sql`. The dashboard's View submission now uses the submitted-question review RPC, shows Correct/Incorrect per answer and displays the correct choice for mistakes. Saved strategies can be expanded. The original saved score remains unchanged.

The RPC matches homework access rules: assigning guardian (approved link), assigning teacher, the student, approved guardians of an enrolled student on teacher homework, and active administrators. It still refuses unfinished assignments, unrelated accounts and revoked access. Answer-key tables remain private. Without the SQL update, saved student choices remain visible with an explicit marking-unavailable notice; the browser never guesses which answers are correct.

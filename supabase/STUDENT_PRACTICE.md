# Student practice hub

`practice.html` is now the signed-in student practice hub. It contains unfinished-session continuation, recent sessions, year and subject selection, topic search and a 2–10-topic mix builder. The new workspace is `student-practice.html`. K–6 Maths, English (including reading) and Science use the existing shared question banks; vocabulary and GK retain their library shortcuts.

Each new practice session preserves its generated questions, choices, selections, checked answers and cursor. Browser saves are namespaced by student ID. No older unscoped guest history is automatically attributed to an account. The previous practice page saved scores rather than full question snapshots, so exact unfinished sessions from before this feature cannot be recovered.

## Account syncing

Run `migrations/202611170001_student_practice_sessions.sql` once in Supabase SQL Editor after the existing account migrations. The migration can be rerun. Students can read only their own records. All writes pass through the active-student RPC; it validates snapshots, computes practice counts, locks completed sessions and rejects stale concurrent versions. Practice marks are self-study data, not teacher assessment or leaderboard results.

Until that SQL is applied, the hub and workspace can save/resume new practice on the same browser while signed in. Account syncing is then shown as unavailable. Clearing browser storage removes browser-only progress. Cross-device continuation requires account syncing and a successful save before changing device.

The hub displays the latest 50 sessions. Preview URLs `practice.html?preview=1` and `student-practice.html?preview=1` show labelled sample data only and never read or save a user's practice.

## Existing links

The original detailed Maths Learn/Practice/Test workspace is preserved at `maths-practice.html`. Existing `practice.html` URLs with grade, year, topic, mode, focus or assignment parameters redirect there, preserving all query parameters and the fragment. Existing maths question banks and geometry remain in the detailed workspace. Its older unscoped practice histories are separate from the new session store. Timed tests are not paused or resumed by the new self-practice hub.

## Validation

`npm --prefix tests/family-homework install` then `npm --prefix tests/family-homework test` covers course banks, database permissions and practice snapshot storage/resume. `node scripts/check-geometry-visuals.mjs` checks the preserved Maths workspace. No real registration or email delivery is used in these tests.

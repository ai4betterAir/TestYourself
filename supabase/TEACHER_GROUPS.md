# Teacher groups and student connections

Run `migrations/202611160004_teacher_groups_and_requests.sql` in Supabase SQL Editor after the existing account, student-ID and teacher auto-activation migrations. It is transactional and safe to rerun. Refresh the website after applying it.

Each active teacher receives their own private standard groups on opening the dashboard:

- Kindergarten and Years 1–6
- Selective Year 5 and Selective Year 6
- NAPLAN Year 3 and NAPLAN Year 5
- OC Year 4

These are real teacher-owned groups, not shared public classes. A second sign-in does not duplicate them. Existing custom groups are retained. Teachers can create additional groups of type Class, Batch, Subject group or Other, with a programme, year and subject.

## Add a registered student

Teacher dashboard → Add student by email or ID. Choose a group and enter the exact registered email, an `SU-12345678` ID or its eight digits. The existing account must be an active student. No new account or email message is created.

## Student requests

Student dashboard → Teacher connections → Invite a teacher. Enter the registered active teacher's email and optionally a short message. The request appears inside the teacher dashboard; it does not send email or invite an unregistered person to create an account.

Teacher dashboard → Student connection requests. Accept into a group immediately, accept into the student list without a group, or decline. A request alone does not grant access to the student's profile or work. Acceptance creates the teacher/student connection.

## Place or move students

Teacher dashboard → Groups & students → Your students. Choose a destination group. **Add** retains existing enrolments; **Move from** removes only the specified source enrolment and adds the destination. Other teachers' groups cannot be changed. Moving out of a group can remove the student's access to homework restricted to that group's current members; historical records are not deleted.

Group programme labels organise learners. The existing topic-homework engine still uses the selected group's year and supported Maths, English and Science banks; this change does not add Selective/OC/NAPLAN-specific question banks to that engine.

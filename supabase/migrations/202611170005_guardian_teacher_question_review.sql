-- Run after 202611170004_homework_question_review.sql.
-- Extends submitted-only review to the assigning guardian/teacher and approved guardians
-- of students in teacher assignments, using the existing homework access rules.
begin;
create or replace function public.review_family_homework(homework_input uuid)
returns jsonb language plpgsql stable security definer set search_path=public
as $$
declare work public.family_homework%rowtype; keys jsonb; notes jsonb; reviewed jsonb := '[]'::jsonb; i integer; correct_index integer; chosen_index integer;
begin
  if public.current_role() is null then raise exception 'An active account is required'; end if;
  select * into work from public.family_homework where id=homework_input;
  if not found then raise exception 'Homework is not available for review'; end if;
  if not (
    public.current_role()='admin'
    or (work.parent_id is not null and (work.student_id=auth.uid() or work.parent_id=auth.uid()) and exists(
      select 1 from public.guardian_links g where g.parent_id=work.parent_id and g.student_id=work.student_id and g.status='approved'
    ))
    or (work.teacher_id is not null and (
      (work.teacher_id=auth.uid() and public.is_class_teacher(work.class_id))
      or (work.student_id=auth.uid() and public.is_class_student(work.class_id))
      or (public.is_guardian_of(work.student_id) and public.is_class_student(work.class_id,work.student_id))
    ))
  ) then raise exception 'Homework is not available for review'; end if;
  if work.submitted_at is null then raise exception 'Submit this assignment before reviewing answers'; end if;
  select answer_key,review_notes into keys,notes from public.family_homework_keys where homework_id=work.id;
  if keys is null or jsonb_array_length(keys)<>jsonb_array_length(work.questions) then raise exception 'The answer key is unavailable'; end if;
  for i in 0..jsonb_array_length(work.questions)-1 loop
    correct_index := (keys->>i)::integer; chosen_index := (work.answers->>i)::integer;
    reviewed := reviewed || jsonb_build_array(jsonb_build_object(
      'number',i+1,'text',work.questions->i->>'text','choices',work.questions->i->'choices',
      'passage',coalesce(work.questions->i->>'passage',''),'topic',work.questions->i->>'topic',
      'chosen_index',chosen_index,'correct_index',correct_index,'is_correct',chosen_index=correct_index,
      'explanation',coalesce(nullif(notes->>i,''),work.questions->i->>'hint','')
    ));
  end loop;
  return jsonb_build_object('score',work.score,'total',jsonb_array_length(work.questions),'submitted_at',work.submitted_at,'questions',reviewed);
end $$;
revoke all on function public.review_family_homework(uuid) from public,anon;
grant execute on function public.review_family_homework(uuid) to authenticated;
notify pgrst,'reload schema';
commit;

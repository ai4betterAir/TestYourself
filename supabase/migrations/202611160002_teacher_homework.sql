-- Run after 202611160001_family_homework.sql. Adds teacher-created topic homework.
begin;
alter table public.family_homework alter column parent_id drop not null;
alter table public.family_homework add column if not exists teacher_id uuid references public.profiles(id);
alter table public.family_homework add column if not exists class_id uuid references public.classes(id);
alter table public.family_homework drop constraint if exists homework_assigner_scope;
alter table public.family_homework add constraint homework_assigner_scope check (
  (parent_id is not null and teacher_id is null and class_id is null)
  or (parent_id is null and teacher_id is not null and class_id is not null)
);
create index if not exists family_homework_teacher_idx on public.family_homework(teacher_id,class_id,due_at);
drop policy if exists family_homework_read on public.family_homework;
create policy family_homework_read on public.family_homework for select to authenticated using (
  public.current_role()='admin'
  or (parent_id is not null and (student_id=(select auth.uid()) or parent_id=(select auth.uid()))
    and exists(select 1 from public.guardian_links gl where gl.student_id=family_homework.student_id and gl.parent_id=family_homework.parent_id and gl.status='approved'))
  or (teacher_id is not null and (
    (teacher_id=(select auth.uid()) and public.is_class_teacher(class_id))
    or (student_id=(select auth.uid()) and public.is_class_student(class_id))
    or (public.is_guardian_of(student_id) and public.is_class_student(class_id,student_id))
  ))
);
create or replace function public.create_teacher_homework(
  class_input uuid, students_input uuid[], year_input text, subject_input text, topics_input text[],
  title_input text, instructions_input text, due_input timestamptz,
  allow_late_input boolean, questions_input jsonb
) returns integer language plpgsql security definer set search_path=public
as $$
declare class_year text; homework_uuid uuid; learner uuid; recipient_count integer;
  q jsonb; clean jsonb := '[]'::jsonb; keys jsonb := '[]'::jsonb; answer_index integer;
begin
  if public.current_role() is distinct from 'teacher'::public.user_role then raise exception 'Only approved active teachers can assign class homework'; end if;
  select year_level into class_year from public.classes where id=class_input and teacher_id=auth.uid() and archived_at is null for share;
  if not found then raise exception 'Choose one of your active classes'; end if;
  if year_input is distinct from class_year then raise exception 'The class year has changed. Refresh and try again.'; end if;
  if students_input is null or cardinality(students_input) not between 1 and 200 then raise exception 'Choose 1 to 200 enrolled students'; end if;
  if exists(select 1 from unnest(students_input) s where s is null)
    or cardinality(students_input)<>(select count(distinct s) from unnest(students_input) s)
    then raise exception 'Choose each student only once'; end if;
  perform 1 from public.class_members cm join public.profiles p on p.id=cm.student_id
    where cm.class_id=class_input and cm.student_id=any(students_input) and p.role='student' and p.status='active' for share of cm,p;
  get diagnostics recipient_count = row_count;
  if recipient_count<>cardinality(students_input) then raise exception 'Every recipient must be an active student enrolled in this class'; end if;
  if subject_input is null or subject_input not in ('Maths','English','Science') then raise exception 'Choose a supported subject'; end if;
  if title_input is null or char_length(trim(title_input)) not between 1 and 120 then raise exception 'Enter a title of 1 to 120 characters'; end if;
  if char_length(coalesce(instructions_input,''))>1000 then raise exception 'Instructions are too long'; end if;
  if due_input is null or due_input<=now() then raise exception 'Choose a future due date'; end if;
  if jsonb_typeof(questions_input) is distinct from 'array' then raise exception 'Questions must be an array'; end if;
  if jsonb_array_length(questions_input) not in (10,20) then raise exception 'Choose 10 or 20 questions'; end if;
  if topics_input is null or cardinality(topics_input) not between 1 and jsonb_array_length(questions_input)
    or exists(select 1 from unnest(topics_input) t where t is null or char_length(t) not between 1 and 160)
    then raise exception 'Choose between one topic and the question count'; end if;
  for q in select value from jsonb_array_elements(questions_input) loop
    if jsonb_typeof(q->'text') is distinct from 'string' or char_length(q->>'text') not between 1 and 4000 then raise exception 'Invalid question text'; end if;
    if jsonb_typeof(q->'choices') is distinct from 'array' then raise exception 'Invalid answer choices'; end if;
    if jsonb_array_length(q->'choices') not between 2 and 8
      or exists(select 1 from jsonb_array_elements(q->'choices') c where jsonb_typeof(c) is distinct from 'string' or char_length(c#>>'{}') not between 1 and 1000)
      then raise exception 'Invalid answer choices'; end if;
    if jsonb_typeof(q->'answer') is distinct from 'number' or (q->>'answer') !~ '^[0-7]$' then raise exception 'Invalid answer key'; end if;
    answer_index := (q->>'answer')::integer;
    if answer_index>=jsonb_array_length(q->'choices') then raise exception 'Answer is outside the choices'; end if;
    if q->>'topic' is null or not ((q->>'topic')=any(topics_input)) then raise exception 'Question topic is not selected'; end if;
    if char_length(coalesce(q->>'passage',''))>12000 or char_length(coalesce(q->>'hint',''))>4000 then raise exception 'Question context is too long'; end if;
    clean := clean || jsonb_build_array(jsonb_build_object('text',q->>'text','choices',q->'choices','topic',q->>'topic','passage',coalesce(q->>'passage',''),'hint',coalesce(q->>'hint','')));
    keys := keys || jsonb_build_array(answer_index);
  end loop;
  if exists(select 1 from unnest(topics_input) t where not exists(select 1 from jsonb_array_elements(clean) c where c->>'topic'=t)) then raise exception 'Every selected topic must have a question'; end if;
  foreach learner in array students_input loop
    insert into public.family_homework(parent_id,teacher_id,class_id,student_id,title,instructions,year_level,subject,topic_ids,questions,due_at,allow_late)
      values(null,auth.uid(),class_input,learner,trim(title_input),coalesce(instructions_input,''),class_year,subject_input,topics_input,clean,due_input,coalesce(allow_late_input,true)) returning id into homework_uuid;
    insert into public.family_homework_keys(homework_id,answer_key) values(homework_uuid,keys);
  end loop;
  return recipient_count;
end $$;
create or replace function public.submit_family_homework(homework_input uuid, answers_input jsonb)
returns jsonb language plpgsql security definer set search_path=public
as $$
declare work public.family_homework%rowtype; keys jsonb; mark integer := 0; i integer; answer_index integer;
begin
  if public.current_role() is distinct from 'student'::public.user_role then raise exception 'Only active students can submit homework'; end if;
  select * into work from public.family_homework where id=homework_input and student_id=auth.uid() for update;
  if not found then raise exception 'Homework not found'; end if;
  if work.teacher_id is not null then
    perform 1 from public.class_members cm join public.classes c on c.id=cm.class_id
      where cm.class_id=work.class_id and cm.student_id=auth.uid() and c.teacher_id=work.teacher_id for share of cm,c;
    if not found then raise exception 'You are no longer enrolled in this class'; end if;
  else
    perform 1 from public.guardian_links where parent_id=work.parent_id and student_id=auth.uid() and status='approved' for share;
    if not found then raise exception 'The family connection is no longer approved'; end if;
  end if;
  if work.submitted_at is not null then return jsonb_build_object('score',work.score,'total',jsonb_array_length(work.questions)); end if;
  if now()>work.due_at and not work.allow_late then raise exception 'The due date has passed'; end if;
  if jsonb_typeof(answers_input) is distinct from 'array' then raise exception 'Answer every question'; end if;
  if jsonb_array_length(answers_input)<>jsonb_array_length(work.questions) then raise exception 'Answer every question'; end if;
  select answer_key into keys from public.family_homework_keys where homework_id=work.id;
  if keys is null then raise exception 'The answer key is unavailable'; end if;
  for i in 0..jsonb_array_length(work.questions)-1 loop
    if jsonb_typeof(answers_input->i) is distinct from 'number' or (answers_input->>i) !~ '^[0-7]$' then raise exception 'Answer every question'; end if;
    answer_index := (answers_input->>i)::integer;
    if answer_index>=jsonb_array_length(work.questions->i->'choices') then raise exception 'Invalid answer choice'; end if;
    if answer_index=(keys->>i)::integer then mark:=mark+1; end if;
  end loop;
  update public.family_homework set answers=answers_input,score=mark,submitted_at=now() where id=work.id;
  return jsonb_build_object('score',mark,'total',jsonb_array_length(work.questions));
end $$;
revoke all on function public.create_teacher_homework(uuid,uuid[],text,text,text[],text,text,timestamptz,boolean,jsonb) from public,anon;
grant execute on function public.create_teacher_homework(uuid,uuid[],text,text,text[],text,text,timestamptz,boolean,jsonb) to authenticated;
notify pgrst, 'reload schema';
commit;

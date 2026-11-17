-- Run AFTER both 202611160001_family_homework.sql and 202611160002_teacher_homework.sql.
-- Adds original exam-style assignments and includes submitted family/teacher homework in rankings.
-- Preserves assignments and answer keys. Safe to rerun; do not rerun older homework migrations afterwards.
begin;
alter table public.family_homework drop constraint if exists family_homework_subject_check;
alter table public.family_homework add constraint family_homework_subject_check check(subject in ('Maths','English','Science','OC','Selective'));
alter table public.family_homework drop constraint if exists family_homework_questions_check;
alter table public.family_homework add constraint family_homework_questions_check check(jsonb_typeof(questions)='array' and jsonb_array_length(questions) in (10,20,30));
create or replace function public.create_family_homework(
  child_input uuid, year_input text, subject_input text, topics_input text[],
  title_input text, instructions_input text, due_input timestamptz,
  allow_late_input boolean, questions_input jsonb
) returns uuid language plpgsql security definer set search_path=public
as $$
declare child_year text; homework_uuid uuid; q jsonb; clean jsonb := '[]'::jsonb; keys jsonb := '[]'::jsonb; answer_index integer;
begin
  if public.current_role() is distinct from 'parent'::public.user_role then raise exception 'Only active guardians can assign family homework'; end if;
  perform 1 from public.guardian_links where parent_id=auth.uid() and student_id=child_input and status='approved' for share;
  if not found then raise exception 'An approved family connection is required'; end if;
  select year_level into child_year from public.profiles where id=child_input and role='student' and status='active' for share;
  if child_year is null or year_input is distinct from child_year then raise exception 'The child needs a current school year in their profile. Refresh and try again.'; end if;
  if subject_input is null or subject_input not in ('Maths','English','Science','OC','Selective') then raise exception 'Choose a supported subject'; end if;
  if (subject_input='OC' and year_input<>'4') or (subject_input='Selective' and year_input not in ('5','6')) then
    raise exception 'OC homework requires Year 4; Selective homework requires Year 5 or 6';
  end if;
  if subject_input in ('OC','Selective') and (
    topics_input is null or cardinality(topics_input) not between 1 and 3
    or exists(select 1 from unnest(topics_input) t where t is null or t not in ('reading','maths','thinking'))
    or cardinality(topics_input)<>(select count(distinct t) from unnest(topics_input) t)
  ) then raise exception 'Choose valid exam sections'; end if;
  if title_input is null or char_length(trim(title_input)) not between 1 and 120 then raise exception 'Enter a title of 1 to 120 characters'; end if;
  if char_length(coalesce(instructions_input,''))>1000 then raise exception 'Instructions are too long'; end if;
  if due_input is null or due_input<=now() then raise exception 'Choose a future due date'; end if;
  if jsonb_typeof(questions_input) is distinct from 'array' then raise exception 'Questions must be an array'; end if;
  if jsonb_array_length(questions_input) not in (10,20,30) then raise exception 'Choose 10, 20 or 30 questions'; end if;
  if jsonb_array_length(questions_input)=30 and (subject_input not in ('OC','Selective') or cardinality(topics_input)<>3) then
    raise exception 'A full exam-style practice set requires all three sections';
  end if;
  if jsonb_array_length(questions_input)=30 and exists(
    select 1 from unnest(array['reading','maths','thinking']) section
    where (select count(*) from jsonb_array_elements(questions_input) item where item->>'topic'=section)<>10
  ) then raise exception 'A full practice set requires 10 questions per section'; end if;
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
    clean := clean || jsonb_build_array(jsonb_build_object('text',q->>'text','choices',q->'choices','topic',q->>'topic','passage',coalesce(q->>'passage',''),'hint',case when subject_input in ('OC','Selective') then '' else coalesce(q->>'hint','') end));
    keys := keys || jsonb_build_array(answer_index);
  end loop;
  if exists(select 1 from unnest(topics_input) t where not exists(select 1 from jsonb_array_elements(clean) c where c->>'topic'=t)) then raise exception 'Every selected topic must have a question'; end if;
  insert into public.family_homework(parent_id,student_id,title,instructions,year_level,subject,topic_ids,questions,due_at,allow_late)
    values(auth.uid(),child_input,trim(title_input),coalesce(instructions_input,''),child_year,subject_input,topics_input,clean,due_input,coalesce(allow_late_input,true)) returning id into homework_uuid;
  insert into public.family_homework_keys(homework_id,answer_key) values(homework_uuid,keys);
  return homework_uuid;
end $$;

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
  if subject_input is null or subject_input not in ('Maths','English','Science','OC','Selective') then raise exception 'Choose a supported subject'; end if;
  if (subject_input='OC' and year_input<>'4') or (subject_input='Selective' and year_input not in ('5','6')) then
    raise exception 'OC homework requires Year 4; Selective homework requires Year 5 or 6';
  end if;
  if subject_input in ('OC','Selective') and (
    topics_input is null or cardinality(topics_input) not between 1 and 3
    or exists(select 1 from unnest(topics_input) t where t is null or t not in ('reading','maths','thinking'))
    or cardinality(topics_input)<>(select count(distinct t) from unnest(topics_input) t)
  ) then raise exception 'Choose valid exam sections'; end if;
  if title_input is null or char_length(trim(title_input)) not between 1 and 120 then raise exception 'Enter a title of 1 to 120 characters'; end if;
  if char_length(coalesce(instructions_input,''))>1000 then raise exception 'Instructions are too long'; end if;
  if due_input is null or due_input<=now() then raise exception 'Choose a future due date'; end if;
  if jsonb_typeof(questions_input) is distinct from 'array' then raise exception 'Questions must be an array'; end if;
  if jsonb_array_length(questions_input) not in (10,20,30) then raise exception 'Choose 10, 20 or 30 questions'; end if;
  if jsonb_array_length(questions_input)=30 and (subject_input not in ('OC','Selective') or cardinality(topics_input)<>3) then
    raise exception 'A full exam-style practice set requires all three sections';
  end if;
  if jsonb_array_length(questions_input)=30 and exists(
    select 1 from unnest(array['reading','maths','thinking']) section
    where (select count(*) from jsonb_array_elements(questions_input) item where item->>'topic'=section)<>10
  ) then raise exception 'A full practice set requires 10 questions per section'; end if;
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
    clean := clean || jsonb_build_array(jsonb_build_object('text',q->>'text','choices',q->'choices','topic',q->>'topic','passage',coalesce(q->>'passage',''),'hint',case when subject_input in ('OC','Selective') then '' else coalesce(q->>'hint','') end));
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
create or replace function public.get_student_leaderboard(
  year_level_input text,
  period_input text default 'week'
)
returns table(
  student_id uuid,
  display_name text,
  year_level text,
  average_percent numeric,
  completed_tests bigint,
  total_points numeric,
  badge_level text,
  rank_position bigint
)
language sql
stable
security definer
set search_path = public
as $$
with period_window as (
  select case
    when period_input = 'month' then now() - interval '30 days'
    when period_input = 'all' then timestamptz '1970-01-01'
    else now() - interval '7 days'
  end as start_at
),
all_results as (
  select s.student_id, s.score::numeric as score, s.max_score::numeric as maximum, s.submitted_at
  from public.submissions s
  where s.status in ('submitted','graded','returned') and s.submitted_at is not null and s.max_score>0 and s.score is not null
  union all
  select h.student_id, h.score::numeric, jsonb_array_length(h.questions)::numeric, h.submitted_at
  from public.family_homework h where h.submitted_at is not null and h.score is not null
),
results as (
  select p.id as student_id,p.full_name,p.year_level,count(*)::bigint as completed_tests,
    round(avg((r.score/r.maximum)*100),1) as average_percent,
    round(sum((r.score/r.maximum)*100),0) as total_points
  from public.profiles p join all_results r on r.student_id=p.id cross join period_window w
  where p.role='student' and p.status='active' and p.year_level=year_level_input and r.submitted_at>=w.start_at
    and public.current_role() is not null
  group by p.id,p.full_name,p.year_level
),
scored as (
  select
    r.*,
    case
      when r.average_percent >= 90 then 'Platinum'
      when r.average_percent >= 80 then 'Gold'
      when r.average_percent >= 70 then 'Silver'
      else 'Bronze'
    end as badge_level
  from results r
),
ranked as (
  select
    s.*,
    rank() over(order by s.average_percent desc, s.completed_tests desc, s.total_points desc) as rank_position
  from scored s
)
select
  student_id,
  split_part(trim(full_name), ' ', 1)
    || case
      when array_length(string_to_array(trim(full_name), ' '), 1) > 1
      then ' ' || left(split_part(trim(full_name), ' ', 2), 1) || '.'
      else ''
    end as display_name,
  year_level,
  average_percent,
  completed_tests,
  total_points,
  badge_level,
  rank_position
from ranked
order by rank_position, display_name;
$$;

revoke all on function public.get_student_leaderboard(text, text) from public;
grant execute on function public.get_student_leaderboard(text, text) to authenticated;

notify pgrst, 'reload schema';
commit;

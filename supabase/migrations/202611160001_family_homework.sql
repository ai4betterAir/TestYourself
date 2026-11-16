-- Run once after the existing account and student-ID migrations.
-- Family homework uses the child's profile year and an approved guardian link.
begin;
create table if not exists public.family_homework (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id),
  student_id uuid not null references public.profiles(id),
  title text not null check (char_length(title) between 1 and 120),
  instructions text not null default '' check (char_length(instructions) <= 1000),
  year_level text not null check (year_level in ('K','1','2','3','4','5','6')),
  subject text not null check (subject in ('Maths','English','Science')),
  topic_ids text[] not null,
  questions jsonb not null check (jsonb_typeof(questions)='array' and jsonb_array_length(questions) in (10,20)),
  due_at timestamptz not null,
  allow_late boolean not null default true,
  created_at timestamptz not null default now(),
  submitted_at timestamptz,
  answers jsonb,
  score integer,
  check (due_at > created_at),
  check (score is null or score between 0 and jsonb_array_length(questions))
);
create table if not exists public.family_homework_keys (
  homework_id uuid primary key references public.family_homework(id) on delete cascade,
  answer_key jsonb not null
);
create index if not exists family_homework_student_idx on public.family_homework(student_id,due_at);
create index if not exists family_homework_parent_idx on public.family_homework(parent_id,created_at);
alter table public.family_homework enable row level security;
alter table public.family_homework_keys enable row level security;
revoke all on public.family_homework, public.family_homework_keys from anon, authenticated;
grant select on public.family_homework to authenticated;
drop policy if exists family_homework_read on public.family_homework;
create policy family_homework_read on public.family_homework for select to authenticated using (
  public.current_role()='admin'
  or (
    (student_id=(select auth.uid()) or parent_id=(select auth.uid()))
    and exists(select 1 from public.guardian_links gl
      where gl.student_id=family_homework.student_id and gl.parent_id=family_homework.parent_id and gl.status='approved')
  )
);

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
  insert into public.family_homework(parent_id,student_id,title,instructions,year_level,subject,topic_ids,questions,due_at,allow_late)
    values(auth.uid(),child_input,trim(title_input),coalesce(instructions_input,''),child_year,subject_input,topics_input,clean,due_input,coalesce(allow_late_input,true)) returning id into homework_uuid;
  insert into public.family_homework_keys(homework_id,answer_key) values(homework_uuid,keys);
  return homework_uuid;
end $$;

create or replace function public.submit_family_homework(homework_input uuid, answers_input jsonb)
returns jsonb language plpgsql security definer set search_path=public
as $$
declare work public.family_homework%rowtype; keys jsonb; mark integer := 0; i integer; answer_index integer;
begin
  if public.current_role() is distinct from 'student'::public.user_role then raise exception 'Only active students can submit homework'; end if;
  select * into work from public.family_homework where id=homework_input and student_id=auth.uid() for update;
  if not found then raise exception 'Homework not found'; end if;
  perform 1 from public.guardian_links where parent_id=work.parent_id and student_id=auth.uid() and status='approved' for share;
  if not found then raise exception 'The family connection is no longer approved'; end if;
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
revoke all on function public.create_family_homework(uuid,text,text,text[],text,text,timestamptz,boolean,jsonb) from public, anon;
revoke all on function public.submit_family_homework(uuid,jsonb) from public, anon;
grant execute on function public.create_family_homework(uuid,text,text,text[],text,text,timestamptz,boolean,jsonb) to authenticated;
grant execute on function public.submit_family_homework(uuid,jsonb) to authenticated;
notify pgrst, 'reload schema';
commit;

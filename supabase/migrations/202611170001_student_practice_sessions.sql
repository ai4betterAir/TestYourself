-- Individual practice progress, separate from teacher/guardian assessment results.
begin;
create table if not exists public.student_practice_sessions (
  id uuid primary key,
  student_id uuid not null references public.profiles(id) on delete cascade,
  year_level text not null check(year_level in ('K','1','2','3','4','5','6')),
  subject text not null check(subject in ('Maths','English','Science')),
  topic_ids text[] not null,
  topic_labels text[] not null,
  state jsonb not null,
  version integer not null default 1,
  question_count integer not null check(question_count in (10,20)),
  answered_count integer not null check(answered_count>=0 and answered_count<=question_count),
  correct_count integer not null check(correct_count>=0 and correct_count<=answered_count),
  status text not null check(status in ('active','completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists student_practice_recent_idx on public.student_practice_sessions(student_id,updated_at desc);
alter table public.student_practice_sessions enable row level security;
revoke all on public.student_practice_sessions from anon,authenticated;
grant select on public.student_practice_sessions to authenticated;
drop policy if exists student_practice_read on public.student_practice_sessions;
create policy student_practice_read on public.student_practice_sessions for select to authenticated using(
  (student_id=auth.uid() and public.current_role()='student') or public.current_role()='admin'
);
create or replace function public.save_student_practice(session_input uuid,year_input text,subject_input text,topics_input text[],labels_input text[],state_input jsonb,version_input integer)
returns jsonb language plpgsql security definer set search_path=public
as $$
declare old public.student_practice_sessions%rowtype; q jsonb; answer jsonb; checked jsonb; n integer; i integer; answered integer:=0; correct integer:=0; next_version integer; next_status text;
begin
  if public.current_role() is distinct from 'student'::public.user_role then raise exception 'Sign in with an active student account'; end if;
  if session_input is null or year_input is null or year_input not in ('K','1','2','3','4','5','6') or subject_input is null or subject_input not in ('Maths','English','Science') then raise exception 'Invalid practice details'; end if;
  if jsonb_typeof(state_input) is distinct from 'object' or octet_length(state_input::text)>500000 then raise exception 'Invalid practice state'; end if;
  if jsonb_typeof(state_input->'questions') is distinct from 'array' then raise exception 'Invalid questions'; end if;
  n:=jsonb_array_length(state_input->'questions');
  if n not in (10,20) then raise exception 'Choose 10 or 20 questions'; end if;
  if topics_input is null or cardinality(topics_input) not between 1 and n or labels_input is null or cardinality(labels_input)<>cardinality(topics_input)
    or exists(select 1 from unnest(topics_input) t where t is null or length(t) not between 1 and 160)
    or exists(select 1 from unnest(labels_input) t where t is null or length(t) not between 1 and 160) then raise exception 'Invalid topics'; end if;
  if jsonb_typeof(state_input->'answers') is distinct from 'array' or jsonb_typeof(state_input->'checked') is distinct from 'array' then raise exception 'Invalid answers'; end if;
  if jsonb_array_length(state_input->'answers')<>n or jsonb_array_length(state_input->'checked')<>n then raise exception 'Invalid answer count'; end if;
  if jsonb_typeof(state_input->'cursor') is distinct from 'number' or (state_input->>'cursor')!~'^[0-9]{1,2}$' then raise exception 'Invalid question position'; end if;
  if (state_input->>'cursor')::integer>=n then raise exception 'Invalid question position'; end if;
  for i in 0..n-1 loop
    q:=state_input->'questions'->i;answer:=state_input->'answers'->i;checked:=state_input->'checked'->i;
    if jsonb_typeof(q->'text') is distinct from 'string' or length(q->>'text') not between 1 and 4000 or q->>'topic' is null or not ((q->>'topic')=any(topics_input)) then raise exception 'Invalid question'; end if;
    if jsonb_typeof(q->'choices') is distinct from 'array' then raise exception 'Invalid choices'; end if;
    if jsonb_array_length(q->'choices') not between 2 and 8 or exists(select 1 from jsonb_array_elements(q->'choices') c where jsonb_typeof(c) is distinct from 'string' or length(c#>>'{}') not between 1 and 1000) then raise exception 'Invalid choices'; end if;
    if jsonb_typeof(q->'answer') is distinct from 'number' or (q->>'answer')!~'^[0-7]$' or (q->>'answer')::integer>=jsonb_array_length(q->'choices') then raise exception 'Invalid practice answer'; end if;
    if length(coalesce(q->>'passage',''))>12000 or length(coalesce(q->>'hint',''))>4000 then raise exception 'Practice text is too long'; end if;
    if answer<>'null'::jsonb and (jsonb_typeof(answer)<>'number' or (answer#>>'{}')!~'^[0-7]$') then raise exception 'Invalid selection'; end if;
    if answer<>'null'::jsonb and (answer#>>'{}')::integer>=jsonb_array_length(q->'choices') then raise exception 'Invalid selection'; end if;
    if jsonb_typeof(checked) is distinct from 'boolean' then raise exception 'Invalid checked state'; end if;
    if checked='true'::jsonb then
      if answer='null'::jsonb then raise exception 'Choose an answer before checking'; end if;
      answered:=answered+1;if answer=q->'answer' then correct:=correct+1;end if;
    end if;
  end loop;
  -- Serialise writes to a session, including simultaneous initial saves.
  perform pg_advisory_xact_lock(hashtextextended(session_input::text,0));
  select * into old from public.student_practice_sessions where id=session_input for update;
  if found then
    if old.student_id<>auth.uid() then raise exception 'Practice session is unavailable'; end if;
    if old.version is distinct from version_input then raise exception using errcode='40001',message='This session changed in another tab. Refresh before continuing.'; end if;
    if old.status='completed' then raise exception 'This practice is complete. Start a new session.'; end if;
    if old.year_level<>year_input or old.subject<>subject_input or old.topic_ids<>topics_input or old.state->'questions' is distinct from state_input->'questions' then raise exception 'Start a new session to change topics or questions'; end if;
    next_version:=old.version+1;
  else
    if version_input is distinct from 0 then raise exception 'Practice session was not found'; end if;
    next_version:=1;
  end if;
  next_status:=case when answered=n then 'completed' else 'active' end;
  insert into public.student_practice_sessions(id,student_id,year_level,subject,topic_ids,topic_labels,state,version,question_count,answered_count,correct_count,status,completed_at)
    values(session_input,auth.uid(),year_input,subject_input,topics_input,labels_input,state_input,next_version,n,answered,correct,next_status,case when answered=n then now() else null end)
    on conflict(id) do update set state=excluded.state,version=excluded.version,answered_count=excluded.answered_count,correct_count=excluded.correct_count,status=excluded.status,updated_at=now(),completed_at=excluded.completed_at;
  return jsonb_build_object('version',next_version,'status',next_status,'updated_at',now());
end $$;
revoke all on function public.save_student_practice(uuid,text,text,text[],text[],jsonb,integer) from public,anon;
grant execute on function public.save_student_practice(uuid,text,text,text[],text[],jsonb,integer) to authenticated;
notify pgrst,'reload schema';
commit;

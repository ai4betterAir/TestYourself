-- Run after account/student-ID setup and teacher auto-activation.
-- Adds private default groups, exact student lookup, connection requests and placement.
begin;
alter table public.classes add column if not exists group_type text not null default 'class';
alter table public.classes add column if not exists programme text not null default 'K6';
alter table public.classes add column if not exists default_key text;
alter table public.classes drop constraint if exists classes_group_type_check;
alter table public.classes add constraint classes_group_type_check check(group_type in ('class','batch','subject','other'));
alter table public.classes drop constraint if exists classes_programme_check;
alter table public.classes add constraint classes_programme_check check(programme in ('K6','Selective','NAPLAN3','NAPLAN5','OC4'));
alter table public.classes drop constraint if exists classes_programme_year_check;
alter table public.classes add constraint classes_programme_year_check check(
  programme='K6' or (programme='Selective' and year_level in ('5','6'))
  or (programme='NAPLAN3' and year_level='3') or (programme='NAPLAN5' and year_level='5') or (programme='OC4' and year_level='4')
);
alter table public.classes drop constraint if exists classes_subject_check;
alter table public.classes add constraint classes_subject_check check(subject in ('Maths','English','Reading','Vocabulary','Science','General Knowledge','Selective','Mixed'));
create unique index if not exists classes_teacher_default_unique on public.classes(teacher_id,default_key) where default_key is not null;

create table if not exists public.student_teacher_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  message text not null default '' check(char_length(message)<=300),
  status text not null default 'pending' check(status in ('pending','accepted','declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(student_id,teacher_id), check(student_id<>teacher_id)
);
alter table public.student_teacher_requests enable row level security;
revoke all on public.student_teacher_requests from anon,authenticated;
grant select on public.student_teacher_requests to authenticated;
drop policy if exists student_teacher_requests_read on public.student_teacher_requests;
create policy student_teacher_requests_read on public.student_teacher_requests for select to authenticated using (
  student_id=(select auth.uid()) or teacher_id=(select auth.uid()) or public.current_role()='admin'
);

create or replace function public.is_teacher_of(student_uuid uuid)
returns boolean language sql stable security definer set search_path=public
as $$ select public.current_role()='teacher' and (
  exists(select 1 from public.class_members cm join public.classes c on c.id=cm.class_id where cm.student_id=student_uuid and c.teacher_id=auth.uid())
  or exists(select 1 from public.student_teacher_requests r where r.student_id=student_uuid and r.teacher_id=auth.uid() and r.status='accepted')
) $$;

create or replace function public.ensure_teacher_learning_groups()
returns integer language plpgsql security definer set search_path=public
as $$
declare created_count integer;
begin
  if public.current_role() is distinct from 'teacher'::public.user_role then raise exception 'Sign in with an active teacher account'; end if;
  insert into public.classes(teacher_id,name,subject,year_level,group_type,programme,default_key)
  select auth.uid(),v.name,v.subject,v.year_level,'class',v.programme,v.key
  from (values
    ('Kindergarten','Mixed','K','K6','k6-K'),('Year 1','Mixed','1','K6','k6-1'),
    ('Year 2','Mixed','2','K6','k6-2'),('Year 3','Mixed','3','K6','k6-3'),
    ('Year 4','Mixed','4','K6','k6-4'),('Year 5','Mixed','5','K6','k6-5'),('Year 6','Mixed','6','K6','k6-6'),
    ('Selective · Year 5','Selective','5','Selective','selective-5'),('Selective · Year 6','Selective','6','Selective','selective-6'),
    ('NAPLAN · Year 3','Mixed','3','NAPLAN3','naplan-3'),('NAPLAN · Year 5','Mixed','5','NAPLAN5','naplan-5'),
    ('OC · Year 4','Mixed','4','OC4','oc-4')
  ) v(name,subject,year_level,programme,key)
  on conflict(teacher_id,default_key) where default_key is not null do nothing;
  get diagnostics created_count=row_count;
  return created_count;
end $$;

create or replace function public.add_student_to_group_by_identifier(class_input uuid, identifier_input text)
returns uuid language plpgsql security definer set search_path=public
as $$
declare student_uuid uuid; identifier text:=trim(identifier_input);
begin
  if public.current_role() is distinct from 'teacher'::public.user_role then raise exception 'Sign in with an active teacher account'; end if;
  perform 1 from public.classes where id=class_input and teacher_id=auth.uid() and archived_at is null for share;
  if not found then raise exception 'Choose one of your active learning groups'; end if;
  if identifier is null or length(identifier) not between 1 and 254 then raise exception 'Enter the student email or ID'; end if;
  if identifier ~ '^[0-9]{8}$' then identifier:='SU-'||identifier; end if;
  select id into student_uuid from public.profiles
    where role='student' and status='active' and (lower(email)=lower(identifier) or upper(skillup_id)=upper(identifier)) limit 1 for share;
  if student_uuid is null then raise exception 'No active student matches that email or ID'; end if;
  insert into public.student_teacher_requests(student_id,teacher_id,status)
    values(student_uuid,auth.uid(),'accepted') on conflict(student_id,teacher_id) do update set status='accepted',updated_at=now();
  insert into public.class_members(class_id,student_id) values(class_input,student_uuid) on conflict do nothing;
  return student_uuid;
end $$;

create or replace function public.request_teacher_connection(teacher_email_input text, message_input text default '')
returns text language plpgsql security definer set search_path=public
as $$
declare teacher_uuid uuid; request_status text;
begin
  if public.current_role() is distinct from 'student'::public.user_role then raise exception 'Sign in with an active student account'; end if;
  if char_length(coalesce(message_input,''))>300 then raise exception 'Keep the message within 300 characters'; end if;
  select id into teacher_uuid from public.profiles where lower(email)=lower(trim(teacher_email_input)) and role='teacher' and status='active' limit 1 for share;
  if teacher_uuid is null then raise exception 'No active teacher account matches that email. Ask your teacher to register first.'; end if;
  insert into public.student_teacher_requests(student_id,teacher_id,message)
    values(auth.uid(),teacher_uuid,coalesce(message_input,''))
    on conflict(student_id,teacher_id) do update set
      status=case when public.student_teacher_requests.status='accepted' then 'accepted' else 'pending' end,
      message=case when public.student_teacher_requests.status='accepted' then public.student_teacher_requests.message else excluded.message end,updated_at=now()
    returning status into request_status;
  return request_status;
end $$;

create or replace function public.list_teacher_connection_requests()
returns table(request_id uuid,student_id uuid,full_name text,email text,skillup_id text,year_level text,message text,requested_at timestamptz)
language plpgsql security definer set search_path=public
as $$ begin
  if public.current_role() is distinct from 'teacher'::public.user_role then raise exception 'Sign in with an active teacher account'; end if;
  return query select r.id,p.id,p.full_name,p.email,p.skillup_id,p.year_level,r.message,r.updated_at
    from public.student_teacher_requests r join public.profiles p on p.id=r.student_id
    where r.teacher_id=auth.uid() and r.status='pending' and p.status='active' order by r.updated_at;
end $$;

create or replace function public.respond_teacher_connection(request_input uuid, accept_input boolean, class_input uuid default null)
returns boolean language plpgsql security definer set search_path=public
as $$ declare learner uuid;
begin
  if public.current_role() is distinct from 'teacher'::public.user_role then raise exception 'Sign in with an active teacher account'; end if;
  if accept_input is null then raise exception 'Choose accept or decline'; end if;
  select student_id into learner from public.student_teacher_requests where id=request_input and teacher_id=auth.uid() and status='pending' for update;
  if not found then raise exception 'This pending request is not available to you'; end if;
  perform 1 from public.profiles where id=learner and role='student' and status='active' for share;
  if not found then raise exception 'The student account is not active'; end if;
  if accept_input and class_input is not null then
    perform 1 from public.classes where id=class_input and teacher_id=auth.uid() and archived_at is null for share;
    if not found then raise exception 'Choose one of your active learning groups'; end if;
    insert into public.class_members(class_id,student_id) values(class_input,learner) on conflict do nothing;
  end if;
  update public.student_teacher_requests set status=case when accept_input then 'accepted' else 'declined' end,updated_at=now() where id=request_input;
  return true;
end $$;

create or replace function public.list_my_teacher_connections()
returns table(request_id uuid,teacher_name text,teacher_email text,status text,group_names text[])
language plpgsql security definer set search_path=public
as $$ begin
  if public.current_role() is distinct from 'student'::public.user_role then raise exception 'Sign in with an active student account'; end if;
  return query with connected as (
    select r.teacher_id from public.student_teacher_requests r where r.student_id=auth.uid()
    union select c.teacher_id from public.classes c join public.class_members cm on cm.class_id=c.id where cm.student_id=auth.uid()
  ) select r.id,p.full_name,p.email,
    case when r.status='accepted' or exists(select 1 from public.classes c join public.class_members cm on cm.class_id=c.id where cm.student_id=auth.uid() and c.teacher_id=p.id) then 'accepted' else r.status end,
    array(select c.name from public.classes c join public.class_members cm on cm.class_id=c.id where cm.student_id=auth.uid() and c.teacher_id=p.id and c.archived_at is null order by c.name)
    from connected x join public.profiles p on p.id=x.teacher_id
    left join public.student_teacher_requests r on r.teacher_id=p.id and r.student_id=auth.uid() order by p.full_name;
end $$;

create or replace function public.list_teacher_students()
returns table(student_id uuid,full_name text,email text,skillup_id text,year_level text,groups jsonb)
language plpgsql security definer set search_path=public
as $$ begin
  if public.current_role() is distinct from 'teacher'::public.user_role then raise exception 'Sign in with an active teacher account'; end if;
  return query select p.id,p.full_name,p.email,p.skillup_id,p.year_level,
    coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'name',c.name,'type',c.group_type,'programme',c.programme) order by c.name)
      from public.classes c join public.class_members cm on cm.class_id=c.id where cm.student_id=p.id and c.teacher_id=auth.uid() and c.archived_at is null),'[]'::jsonb)
    from public.profiles p where p.role='student' and p.status='active' and public.is_teacher_of(p.id) order by p.full_name;
end $$;

create or replace function public.place_teacher_student(student_input uuid, destination_input uuid, source_input uuid default null)
returns boolean language plpgsql security definer set search_path=public
as $$ begin
  if public.current_role() is distinct from 'teacher'::public.user_role then raise exception 'Sign in with an active teacher account'; end if;
  if not public.is_teacher_of(student_input) then raise exception 'Accept or add this student before placing them in a group'; end if;
  perform 1 from public.profiles where id=student_input and role='student' and status='active' for share;
  if not found then raise exception 'The student account is not active'; end if;
  perform 1 from public.classes where id=destination_input and teacher_id=auth.uid() and archived_at is null for share;
  if not found then raise exception 'Choose one of your active destination groups'; end if;
  if source_input is not null then
    if source_input=destination_input then raise exception 'Choose a different destination group'; end if;
    perform 1 from public.classes where id=source_input and teacher_id=auth.uid() for share;
    if not found then raise exception 'You can move students only from your own groups'; end if;
    perform 1 from public.class_members where class_id=source_input and student_id=student_input for update;
    if not found then raise exception 'The student is not enrolled in that source group'; end if;
  end if;
  insert into public.student_teacher_requests(student_id,teacher_id,status) values(student_input,auth.uid(),'accepted')
    on conflict(student_id,teacher_id) do update set status='accepted',updated_at=now();
  insert into public.class_members(class_id,student_id) values(destination_input,student_input) on conflict do nothing;
  if source_input is not null then delete from public.class_members where class_id=source_input and student_id=student_input; end if;
  return true;
end $$;

revoke all on function public.ensure_teacher_learning_groups() from public,anon;
revoke all on function public.add_student_to_group_by_identifier(uuid,text) from public,anon;
revoke all on function public.request_teacher_connection(text,text) from public,anon;
revoke all on function public.list_teacher_connection_requests() from public,anon;
revoke all on function public.respond_teacher_connection(uuid,boolean,uuid) from public,anon;
revoke all on function public.list_my_teacher_connections() from public,anon;
revoke all on function public.list_teacher_students() from public,anon;
revoke all on function public.place_teacher_student(uuid,uuid,uuid) from public,anon;
grant execute on function public.ensure_teacher_learning_groups(),public.add_student_to_group_by_identifier(uuid,text),public.request_teacher_connection(text,text),public.list_teacher_connection_requests(),public.respond_teacher_connection(uuid,boolean,uuid),public.list_my_teacher_connections(),public.list_teacher_students(),public.place_teacher_student(uuid,uuid,uuid) to authenticated;
notify pgrst,'reload schema';
commit;

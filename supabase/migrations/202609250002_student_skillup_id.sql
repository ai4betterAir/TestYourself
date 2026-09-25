-- Permanent SkillUP student IDs and secure teacher/parent linking.
-- Students receive an 8-digit SkillUP ID such as SU-48291735.
-- Teachers can add a student to one of their classes by SkillUP ID.
-- Parents can request a child link by SkillUP ID; the student must approve it.

alter table public.profiles
  add column if not exists skillup_id text;

create or replace function public.generate_student_skillup_id()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  candidate text;
begin
  loop
    candidate := 'SU-' || lpad((floor(random() * 100000000))::bigint::text, 8, '0');
    exit when not exists (
      select 1 from public.profiles where skillup_id = candidate
    );
  end loop;
  return candidate;
end
$$;

-- Give existing student accounts an ID.
do $$
declare
  learner record;
begin
  for learner in
    select id from public.profiles
    where role = 'student' and skillup_id is null
  loop
    update public.profiles
      set skillup_id = public.generate_student_skillup_id()
      where id = learner.id;
  end loop;
end
$$;

create unique index if not exists profiles_skillup_id_unique
  on public.profiles(skillup_id)
  where skillup_id is not null;

-- Ensure all future student sign-ups get a permanent SkillUP ID.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested text;
  safe_role public.user_role;
  initial_status public.profile_status;
  learner_id text;
begin
  requested := coalesce(new.raw_user_meta_data->>'requested_role','student');
  safe_role := case
    when requested in ('student','teacher','parent') then requested::public.user_role
    else 'student'::public.user_role
  end;
  initial_status := case
    when safe_role = 'teacher' then 'pending'::public.profile_status
    else 'active'::public.profile_status
  end;
  learner_id := case
    when safe_role = 'student' then public.generate_student_skillup_id()
    else null
  end;

  insert into public.profiles(
    id,email,full_name,role,status,year_level,skillup_id
  )
  values(
    new.id,
    coalesce(new.email,''),
    left(coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'),''),'SkillUP learner'),80),
    safe_role,
    initial_status,
    case
      when safe_role='student'
       and coalesce(new.raw_user_meta_data->>'year_level','') in ('K','1','2','3','4','5','6')
      then new.raw_user_meta_data->>'year_level'
      else null
    end,
    learner_id
  );
  return new;
end
$$;

create or replace function public.add_student_to_class_by_skillup_id(
  class_uuid uuid,
  skillup_id_input text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  student_uuid uuid;
begin
  if public.current_role() <> 'teacher' then
    raise exception 'Only active teacher accounts can add students';
  end if;

  if not public.is_class_teacher(class_uuid) then
    raise exception 'You can only add students to your own class';
  end if;

  select id into student_uuid
  from public.profiles
  where role='student'
    and status='active'
    and upper(skillup_id)=upper(trim(skillup_id_input))
  limit 1;

  if student_uuid is null then
    raise exception 'Student SkillUP ID not found';
  end if;

  insert into public.class_members(class_id,student_id)
  values(class_uuid,student_uuid)
  on conflict do nothing;

  return student_uuid;
end
$$;

create or replace function public.request_guardian_link_by_skillup_id(
  skillup_id_input text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  student_uuid uuid;
begin
  if public.current_role() <> 'parent' then
    raise exception 'Only parent accounts can request a child link';
  end if;

  select id into student_uuid
  from public.profiles
  where role='student'
    and status='active'
    and upper(skillup_id)=upper(trim(skillup_id_input))
  limit 1;

  if student_uuid is null then
    raise exception 'Student SkillUP ID not found';
  end if;

  insert into public.guardian_links(parent_id,student_id,status)
  values((select auth.uid()),student_uuid,'pending')
  on conflict(parent_id,student_id)
  do update set status = case
    when public.guardian_links.status='approved' then 'approved'::public.guardian_status
    else 'pending'::public.guardian_status
  end,
  created_at = now();

  return student_uuid;
end
$$;

create or replace function public.list_pending_guardian_requests()
returns table(
  parent_id uuid,
  full_name text,
  requested_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.current_role() <> 'student' then
    raise exception 'Only student accounts can view parent requests';
  end if;

  return query
    select gl.parent_id, p.full_name, gl.created_at
    from public.guardian_links gl
    join public.profiles p on p.id = gl.parent_id
    where gl.student_id=(select auth.uid())
      and gl.status='pending'
    order by gl.created_at desc;
end
$$;

create or replace function public.respond_guardian_link(
  parent_uuid_input uuid,
  approve_input boolean
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.current_role() <> 'student' then
    raise exception 'Only the student can approve a parent connection';
  end if;

  update public.guardian_links
  set status = case
    when approve_input then 'approved'::public.guardian_status
    else 'revoked'::public.guardian_status
  end
  where student_id=(select auth.uid())
    and parent_id=parent_uuid_input
    and status='pending';

  if not found then
    raise exception 'Parent connection request not found';
  end if;

  return true;
end
$$;

revoke all on function public.generate_student_skillup_id() from public;
revoke all on function public.add_student_to_class_by_skillup_id(uuid,text) from public;
revoke all on function public.request_guardian_link_by_skillup_id(text) from public;
revoke all on function public.list_pending_guardian_requests() from public;
revoke all on function public.respond_guardian_link(uuid,boolean) from public;

grant execute on function public.add_student_to_class_by_skillup_id(uuid,text) to authenticated;
grant execute on function public.request_guardian_link_by_skillup_id(text) to authenticated;
grant execute on function public.list_pending_guardian_requests() to authenticated;
grant execute on function public.respond_guardian_link(uuid,boolean) to authenticated;

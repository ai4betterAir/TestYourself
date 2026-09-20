-- SkillUP accounts, classes, assignments and family access.
-- Run in a new Supabase project. All browser-facing tables use RLS.

create extension if not exists pgcrypto;

create type public.user_role as enum ('student','teacher','parent','admin');
create type public.profile_status as enum ('active','pending','suspended');
create type public.assignment_status as enum ('draft','published','closed','archived');
create type public.submission_status as enum ('not_started','in_progress','submitted','graded','returned');
create type public.guardian_status as enum ('pending','approved','revoked');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null check (char_length(full_name) between 1 and 80),
  role public.user_role not null,
  status public.profile_status not null default 'active',
  year_level text check (year_level is null or year_level in ('K','1','2','3','4','5','6')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete restrict,
  name text not null check (char_length(name) between 1 and 80),
  subject text not null check (subject in ('Maths','English','Vocabulary','Selective','Mixed')),
  year_level text not null check (year_level in ('K','1','2','3','4','5','6')),
  join_code text not null unique default upper(substr(encode(gen_random_bytes(5),'hex'),1,6)),
  archived_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.class_members (
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (class_id, student_id)
);

create table public.guardian_links (
  parent_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  status public.guardian_status not null default 'approved',
  created_at timestamptz not null default now(),
  primary key (parent_id, student_id),
  check (parent_id <> student_id)
);

create table public.guardian_invites (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  code text not null unique,
  expires_at timestamptz not null default (now() + interval '48 hours'),
  claimed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.profiles(id) on delete restrict,
  class_id uuid not null references public.classes(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  instructions text not null default '' check (char_length(instructions) <= 1000),
  subject text not null,
  resource_url text not null check (resource_url !~ '^([a-z]+:|//)'),
  opens_at timestamptz not null default now(),
  due_at timestamptz not null,
  closes_at timestamptz,
  allow_late boolean not null default false,
  max_attempts integer not null default 1 check (max_attempts between 1 and 20),
  status public.assignment_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (due_at > opens_at),
  check (closes_at is null or closes_at >= due_at)
);

create table public.assignment_targets (
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  primary key (assignment_id, student_id)
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  attempt_no integer not null default 1 check (attempt_no > 0),
  status public.submission_status not null default 'not_started',
  started_at timestamptz,
  submitted_at timestamptz,
  score numeric(8,2),
  max_score numeric(8,2),
  teacher_feedback text check (char_length(teacher_feedback) <= 2000),
  graded_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (assignment_id, student_id, attempt_no),
  check ((score is null and max_score is null) or (score >= 0 and max_score > 0 and score <= max_score))
);

create table public.question_attempts (
  id bigint generated always as identity primary key,
  submission_id uuid not null references public.submissions(id) on delete cascade,
  question_ref text not null,
  is_correct boolean,
  time_spent_seconds integer check (time_spent_seconds is null or time_spent_seconds >= 0),
  created_at timestamptz not null default now()
);

create index class_members_student_idx on public.class_members(student_id);
create index assignments_class_due_idx on public.assignments(class_id, due_at);
create index submissions_student_idx on public.submissions(student_id, submitted_at desc);
create index submissions_assignment_idx on public.submissions(assignment_id);
create index guardian_links_student_idx on public.guardian_links(student_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare requested text; safe_role public.user_role; initial_status public.profile_status;
begin
  requested := coalesce(new.raw_user_meta_data->>'requested_role','student');
  safe_role := case when requested in ('student','teacher','parent') then requested::public.user_role else 'student'::public.user_role end;
  initial_status := case when safe_role = 'teacher' then 'pending'::public.profile_status else 'active'::public.profile_status end;
  insert into public.profiles(id,email,full_name,role,status,year_level)
  values(new.id,coalesce(new.email,''),left(coalesce(nullif(trim(new.raw_user_meta_data->>'full_name'),''),'SkillUP learner'),80),safe_role,initial_status,
    case when safe_role='student' and coalesce(new.raw_user_meta_data->>'year_level','') in ('K','1','2','3','4','5','6') then new.raw_user_meta_data->>'year_level' else null end);
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.current_role()
returns public.user_role language sql stable security definer set search_path = public
as $$ select role from public.profiles where id = (select auth.uid()) and status = 'active' $$;

create or replace function public.is_class_teacher(class_uuid uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.classes where id=class_uuid and teacher_id=(select auth.uid())) $$;

create or replace function public.is_class_student(class_uuid uuid, student_uuid uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.class_members where class_id=class_uuid and student_id=student_uuid) $$;

create or replace function public.is_guardian_of(student_uuid uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.guardian_links where parent_id=(select auth.uid()) and student_id=student_uuid and status='approved') $$;

create or replace function public.is_teacher_of(student_uuid uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.class_members cm join public.classes c on c.id=cm.class_id where cm.student_id=student_uuid and c.teacher_id=(select auth.uid())) $$;

create or replace function public.assignment_is_for_student(assignment_uuid uuid, student_uuid uuid default auth.uid())
returns boolean language sql stable security definer set search_path = public
as $$
  select exists(
    select 1 from public.assignments a
    where a.id=assignment_uuid and a.status in ('published','closed')
      and exists(select 1 from public.class_members cm where cm.class_id=a.class_id and cm.student_id=student_uuid)
      and (
        not exists(select 1 from public.assignment_targets t where t.assignment_id=a.id)
        or exists(select 1 from public.assignment_targets t where t.assignment_id=a.id and t.student_id=student_uuid)
      )
  )
$$;

create or replace function public.teacher_owns_assignment(assignment_uuid uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.assignments where id=assignment_uuid and teacher_id=(select auth.uid())) $$;

create or replace function public.join_class_by_code(code_input text)
returns uuid language plpgsql security definer set search_path=public
as $$
declare class_uuid uuid;
begin
  if public.current_role() <> 'student' then raise exception 'Only student accounts can join a class'; end if;
  select id into class_uuid from public.classes where join_code=upper(trim(code_input)) and archived_at is null;
  if class_uuid is null then raise exception 'Class code not found'; end if;
  insert into public.class_members(class_id,student_id) values(class_uuid,(select auth.uid())) on conflict do nothing;
  return class_uuid;
end $$;

create or replace function public.create_guardian_invite()
returns text language plpgsql security definer set search_path=public
as $$
declare invite_code text;
begin
  if public.current_role() <> 'student' then raise exception 'Only student accounts can create a family code'; end if;
  update public.guardian_invites set claimed_at=now() where student_id=(select auth.uid()) and claimed_at is null;
  invite_code := upper(substr(encode(gen_random_bytes(6),'hex'),1,8));
  insert into public.guardian_invites(student_id,code) values((select auth.uid()),invite_code);
  return invite_code;
end $$;

create or replace function public.claim_guardian_invite(code_input text)
returns uuid language plpgsql security definer set search_path=public
as $$
declare invite public.guardian_invites%rowtype;
begin
  if public.current_role() <> 'parent' then raise exception 'Only parent accounts can use a family code'; end if;
  select * into invite from public.guardian_invites where code=upper(trim(code_input)) and claimed_at is null and expires_at>now() for update;
  if invite.id is null then raise exception 'Family code is invalid or has expired'; end if;
  insert into public.guardian_links(parent_id,student_id,status) values((select auth.uid()),invite.student_id,'approved') on conflict(parent_id,student_id) do update set status='approved';
  update public.guardian_invites set claimed_at=now() where id=invite.id;
  return invite.student_id;
end $$;

create or replace function public.record_assignment_submission(
  assignment_uuid uuid,
  score_input numeric default null,
  max_score_input numeric default null
)
returns uuid language plpgsql security definer set search_path=public
as $$
declare work public.assignments%rowtype; submission_uuid uuid;
begin
  if public.current_role() <> 'student' then raise exception 'Only student accounts can submit work'; end if;
  if not public.assignment_is_for_student(assignment_uuid) then raise exception 'This assignment is not available to you'; end if;
  select * into work from public.assignments where id=assignment_uuid;
  if work.status <> 'published' then raise exception 'This assignment is not open for submissions'; end if;
  if work.closes_at is not null and now()>work.closes_at then raise exception 'This assignment is closed'; end if;
  if now()>work.due_at and not work.allow_late then raise exception 'The due time has passed; ask your teacher to reopen this assignment'; end if;
  if (score_input is null) <> (max_score_input is null) then raise exception 'Score and maximum score must be supplied together'; end if;
  if score_input is not null and (score_input<0 or max_score_input<=0 or score_input>max_score_input) then raise exception 'Invalid score'; end if;
  insert into public.submissions(assignment_id,student_id,attempt_no,status,started_at,submitted_at,score,max_score,updated_at)
  values(assignment_uuid,(select auth.uid()),1,'submitted',now(),now(),score_input,max_score_input,now())
  on conflict(assignment_id,student_id,attempt_no) do update set status='submitted',submitted_at=now(),score=excluded.score,max_score=excluded.max_score,updated_at=now()
  returning id into submission_uuid;
  return submission_uuid;
end $$;

revoke all on function public.join_class_by_code(text) from public;
revoke all on function public.create_guardian_invite() from public;
revoke all on function public.claim_guardian_invite(text) from public;
revoke all on function public.record_assignment_submission(uuid,numeric,numeric) from public;
grant execute on function public.join_class_by_code(text), public.create_guardian_invite(), public.claim_guardian_invite(text), public.record_assignment_submission(uuid,numeric,numeric) to authenticated;

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.class_members enable row level security;
alter table public.guardian_links enable row level security;
alter table public.guardian_invites enable row level security;
alter table public.assignments enable row level security;
alter table public.assignment_targets enable row level security;
alter table public.submissions enable row level security;
alter table public.question_attempts enable row level security;

revoke all on all tables in schema public from anon;
revoke all on all tables in schema public from authenticated;
grant select on public.profiles,public.classes,public.class_members,public.guardian_links,public.assignments,public.assignment_targets,public.submissions,public.question_attempts to authenticated;
grant insert on public.classes,public.assignments,public.assignment_targets,public.question_attempts to authenticated;
grant update on public.classes,public.assignments to authenticated;
grant delete on public.classes,public.assignments,public.assignment_targets to authenticated;
grant update(full_name,year_level,updated_at) on public.profiles to authenticated;
grant usage,select on all sequences in schema public to authenticated;

create policy profiles_select on public.profiles for select to authenticated using (
  id=(select auth.uid()) or public.is_teacher_of(id) or public.is_guardian_of(id) or public.current_role()='admin'
);
create policy profiles_update_self on public.profiles for update to authenticated using (id=(select auth.uid())) with check (id=(select auth.uid()));

create policy classes_select on public.classes for select to authenticated using (
  teacher_id=(select auth.uid()) or public.is_class_student(id) or exists(select 1 from public.class_members cm where cm.class_id=id and public.is_guardian_of(cm.student_id)) or public.current_role()='admin'
);
create policy classes_insert_teacher on public.classes for insert to authenticated with check (teacher_id=(select auth.uid()) and public.current_role()='teacher');
create policy classes_update_teacher on public.classes for update to authenticated using (teacher_id=(select auth.uid()) and public.current_role()='teacher') with check (teacher_id=(select auth.uid()));
create policy classes_delete_teacher on public.classes for delete to authenticated using (teacher_id=(select auth.uid()) and public.current_role()='teacher');

create policy members_select on public.class_members for select to authenticated using (
  student_id=(select auth.uid()) or public.is_class_teacher(class_id) or public.is_guardian_of(student_id) or public.current_role()='admin'
);

create policy guardian_links_select on public.guardian_links for select to authenticated using (
  parent_id=(select auth.uid()) or student_id=(select auth.uid()) or public.current_role()='admin'
);

create policy assignments_select on public.assignments for select to authenticated using (
  teacher_id=(select auth.uid()) or public.assignment_is_for_student(id) or exists(select 1 from public.guardian_links gl where gl.parent_id=(select auth.uid()) and gl.status='approved' and public.assignment_is_for_student(id,gl.student_id)) or public.current_role()='admin'
);
create policy assignments_insert_teacher on public.assignments for insert to authenticated with check (
  teacher_id=(select auth.uid()) and public.current_role()='teacher' and public.is_class_teacher(class_id)
);
create policy assignments_update_teacher on public.assignments for update to authenticated using (teacher_id=(select auth.uid()) and public.current_role()='teacher') with check (teacher_id=(select auth.uid()) and public.is_class_teacher(class_id));
create policy assignments_delete_teacher on public.assignments for delete to authenticated using (teacher_id=(select auth.uid()) and public.current_role()='teacher');

create policy targets_select on public.assignment_targets for select to authenticated using (
  public.teacher_owns_assignment(assignment_id) or student_id=(select auth.uid()) or public.is_guardian_of(student_id) or public.current_role()='admin'
);
create policy targets_insert_teacher on public.assignment_targets for insert to authenticated with check (
  public.teacher_owns_assignment(assignment_id) and public.is_teacher_of(student_id)
);
create policy targets_delete_teacher on public.assignment_targets for delete to authenticated using (public.teacher_owns_assignment(assignment_id));

create policy submissions_select on public.submissions for select to authenticated using (
  student_id=(select auth.uid()) or public.teacher_owns_assignment(assignment_id) or public.is_guardian_of(student_id) or public.current_role()='admin'
);
create policy attempts_select on public.question_attempts for select to authenticated using (
  exists(select 1 from public.submissions s where s.id=submission_id and (s.student_id=(select auth.uid()) or public.teacher_owns_assignment(s.assignment_id) or public.is_guardian_of(s.student_id)))
);
create policy attempts_insert_student on public.question_attempts for insert to authenticated with check (
  exists(select 1 from public.submissions s where s.id=submission_id and s.student_id=(select auth.uid()))
);

-- Admin approval example (run from the SQL editor after verifying the teacher):
-- update public.profiles set status='active' where email='teacher@example.com' and role='teacher';

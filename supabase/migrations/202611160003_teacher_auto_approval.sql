-- Run after the account and student-ID setup. Automatically activate teacher sign-ups.
-- Public registration still cannot create an administrator. Suspended accounts stay suspended.
begin;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested text;
  safe_role public.user_role;
  learner_id text;
begin
  requested := coalesce(new.raw_user_meta_data->>'requested_role','student');
  safe_role := case
    when requested in ('student','teacher','parent') then requested::public.user_role
    else 'student'::public.user_role
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
    'active'::public.profile_status,
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

update public.profiles
set status='active', updated_at=now()
where role='teacher' and status='pending';

notify pgrst, 'reload schema';
commit;

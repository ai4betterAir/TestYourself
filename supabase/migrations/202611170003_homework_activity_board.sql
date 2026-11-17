-- Optional named activity feed. Run after family + teacher homework SQL setup.
-- Dashboard falls back to existing RLS reads if this RPC is not installed.
begin;
create or replace function public.get_homework_activity()
returns table(id uuid,parent_id uuid,teacher_id uuid,class_id uuid,student_id uuid,title text,subject text,year_level text,due_at timestamptz,allow_late boolean,submitted_at timestamptz,score integer,total integer,sender_name text,student_name text)
language sql stable security definer set search_path=public
as $$
 select h.id,h.parent_id,h.teacher_id,h.class_id,h.student_id,h.title,h.subject,h.year_level,h.due_at,h.allow_late,h.submitted_at,h.score,jsonb_array_length(h.questions),sender.full_name,learner.full_name
 from public.family_homework h
 join public.profiles learner on learner.id=h.student_id
 join public.profiles sender on sender.id=coalesce(h.teacher_id,h.parent_id)
 where public.current_role() is not null and (
  public.current_role()='admin'
  or (h.parent_id is not null and (h.student_id=auth.uid() or h.parent_id=auth.uid()) and exists(select 1 from public.guardian_links g where g.parent_id=h.parent_id and g.student_id=h.student_id and g.status='approved'))
  or (h.teacher_id is not null and (
    (h.teacher_id=auth.uid() and public.is_class_teacher(h.class_id))
    or (h.student_id=auth.uid() and public.is_class_student(h.class_id))
    or (public.is_guardian_of(h.student_id) and public.is_class_student(h.class_id,h.student_id))
  ))
 ) order by h.due_at;
$$;
revoke all on function public.get_homework_activity() from public,anon;
grant execute on function public.get_homework_activity() to authenticated;
notify pgrst,'reload schema';
commit;

-- Selective / workshop writing stored for the assigning teacher and linked parent.

create table if not exists public.writing_pieces (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  assignment_id uuid references public.assignments(id) on delete set null,
  topic text not null default 'Writing' check (char_length(topic) between 1 and 180),
  section text not null default 'Full piece' check (char_length(section) between 1 and 40),
  body text not null check (char_length(body) between 1 and 20000),
  word_count integer not null default 0 check (word_count >= 0),
  created_at timestamptz not null default now()
);

create index if not exists writing_pieces_student_idx on public.writing_pieces(student_id, created_at desc);
create index if not exists writing_pieces_assignment_idx on public.writing_pieces(assignment_id);

alter table public.writing_pieces enable row level security;
revoke all on public.writing_pieces from anon;
grant select, insert on public.writing_pieces to authenticated;

create policy writing_pieces_select on public.writing_pieces for select to authenticated using (
  student_id = (select auth.uid())
  or public.is_teacher_of(student_id)
  or public.is_guardian_of(student_id)
  or public.current_role() = 'admin'
);

create policy writing_pieces_insert on public.writing_pieces for insert to authenticated with check (
  student_id = (select auth.uid()) and public.current_role() = 'student'
);

create or replace function public.submit_writing_piece(
  topic_input text,
  section_input text,
  body_input text,
  word_count_input integer,
  assignment_uuid uuid default null
) returns uuid
language plpgsql security definer set search_path = public
as $$
declare piece_id uuid;
begin
  if public.current_role() <> 'student' then raise exception 'Only student accounts can submit writing'; end if;
  if body_input is null or length(trim(body_input)) < 1 then raise exception 'Write something before sending'; end if;
  if assignment_uuid is not null and not public.assignment_is_for_student(assignment_uuid) then
    raise exception 'That assignment is not available to you';
  end if;
  insert into public.writing_pieces(student_id, assignment_id, topic, section, body, word_count)
  values (
    (select auth.uid()),
    assignment_uuid,
    left(coalesce(nullif(trim(topic_input), ''), 'Writing'), 180),
    left(coalesce(nullif(trim(section_input), ''), 'Full piece'), 40),
    left(trim(body_input), 20000),
    greatest(coalesce(word_count_input, 0), 0)
  ) returning id into piece_id;
  return piece_id;
end $$;

revoke all on function public.submit_writing_piece(text, text, text, integer, uuid) from public;
grant execute on function public.submit_writing_piece(text, text, text, integer, uuid) to authenticated;

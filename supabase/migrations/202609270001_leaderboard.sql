-- Student year-level leaderboard with privacy-safe display names and performance badges.
-- Apply this migration in the connected Supabase project.

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
results as (
  select
    p.id as student_id,
    p.full_name,
    p.year_level,
    count(s.id)::bigint as completed_tests,
    round(avg(case when s.max_score > 0 then (s.score / s.max_score) * 100 else null end)::numeric, 1) as average_percent,
    round(sum(case when s.max_score > 0 then (s.score / s.max_score) * 100 else 0 end)::numeric, 0) as total_points
  from public.profiles p
  join public.submissions s on s.student_id = p.id
  cross join period_window w
  where p.role = 'student'
    and p.status = 'active'
    and p.year_level = year_level_input
    and s.status in ('submitted','graded','returned')
    and s.submitted_at is not null
    and s.submitted_at >= w.start_at
  group by p.id, p.full_name, p.year_level
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

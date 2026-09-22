# SkillUP account system setup

The website contains the complete student, teacher and parent interface, but real accounts require a Supabase project.

## 1. Create the backend

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/migrations/202609200001_skillup_accounts.sql`.
3. In **Authentication → URL Configuration**, set:
   - Site URL: `https://ai4betterair.github.io/TestYourself/`
   - Redirect URLs:
     - `https://ai4betterair.github.io/TestYourself/dashboard.html`
     - `https://ai4betterair.github.io/TestYourself/reset-password.html`
4. Keep email confirmation enabled.

## 2. Connect the website

Copy the Project URL and **publishable/anon** key into `js/supabase-config.js`.

Never place the service-role key in this repository. It bypasses database security and belongs only in a protected server environment.

## 3. Teacher approval

New teacher profiles are deliberately created with `pending` status. After checking the teacher, approve the account from the SQL editor:

```sql
update public.profiles
set status = 'active'
where email = 'teacher@example.com' and role = 'teacher';
```

## 4. Production checks

- Configure a branded SMTP provider for verification, password reset and assignment reminder emails.
- Review the Terms and Privacy pages with an Australian privacy/child-safety specialist before collecting children's personal information.
- Run role-isolation tests with separate student, teacher and parent accounts.
- Set up database backups and alerting.
- Add a server-side scheduled job for due-date reminders and weekly parent summaries.

The public anon key is safe in browser code only because Row Level Security protects every exposed table. Do not disable RLS.

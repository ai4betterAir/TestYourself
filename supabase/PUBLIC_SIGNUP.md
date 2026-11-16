# Student and guardian registration

The public form accepts students and parents/guardians (`parent` in the database). Teacher registration remains subject to administrator approval. MasterAdmin roles are never granted by public registration.

## Required Supabase settings

In the connected project `ozulajyjcttnpesvrbbm`:

1. Authentication → Sign In / Providers: enable **Allow new users to sign up**.
2. Open the **Email** provider: enable email/password sign-in and disable **Confirm email** for the requested registration flow without verification emails. Save.
3. Keep anonymous sign-ins disabled; these are regular email/password accounts.

Disabling confirmation means addresses are not verified. No SMTP is needed for these new sign-ups or password sign-in; email-based password recovery still needs a working email provider. Existing unconfirmed accounts may need confirmation through Authentication → Users.

## Database prerequisites

Apply the repository migrations in filename order once. The `on_auth_user_created` trigger must create `public.profiles` using `public.handle_new_user()`. Students receive their Student ID from the student-ID migration. Do not run the initial account migration again over existing tables.

## Acceptance check

Register a new student and a new guardian using separate real test addresses. Each should receive a session and its own role dashboard. Check Authentication → Users and public.profiles. Reusing a registered email should report that the account already exists. A guardian receives no access to a student until the existing Student ID linking/approval process is completed.

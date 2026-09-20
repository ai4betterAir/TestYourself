import { supabase, isSupabaseConfigured, showSetupNotice, friendlyError } from './supabase-client.js';

const setup = document.getElementById('setupNotice');
if (!isSupabaseConfigured) {
  showSetupNotice(setup);
  document.querySelectorAll('form button[type="submit"]').forEach(button => {
    button.disabled = true;
    button.title = 'Account access is not open yet';
  });
}

const message = (text, success = false) => {
  const node = document.getElementById('formMessage');
  if (!node) return;
  node.textContent = text;
  node.classList.toggle('success', success);
};

const setBusy = (form, busy) => {
  const button = form.querySelector('button[type="submit"]');
  button.disabled = busy;
  if (!button.dataset.label) button.dataset.label = button.textContent;
  button.textContent = busy ? 'Please wait…' : button.dataset.label;
};

const nextUrl = () => {
  const requested = new URLSearchParams(location.search).get('next');
  return requested && /^[a-z0-9][a-z0-9_.?=&%-]*$/i.test(requested) ? requested : 'dashboard.html';
};

const signInForm = document.getElementById('signInForm');
if (signInForm) signInForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!supabase) return message('Account service is not connected yet.');
  setBusy(signInForm, true); message('');
  const { error } = await supabase.auth.signInWithPassword({
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value
  });
  setBusy(signInForm, false);
  if (error) return message(friendlyError(error));
  location.replace(nextUrl());
});

const signUpForm = document.getElementById('signUpForm');
if (signUpForm) {
  const yearField = document.getElementById('yearField');
  signUpForm.addEventListener('change', event => {
    if (event.target.name === 'role') yearField.hidden = event.target.value !== 'student';
  });
  signUpForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!supabase) return message('Account service is not connected yet.');
    const role = new FormData(signUpForm).get('role');
    const password = document.getElementById('password').value;
    if (password !== document.getElementById('confirmPassword').value) return message('The passwords do not match.');
    setBusy(signUpForm, true); message('');
    const { data, error } = await supabase.auth.signUp({
      email: document.getElementById('email').value.trim(),
      password,
      options: {
        emailRedirectTo: new URL('dashboard.html', location.href).href,
        data: {
          full_name: document.getElementById('fullName').value.trim(),
          requested_role: role,
          year_level: role === 'student' ? document.getElementById('yearLevel').value : null
        }
      }
    });
    setBusy(signUpForm, false);
    if (error) return message(friendlyError(error));
    if (data.session) return location.replace('dashboard.html');
    const note = role === 'teacher'
      ? 'Check your email to verify the account. Teacher access will activate after approval.'
      : 'Check your email and click the verification link to finish creating your account.';
    message(note, true); signUpForm.reset(); yearField.hidden = false;
  });
}

const forgotForm = document.getElementById('forgotForm');
if (forgotForm) forgotForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!supabase) return message('Account service is not connected yet.');
  setBusy(forgotForm, true); message('');
  const { error } = await supabase.auth.resetPasswordForEmail(
    document.getElementById('email').value.trim(),
    { redirectTo: new URL('reset-password.html', location.href).href }
  );
  setBusy(forgotForm, false);
  if (error) return message(friendlyError(error));
  message('If an account uses that email, a reset link is on its way.', true);
});

const resetForm = document.getElementById('resetForm');
if (resetForm) resetForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!supabase) return message('Account service is not connected yet.');
  const password = document.getElementById('password').value;
  if (password !== document.getElementById('confirmPassword').value) return message('The passwords do not match.');
  setBusy(resetForm, true); message('');
  const { error } = await supabase.auth.updateUser({ password });
  setBusy(resetForm, false);
  if (error) return message(friendlyError(error));
  message('Password updated. Opening your dashboard…', true);
  setTimeout(() => location.replace('dashboard.html'), 900);
});

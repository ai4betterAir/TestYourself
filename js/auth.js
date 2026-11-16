import { supabase, isSupabaseConfigured, showSetupNotice, friendlyError } from './supabase-client.js?v=profile-setup-fix';

const setup = document.getElementById('setupNotice');
// Always use the public GitHub Pages callback, even when the form was opened from a local copy.
const PUBLIC_SITE_URL = 'https://ai4betterair.github.io/TestYourself/';
const publicAuthUrl = (path) => new URL(path, PUBLIC_SITE_URL).href;
const LOCAL_ACCOUNTS = 'skillupLocalAccounts';
const LOCAL_SESSION = 'skillupLocalSession';
const REMEMBERED_EMAIL = 'skillupRememberedEmail';
const localSkillupId = (accounts) => { let id; do { id = 'SU-' + String(Math.floor(Math.random() * 100000000)).padStart(8, '0'); } while (accounts.some((item) => item.skillupId === id)); return id; };

if (!isSupabaseConfigured) {
  showSetupNotice(setup);
  if (setup) setup.innerHTML = '<strong>Preview account mode.</strong> You can create a browser-only student, teacher or parent account now. Connect Supabase for secure multi-device accounts and shared dashboards.';
}

const message = (text, success = false) => {
  const node = document.getElementById('formMessage');
  if (!node) return;
  node.textContent = text;
  node.classList.toggle('success', success);
};

const setBusy = (form, busy) => {
  const button = form?.querySelector('button[type="submit"]');
  if (!button) return;
  button.disabled = busy;
  if (!button.dataset.label) button.dataset.label = button.textContent;
  button.textContent = busy ? 'Please wait…' : button.dataset.label;
};

const nextUrl = () => {
  const requested = new URLSearchParams(location.search).get('next');
  return requested && /^[a-z0-9][a-z0-9_.?=&%-]*$/i.test(requested) ? requested : 'dashboard.html';
};

const readLocalAccounts = () => {
  try {
    const accounts = JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS) || '[]');
    let changed = false;
    const migrated = accounts.map(account => {
      if (account.role === 'student' && !account.skillupId) {
        changed = true;
        return { ...account, skillupId: localSkillupId(accounts) };
      }
      return account;
    });
    if (changed) localStorage.setItem(LOCAL_ACCOUNTS, JSON.stringify(migrated));
    return migrated;
  } catch { return []; }
};
const writeLocalAccounts = (accounts) => localStorage.setItem(LOCAL_ACCOUNTS, JSON.stringify(accounts));
const localSession = (account) => {
  localStorage.setItem(LOCAL_SESSION, JSON.stringify({
    email: account.email, fullName: account.fullName, role: account.role,
    yearLevel: account.yearLevel || null, skillupId: account.skillupId || null, signedInAt: new Date().toISOString()
  }));
};
const hashPassword = async (password) => {
  if (!window.crypto?.subtle) throw new Error('Secure browser storage is unavailable. Please use a modern browser.');
  const bytes = new TextEncoder().encode(password);
  const digest = await window.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((x) => x.toString(16).padStart(2, '0')).join('');
};
const localDashboard = (account) => {
  localSession(account);
  location.replace('dashboard.html');
};
const rememberEmail = (email, remember) => {
  if (remember) localStorage.setItem(REMEMBERED_EMAIL, email);
  else localStorage.removeItem(REMEMBERED_EMAIL);
};

const emailInput = document.getElementById('email');
if (emailInput) {
  const remembered = localStorage.getItem(REMEMBERED_EMAIL);
  if (remembered) { emailInput.value = remembered; const rememberBox = document.getElementById('rememberMe'); if (rememberBox) rememberBox.checked = true; }
}

const signInForm = document.getElementById('signInForm');
if (signInForm) signInForm.addEventListener('submit', async event => {
  event.preventDefault();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const remember = Boolean(document.getElementById('rememberMe')?.checked);

  if (!supabase) {
    setBusy(signInForm, true); message('');
    try {
      const account = readLocalAccounts().find((item) => item.email === email);
      if (!account || account.passwordHash !== await hashPassword(password)) {
        setBusy(signInForm, false);
        return message('Email or password is not correct. Create a preview account first.');
      }
      rememberEmail(email, remember);
      setBusy(signInForm, false);
      return localDashboard(account);
    } catch (error) {
      setBusy(signInForm, false);
      return message(error.message || 'Could not sign in.');
    }
  }

  setBusy(signInForm, true); message('');
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  setBusy(signInForm, false);
  if (error) return message(friendlyError(error));
  rememberEmail(email, remember);
  location.replace(nextUrl());
});

const signUpForm = document.getElementById('signUpForm');
if (signUpForm) {
  const yearField = document.getElementById('yearField');
  const updateRoleFields = () => {
    const role = new FormData(signUpForm).get('role');
    if (yearField) yearField.hidden = role !== 'student';
    const roleLabel = role === 'parent' ? 'parent / guardian' : role;
    const button = document.getElementById('createAccountButton');
    if (button && signUpForm.dataset.submitting !== 'true') {
      button.textContent = 'Create ' + roleLabel + ' account';
      button.dataset.label = button.textContent;
    }
    const help = document.getElementById('roleHelp');
    if (help) help.textContent = role === 'parent'
      ? 'Create your own guardian account. After signing in, request a link using your child’s Student ID. Your child must approve the connection.'
      : role === 'teacher' ? 'Create a teacher account to set up your classes and assign learning activities.'
      : 'Choose your school year to open your student dashboard.';
  };
  signUpForm.addEventListener('change', event => {
    if (event.target.name === 'role') updateRoleFields();
  });
  updateRoleFields();

  signUpForm.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(signUpForm);
    const role = data.get('role');
    const email = document.getElementById('email').value.trim().toLowerCase();
    const fullName = document.getElementById('fullName').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirmPassword').value;
    const yearLevel = role === 'student' ? document.getElementById('yearLevel').value : null;

    if (password !== confirm) return message('The passwords do not match.');
    if (password.length < 10) return message('Use a password with at least 10 characters.');

    if (!fullName) return message('Enter your full name.');
    if (!['student', 'parent', 'teacher'].includes(role)) return message('Choose an account type.');
    if (role === 'student' && !['K', '1', '2', '3', '4', '5', '6'].includes(yearLevel)) return message('Choose your school year.');
    if (!document.getElementById('terms').checked) return message('Please agree to the Terms and Privacy Policy.');

    if (!supabase) {
      if (readLocalAccounts().some((item) => item.email === email)) return message('An account already exists for this email. Sign in instead.');
      setBusy(signUpForm, true); message('');
      try {
        const existingAccounts = readLocalAccounts();
        const account = { email, fullName, role, yearLevel, skillupId: role === 'student' ? localSkillupId(existingAccounts) : null, passwordHash: await hashPassword(password), createdAt: new Date().toISOString() };
        writeLocalAccounts([...readLocalAccounts(), account]);
        rememberEmail(email, true);
        return localDashboard(account);
      } catch (error) {
        setBusy(signUpForm, false);
        return message(error.message || 'Could not create the account.');
      }
    }

    if (signUpForm.dataset.submitting === 'true') return;
    signUpForm.dataset.submitting = 'true';
    setBusy(signUpForm, true);
    message('Creating your account…');
    try {
      const { data: result, error } = await supabase.auth.signUp({
        email, password,
        options: {
          emailRedirectTo: publicAuthUrl('dashboard.html'),
          data: { full_name: fullName, requested_role: role, year_level: yearLevel }
        }
      });
      if (error) return message(friendlyError(error));
      const user = result?.user;
      if (user && Array.isArray(user.identities) && user.identities.length === 0) {
        return message('An account already exists for this email. Please sign in, or use Forgot password to reset your password.');
      }
      if (!user) return message('The account service returned no account details. Please try again.');
      rememberEmail(email, true);
      if (result.session) {
        message('Account created. Opening your dashboard…', true);
        return location.replace('dashboard.html');
      }
      const note = 'Your registration was received. Check your email, including Spam, and click the verification link to finish signing up. If you registered earlier, you can also sign in.';
      message(note, true);
    } catch (error) {
      message(friendlyError(error));
    } finally {
      signUpForm.dataset.submitting = 'false';
      setBusy(signUpForm, false);
    }
  });
}

const forgotForm = document.getElementById('forgotForm');
if (forgotForm) forgotForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!supabase) return message('Password reset needs the connected Supabase account service.');
  setBusy(forgotForm, true); message('');
  const { error } = await supabase.auth.resetPasswordForEmail(
    document.getElementById('email').value.trim(),
    { redirectTo: publicAuthUrl('reset-password.html') }
  );
  setBusy(forgotForm, false);
  if (error) return message(friendlyError(error));
  message('If an account uses that email, a reset link is on its way.', true);
});

const resetForm = document.getElementById('resetForm');
if (resetForm) resetForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!supabase) return message('Password reset needs the connected Supabase account service.');
  const password = document.getElementById('password').value;
  if (password !== document.getElementById('confirmPassword').value) return message('The passwords do not match.');
  setBusy(resetForm, true); message('');
  const { error } = await supabase.auth.updateUser({ password });
  setBusy(resetForm, false);
  if (error) return message(friendlyError(error));
  message('Password updated. Opening your dashboard…', true);
  setTimeout(() => location.replace('dashboard.html'), 900);
});

import { supabase } from './supabase-client.js?v=profile-setup-fix';

const form = document.getElementById('forgotForm');
const input = document.getElementById('email');
const button = document.getElementById('sendResetButton');
const label = document.getElementById('sendResetLabel');
const message = document.getElementById('formMessage');
const request = document.getElementById('recoveryRequest');
const success = document.getElementById('recoverySuccess');
const summary = document.getElementById('recoveryEmailSummary');
const returnLink = document.querySelector('.recovery-return');
let submitting = false;

try {
  const remembered = window.localStorage.getItem('skillupRememberedEmail');
  if (remembered) input.value = remembered;
} catch { /* Recovery still works if browser storage is disabled. */ }

function recoveryError(error) {
  if (error?.status === 429 || /rate.limit|too many requests/i.test(error?.message || '')) {
    return 'Please wait a few minutes before requesting another reset link.';
  }
  if (/failed to fetch|network|load failed/i.test(error?.message || '')) {
    return 'We couldn’t connect. Check your internet connection and try again.';
  }
  return 'We couldn’t send the reset link right now. Please try again in a few minutes. If this continues, visit our support page.';
}

if (!supabase) {
  button.disabled = true;
  message.textContent = 'Account recovery is temporarily unavailable. Please try again later.';
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (submitting || !supabase || !form.reportValidity()) return;
  const email = input.value.trim().toLowerCase();
  submitting = true;
  button.disabled = true;
  form.setAttribute('aria-busy', 'true');
  label.textContent = 'Sending your link…';
  message.textContent = '';
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://ai4betterair.github.io/TestYourself/reset-password.html'
    });
    if (error) throw error;
    summary.textContent = email;
    request.hidden = true;
    success.hidden = false;
    returnLink.hidden = true;
    document.getElementById('recovery-success-heading').focus();
  } catch (error) {
    message.textContent = recoveryError(error);
  } finally {
    submitting = false;
    button.disabled = false;
    form.setAttribute('aria-busy', 'false');
    label.textContent = 'Send reset link';
  }
});

document.getElementById('useAnotherEmail').addEventListener('click', () => {
  success.hidden = true;
  request.hidden = false;
  returnLink.hidden = false;
  summary.textContent = '';
  message.textContent = '';
  input.value = '';
  input.focus();
});

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const config = window.SKILLUP_SUPABASE || {};

export const isSupabaseConfigured = Boolean(
  config.url &&
  config.anonKey &&
  !config.url.includes('YOUR_SUPABASE') &&
  !config.anonKey.includes('YOUR_SUPABASE')
);

export const supabase = isSupabaseConfigured
  ? createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export function showSetupNotice(target) {
  if (isSupabaseConfigured) return false;
  const node = typeof target === 'string' ? document.querySelector(target) : target;
  if (node) {
    node.hidden = false;
    node.innerHTML = '<strong>Account access is being prepared.</strong> You can explore realistic student, teacher and parent dashboard previews now. <a href="accounts.html">View the account experience →</a>';
  }
  return true;
}

export async function requireUser() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    const next = encodeURIComponent(location.pathname.split('/').pop() + location.search);
    location.replace(`sign-in.html?next=${next}`);
    return null;
  }
  return data.user;
}

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export function friendlyError(error) {
  const message = error?.message || 'Something went wrong. Please try again.';
  if (/invalid login credentials/i.test(message)) return 'The email or password is not correct.';
  if (/email not confirmed/i.test(message)) return 'Please verify your email before signing in.';
  if (/user already registered/i.test(message)) return 'An account already exists for this email. Try signing in.';
  if (/password/i.test(message) && /characters/i.test(message)) return 'Use a password with at least 10 characters.';
  return message;
}

export function formatDate(value, withTime = false) {
  if (!value) return 'No due date';
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
    ...(withTime ? { hour: 'numeric', minute: '2-digit' } : {})
  }).format(new Date(value));
}

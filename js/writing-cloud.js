import { supabase, isSupabaseConfigured } from './supabase-client.js?v=20260923';

export async function submitWritingToDashboard({ topic, section, body, wordCount, assignmentId }) {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, reason: 'Accounts are not connected on this site yet. Use email or download.' };
  }
  const { data: sessionData } = await supabase.auth.getUser();
  if (!sessionData?.user) {
    return { ok: false, reason: 'Sign in as a student first so the teacher and parent can see this on the dashboard.' };
  }
  const { data, error } = await supabase.rpc('submit_writing_piece', {
    topic_input: topic,
    section_input: section,
    body_input: body,
    word_count_input: wordCount,
    assignment_uuid: assignmentId || null
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true, id: data };
}

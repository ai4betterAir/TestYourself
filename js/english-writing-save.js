import { submitWritingToDashboard } from './writing-cloud.js?v=20260923';

const byId = (id) => document.getElementById(id);
const wordCount = (text) => {
  const value = String(text || '').trim();
  return value ? (value.match(/\b[\w'-]+\b/g) || []).length : 0;
};
const setStatus = (message, kind = '') => {
  const box = byId('writingCloudStatus');
  if (!box) return;
  box.textContent = message;
  box.className = 'writing-cloud-status' + (kind ? ' ' + kind : '');
};
const payload = () => {
  const params = new URLSearchParams(location.search);
  const body = byId('writingBox')?.value.trim() || '';
  return {
    topic: byId('writingTitle')?.textContent.trim() || 'English writing',
    section: byId('writingType')?.textContent.trim() || 'Writing',
    body,
    wordCount: wordCount(body),
    assignmentId: params.get('assignment') || null,
    grade: byId('gradeSelect')?.value || params.get('grade') || '1',
    lesson: params.get('lesson') || '0'
  };
};
const saveLocal = (p, message = 'Draft saved on this device.') => {
  if (!p.body) { setStatus('Write something before saving.', 'error'); return false; }
  localStorage.setItem(`skillup-writing-${p.grade}-${p.lesson}`, p.body);
  setStatus(message, 'success');
  return true;
};
function bind() {
  const save = byId('saveWriting');
  const send = byId('sendWriting');
  const originalSave = save?.onclick;
  if (!save || !send || save.dataset.cloudBound) return;
  save.dataset.cloudBound = '1';
  save.onclick = () => {
    if (originalSave) originalSave();
    const p = payload();
    saveLocal(p);
  };
  send.onclick = async () => {
    const p = payload();
    if (!p.body) { setStatus('Write something before sending.', 'error'); return; }
    if (originalSave) originalSave();
    send.disabled = true;
    send.textContent = 'Sending…';
    setStatus('Sending your writing securely to the dashboard…');
    try {
      const result = await submitWritingToDashboard({
        topic: p.topic, section: p.section, body: p.body,
        wordCount: p.wordCount, assignmentId: p.assignmentId
      });
      if (result.ok) setStatus('Sent successfully. Your teacher and linked parent can now view it in their dashboard.', 'success');
      else setStatus(result.reason || 'Please sign in as a student before sending.', 'error');
    } catch (error) {
      setStatus(error.message || 'Could not send the writing right now.', 'error');
    } finally {
      send.disabled = false;
      send.textContent = 'Send to teacher and parent dashboard →';
    }
  };
}
document.addEventListener('DOMContentLoaded', bind);
setTimeout(bind, 250);
setTimeout(bind, 1000);

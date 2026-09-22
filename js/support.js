(() => {
  const button = document.getElementById('copySupportReport');
  const page = document.getElementById('supportPage');
  const problem = document.getElementById('supportProblem');
  const status = document.getElementById('supportCopyStatus');
  if (!button || !page || !problem || !status) return;

  button.addEventListener('click', async () => {
    const report = [
      'SkillUP issue report',
      `Page or topic: ${page.value.trim() || 'Not provided'}`,
      `Problem: ${problem.value.trim() || 'Not provided'}`,
      `Browser page: ${location.href}`,
      'Personal information removed: Yes'
    ].join('\n');
    try {
      await navigator.clipboard.writeText(report);
      status.textContent = 'Report copied. Please check it once before sending.';
    } catch {
      problem.value = report;
      problem.focus();
      problem.select();
      status.textContent = 'Copy was blocked. The complete report is now selected in the text box; copy it manually.';
    }
  });
})();

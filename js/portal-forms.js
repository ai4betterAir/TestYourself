document.querySelectorAll('[data-toggle-password]').forEach(button => {
  button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.togglePassword);
    const reveal = input.type === 'password';
    input.type = reveal ? 'text' : 'password';
    button.textContent = reveal ? 'Hide' : 'Show';
    button.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
  });
});
if (new URLSearchParams(location.search).get('next') === 'masteradmin.html') {
  document.getElementById('signInTitle').textContent = 'Developer sign in';
  document.getElementById('developerNote').hidden = false;
}

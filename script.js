const avatarBtn = document.getElementById('avatarBtn');
const dropdown = document.getElementById('dropdown');

avatarBtn.addEventListener('click', () => {
  const isOpen = dropdown.classList.toggle('open');
  avatarBtn.setAttribute('aria-expanded', isOpen);
});

document.addEventListener('click', (e) => {
  if (!avatarBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.remove('open');
    avatarBtn.setAttribute('aria-expanded', false);
  }
});

avatarBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    avatarBtn.click();
  }
});
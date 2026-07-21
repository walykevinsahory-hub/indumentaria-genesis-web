const menuButton = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('active');
  menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

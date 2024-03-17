const menuBtn = document.querySelector('.hamburger');
const menuItems = document.querySelector('.menu-items');
menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('active');
  menuItems.classList.toggle('menu-show');
});


const navLinks = document.querySelectorAll('.nav-item');
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    menuItems.classList.remove('menu-show');
  });
});

const main = document.querySelector('main');
main.addEventListener('click', () => {
  menuItems.classList.remove('menu-show');
});

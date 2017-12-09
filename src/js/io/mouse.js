document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  const menu = document.querySelector('.main-menu');

  menuBtn.addEventListener('click', () =>
    menu.className = menu.className === 'main-menu show' ? 'main-menu' : 'main-menu show'
  );
});

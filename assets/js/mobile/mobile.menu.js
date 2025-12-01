// assets/js/mobile/mobile.menu.js

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  const hamburger = document.querySelector('[data-mobile-menu-toggle]');
  const overlay   = document.querySelector('[data-mobile-menu-overlay]');
  const list      = overlay ? overlay.querySelector('.hn-mobile-menu-list') : null;

  if (!hamburger || !overlay || !list) return;

  function openMenu() {
    overlay.classList.add('open');
    hamburger.classList.add('active');
    body.classList.add('hn-no-scroll');
  }

  function closeMenu() {
    overlay.classList.remove('open');
    hamburger.classList.remove('active');
    body.classList.remove('hn-no-scroll');
  }

  hamburger.addEventListener('click', () => {
    if (overlay.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeMenu();
    }
  });

  list.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    closeMenu();
  });

  // Escape key closes menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) {
      closeMenu();
    }
  });
});

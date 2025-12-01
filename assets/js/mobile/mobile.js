// =====================================================
// Honest News Mobile Framework (FULL OVERWRITE)
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
});

/* ========================================
   MOBILE MENU
======================================== */
function initMobileMenu() {
  const openBtn = document.getElementById("mobileMenuBtn");
  const closeBtn = document.getElementById("mobileCloseBtn");
  const panel = document.getElementById("mobileMenu");

  if (!openBtn || !closeBtn || !panel) return;

  openBtn.addEventListener("click", () => {
    document.body.classList.add("menu-open");
    panel.classList.add("open");
  });

  closeBtn.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
    panel.classList.remove("open");
  });
}
// assets/js/mobile/mobile.js
// Master mobile boot file – imports all modules

import './mobile.menu.js';
import './mobile.nav.js';
import './mobile.hero.js';
import './mobile.cards.js';
import './mobile.swipe.js';
import './mobile.player.js';

// You can put global mobile-only logic here later if needed.

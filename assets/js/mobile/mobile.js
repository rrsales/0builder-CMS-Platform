// assets/js/mobile/mobile.js
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("mobileMenuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeBtn = document.getElementById("mobileMenuClose");
  const OVERLAY_ID = "hn-mobile-overlay";

  if (!toggle || !mobileMenu) return;

  function ensureOverlay() {
    let overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = OVERLAY_ID;
      document.body.appendChild(overlay);
      overlay.addEventListener("click", closeMenu);
    }
    return overlay;
  }

  function openMenu() {
    mobileMenu.classList.add("open");
    const overlay = ensureOverlay();
    overlay.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileMenu.classList.remove("open");
    const overlay = document.getElementById(OVERLAY_ID);
    if (overlay) overlay.style.display = "none";
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    if (mobileMenu.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMenu();
    });
  }

  // prevent clicks inside panel from bubbling up to document
  mobileMenu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // ESC to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("open")) {
      closeMenu();
    }
  });
});





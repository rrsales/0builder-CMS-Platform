// Mobile nav toggle library
window.HN = window.HN || {};

(function () {
  function initMobileMenu() {
    const toggle = document.getElementById("mobileMenuToggle");
    const menu = document.getElementById("mobileMenu");
    const closeBtn = document.getElementById("mobileMenuClose");

    if (!toggle || !menu) return;

    function open() {
      menu.classList.add("is-open");
      document.body.classList.add("hn-no-scroll");
    }

    function close() {
      menu.classList.remove("is-open");
      document.body.classList.remove("hn-no-scroll");
    }

    toggle.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);

    menu.addEventListener("click", (e) => {
      if (e.target === menu) close();
    });
  }

  window.HN.initMobileMenu = initMobileMenu;
})();

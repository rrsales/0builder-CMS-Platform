// assets/js/mobile/mobile.js
document.addEventListener("DOMContentLoaded", function () {
  // Try to find the desktop nav UL
  const desktopMenu =
    document.getElementById("menuList") ||
    document.getElementById("nav-menu") ||
    document.querySelector(".desktop-nav ul") ||
    document.querySelector(".hn-nav ul");

  // Try to find the hamburger toggle
  const toggle =
    document.getElementById("mobileMenuToggle") ||
    document.querySelector(".hn-mobile-toggle");

  // Try to find or create the mobile menu shell
  let mobileMenu = document.getElementById("mobileMenu");
  let mobileList = document.getElementById("mobileNavMenu");

  if (!mobileMenu) {
    mobileMenu = document.createElement("nav");
    mobileMenu.id = "mobileMenu";
    mobileMenu.className = "hn-mobile-menu";
    mobileMenu.setAttribute("aria-label", "Mobile navigation");
    mobileMenu.innerHTML = `
      <div class="hn-mobile-menu-header">
        <span class="hn-mobile-menu-title">Menu</span>
        <button id="mobileMenuClose" aria-label="Close menu">×</button>
      </div>
      <ul id="mobileNavMenu"></ul>
    `;
    document.body.appendChild(mobileMenu);
    mobileList = mobileMenu.querySelector("#mobileNavMenu");
  } else if (!mobileList) {
    mobileList = mobileMenu.querySelector("ul");
  }

  // If we don't have the key pieces, bail quietly
  if (!desktopMenu || !toggle || !mobileList) {
    return;
  }

  // Build the mobile menu from the desktop menu
  function syncMenus() {
    mobileList.innerHTML = "";
    desktopMenu.querySelectorAll("a").forEach((a) => {
      const li = document.createElement("li");
      const link = a.cloneNode(true);
      link.removeAttribute("id"); // avoid duplicate IDs
      li.appendChild(link);
      mobileList.appendChild(li);
    });
  }

  syncMenus();

  // Overlay behind the drawer
  let overlay = document.querySelector(".hn-mobile-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "hn-mobile-overlay";
    document.body.appendChild(overlay);
  }

  const closeBtn =
    document.getElementById("mobileMenuClose") ||
    mobileMenu.querySelector("button[aria-label='Close menu']");

  function openMenu() {
    document.body.classList.add("hn-mobile-open");
    mobileMenu.classList.add("open");
    overlay.classList.add("open");
  }

  function closeMenu() {
    document.body.classList.remove("hn-mobile-open");
    mobileMenu.classList.remove("open");
    overlay.classList.remove("open");
  }

  toggle.addEventListener("click", function () {
    if (mobileMenu.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  // Close when a link is tapped
  mobileList.addEventListener("click", function (e) {
    if (e.target.tagName.toLowerCase() === "a") {
      closeMenu();
    }
  });

  // Re-sync links if layout changes
  window.addEventListener("resize", syncMenus);
});




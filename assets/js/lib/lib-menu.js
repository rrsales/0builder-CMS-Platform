// Menu library – builds desktop + mobile menus from JSON
window.HN = window.HN || {};

(function (HN) {
  function buildLink(item, currentPageId) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = item.href;
    a.textContent = item.label;
    if (item.id === currentPageId) {
      a.classList.add("active");
    }
    li.appendChild(a);
    return li;
  }

  HN.renderMenu = function (data) {
    const currentPageId = HN.getCurrentPageId();
    const menu = data.site && data.site.menu ? data.site.menu : [];

    const desktopUl = document.querySelector("#menuList");
    const mobileUl = document.querySelector("#mobileNavMenu");

    if (desktopUl) desktopUl.innerHTML = "";
    if (mobileUl) mobileUl.innerHTML = "";

    menu.forEach((item) => {
      if (desktopUl) desktopUl.appendChild(buildLink(item, currentPageId));
      if (mobileUl) mobileUl.appendChild(buildLink(item, currentPageId));
    });
  };
})(window.HN);

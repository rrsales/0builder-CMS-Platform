/* assets/js/live.js
   Honest News – Live runtime
   - Loads site-data.json
   - Builds navigation from site.menu
   - Exposes a small HN namespace so we can add hero/blocks later without trampling menu
*/

(function () {
  "use strict";

  const SITE_DATA_URL = "site-data.json";
  const HN = {
    site: null,
    currentPage: null
  };
  window.HN = HN; // expose for debugging later if needed

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    try {
      const data = await loadSiteData();
      HN.site = data || {};
      HN.currentPage = getCurrentPage(HN.site);

      // --- MENU MODULE ONLY (frozen) ---
      buildMenu(HN.site.menu || []);
      setupMobileToggle();
      // ---------------------------------

      // Later we can add:
      // applyHero(HN.currentPage);
      // renderBlocks(HN.currentPage);
    } catch (err) {
      console.error("HN live.js init failed:", err);
    }
  }

  /* ============================
     LOAD site-data.json
  ============================ */
  async function loadSiteData() {
    // cache bust to avoid stale JSON during editing
    const url = SITE_DATA_URL + "?_=" + Date.now();
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.warn("Could not load site-data.json, status:", res.status);
      return fallbackSite();
    }
    const json = await res.json();
    if (!json || typeof json !== "object") {
      console.warn("site-data.json was not an object, using fallback");
      return fallbackSite();
    }
    return json;
  }

  function fallbackSite() {
    // very small safe fallback so nav never completely dies
    return {
      menu: [
        { id: "home", label: "Home", url: "index.html", type: "link", showOn: "both", subItems: [] }
      ],
      pages: [
        { slug: "home", title: "Home", hero: {}, blocks: [] }
      ]
    };
  }

  /* ============================
     PAGE DETECTION
  ============================ */
  function getCurrentPage(site) {
    const pages = site.pages || [];
    if (!pages.length) return null;

    const body = document.body || document.querySelector("body");
    const slug = (body && body.dataset && body.dataset.page) ? body.dataset.page : null;

    if (!slug) return pages[0];

    const found = pages.find(p => p.slug === slug);
    return found || pages[0];
  }

  /* ============================
     MENU MODULE (FROZEN)
     - Reads site.menu
     - Renders into:
       [data-hn-nav="main"]   (desktop/top)
       [data-hn-nav="mobile"] (mobile panel – optional)
  ============================ */

  function buildMenu(menuItems) {
    if (!Array.isArray(menuItems)) return;

    const mainNav = document.querySelector('[data-hn-nav="main"]');
    const mobileNav = document.querySelector('[data-hn-nav="mobile"]');

    if (!mainNav && !mobileNav) {
      console.warn("HN menu: no nav containers found (data-hn-nav=\"main\" / \"mobile\")");
      return;
    }

    // Build main nav
    if (mainNav) {
      mainNav.innerHTML = "";
      const ul = document.createElement("ul");
      ul.className = "hn-nav-list hn-nav-list-main";

      menuItems.forEach(item => {
        const li = buildMenuItem(item, "desktop");
        if (li) ul.appendChild(li);
      });

      mainNav.appendChild(ul);
    }

    // Build mobile nav (simple stacked list)
    if (mobileNav) {
      mobileNav.innerHTML = "";
      const ul = document.createElement("ul");
      ul.className = "hn-nav-list hn-nav-list-mobile";

      menuItems.forEach(item => {
        const li = buildMenuItem(item, "mobile");
        if (li) ul.appendChild(li);
      });

      mobileNav.appendChild(ul);
    }
  }

  function buildMenuItem(item, context) {
    // item: { id, label, url, type, showOn, subItems[] }
    if (!item || !item.label) return null;

    const showOn = item.showOn || "both";
    if (context === "desktop" && showOn === "mobile") return null;
    if (context === "mobile" && showOn === "desktop") return null;

    const li = document.createElement("li");
    li.className = "hn-nav-item";

    if (item.type === "mega" && Array.isArray(item.subItems) && item.subItems.length) {
      li.classList.add("hn-nav-item-mega");

      const link = document.createElement("a");
      link.href = item.url || "#";
      link.textContent = item.label;
      link.className = "hn-nav-link";
      li.appendChild(link);

      if (context === "desktop") {
        // Desktop mega dropdown
        const panel = document.createElement("div");
        panel.className = "hn-mega-panel";

        const inner = document.createElement("div");
        inner.className = "hn-mega-inner";

        item.subItems.forEach(sub => {
          const block = document.createElement("a");
          block.className = "hn-mega-item";
          block.href = sub.url || "#";

          const title = document.createElement("div");
          title.className = "hn-mega-title";
          title.textContent = sub.label || "";

          const desc = document.createElement("div");
          desc.className = "hn-mega-desc";
          desc.textContent = sub.description || "";

          block.appendChild(title);
          if (sub.description) block.appendChild(desc);

          inner.appendChild(block);
        });

        panel.appendChild(inner);
        li.appendChild(panel);
      } else {
        // Mobile: flatten into simple child list
        const innerList = document.createElement("ul");
        innerList.className = "hn-sub-list";

        item.subItems.forEach(sub => {
          const subLi = document.createElement("li");
          subLi.className = "hn-sub-item";

          const subLink = document.createElement("a");
          subLink.href = sub.url || "#";
          subLink.textContent = sub.label || "";
          subLink.className = "hn-sub-link";

          subLi.appendChild(subLink);
          innerList.appendChild(subLi);
        });

        li.appendChild(innerList);
      }
    } else {
      // Simple link item
      const link = document.createElement("a");
      link.href = item.url || "#";
      link.textContent = item.label;
      link.className = "hn-nav-link";
      li.appendChild(link);
    }

    // Mark active based on current page slug vs URL
    try {
      const page = HN.currentPage;
      if (page && page.slug) {
        const slug = page.slug.toLowerCase();
        if (item.url && item.url.toLowerCase().indexOf(slug) !== -1) {
          li.classList.add("is-active");
        }
      }
    } catch (e) {
      // no-op if we can't match
    }

    return li;
  }

  /* ============================
     MOBILE TOGGLE
     - Uses [data-hn-nav-toggle]
     - Adds/removes .hn-nav-open on <body>
  ============================ */
  function setupMobileToggle() {
    const toggle = document.querySelector("[data-hn-nav-toggle]");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      document.body.classList.toggle("hn-nav-open");
    });
  }

})();






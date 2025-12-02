// assets/js/live.js
// Front-end "live engine" for Honest News
// - Loads site-data.json saved by your Dashboard
// - Renders: brand, menu (including mega menu), hero, and blocks

(function () {
  let site = {
    menu: [],
    pages: [],
    heroSlides: [],
    brand: {}
  };

  function ensureShape() {
    if (!Array.isArray(site.menu)) site.menu = [];
    if (!Array.isArray(site.pages)) site.pages = [];
    if (!Array.isArray(site.heroSlides)) site.heroSlides = [];
    if (!site.brand || typeof site.brand !== "object") site.brand = {};
  }

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    // 1) Load site-data.json created by Dashboard
    try {
      const res = await fetch("site-data.json?cache-bust=" + Date.now());
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === "object") {
          site = data;
        }
      }
    } catch (e) {
      console.error("Could not load site-data.json; using defaults.", e);
    }

    ensureShape();

    // 2) Find which page we're on (based on <body data-page="slug">)
    const currentPage = pickCurrentPage(site.pages);

    // 3) Apply theme + brand + menu + hero + blocks
    applyTheme(currentPage);
    renderBrand(site.brand);
    renderMenu(site, currentPage);
    renderHero(currentPage);
    renderBlocks(currentPage);
  }

  /* ============================
     PAGE PICKING
  ============================ */

  function pickCurrentPage(pages) {
    const body = document.body;
    const slugAttr = body ? body.getAttribute("data-page") : null;

    if (!Array.isArray(pages)) pages = [];

    let found = null;
    if (slugAttr) {
      found = pages.find((p) => p.slug === slugAttr);
    }

    if (!found) {
      // fall back to "home" or first page
      found = pages.find((p) => p.slug === "home") || pages[0] || {
        title: "Home",
        slug: "home",
        theme: "dark",
        hero: {
          overlay: "Honest News",
          sub: "Biblical Truth.",
          transparentMenu: false,
          size: "full"
        },
        blocks: []
      };
    }
    return found;
  }

  /* ============================
     THEME & BRAND
  ============================ */

  function applyTheme(page) {
    const body = document.body;
    if (!body || !page) return;

    body.classList.remove("theme-light", "theme-dark");

    const theme = page.theme === "light" ? "light" : "dark";
    body.classList.add("theme-" + theme);
  }

  function renderBrand(brand) {
    const titleEl = document.querySelector("[data-brand-title]");
    const subEl = document.querySelector("[data-brand-sub]");
    const footerEl = document.querySelector("[data-brand-footer]");
    const ctaLabelEl = document.querySelector("[data-header-cta-label]");

    const title =
      (brand && brand.title) || "HONEST NEWS";
    const sub =
      (brand && brand.sub) || "Biblical Truth · Podcast · Resources";
    const footer =
      (brand && brand.footer) || "Honest News";
    const ctaLabel =
      (brand && brand.ctaLabel) || "Listen";

    if (titleEl) titleEl.textContent = title;
    if (subEl) subEl.textContent = sub;
    if (footerEl) footerEl.textContent = footer;
    if (ctaLabelEl) ctaLabelEl.textContent = ctaLabel;
  }

  /* ============================
     MENU (NORMAL + MEGA)
  ============================ */

  function renderMenu(site, currentPage) {
    const desktopList = document.getElementById("menuList");
    const mobileList = document.getElementById("mobileNavMenu");

    if (!desktopList && !mobileList) return;

    const menu = Array.isArray(site.menu) ? site.menu : [];
    const currentSlug = (currentPage && currentPage.slug) || "home";
    const currentFile = getCurrentFilename();

    if (desktopList) desktopList.innerHTML = "";
    if (mobileList) mobileList.innerHTML = "";

    menu.forEach((item) => {
      const showOn = item.showOn || "both";

      if (desktopList && (showOn === "both" || showOn === "desktop")) {
        desktopList.appendChild(
          buildDesktopMenuItem(item, currentSlug, currentFile)
        );
      }

      if (mobileList && (showOn === "both" || showOn === "mobile")) {
        mobileList.appendChild(
          buildMobileMenuItem(item, currentSlug, currentFile)
        );
      }
    });
  }

  function getCurrentFilename() {
    const path = window.location.pathname || "";
    let file = path.split("/").pop();
    if (!file) file = "index.html";
    return file.toLowerCase();
  }

  function normalizeFilename(url) {
    if (!url) return "";
    const clean = url.split("#")[0].split("?")[0];
    let file = clean.split("/").pop();
    if (!file) file = "index.html";
    return file.toLowerCase();
  }

  function isMenuItemActive(item, currentSlug, currentFile) {
    if (!item) return false;

    if (item.id && item.id === currentSlug) return true;
    if (item.slug && item.slug === currentSlug) return true;

    if (item.url && normalizeFilename(item.url) === currentFile) return true;

    if (
      (!item.url || item.url === "#" || item.url === "index.html") &&
      (item.id === "home" || item.slug === "home") &&
      currentFile === "index.html"
    ) {
      return true;
    }

    return false;
  }

  function buildDesktopMenuItem(item, currentSlug, currentFile) {
    const li = document.createElement("li");
    li.classList.add("nav-item");

    const type = item.type || "link";
    const label = item.label || item.title || "Item";
    const isActive = isMenuItemActive(item, currentSlug, currentFile);

    if (type === "mega" && Array.isArray(item.subItems) && item.subItems.length) {
      li.classList.add("nav-item--mega");

      // Top trigger (no navigation, just opens mega panel)
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "nav-link nav-link--mega";
      if (isActive) btn.classList.add("active");
      btn.innerHTML = `
        <span>${escapeHtml(label)}</span>
        <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
      `;
      li.appendChild(btn);

      // Mega panel
      const panel = document.createElement("div");
      panel.className = "mega-panel";

      const grid = document.createElement("div");
      grid.className = "mega-grid";

      item.subItems.forEach((sub) => {
        const a = document.createElement("a");
        a.className = "mega-link";
        a.href = sub.url || "#";
        a.innerHTML = `
          <span class="mega-link-title">${escapeHtml(sub.label || "Item")}</span>
          ${
            sub.description
              ? `<span class="mega-link-desc">${escapeHtml(
                  sub.description
                )}</span>`
              : ""
          }
        `;
        grid.appendChild(a);
      });

      panel.appendChild(grid);
      li.appendChild(panel);
    } else {
      // Simple link item
      const a = document.createElement("a");
      a.href = item.url || "#";
      a.textContent = label;
      a.className = "nav-link";
      if (isActive) a.classList.add("active");
      li.appendChild(a);
    }

    return li;
  }

  function buildMobileMenuItem(item, currentSlug, currentFile) {
    const li = document.createElement("li");
    const type = item.type || "link";
    const label = item.label || item.title || "Item";
    const isActive = isMenuItemActive(item, currentSlug, currentFile);

    if (type === "mega" && Array.isArray(item.subItems) && item.subItems.length) {
      // Label / section heading
      const heading = document.createElement("div");
      heading.className = "mobile-mega-label";
      heading.textContent = label;
      li.appendChild(heading);

      const inner = document.createElement("ul");
      inner.className = "mobile-mega-list";

      item.subItems.forEach((sub) => {
        const subLi = document.createElement("li");
        const a = document.createElement("a");
        a.href = sub.url || "#";
        a.textContent = sub.label || "Item";
        inner.appendChild(subLi);
        subLi.appendChild(a);
      });

      li.appendChild(inner);
    } else {
      const a = document.createElement("a");
      a.href = item.url || "#";
      a.textContent = label;
      if (isActive) a.classList.add("active");
      li.appendChild(a);
    }

    return li;
  }

  /* ============================
     HERO
  ============================ */

  function renderHero(page) {
    const heroEl = document.querySelector("[data-hero]");
    if (!heroEl || !page) return;

    const h = page.hero || {};
    const eyebrowEl = heroEl.querySelector("[data-hero-eyebrow]");
    const titleEl = heroEl.querySelector("[data-hero-title]");
    const subEl = heroEl.querySelector("[data-hero-sub]");

    // Background image
    if (h.bg) {
      heroEl.style.backgroundImage = `url('${h.bg}')`;
      heroEl.style.backgroundSize = "cover";
      heroEl.style.backgroundPosition = "center";
    } else {
      heroEl.style.backgroundImage = "";
    }

    // Height based on size
    const size = h.size || "full";
    let height = "70vh";
    if (size === "small") height = "40vh";
    else if (size === "medium") height = "60vh";
    else if (size === "large") height = "80vh";
    else if (size === "full") height = "100vh";
    else if (size === "custom" && h.customHeight) height = h.customHeight;
    heroEl.style.minHeight = height;

    // Optional behavior hint (for future parallax, etc.)
    heroEl.dataset.behavior = h.behavior || "still";

    // Content
    if (eyebrowEl) {
      eyebrowEl.textContent = h.eyebrow || page.title || "";
    }
    if (titleEl) {
      titleEl.textContent = h.overlay || page.title || "";
    }
    if (subEl) {
      subEl.textContent = h.sub || "";
    }

    // Transparent menu toggle per-page
    const header = document.querySelector("header.site-header");
    if (header) {
      if (h.transparentMenu) header.classList.add("header--transparent");
      else header.classList.remove("header--transparent");
    }
  }

  /* ============================
     BLOCKS
  ============================ */

  function renderBlocks(page) {
    const container = document.querySelector("[data-blocks-target]");
    if (!container || !page) return;

    const blocks = Array.isArray(page.blocks) ? page.blocks : [];
    let html = "";

    blocks.forEach((b) => {
      const type = b.type;

      if (type === "heading") {
        html += `
          <div class="block block-heading">
            <h2>${escapeHtml(b.content || "")}</h2>
          </div>
        `;
      } else if (type === "paragraph") {
        const text = (b.content || "").replace(/\n/g, "<br>");
        html += `
          <div class="block block-paragraph">
            <p>${text}</p>
          </div>
        `;
      } else if (type === "image" && b.content) {
        html += `
          <div class="block block-image">
            <img src="${escapeHtml(b.content)}"
                 alt=""
                 style="max-width:100%;border-radius:14px;">
          </div>
        `;
      } else if (type === "button") {
        html += `
          <div class="block block-button">
            <a href="${escapeHtml(b.url || "#")}"
               target="_blank"
               rel="noopener noreferrer"
               style="
                 display:inline-block;
                 padding:0.6rem 1.6rem;
                 border-radius:999px;
                 background:#22c55e;
                 color:#022c22;
                 font-weight:600;
                 font-size:.9rem;
                 text-decoration:none;">
              ${escapeHtml(b.text || "Learn more")}
            </a>
          </div>
        `;
      } else if (type === "product") {
        html += `
          <div class="block block-product"
               style="
                 background:#020617;
                 border-radius:14px;
                 padding:0.9rem;
                 border:1px solid rgba(55,65,81,.9);
                 display:flex;
                 gap:0.9rem;
                 align-items:flex-start;">
            ${
              b.image
                ? `<img src="${escapeHtml(
                    b.image
                  )}" style="width:110px;border-radius:10px;object-fit:cover;">`
                : ""
            }
            <div>
              <h3 style="margin:0 0 .3rem;font-size:.98rem;color:#e5e7eb;">
                ${escapeHtml(b.title || "")}
              </h3>
              <p style="margin:0 0 .5rem;font-size:.82rem;color:#9ca3af;">
                ${escapeHtml(b.text || "")}
              </p>
              ${
                b.url
                  ? `<a href="${escapeHtml(b.url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        style="
                          display:inline-block;
                          margin-top:0.2rem;
                          padding:0.45rem 1.4rem;
                          border-radius:999px;
                          background:#22c55e;
                          color:#022c22;
                          font-size:.8rem;
                          font-weight:600;
                          text-decoration:none;">
                       Buy on Amazon
                     </a>`
                  : ""
              }
            </div>
          </div>
        `;
      } else if (type === "podcast" && b.embed) {
        html += `
          <div class="block block-podcast" style="margin:1.2rem 0;">
            <h3 style="margin:0 0 .3rem;color:#e5e7eb;">
              ${escapeHtml(b.title || "")}
            </h3>
            <iframe src="${escapeHtml(b.embed)}"
                    style="width:100%;height:150px;border:none;border-radius:10px;background:#0f172a;"
                    allow="autoplay"></iframe>
          </div>
        `;
      } else if (type === "youtube" && b.videoId) {
        let id = (b.videoId || "").trim();
        const m = id.match(/v=([^&]+)/);
        if (m) id = m[1];
        html += `
          <div class="block block-youtube" style="margin:1.2rem 0;">
            <h3 style="margin:0 0 .3rem;color:#e5e7eb;">
              ${escapeHtml(b.title || "")}
            </h3>
            <div style="position:relative;padding-bottom:56.25%;height:0;border-radius:12px;overflow:hidden;">
              <iframe src="https://www.youtube.com/embed/${escapeHtml(id)}"
                      style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;"
                      allowfullscreen></iframe>
            </div>
          </div>
        `;
      }
    });

    container.innerHTML = html;
  }

  /* ============================
     UTIL
  ============================ */

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();








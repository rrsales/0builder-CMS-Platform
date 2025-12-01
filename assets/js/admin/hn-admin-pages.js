// assets/js/admin/hn-admin-pages.js
// Handles: page list, accordion behavior for Pages, new page, delete page, select page

(function () {
  // DOM references
  const pagesContainer = document.getElementById("pages");
  const newPageBtn     = document.getElementById("newPageBtn");
  const pagesSection   = document.getElementById("pagesSection");
  const pagesChevron   = document.getElementById("pagesChevron");

  if (!pagesContainer) {
    console.warn("[hn-admin-pages] #pages container not found.");
    return;
  }

  // -------------
  // Small helper
  // -------------
  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // -------------
  // Accordion: Pages section
  // -------------

  // If you wired a button for the Pages header, call this from there:
  // <button data-section="pages" id="pagesHeader">Pages</button>
  const pagesHeaderBtn =
    document.getElementById("pagesHeader") ||
    document.querySelector('[data-section="pages"]');

  function togglePagesSection() {
    if (!pagesSection) return;
    const willBeClosed = !pagesSection.classList.contains("closed");

    // close all sections if you use the same "sidebar-section-body" class
    document.querySelectorAll(".sidebar-section-body").forEach(el => {
      el.classList.add("closed");
    });
    document.querySelectorAll(".sidebar-chevron").forEach(el => {
      el.classList.add("rotated");
    });

    // reopen this one if it was closed
    if (willBeClosed) {
      pagesSection.classList.remove("closed");
      if (pagesChevron) pagesChevron.classList.remove("rotated");
    }
  }

  if (pagesHeaderBtn) {
    pagesHeaderBtn.addEventListener("click", togglePagesSection);
  }

  // Allow programmatic open from other modules
  window.openPagesSection = function () {
    if (!pagesSection) return;
    pagesSection.classList.remove("closed");
    if (pagesChevron) pagesChevron.classList.remove("rotated");
  };

  // -------------
  // Render pages list
  // -------------

  function renderPages() {
    const pages = (window.site && Array.isArray(window.site.pages))
      ? window.site.pages
      : [];

    if (!pagesContainer) return;

    pagesContainer.innerHTML = pages
      .map((p, i) => {
        const isActive = (window.current === p);
        return `
          <div class="page ${isActive ? "active" : ""}">
            <div class="page-main" onclick="selectPage(${i})">
              <span class="title">${escapeHtml(p.title || "Untitled")}</span>
              <span class="slug">${escapeHtml(p.slug || "")}</span>
            </div>
            <button
              type="button"
              class="page-delete-btn"
              title="Delete page"
              onclick="deletePage(${i}, event)"
            >
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        `;
      })
      .join("");
  }

  // expose so core can call after load
  window.renderPages = renderPages;

  // -------------
  // Select page
  // -------------

  window.selectPage = function (index) {
    if (!window.site || !Array.isArray(window.site.pages)) return;
    const pages = window.site.pages;
    const page  = pages[index];
    if (!page) return;

    window.current = page;

    renderPages();          // highlight active
    if (typeof updatePreviewHeader === "function") updatePreviewHeader();
    if (typeof renderPreview === "function")       renderPreview();
    if (typeof renderInspectorTab === "function")  renderInspectorTab();

    // When a page is selected, auto-open inspector according to behavior
    if (["auto", "pinned", "smart"].includes(window.panelBehavior)) {
      if (typeof openPanel === "function") openPanel("auto");
    }
  };

  // -------------
  // New page
  // -------------

  window.newPage = function () {
    if (!window.site) window.site = {};
    if (!Array.isArray(window.site.pages)) window.site.pages = [];

    const title = prompt("Page title?");
    if (!title) return;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    const newPage = {
      title: title,
      slug: slug || "page-" + (window.site.pages.length + 1),
      theme: "dark",
      hero: {
        bg: "",
        overlay: title,
        sub: "",
        transparentMenu: false,
        behavior: "still",
        size: "full",
        customHeight: ""
      },
      blocks: []
    };

    window.site.pages.push(newPage);

    if (typeof markDirty === "function") markDirty();
    renderPages();
    // auto-select the new page
    window.selectPage(window.site.pages.length - 1);
    if (typeof openPagesSection === "function") openPagesSection();
  };

  if (newPageBtn) {
    newPageBtn.addEventListener("click", function () {
      window.newPage();
    });
  }

  // -------------
  // Delete page
  // -------------

  window.deletePage = function (index, evt) {
    if (evt && evt.stopPropagation) evt.stopPropagation();

    if (!window.site || !Array.isArray(window.site.pages)) return;
    const pages = window.site.pages;
    const page  = pages[index];

    if (!page) return;

    // Prevent deleting the last page
    if (pages.length <= 1) {
      alert("You must keep at least one page in the site.");
      return;
    }

    const label = page.title || page.slug || "Untitled page";
    const ok = confirm(
      `Delete page "${label}"?\n\nThis will remove it from the CMS and site-data.json.`
    );
    if (!ok) return;

    pages.splice(index, 1);

    // If we deleted the current page, move selection to first page
    if (window.current === page) {
      window.current = pages[0] || null;
    }

    if (typeof markDirty === "function") markDirty();
    renderPages();
    if (typeof updatePreviewHeader === "function") updatePreviewHeader();
    if (typeof renderPreview === "function")       renderPreview();
    if (typeof renderInspectorTab === "function")  renderInspectorTab();
  };

  // -------------
  // Initial render hook
  // -------------
  // Core script should call renderPages() once site-data is loaded.
  // But if it was already loaded before this file runs, do an initial render:
  if (window.site && Array.isArray(window.site.pages)) {
    renderPages();
  }
})();



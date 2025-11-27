// assets/js/admin.js
(() => {
  /*********************************
   Config & defaults
  *********************************/
  const ADMIN_PASSWORD = "admin123";
  const STORAGE_KEY = "honestnews_siteData_v1";

  const defaultData = {
    pages: [
      { title: "Home", url: "index.html" },
      { title: "About", url: "about.html" },
      { title: "Blog", url: "blog.html" },
      { title: "Podcast", url: "podcast.html" },
      { title: "Products", url: "products.html" },
      { title: "Contact", url: "contact.html" }
    ],
    heroes: {},
    menu: [],
    images: [],
    settings: {
      siteName: "Honest News Network",
      primaryColor: "#0070f3",
      secondaryColor: "#ffffff",
      accentColor: "#0070f3",
      transparentMenu: false
    }
  };

  /*********************************
   Load / save site data
  *********************************/
  let siteData = loadSiteData();

  function loadSiteData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
        return JSON.parse(JSON.stringify(defaultData));
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error("Failed to load site data, using defaults.", e);
      return JSON.parse(JSON.stringify(defaultData));
    }
  }

  function saveSiteData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
    console.log("Site data saved.");
    renderPagesList();
    populateHeroPageSelect();
    renderMenuList();
    renderImageGrid();
  }

  /*********************************
   DOM refs (MATCHING YOUR admin.html)
  *********************************/
  document.addEventListener("DOMContentLoaded", () => {
    const loginPanel = document.getElementById("adminLogin");
    const adminPanel = document.getElementById("adminPanel");
    const loginBtn = document.getElementById("loginBtn");
    const loginMsg = document.getElementById("loginMsg");
    const adminPasswordInput = document.getElementById("adminPassword");
    const logoutBtn = document.getElementById("logoutBtn");
    const saveChangesBtn = document.getElementById("saveChangesBtn");

    // Tabs (sidebar)
    const sidebarBtns = document.querySelectorAll(".sidebar-btn[data-tab]");
    const tabs = {
      pagesTab: document.getElementById("pagesTab"),
      heroesTab: document.getElementById("heroesTab"),
      menuTab: document.getElementById("menuTab"),
      colorsTab: document.getElementById("colorsTab"),
      imagesTab: document.getElementById("imagesTab")
    };

    // Pages tab
    const pageListDiv = document.getElementById("pageList");
    const addPageTitle = document.getElementById("addPageTitle");
    const addPageURL = document.getElementById("addPageURL");
    const addPageBtn = document.getElementById("addPageBtn");

    // Hero tab
    const heroPageSelect = document.getElementById("heroPageSelect");
    const heroBehavior = document.getElementById("heroBehavior");
    const heroImageInput = document.getElementById("heroImageInput");
    const heroPreview = document.getElementById("heroPreview");
    const heroVideoInput = document.getElementById("heroVideoInput");
    const heroTransparentMenu = document.getElementById("heroTransparentMenu");
    const heroHeight = document.getElementById("heroHeight");
    const saveHeroSettingsBtn = document.getElementById("saveHeroSettings");
    const heroImageSettings = document.getElementById("heroImageSettings");
    const heroVideoSettings = document.getElementById("heroVideoSettings");

    // Menu tab
    const menuListDiv = document.getElementById("menuList");
    const addMenuItemBtn = document.getElementById("addMenuItemBtn");

    // Colors tab
    const primaryColorPicker = document.getElementById("primaryColorPicker");
    const secondaryColorPicker = document.getElementById("secondaryColorPicker");
    const accentColorPicker = document.getElementById("accentColorPicker");
    const enableMenuTransparency = document.getElementById("enableMenuTransparency");
    const saveColorSettingsBtn = document.getElementById("saveColorSettings");

    // Images tab
    const imageUploadInput = document.getElementById("imageUpload");
    const uploadImageBtn = document.getElementById("uploadImageBtn");
    const imageGridDiv = document.getElementById("imageGrid");

    if (!loginPanel || !adminPanel) {
      console.warn("Admin panel HTML not found on this page.");
      return;
    }

    /*********************************
     Login
    *********************************/
    loginBtn?.addEventListener("click", () => {
      const pwd = adminPasswordInput.value || "";
      if (pwd === ADMIN_PASSWORD) {
        loginPanel.style.display = "none";
        adminPanel.style.display = "";
        console.log("Admin unlocked.");
        initAdmin();
      } else {
        loginMsg.textContent = "Incorrect password";
      }
    });

    logoutBtn?.addEventListener("click", () => {
      adminPanel.style.display = "none";
      loginPanel.style.display = "flex";
      adminPasswordInput.value = "";
    });

    /*********************************
     Tabs switching
    *********************************/
    function showTab(tabId) {
      Object.keys(tabs).forEach((id) => {
        if (!tabs[id]) return;
        tabs[id].style.display = id === tabId ? "block" : "none";
      });
    }

    sidebarBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabId = btn.getAttribute("data-tab");
        if (tabId && tabs[tabId]) {
          showTab(tabId);
        }
      });
    });

    // default tab
    showTab("pagesTab");

    /*********************************
     Pages management
    *********************************/
    function renderPagesList() {
      if (!pageListDiv) return;
      pageListDiv.innerHTML = "";

      if (!siteData.pages || !siteData.pages.length) {
        pageListDiv.textContent = "No pages yet.";
        return;
      }

      siteData.pages.forEach((p, idx) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";
        row.style.padding = "6px 0";
        row.style.borderBottom = "1px solid #eee";

        const left = document.createElement("div");
        left.innerHTML = `<strong>${escapeHtml(p.title)}</strong> <small style="color:#666">(${escapeHtml(
          p.url
        )})</small>`;
        row.appendChild(left);

        const right = document.createElement("div");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Rename";
        editBtn.style.marginRight = "6px";
        editBtn.addEventListener("click", () => {
          const newTitle = prompt("New page title", p.title);
          if (!newTitle) return;
          p.title = newTitle.trim();
          saveSiteData();
        });
        right.appendChild(editBtn);

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.style.background = "#ff4d4d";
        delBtn.style.color = "#fff";
        delBtn.addEventListener("click", () => {
          if (!confirm(`Delete page "${p.title}"?`)) return;
          siteData.pages.splice(idx, 1);
          delete siteData.heroes[p.url];
          saveSiteData();
        });
        right.appendChild(delBtn);

        row.appendChild(right);
        pageListDiv.appendChild(row);
      });

      populateHeroPageSelect();
      renderMenuList();
    }

    addPageBtn?.addEventListener("click", () => {
      const title = (addPageTitle.value || "").trim();
      let url = (addPageURL.value || "").trim();

      if (!title) return alert("Enter a page title.");
      if (!url) {
        url = title.toLowerCase().replace(/\s+/g, "-") + ".html";
      }

      if (siteData.pages.some((p) => p.url === url)) {
        return alert("A page with that URL already exists.");
      }

      siteData.pages.push({ title, url });
      addPageTitle.value = "";
      addPageURL.value = "";
      saveSiteData();
    });

    /*********************************
     Hero settings
    *********************************/
    function populateHeroPageSelect() {
      if (!heroPageSelect) return;
      heroPageSelect.innerHTML = "";
      (siteData.pages || []).forEach((p) => {
        const opt = document.createElement("option");
        opt.value = p.url;
        opt.textContent = p.title;
        heroPageSelect.appendChild(opt);
      });
      if (heroPageSelect.options.length) {
        heroPageSelect.selectedIndex = 0;
        loadHeroForm(heroPageSelect.value);
      }
    }

    function loadHeroForm(pageUrl) {
      if (!pageUrl) return;
      const h = siteData.heroes[pageUrl] || {};

      if (heroBehavior) heroBehavior.value = h.behavior || "none";
      if (heroHeight) heroHeight.value = h.height || "80vh";
      if (heroTransparentMenu) heroTransparentMenu.checked = !!h.transparentMenu;

      const isVideo = h.behavior === "video";
      if (heroImageInput) heroImageInput.value = !isVideo ? (h.mediaUrl || "") : "";
      if (heroVideoInput) heroVideoInput.value = isVideo ? (h.mediaUrl || "") : "";

      updateHeroFieldsVisibility();

      if (heroPreview) {
        if (!isVideo && h.mediaUrl) {
          heroPreview.src = h.mediaUrl;
          heroPreview.style.display = "block";
        } else {
          heroPreview.style.display = "none";
          heroPreview.src = "";
        }
      }
    }

    function updateHeroFieldsVisibility() {
      const behavior = heroBehavior ? heroBehavior.value : "none";
      if (heroImageSettings) {
        heroImageSettings.style.display =
          behavior === "still" || behavior === "parallax" || behavior === "slider"
            ? "block"
            : "none";
      }
      if (heroVideoSettings) {
        heroVideoSettings.style.display = behavior === "video" ? "block" : "none";
      }
    }

    heroPageSelect?.addEventListener("change", () => {
      loadHeroForm(heroPageSelect.value);
    });

    heroBehavior?.addEventListener("change", updateHeroFieldsVisibility);

    heroImageInput?.addEventListener("input", () => {
      if (!heroPreview) return;
      const val = heroImageInput.value.trim();
      if (val) {
        heroPreview.src = val;
        heroPreview.style.display = "block";
      } else {
        heroPreview.style.display = "none";
        heroPreview.src = "";
      }
    });

    saveHeroSettingsBtn?.addEventListener("click", () => {
      const page = heroPageSelect?.value;
      if (!page) return alert("Select a page first.");

      const behavior = heroBehavior ? heroBehavior.value : "none";
      let mediaUrl = "";
      if (behavior === "video" && heroVideoInput) {
        mediaUrl = heroVideoInput.value.trim();
      } else if (heroImageInput) {
        mediaUrl = heroImageInput.value.trim();
      }

      siteData.heroes[page] = siteData.heroes[page] || {};
      Object.assign(siteData.heroes[page], {
        behavior,
        mediaUrl,
        height: heroHeight ? heroHeight.value || "80vh" : "80vh",
        transparentMenu: heroTransparentMenu ? !!heroTransparentMenu.checked : false
      });

      saveSiteData();
      alert("Hero settings saved.");
    });

    /*********************************
     Menu management
    *********************************/
    function renderMenuList() {
      if (!menuListDiv) return;
      menuListDiv.innerHTML = "";

      const items =
        siteData.menu && siteData.menu.length
          ? siteData.menu
          : siteData.pages.map((p) => ({ title: p.title, url: p.url }));

      items.forEach((m, idx) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";
        row.style.padding = "6px 0";
        row.style.borderBottom = "1px solid #eee";

        const left = document.createElement("div");
        left.textContent = `${m.title} (${m.url})`;
        row.appendChild(left);

        const right = document.createElement("div");

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.style.marginRight = "6px";
        editBtn.addEventListener("click", () => {
          const newTitle = prompt("Menu title", m.title);
          if (newTitle === null) return;
          const newUrl = prompt("Menu URL", m.url);
          if (newUrl === null) return;
          if (!siteData.menu) siteData.menu = [];
          siteData.menu[idx] = { title: newTitle.trim(), url: newUrl.trim() };
          saveSiteData();
        });
        right.appendChild(editBtn);

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.style.background = "#ff4d4d";
        delBtn.style.color = "#fff";
        delBtn.addEventListener("click", () => {
          if (!siteData.menu || !siteData.menu.length) {
            siteData.menu = siteData.pages.map((p) => ({ title: p.title, url: p.url }));
          }
          siteData.menu.splice(idx, 1);
          saveSiteData();
        });
        right.appendChild(delBtn);

        row.appendChild(right);
        menuListDiv.appendChild(row);
      });
    }

    addMenuItemBtn?.addEventListener("click", () => {
      const title = prompt("Menu title");
      if (!title) return;
      const url = prompt("Menu URL (page.html or https://...)");
      if (!url) return;
      siteData.menu = siteData.menu || [];
      siteData.menu.push({ title: title.trim(), url: url.trim() });
      saveSiteData();
    });

    /*********************************
     Colors / appearance
    *********************************/
    function loadColorPickers() {
      if (primaryColorPicker)
        primaryColorPicker.value = siteData.settings.primaryColor || "#0070f3";
      if (secondaryColorPicker)
        secondaryColorPicker.value = siteData.settings.secondaryColor || "#ffffff";
      if (accentColorPicker)
        accentColorPicker.value = siteData.settings.accentColor || "#0070f3";
      if (enableMenuTransparency)
        enableMenuTransparency.checked = !!siteData.settings.transparentMenu;
    }

    saveColorSettingsBtn?.addEventListener("click", () => {
      if (primaryColorPicker) siteData.settings.primaryColor = primaryColorPicker.value;
      if (secondaryColorPicker)
        siteData.settings.secondaryColor = secondaryColorPicker.value;
      if (accentColorPicker) siteData.settings.accentColor = accentColorPicker.value;
      if (enableMenuTransparency)
        siteData.settings.transparentMenu = enableMenuTransparency.checked;
      saveSiteData();
      alert("Appearance saved.");
    });

    /*********************************
     Image library
    *********************************/
    uploadImageBtn?.addEventListener("click", () => {
      const file = imageUploadInput?.files?.[0];
      if (!file) return alert("Choose an image first.");
      const reader = new FileReader();
      reader.onload = (e) => {
        siteData.images = siteData.images || [];
        siteData.images.push({
          id: "img_" + Date.now(),
          name: file.name,
          dataUrl: e.target.result
        });
        saveSiteData();
        alert("Image uploaded.");
      };
      reader.readAsDataURL(file);
    });

    function renderImageGrid() {
      if (!imageGridDiv) return;
      imageGridDiv.innerHTML = "";
      siteData.images = siteData.images || [];
      siteData.images.forEach((img) => {
        const wrap = document.createElement("div");
        wrap.style.border = "1px solid #ddd";
        wrap.style.padding = "6px";
        wrap.style.borderRadius = "6px";
        wrap.style.textAlign = "center";

        const el = document.createElement("img");
        el.src = img.dataUrl;
        el.style.maxWidth = "140px";
        el.style.height = "auto";
        el.style.display = "block";
        el.style.margin = "0 auto 8px";
        wrap.appendChild(el);

        const name = document.createElement("div");
        name.textContent = img.name;
        name.style.fontSize = "12px";
        name.style.marginBottom = "6px";
        wrap.appendChild(name);

        const del = document.createElement("button");
        del.textContent = "Delete";
        del.style.background = "#ff4d4d";
        del.style.color = "#fff";
        del.addEventListener("click", () => {
          if (!confirm("Delete this image?")) return;
          siteData.images = siteData.images.filter((x) => x.id !== img.id);
          saveSiteData();
        });
        wrap.appendChild(del);

        imageGridDiv.appendChild(wrap);
      });
    }

    /*********************************
     Save all button
    *********************************/
    saveChangesBtn?.addEventListener("click", () => {
      saveSiteData();
      alert("All changes saved.");
    });

    /*********************************
     Helpers & init
    *********************************/
    function escapeHtml(s = "") {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function initAdmin() {
      // make sure base structure exists
      siteData.pages = siteData.pages || defaultData.pages.slice();
      siteData.heroes = siteData.heroes || {};
      siteData.menu = siteData.menu || [];
      siteData.images = siteData.images || [];
      siteData.settings = siteData.settings || defaultData.settings;

      renderPagesList();
      populateHeroPageSelect();
      loadColorPickers();
      renderMenuList();
      renderImageGrid();
    }

    // first-time save to ensure structure
    saveSiteData();
  });
})();










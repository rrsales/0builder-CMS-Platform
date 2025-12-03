// modules/inspector.js
// CMS-connected Inspector Panel (hero + theme editor)

import { getPages, updatePages } from "./dataService.js";

const inspectorPanel = document.getElementById("inspectorPanel");
let currentPage = null;

// ---------- Render ----------
export function renderInspector(page = null) {
  if (!page) {
    inspectorPanel.innerHTML = `<div class="placeholder">Select a page to view settings.</div>`;
    return;
  }

  currentPage = page;
  const hero = page.hero || {};
  const transparency = hero.transparentMenu ? "checked" : "";
  const size = hero.size || "custom";
  const behavior = hero.behavior || "parallax-medium";
  const theme = page.theme || "light";

  inspectorPanel.innerHTML = `
    <div class="panelHeader">
      <h2>Inspector</h2>
    </div>
    <div class="inspectorBody">
      <label>Page Title</label>
      <input type="text" id="pageTitleInput" value="${page.title}">

      <label>Theme</label>
      <select id="pageTheme">
        <option value="light" ${theme === "light" ? "selected" : ""}>Light</option>
        <option value="dark" ${theme === "dark" ? "selected" : ""}>Dark</option>
      </select>

      <label>Hero Behavior</label>
      <select id="heroBehavior">
        <option value="still" ${behavior === "still" ? "selected" : ""}>Still Image</option>
        <option value="parallax-medium" ${behavior === "parallax-medium" ? "selected" : ""}>Parallax Medium</option>
        <option value="parallax-slow" ${behavior === "parallax-slow" ? "selected" : ""}>Parallax Slow</option>
        <option value="carousel" ${behavior === "carousel" ? "selected" : ""}>Carousel</option>
        <option value="video" ${behavior === "video" ? "selected" : ""}>Video</option>
      </select>

      <label>Hero Size</label>
      <select id="heroSize">
        <option value="small" ${size === "small" ? "selected" : ""}>Small</option>
        <option value="medium" ${size === "medium" ? "selected" : ""}>Medium</option>
        <option value="large" ${size === "large" ? "selected" : ""}>Large</option>
        <option value="custom" ${size === "custom" ? "selected" : ""}>Custom</option>
      </select>

      <label>Custom Height (optional)</label>
      <input type="text" id="heroCustomHeight" placeholder="e.g. 480px" value="${hero.customHeight || ""}">

      <label class="inline">
        <input type="checkbox" id="transparentMenu" ${transparency}> Transparent Menu
      </label>

      <button id="saveInspector" class="saveBtn">Save Changes</button>
    </div>
  `;

  attachInspectorListeners();
}

// ---------- Listeners ----------
function attachInspectorListeners() {
  const saveBtn = inspectorPanel.querySelector("#saveInspector");
  if (!saveBtn) return;

  saveBtn.onclick = () => {
    if (!currentPage) return;

    const title = inspectorPanel.querySelector("#pageTitleInput").value.trim();
    const theme = inspectorPanel.querySelector("#pageTheme").value;
    const behavior = inspectorPanel.querySelector("#heroBehavior").value;
    const size = inspectorPanel.querySelector("#heroSize").value;
    const transparent = inspectorPanel.querySelector("#transparentMenu").checked;
    const customHeight = inspectorPanel.querySelector("#heroCustomHeight").value.trim();

    currentPage.title = title || currentPage.title;
    currentPage.theme = theme;
    currentPage.hero = {
      ...currentPage.hero,
      behavior,
      size,
      customHeight,
      transparentMenu: transparent
    };

    // Update data.json in-memory
    const pages = getPages();
    const idx = pages.findIndex(p => p.slug === currentPage.slug);
    if (idx > -1) {
      pages[idx] = currentPage;
      updatePages(pages);
    }

    // Dispatch update so canvas refreshes
    const event = new CustomEvent("pageUpdated", { detail: currentPage });
    window.dispatchEvent(event);

    saveBtn.textContent = "Saved!";
    setTimeout(() => (saveBtn.textContent = "Save Changes"), 1500);
  };
}

// ---------- Listen for page selection ----------
window.addEventListener("pageSelected", e => renderInspector(e.detail));

// ---------- Init ----------
window.addEventListener("load", () => renderInspector(null));

// ---------- Styles ----------
const style = document.createElement("style");
style.textContent = `
#inspectorPanel {padding:1rem;border-bottom:1px solid var(--border);}
#inspectorPanel .panelHeader {margin-bottom:.5rem;}
#inspectorPanel h2 {font-size:1rem;margin:0;color:var(--accent);}
#inspectorPanel label {display:block;font-size:.8rem;margin-top:.6rem;color:var(--text);}
#inspectorPanel input[type=text],
#inspectorPanel select {width:100%;padding:.35rem;border-radius:.4rem;background:#0f172a;border:1px solid var(--border);color:var(--text);}
#inspectorPanel input[type=checkbox] {margin-right:.4rem;}
#inspectorPanel .inline {display:flex;align-items:center;margin-top:.6rem;}
#inspectorPanel .saveBtn {margin-top:1rem;width:100%;padding:.5rem;border:none;border-radius:.5rem;background:var(--accent);color:#fff;cursor:pointer;font-weight:500;}
#inspectorPanel .placeholder {padding:2rem;text-align:center;opacity:.5;font-size:.9rem;}
`;
document.head.appendChild(style);


// modules/inspector.js
// Handles the right-side Inspector panel for per-page settings

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
  const transparency = hero.transparentHeader ? "checked" : "";
  const size = hero.size || "medium";
  const behavior = hero.behavior || "still";

  inspectorPanel.innerHTML = `
    <div class="panelHeader">
      <h2>Inspector</h2>
    </div>
    <div class="inspectorBody">
      <label>Page Title</label>
      <input type="text" id="pageTitleInput" value="${page.title}">

      <label>Hero Behavior</label>
      <select id="heroBehavior">
        <option value="still" ${behavior === "still" ? "selected" : ""}>Still Image</option>
        <option value="parallax" ${behavior === "parallax" ? "selected" : ""}>Slow Parallax Scroll</option>
        <option value="carousel" ${behavior === "carousel" ? "selected" : ""}>Carousel</option>
        <option value="video" ${behavior === "video" ? "selected" : ""}>Embedded Video</option>
      </select>

      <label>Hero Size</label>
      <select id="heroSize">
        <option value="small" ${size === "small" ? "selected" : ""}>Small</option>
        <option value="medium" ${size === "medium" ? "selected" : ""}>Medium</option>
        <option value="large" ${size === "large" ? "selected" : ""}>Large</option>
        <option value="full" ${size === "full" ? "selected" : ""}>Full</option>
      </select>

      <label class="inline">
        <input type="checkbox" id="transparentHeader" ${transparency}> Transparent Header
      </label>

      <button id="saveInspector" class="saveBtn">Save Changes</button>
    </div>
  `;

  attachInspectorListeners();
}

// ---------- Event Listeners ----------
function attachInspectorListeners() {
  const saveBtn = inspectorPanel.querySelector("#saveInspector");
  if (!saveBtn) return;

  saveBtn.onclick = () => {
    const title = inspectorPanel.querySelector("#pageTitleInput").value.trim();
    const behavior = inspectorPanel.querySelector("#heroBehavior").value;
    const size = inspectorPanel.querySelector("#heroSize").value;
    const transparent = inspectorPanel.querySelector("#transparentHeader").checked;

    if (!currentPage) return;

    currentPage.title = title || currentPage.title;
    currentPage.hero = { ...currentPage.hero, behavior, size, transparentHeader: transparent };

    // Dispatch update
    const event = new CustomEvent("pageUpdated", { detail: currentPage });
    window.dispatchEvent(event);

    // Persist locally
    saveInspectorData(currentPage);

    // Visual feedback
    saveBtn.textContent = "Saved!";
    setTimeout(() => (saveBtn.textContent = "Save Changes"), 1500);
  };
}

// ---------- Storage ----------
function saveInspectorData(page) {
  const savedPages = JSON.parse(localStorage.getItem("hn_pages") || "[]");
  const idx = savedPages.findIndex(p => p.slug === page.slug);
  if (idx > -1) {
    savedPages[idx] = page;
    localStorage.setItem("hn_pages", JSON.stringify(savedPages));
  }
}

// ---------- Listeners for Page Selection ----------
window.addEventListener("pageSelected", e => renderInspector(e.detail));

// ---------- Init ----------
window.addEventListener("load", () => {
  renderInspector(null);
});

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

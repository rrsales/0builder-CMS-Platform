// Core State & Data Management
let site = {
  menu: [],
  pages: [],
  theme: {},
  heroSlides: []
};
let current = null;
let isDirty = false;
let activeInspectorTab = "page";
const DRAFT_KEY = "0builder_draft_v1";

// Load site-data.json
async function loadSiteData() {
  let loadedFromServer = false;
  try {
    const res = await fetch("site-data.json?cache-bust=" + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === "object") {
        site = Object.assign({}, site, data);
        loadedFromServer = true;
      }
    }
  } catch (e) {
    console.warn("Could not load site-data.json", e);
  }
  if (!loadedFromServer) restoreDraftIfAny();
  renderPages();
  updatePreviewHeader();
  renderPreview();
  applyPanelBehavior();
  renderInspectorTab();
}

// Save status
function markDirty() {
  isDirty = true;
  const saveStatusRight = document.getElementById("saveStatusRight");
  if (saveStatusRight) {
    saveStatusRight.textContent = "Unsaved changes";
    saveStatusRight.classList.add("dirty");
    saveStatusRight.classList.remove("saved");
  }
}
function markSavedLocal() {
  isDirty = false;
  const saveStatusRight = document.getElementById("saveStatusRight");
  if (saveStatusRight) {
    saveStatusRight.textContent = "Saved";
    saveStatusRight.classList.remove("dirty");
    saveStatusRight.classList.add("saved");
  }
}

// Restore local draft
function restoreDraftIfAny() {
  const draft = localStorage.getItem(DRAFT_KEY);
  if (draft) {
    try {
      site = JSON.parse(draft);
    } catch (e) {
      console.warn("Invalid draft", e);
    }
  }
}

// Save to local
function saveDraftLocal() {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(site, null, 2));
  markSavedLocal();
}

// Download JSON
function downloadJSON() {
  const blob = new Blob([JSON.stringify(site, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'site-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Backup ZIP
function fullBackup() {
  const zip = new JSZip();
  zip.file('site-data.json', JSON.stringify(site, null, 2));
  zip.generateAsync({type: 'blob'}).then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '0builder-backup.zip';
    a.click();
    URL.revokeObjectURL(url);
  });
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Init on load
loadSiteData();

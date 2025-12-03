// modules/dataService.js
// Centralized data loader / saver for data.json

let cmsData = { menu: [], pages: [] };

// ----------- Load -----------
export async function loadCMSData() {
  try {
    // ✅ Correct path — dashboard.html and data.json are in the same folder
    const res = await fetch("./data.json?cachebust=" + Date.now());
    cmsData = await res.json();
    console.log("✅ CMS data loaded", cmsData);
    return cmsData;
  } catch (err) {
    console.error("❌ Failed to load data.json:", err);
    return cmsData;
  }
}

// ----------- Accessors -----------
export function getMenu() { return cmsData.menu || []; }
export function getPages() { return cmsData.pages || []; }

// ----------- Mutators -----------
export function updateMenu(newMenu) { cmsData.menu = newMenu; }
export function updatePages(newPages) { cmsData.pages = newPages; }

// ----------- Export JSON string -----------
export function exportData() {
  return JSON.stringify(cmsData, null, 2);
}

// ----------- (Optional) Save locally -----------
export function saveToLocal() {
  localStorage.setItem("hn_data", exportData());
}

// ----------- Load from local backup -----------
export function loadFromLocal() {
  const saved = localStorage.getItem("hn_data");
  if (saved) cmsData = JSON.parse(saved);
}


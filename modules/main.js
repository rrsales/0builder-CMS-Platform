// modules/main.js
import { loadCMSData, getMenu, getPages, exportData } from "./dataService.js";
import { setPages } from "./pages.js";
import { renderMenuPanel } from "./menu.js";
import { renderInspector } from "./inspector.js";
import { renderCanvas } from "./canvas.js";

async function initCMS() {
  console.log("🚀 Honest News CMS loading…");
  await loadCMSData();

  // Populate panels
  setPages(getPages());
  renderMenuPanel(getMenu());
  renderInspector(null);
  renderCanvas(null);

  wireLayoutToggles();
  injectPublishButton();

  console.log("✅ Honest News CMS ready");
}

function wireLayoutToggles() {
  const left = document.getElementById("leftPanel");
  const right = document.getElementById("rightPanel");
  const toggleLeft = document.getElementById("toggleLeft");
  const toggleRight = document.getElementById("toggleRight");

  if (toggleLeft && left) {
    toggleLeft.addEventListener("click", () => {
      left.classList.toggle("hidden");
    });
  }

  if (toggleRight && right) {
    toggleRight.addEventListener("click", () => {
      right.classList.toggle("hidden");
    });
  }
}

function injectPublishButton() {
  const header = document.querySelector("header");
  if (!header) return;

  const btn = document.createElement("button");
  btn.textContent = "Download data.json";
  btn.className = "publishBtn";

  btn.addEventListener("click", () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  header.appendChild(btn);
}

window.addEventListener("load", initCMS);






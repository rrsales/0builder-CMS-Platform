// right-panel.js
// 0Builder CMS Platform 1.0
// (c) 2025 0Builder.LLC

/*
  RIGHT PANEL: Inspector (tabs, open/close, behavior, wiring)
*/

import { subscribe, publish } from "./core.js";

// Panel DOM refs
const panel    = document.getElementById("inspectorPanel");
const handle   = document.getElementById("panelHandle");
const closeBtn = document.getElementById("closePanelBtn");

// Panel open/close/behavior
let panelBehavior = localStorage.getItem("hn_panel_behavior") || "auto";
function isPanelOpen(){ return panel.classList.contains("open"); }
function openPanel(reason){
  if (panelBehavior === "manual" && reason !== "manual") return;
  panel.classList.add("open");
  handle.style.display = "none";
}
function closePanel(reason){
  if (panelBehavior === "pinned") return;
  panel.classList.remove("open");
  handle.style.display = "flex";
}
function togglePanelManual(){
  if (isPanelOpen()) closePanel("manual");
  else openPanel("manual");
}
function applyPanelBehavior(){
  if (panelBehavior === "pinned") {
    panel.classList.add("open");
    handle.style.display = "none";
  } else {
    handle.style.display = isPanelOpen() ? "none" : "flex";
  }
}
handle.addEventListener("click", ()=>togglePanelManual());
closeBtn.addEventListener("click", ()=>closePanel("manual"));
document.addEventListener("keydown", (e)=>{
  if(e.shiftKey && e.key.toLowerCase()==="p"){
    togglePanelManual();
  }
});
export { openPanel, closePanel, applyPanelBehavior };

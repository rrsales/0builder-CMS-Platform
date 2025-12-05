// preview.js
// 0Builder CMS Platform 1.0
// (c) 2025 0Builder.LLC

/*
  PREVIEW: Preview area for hero, blocks, device toggles
*/

import { site, current, escapeHtml } from "./core.js";

// Device toggle logic
const previewFrame = document.getElementById("previewFrame");
document.querySelectorAll(".device-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const mode = btn.dataset.device;
    previewFrame.classList.remove("desktop","tablet","mobile");
    previewFrame.classList.add(mode);
    document.querySelectorAll(".device-btn").forEach(b=>{
      b.classList.toggle("active", b===btn);
    });
  });
});

// Main preview rendering
export function renderPreview(){
  const h = current && current.hero ? current.hero : {
    overlay:"Pick a page",
    sub:"Use the left bar to choose a page"
  };
  const heroDiv = document.getElementById("heroPreview");
  const titleEl = document.getElementById("heroPreviewInner").querySelector("h1");
  const subEl   = document.getElementById("heroPreviewInner").querySelector("p");

  titleEl.textContent = h.overlay || "";
  subEl.textContent   = h.sub || "";

  if (h.bg){
    heroDiv.style.backgroundImage = `url('${h.bg}')`;
  } else {
    heroDiv.style.backgroundImage = "none";
    heroDiv.style.backgroundColor = "#020617";
  }

  let height = "60vh";
  const size = h.size || "full";
  if(size==="small")  height="40vh";
  else if(size==="medium") height="60vh";
  else if(size==="large")  height="80vh";
  else if(size==="full")   height="100vh";
  else if(size==="custom" && h.customHeight) height = h.customHeight;
  heroDiv.style.height = height;

  const blocksEl = document.getElementById("blockPreview");
  const blocks = (current && current.blocks) ? current.blocks : [];
  let html = "";
  blocks.forEach(b=>{
    if(b.type==="heading"){
      html += `<h2 style="margin-top:1rem;color:#e5e7eb;font-size:1.1rem;">${escapeHtml(b.content || "")}</h2>`;
    } else if(b.type==="paragraph"){
      const text = (b.content || "").replace(/\n/g,"<br>");
      html += `<p style="margin-top:.4rem;color:#9ca3af;font-size:.9rem;">${text}</p>`;
    }
    // ... (keep the rest of your block renderers here, as in your working code)
  });
  blocksEl.innerHTML = html;
}
window._obuilder_renderPreview = renderPreview;

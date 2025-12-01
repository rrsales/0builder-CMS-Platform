/* =========================================
   SECTION 9: SITE TAB (RIGHT → SITE)
   ========================================= */

function renderSiteTabHtml(){
  return `
    <div class="panelSection">
      <div class="panelLabel">Panel behavior</div>
      <label class="inline" style="margin-bottom:4px;display:flex;">
        <input type="radio" name="panelBehavior" value="auto" ${panelBehavior==='auto'?'checked':''}>
        <span>Auto-open when editing</span>
      </label><br>
      <label class="inline" style="margin-bottom:4px;display:flex;">
        <input type="radio" name="panelBehavior" value="manual" ${panelBehavior==='manual'?'checked':''}>
        <span>Manual (use handle / Shift+P)</span>
      </label><br>
      <label class="inline" style="margin-bottom:4px;display:flex;">
        <input type="radio" name="panelBehavior" value="pinned" ${panelBehavior==='pinned'?'checked':''}>
        <span>Pinned open</span>
      </label><br>
      <label class="inline" style="margin-bottom:4px;display:flex;">
        <input type="radio" name="panelBehavior" value="smart" ${panelBehavior==='smart'?'checked':''}>
        <span>Smart (auto like Webflow)</span>
      </label>
      <p class="field-hint" style="margin-top:6px;">
        Your choice is saved per browser. “Smart” behaves like auto-open for now,
        but we can later hook it to more advanced logic (dragging, focus, etc.).
      </p>
    </div>
    <div class="panelSection">
      <div class="panelLabel">Data & safety</div>
      <p class="field-hint">
        • “Save to Cloud” sends <code>site-data.json</code> to your Honest-News repo via Render (GitHub API).<br>
        • Drafts stay only in this browser’s local storage.<br>
        • Use GitHub Desktop to Commit & Push when you’re ready to publish.
      </p>
    </div>
  `;
}

function wirePanelBehaviorRadios(){
  document.querySelectorAll('input[name="panelBehavior"]').forEach(r=>{
    r.addEventListener("change", ()=>{
      panelBehavior = r.value;
      localStorage.setItem("hn_panel_behavior", panelBehavior);
      applyPanelBehavior();
    });
  });
}


/* =========================================
   SECTION 10: UTIL + DOWNLOAD / BACKUP / CLOUD
   ========================================= */

function escapeHtml(str){
  return String(str || "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");
}

/* Download JSON */
function downloadJson(){
  const blob = new Blob([JSON.stringify(site,null,2)],{type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "site-data.json";
  a.click();
}

/* Full backup zip */
async function backupAll(){
  const zip = new JSZip();
  zip.file("site-data.json", JSON.stringify(site,null,2));

  const files = [
    "index.html",
    "podcast.html",
    "shop.html",
    "contact.html",
    "support.html",
    "admin.html",
    "dashboard.html",
    "assets/js/live.js"
  ];

  for(const f of files){
    try{
      const res = await fetch(f,{cache:"no-store"});
      if(res.ok){
        const text = await res.text();
        zip.file(f,text);
      }
    }catch(e){
      console.warn("Could not add to backup:", f);
    }
  }

  const blob = await zip.generateAsync({type:"blob"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "honest-news-full-backup.zip";
  a.click();
}

/* Save to Cloud (Render → GitHub) */
document.getElementById("saveLocalBtn").addEventListener("click", saveToCloud);

async function saveToCloud(){
  if(!confirm("Save your changes to GitHub via Honest News Cloud CMS (Render)?")) return;

  try{
    const res = await fetch(SAVE_ENDPOINT,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(site)
    });

    const data = await res.json().catch(()=> ({}));

    if(!res.ok || !data.ok){
      throw new Error(data.error || ("HTTP " + res.status));
    }

    markSavedLocal();
    alert("✔ Saved to cloud.\nRender → GitHub site-data.json updated.");

  }catch(e){
    console.error(e);
    alert("❌ Save failed.\n" + e.message);
  }
}

/* mirror backup buttons */
document.getElementById("saveDraftBtn2").addEventListener("click", saveDraft);
document.getElementById("downloadBtn2").addEventListener("click", downloadJson);
document.getElementById("backupBtn2").addEventListener("click", backupAll);

/* initial inspector content */
renderInspectorTab();
</script>

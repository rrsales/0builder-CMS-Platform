<!-- DASHBOARD APP SCRIPT (replace your old big script with this) -->
<script>
/* =========================================
   SECTION 1: GLOBAL STATE & CONSTANTS
   ========================================= */

let site = {
  menu: [
    {
      id: "home",
      label: "Home",
      url: "index.html",
      type: "link",
      showOn: "both",
      subItems: []
    },
    {
      id: "podcast",
      label: "Podcast",
      url: "podcast.html",
      type: "link",
      showOn: "both",
      subItems: []
    },
    {
      id: "shop",
      label: "Shop",
      url: "shop.html",
      type: "link",
      showOn: "both",
      subItems: []
    },
    {
      id: "resources",
      label: "Resources",
      url: "#",
      type: "mega",
      showOn: "desktop",
      subItems: [
        {
          label: "Getting started",
          url: "getting-started.html",
          description: "How Honest News + podcast + YouTube fit together."
        },
        {
          label: "For Pastors",
          url: "pastors.html",
          description: "Tools and workflows to preach, record, and publish."
        },
        {
          label: "For Listeners",
          url: "listeners.html",
          description: "Where to listen, how to subscribe, how to support."
        }
      ]
    },
    {
      id: "support",
      label: "Support",
      url: "support.html",
      type: "link",
      showOn: "both",
      subItems: []
    },
    {
      id: "contact",
      label: "Contact",
      url: "contact.html",
      type: "link",
      showOn: "both",
      subItems: []
    }
  ],
  pages: [
    {
      title:"Home",
      slug:"home",
      theme:"dark",
      hero:{
        bg:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80",
        overlay:"Honest News Network",
        sub:"Everything You Need for Biblical Truth",
        transparentMenu:false,
        behavior:"parallax-medium",
        size:"full",
        customHeight:""
      },
      blocks:[]
    },
    {
      title:"Podcast",
      slug:"podcast",
      theme:"dark",
      hero:{
        bg:"",
        overlay:"Latest Episodes",
        sub:"New episodes every Sunday",
        transparentMenu:true,
        behavior:"parallax-slow",
        size:"full",
        customHeight:""
      },
      blocks:[]
    },
    {
      title:"Shop",
      slug:"shop",
      theme:"dark",
      hero:{
        bg:"",
        overlay:"Recommended Resources",
        sub:"Support your walk and support the ministry",
        transparentMenu:true,
        behavior:"still",
        size:"medium",
        customHeight:""
      },
      blocks:[]
    },
    {
      title:"Support",
      slug:"support",
      theme:"dark",
      hero:{
        bg:"",
        overlay:"Support Honest News",
        sub:"Partner with the work of Biblical Truth",
        transparentMenu:true,
        behavior:"still",
        size:"medium",
        customHeight:""
      },
      blocks:[]
    },
    {
      title:"Contact",
      slug:"contact",
      theme:"dark",
      hero:{
        bg:"",
        overlay:"Contact",
        sub:"Reach out with questions, prayer requests, or ideas.",
        transparentMenu:false,
        behavior:"still",
        size:"medium",
        customHeight:""
      },
      blocks:[]
    }
  ],
  theme: {},
  heroSlides: []
};

let current = null;
let isDirty = false;
let activeInspectorTab = "page";
const DRAFT_KEY = "hn_cms_draft_v1";

/* panel behavior: auto | manual | pinned | smart */
let panelBehavior = localStorage.getItem("hn_panel_behavior") || "auto";

const panel    = document.getElementById("inspectorPanel");
const handle   = document.getElementById("panelHandle");
const closeBtn = document.getElementById("closePanelBtn");
const saveStatusRight = document.getElementById("saveStatusRight");

/* Render Cloud endpoint */
const SAVE_ENDPOINT = "https://honest-news.onrender.com/save";

/* =========================================
   SECTION 2: LOAD site-data.json + DRAFT
   ========================================= */

(async function loadSiteData() {
  try {
    const res = await fetch("site-data.json?cache-bust=" + Date.now());
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === "object") {
        // Merge, but let incoming site-data override defaults
        site = Object.assign({}, site, data);

        // Normalize pages: allow object or array in site-data.json
        if (data.pages) {
          if (Array.isArray(data.pages)) {
            site.pages = data.pages;
          } else if (typeof data.pages === "object") {
            site.pages = Object.keys(data.pages).map(key => {
              const p = data.pages[key] || {};
              return Object.assign(
                {
                  title: p.title || key,
                  slug: p.slug || key
                },
                p
              );
            });
          }
        }

        // Normalize menu to array
        if (data.menu && Array.isArray(data.menu)) {
          site.menu = data.menu;
        }
      }
    }
  } catch (e) {
    console.warn("Could not load site-data.json, using defaults", e);
  }

  // Restore local draft from this browser if any
  restoreDraftIfAny();

  // Initial render
  renderPages();
  updatePreviewHeader();
  renderPreview();
  applyPanelBehavior();
})();

/* DRAFT SAVE / RESTORE */
function saveDraft(){
  try{
    localStorage.setItem(DRAFT_KEY, JSON.stringify(site));
    markSavedLocal(); // reuse pill style
  } catch(e){
    alert("Could not save draft locally.");
  }
}
function restoreDraftIfAny(){
  try{
    const raw = localStorage.getItem(DRAFT_KEY);
    if(!raw) return;
    const parsed = JSON.parse(raw);
    if(parsed && typeof parsed === "object") {
      site = Object.assign({}, site, parsed);
    }
  } catch(e){
    console.warn("No valid draft to restore");
  }
}

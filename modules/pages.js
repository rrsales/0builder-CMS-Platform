// pages.js
// 0Builder CMS Platform 1.0
// (c) 2025 0Builder.LLC

/*
  PAGES: Add, delete, select, and slugify logic for pages
*/

import { site, current, markDirty, publish } from "./core.js";
import { renderPages } from "./left-panel.js";

// Add new page
export function newPage(){
  const t = prompt("Page title?");
  if (!t) return;
  const slug = t.toLowerCase().replace(/\s+/g,"-");
  if (!site.pages) site.pages = [];
  site.pages.push({
    title:t,
    slug,
    theme:"dark",
    hero:{
      bg:"",
      overlay:t,
      sub:"",
      transparentMenu:false,
      behavior:"still",
      size:"full",
      customHeight:""
    },
    blocks:[]
  });
  markDirty();
  renderPages();
  publish("pagesChanged");
}

// Delete page
export function deletePage(index){
  const page = (site.pages || [])[index];
  if (!page) return;
  if (!confirm(`Delete page "${page.title || page.slug || 'Untitled'}"?\nThis will also remove it from the navigation menu.`)) return;
  const slug = page.slug || "";
  const url1 = slug ? slug + ".html" : "";
  const url2 = slug;
  if (Array.isArray(site.menu)){
    site.menu = site.menu.filter(item =>
      item.url !== url1 && item.url !== url2
    );
  }
  site.pages.splice(index,1);
  markDirty();
  renderPages();
  publish("pagesChanged");
}
window._obuilder_newPage = newPage;
window._obuilder_deletePage = deletePage;

// Select page
export function selectPage(i){
  window.current = site.pages[i];
  renderPages();
  publish("pageSelected", { index: i });
}
window._obuilder_selectPage = selectPage;

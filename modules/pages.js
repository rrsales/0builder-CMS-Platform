// modules/pages.js
// CMS-connected Page Manager

import { getPages, updatePages } from "./dataService.js";

const pagesPanel = document.getElementById("pagesPanel");
let pages = [];

// ---------- Render ----------
export function setPages(data) {
  pages = data || getPages();
  renderPagesPanel();
}

function renderPagesPanel() {
  pagesPanel.innerHTML = `
    <div class="panelHeader">
      <h2>Pages</h2>
      <button id="addPageBtn" title="Add Page"><i class="fa fa-plus"></i></button>
    </div>
    <ul id="pagesList">
      ${pages
        .map(
          (p, i) => `
        <li data-index="${i}">
          <span class="pageTitle">${p.title}</span>
          <div class="actions">
            <button class="renamePage"><i class="fa fa-pen"></i></button>
            <button class="deletePage"><i class="fa fa-trash"></i></button>
          </div>
        </li>`
        )
        .join("")}
    </ul>
  `;

  attachPageListeners();
}

// ---------- Listeners ----------
function attachPageListeners() {
  const addBtn = document.getElementById("addPageBtn");
  const list = document.getElementById("pagesList");

  if (addBtn) addBtn.onclick = () => {
    const title = prompt("New page title:");
    if (title) addPage(title);
  };

  list.querySelectorAll(".renamePage").forEach(btn => {
    btn.onclick = e => {
      const li = e.target.closest("li");
      const index = parseInt(li.dataset.index);
      const title = prompt("Rename page:", pages[index].title);
      if (title) renamePage(index, title);
    };
  });

  list.querySelectorAll(".deletePage").forEach(btn => {
    btn.onclick = e => {
      const li = e.target.closest("li");
      const index = parseInt(li.dataset.index);
      if (confirm("Delete this page?")) deletePage(index);
    };
  });

  list.querySelectorAll(".pageTitle").forEach(span => {
    span.onclick = e => {
      const index = e.target.closest("li").dataset.index;
      selectPage(index);
    };
  });
}

// ---------- CRUD ----------
function addPage(title) {
  const slug = title.toLowerCase().replace(/\s+/g, "-");
  const newPage = {
    title,
    slug,
    theme: "light",
    hero: {
      bg: "",
      overlay: "",
      sub: "",
      transparentMenu: true,
      behavior: "parallax-medium",
      size: "custom",
      customHeight: ""
    }
  };
  pages.push(newPage);
  updatePages(pages);
  renderPagesPanel();
}

function renamePage(index, title) {
  pages[index].title = title;
  pages[index].slug = title.toLowerCase().replace(/\s+/g, "-");
  updatePages(pages);
  renderPagesPanel();
}

function deletePage(index) {
  pages.splice(index, 1);
  updatePages(pages);
  renderPagesPanel();
}

function selectPage(index) {
  const event = new CustomEvent("pageSelected", { detail: pages[index] });
  window.dispatchEvent(event);
}

// ---------- Style ----------
const style = document.createElement("style");
style.textContent = `
#pagesPanel {padding:1rem;border-bottom:1px solid var(--border);}
#pagesPanel .panelHeader {display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem;}
#pagesPanel h2 {font-size:1rem;margin:0;color:var(--accent);}
#pagesPanel button {background:none;border:none;color:var(--text);cursor:pointer;font-size:.9rem;}
#pagesPanel ul {list-style:none;padding:0;margin:0;}
#pagesPanel li {display:flex;align-items:center;justify-content:space-between;padding:.35rem .25rem;border-radius:.5rem;transition:background .2s;}
#pagesPanel li:hover {background:rgba(255,255,255,0.05);}
#pagesPanel .pageTitle {cursor:pointer;}
#pagesPanel .actions button {margin-left:.3rem;}
`;
document.head.appendChild(style);


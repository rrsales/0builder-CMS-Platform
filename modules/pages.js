// modules/pages.js
// Handles the Pages panel in the left sidebar

const pagesPanel = document.getElementById("pagesPanel");

// ---------- Render Panel ----------
export function renderPagesPanel(pages = []) {
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

// ---------- Event Handlers ----------
function attachPageListeners() {
  const addBtn = document.getElementById("addPageBtn");
  const list = document.getElementById("pagesList");
  if (!addBtn || !list) return;

  addBtn.onclick = () => {
    const title = prompt("New page title:");
    if (title) addPage(title);
  };

  list.querySelectorAll(".renamePage").forEach(btn => {
    btn.onclick = e => {
      const li = e.target.closest("li");
      const index = li.dataset.index;
      const title = prompt("Rename page:", li.querySelector(".pageTitle").textContent);
      if (title) renamePage(index, title);
    };
  });

  list.querySelectorAll(".deletePage").forEach(btn => {
    btn.onclick = e => {
      const li = e.target.closest("li");
      const index = li.dataset.index;
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
let pageData = [];

export function setPages(data) {
  pageData = data;
  renderPagesPanel(pageData);
}

function addPage(title) {
  const slug = title.toLowerCase().replace(/\s+/g, "-");
  pageData.push({ title, slug, hero: {}, blocks: [] });
  renderPagesPanel(pageData);
  savePages();
}

function renamePage(index, title) {
  pageData[index].title = title;
  pageData[index].slug = title.toLowerCase().replace(/\s+/g, "-");
  renderPagesPanel(pageData);
  savePages();
}

function deletePage(index) {
  pageData.splice(index, 1);
  renderPagesPanel(pageData);
  savePages();
}

function selectPage(index) {
  const event = new CustomEvent("pageSelected", { detail: pageData[index] });
  window.dispatchEvent(event);
}

// ---------- Save ----------
function savePages() {
  localStorage.setItem("hn_pages", JSON.stringify(pageData));
}

// ---------- Init ----------
window.addEventListener("load", () => {
  const saved = localStorage.getItem("hn_pages");
  if (saved) {
    pageData = JSON.parse(saved);
    renderPagesPanel(pageData);
  } else {
    // Default page
    setPages([{ title: "Home", slug: "index", hero: {}, blocks: [] }]);
  }
});

// ---------- Basic Styling ----------
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

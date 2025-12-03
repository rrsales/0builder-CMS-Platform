// modules/containers.js
// Manages content containers (sections / blocks) for each page

let activePage = null;
let containerArea = null;

// ---------- Initialize ----------
export function initContainers() {
  containerArea = document.createElement("div");
  containerArea.id = "containersArea";
  containerArea.innerHTML = `
    <div class="containerHeader">
      <h2>Content Blocks</h2>
      <button id="addBlockBtn"><i class="fa fa-plus"></i> Add Block</button>
    </div>
    <ul id="blockList"></ul>
  `;
  document.getElementById("canvasContent")?.appendChild(containerArea);
  attachContainerListeners();
}

// ---------- Render ----------
function renderBlocks(blocks = []) {
  const list = document.getElementById("blockList");
  if (!list) return;
  list.innerHTML = blocks
    .map(
      (block, i) => `
      <li data-index="${i}">
        <span>${block.type.toUpperCase()}</span>
        <div class="actions">
          <button class="editBlock"><i class="fa fa-pen"></i></button>
          <button class="deleteBlock"><i class="fa fa-trash"></i></button>
        </div>
      </li>`
    )
    .join("");
  attachBlockListeners();
}

// ---------- Event Handlers ----------
function attachContainerListeners() {
  const addBtn = document.getElementById("addBlockBtn");
  if (addBtn)
    addBtn.onclick = () => {
      const type = prompt("Block type (text/image/embed):", "text");
      if (!type) return;
      const newBlock = { type, content: type === "text" ? "New text..." : "" };
      if (!activePage.blocks) activePage.blocks = [];
      activePage.blocks.push(newBlock);
      saveBlocks();
      renderBlocks(activePage.blocks);
    };
}

function attachBlockListeners() {
  document.querySelectorAll(".editBlock").forEach(btn => {
    btn.onclick = e => {
      const li = e.target.closest("li");
      const idx = parseInt(li.dataset.index);
      editBlock(idx);
    };
  });

  document.querySelectorAll(".deleteBlock").forEach(btn => {
    btn.onclick = e => {
      const li = e.target.closest("li");
      const idx = parseInt(li.dataset.index);
      if (confirm("Delete this block?")) deleteBlock(idx);
    };
  });
}

// ---------- CRUD ----------
function editBlock(index) {
  const block = activePage.blocks[index];
  if (block.type === "text") {
    const newText = prompt("Edit text block:", block.content);
    if (newText !== null) {
      block.content = newText;
      saveBlocks();
      renderBlocks(activePage.blocks);
    }
  } else {
    alert("Editing for this block type coming soon!");
  }
}

function deleteBlock(index) {
  activePage.blocks.splice(index, 1);
  saveBlocks();
  renderBlocks(activePage.blocks);
}

// ---------- Storage ----------
function saveBlocks() {
  const savedPages = JSON.parse(localStorage.getItem("hn_pages") || "[]");
  const idx = savedPages.findIndex(p => p.slug === activePage.slug);
  if (idx > -1) {
    savedPages[idx] = activePage;
    localStorage.setItem("hn_pages", JSON.stringify(savedPages));
  }
}

// ---------- Listeners ----------
window.addEventListener("pageSelected", e => {
  activePage = e.detail;
  if (!activePage.blocks) activePage.blocks = [];
  renderBlocks(activePage.blocks);
});

window.addEventListener("pageUpdated", e => {
  activePage = e.detail;
  if (!activePage.blocks) activePage.blocks = [];
  renderBlocks(activePage.blocks);
});

// ---------- Styles ----------
const style = document.createElement("style");
style.textContent = `
#containersArea {margin-top:1rem;padding:1rem;background:#0f172a;border-radius:var(--radius);border:1px solid var(--border);}
#containersArea .containerHeader {display:flex;align-items:center;justify-content:space-between;margin-bottom:.5rem;}
#containersArea h2 {font-size:1rem;margin:0;color:var(--accent);}
#containersArea button {background:none;border:1px solid var(--border);border-radius:.4rem;padding:.3rem .5rem;color:var(--text);cursor:pointer;}
#containersArea ul {list-style:none;padding:0;margin:0;}
#containersArea li {display:flex;align-items:center;justify-content:space-between;padding:.35rem .25rem;border-radius:.5rem;transition:background .2s;}
#containersArea li:hover {background:rgba(255,255,255,0.05);}
#containersArea .actions button {margin-left:.3rem;background:none;border:none;color:var(--text);cursor:pointer;}
`;
document.head.appendChild(style);

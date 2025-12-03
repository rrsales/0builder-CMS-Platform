// modules/textEditor.js
// Handles inline rich-text editing for text blocks

const textEditorPanel = document.getElementById("textEditorPanel");
let activeBlock = null;

// ---------- Render ----------
export function renderTextEditor(block = null) {
  if (!block) {
    textEditorPanel.innerHTML = `<div class="placeholder">Select a text block to edit.</div>`;
    return;
  }

  activeBlock = block;

  textEditorPanel.innerHTML = `
    <div class="panelHeader">
      <h2>Text Editor</h2>
    </div>
    <div class="toolbar">
      <button data-cmd="bold"><i class="fa fa-bold"></i></button>
      <button data-cmd="italic"><i class="fa fa-italic"></i></button>
      <button data-cmd="underline"><i class="fa fa-underline"></i></button>
      <button data-cmd="createLink"><i class="fa fa-link"></i></button>
      <button data-cmd="removeFormat"><i class="fa fa-eraser"></i></button>
    </div>
    <div id="editorArea" contenteditable="true">${block.content}</div>
    <button id="saveTextBlock" class="saveBtn">Save Text</button>
  `;

  attachTextEditorListeners();
}

// ---------- Listeners ----------
function attachTextEditorListeners() {
  const editor = document.getElementById("editorArea");
  const saveBtn = document.getElementById("saveTextBlock");

  textEditorPanel.querySelectorAll(".toolbar button").forEach(btn => {
    btn.onclick = () => {
      const cmd = btn.dataset.cmd;
      if (cmd === "createLink") {
        const url = prompt("Enter URL:");
        if (url) document.execCommand(cmd, false, url);
      } else {
        document.execCommand(cmd, false, null);
      }
    };
  });

  saveBtn.onclick = () => {
    if (!activeBlock) return;
    activeBlock.content = editor.innerHTML;
    saveTextBlock(activeBlock);
    saveBtn.textContent = "Saved!";
    setTimeout(() => (saveBtn.textContent = "Save Text"), 1500);
  };
}

// ---------- Storage ----------
function saveTextBlock(block) {
  // Update localStorage with edited block content
  const savedPages = JSON.parse(localStorage.getItem("hn_pages") || "[]");
  savedPages.forEach(p => {
    if (p.blocks) {
      const found = p.blocks.find(b => b.content === activeBlock.content);
      if (found) found.content = block.content;
    }
  });
  localStorage.setItem("hn_pages", JSON.stringify(savedPages));

  // Notify other modules (like canvas)
  const event = new CustomEvent("blockUpdated", { detail: block });
  window.dispatchEvent(event);
}

// ---------- Init ----------
window.addEventListener("load", () => renderTextEditor(null));

// ---------- Styles ----------
const style = document.createElement("style");
style.textContent = `
#textEditorPanel {padding:1rem;}
#textEditorPanel h2 {font-size:1rem;margin:0;color:var(--accent);}
#textEditorPanel .toolbar {display:flex;gap:.4rem;margin:.6rem 0;}
#textEditorPanel .toolbar button {
  background:none;
  border:1px solid var(--border);
  color:var(--text);
  border-radius:.4rem;
  padding:.3rem .5rem;
  cursor:pointer;
}
#textEditorPanel #editorArea {
  background:#0f172a;
  border:1px solid var(--border);
  border-radius:.5rem;
  min-height:150px;
  padding:.6rem;
  color:var(--text);
  overflow:auto;
}
#textEditorPanel .saveBtn {
  margin-top:.6rem;
  width:100%;
  padding:.5rem;
  border:none;
  border-radius:.5rem;
  background:var(--accent);
  color:#fff;
  cursor:pointer;
  font-weight:500;
}
#textEditorPanel .placeholder {padding:2rem;text-align:center;opacity:.5;font-size:.9rem;}
`;
document.head.appendChild(style);

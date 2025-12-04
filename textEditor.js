// modules/textEditor.js
export function initTextEditor() {
  const panel = document.getElementById('textEditorPanel');
  panel.innerHTML = `
    <b>Text Editor</b><br>
    <textarea style="width:100%;height:100px;">Edit page HTML here...</textarea>
    <br><button onclick="alert('Save!')">Save</button>
  `;
}

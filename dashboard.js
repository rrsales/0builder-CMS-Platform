// dashboard.js

document.addEventListener("DOMContentLoaded", function () {
  // PANEL TOGGLES (for mobile)
  document.getElementById("toggleLeft").onclick = function () {
    document.getElementById("leftPanel").classList.toggle("show");
  };
  document.getElementById("toggleRight").onclick = function () {
    document.getElementById("rightPanel").classList.toggle("show");
  };

  // LEFT PANEL — Pages List
  document.getElementById("pagesPanel").innerHTML = `
    <b>Pages</b>
    <ul style="padding-left:1em;">
      <li><button onclick="window.showPage('Home')">Home</button></li>
      <li><button onclick="window.showPage('About')">About</button></li>
      <li><button onclick="window.showPage('Contact')">Contact</button></li>
    </ul>
  `;

  // LEFT PANEL — Menu (Demo)
  document.getElementById("menuPanel").innerHTML = `
    <b>Menu (Demo)</b>
    <ul style="padding-left:1em;">
      <li>Home</li>
      <li>About</li>
      <li>Contact</li>
    </ul>
  `;

  // MAIN CANVAS — Default
  document.getElementById("canvasContent").innerHTML = `
    <h2>Welcome to Honest News CMS</h2>
    <p>Select a page on the left to view or edit its content.</p>
  `;

  // RIGHT PANEL — Inspector
  document.getElementById("inspectorPanel").innerHTML = `
    <b>Inspector</b>
    <div id="inspectorContent">Select a page to inspect.</div>
  `;

  // RIGHT PANEL — Text Editor
  document.getElementById("textEditorPanel").innerHTML = `
    <b>Text Editor</b>
    <textarea id="editorBox" style="width:100%;height:90px;margin-top:0.5em;"></textarea>
    <br>
    <button id="saveBtn" style="margin-top:0.5em;">Save & Preview</button>
    <span id="saveStatus" style="margin-left:1em;font-size:0.9em;"></span>
  `;

  // PAGE DATA (demo, could be loaded from JSON later)
  const PAGES = {
    "Home": {
      title: "Home",
      content: "<h2>Home</h2><p>Welcome to Honest News CMS.</p>",
      info: "This is your home page."
    },
    "About": {
      title: "About",
      content: "<h2>About</h2><p>About your ministry goes here.</p>",
      info: "Edit your about page content here."
    },
    "Contact": {
      title: "Contact",
      content: "<h2>Contact</h2><p>Email and contact info goes here.</p>",
      info: "Contact information panel."
    }
  };

  // SELECT PAGE FUNCTION
  window.showPage = function (pageName) {
    const page = PAGES[pageName];
    if (!page) return;
    document.getElementById("canvasContent").innerHTML = page.content;
    document.getElementById("inspectorContent").innerHTML = page.info;
    document.getElementById("editorBox").value = page.content.replace(/<\/?[^>]+(>|$)/g, ""); // plain text for demo
    // Save handler sets up for this page
    document.getElementById("saveBtn").onclick = function () {
      const val = document.getElementById("editorBox").value;
      page.content = `<h2>${page.title}</h2><p>${val}</p>`;
      document.getElementById("canvasContent").innerHTML = page.content;
      document.getElementById("saveStatus").textContent = "Saved!";
      setTimeout(() => { document.getElementById("saveStatus").textContent = ""; }, 1200);
    };
  };

  // Default: show Home page
  window.showPage("Home");
});

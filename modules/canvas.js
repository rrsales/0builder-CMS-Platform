// modules/canvas.js
const canvas = document.getElementById("canvasContent");
export function renderCanvas(page=null){
  if(!page){canvas.innerHTML="<p>No page selected</p>";return;}
  canvas.innerHTML=`
    <h2>${page.title}</h2>
    <p>Theme: ${page.theme}</p>
    <p>Menu transparent? ${page.hero.transparentMenu}</p>`;
}
window.addEventListener("pageSelected",e=>renderCanvas(e.detail));
window.addEventListener("pageUpdated",e=>renderCanvas(e.detail));
window.addEventListener("load",()=>renderCanvas(null));


// ---------- Respond to Page Selection ----------
window.addEventListener("pageSelected", e => renderCanvas(e.detail));

// ---------- Respond to Inspector Updates ----------
window.addEventListener("pageUpdated", e => renderCanvas(e.detail));

// ---------- Init ----------
window.addEventListener("load", () => {
  renderCanvas(null);
});

// ---------- Styles ----------
const style = document.createElement("style");
style.textContent = `
#canvasContent {
  flex:1;
  overflow:auto;
  padding:1rem;
  display:flex;
  align-items:center;
  justify-content:center;
  color:var(--text);
}

.canvasInner {
  width:100%;
  max-width:900px;
  background:#0f172a;
  border:1px solid var(--border);
  border-radius:var(--radius);
  box-shadow:var(--shadow-soft);
  overflow:hidden;
}

.hero {
  padding:3rem 2rem;
  text-align:center;
  background:linear-gradient(135deg,#0ea5e9 0%,#0369a1 100%);
  color:white;
}
.hero-small {padding:2rem;}
.hero-medium {padding:3rem;}
.hero-large {padding:5rem;}
.hero-full {padding:8rem 2rem;}

.heroInfo h1 {margin:0;font-size:1.8rem;}
.contentBlocks {padding:2rem;color:#cbd5e1;}
.placeholder {opacity:.5;text-align:center;}
`;
document.head.appendChild(style);

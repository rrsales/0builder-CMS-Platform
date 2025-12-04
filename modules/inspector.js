// modules/inspector.js
import { getPages, updatePages } from "./dataService.js";
const inspector = document.getElementById("inspectorPanel");
let current=null;
export function renderInspector(page=null){
  if(!page){inspector.innerHTML="<p>Select a page</p>";return;}
  current=page;
  let theme=page.theme||"light", beh=page.hero.behavior||"",trans=page.hero.transparentMenu?"checked":"";
  inspector.innerHTML=`
    <h2>Inspector</h2>
    <label>Title<input id="inpTitle" value="${page.title}"></label>
    <label>Theme<select id="inpTheme"><option${theme==="light"?" selected":""} value="light">Light</option><option${theme==="dark"?" selected":""} value="dark">Dark</option></select></label>
    <label><input type="checkbox" id="inpTrans" ${trans}> Transparent Menu</label>
    <button id="saveIns">Save</button>`;
  document.getElementById("saveIns").onclick=()=>{
    let t=document.getElementById("inpTitle").value;
    let th=document.getElementById("inpTheme").value;
    let tm=document.getElementById("inpTrans").checked;
    current.title=t; current.theme=th; current.hero={...current.hero,transparentMenu:tm};
    let pages=getPages(), idx=pages.findIndex(p=>p.slug===current.slug);
    pages[idx]=current; updatePages(pages);
    window.dispatchEvent(new CustomEvent("pageUpdated",{detail:current}));
  };
}
window.addEventListener("pageSelected",e=>renderInspector(e.detail));
window.addEventListener("load",()=>renderInspector(null));



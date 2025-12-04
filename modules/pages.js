// modules/pages.js
import { getPages, updatePages } from "./dataService.js";
const pagesPanel = document.getElementById("pagesPanel");
let pages = [];
export function setPages(data) {
  pages = data||getPages(); renderPages();
}
function renderPages(){
  pagesPanel.innerHTML = `
    <div class="panelHeader"><h2>Pages</h2><button id="addPageBtn"><i class="fa fa-plus"></i></button></div>
    <ul id="pagesList">${pages.map((p,i)=>`
      <li data-index="${i}">
        <span class="pageTitle">${p.title}</span>
        <div class="actions">
          <button class="renamePage"><i class="fa fa-pen"></i></button>
          <button class="deletePage"><i class="fa fa-trash"></i></button>
        </div>
      </li>`).join("")}
    </ul>`;
  attach();
}
function attach(){
  document.getElementById("addPageBtn").onclick = ()=>{ let t=prompt("Title:"); if(t)addPage(t); };
  document.querySelectorAll(".renamePage").forEach(btn => btn.onclick = e=>{
    let li=e.target.closest("li"),i=+li.dataset.index,t=prompt("Rename:",pages[i].title);
    if(t){pages[i].title=t;pages[i].slug=t.toLowerCase().replace(/\s+/g,"-");save();}
  });
  document.querySelectorAll(".deletePage").forEach(btn => btn.onclick = e=>{
    let i=+e.target.closest("li").dataset.index;
    if(confirm("Delete?")){pages.splice(i,1);save();}
  });
  document.querySelectorAll(".pageTitle").forEach(span=>span.onclick = e=>{
    let p=pages[+e.target.closest("li").dataset.index];
    window.dispatchEvent(new CustomEvent("pageSelected",{detail:p}));
  });
}
function addPage(title){
  let slug=title.toLowerCase().replace(/\s+/g,"-");
  pages.push({title,slug,theme:"light",hero:{},blocks:[]});
  save();
}
function save(){
  updatePages(pages);
  renderPages();
}
// init on load
window.addEventListener("load",()=>setPages(getPages()));



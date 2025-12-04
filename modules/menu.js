// modules/menu.js
import { getMenu, updateMenu } from "./dataService.js";
const menuPanel = document.getElementById("menuPanel");
let menuData = [];
export function renderMenuPanel(data=null){
  menuData = data||getMenu();
  menuPanel.innerHTML = `
    <div class="panelHeader"><h2>Menu</h2><button id="addItem"><i class="fa fa-plus"></i></button></div>
    <ul id="menuList">${menuData.map((it,i)=>`
      <li data-index="${i}">
        <span>${it.label} <em>${it.type}</em></span>
        <div class="actions">
          <button class="editItem"><i class="fa fa-pen"></i></button>
          <button class="delItem"><i class="fa fa-trash"></i></button>
        </div>
      </li>`).join("")}
    </ul>`;
  attach();
}
function attach(){
  document.getElementById("addItem").onclick = ()=>{
    let lbl=prompt("Label:"),type=prompt("Type (link/mega)","link");
    if(!lbl) return;
    if(type==="mega") menuData.push({label:lbl,type:"mega",subItems:[]});
    else{let url=prompt("URL:"); menuData.push({label:lbl,url,type:"link"});}
    save();
  };
  menuPanel.querySelectorAll(".editItem").forEach(btn=>btn.onclick=e=>{
    let i=+e.target.closest("li").dataset.index,it=menuData[i],lbl=prompt("Label:",it.label);
    if(!lbl) return;
    if(it.type==="link"){let url=prompt("URL:",it.url); menuData[i]={label:lbl,url,type:"link"};}
    else menuData[i].label=lbl;
    save();
  });
  menuPanel.querySelectorAll(".delItem").forEach(btn=>btn.onclick=e=>{
    let i=+e.target.closest("li").dataset.index;
    if(confirm("Delete?")){menuData.splice(i,1); save();}
  });
}
function save(){ updateMenu(menuData); renderMenuPanel(menuData); }
window.addEventListener("load",()=>renderMenuPanel(getMenu()));



/* =========================================
   SECTION 7: INSPECTOR TABS (RIGHT PANEL)
   ========================================= */

document.querySelectorAll(".inspect-tab").forEach(tab=>{
  tab.addEventListener("click", ()=>{
    activeInspectorTab = tab.dataset.inspect;
    document.querySelectorAll(".inspect-tab").forEach(t=>{
      t.classList.toggle("active", t===tab);
    });
    renderInspectorTab();
    if (["auto","pinned","smart"].includes(panelBehavior)){
      openPanel("auto");
    }
  });
});

function renderInspectorTab(){
  const body = document.getElementById("inspectorBody");
  if (!current && activeInspectorTab!=="site"){
    body.innerHTML = `<p style="color:#9ca3af;">Select a page on the left to edit.</p>`;
    return;
  }
  if (activeInspectorTab === "page"){
    body.innerHTML = renderPageTabHtml(current);
  } else if (activeInspectorTab === "hero"){
    body.innerHTML = renderHeroTabHtml(current);
  } else if (activeInspectorTab === "blocks"){
    body.innerHTML = renderBlocksTabHtml(current);
  } else {
    body.innerHTML = renderSiteTabHtml();
    wirePanelBehaviorRadios();
  }
}

/* PAGE TAB */
function renderPageTabHtml(c){
  const themeLight = c.theme === "light";
  return `
    <div class="section">
      <div class="field-group">
        <div class="field-label">Title</div>
        <input type="text" value="${c.title || ''}"
          onchange="current.title=this.value;markDirty();renderPages();updatePreviewHeader();">
      </div>

      <div class="field-group">
        <div class="field-label">Slug</div>
        <input type="text" value="${c.slug || ''}"
          placeholder="home, podcast, shop..."
          onchange="current.slug=this.value;markDirty();renderPages();updatePreviewHeader();">
        <div class="field-hint">
          Used by <code>data-page="slug"</code> in your HTML &lt;body&gt;.
        </div>
      </div>

      <div class="field-group">
        <div class="field-label">Theme</div>
        <label class="inline">
          <input type="radio" name="themeRadio" value="light" ${themeLight?'checked':''}
            onchange="current.theme='light';markDirty();">
          Light
        </label>
        <label class="inline">
          <input type="radio" name="themeRadio" value="dark" ${!themeLight?'checked':''}
            onchange="current.theme='dark';markDirty();">
          Dark
        </label>
      </div>
    </div>
  `;
}

/* HERO TAB */
function renderHeroTabHtml(c){
  const h = c.hero || {};
  const size = h.size || "full";
  const behavior = h.behavior || "still";

  return `
    <div class="section">
      <div class="field-group">
        <div class="field-label">Background image URL</div>
        <input type="url" value="${h.bg || ''}" placeholder="https://..."
          onchange="current.hero.bg=this.value;markDirty();renderPreview();">
      </div>

      <div class="field-group">
        <div class="field-label">Main title</div>
        <input type="text" value="${h.overlay || ''}" placeholder="Main hero title"
          onchange="current.hero.overlay=this.value;markDirty();renderPreview();">
      </div>

      <div class="field-group">
        <div class="field-label">Subtitle</div>
        <input type="text" value="${h.sub || ''}" placeholder="Optional subtitle"
          onchange="current.hero.sub=this.value;markDirty();renderPreview();">
      </div>

      <div class="field-group">
        <label class="inline">
          <input type="checkbox" ${h.transparentMenu ? "checked" : "" }
            onchange="current.hero.transparentMenu=this.checked;markDirty();">
          Transparent header on this page
        </label>
      </div>

      <div class="field-group">
        <div class="field-label">Hero behavior</div>
        <select onchange="current.hero.behavior=this.value;markDirty();">
          <option value="still" ${behavior==='still'?'selected':''}>Still image</option>
          <option value="parallax-slow" ${behavior==='parallax-slow'?'selected':''}>Parallax – slow</option>
          <option value="parallax-medium" ${behavior==='parallax-medium'?'selected':''}>Parallax – medium</option>
          <option value="float-up" ${behavior==='float-up'?'selected':''}>Float up</option>
        </select>
      </div>

      <div class="field-group">
        <div class="field-label">Hero height</div>
        <label class="inline">
          <input type="radio" name="heroSize" value="small" ${size==="small"?'checked':''}
            onchange="setHeroSize('small')">
          Small (≈40vh)
        </label><br>
        <label class="inline">
          <input type="radio" name="heroSize" value="medium" ${size==="medium"?'checked':''}
            onchange="setHeroSize('medium')">
          Medium (≈60vh)
        </label><br>
        <label class="inline">
          <input type="radio" name="heroSize" value="large" ${size==="large"?'checked':''}
            onchange="setHeroSize('large')">
          Large (≈80vh)
        </label><br>
        <label class="inline">
          <input type="radio" name="heroSize" value="full" ${size==="full"?'checked':''}
            onchange="setHeroSize('full')">
          Fullscreen (100vh)
        </label><br>
        <label class="inline">
          <input type="radio" name="heroSize" value="custom" ${size==="custom"?'checked':''}
            onchange="setHeroSize('custom')">
          Custom:
        </label>
        <input type="text" value="${h.customHeight || ''}" placeholder="e.g. 520px or 80vh"
          onchange="setHeroCustom(this.value)">
        <div class="field-hint">Custom height lets you match Podbean-style heroes exactly.</div>
      </div>
    </div>
  `;
}

function setHeroSize(size){
  if (!current.hero) current.hero = {};
  current.hero.size = size;
  markDirty();
  renderPreview();
}
function setHeroCustom(val){
  if (!current.hero) current.hero = {};
  current.hero.size = "custom";
  current.hero.customHeight = val.trim();
  markDirty();
  renderPreview();
}


/* =========================================
   SECTION 8: BLOCKS TAB (RIGHT → BLOCKS)
   ========================================= */

function renderBlocksTabHtml(c){
  const blocks = c.blocks || [];
  let html = `
    <div class="panelSection">
      <div class="panelLabel">Add blocks</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        <button class="btn secondary" type="button" onclick="addBlock('heading')">+ Heading</button>
        <button class="btn secondary" type="button" onclick="addBlock('paragraph')">+ Paragraph</button>
        <button class="btn secondary" type="button" onclick="addBlock('image')">+ Image</button>
        <button class="btn secondary" type="button" onclick="addBlock('button')">+ Button</button>
        <button class="btn secondary" type="button" onclick="addBlock('product')">+ Amazon product</button>
        <button class="btn secondary" type="button" onclick="addBlock('podcast')">+ Podcast</button>
        <button class="btn secondary" type="button" onclick="addBlock('youtube')">+ YouTube</button>
      </div>
    </div>
    <div class="panelSection">
  `;
  blocks.forEach((b,i)=>{
    const motion = b.motion || "fade";
    html += `
      <div class="block">
        <div class="block-header-line">
          <span class="block-type">${b.type.toUpperCase()}</span>
          <span>
            Motion:
            <select class="motion-select"
              onchange="current.blocks[${i}].motion=this.value;markDirty();renderPreview();">
              <option value="none"  ${motion==='none'?'selected':''}>None</option>
              <option value="fade"  ${motion==='fade'?'selected':''}>Fade</option>
              <option value="float" ${motion==='float'?'selected':''}>Float</option>
              <option value="slide" ${motion==='slide'?'selected':''}>Slide</option>
            </select>
          </span>
        </div>
        ${renderBlockFields(b,i)}
        <div class="tools">
          <button onclick="moveBlock(${i},-1)">↑</button>
          <button onclick="moveBlock(${i},1)">↓</button>
          <button onclick="removeBlock(${i})">×</button>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  return html;
}

function renderBlockFields(b,i){
  if (b.type==="heading"){
    return `
      <div class="field-group">
        <div class="field-label">Text</div>
        <input type="text" value="${b.content || ''}"
          onchange="current.blocks[${i}].content=this.value;markDirty();renderPreview();">
      </div>
    `;
  }
  if (b.type==="paragraph"){
    return `
      <div class="field-group">
        <div class="field-label">Text</div>
        <textarea rows="4"
          onchange="current.blocks[${i}].content=this.value;markDirty();renderPreview();">${b.content || ''}</textarea>
      </div>
    `;
  }
  if (b.type==="image"){
    const mode = b.mode==="upload" ? "upload" : "url";
    return `
      <div class="field-group">
        <div class="field-label">Image source</div>
        <select onchange="current.blocks[${i}].mode=this.value;markDirty();renderInspectorTab();">
          <option value="url" ${mode==='url'?'selected':''}>URL</option>
          <option value="upload" ${mode==='upload'?'selected':''}>Upload</option>
        </select>
      </div>
      ${
        mode==="upload"
        ? `<input type="file" accept="image/*" onchange="handleImageUpload(event,${i})">`
        : `
          <div class="field-group">
            <div class="field-label">Image URL</div>
            <input type="url" value="${b.content || ''}"
              onchange="current.blocks[${i}].content=this.value;markDirty();renderPreview();">
          </div>`
      }
    `;
  }
  if (b.type==="button"){
    return `
      <div class="field-group">
        <div class="field-label">Button text</div>
        <input type="text" value="${b.text || ''}"
          onchange="current.blocks[${i}].text=this.value;markDirty();renderPreview();">
      </div>
      <div class="field-group">
        <div class="field-label">Button URL</div>
        <input type="url" value="${b.url || ''}"
          onchange="current.blocks[${i}].url=this.value;markDirty();renderPreview();">
      </div>
    `;
  }
  if (b.type==="product"){
    return `
      <div class="field-group">
        <div class="field-label">Product title</div>
        <input type="text" value="${b.title || ''}"
          onchange="current.blocks[${i}].title=this.value;markDirty();renderPreview();">
      </div>
      <div class="field-group">
        <div class="field-label">Description</div>
        <textarea rows="3"
          onchange="current.blocks[${i}].text=this.value;markDirty();renderPreview();">${b.text || ''}</textarea>
      </div>
      <div class="field-group">
        <div class="field-label">Image URL</div>
        <input type="url" value="${b.image || ''}"
          onchange="current.blocks[${i}].image=this.value;markDirty();renderPreview();">
      </div>
      <div class="field-group">
        <div class="field-label">Amazon affiliate URL</div>
        <input type="url" value="${b.url || ''}"
          onchange="current.blocks[${i}].url=this.value;markDirty();renderPreview();">
      </div>
    `;
  }
  if (b.type==="podcast"){
    return `
      <div class="field-group">
        <div class="field-label">Episode title</div>
        <input type="text" value="${b.title || ''}"
          onchange="current.blocks[${i}].title=this.value;markDirty();renderPreview();">
      </div>
      <div class="field-group">
        <div class="field-label">Podbean embed URL or iframe src</div>
        <textarea rows="3"
          onchange="current.blocks[${i}].embed=this.value;markDirty();renderPreview();">${b.embed || ''}</textarea>
      </div>
    `;
  }
  if (b.type==="youtube"){
    return `
      <div class="field-group">
        <div class="field-label">Video title</div>
        <input type="text" value="${b.title || ''}"
          onchange="current.blocks[${i}].title=this.value;markDirty();renderPreview();">
      </div>
      <div class="field-group">
        <div class="field-label">YouTube URL or ID</div>
        <input type="text" value="${b.videoId || ''}"
          onchange="current.blocks[${i}].videoId=this.value;markDirty();renderPreview();">
      </div>
    `;
  }
  return "";
}

function addBlock(type){
  if (!current.blocks) current.blocks = [];
  const b = {type, motion:"fade"};
  if(type==="heading")   b.content="New heading";
  if(type==="paragraph") b.content="Your text here...";
  if(type==="image"){    b.mode="url"; b.content=""; }
  if(type==="button"){   b.text="Learn more"; b.url="#"; }
  if(type==="product"){  b.title="Product title"; b.text="Short description"; b.image=""; b.url=""; }
  if(type==="podcast"){  b.title="Episode title"; b.embed=""; }
  if(type==="youtube"){  b.title="Video title";   b.videoId=""; }
  current.blocks.push(b);
  markDirty();
  renderInspectorTab();
  renderPreview();
}

function moveBlock(i,d){
  const arr = current.blocks;
  const item = arr.splice(i,1)[0];
  let newIndex = i + d;
  if (newIndex < 0) newIndex = 0;
  if (newIndex > arr.length) newIndex = arr.length;
  arr.splice(newIndex,0,item);
  markDirty();
  renderInspectorTab();
  renderPreview();
}
function removeBlock(i){
  current.blocks.splice(i,1);
  markDirty();
  renderInspectorTab();
  renderPreview();
}

function handleImageUpload(e,index){
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    current.blocks[index].content = reader.result;
    markDirty();
    renderPreview();
  };
  reader.readAsDataURL(file);
}

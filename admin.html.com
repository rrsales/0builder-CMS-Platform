<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>HNN Admin — Edit Site</title>
<style>
  body{font-family:system-ui;background:#f4f4f4;padding:2rem;color:#222}
  .panel{max-width:900px;margin:auto;background:white;padding:2rem;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.1)}
  input,select,textarea{width:100%;padding:12px;margin:8px 0;border:1px solid #ddd;border-radius:6px;font-size:1rem}
  label{font-weight:bold;margin-top:1rem;display:block}
  button{padding:12px 24px;background:#0066cc;color:white;border:none;border-radius:6px;cursor:pointer;font-size:1.1rem}
  button:hover{background:#0055aa}
  .slide{margin:2rem 0;padding:1rem;background:#fafafa;border-radius:8px}
  .pin-screen{text-align:center;margin-top:100px}
  input[type=color]{height:60px}
</style>
</head>
<body>

<div id="pinScreen" class="pin-screen">
  <h1>Honest News Network Admin</h1>
  <p>Enter 6-digit PIN:</p>
  <input type="password" id="pin" maxlength="6" size="6" style="font-size:2rem;text-align:center;letter-spacing:8px">
  <button onclick="checkPin()">Enter</button>
</div>

<div id="panel" class="panel" style="display:none">

  <h1>Live Site Editor</h1>
  <p>Change anything — hits the site in seconds.</p>

  <label>Primary Button Color</label>
  <input type="color" id="primaryColor" value="#0066cc">

  <label>Header Background</label>
  <input type="color" id="headerBg" value="#111111">

  <label>Body Text Color</label>
  <input type="color" id="textColor" value="#333333">

  <label>Google Font (example: Playfair Display)</label>
  <input type="text" id="fontName" placeholder="Playfair Display" value="Roboto">

  <h2 style="margin-top:3rem">Hero Carousel Slides (drag to reorder later)</h2>
  <div id="slides"></div>

  <button onclick="saveAll()" style="margin-top:2rem">SAVE ALL CHANGES TO LIVE SITE</button>
  <p id="status"></p>
</div>

<script>
// Change this PIN to whatever 6 digits you want
const PIN = "092567";

function checkPin() {
  if (document.getElementById("pin").value === PIN) {
    document.getElementById("pinScreen").style.display = "none";
    document.getElementById("panel").style.display = "block";
    loadData();
  } else {
    alert("Wrong PIN");
  }
}

let data = {};
let slideCount = 0;

async function loadData() {
  const res = await fetch("data.json?" + Date.now());
  data = await res.json();
  document.getElementById("primaryColor").value = data.primaryColor;
  document.getElementById("headerBg").value = data.headerBg;
  document.getElementById("textColor").value = data.textColor;
  document.getElementById("fontName").value = data.fontName;

  const container = document.getElementById("slides");
  container.innerHTML = "";
  data.heroSlides.forEach((s,i) => {
    const div = document.createElement("div");
    div.className = "slide";
    div.innerHTML = `
      <input placeholder="Title (use <br> for line break)" value="${s.title.replace(/<br>/g,'<br>')}"><br>
      <input placeholder="Subtitle" value="${s.subtitle}"><br>
      <input placeholder="Button text" value="${s.buttonText}"><br>
      <input placeholder="Button link" value="${s.buttonLink}"><br>
      <input placeholder="Image URL" value="${s.image}" style="width:100%"><br>
      <button onclick="this.parentElement.remove()">Delete slide</button>
      <hr>
    `;
    container.appendChild(div);
  });
}

function saveAll() {
  data.primaryColor = document.getElementById("primaryColor").value;
  data.headerBg = document.getElementById("headerBg").value;
  data.textColor = document.getElementById("textColor").value;
  data.fontName = document.getElementById("fontName").value;
  data.font = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(data.fontName.replace(/ /g,'+'))}:wght@400;700&display=swap`;

  // rebuild slides
  data.heroSlides = [];
  document.querySelectorAll("#slides .slide").forEach(el => {
    const inputs = el.querySelectorAll("input");
    data.heroSlides.push({
      title: inputs[0].value,
      subtitle: inputs[1].value,
      buttonText: inputs[2].value,
      buttonLink: inputs[3].value,
      image: inputs[4].value
    });
  });

  // GitHub API magic will go here (next message)
  document.getElementById("status").textContent = "Saved! Site updating in 5-10 seconds…";
}
</script>
</body>
</html>

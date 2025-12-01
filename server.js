// =======================================================
// Honest News Cloud CMS - Production Server (Render)
// =======================================================

const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

// -----------------------------------------------
// CONFIG
// -----------------------------------------------
const PORT = process.env.PORT || 3000;

const GITHUB_OWNER  = process.env.GITHUB_OWNER  || "rrsales";
const GITHUB_REPO   = process.env.GITHUB_REPO   || "Honest-News";
const DATA_FILE_PATH = process.env.DATA_FILE_PATH || "site-data.json";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const GITHUB_TOKEN  = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) console.error("🚨 ERROR: GITHUB_TOKEN MISSING");

// -----------------------------------------------
// 100% FIXED CORS + PREFLIGHT
// -----------------------------------------------
app.use(cors({
  origin: [
    "https://rrsales.github.io",
    "https://honest-news.onrender.com",
    "http://localhost:5500",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// REQUIRED: custom preflight handler
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(200);
});

app.use(express.json({ limit: "5mb" }));

// -----------------------------------------------
// GitHub Save Function
// -----------------------------------------------
async function saveToGitHub(jsonString) {
  const apiBase = "https://api.github.com";
  const fileUrl = `${apiBase}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${DATA_FILE_PATH}`;

  const headers = {
    "Authorization": `Bearer ${GITHUB_TOKEN}`,
    "User-Agent": "Honest-News-Cloud-CMS",
    "Accept": "application/vnd.github+json"
  };

  // STEP 1 — get SHA if file exists
  let sha = null;
  const getRes = await fetch(fileUrl, { headers });

  if (getRes.status === 200) {
    const getJson = await getRes.json();
    sha = getJson.sha;
  } else if (getRes.status !== 404) {
    throw new Error(`GitHub GET failed: ${await getRes.text()}`);
  }

  // STEP 2 — PUT new file contents
  const body = {
    message: "HN Cloud CMS Update",
    content: Buffer.from(jsonString).toString("base64"),
    branch: GITHUB_BRANCH,
  };

  if (sha) body.sha = sha;

  const putRes = await fetch(fileUrl, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!putRes.ok) {
    throw new Error(`GitHub PUT failed: ${await putRes.text()}`);
  }

  return putRes.json();
}

// -----------------------------------------------
// ROUTES
// -----------------------------------------------

app.get("/health", (req, res) => {
  res.json({ ok: true, status: "healthy" });
});

// SAVE endpoint
app.post("/save", async (req, res) => {
  console.log("Incoming save request...");
  try {
    const pretty = JSON.stringify(req.body, null, 2);
    const result = await saveToGitHub(pretty);

    res.json({
      ok: true,
      saved: DATA_FILE_PATH,
      sha: result.commit?.sha || null
    });

  } catch (err) {
    console.error("Save error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// -----------------------------------------------
// START SERVER
// -----------------------------------------------
app.listen(PORT, () => {
  console.log("=======================================");
  console.log("Honest News Cloud CMS Running");
  console.log("PORT:", PORT);
  console.log("GitHub Owner:", GITHUB_OWNER);
  console.log("Git Repo:", GITHUB_REPO);
  console.log("Branch:", GITHUB_BRANCH);
  console.log("File:", DATA_FILE_PATH);
  console.log("=======================================");
});



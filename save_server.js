// save_server.js
// Honest News cloud save API

const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

// Allow the dashboard to send JSON
app.use(express.json());

// Allow GitHub Pages domain
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Save path in Render environment
const SAVE_PATH = path.join(__dirname, "site-data.json");

app.post("/save", (req, res) => {
  try {
    fs.writeFileSync(SAVE_PATH, JSON.stringify(req.body, null, 2));
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Write failed" });
  }
});

app.listen(PORT, () => {
  console.log("==========================================");
  console.log(" Honest News Save API Running");
  console.log(" Saving to:", SAVE_PATH);
  console.log(" Listening on port", PORT);
  console.log("==========================================");
});

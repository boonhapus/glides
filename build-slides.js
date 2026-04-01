#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// ── Config ──────────────────────────────────────────────────
const SLIDES_DIR = path.join(__dirname, ".slides");
const TEMPLATE = path.join(__dirname, "template.html");
const OUTPUT = path.join(__dirname, "slides.html");
const DECK_TITLE = "Project Overview";
// ────────────────────────────────────────────────────────────

function build() {
  if (!fs.existsSync(SLIDES_DIR)) {
    console.error("Error: .slides/ directory not found.");
    process.exit(1);
  }

  const files = fs
    .readdirSync(SLIDES_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  if (files.length === 0) {
    console.error("No .md files found in .slides/");
    process.exit(1);
  }

  const slides = files.map((f) =>
    fs.readFileSync(path.join(SLIDES_DIR, f), "utf-8").trim()
  );

  console.log("Building " + files.length + " slides: " + files.join(", "));

  let html = fs.readFileSync(TEMPLATE, "utf-8");

  // Inject title
  html = html.replace("<!-- __TITLE__ -->", DECK_TITLE);

  // Inject slides as JSON array (safe serialization, no escaping issues)
  html = html.replace("/* __SLIDES_JSON__ */[]", JSON.stringify(slides, null, 2));

  fs.writeFileSync(OUTPUT, html);
  console.log("→ slides.html written (" + files.length + " slides)");
}

// ── Run ─────────────────────────────────────────────────────
build();

if (process.argv.includes("--watch")) {
  console.log("\nWatching .slides/ for changes… (Ctrl+C to stop)\n");
  let timeout;
  fs.watch(SLIDES_DIR, { persistent: true }, (event, filename) => {
    if (filename && filename.endsWith(".md")) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        console.log(filename + " changed");
        build();
      }, 100);
    }
  });
}

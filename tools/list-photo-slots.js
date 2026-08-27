#!/usr/bin/env node
/**
 * Lists every photo slot in the site: its key, the page it is on, and the caption
 * describing what photo belongs there.
 *
 * Filling in photos means mapping slot keys to filenames in assets/photos/manifest.json,
 * and the keys are otherwise scattered across ~30 files. Run this to see all of them,
 * plus which are still empty:
 *
 *     node tools/list-photo-slots.js            # all slots, grouped by page
 *     node tools/list-photo-slots.js --empty    # only the ones with no photo yet
 *     node tools/list-photo-slots.js --json     # manifest-shaped skeleton to fill in
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MANIFEST = path.join(ROOT, "assets/photos/manifest.json");

const manifest = fs.existsSync(MANIFEST)
  ? JSON.parse(fs.readFileSync(MANIFEST, "utf8") || "{}")
  : {};

const onlyEmpty = process.argv.includes("--empty");
const asJson = process.argv.includes("--json");

// index.html is a generated copy of Home.dc.html. Listing both would double every
// homepage slot, and the keys are identical anyway.
const files = fs.readdirSync(ROOT)
  .filter((f) => f.endsWith(".dc.html"))
  .sort();

const slotRe = /<sa-image-slot\s+slot-key="([^"]+)"[^>]*?placeholder="([^"]*)"/g;

const rows = [];
for (const file of files) {
  const src = fs.readFileSync(path.join(ROOT, file), "utf8");
  let m;
  while ((m = slotRe.exec(src)) !== null) {
    rows.push({ key: m[1], page: file, caption: m[2], photo: manifest[m[1]] || null });
  }
}

const shown = onlyEmpty ? rows.filter((r) => !r.photo) : rows;

if (asJson) {
  // a manifest skeleton: every empty slot, ready to have filenames pasted in
  const out = {};
  for (const r of rows) out[r.key] = r.photo || "";
  console.log(JSON.stringify(out, null, 2));
} else {
  let page = null;
  for (const r of shown) {
    if (r.page !== page) { page = r.page; console.log(`\n${page}`); }
    const status = r.photo ? `-> ${r.photo}` : "(empty)";
    console.log(`  ${r.key.padEnd(22)} ${status.padEnd(24)} ${r.caption}`);
  }
  const filled = rows.filter((r) => r.photo).length;
  console.log(`\n${filled} of ${rows.length} slots have a committed photo.`);
  if (filled < rows.length && !onlyEmpty) console.log("Run with --empty to list just the rest.");
}

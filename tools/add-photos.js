#!/usr/bin/env node
/**
 * Prepares screenshots and photos for the site, then wires them up.
 *
 * For each image in the source folder it:
 *   1. trims uniform borders (the grey bars either side of an app screenshot)
 *   2. caps the long edge at 1600px, so a 3MB screenshot is not shipped to every visitor
 *   3. writes the result into assets/photos/
 *   4. adds it to assets/photos/manifest.json
 *
 * Name each file after the slot it belongs in and the mapping is automatic:
 *
 *     app-plan.png  ->  fills the slot with slot-key="app-plan"
 *
 * `node tools/list-photo-slots.js --empty` prints the slot keys.
 *
 *     node tools/add-photos.js ~/Desktop/sanasanita
 *     node tools/add-photos.js ~/Desktop/shots --keep-border   (skip the trim)
 *
 * Needs Playwright on NODE_PATH; it uses headless Chromium as the image engine so
 * the repo does not take on an image-processing dependency.
 */
"use strict";
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "assets/photos");
const MANIFEST = path.join(OUT_DIR, "manifest.json");
const MAX_EDGE = 1600;

const src = process.argv[2];
const keepBorder = process.argv.includes("--keep-border");
if (!src) {
  console.error("usage: node tools/add-photos.js <folder-with-images> [--keep-border]");
  process.exit(1);
}
if (!fs.existsSync(src)) { console.error("no such folder: " + src); process.exit(1); }

const files = fs.readdirSync(src)
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  .sort();
if (!files.length) { console.error("no images in " + src); process.exit(1); }

/* Runs in the page. Finds how many rows/columns at each edge are a single flat
   colour and returns the rectangle inside them. Tolerance is generous because
   screenshot borders are often very slightly noisy. */
function trimAndScale({ dataUrl, maxEdge, keep }) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const w = img.naturalWidth, h = img.naturalHeight;
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      let x0 = 0, y0 = 0, x1 = w, y1 = h;

      if (!keep) {
        const d = ctx.getImageData(0, 0, w, h).data;
        const at = (x, y) => { const i = (y * w + x) * 4; return [d[i], d[i + 1], d[i + 2], d[i + 3]]; };
        const near = (a, b) => Math.abs(a[0] - b[0]) < 10 && Math.abs(a[1] - b[1]) < 10 &&
                               Math.abs(a[2] - b[2]) < 10 && Math.abs(a[3] - b[3]) < 10;
        const colFlat = (x) => { const c0 = at(x, 0); for (let y = 1; y < h; y += 2) if (!near(at(x, y), c0)) return null; return c0; };
        const rowFlat = (y) => { const c0 = at(0, y); for (let x = 1; x < w; x += 2) if (!near(at(x, y), c0)) return null; return c0; };

        const left = colFlat(0);
        if (left) while (x0 < w - 1) { const c1 = colFlat(x0); if (c1 && near(c1, left)) x0++; else break; }
        const right = colFlat(w - 1);
        if (right) while (x1 > x0 + 1) { const c1 = colFlat(x1 - 1); if (c1 && near(c1, right)) x1--; else break; }
        const top = rowFlat(0);
        if (top) while (y0 < h - 1) { const c1 = rowFlat(y0); if (c1 && near(c1, top)) y0++; else break; }
        const bot = rowFlat(h - 1);
        if (bot) while (y1 > y0 + 1) { const c1 = rowFlat(y1 - 1); if (c1 && near(c1, bot)) y1--; else break; }
        // a fully flat image would trim to nothing
        if (x1 - x0 < 16 || y1 - y0 < 16) { x0 = 0; y0 = 0; x1 = w; y1 = h; }
      }

      const cw = x1 - x0, ch = y1 - y0;
      const scale = Math.min(1, maxEdge / Math.max(cw, ch));
      const ow = Math.max(1, Math.round(cw * scale)), oh = Math.max(1, Math.round(ch * scale));
      const o = document.createElement("canvas");
      o.width = ow; o.height = oh;
      o.getContext("2d").drawImage(img, x0, y0, cw, ch, 0, 0, ow, oh);

      // keep PNG where the image has any transparency, otherwise JPEG is far smaller
      const px = o.getContext("2d").getImageData(0, 0, ow, oh).data;
      let alpha = false;
      for (let i = 3; i < px.length; i += 4) if (px[i] < 250) { alpha = true; break; }
      resolve({
        url: alpha ? o.toDataURL("image/png") : o.toDataURL("image/jpeg", 0.9),
        ext: alpha ? "png" : "jpg",
        from: [w, h], to: [ow, oh], trimmed: [x0, y0, w - x1, h - y1]
      });
    };
    img.src = dataUrl;
  });
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const manifest = fs.existsSync(MANIFEST)
    ? JSON.parse(fs.readFileSync(MANIFEST, "utf8") || "{}") : {};

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("about:blank");

  for (const f of files) {
    const buf = fs.readFileSync(path.join(src, f));
    const mime = /\.png$/i.test(f) ? "image/png" : /\.webp$/i.test(f) ? "image/webp" : "image/jpeg";
    const dataUrl = `data:${mime};base64,${buf.toString("base64")}`;
    const r = await page.evaluate(trimAndScale, { dataUrl, maxEdge: MAX_EDGE, keep: keepBorder });

    const key = path.basename(f).replace(/\.[^.]+$/, "");
    const outName = `${key}.${r.ext}`;
    fs.writeFileSync(path.join(OUT_DIR, outName),
      Buffer.from(r.url.split(",")[1], "base64"));
    manifest[key] = outName;

    const kb = (fs.statSync(path.join(OUT_DIR, outName)).size / 1024).toFixed(0);
    const t = r.trimmed;
    console.log(`  ${key.padEnd(24)} ${r.from[0]}x${r.from[1]} -> ${r.to[0]}x${r.to[1]}  ` +
      `trimmed L${t[0]} T${t[1]} R${t[2]} B${t[3]}  ${kb}KB`);
  }

  await browser.close();
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n", "utf8");
  console.log(`\nmanifest.json now maps ${Object.keys(manifest).length} slot(s).`);
  console.log("Any name that is not a real slot key is ignored by the page; run");
  console.log("`node tools/list-photo-slots.js --empty` to see what is still open.");
})();

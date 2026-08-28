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

/* Runs in the page. Works out the page background from the border, then keeps only
   the band of rows and columns that actually carry content. A strict "this column is
   perfectly flat" test was tried first and failed on exactly the images that needed it
   most: a modal over a dimmed backdrop has antialiasing and a soft shadow, so almost no
   column is literally uniform. Counting how much of each column differs from the
   background is tolerant of that, and of a stray line of text bleeding into a margin. */
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
        const at = (x, y) => { const i = (y * w + x) * 4; return [d[i], d[i + 1], d[i + 2]]; };

        const TOL = 26;      // ignore antialiasing and gentle shadow
        const FRAC = 0.02;   // a content column differs on at least 2% of its pixels

        /* One pass over the current box: find the background from its border ring,
           then shrink to the band that carries content. */
        const pass = (bx0, by0, bx1, by1) => {
          const bw = bx1 - bx0, bh = by1 - by0;
          const votes = new Map();
          const vote = (x, y) => {
            const p = at(x, y), k = `${p[0] >> 3},${p[1] >> 3},${p[2] >> 3}`;
            votes.set(k, (votes.get(k) || 0) + 1);
          };
          const sx = Math.max(1, Math.floor(bw / 200)), sy = Math.max(1, Math.floor(bh / 200));
          for (let x = bx0; x < bx1; x += sx) { vote(x, by0); vote(x, by1 - 1); }
          for (let y = by0; y < by1; y += sy) { vote(bx0, y); vote(bx1 - 1, y); }
          let best = null, bestN = -1;
          for (const [k, n] of votes) if (n > bestN) { bestN = n; best = k; }
          const bg = best.split(",").map((v) => (+v << 3) + 4);
          const off = (p) => Math.abs(p[0] - bg[0]) + Math.abs(p[1] - bg[1]) + Math.abs(p[2] - bg[2]) > TOL;
          const cols = new Float32Array(bw), rows = new Float32Array(bh);
          for (let x = bx0; x < bx1; x++) { let n = 0; for (let y = by0; y < by1; y++) if (off(at(x, y))) n++; cols[x - bx0] = n / bh; }
          for (let y = by0; y < by1; y++) { let n = 0; for (let x = bx0; x < bx1; x++) if (off(at(x, y))) n++; rows[y - by0] = n / bw; }

          /* Content has to persist for a run of pixels, not just one. A window frame
             leaves a single hairline whose column differs on 100% of its pixels, and
             stopping at the first such column left the whole page margin in frame. */
          const RUN = 8;
          const runAt = (arr, i, dir) => {
            for (let k = 0; k < RUN; k++) {
              const j = i + k * dir;
              if (j < 0 || j >= arr.length) return false;
              if (arr[j] < FRAC) return false;
            }
            return true;
          };
          let a = 0, b = bw, c2 = 0, e = bh;
          while (a < bw - RUN && !runAt(cols, a, 1)) a++;
          while (b > a + RUN && !runAt(cols, b - 1, -1)) b--;
          while (c2 < bh - RUN && !runAt(rows, c2, 1)) c2++;
          while (e > c2 + RUN && !runAt(rows, e - 1, -1)) e--;
          return [bx0 + a, by0 + c2, bx0 + b, by0 + e];
        };

        /* Repeat while a pass only shaved a thin frame. A macOS window shot can be a
           dark chrome border around a cream page around the actual content column, and
           one pass only removes the outermost layer. Once a pass takes a real bite the
           content has been found, so stop rather than eating the layout's own padding. */
        for (let i = 0; i < 3; i++) {
          const [a, b2, c2, e] = pass(x0, y0, x1, y1);
          const cut = (a - x0) + (x1 - c2);
          const wide = (x1 - x0);
          x0 = a; y0 = b2; x1 = c2; y1 = e;
          if (cut > wide * 0.03) break;   // took a real bite: done
          if (cut === 0) break;           // nothing left to shave
        }

        // never crop away essentially everything
        if (x1 - x0 < w * 0.05 || y1 - y0 < h * 0.05) { x0 = 0; y0 = 0; x1 = w; y1 = h; }
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

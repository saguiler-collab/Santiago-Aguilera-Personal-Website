#!/usr/bin/env node
/**
 * Renders tools/og-card.html to assets/og-image.png — the 1200x630 preview image
 * that Slack, iMessage, LinkedIn and Google show when the site is linked. Without it
 * a shared link is a bare grey rectangle.
 *
 * The card deliberately reuses the homepage hero's gradient, star scatter and type so
 * a shared link and the page it opens look like the same site.
 *
 * Regenerate after editing og-card.html (needs Playwright available on NODE_PATH):
 *
 *     node tools/make-og-image.js
 *
 * This is not part of `node tools/build-pages.js` on purpose: it needs a headless
 * browser, and the image only changes when the card copy or brand does.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.join(__dirname, '..');
const SCRATCH = fs.mkdtempSync(path.join(os.tmpdir(), 'sa-og-'));

// paper-stroked variant of the mark for the dark card
const favicon = fs.readFileSync(path.join(ROOT, 'assets/favicon.svg'), 'utf8');
const paperMark = favicon
  .replace(/<style>[\s\S]*?<\/style>/, '<style>path{stroke:#FDFBF7}</style>');
const markDataUri = 'data:image/svg+xml;base64,' + Buffer.from(paperMark).toString('base64');

const fontsDir = path.join(ROOT, '_ds/santiago-aguilera-design-system-9830153d-9277-4c73-8263-d161c385797f/assets/fonts');

let html = fs.readFileSync(path.join(__dirname, 'og-card.html'), 'utf8')
  .replace(/FONTS/g, 'file://' + fontsDir)
  .replace('SYMBOL', markDataUri);

const tmp = path.join(SCRATCH, 'og-card.rendered.html');
fs.writeFileSync(tmp, html, 'utf8');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto('file://' + tmp, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(ROOT, 'assets/og-image.png') });
  await browser.close();
  const st = fs.statSync(path.join(ROOT, 'assets/og-image.png'));
  console.log('wrote assets/og-image.png —', (st.size / 1024).toFixed(0) + 'KB');
})();

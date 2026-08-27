# The Santiago Aguilera Library

A personal site. "the Santiago Aguilera Library". Built for universities, employers and
anyone who wants the whole picture: six countries, two schools, health science, Model UN,
a drum kit and a swim lane, collected and kept in order.

The original plan and section outline live in [Instructions-v1.md](Instructions-v1.md).

---

## Running it locally

The site is static. No build step is needed to view it, but it **must be served over
HTTP** rather than opened as a `file://` path, because pages fetch each other's templates.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## How it is put together

| Piece | What it is |
| --- | --- |
| `index.html` | The homepage. **Generated** from `Home.dc.html`. Edit that, not this. |
| `*.dc.html` | The pages. Templates rendered in the browser by `support.js`. |
| `support.js` | The DC runtime: parses `<x-dc>` templates and mounts them with React. Generated. Do not edit. |
| `_ds/…/` | The design system: tokens, fonts and the components (`Card`, `SectionHeading`, `Footer`, …). |
| `assets/vendor/` | React and ReactDOM, vendored locally. |
| `assets/site-config.js` | Profile links, shared by every page. |
| `assets/site.css` | Site-level CSS layered over the design system. Type refinements, the hero tile gallery, the stat cards. Lives here because `_ds/` is generated. |
| `assets/photo-slots.js` | The `<sa-image-slot>` element and the `?edit=1` photo editor. |
| `tools/` | Build and helper scripts. |

Every page renders **client-side**: nothing is visible until React and the runtime boot.
That is why React is vendored rather than loaded from a CDN. One unreachable CDN
previously meant a completely blank site.

### Generated vs hand-written pages

Most pages share ~95% of their structure, so they are generated from a spec:

```bash
node tools/build-pages.js
```

- **Generated** (26 pages + `index.html`): every `Place-*`, `Academics-*`, `Research-*`,
  `Leadership-*`, `Activities-*`, `Curiosities-*` page, plus the Leadership and Activities
  landings. To change their content, edit the `PAGES` array in `tools/build-pages.js` and
  re-run it. **Editing these files directly is pointless. The next build overwrites them.**
- **Hand-written**: `Home.dc.html`, `About.dc.html`, `Academics.dc.html`, `Research.dc.html`,
  `Curiosities.dc.html`, `Media.dc.html`, plus the `SiteNav` / `SymbolRail` components.

---

## Adding photos

Photo slots are empty frames keyed by a short string. There are two ways to fill one, and
only one of them is visible to other people.

**Preview in your browser (private, temporary).** Add `?edit=1` to any page. For example
`http://localhost:8000/About.dc.html?edit=1`. Empty slots become clickable and you can drop
images straight in. Editing stays on as you navigate; `?edit=0` or closing the tab ends it.

> Uploads made this way are stored in **your browser's localStorage only**. Nobody else can
> see them and they disappear if the browser clears its storage. They are a preview, not a
> publish.

**Publish for real (committed to the repo).** Two steps:

1. Put the image file in `assets/photos/`. E.g. `assets/photos/monterrey-2013.jpg`.
2. Map the slot key to that filename in `assets/photos/manifest.json`:

   ```json
   {
     "mx-1": "monterrey-2013.jpg",
     "about-portrait": "portrait.jpg"
   }
   ```

A photo listed in the manifest always wins over a local upload, and shows for every visitor.

To see the slot keys and what belongs in each:

```bash
node tools/list-photo-slots.js           # all 80 slots, grouped by page
node tools/list-photo-slots.js --empty   # only the ones still unfilled
node tools/list-photo-slots.js --json    # a manifest skeleton to paste into
```

Resize large photos before committing. These are shipped as-is to every visitor.

---

## Before deploying

Two things are deliberately left blank rather than guessed at:

- [ ] **Profile links.** Instagram, LinkedIn and Discord in `assets/site-config.js` have
      empty `href`s, so those icons are hidden. Fill in the real URLs and they appear in
      every footer. (They previously all pointed at `#`.)
- [ ] **`SITE_ORIGIN`** in `tools/build-pages.js`. Set it to the final domain. E.g.
      `https://santiagoaguilera.com`, no trailing slash. Then re-run the build. That turns
      on `<link rel="canonical">`, absolute `og:` URLs and `sitemap.xml`. While it is empty
      those are omitted, because a canonical pointing at the wrong host hurts search ranking
      more than having none.

## Deploying to Vercel

Import the GitHub repo in Vercel as a **static site**. No framework preset, no build
command, output directory `.` (the repo root). Everything is committed, so there is nothing
to install.

`404.html` is served for unknown URLs and is plain HTML with no JavaScript, so it still
renders if the runtime ever fails.

After the domain is live, set `SITE_ORIGIN`, re-run `node tools/build-pages.js`, and commit
the regenerated pages and `sitemap.xml`.

## Regenerating the social preview image

`assets/og-image.png` is the 1200×630 card shown when the site is linked in Slack, iMessage
or LinkedIn. It is rendered from `tools/og-card.html`:

```bash
node tools/make-og-image.js     # needs Playwright available
```

---

## Site map

```
/                       Home
├── About               My story, the timeline, the symbol
│   ├── Mexico          Monterrey
│   ├── Colombia        Bogotá
│   ├── Panama          Ciudad de Panamá
│   ├── Trinidad        Port of Spain
│   └── United States   Houston, then Pennsburg
├── Academics           ISPS · Perkiomen · Exeter Summer · Carnegie Mellon
├── Research            CellAtlas GBM · SanaSanita · Venezuelan Immigration
├── Leadership          HOSA · GVMUN · Student Council · Shadowing · Volunteering · Perkiomenite
├── Activities          Swimming · Weightlifting · Drums & Music
├── Curiosities         Literature · Music · Video Games
└── Media               Photos and video
```

Pages marked "Still to add" say so on purpose. The design system's rule is that honest
gaps read better than invented achievements. Send the missing details and they fill in.

Madrid appears in the timeline but has no page of its own yet.

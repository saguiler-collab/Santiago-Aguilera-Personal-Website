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

**Publish for real, the easy way.** Drop your images in a folder, name each file after
the slot it belongs in, and run:

```bash
node tools/add-photos.js ~/Desktop/my-photos
```

It trims the flat background around the image (the grey bars either side of an app
screenshot, or a window frame), caps the long edge at 1600px, writes the result into
`assets/photos/`, and adds the manifest entry. So `app-plan.png` fills the slot with
`slot-key="app-plan"`. Pass `--keep-border` to skip the trim.

Originals live in `website.img/`, which is excluded from the deploy by `.vercelignore`.

**Publish for real, by hand.** Two steps:

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

One thing is still deliberately left blank rather than guessed at. The other two are
done and confirmed against the live deployment.

- [ ] **Profile links.** Every entry in `assets/site-config.js` has an empty `href`, so
      the whole icon row is hidden and the footer closes up around it. Fill in the real
      URLs and the icons appear site-wide. The footer knows these ids: `linkedin`,
      `instagram`, `github`, `youtube`, `spotify`, `discord`, `email` (a `mailto:` href).
- [x] **`SITE_ORIGIN`** in `tools/build-pages.js`, set to
      `https://santiaguilera-personalwebsite.vercel.app`. This turns on `og:` URLs,
      `sitemap.xml` and the `Sitemap:` line in `robots.txt`. Change it and re-run the build
      if a custom domain is added; `<link rel="canonical">` is root-relative and needs no
      change either way.
- [x] **Contact form delivery.** Live and confirmed end to end. Two environment
      variables in the Vercel project, under Settings → Environment Variables, ticked
      for Production and Preview:

      | Name | Value |
      | --- | --- |
      | `RESEND_API_KEY` | An API key from [resend.com](https://resend.com). Free, 3000 emails a month. |
      | `CONTACT_TO` | The address the messages should arrive at. |

      Redeploy after adding them; environment variables are read at request time but
      only reach a deployment made after they were set.

      The default sender is Resend's own `onboarding@resend.dev`, which needs no DNS
      setup but will **only deliver to the address that owns the Resend account** —
      so sign up with the same address as `CONTACT_TO`. To send from a custom address,
      verify a domain with Resend and set `CONTACT_FROM` as well.

      Until the variables exist, `/api/contact` answers 503 and the form offers a
      mailto link carrying whatever the visitor typed, so it is never a dead end.

## Deploying to Vercel

Import the GitHub repo in Vercel as a **static site**. No framework preset, no build
command, output directory `.` (the repo root). Everything is committed, so there is nothing
to install.

Every page lives in `pages/`, `index.html` at the root. A static host serves `index.html`
for `/`, so that one file has to stay where it is; it is generated from `pages/Home.dc.html`
with its relative paths walked back a level. The runtime resolves `<dc-import name="X">`
against `window.__SA_COMPONENT_DIR`, set to `/pages` in every page head, which is what lets
the pages sit in a folder while the homepage sits above it.

`vercel.json` redirects the old flat URLs (`/About.dc.html`) to the new ones
(`/pages/About.dc.html`), so any link shared before the move still lands.

### Two patched generated files

Both are committed and nothing in this repo regenerates them, but if either is ever
replaced, these edits have to go back in or the site breaks in a way that is easy to
misread as a missing file:

| File | Edit | Why |
| --- | --- | --- |
| `support.js` | `COMPONENT_DIR` reads `window.__SA_COMPONENT_DIR` instead of being `"."` | It resolved `<dc-import>` next to whichever page asked, which forces pages and shared components into one directory |
| `_ds/…/_ds_bundle.js` | `LUCIDE` and the default `iconBase` are root-absolute | They were resolved against the page URL, so from `/pages/` they looked for `/pages/assets/icons/…` |

`assets/photo-slots.js` has the same root-absolute treatment for the photo manifest, but
that file is hand-written, so it is not at risk.

`api/contact.js` becomes a serverless function on its own, with no configuration: Vercel
treats any file in `api/` that way regardless of preset. That is why the contact form uses
a function rather than posting to a form service — the API key stays on the server, so the
browser only ever talks to this site's own origin and no page makes a third-party request.

`404.html` is served for unknown URLs and is plain HTML with no JavaScript, so it still
renders if the runtime ever fails.

After the domain is live, set `SITE_ORIGIN`, re-run `node tools/build-pages.js`, and commit
the regenerated pages and `sitemap.xml`.

## Pages that are still being written

A page whose spec carries a `tbd` note and has fewer than 70 words of real prose is
treated as thin: the build gives it `<meta name="robots" content="noindex,follow">` and
leaves it out of `sitemap.xml`. It stays linked in the nav and the footer and is fully
reachable — this only affects search engines.

The test is the prose the page actually has, not a hand-kept list. Send the details for
one of them, and the moment it crosses 70 words it re-enters the index on the next build
with nothing to remember. `node tools/build-pages.js` prints which pages are currently in
that state and their word counts.

Eight are, as of the last build: Exeter Summer, Computational Biology, CellAtlas GBM,
Venezuelan Immigration, HOSA, Volunteering, The Perkiomenite, and Literature.

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
├── Media               Photos and video
└── Contact             The form, which posts to /api/contact
```

Pages marked "Still to add" say so on purpose. The design system's rule is that honest
gaps read better than invented achievements. Send the missing details and they fill in.

Madrid appears in the timeline but has no page of its own yet.

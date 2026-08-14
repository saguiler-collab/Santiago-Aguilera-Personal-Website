# Santiago Aguilera — Design System

A personal brand system for Santiago Aguilera's website: a student profile built for universities,
employers and anyone who wants the whole picture. Five countries, two schools, health science,
Model UN, a drum kit and a swim lane — told as one interactive timeline.

## Sources used to build this

| Source | What it gave | Status |
| --- | --- | --- |
| [github.com/saguiler-collab/Santiago-Aguilera-Personal-Website](https://github.com/saguiler-collab/Santiago-Aguilera-Personal-Website) (`main`, `README.md`) | The full information architecture: sections, subsections, the two navigation plans, the social links, the "interactive life map / timeline" intent | **Plan only — no code, no CSS, no screens exist yet** |
| `uploads/Screenshot 2026-08-12 at 10.13.41 PM.png` | Santiago's hand-drawn personal symbol: a spiral with two flanking strokes | Smoothed into `assets/symbol.svg` |

**Important caveat for anyone reading this:** the repository contains a planning document, not an
implementation. There was no existing visual identity to recreate, so the type, colour, spacing, motion
and component decisions in this system are a **proposal** derived from the symbol and the plan's tone.
Explore the repository yourself — as it grows into real code, that code becomes the source of truth and
this system should be reconciled against it.

## The mark

The only piece of pre-existing brand: Santiago's hand-drawn spiral. It was traced as a monotone
mathematical spiral (a monotone-cubic fit of the drawing's own radii, so the turn spacing matches the
original) with the two flanking strokes kept where he drew them. Nothing was invented and nothing was
added — the wobble was removed, not the character.

- `assets/symbol.svg` — full lockup, `currentColor`
- `assets/symbol-spiral.svg` — spiral only, for small sizes and the favicon
- `-ink` / `-paper` variants of both, for `<img>` use where `currentColor` cannot reach

The spiral reads as the site's central idea: a life map that turns back on itself and keeps going.

---

## CONTENT FUNDAMENTALS

**Voice: first person, plain, specific.** Santiago's own writing in the repo is direct and unadorned
("I am building a personal website for universities, employers, and individuals to understand my
profile"). The system keeps that. Say what happened, where, and what came of it.

- **I, not we.** This is one person's site. "I am a student across five countries." Never "we" and never
  third-person résumé voice ("Santiago is a driven student…").
- **You** appears only in direct address in the footer or a CTA ("thanks for reading").
- **Sentence case everywhere.** Headings, buttons, card titles, tags. The only uppercase is the
  12px eyebrow / badge style at `0.14em` tracking.
- **Concrete over evaluative.** "Student-led initiative supporting classmates through the return to
  in-person school" — not "impactful leadership experience". No adjectives doing work a fact could do.
- **Places in chronological order, always.** Monterrey → Bogotá → Ciudad de Panamá → Port of Spain →
  Pennsburg. Never alphabetical, never ranked. Spanish place names keep their accents (Ciudad de Panamá,
  Bogotá).
- **Button copy is a verb plus the thing.** "Walk the timeline", "See the media", "All places".
  Never "Learn more", "Click here", "Explore".
- **Eyebrows name the section in one or two words:** "Who am I", "Academics", "Beyond the classroom",
  "Curiosities" — lifted from the plan's own labels.
- **Ledes are one sentence, two at most.** If a third is needed, it belongs in body copy.
- **Say when something is missing.** The plan marks Science Fair + Olympiad as not ready; the system shows
  it with a `Coming soon` badge rather than hiding it. Empty photo slots say what photo belongs there.
  Honest gaps read as confidence; fake filler does not.
- **No emoji, anywhere.** No exclamation marks. Numbers are real or absent — never rounded up for effect.
- **Bilingual detail, not bilingual layout.** Spanish appears in proper nouns and occasionally a phrase.
  The interface is English.

Sample voice, in system components:

> **Eyebrow** WHO AM I
> **Title** Five countries, one timeline
> **Lede** Every place added something — a language, an instrument, a way of reading a room.
> **Button** Walk the timeline →

---

## VISUAL FOUNDATIONS

**The feeling: a warm printed page, not a dashboard.** Paper, ink, hairlines and one hot accent. The
system leans editorial because the content is a story told in order, and it stays quiet because the
subject is a person rather than a product.

### Colour

- **Warm paper** (`--sa-paper-000` `#FDFBF7` → `--sa-paper-300`) is the ground. Never pure white pages;
  white is reserved for cards so they lift off the paper.
- **Teal-shifted ink** (`--sa-ink-900` `#08282A` → `--sa-ink-100`) does all text, rules and dark bands.
  There is no neutral grey in the system — every "grey" is a desaturated teal, which is what keeps the
  paper looking warm.
- **Coral** `#E0654A` is the single accent: primary buttons, eyebrows, the active nav underline, the
  quote rule, the timeline focus ring. One accent action per view.
- **Ochre** `#D98324`, **verdigris** `#2A9D8F` and **sienna** `#8C4A2F` support only — badges, place
  accents. They never appear as a button or a background band.
- **Place palette:** one colour per country (`--sa-place-mexico` … `--sa-place-usa`) so the timeline rail
  becomes a colour history of where Santiago was living. This is the system's one piece of colour coding
  and it is used consistently.
- **Bands:** at most two background tones per page — paper and one of `--sa-surface-sunken` (paper tint) or
  `--sa-surface-ink` (deep teal). Ink bands are for a single idea plus one link. `.sa-on-ink` flips every
  semantic token, so nested components need no variant props.
- **No gradients as decoration.** The only gradients in the system are two functional scrims
  (`--sa-scrim-ink` behind text over photos, `--sa-scrim-paper` for fade-outs).

### Type

- **Newsreader** (variable, OFL) for anything editorial: display, titles, card headings, pull quotes,
  counters. Regular weight, `-0.022em` tracking, optical sizing on, italic for every quote.
- **Karla** (variable, OFL) for everything functional: ledes, body, captions, nav, buttons, tags, meta.
- Twelve-step scale, 12 → 84px. Display leading `1.04`, headings `1.18`, prose `1.65`.
- Measure capped at `66ch` for body, `22ch` for titles, `34ch` for quotes.
- Tabular figures on years, rails and counters.
- The eyebrow is the only uppercase treatment: 12px, `0.14em`, semibold, usually coral, with an 18px
  leading rule.

### Space and layout

- 4px grid, 14 steps (`--sa-space-1` … `--sa-space-32`).
- Page frame: `1120px` max width, `24px` gutters (`48px` at desktop), `760px` for narrow reading pages.
- Bands breathe: `96px` vertical padding standard, `64px` tight. Whitespace is the layout.
- Only fixed element is the header (sticky, translucent, `z-index: 20`). Nothing else pins.
- Grids: 3-up for cards, 4-up for the media wall, `300px + 1fr` for the city slider,
  `1fr + 340px` for timeline plus aside.

### Surfaces, borders, radii

- **Cards:** white on paper, `1px` hairline at 12% ink, `8px` radius, `--sa-shadow-1` at rest. Radius stays
  small on purpose — the mark is the only curve that draws attention.
- **Radii:** 2 / 4 / 8 / 14 / 24px, plus pill for controls only. Buttons and tags are always pills;
  cards and media never are.
- **Shadows:** three teal-tinted steps. `1` rest, `2` hover and lifted panels, `3` overlays only.
  Hairlines carry most of the separation; shadows are support, not structure.
- **Focus:** `2px` coral outline at `2px` offset, plus `--sa-ring` for filled controls. Never removed.

### Motion

- Short and settled, `--sa-ease-out` `cubic-bezier(.22,.61,.36,1)` by default.
- 120ms press and colour, 200ms hover and focus, 320ms panels and sliders, 560ms scroll reveals and photo
  zoom, 900ms counters. `--sa-ease-spring` exists for one purpose: the counter and the video play button.
- **Hover:** lift `-2px` and deepen fill (coral 500 → 600); links go coral and gain a solid underline;
  photos scale `1.03`. Never opacity-fade a control on hover.
- **Press:** scale `0.98`. No colour change on press — the scale is the feedback.
- Scroll behaviour: counters count up once on first intersection; sections fade-and-rise 12px.
- `prefers-reduced-motion` sets every duration to 0ms and disables lift and press scale.

### Imagery

- **No stock imagery, ever.** `MediaFrame` renders a warm paper-tinted placeholder with a camera or play
  glyph and a caption naming the photo that belongs there. Missing photos are stated, not faked.
- When real photos arrive: warm, available-light, unfiltered. Cities, meets, the kit, the committee room —
  documentary rather than posed. Black and white only for archival family images.
- Text over an image always sits on `--sa-scrim-ink`; there are no capsule labels floating on photos.
- Full-bleed imagery is allowed exactly once per page, at the top of a section — never behind body copy.

### Transparency and blur

- Two uses only: the sticky header (`82%` paper + `--sa-blur-veil` 14px blur) and the media lightbox
  (72% ink + 6px blur). Nothing else is translucent — cards are opaque.

### Brand ornament

- The spiral appears three ways: nav mark, `SpiralRule` divider between bands, and once per page as a
  large low-contrast watermark in `--sa-paper-200`. Two or three appearances maximum; it is a signature,
  not a pattern.
- No repeating patterns, no textures, no paper-grain overlays.

---

## ICONOGRAPHY

- **UI set: Lucide** — 24px grid, 1.5px stroke, rounded caps, which sits right next to Karla's humanist
  shapes. **Flagged substitution:** the repo defines no icon set, so Lucide was chosen as the nearest
  neutral outline set. Loaded from `https://unpkg.com/lucide-static@0.469.0/icons/<name>.svg`.
- **Brand glyphs ship locally** in `assets/icons/brand/`: `instagram.svg`, `discord.svg`, `spotify.svg`
  (from Simple Icons). These cover the social row the plan asks for at the bottom of the site.
  **LinkedIn is the exception** — Simple Icons no longer ships it, so the Lucide `linkedin` glyph is used;
  swap in the official mark if brand compliance matters.
- Everything renders through `Icon`, which **masks** the SVG and fills it with `currentColor`, so no icon
  ever carries its own colour.
- Icons are always paired with a text label. The only icon-only controls are the footer social row and
  `IconButton` (slider arrows, lightbox close, video play).
- Sizes: 13px inside tags, 15–18px beside body text, 20–22px standalone, 44px+ hit areas.
- **No emoji and no unicode characters used as icons.** The one non-Lucide glyph in the system is the
  brand spiral itself, via `Mark`.
- Icons used across the kit: `map-pin`, `graduation-cap`, `microscope`, `music`, `dumbbell`, `waves`,
  `languages`, `book-open`, `gamepad-2`, `camera`, `play`, `arrow-left`, `arrow-right`, `x`, `calendar`,
  `users`, `newspaper`, `globe`.

---

## Components

Sixteen primitives, grouped by concern. Each directory holds `<Name>.jsx`, `<Name>.d.ts`,
`<Name>.prompt.md` and one specimen card.

**`components/brand/`** — `Mark`, `Icon`, `SpiralRule`
**`components/controls/`** — `Button`, `IconButton`
**`components/labels/`** — `Tag`, `Badge`
**`components/typography/`** — `SectionHeading`, `Quote`, `Stat`
**`components/surfaces/`** — `Card`, `MediaFrame`, `PlaceCard`
**`components/navigation/`** — `NavBar`, `Footer`
**`components/content/`** — `TimelineItem`

### Intentional additions

No source defined a component inventory (the repo is a plan), so this set was authored from the plan's
own needs. Three entries deserve their reasoning stated:

- **`Mark`** — the brand symbol as a component, so the spiral is never re-drawn by hand.
- **`Icon`** — a wrapper over the Lucide/brand glyph sets, needed because the icons are masked rather
  than inlined.
- **`Stat`** and **`TimelineItem`** — direct answers to two explicit asks in the plan: "numbers that
  count up" and "turn it into an interactive life map/timeline".

---

## Index

| Path | What it is |
| --- | --- |
| `styles.css` | The single entry point consumers link. `@import` lines only. |
| `tokens/fonts.css` | `@font-face` for Newsreader and Karla (variable TTFs in `assets/fonts/`) |
| `tokens/colors.css` | Palette, semantic aliases, place colours, `.sa-on-ink` inversion |
| `tokens/typography.css` | Families, scale, leading, tracking, composed type roles |
| `tokens/spacing.css` | 4px scale, page frame, band rhythm, control heights |
| `tokens/elevation.css` | Radii, hairlines, three shadows, focus ring, scrims |
| `tokens/motion.css` | Durations, easings, hover/press values, reduced-motion overrides |
| `tokens/base.css` | Element defaults, link colours, the `.sa-icon` mask utility |
| `components/` | The sixteen primitives, grouped as listed above |
| `ui_kits/website/` | Five-screen click-through recreation of the personal website — see its own README |
| `templates/personal-website/` | Starting template — nav, spiral hero, content band, footer |
| `guidelines/` | 21 specimen cards for colour, type, spacing, elevation, motion and brand |
| `assets/symbol*.svg` | The mark, in four variants |
| `assets/icons/brand/` | Instagram, Discord, Spotify |
| `assets/fonts/` | Newsreader and Karla variable TTFs, roman and italic |
| `thumbnail.html` | The system's homepage tile |
| `github.md` | Source-repo association and sync record |
| `SKILL.md` | Agent-skill entry point |

## Fonts

Newsreader and Karla are both **substitutions** — no typefaces were specified anywhere in the sources.
They were chosen for the editorial-but-personal pairing the content wants. Both are OFL and ship in
`assets/fonts/` as variable TTFs. **If Santiago has real brand fonts, send them and they will replace
these.**

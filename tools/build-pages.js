#!/usr/bin/env node
/**
 * Generates the section landing pages and detail pages for the site.
 *
 * Every .dc.html page here shares ~95% of its structure (head/meta, helmet, rail,
 * nav, hero, reveal + stagger observers, ink CTA band, footer). Hand-maintaining
 * ~23 near-identical files would guarantee drift, so they're generated from the
 * PAGES spec below. Edit the spec (or this template) and re-run:
 *
 *     node tools/build-pages.js
 *
 * Hand-written pages (Home, About, Academics, Research, Curiosities, Media,
 * SiteNav, SymbolRail) are NOT touched by this script.
 *
 * Content note: where a real detail wasn't known at build time the copy says so
 * plainly ("Waiting on details") rather than inventing achievements. This is a
 * real person's portfolio going to universities.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
/* Every .dc.html lives here, pages and shared components alike, because the runtime
   resolves <dc-import name="X"> against one directory. index.html is the exception:
   a static host serves it for "/", so it is written to the root with its paths
   un-relativised. See the block that generates it. */
const PHOTO_MANIFEST = (() => {
  try { return JSON.parse(fs.readFileSync(path.join(__dirname, "../assets/photos/manifest.json"), "utf8")); }
  catch (e) { return {}; }
})();

const PAGES_DIR = path.join(ROOT, "pages");
/* The design system is referenced two ways and they are not the same string any more.
   DS_DIR is where it is on disk, relative to the repo root. DS is how a page links to
   it, and the generated pages live one level down in pages/, so it needs the walk-up.
   index.html strips that back off when it is written to the root. */
const DS_DIR = "_ds/santiago-aguilera-design-system-9830153d-9277-4c73-8263-d161c385797f";
const DS = "../" + DS_DIR;
const NS = "SantiagoAguileraDesignSystem_983015";

/**
 * The public origin, e.g. "https://santiagoaguilera.com" (no trailing slash).
 *
 * Setting this turns on <link rel="canonical">, absolute og:url / og:image, and
 * sitemap.xml. While it is empty those are omitted entirely: a canonical tag
 * pointing at the wrong host actively hurts search ranking, so saying nothing is
 * safer than guessing at the Vercel domain before it exists.
 */
const SITE_ORIGIN = "https://santiaguilera-personalwebsite.vercel.app";

/* Profile links live in assets/site-config.js so all ~30 pages share one list.
   see the comment there. Pages read window.SA_SOCIALS at render time. */

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const attr = (s) => esc(s).replace(/"/g, "&quot;");

/* ---------------------------------------------------------------- spec ---- */

const SECTION_LINKS = [
  { label: "About", href: "About.dc.html" },
  { label: "Academics", href: "Academics.dc.html" },
  { label: "Research & projects", href: "Research.dc.html" },
  { label: "Leadership & service", href: "Leadership.dc.html" },
  { label: "Activities", href: "Activities.dc.html" },
  { label: "Drums", href: "Drums.dc.html" },
  { label: "Curiosities", href: "Curiosities.dc.html" },
  { label: "Media", href: "Media.dc.html" },
  { label: "Contact", href: "Contact.dc.html" }
];

// siblings shown in each page's footer + "more in this section" strip
const GROUPS = {
  about: { title: "Places", items: [
    { label: "Mexico", href: "Place-Mexico.dc.html" },
    { label: "Colombia", href: "Place-Colombia.dc.html" },
    { label: "Panama", href: "Place-Panama.dc.html" },
    { label: "Trinidad & Tobago", href: "Place-Trinidad.dc.html" },
    { label: "Pennsburg, Pennsylvania", href: "Place-UnitedStates.dc.html" }
  ]},
  academics: { title: "Academics", items: [
    { label: "International School of Port of Spain", href: "Academics-ISPS.dc.html" },
    { label: "Perkiomen School", href: "Academics-Perkiomen.dc.html" },
    { label: "Exeter Summer", href: "Academics-ExeterSummer.dc.html" },
    { label: "Computational Biology at Carnegie Mellon University", href: "Academics-CompBio.dc.html" }
  ]},
  research: { title: "Research", items: [
    { label: "CellAtlas GBM", href: "Research-CellAtlas.dc.html" },
    { label: "SanaSanita", href: "Research-MedicalApp.dc.html" },
    { label: "Venezuelan Immigration", href: "Research-Venezuela.dc.html" },
    { label: "CSR-x", href: "Research-CSRx.dc.html" }
  ]},
  leadership: { title: "Leadership & service", items: [
    { label: "HOSA", href: "Leadership-HOSA.dc.html" },
    { label: "Model UN", href: "Leadership-MUN.dc.html" },
    { label: "GVMUN", href: "Leadership-GVMUN.dc.html" },
    { label: "Student Council / Senate", href: "Leadership-StudentCouncil.dc.html" },
    { label: "Hospital Shadowing", href: "Leadership-Shadowing.dc.html" },
    { label: "Volunteering", href: "Leadership-Volunteering.dc.html" },
    { label: "The Perkiomenite", href: "Leadership-Perkiomenite.dc.html" }
  ]},
  activities: { title: "Activities", items: [
    { label: "Swimming", href: "Activities-Swimming.dc.html" },
    { label: "Weightlifting", href: "Activities-Weightlifting.dc.html" },
    { label: "Running", href: "Activities-Running.dc.html" }
  ]},
  drums: { title: "Drums", items: [
    { label: "SonoArte", href: "Drums-SonoArte.dc.html" },
    { label: "AP Vybz", href: "Drums-APVybz.dc.html" },
    { label: "ISPS School Musicals", href: "Drums-Musicals.dc.html" },
    { label: "MYP Arts Portfolio", href: "Drums-MYPPortfolio.dc.html" },
    { label: "Rock band at Perkiomen", href: "Drums-Rockband.dc.html" }
  ]},
  curiosities: { title: "Curiosities", items: [
    { label: "Literature", href: "Curiosities-Literature.dc.html" },
    { label: "Music", href: "Curiosities-Music.dc.html" },
    { label: "Video Games", href: "Curiosities-Videogames.dc.html" }
  ]}
};

/* Each section carries its own palette, so the site is not one colour end to end and
   you can tell where you are from across the room. Four of them are real brands:
   Perkiomen purple and gold, ISPS navy and cyan, SanaSanita teal, and a violet
   "Atlas" for the computational work. A reader can override all of it from the nav. */
const SECTION_PALETTE = {
  about: "sky", academics: "perkiomen", research: "atlas",
  leadership: "isps", activities: "noir", drums: "ferrari", curiosities: "gilt"
};
const PAGE_PALETTE = {
  "Academics-ISPS.dc.html": "isps",
  "Academics-Perkiomen.dc.html": "perkiomen",
  "Academics-ExeterSummer.dc.html": "exeter",
  "Academics-CompBio.dc.html": "cmu",
  "Research-CellAtlas.dc.html": "atlas",
  "Research-MedicalApp.dc.html": "sana",
  "Research-Venezuela.dc.html": "sky",
  "Research-CSRx.dc.html": "csrx",
  "Curiosities-Videogames.dc.html": "arcade"
};
const paletteFor = (p) => PAGE_PALETTE[p.file] || SECTION_PALETTE[p.section] || "library";

/* A page that is mostly a "still being written" note is thin content. Left in the
   index it drags on the whole site's quality signal, and it is a poor thing for an
   admissions officer to land on from a search result. So those pages carry
   noindex,follow and stay out of sitemap.xml.

   The test is the prose the page actually has, not a hand-kept list, so a page
   re-enters the index by being written rather than by someone remembering to take
   it off a list. `follow` because the links on them should still count. */
const PROSE_MIN_WORDS = 70;
const proseWords = (p) => [p.intro, ...(p.body || []), ...(p.steps || []).map((x) => x.body || x)]
  .filter((x) => typeof x === "string")
  .join(" ").split(/\s+/).filter(Boolean).length;
const isThin = (p) => Boolean(p.tbd) && proseWords(p) < PROSE_MIN_WORDS;

/* A place page takes its country's flag colours as the accent, over the section's
   palette. Set on the root so the whole page follows, the scroll rail included. */
const PAGE_COUNTRY = {
  "Place-Mexico.dc.html": "mexico",
  "Place-Colombia.dc.html": "colombia",
  "Place-Panama.dc.html": "panama",
  "Place-Trinidad.dc.html": "trinidad",
  "Place-UnitedStates.dc.html": "usa"
};

const TBD = "To be added";

const PAGES = [
  /* ---------------------------------------------------------- landings ---- */
  {
    file: "Leadership.dc.html", section: "leadership", kind: "landing",
    eyebrow: "Leadership & service", title: "What I organise, and who it is for",
    lede: "Founding a chapter, directing a newsroom, and the hours that do not show up on a transcript.",
    desc: "HOSA, GVMUN, hospital shadowing, volunteering, and the Perkiomenite.",
    intro: "These are the things where the work was not assigned to me. Each one started as a gap I noticed. A club that did not exist. A newsroom that needed running. A waiting room where nobody spoke Spanish.",
    cards: [
      { eyebrow: "Founder & President", title: "HOSA", href: "Leadership-HOSA.dc.html", body: "Founded Perkiomen's chapter to create opportunities for students interested in healthcare." },
      { eyebrow: "Delegate", title: "Model UN", href: "Leadership-MUN.dc.html", body: "Representing Nigeria in SPECPOL at Princeton, and Eagle MUNC." },
      { eyebrow: "Director of Journalism", title: "GVMUN", href: "Leadership-GVMUN.dc.html", body: "Six articles on world issues, published to the Global Virtual Model United Nations newsletter. Read them all." },
      { eyebrow: "Student government", title: "Student Council / Senate", href: "Leadership-StudentCouncil.dc.html", body: "Representing classmates at ISPS, and student government at Perkiomen." },
      { eyebrow: "Clinical", title: "Hospital Shadowing", href: "Leadership-Shadowing.dc.html", body: "Time on the floor, watching how care actually gets delivered." },
      { eyebrow: "Service", title: "Volunteering", href: "Leadership-Volunteering.dc.html", body: "Community work, in and out of school." },
      { eyebrow: "Co-Editor", title: "The Perkiomenite", href: "Leadership-Perkiomenite.dc.html", body: "Writing and editing for the school paper." }
    ],
    slots: [{ key: "leadership-hero", ratio: "16 / 9", label: "A leadership event" }],
    next: { title: "The work behind it", lede: "Research and projects, in detail.", href: "Research.dc.html", label: "See the research" }
  },
  {
    file: "Activities.dc.html", section: "activities", kind: "landing",
    eyebrow: "Activities", title: "Water, weight, road",
    lede: "Three commitments. Drums are such a big part of the story that they have a section of their own.",
    desc: "Varsity swimming, Olympic weightlifting, and road racing.",
    intro: "None of these are electives I picked up at Perkiomen. Water and weight moved with me across six countries, and running started in Trinidad and has not stopped since. Drums, the fourth, have their own section.",
    cards: [
      { eyebrow: "Varsity", title: "Swimming", href: "Activities-Swimming.dc.html", body: "Morning sets, meets, and the part of the day that keeps the rest of it in order." },
      { eyebrow: "Olympic lifting", title: "Weightlifting", href: "Activities-Weightlifting.dc.html", body: "Snatch and clean & jerk, programmed year-round." },
      { eyebrow: "Road racing", title: "Running", href: "Activities-Running.dc.html", body: "The RBC Race for the Kids 15K, three years running, and years of 5Ks across Trinidad." }
    ],
    slots: [{ key: "activities-hero", ratio: "16 / 9", label: "Activities" }],
    next: { title: "What I do with the rest of it", lede: "Languages, manga, and whatever the group is playing.", href: "Curiosities.dc.html", label: "See the curiosities" }
  },

  /* ------------------------------------------------------------ places ---- */
  {
    file: "Place-Mexico.dc.html", section: "about", parent: { label: "About", href: "About.dc.html" },
    eyebrow: "About · Mexico", title: "Monterrey", lede: "Nuevo León, Mexico. From 2011, age three.",
    desc: "Monterrey, Nuevo León. AIM and LICEO, and the city I measure every other place against.",
    intro: "The third country but the first one I actually remember. School started here: AIM first, then LICEO. Spanish stopped being the language my parents spoke and became the language I thought in.",
    body: ["It is still the place I compare everything to. When I describe a city as hot, or loud, or close, Monterrey is the baseline I am measuring against."],
    facts: [["Years", "2011 onward"], ["Schools", "AIM, then LICEO"], ["Language", "Spanish"]],
    slots: [
      { key: "mx-1", ratio: "4 / 3", label: "Monterrey" },
      { key: "mx-2", ratio: "1 / 1", label: "AIM or LICEO" },
      { key: "mx-3", ratio: "4 / 3", label: "Family in Monterrey" },
      { key: "mx-5", ratio: "1454 / 2576", label: "Inside a church in Mexico" },
      { key: "mx-6", ratio: "1200 / 1600", label: "Back home in Mexico, summer 2026" },
      { key: "mx-4", ratio: "3 / 4", label: "Dressed up as a pirate" }
    ],
    next: { title: "Next: Colombia", lede: "Altitude, and a second accent in the same language.", href: "Place-Colombia.dc.html", label: "Go to Colombia" }
  },
  {
    file: "Place-Colombia.dc.html", section: "about", parent: { label: "About", href: "About.dc.html" },
    eyebrow: "About · Colombia", title: "Bogotá", lede: "Colombia. December 2016, age eight.",
    desc: "Bogotá, Colombia. Colegio Tilata in La Calera, altitude, and a second accent.",
    intro: "Colegio Tilata, in La Calera, just outside the city. Bogotá sits at 2,640 metres, and the first thing the altitude teaches you is that running is different here.",
    media: [
      {
        "title": "Arriving at altitude",
        "body": [
          "Bogotá sits at 2,640 metres, and the first thing the altitude teaches you is that running is different here. We arrived in December 2016, when I was eight."
        ]
      },
      {
        "title": "Colegio Tilatá",
        "body": [
          "I went to Colegio Tilatá, in La Calera, just outside the city, in the grey uniform you can see here."
        ],
        "slots": ["co-9"]
      },
      {
        "title": "Learning that Spanish is not one language",
        "body": [
          "The accent, the slang and the register all shifted, and I had to shift with them. That was the first time I remember consciously adapting to fit a room."
        ]
      },
      {
        "title": "Where the Venezuela question started",
        "body": [
          "Bogotá is also where I first saw Venezuelan migration up close. It was in the news, on the streets, and in my brother's classroom, where classmates were refugees. Years later, in Trinidad, it became my research paper."
        ]
      },
      {
        "title": "Out of the city",
        "slots": [
          "co-4",
          "co-5",
          "co-10",
          "co-6",
          "co-7",
          "co-8"
        ],
        "gallery": true
      }
    ],
    facts: [["Arrived", "December 2016"], ["School", "Colegio Tilata, La Calera"], ["Altitude", "2,640 m"], ["Age", "Eight to ten"]],
    slots: [
      { key: "co-11", ratio: "1200 / 1600", label: "On a balcony in the hills, in the Tilatá shirt" },
      { key: "co-9", ratio: "720 / 960", label: "With my brother, ready for school in our Colegio Tilatá uniforms" },
      { key: "co-10", ratio: "1200 / 1600", label: "Lying on a bronze goat above a canyon" },
      { key: "co-4", ratio: "3 / 4", label: "Riding a mammoth at the dinosaur park" },
      { key: "co-5", ratio: "3 / 4", label: "Face to face with a T. rex, map guide in hand" },
      { key: "co-6", ratio: "8 / 7", label: "Life jacket on, ready for the canoe" },
      { key: "co-7", ratio: "3 / 2", label: "Outside the shelter we built" },
      { key: "co-1", ratio: "4 / 3", label: "Bogotá" },
      { key: "co-2", ratio: "1 / 1", label: "Colegio Tilata" },
      { key: "co-3", ratio: "4 / 3", label: "La Calera" },
      { key: "co-8", ratio: "2 / 3", label: "With an alpaca and its keeper in the Andes, Peru" }
    ],
    next: { title: "Next: Panama", lede: "Where I started playing drums.", href: "Place-Panama.dc.html", label: "Go to Panama" }
  },
  {
    file: "Place-Panama.dc.html", section: "about", parent: { label: "About", href: "About.dc.html" },
    eyebrow: "About · Panama", title: "Ciudad de Panamá", lede: "Panama. July 2019, age ten.",
    desc: "Ciudad de Panamá. The International School of Panama, and SonoArte, where I started drumming.",
    intro: "The International School of Panama for class, and SonoArte for the thing that actually changed how I spend my time: this is where I started playing drums.",
    body: ["Drumming became the way I think. It is the one activity that has followed me into every country since, and the reason walking into a new school with a music room never felt like walking in cold."],
    facts: [["Arrived", "July 2019"], ["School", "International School of Panama"], ["Music", "SonoArte"]],
    slots: [
      { key: "pa-4", ratio: "3 / 4", label: "At the Cerro Ancón nature reserve" },
      { key: "pa-1", ratio: "4 / 3", label: "Ciudad de Panamá" },
      { key: "pa-2", ratio: "1 / 1", label: "SonoArte" },
      { key: "pa-3", ratio: "4 / 3", label: "International School of Panama" }
    ],
    next: { title: "Next: Trinidad & Tobago", lede: "StuCo, and Stronger Together.", href: "Place-Trinidad.dc.html", label: "Go to Trinidad" }
  },
  {
    file: "Place-Trinidad.dc.html", section: "about", parent: { label: "About", href: "About.dc.html" },
    eyebrow: "About · Trinidad & Tobago", title: "Port of Spain", lede: "Trinidad & Tobago. August 2021, age twelve.",
    desc: "Port of Spain. The International School of Port of Spain, Student Council, Stronger Together, and SonoArte online.",
    intro: "The International School of Port of Spain. I arrived as schools everywhere were working out how to come back from remote learning, which turned out to be the thing worth working on.",
    body: ["I joined Student Council, and helped run Stronger Together, a student-led initiative supporting classmates through the return to in-person school. It was the first time I saw a student idea actually change how a school felt.", "The drums carried over. I kept taking SonoArte online from Panama, so the kit stayed part of the week through the move.", "By the time I left, the place had given me my Personal Project too: a paper on Venezuelan migration to Trinidad, the country I had just spent four years living in."],
    facts: [["Arrived", "August 2021"], ["School", "International School of Port of Spain"], ["Led", "Student Council · Stronger Together"], ["Music", "SonoArte, online from Panama"], ["Capstone", "Venezuelan migration paper, 2025"]],
    slots: [
      { key: "tt-1", ratio: "4 / 3", label: "Port of Spain" },
      { key: "tt-2", ratio: "1 / 1", label: "ISPS" },
      { key: "tt-3", ratio: "4 / 3", label: "Stronger Together" },
      { key: "tt-4", ratio: "4 / 3", label: "On a bench by the water, with the dog" }
    ],
    next: { title: "Next: Pennsburg, Pennsylvania", lede: "Boarding at Perkiomen.", href: "Place-UnitedStates.dc.html", label: "Go to the US" }
  },
  {
    file: "Place-UnitedStates.dc.html", section: "about", parent: { label: "About", href: "About.dc.html" },
    eyebrow: "About · Pennsylvania", title: "Pennsburg, Pennsylvania", lede: "Boarding since August 2025. The return after fifteen years.",
    desc: "Boarding at Perkiomen School in Pennsburg, Pennsylvania since August 2025.",
    intro: "Pennsburg, Pennsylvania, is where I board at Perkiomen School. I came back to the United States in August 2025, fifteen years after leaving the country I was born in.",
    body: ["Coming back meant arriving in my own birth country as a newcomer: Spanish was my first language, and the last time I lived in the United States I was two.", "Pennsburg is the first place I have lived without my family in the same building. Health science, HOSA, Model UN, the Perkiomenite, varsity swimming and the rock band all live here. The Perkiomen page has the full picture."],
    facts: [["Arrived", "August 2025"], ["Away", "Fifteen years, five countries"], ["School", "Perkiomen School"], ["Born", "Houston, Texas, in 2008"]],
    slots: [
      { key: "us-2", ratio: "4 / 3", label: "Perkiomen School campus" },
      { key: "us-3", ratio: "1 / 1", label: "Pennsburg, Pennsylvania" },
      { key: "us-4", ratio: "3 / 4", label: "Under Cloud Gate, Chicago" }
    ],
    next: { title: "The academics", lede: "Two schools, and the work that came out of them.", href: "Academics.dc.html", label: "See the academics" }
  },
  {
    file: "Academics-ISPS.dc.html", section: "academics", parent: { label: "Academics", href: "Academics.dc.html" },
    eyebrow: "Academics · Trinidad & Tobago", title: "International School of Port of Spain", lede: "2021–2025. Student Council, and Stronger Together.",
    desc: "ISPS. Student Council and the Stronger Together initiative.",
    intro: "ISPS is where I first took on something school-wide rather than something assigned. Student Council meant representing my class and actually running events; Stronger Together meant building the support I wished had existed.",
    tbd: "What the Mr. Jefferies Memorial Award recognises. Its criteria are not published anywhere I could find, so rather than guess at what it honours, the entry below just states the fact of it. Send the description and it goes in.",
    media: [
      {
        "title": "The school",
        "body": [
          "The International School of Port of Spain is a private, not-for-profit, coeducational day school offering Pre-Kindergarten through grade 12. It opened in September 1994, and it is an assisted school of the U.S. Department of State's Office of Overseas Schools.",
          "The year runs on a northern-hemisphere calendar: two semesters, late August to mid-January and mid-January to late June, split into four grading periods."
        ],
        "points": [
          ["Small", "308 students and 47 faculty in 2026, so a Student Council or a club is run by a handful of people who all know each other."],
          ["Mixed", "56.2% of students come from the receiving state, Trinidad and Tobago, 18.2% are U.S. citizens and 25.6% are from third countries. Students represent Trinidad and Tobago, the USA, the UK, Canada and France."],
          ["Divisions", "113 in elementary, 57 in middle school, 125 in high school and 13 in PreK."]
        ],
        "slots": ["isps-6"]
      },
      {
        "title": "The system I studied in",
        "body": [
          "ISPS is an assisted school of the U.S. State Department, and it offers the IB, AP and the American Diploma. My own years there were the IB Middle Years Programme, grades 7 to 10."
        ],
        "points": [
          ["IB, AP and the American Diploma", "All three are offered in high school."],
          ["Standardised tests", "MAP and the SAT are offered. The ACT is not."],
          ["Accreditation", "NEASC, with a U.S. Principal Officer's representative holding a voting seat on the school board."],
          ["Language", "Spanish is the language offered, which suited a student whose first language it was."]
        ]
      },
      {
        "title": "Student Council and Stronger Together",
        "body": [
          "Student Council meant representing my class and running school-wide events. Stronger Together was a student-led initiative supporting classmates through the return to in-person school after remote learning.",
          "The problem was not academic. A lot of people had quietly stopped knowing how to be around each other.",
          "I was also my homeroom's representative, one of the white-shirted Student Council members in the photo."
        ],
        "slots": ["isps-8"]
      },
      {
        "title": "AP Vybz, the music organization",
        "body": [
          "AP Vybz is ISPS's student music organization, and I was its vice-president and a drummer. When a new executive team took over, the club leaned into performing: three shows between January and April, at the Valentine's Day event, the St. Patrick's Day event and the Talent Show. The full story is in the Drums section."
        ],
        "slots": ["isps-9"]
      },
      {
        "title": "Mayaro house",
        "body": [
          "ISPS students belong to houses, and I am a proud member of Mayaro. That is me on the rope in the tug of war."
        ],
        "slots": ["isps-11"]
      },
      {
        "title": "Finishing the MYP",
        "body": [
          "I came out of the IB Middle Years Programme with the highest MYP score in my class, and a bilingual diploma on top of it, earned for completing the programme in two languages. The Personal Project, the Venezuelan migration paper, was the capstone."
        ],
        "points": [
          ["Highest MYP score in my class", ""],
          ["MYP Bilingual Diploma", "Completed in English and Spanish."],
          ["Personal Project Award", "The self-directed project, carried end to end."]
        ]
      },
      {
        "title": "The same subjects, four years running",
        "body": [
          "English every single year, with Spanish, music and Individuals & Societies close behind. That is a more honest description of where my attention goes than anything I could claim about myself."
        ]
      },
      {
      "title": "Guayasamín, reinterpreted",
      "body": [
        "For Spanish class I recreated \"Madre y Niño con Fondo Amarillo\" (1989) by the Ecuadorian painter Oswaldo Guayasamín, and I was pretty impressed with how accurate it ended up.",
        "Copying it was a maths problem before it was an art problem. I had to work from a specific scaling of the original image to the board I painted on, then apply a scale factor to every proportion: the two heads, the angles of the noses and mouths, the blocks of yellow and black around them. Once the scale was fixed I could stop copying and start reinterpreting, choosing my own colours and texture inside his composition."
      ],
      "points": [
        ["The original", "\"Madre y Niño con Fondo Amarillo\", Oswaldo Guayasamín, 1989."],
        ["The method", "One scale factor from the original image to the board, applied everywhere, so the proportions hold."],
        ["The reinterpretation", "His shapes and composition, in my own palette and surface."]
      ],
      "slots": ["isps-4", "isps-5"]
    },
    {
      "title": "The artist and the presentation",
      "body": [
        "The same unit included a cultural presentation, in Spanish, for AP Spanish. Guayasamín was born in Quito on July 6, 1919 and died in Baltimore on March 10, 1999. His work draws on expressionism, cubism and social realism, and was inspired by Mexican muralism. He is of Quechua origin, entered the School of Fine Arts at 13, and showed in about 200 exhibitions in major museums.",
        "The line I kept from the slide is his own: \"Mi pintura es para herir, para arañar y golpear en el corazón de la gente.\" My painting is meant to wound, to scratch and to strike the heart of the people."
      ],
      "slots": ["isps-7"]
    },
    {
        "title": "Where the Venezuela paper came from",
        "body": [
          "The clearest thread runs through Individuals & Societies. Grade 9 spent weeks on migration, and ten days after I turned in that unit's paper I was already listing Venezuelan migration as a Personal Project topic. The coursework is where the questions came from."
        ]
      },
      {
        "title": "Clubs and sport",
        "points": [
          ["Peak Performers", "The running club."],
          ["Debate Club and Journalism Club", "Arguing a position, and writing for the school."],
          ["High school basketball", ""],
          ["In-class debates", "Doping in sport, zoos, phones at school. Arguing a position in front of people who disagree stopped feeling unusual well before Model UN did the same thing at Perkiomen."]
        ]
      }
    ],
    facts: [["Years", "2021 – 2025"], ["GPA", "4.0 unweighted, 4.06 weighted"], ["School", "PreK–12, 308 students"], ["Accreditation", "NEASC"], ["Roles", "Student Council · Stronger Together"], ["Programme", "IB Middle Years Programme"], ["Result", "Highest MYP score in my class · bilingual diploma"], ["House", "Mayaro"]],
    awards: {
      title: "Four years of awards",
      lede: "Awarded across the IB Middle Years Programme, grades 7 through 10.",
      groups: [
        { title: "Grade 7", items: [
          { label: "Best Historian", detail: "Individuals & Societies" },
          { label: "Academic Excellence", detail: "English · Spanish" },
          { label: "Consistent Effort", detail: "Physical Education" }
        ]},
        { title: "Grade 8", items: [
          { label: "Mr. Jefferies Memorial Award", detail: "A named school award, presented at the end of Grade 8." },
          { label: "Academic Excellence", detail: "English · Music · Spanish · Individuals & Societies · Drama" },
          { label: "Most Improved", detail: "Visual Arts" },
          { label: "Consistent Effort", detail: "Integrated Science" }
        ]},
        { title: "Grade 9", items: [
          { label: "Academic Excellence", detail: "English · Music I · Design I · Physical Health and Education" },
          { label: "Consistent Effort", detail: "Integrated Math (10th grade)" }
        ]},
        { title: "Grade 10", items: [
          { label: "Personal Project Award", detail: "The MYP capstone. A self-directed project carried end to end." },
          { label: "MYP Bilingual Diploma", detail: "Awarded for completing the Middle Years Programme in two languages." },
          { label: "Academic Excellence", detail: "English · Individuals & Societies · Pre-Calculus · Physics II · Music II" },
          { label: "Consistent Effort", detail: "Chemistry" }
        ]}
      ]
    },
    slots: [
      { key: "isps-1", ratio: "4 / 3", label: "ISPS campus" },
      { key: "isps-2", ratio: "4 / 3", label: "Student Council" },
      { key: "isps-3", ratio: "1 / 1", label: "Awards ceremony" },
      { key: "isps-6", ratio: "1092 / 1176", label: "The International School of Port of Spain 2026 fact sheet, from the U.S. Department of State Office of Overseas Schools" },
      { key: "isps-7", ratio: "2200 / 1238", label: "My AP Spanish cultural presentation on Guayasamín" },
      { key: "isps-8", ratio: "376 / 264", label: "Student Council at ISPS, in the white polos" },
      { key: "isps-9", ratio: "382 / 270", label: "AP Vybz, the school music organization" },
      { key: "isps-10", ratio: "772 / 447", label: "AP Vybz members performing and rehearsing" },
      { key: "isps-11", ratio: "408 / 300", label: "Tug of war for Mayaro house" },
      { key: "isps-12", ratio: "213 / 223", label: "Student portrait at ISPS" },
      { key: "isps-4", ratio: "1141 / 1145", label: "Oswaldo Guayasamín, the original" },
      { key: "isps-5", ratio: "1400 / 1238", label: "My recreation, for Spanish class" }
    ],
    next: { title: "Next: Perkiomen", lede: "The health science track, and boarding.", href: "Academics-Perkiomen.dc.html", label: "Go to Perkiomen" }
  },
  {
    file: "Academics-Perkiomen.dc.html", section: "academics", parent: { label: "Academics", href: "Academics.dc.html" },
    eyebrow: "Academics · Pennsylvania", title: "Perkiomen School", lede: "Pennsburg, Pennsylvania. Boarding since August 2025.",
    desc: "Perkiomen School. Health science track, HOSA, Model UN, journalism, swimming, and the rock band.",
    intro: "Perkiomen is where the separate threads finally started pointing the same direction. The health science track is the academic spine; almost everything else on this site either feeds it or balances it.",
    body: ["My first room was small, with a desk, a bed and a window, and it was the start of my own adventure. Boarding changed how I work. Nobody schedules your evening for you, which means the difference between a good week and a wasted one is entirely a decision you make on Sunday."],
    media: [
      {
        "title": "What I do here",
        "body": [
          "Perkiomen is where I have said yes to the most. Alongside the health science track I run or take part in:"
        ],
        "points": [
          [
            "Class of '27 President",
            "Student Senate."
          ],
          [
            "Founder and President",
            "Perkiomen's HOSA chapter."
          ],
          [
            "Co-Editor in Chief and writer",
            "The Perkiomenite, the school paper."
          ],
          [
            "Dorm proctor",
            ""
          ],
          [
            "Secretary",
            "Investment & Philanthropy Club."
          ],
          [
            "Clubs",
            "Science Fair and Research Club, Model UN, DECA, Latin American Club, and the Be a Friend Project."
          ],
          [
            "Sport and music",
            "Varsity swimming, Olympic lifting, and drums in the rock band."
          ]
        ]
      },
      {
        "title": "Grades",
        "body": [
          "My GPA is 4.0 unweighted and 4.83 weighted."
        ]
      },
      {
        "title": "Around campus",
        "slots": [
          "perk-13",
          "perk-14",
          "perk-6",
          "perk-5",
          "perk-8",
          "perk-9",
          "perk-10",
          "perk-11",
          "perk-2",
          "perk-4"
        ],
        "gallery": true
      }
    ],
    facts: [["Arrived", "August 2025"], ["Track", "Health science"], ["Status", "Boarding student"]],
    awards: {
      title: "Awards at Perkiomen",
      lede: "Junior year. One for the medical track, one for maths and science, one from the pool.",
      groups: [
        { title: "Grade 11", items: [
          { label: "Medical Spirit & Promise Award", detail: "For the health science track and the work around it." },
          { label: "Rochester Institute of Technology Math & Science Award", detail: "2026. Awarded to a junior through RIT's recognition programme." },
          { label: "Most Improved, Varsity Boys Swimming", detail: "2026. See the swimming page." },
          { label: "AP International Diploma", detail: "Featured by Perkiomen School for earning it." }
        ]}
      ]
    },
    slots: [
      { key: "perk-12", ratio: "854 / 538", label: "With the Perkiomen Panther mascot" },
      { key: "perk-1", ratio: "4 / 3", label: "Perkiomen campus" },
      { key: "perk-2", ratio: "4 / 3", label: "Medical Spirit and Promise Award, Perkiomen School" },
      { key: "perk-4", ratio: "4 / 3", label: "Science and Math Award, Rochester Institute of Technology" },
      { key: "perk-3", ratio: "1 / 1", label: "Awards night" },
      { key: "perk-5", ratio: "4 / 3", label: "A birthday dinner in the dining hall" },
      { key: "perk-6", ratio: "3 / 4", label: "Meeting Alberto, the anatomy skeleton, in class" },
      { key: "perk-7", ratio: "4 / 3", label: "My first room at Perkiomen, the start of my own adventure" },
      { key: "perk-8", ratio: "974 / 778", label: "Perkiomen School's post on earning the AP International Diploma" },
      { key: "perk-9", ratio: "2016 / 1512", label: "A winter sunset over campus" },
      { key: "perk-10", ratio: "2016 / 1512", label: "Dusk on the lawn" },
      { key: "perk-13", ratio: "1125 / 1500", label: "With Senator Pennycuick" },
      { key: "perk-14", ratio: "1125 / 1500", label: "Happy in the blazer and tie" },
      { key: "perk-11", ratio: "2016 / 1512", label: "A rainbow after the storm" }
    ],
    video: { src: "/assets/video/perk-suit.mp4", poster: "/assets/video/perk-suit.jpg", ratio: "9 / 16", width: 340, label: "In the Perkiomen blazer and tie" },
    next: { title: "Next: Exeter Summer", lede: "A summer of coursework away from home.", href: "Academics-ExeterSummer.dc.html", label: "Go to Exeter Summer" }
  },
  {
    file: "Academics-ExeterSummer.dc.html", section: "academics", parent: { label: "Academics", href: "Academics.dc.html" },
    eyebrow: "Academics · Summer program", title: "Exeter Summer", lede: "Phillips Exeter Academy.",
    desc: "Exeter Summer at Phillips Exeter Academy. Coursework and Harkness-style seminars.",
    intro: "Exeter Summer at Phillips Exeter Academy. Exeter teaches around the Harkness table. Twelve students, one oval table, and no lecture to hide behind.",
    media: [
      {
        "title": "The Hamm '55 Leadership Program",
        "body": [
          "Not a general academic sampler: a track built around social justice and community engagement, focused on the philosophy, interpretation and execution of leadership."
        ],
        "points": [
          [
            "Practical leadership seminar",
            "The project was physical, not written: models that show what violence and a lack of opportunity do to people cut off by discrimination, with the design carrying part of the argument."
          ],
          [
            "Leadership analysis",
            "I investigated and presented Franklin Delano Roosevelt's leadership, set against the models we had been taught."
          ],
          [
            "Edward M. Kennedy Institute",
            "A visit that made policy a lot less abstract."
          ]
        ],
        "slots": [
          "exeter-3",
          "exeter-2"
        ]
      },
      {
        "title": "Underneath",
        "body": [
          "Underneath the leadership track sat the ordinary reason most people go to a summer program: online SAT preparation, and advanced mathematics on introductory calculus."
        ]
      },
      {
        "title": "Around campus",
        "slots": [
          "exeter-1",
          "exeter-13",
          "exeter-11",
          "exeter-12",
          "exeter-14"
        ],
        "gallery": true
      },
      {
        "title": "Outside class",
        "slots": [
          "exeter-6",
          "exeter-7",
          "exeter-8",
          "exeter-9",
          "exeter-10",
          "exeter-4",
          "exeter-5"
        ],
        "gallery": true
      }
    ],
    readers: [
      {
        "kicker": "The project",
        "heading": "Believe It or Not, from top to bottom",
        "intro": "The seminar's project asked us to make the impact of violence and lack of opportunity visible. These pages are part of that work. The figures are the ones printed on the designs.",
        "items": [
          {
            "kicker": "Awareness design",
            "title": "Believe It or Not: our awareness designs from the leadership seminar",
            "pages": 3,
            "blurb": "Pages from the Hamm '55 leadership seminar project. Each one pairs a symbol with the number it stands for, then says \"believe it or not\" and explains it. Scroll through all three.",
            "pdf": "/assets/docs/inequality-models.pdf",
            "dir": "/assets/docs/inequality-models"
          }
        ]
      }
    ],
    facts: [["Program", "Hamm '55 Leadership Program"], ["Place", "Exeter, New Hampshire"], ["Focus", "Social justice · community engagement"], ["Also", "SAT prep · intro calculus"]],
    slots: [
      { key: "exeter-1", ratio: "4 / 3", label: "Along the river in Exeter" },
      { key: "exeter-2", ratio: "4 / 3", label: "A team huddle in class" },
      { key: "exeter-3", ratio: "4 / 3", label: "Under the Exeter banner" },
      { key: "exeter-4", ratio: "4 / 3", label: "Canobie Lake Park, summer 2025" },
      { key: "exeter-5", ratio: "4 / 3", label: "Friends and instructors signing shirts on the last day" },
      { key: "exeter-6", ratio: "3 / 4", label: "Hanging out in the dorm common room" },
      { key: "exeter-7", ratio: "7 / 6", label: "Celebrating under the Exeter banner" },
      { key: "exeter-8", ratio: "4 / 3", label: "Evening football on the lawn with friends from the program" },
      { key: "exeter-9", ratio: "4 / 3", label: "Blazer on, sunset over the river" },
      { key: "exeter-10", ratio: "3 / 4", label: "Arms out on the dock" },
      { key: "exeter-11", ratio: "4 / 3", label: "The quad on a bright summer day" },
      { key: "exeter-12", ratio: "4 / 3", label: "The Academy building at dusk" },
      { key: "exeter-13", ratio: "3 / 4", label: "Leadership readings, highlighted and annotated" },
      { key: "exeter-14", ratio: "4 / 3", label: "Inside the Phillips Exeter Academy library" }
    ],
    next: { title: "Next: Comp Bio", lede: "Computational biology at Carnegie Mellon.", href: "Academics-CompBio.dc.html", label: "Go to Comp Bio" }
  },
  {
    file: "Academics-CompBio.dc.html", section: "academics", parent: { label: "Academics", href: "Academics.dc.html" },
    eyebrow: "Academics · Carnegie Mellon", title: "Computational Biology", lede: "Carnegie Mellon University.",
    desc: "Computational biology coursework at Carnegie Mellon. The training behind the CellAtlas GBM project.",
    intro: "Computational biology at Carnegie Mellon. This is the training that makes the glioblastoma work possible: biology asked in a language a computer can actually answer.",
    media: [
      {
        "title": "Four weeks, five people",
        "body": [
          "An intensive, selective program with sessions in coding, laboratory work, research and algorithm development, with professors and teaching assistants around for the parts a five-person team could not work out alone."
        ],
        "slots": [
          "cmu-lab",
          "gbm-2"
        ]
      },
      {
        "title": "The final project",
        "body": [
          "Does cell-type composition, estimated by deconvolving bulk RNA-seq across 153 TCGA-GBM samples, say anything about a patient's prognosis on its own terms, not just as a stand-in for tumour grade? My part was validation: proving whether the numbers the rest of the pipeline produced could be trusted.",
          "We were finalists in the final project presentation."
        ],
        "slots": [
          "cmu-present",
          "cmu-lecture"
        ]
      },
      {
        "title": "Why it matters to me",
        "body": [
          "Medicine is increasingly a data problem, and I would rather be able to write the analysis than wait for someone else to run it. The certificate says Pre-College Program in Computational Biology, summer 2026."
        ],
        "slots": [
          "gbm-4",
          "gbm-3"
        ]
      },
      {
        "title": "Off the clock",
        "slots": [
          "cmu-friends",
          "cmu-fireworks",
          "cmu-pole",
          "cmu-lobby"
        ],
        "gallery": true
      }
    ],
    facts: [["Institution", "Carnegie Mellon University"], ["Field", "Computational biology"], ["Team", "Five-person team"], ["Result", "Finalist, final project presentation"]],
    awards: {
      title: "Recognition",
      lede: "",
      groups: [
        { title: "Final project", items: [
          { label: "Finalist", detail: "Selected to present the final project." }
        ]}
      ]
    },
    slots: [
      { key: "gbm-3", ratio: "3 / 2", label: "The full Carnegie Mellon cohort, summer 2026" },
      { key: "gbm-2", ratio: "4 / 3", label: "The team, mid-project" },
      { key: "cmu-lab", ratio: "4 / 3", label: "In the lab with teammates" },
      { key: "cmu-friends", ratio: "3 / 2", label: "With three friends from the program, a medal around one neck" },
      { key: "cmu-present", ratio: "3 / 4", label: "Presenting with the team" },
      { key: "cmu-lecture", ratio: "3 / 2", label: "Final project presentation in the lecture hall" },
      { key: "cmu-lobby", ratio: "3 / 2", label: "With a teammate and two of the instructors" },
      { key: "cmu-fireworks", ratio: "4 / 3", label: "Fireworks over campus with friends from the program" },
      { key: "cmu-pole", ratio: "3 / 4", label: "Looking up at the Walking to the Sky sculpture" },
      { key: "gbm-4", ratio: "4 / 3", label: "Pre-College Program in Computational Biology, certificate, summer 2026" }
    ],
    next: { title: "The research it feeds", lede: "CellAtlas GBM, in detail.", href: "Research-CellAtlas.dc.html", label: "See CellAtlas GBM" }
  },

  /* ---------------------------------------------------------- research ---- */
  {
    file: "Research-CellAtlas.dc.html", section: "research", parent: { label: "Research & projects", href: "Research.dc.html" },
    eyebrow: "Research · Computational biology", title: "CellAtlas GBM", lede: "Estimating a brain tumour's cellular makeup from cheap data, and rigorously testing whether to believe it.",
    desc: "A five-person team's glioblastoma deconvolution pipeline. My part was proving whether the numbers could be trusted.",
    intro: "A tumour sample is never pure cancer. It is cancer cells, immune cells, blood-vessel cells and normal brain tissue, blended into one signal by bulk RNA sequencing, like a smoothie: you can taste the blend, but not see the fruit that went into it. Single-cell sequencing can see the fruit, but it is expensive and unavailable for most patients.",
    link: { href: "https://cellatlasgbm.vercel.app/", label: "Open CellAtlas GBM" },
    stepsEyebrow: "What I built", stepsTitle: "Five checks on whether to believe the numbers",
    steps: [
      ["Donor-split integrity", "A leakage test by mutation: deliberately corrupt every held-out donor's data, rebuild the reference, and confirm nothing changes, rather than trusting a comment that says the test set was never touched. I also built the accuracy scorer itself, MAE, RMSE, signed bias, Spearman and Pearson correlation, validated against synthetic fixtures before trusting it on real predictions."],
      ["Sample and barcode audit", "TCGA identifiers encode real biology: tissue site, patient, sample type. I audited the whole cohort against those rules, no duplicate patients, no mismatched sample types, which closed a gate several downstream analyses depended on."],
      ["A frozen data contract", "Exactly seven cell types, non-negative, summing to 100 per patient, enforced in code. An unexpected column gets rejected, not silently dropped, which is what let five people work in parallel without quietly drifting out of sync with each other's assumptions."],
      ["Orthogonal validation", "The most important check in the project: does the RNA-based estimate agree with a measurement that never touched RNA at all? I compared inferred tumour fraction against DNA-derived tumour purity, and inferred immune fraction against methylation-derived leukocyte fraction, with bootstrap confidence intervals and correction for multiple comparisons."],
      ["Reference-free TME scoring", "The current phase: running MCP-counter and ESTIMATE, marker-based methods entirely independent of the deconvolution math, to see which composition columns deserve less trust. The T-cell, NK-cell and B-cell columns failed held-out validation and are reported as diagnostic only, not confident biological claims."]
    ],
    media: [
      {
        "title": "From a broad question to one we could test",
        "body": [
          "The five of us began with the tumour microenvironment, the neighbourhood of stromal and immune cells that helps a glioblastoma resist chemotherapy. Over several checkpoints we narrowed it to something we could execute and defend."
        ],
        "points": [
          [
            "The question",
            "Can the cell-type makeup of a tumour, estimated from cheap bulk RNA-seq, say anything about survival?"
          ],
          [
            "The data",
            "153 TCGA-GBM tumours from public bulk RNA-seq."
          ],
          [
            "Seven cell types",
            "Tumour, macrophage/microglia, T cell, NK cell, B cell, endothelial, oligodendrocyte."
          ],
          [
            "My part",
            "Validation: proving whether the numbers the rest of the pipeline produced could be trusted, not just that they looked plausible."
          ]
        ],
        "slots": [
          "gbm-2"
        ]
      },
      {
        "title": "The first results were plausible, and wrong",
        "points": [
          [
            "Log scale",
            "Solving on log values pushed immune cells near zero, because the mixing model is linear and additive. Linear counts-per-million fixed it."
          ],
          [
            "Housekeeping genes",
            "A handful of high-expression genes dominated the fit, so each gene was weighted by how well it told cell types apart."
          ],
          [
            "One donor, 38% of a cell type",
            "A single donor supplied 38% of the astrocyte cells in the reference. We rarefied: one cell per donor per trial, repeated and averaged."
          ]
        ],
        "slots": [
          "gbm-1"
        ]
      },
      {
        "title": "What we found",
        "points": [
          [
            "Best method",
            "ν-SVR, the algorithm CIBERSORT uses, was the most reliable of the three. NNLS drove many lymphocyte estimates to exactly zero."
          ],
          [
            "An independent check",
            "The RNA-based tumour purity correlated with a DNA-based measurement at ρ = 0.76. That check never touched RNA at all."
          ],
          [
            "A null result",
            "Composition features moved the survival model's concordance index by +0.001, essentially nothing. We reported it as it was."
          ],
          [
            "Order of choices",
            "We chose the method from pre-registered accuracy benchmarks, before checking which choice made the survival numbers look best."
          ]
        ],
        "slots": [
          "gbm-3"
        ]
      },
      {
        "title": "What I took from it",
        "body": [
          "A metric that is easy to optimise, like reconstruction error, is not evidence of correctness. Validation has to come from a measurement that could have proven us wrong.",
          "Freezing a schema before looking at results, and reporting a well-supported null, is the kind of thinking I want to carry into medicine, where believing a plausible number costs more than a lower grade."
        ]
      }
    ],
    facts: [["Team", "Five people, Carnegie Mellon, summer 2026"], ["My role", "Validation, benchmarking, quality control"], ["Cohort", "153 TCGA-GBM tumours"], ["Validation", "ρ = 0.76 vs. an independent, DNA-based measurement"], ["Prognosis", "ΔC-index = +0.001, a reported null result"]],
    slots: [
      { key: "gbm-1", ratio: "3 / 4", label: "Presenting the null result to the cohort" },
      { key: "gbm-2", ratio: "4 / 3", label: "The team, mid-project" },
      { key: "gbm-3", ratio: "3 / 2", label: "The full Carnegie Mellon cohort, summer 2026" }
    ],
    next: { title: "Next: SanaSanita", lede: "The hospital technology project.", href: "Research-MedicalApp.dc.html", label: "Go to SanaSanita" }
  },
  {
    file: "Research-MedicalApp.dc.html", section: "research", parent: { label: "Research & projects", href: "Research.dc.html" },
    eyebrow: "Research · Technology", title: "SanaSanita", lede: "Free, offline instructions for the families of children leaving a public hospital.",
    desc: "SanaSanita, a free offline tool that tells caregivers at IMSS-Bienestar pediatric services what the doctor did not have time to say.",
    intro: "I did not start with an app. I started by asking what actually goes wrong inside a government-funded public pediatric hospital, and then spent two weeks on the ward at the Torre Pediátrica in Veracruz writing down what I saw. Ninety-four pages of notes later, the same problem kept turning up wearing different clothes.",
    link: { href: "https://sanasanita.vercel.app/", label: "Open SanaSanita" },
    quote: {
      text: "This really shows the medical potential of intelligence and creativity, based on the resources available.",
      by: "A physician at the Torre Pediátrica, from the field notes"
    },
    stepsEyebrow: "How it works", stepsTitle: "Four layers",
    awards: {
      eyebrow: "Constraints",
      title: "The lines that do not move",
      lede: "Written down before the code, and not moved since.",
      groups: [
        { title: "What it never does", items: [
          { label: "No patient data", detail: "No name, no CURP, no expediente, no date of birth. Nothing is saved to any server." },
          { label: "No diagnosis or triage", detail: "It does not decide what is wrong with a child, and it does not infer a referral." },
          { label: "No dose calculation", detail: "It builds a schedule from what the physician entered. It does not work out the dose." },
          { label: "No medication substitution", detail: "If a drug is out of stock the app says so. Proposing a different one would be prescribing." },
          { label: "No paywall circumvention", detail: "Open-access sources only, always. Never Sci-Hub." }
        ]},
        { title: "What is guaranteed", items: [
          { label: "Nothing unreviewed reaches a family", detail: "A physician reviews and signs every line before it is printed." },
          { label: "Free, permanently", detail: "No procurement, no contract, no commercial relationship." },
          { label: "It works offline", detail: "The consultation may have internet. The family's home usually does not." }
        ]}
      ]
    },
    media: [
      {
        "title": "The notebook",
        "body": [
          "The notes behind the app were handwritten, one page per observation, over two weeks on the ward. This spread is shown for the handwriting, not the content; no patient names appear in it.",
          "A consultation lasts a few minutes, the prescription form has three medicine slots, and rounds happen in the morning because there is no time in the afternoon. So I wrote the failures down one at a time."
        ],
        "points": [
          [
            "Medicines the pharmacy did not stock",
            "Nobody in the room knew until the family reached the window."
          ],
          [
            "Surgeries lost to a date three months out",
            "A missed slot can push a child back by months again."
          ],
          [
            "Families arriving unprepared",
            "Without their studies, without their documents, or having given the child breakfast."
          ],
          [
            "Reading nobody could open",
            "Residents were assigned journals that sit behind paywalls the hospital does not pay for."
          ]
        ],
        "slots": [
          "field-notes"
        ]
      },
      {
        "title": "Two years on, the same gap",
        "body": [
          "A return trip to the same ward in the summer of 2026 found the same shape of problem."
        ],
        "points": [
          [
            "Typewriters",
            "Some patient documentation is still typed, because there are not enough computers."
          ],
          [
            "No interpreter",
            "Families arrive from mountain communities where neighbouring villages speak mutually unintelligible languages."
          ],
          [
            "A prescription that stays behind",
            "By policy the pharmacy keeps the paper once it fills it, so a family leaves with no record of what the child is taking, for how long, or why."
          ]
        ]
      },
      {
        "title": "A transfer problem, not a knowledge problem",
        "body": [
          "The doctor already knows what the family should do. The national medicine catalogue is public. The research exists. In every case the information is real and does not reach the person who needs it at the moment they need it. That gap is what SanaSanita is built into."
        ]
      },
      {
        "title": "The mission, written before any code",
        "body": [
          "To tell parents what the doctor left out, forgot, or had no time to say, and to make sure they understand all of it, and forget none of it.",
          "Every feature is measured against that sentence. Anything that does not help a parent understand or remember does not ship."
        ]
      },
      {
        "title": "The screen a doctor opens",
        "body": [
          "The first line on it is the promise: no name, no CURP, no expediente, and nothing saved to any server. There is no patient record, so there is none to leak.",
          "The doctor types the diagnosis in Spanish, the child's age and weight, and what happened in the consultation. A yellow band stays on screen as a standing warning that nothing goes home with a family until a physician has read, corrected and signed it."
        ],
        "slots": [
          "app-plan"
        ]
      },
      {
        "title": "Where the evidence comes from, and who signs it",
        "body": [
          "The app searches only what is legally free: Europe PMC, PubMed, Semantic Scholar, SciELO México, Medigraphic and BVS/PAHO. Never Sci-Hub. It pulls the passages that bear on care at home, each with its exact citation, study population and link.",
          "Then the gate. The doctor writes the family's version in plain words. Aprobar keeps it. Rechazar throws it away. The system never writes the family-facing line itself, and where there is no evidence the section stays empty."
        ],
        "slots": [
          "app-evidence-search",
          "app-evidence-engine",
          "app-evidence-approve"
        ]
      },
      {
        "title": "Built for a house, not a clinic",
        "body": [
          "What the family leaves with is pictures first. Foods and household triggers are tapped to mark, and anything left unmarked is understood to be allowed.",
          "Medicines are chosen against the national catalogue by clave, using the same fields as the paper prescription. The app builds the schedule from what the doctor entered. It does not calculate the dose, and when something is out of stock it says so rather than proposing a different drug."
        ],
        "slots": [
          "app-pictograms",
          "app-medication"
        ]
      },
      {
        "title": "Where it goes from here",
        "body": [
          "The aim is for SanaSanita to run inside IMSS-Bienestar hospitals like the one it was written in, used by the doctors already working there.",
          "For a physician: the evidence they cannot otherwise reach, in their language, with the citation attached, as support for their own reasoning. For a family: a summary they can read and follow at home.",
          "The app never diagnoses and never proposes a treatment. It makes the doctor's own answer easier to give, and much harder to lose."
        ]
      }
    ],
    facts: [["Built for", "IMSS-Bienestar pediatric services"], ["Where", "Torre Pediátrica, HAEV, Veracruz"], ["Field research", "Two weeks on the ward (94 pages of notes), plus 60+ hours back in summer 2026"], ["Version", "v0.1, beta"]],
    /* The screenshots are the app's own column, so they are portrait. 4/5 is close to
       all six, which keeps the grid even without cropping anything meaningful. */
    /* The mark sits beside the intro; the screenshots are the gallery. They are the
       app's own column, so they are portrait, and the tiles are widened because UI
       text at 220px is unreadable. */
    slots: [
      { key: "app-icon", ratio: "1 / 1", label: "The SanaSanita mark" },
      { key: "field-notes", ratio: "2016 / 1512", label: "Field notes from the ward, handwritten" },
      { key: "app-plan", ratio: "4 / 5", label: "Nuevo plan, the doctor's screen" },
      { key: "app-evidence-search", ratio: "4 / 5", label: "Searching the open-access literature" },
      { key: "app-evidence-engine", ratio: "4 / 5", label: "Motor de evidencia, where a draft is written" },
      { key: "app-evidence-approve", ratio: "4 / 5", label: "Approving a passage with its citation" },
      { key: "app-pictograms", ratio: "4 / 5", label: "Food and home pictograms, tapped to mark" },
      { key: "app-medication", ratio: "4 / 5", label: "The medication row" }
    ],
    next: { title: "Next: the publication", lede: "Venezuelan immigration research.", href: "Research-Venezuela.dc.html", label: "Go to the publication" }
  },
  {
    file: "Research-Venezuela.dc.html", section: "research", parent: { label: "Research & projects", href: "Research.dc.html" },
    eyebrow: "Research · Publication", title: "Venezuelan Immigration", lede: "Venezuelan Immigration and Integration to Trinidad and Tobago in Recent Years, a 42-page paper published on SSRN.",
    desc: "A published, 62-source paper on Venezuelan migration to Trinidad and Tobago, built from five interviews conducted in Spanish. My IB MYP Personal Project.",
    intro: "Trinidad is seven miles off Venezuela's coast, close enough that thousands have crossed it by open boat. Having also grown up in Colombia and Panama, two of the countries that absorbed the largest share of that same migration, this was never an abstract topic to me. It was my housekeeper's children, my brother's refugee classmates in Bogotá, and now the community down the road from where I live.",
    link: { href: "https://ssrn.com/abstract=5169766", label: "Read the paper on SSRN" },
    quote: {
      text: "If there was something I would choose, it would be legislation for asylum.",
      by: "Amanda Solano, UNHCR protection officer for Trinidad and Tobago, interviewed for the paper"
    },
    steps: [
      ["Question", "What does Venezuelan migration and integration into Trinidad and Tobago look like, for the people living it and the country receiving them?"],
      ["Method", "62 sources cross-checked against five interviews conducted in Spanish, cited and tracked through NoodleTools."],
      ["Findings", "Deadly sea crossings, mass deportations, sex trafficking, wages under the legal minimum, and a five-year wait to enrol Venezuelan children in public school."],
      ["Published in", "SSRN, the Social Science Research Network. Ranked against other SSRN publications, and also on ResearchGate and Academia."]
    ],
    media: [
      {
        "title": "It started with a school unit",
        "body": [
          "Grade 9 Individuals & Societies spent weeks on migration itself: drivers, routes, sending and receiving countries. I turned in that unit's research paper on June 8th, 2024. Ten days later I was already listing Venezuelan migration as a Personal Project topic."
        ]
      },
      {
        "title": "From a book drive to a research paper",
        "body": [
          "By May 2024 there was a La Casita club at school, and its first move that fall was a book drive for the Venezuelan children's library the centre runs in Arima. Once the books were collected it was clear the drive was advertising the crisis, not teaching me about it.",
          "So my father and I talked it through and the product changed: a full research paper on why Venezuelans were leaving and what happened to them once they arrived. My supervisor's one condition was that every interview question had to be open-ended."
        ],
        "slots": [
          "vz-1"
        ]
      },
      {
        "title": "Five interviews, all in Spanish",
        "body": [
          "Every quotation is timestamped to a recording and cross-checked against IOM displacement-tracking data, Trinidadian reporting from the Guardian and Newsday, and filings from Amnesty International, Human Rights Watch and the U.S. State Department."
        ],
        "points": [
          [
            "A housekeeper",
            "who crossed by open boat."
          ],
          [
            "A Venezuelan doctor",
            "now cleaning houses because Trinidad will not recognise her degree."
          ],
          [
            "Andreina Briceño Ventura-Brown",
            "of La Casita."
          ],
          [
            "A UNHCR protection officer",
            "for Trinidad and Tobago."
          ]
        ]
      },
      {
        "title": "What did not go well",
        "body": [
          "I meant to publish by January; it went up in March, after other classes pushed it down my list for a month I did not have. And most of the people I interviewed already agreed with the paper's argument. The version I would write next puts more of the Trinidadian side in the room too."
        ]
      },
      {
        "title": "Grading it myself first",
      "slots": ["vz-3"],
        "body": [
          "I graded the paper against my own criteria before anyone else did. The number is not the point. Writing down where it fell short, on purpose, is."
        ],
        "points": [
          [
            "Research",
            "7 out of 8"
          ],
          [
            "Analysis",
            "7"
          ],
          [
            "Interviews",
            "6"
          ],
          [
            "Communication",
            "4, the honest mark for publishing late and rushing the final read-through"
          ]
        ]
      },
      {
        "title": "From La Casita's book box to a personal project exhibition",
        "body": [
          "Built and defended as my IB Middle Years Programme Personal Project, with a full report on the planning, the criteria I graded my own work against, and what I would do differently.",
          "Presented on this board at the school's Personal Project Exhibition: the interviews, the drivers behind the migration, the routes across the Bocas del Dragón, and the case built line by line back to the two goals it started from."
        ],
        "slots": [
          "vz-2",
          "vz-4"
        ]
      }
    ],
    readers: [
      {
        "kicker": "Read it here",
        "heading": "The paper and the report, top to bottom",
        "intro": "Scroll through either document without leaving the page. The PDFs open in a new tab as well.",
        "items": [
          {
            "kicker": "Published paper",
            "title": "Venezuelan Immigration and Integration to Trinidad and Tobago in Recent Years",
            "pages": 42,
            "blurb": "The full 42-page paper as published on SSRN.",
            "pdf": "/assets/docs/venezuela-paper.pdf",
            "dir": "/assets/docs/venezuela-paper"
          },
          {
            "kicker": "Final report",
            "title": "MYP Personal Project Final Report",
            "pages": 15,
            "blurb": "The planning, the learning goal, the process and my reflection, written for the IB Middle Years Programme.",
            "pdf": "/assets/docs/personal-project-report.pdf",
            "dir": "/assets/docs/personal-project-report"
          }
        ]
      }
    ],
    facts: [["Type", "Publication"], ["Topic", "Venezuelan migration to Trinidad & Tobago"], ["Length", "42 pages · 62 sources"], ["Venue", "SSRN"], ["When", "November 2024 – May 2025"]],
    slots: [
      { key: "vz-1", ratio: "3 / 4", label: "The paper's title page, published on SSRN" },
      { key: "vz-2", ratio: "4 / 3", label: "Presenting the work at the Personal Project Exhibition" },
      { key: "vz-3", ratio: "995 / 1202", label: "The first page of the final report, with the planning and the learning goal" },
      { key: "vz-4", ratio: "888 / 1600", label: "Explaining the project at the Personal Project Exhibition" }
    ],
    next: { title: "Next: CSR-x", lede: "Environmental epigenetics, summer 2026.", href: "Research-CSRx.dc.html", label: "Go to CSR-x" }
  },
  {
    file: "Research-CSRx.dc.html", section: "research", parent: { label: "Research & projects", href: "Research.dc.html" },
    eyebrow: "Research · Epigenetics", title: "CSR-x", lede: "Polycyclic aromatic hydrocarbons, epigenetic aging, and lung cancer risk.",
    desc: "CSR-x, a selective remote research program on PAH exposure, epigenetic aging, and DNA methylation.",
    intro: "PAHs, polycyclic aromatic hydrocarbons, are wherever something has been burned: exhaust, cigarette smoke, charred food. CSR-x is where I spent five weeks asking what chronic exposure to them does at the level of the genome, not just the lungs.",
    link: { href: "https://www.csr-x.org/", label: "See it on csr-x.org" },
    media: [
      {
        "title": "Five weeks, remote, student-led",
        "body": [
          "CSR-x, the Collaborative Summer Research eXperience, is selective and remote, with no professor running the room: a small cohort of students building the research together."
        ],
        "points": [
          [
            "Tracks",
            "AI and data science, biomedical and health sciences, environmental science, cognitive science, and economics. Mine was biomedical."
          ],
          [
            "When",
            "July to August 2026."
          ]
        ]
      },
      {
        "title": "The question",
        "body": [
          "PAHs, polycyclic aromatic hydrocarbons, are wherever something has been burned: exhaust, cigarette smoke, charred food. We asked how chronic exposure shows up in epigenetic aging and DNA methylation, and how much of that risk becomes lung cancer."
        ],
        "slots": [
          "csrx-3"
        ]
      },
      {
        "title": "The paper",
        "body": [
          "Our group's work became a 23-page review paper, \"Evaluating the Association Between Polycyclic Aromatic Hydrocarbon Exposure, Epigenetic Age Acceleration, and Lung Cancer Risk\", with seven student authors from seven schools in the Biomedical Health Sciences 2 track. The screenshot is its page on csr-x.org."
        ],
        "slots": [
          "csrx-4"
        ],
        "points": [
          [
            "The search",
            "53 potentially relevant records from PubMed, Google Scholar and ScienceDirect."
          ],
          [
            "The screen",
            "33 studies met inclusion criteria after PRISMA screening."
          ],
          [
            "The method",
            "Each study was assessed by one of five reviewers and entered into a standardised evidence matrix."
          ]
        ]
      },
      {
        "title": "What we found",
        "body": [
          "PAH exposure was consistently linked to altered DNA methylation, oxidative stress and higher lung cancer risk. The link to faster epigenetic aging was moderate to strong, particularly with second-generation clocks.",
          "The most interesting result is a gap. No single study tested the whole chain, exposure to epigenetic aging to lung cancer, in one population. The paper argues for prospective cohorts that measure all three together."
        ]
      },
      {
        "title": "My part",
        "body": [
          "I built a large table tracking the studies and did a close read of seven of them. The same instinct runs through SanaSanita and the Venezuela paper: a health outcome nobody disputes, traced back to a mechanism most people never see."
        ]
      }
    ],
    facts: [["Type", "Research program"], ["Program", "CSR-x, Collaborative Summer Research eXperience"], ["Focus", "PAH exposure · epigenetic aging · DNA methylation"], ["When", "Summer 2026"]],
    slots: [
      { key: "csrx-1", ratio: "16 / 9", label: "The research cohort, remote" },
      { key: "csrx-2", ratio: "4 / 3", label: "A figure from the analysis" },
      { key: "csrx-4", ratio: "1133 / 724", label: "The paper on csr-x.org" },
      { key: "csrx-3", ratio: "7 / 5", label: "CSR-x 2026 Program, certificate of completion" }
    ],
    next: { title: "Leadership & service", lede: "The work that is not assigned.", href: "Leadership.dc.html", label: "See leadership" }
  },

  /* -------------------------------------------------------- leadership ---- */
  {
    file: "Leadership-HOSA.dc.html", section: "leadership", parent: { label: "Leadership & service", href: "Leadership.dc.html" },
    eyebrow: "Leadership · Founder & President", title: "HOSA", lede: "Future Health Professionals. Perkiomen chapter.",
    desc: "Founded and leads Perkiomen's HOSA chapter, Future Health Professionals.",
    intro: "I founded Perkiomen's HOSA chapter because the school did not have one. HOSA, Future Health Professionals, is the national organisation for students heading into healthcare, and its absence meant anyone interested had nowhere to put that interest.",
    media: [
      {
        "title": "Starting it",
        "body": [
          "Founding it meant the usual unglamorous work: a charter, an advisor, a room, and enough people in that room to make it real. The chapter has run unofficially since February 2026, and I have been its president since September 2026."
        ]
      },
      {
        "title": "The clothing and food drive",
        "body": [
          "From October 13 to 23, HOSA and the Community Service Club ran a clothing and food drive, collecting donations at tables in the dining hall and student center during lunch.",
          "Donations were worth points: heavier items counted for more, and a raffle rewarded the students who gave. We raised over 1,000 points, the equivalent of more than 300 pieces of clothing and food for the community."
        ],
        "points": [
          [
            "1 point",
            "Socks or canned food."
          ],
          [
            "2 points",
            "A shirt or top, shorts, or a family-size food item."
          ],
          [
            "4 points",
            "Pants, or a large multi-box of food."
          ],
          [
            "5 to 7 points",
            "Sweaters and hoodies, light jackets, and heavy winter jackets."
          ]
        ],
        "slots": [
          "hosa-5"
        ]
      },
      {
        "title": "Where it goes",
        "body": [
          "What we collected goes to nonprofits in Pennsylvania. We are collaborating with organisations such as Cutloose Cares to donate what the school raised, and with local stores that support our school."
        ]
      },
      {
        "title": "Volleyball and bracelets",
        "body": [
          "The chapter also ran a volleyball tournament with La Casa Latina for Childhood Cancer Awareness Month, on a Friday night at the Hollenbach Athletic Center, raising money for Alex's Lemonade Stand Foundation. We sold cancer bracelets as well, and more tournaments are planned, to give back to the people the money is for."
        ],
        "slots": [
          "hosa-4"
        ]
      },
      {
        "title": "At the table",
        "body": [
          "HOSA's recruitment table in the dining hall: a posted sign, surgical tools in their sterile packs, and a model of the human torso to open up and explain. Teaching with a real model is the quickest way to get a student curious about medicine.",
          "The volleyball tournament, with a basket of cancer-awareness bracelets by the court, was held in the gym a few weeks later."
        ],
        "slots": [
          "hosa-6",
          "hosa-7"
        ]
      },
      {
        "title": "Around the chapter",
        "slots": [
          "hosa-1",
          "hosa-2",
          "hosa-3"
        ],
        "gallery": true
      }
    ],
    facts: [["Role", "Founder & President"], ["Since", "February 2026 (president from September 2026)"], ["Drive", "1,000+ points, about 300+ items"], ["Organisation", "HOSA"], ["School", "Perkiomen"]],
    slots: [
      { key: "hosa-1", ratio: "3 / 4", label: "Addressing the room at a school event" },
      { key: "hosa-2", ratio: "4 / 3", label: "With fellow students in the gym" },
      { key: "hosa-3", ratio: "4 / 3", label: "Between sessions at a HOSA conference" },
{ key: "hosa-6", ratio: "1125 / 1500", label: "Holding an anatomy model at the HOSA table" },
      { key: "hosa-7", ratio: "1125 / 1500", label: "The HOSA volleyball tournament, with the cancer-awareness bracelets" },
      { key: "hosa-5", ratio: "990 / 1320", label: "Poster for the HOSA and Community Service Club clothing and food drive" },
      { key: "hosa-4", ratio: "848 / 1090", label: "Poster for the Perk HOSA and La Casa Latina volleyball tournament for Childhood Cancer Awareness" }
    ],
    next: { title: "Next: Model UN", lede: "Delegate at Princeton and Eagle MUNC.", href: "Leadership-MUN.dc.html", label: "Go to Model UN" }
  },
  {
    file: "Leadership-MUN.dc.html", section: "leadership", parent: { label: "Leadership & service", href: "Leadership.dc.html" },
    eyebrow: "Leadership · Delegate", title: "Model UN", lede: "Representing a country that is not mine.",
    desc: "Model UN delegate at Perkiomen School. Verbal Commendation at the 2025 Princeton Model United Nations Conference, and Eagle MUNC.",
    intro: "Model UN at Perkiomen means being handed a country, a committee and a problem, and arguing the case as that country would, whatever you think yourself.",
    body: ["At the 2025 Princeton Model United Nations Conference I represented Nigeria in SPECPOL, the Special Political and Decolonization Committee, for Perkiomen School, and was given a Verbal Commendation by the secretaries-general. I also attended Eagle MUNC. GVMUN, where I directed the press corps, is the other side of the same activity."],
    awards: {
      title: "Recognition",
      lede: "",
      groups: [
        { title: "Princeton Model United Nations Conference 2025", items: [
          { label: "Verbal Commendation", detail: "Awarded for representing Nigeria in SPECPOL. Parsippany, New Jersey, November 20th to 23rd, 2025." }
        ]}
      ]
    },
    tbd: "Committee topics, how many conferences, and what you argued at Eagle MUNC. Send these and this page fills in.",
    facts: [["Role", "Delegate"], ["Princeton (PMUNC 2025)", "Nigeria, SPECPOL"], ["Recognition", "Verbal Commendation"], ["Also", "Eagle MUNC"]],
    slots: [
      { key: "mun-1", ratio: "5 / 6", label: "At Eagle MUNC" },
      { key: "mun-2", ratio: "4 / 3", label: "Verbal Commendation, PMUNC 2025" }
    ],
    next: { title: "Next: GVMUN", lede: "Directing the press corps.", href: "Leadership-GVMUN.dc.html", label: "Go to GVMUN" }
  },
  {
    file: "Leadership-GVMUN.dc.html", section: "leadership", parent: { label: "Leadership & service", href: "Leadership.dc.html" },
    eyebrow: "Leadership · Director of Journalism", title: "GVMUN", lede: "Global Virtual Model United Nations. Six articles on world issues, published to its newsletter.",
    desc: "Director of Journalism at GVMUN, running the press corps for the conference.",
    intro: "Director of Journalism for the Global Virtual Model United Nations. Most delegates argue a country's position; the press corps has to describe every position fairly and fast enough to publish while the committee is still sitting.",
    media: [
      {
        "title": "The newsroom",
        "body": [
          "Model UN taught me to defend a case that is not my own. Running the newsroom taught me the harder version: describing every case in the room accurately, including the ones I disagreed with.",
          "From March to August 2026 I worked as GVMUN's journalism intern, which meant writing for deadlines, writing for readers who were not in the room, and keeping up with what was actually happening in the world. Since September 2026 I have been the Journalism Director, managing the newsroom's articles."
        ]
      },
      {
        "title": "Published to the organization's newsletter",
        "body": [
          "Each article was published to the organization's newsletter. Each takes one live world issue, explains what is happening, who is affected and what could come next, and cites its sources at the end."
        ],
        "points": [
          [
            "Global health",
            "AI in clinical trials, and who gets access to new medicines."
          ],
          [
            "Climate",
            "Record ocean heat and the Super El Niño, and Europe's wildfire summer."
          ],
          [
            "Conflict",
            "The humanitarian crisis across Iran, Lebanon and Gaza."
          ],
          [
            "Economy",
            "How an energy shock turns into inflation."
          ],
          [
            "Diplomacy",
            "A state visit and the tension behind it."
          ]
        ]
      },
      {
        "title": "The one closest to my own work",
        "body": [
          "The article on AI-based clinical trials is the one I keep coming back to. It asks whether a faster, cheaper way to test drugs reaches the regions that need it most, or only the ones that already have the infrastructure. That is the same question behind SanaSanita and my time in a public hospital in Veracruz."
        ]
      },
      {
        "title": "What it gave me",
        "body": [
          "Publishing under a deadline taught me to write clearly and manage my time. Covering current events week after week gave me a far better grasp of international relations, and a habit I now use in research: say what the evidence supports, and no more."
        ]
      }
    ],
    readers: [
      {
        "kicker": "The articles",
        "heading": "Read all six, top to bottom",
        "intro": "Pick an article on the left and scroll. Each opens as the original pages, and you can open the PDF in a new tab.",
        "items": [
          {
            "kicker": "Global health",
            "title": "Advancements in AI-based clinical trial designs are unveiled at the 2026 Clinical Trial Accelerator Initiative to speed up drug delivery to resource-limited regions",
            "pages": 4,
            "blurb": "PAHO's AI-based Clinical Trial Accelerator, launched in April 2026. What AI could do for trial timelines and costs in lower-resource regions, and the governance and ethics worries that come with it.",
            "pdf": "/assets/docs/ctai.pdf",
            "dir": "/assets/docs/ctai"
          },
          {
            "kicker": "Climate",
            "title": "Record-breaking ocean temperatures are reported for June, highlighting the continuing effects of climate change and El Niño",
            "pages": 5,
            "blurb": "The 2026 \"Super El Niño\": how warm water off Peru changes weather worldwide, and why analysts warn of food-price shocks lasting into 2028.",
            "pdf": "/assets/docs/el-nino.pdf",
            "dir": "/assets/docs/el-nino"
          },
          {
            "kicker": "Conflict and displacement",
            "title": "Humanitarian crisis worsens across Iran, Lebanon, and Gaza as civilian casualties and displacement rise",
            "pages": 8,
            "blurb": "Millions displaced across the region, shelters overcrowded, and water and electricity running short, and what that means for the countries receiving refugees.",
            "pdf": "/assets/docs/middle-east.pdf",
            "dir": "/assets/docs/middle-east"
          },
          {
            "kicker": "Economy",
            "title": "Global inflation risks rise as sustained energy disruption feeds through to transportation and production costs",
            "pages": 4,
            "blurb": "How disruption around the Strait of Hormuz, which carries about a fifth of the world's oil, pushes up transport and production costs everywhere.",
            "pdf": "/assets/docs/inflation.pdf",
            "dir": "/assets/docs/inflation"
          },
          {
            "kicker": "Diplomacy",
            "title": "King Charles III begins a four-day state visit to the United States, meeting President Trump and addressing Congress amid renewed focus on UK–US relations",
            "pages": 4,
            "blurb": "The April 27 to 30, 2026 visit, the monarch's first in nearly two decades, during the 250th year of the United States, and the tensions behind the ceremony.",
            "pdf": "/assets/docs/king-charles.pdf",
            "dir": "/assets/docs/king-charles"
          },
          {
            "kicker": "Climate and economy",
            "title": "Europe faces another wave of extreme heat and wildfires as the European Union calls for greater investment in fire prevention, with the economic damage from this summer's fires already reaching billions of euros",
            "pages": 5,
            "blurb": "The 2026 summer fires across Spain, France, Greece, Belgium, Portugal, Croatia and Germany, and the EU's push for investment in prevention.",
            "pdf": "/assets/docs/wildfires.pdf",
            "dir": "/assets/docs/wildfires"
          }
        ]
      }
    ],
    facts: [["Role", "Director of Journalism"], ["Conference", "GVMUN"], ["Term", "Intern March – August 2026, Director since September 2026"], ["Also", "Model UN delegate"]],
    slots: [
      { key: "gvmun-1", ratio: "4 / 3", label: "GVMUN committee room" },
      { key: "gvmun-2", ratio: "4 / 3", label: "The press corps" }
    ],
    next: { title: "Next: Student Council / Senate", lede: "Representing the room you are sitting in.", href: "Leadership-StudentCouncil.dc.html", label: "Go to student government" }
  },
  {
    file: "Leadership-StudentCouncil.dc.html", section: "leadership", parent: { label: "Leadership & service", href: "Leadership.dc.html" },
    eyebrow: "Leadership · Student government", title: "Student Council / Senate", lede: "Elected to represent classmates at ISPS, and at Perkiomen.",
    desc: "Student Council at the International School of Port of Spain, and student government at Perkiomen School.",
    intro: "Student government is the least glamorous kind of leadership and the one that taught me the most. Nobody is impressed by it, the wins are small and procedural, and the job is almost entirely listening to people complain and then working out which complaints are actually solvable.",
    media: [
      {
        "title": "At ISPS",
        "body": [
          "I was Middle School Student Council Secretary, and in tenth grade I was my homeroom's representative. The council was the room where it became obvious, by November of that first term back, that people needed help returning to in-person school, not just better assemblies. That is where Stronger Together came from."
        ],
        "points": [
          [
            "Middle School Student Council",
            "Secretary."
          ],
          [
            "Homeroom representative",
            "Tenth grade."
          ],
          [
            "Stronger Together",
            "A student-led community service club that grew out of the council."
          ]
        ]
      },
      {
        "title": "At Perkiomen",
        "body": [
          "At Perkiomen I am President of the Class of 2027 and sit on Student Senate, and I am a dorm proctor. Different school, same job: listen, then work out which problems are actually solvable."
        ],
        "points": [
          [
            "Class of '27 President",
            "Student Senate."
          ],
          [
            "Dorm proctor",
            "Looking after the dorm."
          ],
          [
            "Alongside it",
            "HOSA, Model UN, the Perkiomenite and the Investment & Philanthropy Club, where I am secretary."
          ]
        ]
      },
      {
        "title": "The throughline",
        "body": [
          "Founding HOSA and directing the GVMUN newsroom are the same instinct, scaled up: notice the gap, then take responsibility for filling it rather than waiting for someone else to."
        ]
      }
    ],
    facts: [["Roles", "ISPS Student Council Secretary · Class of '27 President"], ["Schools", "ISPS · Perkiomen"], ["Started", "2021"]],
    slots: [
      { key: "stuco-1", ratio: "4 / 3", label: "Student Council at ISPS" },
      { key: "stuco-2", ratio: "4 / 3", label: "Senate at Perkiomen" },
      { key: "stuco-3", ratio: "1 / 1", label: "A council event" }
    ],
    next: { title: "Next: Hospital Shadowing", lede: "Time on the floor.", href: "Leadership-Shadowing.dc.html", label: "Go to shadowing" }
  },
  {
    file: "Leadership-Shadowing.dc.html", section: "leadership", parent: { label: "Leadership & service", href: "Leadership.dc.html" },
    eyebrow: "Leadership · Clinical", title: "Hospital Shadowing", lede: "Watching how care actually gets delivered.",
    desc: "Hospital shadowing. Observing clinical care first-hand.",
    intro: "Shadowing is the part of a medical interest that cannot be read about. You can learn the science from a textbook; you cannot learn what a doctor does in the ninety seconds after delivering bad news.",
    body: [
      "Sixty-plus hours of it, across eleven days, came at the Torre Pediátrica of the Hospital de Alta Especialidad de Veracruz (HAEV), a public hospital under Mexico's IMSS-Bienestar system, in the summer of 2026. I split the time between pediatric surgery consultations and operating rooms, an allergy and immunology consultory, and morning rounds with the surgical team."
    ],
    facts: [["Type", "Clinical observation"], ["Where", "Torre Pediátrica, HAEV, Veracruz"], ["Hours", "60+, over eleven days"], ["System", "IMSS-Bienestar, public"]],
    media: [
      {
        slots: ["sana-field-surgery"],
        title: "Nine days in the operating room",
        body: [
          "That monitor is a laparoscope's view mid-procedure, one of a run that over nine days included an appendectomy on a four-year-old, a laparoscopic gallbladder removal on a six-year-old, a circumcision on a nine-year-old who had lived with untreated pain for years because no one had told his family it could be fixed, and the staged reduction of a newborn's omphalocele, improvised with colloid dressings and elastic bands because the equipment the procedure usually calls for was not in the building."
        ]
      },
      {
        slots: ["sana-field-rounds"],
        title: "Morning rounds",
        body: [
          "Every morning began the same way, before anyone touched a patient: a physician presenting the overnight admissions and the day's planned cases to the residents and students on the team. The habit stuck with me. A diagnosis that lives only in one person's head is not much safer than one that was never made."
        ]
      },
      {
        slots: ["sana-field-teaching"],
        title: "The case that stayed with me",
        body: [
          "Reading an ultrasound alongside the team, for a young girl with facial asymmetry and distinctive skin findings, her presentation cross-referenced against her mother's nearly identical features, pointing to a genetic condition with fewer than 300 confirmed cases worldwide, undiagnosed in the family for a lifetime."
        ]
      },
      {
        slots: ["hosp-or"],
        title: "In the room",
        body: [
          "Most of the eleven days were spent a step behind the surgical team, watching, handing over what was asked for and keeping out of the way."
        ]
      },
      {
        slots: ["hosp-mri", "hosp-ultrasound"],
        title: "Reading the images",
        body: [
          "Imaging was part of almost every case: an MRI cholangiogram of the biliary tree on the radiology workstation, an ultrasound talked through slowly on the classroom screen. Learning to find the structure that matters in a grey, grainy picture is a skill the textbooks only hint at."
        ]
      },
      {
        slots: ["hosp-talk"],
        title: "Teaching sessions",
        body: [
          "Attending physicians gave short lectures to the residents and students between cases. One of them took apart the textbook picture of appendicitis: in the published series he showed, about half of children do not present with the classic signs, which is exactly why it gets missed."
        ]
      },
      {
        slots: ["hosp-mural", "hosp-facade"],
        title: "The hospital itself",
        body: [
          "The Hospital Regional de Veracruz mural, painted in 2004, shows a physician holding a family in open hands. The building outside carries the city's coat of arms. Neither is incidental. This is the hospital the community has leaned on since 1952."
        ]
      },
      {
        slots: ["shadow-2"],
        title: "Showing up",
        body: [
          "It is also where the language question stops being theoretical. Some families arrive from mountain communities where neighboring villages speak mutually unintelligible languages, and the hospital has no interpreters on staff. Being the person who can explain something in Spanish there is not a résumé line. It is the difference between a family understanding what is happening and not."
        ]
      }
    ],
    slots: [
      { key: "shadow-1", ratio: "4 / 3", label: "In the operating room at HAEV" },
      { key: "sana-field-surgery", ratio: "3 / 2", label: "Laparoscopic view, mid-procedure" },
      { key: "sana-field-rounds", ratio: "3 / 4", label: "Morning case presentation" },
      { key: "sana-field-teaching", ratio: "3 / 4", label: "Reading an ultrasound with the team" },
      { key: "shadow-2", ratio: "3 / 4", label: "Between cases, summer 2026" },
      { key: "hosp-or", ratio: "3 / 4", label: "Watching a procedure from the operating table" },
      { key: "hosp-mirror", ratio: "3 / 4", label: "Between cases, scrubs and mask" },
      { key: "hosp-mri", ratio: "3 / 2", label: "MRI cholangiogram on the radiology workstation" },
      { key: "hosp-ultrasound", ratio: "4 / 3", label: "Walking through an ultrasound with the residents" },
      { key: "hosp-talk", ratio: "4 / 3", label: "A teaching session on appendicitis presentation" },
      { key: "hosp-patient", ratio: "3 / 4", label: "A young patient and her surgeon" },
      { key: "hosp-mural", ratio: "3 / 4", label: "The Hospital Regional de Veracruz mural" },
      { key: "hosp-facade", ratio: "3 / 4", label: "The hospital facade" }
    ],
    next: { title: "Next: Volunteering", lede: "Community work, in and out of school.", href: "Leadership-Volunteering.dc.html", label: "Go to volunteering" }
  },
  {
    file: "Leadership-Volunteering.dc.html", section: "leadership", parent: { label: "Leadership & service", href: "Leadership.dc.html" },
    eyebrow: "Leadership · Service", title: "Volunteering", lede: "Community work, in and out of school.",
    desc: "Volunteering and community service work.",
    intro: "The service work that sits outside any club structure. The hours that do not come with a title attached.",
    media: [
      {
        "title": "Be a Friend Project",
        "body": [
          "Since September 2026 I have been an ambassador for the Be a Friend Project, engaging our school community to write kind, vibrant letters to people who are bullied."
        ]
      },
      {
        "title": "Giving back with HOSA",
        "body": [
          "Through HOSA and the Community Service Club I helped run a clothing and food drive, more than 1,000 points of donations for local nonprofits, and a volleyball tournament with a bracelet sale for cancer awareness. The details are on the HOSA page."
        ]
      },
      {
        "title": "Out in the community",
        "body": [
          "The rest is the work that does not come with a title: a river clean-up, a water station at a race, and bingo with residents at a care home."
        ],
        "slots": [
          "vol-1",
          "vol-2",
          "vol-3"
        ],
        "gallery": true
      }
    ],
    facts: [["Type", "Community service"], ["Ambassador", "Be a Friend Project, since September 2026"], ["Also", "HOSA food and clothing drive"]],
    slots: [
      { key: "vol-1", ratio: "1 / 1", label: "Pulling a tire out of the river on a clean-up day" },
      { key: "vol-2", ratio: "9 / 16", label: "Running a water station at a race" },
      { key: "vol-3", ratio: "3 / 4", label: "Bingo with residents at a care home" }
    ],
    next: { title: "Next: The Perkiomenite", lede: "Writing and editing the school paper.", href: "Leadership-Perkiomenite.dc.html", label: "Go to the Perkiomenite" }
  },
  {
    file: "Leadership-Perkiomenite.dc.html", section: "leadership", parent: { label: "Leadership & service", href: "Leadership.dc.html" },
    eyebrow: "Leadership · Co-Editor", title: "The Perkiomenite", lede: "Perkiomen's school paper.",
    desc: "Co-Editor of the Perkiomenite, Perkiomen School's newspaper.",
    intro: "Co-Editor of the Perkiomenite. Editing is a different skill from writing: most of the job is asking someone else's draft what it is actually trying to say, and then helping it say that.",
    body: ["It pairs with GVMUN more than it looks like it should. Both are about describing something accurately under a deadline, for readers who were not in the room."],
    tbd: "Pieces you have written, what you cover, and the section you edit. Send these and this page can link to the work itself.",
    facts: [["Role", "Co-Editor"], ["Paper", "The Perkiomenite"], ["School", "Perkiomen"]],
    slots: [
      { key: "perkmt-1", ratio: "4 / 3", label: "The Perkiomenite" },
      { key: "perkmt-2", ratio: "4 / 3", label: "In the newsroom" }
    ],
    next: { title: "Activities", lede: "Drums, water, weight, road.", href: "Activities.dc.html", label: "See the activities" }
  },

  /* ------------------------------------------------------------ drums ---- */
  {
    file: "Drums.dc.html", section: "drums", kind: "landing",
    eyebrow: "Drums", title: "Five rooms, one kit",
    lede: "From pandemic lessons in Panama to the Perkiomen rock band.",
    desc: "Drumming from SonoArte in Panama and Trinidad to AP Vybz, the ISPS musicals, the MYP Arts Portfolio and the Perkiomen rock band.",
    intro: "Every school I joined had a room with a kit in it. That is how I met people. Drumming is the reason arriving somewhere new has never meant arriving alone, and it is the thread I would follow if you asked me to tell my story through one thing. These are its five stages.",
    cards: [
      { eyebrow: "Panama · Trinidad", title: "SonoArte", href: "Drums-SonoArte.dc.html", body: "Where it started, in pandemic Panama, and kept going online from Trinidad." },
      { eyebrow: "ISPS", title: "AP Vybz", href: "Drums-APVybz.dc.html", body: "Vice-president and drummer of the school's music organization." },
      { eyebrow: "ISPS", title: "School Musicals", href: "Drums-Musicals.dc.html", body: "Mamma Mia!, and what a drummer does when the score is the boss." },
      { eyebrow: "Grade 10", title: "MYP Arts Portfolio", href: "Drums-MYPPortfolio.dc.html", body: "The IB arts portfolio that closed out the Middle Years Programme." },
      { eyebrow: "Perkiomen", title: "Rock band", href: "Drums-Rockband.dc.html", body: "The newest room." }
    ],
    facts: [["Instrument", "Drum kit"], ["Stages", "Five"], ["Countries", "Panama · Trinidad · United States"]],
    slots: [{ key: "drums-hero", ratio: "16 / 9", label: "Behind the kit" }],
    next: { title: "The rest of what I do", lede: "Water, weight and road.", href: "Activities.dc.html", label: "See the activities" }
  },
  {
    file: "Drums-SonoArte.dc.html", section: "drums", parent: { label: "Drums", href: "Drums.dc.html" },
    eyebrow: "Drums · Stage one", title: "SonoArte", lede: "Where it started, in pandemic Panama, and kept going from Trinidad.",
    desc: "SonoArte, the music school in Panama where I started drumming, and the online lessons that carried on from Trinidad.",
    intro: "SonoArte is a music school in Panama, and it is where I started playing drums. I began in Panama, in the middle of the pandemic, and when we moved to Trinidad in 2021 I kept taking lessons with SonoArte online.",
    media: [
      {
        "title": "Starting in Panama",
        "body": [
          "I arrived in Panama in July 2019, at age ten. Drums began at SonoArte, and then the pandemic arrived and the world went online. Lessons did too."
        ]
      },
      {
        "title": "Then Trinidad",
        "body": [
          "When we moved to Port of Spain in August 2021 the lessons did not stop. I kept taking SonoArte online from Trinidad, which meant the kit stayed part of the week through a move that changed everything else about it."
        ],
        "points": [
          [
            "Panama",
            "Where it started, in person and then online."
          ],
          [
            "Trinidad",
            "Lessons online, from a different country."
          ]
        ]
      },
      {
        "title": "Why it stuck",
        "body": [
          "It became the thing I do to think. A new country takes a while to feel like yours, but a rhythm that you practised in the last one is still yours on the first day."
        ]
      }
    ],
    facts: [["School", "SonoArte, Panama"], ["Started", "Panama, during the pandemic"], ["Kept going", "Online from Trinidad"]],
    slots: [

    ],
    next: {"title": "Next: AP Vybz", "lede": "The school band at ISPS.", "href": "Drums-APVybz.dc.html", "label": "Go to AP Vybz"}
  },
  {
    file: "Drums-APVybz.dc.html", section: "drums", parent: { label: "Drums", href: "Drums.dc.html" },
    eyebrow: "Drums · Stage two", title: "AP Vybz", lede: "The ISPS music organization, where I was vice-president and drummer.",
    desc: "AP Vybz, the music organization at the International School of Port of Spain. Vice-president and drummer.",
    intro: "AP Vybz is ISPS's student music organization. It exists to give students, and staff, a chance to explore genres and instruments they are curious about, and to push members out of their comfort zone so they grow as people and as artists.",
    media: [
      {
        "title": "The club",
        "body": [
          "The idea is to try genres and instruments you would not otherwise touch, and to do it alongside other people."
        ]
      },
      {
        "title": "The year the club changed direction",
        "body": [
          "I was the vice-president and a drummer. When the previous president stepped down, a new executive team took over, and the club leaned heavily into performing. Between January and April we played as an ensemble three times, far more than in earlier years, when the band played only a few times a year."
        ],
        "points": [
          [
            "Valentine's Day event",
            "The first of the year's performances."
          ],
          [
            "St. Patrick's Day event",
            "The second."
          ],
          [
            "The Talent Show",
            "The third."
          ]
        ]
      },
      {
        "title": "What came next",
        "body": [
          "The plan was more performances, each with better quality, and auditions, so that the people on stage were talented and passionate about being there."
        ],
        "slots": [
          "isps-10"
        ]
      }
    ],
    facts: [["Role", "Vice-president and drummer"], ["School", "ISPS"], ["Performances", "Three, January to April"]],
    slots: [
      { key: "isps-9", ratio: "382 / 270", label: "AP Vybz, the school music organization" },
      { key: "isps-10", ratio: "772 / 447", label: "AP Vybz members performing and rehearsing" }
    ],
    next: {"title": "Next: ISPS School Musicals", "lede": "Mamma Mia!", "href": "Drums-Musicals.dc.html", "label": "Go to the musicals"}
  },
  {
    file: "Drums-Musicals.dc.html", section: "drums", parent: { label: "Drums", href: "Drums.dc.html" },
    eyebrow: "Drums · Stage three", title: "ISPS School Musicals", lede: "Mamma Mia!, and what a drummer does when the score is the boss.",
    desc: "Drumming through the Mamma Mia! unit that closed Music II at the International School of Port of Spain.",
    intro: "Music II at ISPS ended with a musical. Mine was Mamma Mia!, and I drummed through it.",
    media: [
      {
        "title": "Mamma Mia!",
        "body": [
          "Music II is the grade 10 music course, and the unit that closed it out was Mamma Mia!. I played drums for it."
        ]
      },
      {
        "title": "A different job",
        "body": [
          "In a band the drummer sets the groove. In a musical the groove belongs to the score, the singers and the people on stage, and the drummer's job is to keep time for all of them. It is a quieter kind of leading, and a good one to learn."
        ]
      },
      {
        "title": "The result",
        "body": [
          "Music II is also where an Academic Excellence award came from, in grade 10 at ISPS."
        ]
      }
    ],
    facts: [["Course", "Music II, grade 10"], ["Production", "Mamma Mia!"], ["School", "ISPS"]],
    slots: [

    ],
    next: {"title": "Next: MYP Arts Portfolio", "lede": "Grade 10.", "href": "Drums-MYPPortfolio.dc.html", "label": "Go to the portfolio"}
  },
  {
    file: "Drums-MYPPortfolio.dc.html", section: "drums", parent: { label: "Drums", href: "Drums.dc.html" },
    eyebrow: "Drums · Stage four", title: "MYP Arts Portfolio", lede: "Grade 10, and the portfolio that closed out the Middle Years Programme.",
    desc: "The MYP Arts Portfolio, the grade 10 arts project that sits at the end of the IB Middle Years Programme.",
    intro: "The MYP Arts Portfolio is the arts project in the last year of the IB Middle Years Programme. Mine is the grade 10 stage of my drumming.",
    media: [
      {
        "title": "What the portfolio is",
        "body": [
          "In MYP Arts, students keep a portfolio of their creative work and how it developed. It is assessed on four criteria: knowing and understanding the art form, developing skills, thinking creatively, and responding to the work."
        ]
      },
      {
        "title": "Where it sits in the story",
        "body": [
          "Grade 10 is also the year of my Personal Project, my MYP Bilingual Diploma and Music II. The portfolio is where drumming became something I had to explain and defend, not only play."
        ],
        "points": [
          [
            "Year",
            "Grade 10, ISPS"
          ],
          [
            "Programme",
            "IB Middle Years Programme"
          ],
          [
            "Alongside",
            "The Personal Project, and Music II"
          ]
        ]
      }
    ],
    facts: [["Year", "Grade 10"], ["Programme", "IB MYP"], ["School", "ISPS"]],
    slots: [

    ],
    next: {"title": "Next: Rock band at Perkiomen", "lede": "The newest room.", "href": "Drums-Rockband.dc.html", "label": "Go to the rock band"}
  },
  {
    file: "Drums-Rockband.dc.html", section: "drums", parent: { label: "Drums", href: "Drums.dc.html" },
    eyebrow: "Drums · Stage five", title: "Rock band at Perkiomen", lede: "The newest room.",
    desc: "Drumming in the Perkiomen rock band, the most recent stage.",
    intro: "At Perkiomen I play drums in the school rock band. It is the most recent of the five rooms.",
    media: [
      {
        "title": "The band",
        "body": [
          "The band rehearses on the school's own stage, under the 1875 Perkiomen seal. Set-up, sound check, then the songs, over and over until they hold."
        ],
        "slots": [
          "music-5",
          "music-2"
        ]
      },
      {
        "title": "At the kit",
        "body": [
          "The kit is also where I think. I also practise on an electronic kit."
        ],
        "slots": [
          "music-4",
          "music-1"
        ]
      },
      {
        "title": "The thread",
        "body": [
          "From SonoArte to a rock band is five rooms in three countries. Every school I joined had a room with a kit in it, and the kit is how I met people."
        ]
      }
    ],
    facts: [["Band", "Perkiomen rock band"], ["Role", "Drummer"], ["School", "Perkiomen"]],
    slots: [
      { key: "music-1", ratio: "1170 / 1556", label: "Behind the kit with the Perkiomen rock band" },
      { key: "music-2", ratio: "1600 / 1200", label: "The band before the set" },
      { key: "music-4", ratio: "960 / 1280", label: "Practising on an electronic kit at home" },
      { key: "music-5", ratio: "1400 / 933", label: "Rehearsal on the Perkiomen stage" }
    ],
    next: {"title": "The rest of what I do", "lede": "Water, weight and road.", "href": "Activities.dc.html", "label": "See the activities"}
  },

  /* -------------------------------------------------------- activities ---- */
  {
    file: "Activities-Swimming.dc.html", section: "activities", parent: { label: "Activities", href: "Activities.dc.html" },
    eyebrow: "Activities · Varsity", title: "Swimming", lede: "Perkiomen School varsity, and a Most Improved award.",
    desc: "Varsity swimming at Perkiomen School, including a Most Improved award.",
    intro: "Varsity swimming at Perkiomen. Morning sets, meets, and the part of the day that keeps the rest of it in order.",
    body: ["The award I am proudest of is Most Improved, Varsity Boys Swimming (2026), which is a strange thing to say out loud. It means I started behind. But it is the only award that measures the slope rather than the intercept, and the slope is the part I actually control."],
    facts: [["Level", "Varsity"], ["School", "Perkiomen"], ["Award", "Most Improved, Varsity Boys (2026)"]],
    slots: [
      { key: "swim-1", ratio: "4 / 3", label: "Swim meet" },
      { key: "swim-2", ratio: "3 / 4", label: "On the starting block" },
      { key: "swim-3", ratio: "1 / 1", label: "The team" }
    ],
    next: { title: "Next: Weightlifting", lede: "Snatch, clean & jerk, year-round.", href: "Activities-Weightlifting.dc.html", label: "Go to weightlifting" }
  },
  {
    file: "Activities-Weightlifting.dc.html", section: "activities", parent: { label: "Activities", href: "Activities.dc.html" },
    eyebrow: "Activities · Olympic lifting", title: "Weightlifting", lede: "Snatch and clean & jerk, programmed year-round.",
    desc: "Olympic weightlifting. Snatch and clean & jerk, trained year-round.",
    intro: "I started lifting because I wanted to be stronger. It turned into the clearest lesson I have in patience: nothing here can be rushed, and the programme only works if you run it for months.",
    media: [
      {
        "title": "Technique before weight",
        "body": [
          "Olympic lifting is unforgiving about technique. You cannot muscle a bad snatch. The lift simply fails, in front of everyone, which is a useful thing to get comfortable with."
        ],
        "slots": [
          "lift-1"
        ]
      },
      {
        "title": "The numbers",
        "body": [
          "I started training in August 2024."
        ],
        "points": [
          [
            "Bench press",
            "265 lb"
          ],
          [
            "Squat",
            "335 lb"
          ],
          [
            "Deadlift",
            "455 lb"
          ]
        ]
      },
      {
        "title": "Tracked in Liftoff",
        "body": [
          "I log every session in Liftoff, a lifting app with around four million active users. The leaderboard screenshots were taken on October 28, 2026: #186 (Top 0.1%) on one board and #48 on another. The calendar is the app's memory view of August 2024, the first month."
        ],
        "slots": [
          "lift-3",
          "lift-4"
        ]
      },
      {
        "title": "Progress",
        "body": [
          "Three photos from different years: a hiking trail, a 15K in Trinidad, and a curl in the gym. The lifting is part of a longer pattern of training for things that take months."
        ],
        "slots": [
          "lift-5"
        ]
      },
      {
        "title": "In the gym",
        "slots": [
          "lift-2"
        ],
        "gallery": true
      }
    ],
    facts: [["Discipline", "Olympic weightlifting"], ["Lifts", "Snatch · clean & jerk"], ["Training", "Year-round, since August 2024"], ["Bench press", "265 lb"], ["Squat", "335 lb"], ["Deadlift", "455 lb"], ["Liftoff ranking", "#186 global (Top 0.1%), Oct 28, 2026"]],
    slots: [
{ key: "lift-5", ratio: "1300 / 1097", label: "Progress, from the hiking trail to the 15K to the gym" },
      { key: "lift-1", ratio: "3 / 4", label: "Back squats" },
      { key: "lift-2", ratio: "3 / 4", label: "Between sets in the gym" },
      { key: "lift-3", ratio: "1170 / 391", label: "Liftoff global leaderboards, screenshots taken October 28, 2026" },
      { key: "lift-4", ratio: "1170 / 1516", label: "Liftoff memories, August 2024, the first month of training" }
    ],
    next: { title: "Next: Running", lede: "The RBC Race for the Kids, three years running.", href: "Activities-Running.dc.html", label: "Go to running" }
  },
  {
    file: "Activities-Running.dc.html", section: "activities", parent: { label: "Activities", href: "Activities.dc.html" },
    eyebrow: "Activities · Road racing", title: "Running", lede: "The RBC Race for the Kids 15K, three years running, and years of 5Ks across Trinidad.",
    desc: "Road racing in Trinidad. The RBC Race for the Kids 15K three years running, G2G and Scotiabank 5Ks, and running to actually see a place.",
    intro: "Running started as training for other sports and became its own thing. I like it for a reason that has nothing to do with racing: it is the cheapest way I know to actually see a place, on foot, at the pace a place is meant to be seen at.",
    media: [
      {
        "title": "The RBC Race for the Kids",
        "body": [
          "Trinidad and Tobago's biggest charity run: a 15K that starts at 5:45 in the morning and funds the RBC Caribbean Children's Cancer Fund, which has treated more than 280 children under sixteen since it began.",
          "I ran the 15K three years running, the only member of Peak Performers, my school's running club, to run the 15K rather than the 5K in any of those years."
        ],
        "slots": [
          "run-1",
          "run-3"
        ]
      },
      {
        "title": "Everything else was 5Ks",
        "body": [
          "Whichever one was on that month."
        ],
        "points": [
          [
            "G2G's Grind to Give",
            "Raises money with the Mary Care Centre to rebuild a home for young women and their babies."
          ],
          [
            "Scotiabank Women Against Breast Cancer",
            "A 5K."
          ]
        ]
      },
      {
        "title": "Tracking it on Strava",
        "body": [
          "I log runs on Strava. Two of them show how the running has gone, one at each school."
        ],
        "points": [
          [
            "ISPS track, March 2025",
            "A night run of 2.77 km at 4:31 per km in 12 minutes 34 seconds. My third fastest mile, with personal records on the ISPS track lap, clockwise and counter."
          ],
          [
            "Perkiomen, East Greenville",
            "5.17 km in 24 minutes 4 seconds, 4:39 per km. My second fastest 5K, 1 minute 8 seconds faster than the one before it."
          ]
        ],
        "slots": [
          "run-4",
          "run-5"
        ]
      },
      {
        "title": "Why I still run",
        "body": [
          "It is training, the plainest way there is to teach a body to keep going past where it wants to stop. And it is still the cheapest way to actually see a place, long after the people who flew in for a week have gone home."
        ]
      }
    ],
    facts: [["Signature race", "RBC Race for the Kids, 15K, 3 years running"], ["Also", "G2G 5Ks · Scotiabank 5K"], ["Cause", "RBC Caribbean Children's Cancer Fund"], ["Club", "Peak Performers"], ["Strava", "5.17 km in 24:04 at Perkiomen"]],
    slots: [
      { key: "run-hero", ratio: "4 / 5", label: "Finishing a long one in Trinidad, worn out and happy" },
      { key: "run-1", ratio: "3 / 2", label: "RBC Race for the Kids, 15K bibs" },
      { key: "run-3", ratio: "3 / 4", label: "Mid-race, 15K, bib 437" },
      { key: "run-4", ratio: "1000 / 1272", label: "Strava, a night run on the ISPS track" },
      { key: "run-5", ratio: "1100 / 1180", label: "Strava, a 5K around East Greenville" },
      { key: "run-2", ratio: "4 / 3", label: "A 5K somewhere in Trinidad" }
    ],
    next: { title: "Curiosities", lede: "The things that are not on a form.", href: "Curiosities.dc.html", label: "See the curiosities" }
  },

  /* ------------------------------------------------------- curiosities ---- */
  {
    file: "Curiosities-Literature.dc.html", section: "curiosities", parent: { label: "Curiosities", href: "Curiosities.dc.html" },
    eyebrow: "Curiosities · Reading", title: "Literature", lede: "Long series, read in order, usually late.",
    desc: "Reading. Manga, long series, and whatever is currently open.",
    intro: "Mostly manga, mostly long series, mostly read in order and mostly late at night. Long-form serialised storytelling is its own discipline: keeping a thread coherent across hundreds of chapters is a harder problem than most single novels attempt.",
    body: ["Reading in three languages also means noticing how differently the same idea lands depending on which one it arrives in, which is roughly the same skill six countries taught me."],
    tbd: "What you are reading right now, and the series that mattered most. Send these and this page gets a proper shelf.",
    facts: [["Mostly", "Manga · long series"], ["Languages", "Spanish · English · French"], ["Currently reading", TBD]],
    slots: [
      { key: "lit-1", ratio: "4 / 3", label: "The shelf" },
      { key: "lit-2", ratio: "1 / 1", label: "Currently reading" }
    ],
    next: { title: "Next: Music", lede: "What I listen to, as opposed to what I play.", href: "Curiosities-Music.dc.html", label: "Go to music" }
  },
  {
    file: "Curiosities-Music.dc.html", section: "curiosities", parent: { label: "Curiosities", href: "Curiosities.dc.html" },
    eyebrow: "Curiosities · Listening", title: "Music", lede: "What I listen to, as opposed to what I play.",
    desc: "Listening. The music six countries left behind, separate from the drumming.",
    intro: "This is the listening half. The playing half lives under Activities: SonoArte, Mamma Mia! at ISPS, the Perkiomen rock band. This page is about what is actually in my ears the rest of the time.",
    body: ["Moving every few years does something specific to a music taste: you end up with a library that is a map. Reggaeton and banda from Monterrey, vallenato from Bogotá, soca and calypso from Port of Spain, and whatever the rock band was covering that term.", "It is the least deliberate thing on this site. Nothing here was chosen to be interesting. It is just what stuck from each place."],
    tbd: "Your current rotation, the artists that matter most, and a Spotify link if you want one embedded. Send these and this page gets a real shelf.",
    facts: [["From", "Mexico · Colombia · Trinidad · US"], ["Also plays", "Drums, see Activities"], ["On repeat", TBD]],
    slots: [
      { key: "music-listen-1", ratio: "4 / 3", label: "Listening" },
      { key: "music-listen-2", ratio: "1 / 1", label: "Records, headphones, a playlist" }
    ],
    next: { title: "Next: Video games", lede: "Co-op, strategy, and whatever the group is playing.", href: "Curiosities-Videogames.dc.html", label: "Go to video games" }
  },
  {
    file: "Curiosities-Videogames.dc.html", section: "curiosities", parent: { label: "Curiosities", href: "Curiosities.dc.html" },
    eyebrow: "Curiosities · Games", title: "Video games", lede: "Yakuza, hack and slash, Dark Souls, and three platinum trophies.",
    desc: "Video games. Three platinum trophies, a love of the Yakuza games, hack and slash, and Dark Souls.",
    intro: "Yakuza, hack and slash, and Dark Souls, and otherwise whatever the group has decided we are playing this month.",
    media: [
      {
        "title": "Three platinum trophies",
        "body": [
          "A platinum means every other trophy in the game is done. These are screenshots from my PlayStation trophy pages, and between them they cover 140 trophies."
        ],
        "points": [
          [
            "Dark Souls: Remastered",
            "PS4. 41 of 41 trophies, platinum earned June 19, 2025."
          ],
          [
            "Like a Dragon Gaiden: The Man Who Erased His Name",
            "PS5. 62 of 62, platinum earned May 20, 2025."
          ],
          [
            "God of War",
            "PS4. 37 of 37, platinum earned February 19, 2023."
          ]
        ]
      },
      {
        "title": "The trophy pages",
        "slots": [
          "plat-1",
          "plat-2",
          "plat-5"
        ],
        "gallery": true
      },
      {
        "title": "What I keep coming back to",
        "body": [
          "Three things: the Yakuza and Like a Dragon games, hack and slash games, and the Dark Souls games."
        ],
        "points": [
          [
            "Yakuza",
            "Long, character-driven stories I want to see through to the end, which is how Like a Dragon Gaiden ended at 62 of 62."
          ],
          [
            "Hack and slash",
            "God of War, finished to 100%."
          ],
          [
            "Dark Souls",
            "Remastered, completed to the last trophy. It teaches by letting you fail and try again."
          ]
        ]
      },
      {
        "title": "What it says about me",
        "body": [
          "Finishing a game to its last trophy takes the same habits as the rest of this site: patience, repetition, and not stopping at good enough. It is the same attitude as a lift programme run for months, or a result checked until it holds."
        ]
      },
      {
        "title": "Why games matter",
        "body": [
          "When you leave a country, a shared server is often the last thing you still have in common with the people you left. Several friendships from Panama and Trinidad are still alive largely because of a standing lobby and a bad time-zone overlap."
        ]
      },
      {
        "title": "Screens",
        "slots": [
          "games-1",
          "games-2",
          "games-3"
        ],
        "gallery": true
      }
    ],
    facts: [["Favourites", "Yakuza · hack and slash · Dark Souls"], ["Platinums", "3"], ["Trophies earned", "140 across the three"], ["Also", "Co-op · strategy"]],
    slots: [
      { key: "games-1", ratio: "4 / 3", label: "Dark Souls" },
      { key: "games-2", ratio: "3 / 4", label: "Dark Souls, with Solaire" },
      { key: "games-3", ratio: "4 / 3", label: "The Wind Waker HD on the Wii U" },
      { key: "plat-1", ratio: "1400 / 400", label: "Dark Souls: Remastered trophy page" },
      { key: "plat-2", ratio: "1400 / 400", label: "Like a Dragon Gaiden trophy page" },
      { key: "plat-5", ratio: "1400 / 399", label: "God of War trophy page" }
    ],
    next: { title: "Media", lede: "Photos and video from six countries.", href: "Media.dc.html", label: "See the media" }
  }
];

/* ------------------------------------------------------------ template ---- */

function renderFacts(facts) {
  if (!facts || !facts.length) return "";
  return `
  <div data-stagger="1" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:var(--sa-space-5);margin-top:var(--sa-space-10)">
${facts.map(([k, v]) => `    <div style="border-top:1px solid var(--sa-border-hairline);padding-top:var(--sa-space-3)">
      <div style="font:var(--sa-type-eyebrow);letter-spacing:var(--sa-tracking-eyebrow);text-transform:uppercase;color:var(--sa-text-muted)">${esc(k)}</div>
      <div style="font:var(--sa-type-body);color:var(--sa-text-primary);margin-top:4px">${esc(v)}</div>
    </div>`).join("\n")}
  </div>`;
}

function renderAwards(a) {
  if (!a) return "";
  const group = (g) => `      <div>
        <div style="font:var(--sa-type-eyebrow);letter-spacing:var(--sa-tracking-eyebrow);text-transform:uppercase;color:var(--sa-text-accent);padding-bottom:var(--sa-space-3);border-bottom:1px solid var(--sa-border-default)">${esc(g.title)}</div>
        <ul style="list-style:none;margin:var(--sa-space-5) 0 0;padding:0;display:flex;flex-direction:column;gap:var(--sa-space-5)">
${g.items.map((it) => {
    const item = typeof it === "string" ? { label: it } : it;
    return `          <li style="display:flex;gap:10px;align-items:flex-start">
            <span style="width:6px;height:6px;border-radius:50%;background:var(--sa-accent);margin-top:9px;flex:none"></span>
            <span>
              <span style="display:block;font:var(--sa-type-ui);font-size:var(--sa-text-base);color:var(--sa-text-primary)">${esc(item.label)}</span>${item.detail ? `
              <span style="display:block;font:var(--sa-type-body);font-size:var(--sa-text-sm);color:var(--sa-text-secondary);margin-top:2px;text-wrap:pretty">${esc(item.detail)}</span>` : ""}${item.note ? `
              <span style="display:block;font:var(--sa-type-body);font-size:var(--sa-text-sm);color:var(--sa-text-muted);margin-top:6px;text-wrap:pretty">${esc(item.note)}</span>` : ""}
            </span>
          </li>`;
  }).join("\n")}
        </ul>
      </div>`;
  return `
<section data-reveal="1" style="background:var(--sa-surface-sunken);border-top:var(--sa-hairline);border-bottom:var(--sa-hairline)">
  <div style="width:100%;max-width:1440px;margin:0 auto;padding:var(--sa-band-y) clamp(24px,5vw,64px) var(--sa-band-y) clamp(24px,11vw,168px);box-sizing:border-box">
    <div data-rail-target="1">
      <x-import component-from-global-scope="${NS}.SectionHeading" eyebrow="${attr(a.eyebrow || "Recognition")}" title="${attr(a.title || "Awards")}" lede="${attr(a.lede || "")}" hint-size="100%,150px"></x-import>
    </div>
    <div data-stagger="1" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:clamp(28px,4vw,56px);margin-top:var(--sa-space-12)">
${a.groups.map(group).join("\n")}
    </div>
  </div>
</section>`;
}

function renderSteps(allSteps, eyebrow, title) {
  const steps = (allSteps || []).filter((st) => !st[2]);
  if (!steps.length) return "";
  return `
<section data-reveal="1" style="background:var(--sa-surface-sunken);border-top:var(--sa-hairline);border-bottom:var(--sa-hairline)">
  <div style="width:100%;max-width:1440px;margin:0 auto;padding:var(--sa-band-y) clamp(24px,5vw,64px) var(--sa-band-y) clamp(24px,11vw,168px);box-sizing:border-box">
    <div data-rail-target="1">
      <x-import component-from-global-scope="${NS}.SectionHeading" eyebrow="${attr(eyebrow || "The work")}" title="${attr(title || "How it breaks down")}" hint-size="100%,110px"></x-import>
    </div>
    <div data-stagger="1" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:var(--sa-space-5);margin-top:var(--sa-space-10)">
${steps.map(([k, v, pending]) => `      <x-import component-from-global-scope="${NS}.Card" eyebrow="${attr(k)}" title="${attr(pending ? "To be added" : "")}"${pending ? ' meta="{{ soon }}"' : ""} hint-size="100%,170px">${esc(v)}</x-import>`).join("\n")}
    </div>
  </div>
</section>`;
}


/* Scrollable document reader: a list of documents on the left, the selected one shown page by
   page in a scroll frame on the right. Pure CSS (radio inputs), so no script is needed. */
function renderReader(rd, pageKey) {
  if (!rd || !rd.items || !rd.items.length) return "";
  const id = (i) => `rd-${pageKey}-${i}`;
  const css = rd.items.map((_, i) => `#${id(i)}:checked ~ .sa-reader-list label[for="${id(i)}"]{background:var(--sa-surface-card);box-shadow:inset 3px 0 0 var(--sa-text-accent);color:var(--sa-text-primary)}#${id(i)}:checked ~ .sa-reader-stage #${id(i)}-panel{display:block}`).join("");
  const pages = (it) => Array.from({ length: it.pages }, (_, k) => {
    const n = String(k + 1).padStart(it.pages >= 10 ? 2 : 1, "0");
    return `<img src="${attr(it.dir)}/p-${n}.jpg" alt="${attr(it.title)}, page ${k + 1} of ${it.pages}" loading="lazy" decoding="async" width="850" height="1100">`;
  }).join("");
  return `
<section data-reveal="1" class="sa-reader-wrap">
  <div class="sa-gallery-head"><span class="sa-gallery-kicker">${esc(rd.kicker || "Read it here")}</span></div>
  <h3 class="sa-reader-title">${esc(rd.heading)}</h3>
  ${rd.intro ? `<p class="sa-reader-intro">${esc(rd.intro)}</p>` : ""}
  <style>${css}</style>
  <div class="sa-reader">
${rd.items.map((it, i) => `    <input type="radio" name="rd-${pageKey}" id="${id(i)}" class="sa-reader-radio"${i === 0 ? " checked" : ""}>`).join("\n")}
    <div class="sa-reader-list" role="list">
${rd.items.map((it, i) => `      <label for="${id(i)}" role="listitem"><em>${esc(it.kicker || "")}</em><strong>${esc(it.title)}</strong><small>${it.pages} pages</small></label>`).join("\n")}
    </div>
    <div class="sa-reader-stage">
${rd.items.map((it, i) => `      <div class="sa-reader-panel" id="${id(i)}-panel">
        <div class="sa-reader-bar"><span>${esc(it.title)}</span><a href="${attr(it.pdf)}" target="_blank" rel="noopener">Open PDF</a></div>
        ${it.blurb ? `<p class="sa-reader-blurb">${esc(it.blurb)}</p>` : ""}
        <div class="sa-reader-scroll" tabindex="0" aria-label="${attr(it.title)}, scroll to read">${pages(it)}</div>
      </div>`).join("\n")}
    </div>
  </div>
</section>`;
}

function renderPage(p) {
  const group = GROUPS[p.section];
  const siblings = group ? group.items.filter((i) => i.href !== p.file) : [];
  /* Kept under ~60 characters, which is where search results truncate. The full
     "Santiago Aguilera Library" stays as og:site_name. */
  const title = `${p.title} · Santiago Aguilera`;
  const slots = p.slots || [];

  /* Only photos that exist are shown. An unfilled slot renders as an empty camera frame,
     which on a public page reads as unfinished. Add the file and its manifest entry and
     the slot appears. The lead photo is the first one that exists; a page with none keeps
     a single placeholder so it is clear where the first photo goes. */
  const filledSlots = slots.filter((sl) => PHOTO_MANIFEST[sl.key]);
  const inRows = new Set((p.media || []).flatMap((r) => r.slots || []));
  const heroSlot = filledSlots.find((sl) => !inRows.has(sl.key)) || (p.media ? undefined : filledSlots[0]);
  const restSlots = filledSlots.filter((sl) => sl !== heroSlot);

  const crumb = p.parent
    ? `      <a href="${p.parent.href}" style="font:var(--sa-type-ui);font-size:var(--sa-text-sm);color:var(--sa-text-muted);text-decoration:none;display:inline-block;padding-block:4px">← ${esc(p.parent.label)}</a>\n`
    : "";

  const bodyParas = (p.body || [])
    .map((t) => `      <p style="font:var(--sa-type-body);color:var(--sa-text-secondary);max-width:60ch;margin-top:var(--sa-space-4);text-wrap:pretty">${esc(t)}</p>`)
    .join("\n");

  /* Two versions of the same block. Visitors get one honest sentence; the detailed
     list of what is missing is author-only, because it is written as instructions to
     Santiago ("Your Perkiomen Senate role and year, what you ran on") and was being
     published on a page a university might be reading. ?edit=1 reveals it. */
  const noteBox = (cls, eyebrow, text) =>
    `      <div class="${cls}" style="margin-top:var(--sa-space-8);padding:var(--sa-space-5);border-left:3px solid var(--sa-highlight);background:var(--sa-highlight-soft);border-radius:var(--sa-radius-sm)">
        <div style="font:var(--sa-type-eyebrow);letter-spacing:var(--sa-tracking-eyebrow);text-transform:uppercase;color:var(--sa-sienna-500)">${esc(eyebrow)}</div>
        <p style="font:var(--sa-type-body);font-size:var(--sa-text-sm);color:var(--sa-ink-800);margin:6px 0 0;text-wrap:pretty">${esc(text)}</p>
      </div>`;

  /* Public pages no longer carry a "still being written" box: it read as unfinished. The
     author note stays, visible only with ?edit=1. */
  const tbdNote = p.tbd
    ? noteBox("sa-tbd-author", "Still to add (only visible with ?edit=1)", p.tbd)
    : "";

  /* A live project link, rendered as a button under the intro. Pages that ship
     something people can actually open should say so above the fold. */
  const liveLink = p.link
    ? `      <div style="margin-top:var(--sa-space-8)">
        <x-import component-from-global-scope="${NS}.Button" href="${attr(p.link.href)}" target="_blank" rel="noopener" hint-size="220px,44px">${esc(p.link.label)}</x-import>
      </div>`
    : "";

  const quote = p.quote
    ? `
<section data-reveal="1" style="width:100%;max-width:1440px;margin:0 auto;padding:var(--sa-space-16) clamp(24px,5vw,64px) var(--sa-space-8) clamp(24px,11vw,168px);box-sizing:border-box">
  <x-import component-from-global-scope="${NS}.Quote" attribution="${attr(p.quote.by)}" hint-size="100%,120px">${esc(p.quote.text)}</x-import>
</section>`
    : "";

  const video = p.video && p.video.src
    ? `
<section data-reveal="1" class="sa-gallery-wrap" style="padding-top:var(--sa-space-4)">
  <figure class="sa-fig" style="max-width:${attr(p.video.width || 360)}px">
    <video src="${attr(p.video.src)}" poster="${attr(p.video.poster)}" controls playsinline preload="metadata" style="display:block;width:100%;height:auto;aspect-ratio:${attr(p.video.ratio)};border-radius:var(--sa-radius-media,4px);background:#000"></video>
    <figcaption style="display:block">${esc(p.video.label)}</figcaption>
  </figure>
</section>`
    : p.video
    ? `
<section data-reveal="1" style="width:100%;max-width:1440px;margin:0 auto;padding:var(--sa-space-8) clamp(24px,5vw,64px) var(--sa-space-16) clamp(24px,11vw,168px);box-sizing:border-box">
  <x-import component-from-global-scope="${NS}.MediaFrame" ratio="${attr(p.video.ratio)}" kind="video" placeholder="${attr(p.video.label)}" caption="${attr(p.video.label)}" hint-size="100%,240px"></x-import>
</section>`
    : "";

  // landing pages lead with a card grid of their children instead of a prose block
  const awards = renderAwards(p.awards);

  const cards = p.cards
    ? `
<section data-reveal="1" style="width:100%;max-width:1440px;margin:0 auto;padding:var(--sa-space-8) clamp(24px,5vw,64px) var(--sa-space-20) clamp(24px,11vw,168px);box-sizing:border-box">
  <h2 class="sa-vh">${attr(p.eyebrow)}</h2>
  <div data-stagger="1" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:var(--sa-space-5)">
${p.cards.map((c) => `    <x-import component-from-global-scope="${NS}.Card" interactive="{{ true }}" href="${attr(c.href)}" eyebrow="${attr(c.eyebrow)}" title="${attr(c.title)}" hint-size="100%,180px">${esc(c.body)}</x-import>`).join("\n")}
  </div>
</section>`
    : "";

  /* Photographs are spread through the page instead of collected into one grid at
     the end. The grid was the same on every page and read as an afterthought.

     Group sizes and the treatment of each group come from a hash of the file name,
     so a page always lays out the same way but neighbouring pages do not match. */
  const seedOf = (str) => { let h = 0; for (const ch of str) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
  const seed = seedOf(p.file);

  const PATTERNS = [[1, 2, 2, 1], [2, 1, 2, 1], [1, 1, 2, 2], [2, 2, 1, 2], [1, 2, 1, 2], [3, 1, 2]];
  const groupSlots = (list) => {
    const pat = PATTERNS[seed % PATTERNS.length];
    const out = [];
    for (let i = 0, k = 0; i < list.length; k++) {
      const n = Math.min(pat[k % pat.length], list.length - i);
      out.push(list.slice(i, i + n));
      i += n;
    }
    return out;
  };

  /* A lone figure is sized from its aspect, not given one width for everything. A
     square at the full text measure becomes a 1000px block, which is overbearing when
     filled and an enormous empty rectangle while it is not. */
  const aspectOf = (r) => {
    const m = String(r).split("/").map((n) => parseFloat(n));
    return m.length === 2 && m[1] ? m[0] / m[1] : 1;
  };
  // a square hero beside the intro was rendering 480px and swamping the text
  const heroWidth = (r) => { const a = aspectOf(r); return a >= 1.3 ? 460 : a >= 1 ? 340 : 300; };
  const singleWidth = (r, band) => {
    const a = aspectOf(r);
    if (a >= 1.3) return band ? 1020 : 860;   // landscape
    if (a >= 1) return band ? 780 : 660;      // square-ish
    return band ? 560 : 470;                  // portrait
  };

  const figure = (sl, maxW) => `      <figure class="sa-fig"${maxW ? ` style="max-width:${maxW}px"` : ""}>
        <sa-image-slot slot-key="${attr(sl.key)}" ratio="${attr(sl.ratio)}" placeholder="${attr(sl.label)}"></sa-image-slot>
        <figcaption>${esc(sl.label)}</figcaption>
      </figure>`;

  /* A page can pair its images with prose instead of leaving them to sit between two
     text blocks. Each row is a cluster of images on one side and a paragraph on the
     other, alternating sides down the page. Used where the pictures need explaining;
     photo pages fall through to the plain figure groups below. */
  let textRowNo = 0;
  const pointsHtml = (row) => row.points && row.points.length ? `
    <ul class="sa-points">
${row.points.map((pt) => Array.isArray(pt)
    ? `      <li><strong>${esc(pt[0])}</strong>${pt[1] ? `<span>${esc(pt[1])}</span>` : ""}</li>`
    : `      <li><span>${esc(pt)}</span></li>`).join("\n")}
    </ul>` : "";
  const textHtml = (row) => `    <h3>${esc(row.title)}</h3>
${(row.body || []).map((t) => `    <p>${esc(t)}</p>`).join("\n")}${pointsHtml(row)}`;
  const mediaRow = (row, idx) => {
    const sl = (row.slots || []).map((k) => slots.find((x) => x.key === k)).filter((x) => x && PHOTO_MANIFEST[x.key] && x !== heroSlot);
    if (row.gallery) {
      if (!sl.length) return "";
      return `
<section data-reveal="1" class="sa-gallery-wrap" style="padding-top:var(--sa-space-8);padding-bottom:var(--sa-space-8)">
  <div class="sa-gallery-head"><span class="sa-gallery-kicker">${esc(row.title)}</span></div>
  <div class="sa-gallery n${Math.min(sl.length, 3)}">
${sl.map((x) => figure(x)).join("\n")}
  </div>
</section>`;
    }
    if (!sl.length) {
      textRowNo += 1;
      return `
<section data-reveal="1" class="sa-text-row">
  <div class="sa-text-head"><span class="sa-text-kicker">${String(textRowNo).padStart(2, "0")}</span></div>
  <div class="sa-media-text">
${textHtml(row)}
  </div>
</section>`;
    }
    const flip = idx % 2 === 1;
    return `
<section data-reveal="1" class="sa-media-row${flip ? " flip" : ""}">
  <div class="sa-media-figs n${sl.length}">
${sl.map((x) => figure(x)).join("\n")}
  </div>
  <div class="sa-media-text">
${textHtml(row)}
  </div>
</section>`;
  };

  const SINGLES = ["band", "one", "one-right"];
  const renderGroup = (group, idx) => {
    if (group.length === 1) {
      const kind = SINGLES[(seed + idx) % SINGLES.length];
      const inner = `
<section data-reveal="1" class="sa-figs sa-figs-${kind === "band" ? "one" : kind}">
${figure(group[0], singleWidth(group[0].ratio, kind === "band"))}
</section>`;
      return kind === "band" ? `\n<div class="sa-band-figs">${inner}\n</div>` : inner;
    }
    const kind = group.length >= 3 ? "trio" : "pair";
    return `
<section data-reveal="1" class="sa-figs sa-figs-${kind}">
${group.map((sl) => figure(sl)).join("\n")}
</section>`;
  };

  const more = siblings.length
    ? `
<section data-reveal="1" style="width:100%;max-width:1440px;margin:0 auto;padding:var(--sa-space-8) clamp(24px,5vw,64px) var(--sa-space-20) clamp(24px,11vw,168px);box-sizing:border-box">
  <div data-rail-target="1">
    <x-import component-from-global-scope="${NS}.SectionHeading" eyebrow="More in ${attr(group.title)}" title="Keep going" hint-size="100%,110px"></x-import>
  </div>
  <div data-stagger="1" style="display:flex;flex-wrap:wrap;gap:var(--sa-space-3);margin-top:var(--sa-space-8)">
${siblings.map((s) => `    <a href="${attr(s.href)}" style="display:inline-flex;align-items:center;height:44px;padding:0 20px;border:1px solid var(--sa-border-default);border-radius:var(--sa-radius-pill);font:var(--sa-type-ui);text-decoration:none;color:var(--sa-text-primary);transition:var(--sa-transition-control)">${esc(s.label)}</a>`).join("\n")}
  </div>
</section>`
    : "";

  /* Lay the figure groups into the gaps between content sections, spread from the
     first gap to the last so images punctuate the page rather than trailing it. */
  const readerHtml = (p.readers || []).map((rd, ri) => renderReader(rd, p.file.replace(/\W+/g, "") + ri)).join("");
  const contentSections = [readerHtml, cards, awards, renderSteps(p.steps, p.stepsEyebrow, p.stepsTitle), quote, video]
    .filter((x) => x && x.trim());
  /* Photo pages get one tidy gallery after the text instead of single figures scattered
     through the gaps, which left large empty stretches and a different size every time. */
  const gallery = (list) => list.length ? `
<section data-reveal="1" class="sa-gallery-wrap">
  <div class="sa-gallery-head"><span class="sa-gallery-kicker">Photographs</span></div>
  <div class="sa-gallery n${Math.min(list.length, 3)}">
${list.map((sl) => figure(sl)).join("\n")}
  </div>
</section>` : "";
  const blocks = p.media
    ? p.media.map((row, i) => mediaRow(row, i))
    : [];
  const galleryHtml = p.media ? "" : gallery(restSlots);
  const gapCount = contentSections.length + 1;
  const buckets = Array.from({ length: gapCount }, () => []);
  blocks.forEach((html, i) => {
    const gap = blocks.length === 1
      ? Math.min(1, gapCount - 1)
      : Math.round((i * (gapCount - 1)) / (blocks.length - 1));
    buckets[gap].push(html);
  });
  const bodySections = p.media
    ? blocks.join("") + contentSections.join("")
    : buckets.map((b, i) => b.join("") + (contentSections[i] || "")).join("") + galleryHtml;

  const footerCols = [
    { title: "Sections", links: SECTION_LINKS },
    group ? { title: group.title, links: group.items } : null
  ].filter(Boolean);

  // Absolute URLs only once SITE_ORIGIN is known. See the constant's comment.
  const canonical = SITE_ORIGIN
    ? `<link rel="canonical" href="${attr("/pages/" + p.file)}">
<meta property="og:url" content="${attr(SITE_ORIGIN + "/pages/" + p.file)}">
`
    : "";
  const ogImage = SITE_ORIGIN ? SITE_ORIGIN + "/assets/og-image.png" : "../assets/og-image.png";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${attr(p.desc)}">${isThin(p) ? '\n<meta name="robots" content="noindex,follow">' : ""}
<link rel="icon" type="image/svg+xml" href="../assets/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="../assets/icons/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../assets/icons/favicon-16.png">
<link rel="apple-touch-icon" href="../assets/apple-touch-icon.png">
<link rel="manifest" href="../assets/site.webmanifest">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="SA Library">
<meta name="theme-color" content="#0F3D3E">
${canonical}<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(p.desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Santiago Aguilera Library">
<meta property="og:image" content="${attr(ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<script>(function(){try{
var M={library:"light",perkiomen:"light",isps:"light",sana:"light",sky:"light",ps:"light",exeter:"light",isef:"light",noir:"dark",gilt:"dark",atlas:"dark",ferrari:"dark",lambo:"dark",arcade:"dark",cmu:"dark",csrx:"dark"};
var d=document.documentElement,def="${paletteFor(p)}",p=null;
try{p=localStorage.getItem("sa:palette")}catch(e){}
var k=(p&&M[p])?p:def;
d.setAttribute("data-palette-default",def);d.setAttribute("data-palette",k);d.setAttribute("data-theme",M[k]);${PAGE_COUNTRY[p.file] ? `d.setAttribute("data-country","${PAGE_COUNTRY[p.file]}");` : ""}
}catch(e){}})();</script>
<!-- React is vendored, not pulled from a CDN: support.js skips its unpkg fetch when
     window.React/ReactDOM already exist. Without this the whole site is a blank page
     whenever unpkg is unreachable, since every page renders client-side. -->
<script src="../assets/vendor/react.production.min.js"></script>
<script src="../assets/vendor/react-dom.production.min.js"></script>
<script src="../assets/site-config.js"></script>
<script>window.__SA_COMPONENT_DIR="/pages";</script>
<script src="../support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="${DS}/styles.css">
<link rel="stylesheet" href="../assets/palettes.css">
<link rel="stylesheet" href="../assets/site.css">
<script src="${DS}/_ds_bundle.js"></script>
<script src="../assets/photo-slots.js" defer></script>
<style>
body{margin:0;background:var(--sa-surface-page);transition:background-color .15s ease}
a{color:var(--sa-link)}a:hover{color:var(--sa-link-hover)}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
.sa-glow{position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none;z-index:0;opacity:.5}
/* Every page opens with the same ~60 nav links; a keyboard or screen-reader user
   needs one jump past them rather than 60 tabs on every single page. */
.sa-skip{position:absolute;left:-9999px;top:0;z-index:100}
.sa-skip:focus{left:16px;top:16px;padding:12px 18px;background:var(--sa-ink-800);color:var(--sa-paper-000);
  border-radius:var(--sa-radius-control);font:var(--sa-type-ui);text-decoration:none}
</style>
</helmet>
<div style="background:var(--sa-surface-page);color:var(--sa-text-primary);font:var(--sa-type-body);min-height:100vh;overflow-x:clip">
<a class="sa-skip" href="#main">Skip to content</a>
<dc-import name="SymbolRail" mode="${p.section === "research" ? "helix" : "unwind"}" hint-size="100%,100%"></dc-import>
<dc-import name="SiteNav" active="${attr(p.section)}" hint-size="100%,72px"></dc-import>
<main id="main">

<section class="sa-pagehead sa-pagehead--leaf" style="width:100%;max-width:1440px;margin:0 auto;padding:clamp(40px,6vh,72px) clamp(24px,5vw,64px) var(--sa-space-12) clamp(24px,11vw,168px);box-sizing:border-box">
${crumb}  <span class="sa-kicker" style="margin-top:var(--sa-space-4);font:var(--sa-type-eyebrow);letter-spacing:var(--sa-tracking-eyebrow);text-transform:uppercase;color:var(--sa-text-accent)">${esc(p.eyebrow)}</span>
  <h1 style="font:var(--sa-type-display);font-size:clamp(2.5rem,5vw,4rem);letter-spacing:var(--sa-tracking-display);margin:var(--sa-space-5) 0 0;max-width:20ch">${esc(p.title)}</h1>
  <p style="font:var(--sa-type-lede);font-size:var(--sa-text-lg);color:var(--sa-text-secondary);max-width:56ch;margin-top:var(--sa-space-6);text-wrap:pretty">${esc(p.lede)}</p>
</section>

<section data-reveal="1" style="width:100%;max-width:1440px;margin:0 auto;padding:0 clamp(24px,5vw,64px) var(--sa-space-16) clamp(24px,11vw,168px);box-sizing:border-box;display:grid;grid-template-columns:minmax(300px,1.05fr) minmax(260px,0.95fr);gap:clamp(32px,5vw,72px);align-items:start">
    <div>
      <p style="font:var(--sa-type-lede);color:var(--sa-text-primary);max-width:60ch;text-wrap:pretty">${esc(p.intro)}</p>
${bodyParas}
${liveLink}
${tbdNote}
${renderFacts(p.facts)}
    </div>
${heroSlot ? `    <div style="max-width:${heroWidth(heroSlot.ratio)}px;width:100%"><sa-image-slot slot-key="${attr(heroSlot.key)}" ratio="${attr(heroSlot.ratio)}" placeholder="${attr(heroSlot.label)}"></sa-image-slot></div>` : `    <div style="max-width:${heroWidth("4 / 3")}px;width:100%"><div class="sa-banner" aria-hidden="true">${spiralSvg()}</div></div>`}
</section>
${bodySections}${more}

<section class="sa-on-ink" style="position:relative;z-index:10;background:var(--sa-surface-ink);overflow:hidden">
  <div class="sa-glow" style="width:420px;height:420px;left:-90px;top:-150px;background:var(--sa-coral-500)"></div>
  <div class="sa-glow" style="width:380px;height:380px;right:-80px;bottom:-140px;background:var(--sa-verdigris-500)"></div>
  <div style="position:relative;z-index:1;width:100%;max-width:1440px;margin:0 auto;padding:var(--sa-band-y) clamp(24px,5vw,64px) var(--sa-band-y) clamp(24px,11vw,168px);box-sizing:border-box;display:flex;flex-wrap:wrap;gap:var(--sa-space-10);align-items:flex-end;justify-content:space-between">
    <div data-rail-target="1">
      <x-import component-from-global-scope="${NS}.SectionHeading" eyebrow="Next" title="${attr(p.next.title)}" lede="${attr(p.next.lede)}" hint-size="100%,150px"></x-import>
    </div>
    <x-import component-from-global-scope="${NS}.Button" size="lg" href="${attr(p.next.href)}" hint-size="200px,52px">${esc(p.next.label)}</x-import>
  </div>
</section>
</main>

<dc-import name="SiteFooter" hint-size="100%,620px"></dc-import>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props="{}">
class Component extends DCLogic {
  renderVals() {
    return {
      true: true,
      soon: React.createElement(window.${NS}.Badge, { tone: "highlight" }, "To be added"),
    };
  }

  componentDidMount() {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.transition = "opacity 560ms cubic-bezier(.22,.61,.36,1), transform 560ms cubic-bezier(.22,.61,.36,1)";
      e.target.style.opacity = "1"; e.target.style.transform = "none";
      io.unobserve(e.target);
    }), { threshold: 0.1 });
    document.querySelectorAll("[data-reveal]").forEach(el => {
      el.style.opacity = "0"; el.style.transform = "translateY(12px)"; io.observe(el);
    });
    this._io = io;

    const sio = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      [...e.target.children].forEach((child, i) => {
        child.style.transition = \`opacity 480ms cubic-bezier(.22,.61,.36,1) \${i * 70}ms, transform 480ms cubic-bezier(.22,.61,.36,1) \${i * 70}ms\`;
        child.style.opacity = "1"; child.style.transform = "none";
      });
      sio.unobserve(e.target);
    }), { threshold: 0.1 });
    document.querySelectorAll("[data-stagger]").forEach(el => {
      [...el.children].forEach(child => { child.style.opacity = "0"; child.style.transform = "translateY(14px)"; });
      sio.observe(el);
    });
    this._sio = sio;
  }

  componentWillUnmount() { if (this._io) this._io.disconnect(); if (this._sio) this._sio.disconnect(); }
}
</script>
</body>
</html>
`;
}

/* --------------------------------------------------------- token check ---- */
/* A custom property that does not exist invalidates the whole declaration it sits in,
   silently. `padding: var(--sa-space-14) ...` cost a media row its entire left inset
   with nothing in the console to show for it, because the scale jumps 12 to 16.
   Anything with a fallback, var(--x, 80px), is fine and skipped. */
function checkTokens() {
  const cssPath = path.join(ROOT, "assets/site.css");
  if (!fs.existsSync(cssPath)) return;
  const css = fs.readFileSync(cssPath, "utf8");
  const defined = new Set([...css.matchAll(/(--sa-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
  for (const f of fs.readdirSync(path.join(ROOT, DS_DIR, "tokens"))) {
    const t = fs.readFileSync(path.join(ROOT, DS_DIR, "tokens", f), "utf8");
    for (const m of t.matchAll(/(--sa-[a-z0-9-]+)\s*:/g)) defined.add(m[1]);
  }
  const missing = new Set();
  for (const m of css.matchAll(/var\(\s*(--sa-[a-z0-9-]+)\s*([,)])/g)) {
    if (m[2] === ")" && !defined.has(m[1])) missing.add(m[1]);
  }
  if (missing.size) {
    console.warn("WARNING: assets/site.css uses design tokens that do not exist: " +
      [...missing].join(", ") + "\n         Each one silently voids the declaration it is in.");
  }
}
checkTokens();

/* ---------------------------------------------------------------- run ---- */

let written = 0;
for (const p of PAGES) {
  fs.writeFileSync(path.join(PAGES_DIR, p.file), renderPage(p), "utf8");
  written++;
}

/* The homepage has to exist at the site root: a static host serves index.html for "/",
   and without one the root URL 404s (or worse, shows a directory listing) on Vercel,
   GitHub Pages and local preview alike. Home.dc.html stays the authored file (the DC
   tooling only opens .dc.html), so index.html is generated from it verbatim. Both carry
   <link rel="canonical" href="/">, so the duplicate defers to the root URL. */
const home = fs.readFileSync(path.join(PAGES_DIR, "Home.dc.html"), "utf8");
if (!home.includes('rel="canonical"')) {
  console.warn('WARNING: Home.dc.html has no <link rel="canonical" href="/">; index.html ' +
    "will compete with it as a duplicate. Add it back before deploying.");
}
/* Home.dc.html is written for /pages, so every relative path in it has to be walked
   back one level, and every link to a sibling page has to gain the folder. The
   component directory is absolute already, so it needs nothing. */
const index = home
  .replace(/((?:href|src|content)=")\.\.\/(assets\/|_ds\/)/g, "$1$2")
  .replace(/src="\.\.\/support\.js"/g, 'src="support.js"')
  .replace(/((?:href|action)=")([A-Za-z][\w .%-]*\.dc\.html)"/g, '$1pages/$2"');
fs.writeFileSync(path.join(ROOT, "index.html"), index, "utf8");
written++;

/* Hand-written pages are not in PAGES but still belong in the sitemap. Home is listed
   as "/" rather than Home.dc.html, matching the canonical. */
/* Pages with no entry in PAGES. Leadership and Activities are NOT here: they are
   generated, so PAGES already contributes them and listing them twice duplicates
   them in the sitemap. */
const HAND_WRITTEN = ["About.dc.html", "Academics.dc.html", "Research.dc.html",
  "Curiosities.dc.html", "Media.dc.html", "Contact.dc.html"];

if (SITE_ORIGIN) {
  const urls = ["", ...HAND_WRITTEN, ...PAGES.filter((p) => !isThin(p)).map((p) => p.file)]
    .map((u) => (u ? "pages/" + u : u));
  const today = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${esc(SITE_ORIGIN + "/" + u)}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), xml, "utf8");

  fs.writeFileSync(path.join(ROOT, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`, "utf8");
  console.log(`wrote sitemap.xml (${urls.length} urls) and robots.txt`);
} else {
  // Still worth shipping: without it, crawlers get a 404 for /robots.txt on every visit.
  fs.writeFileSync(path.join(ROOT, "robots.txt"), "User-agent: *\nAllow: /\n", "utf8");
}

const thin = PAGES.filter(isThin);
if (thin.length) {
  console.log(`\n${thin.length} page(s) are mostly a "still being written" note, so they carry`);
  console.log("noindex,follow and are left out of sitemap.xml. They are still linked and");
  console.log(`still reachable. Each returns on its own once it has ${PROSE_MIN_WORDS}+ words of prose:`);
  for (const p of thin) console.log(`  ${p.file.padEnd(38)} ${proseWords(p)} words`);
  console.log("");
}
console.log(`generated ${written} pages (including index.html from Home.dc.html)`);
if (!SITE_ORIGIN) {
  console.log("note: SITE_ORIGIN is empty, so canonical tags, absolute og:url and sitemap.xml\n" +
    "      are omitted. Set it in this file once the Vercel domain is final.");
}


/* Cache-busting. The stylesheets and scripts are cached by browsers, so a page that ships new
   markup could meet an old stylesheet and render broken. Every reference gets ?v=<hash of the
   file>, so a changed file is always fetched fresh and an unchanged one stays cached. */
{
  const crypto = require("crypto");
  const ROOT = path.join(__dirname, "..");
  const versioned = ["assets/site.css", "assets/palettes.css", "assets/photo-slots.js", "assets/site-config.js", "support.js"];
  const hashes = {};
  for (const f of versioned) {
    try { hashes[f] = crypto.createHash("md5").update(fs.readFileSync(path.join(ROOT, f))).digest("hex").slice(0, 8); } catch (e) {}
  }
  const targets = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".html")).map((f) => path.join(PAGES_DIR, f))
    .concat([path.join(ROOT, "index.html"), path.join(ROOT, "404.html")]);
  for (const t of targets) {
    if (!fs.existsSync(t)) continue;
    let html = fs.readFileSync(t, "utf8"), out = html;
    for (const f of Object.keys(hashes)) {
      const re = new RegExp("((?:\\.\\./|/)?" + f.replace(/[.\/]/g, "\\$&") + ")(\\?v=[0-9a-f]+)?(?=[\"'])", "g");
      out = out.replace(re, "$1?v=" + hashes[f]);
    }
    if (out !== html) fs.writeFileSync(t, out);
  }
}


/* Photo cards. The section landings, and the homepage's "ways in" and places grids, use the
   design system's plain text cards. Every interactive card is turned into a photo card with a
   colour accent here, after the pages are written, so the spec stays simple. Idempotent. */
function spiralSvg() {
  let d = "";
  for (let i = 0; i <= 140; i++) { const t = i / 140 * Math.PI * 5.2, r = 3 + t * 2.6; d += (i ? "L" : "M") + (50 + r * Math.cos(t)).toFixed(1) + " " + (50 + r * Math.sin(t)).toFixed(1); }
  return `<svg viewBox="0 0 100 100" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
}
{
  const CARD_IMG = {
    "About.dc.html": "about-church", "Academics.dc.html": "exeter-banner", "Research.dc.html": "cmu-lab", "Leadership.dc.html": "hosa-mic",
    "Activities.dc.html": "lift-squat", "Curiosities.dc.html": "games-artorias", "Media.dc.html": "trip-versailles",
    "Leadership-HOSA.dc.html": "hosa-conference", "Leadership-MUN.dc.html": "mun-eagle", "Leadership-Shadowing.dc.html": "hosp-or",
    "Leadership-Volunteering.dc.html": "vol-river", "Activities-Swimming.dc.html": "swim-blocks", "Activities-Weightlifting.dc.html": "lift-squat",
    "Drums.dc.html": "music-drums", "Drums-SonoArte.dc.html": "music-electric", "Drums-APVybz.dc.html": "isps-apvybz", "Drums-Rockband.dc.html": "music-stage", "Activities-Running.dc.html": "run-tired", "Academics-ISPS.dc.html": "isps-guayasamin",
    "Academics-Perkiomen.dc.html": "perk-paws", "Academics-ExeterSummer.dc.html": "exeter-banner", "Academics-CompBio.dc.html": "cmu-friends",
    "Research-CellAtlas.dc.html": "gbm-3", "Research-MedicalApp.dc.html": "field-notes", "Research-CSRx.dc.html": "cert-csrx",
    "Research-Venezuela.dc.html": "vz-exhibit", "Curiosities-Videogames.dc.html": "games-artorias", "Curiosities-Music.dc.html": "music-band",
    "Curiosities-Literature.dc.html": "sea-look", "Place-Mexico.dc.html": "kid-pirate", "Place-Colombia.dc.html": "co-mammoth",
    "Place-Panama.dc.html": "pa-ancon", "Place-Trinidad.dc.html": "trip-bench", "Place-UnitedStates.dc.html": "perk-paws"
  };
  const CITY_IMG = { "Madrid": "madrid-hat", "Houston": "houston-slide", "Monterrey": "kid-pirate", "Bogotá": "co-mammoth", "Ciudad de Panamá": "pa-ancon", "Port of Spain": "trip-bench", "Pennsburg": "perk-paws" };
  const PLACE_COLOR = { usa: "#3A7CA5", spain: "#D9A441", mexico: "#3F9A5A", colombia: "#E3B93C", panama: "#E0654A", trinidad: "#C2403A", pennsburg: "#7B5EA7" };
  const PAL = ["#E0654A", "#2F8F83", "#D9A441", "#7B5EA7", "#3A7CA5", "#C2527A", "#5E8C3A"];
  const A = (attrs, n) => { const m = attrs.match(new RegExp("(?:^|\\s)" + n + '="([^"]*)"')); return m ? m[1] : ""; };
  const img = (name, alt) => `<span class="sa-pcard-img"><img src="/assets/photos/card/${name}.jpg" alt="" loading="lazy" decoding="async" width="640" height="400"></span>`;
  const noimg = () => `<span class="sa-pcard-img noimg">${spiralSvg()}</span>`;
  const hash = (t) => { let h = 0; for (const ch of t) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
  const cardRe = /<x-import component-from-global-scope="[^"]*\.Card"([^>]*)>([\s\S]*?)<\/x-import>/g;
  const placeRe = /<x-import component-from-global-scope="[^"]*\.PlaceCard"([^>]*)>([\s\S]*?)<\/x-import>/g;
  const targets = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".html")).map((f) => path.join(PAGES_DIR, f)).concat([path.join(path.join(__dirname, ".."), "index.html")]);
  for (const t of targets) {
    if (!fs.existsSync(t)) continue;
    const html = fs.readFileSync(t, "utf8");
    let out = html.replace(cardRe, (all, attrs, inner) => {
      const href = A(attrs, "href"); if (!href || !/interactive/.test(attrs)) return all;
      const pic = CARD_IMG[href.split("/").pop()];
      return `<a class="sa-pcard" href="${href}" style="--c:${PAL[hash(href) % PAL.length]}">${pic ? img(pic) : noimg()}<span class="sa-pcard-body"><span class="sa-pcard-eyebrow">${A(attrs, "eyebrow")}</span><span class="sa-pcard-title">${A(attrs, "title")}</span><span class="sa-pcard-text">${inner}</span></span></a>`;
    });
    out = out.replace(placeRe, (all, attrs, inner) => {
      const city = A(attrs, "city"), pic = CITY_IMG[city];
      return `<span class="sa-pcard" style="--c:${PLACE_COLOR[A(attrs, "place")] || PAL[0]}">${pic ? img(pic) : noimg()}<span class="sa-pcard-body"><span class="sa-pcard-years">${A(attrs, "years")}</span><span class="sa-pcard-title">${city}</span><span class="sa-pcard-eyebrow">${A(attrs, "country")}</span><span class="sa-pcard-text">${inner}</span></span></span>`;
    });
    if (out !== html) fs.writeFileSync(t, out);
  }
}

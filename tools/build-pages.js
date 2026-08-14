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
 * plainly ("Waiting on details") rather than inventing achievements — this is a
 * real person's portfolio going to universities.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DS = "_ds/santiago-aguilera-design-system-9830153d-9277-4c73-8263-d161c385797f";
const NS = "SantiagoAguileraDesignSystem_983015";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const attr = (s) => esc(s).replace(/"/g, "&quot;");

/* ---------------------------------------------------------------- spec ---- */

const SECTION_LINKS = [
  { label: "About", href: "About.dc.html" },
  { label: "Academics", href: "Academics.dc.html" },
  { label: "Research & projects", href: "Research.dc.html" },
  { label: "Leadership & service", href: "Leadership.dc.html" },
  { label: "Activities", href: "Activities.dc.html" },
  { label: "Curiosities", href: "Curiosities.dc.html" },
  { label: "Media", href: "Media.dc.html" }
];

// siblings shown in each page's footer + "more in this section" strip
const GROUPS = {
  about: { title: "Places", items: [
    { label: "Mexico", href: "Place-Mexico.dc.html" },
    { label: "Colombia", href: "Place-Colombia.dc.html" },
    { label: "Panama", href: "Place-Panama.dc.html" },
    { label: "Trinidad & Tobago", href: "Place-Trinidad.dc.html" },
    { label: "United States", href: "Place-UnitedStates.dc.html" }
  ]},
  academics: { title: "Academics", items: [
    { label: "International School of Port of Spain", href: "Academics-ISPS.dc.html" },
    { label: "Perkiomen School", href: "Academics-Perkiomen.dc.html" },
    { label: "Exeter Summer", href: "Academics-ExeterSummer.dc.html" },
    { label: "Computational Biology at Carnegie Mellon University", href: "Academics-CompBio.dc.html" }
  ]},
  research: { title: "Research", items: [
    { label: "CellAtlas GBM", href: "Research-CellAtlas.dc.html" },
    { label: "Medical App", href: "Research-MedicalApp.dc.html" },
    { label: "Venezuelan Immigration", href: "Research-Venezuela.dc.html" }
  ]},
  leadership: { title: "Leadership & service", items: [
    { label: "HOSA", href: "Leadership-HOSA.dc.html" },
    { label: "GVMUN", href: "Leadership-GVMUN.dc.html" },
    { label: "Student Council / Senate", href: "Leadership-StudentCouncil.dc.html" },
    { label: "Hospital Shadowing", href: "Leadership-Shadowing.dc.html" },
    { label: "Volunteering", href: "Leadership-Volunteering.dc.html" },
    { label: "The Perkiomenite", href: "Leadership-Perkiomenite.dc.html" }
  ]},
  activities: { title: "Activities", items: [
    { label: "Swimming", href: "Activities-Swimming.dc.html" },
    { label: "Weightlifting", href: "Activities-Weightlifting.dc.html" },
    { label: "Drums & Music", href: "Activities-Music.dc.html" }
  ]},
  curiosities: { title: "Curiosities", items: [
    { label: "Literature", href: "Curiosities-Literature.dc.html" },
    { label: "Music", href: "Curiosities-Music.dc.html" },
    { label: "Video Games", href: "Curiosities-Videogames.dc.html" }
  ]}
};

const TBD = "Waiting on details";

const PAGES = [
  /* ---------------------------------------------------------- landings ---- */
  {
    file: "Leadership.dc.html", section: "leadership", kind: "landing",
    eyebrow: "Leadership & service", title: "What I organise, and who it is for",
    lede: "Founding a chapter, directing a newsroom, and the hours that do not show up on a transcript.",
    desc: "HOSA, GVMUN, hospital shadowing, volunteering, and the Perkiomenite.",
    intro: "These are the things where the work was not assigned to me. Each one started as a gap I noticed — a club that did not exist, a newsroom that needed running, a waiting room where nobody spoke Spanish.",
    cards: [
      { eyebrow: "Founder & President", title: "HOSA", href: "Leadership-HOSA.dc.html", body: "Founded Perkiomen's chapter to create opportunities for students interested in healthcare." },
      { eyebrow: "Director of Journalism", title: "GVMUN", href: "Leadership-GVMUN.dc.html", body: "Running the press corps at the Global Virtual Model United Nations conference." },
      { eyebrow: "Student government", title: "Student Council / Senate", href: "Leadership-StudentCouncil.dc.html", body: "Representing classmates at ISPS, and student government at Perkiomen." },
      { eyebrow: "Clinical", title: "Hospital Shadowing", href: "Leadership-Shadowing.dc.html", body: "Time on the floor, watching how care actually gets delivered." },
      { eyebrow: "Service", title: "Volunteering", href: "Leadership-Volunteering.dc.html", body: "Community work, in and out of school." },
      { eyebrow: "Co-Editor", title: "The Perkiomenite", href: "Leadership-Perkiomenite.dc.html", body: "Writing and editing for the school paper." }
    ],
    slots: [{ key: "leadership-hero", ratio: "16 / 9", label: "Leadership — a photo from an event" }],
    next: { title: "The work behind it", lede: "Research and projects, in detail.", href: "Research.dc.html", label: "See the research" }
  },
  {
    file: "Activities.dc.html", section: "activities", kind: "landing",
    eyebrow: "Activities", title: "Drums, water, weight",
    lede: "Three commitments that have followed me across the six countries.",
    desc: "Varsity swimming, Olympic weightlifting, and three bands' worth of drumming.",
    intro: "None of these are electives I picked up at Perkiomen. Each one moved with me, and each one is the reason a new country stopped feeling new.",
    cards: [
      { eyebrow: "Varsity", title: "Swimming", href: "Activities-Swimming.dc.html", body: "Morning sets, meets, and the part of the day that keeps the rest of it in order." },
      { eyebrow: "Olympic lifting", title: "Weightlifting", href: "Activities-Weightlifting.dc.html", body: "Snatch and clean & jerk, programmed year-round." },
      { eyebrow: "Three bands", title: "Drums & Music", href: "Activities-Music.dc.html", body: "SonoArte Panamá, the ISPS musical, and the Perkiomen rock band." }
    ],
    slots: [{ key: "activities-hero", ratio: "16 / 9", label: "Activities — a photo" }],
    next: { title: "What I do with the rest of it", lede: "Languages, manga, and whatever the group is playing.", href: "Curiosities.dc.html", label: "See the curiosities" }
  },

  /* ------------------------------------------------------------ places ---- */
  {
    file: "Place-Mexico.dc.html", section: "about", parent: { label: "About", href: "About.dc.html" },
    eyebrow: "About · Mexico", title: "Monterrey", lede: "Nuevo León, Mexico — from 2011, age three.",
    desc: "Monterrey, Nuevo León — AIM and LICEO, and the city I measure every other place against.",
    intro: "The third country but the first one I actually remember. School started here: AIM first, then LICEO. Spanish stopped being the language my parents spoke and became the language I thought in.",
    body: ["It is still the place I compare everything to. When I describe a city as hot, or loud, or close, Monterrey is the baseline I am measuring against."],
    facts: [["Years", "2011 onward"], ["Schools", "AIM, then LICEO"], ["Language", "Spanish"]],
    slots: [
      { key: "mx-1", ratio: "4 / 3", label: "Monterrey — a photo" },
      { key: "mx-2", ratio: "1 / 1", label: "AIM or LICEO" },
      { key: "mx-3", ratio: "4 / 3", label: "Family in Monterrey" }
    ],
    next: { title: "Next: Colombia", lede: "Altitude, and a second accent in the same language.", href: "Place-Colombia.dc.html", label: "Go to Colombia" }
  },
  {
    file: "Place-Colombia.dc.html", section: "about", parent: { label: "About", href: "About.dc.html" },
    eyebrow: "About · Colombia", title: "Bogotá", lede: "Colombia — December 2016, age eight.",
    desc: "Bogotá, Colombia — Colegio Tilata in La Calera, altitude, and a second accent.",
    intro: "Colegio Tilata, in La Calera, just outside the city. Bogotá sits at 2,640 metres, and the first thing the altitude teaches you is that running is different here.",
    body: ["This is where I learned that Spanish is not one language. The accent, the slang and the register all shifted, and I had to shift with them — the first time I remember consciously adapting to fit a room."],
    facts: [["Arrived", "December 2016"], ["School", "Colegio Tilata, La Calera"], ["Altitude", "2,640 m"]],
    slots: [
      { key: "co-1", ratio: "4 / 3", label: "Bogotá — a photo" },
      { key: "co-2", ratio: "1 / 1", label: "Colegio Tilata" },
      { key: "co-3", ratio: "4 / 3", label: "La Calera" }
    ],
    next: { title: "Next: Panama", lede: "Where I started playing drums.", href: "Place-Panama.dc.html", label: "Go to Panama" }
  },
  {
    file: "Place-Panama.dc.html", section: "about", parent: { label: "About", href: "About.dc.html" },
    eyebrow: "About · Panama", title: "Ciudad de Panamá", lede: "Panama — July 2019, age ten.",
    desc: "Ciudad de Panamá — the International School of Panama, and SonoArte, where I started drumming.",
    intro: "The International School of Panama for class, and SonoArte for the thing that actually changed how I spend my time: this is where I started playing drums.",
    body: ["Drumming became the way I think. It is the one activity that has followed me into every country since — and the reason walking into a new school with a music room never felt like walking in cold."],
    facts: [["Arrived", "July 2019"], ["School", "International School of Panama"], ["Music", "SonoArte"]],
    slots: [
      { key: "pa-1", ratio: "4 / 3", label: "Ciudad de Panamá — a photo" },
      { key: "pa-2", ratio: "1 / 1", label: "SonoArte" },
      { key: "pa-3", ratio: "4 / 3", label: "International School of Panama" }
    ],
    next: { title: "Next: Trinidad & Tobago", lede: "StuCo, and Stronger Together.", href: "Place-Trinidad.dc.html", label: "Go to Trinidad" }
  },
  {
    file: "Place-Trinidad.dc.html", section: "about", parent: { label: "About", href: "About.dc.html" },
    eyebrow: "About · Trinidad & Tobago", title: "Port of Spain", lede: "Trinidad & Tobago — August 2021, age twelve.",
    desc: "Port of Spain — the International School of Port of Spain, Student Council, and Stronger Together.",
    intro: "The International School of Port of Spain. I arrived as schools everywhere were working out how to come back from remote learning, which turned out to be the thing worth working on.",
    body: ["I joined Student Council, and helped run Stronger Together — a student-led initiative supporting classmates through the return to in-person school. It was the first time I saw a student idea actually change how a school felt."],
    facts: [["Arrived", "August 2021"], ["School", "International School of Port of Spain"], ["Led", "Student Council · Stronger Together"]],
    slots: [
      { key: "tt-1", ratio: "4 / 3", label: "Port of Spain — a photo" },
      { key: "tt-2", ratio: "1 / 1", label: "ISPS" },
      { key: "tt-3", ratio: "4 / 3", label: "Stronger Together" }
    ],
    next: { title: "Next: the United States", lede: "Where it started, and where it is now.", href: "Place-UnitedStates.dc.html", label: "Go to the US" }
  },
  {
    file: "Place-UnitedStates.dc.html", section: "about", parent: { label: "About", href: "About.dc.html" },
    eyebrow: "About · United States", title: "Houston, then Pennsburg", lede: "The country I was born in, and the one I came back to.",
    desc: "Born in Houston during Hurricane Ike; boarding at Perkiomen School in Pennsburg, Pennsylvania since 2025.",
    intro: "I was born in Houston, Texas, on September 13, 2008 — in the middle of Hurricane Ike. Seventeen years and five countries later I came back to the same country, to board at Perkiomen School in Pennsburg, Pennsylvania.",
    body: ["The symbol on this site comes from that first fact: a spiral for the storm, two marks for the wind that has moved me ever since.", "Pennsburg is the first place I have lived without my family in the same building. Health science, HOSA, Model UN, the Perkiomenite, varsity swimming and the rock band all live here."],
    facts: [["Born", "Houston, TX · Sept 13, 2008"], ["Returned", "August 2025"], ["School", "Perkiomen School"]],
    slots: [
      { key: "us-1", ratio: "4 / 3", label: "Houston" },
      { key: "us-2", ratio: "4 / 3", label: "Perkiomen School campus" },
      { key: "us-3", ratio: "1 / 1", label: "Pennsburg" }
    ],
    next: { title: "The academics", lede: "Two schools, and the work that came out of them.", href: "Academics.dc.html", label: "See the academics" }
  },

  /* --------------------------------------------------------- academics ---- */
  {
    file: "Academics-ISPS.dc.html", section: "academics", parent: { label: "Academics", href: "Academics.dc.html" },
    eyebrow: "Academics · Trinidad & Tobago", title: "International School of Port of Spain", lede: "2021–2025. Student Council, and Stronger Together.",
    desc: "ISPS — Student Council and the Stronger Together initiative.",
    intro: "ISPS is where I first took on something school-wide rather than something assigned. Student Council meant representing my class and actually running events; Stronger Together meant building the support I wished had existed.",
    body: ["Stronger Together was a student-led initiative supporting classmates through the return to in-person school after remote learning. The problem was not academic — it was that a lot of people had quietly stopped knowing how to be around each other."],
    facts: [["Years", "2021 – 2025"], ["Roles", "Student Council · Stronger Together"], ["Place", "Port of Spain"]],
    slots: [
      { key: "isps-1", ratio: "4 / 3", label: "ISPS campus" },
      { key: "isps-2", ratio: "4 / 3", label: "Student Council" },
      { key: "isps-3", ratio: "1 / 1", label: "Stronger Together" }
    ],
    next: { title: "Next: Perkiomen", lede: "The health science track, and boarding.", href: "Academics-Perkiomen.dc.html", label: "Go to Perkiomen" }
  },
  {
    file: "Academics-Perkiomen.dc.html", section: "academics", parent: { label: "Academics", href: "Academics.dc.html" },
    eyebrow: "Academics · Pennsylvania", title: "Perkiomen School", lede: "Pennsburg, Pennsylvania. Boarding since August 2025.",
    desc: "Perkiomen School — health science track, HOSA, Model UN, journalism, swimming, and the rock band.",
    intro: "Perkiomen is where the separate threads finally started pointing the same direction. The health science track is the academic spine; almost everything else on this site either feeds it or balances it.",
    body: ["Boarding changed how I work. Nobody schedules your evening for you, which means the difference between a good week and a wasted one is entirely a decision you make on Sunday."],
    facts: [["Arrived", "August 2025"], ["Track", "Health science"], ["Status", "Boarding student"]],
    slots: [
      { key: "perk-1", ratio: "4 / 3", label: "Perkiomen campus" },
      { key: "perk-2", ratio: "4 / 3", label: "In class or lab" },
      { key: "perk-3", ratio: "1 / 1", label: "Dorm life" }
    ],
    next: { title: "Next: Exeter Summer", lede: "A summer of coursework away from home.", href: "Academics-ExeterSummer.dc.html", label: "Go to Exeter Summer" }
  },
  {
    file: "Academics-ExeterSummer.dc.html", section: "academics", parent: { label: "Academics", href: "Academics.dc.html" },
    eyebrow: "Academics · Summer program", title: "Exeter Summer", lede: "Phillips Exeter Academy.",
    desc: "Exeter Summer at Phillips Exeter Academy — coursework and Harkness-style seminars.",
    intro: "Exeter Summer at Phillips Exeter Academy. Exeter teaches around the Harkness table — twelve students, one oval table, and no lecture to hide behind.",
    tbd: "The courses I took, what the Harkness format changed about how I argue, and what I brought back — send these and this page fills in.",
    facts: [["Program", "Exeter Summer"], ["Place", "Exeter, New Hampshire"], ["Details", TBD]],
    slots: [
      { key: "exeter-1", ratio: "4 / 3", label: "Exeter campus" },
      { key: "exeter-2", ratio: "4 / 3", label: "Harkness table" }
    ],
    next: { title: "Next: Comp Bio", lede: "Computational biology at Carnegie Mellon.", href: "Academics-CompBio.dc.html", label: "Go to Comp Bio" }
  },
  {
    file: "Academics-CompBio.dc.html", section: "academics", parent: { label: "Academics", href: "Academics.dc.html" },
    eyebrow: "Academics · Carnegie Mellon", title: "Computational Biology", lede: "Carnegie Mellon University.",
    desc: "Computational biology coursework at Carnegie Mellon — the training behind the CellAtlas GBM project.",
    intro: "Computational biology at Carnegie Mellon. This is the training that makes the glioblastoma work possible: biology asked in a language a computer can actually answer.",
    body: ["It is the clearest example of the direction I am heading — medicine is increasingly a data problem, and I would rather be able to write the analysis than wait for someone else to run it."],
    tbd: "The specific coursework, the tools and languages covered, and the project it produced — send these and this page fills in.",
    facts: [["Institution", "Carnegie Mellon University"], ["Field", "Computational biology"], ["Details", TBD]],
    slots: [
      { key: "cmu-1", ratio: "4 / 3", label: "Carnegie Mellon" },
      { key: "cmu-2", ratio: "4 / 3", label: "Working on the analysis" }
    ],
    next: { title: "The research it feeds", lede: "CellAtlas GBM, in detail.", href: "Research-CellAtlas.dc.html", label: "See CellAtlas GBM" }
  },

  /* ---------------------------------------------------------- research ---- */
  {
    file: "Research-CellAtlas.dc.html", section: "research", parent: { label: "Research & projects", href: "Research.dc.html" },
    eyebrow: "Research · Computational biology", title: "CellAtlas GBM", lede: "Glioblastoma tumour microenvironment.",
    desc: "CellAtlas GBM — a computational look at the glioblastoma tumour microenvironment.",
    intro: "Glioblastoma is the most aggressive primary brain tumour there is, and one reason it resists treatment is that the tumour is not one thing — it is an ecosystem of cell types propping each other up.",
    steps: [
      ["Question", "What cell populations make up the glioblastoma microenvironment, and how do they differ across tumours?"],
      ["Method", "Computational analysis of single-cell data — the work behind the Carnegie Mellon comp-bio training.", true],
      ["Results", TBD, true],
      ["What I learned", TBD, true]
    ],
    tbd: "The dataset, the tools, the figures and where the project stands now — send these and the Question → Method → Results structure above fills in properly.",
    facts: [["Field", "Computational biology · oncology"], ["Focus", "Tumour microenvironment"], ["Status", TBD]],
    slots: [
      { key: "gbm-1", ratio: "16 / 9", label: "A figure from the analysis" },
      { key: "gbm-2", ratio: "4 / 3", label: "Poster or presentation" }
    ],
    next: { title: "Next: the Medical App", lede: "The hospital technology project.", href: "Research-MedicalApp.dc.html", label: "Go to the Medical App" }
  },
  {
    file: "Research-MedicalApp.dc.html", section: "research", parent: { label: "Research & projects", href: "Research.dc.html" },
    eyebrow: "Research · Technology", title: "Medical App", lede: "A medical information platform.",
    desc: "A medical information platform built to make hospital information easier to reach.",
    intro: "A medical information platform — the project where the health science interest turns into something people can actually open and use.",
    body: ["Having sat in waiting rooms in six countries, the gap that keeps showing up is not medical knowledge. It is access to it: the right information, in a language you speak, at the moment you need it."],
    steps: [
      ["Problem", "Medical information is hard to reach at the moment it matters most."],
      ["Built", TBD, true],
      ["Stack", TBD, true],
      ["Where it stands", TBD, true]
    ],
    tbd: "What the app does, who it is for, the stack, and a link or screenshots — send these and this becomes the strongest page on the site.",
    facts: [["Type", "Medical information platform"], ["Role", "Builder"], ["Status", TBD]],
    slots: [
      { key: "app-1", ratio: "16 / 9", label: "App screenshot" },
      { key: "app-2", ratio: "4 / 3", label: "The hospital project" }
    ],
    next: { title: "Next: the publication", lede: "Venezuelan immigration research.", href: "Research-Venezuela.dc.html", label: "Go to the publication" }
  },
  {
    file: "Research-Venezuela.dc.html", section: "research", parent: { label: "Research & projects", href: "Research.dc.html" },
    eyebrow: "Research · Publication", title: "Venezuelan Immigration", lede: "A published paper on Venezuelan migration.",
    desc: "A published paper on Venezuelan migration — the human side of the numbers.",
    intro: "A paper on Venezuelan migration. Having lived in Colombia and Panama — two of the countries that absorbed the largest share of that movement — this is not an abstract topic to me. It is who was in my classrooms.",
    steps: [
      ["Question", "What does Venezuelan migration look like for the people and the countries receiving it?"],
      ["Method", TBD, true],
      ["Findings", TBD, true],
      ["Published in", TBD, true]
    ],
    tbd: "The title, the venue, the abstract and a link to the paper — send these and this page can lead with the citation the way a publication should.",
    facts: [["Type", "Publication"], ["Topic", "Venezuelan migration"], ["Venue", TBD]],
    slots: [
      { key: "vz-1", ratio: "4 / 3", label: "The paper" },
      { key: "vz-2", ratio: "4 / 3", label: "Presenting the work" }
    ],
    next: { title: "Leadership & service", lede: "The work that is not assigned.", href: "Leadership.dc.html", label: "See leadership" }
  },

  /* -------------------------------------------------------- leadership ---- */
  {
    file: "Leadership-HOSA.dc.html", section: "leadership", parent: { label: "Leadership & service", href: "Leadership.dc.html" },
    eyebrow: "Leadership · Founder & President", title: "HOSA", lede: "Future Health Professionals — Perkiomen chapter.",
    desc: "Founded and leads Perkiomen's HOSA chapter — Future Health Professionals.",
    intro: "I founded Perkiomen's HOSA chapter because the school did not have one. HOSA — Future Health Professionals — is the national organisation for students heading into healthcare, and its absence meant anyone interested had nowhere to put that interest.",
    body: ["Founding it meant the usual unglamorous work: a charter, an advisor, a room, and enough people in that room to make it real."],
    steps: [
      ["Founded", "Perkiomen's HOSA chapter, to create opportunities for students interested in healthcare."],
      ["Built", TBD, true],
      ["Impact", TBD, true]
    ],
    tbd: "The events run so far, participation numbers, competition results and anything raised — send these and this page can show impact rather than a title.",
    facts: [["Role", "Founder & President"], ["Organisation", "HOSA"], ["School", "Perkiomen"]],
    slots: [
      { key: "hosa-1", ratio: "4 / 3", label: "HOSA event" },
      { key: "hosa-2", ratio: "4 / 3", label: "HOSA competition" },
      { key: "hosa-3", ratio: "1 / 1", label: "The chapter" }
    ],
    next: { title: "Next: GVMUN", lede: "Directing the press corps.", href: "Leadership-GVMUN.dc.html", label: "Go to GVMUN" }
  },
  {
    file: "Leadership-GVMUN.dc.html", section: "leadership", parent: { label: "Leadership & service", href: "Leadership.dc.html" },
    eyebrow: "Leadership · Director of Journalism", title: "GVMUN", lede: "Global Virtual Model United Nations.",
    desc: "Director of Journalism at GVMUN — running the press corps for the conference.",
    intro: "Director of Journalism for the Global Virtual Model United Nations. Most delegates argue a country's position; the press corps has to describe every position fairly and fast enough to publish while the committee is still sitting.",
    body: ["Model UN taught me to defend a case that is not my own. Running the newsroom taught me the harder version: describing every case in the room accurately, including the ones I disagreed with."],
    steps: [
      ["Role", "Director of Journalism — running the conference press corps."],
      ["Built", TBD, true],
      ["Impact", TBD, true]
    ],
    tbd: "Team size, what the press corps published, and conference scale — send these and this page fills in.",
    facts: [["Role", "Director of Journalism"], ["Conference", "GVMUN"], ["Also", "Model UN delegate"]],
    slots: [
      { key: "gvmun-1", ratio: "4 / 3", label: "GVMUN committee room" },
      { key: "gvmun-2", ratio: "4 / 3", label: "The press corps" }
    ],
    next: { title: "Next: Student Council / Senate", lede: "Representing the room you are sitting in.", href: "Leadership-StudentCouncil.dc.html", label: "Go to student government" }
  },
  {
    file: "Leadership-StudentCouncil.dc.html", section: "leadership", parent: { label: "Leadership & service", href: "Leadership.dc.html" },
    eyebrow: "Leadership · Student government", title: "Student Council / Senate", lede: "Elected to represent classmates — at ISPS, and at Perkiomen.",
    desc: "Student Council at the International School of Port of Spain, and student government at Perkiomen School.",
    intro: "Student government is the least glamorous kind of leadership and the one that taught me the most. Nobody is impressed by it, the wins are small and procedural, and the job is almost entirely listening to people complain and then working out which complaints are actually solvable.",
    body: ["At ISPS I served on Student Council — representing my class, and running school-wide events with the rest of the council. That was also where Stronger Together came from: the council was the room where it became obvious that people needed help coming back to in-person school, not just better assemblies.", "It is the clearest throughline into everything else on this page. Founding HOSA and directing the GVMUN newsroom are both the same instinct, scaled up: notice the gap, then take responsibility for filling it rather than waiting for someone else to."],
    steps: [
      ["ISPS", "Student Council — representing my class and running school-wide events."],
      ["Perkiomen", TBD, true],
      ["Impact", TBD, true]
    ],
    tbd: "Your Perkiomen Senate role and year, what you ran on, and anything the council actually changed — send these and this page fills in.",
    facts: [["Role", "Student Council · Senate"], ["Schools", "ISPS · Perkiomen"], ["Started", "2021"]],
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
    desc: "Hospital shadowing — observing clinical care first-hand.",
    intro: "Shadowing is the part of a medical interest that cannot be read about. You can learn the science from a textbook; you cannot learn what a doctor does in the ninety seconds after delivering bad news.",
    body: ["It is also where the language question stops being theoretical. In a waiting room, being the person who can explain something in Spanish is not a résumé line — it is the difference between a family understanding what is happening and not."],
    tbd: "Where you shadowed, which departments, how many hours, and the moment that stuck with you — send these and this page fills in.",
    facts: [["Type", "Clinical observation"], ["Where", TBD], ["Hours", TBD]],
    slots: [
      { key: "shadow-1", ratio: "4 / 3", label: "At the hospital" },
      { key: "shadow-2", ratio: "1 / 1", label: "Shadowing" }
    ],
    next: { title: "Next: Volunteering", lede: "Community work, in and out of school.", href: "Leadership-Volunteering.dc.html", label: "Go to volunteering" }
  },
  {
    file: "Leadership-Volunteering.dc.html", section: "leadership", parent: { label: "Leadership & service", href: "Leadership.dc.html" },
    eyebrow: "Leadership · Service", title: "Volunteering", lede: "Community work, in and out of school.",
    desc: "Volunteering and community service work.",
    intro: "The service work that sits outside any club structure — the hours that do not come with a title attached.",
    tbd: "Which organisations, what you did, how often, and roughly how many hours — send these and this page fills in.",
    facts: [["Type", "Community service"], ["Where", TBD], ["Hours", TBD]],
    slots: [
      { key: "vol-1", ratio: "4 / 3", label: "Volunteering" },
      { key: "vol-2", ratio: "4 / 3", label: "Community work" }
    ],
    next: { title: "Next: The Perkiomenite", lede: "Writing and editing the school paper.", href: "Leadership-Perkiomenite.dc.html", label: "Go to the Perkiomenite" }
  },
  {
    file: "Leadership-Perkiomenite.dc.html", section: "leadership", parent: { label: "Leadership & service", href: "Leadership.dc.html" },
    eyebrow: "Leadership · Co-Editor", title: "The Perkiomenite", lede: "Perkiomen's school paper.",
    desc: "Co-Editor of the Perkiomenite, Perkiomen School's newspaper.",
    intro: "Co-Editor of the Perkiomenite. Editing is a different skill from writing: most of the job is asking someone else's draft what it is actually trying to say, and then helping it say that.",
    body: ["It pairs with GVMUN more than it looks like it should. Both are about describing something accurately under a deadline, for readers who were not in the room."],
    tbd: "Pieces you have written, what you cover, and the section you edit — send these and this page can link to the work itself.",
    facts: [["Role", "Co-Editor"], ["Paper", "The Perkiomenite"], ["School", "Perkiomen"]],
    slots: [
      { key: "perkmt-1", ratio: "4 / 3", label: "The Perkiomenite" },
      { key: "perkmt-2", ratio: "4 / 3", label: "In the newsroom" }
    ],
    next: { title: "Activities", lede: "Drums, water, weight.", href: "Activities.dc.html", label: "See the activities" }
  },

  /* -------------------------------------------------------- activities ---- */
  {
    file: "Activities-Swimming.dc.html", section: "activities", parent: { label: "Activities", href: "Activities.dc.html" },
    eyebrow: "Activities · Varsity", title: "Swimming", lede: "Perkiomen School varsity — and a Most Improved award.",
    desc: "Varsity swimming at Perkiomen School, including a Most Improved award.",
    intro: "Varsity swimming at Perkiomen. Morning sets, meets, and the part of the day that keeps the rest of it in order.",
    body: ["The award I am proudest of is Most Improved, which is a strange thing to say out loud — it means I started behind. But it is the only award that measures the slope rather than the intercept, and the slope is the part I actually control."],
    facts: [["Level", "Varsity"], ["School", "Perkiomen"], ["Award", "Most Improved"]],
    slots: [
      { key: "swim-1", ratio: "4 / 3", label: "Swim meet" },
      { key: "swim-2", ratio: "4 / 3", label: "In the pool" },
      { key: "swim-3", ratio: "1 / 1", label: "The team" }
    ],
    next: { title: "Next: Weightlifting", lede: "Snatch, clean & jerk, year-round.", href: "Activities-Weightlifting.dc.html", label: "Go to weightlifting" }
  },
  {
    file: "Activities-Weightlifting.dc.html", section: "activities", parent: { label: "Activities", href: "Activities.dc.html" },
    eyebrow: "Activities · Olympic lifting", title: "Weightlifting", lede: "Snatch and clean & jerk, programmed year-round.",
    desc: "Olympic weightlifting — snatch and clean & jerk, trained year-round.",
    intro: "I started lifting because I wanted to be stronger. It turned into the clearest lesson I have in patience: nothing here can be rushed, and the programme only works if you run it for months.",
    body: ["Olympic lifting in particular is unforgiving about technique. You cannot muscle a bad snatch — the lift simply fails, in front of everyone, which is a useful thing to get comfortable with."],
    facts: [["Discipline", "Olympic weightlifting"], ["Lifts", "Snatch · clean & jerk"], ["Training", "Year-round"]],
    slots: [
      { key: "lift-1", ratio: "4 / 3", label: "Lifting session" },
      { key: "lift-2", ratio: "1 / 1", label: "In the gym" }
    ],
    next: { title: "Next: Drums & Music", lede: "Three countries, three bands, one kit.", href: "Activities-Music.dc.html", label: "Go to music" }
  },
  {
    file: "Activities-Music.dc.html", section: "activities", parent: { label: "Activities", href: "Activities.dc.html" },
    eyebrow: "Activities · Three bands", title: "Drums & Music", lede: "SonoArte Panamá, the ISPS musical, and the Perkiomen rock band.",
    desc: "Drumming across three countries — SonoArte Panamá, ISPS musical productions, and the Perkiomen rock band.",
    intro: "I started at SonoArte in Panama, played the ISPS musical productions in Trinidad, and now play in the Perkiomen rock band. Three very different rooms, one kit.",
    quote: { text: "Every school I joined had a room with a kit in it. That is how I met people.", by: "On the drum kit" },
    body: ["That is not a small thing when you change countries every few years. Drumming is the reason arriving somewhere new has never meant arriving alone."],
    facts: [["Bands", "SonoArte · ISPS musical · Perkiomen rock band"], ["Countries", "Panama · Trinidad · United States"], ["Instrument", "Drum kit"]],
    slots: [
      { key: "music-1", ratio: "4 / 3", label: "Behind the kit" },
      { key: "music-2", ratio: "4 / 3", label: "Rock band set" },
      { key: "music-3", ratio: "1 / 1", label: "SonoArte Panamá" }
    ],
    video: { ratio: "16 / 9", label: "Rock band set — video to be supplied" },
    next: { title: "Curiosities", lede: "The things that are not on a form.", href: "Curiosities.dc.html", label: "See the curiosities" }
  },

  /* ------------------------------------------------------- curiosities ---- */
  {
    file: "Curiosities-Literature.dc.html", section: "curiosities", parent: { label: "Curiosities", href: "Curiosities.dc.html" },
    eyebrow: "Curiosities · Reading", title: "Literature", lede: "Long series, read in order, usually late.",
    desc: "Reading — manga, long series, and whatever is currently open.",
    intro: "Mostly manga, mostly long series, mostly read in order and mostly late at night. Long-form serialised storytelling is its own discipline: keeping a thread coherent across hundreds of chapters is a harder problem than most single novels attempt.",
    body: ["Reading in three languages also means noticing how differently the same idea lands depending on which one it arrives in — which is roughly the same skill six countries taught me."],
    tbd: "What you are reading right now, and the series that mattered most — send these and this page gets a proper shelf.",
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
    desc: "Listening — the music six countries left behind, separate from the drumming.",
    intro: "This is the listening half. The playing half — SonoArte, the ISPS musical, the Perkiomen rock band — lives under Activities; this page is about what is actually in my ears the rest of the time.",
    body: ["Moving every few years does something specific to a music taste: you end up with a library that is a map. Reggaeton and banda from Monterrey, vallenato from Bogotá, soca and calypso from Port of Spain, and whatever the rock band was covering that term.", "It is the least deliberate thing on this site. Nothing here was chosen to be interesting — it is just what stuck from each place."],
    tbd: "Your current rotation, the artists that matter most, and a Spotify link if you want one embedded — send these and this page gets a real shelf.",
    facts: [["From", "Mexico · Colombia · Trinidad · US"], ["Also plays", "Drums — see Activities"], ["On repeat", TBD]],
    slots: [
      { key: "music-listen-1", ratio: "4 / 3", label: "Listening — a photo" },
      { key: "music-listen-2", ratio: "1 / 1", label: "Records, headphones, a playlist" }
    ],
    next: { title: "Next: Video games", lede: "Co-op, strategy, and whatever the group is playing.", href: "Curiosities-Videogames.dc.html", label: "Go to video games" }
  },
  {
    file: "Curiosities-Videogames.dc.html", section: "curiosities", parent: { label: "Curiosities", href: "Curiosities.dc.html" },
    eyebrow: "Curiosities · Games", title: "Video games", lede: "Co-op, strategy, and whatever the group is playing.",
    desc: "Video games — co-op, strategy, and staying in touch with people across time zones.",
    intro: "Mostly co-op and strategy, and mostly whatever the group has decided we are playing this month.",
    body: ["Games have done something for me that is easy to undersell: when you leave a country, a shared server is often the last thing you still have in common with the people you left. Several friendships from Panama and Trinidad are still alive largely because of a standing lobby and a bad time-zone overlap."],
    tbd: "The games you actually play, who you play them with, and anything you have built or modded — send these and this page fills in.",
    facts: [["Mostly", "Co-op · strategy"], ["Why it matters", "Friends across six countries"], ["Currently playing", TBD]],
    slots: [
      { key: "games-1", ratio: "16 / 9", label: "A game, or the setup" },
      { key: "games-2", ratio: "1 / 1", label: "Playing with friends" }
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

function renderSteps(steps) {
  if (!steps || !steps.length) return "";
  return `
<section data-reveal="1" style="background:var(--sa-surface-sunken);border-top:var(--sa-hairline);border-bottom:var(--sa-hairline)">
  <div style="width:100%;max-width:1440px;margin:0 auto;padding:var(--sa-band-y) clamp(24px,5vw,64px) var(--sa-band-y) clamp(24px,11vw,168px);box-sizing:border-box">
    <div data-rail-target="1">
      <x-import component-from-global-scope="${NS}.SectionHeading" eyebrow="The work" title="How it breaks down" hint-size="100%,110px"></x-import>
    </div>
    <div data-stagger="1" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:var(--sa-space-5);margin-top:var(--sa-space-10)">
${steps.map(([k, v, pending]) => `      <x-import component-from-global-scope="${NS}.Card" eyebrow="${attr(k)}" title="${attr(pending ? "To be added" : "")}"${pending ? ' meta="{{ soon }}"' : ""} hint-size="100%,170px">${esc(v)}</x-import>`).join("\n")}
    </div>
  </div>
</section>`;
}

function renderPage(p) {
  const group = GROUPS[p.section];
  const siblings = group ? group.items.filter((i) => i.href !== p.file) : [];
  const title = `${p.title} — Santiago Aguilera`;
  const slots = p.slots || [];

  const heroSlot = slots[0];
  const restSlots = slots.slice(1);

  const crumb = p.parent
    ? `      <a href="${p.parent.href}" style="font:var(--sa-type-ui);font-size:var(--sa-text-sm);color:var(--sa-text-muted);text-decoration:none">← ${esc(p.parent.label)}</a>\n`
    : "";

  const bodyParas = (p.body || [])
    .map((t) => `      <p style="font:var(--sa-type-body);color:var(--sa-text-secondary);max-width:60ch;margin-top:var(--sa-space-4);text-wrap:pretty">${esc(t)}</p>`)
    .join("\n");

  const tbdNote = p.tbd
    ? `      <div style="margin-top:var(--sa-space-8);padding:var(--sa-space-5);border-left:3px solid var(--sa-highlight);background:var(--sa-highlight-soft);border-radius:var(--sa-radius-sm)">
        <div style="font:var(--sa-type-eyebrow);letter-spacing:var(--sa-tracking-eyebrow);text-transform:uppercase;color:var(--sa-sienna-500)">Still to add</div>
        <p style="font:var(--sa-type-body);font-size:var(--sa-text-sm);color:var(--sa-ink-800);margin:6px 0 0;text-wrap:pretty">${esc(p.tbd)}</p>
      </div>`
    : "";

  const quote = p.quote
    ? `
<section data-reveal="1" style="width:100%;max-width:1440px;margin:0 auto;padding:var(--sa-space-16) clamp(24px,5vw,64px) var(--sa-space-8) clamp(24px,11vw,168px);box-sizing:border-box">
  <x-import component-from-global-scope="${NS}.Quote" attribution="${attr(p.quote.by)}" hint-size="100%,120px">${esc(p.quote.text)}</x-import>
</section>`
    : "";

  const video = p.video
    ? `
<section data-reveal="1" style="width:100%;max-width:1440px;margin:0 auto;padding:var(--sa-space-8) clamp(24px,5vw,64px) var(--sa-space-16) clamp(24px,11vw,168px);box-sizing:border-box">
  <x-import component-from-global-scope="${NS}.MediaFrame" ratio="${attr(p.video.ratio)}" kind="video" placeholder="${attr(p.video.label)}" caption="${attr(p.video.label)}" hint-size="100%,240px"></x-import>
</section>`
    : "";

  // landing pages lead with a card grid of their children instead of a prose block
  const cards = p.cards
    ? `
<section data-reveal="1" style="width:100%;max-width:1440px;margin:0 auto;padding:var(--sa-space-8) clamp(24px,5vw,64px) var(--sa-space-20) clamp(24px,11vw,168px);box-sizing:border-box">
  <div data-stagger="1" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:var(--sa-space-5)">
${p.cards.map((c) => `    <x-import component-from-global-scope="${NS}.Card" interactive="{{ true }}" href="${attr(c.href)}" eyebrow="${attr(c.eyebrow)}" title="${attr(c.title)}" hint-size="100%,180px">${esc(c.body)}</x-import>`).join("\n")}
  </div>
</section>`
    : "";

  const gallery = restSlots.length
    ? `
<section data-reveal="1" style="width:100%;max-width:1440px;margin:0 auto;padding:var(--sa-space-8) clamp(24px,5vw,64px) var(--sa-space-20) clamp(24px,11vw,168px);box-sizing:border-box">
  <div data-rail-target="1">
    <x-import component-from-global-scope="${NS}.SectionHeading" eyebrow="Photos" title="Add your own" lede="Every frame below is an empty slot — click one to drop a real photo in." hint-size="100%,150px"></x-import>
  </div>
  <div data-stagger="1" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--sa-space-4);margin-top:var(--sa-space-10)">
${restSlots.map((s) => `    <sa-image-slot slot-key="${attr(s.key)}" ratio="${attr(s.ratio)}" placeholder="${attr(s.label)}"></sa-image-slot>`).join("\n")}
  </div>
</section>`
    : "";

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

  const footerCols = [
    { title: "Sections", links: SECTION_LINKS },
    group ? { title: group.title, links: group.items } : null
  ].filter(Boolean);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${attr(p.desc)}">
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(p.desc)}">
<meta property="og:type" content="website">
<script>(function(){try{var t=localStorage.getItem("sa:theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();</script>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="${DS}/styles.css">
<script src="${DS}/_ds_bundle.js"></script>
<script src="assets/photo-slots.js" defer></script>
<style>
body{margin:0;background:var(--sa-surface-page);transition:background-color .15s ease}
a{color:var(--sa-link)}a:hover{color:var(--sa-link-hover)}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
.sa-glow{position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none;z-index:0;opacity:.5}
</style>
</helmet>
<div style="background:var(--sa-surface-page);color:var(--sa-text-primary);font:var(--sa-type-body);min-height:100vh;overflow-x:clip">
<dc-import name="SymbolRail" mode="${p.section === "research" ? "helix" : "unwind"}" hint-size="100%,100%"></dc-import>
<dc-import name="SiteNav" active="${attr(p.section)}" hint-size="100%,72px"></dc-import>

<section style="width:100%;max-width:1440px;margin:0 auto;padding:clamp(40px,6vh,72px) clamp(24px,5vw,64px) var(--sa-space-12) clamp(24px,11vw,168px);box-sizing:border-box">
${crumb}  <span style="display:block;margin-top:var(--sa-space-4);font:var(--sa-type-eyebrow);letter-spacing:var(--sa-tracking-eyebrow);text-transform:uppercase;color:var(--sa-text-accent)">${esc(p.eyebrow)}</span>
  <h1 style="font:var(--sa-type-display);font-size:clamp(2.5rem,5vw,4rem);letter-spacing:var(--sa-tracking-display);margin:var(--sa-space-5) 0 0;max-width:20ch">${esc(p.title)}</h1>
  <p style="font:var(--sa-type-lede);font-size:var(--sa-text-lg);color:var(--sa-text-secondary);max-width:56ch;margin-top:var(--sa-space-6);text-wrap:pretty">${esc(p.lede)}</p>
</section>

<section data-reveal="1" style="width:100%;max-width:1440px;margin:0 auto;padding:0 clamp(24px,5vw,64px) var(--sa-space-16) clamp(24px,11vw,168px);box-sizing:border-box;display:grid;grid-template-columns:minmax(300px,1.05fr) minmax(260px,0.95fr);gap:clamp(32px,5vw,72px);align-items:start">
    <div>
      <p style="font:var(--sa-type-lede);color:var(--sa-text-primary);max-width:60ch;text-wrap:pretty">${esc(p.intro)}</p>
${bodyParas}
${tbdNote}
${renderFacts(p.facts)}
    </div>
${heroSlot ? `    <sa-image-slot slot-key="${attr(heroSlot.key)}" ratio="${attr(heroSlot.ratio)}" placeholder="${attr(heroSlot.label)}"></sa-image-slot>` : "    <div></div>"}
</section>
${cards}${renderSteps(p.steps)}${quote}${video}${gallery}${more}

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

<x-import component-from-global-scope="${NS}.Footer" icon-base="assets/icons/brand" columns="{{ footerColumns }}" socials="{{ footerSocials }}" style="position:relative;z-index:10" hint-size="100%,300px"></x-import>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props="{}">
class Component extends DCLogic {
  renderVals() {
    return {
      true: true,
      soon: React.createElement(window.${NS}.Badge, { tone: "highlight" }, "To be added"),
      footerColumns: ${JSON.stringify(footerCols, null, 8).replace(/\n/g, "\n      ")},
      footerSocials: [
        { id: "instagram", label: "Instagram" },
        { id: "linkedin", label: "LinkedIn", src: "https://unpkg.com/lucide-static@0.469.0/icons/linkedin.svg" },
        { id: "discord", label: "Discord" }
      ]
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

/* ---------------------------------------------------------------- run ---- */

let written = 0;
for (const p of PAGES) {
  fs.writeFileSync(path.join(ROOT, p.file), renderPage(p), "utf8");
  written++;
}
console.log(`generated ${written} pages`);

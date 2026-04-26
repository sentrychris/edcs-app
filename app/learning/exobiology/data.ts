export interface ExobiologyTopic {
  slug: string;
  href: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  status: "available";
  signal: string;
  overview: string[];
  keyPoints: Array<{ label: string; detail: string }>;
  fieldNotes: string[];
  reference: Array<{ label: string; value: string; note: string }>;
}

export const exobiologyTopics: ExobiologyTopic[] = [
  {
    slug:        "biological-signals",
    href:        "/learning/exobiology/biological-signals",
    icon:        "icarus-terminal-scan",
    title:       "Biological Signals",
    subtitle:    "Detection, Classification & Surface Clues",
    description: "How biological signals are detected from orbit, resolved into surface regions, and turned into practical search targets.",
    tags:        ["Signals", "DSS", "Codex"],
    status:      "available",
    signal:      "SCAN: BIOLOGICAL",
    overview: [
      "Exobiology starts before the SRV or suit ever touches the ground. A system survey identifies candidate bodies, the DSS reveals biological signal regions, and the commander narrows that signal into terrain where life is likely to appear.",
      "The important distinction is that a signal says life is present somewhere on the body. It does not guarantee that every patch of highlighted terrain has visible specimens nearby.",
    ],
    keyPoints: [
      { label: "Orbital scan", detail: "DSS mapping reveals biological signal regions and helps decide whether the body is worth landing on." },
      { label: "Signal count", detail: "Multiple signals can represent different genus or species opportunities on the same body." },
      { label: "Surface filter", detail: "The DSS heatmap points toward likely terrain, but commanders still need visual search discipline." },
      { label: "Codex context", detail: "Discovered species are recorded in the Codex and can guide future regional searches." },
    ],
    fieldNotes: [
      "Treat biological regions as search envelopes, not exact pins.",
      "Good approach angles and daylight can matter as much as the scanner result once you are near the ground.",
      "ED:CS body data can help surface candidate planets before a commander spends time flying down to inspect them.",
    ],
    reference: [
      { label: "First signal", value: "DSS region", note: "Shows where a biological signal may appear on the surface." },
      { label: "Ground task", value: "Visual search", note: "Find individual colonies inside the highlighted region." },
      { label: "Record", value: "Codex entry", note: "Species and regional discoveries become commander-facing records." },
    ],
  },
  {
    slug:        "stellar-atmospheric-constraints",
    href:        "/learning/exobiology/stellar-atmospheric-constraints",
    icon:        "icarus-terminal-planet-atmosphere",
    title:       "Stellar & Atmospheric Constraints",
    subtitle:    "Star Type, Atmosphere & Species Niches",
    description: "Why certain species appear under specific star, atmosphere, temperature, pressure, and chemical conditions.",
    tags:        ["Atmosphere", "Star Type", "Habitats"],
    status:      "available",
    signal:      "FILTER: HABITAT",
    overview: [
      "Exobiology is not random decoration. Species availability is constrained by the parent star, body type, atmosphere, temperature band, surface chemistry, pressure, and regional rules.",
      "A useful survey workflow looks for the environmental signature first, then decides which genera are plausible before committing to a landing search.",
    ],
    keyPoints: [
      { label: "Star influence", detail: "Parent star type and radiation environment help shape which biological niches can appear." },
      { label: "Atmosphere", detail: "Thin atmospheres and their composition are major filters for many Odyssey biology finds." },
      { label: "Temperature", detail: "Surface temperature bands can make a body viable for one genus and unsuitable for another." },
      { label: "Chemistry", detail: "Volatiles, minerals, and atmospheric gases help explain why species cluster around certain worlds." },
    ],
    fieldNotes: [
      "The same genus can feel common in one region and rare in another because local stellar populations change the candidate pool.",
      "Atmosphere composition is one of the fastest ways to triage bodies when searching for specific biological targets.",
      "A future ED:CS filter can use body data to narrow candidate worlds by environment before the commander starts travelling.",
    ],
    reference: [
      { label: "Primary filter", value: "Atmosphere", note: "Composition and pressure strongly affect species availability." },
      { label: "System filter", value: "Star class", note: "Changes the pool of viable biological conditions." },
      { label: "Surface filter", value: "Temperature", note: "Helps determine whether a biological niche is possible." },
    ],
  },
  {
    slug:        "genetic-sampling",
    href:        "/learning/exobiology/genetic-sampling",
    icon:        "icarus-terminal-table-index",
    title:       "Genetic Sampling",
    subtitle:    "Distance Rules, Colonies & Sample Validation",
    description: "How the Genetic Sampler validates colonies, why spacing between samples matters, and how commanders complete a species profile.",
    tags:        ["Sampler", "Colonies", "Validation"],
    status:      "available",
    signal:      "SAMPLE: GENETIC",
    overview: [
      "A complete exobiology sample is built from multiple valid samples of the same species. The sampler requires enough distance between colonies so the profile represents genetic variety rather than repeated clones.",
      "That turns surface work into route planning at small scale: land, sample, move far enough, find another colony, and repeat without losing track of the active species.",
    ],
    keyPoints: [
      { label: "First sample", detail: "Starts the active genetic profile for a species and locks the sampler to that species until complete or cleared." },
      { label: "Distance rule", detail: "Additional samples must come from colonies far enough away to count as valid diversity." },
      { label: "Colony search", detail: "Commanders use terrain, lighting, and travel direction to avoid circling the same patch repeatedly." },
      { label: "Validation", detail: "A completed profile can be turned in for exobiology credit after returning to a suitable port." },
    ],
    fieldNotes: [
      "Move in a deliberate line between samples; random loops make it harder to judge whether you have travelled far enough.",
      "Different species can require different spacing, so visual patience beats assuming one fixed distance for everything.",
      "Do not mix targets casually: an active sample profile is a task to finish or abandon cleanly.",
    ],
    reference: [
      { label: "Profile start", value: "Sample 1", note: "Locks the sampler onto the current species." },
      { label: "Validity check", value: "Spacing", note: "Colonies must be far enough apart." },
      { label: "Completion", value: "Full profile", note: "Ready to sell once all required samples are valid." },
    ],
  },
  {
    slug:        "lifeform-families",
    href:        "/learning/exobiology/lifeform-families",
    icon:        "icarus-terminal-planet",
    title:       "Lifeform Families",
    subtitle:    "Bacterium, Stratum, Fonticulua, Tussock & More",
    description: "A field guide to common exobiology genera, how they differ visually, and what search habits they reward.",
    tags:        ["Genera", "Visual Search", "Species"],
    status:      "available",
    signal:      "INDEX: GENERA",
    overview: [
      "Exobiology species are grouped into recognisable families such as Bacterium, Stratum, Fonticulua, Tussock, Osseus, Frutex, Fungoida, Cactoida, Concha, Electrica, and Tubus.",
      "Learning the silhouette of each family is one of the biggest speed upgrades: some sprawl flat across the surface, some stand upright, and some hide against similar-coloured terrain.",
    ],
    keyPoints: [
      { label: "Bacterium", detail: "Often low, flat, and easy to miss from shallow angles or against busy ground textures." },
      { label: "Stratum", detail: "Usually mat-like surface growth that rewards low-altitude scanning and careful contrast checks." },
      { label: "Fonticulua", detail: "More distinctive upright structures that can be easier to spot once terrain is right." },
      { label: "Tussock", detail: "Clumped growths that often stand out as repeated surface tufts across suitable terrain." },
    ],
    fieldNotes: [
      "Use the external camera, SRV turret view, or low ship passes to learn the outline of a genus in different lighting.",
      "Flat genera can be harder to spot than rare ones because they blend into the surface rather than standing above it.",
      "A genus index is most useful when paired with body constraints, because the terrain and atmosphere tell you what to expect.",
    ],
    reference: [
      { label: "Flat search", value: "Bacterium/Stratum", note: "Watch surface contrast and texture changes." },
      { label: "Upright search", value: "Fonticulua/Tussock", note: "Look for silhouettes above the terrain." },
      { label: "Broad index", value: "Genera", note: "Families contain many species and variants." },
    ],
  },
  {
    slug:        "planetary-conditions",
    href:        "/learning/exobiology/planetary-conditions",
    icon:        "icarus-terminal-warning",
    title:       "Planetary Conditions",
    subtitle:    "Gravity, Pressure, Temperature & Volcanism",
    description: "How surface conditions affect biology, landing safety, search speed, and the practical feel of an exobiology run.",
    tags:        ["Gravity", "Pressure", "Volcanism"],
    status:      "available",
    signal:      "SURFACE: CONDITIONS",
    overview: [
      "A planet can be biologically interesting and operationally awkward at the same time. Gravity affects landing and SRV handling, pressure and temperature define the biological niche, and volcanism can change both terrain and risk.",
      "Good exobiology planning reads the body as a workplace, not just a payout source.",
    ],
    keyPoints: [
      { label: "Gravity", detail: "High gravity changes landing risk, suit movement, and recovery margins near rough terrain." },
      { label: "Pressure", detail: "Thin atmosphere pressure helps define which Odyssey biological niches can exist." },
      { label: "Temperature", detail: "Surface temperatures can filter species and affect search expectations." },
      { label: "Volcanism", detail: "Geological activity can add terrain complexity, hazards, and interesting overlap with biological regions." },
    ],
    fieldNotes: [
      "Check gravity before committing to steep approaches or landing in rough terrain.",
      "Daylight is a condition too: the same species can be obvious at noon and nearly invisible near nightfall.",
      "When ED:CS has body condition data, it can flag worlds that are promising but operationally slow or risky.",
    ],
    reference: [
      { label: "Landing risk", value: "Gravity", note: "Higher values reduce mistake tolerance." },
      { label: "Habitat filter", value: "Pressure", note: "Works with composition and temperature." },
      { label: "Terrain cue", value: "Volcanism", note: "May indicate rougher or more complex landing zones." },
    ],
  },
  {
    slug:        "exobiology-route-planning",
    href:        "/learning/exobiology/exobiology-route-planning",
    icon:        "icarus-terminal-route",
    title:       "Exobiology Route Planning",
    subtitle:    "Efficient Search Strategy & Survey Loops",
    description: "How to plan efficient exobiology routes by combining candidate body filters, landing strategy, sample spacing, and turn-in safety.",
    tags:        ["Route Planning", "Efficiency", "Strategy"],
    status:      "available",
    signal:      "ROUTE: BIO-SURVEY",
    overview: [
      "Efficient exobiology is a loop: choose candidate systems, scan bodies, prioritise promising atmospheres, land in good terrain, finish samples cleanly, and keep moving.",
      "The goal is not to visit every biological signal. The goal is to balance payout, rarity, distance, risk, and time so the expedition keeps producing useful data.",
    ],
    keyPoints: [
      { label: "Candidate filter", detail: "Use atmosphere, body type, star class, and known signals to decide where to spend time." },
      { label: "Landing plan", detail: "Pick daylight, manageable terrain, and a search path that supports sample spacing." },
      { label: "Survey loop", detail: "Complete one species at a time, then decide whether the remaining signals justify more time." },
      { label: "Turn-in safety", detail: "Exobiology data only matters if the commander survives long enough to sell it." },
    ],
    fieldNotes: [
      "A route with fewer landings can outperform a dense route if each landing has better candidate quality.",
      "Track which signals are finished so you do not waste time re-searching completed species.",
      "ED:CS can eventually combine body filters, visited systems, and route plotting into targeted bio-survey itineraries.",
    ],
    reference: [
      { label: "Macro route", value: "Systems", note: "Find candidate systems and bodies." },
      { label: "Micro route", value: "Surface path", note: "Move between valid colonies efficiently." },
      { label: "Exit plan", value: "Sell data", note: "Protect the expedition value before pushing deeper." },
    ],
  },
];

export function findExobiologyTopic(slug: string): ExobiologyTopic | undefined {
  return exobiologyTopics.find((topic) => topic.slug === slug);
}

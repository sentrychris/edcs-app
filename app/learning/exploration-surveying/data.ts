export interface ExplorationTopic {
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

export const explorationTopics: ExplorationTopic[] = [
  {
    slug:        "discovery-scanner-fss-dss",
    href:        "/learning/exploration-surveying/discovery-scanner-fss-dss",
    icon:        "icarus-terminal-scan",
    title:       "Discovery Scanner, FSS & DSS",
    subtitle:    "System Honk, Signal Resolve & Surface Mapping",
    description: "The normal exploration workflow: reveal the system, resolve bodies through the FSS, then map selected worlds with the DSS.",
    tags:        ["Discovery", "FSS", "DSS"],
    status:      "available",
    signal:      "WORKFLOW: SURVEY",
    overview: [
      "Exploration is a sequence of increasingly detailed scans. The Discovery Scanner establishes that bodies exist, the Full Spectrum System Scanner resolves them remotely, and the Detailed Surface Scanner maps selected worlds at close range.",
      "For ED:CS, those steps map neatly onto data depth: a system can be known, its bodies can be identified, and high-value targets can be prioritised for detailed mapping.",
    ],
    keyPoints: [
      { label: "Discovery Scanner", detail: "Reveals system signals and gives the commander an initial body count." },
      { label: "FSS", detail: "Resolves body identity, orbital context, composition, and notable signals without flying to each body." },
      { label: "DSS", detail: "Uses probes to surface-map a body for mapping credit, biological leads, and higher exploration value." },
      { label: "Triage", detail: "Explorers decide which bodies deserve close-range mapping based on value, rarity, distance, and goals." },
    ],
    fieldNotes: [
      "A quick honk is useful, but the money and tags usually come from resolving and selling more complete data.",
      "The FSS is the fastest way to decide whether a system has high-value worlds worth a detour.",
      "DSS mapping is most valuable when used selectively: map the worlds that justify the approach time.",
    ],
    reference: [
      { label: "First pass", value: "Discovery Scanner", note: "Reveals the system signal set." },
      { label: "Remote resolve", value: "FSS", note: "Identifies bodies and points of interest." },
      { label: "Close mapping", value: "DSS", note: "Maps surfaces with probes for mapping rewards." },
    ],
  },
  {
    slug:        "high-value-worlds",
    href:        "/learning/exploration-surveying/high-value-worlds",
    icon:        "icarus-terminal-planet",
    title:       "High-Value Worlds",
    subtitle:    "ELWs, Water Worlds, Ammonia Worlds & Terraformables",
    description: "How to recognise the bodies explorers care about most, and why terraformability often matters as much as body class.",
    tags:        ["ELW", "Water World", "Terraformable"],
    status:      "available",
    signal:      "VALUE: HIGH",
    overview: [
      "Not all bodies are equal. Earth-like worlds, water worlds, ammonia worlds, and terraformable candidates sit near the top of most exploration triage lists.",
      "The important skill is not memorising every payout; it is learning which body types deserve attention when you are scanning fast and deciding where to spend DSS probes.",
    ],
    keyPoints: [
      { label: "Earth-like world", detail: "Rare, recognisable, and usually worth mapping whenever found." },
      { label: "Water world", detail: "Often valuable, especially when terraformable or previously unmapped." },
      { label: "Ammonia world", detail: "Biologically interesting and valuable enough to stand out during FSS triage." },
      { label: "Terraformable", detail: "A modifier that can make rocky, high metal content, and water worlds more valuable." },
    ],
    fieldNotes: [
      "Terraformable high metal content worlds can be easy to miss if you only chase obvious Earth-likes.",
      "System maps and FSS descriptions are practical filters: body class, atmosphere, gravity, and star distance all help.",
      "A data UI can surface high-value candidates as a checklist instead of forcing commanders to inspect every body manually.",
    ],
    reference: [
      { label: "Prime target", value: "ELW", note: "Rare and usually worth a full map." },
      { label: "Strong target", value: "Water/ammonia", note: "Good candidates for DSS mapping." },
      { label: "Value modifier", value: "Terraformable", note: "Can significantly raise exploration value." },
    ],
  },
  {
    slug:        "surface-mapping-efficiency",
    href:        "/learning/exploration-surveying/surface-mapping-efficiency",
    icon:        "icarus-terminal-fullscreen",
    title:       "Surface Mapping Efficiency",
    subtitle:    "Probe Radius, Efficiency Bonuses & Body Geometry",
    description: "Why probe placement matters, how efficiency targets shape a mapping run, and how body size changes the feel of DSS work.",
    tags:        ["DSS", "Probes", "Efficiency"],
    status:      "available",
    signal:      "MAPPING: EFFICIENT",
    overview: [
      "DSS mapping is a small geometry puzzle. Each probe covers a surface patch, and the commander is rewarded for mapping the body within the efficiency target.",
      "Body size, probe radius, approach angle, and placement discipline all change how quickly a survey turns into a clean mapped result.",
    ],
    keyPoints: [
      { label: "Probe radius", detail: "The effective surface coverage of each DSS probe after module and engineering effects." },
      { label: "Efficiency target", detail: "The probe-count threshold for earning the efficiency bonus on a body." },
      { label: "Body geometry", detail: "Larger worlds and awkward approach positions require more deliberate placement." },
      { label: "Overlap control", detail: "Excessive overlap wastes probes; clean spacing maps more surface per launch." },
    ],
    fieldNotes: [
      "A common pattern is to place probes around the limb, then fill visible gaps rather than firing at the centre repeatedly.",
      "Small bodies can be mapped quickly, while large worlds reward patience and clean angles.",
      "Efficiency is useful, but it should not override safety near high gravity worlds or awkward orbital approaches.",
    ],
    reference: [
      { label: "Reward", value: "Efficiency bonus", note: "Granted when mapping within the target probe count." },
      { label: "Constraint", value: "Surface coverage", note: "Probes must cover the complete body." },
      { label: "Skill", value: "Placement", note: "Good spacing reduces wasted overlap." },
    ],
  },
  {
    slug:        "first-discovered-first-mapped",
    href:        "/learning/exploration-surveying/first-discovered-first-mapped",
    icon:        "icarus-terminal-table-index",
    title:       "First Discovered / First Mapped",
    subtitle:    "Commander Tags, Data Sale & Survey Credit",
    description: "What discovery and mapping tags mean, how they are earned, and why selling data is the moment that matters.",
    tags:        ["Tags", "Discovery", "Mapping"],
    status:      "available",
    signal:      "CREDIT: CLAIMABLE",
    overview: [
      "First Discovered and First Mapped are permanent commander-facing tags attached to bodies after exploration data is turned in successfully.",
      "They are not just bragging rights: they record who first resolved or mapped a body and then returned that data to Universal Cartographics.",
    ],
    keyPoints: [
      { label: "First Discovered", detail: "Credit for being the first commander to discover and sell data for that body." },
      { label: "First Mapped", detail: "Credit for being the first commander to DSS-map and sell mapping data for that body." },
      { label: "Data sale", detail: "Tags and payouts are finalised when exploration data is sold, not while it sits unsold on the ship." },
      { label: "Risk", detail: "Unsold data can be lost if the ship is destroyed before reaching a turn-in point." },
    ],
    fieldNotes: [
      "A body can already be discovered but still be unmapped, creating a smaller but satisfying survey opportunity.",
      "Long expeditions are partly a data-protection exercise: survival matters until the cartographic sale is complete.",
      "A good exploration UI should distinguish known, discovered, mapped, and personally scanned states where the data allows it.",
    ],
    reference: [
      { label: "Discover tag", value: "First resolved", note: "Awarded after data is sold." },
      { label: "Map tag", value: "First DSS mapped", note: "Also requires selling the mapping data." },
      { label: "Hazard", value: "Unsold data", note: "Can be lost before turn-in." },
    ],
  },
  {
    slug:        "neutron-highway",
    href:        "/learning/exploration-surveying/neutron-highway",
    icon:        "icarus-terminal-route",
    title:       "Neutron Highway",
    subtitle:    "FSD Supercharging, Risks & Routing",
    description: "How neutron-star boosting extends travel range, why it is risky, and how explorers use boosted routing across deep space.",
    tags:        ["Neutron", "Routing", "FSD Boost"],
    status:      "available",
    signal:      "ROUTE: BOOSTED",
    overview: [
      "The Neutron Highway is a travel technique built around FSD supercharging. By passing through a neutron star jet cone, a ship can gain a temporary jump-range boost.",
      "It is powerful, but it is not casual autopilot travel. Jet cones can damage modules, white dwarfs are more dangerous, and every boosted route still depends on fuel, repair planning, and commander control.",
    ],
    keyPoints: [
      { label: "Supercharge", detail: "A temporary FSD boost gained by flying through an appropriate stellar jet cone." },
      { label: "Route chain", detail: "Long journeys can hop between neutron stars to reduce total travel time." },
      { label: "Module wear", detail: "Boosting damages the FSD over time, so AFMU support is valuable on long routes." },
      { label: "Danger zone", detail: "Poor approach, exclusion zones, and white dwarf jets can turn a shortcut into a rebuy." },
    ],
    fieldNotes: [
      "Neutron routing is best treated as a deliberate travel mode, not something to learn while carrying irreplaceable data.",
      "Always check fuel-star availability when chaining boosted jumps through sparse regions.",
      "ED:CS route tools can eventually surface boost-aware paths, warnings, and repair planning cues.",
    ],
    reference: [
      { label: "Boost source", value: "Neutron jet", note: "Used for FSD supercharging." },
      { label: "Support module", value: "AFMU", note: "Repairs FSD damage during long boosted travel." },
      { label: "Primary risk", value: "Control loss", note: "Jet cone mistakes can be fatal." },
    ],
  },
  {
    slug:        "exploration-data-value",
    href:        "/learning/exploration-surveying/exploration-data-value",
    icon:        "icarus-terminal-economy",
    title:       "Exploration Data Value",
    subtitle:    "Payout Drivers, Bonuses & Survey Priority",
    description: "What determines exploration payouts and how commanders decide whether a body is worth scanning, mapping, or skipping.",
    tags:        ["Payouts", "Bonuses", "Triage"],
    status:      "available",
    signal:      "PAYOUT: VARIABLE",
    overview: [
      "Exploration value is shaped by body class, detailed scan state, mapping state, terraformability, first-discovery or first-mapping status, and efficiency bonuses.",
      "For practical explorers, value is a time-management problem: the best route is not always the one that maps everything, but the one that maps the right things for the expedition goal.",
    ],
    keyPoints: [
      { label: "Body class", detail: "Some worlds have a much higher base value than ordinary rocky or icy bodies." },
      { label: "Mapping", detail: "DSS mapping can add meaningful value, especially for high-value bodies." },
      { label: "Terraformability", detail: "Terraformable bodies are often more valuable than similar non-terraformable bodies." },
      { label: "Bonus states", detail: "First tags and efficiency bonuses can improve the final reward profile." },
    ],
    fieldNotes: [
      "Mapping every icy body on a long expedition is rarely efficient unless the goal is completeness.",
      "High-value scanning becomes easier when the UI highlights candidate classes and terraformable states.",
      "A payout estimate should be treated as guidance, because exact values can depend on scan state and game-side rules.",
    ],
    reference: [
      { label: "Base driver", value: "Body type", note: "Class and composition set the starting value." },
      { label: "Major modifier", value: "Terraformable", note: "Often pushes a body into the priority list." },
      { label: "Survey choice", value: "Map or skip", note: "Depends on value, distance, and time cost." },
    ],
  },
];

export function findExplorationTopic(slug: string): ExplorationTopic | undefined {
  return explorationTopics.find((topic) => topic.slug === slug);
}

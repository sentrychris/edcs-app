export interface CartographyTopic {
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

export const cartographyTopics: CartographyTopic[] = [
  {
    slug:        "galactic-coordinates",
    href:        "/learning/galactic-cartography/galactic-coordinates",
    icon:        "icarus-terminal-route",
    title:       "Galactic Coordinates",
    subtitle:    "X/Y/Z Navigation & Sol Origin",
    description: "How ED positions every system in three-dimensional galactic space, why Sol is the practical origin, and how light-year offsets become route data.",
    tags:        ["X/Y/Z", "Sol Origin", "Light-years"],
    status:      "available",
    signal:      "FRAME: CARTESIAN",
    overview: [
      "Every star system can be treated as a point in a three-axis coordinate frame. X, Y, and Z are offsets measured in light-years, which lets route planners and spatial searches reduce the galaxy to distance math.",
      "For ED:CS, those coordinates power nearest-system search, distance calculations, route plotting, and the galaxy-map tile baker. A system name is human-friendly; the coordinate triple is what makes it navigable.",
    ],
    keyPoints: [
      { label: "X axis", detail: "Horizontal galactic-plane offset, useful for east-west separation on map projections." },
      { label: "Y axis", detail: "Vertical offset above or below the galactic plane; sparse high-Y systems can become routing choke points." },
      { label: "Z axis", detail: "Depth through the galactic plane, completing the true 3D distance calculation." },
      { label: "Distance", detail: "Computed with the 3D Euclidean formula, not a flat map measurement." },
    ],
    fieldNotes: [
      "A short-looking jump on a 2D projection may be much longer once vertical Y separation is included.",
      "The same coordinate data can drive both precise API search and broad visual clustering in the galaxy map.",
      "Large-radius searches should always use a bounding volume first, then refine to true spherical distance.",
    ],
    reference: [
      { label: "Unit", value: "Light-year", note: "The standard distance unit for system positions and jump range." },
      { label: "Origin", value: "Sol region", note: "A practical reference point for human-readable galactic offsets." },
      { label: "Distance check", value: "sqrt(dx² + dy² + dz²)", note: "The final exact distance between two systems." },
    ],
  },
  {
    slug:        "spiral-arms-regions",
    href:        "/learning/galactic-cartography/spiral-arms-regions",
    icon:        "icarus-terminal-system-orbits",
    title:       "Spiral Arms & Regions",
    subtitle:    "Named Sectors, Arms & Deep-Space Landmarks",
    description: "A field guide to reading the Milky Way as a layered structure of arms, gaps, sectors, rifts, core regions, and named exploration landmarks.",
    tags:        ["Spiral Arms", "Regions", "Landmarks"],
    status:      "available",
    signal:      "LAYER: REGIONAL",
    overview: [
      "The galaxy is not a uniform disc. It has a dense central bulge, broad spiral-arm structures, sparse gaps between arms, and named regions that explorers use as a shared language.",
      "Cartographic regions help convert raw coordinates into a story: where the commander is, what kind of density to expect, and what route constraints may appear next.",
    ],
    keyPoints: [
      { label: "Core", detail: "Dense central region with short average jump distances and many route alternatives." },
      { label: "Arms", detail: "Long stellar lanes where density stays high enough for conventional travel." },
      { label: "Gaps", detail: "Lower-density space between arms where jump range and fuel planning matter more." },
      { label: "Rifts", detail: "Named sparse regions that often become exploration milestones." },
    ],
    fieldNotes: [
      "Exploration routes often feel easy along arms and suddenly fragile when crossing between them.",
      "Named regions are useful UX labels for galaxy-map tiles, route summaries, and historical travel logs.",
      "The same physical region may matter differently to explorers, traders, and lore hunters.",
    ],
    reference: [
      { label: "Dense route zone", value: "Core", note: "Many systems within short jump range." },
      { label: "Long-range crossing", value: "Arm gap", note: "Fewer stars; route plotting can fail with low jump range." },
      { label: "Navigation label", value: "Region name", note: "Human context layered over raw coordinate data." },
    ],
  },
  {
    slug:        "stellar-density",
    href:        "/learning/galactic-cartography/stellar-density",
    icon:        "icarus-terminal-star",
    title:       "Stellar Density",
    subtitle:    "Core Crowding, Rim Scarcity & Route Choke Points",
    description: "Why plotting near the core feels effortless, why the galactic rim can strand ships, and how density changes affect jump planning.",
    tags:        ["Density", "Routing", "Jump Range"],
    status:      "available",
    signal:      "SCAN: DENSITY",
    overview: [
      "Stellar density changes the practical shape of travel. In dense space, a route planner has many nearby candidates. In sparse space, it may have only one viable bridge - or none.",
      "This matters for ED:CS because route finding is not just shortest-path math; it depends on the local neighbourhood each jump can reach.",
    ],
    keyPoints: [
      { label: "Core density", detail: "Extremely high local candidate count, short legs, and many alternate paths." },
      { label: "Bubble density", detail: "Comfortable navigation with infrastructure, stations, and well-known routes." },
      { label: "Rim density", detail: "Sparse stars make jump range, fuel stars, and manual plotting important." },
      { label: "Vertical sparsity", detail: "High above or below the galactic plane, routes can become fragile quickly." },
    ],
    fieldNotes: [
      "A route algorithm can become slower in very dense regions because every node has many neighbours.",
      "Sparse regions are the opposite: fewer candidates, but failure is more likely if jump range is low.",
      "Density-aware UI can warn commanders before they leave a safe routing envelope.",
    ],
    reference: [
      { label: "Dense region", value: "Many neighbours", note: "Easy routing, larger candidate sets." },
      { label: "Sparse region", value: "Few neighbours", note: "Hard routing, higher chance of gaps." },
      { label: "Critical input", value: "Jump range", note: "Determines reachable neighbourhood radius." },
    ],
  },
  {
    slug:        "nebulae-star-nurseries",
    href:        "/learning/galactic-cartography/nebulae-star-nurseries",
    icon:        "icarus-terminal-planet-atmosphere",
    title:       "Nebulae & Star Nurseries",
    subtitle:    "Gas Clouds, Young Clusters & Visual Beacons",
    description: "How nebulae become navigation landmarks, what different cloud types represent, and why star-forming regions are so rich in young systems.",
    tags:        ["Nebulae", "Clusters", "Star Formation"],
    status:      "available",
    signal:      "OBJECT: NEBULA",
    overview: [
      "Nebulae are both astrophysical structures and navigation beacons. They mark gas, dust, stellar birth, stellar death, or illuminated material across large volumes of space.",
      "In exploration terms, a bright nebula is a target, a waypoint, and a visual anchor that helps commanders maintain orientation across thousands of light-years.",
    ],
    keyPoints: [
      { label: "Emission nebula", detail: "Ionised gas glowing under radiation from hot young stars." },
      { label: "Reflection nebula", detail: "Dust scattering starlight, often blue-white in appearance." },
      { label: "Dark nebula", detail: "Dense dust blocking background stars, visible by what it hides." },
      { label: "Open cluster", detail: "Young stars born together, often near or within nebulous material." },
    ],
    fieldNotes: [
      "Nebulae make excellent long-range navigation targets because they are recognisable at human scale.",
      "Star nurseries often pair beautifully with open clusters, hot stars, and unusual colour palettes.",
      "A cartographic UI can treat nebulae as named anchors layered over raw star positions.",
    ],
    reference: [
      { label: "Emission", value: "Ionised gas", note: "Usually associated with hot young stars." },
      { label: "Reflection", value: "Scattered light", note: "Dust clouds lit by nearby stars." },
      { label: "Dark", value: "Obscuring dust", note: "Seen as a silhouette against the starfield." },
    ],
  },
  {
    slug:        "permit-locked-regions",
    href:        "/learning/galactic-cartography/permit-locked-regions",
    icon:        "icarus-terminal-warning",
    title:       "Permit-Locked Regions",
    subtitle:    "Restricted Volumes & Route Planning Hazards",
    description: "How locked systems and regions change navigation, why plotted routes can fail, and how commanders route around restricted space.",
    tags:        ["Permits", "Restricted", "Routing"],
    status:      "available",
    signal:      "ACCESS: RESTRICTED",
    overview: [
      "Not every visible star is reachable. Permit locks can apply to single systems or broad regions, turning apparent route options into blocked nodes.",
      "For a route planner, restricted space behaves like terrain. It does not change distance, but it changes which edges are legal to traverse.",
    ],
    keyPoints: [
      { label: "System permit", detail: "A single named system requires access before it can be entered." },
      { label: "Region lock", detail: "A larger volume of space is inaccessible, often for narrative or future-content reasons." },
      { label: "Route failure", detail: "A path may look geometrically valid but still fail when locked nodes are excluded." },
      { label: "Detour planning", detail: "Commanders route around blocked volumes by finding bridge systems along the boundary." },
    ],
    fieldNotes: [
      "Permit locks are a good reason to keep route errors explanatory instead of simply returning no path.",
      "Restricted regions can make nearby visible stars misleading: distance alone is not reachability.",
      "A future galaxy map layer could mark lock boundaries or warn when a route approaches them.",
    ],
    reference: [
      { label: "Reachable", value: "Unlocked node", note: "Can participate in ordinary route plotting." },
      { label: "Blocked", value: "Permit node", note: "Visible but excluded unless access is known." },
      { label: "Workaround", value: "Boundary detour", note: "Skirt the locked volume through accessible neighbours." },
    ],
  },
  {
    slug:        "galaxy-scale",
    href:        "/learning/galactic-cartography/galaxy-scale",
    icon:        "icarus-terminal-fullscreen",
    title:       "Galaxy Scale",
    subtitle:    "1:1 Milky Way, Tiles & Exploration Distance",
    description: "How to think about the Milky Way at Elite scale: thousands of light-years, enormous datasets, tile systems, and the difference between map scale and travel scale.",
    tags:        ["Scale", "Tiles", "Exploration"],
    status:      "available",
    signal:      "SCALE: GALACTIC",
    overview: [
      "Elite Dangerous models the galaxy at a scale where ordinary UI assumptions break down. A single table cannot carry the whole map; a route cannot inspect every system; a renderer must stream layers.",
      "Galactic cartography is therefore about compression, levels of detail, and making vast distances understandable without pretending they are small.",
    ],
    keyPoints: [
      { label: "Human scale", detail: "A commander thinks in jumps, refuels, sessions, and expeditions." },
      { label: "Map scale", detail: "The galaxy map thinks in sectors, tiles, LODs, and visible density." },
      { label: "API scale", detail: "Spatial endpoints need indexes, bounding volumes, and pagination." },
      { label: "Exploration scale", detail: "Even well-known routes touch a tiny fraction of the total starfield." },
    ],
    fieldNotes: [
      "The galaxy-map tile baker exists because shipping every system to the browser at once is the wrong scale.",
      "A low-detail overview should preserve structure; high-detail tiles should reveal local star patterns.",
      "Scale-aware interfaces avoid giving users a blank screen while still respecting the size of the dataset.",
    ],
    reference: [
      { label: "LOD", value: "Level of detail", note: "Lower detail for overview, higher detail when zoomed in." },
      { label: "Tile", value: "Spatial chunk", note: "A bounded file or query region used for streaming." },
      { label: "Route unit", value: "Jump", note: "The travel-scale step commanders actually experience." },
    ],
  },
];

export function findCartographyTopic(slug: string): CartographyTopic | undefined {
  return cartographyTopics.find((topic) => topic.slug === slug);
}

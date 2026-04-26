import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";

export const metadata: Metadata = {
  title: "Learning Resources | ED:CS",
  description: "Interactive guides and simulations exploring the science behind Elite Dangerous.",
};

const modules = [
  {
    href:        "/learning/star-systems",
    icon:        "icarus-terminal-star",
    title:       "Star Systems",
    subtitle:    "Gravitational Mechanics & Stability",
    description: "Explore how multiple stars remain gravitationally stable. Interactive simulations covering binary pairs, hierarchical triples, and orbital resonance.",
    tags:        ["Simulation", "Astrophysics", "Multi-Star"],
    status:      "available",
  },
  {
    href:        "/learning/galactic-cartography",
    icon:        "icarus-terminal-route",
    title:       "Galactic Cartography",
    subtitle:    "Coordinates, Regions & Exploration Scale",
    description: "Learn how commanders read the galaxy as a navigable dataset: X/Y/Z coordinates, spiral arms, stellar density, nebulae, permit locks, and map scale.",
    tags:        ["Coordinates", "Galaxy Map", "Exploration"],
    status:      "available",
  },
  {
    href:        "/learning/exploration-surveying",
    icon:        "icarus-terminal-scan",
    title:       "Exploration & Surveying",
    subtitle:    "Scanning, Mapping & Data Value",
    description: "Practical field guides for exploration workflow, high-value worlds, DSS efficiency, discovery tags, neutron routing, and survey payouts.",
    tags:        ["Exploration", "DSS", "Survey Data"],
    status:      "available",
  },
  {
    href:        "/learning/exobiology",
    icon:        "icarus-terminal-planet-atmosphere",
    title:       "Exobiology",
    subtitle:    "Biological Signals & Sampling",
    description: "Odyssey biology guides covering signal detection, atmospheric constraints, genetic sampling, species families, surface conditions, and efficient bio-survey routes.",
    tags:        ["Biology", "Odyssey", "Sampling"],
    status:      "available",
  },
  {
    href:        "/learning/stations-infrastructure",
    icon:        "icarus-terminal-system-orbits",
    title:       "Stations, Settlements & Infrastructure",
    subtitle:    "Ports, Services & Surface Facilities",
    description: "Operational guides for station types, economies, services, planetary ports, fleet carriers, and Odyssey settlement layouts.",
    tags:        ["Stations", "Services", "Settlements"],
    status:      "available",
  },
  {
    href:        "/learning/market-economy",
    icon:        "icarus-terminal-economy",
    title:       "Market & Economy",
    subtitle:    "Commodity Flow & Trade Context",
    description: "Learn how supply, demand, economy pairings, rare goods, BGS states, carrier markets, and trade margins shape profitable routes.",
    tags:        ["Markets", "Trade Routes", "BGS"],
    status:      "available",
  },
  {
    href:        "/learning/thargoids-guardians",
    icon:        "icarus-terminal-warning",
    title:       "Thargoids & Guardians",
    subtitle:    "Xeno Sites, Artefacts & Conflict",
    description: "A lore-and-practice archive for Thargoid contacts, Guardian structures, artefacts, AX combat, war sites, and human-xeno history.",
    tags:        ["Xeno", "Guardian", "AX"],
    status:      "available",
  },
  {
    href:        "/learning/engineering-materials",
    icon:        "icarus-terminal-table-index",
    title:       "Engineering & Materials",
    subtitle:    "Blueprints, Unlocks & Gathering",
    description: "Practical guides for material categories, traders, blueprint grades, experimental effects, Guardian unlocks, Odyssey gear, and gathering loops.",
    tags:        ["Engineering", "Materials", "Unlocks"],
    status:      "available",
  },
  {
    href:        "/learning/orbital-mechanics",
    icon:        "icarus-terminal-system-orbits",
    title:       "Orbital Mechanics",
    subtitle:    "Forces, Equilibria & Resonance",
    description: "Dive into the physics governing how bodies move through space. Lagrange points, orbital resonance, tidal locking, and the forces that shape every system.",
    tags:        ["Simulation", "Physics", "Orbital Mechanics"],
    status:      "available",
  },
  {
    href:        "/learning/stellar-physics",
    icon:        "icarus-terminal-star",
    title:       "Stellar Physics",
    subtitle:    "Classification, Evolution & Remnants",
    description: "Explore the science of stars themselves — how they are classified by temperature and colour, how they evolve over billions of years, and what they leave behind.",
    tags:        ["Spectral Types", "Main Sequence", "Stellar Evolution"],
    status:      "available",
  },
  {
    href:        "/learning/planetary-science",
    icon:        "icarus-terminal-planet",
    title:       "Planetary Science",
    subtitle:    "Classification, Atmospheres & Habitability",
    description: "How worlds are categorised by composition, atmosphere, and temperature. Covers rocky bodies, water worlds, Earth-likes, and the Sudarsky gas giant classes.",
    tags:        ["Body Types", "Atmospheres", "Habitability"],
    status:      "available",
  },
];

export default function LearningPage() {
  return (
    <>
      {/* ── Terminal header ── */}
      <TerminalHeader
        moduleLabel="MODULE:LEARNING"
        protocolLabel="DATABASE:EDUCATIONAL"
        statusLabel="INDEX: LOADED"
      />

      <BreadcrumbNav
        backHref="/"
        backLabel="Home"
        rightIcon="icarus-terminal-planet"
        rightLabel="MODULE - KNOWLEDGE BASE"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Learning Resources
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Interactive Simulations &amp; Field Guides
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600">
            <span className="fx-dot-blue h-1.5 w-1.5" />
            <span>{modules.length} module{modules.length !== 1 ? "s" : ""} available</span>
          </div>
        </div>
      </Panel>

      {/* ── Module list ── */}
      <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Available Modules" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {modules.map((mod) => (
            <Link key={mod.href} href={mod.href} className="group block">
              <div className="relative border border-sky-900/20 p-4 transition-colors hover:border-sky-700/40 hover:bg-sky-950/10">
                <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                <span className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                <span className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-sky-500/40 transition-colors group-hover:border-sky-500/70" />

                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <i className={`${mod.icon} text-glow__blue text-xl`} />
                    <div>
                      <p className="text-glow__white text-sm font-bold uppercase tracking-wide">
                        {mod.title}
                      </p>
                      <p className="text-[0.65rem] uppercase tracking-widest text-sky-400/60">
                        {mod.subtitle}
                      </p>
                    </div>
                  </div>
                  {mod.status === "available" && (
                    <span className="shrink-0 text-[0.6rem] uppercase tracking-widest text-green-500/70">
                      Available
                    </span>
                  )}
                </div>

                <p className="mb-3 text-xs uppercase tracking-wide text-neutral-500">
                  {mod.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {mod.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-sky-900/30 px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-neutral-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Panel>
    </>
  );
}

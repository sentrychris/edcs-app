import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";

export const metadata: Metadata = {
  title: "Planetary Science | Learning Resources | ED:CS",
  description: "Simulations and reference guides exploring planetary classification, atmospheres, geology, and habitability.",
};

const topics = [
  {
    href:        "/learning/planetary-science/planetary-classification",
    icon:        "icarus-terminal-planet",
    title:       "Planetary Classification",
    subtitle:    "Rocky, Atmospheric & Gas Giant Bodies",
    description: "How worlds are categorised by composition, atmosphere, and temperature. Covers rocky bodies, water worlds, ammonia worlds, Earth-likes, and the Sudarsky gas giant classes.",
    tags:        ["Classification", "Body Types", "ELW"],
    status:      "available",
  },
  {
    href:        "/learning/planetary-science/habitable-zones",
    icon:        "icarus-terminal-planet-life",
    title:       "Habitable Zones",
    subtitle:    "The Goldilocks Zone & Liquid-Water Worlds",
    description: "Where in a system can a planet hold liquid water? How HZ distance scales dramatically with stellar luminosity, and why M-dwarfs and O-types both struggle to host life.",
    tags:        ["HZ", "Goldilocks", "ELW Hunting"],
    status:      "available",
  },
  {
    href:        "/learning/planetary-science/atmospheres",
    icon:        "icarus-terminal-planet",
    title:       "Atmospheres",
    subtitle:    "Composition, Pressure & the Greenhouse Effect",
    description: "Atmospheric structure and the physics that determine surface conditions. Compares Mars, Earth, Titan, Venus, and Jupiter to show how scale height and composition shape every world.",
    tags:        ["Pressure", "Composition", "Landability"],
    status:      "available",
  },
  {
    href:        "/learning/planetary-science/planetary-interiors",
    icon:        "icarus-terminal-planet",
    title:       "Planetary Interiors",
    subtitle:    "Differentiation, Cores & Tidal Heating",
    description: "What lies beneath the surface. Half-sphere cross-sections of Mercury, Earth, Mars, Europa, and Jupiter showing layered cores, mantles, and the heat sources that keep some worlds active.",
    tags:        ["Cross-sections", "Cores", "Tidal Heating"],
    status:      "available",
  },
  {
    href:        "/learning/planetary-science/magnetospheres",
    icon:        "icarus-terminal-shield",
    title:       "Magnetospheres",
    subtitle:    "Magnetic Fields, Solar Wind & Auroras",
    description: "How a planet's dynamo creates a magnetic shield against the solar wind. Bow shock, magnetotail, polar cusps, and the auroras lit by particles that leak through.",
    tags:        ["Dynamo", "Solar Wind", "Auroras"],
    status:      "available",
  },
];

export default function PlanetarySciencePage() {
  return (
    <>
      {/* ── Terminal header ── */}
      <TerminalHeader
        moduleLabel="MODULE:LEARNING"
        protocolLabel="DATABASE:PLANETARY-SCIENCE"
        statusLabel={`${topics.length} topic${topics.length !== 1 ? "s" : ""} indexed`}
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-planet text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Planetary Science
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Classification, Atmospheres &amp; Habitability
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/learning"
        backLabel="Learning Resources"
        rightIcon="icarus-terminal-planet"
        rightLabel="MODULE — PLANETARY SCIENCE"
      />

      {/* ── Topic list ── */}
      <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Topics" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {topics.map((topic) => (
            <Link key={topic.href} href={topic.href} className="group flex h-full flex-col">
              <div className="relative flex h-full flex-col border border-sky-900/20 p-4 transition-colors hover:border-sky-700/40 hover:bg-sky-950/10">
                <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                <span className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                <span className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-sky-500/40 transition-colors group-hover:border-sky-500/70" />

                <div className="mb-3 flex items-start justify-between gap-2">
                  <i className={`${topic.icon} text-glow__blue text-xl`} />
                  {topic.status === "available" && (
                    <span className="text-[0.6rem] uppercase tracking-widest text-green-500/70">Available</span>
                  )}
                </div>

                <p className="text-glow__white mb-0.5 text-sm font-bold uppercase tracking-wide">
                  {topic.title}
                </p>
                <p className="mb-3 text-[0.65rem] uppercase tracking-widest text-sky-400/60">
                  {topic.subtitle}
                </p>

                <p className="mb-3 flex-1 text-xs uppercase tracking-wide text-neutral-500">
                  {topic.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {topic.tags.map((tag) => (
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

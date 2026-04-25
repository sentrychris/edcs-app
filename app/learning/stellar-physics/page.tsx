import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";

export const metadata: Metadata = {
  title: "Stellar Physics | Learning Resources | ED:CS",
  description: "Simulations and reference guides exploring the physics of stars — classification, evolution, and remnants.",
};

const topics = [
  {
    href:        "/learning/stellar-physics/stellar-classification",
    icon:        "icarus-terminal-star",
    title:       "Stellar Classification",
    subtitle:    "The Morgan–Keenan Spectral Sequence",
    description: "How stars are sorted by temperature, colour, and luminosity. Covers the OBAFGKM main sequence, fuel scoopability in Elite Dangerous, and what lies beyond.",
    tags:        ["Main Sequence", "Spectral Types", "Habitable Zones"],
    status:      "available",
  },
  {
    href:        "/learning/stellar-physics/stellar-remnants",
    icon:        "icarus-terminal-star",
    title:       "Stellar Remnants",
    subtitle:    "White Dwarfs, Neutron Stars & Black Holes",
    description: "What stars leave behind when nuclear fusion ends. Three distinct endpoints determined by initial mass — each with radically different properties and exploration value.",
    tags:        ["White Dwarf", "Neutron Star", "Black Hole"],
    status:      "available",
  },
  {
    href:        "/learning/stellar-physics/stellar-nucleosynthesis",
    icon:        "icarus-terminal-star",
    title:       "Stellar Nucleosynthesis",
    subtitle:    "How Stars Forge the Elements",
    description: "The onion-shell structure of a massive star moments before supernova. Each layer fuses a different fuel — and every atom heavier than helium was made this way.",
    tags:        ["Fusion", "Onion Shell", "Element Origins"],
    status:      "available",
  },
];

export default function StellarPhysicsPage() {
  return (
    <>
      {/* ── Terminal header ── */}
      <TerminalHeader
        moduleLabel="MODULE:LEARNING"
        protocolLabel="DATABASE:STELLAR-PHYSICS"
        statusLabel={`${topics.length} topic${topics.length !== 1 ? "s" : ""} indexed`}
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-star text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Stellar Physics
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Classification, Evolution &amp; Remnants
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/learning"
        backLabel="Learning Resources"
        rightIcon="icarus-terminal-star"
        rightLabel="MODULE — STELLAR PHYSICS"
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

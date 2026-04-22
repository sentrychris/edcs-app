import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";

export const metadata: Metadata = {
  title: "Star Systems | Learning Resources | ED:CS",
  description: "Explore how different star system configurations form and remain gravitationally stable.",
};

const configurations = [
  {
    href:        "/learning/star-systems/single-star",
    icon:        "icarus-terminal-star",
    title:       "Single Star",
    subtitle:    "Stellar Zones & Planetary Orbits",
    description: "The simplest system configuration. A lone star with a defined habitable zone, snow line, and orbiting bodies at varying distances.",
    tags:        ["Common", "Habitable Zone", "Planetary Science"],
    frequency:   "~56% of known systems",
    status:      "available",
  },
  {
    href:        "/learning/star-systems/binary-pair",
    icon:        "icarus-terminal-system-orbits",
    title:       "Binary Pair",
    subtitle:    "Two Stars, One Barycenter",
    description: "Two stars locked in mutual orbit around a shared center of mass. The most common multi-star configuration, with complex overlapping habitable zones.",
    tags:        ["Multi-Star", "Barycenter", "Orbital Mechanics"],
    frequency:   "~33% of known systems",
    status:      "available",
  },
  {
    href:        "/learning/star-systems/hierarchical-triple",
    icon:        "icarus-terminal-star",
    title:       "Hierarchical Triple",
    subtitle:    "Binary Pair + Distant Companion",
    description: "A stable three-star configuration where a tight inner binary is orbited by a third, more distant star. Long-term stability requires a large separation ratio.",
    tags:        ["Triple Star", "Hierarchical", "Stability"],
    frequency:   "~8% of known systems",
    status:      "available",
  },
];

export default function StarSystemsIndexPage() {
  return (
    <>
      {/* ── Terminal header ── */}
      <div className="fx-chamfer relative mb-5 border border-sky-900/40 bg-black/50 backdrop-blur backdrop-filter px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-3">
            <span>MODULE:LEARNING</span>
            <span className="hidden sm:inline text-neutral-800">■</span>
            <span className="hidden sm:inline">DATABASE:STELLAR-MECHANICS</span>
            <span className="hidden md:inline text-neutral-800">■</span>
            <span className="hidden md:inline">CLASS:UNRESTRICTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-blue h-1.5 w-1.5" />
            <span>{configurations.length} configurations indexed</span>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-6 py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-star text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Star Systems
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Gravitational Mechanics &amp; System Configurations
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Breadcrumb ── */}
      <div className="mb-5 flex items-center justify-between text-xs uppercase tracking-widest text-neutral-500">
        <Link href="/learning" className="flex items-center gap-2 transition-colors hover:text-sky-400">
          <i className="icarus-terminal-chevron-left text-xs" />
          Learning Resources
        </Link>
        <span className="flex items-center gap-2 text-neutral-700">
          <i className="icarus-terminal-star text-sky-500/20" />
          MODULE — STAR SYSTEMS
        </span>
      </div>

      {/* ── Configuration list ── */}
      <Panel variant="muted" className="fx-chamfer p-5">
        <SectionHeader icon="icarus-terminal-scan" title="System Configurations" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {configurations.map((config) => (
            <Link key={config.href} href={config.href} className="group flex h-full flex-col">
              <div className="relative flex h-full flex-col border border-sky-900/20 p-4 transition-colors hover:border-sky-700/40 hover:bg-sky-950/10">
                <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                <span className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                <span className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-sky-500/40 transition-colors group-hover:border-sky-500/70" />

                <div className="mb-3 flex items-start justify-between gap-2">
                  <i className={`${config.icon} text-glow__blue text-xl`} />
                  {config.status === "available" && (
                    <span className="text-[0.6rem] uppercase tracking-widest text-green-500/70">Available</span>
                  )}
                </div>

                <p className="text-glow__white mb-0.5 text-sm font-bold uppercase tracking-wide">
                  {config.title}
                </p>
                <p className="mb-3 text-[0.65rem] uppercase tracking-widest text-sky-400/60">
                  {config.subtitle}
                </p>

                <p className="mb-3 flex-1 text-xs uppercase tracking-wide text-neutral-500">
                  {config.description}
                </p>

                <div className="mb-3 border-t border-sky-900/20 pt-3">
                  <span className="text-[0.6rem] uppercase tracking-widest text-neutral-700">
                    {config.frequency}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {config.tags.map((tag) => (
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

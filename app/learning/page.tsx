import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";

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
    tags:        ["Simulation", "Astrophysics", "Orbital Mechanics"],
    status:      "available",
  },
];

export default function LearningPage() {
  return (
    <>
      {/* ── Terminal header ── */}
      <div className="fx-chamfer relative mb-5 border border-sky-900/40 bg-black/50 backdrop-blur backdrop-filter px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-3">
            <span>MODULE:LEARNING</span>
            <span className="hidden sm:inline text-neutral-800">■</span>
            <span className="hidden sm:inline">DATABASE:EDUCATIONAL</span>
            <span className="hidden md:inline text-neutral-800">■</span>
            <span className="hidden md:inline">CLASS:UNRESTRICTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-blue h-1.5 w-1.5" />
            <span>INDEX: LOADED</span>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-6 py-5">
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
      <Panel variant="muted" className="fx-chamfer p-5">
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

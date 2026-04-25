import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TripleStarSimulation from "./components/triple-star-simulation";

export const metadata: Metadata = {
  title: "Hierarchical Triple | Star Systems | Learning Resources | ED:CS",
  description: "How three stars remain stable with an inner binary pair and a distant outer companion.",
};

const StatBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-sky-900/20 px-3 py-2">
    <p className="mb-0.5 text-[0.6rem] uppercase tracking-widest text-neutral-600">{label}</p>
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">{value}</p>
  </div>
);

export default function HierarchicalTriplePage() {
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
            <span>SIMULATION: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-star text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Hierarchical Triple
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Binary Pair + Distant Companion
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Breadcrumb ── */}
      <div className="mb-5 flex items-center justify-between text-xs uppercase tracking-widest text-neutral-500">
        <Link href="/learning/star-systems" className="flex items-center gap-2 transition-colors hover:text-sky-400">
          <i className="icarus-terminal-chevron-left text-xs" />
          Star Systems
        </Link>
        <span className="hidden items-center gap-2 text-neutral-700 sm:flex">
          <i className="icarus-terminal-star text-sky-500/20" />
          CONFIGURATION — HIERARCHICAL TRIPLE
        </span>
      </div>

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Simulation panel ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-system-orbits" title="Hierarchical Triple System" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[360px] flex-1">
              <TripleStarSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-neutral-600">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#FFD080]" />
                  Star A — Yellow-White (2.0 M☉)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#A0C8FF]" />
                  Star B — Blue-White (1.4 M☉)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#FF8060]" />
                  Star C — Red-Orange (1.0 M☉)
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-xs uppercase tracking-widest text-neutral-700">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-400/40" />
                  System barycenter
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-300/35" />
                  Binary barycenter (A+B)
                </span>
              </div>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">
          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="System Parameters" />
            <div className="grid grid-cols-2 gap-2">
              <StatBadge label="Star A mass"  value="2.0 M☉" />
              <StatBadge label="Star B mass"  value="1.4 M☉" />
              <StatBadge label="Star C mass"  value="1.0 M☉" />
              <StatBadge label="Binary sep."  value="120 AU" />
              <StatBadge label="Outer orbit"  value="260 AU" />
              <StatBadge label="Period ratio" value="4:1" />
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="Stability Conditions" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                A triple system is stable when the outer body orbits at a distance roughly
                3–5× the inner binary separation. This is called a{" "}
                <span className="text-sky-400/80">hierarchical</span> configuration.
              </p>
              <p>
                Stars A and B form a tight{" "}
                <span className="text-sky-400/80">binary pair</span>, revolving around
                their common center of mass. From Star C&apos;s perspective, A+B behave as a single
                combined mass.
              </p>
              <p>
                Star C&apos;s gravity causes the binary barycenter to{" "}
                <span className="text-sky-400/80">wobble slightly</span> relative
                to the system center. The simulation exaggerates this effect for visibility.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="Instability Factors" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                "Orbital resonance between inner and outer periods",
                "High orbital eccentricity in either orbit",
                "Mutual inclination exceeding ~40°",
                "Outer separation less than 3× inner separation",
              ].map((factor) => (
                <div key={factor} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-sky-500/40 text-[0.6rem]" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

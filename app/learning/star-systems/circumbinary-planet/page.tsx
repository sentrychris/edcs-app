import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import CircumbinarySimulation from "./components/circumbinary-simulation";

export const metadata: Metadata = {
  title: "Circumbinary Planet | Star Systems | Learning Resources | ED:CS",
  description: "How a planet can orbit two stars simultaneously and what it takes to remain stable.",
};

const StatBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-sky-900/20 px-3 py-2">
    <p className="mb-0.5 text-[0.6rem] uppercase tracking-widest text-neutral-600">{label}</p>
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">{value}</p>
  </div>
);

export default function CircumbinaryPlanetPage() {
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
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-6 py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-planet text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Circumbinary Planet
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              P-Type Orbit Around a Binary Pair
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
        <span className="flex items-center gap-2 text-neutral-700">
          <i className="icarus-terminal-planet text-sky-500/20" />
          CONFIGURATION — CIRCUMBINARY PLANET
        </span>
      </div>

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Simulation panel ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-system-orbits" title="Circumbinary System" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-0 flex-1">
              <CircumbinarySimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-neutral-600">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#FFD080]" />
                  Star A (1.0 M☉)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#FFB060]" />
                  Star B (0.8 M☉)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#80C8FF]" />
                  Planet (P-type orbit)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-px w-4 border-t border-dashed border-red-500/40" />
                  Stability limit
                </span>
              </div>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">
          <Panel variant="muted" className="fx-chamfer p-5">
            <SectionHeader icon="icarus-terminal-scan" title="System Parameters" />
            <div className="grid grid-cols-2 gap-2">
              <StatBadge label="Star A mass"      value="1.0 M☉" />
              <StatBadge label="Star B mass"      value="0.8 M☉" />
              <StatBadge label="Binary sep."      value="80 AU" />
              <StatBadge label="Planet orbit"     value="280 AU" />
              <StatBadge label="Orbit ratio"      value="3.5×" />
              <StatBadge label="Stability min."   value="~2.8×" />
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-5">
            <SectionHeader icon="icarus-terminal-info" title="P-Type Orbits" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                A <span className="text-sky-400/80">P-type</span> (planet-type) orbit encircles
                both stars. The planet treats the binary as a single gravitational source from
                a distance. Contrast with <span className="text-sky-400/80">S-type</span> orbits,
                which hug one star tightly.
              </p>
              <p>
                A <span className="text-amber-400/70">forbidden zone</span> exists between the
                binary separation and the stability limit. Any orbit within it is chaotically
                disrupted by the constantly shifting gravitational field of the two stars.
              </p>
              <p>
                The planet experiences <span className="text-sky-400/80">variable illumination</span>
                — the combined brightness from both stars changes as their relative positions
                shift, producing complex seasons unlike anything in a single-star system.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-5">
            <SectionHeader icon="icarus-terminal-star" title="Known Examples" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { name: "Kepler-16b",  detail: "First confirmed, orbits two cool stars" },
                { name: "Kepler-34b",  detail: "Two Sun-like stars, ~1 AU separation" },
                { name: "Kepler-35b",  detail: "Near-equal mass binary pair" },
                { name: "TOI-1338b",   detail: "Discovered by a teenager via TESS" },
              ].map(({ name, detail }) => (
                <div key={name} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-sky-500/40 text-[0.6rem]" />
                  <span><span className="text-neutral-400">{name}</span> — {detail}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

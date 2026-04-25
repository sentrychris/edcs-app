import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import SingleStarSimulation from "./components/single-star-simulation";

export const metadata: Metadata = {
  title: "Single Star | Star Systems | Learning Resources | ED:CS",
  description: "Stellar zones, habitable bands, and planetary orbital stability around a lone star.",
};

const StatBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-sky-900/20 px-3 py-2">
    <p className="mb-0.5 text-[0.6rem] uppercase tracking-widest text-neutral-600">{label}</p>
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">{value}</p>
  </div>
);

export default function SingleStarPage() {
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
              Single Star
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Stellar Zones &amp; Planetary Orbits
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
          CONFIGURATION — SINGLE STAR
        </span>
      </div>

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Simulation panel ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-star" title="Single Star System" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[360px] flex-1">
              <SingleStarSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-neutral-600">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#FFD080]" />
                  Host star (G-type)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#60C880]" />
                  Terran world
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-1.5 w-2 rounded-sm" style={{ background: "rgba(80,200,100,0.4)" }} />
                  Habitable zone
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-px w-4 border-t border-dashed border-sky-400/40" />
                  Snow line
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
              <StatBadge label="Star type"   value="G-type" />
              <StatBadge label="Star mass"   value="1.0 M☉" />
              <StatBadge label="HZ inner"    value="140 AU" />
              <StatBadge label="HZ outer"    value="220 AU" />
              <StatBadge label="Snow line"   value="290 AU" />
              <StatBadge label="Bodies"      value="5" />
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="Stellar Zones" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                The <span className="text-green-400/80">habitable zone</span> is the range of
                orbital distances where liquid water can exist on a rocky surface, determined
                by the star&apos;s luminosity and temperature.
              </p>
              <p>
                The <span className="text-sky-400/80">snow line</span> marks the distance
                beyond which water ice and other volatiles condense. Gas giants tend to form
                beyond this boundary where icy material is abundant.
              </p>
              <p>
                Inner rocky worlds form in the hot, volatile-poor region closer to the star.
                Their orbits remain stable as long as they don&apos;t enter{" "}
                <Link className="text-sky-400/80 hover:text-sky-300" href="/learning/orbital-mechanics/orbital-resonance">orbital resonance</Link> with each other.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-planet" title="Body Classifications" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { label: "Rocky I & II", desc: "Hot inner worlds, likely tidally locked" },
                { label: "Terran", desc: "Within habitable zone, potential for life" },
                { label: "Gas Giant", desc: "Beyond snow line, volatile-rich" },
                { label: "Ice Giant", desc: "Outer system, icy composition" },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-sky-500/40 text-[0.6rem]" />
                  <span><span className="text-neutral-400">{label}</span> — {desc}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

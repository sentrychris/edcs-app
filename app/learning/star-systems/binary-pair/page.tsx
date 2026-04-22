import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import BinaryStarSimulation from "./components/binary-star-simulation";

export const metadata: Metadata = {
  title: "Binary Pair | Star Systems | Learning Resources | ED:CS",
  description: "How two stars orbit a shared center of mass and what that means for planetary stability.",
};

const StatBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-sky-900/20 px-3 py-2">
    <p className="mb-0.5 text-[0.6rem] uppercase tracking-widest text-neutral-600">{label}</p>
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">{value}</p>
  </div>
);

export default function BinaryPairPage() {
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
          <i className="icarus-terminal-system-orbits text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Binary Pair
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Two Stars, One Barycenter
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
          <i className="icarus-terminal-system-orbits text-sky-500/20" />
          CONFIGURATION — BINARY PAIR
        </span>
      </div>

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Simulation panel ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-system-orbits" title="Binary Star System" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-0 flex-1">
              <BinaryStarSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-neutral-600">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#FFD080]" />
                  Star A — Yellow-White (1.8 M☉)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#A0C8FF]" />
                  Star B — Blue-White (1.0 M☉)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-400/40" />
                  Barycenter
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
              <StatBadge label="Star A mass"    value="1.8 M☉" />
              <StatBadge label="Star B mass"    value="1.0 M☉" />
              <StatBadge label="Mass ratio"     value="1.8 : 1" />
              <StatBadge label="Separation"     value="180 AU" />
              <StatBadge label="A orbit radius" value="64 AU" />
              <StatBadge label="B orbit radius" value="116 AU" />
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-5">
            <SectionHeader icon="icarus-terminal-info" title="How It Works" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Neither star orbits the other — both orbit their shared{" "}
                <span className="text-sky-400/80">barycenter</span>, the system's true center
                of mass. The more massive star orbits closer to it.
              </p>
              <p>
                The barycenter position depends entirely on the{" "}
                <span className="text-sky-400/80">mass ratio</span>. Equal masses place it
                exactly halfway; unequal masses shift it toward the heavier star.
              </p>
              <p>
                Planets can achieve stable orbits either very close to one star
                (<span className="text-sky-400/80">S-type</span>) or far enough out to orbit
                both stars together (<span className="text-sky-400/80">P-type</span>).
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-5">
            <SectionHeader icon="icarus-terminal-planet" title="Planetary Orbits" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                "S-type: tight orbit around a single star",
                "P-type: wide orbit enclosing both stars",
                "Unstable zone between ~3× and ~0.3× separation",
                "Habitable zones may overlap or be disrupted",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-sky-500/40 text-[0.6rem]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}

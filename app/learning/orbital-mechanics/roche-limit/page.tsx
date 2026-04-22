import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import RocheLimitSimulation from "./components/roche-limit-simulation";

export const metadata: Metadata = {
  title: "Roche Limit | Orbital Mechanics | Learning Resources | ED:CS",
  description: "The critical distance inside which tidal forces overcome a body's self-gravity, tearing it apart into a ring system.",
};

const StatBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-sky-900/20 px-3 py-2">
    <p className="mb-0.5 text-[0.6rem] uppercase tracking-widest text-neutral-600">{label}</p>
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">{value}</p>
  </div>
);

const examples = [
  {
    name:   "Saturn's rings",
    detail: "Entirely within Saturn's Roche limit. The rings cannot coalesce into a moon — any clump that forms is immediately torn apart again by tidal forces.",
  },
  {
    name:   "Comet Shoemaker-Levy 9",
    detail: "Passed inside Jupiter's Roche limit in 1992 and was shredded into a chain of 21 fragments. Two years later each struck Jupiter in sequence.",
  },
  {
    name:   "Phobos (Mars)",
    detail: "Mars's inner moon is currently inside the Roche limit for loose rubble and slowly spiralling inward. In ~30–50 million years it will disintegrate into a ring.",
  },
  {
    name:   "Tidal disruption events",
    detail: "Stars that pass too close to a supermassive black hole are shredded at the Roche limit, producing a brief luminous flare as the debris accretes.",
  },
];

export default function RocheLimitPage() {
  return (
    <>
      {/* ── Terminal header ── */}
      <div className="fx-chamfer relative mb-5 border border-sky-900/40 bg-black/50 backdrop-blur backdrop-filter px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-3">
            <span>MODULE:LEARNING</span>
            <span className="hidden sm:inline text-neutral-800">■</span>
            <span className="hidden sm:inline">DATABASE:ORBITAL-MECHANICS</span>
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
          <i className="icarus-terminal-planet-ringed text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Roche Limit
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Tidal Disruption &amp; Ring Formation
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Breadcrumb ── */}
      <div className="mb-5 flex items-center justify-between text-xs uppercase tracking-widest text-neutral-500">
        <Link href="/learning/orbital-mechanics" className="flex items-center gap-2 transition-colors hover:text-sky-400">
          <i className="icarus-terminal-chevron-left text-xs" />
          Orbital Mechanics
        </Link>
        <span className="flex items-center gap-2 text-neutral-700">
          <i className="icarus-terminal-planet-ringed text-sky-500/20" />
          SIMULATION — ROCHE LIMIT
        </span>
      </div>

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Simulation panel ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-planet-ringed" title="Tidal Disruption Event" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-0 flex-1">
              <RocheLimitSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-neutral-600">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#506090]" />
                  Primary body (planet)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#C8A870]" />
                  Satellite / debris
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-px w-4 border-t border-dashed border-orange-500/50" />
                  Roche limit
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-red-500/60" />
                  Tidal force vectors
                </span>
              </div>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-5">
            <SectionHeader icon="icarus-terminal-scan" title="Parameters" />
            <div className="grid grid-cols-2 gap-2">
              <StatBadge label="Formula"      value="d = 2.456 R(ρM/ρm)⅓" />
              <StatBadge label="Rigid body"   value="d ≈ 1.26 R(M/m)⅓" />
              <StatBadge label="Saturn rings" value="Within 2.46 R♄" />
              <StatBadge label="Phobos fate"  value="~40 Myr remaining" />
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-5">
            <SectionHeader icon="icarus-terminal-info" title="The Physics" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Every orbiting body experiences a <span className="text-sky-400/80">tidal force</span> —
                the difference in gravitational pull between its near side (stronger) and far
                side (weaker). This stretches the body radially.
              </p>
              <p>
                Outside the Roche limit, the body&apos;s own{" "}
                <span className="text-green-400/80">self-gravity</span> is strong enough to
                hold it together despite the tidal stretching. Inside, tidal forces win and
                the body is torn apart.
              </p>
              <p>
                The debris settles into a <span className="text-sky-400/80">ring</span> at
                the disruption radius. Any clump that begins to re-aggregate is immediately
                re-shredded — the rings are stable but cannot consolidate into a moon.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-5">
            <SectionHeader icon="icarus-terminal-warning" title="Two Limits" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              <div className="flex items-start gap-2">
                <i className="icarus-terminal-chevron-right mt-0.5 text-sky-500/40 text-[0.6rem]" />
                <span><span className="text-neutral-400">Fluid body</span> — d ≈ 2.44 R. Lower density satellite disrupts at larger distance</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="icarus-terminal-chevron-right mt-0.5 text-sky-500/40 text-[0.6rem]" />
                <span><span className="text-neutral-400">Rigid body</span> — d ≈ 1.26 R. Structural strength adds resistance to tidal forces</span>
              </div>
              <div className="flex items-start gap-2">
                <i className="icarus-terminal-chevron-right mt-0.5 text-sky-500/40 text-[0.6rem]" />
                <span><span className="text-neutral-400">Below both limits</span> — even rigid bodies are shredded; observed in tidal disruption events near black holes</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Examples ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Real Examples" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {examples.map((ex) => (
            <div key={ex.name} className="border border-sky-900/20 p-3">
              <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-neutral-300">{ex.name}</p>
              <p className="text-xs uppercase tracking-wide text-neutral-600">{ex.detail}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

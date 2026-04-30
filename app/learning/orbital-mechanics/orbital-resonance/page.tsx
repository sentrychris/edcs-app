import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import OrbitalResonanceSimulation from "./components/orbital-resonance-simulation";

export const metadata: Metadata = {
  title: "Orbital Resonance | Orbital Mechanics | Learning Resources | ED:CS",
  description: "How planets locked in integer period ratios reinforce each other's orbits and shape entire systems.",
};

const StatBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-sky-900/20 px-3 py-2">
    <p className="mb-0.5 text-[0.7rem] uppercase tracking-widest text-neutral-600">{label}</p>
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">{value}</p>
  </div>
);

const examples = [
  {
    name:    "Io / Europa / Ganymede",
    ratio:   "1 : 2 : 4",
    type:    "Laplace resonance",
    detail:  "Jupiter's three inner moons. The most studied resonance chain in the solar system. Io's volcanic activity is driven by tidal heating from this lock.",
  },
  {
    name:    "Neptune / Pluto",
    ratio:   "2 : 3",
    type:    "Mean-motion resonance",
    detail:  "Pluto completes exactly 2 orbits for every 3 Neptune completes. This resonance protects Pluto from close encounters with Neptune despite crossing its orbit.",
  },
  {
    name:    "TRAPPIST-1 system",
    ratio:   "8 : 5 : 3 : 2",
    type:    "Resonance chain",
    detail:  "Four of seven planets in a near-perfect resonance chain. This tightly packed system owes its long-term stability almost entirely to the resonance locking.",
  },
  {
    name:    "Kirkwood Gaps",
    ratio:   "1:3, 1:2, 2:5",
    type:    "Destabilising resonance",
    detail:  "Gaps in the asteroid belt where Jupiter's resonance repeatedly perturbs orbits until objects are ejected. Resonance clears as well as protects.",
  },
];

export default function OrbitalResonancePage() {
  return (
    <>
      {/* ── Terminal header ── */}
      <TerminalHeader
        moduleLabel="MODULE:LEARNING"
        protocolLabel="DATABASE:ORBITAL-MECHANICS"
        statusLabel="SIMULATION: ACTIVE"
      />

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/learning/orbital-mechanics"
        backLabel="Orbital Mechanics"
        rightIcon="icarus-terminal-system-orbits"
        rightLabel="SIMULATION — ORBITAL RESONANCE"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-system-orbits text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Orbital Resonance
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Period Locking &amp; Resonance Chains
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Simulation panel ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-system-orbits" title="1 : 2 : 4 Laplace Resonance" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[360px] flex-1">
              <OrbitalResonanceSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-neutral-600">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#60B8FF]" />
                  Planet A — period 1T
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#60DD90]" />
                  Planet B — period 2T
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#FFB347]" />
                  Planet C — period 4T
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/30" />
                  Conjunction dots
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
              <StatBadge label="Resonance"    value="1 : 2 : 4"  />
              <StatBadge label="Type"         value="Laplace"     />
              <StatBadge label="A period"     value="1T"          />
              <StatBadge label="B period"     value="2T"          />
              <StatBadge label="C period"     value="4T"          />
              <StatBadge label="Cycle length" value="4T"          />
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="How It Works" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Two bodies are in <span className="text-sky-400/80">mean-motion resonance</span> when
                their orbital periods form a simple integer ratio. Each time they
                align — a <span className="text-sky-400/80">conjunction</span> — they receive
                the same gravitational nudge in the same direction.
              </p>
              <p>
                Repeated nudges at the same orbital phase can either{" "}
                <span className="text-green-400/80">reinforce stability</span> (as with
                Jupiter&apos;s moons) or{" "}
                <span className="text-amber-400/70">clear a region</span> (as with
                Kirkwood gaps in the asteroid belt) depending on the geometry.
              </p>
              <p>
                In the <span className="text-sky-400/80">Laplace resonance</span>, the
                three-body interaction means the conjunctions are always offset by
                120° — no two pairs ever align simultaneously, preventing a
                destabilising triple conjunction.
              </p>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Examples table ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Known Resonances" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {examples.map((ex) => (
            <div key={ex.name} className="border border-sky-900/20 p-3">
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-neutral-300">{ex.name}</p>
                  <p className="text-[0.65rem] uppercase tracking-widest text-sky-400/60">{ex.type}</p>
                </div>
                <span className="shrink-0 text-sm font-bold tracking-widest text-sky-400/80">{ex.ratio}</span>
              </div>
              <p className="text-xs uppercase tracking-wide text-neutral-600">{ex.detail}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

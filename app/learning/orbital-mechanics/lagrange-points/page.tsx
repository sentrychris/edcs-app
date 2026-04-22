import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import LagrangePointsSimulation from "./components/lagrange-points-simulation";

export const metadata: Metadata = {
  title: "Lagrange Points | Orbital Mechanics | Learning Resources | ED:CS",
  description: "The five gravitational equilibrium points that exist in every two-body orbital system.",
};

const StatBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-sky-900/20 px-3 py-2">
    <p className="mb-0.5 text-[0.6rem] uppercase tracking-widest text-neutral-600">{label}</p>
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">{value}</p>
  </div>
);

const points = [
  {
    label:   "L1",
    stable:  false,
    where:   "Between the two bodies",
    use:     "Solar observation (SOHO, DSCOVR)",
    detail:  "Gravity from both bodies balances. Ideal for monitoring the primary, but any perturbation causes drift.",
  },
  {
    label:   "L2",
    stable:  false,
    where:   "Beyond the smaller body",
    use:     "Deep space telescopes (JWST, Herschel)",
    detail:  "Always in the shadow of the secondary. Cold and stable enough for infrared instruments.",
  },
  {
    label:   "L3",
    stable:  false,
    where:   "Beyond the larger body, hidden",
    use:     "Theoretically none — always out of view",
    detail:  "The least useful point. Perpetually blocked by the primary and slowly perturbed by other bodies.",
  },
  {
    label:   "L4",
    stable:  true,
    where:   "60° ahead of secondary",
    use:     "Trojan asteroids, long-term debris",
    detail:  "Forms an equilateral triangle with both bodies. Objects here librate slowly and remain for billions of years.",
  },
  {
    label:   "L5",
    stable:  true,
    where:   "60° behind secondary",
    use:     "Trojan asteroids, proposed space stations",
    detail:  "Mirror of L4. Jupiter's Trojans share this point with thousands of asteroids. Proposed for future colonies.",
  },
];

export default function LagrangePointsPage() {
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
          <i className="icarus-terminal-system-orbits text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Lagrange Points
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Five Equilibria in Every Two-Body System
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
          <i className="icarus-terminal-system-orbits text-sky-500/20" />
          SIMULATION — LAGRANGE POINTS
        </span>
      </div>

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Simulation panel ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-system-orbits" title="Co-Rotating Reference Frame" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-0 flex-1">
              <LagrangePointsSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-neutral-600">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#FFD080]" />
                  Star (primary)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#80B0FF]" />
                  Planet (secondary)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-400/80" />
                  L4 / L5 — stable
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-amber-400/80" />
                  L1 / L2 / L3 — unstable
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400/40" />
                  Trojan particles
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
              <StatBadge label="Mass ratio"    value="50 : 1" />
              <StatBadge label="L-points"      value="5 total" />
              <StatBadge label="Stable"        value="L4, L5" />
              <StatBadge label="Unstable"      value="L1, L2, L3" />
              <StatBadge label="L4/L5 angle"   value="±60°" />
              <StatBadge label="Triangle type" value="Equilateral" />
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-5">
            <SectionHeader icon="icarus-terminal-info" title="How They Form" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Lagrange points arise where the gravitational pull of two large bodies and the
                centrifugal force of the rotating system exactly cancel.
                An object placed at one requires no thrust to maintain its position.
              </p>
              <p>
                <span className="text-sky-400/80">L4 and L5</span> are stable because any
                small displacement creates a restoring force — the Coriolis effect nudges
                the object back, causing it to trace slow ellipses called{" "}
                <span className="text-sky-400/80">libration orbits</span>.
              </p>
              <p>
                <span className="text-amber-400/70">L1, L2, and L3</span> are saddle points.
                A displacement along the axis leads away from equilibrium. Spacecraft stationed
                there require periodic stationkeeping burns.
              </p>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Point reference table ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Point Reference" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {points.map((pt) => (
            <div key={pt.label} className="border border-sky-900/20 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className={`text-sm font-bold uppercase tracking-widest ${pt.stable ? "text-green-400/90" : "text-amber-400/80"}`}>
                  {pt.label}
                </span>
                <span className={`text-[0.6rem] uppercase tracking-widest ${pt.stable ? "text-green-500/60" : "text-amber-500/50"}`}>
                  {pt.stable ? "Stable" : "Unstable"}
                </span>
              </div>
              <p className="mb-1 text-[0.65rem] uppercase tracking-widest text-neutral-500">{pt.where}</p>
              <p className="mb-2 text-[0.65rem] uppercase tracking-widest text-sky-400/50">{pt.use}</p>
              <p className="text-xs uppercase tracking-wide text-neutral-600">{pt.detail}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

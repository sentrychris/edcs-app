import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import WarpWormholesSimulation from "./components/warp-wormholes-simulation";

export const metadata: Metadata = {
  title: "Warp & Wormholes | Relativity & Spacetime | Learning Resources | ED:CS",
  description: "Alcubierre warp bubbles, Einstein–Rosen bridges, and the speculative physics of faster-than-light travel — including the Frame Shift Drive's narrative debt to general relativity.",
};

const StatBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-sky-900/20 px-3 py-2">
    <p className="mb-0.5 text-[0.7rem] uppercase tracking-widest text-neutral-600">{label}</p>
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">{value}</p>
  </div>
);

const examples = [
  {
    name:    "Alcubierre 1994",
    detail:  "Miguel Alcubierre's paper 'The warp drive: hyper-fast travel within general relativity' showed that GR admits bubble solutions where contracted spacetime ahead and expanded spacetime behind let an interior observer travel between two points faster than light without locally exceeding c. The catch: it needs negative-energy stress.",
    badge:   "GR-valid metric",
  },
  {
    name:    "Morris–Thorne (1988)",
    detail:  "Kip Thorne and Mike Morris worked out what a *traversable* wormhole would actually require: smooth metric, no horizons, and a throat held open by exotic matter violating the null energy condition. The paper grew out of a question Carl Sagan asked while drafting Contact.",
    badge:   "Contact origin",
  },
  {
    name:    "Negative energy density",
    detail:  "Every known FTL or wormhole solution violates the Averaged Null Energy Condition. Quantum field theory permits localised negative energies (Casimir cavities, squeezed states), but never enough — quantum inequalities seem to forbid macroscopic, persistent, traversable amounts.",
    badge:   "ANEC violation",
  },
  {
    name:    "Frame Shift Drive (ED)",
    detail:  "ED's FSD borrows the warp-bubble conceit verbatim. The ship doesn't accelerate through space; spacetime itself is reshaped around the hull, so the cockpit clock keeps station with the bubble while the galaxy slides past. Hyperspace jumps add an Einstein–Rosen-flavoured discontinuity at the destination.",
    badge:   "ED narrative",
  },
];

export default function WarpWormholesPage() {
  return (
    <>
      {/* ── Terminal header ── */}
      <TerminalHeader
        moduleLabel="MODULE:LEARNING"
        protocolLabel="DATABASE:RELATIVITY-SPACETIME"
        statusLabel="SIMULATION: ACTIVE"
      />

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/learning/relativity-spacetime"
        backLabel="Relativity & Spacetime"
        rightIcon="icarus-terminal-system-orbits"
        rightLabel="SIMULATION — WARP & WORMHOLES"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-system-orbits text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Warp &amp; Wormholes
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Alcubierre Drives, ER Bridges &amp; the FSD
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
              <SectionHeader icon="icarus-terminal-system-orbits" title="Two FTL Geometries" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[640px] flex-1 md:min-h-[460px]">
              <WarpWormholesSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-neutral-600">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#9CDCFF" }} />
                  Warp bubble (locally flat interior)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#B898FF" }} />
                  Wormhole mouths
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#FFEBA0" }} />
                  Ship transit
                </span>
              </div>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="Key Concepts" />
            <div className="grid grid-cols-2 gap-2">
              <StatBadge label="Alcubierre"     value="Bubble metric"    />
              <StatBadge label="Wormhole"       value="Topological"      />
              <StatBadge label="Required"       value="Exotic matter"    />
              <StatBadge label="Energy"         value="ρ < 0"            />
              <StatBadge label="Locally"        value="v < c always"     />
              <StatBadge label="Globally"       value="v_eff > c"        />
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="What's Happening" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                <span className="text-sky-400/80">Alcubierre warp:</span> the ship sits inside
                a bubble of locally-flat spacetime. Outside the bubble walls, space contracts
                ahead and expands behind, so the bubble itself moves through the larger
                spacetime faster than light would on a flat path — without anything inside
                the bubble locally exceeding c.
              </p>
              <p>
                <span className="text-sky-400/80">Wormhole:</span> two regions of spacetime
                glued together at a throat. A ship enters one mouth, traverses a short
                interior length, and emerges from the second mouth in an arbitrarily distant
                location — no FTL travel, just a different topology.
              </p>
              <p>
                Both solutions are{" "}
                <span className="text-amber-400/80">mathematically valid in GR</span>, but
                both demand stress-energy with negative density. Whether physical fields can
                provide that at macroscopic scales remains the open question.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="Caveats" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                "ANEC violation — no known classical field provides it",
                "Quantum inequalities limit how much exotic matter can persist",
                "Alcubierre bubble walls form horizons — interior can't signal ahead",
                "Wormhole throats collapse without continuous exotic-matter support",
                "Both solutions enable closed timelike curves — causality concerns",
                "Chronology Protection Conjecture (Hawking) suggests nature forbids them",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-sky-500/40 text-[0.7rem]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Examples ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Where We See It" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {examples.map((ex) => (
            <div key={ex.name} className="border border-sky-900/20 p-3">
              <div className="mb-2 flex items-start justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wide text-neutral-300">{ex.name}</p>
                <span className="shrink-0 text-[0.7rem] uppercase tracking-widest text-sky-400/60">{ex.badge}</span>
              </div>
              <p className="text-xs uppercase tracking-wide text-neutral-600">{ex.detail}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

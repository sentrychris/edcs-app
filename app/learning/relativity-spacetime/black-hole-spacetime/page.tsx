import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import BlackHoleSpacetimeSimulation from "./components/black-hole-spacetime-simulation";

export const metadata: Metadata = {
  title: "Black Hole Spacetime | Relativity & Spacetime | Learning Resources | ED:CS",
  description: "Event horizons, photon spheres, ergospheres, frame dragging — the canonical surfaces of Schwarzschild and Kerr spacetimes, compared side by side.",
};

const StatBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-sky-900/20 px-3 py-2">
    <p className="mb-0.5 text-[0.6rem] uppercase tracking-widest text-neutral-600">{label}</p>
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">{value}</p>
  </div>
);

const examples = [
  {
    name:    "M87* (EHT 2019)",
    detail:  "The first directly imaged supermassive black hole. The bright ring is the photon sphere, gravitationally lensed into a circle; the dark central shadow is ~2.6 × the event horizon, broadened by lensing. Mass: ~6.5 × 10⁹ M☉.",
    badge:   "First image",
  },
  {
    name:    "Sagittarius A* (EHT 2022)",
    detail:  "Our galaxy's central SMBH, imaged after years of effort. Variability complicates reconstruction, but the ring structure matches Kerr predictions for ~4 × 10⁶ M☉, with a spin parameter constrained to a/M ≳ 0.5 — moderately rapidly rotating.",
    badge:   "4 × 10⁶ M☉",
  },
  {
    name:    "GW150914 ringdown (2015)",
    detail:  "The first detected gravitational wave. After two black holes merged, the remnant 'rang down' through Kerr quasi-normal modes. The frequencies recovered a single Kerr black hole of ~62 M☉ with a/M ≈ 0.67 — direct confirmation of Kerr geometry from a real merger.",
    badge:   "First GW + Kerr test",
  },
  {
    name:    "Penrose process",
    detail:  "Inside the ergosphere, an object can carry negative energy as measured at infinity. Splitting an object so the negative-energy fragment falls in extracts rotational energy from the black hole. Believed to power the relativistic jets of active galactic nuclei.",
    badge:   "Ergosphere physics",
  },
];

export default function BlackHoleSpacetimePage() {
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
        rightLabel="SIMULATION — BLACK HOLE SPACETIME"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-system-orbits text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Black Hole Spacetime
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Event Horizons, Ergospheres &amp; Frame Dragging
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
              <SectionHeader icon="icarus-terminal-system-orbits" title="Schwarzschild vs Kerr — Equatorial Slice" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[640px] flex-1 md:min-h-[460px]">
              <BlackHoleSpacetimeSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-neutral-600">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#000", boxShadow: "0 0 4px rgba(255,180,90,0.6)" }} />
                  Event horizon
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#B898E8" }} />
                  Ergosphere (Kerr only)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#FFB098" }} />
                  ISCO
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#FFE8B0" }} />
                  Test particle orbits
                </span>
              </div>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="Key Surfaces" />
            <div className="grid grid-cols-2 gap-2">
              <StatBadge label="Schwarzschild rₛ" value="2M"            />
              <StatBadge label="Photon sphere"    value="1.5 rₛ"        />
              <StatBadge label="Schw. ISCO"       value="3 rₛ = 6M"     />
              <StatBadge label="Kerr r₊"          value="M + √(M²−a²)" />
              <StatBadge label="Static limit"     value="2M (equator)"  />
              <StatBadge label="Extremal Kerr"    value="a = M"         />
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="What's Different" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                <span className="text-sky-400/80">Schwarzschild</span> describes a
                non-rotating, uncharged black hole — a single event horizon at rₛ, a
                photon sphere where light orbits, and a fixed ISCO at 6M.
              </p>
              <p>
                <span className="text-sky-400/80">Kerr</span> adds rotation. The horizon
                shrinks and is wrapped by an{" "}
                <span className="text-amber-400/80">ergosphere</span> — a region where
                spacetime is dragged faster than any observer can resist, so no rest
                frame exists. Inside, you must corotate.
              </p>
              <p>
                Kerr also reveals an{" "}
                <span className="text-sky-400/80">inner Cauchy horizon</span> r₋, prograde
                and retrograde ISCOs at very different radii (2.32M vs 8.7M for a/M=0.9),
                and the ability to{" "}
                <span className="text-amber-400/80">extract energy</span> from the spin.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="Things to Notice" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                "All real astrophysical black holes are Kerr — collapse preserves angular momentum",
                "The ergosphere bulges at the equator and meets the horizon at the poles",
                "Frame dragging extends well beyond the ergosphere, falling off as 1/r³",
                "Prograde orbits can reach much closer than retrograde orbits",
                "Penrose's process and the Blandford–Znajek mechanism tap rotational energy",
                "Spin shapes the photon ring observed by the Event Horizon Telescope",
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

      {/* ── Examples ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Where We See It" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {examples.map((ex) => (
            <div key={ex.name} className="border border-sky-900/20 p-3">
              <div className="mb-2 flex items-start justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wide text-neutral-300">{ex.name}</p>
                <span className="shrink-0 text-[0.6rem] uppercase tracking-widest text-sky-400/60">{ex.badge}</span>
              </div>
              <p className="text-xs uppercase tracking-wide text-neutral-600">{ex.detail}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

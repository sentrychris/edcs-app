import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import GravitationalTimeDilationSimulation from "./components/gravitational-time-dilation-simulation";

export const metadata: Metadata = {
  title: "Gravitational Time Dilation | Relativity & Spacetime | Knowledge Base | ED:CS",
  description: "Why clocks deeper in a gravity well tick slower. The Schwarzschild factor √(1 − rₛ/r), demonstrated with hovering observers around a black hole.",
};

const StatBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-sky-900/20 px-3 py-2">
    <p className="mb-0.5 text-[0.7rem] uppercase tracking-widest text-neutral-600">{label}</p>
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">{value}</p>
  </div>
);

const examples = [
  {
    name:    "GPS satellites",
    detail:  "Orbiting at ~20,200 km, satellite clocks run faster than ground clocks by ~45 μs/day from gravity, slower by ~7 μs/day from orbital velocity. The net +38 μs/day correction is essential — without it, navigation would drift by 10+ km per day.",
    badge:   "+38 μs/day",
  },
  {
    name:    "Sagittarius A*",
    detail:  "Star S0-2 swung within 120 AU of the Milky Way's central supermassive black hole in 2018. Its light was redshifted by exactly the amount predicted by general relativity — the first detection of gravitational redshift from a star orbiting a SMBH.",
    badge:   "z ≈ 2 × 10⁻⁴",
  },
  {
    name:    "Neutron star surface",
    detail:  "On the surface of a typical 1.4 M☉ neutron star at ~12 km radius, dτ/dt ≈ 0.77 — clocks run at three-quarters the lab rate. Pulsar timing is precise *internally*, but every observed period must be back-corrected for this gravitational dilation.",
    badge:   "dτ/dt ≈ 0.77",
  },
  {
    name:    "Sagittarius A* in ED",
    detail:  "Commanders can fly within ~2 km of the supermassive black hole at the galactic core. By GR, time outside that close would tick at a fraction of bubble time — but the FSD's spacetime-warping conceit gives the ship its own quasi-flat frame, so the clock in the cockpit keeps station with home.",
    badge:   "ED narrative",
  },
];

export default function GravitationalTimeDilationPage() {
  return (
    <>
      {/* ── Terminal header ── */}
      <TerminalHeader
        moduleLabel="MODULE:KNOWLEDGE-BASE"
        protocolLabel="DATABASE:RELATIVITY-SPACETIME"
        statusLabel="SIMULATION: ACTIVE"
      />

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/knowledge-base/relativity-spacetime"
        backLabel="Relativity & Spacetime"
        rightIcon="icarus-terminal-sync"
        rightLabel="SIMULATION — GRAVITATIONAL TIME DILATION"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-sync text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Gravitational Time Dilation
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Clocks Deep in Gravity Wells
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
              <SectionHeader icon="icarus-terminal-sync" title="Hovering Clocks Around a Black Hole" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[600px] flex-1 md:min-h-[440px]">
              <GravitationalTimeDilationSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-neutral-600">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#000", boxShadow: "0 0 4px rgba(255,180,90,0.6)" }} />
                  Event horizon (rₛ)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#FFC878" }} />
                  Photon ring (1.5 rₛ)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#B4D8F0" }} />
                  Static observer clocks
                </span>
              </div>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="Key Parameters" />
            <div className="grid grid-cols-2 gap-2">
              <StatBadge label="Schwarzschild" value="rₛ = 2GM/c²"      />
              <StatBadge label="Time factor"   value="√(1 − rₛ/r)"      />
              <StatBadge label="Photon sphere" value="1.5 rₛ"           />
              <StatBadge label="ISCO (Schw.)"  value="3 rₛ"             />
              <StatBadge label="At 2 rₛ"       value="dτ/dt ≈ 0.71"     />
              <StatBadge label="At horizon"    value="dτ/dt → 0"        />
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="What's Happening" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                The equivalence principle forces it: an accelerating frame mimics gravity, and
                an accelerating observer&apos;s clock runs slow relative to a freely-falling
                one. So a clock <span className="text-amber-400/80">held stationary</span>{" "}
                deep in a gravity well — which requires acceleration to fight the pull —
                must tick slow.
              </p>
              <p>
                For a non-rotating mass, the Schwarzschild metric makes this exact:
                a static clock at radius r ticks at{" "}
                <span className="text-sky-400/80">√(1 − rₛ/r)</span> times the rate of a
                clock at infinity. As r → rₛ the factor → 0 — the clock appears to freeze.
              </p>
              <p>
                The locally measured second is unchanged. What differs is{" "}
                <span className="text-sky-400/80">how distant observers compare</span> their
                tick rates. Time dilation is a relationship between frames, not a property
                of any single clock.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="Consequences" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                "Photons climbing out of a well lose energy — gravitational redshift",
                "Photons falling in gain energy — blueshift",
                "Higher altitude = faster-running clock (GPS depends on this)",
                "Infalling matter appears to freeze near the horizon (from outside)",
                "An infaller crosses the horizon in finite proper time",
                "Combined SR + GR gives the full clock-rate correction in orbit",
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

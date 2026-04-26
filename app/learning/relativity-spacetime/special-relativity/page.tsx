import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import SpecialRelativitySimulation from "./components/special-relativity-simulation";

export const metadata: Metadata = {
  title: "Special Relativity | Relativity & Spacetime | Learning Resources | ED:CS",
  description: "Time dilation, length contraction, and the light cone — Einstein's flat-spacetime framework, demonstrated with a side-by-side light clock comparison.",
};

const StatBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-sky-900/20 px-3 py-2">
    <p className="mb-0.5 text-[0.6rem] uppercase tracking-widest text-neutral-600">{label}</p>
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">{value}</p>
  </div>
);

const examples = [
  {
    name:    "Atmospheric muons",
    detail:  "Cosmic-ray muons created ~15 km up have a half-life of just 1.5 μs at rest — far too short to reach the surface. Yet detectors find them in abundance. From our frame their clocks run slow; from theirs the atmosphere is contracted. Either way, they make it.",
    badge:   "γ ≈ 30",
  },
  {
    name:    "Particle accelerators",
    detail:  "Protons at the LHC are pushed to 0.999999991 c. Their internal clocks tick about 7,500× slower than ours, and short-lived particles produced in collisions live long enough to leave measurable tracks before decaying.",
    badge:   "γ ≈ 7500",
  },
  {
    name:    "Hafele–Keating experiment",
    detail:  "In 1971, atomic clocks flown around the world on commercial jets returned tens of nanoseconds out of sync with ground-based clocks — exactly as special and general relativity predict for the combined motional and gravitational effects.",
    badge:   "Direct test, 1971",
  },
  {
    name:    "Frame Shift Drive (lore)",
    detail:  "ED's FSD sidesteps relativistic time dilation by warping spacetime around the ship rather than accelerating through it — the hull never approaches c locally. Without this trick, supercruise across a system would leave the commander decades out of step with the bubble.",
    badge:   "ED narrative",
  },
];

export default function SpecialRelativityPage() {
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
        rightIcon="icarus-terminal-sync"
        rightLabel="SIMULATION — SPECIAL RELATIVITY"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-sync text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Special Relativity
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Time Dilation, Length Contraction &amp; the Light Cone
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
              <SectionHeader icon="icarus-terminal-sync" title="Light Clock — Rest vs Moving" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[480px] flex-1 md:min-h-[420px]">
              <SpecialRelativitySimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-neutral-600">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#FFE9B0" }} />
                  Photon (always travels at c)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#80C898" }} />
                  Rest frame — proper time
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#DCA050" }} />
                  Lab frame — dilated time
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
              <StatBadge label="Postulate"      value="c is invariant" />
              <StatBadge label="Speed of light" value="299,792 km/s"   />
              <StatBadge label="v / c (sim)"    value="0.866"          />
              <StatBadge label="γ (sim)"        value="2.00"           />
              <StatBadge label="Lorentz form"   value="γ = 1/√(1−β²)"   />
              <StatBadge label="At v = 0.99c"   value="γ ≈ 7.09"       />
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="The Two Postulates" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                <span className="text-sky-400/80">1.</span> The laws of physics take the same form
                in every inertial (non-accelerating) frame. There is no privileged
                stationary observer.
              </p>
              <p>
                <span className="text-sky-400/80">2.</span> The speed of light in vacuum is{" "}
                <span className="text-amber-400/80">the same for every observer</span>,
                regardless of how the source or observer is moving. This single rule forces
                space and time to mix.
              </p>
              <p>
                In the simulation, the photon traces the same{" "}
                <span className="text-sky-400/80">c</span> in both frames — but the moving
                clock&apos;s photon must travel a longer diagonal. Each tick takes longer, so
                its clock runs slow.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="Consequences" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                "Moving clocks run slow by a factor of γ",
                "Moving rulers contract along the direction of motion",
                "Simultaneity is frame-dependent — order of distant events can flip",
                "Mass and energy are interchangeable: E² = (mc²)² + (pc)²",
                "Nothing carrying information can exceed c",
                "The light cone divides spacetime into past, future, and elsewhere",
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

import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import EquivalencePrincipleSimulation from "./components/equivalence-principle-simulation";

export const metadata: Metadata = {
  title: "The Equivalence Principle | Relativity & Spacetime | Learning Resources | ED:CS",
  description: "Why a sealed elevator on a planet is locally indistinguishable from one accelerating in deep space — Einstein's bridge from special to general relativity.",
};

const StatBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-sky-900/20 px-3 py-2">
    <p className="mb-0.5 text-[0.7rem] uppercase tracking-widest text-neutral-600">{label}</p>
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">{value}</p>
  </div>
);

const examples = [
  {
    name:    "ISS astronauts",
    detail:  "Crew on the International Space Station feel weightless not because gravity is absent — it's still ~89% of surface strength up there — but because they and the station are in identical free-fall. Locally, free-fall is indistinguishable from deep space.",
    badge:   "Free-fall ≡ inertial",
  },
  {
    name:    "MICROSCOPE satellite (2017)",
    detail:  "A space-based test dropping titanium and platinum test masses inside a satellite confirmed that inertial mass equals gravitational mass to 1 part in 10¹⁵ — by far the most stringent verification of the weak equivalence principle.",
    badge:   "≤ 10⁻¹⁵",
  },
  {
    name:    "Pound–Rebka (1960)",
    detail:  "Photons climbing a 22.5 m tower at Harvard lost energy by exactly the predicted amount. The equivalence principle implies clocks higher in a gravity well tick faster — the same gravitational time dilation that GPS satellites must correct for daily.",
    badge:   "Δf/f ≈ 2.5 × 10⁻¹⁵",
  },
  {
    name:    "Einstein's happiest thought",
    detail:  "In 1907, Einstein realised that a person in free-fall feels no gravity. That single insight — equivalence — became the seed of general relativity. Gravity is not a force pulling you down; it is the geometry of spacetime, and free-fall is the natural straight line through it.",
    badge:   "1907 → GR (1915)",
  },
];

export default function EquivalencePrinciplePage() {
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
        rightIcon="icarus-terminal-planet-lander"
        rightLabel="SIMULATION — EQUIVALENCE PRINCIPLE"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-planet-lander text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              The Equivalence Principle
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Acceleration as Gravity &amp; Curved Spacetime
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
              <SectionHeader icon="icarus-terminal-planet-lander" title="Einstein's Elevator" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[600px] flex-1 md:min-h-[440px]">
              <EquivalencePrincipleSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-neutral-600">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#9CC8A0" }} />
                  Planet surface — gravity
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#DCAA64" }} />
                  Deep space — acceleration
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#FFE9B0" }} />
                  Light beam (bends in both)
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
              <StatBadge label="Earth surface g"  value="9.81 m/s²"      />
              <StatBadge label="Inertial mass"    value="m_i"            />
              <StatBadge label="Gravitational"    value="m_g = m_i"      />
              <StatBadge label="WEP precision"    value="< 10⁻¹⁵"        />
              <StatBadge label="GR foundation"    value="Strong EP"      />
              <StatBadge label="Free-fall"        value="Locally inertial" />
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="The Insight" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                <span className="text-sky-400/80">Weak EP:</span> all objects fall at the
                same rate in a gravitational field, regardless of their composition or
                mass. Inertial mass equals gravitational mass — exactly.
              </p>
              <p>
                <span className="text-sky-400/80">Einstein EP:</span> a uniform gravitational
                field is{" "}
                <span className="text-amber-400/80">locally indistinguishable</span> from a
                uniformly accelerating frame. No experiment performed in a sealed lift can
                tell which one you are in.
              </p>
              <p>
                <span className="text-sky-400/80">Strong EP:</span> the result extends to
                every law of physics — including the behaviour of light, clocks, and other
                gravitational systems. This is the rock on which general relativity is
                built.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="What This Forces" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                "Light must bend in a gravitational field",
                "Clocks deeper in gravity wells must run slow",
                "Gravity isn't a force — it's spacetime curvature",
                "Free-fall worldlines are geodesics — straight lines through curved spacetime",
                "Energy and momentum, not just mass, generate gravity",
                "GR's field equations follow from EP plus consistency requirements",
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

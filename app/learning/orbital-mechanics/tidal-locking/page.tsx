import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import TidalLockingSimulation from "./components/tidal-locking-simulation";

export const metadata: Metadata = {
  title: "Tidal Locking | Orbital Mechanics | Learning Resources | ED:CS",
  description: "How tidal forces synchronise a body's rotation with its orbit, permanently turning one face toward its primary.",
};

const StatBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-sky-900/20 px-3 py-2">
    <p className="mb-0.5 text-[0.6rem] uppercase tracking-widest text-neutral-600">{label}</p>
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">{value}</p>
  </div>
);

const examples = [
  {
    name:    "The Moon",
    locked:  "To Earth",
    detail:  "The most familiar example. The Moon's rotational period exactly equals its 27.3-day orbital period. The far side was completely unknown until 1959.",
  },
  {
    name:    "Pluto / Charon",
    locked:  "Mutually locked",
    detail:  "Both bodies are tidally locked to each other. Each always shows the same face to its partner — the only confirmed mutual lock in the solar system.",
  },
  {
    name:    "Mercury",
    locked:  "3:2 resonance",
    detail:  "Not fully locked, but in a 3:2 spin-orbit resonance — 3 rotations per 2 orbits. Once thought to be locked; the resonance is stabilised by its orbital eccentricity.",
  },
  {
    name:    "M-dwarf habitable zone",
    locked:  "Likely locked",
    detail:  "Planets in the habitable zone of red dwarf stars orbit so closely that tidal locking is expected within a few billion years, with permanent day and night hemispheres.",
  },
];

export default function TidalLockingPage() {
  return (
    <>
      {/* ── Terminal header ── */}
      <TerminalHeader
        moduleLabel="MODULE:LEARNING"
        protocolLabel="DATABASE:ORBITAL-MECHANICS"
        statusLabel="SIMULATION: ACTIVE"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-planet text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Tidal Locking
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Synchronous Rotation &amp; Permanent Hemispheres
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/learning/orbital-mechanics"
        backLabel="Orbital Mechanics"
        rightIcon="icarus-terminal-planet"
        rightLabel="SIMULATION — TIDAL LOCKING"
      />

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Simulation panel ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-planet" title="Locked vs Unlocked Rotation" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[360px] flex-1">
              <TidalLockingSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-neutral-600">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#D0BC88" }} />
                  Near side (light hemisphere)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#2E2418" }} />
                  Far side (dark hemisphere)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#485878" }} />
                  Primary body (planet)
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
              <StatBadge label="Lock condition" value="Tspin = Torbit"  />
              <StatBadge label="Moon example"   value="27.3 days"       />
              <StatBadge label="Lock timescale" value="Myr – Gyr"       />
              <StatBadge label="M-dwarf HZ"     value="~0.1–0.4 AU"     />
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="How It Happens" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                A rotating body in orbit develops a slight{" "}
                <span className="text-sky-400/80">tidal bulge</span> — the side facing the
                primary is pulled outward more than the far side. If the body rotates faster
                than it orbits, the bulge leads ahead of the planet-facing axis.
              </p>
              <p>
                Gravity from the primary pulls that leading bulge back, creating a{" "}
                <span className="text-sky-400/80">torque</span> that continuously slows the
                rotation. This dissipates energy as internal heat until spin and orbit
                periods synchronise.
              </p>
              <p>
                Once locked, one hemisphere receives{" "}
                <span className="text-amber-400/70">permanent daylight</span>, the other
                permanent night. The terminator — the boundary between them — is fixed
                relative to the body&apos;s surface.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="Habitability Impact" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                "Day side may be too hot for liquid water near the star",
                "Night side can freeze atmospheric gases solid",
                "Terminator zone may have a narrow habitable band",
                "Atmospheric circulation could redistribute heat globally",
                "Strong permanent winds driven by the temperature gradient",
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
        <SectionHeader icon="icarus-terminal-scan" title="Known Examples" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {examples.map((ex) => (
            <div key={ex.name} className="border border-sky-900/20 p-3">
              <div className="mb-2 flex items-start justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wide text-neutral-300">{ex.name}</p>
                <span className="shrink-0 text-[0.6rem] uppercase tracking-widest text-sky-400/60">{ex.locked}</span>
              </div>
              <p className="text-xs uppercase tracking-wide text-neutral-600">{ex.detail}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

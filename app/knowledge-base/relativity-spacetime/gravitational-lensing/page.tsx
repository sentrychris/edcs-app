import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import GravitationalLensingSimulation from "./components/gravitational-lensing-simulation";

export const metadata: Metadata = {
  title: "Gravitational Lensing | Relativity & Spacetime | Knowledge Base | ED:CS",
  description: "Light bending around mass — multiple images, tangential arcs, and Einstein rings. The thin-lens equation visualised with a foreground compact mass drifting through a starfield.",
};

const StatBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-sky-900/20 px-3 py-2">
    <p className="mb-0.5 text-[0.7rem] uppercase tracking-widest text-neutral-600">{label}</p>
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">{value}</p>
  </div>
);

const examples = [
  {
    name:    "Eddington's eclipse (1919)",
    detail:  "During a total solar eclipse, Eddington's expedition photographed stars near the Sun's limb and measured their apparent shift — 1.75 arcseconds, exactly Einstein's prediction. The result made global headlines and turned general relativity from a curiosity into accepted physics overnight.",
    badge:   "1.75″ deflection",
  },
  {
    name:    "Twin Quasar Q0957+561",
    detail:  "Discovered in 1979, this was the first confirmed multi-image gravitational lens — two images of the same quasar separated by 6 arcseconds, lensed by an intervening galaxy. The two images vary identically with a ~417-day delay, the time difference along the two light paths.",
    badge:   "First strong lens, 1979",
  },
  {
    name:    "Cluster arcs (Abell 2218 etc.)",
    detail:  "Massive galaxy clusters lens distant background galaxies into spectacular blue arcs and arclets. The pattern of distortion maps the cluster's total mass — including dark matter — and lets us reconstruct sources that would otherwise be too faint to see.",
    badge:   "Strong cluster lensing",
  },
  {
    name:    "Microlensing exoplanets",
    detail:  "When a foreground star with a planet passes in front of a background star, the resulting brightness curve has a characteristic spike from the planet's lensing contribution. Surveys like KMTNet have used this to discover thousands of planets, including ones at orbits Kepler can't reach.",
    badge:   "Brief brightness spike",
  },
];

export default function GravitationalLensingPage() {
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
        rightIcon="icarus-terminal-target"
        rightLabel="SIMULATION — GRAVITATIONAL LENSING"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-target text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Gravitational Lensing
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Light Bending &amp; Einstein Rings
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
              <SectionHeader icon="icarus-terminal-target" title="Point-Mass Lens Drift" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[480px] flex-1 md:min-h-[440px]">
              <GravitationalLensingSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-neutral-600">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#000", boxShadow: "0 0 4px rgba(255,180,90,0.6)" }} />
                  Foreground lens
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#FFE8B0" }} />
                  Stellar images (tangentially stretched)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "#8CC8FF" }} />
                  Einstein radius θ_E (dashed)
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
              <StatBadge label="Lens equation"    value="θ² − βθ = θ_E²" />
              <StatBadge label="Einstein radius"  value="θ_E ∝ √(M)"     />
              <StatBadge label="Solar limb"       value="1.75″"          />
              <StatBadge label="Cluster scale"    value="10 – 50″"       />
              <StatBadge label="Microlensing"     value="μas – mas"      />
              <StatBadge label="Image count"      value="2 (point lens)" />
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="What's Happening" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Light follows null geodesics — straight lines through curved spacetime. A
                mass curves spacetime, so a ray skimming past it deflects by an angle{" "}
                <span className="text-sky-400/80">α = 4GM / (c² b)</span>, where b is the
                impact parameter.
              </p>
              <p>
                For a point mass, every background source has{" "}
                <span className="text-amber-400/80">two images</span>: one outside the
                Einstein radius (slightly stretched tangentially) and one inside (faint,
                inverted). As source-lens-observer alignment improves, both images merge
                onto a single circle — the <span className="text-amber-400/80">Einstein
                ring</span>.
              </p>
              <p>
                Real galaxy or cluster lenses can produce four images, giant arcs, and
                richly distorted background-galaxy maps — the patterns reveal both luminous
                and dark mass within the lens.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="Why It Matters" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                "First experimental confirmation of GR (Eddington, 1919)",
                "Maps total mass — including dark matter — in clusters",
                "Magnifies distant galaxies, acting as a cosmic telescope",
                "Time delays between images constrain the Hubble constant",
                "Microlensing detects exoplanets and dark compact objects",
                "Black-hole shadows are extreme self-lensing events",
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

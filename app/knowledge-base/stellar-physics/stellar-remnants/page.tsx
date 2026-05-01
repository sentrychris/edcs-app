import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import StellarRemnantsSimulation from "./components/stellar-remnants-simulation";

export const metadata: Metadata = {
  title: "Stellar Remnants | Stellar Physics | Knowledge Base | ED:CS",
  description: "What stars become when fusion ends — white dwarfs, neutron stars, and black holes.",
};

const remnants = [
  {
    name:        "White Dwarf",
    color:       "#A0BFFF",
    progenitor:  "≤ 8 M☉",
    finalMass:   "≤ 1.4 M☉",
    radius:      "≈ Earth (~6,400 km)",
    density:     "~10⁹ kg/m³",
    pathway:     "Planetary nebula",
    examples:    "Sirius B, Procyon B",
  },
  {
    name:        "Neutron Star",
    color:       "#E8F0FF",
    progenitor:  "8 – 25 M☉",
    finalMass:   "1.4 – 2.5 M☉",
    radius:      "~10 km",
    density:     "~10¹⁷ kg/m³",
    pathway:     "Type II supernova",
    examples:    "Crab Pulsar, Vela",
  },
  {
    name:        "Black Hole",
    color:       "#FFB060",
    progenitor:  "≥ 25 M☉",
    finalMass:   "≥ 2.5 M☉",
    radius:      "Schwarzschild = 2GM/c²",
    density:     "Singularity",
    pathway:     "Direct collapse / hypernova",
    examples:    "Cygnus X-1, Sgr A* (SMBH)",
  },
];

export default function StellarRemnantsPage() {
  return (
    <>
      {/* ── Terminal header ── */}
      <TerminalHeader
        moduleLabel="MODULE:KNOWLEDGE-BASE"
        protocolLabel="DATABASE:STELLAR-PHYSICS"
        statusLabel="SIMULATION: ACTIVE"
      />

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/knowledge-base/stellar-physics"
        backLabel="Stellar Physics"
        rightIcon="icarus-terminal-star"
        rightLabel="TOPIC — STELLAR REMNANTS"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-star text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Stellar Remnants
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              White Dwarfs, Neutron Stars &amp; Black Holes
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
              <SectionHeader icon="icarus-terminal-star" title="Three Endpoints of Stellar Evolution" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[480px] flex-1 min-[480px]:min-h-[420px]">
              <StellarRemnantsSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
                Sizes are not to scale — actual radii span ~6,400 km (white dwarf), ~10 km (neutron star), and the mass-dependent Schwarzschild radius (black hole).
              </p>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="Formation Pathways" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                A star&apos;s final form is determined almost entirely by its{" "}
                <span className="text-sky-400/80">initial mass</span>. As nuclear fusion
                ends, gravity wins — but how far it crushes the core depends on what&apos;s
                there to push back.
              </p>
              <p>
                Below the <span className="text-sky-400/80">Chandrasekhar limit</span> (1.4
                M☉), electron degeneracy pressure halts collapse → white dwarf. Above it,
                degenerate neutrons resist further collapse up to the{" "}
                <span className="text-sky-400/80">TOV limit</span> (~2.5 M☉) → neutron star.
                Beyond that, no known force halts gravity → singularity.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="Detection Signatures" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { type: "White Dwarf",   note: "Faint thermal glow, distinctive absorption spectra" },
                { type: "Neutron Star",  note: "Pulsar beams, X-ray binaries, magnetar bursts" },
                { type: "Black Hole",    note: "Accretion X-rays, gravitational lensing, GW chirps" },
              ].map(({ type, note }) => (
                <div key={type} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-sky-500/40 text-[0.7rem]" />
                  <span><span className="text-neutral-400">{type}</span> — {note}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="ED: Hazards &amp; Hooks" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                None of the remnants are{" "}
                <span className="text-red-400/70">fuel-scoopable</span> — they cannot
                replenish FSD reserves.
              </p>
              <p>
                <span className="text-sky-400/80">Neutron stars</span> emit a polar jet cone
                that supercharges the FSD, extending jump range by up to{" "}
                <span className="text-green-400/80">300%</span>. The backbone of the{" "}
                <span className="text-sky-400/80">Colonia Highway</span> and most long-range
                expedition routes.
              </p>
              <p>
                <span className="text-sky-400/80">Black holes</span> have no jet but generate
                striking gravitational lensing visible up close. Approach with a fully
                fuelled FSD and watch your heat.
              </p>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Comparative reference ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Comparative Reference" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {remnants.map((rem) => (
            <div key={rem.name} className="border border-sky-900/20 p-4">
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color: rem.color }}>
                {rem.name}
              </p>
              <div className="mt-3 space-y-1.5 text-xs uppercase tracking-wide">
                <ReferenceRow label="Progenitor" value={rem.progenitor} />
                <ReferenceRow label="Final mass" value={rem.finalMass} />
                <ReferenceRow label="Radius"     value={rem.radius} />
                <ReferenceRow label="Density"    value={rem.density} />
                <ReferenceRow label="Forms via"  value={rem.pathway} />
              </div>
              <p className="mt-3 border-t border-sky-900/20 pt-2 text-[0.65rem] uppercase tracking-widest text-neutral-600">
                {rem.examples}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

const ReferenceRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-2">
    <span className="text-neutral-700">{label}</span>
    <span className="text-right text-neutral-300">{value}</span>
  </div>
);

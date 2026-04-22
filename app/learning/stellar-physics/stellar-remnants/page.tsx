import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import StellarRemnantsSimulation from "./components/stellar-remnants-simulation";

export const metadata: Metadata = {
  title: "Stellar Remnants | Stellar Physics | Learning Resources | ED:CS",
  description: "White dwarfs, neutron stars, and black holes — what stars leave behind when nuclear fusion ends.",
};

const StatBadge = ({ label, value }: { label: string; value: string }) => (
  <div className="border border-sky-900/20 px-3 py-2">
    <p className="mb-0.5 text-[0.6rem] uppercase tracking-widest text-neutral-600">{label}</p>
    <p className="text-xs font-bold uppercase tracking-wider text-neutral-300">{value}</p>
  </div>
);

const remnants = [
  {
    type:   "White Dwarf",
    color:  "rgba(180,200,255,0.80)",
    origin: "Low / mid-mass stars (≤8 M☉)",
    detail: "The exposed core of a star that has shed its outer layers. Supported by electron degeneracy pressure rather than fusion. No energy source — it simply cools over billions of years.",
  },
  {
    type:   "Neutron Star",
    color:  "rgba(120,230,255,0.80)",
    origin: "Massive stars (8–20 M☉)",
    detail: "Formed in a core-collapse supernova. Nuclear density — a tablespoon would weigh ~a billion tonnes. Often born as a pulsar, sweeping radio beams across the sky with each rotation.",
  },
  {
    type:   "Black Hole",
    color:  "rgba(180,120,255,0.75)",
    origin: "Very massive stars (>20 M☉)",
    detail: "When a stellar core exceeds ~3 M☉ it collapses past the neutron star limit. A singularity forms, surrounded by an event horizon from which nothing — not even light — can escape.",
  },
];

export default function StellarRemnantsPage() {
  return (
    <>
      {/* ── Terminal header ── */}
      <div className="fx-chamfer relative mb-5 border border-sky-900/40 bg-black/50 backdrop-blur backdrop-filter px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-3">
            <span>MODULE:LEARNING</span>
            <span className="hidden sm:inline text-neutral-800">■</span>
            <span className="hidden sm:inline">DATABASE:STELLAR-PHYSICS</span>
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

      {/* ── Breadcrumb ── */}
      <div className="mb-5 flex items-center justify-between text-xs uppercase tracking-widest text-neutral-500">
        <Link href="/learning/stellar-physics" className="flex items-center gap-2 transition-colors hover:text-sky-400">
          <i className="icarus-terminal-chevron-left text-xs" />
          Stellar Physics
        </Link>
        <span className="flex items-center gap-2 text-neutral-700">
          <i className="icarus-terminal-star text-sky-500/20" />
          TOPIC — STELLAR REMNANTS
        </span>
      </div>

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Simulation panel ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-star" title="Remnant Comparison" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-0 flex-1">
              <StellarRemnantsSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <div className="flex flex-wrap gap-4 text-xs uppercase tracking-widest text-neutral-600">
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#A0B8F0]" />
                  White dwarf (electron degeneracy)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#80FFFF]" />
                  Neutron star (pulsar beams)
                </span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: "rgba(255,140,20,0.8)" }} />
                  Black hole (accretion disc)
                </span>
              </div>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-5">
            <SectionHeader icon="icarus-terminal-scan" title="Key Parameters" />
            <div className="grid grid-cols-2 gap-2">
              <StatBadge label="WD radius"       value="~7,000 km"   />
              <StatBadge label="WD avg mass"      value="~0.6 M☉"    />
              <StatBadge label="NS radius"        value="~10 km"      />
              <StatBadge label="NS mass range"    value="1.4–3 M☉"   />
              <StatBadge label="BH horizon (10M☉)" value=">30 km"    />
              <StatBadge label="BH min mass"      value=">3 M☉"      />
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-5">
            <SectionHeader icon="icarus-terminal-info" title="Formation Paths" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                When a star exhausts its hydrogen fuel, its fate depends on
                its <span className="text-sky-400/80">initial mass</span>. Electron degeneracy
                pressure supports white dwarfs; neutron degeneracy supports neutron stars.
                Neither pressure can halt collapse above ~3 M☉ — a black hole forms.
              </p>
              <p>
                Neutron stars are born in <span className="text-sky-400/80">core-collapse supernovae</span>,
                often with extreme spin rates (&gt;700 Hz) and magnetic fields 10<sup>8</sup>–10<sup>15</sup> times
                Earth&apos;s. These produce the sweeping radio beams that mark a pulsar.
              </p>
              <p>
                White dwarfs cool passively over billions of years. In a binary system,
                mass transfer from a companion can push one past the{" "}
                <span className="text-amber-400/70">Chandrasekhar limit (~1.4 M☉)</span>,
                triggering a Type Ia supernova.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-5">
            <SectionHeader icon="icarus-terminal-warning" title="Elite Dangerous" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { label: "Neutron star", note: "FSD supercharge — 4× jump range boost" },
                { label: "White dwarf",  note: "FSD supercharge — 1.5× boost, lower risk" },
                { label: "Black hole",   note: "No scoop, extreme tidal forces near horizon" },
                { label: "All remnants", note: "Not fuel-scoopable" },
              ].map(({ label, note }) => (
                <div key={label} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-amber-500/40 text-[0.6rem]" />
                  <span><span className="text-neutral-400">{label}</span> — {note}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Remnant detail cards ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Remnant Types" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {remnants.map((rem) => (
            <div key={rem.type} className="border border-sky-900/20 p-3">
              <div className="mb-2 flex items-start justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wide text-neutral-300" style={{ color: rem.color }}>
                  {rem.type}
                </p>
                <span className="shrink-0 text-[0.6rem] uppercase tracking-widest text-sky-400/60">{rem.origin}</span>
              </div>
              <p className="text-xs uppercase tracking-wide text-neutral-600">{rem.detail}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

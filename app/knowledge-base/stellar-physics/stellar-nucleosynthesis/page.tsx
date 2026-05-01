import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import StellarNucleosynthesisSimulation from "./components/stellar-nucleosynthesis-simulation";

export const metadata: Metadata = {
  title: "Stellar Nucleosynthesis | Stellar Physics | Knowledge Base | ED:CS",
  description: "How stars forge the elements — onion-shell fusion in massive stars and the cosmic origins of every atom in the periodic table.",
};

const fusionStages = [
  { stage: "Hydrogen burning",  fuel: "H",  product: "He",         temp: "~15 MK",   duration: "~7 Myr",   note: "Proton-proton chain & CNO cycle"    },
  { stage: "Helium burning",    fuel: "He", product: "C, O",       temp: "~200 MK",  duration: "~700 kyr", note: "Triple-alpha process"               },
  { stage: "Carbon burning",    fuel: "C",  product: "Ne, Mg, Na", temp: "~900 MK",  duration: "~600 yr",  note: "Onset of neutrino-dominated cooling" },
  { stage: "Neon burning",      fuel: "Ne", product: "O, Mg",      temp: "~1.7 GK",  duration: "~1 yr",    note: "Photodisintegration kicks in"        },
  { stage: "Oxygen burning",    fuel: "O",  product: "Si, S, Ar",  temp: "~2.3 GK",  duration: "~6 mo",    note: "Massive neutrino energy losses"      },
  { stage: "Silicon burning",   fuel: "Si", product: "Fe, Ni",     temp: "~3.5 GK",  duration: "~1 day",   note: "Last exothermic stage"               },
  { stage: "Core collapse",     fuel: "Fe", product: "—",          temp: "~5 GK",    duration: "<1 sec",   note: "Photodisintegration → supernova"     },
];

const origins = [
  { source: "Big Bang nucleosynthesis", elements: "H, He, traces of Li", color: "text-sky-400/80"     },
  { source: "Cosmic ray spallation",    elements: "Li, Be, B",            color: "text-neutral-400/80" },
  { source: "Low-mass stars (AGB)",     elements: "C, N, F, s-process up to Pb", color: "text-yellow-400/80" },
  { source: "Massive stars + Type II SN", elements: "O, Ne, Mg, Si, S, Ca, Fe-peak", color: "text-amber-400/80" },
  { source: "Type Ia supernovae",       elements: "Most Fe-group isotopes", color: "text-red-400/80"   },
  { source: "Neutron star mergers (r-process)", elements: "Au, Pt, U, lanthanides", color: "text-fuchsia-400/70" },
];

export default function StellarNucleosynthesisPage() {
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
        rightLabel="TOPIC — STELLAR NUCLEOSYNTHESIS"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-star text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Stellar Nucleosynthesis
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              How Stars Forge the Elements
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Onion shell simulation ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-star" title="Massive Star Interior — Onion Shell" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[560px] flex-1 min-[480px]:min-h-[480px]">
              <StellarNucleosynthesisSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
                Cross-section of a ~25 M☉ star moments before core collapse. Shells are not to scale — the H envelope normally accounts for &gt;99% of the radius. Each layer fuses progressively heavier elements at higher temperatures.
              </p>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="The Fusion Hierarchy" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Each fusion stage requires a higher temperature than the last
                because heavier nuclei carry larger{" "}
                <span className="text-sky-400/80">Coulomb barriers</span>. As the
                core ash from one stage builds up, gravity compresses and heats it
                until the next reaction ignites.
              </p>
              <p>
                Heavier fuels burn{" "}
                <span className="text-sky-400/80">dramatically faster</span> — H
                lasts millions of years, Si just a single day. Once iron forms,
                fusion can no longer release energy and the core collapses in
                under a second.
              </p>
              <p>
                Lower-mass stars stop early. The Sun will fuse only H and He,
                then shed its envelope as a planetary nebula — leaving a{" "}
                <span className="text-sky-400/80">carbon-oxygen white dwarf</span>.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="Origins of the Elements" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {origins.map(({ source, elements, color }) => (
                <div key={source} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-[0.7rem] text-sky-500/40" />
                  <span><span className={color}>{source}</span> — {elements}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-sky-900/20 pt-2 text-[0.65rem] uppercase tracking-widest text-neutral-600">
              Every atom heavier than helium in your ship was forged by stars or stellar explosions.
            </p>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="ED: Material Origins" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Common materials —{" "}
                <span className="text-sky-400/80">carbon, iron, nickel</span> —
                are abundant because they sit at energy minima of stellar fusion.
                The iron peak is where every massive star ends.
              </p>
              <p>
                Rare materials —{" "}
                <span className="text-sky-400/80">technetium, ruthenium, polonium</span> —
                require explosive r-process synthesis. They are signatures of
                neutron star mergers and supernova remnants, which is why they
                cluster around the galaxy&apos;s most violent regions.
              </p>
              <p>
                The <span className="text-sky-400/80">Iron Peak</span> hand-in
                materials and exotic super-heavy elements in jumponium recipes
                trace back directly to the physics shown here.
              </p>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Fusion stage reference ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Fusion Stages — 25 M☉ Reference" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs uppercase tracking-wide">
            <thead>
              <tr className="border-b border-sky-900/20 text-left text-[0.7rem] tracking-widest text-neutral-600">
                <th className="pb-2 pr-4">Stage</th>
                <th className="pb-2 pr-4">Fuel</th>
                <th className="pb-2 pr-4">Product</th>
                <th className="pb-2 pr-4">Core T</th>
                <th className="pb-2 pr-4">Duration</th>
                <th className="pb-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {fusionStages.map((row) => (
                <tr key={row.stage} className="border-b border-sky-900/10">
                  <td className="py-2 pr-4 text-neutral-300">{row.stage}</td>
                  <td className="py-2 pr-4 text-sky-400/70">{row.fuel}</td>
                  <td className="py-2 pr-4 text-amber-400/70">{row.product}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.temp}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.duration}</td>
                  <td className="py-2 text-neutral-600">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

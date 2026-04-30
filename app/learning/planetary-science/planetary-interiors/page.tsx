import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import PlanetaryInteriorsSimulation from "./components/planetary-interiors-simulation";

export const metadata: Metadata = {
  title: "Planetary Interiors | Planetary Science | Learning Resources | ED:CS",
  description: "Inside the worlds — differentiation, core dynamics, tidal heating, and the layered structure of rocky planets, ocean moons, and gas giants.",
};

const reference = [
  { body: "Mercury", color: "#C0A080", radius: "2,440 km",  core: "~83% (Fe-rich)",  mantle: "Thin silicate", crust: "Thin",          notes: "Anomalously large iron core; partial dynamo"     },
  { body: "Venus",   color: "#E8C040", radius: "6,052 km",  core: "~50%",            mantle: "Stagnant lid",  crust: "Single plate",  notes: "Hot mantle, no plate tectonics, no dynamo"        },
  { body: "Earth",   color: "#80C0FF", radius: "6,371 km",  core: "~55% (Fe-Ni)",    mantle: "Convecting",    crust: "Plate tectonics", notes: "Solid inner + liquid outer core → strong dynamo"  },
  { body: "Mars",    color: "#E08060", radius: "3,389 km",  core: "~50% (liquid)",   mantle: "Thick silicate",crust: "Stagnant lid",  notes: "Cooled core; lost dynamo; thin atmosphere stripped" },
  { body: "Moon",    color: "#C8C8D0", radius: "1,737 km",  core: "~20% (small)",    mantle: "Cold/rigid",    crust: "Anorthosite",   notes: "Tiny core; differentiation from giant impact"     },
  { body: "Io",      color: "#FFD060", radius: "1,822 km",  core: "~20% (Fe-S)",     mantle: "Partial melt",  crust: "Active volcanism", notes: "Tidal heating from Jupiter — most volcanic body"  },
  { body: "Europa",  color: "#A0D8FF", radius: "1,561 km",  core: "~20% (Fe)",       mantle: "Rocky",         crust: "Ice + ocean",   notes: "Subsurface H₂O ocean; potential biosphere"        },
  { body: "Titan",   color: "#FFA050", radius: "2,575 km",  core: "Rocky/ice mix",   mantle: "Ice/water",     crust: "Ice + hydrocarbons", notes: "Possible internal ocean; hydrocarbon surface lakes" },
  { body: "Jupiter", color: "#E8B070", radius: "69,911 km", core: "~10% (rock/ice)", mantle: "Metallic H",    crust: "H₂/He envelope",notes: "Diluted core; metallic-H mantle drives dynamo"    },
  { body: "Saturn",  color: "#E8DCB8", radius: "58,232 km", core: "~10%",            mantle: "Metallic H",    crust: "H₂/He envelope",notes: "Lower density than water; banded ring system"      },
];

export default function PlanetaryInteriorsPage() {
  return (
    <>
      <TerminalHeader
        moduleLabel="MODULE:LEARNING"
        protocolLabel="DATABASE:PLANETARY-SCIENCE"
        statusLabel="SIMULATION: ACTIVE"
      />

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/learning/planetary-science"
        backLabel="Planetary Science"
        rightIcon="icarus-terminal-planet"
        rightLabel="TOPIC — PLANETARY INTERIORS"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-planet text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Planetary Interiors
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Differentiation, Cores &amp; Tidal Heating
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Simulation ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-planet" title="Half-Sphere Cross-Sections" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[640px] flex-1 min-[480px]:min-h-[480px]">
              <PlanetaryInteriorsSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
                Right half: surface as you&apos;d see from orbit. Left half: cut-away interior. Hot layers (cores, oceans, metallic-H) pulse subtly. Body sizes are scaled relative to each other.
              </p>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="Differentiation" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                When a young world is hot enough to melt, denser materials sink
                to the centre and lighter ones float up — forming distinct{" "}
                <span className="text-sky-400/80">core</span>,{" "}
                <span className="text-sky-400/80">mantle</span>, and{" "}
                <span className="text-sky-400/80">crust</span> layers.
              </p>
              <p>
                Iron and nickel concentrate in the core. Silicates (rock)
                dominate the mantle. The crust is what cooled and solidified
                first — often enriched in lighter elements like Si, Al, K.
              </p>
              <p>
                Whether a planet keeps an{" "}
                <span className="text-sky-400/80">active dynamo</span> depends
                on the core staying partially liquid and convecting — Earth
                does, Mars used to but cooled out, Venus has a liquid core but
                no convection.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="Heat Sources" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { key: "Primordial",      note: "Heat from accretion + differentiation; slowly leaks out" },
                { key: "Radioactive decay", note: "U, Th, K isotopes — primary heat source for rocky planets" },
                { key: "Tidal flexing",   note: "Gravitational squeezing in eccentric orbits — Io, Europa" },
                { key: "Pressure",        note: "Compression at depth maintains liquid metallic phases" },
              ].map(({ key, note }) => (
                <div key={key} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-[0.7rem] text-amber-500/40" />
                  <span><span className="text-neutral-400">{key}</span> — {note}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-sky-900/20 pt-2 text-[0.65rem] uppercase tracking-widest text-neutral-600">
              Smaller bodies cool faster — surface area scales as r², heat content as r³.
            </p>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="ED: Geological Signals" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                In Elite Dangerous, the surface scanner highlights{" "}
                <span className="text-sky-400/80">geological signal sources</span>{" "}
                — fumaroles, ice geysers, and lava spouts. They form on bodies
                with active or recently-active interiors.
              </p>
              <p>
                <span className="text-sky-400/80">Tidally-heated moons</span>{" "}
                around gas giants — analogues of Io and Europa — are prime
                candidates for biological signals (bacteria), while volcanic
                hot rocky bodies host raw-material harvest sites.
              </p>
              <p>
                The <span className="text-sky-400/80">Vista Genomics</span>{" "}
                organic samples cluster on bodies with appropriate interior
                heat — too cold and there&apos;s nothing; too hot and the
                surface is hostile.
              </p>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Reference table ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Interior Reference — Sol System" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs uppercase tracking-wide">
            <thead>
              <tr className="border-b border-sky-900/20 text-left text-[0.7rem] tracking-widest text-neutral-600">
                <th className="pb-2 pr-4">Body</th>
                <th className="pb-2 pr-4">Radius</th>
                <th className="pb-2 pr-4">Core</th>
                <th className="pb-2 pr-4">Mantle</th>
                <th className="pb-2 pr-4">Crust</th>
                <th className="pb-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {reference.map((row) => (
                <tr key={row.body} className="border-b border-sky-900/10">
                  <td className="py-2 pr-4 font-bold" style={{ color: row.color }}>{row.body}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.radius}</td>
                  <td className="py-2 pr-4 text-amber-400/70">{row.core}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.mantle}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.crust}</td>
                  <td className="py-2 text-neutral-600">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

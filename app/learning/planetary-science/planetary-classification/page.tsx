import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import PlanetaryClassificationSimulation from "./components/planetary-classification-simulation";

export const metadata: Metadata = {
  title: "Planetary Classification | Planetary Science | Learning Resources | ED:CS",
  description: "Body types in Elite Dangerous — rocky, atmospheric, and gas giant classifications with their compositions and atmospheres.",
};

const reference = [
  { type: "Icy body",                color: "#D8E0E8", composition: "H₂O / CH₄ / NH₃ ices",     atmosphere: "Thin / none",        note: "Common in outer reaches of systems"        },
  { type: "Rocky body",              color: "#A89070", composition: "Silicate basalts",          atmosphere: "Thin / none",        note: "Mercury / Mars analogues"                  },
  { type: "Rocky-ice body",          color: "#B0A088", composition: "Mixed silicate + ice",      atmosphere: "Thin / none",        note: "Transitional outer-system body"            },
  { type: "High Metal Content",      color: "#A87055", composition: "Silicates + heavy metals",  atmosphere: "Thin (CO₂, SO₂)",    note: "Most common landable type — Venus-like"    },
  { type: "Metal-rich body",         color: "#807878", composition: "Iron, nickel, dense metals",atmosphere: "None",               note: "Mercury-like, near-stellar"                },
  { type: "Earth-like world",        color: "#3878B0", composition: "Silicate + liquid H₂O",     atmosphere: "N₂/O₂",              note: "Habitable — extremely rare"                },
  { type: "Water world",             color: "#2E68A8", composition: "Silicate + liquid H₂O",     atmosphere: "Variable",           note: "Liquid surface, possible life"             },
  { type: "Ammonia world",           color: "#C8A848", composition: "Silicate + liquid NH₃",     atmosphere: "NH₃ / CH₄",          note: "Cold biosphere candidates"                 },
  { type: "Water giant",             color: "#3878B0", composition: "Massive H₂O envelope",      atmosphere: "Steam / supercritical", note: "Bridge between water worlds & gas giants" },
  { type: "Class I gas giant",       color: "#B89568", composition: "H₂ / He + NH₃ clouds",      atmosphere: "Cold ammonia clouds", note: "Jupiter analogue"                          },
  { type: "Class II gas giant",      color: "#E8DCB8", composition: "H₂ / He + H₂O clouds",      atmosphere: "Warm water clouds",   note: "Pale, high albedo"                         },
  { type: "Class III gas giant",     color: "#2C5898", composition: "H₂ / He, no condensates",   atmosphere: "Cloudless",           note: "Deep blue, Neptune-like coloration"        },
  { type: "Class IV gas giant",      color: "#D04830", composition: "H₂ / He + alkali metals",   atmosphere: "Hot sodium/potassium",note: "Tan/orange hot Jupiter"                    },
  { type: "Class V gas giant",       color: "#902018", composition: "H₂ / He + silicate clouds", atmosphere: "Glowing silicate",    note: "Extreme hot Jupiter, near-stellar"         },
  { type: "Helium-rich gas giant",   color: "#B0A0C0", composition: "He-enriched envelope",      atmosphere: "Hydrogen depleted",   note: "Rare evolved gas giant"                    },
  { type: "Helium gas giant",        color: "#9080B0", composition: "Almost pure He",            atmosphere: "Negligible H",        note: "Extremely rare; fully evaporated H envelope"},
];

export default function PlanetaryClassificationPage() {
  return (
    <>
      <TerminalHeader
        moduleLabel="MODULE:LEARNING"
        protocolLabel="DATABASE:PLANETARY-SCIENCE"
        statusLabel="SIMULATION: ACTIVE"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-planet text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Planetary Classification
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Rocky, Atmospheric &amp; Gas Giant Bodies
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/learning/planetary-science"
        backLabel="Planetary Science"
        rightIcon="icarus-terminal-planet"
        rightLabel="TOPIC — PLANETARY CLASSIFICATION"
      />

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Simulation panel ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-planet" title="Body Type Atlas" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[640px] flex-1 min-[480px]:min-h-[540px]">
              <PlanetaryClassificationSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
                Sizes shown are illustrative. In reality, gas giants are typically 5–10× the radius of rocky bodies. See the reference table for the full ED classification including helium-rich and Class IV variants.
              </p>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="How Worlds Are Classified" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Bodies are sorted by{" "}
                <span className="text-sky-400/80">composition</span>,{" "}
                <span className="text-sky-400/80">atmosphere</span>, and{" "}
                <span className="text-sky-400/80">surface state</span>. Mass and
                temperature determine which volatiles can exist — close-in
                worlds lose light gases, distant ones retain frozen ices.
              </p>
              <p>
                Gas giants follow the{" "}
                <span className="text-sky-400/80">Sudarsky scheme</span> (Classes
                I–V) which sorts them by equilibrium temperature and the
                resulting cloud chemistry — ammonia clouds when cold, water
                clouds when warm, sodium and silicate vapours when hot.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-planet-life" title="Habitability Markers" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { key: "Earth-like World", note: "Liquid H₂O + breathable N₂/O₂ atmosphere" },
                { key: "Water World",      note: "Liquid surface, may host life — atmosphere varies" },
                { key: "Ammonia World",    note: "Cold biosphere candidate — NH₃ in liquid state"    },
                { key: "Gas G. with Life", note: "Floating microbial life in cloud layers"           },
              ].map(({ key, note }) => (
                <div key={key} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-[0.6rem] text-green-500/40" />
                  <span><span className="text-neutral-400">{key}</span> — {note}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-sky-900/20 pt-2 text-[0.65rem] uppercase tracking-widest text-neutral-600">
              ELWs and ammonia worlds pay the highest exploration premiums.
            </p>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="ED: Scanning &amp; Discovery" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                The <span className="text-sky-400/80">Full Spectrum Scanner</span>{" "}
                detects every body. The{" "}
                <span className="text-sky-400/80">Detailed Surface Scanner</span>{" "}
                gives the first-mapped bonus and confirms surface features for
                landable bodies.
              </p>
              <p>
                <span className="text-sky-400/80">Landable</span> bodies require
                no significant atmosphere — typically icy, rocky, HMC, and
                metal-rich. Atmospheric landings are limited to thin-atmosphere
                bodies in Odyssey-equipped builds.
              </p>
              <p>
                Look for valuable hand-ins:{" "}
                <span className="text-green-400/70">ELW</span>,{" "}
                <span className="text-green-400/70">water world</span>,{" "}
                <span className="text-green-400/70">ammonia world</span>, and{" "}
                <span className="text-green-400/70">terraformable HMC</span> all
                yield the largest cartographic credits.
              </p>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Reference table ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="ED Body Type Reference" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs uppercase tracking-wide">
            <thead>
              <tr className="border-b border-sky-900/20 text-left text-[0.6rem] tracking-widest text-neutral-600">
                <th className="pb-2 pr-4">Type</th>
                <th className="pb-2 pr-4">Composition</th>
                <th className="pb-2 pr-4">Atmosphere</th>
                <th className="pb-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {reference.map((row) => (
                <tr key={row.type} className="border-b border-sky-900/10">
                  <td className="py-2 pr-4 font-bold" style={{ color: row.color }}>{row.type}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.composition}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.atmosphere}</td>
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

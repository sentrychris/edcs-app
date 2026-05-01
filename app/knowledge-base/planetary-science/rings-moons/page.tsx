import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import RingsMoonsSimulation from "./components/rings-moons-simulation";

export const metadata: Metadata = {
  title: "Rings & Moons | Planetary Science | Knowledge Base | ED:CS",
  description: "Ring systems, shepherd moons, gap dynamics, and the orbital architecture of planet-moon systems.",
};

const reference = [
  { feature: "Saturn's A ring",     color: "#D8C898", composition: "Water ice (98%) + traces", thickness: "~10 m",         note: "Outermost main ring — bordered by Encke and Keeler gaps" },
  { feature: "Cassini Division",    color: "#A0A0A0", composition: "Mostly empty",             thickness: "~4,800 km",     note: "Cleared by 2:1 resonance with Mimas"                      },
  { feature: "Saturn's B ring",     color: "#E0D0A8", composition: "Water ice — dense",        thickness: "~10 m",         note: "Brightest, densest main ring"                              },
  { feature: "Saturn's C ring",     color: "#A09078", composition: "Water ice — sparse",       thickness: "~5 m",          note: "Thinner, more transparent inner ring"                      },
  { feature: "Pan & Daphnis",       color: "#C8C8D0", composition: "Rock + ice",               thickness: "~30 km bodies", note: "Shepherd moons that maintain Encke and Keeler gaps"        },
  { feature: "Jupiter's ring",      color: "#FFA060", composition: "Dust from impacts",        thickness: "~30 km",        note: "Tenuous, replenished by impacts on small inner moons"     },
  { feature: "Uranus' ring system", color: "#80E0FF", composition: "Dark carbonaceous",        thickness: "—",             note: "13 narrow rings, kept thin by shepherd moons"             },
  { feature: "Galilean moons",      color: "#FFD080", composition: "Mixed rock/ice",           thickness: "—",             note: "Io, Europa, Ganymede, Callisto in a 4:2:1 resonance chain" },
];

export default function RingsMoonsPage() {
  return (
    <>
      <TerminalHeader
        moduleLabel="MODULE:KNOWLEDGE-BASE"
        protocolLabel="DATABASE:PLANETARY-SCIENCE"
        statusLabel="SIMULATION: ACTIVE"
      />

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/knowledge-base/planetary-science"
        backLabel="Planetary Science"
        rightIcon="icarus-terminal-planet-ringed"
        rightLabel="TOPIC — RINGS & MOONS"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-planet-ringed text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Rings &amp; Moons
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Ring Structure, Shepherds &amp; Moon Systems
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
              <SectionHeader icon="icarus-terminal-planet-ringed" title="Saturn-Like Ring System" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[560px] flex-1 min-[480px]:min-h-[460px]">
              <RingsMoonsSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
                A, B, and C rings separated by the Cassini Division. Inner ring particles orbit faster than outer ones (Kepler&apos;s 3rd law). Shepherd moons sit at gap edges. Three named outer moons (Mimas, Tethys, Titan) orbit on dashed paths.
              </p>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="Why Rings Form" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Rings form inside the{" "}
                <span className="text-sky-400/80">Roche limit</span> — the
                distance below which tidal forces overcome a body&apos;s
                self-gravity. Material there cannot coalesce into a moon, so
                it spreads into a flat orbiting sheet.
              </p>
              <p>
                Possible origins: a moon torn apart on a decaying orbit, a
                comet captured and shredded, leftover material from formation,
                or impact debris from larger moons.
              </p>
              <p>
                Despite their breadth (Saturn&apos;s rings span 280,000 km
                end-to-end), main rings are vertically thin —{" "}
                <span className="text-sky-400/80">about 10 m</span>. They are
                proportionally thinner than a sheet of paper at the scale of a
                football field.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="Shepherd Moons &amp; Gaps" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { key: "Encke Gap",      note: "Cleared and shepherded by Pan (~30 km moonlet)"      },
                { key: "Keeler Gap",     note: "Cleared by Daphnis — visible 'wakes' on either edge"  },
                { key: "Cassini Division",note: "Resonant gap from 2:1 orbital lock with Mimas"        },
                { key: "Resonant edges", note: "Outer A ring edge held by 7:6 with Janus & Epimetheus" },
                { key: "Spokes",         note: "Charged dust grains lifted electrostatically — transient" },
              ].map(({ key, note }) => (
                <div key={key} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-[0.7rem] text-amber-500/40" />
                  <span><span className="text-neutral-400">{key}</span> — {note}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="ED: Ring Mining" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Rings in Elite Dangerous come in four compositions:{" "}
                <span className="text-sky-400/80">rocky</span>,{" "}
                <span className="text-sky-400/80">icy</span>,{" "}
                <span className="text-sky-400/80">metallic</span>, and{" "}
                <span className="text-sky-400/80">metal-rich</span>. Composition
                determines what minerals you can extract.
              </p>
              <p>
                <span className="text-sky-400/80">Pristine reserves</span> in
                metallic rings yield the rarest minerals. Hotspot scanning
                inside the ring reveals concentrated ore deposits.
              </p>
              <p>
                The visual ring structure in ED is simplified — real planetary
                rings have complex banding, gaps, and spokes that change on
                timescales of hours to years.
              </p>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Reference table ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Ring &amp; Moon Reference" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs uppercase tracking-wide">
            <thead>
              <tr className="border-b border-sky-900/20 text-left text-[0.7rem] tracking-widest text-neutral-600">
                <th className="pb-2 pr-4">Feature</th>
                <th className="pb-2 pr-4">Composition</th>
                <th className="pb-2 pr-4">Scale</th>
                <th className="pb-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {reference.map((row) => (
                <tr key={row.feature} className="border-b border-sky-900/10">
                  <td className="py-2 pr-4 font-bold" style={{ color: row.color }}>{row.feature}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.composition}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.thickness}</td>
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

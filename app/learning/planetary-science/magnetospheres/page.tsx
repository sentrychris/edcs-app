import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import MagnetospheresSimulation from "./components/magnetospheres-simulation";

export const metadata: Metadata = {
  title: "Magnetospheres | Planetary Science | Learning Resources | ED:CS",
  description: "How planetary magnetic fields shield atmospheres, deflect stellar wind, and produce auroras at the polar regions.",
};

const reference = [
  { body: "Mercury",  color: "#A89070", strength: "1% of Earth",          source: "Liquid Fe core (weak dynamo)",  retention: "Lost most volatiles",        note: "Compressed magnetosphere — no atmosphere shield" },
  { body: "Venus",    color: "#E8C040", strength: "Negligible",           source: "Induced by solar wind only",     retention: "CO₂ retained by mass",        note: "No internal dynamo — high atmospheric loss"      },
  { body: "Earth",    color: "#80C0FF", strength: "1.0× (reference)",     source: "Liquid Fe outer core",           retention: "Strong protection",           note: "Aurora borealis/australis from cusp particles"   },
  { body: "Mars",     color: "#E08060", strength: "Crustal patches only", source: "Lost dynamo ~4 Gyr ago",         retention: "Atmosphere stripped",         note: "Magnetic anomalies in southern crust"           },
  { body: "Jupiter",  color: "#E8B070", strength: "20,000× Earth",        source: "Liquid metallic-H mantle",       retention: "Massive — extends past Saturn", note: "Most powerful in the system; deadly radiation"  },
  { body: "Saturn",   color: "#E8DCB8", strength: "600× Earth",           source: "Metallic H, smaller core",       retention: "Strong",                      note: "Aurora visible at radio + UV wavelengths"       },
  { body: "Uranus",   color: "#80E0FF", strength: "50× Earth",            source: "Ionic water mantle (offset)",    retention: "Strong",                      note: "Magnetic axis tilted 60° from rotation axis"    },
  { body: "Neptune",  color: "#3060A0", strength: "30× Earth",            source: "Ionic water mantle (offset)",    retention: "Strong",                      note: "Magnetic axis offset from planet centre"        },
  { body: "Ganymede", color: "#C8C8D0", strength: "1% of Earth",          source: "Internal dynamo (only moon!)",   retention: "—",                           note: "Embedded inside Jupiter's magnetosphere"        },
];

export default function MagnetospheresPage() {
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
        rightIcon="icarus-terminal-shield"
        rightLabel="TOPIC — MAGNETOSPHERES"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-shield text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Magnetospheres
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Magnetic Fields, Solar Wind &amp; Auroras
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
              <SectionHeader icon="icarus-terminal-shield" title="Magnetic Field vs Solar Wind" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[520px] flex-1 min-[480px]:min-h-[440px]">
              <MagnetospheresSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
                Solar wind streams in from the left. The bow shock decelerates it, the magnetopause deflects it, the magnetotail stretches downwind. Particles that leak through the polar cusps spiral down field lines and excite the auroral ovals.
              </p>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="The Dynamo" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                A planet generates a global magnetic field when its interior
                hosts a{" "}
                <span className="text-sky-400/80">convecting electrically
                conductive fluid</span> — Earth&apos;s liquid Fe-Ni outer core,
                Jupiter&apos;s metallic hydrogen mantle, or the icy ionic
                fluid in Uranus and Neptune.
              </p>
              <p>
                The fluid&apos;s motion plus the planet&apos;s rotation
                stretches and twists existing field lines into a self-sustaining
                <span className="text-sky-400/80"> dipole</span>. Stop the
                convection (Mars) or stop the rotation (Venus) and the dynamo
                dies.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-shield" title="What It Protects" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { key: "Atmosphere",    note: "Deflected solar wind cannot strip light gases — Mars lost its air after the dynamo died" },
                { key: "Surface life",  note: "Cosmic rays + UV blocked — biosphere shielded"          },
                { key: "Ozone layer",   note: "Magnetic + atmospheric protection chain together"      },
                { key: "Equipment",     note: "Charged particles harmlessly redirected to poles"      },
              ].map(({ key, note }) => (
                <div key={key} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-[0.7rem] text-green-500/40" />
                  <span><span className="text-neutral-400">{key}</span> — {note}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-sky-900/20 pt-2 text-[0.65rem] uppercase tracking-widest text-neutral-600">
              Without a magnetosphere, atmospheric retention drops by 100–1000×.
            </p>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="Auroras" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Solar-wind particles that breach the{" "}
                <span className="text-sky-400/80">polar cusps</span> spiral
                down magnetic field lines and slam into the upper atmosphere
                near the magnetic poles, exciting atmospheric atoms into
                glowing rings — the <span className="text-green-400/70">auroral ovals</span>.
              </p>
              <p>
                Colour comes from atomic species: O at high altitude → red, O
                at lower altitude → green, N₂ → pink/violet. The ED engine
                renders aurora-like effects on certain bodies in scenic
                systems.
              </p>
              <p>
                <span className="text-sky-400/80">Jupiter&apos;s auroras</span>{" "}
                are 100× brighter than Earth&apos;s and continuously powered by
                Io&apos;s volcanic plume — not just the solar wind.
              </p>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Reference table ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Magnetospheres in the Solar System" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs uppercase tracking-wide">
            <thead>
              <tr className="border-b border-sky-900/20 text-left text-[0.7rem] tracking-widest text-neutral-600">
                <th className="pb-2 pr-4">Body</th>
                <th className="pb-2 pr-4">Strength</th>
                <th className="pb-2 pr-4">Source</th>
                <th className="pb-2 pr-4">Retention</th>
                <th className="pb-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {reference.map((row) => (
                <tr key={row.body} className="border-b border-sky-900/10">
                  <td className="py-2 pr-4 font-bold" style={{ color: row.color }}>{row.body}</td>
                  <td className="py-2 pr-4 text-amber-400/70">{row.strength}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.source}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.retention}</td>
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

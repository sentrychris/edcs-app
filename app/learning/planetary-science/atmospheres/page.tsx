import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import AtmospheresSimulation from "./components/atmospheres-simulation";

export const metadata: Metadata = {
  title: "Atmospheres | Planetary Science | Learning Resources | ED:CS",
  description: "Atmospheric structure, composition, and the physics that determine surface conditions — scale height, escape velocity, and the greenhouse effect.",
};

const reference = [
  { body: "Mercury",        color: "#A89070", pressure: "10⁻¹⁵ atm",   composition: "Trace He, Na, K (exosphere only)", scaleH: "—",       surfaceT: "−180 / +430 °C", note: "Effectively no atmosphere"            },
  { body: "Mars",           color: "#B86040", pressure: "0.006 atm",   composition: "95% CO₂, 3% N₂, 1.6% Ar",          scaleH: "11 km",    surfaceT: "−63 °C avg",     note: "Thin, dust storms, no greenhouse"     },
  { body: "Earth",          color: "#2E70B0", pressure: "1.0 atm",     composition: "78% N₂, 21% O₂, 1% Ar/H₂O",       scaleH: "8.5 km",   surfaceT: "+15 °C avg",     note: "Liquid water, biosphere, magnetic field" },
  { body: "Titan",          color: "#A06030", pressure: "1.45 atm",    composition: "95% N₂, 5% CH₄, ethane haze",      scaleH: "50 km",    surfaceT: "−179 °C",        note: "Thickest moon atmosphere; methane cycle" },
  { body: "Venus",          color: "#A06820", pressure: "92 atm",      composition: "96% CO₂, 3.5% N₂, H₂SO₄ clouds",   scaleH: "16 km",    surfaceT: "+462 °C",        note: "Runaway greenhouse, super-rotation 60×" },
  { body: "Jupiter (1 bar)",color: "#B89568", pressure: "no surface",  composition: "~90% H₂, 10% He, NH₃ clouds",      scaleH: "27 km",    surfaceT: "−108 °C @ 1 bar",note: "Atmosphere extends to metallic H mantle" },
  { body: "Neptune (1 bar)",color: "#3060A0", pressure: "no surface",  composition: "~80% H₂, 19% He, 1.5% CH₄",         scaleH: "20 km",    surfaceT: "−201 °C @ 1 bar",note: "Methane absorption gives blue colour"   },
];

export default function AtmospheresPage() {
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
              Atmospheres
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Composition, Pressure &amp; the Greenhouse Effect
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/learning/planetary-science"
        backLabel="Planetary Science"
        rightIcon="icarus-terminal-planet"
        rightLabel="TOPIC — ATMOSPHERES"
      />

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Simulation ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-planet" title="Atmospheric Comparison" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[640px] flex-1 min-[480px]:min-h-[480px]">
              <AtmospheresSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
                Atmospheric thickness shown is exaggerated 3–5× relative to body radius for visibility — Earth&apos;s real atmosphere is paper-thin against the planet. Cloud motion reflects relative super-rotation rates.
              </p>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="Anatomy of an Atmosphere" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Pressure falls off exponentially with altitude. The{" "}
                <span className="text-sky-400/80">scale height</span> H = kT/(mg)
                is the altitude at which pressure drops by a factor of e —
                determined by temperature, gas mass, and gravity.
              </p>
              <p>
                Layers from surface outward:{" "}
                <span className="text-sky-400/80">troposphere</span> (weather),{" "}
                <span className="text-sky-400/80">stratosphere</span> (ozone, jet
                streams), <span className="text-sky-400/80">mesosphere</span>,{" "}
                <span className="text-sky-400/80">thermosphere</span>{" "}
                (auroras), and the diffuse{" "}
                <span className="text-sky-400/80">exosphere</span> bleeding into
                space.
              </p>
              <p>
                Whether a planet keeps its atmosphere depends on{" "}
                <span className="text-sky-400/80">escape velocity</span> versus
                molecular thermal speeds — light gases like H₂ leak from any
                terrestrial body, heavy gases like CO₂ stay put.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="Greenhouse &amp; Climate" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { key: "Mars",    note: "Thin CO₂ — weak greenhouse, freezes despite sunlight" },
                { key: "Earth",   note: "Trace CO₂/H₂O — +33 °C of warming over no-atmosphere baseline" },
                { key: "Titan",   note: "CH₄ greenhouse + N₂ pressure-broadening" },
                { key: "Venus",   note: "Runaway: 96% CO₂ → +500 °C of greenhouse forcing" },
              ].map(({ key, note }) => (
                <div key={key} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-[0.6rem] text-amber-500/40" />
                  <span><span className="text-neutral-400">{key}</span> — {note}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-sky-900/20 pt-2 text-[0.65rem] uppercase tracking-widest text-neutral-600">
              The same physics drives why ELWs are rare — small composition shifts run away in either direction.
            </p>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-planet-lander" title="ED: Atmospheric Landings" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                <span className="text-sky-400/80">Odyssey</span> introduced
                landings on bodies with{" "}
                <span className="text-green-400/80">thin atmospheres</span> only
                — typically pressure under ~0.1 atm. Anything thicker remains
                no-land.
              </p>
              <p>
                The system map flags atmospheric type on every body. Common
                atmospheric compositions in ED:{" "}
                <span className="text-sky-400/80">CO₂</span>,{" "}
                <span className="text-sky-400/80">SO₂</span>,{" "}
                <span className="text-sky-400/80">water</span>,{" "}
                <span className="text-sky-400/80">methane</span>,{" "}
                <span className="text-sky-400/80">ammonia</span>,{" "}
                <span className="text-sky-400/80">helium</span>, and{" "}
                <span className="text-sky-400/80">neon</span>. Atmosphere
                composition is a scan-bonus parameter.
              </p>
              <p>
                Look for <span className="text-green-400/70">N₂/O₂</span> on a
                non-ELW: it usually flags a{" "}
                <span className="text-sky-400/80">terraformable</span> body
                with substantial cartographic value.
              </p>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Reference table ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Atmosphere Reference — Sol System" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs uppercase tracking-wide">
            <thead>
              <tr className="border-b border-sky-900/20 text-left text-[0.6rem] tracking-widest text-neutral-600">
                <th className="pb-2 pr-4">Body</th>
                <th className="pb-2 pr-4">Surface P</th>
                <th className="pb-2 pr-4">Composition</th>
                <th className="pb-2 pr-4">Scale H</th>
                <th className="pb-2 pr-4">Surface T</th>
                <th className="pb-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {reference.map((row) => (
                <tr key={row.body} className="border-b border-sky-900/10">
                  <td className="py-2 pr-4 font-bold" style={{ color: row.color }}>{row.body}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.pressure}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.composition}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.scaleH}</td>
                  <td className="py-2 pr-4 text-amber-400/70">{row.surfaceT}</td>
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

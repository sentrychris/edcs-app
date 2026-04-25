import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import HabitableZonesSimulation from "./components/habitable-zones-simulation";

export const metadata: Metadata = {
  title: "Habitable Zones | Planetary Science | Learning Resources | ED:CS",
  description: "The Goldilocks zone — where liquid water can exist on a planet's surface. How habitable zone distance scales with stellar luminosity.",
};

const reference = [
  { type: "O", color: "#9BB0FF", lum: "30,000",  mass: "≥16",   hzInner: "165",   hzOuter: "237",   period: "~600 yr",  note: "Massive, hot, brief — HZ planets are rare"        },
  { type: "B", color: "#AABFFF", lum: "1,000",   mass: "2–16",  hzInner: "30",    hzOuter: "44",    period: "~70 yr",   note: "Hot blue-white, short MS lifetime"                 },
  { type: "A", color: "#D8E2FF", lum: "25",      mass: "1.4–2", hzInner: "4.7",   hzOuter: "6.85",  period: "~10 yr",   note: "Bright white; HZ at ~5–7 AU"                       },
  { type: "F", color: "#FFFDE0", lum: "3",       mass: "1–1.4", hzInner: "1.65",  hzOuter: "2.40",  period: "~2 yr",    note: "Slightly hotter than Sun, wider HZ"                },
  { type: "G", color: "#FFD580", lum: "1",       mass: "0.8–1", hzInner: "0.95",  hzOuter: "1.37",  period: "~1 yr",    note: "Sun analogue — Earth at 1 AU"                       },
  { type: "K", color: "#FFAF50", lum: "0.15",    mass: "0.45–0.8", hzInner: "0.37", hzOuter: "0.53", period: "~0.2 yr", note: "Long-lived, stable HZ — best for life longevity"   },
  { type: "M", color: "#FF6840", lum: "0.01",    mass: "0.08–0.45",hzInner: "0.05", hzOuter: "0.20", period: "~21 d",    note: "HZ planets often tidally locked; flare risk"       },
];

export default function HabitableZonesPage() {
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
          <i className="icarus-terminal-planet-life text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Habitable Zones
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              The Goldilocks Zone &amp; Liquid-Water Worlds
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/learning/planetary-science"
        backLabel="Planetary Science"
        rightIcon="icarus-terminal-planet-life"
        rightLabel="TOPIC — HABITABLE ZONES"
      />

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Simulation ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-planet-life" title="HZ Comparison Across Stellar Types" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[640px] flex-1 min-[480px]:min-h-[420px]">
              <HabitableZonesSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
                Each panel uses its own scale — actual HZ distances span over 4,000× from M-dwarf to O-type. <span className="text-red-400/70">Red dashed</span> ring = inner edge (runaway greenhouse). <span className="text-sky-400/70">Blue dashed</span> ring = outer edge (CO₂ glaciation).
              </p>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="What Is the HZ?" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                The <span className="text-green-400/80">habitable zone</span> is
                the orbital region where a rocky planet with an Earth-like
                atmosphere could maintain{" "}
                <span className="text-sky-400/80">liquid water</span> on its
                surface — too close and it boils, too far and it freezes.
              </p>
              <p>
                The HZ scales with{" "}
                <span className="text-sky-400/80">√(L/L☉)</span> because flux
                falls off as 1/r² and equilibrium temperature scales as the
                fourth root of flux. A star ten thousand times more luminous
                pushes the HZ a hundred times further out.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="Why It's Not Enough" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { key: "Stellar lifetime", note: "O/B stars die before life can develop" },
                { key: "Tidal locking",    note: "M-dwarf HZ planets show one face — extreme thermal contrast" },
                { key: "Flare activity",   note: "Young M dwarfs strip atmospheres with UV/X-ray flares"        },
                { key: "Atmosphere",       note: "Without N₂/O₂, surface water can't persist"                 },
                { key: "Magnetic field",   note: "Required to deflect stellar wind and retain atmosphere"      },
              ].map(({ key, note }) => (
                <div key={key} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-[0.6rem] text-amber-500/40" />
                  <span><span className="text-neutral-400">{key}</span> — {note}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="ED: Where to Find ELWs" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                <span className="text-green-400/80">G-type</span> and{" "}
                <span className="text-green-400/80">K-type</span> stars are the
                sweet spot — long-lived, stable HZs, and Earth-likes form
                here far more often than around M dwarfs.
              </p>
              <p>
                In the system map, look for{" "}
                <span className="text-sky-400/80">terrestrial bodies</span> at
                distances roughly equal to the listed HZ range for the parent
                star&apos;s class.{" "}
                <span className="text-green-400/80">ELW</span>,{" "}
                <span className="text-green-400/80">water world</span>, and{" "}
                <span className="text-green-400/80">ammonia world</span>{" "}
                cartographic credits all reward HZ-band finds.
              </p>
              <p>
                Around <span className="text-sky-400/80">binaries</span>, the
                effective HZ is the combined flux from both stars — a circumbinary
                ELW must be far from <em>both</em> components.
              </p>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Reference table ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="HZ Reference — Main Sequence" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs uppercase tracking-wide">
            <thead>
              <tr className="border-b border-sky-900/20 text-left text-[0.6rem] tracking-widest text-neutral-600">
                <th className="pb-2 pr-4">Class</th>
                <th className="pb-2 pr-4">Mass (M☉)</th>
                <th className="pb-2 pr-4">Lum. (L☉)</th>
                <th className="pb-2 pr-4">HZ Inner (AU)</th>
                <th className="pb-2 pr-4">HZ Outer (AU)</th>
                <th className="pb-2 pr-4">Year @ HZ</th>
                <th className="pb-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {reference.map((row) => (
                <tr key={row.type} className="border-b border-sky-900/10">
                  <td className="py-2 pr-4 font-bold" style={{ color: row.color }}>{row.type}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.mass}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.lum}</td>
                  <td className="py-2 pr-4 text-amber-400/70">{row.hzInner}</td>
                  <td className="py-2 pr-4 text-sky-400/70">{row.hzOuter}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.period}</td>
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

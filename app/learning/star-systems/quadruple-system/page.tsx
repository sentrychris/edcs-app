import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import QuadrupleSystemSimulation from "./components/quadruple-system-simulation";

export const metadata: Metadata = {
  title: "Quadruple System | Star Systems | Learning Resources | ED:CS",
  description: "Hierarchical four-star systems — two close binaries orbiting their common barycentre.",
};

const reference = [
  { type: "2 + 2",         color: "#FFD580", desc: "Two tight binaries on a wide mutual orbit",            stability: "Stable if outer / inner ratio > 100", example: "Mizar (ζ UMa)"        },
  { type: "3 + 1",         color: "#FFAF50", desc: "Hierarchical triple + distant fourth companion",        stability: "Stable with strong hierarchy",        example: "HD 91962"             },
  { type: "Trapezium",     color: "#FF7040", desc: "Four young stars in a loosely bound cluster",           stability: "Often dynamically unstable",          example: "θ¹ Orionis core"      },
  { type: "Higher-order",  color: "#A0BFFF", desc: "5+ stars (quintuples, sextuples)",                      stability: "Always nested hierarchies",           example: "Castor (6 stars), AR Cassiopeiae (7)" },
];

export default function QuadrupleSystemPage() {
  return (
    <>
      <TerminalHeader
        moduleLabel="MODULE:LEARNING"
        protocolLabel="DATABASE:STAR-SYSTEMS"
        statusLabel="SIMULATION: ACTIVE"
      />

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/learning/star-systems"
        backLabel="Star Systems"
        rightIcon="icarus-terminal-system-orbits"
        rightLabel="TOPIC — QUADRUPLE SYSTEM"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-system-orbits text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Quadruple System
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Two Binaries Orbiting a Common Barycentre
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
              <SectionHeader icon="icarus-terminal-system-orbits" title="2 + 2 Hierarchical Quadruple" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[520px] flex-1 min-[480px]:min-h-[420px]">
              <QuadrupleSystemSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
                The Mizar archetype: two tight binary pairs (AB and CD) co-orbiting a system-wide barycentre. Each pair&apos;s internal orbital period is far shorter than the wide outer orbit — required for long-term stability.
              </p>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="Why Hierarchies?" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Stable multi-star systems are always{" "}
                <span className="text-sky-400/80">hierarchical</span> — composed
                of nested pairs. A flat 4-star arrangement (all four roughly the
                same distance apart) is dynamically chaotic and ejects members
                within a few orbital periods.
              </p>
              <p>
                The rule of thumb:{" "}
                <span className="text-sky-400/80">outer separation ≥ 100×
                inner</span>. This makes each tight pair&apos;s gravity dominate
                locally while the wider orbit feels them as a single point mass.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="Mizar Archetype" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { key: "Mizar A",   note: "Spectroscopic binary — two A-type stars, ~6 day period" },
                { key: "Mizar B",   note: "Also a binary — fainter A-type pair"                    },
                { key: "AB ↔ CD",   note: "Wide orbit ~380 AU, period ~5,000 years"                },
                { key: "Alcor",     note: "Distant 5th — bound 4 ly away (whole system is sextuple!)" },
              ].map(({ key, note }) => (
                <div key={key} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-[0.7rem] text-sky-500/40" />
                  <span><span className="text-neutral-400">{key}</span> — {note}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="ED: 4+ Star Systems" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Elite Dangerous includes many quadruple+ systems — some have 5,
                6, or even 7 stellar bodies. The system map shows the
                hierarchy as a tree: each barycentre marker indicates a sub-pair
                that orbits something larger.
              </p>
              <p>
                Drop into a tight binary inside a quadruple and you&apos;ll see
                two stars bigger than your view. The other pair is somewhere else
                entirely — sometimes hours of supercruise away.
              </p>
              <p>
                Look for systems with multiple{" "}
                <span className="text-sky-400/80">A B C D</span> designations in
                the nav panel — these are nearly always quadruple-or-higher
                hierarchies.
              </p>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Reference table ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Quadruple Architectures" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs uppercase tracking-wide">
            <thead>
              <tr className="border-b border-sky-900/20 text-left text-[0.7rem] tracking-widest text-neutral-600">
                <th className="pb-2 pr-4">Architecture</th>
                <th className="pb-2 pr-4">Description</th>
                <th className="pb-2 pr-4">Stability</th>
                <th className="pb-2">Example</th>
              </tr>
            </thead>
            <tbody>
              {reference.map((row) => (
                <tr key={row.type} className="border-b border-sky-900/10">
                  <td className="py-2 pr-4 font-bold" style={{ color: row.color }}>{row.type}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.desc}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.stability}</td>
                  <td className="py-2 text-neutral-600">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

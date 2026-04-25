import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import StarFormationSimulation from "./components/star-formation-simulation";

export const metadata: Metadata = {
  title: "Star Formation | Stellar Physics | Learning Resources | ED:CS",
  description: "How stars are born — from molecular cloud collapse to protostar with bipolar jets and accretion disk to main-sequence ignition.",
};

const reference = [
  { stage: "Molecular cloud",   color: "#9070FF", duration: "~10 Myr",   feature: "Cold (~10 K) dense H₂ + dust",          note: "Triggered by SN shocks or galactic density waves" },
  { stage: "Cloud collapse",    color: "#A080FF", duration: "~100 kyr",  feature: "Gravitational free-fall of fragment",   note: "Jeans-mass criterion determines minimum cloudlet"  },
  { stage: "Class 0 protostar", color: "#FF6040", duration: "~10 kyr",   feature: "Deeply embedded, infalling envelope",   note: "Visible only in IR / sub-mm — optically invisible" },
  { stage: "Class I protostar", color: "#FF8030", duration: "~100 kyr",  feature: "Disk + jets visible, envelope thinning", note: "Strong bipolar outflows clear cavity"               },
  { stage: "T Tauri (Class II)",color: "#FFAF50", duration: "~1–10 Myr", feature: "Pre-main-sequence, thick disk",          note: "Optical visibility; H-alpha emission lines"        },
  { stage: "Class III / WTTS",  color: "#FFD580", duration: "~10 Myr",   feature: "Disk dispersing, no accretion",          note: "Weak T Tauri — late pre-main-sequence"             },
  { stage: "Main sequence",     color: "#FFFDE0", duration: "Myr–Tyr",   feature: "Hydrostatic H fusion ignites",           note: "Star joins the OBAFGKM main sequence"             },
];

export default function StarFormationPage() {
  return (
    <>
      <TerminalHeader
        moduleLabel="MODULE:LEARNING"
        protocolLabel="DATABASE:STELLAR-PHYSICS"
        statusLabel="SIMULATION: ACTIVE"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-star text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Star Formation
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Protostars, Disks &amp; Bipolar Jets
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/learning/stellar-physics"
        backLabel="Stellar Physics"
        rightIcon="icarus-terminal-star"
        rightLabel="TOPIC — STAR FORMATION"
      />

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Simulation ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-star" title="Class I Protostar" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[640px] flex-1 min-[480px]:min-h-[520px]">
              <StarFormationSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
                Material falls in along the disk plane while bipolar jets shoot perpendicular along the rotation axis. Background nebulosity is the parent molecular cloud the protostar is still embedded in. Real bipolar jets reach 0.5 light-years long.
              </p>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="From Cloud to Star" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Stars form in cold, dense{" "}
                <span className="text-sky-400/80">molecular clouds</span> — vast
                regions of H₂ and dust at temperatures around 10 K. When a
                cloud fragment exceeds the{" "}
                <span className="text-sky-400/80">Jeans mass</span>, gravity
                wins over thermal and magnetic pressure and the fragment
                collapses.
              </p>
              <p>
                Conservation of{" "}
                <span className="text-sky-400/80">angular momentum</span> spins
                the collapsing cloud into a flattened disk. Material spirals
                in, releasing gravitational energy as heat. The centre forms
                a hot, dense{" "}
                <span className="text-sky-400/80">protostar</span> — not yet
                fusing, but glowing brightly from compression.
              </p>
              <p>
                When the core reaches ~15 MK, hydrogen fusion ignites and the
                star joins the main sequence — typically after a few Myr for
                solar-mass stars.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="Why Bipolar Jets?" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { key: "Magnetic launch",  note: "Disk's magnetic field flings ionised gas along rotation axis" },
                { key: "Mass loss",        note: "Up to 10% of accreted material is ejected back out as jet"    },
                { key: "Speeds",           note: "200–1000 km/s — visible as Herbig-Haro objects when shock-heated" },
                { key: "Lifetime",         note: "Active during embedded protostar phases (~100 kyr)"           },
                { key: "Cleared cavity",   note: "Sweeps away the natal envelope, revealing the young star"     },
              ].map(({ key, note }) => (
                <div key={key} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-[0.6rem] text-sky-500/40" />
                  <span><span className="text-neutral-400">{key}</span> — {note}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="ED: Nebula Sites" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Elite Dangerous places{" "}
                <span className="text-sky-400/80">named nebulae</span> across
                the galaxy — many are the visible afterglow of recent
                star-formation episodes. The Pleiades, Witch Head, and
                California Nebula all host(ed) active formation regions.
              </p>
              <p>
                The disk that forms a star also forms its{" "}
                <span className="text-sky-400/80">planetary system</span>.
                Material that doesn&apos;t accrete onto the protostar
                eventually settles into the planets, asteroids, and rings you
                see today. Every system in ED started this way.
              </p>
              <p>
                <span className="text-sky-400/80">T Tauri stars</span> appear
                in ED as a distinct stellar variety — pre-main-sequence stars
                still in their disk-bearing phase.
              </p>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Reference table ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Stages of Star Formation" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs uppercase tracking-wide">
            <thead>
              <tr className="border-b border-sky-900/20 text-left text-[0.6rem] tracking-widest text-neutral-600">
                <th className="pb-2 pr-4">Stage</th>
                <th className="pb-2 pr-4">Duration</th>
                <th className="pb-2 pr-4">Key Feature</th>
                <th className="pb-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {reference.map((row) => (
                <tr key={row.stage} className="border-b border-sky-900/10">
                  <td className="py-2 pr-4 font-bold" style={{ color: row.color }}>{row.stage}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.duration}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.feature}</td>
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

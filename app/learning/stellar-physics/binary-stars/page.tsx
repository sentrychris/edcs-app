import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import BinaryStarsSimulation from "./components/binary-stars-simulation";

export const metadata: Metadata = {
  title: "Binary Stars | Stellar Physics | Learning Resources | ED:CS",
  description: "How stellar pairs interact — Roche lobes, mass transfer, accretion disks, and the path to novae and Type Ia supernovae.",
};

const reference = [
  { type: "Detached",          color: "#90D0FF", desc: "Both stars within their Roche lobes",       outcome: "Stable orbital evolution",                example: "Sirius A + B"       },
  { type: "Semi-detached",     color: "#FFAF50", desc: "One star fills its Roche lobe",             outcome: "Steady mass transfer through L1",         example: "Algol, U Geminorum" },
  { type: "Contact",           color: "#FF7040", desc: "Both stars overflow — common envelope",      outcome: "Merger or rapid evolution",               example: "W Ursae Majoris"    },
  { type: "Cataclysmic var.",  color: "#A0BFFF", desc: "Red dwarf donor + white dwarf accretor",     outcome: "Recurrent novae, dwarf novae",            example: "SS Cygni, RS Oph"   },
  { type: "Type Ia precursor", color: "#FFD060", desc: "Subgiant donor + white dwarf accretor",      outcome: "WD reaches Chandrasekhar limit → SN Ia",  example: "Tycho's supernova"  },
  { type: "X-ray binary",      color: "#FF6080", desc: "Massive donor + neutron star or black hole", outcome: "Hot accretion disk emits X-rays",         example: "Cygnus X-1, Sco X-1" },
  { type: "Symbiotic",         color: "#C080FF", desc: "Red giant + hot compact companion",         outcome: "Wind-fed accretion, slow novae",          example: "R Aquarii"          },
];

export default function BinaryStarsPage() {
  return (
    <>
      <TerminalHeader
        moduleLabel="MODULE:LEARNING"
        protocolLabel="DATABASE:STELLAR-PHYSICS"
        statusLabel="SIMULATION: ACTIVE"
      />

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/learning/stellar-physics"
        backLabel="Stellar Physics"
        rightIcon="icarus-terminal-star"
        rightLabel="TOPIC — BINARY STARS"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-star text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Binary Stars
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Roche Lobes, Mass Transfer &amp; Accretion
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
              <SectionHeader icon="icarus-terminal-star" title="Semi-Detached Mass-Transfer Binary" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[560px] flex-1 min-[480px]:min-h-[480px]">
              <BinaryStarsSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
                A red giant has expanded to fill its Roche lobe. Gas streams through the L1 Lagrange point, curves under the system&apos;s rotation, and impacts a hot accretion disk around the white-dwarf companion. Roche-lobe outlines shown dashed.
              </p>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="Three Configurations" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Every binary fits into one of three categories defined by{" "}
                <span className="text-sky-400/80">Roche lobes</span> — the
                teardrop-shaped regions where each star&apos;s gravity dominates.
              </p>
              <p>
                <span className="text-sky-400/80">Detached</span>: both stars
                inside their lobes — they evolve independently.{" "}
                <span className="text-amber-400/80">Semi-detached</span>: one
                star (usually the more evolved giant) has expanded to fill its
                lobe, spilling material through L1.{" "}
                <span className="text-red-400/70">Contact</span>: both stars
                overflow, merging into a common envelope and often coalescing.
              </p>
              <p>
                The <span className="text-sky-400/80">L1 point</span> is where
                the two gravitational potentials balance — the saddle point
                through which mass flows.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="Where the Mass Goes" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { key: "Accretion disk",  note: "Angular momentum prevents direct impact — gas spirals in" },
                { key: "Hot spot",        note: "Stream–disk impact heats to 10,000+ K — UV-bright"        },
                { key: "Novae",           note: "Surface H accumulates on WD until thermonuclear runaway"  },
                { key: "Type Ia SN",      note: "WD passes Chandrasekhar limit → carbon detonation"        },
                { key: "X-ray binaries",  note: "Disk around NS/BH heats to millions of K → X-rays"        },
              ].map(({ key, note }) => (
                <div key={key} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-[0.7rem] text-amber-500/40" />
                  <span><span className="text-neutral-400">{key}</span> — {note}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-sky-900/20 pt-2 text-[0.65rem] uppercase tracking-widest text-neutral-600">
              Mass transfer is how dead stars come back to life — and sometimes how they die again.
            </p>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="ED: Binary Systems" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Roughly half of stars in the galaxy are in binaries. Elite
                Dangerous reflects this — close binaries are common, and you
                can drop directly between paired stars with care.
              </p>
              <p>
                <span className="text-sky-400/80">Close binaries</span> often
                share a single mass-1 entry in the system map. Watch for tight
                orbital periods (hours to days) — these are the systems where
                mass transfer is happening right now.
              </p>
              <p>
                <span className="text-sky-400/80">Neutron-star binaries</span>{" "}
                are exploration gold: a fuel-scoopable companion plus the
                neutron star&apos;s FSD jet supercharge. Look for them on the
                Colonia Highway and deep-space expedition routes.
              </p>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Reference table ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Binary Configurations &amp; Outcomes" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs uppercase tracking-wide">
            <thead>
              <tr className="border-b border-sky-900/20 text-left text-[0.7rem] tracking-widest text-neutral-600">
                <th className="pb-2 pr-4">Type</th>
                <th className="pb-2 pr-4">Description</th>
                <th className="pb-2 pr-4">Outcome</th>
                <th className="pb-2">Example</th>
              </tr>
            </thead>
            <tbody>
              {reference.map((row) => (
                <tr key={row.type} className="border-b border-sky-900/10">
                  <td className="py-2 pr-4 font-bold" style={{ color: row.color }}>{row.type}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.desc}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.outcome}</td>
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

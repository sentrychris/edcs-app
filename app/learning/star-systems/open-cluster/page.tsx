import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import OpenClusterSimulation from "./components/open-cluster-simulation";

export const metadata: Metadata = {
  title: "Open Cluster | Star Systems | Learning Resources | ED:CS",
  description: "Loose stellar associations born from the same molecular cloud — co-formed, co-moving stars on their way to dispersal.",
};

const reference = [
  { name: "Pleiades (M45)",     color: "#AABFFF", age: "~100 Myr",  count: "~3,000",   distance: "444 ly",   note: "The Seven Sisters — visible to naked eye"          },
  { name: "Hyades",             color: "#FFD580", age: "~625 Myr",  count: "~400",     distance: "153 ly",   note: "Closest cluster to the Sun"                        },
  { name: "Praesepe (M44)",     color: "#FFFDE0", age: "~600 Myr",  count: "~1,000",   distance: "577 ly",   note: "Beehive Cluster — older open cluster"             },
  { name: "Double Cluster (h+χ)", color: "#9BB0FF", age: "~14 Myr",  count: "~10,000",  distance: "7,500 ly", note: "Two coincident clusters in Perseus"               },
  { name: "ω Centauri (NGC 5139)",color: "#FFAF50", age: "~12 Gyr",  count: "~10⁷",     distance: "17,090 ly",note: "Globular — densely packed, ancient population"   },
  { name: "M13",                color: "#FFD580", age: "~12 Gyr",   count: "~10⁵",     distance: "22,200 ly",note: "Hercules Globular — bright northern target"      },
  { name: "Trapezium (θ¹ Ori)", color: "#9BB0FF", age: "<1 Myr",    count: "~5",       distance: "1,344 ly", note: "Embryonic — still forming inside the Orion Nebula" },
];

export default function OpenClusterPage() {
  return (
    <>
      <TerminalHeader
        moduleLabel="MODULE:LEARNING"
        protocolLabel="DATABASE:STAR-SYSTEMS"
        statusLabel="SIMULATION: ACTIVE"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-system-orbits text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Open Cluster
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Stellar Nurseries &amp; Co-Moving Groups
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/learning/star-systems"
        backLabel="Star Systems"
        rightIcon="icarus-terminal-system-orbits"
        rightLabel="TOPIC — OPEN CLUSTER"
      />

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Simulation ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-system-orbits" title="75-Star Open Cluster" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[560px] flex-1 min-[480px]:min-h-[460px]">
              <OpenClusterSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
                Stars distributed by a King-like profile concentrated toward the centre. Spectral mix is biased toward hot blue-white stars (typical of young clusters). Faint background nebulosity hints at the recent formation event.
              </p>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="Born Together" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                An <span className="text-sky-400/80">open cluster</span> is a
                family of hundreds to thousands of stars formed from the same
                <span className="text-sky-400/80"> molecular cloud</span>.
                They share an age, composition, and roughly the same kinematic
                motion through the galaxy.
              </p>
              <p>
                Unlike binaries, the gravitational binding is weak. Over
                hundreds of millions of years tidal forces from the galaxy and
                close encounters with other masses gradually disperse the
                cluster — its members spread into a{" "}
                <span className="text-sky-400/80">moving group</span> sharing
                only common motion.
              </p>
              <p>
                The Sun likely formed in such a cluster ~4.6 Gyr ago. Its
                siblings are now scattered around the galaxy.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="Open vs Globular" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { key: "Open",        note: "Hundreds–thousands; young; metal-rich; in galactic disc"     },
                { key: "Globular",    note: "10⁵–10⁶ stars; ~12 Gyr; metal-poor; orbit galactic halo"     },
                { key: "Embedded",    note: "Still inside their formation nebula (Trapezium, NGC 6611)"    },
                { key: "Associations",note: "OB associations — looser, gravitationally unbound from start"  },
              ].map(({ key, note }) => (
                <div key={key} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-[0.6rem] text-sky-500/40" />
                  <span><span className="text-neutral-400">{key}</span> — {note}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="ED: Cluster POIs" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Elite Dangerous includes named clusters as visited POIs.{" "}
                <span className="text-sky-400/80">Pleiades</span>,{" "}
                <span className="text-sky-400/80">Hyades</span>, and{" "}
                <span className="text-sky-400/80">Praesepe</span> are travel
                destinations — and the Pleiades is where most of the Thargoid
                presence concentrated.
              </p>
              <p>
                Inside a cluster, hop distances between systems are short.
                You&apos;ll see neighbouring stars as bright stellar disks even
                from supercruise — because they really <em>are</em> close.
              </p>
              <p>
                Globular clusters lie above and below the galactic plane —
                getting there requires careful FSD planning. They&apos;re among
                the oldest objects in the galaxy.
              </p>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Reference table ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Notable Clusters" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs uppercase tracking-wide">
            <thead>
              <tr className="border-b border-sky-900/20 text-left text-[0.6rem] tracking-widest text-neutral-600">
                <th className="pb-2 pr-4">Cluster</th>
                <th className="pb-2 pr-4">Age</th>
                <th className="pb-2 pr-4">Members</th>
                <th className="pb-2 pr-4">Distance</th>
                <th className="pb-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {reference.map((row) => (
                <tr key={row.name} className="border-b border-sky-900/10">
                  <td className="py-2 pr-4 font-bold" style={{ color: row.color }}>{row.name}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.age}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.count}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.distance}</td>
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

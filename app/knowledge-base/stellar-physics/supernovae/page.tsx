import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import SupernovaeSimulation from "./components/supernovae-simulation";

export const metadata: Metadata = {
  title: "Supernovae | Stellar Physics | Knowledge Base | ED:CS",
  description: "How stars explode — Type Ia thermonuclear detonations, core-collapse Type II/Ib/Ic, and hypernovae.",
};

const reference = [
  { type: "Ia",     color: "#A0BFFF", trigger: "WD exceeds Chandrasekhar limit",   spectrum: "No H, strong Si II",         outcome: "No remnant — total disruption", energy: "10⁴⁴ J",   note: "Standard candle for cosmology"  },
  { type: "Ib",     color: "#80E0FF", trigger: "Core-collapse, H envelope lost",   spectrum: "No H, strong He",            outcome: "Neutron star",                  energy: "10⁴⁴ J",   note: "Stripped progenitor (Wolf-Rayet)" },
  { type: "Ic",     color: "#80E0FF", trigger: "Core-collapse, H + He lost",       spectrum: "No H, no He",                outcome: "Neutron star or black hole",    energy: "10⁴⁴ J",   note: "Sometimes paired with long GRBs" },
  { type: "II-P",   color: "#FFA060", trigger: "Red supergiant core-collapse",     spectrum: "Strong H, plateau in light", outcome: "Neutron star",                  energy: "10⁴⁴ J",   note: "Most common — ~50% of all SN"   },
  { type: "II-L",   color: "#FFB070", trigger: "Stripped supergiant collapse",     spectrum: "H, linear decay",            outcome: "Neutron star",                  energy: "10⁴⁴ J",   note: "Light curve declines linearly"  },
  { type: "IIn",    color: "#FFC080", trigger: "Collapse into dense CSM",          spectrum: "Narrow H emission lines",    outcome: "Variable",                      energy: "10⁴⁴⁻⁴⁵ J", note: "Pre-explosion mass loss interaction" },
  { type: "Hyper.", color: "#C080FF", trigger: "Extreme-mass collapse (≥40 M☉)",   spectrum: "Broad, energetic",           outcome: "Black hole",                    energy: "10⁴⁵⁻⁴⁶ J", note: "Often associated with long GRBs" },
  { type: "Pair-i.", color: "#FF80C0", trigger: "Pair-instability (130–250 M☉)",   spectrum: "Hydrogen-rich, no remnant",  outcome: "No remnant",                    energy: "10⁴⁵⁻⁴⁶ J", note: "Theoretical extreme — Pop III stars" },
];

export default function SupernovaePage() {
  return (
    <>
      <TerminalHeader
        moduleLabel="MODULE:KNOWLEDGE-BASE"
        protocolLabel="DATABASE:STELLAR-PHYSICS"
        statusLabel="SIMULATION: ACTIVE"
      />

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/knowledge-base/stellar-physics"
        backLabel="Stellar Physics"
        rightIcon="icarus-terminal-star"
        rightLabel="TOPIC — SUPERNOVAE"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-star text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Supernovae
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              How Stars Explode
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
              <SectionHeader icon="icarus-terminal-star" title="Four Explosion Pathways" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[560px] flex-1 min-[480px]:min-h-[440px]">
              <SupernovaeSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
                Each panel cycles continuously: progenitor → flash → expanding shockwave → remnant. Cycles are offset so the four types stay out of phase. Real supernovae brighten over weeks and fade over years.
              </p>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="Two Mechanisms, Many Flavours" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Despite the spectral variety, all supernovae fall into two
                physical mechanisms.{" "}
                <span className="text-sky-400/80">Thermonuclear</span> (Type Ia)
                — a white dwarf accreting mass past the Chandrasekhar limit
                detonates carbon in a runaway fusion chain.{" "}
                <span className="text-sky-400/80">Core-collapse</span> (Types
                Ib/Ic, II, hypernovae) — a massive star&apos;s iron core
                implodes in under a second.
              </p>
              <p>
                The <span className="text-sky-400/80">spectral type</span>{" "}
                (presence or absence of H, He) reflects the progenitor&apos;s
                envelope, not the underlying physics — a Type Ic is a Type II
                that lost its outer layers to a strong stellar wind or a
                companion.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="Energetics" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { key: "Total energy",     note: "~10⁴⁴ J — equals the Sun&apos;s entire 10 Gyr output" },
                { key: "Light",            note: "~1% of total energy — outshines the host galaxy"     },
                { key: "Kinetic",          note: "~99% — ejecta moves at 10,000 km/s"                  },
                { key: "Neutrinos",        note: "Core-collapse: ~99% of energy escapes as neutrinos"  },
                { key: "Element factory",  note: "Forges all stable nuclei heavier than iron via r-process" },
              ].map(({ key, note }) => (
                <div key={key} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-[0.7rem] text-amber-500/40" />
                  <span><span className="text-neutral-400">{key}</span> — <span dangerouslySetInnerHTML={{ __html: note }} /></span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="ED: Supernova Remnants" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                The galaxy is littered with the aftermath. Every neutron star
                you fly past in Elite Dangerous was once the iron core of a
                massive star — left behind when its envelope was blasted off in
                a Type II event.
              </p>
              <p>
                <span className="text-sky-400/80">Black holes</span> from
                stellar collapse trace back to the most massive O-type
                progenitors. Smaller-mass stars give neutron stars; heaviest
                progenitors collapse all the way to a singularity.
              </p>
              <p>
                Type Ia supernovae leave{" "}
                <span className="text-sky-400/80">no remnant</span>. The white
                dwarf is completely vaporised — only an expanding shell of
                iron-peak elements drifting through space.
              </p>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Reference table ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Supernova Classification" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs uppercase tracking-wide">
            <thead>
              <tr className="border-b border-sky-900/20 text-left text-[0.7rem] tracking-widest text-neutral-600">
                <th className="pb-2 pr-4">Type</th>
                <th className="pb-2 pr-4">Trigger</th>
                <th className="pb-2 pr-4">Spectrum</th>
                <th className="pb-2 pr-4">Outcome</th>
                <th className="pb-2 pr-4">Energy</th>
                <th className="pb-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {reference.map((row) => (
                <tr key={row.type} className="border-b border-sky-900/10">
                  <td className="py-2 pr-4 font-bold" style={{ color: row.color }}>{row.type}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.trigger}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.spectrum}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.outcome}</td>
                  <td className="py-2 pr-4 text-amber-400/70">{row.energy}</td>
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

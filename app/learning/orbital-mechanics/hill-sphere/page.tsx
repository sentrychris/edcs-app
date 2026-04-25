import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import HillSphereSimulation from "./components/hill-sphere-simulation";

export const metadata: Metadata = {
  title: "Hill Sphere | Orbital Mechanics | Learning Resources | ED:CS",
  description: "The region around a body where its gravity dominates over the parent's — sets the limit on stable moons and captured satellites.",
};

const reference = [
  { body: "Mercury",  color: "#A89070", parentDist: "0.39 AU",  hillR: "0.0012 AU (175,000 km)", maxMoon: "Tiny / none stable",         note: "Sun's tides destabilise even close moons"           },
  { body: "Venus",    color: "#E8C040", parentDist: "0.72 AU",  hillR: "0.0067 AU (1.0 M km)",   maxMoon: "None observed",              note: "Captured moons would be unstable on long timescales" },
  { body: "Earth",    color: "#80C0FF", parentDist: "1.0 AU",   hillR: "0.010 AU (1.5 M km)",    maxMoon: "Moon at 384,400 km",         note: "Moon orbits at ~26% of Hill radius"                  },
  { body: "Mars",     color: "#E08060", parentDist: "1.52 AU",  hillR: "0.0066 AU (985,000 km)", maxMoon: "Phobos & Deimos (very close)", note: "Both moons well inside Hill radius"               },
  { body: "Jupiter",  color: "#E8B070", parentDist: "5.2 AU",   hillR: "0.355 AU (53 M km)",     maxMoon: "Callisto at 1.88 M km",      note: "Hosts 95+ moons, mostly captured asteroids"          },
  { body: "Saturn",   color: "#E8DCB8", parentDist: "9.5 AU",   hillR: "0.435 AU (65 M km)",     maxMoon: "Iapetus at 3.56 M km",       note: "Wide Hill sphere → hundreds of small moons"         },
  { body: "Neptune",  color: "#3060A0", parentDist: "30 AU",    hillR: "0.77 AU (115 M km)",     maxMoon: "Triton (retrograde capture)", note: "Far from Sun → enormous Hill sphere"               },
];

export default function HillSpherePage() {
  return (
    <>
      <TerminalHeader
        moduleLabel="MODULE:LEARNING"
        protocolLabel="DATABASE:ORBITAL-MECHANICS"
        statusLabel="SIMULATION: ACTIVE"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-system-orbits text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Hill Sphere
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              The Region of Gravitational Dominance
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/learning/orbital-mechanics"
        backLabel="Orbital Mechanics"
        rightIcon="icarus-terminal-system-orbits"
        rightLabel="TOPIC — HILL SPHERE"
      />

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Simulation ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-system-orbits" title="Nested Spheres of Influence" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[520px] flex-1 min-[480px]:min-h-[440px]">
              <HillSphereSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
                The planet&apos;s Hill sphere (green) is where its gravity dominates over the star&apos;s. Inside, the moon orbits stably. The moon&apos;s own (much smaller) Hill sphere defines the region <em>it</em> dominates. Particles inside are captured; outside, they drift back to the star.
              </p>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="The Formula" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                <span className="text-sky-400/80">r_H ≈ a · (m / 3M)^(1/3)</span>
              </p>
              <p>
                Where <em>a</em> is the body&apos;s semi-major axis around its
                parent, <em>m</em> is the body&apos;s mass, and <em>M</em> is
                the parent&apos;s mass.
              </p>
              <p>
                The Hill radius is approximately the distance to the L1 and L2
                Lagrange points of the body-parent system. Anything orbiting
                <em> within</em> that radius is gravitationally bound to the
                body; outside it, the parent dominates.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="Stability Limits" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { key: "Outer ~1/3 r_H",   note: "Prograde moons stable on long timescales"     },
                { key: "Outer ~1/2 r_H",   note: "Retrograde moons remain stable (less perturbed)" },
                { key: "Beyond r_H",       note: "Body drifts free — captured by parent instead"  },
                { key: "Eccentric orbits", note: "Effective Hill radius shrinks with eccentricity" },
              ].map(({ key, note }) => (
                <div key={key} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-[0.6rem] text-sky-500/40" />
                  <span><span className="text-neutral-400">{key}</span> — {note}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 border-t border-sky-900/20 pt-2 text-[0.65rem] uppercase tracking-widest text-neutral-600">
              Earth&apos;s Moon orbits at ~26% of Earth&apos;s Hill radius — comfortably stable.
            </p>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="ED: Why Some Bodies Have No Moons" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                The Hill sphere explains a lot of what you see in the system
                map.{" "}
                <span className="text-sky-400/80">Close-in planets</span> have
                tiny Hill radii — they can&apos;t hold large moons against the
                star&apos;s tides.
              </p>
              <p>
                <span className="text-sky-400/80">Outer gas giants</span> have
                enormous Hill spheres → huge moon collections (Jupiter has 95+,
                Saturn 100+). ED reflects this — gas giants in cold orbits
                often host the densest moon systems.
              </p>
              <p>
                Tightly-bound stellar binaries{" "}
                <span className="text-sky-400/80">share Hill spheres</span> with
                each other. A planet around one star in a close binary lives
                in a small effective Hill region — explaining why{" "}
                <span className="text-sky-400/80">S-type planets</span> in
                tight binaries are rare.
              </p>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Reference table ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Hill Spheres in the Solar System" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs uppercase tracking-wide">
            <thead>
              <tr className="border-b border-sky-900/20 text-left text-[0.6rem] tracking-widest text-neutral-600">
                <th className="pb-2 pr-4">Body</th>
                <th className="pb-2 pr-4">Distance from Sun</th>
                <th className="pb-2 pr-4">Hill Radius</th>
                <th className="pb-2 pr-4">Largest Moon Inside</th>
                <th className="pb-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {reference.map((row) => (
                <tr key={row.body} className="border-b border-sky-900/10">
                  <td className="py-2 pr-4 font-bold" style={{ color: row.color }}>{row.body}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.parentDist}</td>
                  <td className="py-2 pr-4 text-amber-400/70">{row.hillR}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.maxMoon}</td>
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

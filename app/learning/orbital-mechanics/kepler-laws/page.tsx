import type { Metadata } from "next";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import KeplerLawsSimulation from "./components/kepler-laws-simulation";

export const metadata: Metadata = {
  title: "Kepler's Laws | Orbital Mechanics | Learning Resources | ED:CS",
  description: "The three laws governing planetary motion — ellipses, equal areas in equal times, and the period-distance relation.",
};

const reference = [
  { law: "1st Law",  color: "#80B0FF", statement: "Each orbit is an ellipse with the star at one focus",                                                       year: "1609", note: "Replaced perfect-circle dogma; works for any 2-body bound orbit"     },
  { law: "2nd Law",  color: "#80FFA0", statement: "A line from star to planet sweeps equal areas in equal times",                                              year: "1609", note: "Equivalent to conservation of angular momentum"                       },
  { law: "3rd Law",  color: "#FFA050", statement: "T² = (4π² / GM) × a³  — period squared proportional to semi-major axis cubed",                              year: "1619", note: "Lets you compute mass from orbital geometry — 'celestial weighing'"  },
  { law: "Newton",   color: "#A0BFFF", statement: "Universal gravitation F = GMm / r² — derived all three Kepler laws from first principles",                  year: "1687", note: "Plus a small relativistic correction for tight orbits (Mercury, GR)"  },
];

export default function KeplerLawsPage() {
  return (
    <>
      <TerminalHeader
        moduleLabel="MODULE:LEARNING"
        protocolLabel="DATABASE:ORBITAL-MECHANICS"
        statusLabel="SIMULATION: ACTIVE"
      />

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/learning/orbital-mechanics"
        backLabel="Orbital Mechanics"
        rightIcon="icarus-terminal-system-orbits"
        rightLabel="TOPIC — KEPLER'S LAWS"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-system-orbits text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Kepler&apos;s Laws
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Three Rules That Govern Every Orbit
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
              <SectionHeader icon="icarus-terminal-system-orbits" title="Three Laws — Animated" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-[600px] flex-1 min-[480px]:min-h-[440px]">
              <KeplerLawsSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
                Left: ellipse with the star at one focus and the second focus empty. Centre: equal-area wedges swept in equal times — the planet visibly accelerates near perihelion. Right: three orbits with T = a^1.5 timing.
              </p>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="Why It Matters" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Kepler derived these laws from raw{" "}
                <span className="text-sky-400/80">positional data</span> of Mars
                gathered by Tycho Brahe — without telescopes, without
                Newton&apos;s gravity. They worked.
              </p>
              <p>
                The 3rd law is especially powerful: measure a body&apos;s orbital
                period and distance and you can compute the central{" "}
                <span className="text-sky-400/80">mass</span>. This is how we
                weigh stars, planets, and the supermassive black hole at the
                Milky Way&apos;s centre.
              </p>
              <p>
                Newton later showed all three laws fall out of his inverse-square
                gravity — and a tiny extra correction from general relativity
                explains the perihelion precession of Mercury.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-scan" title="Orbital Anatomy" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { key: "Semi-major axis (a)", note: "Half the longest diameter — defines orbital size" },
                { key: "Eccentricity (e)",    note: "0 = circle, &lt;1 = ellipse, =1 = parabola, &gt;1 = hyperbola" },
                { key: "Perihelion",          note: "Closest approach: a(1 − e) from the star"             },
                { key: "Aphelion",            note: "Farthest point: a(1 + e) from the star"               },
                { key: "Inclination",         note: "Tilt of the orbit plane vs system reference plane"   },
              ].map(({ key, note }) => (
                <div key={key} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-[0.6rem] text-sky-500/40" />
                  <span><span className="text-neutral-400">{key}</span> — <span dangerouslySetInnerHTML={{ __html: note }} /></span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-warning" title="ED: Beyond Kepler" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                The system map shows orbital periods that scale by Kepler&apos;s
                3rd law — outer planets take exponentially longer years.
                Pinning down a body&apos;s mass from orbital data drives the
                values you see when scanning.
              </p>
              <p>
                <span className="text-sky-400/80">Frame Shift Drive</span>{" "}
                cheats Kepler entirely — you cross AU in seconds — but the
                native bodies still orbit by these rules. A planet at 2 AU
                always has roughly a 2.8-year year (around a Sun-mass star).
              </p>
              <p>
                Highly <span className="text-sky-400/80">eccentric orbits</span>{" "}
                (e &gt; 0.5) are common in ED — comets, captured bodies, and
                outer planets in disturbed systems all show clear elongation in
                the map view.
              </p>
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Reference table ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Laws &amp; History" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs uppercase tracking-wide">
            <thead>
              <tr className="border-b border-sky-900/20 text-left text-[0.6rem] tracking-widest text-neutral-600">
                <th className="pb-2 pr-4">Law</th>
                <th className="pb-2 pr-4">Statement</th>
                <th className="pb-2 pr-4">Year</th>
                <th className="pb-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {reference.map((row) => (
                <tr key={row.law} className="border-b border-sky-900/10">
                  <td className="py-2 pr-4 font-bold" style={{ color: row.color }}>{row.law}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.statement}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.year}</td>
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

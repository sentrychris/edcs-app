import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import StellarClassificationSimulation from "./components/stellar-classification-simulation";

export const metadata: Metadata = {
  title: "Stellar Classification | Stellar Physics | Learning Resources | ED:CS",
  description: "The Morgan–Keenan spectral classification system and what each star class means for exploration.",
};

const classes = [
  { cls: "O", color: "#9BB0FF",  temp: ">30,000 K",    mass: ">16",        lum: ">30,000",  hz: ">20 AU",    freq: "0.00003%" },
  { cls: "B", color: "#AABFFF",  temp: "10,000–30,000", mass: "2–16",       lum: "25–30,000", hz: "5–20 AU",   freq: "0.13%"    },
  { cls: "A", color: "#D8E2FF",  temp: "7,500–10,000",  mass: "1.4–2.1",    lum: "5–25",     hz: "2–5 AU",    freq: "0.6%"     },
  { cls: "F", color: "#FFFDE0",  temp: "6,000–7,500",   mass: "1.0–1.4",    lum: "1.5–5",    hz: "1.2–2 AU",  freq: "3%"       },
  { cls: "G", color: "#FFD580",  temp: "5,200–6,000",   mass: "0.8–1.0",    lum: "0.6–1.5",  hz: "0.9–1.3 AU", freq: "7.6%"    },
  { cls: "K", color: "#FFAF50",  temp: "3,700–5,200",   mass: "0.45–0.8",   lum: "0.08–0.6", hz: "0.4–0.9 AU", freq: "12%"     },
  { cls: "M", color: "#FF6840",  temp: "2,400–3,700",   mass: "0.08–0.45",  lum: "<0.08",    hz: "0.1–0.4 AU", freq: "76%"     },
];

export default function StellarClassificationPage() {
  return (
    <>
      {/* ── Terminal header ── */}
      <div className="fx-chamfer relative mb-5 border border-sky-900/40 bg-black/50 backdrop-blur backdrop-filter px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-3">
            <span>MODULE:LEARNING</span>
            <span className="hidden sm:inline text-neutral-800">■</span>
            <span className="hidden sm:inline">DATABASE:STELLAR-PHYSICS</span>
            <span className="hidden md:inline text-neutral-800">■</span>
            <span className="hidden md:inline">CLASS:UNRESTRICTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-blue h-1.5 w-1.5" />
            <span>SIMULATION: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-6 py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-star text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Stellar Classification
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              The Morgan–Keenan Spectral Sequence
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Breadcrumb ── */}
      <div className="mb-5 flex items-center justify-between text-xs uppercase tracking-widest text-neutral-500">
        <Link href="/learning/stellar-physics" className="flex items-center gap-2 transition-colors hover:text-sky-400">
          <i className="icarus-terminal-chevron-left text-xs" />
          Stellar Physics
        </Link>
        <span className="flex items-center gap-2 text-neutral-700">
          <i className="icarus-terminal-star text-sky-500/20" />
          TOPIC — STELLAR CLASSIFICATION
        </span>
      </div>

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3">

        {/* ── Simulation panel ── */}
        <div className="flex h-full flex-col lg:col-span-2">
          <Panel variant="muted" className="fx-chamfer flex flex-1 flex-col">
            <div className="border-b border-sky-900/20 px-4 py-3">
              <SectionHeader icon="icarus-terminal-star" title="Main Sequence — O through M" className="mb-0 border-0 pb-0" />
            </div>
            <div className="relative min-h-0 flex-1">
              <StellarClassificationSimulation />
            </div>
            <div className="border-t border-sky-900/20 px-4 py-3">
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
                Stars displayed bottom-aligned to emphasise relative radius. All seven main-sequence classes are fuel-scoopable in Elite Dangerous.
              </p>
            </div>
          </Panel>
        </div>

        {/* ── Info panels ── */}
        <div className="flex h-full flex-col space-y-5">

          <Panel variant="muted" className="fx-chamfer p-5">
            <SectionHeader icon="icarus-terminal-info" title="The MK System" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                Stars are sorted by <span className="text-sky-400/80">surface temperature</span>,
                which determines their colour, spectral absorption lines, and the
                width of their habitable zones.
              </p>
              <p>
                The sequence runs <span className="text-sky-400/80">O B A F G K M</span> from
                hottest to coolest. A common mnemonic:{" "}
                <span className="text-neutral-400 italic">&ldquo;Oh Be A Fine Girl, Kiss Me&rdquo;</span>.
              </p>
              <p>
                Our Sun is a <span className="text-yellow-400/70">G-type</span> star — the
                fifth hottest class. M-type red dwarfs make up{" "}
                <span className="text-sky-400/80">~76%</span> of all stars in the galaxy,
                while O-type giants are extraordinarily rare.
              </p>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-5">
            <SectionHeader icon="icarus-terminal-scan" title="ED: Fuel Scooping" />
            <div className="space-y-3 text-xs uppercase tracking-wide text-neutral-500">
              <p>
                In Elite Dangerous, only <span className="text-green-400/80">OBAFGKM</span> class
                stars support fuel scooping. This corresponds exactly to the main sequence —
                all seven classes produce sufficient solar wind for the process.
              </p>
              <div className="mt-2 border-t border-sky-900/20 pt-2">
                {[
                  { types: "O, B",  note: "Extreme radiation — high scoop rate, hull risk" },
                  { types: "A, F",  note: "Hot stars — fast scoop, moderate risk"          },
                  { types: "G, K",  note: "Ideal — safe, efficient"                        },
                  { types: "M",     note: "Slow scoop rate due to low luminosity"           },
                ].map(({ types, note }) => (
                  <div key={types} className="mb-1.5 flex items-start gap-2">
                    <i className="icarus-terminal-chevron-right mt-0.5 text-sky-500/40 text-[0.6rem]" />
                    <span><span className="text-neutral-400">{types}</span> — {note}</span>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-5">
            <SectionHeader icon="icarus-terminal-warning" title="Beyond the Main Sequence" />
            <div className="space-y-2 text-xs uppercase tracking-wide text-neutral-600">
              {[
                { type: "L / T / Y",        note: "Brown dwarfs — failed stars, not scoopable"    },
                { type: "White Dwarf",       note: "Stellar remnant, neutron-dense — not scoopable" },
                { type: "Neutron Star",      note: "FSD supercharge source — deadly proximity"      },
                { type: "Black Hole",        note: "No emission, extreme tidal forces"              },
              ].map(({ type, note }) => (
                <div key={type} className="flex items-start gap-2">
                  <i className="icarus-terminal-chevron-right mt-0.5 text-amber-500/40 text-[0.6rem]" />
                  <span><span className="text-neutral-400">{type}</span> — {note}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Reference table ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Spectral Class Reference" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs uppercase tracking-wide">
            <thead>
              <tr className="border-b border-sky-900/20 text-left text-[0.6rem] tracking-widest text-neutral-600">
                <th className="pb-2 pr-4">Class</th>
                <th className="pb-2 pr-4">Temperature (K)</th>
                <th className="pb-2 pr-4">Mass (M☉)</th>
                <th className="pb-2 pr-4">Luminosity (L☉)</th>
                <th className="pb-2 pr-4">HZ Distance</th>
                <th className="pb-2">Galaxy Frequency</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((row) => (
                <tr key={row.cls} className="border-b border-sky-900/10">
                  <td className="py-2 pr-4 font-bold" style={{ color: row.color }}>{row.cls}</td>
                  <td className="py-2 pr-4 text-neutral-400">{row.temp}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.mass}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.lum}</td>
                  <td className="py-2 pr-4 text-neutral-500">{row.hz}</td>
                  <td className="py-2 text-neutral-600">{row.freq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

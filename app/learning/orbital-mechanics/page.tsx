import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";

export const metadata: Metadata = {
  title: "Orbital Mechanics | Learning Resources | ED:CS",
  description: "Interactive simulations exploring the forces and equilibria that govern orbital motion.",
};

const configurations = [
  {
    href:        "/learning/orbital-mechanics/lagrange-points",
    icon:        "icarus-terminal-system-orbits",
    title:       "Lagrange Points",
    subtitle:    "Five Equilibria in Every Two-Body System",
    description: "Every pair of orbiting bodies shares five gravitational equilibrium points. Two are stable — objects placed there stay indefinitely. Three are unstable but strategically valuable.",
    tags:        ["Equilibrium", "Gravity", "Stability"],
    status:      "available",
  },
  {
    href:        "/learning/orbital-mechanics/orbital-resonance",
    icon:        "icarus-terminal-system-orbits",
    title:       "Orbital Resonance",
    subtitle:    "Period Locking & Resonance Chains",
    description: "When orbital periods form simple integer ratios, repeated gravitational nudges lock bodies into stable — or destabilising — resonance chains.",
    tags:        ["Resonance", "Period Ratios", "Stability"],
    status:      "available",
  },
  {
    href:        "/learning/orbital-mechanics/roche-limit",
    icon:        "icarus-terminal-planet-ringed",
    title:       "Roche Limit",
    subtitle:    "Tidal Disruption & Ring Formation",
    description: "The critical orbital distance inside which tidal forces overwhelm a body's self-gravity, tearing it apart and spreading its remains into a ring system.",
    tags:        ["Tidal Forces", "Ring Formation", "Disruption"],
    status:      "available",
  },
  {
    href:        "/learning/orbital-mechanics/tidal-locking",
    icon:        "icarus-terminal-planet",
    title:       "Tidal Locking",
    subtitle:    "Synchronous Rotation & Permanent Hemispheres",
    description: "How tidal forces gradually brake a body's spin until rotation and orbit synchronise, permanently fixing one face toward the primary.",
    tags:        ["Synchronous Rotation", "Near Side", "Habitability"],
    status:      "available",
  },
  {
    href:        "/learning/orbital-mechanics/kepler-laws",
    icon:        "icarus-terminal-system-orbits",
    title:       "Kepler's Laws",
    subtitle:    "Three Rules That Govern Every Orbit",
    description: "The foundations of orbital mechanics: orbits are ellipses, equal areas are swept in equal times, and period squared scales with semi-major axis cubed.",
    tags:        ["Ellipses", "Equal Areas", "T² ∝ a³"],
    status:      "available",
  },
  {
    href:        "/learning/orbital-mechanics/hill-sphere",
    icon:        "icarus-terminal-system-orbits",
    title:       "Hill Sphere",
    subtitle:    "The Region of Gravitational Dominance",
    description: "The radius around a body where its gravity wins over the parent's. Sets the limit on stable moons, captured satellites, and why close-in planets can't hold companions.",
    tags:        ["Hill Radius", "Sphere of Influence", "Moon Stability"],
    status:      "available",
  },
];

export default function OrbitalMechanicsPage() {
  return (
    <>
      {/* ── Terminal header ── */}
      <TerminalHeader
        moduleLabel="MODULE:LEARNING"
        protocolLabel="DATABASE:ORBITAL-MECHANICS"
        statusLabel={`${configurations.length} simulation${configurations.length !== 1 ? "s" : ""} indexed`}
      />

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/learning"
        backLabel="Learning Resources"
        rightIcon="icarus-terminal-system-orbits"
        rightLabel="MODULE — ORBITAL MECHANICS"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-system-orbits text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Orbital Mechanics
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Forces, Equilibria &amp; Resonance
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Simulation list ── */}
      <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-scan" title="Simulations" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {configurations.map((config) => (
            <Link key={config.href} href={config.href} className="group flex h-full flex-col">
              <div className="relative flex h-full flex-col border border-sky-900/20 p-4 transition-colors hover:border-sky-700/40 hover:bg-sky-950/10">
                <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                <span className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                <span className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-sky-500/40 transition-colors group-hover:border-sky-500/70" />

                <div className="mb-3 flex items-start justify-between gap-2">
                  <i className={`${config.icon} text-glow__blue text-xl`} />
                  {config.status === "available" && (
                    <span className="text-[0.6rem] uppercase tracking-widest text-green-500/70">Available</span>
                  )}
                </div>

                <p className="text-glow__white mb-0.5 text-sm font-bold uppercase tracking-wide">
                  {config.title}
                </p>
                <p className="mb-3 text-[0.65rem] uppercase tracking-widest text-sky-400/60">
                  {config.subtitle}
                </p>

                <p className="mb-3 flex-1 text-xs uppercase tracking-wide text-neutral-500">
                  {config.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {config.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-sky-900/30 px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-neutral-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Panel>
    </>
  );
}

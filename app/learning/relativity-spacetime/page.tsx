import type { Metadata } from "next";
import Link from "next/link";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import LearningModuleSidebar from "../components/learning-module-sidebar";

export const metadata: Metadata = {
  title: "Relativity & Spacetime | Learning Resources | ED:CS",
  description: "Simulations exploring special and general relativity — time dilation, curved spacetime, black-hole geometry, and the speculative physics behind faster-than-light travel.",
};

const topics = [
  {
    href:        "/learning/relativity-spacetime/special-relativity",
    icon:        "icarus-terminal-system-orbits",
    title:       "Special Relativity",
    subtitle:    "Time Dilation, Length Contraction & the Light Cone",
    description: "Einstein's flat-spacetime framework. Why moving clocks tick slowly, why moving rulers shrink, and how the light cone divides past, future, and the unreachable elsewhere.",
    tags:        ["Lorentz", "Light Cone", "Simultaneity"],
    status:      "available",
  },
  {
    href:        "/learning/relativity-spacetime/equivalence-principle",
    icon:        "icarus-terminal-system-orbits",
    title:       "The Equivalence Principle",
    subtitle:    "Acceleration as Gravity & Curved Spacetime",
    description: "Why a sealed lift accelerating in deep space is locally indistinguishable from one sitting on Earth. The conceptual leap from special to general relativity, and how mass curves the geometry around it.",
    tags:        ["Einstein", "Curvature", "Geodesics"],
    status:      "available",
  },
  {
    href:        "/learning/relativity-spacetime/gravitational-time-dilation",
    icon:        "icarus-terminal-system-orbits",
    title:       "Gravitational Time Dilation",
    subtitle:    "Clocks Deep in Gravity Wells",
    description: "Time runs slower near mass. Compares clocks on Earth's surface, GPS satellites, neutron stars, and just outside a black hole's event horizon — and why GPS would fail without relativistic correction.",
    tags:        ["Gravity Well", "GPS", "Neutron Star"],
    status:      "available",
  },
  {
    href:        "/learning/relativity-spacetime/gravitational-lensing",
    icon:        "icarus-terminal-target",
    title:       "Gravitational Lensing",
    subtitle:    "Light Bending & Einstein Rings",
    description: "Mass bends the path of light. Animated lensing of background stars by a foreground compact object, showing arcs, multiple images, and the symmetric Einstein ring of perfect alignment.",
    tags:        ["Light Bending", "Einstein Ring", "Microlensing"],
    status:      "available",
  },
  {
    href:        "/learning/relativity-spacetime/black-hole-spacetime",
    icon:        "icarus-terminal-system-orbits",
    title:       "Black Hole Spacetime",
    subtitle:    "Event Horizons, Ergospheres & Frame Dragging",
    description: "The geometry of Schwarzschild and Kerr black holes. Event horizon, photon sphere, ISCO, and the rotating ergosphere where spacetime itself is dragged faster than light around the singularity.",
    tags:        ["Event Horizon", "Kerr", "Frame Dragging"],
    status:      "available",
  },
  {
    href:        "/learning/relativity-spacetime/warp-wormholes",
    icon:        "icarus-terminal-system-orbits",
    title:       "Warp & Wormholes",
    subtitle:    "Alcubierre Drives, ER Bridges & the FSD",
    description: "The speculative physics of faster-than-light travel. Alcubierre's warp metric, Einstein–Rosen bridges, exotic matter requirements, and how Elite Dangerous's Frame Shift Drive plays with these ideas.",
    tags:        ["Alcubierre", "Wormhole", "FSD"],
    status:      "available",
  },
];

const sidebarSignals = topics.map((topic) => ({
  title: topic.title,
  signal: topic.subtitle,
}));

export default function RelativitySpacetimePage() {
  return (
    <>
      {/* ── Terminal header ── */}
      <TerminalHeader
        moduleLabel="MODULE:LEARNING"
        protocolLabel="DATABASE:RELATIVITY-SPACETIME"
        statusLabel={`${topics.length} topic${topics.length !== 1 ? "s" : ""} indexed`}
      />

      {/* ── Breadcrumb ── */}
      <BreadcrumbNav
        backHref="/learning"
        backLabel="Learning Resources"
        rightIcon="icarus-terminal-system-orbits"
        rightLabel="MODULE — RELATIVITY & SPACETIME"
      />

      {/* ── Hero ── */}
      <Panel className="fx-chamfer fx-panel-scan mb-5 px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-start gap-3">
          <i className="icarus-terminal-system-orbits text-glow__blue mt-0.5 text-2xl" />
          <div>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              Relativity &amp; Spacetime
            </h1>
            <p className="text-glow__blue text-sm font-bold uppercase tracking-widest">
              Time Dilation, Curvature &amp; Warp
            </p>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* ── Topic list ── */}
        <Panel variant="muted" className="fx-chamfer p-4 md:p-5 lg:col-span-2">
          <SectionHeader icon="icarus-terminal-scan" title="Topics" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {topics.map((topic) => (
              <Link key={topic.href} href={topic.href} className="group flex h-full flex-col">
                <div className="relative flex h-full flex-col border border-sky-900/20 p-4 transition-colors hover:border-sky-700/40 hover:bg-sky-950/10">
                  <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                  <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                  <span className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                  <span className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-sky-500/40 transition-colors group-hover:border-sky-500/70" />

                  <div className="mb-3 flex items-start justify-between gap-2">
                    <i className={`${topic.icon} text-glow__blue text-xl`} />
                    {topic.status === "available" && (
                      <span className="text-[0.6rem] uppercase tracking-widest text-green-500/70">Available</span>
                    )}
                  </div>

                  <p className="text-glow__white mb-0.5 text-sm font-bold uppercase tracking-wide">
                    {topic.title}
                  </p>
                  <p className="mb-3 text-[0.65rem] uppercase tracking-widest text-sky-400/60">
                    {topic.subtitle}
                  </p>

                  <p className="mb-3 flex-1 text-xs uppercase tracking-wide text-neutral-500">
                    {topic.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {topic.tags.map((tag) => (
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

        <LearningModuleSidebar
          lensIcon="icarus-terminal-info"
          lensTitle="Spacetime Lens"
          paragraphs={[
            "This module is the geometry beneath every other simulation. Stars, planets, and orbits all live inside a spacetime that bends, stretches, and dilates in the presence of mass and motion.",
            "It also doubles as the physics backdrop for Elite Dangerous's signature trick — the Frame Shift Drive — a piece of in-universe engineering that borrows freely from real general relativity.",
          ]}
          signals={sidebarSignals}
        />
      </div>
    </>
  );
}

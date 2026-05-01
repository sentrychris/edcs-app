import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import TerminalHeader from "@/components/terminal-header";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import { cn } from "@/core/cn";
import { engineers, findEngineer } from "../data";

interface Props {
  params: {
    engineer: string;
  };
}

const regionLabel = {
  core: "Core Systems",
  colonia: "Colonia Region",
  "witch-head": "Witch Head Nebula",
} as const;

const disciplineLabel = {
  ship: "Ship Engineer",
  pilot: "Pilot Equipment Engineer",
} as const;

const disciplineSubtitle = {
  ship: "Ship Module Modification Specialist",
  pilot: "Suit & Weapon Modification Specialist",
} as const;

export function generateStaticParams() {
  return engineers.map((engineer) => ({ engineer: engineer.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const engineer = findEngineer(params.engineer);

  return {
    title: engineer
      ? `${engineer.name} | Engineers | ED:CS`
      : "Engineers | ED:CS",
    description: engineer
      ? `${engineer.name} operates from ${engineer.base} in the ${engineer.system} system, offering ${engineer.modifications.length} ${engineer.discipline === "ship" ? "ship module" : "suit and weapon"} modifications.`
      : undefined,
  };
}

export default function EngineerProfilePage({ params }: Props) {
  const engineer = findEngineer(params.engineer);

  if (!engineer) {
    notFound();
  }

  const initials = engineer.name
    .replace(/"[^"]*"/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const callsign = `ENG-${engineer.slug.toUpperCase().replace(/-/g, "")}`;

  const topGrade = engineer.modifications.reduce(
    (max, mod) => (mod.maxGrade && mod.maxGrade > max ? mod.maxGrade : max),
    0,
  );

  const isShip = engineer.discipline === "ship";

  return (
    <>
      <TerminalHeader
        moduleLabel="MODULE:ENGINEERING"
        protocolLabel="DATABASE:ENGINEER-REGISTRY"
        statusLabel={`PROFILE: ${engineer.name.toUpperCase()}`}
      />

      <BreadcrumbNav
        backHref="/engineering"
        backLabel="Engineers"
        rightIcon={engineer.icon}
        rightLabel={`PROFILE - ${engineer.name.toUpperCase()}`}
      />

      {/* ── Hero / Dossier ── */}
      <Panel className="fx-chamfer fx-panel-scan relative mb-5 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-sky-500/40 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-sky-500/40 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-sky-500/40 to-transparent" />
        </div>

        <div className="relative grid grid-cols-1 gap-5 p-5 md:grid-cols-[auto,1fr,auto] md:items-center md:p-6">
          {/* Identity sigil */}
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center border border-sky-700/40 bg-black/40 md:h-32 md:w-32">
            <span className="pointer-events-none absolute -left-px -top-px h-3 w-3 border-l border-t border-sky-400/70" />
            <span className="pointer-events-none absolute -right-px -top-px h-3 w-3 border-r border-t border-sky-400/70" />
            <span className="pointer-events-none absolute -bottom-px -left-px h-3 w-3 border-b border-l border-sky-400/70" />
            <span className="pointer-events-none absolute -bottom-px -right-px h-3 w-3 border-b border-r border-sky-400/70" />
            <div className="absolute inset-2 border border-sky-700/30" />
            <div className="absolute inset-4 rounded-full border border-sky-500/20" />
            <span className="text-glow__blue relative text-3xl font-bold tracking-widest md:text-4xl">
              {initials}
            </span>
          </div>

          {/* Name + meta */}
          <div className="min-w-0">
            <p className="mb-1 flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-sky-500/60">
              <span className="fx-dot-blue h-1 w-1" />
              <span>Personnel Dossier</span>
              <span className="text-neutral-800">·</span>
              <span className="text-neutral-600">{callsign}</span>
            </p>
            <h1 className="text-glow__white mb-1 text-2xl font-bold uppercase tracking-wide md:text-3xl">
              {engineer.name}
            </h1>
            <p className="text-glow__blue mb-3 flex items-center gap-2 text-sm uppercase tracking-widest">
              <i className={`${engineer.icon} text-base`} />
              {engineer.base}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[0.7rem] uppercase tracking-widest text-neutral-500">
              <span className="flex items-center gap-1.5">
                <i className="icarus-terminal-system-orbits text-sky-500/50" />
                <span className="text-neutral-700">SYS</span>
                <span className="text-neutral-300">{engineer.system}</span>
              </span>
              <span className="text-neutral-800">|</span>
              <span className="flex items-center gap-1.5">
                <i className="icarus-terminal-planet text-sky-500/50" />
                <span className="text-neutral-700">BODY</span>
                <span className="text-neutral-300">{engineer.planet}</span>
              </span>
              <span className="text-neutral-800">|</span>
              <span className="flex items-center gap-1.5">
                <i className="icarus-terminal-location text-sky-500/50" />
                <span className="text-neutral-700">REGION</span>
                <span className="text-neutral-300">{regionLabel[engineer.region]}</span>
              </span>
            </div>
          </div>

          {/* Status block */}
          <div className="flex shrink-0 flex-row items-stretch gap-2 md:flex-col md:items-end">
            <div className="border border-green-900/40 bg-green-900/10 px-3 py-1.5 text-[0.65rem] uppercase tracking-widest text-green-500/80">
              <span className="fx-dot-green mr-2 inline-block h-1.5 w-1.5 align-middle" />
              Operational
            </div>
            <div
              className={cn(
                "border px-3 py-1 text-[0.65rem] uppercase tracking-widest flex items-center",
                isShip
                  ? "border-sky-500/50 bg-sky-900/20 text-sky-300"
                  : "border-amber-500/40 bg-amber-900/20 text-amber-300/80",
              )}
            >
              <i className={cn(isShip ? "icarus-terminal-ship" : "icarus-terminal-planet-lander", "mr-1.5")} />
              {disciplineLabel[engineer.discipline]}
            </div>
            {topGrade > 0 && (
              <div className="border border-sky-900/40 bg-sky-900/10 px-3 py-1.5 text-[0.65rem] uppercase tracking-widest text-sky-400/80">
                Top Grade · G{topGrade}
              </div>
            )}
          </div>
        </div>
      </Panel>

      {/* ── Body grid ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Modifications grid — main panel */}
        <Panel variant="muted" className="fx-chamfer p-4 md:p-5 lg:col-span-2">
          <SectionHeader icon="icarus-terminal-table-index" title="Available Modifications" />
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {engineer.modifications.map((mod, index) => (
              <div
                key={mod.category}
                className="relative flex items-center gap-3 border border-sky-900/30 bg-sky-950/10 px-3 py-2.5 transition-colors hover:border-sky-700/50 hover:bg-sky-900/20"
              >
                <span className="pointer-events-none absolute -left-px -top-px h-2 w-2 border-l border-t border-sky-500/40" />
                <span className="pointer-events-none absolute -right-px -top-px h-2 w-2 border-r border-t border-sky-500/40" />
                <span className="pointer-events-none absolute -bottom-px -left-px h-2 w-2 border-b border-l border-sky-500/40" />
                <span className="pointer-events-none absolute -bottom-px -right-px h-2 w-2 border-b border-r border-sky-500/40" />

                <span className="text-[0.6rem] uppercase tracking-widest text-sky-500/50">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="h-4 w-px bg-sky-900/40" />
                <span className="text-glow__white flex-1 truncate text-xs uppercase tracking-wide">
                  {mod.category}
                </span>
                {mod.maxGrade ? (
                  <span className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((grade) => (
                      <span
                        key={grade}
                        className={cn(
                          "h-1.5 w-3",
                          grade <= mod.maxGrade!
                            ? grade <= 3
                              ? "bg-sky-400/70"
                              : "bg-sky-300"
                            : "bg-sky-900/40",
                        )}
                      />
                    ))}
                    <span className="ml-1.5 text-[0.65rem] uppercase tracking-widest text-sky-400/70">
                      G{mod.maxGrade}
                    </span>
                  </span>
                ) : (
                  <i className="icarus-terminal-chevron-right text-[0.65rem] text-sky-500/40" />
                )}
              </div>
            ))}
          </div>
        </Panel>

        {/* Sidebar — location coordinates + reference */}
        <div className="space-y-5">
          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-location" title="Workshop Location" />
            <div className="space-y-3 text-xs uppercase tracking-wide">
              <div className="flex items-baseline justify-between gap-3 border-b border-sky-900/20 pb-2">
                <span className="text-xs tracking-widest text-neutral-700">Base</span>
                <span className="text-glow__blue truncate text-right text-neutral-300">{engineer.base}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-b border-sky-900/20 pb-2">
                <span className="text-xs tracking-widest text-neutral-700">System</span>
                <span className="text-neutral-300">{engineer.system}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-b border-sky-900/20 pb-2">
                <span className="text-xs tracking-widest text-neutral-700">Body</span>
                <span className="text-neutral-300">{engineer.planet}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3 border-b border-sky-900/20 pb-2">
                <span className="text-xs tracking-widest text-neutral-700">Region</span>
                <span className="text-neutral-300">{regionLabel[engineer.region]}</span>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs tracking-widest text-neutral-700">Discipline</span>
                <span className="text-neutral-300">{disciplineSubtitle[engineer.discipline]}</span>
              </div>
            </div>
          </Panel>

          <Panel variant="muted" className="fx-chamfer p-4 md:p-5">
            <SectionHeader icon="icarus-terminal-info" title="Capability Index" />
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-[0.65rem] uppercase tracking-widest text-neutral-600">
                  <span>Modifications offered</span>
                  <span className="text-glow__blue text-neutral-300">{engineer.modifications.length}</span>
                </div>
                <div className="h-1.5 w-full bg-sky-950/40">
                  <div
                    className="h-full bg-sky-500/60"
                    style={{ width: `${Math.min(100, (engineer.modifications.length / 11) * 100)}%` }}
                  />
                </div>
              </div>
              {topGrade > 0 && (
                <div>
                  <div className="mb-1 flex items-center justify-between text-[0.65rem] uppercase tracking-widest text-neutral-600">
                    <span>Top engineering grade</span>
                    <span className="text-glow__blue text-neutral-300">G{topGrade}</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((grade) => (
                      <span
                        key={grade}
                        className={cn(
                          "h-2 flex-1",
                          grade <= topGrade ? "bg-sky-500/60" : "bg-sky-950/40",
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Panel>
        </div>
      </div>

      {/* ── Other engineers — quick switcher ── */}
      <Panel variant="muted" className="fx-chamfer mt-5 p-4 md:p-5">
        <SectionHeader icon="icarus-terminal-sync" title="Cross-Reference" />
        <div className="flex flex-wrap gap-2">
          {engineers
            .filter((other) => other.slug !== engineer.slug && other.discipline === engineer.discipline)
            .map((other) => (
              <a
                key={other.slug}
                href={other.href}
                className="group flex items-center gap-2 border border-sky-900/30 px-2.5 py-1.5 text-[0.65rem] uppercase tracking-widest text-neutral-500 transition-colors hover:border-sky-700/50 hover:bg-sky-900/10 hover:text-sky-300"
              >
                <i className={`${other.icon} text-sky-500/50 group-hover:text-sky-400`} />
                <span className="text-neutral-300 group-hover:text-sky-200">{other.name}</span>
                <span className="text-neutral-700">·</span>
                <span>{other.system}</span>
              </a>
            ))}
        </div>
      </Panel>
    </>
  );
}

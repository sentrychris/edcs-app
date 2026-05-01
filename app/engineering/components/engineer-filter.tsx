"use client";

import { cn } from "@/core/cn";
import type { EngineerDiscipline } from "../lib/engineer-types";

export type DisciplineFilter = "all" | EngineerDiscipline;

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  discipline: DisciplineFilter;
  onDisciplineChange: (value: DisciplineFilter) => void;
  totals: {
    all: number;
    ship: number;
    pilot: number;
  };
  matchCount: number;
}

const tabs: Array<{ value: DisciplineFilter; label: string; icon: string }> = [
  { value: "all",   label: "All",            icon: "icarus-terminal-table-index" },
  { value: "ship",  label: "Ship",           icon: "icarus-terminal-ship" },
  { value: "pilot", label: "Pilot Equipment", icon: "icarus-terminal-planet-lander" },
];

export default function EngineerFilter({
  query,
  onQueryChange,
  discipline,
  onDisciplineChange,
  totals,
  matchCount,
}: Props) {
  return (
    <div className="mb-4 flex flex-col gap-3 border border-sky-900/20 bg-black/30 p-3 md:flex-row md:items-center md:justify-between md:p-4">
      {/* ── Search ── */}
      <div className="relative w-full md:max-w-sm">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sky-500/50">
          <i className="icarus-terminal-scan text-sm" />
        </span>
        <input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Filter by engineer, base, or system…"
          aria-label="Filter engineers by name"
          className="w-full border border-sky-900/40 bg-black/40 py-2 pl-9 pr-3 text-xs uppercase tracking-widest text-neutral-200 placeholder:text-neutral-700 focus:border-sky-500/60 focus:outline-none focus:ring-1 focus:ring-sky-500/30"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange("")}
            aria-label="Clear filter"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-600 transition-colors hover:text-sky-300"
          >
            <i className="icarus-terminal-close text-xs" />
          </button>
        )}
      </div>

      {/* ── Discipline tabs + count ── */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex border border-sky-900/40 bg-black/40">
          {tabs.map((tab) => {
            const active = discipline === tab.value;
            const count = totals[tab.value];

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onDisciplineChange(tab.value)}
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-1.5 border-r border-sky-900/30 px-3 py-1.5 text-[0.7rem] uppercase tracking-widest transition-colors last:border-r-0",
                  active
                    ? "bg-sky-900/30 text-glow__blue"
                    : "text-neutral-500 hover:bg-sky-900/10 hover:text-sky-300",
                )}
              >
                <i className={`${tab.icon} text-sm`} />
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "ml-1 border px-1 py-px text-[0.7rem] tracking-widest",
                    active
                      ? "border-sky-500/50 text-sky-300"
                      : "border-sky-900/40 text-neutral-600",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <span className="text-[0.65rem] uppercase tracking-widest text-neutral-600">
          <span className="fx-dot-blue mr-2 inline-block h-1 w-1 align-middle" />
          {matchCount} match{matchCount === 1 ? "" : "es"}
        </span>
      </div>
    </div>
  );
}

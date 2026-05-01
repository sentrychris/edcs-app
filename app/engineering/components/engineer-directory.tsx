"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/core/cn";
import EngineerFilter, { type DisciplineFilter } from "./engineer-filter";
import type { Engineer } from "../lib/engineer-types";

interface Props {
  engineers: Engineer[];
}

const regionLabel = {
  core: "Core Systems",
  colonia: "Colonia Region",
  "witch-head": "Witch Head Nebula",
} as const;

const disciplineLabel = {
  ship: "Ship",
  pilot: "Pilot Equipment",
} as const;

export default function EngineerDirectory({ engineers }: Props) {
  const [query, setQuery] = useState("");
  const [discipline, setDiscipline] = useState<DisciplineFilter>("all");

  const totals = useMemo(
    () => ({
      all: engineers.length,
      ship: engineers.filter((engineer) => engineer.discipline === "ship").length,
      pilot: engineers.filter((engineer) => engineer.discipline === "pilot").length,
    }),
    [engineers],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return engineers.filter((engineer) => {
      if (discipline !== "all" && engineer.discipline !== discipline) {
        return false;
      }

      if (!needle) {
        return true;
      }

      return (
        engineer.name.toLowerCase().includes(needle) ||
        engineer.base.toLowerCase().includes(needle) ||
        engineer.system.toLowerCase().includes(needle)
      );
    });
  }, [engineers, query, discipline]);

  return (
    <>
      <EngineerFilter
        query={query}
        onQueryChange={setQuery}
        discipline={discipline}
        onDisciplineChange={setDiscipline}
        totals={totals}
        matchCount={filtered.length}
      />

      {filtered.length === 0 ? (
        <div className="border border-dashed border-sky-900/40 bg-black/20 p-8 text-center text-xs uppercase tracking-widest text-neutral-600">
          <i className="icarus-terminal-warning mb-2 block text-2xl text-sky-500/40" />
          No engineers match the current filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((engineer) => {
            const topGrade = engineer.modifications.reduce(
              (max, mod) => (mod.maxGrade && mod.maxGrade > max ? mod.maxGrade : max),
              0,
            );

            return (
              <Link key={engineer.slug} href={engineer.href} className="group flex h-full flex-col">
                <div className="relative flex h-full flex-col border border-sky-900/20 p-4 transition-colors hover:border-sky-700/40 hover:bg-sky-950/10">
                  <span className="pointer-events-none absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                  <span className="pointer-events-none absolute -right-px -top-px h-2.5 w-2.5 border-r border-t border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                  <span className="pointer-events-none absolute -bottom-px -left-px h-2.5 w-2.5 border-b border-l border-sky-500/40 transition-colors group-hover:border-sky-500/70" />
                  <span className="pointer-events-none absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-sky-500/40 transition-colors group-hover:border-sky-500/70" />

                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <i className={`${engineer.icon} text-glow__blue text-xl`} />
                      <div className="min-w-0">
                        <p className="text-glow__white truncate text-sm uppercase tracking-wide">
                          {engineer.name}
                        </p>
                        <p className="truncate text-[0.75rem] uppercase tracking-widest text-sky-400/60">
                          {engineer.base}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span
                        className={cn(
                          "border px-2 py-0.5 text-[0.6rem] uppercase tracking-widest",
                          engineer.discipline === "ship"
                            ? "border-sky-500/50 bg-sky-900/30 text-sky-300"
                            : "border-amber-500/40 bg-amber-900/20 text-amber-300/80",
                        )}
                      >
                        {disciplineLabel[engineer.discipline]}
                      </span>
                      {topGrade > 0 && (
                        <span className="border border-green-900/40 bg-green-900/10 px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-green-400/80">
                          Up to G{topGrade}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-3 grid grid-cols-3 gap-2 border-y border-sky-900/20 py-2 text-[0.7rem] uppercase tracking-widest">
                    <div>
                      <p className="text-neutral-700">System</p>
                      <p className="truncate text-neutral-400">{engineer.system}</p>
                    </div>
                    <div>
                      <p className="text-neutral-700">Body</p>
                      <p className="truncate text-neutral-400">{engineer.planet}</p>
                    </div>
                    <div>
                      <p className="text-neutral-700">Region</p>
                      <p className="truncate text-neutral-400">{regionLabel[engineer.region]}</p>
                    </div>
                  </div>

                  <p className="mb-2 text-[0.7rem] uppercase tracking-[0.25em] text-neutral-700">
                    Modifications · {engineer.modifications.length}
                  </p>
                  <div className="flex flex-1 flex-wrap content-start gap-1.5">
                    {engineer.modifications.map((mod) => (
                      <span
                        key={mod.category}
                        className="flex items-center gap-1 border border-sky-900/30 bg-sky-900/10 px-2 py-0.5 text-[0.7rem] uppercase tracking-widest text-neutral-500"
                      >
                        <span>{mod.category}</span>
                        {mod.maxGrade && (
                          <span className="text-sky-400/70">G{mod.maxGrade}</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

import type { FunctionComponent } from "react";
import type { RawSystemBody } from "@/core/interfaces/SystemBody";
import { SystemBodyType } from "@/core/constants/system";
import { formatNumber } from "@/core/string-utils";
import { cn } from "@/core/cn";
import Link from "next/link";

interface Props {
  systemSlug: string;
  systemName: string;
  bodies: RawSystemBody[];
  currentBodySlug: string;
}

const stripSystemPrefix = (name: string, systemName: string): string => {
  if (name === systemName) {
    return name;
  }
  const prefix = `${systemName} `;
  return name.startsWith(prefix) ? name.slice(prefix.length) : name;
};

const isStarBody = (body: Pick<RawSystemBody, "type" | "sub_type">) =>
  body.type === SystemBodyType.Star || (body.sub_type ?? "").includes("Star");

const SiblingBodies: FunctionComponent<Props> = ({ systemSlug, systemName, bodies, currentBodySlug }) => {
  const ordered = bodies
    .filter((body) => body.type === SystemBodyType.Star || body.type === SystemBodyType.Planet)
    .sort((a, b) => (a.body_id ?? 0) - (b.body_id ?? 0));

  if (ordered.length < 2) {
    return null;
  }

  const maxDistance = Math.max(...ordered.map((body) => body.distance_to_arrival ?? 0), 1);

  return (
    <div className="-mx-4 mt-5 overflow-x-auto px-4 md:mx-0 md:px-0">
      <div className="flex min-w-max gap-3 pb-2">
        {ordered.map((body, index) => {
          const isCurrent = body.slug === currentBodySlug;
          const icon = isStarBody(body) ? "icarus-terminal-star" : "icarus-terminal-planet";
          const distancePercent = Math.max(2, Math.min(100, ((body.distance_to_arrival ?? 0) / maxDistance) * 100));
          const tacticalIndex = String(index + 1).padStart(2, "0");
          const displayName = stripSystemPrefix(body.name, systemName);

          const card = (
            <div
              className={cn(
                "fx-chamfer group relative flex h-full w-44 flex-col gap-1 rounded-xl border p-2 pl-3 transition-all",
                isCurrent
                  ? "fx-panel-scan border-sky-400/70 bg-sky-900/20 shadow-[inset_0_0_18px_rgba(56,189,248,0.10)]"
                  : "border-sky-900/30 bg-black/20 hover:border-sky-500/60 hover:bg-sky-900/10 hover:shadow-[inset_0_0_14px_rgba(56,189,248,0.06)]",
              )}
            >
              {/* Tactical accent column */}
              <span
                className={cn(
                  "pointer-events-none absolute bottom-2 left-0 top-2 w-px transition-colors",
                  isCurrent ? "bg-sky-400/80" : "bg-sky-800/60 group-hover:bg-sky-500/70",
                )}
              />

              {/* Header: icon · name · tactical index */}
              <div className="flex items-center gap-2">
                <i className={cn(icon, "text-sm", isCurrent ? "text-glow__blue" : "text-sky-500/60")} />
                <p
                  className={cn(
                    "min-w-0 flex-1 truncate text-[0.7rem] uppercase tracking-wider",
                    isCurrent ? "text-glow__white" : "text-neutral-300",
                  )}
                  title={`${body.name}${body.sub_type ? ` — ${body.sub_type}` : ""}`}
                >
                  {displayName}
                  {body.sub_type && (
                    <span className="ml-1 text-[0.6rem] text-neutral-500">{body.sub_type}</span>
                  )}
                </p>
                <span
                  className={cn(
                    "font-mono text-[0.55rem] tabular-nums",
                    isCurrent ? "text-sky-300" : "text-neutral-700 group-hover:text-sky-500/70",
                  )}
                >
                  {tacticalIndex}
                </span>
              </div>

              {/* Distance readout */}
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[0.55rem] uppercase tracking-widest text-neutral-700">DIST</span>
                <span className="font-mono text-[0.65rem] tabular-nums text-neutral-400">
                  {body.distance_to_arrival != null ? formatNumber(body.distance_to_arrival) : "—"}
                  <span className="ml-1 text-neutral-700">LS</span>
                </span>
              </div>

              {/* Distance proportion bar */}
              <div className="mt-0.5 h-px w-full bg-sky-900/50">
                <div
                  className={cn(
                    "h-full transition-all",
                    isCurrent ? "bg-sky-300" : "bg-sky-700/70 group-hover:bg-sky-500/80",
                  )}
                  style={{ width: `${distancePercent}%` }}
                />
              </div>
            </div>
          );

          return isCurrent ? (
            <div key={body.slug} aria-current="page">
              {card}
            </div>
          ) : (
            <Link key={body.slug} href={`/systems/${systemSlug}/body/${body.slug}`} className="block">
              {card}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SiblingBodies;

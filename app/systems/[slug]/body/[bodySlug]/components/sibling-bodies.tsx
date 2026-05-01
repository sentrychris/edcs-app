import type { FunctionComponent } from "react";
import type { RawSystemBody } from "@/core/interfaces/SystemBody";
import { SystemBodyType } from "@/core/constants/system";
import { formatNumber } from "@/core/string-utils";
import { cn } from "@/core/cn";
import Link from "next/link";

interface Props {
  systemSlug: string;
  bodies: RawSystemBody[];
  currentBodySlug: string;
}

const isStarBody = (body: Pick<RawSystemBody, "type" | "sub_type">) =>
  body.type === SystemBodyType.Star || (body.sub_type ?? "").includes("Star");

const SiblingBodies: FunctionComponent<Props> = ({ systemSlug, bodies, currentBodySlug }) => {
  const ordered = bodies
    .filter((body) => body.type === SystemBodyType.Star || body.type === SystemBodyType.Planet)
    .sort((a, b) => (a.distance_to_arrival ?? 0) - (b.distance_to_arrival ?? 0));

  if (ordered.length < 2) {
    return null;
  }

  return (
    <div className="-mx-4 mt-5 overflow-x-auto px-4 md:mx-0 md:px-0">
      <div className="flex min-w-max gap-3 pb-2">
        {ordered.map((body) => {
          const isCurrent = body.slug === currentBodySlug;
          const icon = isStarBody(body) ? "icarus-terminal-star" : "icarus-terminal-planet";
          const card = (
            <div
              className={cn(
                "fx-chamfer flex h-full w-44 flex-col gap-1 border p-2 transition-colors rounded-xl",
                isCurrent
                  ? "border-sky-500/60 bg-sky-900/20"
                  : "border-sky-900/30 bg-black/20 hover:border-sky-500/50 hover:bg-sky-900/10",
              )}
            >
              <div className="flex items-center gap-2">
                <i className={cn(icon, "text-sm", isCurrent ? "text-glow__blue" : "text-sky-500/60")} />
                <p
                  className={cn(
                    "truncate text-[0.7rem] uppercase tracking-wider text-wrap",
                    isCurrent ? "text-glow__white" : "text-neutral-300",
                  )}
                  title={body.name}
                >
                  {body.name}
                </p>
              </div>
              <p className="text-[0.65rem] uppercase tracking-widest text-neutral-500">
                {body.distance_to_arrival != null ? `${formatNumber(body.distance_to_arrival)} LS` : "—"}
              </p>
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

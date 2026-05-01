"use client";

import { type FunctionComponent, useMemo } from "react";
import type { System } from "@/core/interfaces/System";
import { pluralizeTextFromArray } from "@/core/string-utils";
import { SystemBodyType } from "@/core/constants/system";
import { useResource } from "@/core/hooks/resource";
import Link from "next/link";
import SystemMap from "../../systems/lib/system-map";
import LoaderMini from "@/components/loader-mini";

interface Props {
  className?: string;
}

const LatestSystem: FunctionComponent<Props> = ({ className }) => {
  const { data, isLoading } = useResource<System>("systems/last-updated");
  const system = useMemo(() => (data ? new SystemMap(data) : undefined), [data]);

  if (isLoading) {
    return (
      <div className={`${className} flex items-center`}>
        <LoaderMini visible={isLoading} message="Awaiting telemetry..." />
      </div>
    );
  }

  if (!system) {
    return null;
  }

  const starCount = system.stars.filter((s) => s._type === SystemBodyType.Star).length;


  return (
    <div className={`${className} uppercase`}>
      <div className="mb-2 flex items-center gap-2 text-xs tracking-wide uppercase text-neutral-500">
        <i className="icarus-terminal-location-filled text-sky-500/60"></i>
        Last Telemetry Uplink
      </div>
      <Link
        className=" text-sky-300 hover:text-glow__blue hover:underline mb-3 block text-sm font-bold tracking-wide transition-colors hover:text-white"
        href={`systems/${system.detail.slug}`}
      >
        {system.name}
      </Link>
      <div className="space-y-1 text-[0.7rem] tracking-wider text-neutral-500">
        <p>
          {system.detail.coords.x.toFixed(2)} /{" "}
          {system.detail.coords.y.toFixed(2)} /{" "}
          {system.detail.coords.z.toFixed(2)}
        </p>
        <p className="flex items-center gap-x-3 text-[0.7rem]">
          <span className="flex items-center gap-x-1">
            {starCount} <i className="icarus-terminal-star text-sky-400/40"></i>
          </span>
          <span className="flex items-center gap-x-1">
            {system.planets.length} <i className="icarus-terminal-planet text-sky-400/40"></i>
          </span>
        </p>
      </div>
    </div>
  );
};

export default LatestSystem;

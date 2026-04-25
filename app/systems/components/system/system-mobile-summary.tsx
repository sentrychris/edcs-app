import type { FunctionComponent } from "react";
import type SystemMap from "../../lib/system-map";
import { SystemBodyType } from "@/core/constants/system";

interface Props {
  systemMap: SystemMap;
  fleetCarrierCount: number;
  className?: string;
}

const SystemMobileSummary: FunctionComponent<Props> = ({
  systemMap,
  fleetCarrierCount,
  className,
}) => {
  const starCount = systemMap.stars.filter((s) => s._type === SystemBodyType.Star).length;

  const stats: Array<{ label: string; value: number; icon: string }> = [
    { label: "Stars",          value: starCount,            icon: "icarus-terminal-star" },
    { label: "Bodies",         value: systemMap.planets.length, icon: "icarus-terminal-planet" },
    { label: "Stations",       value: systemMap.stations.length, icon: "icarus-terminal-outpost" },
    { label: "Fleet Carriers", value: fleetCarrierCount,    icon: "icarus-terminal-megaship" },
  ];

  return (
    <div
      className={`mb-5 border border-sky-900/20 bg-black/50 backdrop-blur backdrop-filter ${className ?? ""}`}
    >
      <div className="flex items-center gap-3 border-b border-sky-900/20 px-4 py-3">
        <i className="icarus-terminal-system-bodies text-glow__blue" style={{ fontSize: "1.5rem" }} />
        <div>
          <h2 className="text-glow__blue font-bold uppercase tracking-wide">System Summary</h2>
          <p className="text-xs uppercase tracking-wider text-neutral-500">Orbital telemetry</p>
        </div>
      </div>
      <div className="grid grid-cols-2 divide-x divide-y divide-neutral-800 text-xs uppercase tracking-wide">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 px-4 py-3">
            <span className="text-xs tracking-widest text-neutral-600">{stat.label}</span>
            <span className="flex items-center gap-2 font-bold text-neutral-200">
              <i className={`${stat.icon} text-glow__blue shrink-0`} />
              <span className="text-glow__blue">{stat.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemMobileSummary;

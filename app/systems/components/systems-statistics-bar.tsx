"use client";

import type { FunctionComponent } from "react";
import type { AppStatistics } from "@/core/interfaces/Statistics";
import { useEffect, useState } from "react";
import { formatNumber } from "@/core/string-utils";
import { getResource } from "@/core/api";
import { statisticsState } from "../lib/state";
import LatestSystem from "./latest-system";
import Panel from "@/components/panel";
import Heading from "@/components/heading";
import { cn } from "@/core/cn";

interface Props {
  callInterval?: number;
  flushCache?: number;
  className?: string;
}

const SystemsStatisticsBar: FunctionComponent<Props> = ({
  className = "",
  callInterval = 30000,
  flushCache = 0,
}) => {
  const [statistics, setStatistics] = useState<AppStatistics>(statisticsState.data);
  const [statisticsInterval, setStatisticsInterval] = useState<NodeJS.Timeout>();

  useEffect(() => {
    const callStatistics = (flushCache = 0) => {
      getResource<AppStatistics>("statistics", {
        params: {
          flushCache,
        },
      }).then((response) => {
        setStatistics(response.data);
      });
    };

    callStatistics(0);

    if (statisticsInterval) {
      clearInterval(statisticsInterval);
    }

    const interval = setInterval(() => {
      callStatistics(flushCache);
    }, callInterval);

    setStatisticsInterval(interval);

    return () => clearInterval(interval);
  }, [flushCache, callInterval]);

  const stats = [
    {
      icon: "icarus-terminal-system-orbits",
      label: "Systems Logged",
      value: formatNumber(statistics.cartographical.systems),
      bg: "bg-sky-900/10",
    },
    {
      icon: "icarus-terminal-scan",
      label: "EDDN Service",
      value: <span className="text-green-400 uppercase text-sm">
        online
      </span>,
      bg: "bg-green-900/10",
    },
    {
      icon: "icarus-terminal-system-bodies",
      label: "EDSM Service",
      value: <span className="text-green-400 uppercase text-sm">
        Online
      </span>,
      bg: "bg-green-900/10",
    },
  ];

  return (
    <Panel variant="muted" className={cn("fx-panel-scan", className)} cornerClassName="z-10">

      <Heading bordered icon="icarus-terminal-planet" title="Cartographic Database" subtitle="Systems Intelligence" className="px-4 py-3 md:px-5 md:py-4" />

      <div className="flex items-stretch divide-x divide-sky-900/20">
        {stats.map(({ icon, label, value, bg }) => (
          <div key={label} className={cn("flex flex-1 flex-col gap-2 px-3 py-3 md:px-5 md:py-4", bg)}>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-600">
              <i className={`${icon} text-sky-500/60`}></i>
              {label}
            </div>
            <span className="fx-data-flicker text-glow__blue text-base font-bold tracking-wide md:text-xl">{value}</span>
          </div>
        ))}

        <div className="hidden flex-col justify-center px-5 py-4 md:flex bg-sky-900/10">
          <LatestSystem className="text-xs" />
        </div>
      </div>
    </Panel>
  );
};

export default SystemsStatisticsBar;

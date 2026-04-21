"use client";

import { type FunctionComponent, useEffect, useState } from "react";
import type { ListenerEvent } from "@/core/interfaces/Dispatcher";
import type { System } from "@/core/interfaces/System";
import type { Station } from "@/core/interfaces/Station";
import type SystemMap from "../../lib/system-map";
import { systemDispatcher } from "@/core/events/SystemDispatcher";
import Link from "next/link";
import SystemBodiesTree from "./system-bodies-tree";
import SystemMapStatistics from "./system-map-statistics";
import { stationIconByType } from "@/core/render-utils";

interface Props {
  systemMap: SystemMap;
  isLoading: boolean;
  system: System;
  setSelectedBodyDisplayInfo: (info: any) => void;
  setIsPanelOpen: (isOpen: boolean) => void;
}

const SystemBodiesMap: FunctionComponent<Props> = ({
  isLoading,
  systemMap,
  system,
  setSelectedBodyDisplayInfo,
  setIsPanelOpen,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const displayBodyPanelListener = (event: ListenerEvent) => {
      setSelectedBodyDisplayInfo(event.message);
      setIsPanelOpen(true);
    };
    systemDispatcher.addEventListener("display-body-panel", displayBodyPanelListener);
    return () => {
      systemDispatcher.removeEventListener("display-body-panel", displayBodyPanelListener);
    };
  }, [setSelectedBodyDisplayInfo, setIsPanelOpen]);

  const renderStations = (stations: Station[]) => {
    if (stations.length === 0) return null;
    return (
      <div className="system-body__children mb-4 hidden w-full overflow-x-auto border-b border-sky-900/20 pb-4 md:flex items-center gap-x-20">
        {stations.sort((a, b) => a.distance_to_arrival - b.distance_to_arrival).map((station) => (
          <Link
            key={station.slug}
            href={`/stations/${station.slug}`}
            className="me-5 flex items-center text-xs hover:opacity-80"
          >
            <i className={`${stationIconByType(station.type)} text-glow`}></i>
            <div className="ms-3">
              <span className="text-glow__blue text-xs whitespace-nowrap uppercase hover:underline">
                {station.name}
              </span>
              <div className="text-xs text-neutral-300">{station.distance_to_arrival} ls</div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="mb-5 border border-sky-900/20 bg-black/50 backdrop-blur backdrop-filter">
      <div
        role="button"
        tabIndex={0}
        aria-expanded={!collapsed}
        onClick={() => setCollapsed((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setCollapsed((v) => !v);
          }
        }}
        className="flex cursor-pointer select-none items-center justify-between border-b border-sky-900/20 px-4 py-3 transition-colors hover:bg-sky-500/5"
      >
        <div className="flex items-center gap-3">
          <i
            className="icarus-terminal-system-bodies text-glow__blue"
            style={{ fontSize: "1.5rem" }}
          ></i>
          <div>
            <h2 className="text-glow__blue font-bold uppercase tracking-wide">System Map</h2>
            <p className="text-xs uppercase tracking-wider text-neutral-500">Orbital Telemetry</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {!isLoading && <SystemMapStatistics system={systemMap} />}
          {!isLoading && (
            <Link
              href={`/systems/${system.slug}/solar-map`}
              onClick={(e) => e.stopPropagation()}
              className="text-glow__blue border border-sky-900 px-3 py-1 text-xs uppercase tracking-wider transition-colors hover:border-sky-500"
            >
              View More
            </Link>
          )}
          <i
            className={`icarus-terminal-chevron-${collapsed ? "down" : "up"} text-glow__blue text-sm`}
          />
        </div>
      </div>
      {!collapsed && !isLoading && (
        <div className="px-4 py-3">
          {renderStations(system.stations)}
          {systemMap && systemMap.items.length > 0 ? (
            <SystemBodiesTree systemMap={systemMap} />
          ) : (
            <div className="text-glow__blue mx-auto py-6 text-center text-lg font-bold uppercase">
              Telemetry data not found for {system.name}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SystemBodiesMap;

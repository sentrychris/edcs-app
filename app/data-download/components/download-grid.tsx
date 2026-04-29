"use client";

import { useResource } from "@/core/hooks/resource";
import type { DumpManifest, DumpType } from "@/core/interfaces/DownloadManifest";
import Panel from "@/components/panel";
import SectionHeader from "@/components/section-header";
import SearchStatusPanel from "@/components/search-status-panel";
import DownloadCard from "./download-card";

interface DownloadItem {
  icon: string;
  title: string;
  description: string;
  format: string;
  scope: string;
  note?: string;
  type: DumpType;
}

const SECTIONS: { heading: string; icon: string; items: DownloadItem[] }[] = [
  {
    heading: "Stellar Catalogue",
    icon: "icarus-terminal-system-orbits",
    items: [
      {
        icon: "icarus-terminal-system-orbits",
        title: "Full Systems Dump",
        description:
          "Every star system in the database. Includes system name, coordinates, allegiance, government, economy, security, and metadata.",
        format: ".json.gz",
        scope: "All systems",
        note: "Large file",
        type: "systems",
      },
      {
        icon: "icarus-terminal-system-bodies",
        title: "Populated Systems",
        description:
          "Systems with a recorded population greater than zero. Smaller than the full dump — useful for economy and BGS research.",
        format: ".json.gz",
        scope: "Population > 0",
        note: "Large file",
        type: "populated-systems",
      },
      {
        icon: "icarus-terminal-scan",
        title: "Systems — Last 7 Days",
        description:
          "Systems whose records were created or updated within the past seven days. Useful for incremental sync against a local mirror.",
        format: ".json.gz",
        scope: "Updated ≤ 7 days",
        type: "systems-recent",
      },
    ],
  },
  {
    heading: "Stellar Bodies",
    icon: "icarus-terminal-planet",
    items: [
      {
        icon: "icarus-terminal-planet",
        title: "All Bodies",
        description:
          "Every catalogued body across all systems — stars, planets, moons, and asteroid belts — with orbital parameters, composition, and surface data.",
        format: ".json.gz",
        scope: "All bodies",
        note: "Large file",
        type: "bodies",
      },
      {
        icon: "icarus-terminal-scan",
        title: "Bodies — Last 7 Days",
        description:
          "Bodies added or updated within the past seven days. Suitable for incremental updates to a locally cached body catalogue.",
        format: ".json.gz",
        scope: "Updated ≤ 7 days",
        type: "bodies-recent",
      },
    ],
  },
  {
    heading: "Infrastructure",
    icon: "icarus-terminal-station",
    items: [
      {
        icon: "icarus-terminal-coriolis-starport",
        title: "All Stations",
        description:
          "Starports, outposts, planetary ports, fleet carrier stops, and odyssey settlements. Includes economy, services, landing pads, and market data.",
        format: ".json.gz",
        scope: "All stations",
        note: "Large file",
        type: "stations",
      },
      {
        icon: "icarus-terminal-scan",
        title: "Stations — Last 7 Days",
        description:
          "Station records created or updated in the past seven days. Tracks market refreshes, service changes, and new settlement discoveries.",
        format: ".json.gz",
        scope: "Updated ≤ 7 days",
        type: "stations-recent",
      },
      {
        icon: "icarus-terminal-megaship",
        title: "All Fleet Carriers",
        description:
          "Active fleet carrier records including callsign, owner, current system, docking access, active services, and last seen timestamp.",
        format: ".json.gz",
        scope: "All fleet carriers",
        type: "carriers",
      },
      {
        icon: "icarus-terminal-scan",
        title: "Fleet Carriers — Last 7 Days",
        description:
          "Fleet carriers whose jump position, services, or access permissions changed in the past seven days.",
        format: ".json.gz",
        scope: "Updated ≤ 7 days",
        type: "carriers-recent",
      },
    ],
  },
];

export default function DownloadGrid() {
  const { data: manifest, isLoading, error } = useResource<DumpManifest>("downloads/manifest");

  if (error) {
    return (
      <SearchStatusPanel
        state="error"
        icon="icarus-terminal-warning"
        message="Failed to load download manifest. The API may be unavailable."
      />
    );
  }

  return (
    <div className="space-y-5">
      {SECTIONS.map((section) => (
        <Panel key={section.heading} variant="muted" className="fx-chamfer p-4 md:p-5">
          <SectionHeader icon={section.icon} title={section.heading} />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {section.items.map((item) => (
              <DownloadCard
                key={item.title}
                {...item}
                entry={manifest?.[item.type]}
                isLoadingManifest={isLoading}
              />
            ))}
          </div>
        </Panel>
      ))}
    </div>
  );
}

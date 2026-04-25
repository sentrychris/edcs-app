"use client";

import type { FunctionComponent } from "react";
import type { Station } from "@/core/interfaces/Station";
import { formatDate } from "@/core/string-utils";
import { stationIconByType } from "@/core/render-utils";
import { useInMemoryPagination } from "@/core/hooks/in-memory-pagination";
import Table from "@/components/table";
import Link from "next/link";
import Heading from "@/components/heading";

interface Props {
  stations: Station[];
}

const SystemStationsTable: FunctionComponent<Props> = ({ stations }) => {
  const { rows, meta, links, setPage } = useInMemoryPagination(stations);

  const columns = {
    name: {
      title: "Name",
      render: (station: Station) => {
        return (
          <Link
            href={`/stations/${station.slug}`}
            className={`hover:text-glow__blue flex items-center text-blue-200 hover:underline`}
          >
            <i className={`${stationIconByType(station.type)} text-glow me-2 text-sm`}></i>
            {station.name}
          </Link>
        );
      },
    },
    type: {
      title: "Type",
      render: (station: Station) => {
        return <span>{station.type}</span>;
      },
    },
    body: {
      title: "Belongs To",
      render: (station: Station) => {
        return <span>{station.body?.name ?? "None"}</span>;
      },
    },
    distance_to_arrival: {
      title: "Dist. to star",
      render: (station: Station) => {
        return <span>{station.distance_to_arrival} LS</span>;
      },
    },
    allegiance: {
      title: "Allegiance",
      render: (station: Station) => {
        return <span>{station.allegiance}</span>;
      },
    },
    controlling_faction: {
      title: "Controlling Faction",
      render: (station: Station) => {
        return <span>{station.controlling_faction}</span>;
      },
    },
    economy: {
      title: "Economy",
      render: (station: Station) => {
        return <span>{station.economy}</span>;
      },
    },
    has_market: {
      title: "Market",
      render: (station: Station) => {
        return station.has_market ? (
          <span className="text-green-300">Yes</span>
        ) : (
          <span className="text-red-300">No</span>
        );
      },
    },
    has_shipyard: {
      title: "Shipyard",
      render: (station: Station) => {
        return station.has_shipyard ? (
          <span className="text-green-300">Yes</span>
        ) : (
          <span className="text-red-300">No</span>
        );
      },
    },
    has_outfitting: {
      title: "Outfitting",
      render: (station: Station) => {
        return station.has_outfitting ? (
          <span className="text-green-300">Yes</span>
        ) : (
          <span className="text-red-300">No</span>
        );
      },
    },
    last_updated: {
      title: "Last Updated",
      render: (station: Station) => {
        return (
          <span>
            {station.last_updated.information
              ? formatDate(station.last_updated.information)
              : "No Data"}
          </span>
        );
      },
    },
  };

  const header = (
    <Heading bordered icon="icarus-terminal-outpost" title="System Stations" subtitle="Docking & Logistics Network" className="px-5 py-4" />
  );

  return <Table collapsible header={header} columns={columns} data={rows} meta={meta} links={links} page={setPage} />;
};

export default SystemStationsTable;

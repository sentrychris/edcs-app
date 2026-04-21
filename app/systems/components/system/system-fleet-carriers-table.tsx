"use client";

import { type FunctionComponent, useState } from "react";
import type { FleetCarrier } from "@/core/interfaces/FleetCarrier";
import type { Links, Meta } from "@/core/interfaces/Pagination";
import { formatDate } from "@/core/string-utils";
import Table from "@/components/table";
import Heading from "@/components/heading";

interface Props {
  fleetCarriers: FleetCarrier[];
}

const PER_PAGE = 10;

const SERVICE_ABBREVIATIONS: Record<string, string> = {
  "Universal Cartographics": "UC",
  "Redemption Office": "RO",
  "Black Market": "BM",
  "Secure Warehouse": "SW",
  "Material Trader": "MT",
  "Technology Broker": "TB",
  "Pioneer Supplies": "PS",
  "Search and Rescue": "SR",
  "Interstellar Factors Contact": "IF",
  "Crew Lounge": "CL",
  "Concourse Bar": "BAR",
  "Vista Genomics": "VG",
  "Shipyard": "SY",
  "Outfitting": "OF",
  "Market": "MK",
  "Refuel": "RF",
  "Repair": "RP",
  "Restock": "RS",
  "Tuning": "TU",
};

const serviceAbbreviation = (service: string): string => {
  if (SERVICE_ABBREVIATIONS[service]) {
    return SERVICE_ABBREVIATIONS[service];
  }
  return service
    .split(/\s+/)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("")
    .slice(0, 3);
};

const buildPaginationProps = (
  allRows: FleetCarrier[],
  currentPage: number,
): { rows: FleetCarrier[]; meta: Meta; links: Links } => {
  const total = allRows.length;
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));
  const from = (currentPage - 1) * PER_PAGE;
  const to = Math.min(from + PER_PAGE, total);

  const meta: Meta = { current_page: currentPage, from: from + 1, path: "", per_page: PER_PAGE, to };
  const links: Links = {
    first: `?page=1`,
    last: `?page=${lastPage}`,
    prev: currentPage > 1 ? `?page=${currentPage - 1}` : null,
    next: currentPage < lastPage ? `?page=${currentPage + 1}` : null,
  };

  return { rows: allRows.slice(from, to), meta, links };
};

const SystemFleetCarriersTable: FunctionComponent<Props> = ({ fleetCarriers }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { rows, meta, links } = buildPaginationProps(fleetCarriers, currentPage);

  const handlePage = (link: string) => {
    const params = new URLSearchParams(link.replace(/^[^?]*/, ""));
    setCurrentPage(parseInt(params.get("page") ?? "1", 10));
  };

  const columns = {
    name: {
      title: "Name",
      render: (carrier: FleetCarrier) => {
        return (
          <span className="flex items-center">
            <i className="icarus-terminal-megaship text-glow me-2 text-sm"></i>
            {carrier.name}
          </span>
        );
      },
    },
    distance_to_arrival: {
      title: "Dist. to star",
      render: (carrier: FleetCarrier) => {
        return <span>{carrier.distance_to_arrival !== null ? `${carrier.distance_to_arrival} LS` : "—"}</span>;
      },
    },
    has_market: {
      title: "Market",
      render: (carrier: FleetCarrier) => {
        return carrier.has_market ? (
          <span className="text-green-300">Yes</span>
        ) : (
          <span className="text-red-300">No</span>
        );
      },
    },
    has_shipyard: {
      title: "Shipyard",
      render: (carrier: FleetCarrier) => {
        return carrier.has_shipyard ? (
          <span className="text-green-300">Yes</span>
        ) : (
          <span className="text-red-300">No</span>
        );
      },
    },
    has_outfitting: {
      title: "Outfitting",
      render: (carrier: FleetCarrier) => {
        return carrier.has_outfitting ? (
          <span className="text-green-300">Yes</span>
        ) : (
          <span className="text-red-300">No</span>
        );
      },
    },
    other_services: {
      title: "Other Services",
      render: (carrier: FleetCarrier) => {
        if (!carrier.other_services || carrier.other_services.length === 0) {
          return <span className="text-stone-500">—</span>;
        }

        return (
          <div className="flex flex-wrap gap-1">
            {carrier.other_services.map((service) => (
              <span
                key={service}
                title={service}
                className="inline-flex h-5 min-w-[1.25rem] items-center justify-center border border-sky-500/40 bg-sky-500/10 px-1 text-[0.65rem] uppercase tracking-wider text-sky-300"
              >
                {serviceAbbreviation(service)}
              </span>
            ))}
          </div>
        );
      },
    },
    last_updated: {
      title: "Last Updated",
      render: (carrier: FleetCarrier) => {
        return (
          <span>
            {carrier.last_updated.information
              ? formatDate(carrier.last_updated.information)
              : "No Data"}
          </span>
        );
      },
    },
  };

  const header = (
    <Heading
      bordered
      icon="icarus-terminal-megaship"
      title="Fleet Carriers in System"
      subtitle="Mobile Docking Platforms — Last Reported Position"
      className="px-5 py-4"
    />
  );

  return <Table collapsible header={header} columns={columns} data={rows} meta={meta} links={links} page={handlePage} />;
};

export default SystemFleetCarriersTable;

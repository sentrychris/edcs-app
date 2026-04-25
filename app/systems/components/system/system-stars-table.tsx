"use client";

import type { FunctionComponent } from "react";
import type { MappedSystemBody } from "@/core/interfaces/SystemBody";
import { formatDate, formatNumber } from "@/core/string-utils";
import { useInMemoryPagination } from "@/core/hooks/in-memory-pagination";
import Link from "next/link";
import { SystemBodyType } from "@/core/constants/system";
import Table from "@/components/table";
import Heading from "@/components/heading";

type SystemStar = Required<MappedSystemBody>;

interface Props {
  stars: SystemStar[];
  systemSlug: string;
}

const SystemStarsTable: FunctionComponent<Props> = ({ stars, systemSlug }) => {
  const filtered = stars.filter((s) => s._type === SystemBodyType.Star);
  const { rows, meta, links, setPage } = useInMemoryPagination(filtered);

  const columns = {
    name: {
      title: "Name",
      render: (body: SystemStar) => {
        return (
          <Link
            href={`/systems/${systemSlug}/body/${body.slug}`}
            className="hover:text-glow__blue flex items-center text-blue-200 hover:underline"
          >
            <i className={`icarus-terminal-star text-glow me-2 text-sm`}></i>
            {body.name}
          </Link>
        );
      },
    },
    type: {
      title: "Type",
      render: (body: SystemStar) => {
        return body.sub_type.replace("Star", "");
      },
    },
    spectral_class: {
      title: "Class",
      render: (body: SystemStar) => {
        return body.spectral_class ?? "No Data";
      },
    },
    main_star: {
      title: "Is Main",
      render: (body: SystemStar) => {
        return body.is_main_star ? (
          <span className="text-green-300">Yes</span>
        ) : (
          <span className="text-red-300">No</span>
        );
      },
    },
    bodies: {
      title: "Bodies",
      render: (body: SystemStar) => {
        return (
          <Link
            href={`/systems/${systemSlug}/body/${body.slug}`}
            className="hover:text-glow__blue text-blue-200 hover:underline"
          >
            {body._children?.length ?? 0}
          </Link>
        );
      },
    },
    scoopable: {
      title: "Fuel",
      render: (body: SystemStar) => {
        return body.is_scoopable ? (
          <span className="text-green-300">Yes</span>
        ) : (
          <span className="text-red-300">No</span>
        );
      },
    },
    surface_temp: {
      title: "Surface Temp",
      render: (body: SystemStar) => {
        return formatNumber(body.surface_temp ?? 0) + " K";
      },
    },
    solar_masses: {
      title: "Sol Mass",
      render: (body: SystemStar) => {
        return (body.solar_masses as number).toFixed(4);
      },
    },
    solar_radius: {
      title: "Sol Radius",
      render: (body: SystemStar) => {
        return (body.solar_radius as number).toFixed(4);
      },
    },
    magnitude: {
      title: "Magnitude",
      render: (body: SystemStar) => {
        return (body.absolute_magnitude as number).toFixed(4);
      },
    },
    commander: {
      title: "Discovered By",
      render: (body: SystemStar) => {
        const value = body.discovered_by ? body.discovered_by : "Unknown";
        return (
          <Link className="text-blue-200 hover:underline" href={"#"}>
            {value.startsWith("CMDR") ? value : `CMDR ${value}`}
          </Link>
        );
      },
    },
    discovered: {
      title: "Discovered On",
      render: (body: SystemStar) => {
        return formatDate(body.discovered_at);
      },
    },
  };

  const header = (
    <Heading bordered icon="icarus-terminal-star" title="Main Sequence Stars" subtitle="Stellar Classification Data" className="px-5 py-4" />
  );

  return (
    <Table collapsible header={header} columns={columns} data={rows} meta={meta} links={links} page={setPage} />
  );
};

export default SystemStarsTable;

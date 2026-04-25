"use client";

import type { FunctionComponent } from "react";
import type { MappedSystemBody } from "@/core/interfaces/SystemBody";
import { SystemBodyType } from "@/core/constants/system";
import { formatDate } from "@/core/string-utils";
import { useInMemoryPagination } from "@/core/hooks/in-memory-pagination";
import Link from "next/link";
import Table from "@/components/table";
import Heading from "@/components/heading";

type SystemBody = Required<MappedSystemBody>;

interface Props {
  bodies: SystemBody[];
  systemSlug: string;
}

const SystemBodiesTable: FunctionComponent<Props> = ({ bodies, systemSlug }) => {
  const { rows, meta, links, setPage } = useInMemoryPagination(bodies);

  const isOrbitingPlanet = (body: SystemBody) => {
    return body.parents.find((parent) => {
      return (
        Object.prototype.hasOwnProperty.call(parent, SystemBodyType.Planet) &&
        parent[SystemBodyType.Planet] !== undefined
      );
    });
  };
  const orbitalMargin = "ms-5";

  const columns = {
    name: {
      title: "Name",
      render: (body: SystemBody) => {
        const childClass = isOrbitingPlanet(body) ? "ms-5" : "";
        const iconClass =
          body.atmosphere_type !== null && body.atmosphere_type.toLowerCase() !== "no atmosphere"
            ? "atmosphere text-glow"
            : body.is_landable
              ? "planet-landable text-glow__blue"
              : "planet text-glow__blue";

        return (
          <Link
            href={`/systems/${systemSlug}/body/${body.slug}`}
            className={`${childClass} hover:text-glow__blue flex items-center text-blue-200 hover:underline`}
          >
            <i className={`icarus-terminal-${iconClass} me-2 text-sm`}></i>
            {body.name}
          </Link>
        );
      },
    },
    sub_type: {
      title: "Type",
      render: (body: SystemBody) => {
        const childClass = isOrbitingPlanet(body) ? orbitalMargin : "";
        return <span className={childClass}>{body.sub_type}</span>;
      },
    },
    landable: {
      title: "Landable",
      render: (body: SystemBody) => {
        const childClass = isOrbitingPlanet(body) ? orbitalMargin : "";
        return body.is_landable ? (
          <span className={`${childClass} text-green-300`}>Yes</span>
        ) : (
          <span className={`${childClass} text-red-300`}>No</span>
        );
      },
    },
    atmosphere: {
      title: "Atmosphere",
      render: (body: SystemBody) => {
        const childClass = isOrbitingPlanet(body) ? orbitalMargin : "";
        return body.atmosphere_type ? (
          <span className={childClass}>{body.atmosphere_type}</span>
        ) : (
          <span className={childClass}>No Atmosphere</span>
        );
      },
    },
    volcanism: {
      title: "Volcanism",
      render: (body: SystemBody) => {
        const childClass = isOrbitingPlanet(body) ? orbitalMargin : "";
        return body.volcanism_type ? (
          <span className={childClass}>{body.volcanism_type}</span>
        ) : (
          <span className={childClass}>No Volcanism</span>
        );
      },
    },
    terraforming: {
      title: "Terraforming",
      render: (body: SystemBody) => {
        const childClass = isOrbitingPlanet(body) ? orbitalMargin : "";
        return body.terraforming_state && body.terraforming_state !== "" ? (
          <span className={childClass}>{body.terraforming_state}</span>
        ) : (
          <span className={childClass}>No Data</span>
        );
      },
    },
    commander: {
      title: "Discovered By",
      render: (body: SystemBody) => {
        const childClass = isOrbitingPlanet(body) ? orbitalMargin : "";
        const value = body.discovered_by ? body.discovered_by : "Unknown";
        return (
          <Link className={`${childClass} text-blue-200 hover:underline`} href={"#"}>
            {value.startsWith("CMDR") ? value : `CMDR ${value}`}
          </Link>
        );
      },
    },
    discovered: {
      title: "Discovered On",
      render: (body: SystemBody) => {
        const childClass = isOrbitingPlanet(body) ? orbitalMargin : "";
        return <span className={childClass}>{formatDate(body.discovered_at)}</span>;
      },
    },
  };

  const header = (
    <Heading bordered icon="icarus-terminal-system-orbits" title="Orbital Bodies" subtitle="Planetary Survey Records" className="px-5 py-4" />
  );

  return <Table collapsible header={header} columns={columns} data={rows} meta={meta} links={links} page={setPage} />;
};

export default SystemBodiesTable;

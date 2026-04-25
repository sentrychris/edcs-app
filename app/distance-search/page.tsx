import type { Metadata, ResolvingMetadata } from "next";
import { settings } from "@/core/config";
import TerminalHeader from "@/components/terminal-header";
import DistanceSearchView from "./components/distance-search-view";

interface Props {
  searchParams: { slug?: string; ly?: string };
}

export async function generateMetadata(
  _props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Distance Search | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/distance-search`,
      title: `Distance Search | ${(await parent).title?.absolute}`,
      description: "Find star systems within a given distance of any system in Elite: Dangerous.",
    },
    description: "Find star systems within a given distance of any system in Elite: Dangerous.",
  };
}

export default function Page({ searchParams }: Props) {
  const initialLy = searchParams.ly ? parseInt(searchParams.ly, 10) : 50;

  return (
    <>
      {/* ── Navigation header bar ── */}
      <TerminalHeader
        variant="panel"
        moduleLabel="MODULE:SCANNER"
        protocolLabel="PROTOCOL:PROXIMITY-SCAN"
        statusLabel="SCANNER: ACTIVE"
      />

      <DistanceSearchView
        initialSlug={searchParams.slug ?? ""}
        initialLy={Number.isNaN(initialLy) ? 50 : initialLy}
      />
    </>
  );
}

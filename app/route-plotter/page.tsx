import type { Metadata, ResolvingMetadata } from "next";
import { settings } from "@/core/config";
import TerminalHeader from "@/components/terminal-header";
import RoutePlotterView from "./components/route-plotter-view";

interface Props {
  searchParams: { from?: string; to?: string; ly?: string };
}

export async function generateMetadata(
  _props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Route Plotter | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/route-plotter`,
      title: `Route Plotter | ${(await parent).title?.absolute}`,
      description: "Plan jump routes between star systems in Elite: Dangerous.",
    },
    description: "Plan jump routes between star systems in Elite: Dangerous.",
  };
}

export default function Page({ searchParams }: Props) {
  const initialLy = searchParams.ly ? parseInt(searchParams.ly, 10) : 30;

  return (
    <>
      {/* ── Navigation header bar ── */}
      <TerminalHeader
        variant="panel"
        moduleLabel="MODULE:NAVIGATION"
        protocolLabel="PROTOCOL:ROUTE-PLANNER"
        statusLabel="NAVIGATION: ACTIVE"
      />

      <RoutePlotterView
        initialFrom={searchParams.from ?? ""}
        initialTo={searchParams.to ?? ""}
        initialLy={Number.isNaN(initialLy) ? 30 : initialLy}
      />
    </>
  );
}

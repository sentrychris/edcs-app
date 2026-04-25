import type { Metadata, ResolvingMetadata } from "next";
import { settings } from "@/core/config";
import TerminalHeader from "@/components/terminal-header";
import MarketSearchView from "./components/market-search-view";

interface Props {
  searchParams: { mode?: string; commodity?: string; near_system?: string };
}

export async function generateMetadata(
  _props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Market Search | ${(await parent).title?.absolute}`,
    openGraph: {
      ...(await parent).openGraph,
      url: `${settings.app.url}/market-search`,
      title: `Market Search | ${(await parent).title?.absolute}`,
      description: "Find trading hotspots and profitable trade routes from live commodity market data in Elite: Dangerous.",
    },
    description: "Find trading hotspots and profitable trade routes from live commodity market data in Elite: Dangerous.",
  };
}

export default function Page({ searchParams }: Props) {
  const initialMode = searchParams.mode === "trade-route" ? "trade-route" : "commodity";

  return (
    <>
      {/* ── Navigation header bar ── */}
      <TerminalHeader
        variant="panel"
        moduleLabel="MODULE:COMMERCE"
        protocolLabel="PROTOCOL:MARKET-SCAN"
        statusLabel="MARKET FEED: LIVE"
      />

      <MarketSearchView
        initialMode={initialMode}
        initialCommodity={searchParams.commodity ?? ""}
        initialNearSystem={searchParams.near_system ?? ""}
      />
    </>
  );
}

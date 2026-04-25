import type { Metadata, ResolvingMetadata } from "next";
import { settings } from "@/core/config";
import Panel from "@/components/panel";
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
      <Panel className="mb-5 px-4 py-3 md:px-6 md:py-4">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest text-neutral-600">
          <div className="flex items-center gap-3">
            <span>MODULE:COMMERCE</span>
            <span className="hidden text-neutral-800 sm:inline">■</span>
            <span className="hidden sm:inline">PROTOCOL:MARKET-SCAN</span>
            <span className="hidden text-neutral-800 md:inline">■</span>
            <span className="hidden md:inline">CLASS:UNRESTRICTED</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="fx-dot-blue h-1.5 w-1.5"></span>
            <span>MARKET FEED: LIVE</span>
          </div>
        </div>
      </Panel>

      <MarketSearchView
        initialMode={initialMode}
        initialCommodity={searchParams.commodity ?? ""}
        initialNearSystem={searchParams.near_system ?? ""}
      />
    </>
  );
}

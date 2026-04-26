import type { Metadata } from "next";
import FieldGuideModulePage from "../components/field-guide-module-page";
import { marketTopics } from "./data";

export const metadata: Metadata = {
  title: "Market & Economy | Learning Resources | ED:CS",
  description: "Field guides for supply, demand, trade routes, economy pairings, rare goods, BGS effects, and carrier trading.",
};

export default function MarketEconomyPage() {
  return (
    <FieldGuideModulePage
      topics={marketTopics}
      protocolLabel="DATABASE:MARKET-ECONOMY"
      moduleTitle="Market & Economy"
      moduleSubtitle="Commodity Flow, Trade Routes & Market States"
      moduleIcon="icarus-terminal-economy"
      contextLabel="MODULE - MARKET & ECONOMY"
      lensTitle="Market Lens"
      lensParagraphs={[
        "This module treats markets as moving signals: supply, demand, price, economy, state, and update age all change whether a trade is actually worth flying.",
        "It pairs directly with ED:CS market search and trade-route tooling because the same rules decide whether a listed opportunity is reliable, stale, limited, or ship-compatible.",
      ]}
    />
  );
}

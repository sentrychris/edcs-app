"use client";

import { useState } from "react";
import Panel from "@/components/panel";
import Heading from "@/components/heading";
import CommoditySearchPanel from "./commodity-search-panel";
import TradeRoutePanel from "./trade-route-panel";

type Mode = "commodity" | "trade-route";

interface Props {
  initialMode: Mode;
  initialCommodity: string;
  initialNearSystem: string;
}

export default function MarketSearchView({ initialMode, initialCommodity, initialNearSystem }: Props) {
  const [mode, setMode] = useState<Mode>(initialMode);

  return (
    <div className="flex flex-col gap-5">
      {/* ── Mode switcher ── */}
      <Panel className="px-4 py-4 md:px-6 md:py-5">
        <Heading
          icon="icarus-terminal-economy"
          title="Market Search"
          subtitle="Live commodity prices from CMDR market scans"
          bordered
          className="mb-4 pb-4"
        />

        <div role="tablist" className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <ModeButton
            active={mode === "commodity"}
            onClick={() => setMode("commodity")}
            icon="icarus-terminal-economy"
            label="Commodity"
            description="Find best buy & sell stations"
          />
          <ModeButton
            active={mode === "trade-route"}
            onClick={() => setMode("trade-route")}
            icon="icarus-terminal-route"
            label="Trade Routes"
            description="Profitable round trips by commodity"
          />
        </div>
      </Panel>

      {mode === "commodity" ? (
        <CommoditySearchPanel
          initialCommodity={initialCommodity}
          initialNearSystem={initialNearSystem}
        />
      ) : (
        <TradeRoutePanel initialNearSystem={initialNearSystem} />
      )}
    </div>
  );
}

interface ModeButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  description: string;
}

function ModeButton({ active, onClick, icon, label, description }: ModeButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={[
        "flex items-center gap-3 border px-4 py-3 text-left transition-colors",
        active
          ? "border-sky-500/60 bg-sky-900/20"
          : "border-sky-900/20 hover:border-sky-900/40 hover:bg-sky-900/5",
      ].join(" ")}
    >
      <i className={`${icon} text-lg ${active ? "text-sky-400" : "text-neutral-600"}`}></i>
      <div className="min-w-0">
        <p className={`text-xs font-bold uppercase tracking-widest ${active ? "text-sky-300" : "text-neutral-300"}`}>
          {label}
        </p>
        <p className="text-xs uppercase tracking-wider text-neutral-600">{description}</p>
      </div>
    </button>
  );
}

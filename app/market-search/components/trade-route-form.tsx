"use client";

import { useState } from "react";
import SystemSearchInput from "@/components/system-search-input";
import type { TradeRouteFilters } from "@/core/interfaces/MarketSearch";
import NumberField from "./number-field";

interface Props {
  initialNearSystem: string;
  onSubmit: (filters: TradeRouteFilters) => void;
  isLoading: boolean;
}

const DEFAULTS = {
  ly: 100,
  min_stock: 1,
  min_demand: 1,
  min_profit: 1000,
  limit: 20,
};

export default function TradeRouteForm({ initialNearSystem, onSubmit, isLoading }: Props) {
  const [nearSystemSlug, setNearSystemSlug] = useState(initialNearSystem);
  const [ly, setLy] = useState(String(DEFAULTS.ly));
  const [minStock, setMinStock] = useState(String(DEFAULTS.min_stock));
  const [minDemand, setMinDemand] = useState(String(DEFAULTS.min_demand));
  const [minProfit, setMinProfit] = useState(String(DEFAULTS.min_profit));
  const [limit, setLimit] = useState(String(DEFAULTS.limit));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) {
      return;
    }
    onSubmit({
      near_system: nearSystemSlug,
      ly: Math.max(1, parseInt(ly, 10) || DEFAULTS.ly),
      min_stock: Math.max(0, parseInt(minStock, 10) || 0),
      min_demand: Math.max(0, parseInt(minDemand, 10) || 0),
      min_profit: Math.max(0, parseInt(minProfit, 10) || 0),
      limit: Math.min(100, Math.max(1, parseInt(limit, 10) || DEFAULTS.limit)),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-3">
          <SystemSearchInput
            label="Near System (optional)"
            placeholder="Constrain both ends to systems near here..."
            onSelect={setNearSystemSlug}
            disabled={isLoading}
          />
        </div>

        <NumberField
          label="Radius (ly)"
          value={ly}
          onChange={setLy}
          min={1}
          max={5000}
          disabled={isLoading || !nearSystemSlug}
        />
        <NumberField label="Min Profit (cr)" value={minProfit} onChange={setMinProfit} min={0} disabled={isLoading} />
        <NumberField label="Limit" value={limit} onChange={setLimit} min={1} max={100} disabled={isLoading} />
        <NumberField label="Min Stock" value={minStock} onChange={setMinStock} min={0} disabled={isLoading} />
        <NumberField label="Min Demand" value={minDemand} onChange={setMinDemand} min={0} disabled={isLoading} />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="fx-btn-sweep h-[37px] self-start border border-sky-900/40 px-6 text-xs font-bold uppercase tracking-widest text-sky-500/70 transition-colors hover:border-sky-500/60 hover:text-sky-400 disabled:pointer-events-none disabled:opacity-40"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <i className="icarus-terminal-route text-sm"></i>
            Pairing...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <i className="icarus-terminal-route text-sm"></i>
            Find Routes
          </span>
        )}
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import SystemSearchInput from "@/components/system-search-input";
import type { CommodityFilters } from "@/core/interfaces/MarketSearch";
import NumberField from "./number-field";

interface Props {
  initialCommodity: string;
  initialNearSystem: string;
  initialNearSystemDetail?: { name: string; slug: string } | null;
  onSubmit: (filters: CommodityFilters) => void;
  isLoading: boolean;
}

const DEFAULTS = {
  ly: 100,
  min_stock: 0,
  min_demand: 0,
  limit: 20,
};

export default function CommoditySearchForm({ initialCommodity, initialNearSystem, initialNearSystemDetail, onSubmit, isLoading }: Props) {
  const [commodity, setCommodity] = useState(initialCommodity);
  const [nearSystemSlug, setNearSystemSlug] = useState(initialNearSystem);
  const [ly, setLy] = useState(String(DEFAULTS.ly));
  const [minStock, setMinStock] = useState(String(DEFAULTS.min_stock));
  const [minDemand, setMinDemand] = useState(String(DEFAULTS.min_demand));
  const [limit, setLimit] = useState(String(DEFAULTS.limit));
  const [showAdvanced, setShowAdvanced] = useState(false);

  const canSubmit = !isLoading && commodity.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      return;
    }
    onSubmit({
      commodity: commodity.trim().toLowerCase().replace(/\s+/g, ""),
      near_system: nearSystemSlug,
      ly: Math.max(1, parseInt(ly, 10) || DEFAULTS.ly),
      min_stock: Math.max(0, parseInt(minStock, 10) || 0),
      min_demand: Math.max(0, parseInt(minDemand, 10) || 0),
      limit: Math.min(100, Math.max(1, parseInt(limit, 10) || DEFAULTS.limit)),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="grow">
          <label className="mb-1 block text-xs font-bold uppercase tracking-widest text-neutral-400">
            Commodity
          </label>
          <input
            type="text"
            value={commodity}
            onChange={(e) => setCommodity(e.target.value)}
            disabled={isLoading}
            list="market-commodity-suggestions"
            placeholder="e.g. gold, tritium, lowtemperaturediamond"
            autoComplete="off"
            spellCheck={false}
            className="h-[37px] w-full border border-sky-900/20 bg-transparent pl-4 text-xs uppercase tracking-wider text-neutral-200 placeholder-neutral-600 outline-none transition-colors focus:border-sky-500/60 focus:outline-none"
          />
          <datalist id="market-commodity-suggestions">
            <option value="gold" />
            <option value="silver" />
            <option value="palladium" />
            <option value="platinum" />
            <option value="painite" />
            <option value="tritium" />
            <option value="lowtemperaturediamond" />
            <option value="alexandrite" />
            <option value="benitoite" />
            <option value="grandidierite" />
            <option value="monazite" />
            <option value="musgravite" />
            <option value="rhodplumsite" />
            <option value="serendibite" />
            <option value="bromellite" />
          </datalist>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="fx-btn-sweep h-[37px] shrink-0 border border-sky-900/40 px-6 text-xs font-bold uppercase tracking-widest text-sky-500/70 transition-colors hover:border-sky-500/60 hover:text-sky-400 disabled:pointer-events-none disabled:opacity-40"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <i className="icarus-terminal-economy text-sm"></i>
              Searching...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <i className="icarus-terminal-economy text-sm"></i>
              Search Markets
            </span>
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="self-start text-xs uppercase tracking-widest text-neutral-500 transition-colors hover:text-sky-400"
      >
        {showAdvanced ? "▾ Hide filters" : "▸ Advanced filters"}
      </button>

      {showAdvanced && (
        <div className="grid grid-cols-1 gap-4 border-t border-sky-900/20 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <SystemSearchInput
              label="Near System (optional)"
              placeholder="Search for a reference system..."
              onSelect={setNearSystemSlug}
              disabled={isLoading}
              initialSystem={initialNearSystemDetail ?? null}
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

          <NumberField
            label="Limit"
            value={limit}
            onChange={setLimit}
            min={1}
            max={100}
            disabled={isLoading}
          />

          <NumberField
            label="Min Stock"
            value={minStock}
            onChange={setMinStock}
            min={0}
            disabled={isLoading}
          />

          <NumberField
            label="Min Demand"
            value={minDemand}
            onChange={setMinDemand}
            min={0}
            disabled={isLoading}
          />
        </div>
      )}
    </form>
  );
}

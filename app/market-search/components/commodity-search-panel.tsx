"use client";

import { useState } from "react";
import { getResource } from "@/core/api";
import type { CommoditySearchResult } from "@/core/interfaces/MarketSearch";
import Panel from "@/components/panel";
import Heading from "@/components/heading";
import CommoditySearchForm from "./commodity-search-form";
import CommodityListingTable from "./commodity-listing-table";

interface Props {
  initialCommodity: string;
  initialNearSystem: string;
}

export interface CommodityFilters {
  commodity: string;
  near_system: string;
  ly: number;
  min_stock: number;
  min_demand: number;
  limit: number;
}

export default function CommoditySearchPanel({ initialCommodity, initialNearSystem }: Props) {
  const [result, setResult] = useState<CommoditySearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CommodityFilters | null>(null);

  const handleSubmit = async (next: CommodityFilters) => {
    setIsLoading(true);
    setError(null);
    setFilters(next);

    try {
      const params: Record<string, string | number> = {
        commodity: next.commodity,
        limit: next.limit,
      };

      if (next.near_system) {
        params.near_system = next.near_system;
        params.ly = next.ly;
      }
      if (next.min_stock > 0) {
        params.min_stock = next.min_stock;
      }
      if (next.min_demand > 0) {
        params.min_demand = next.min_demand;
      }

      const { data } = await getResource<CommoditySearchResult>("stations/search/commodity", { params });
      setResult(data);
    } catch {
      setError("Could not load commodity listings. The commodity may not be in the live index yet.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Panel className="px-4 py-4 md:px-6 md:py-5">
        <Heading
          icon="icarus-terminal-economy"
          title="Commodity Lookup"
          subtitle="Find the cheapest places to buy and the highest paying places to sell"
          bordered
          className="mb-4 pb-4"
        />
        <CommoditySearchForm
          initialCommodity={initialCommodity}
          initialNearSystem={initialNearSystem}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Panel>

      {error && (
        <Panel className="px-4 py-4 md:px-6 md:py-5">
          <div className="flex items-center gap-3 text-red-400/80">
            <i className="icarus-terminal-warning text-base"></i>
            <p className="text-xs uppercase tracking-widest">{error}</p>
          </div>
        </Panel>
      )}

      {isLoading && (
        <Panel className="flex items-center justify-center px-4 py-16">
          <div className="flex flex-col items-center gap-4">
            <i className="icarus-terminal-economy text-glow__blue text-3xl"></i>
            <p className="text-xs uppercase tracking-widest text-neutral-500">Querying market index...</p>
          </div>
        </Panel>
      )}

      {result && !isLoading && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <CommodityListingTable
            title="Best Buy From"
            subtitle="Cheapest stations selling this commodity"
            icon="icarus-terminal-cargo"
            priceLabel="Buy Price"
            priceField="buy_price"
            quantityLabel="Stock"
            quantityField="stock"
            listings={result.best_buy_from}
            commodityDisplayName={result.commodity.display_name}
            filters={filters}
          />
          <CommodityListingTable
            title="Best Sell To"
            subtitle="Highest paying stations buying this commodity"
            icon="icarus-terminal-credits"
            priceLabel="Sell Price"
            priceField="sell_price"
            quantityLabel="Demand"
            quantityField="demand"
            listings={result.best_sell_to}
            commodityDisplayName={result.commodity.display_name}
            filters={filters}
          />
        </div>
      )}
    </>
  );
}

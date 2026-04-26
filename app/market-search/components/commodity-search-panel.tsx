"use client";

import { useState } from "react";
import { getResource } from "@/core/api";
import type { CommodityFilters, CommoditySearchResult } from "@/core/interfaces/MarketSearch";
import Panel from "@/components/panel";
import Heading from "@/components/heading";
import SearchStatusPanel from "@/components/search-status-panel";
import CommoditySearchForm from "./commodity-search-form";
import CommodityListingTable from "./commodity-listing-table";

interface Props {
  initialCommodity: string;
  initialNearSystem: string;
  initialNearSystemDetail?: { name: string; slug: string } | null;
}

export default function CommoditySearchPanel({ initialCommodity, initialNearSystem, initialNearSystemDetail }: Props) {
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
          initialNearSystemDetail={initialNearSystemDetail ?? null}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Panel>

      {error && <SearchStatusPanel state="error" icon="icarus-terminal-warning" message={error} />}

      {isLoading && (
        <SearchStatusPanel state="loading" icon="icarus-terminal-economy" message="Querying market index..." />
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

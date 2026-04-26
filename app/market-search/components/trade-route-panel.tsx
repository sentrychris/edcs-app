"use client";

import { useState } from "react";
import { getResource } from "@/core/api";
import type { MarketTradeRoute, TradeRouteFilters } from "@/core/interfaces/MarketSearch";
import Panel from "@/components/panel";
import Heading from "@/components/heading";
import SearchStatusPanel from "@/components/search-status-panel";
import TradeRouteForm from "./trade-route-form";
import TradeRouteList from "./trade-route-list";

interface Props {
  initialNearSystem: string;
  initialNearSystemDetail?: { name: string; slug: string } | null;
}

export default function TradeRoutePanel({ initialNearSystem, initialNearSystemDetail }: Props) {
  const [routes, setRoutes] = useState<MarketTradeRoute[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (filters: TradeRouteFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      const params: Record<string, string | number> = {
        limit: filters.limit,
        min_stock: filters.min_stock,
        min_demand: filters.min_demand,
        min_profit: filters.min_profit,
      };

      if (filters.near_system) {
        params.near_system = filters.near_system;
        params.ly = filters.ly;
      }

      const { data } = await getResource<MarketTradeRoute[]>("stations/search/trade-route", { params });
      setRoutes(data);
    } catch {
      setError("Could not load trade routes from the live index.");
      setRoutes(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Panel className="px-4 py-4 md:px-6 md:py-5">
        <Heading
          icon="icarus-terminal-route"
          title="Trade Routes"
          subtitle="Profitable buy/sell pairings ranked by profit per unit"
          bordered
          className="mb-4 pb-4"
        />
        <TradeRouteForm
          initialNearSystem={initialNearSystem}
          initialNearSystemDetail={initialNearSystemDetail ?? null}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Panel>

      {error && <SearchStatusPanel state="error" icon="icarus-terminal-warning" message={error} />}

      {isLoading && (
        <SearchStatusPanel state="loading" icon="icarus-terminal-route" message="Pairing markets..." />
      )}

      {routes && !isLoading && <TradeRouteList routes={routes} />}
    </>
  );
}

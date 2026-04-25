"use client";

import { useState } from "react";
import { getResource } from "@/core/api";
import type { MarketTradeRoute } from "@/core/interfaces/MarketSearch";
import Panel from "@/components/panel";
import Heading from "@/components/heading";
import TradeRouteForm from "./trade-route-form";
import TradeRouteList from "./trade-route-list";

interface Props {
  initialNearSystem: string;
}

export interface TradeRouteFilters {
  near_system: string;
  ly: number;
  min_stock: number;
  min_demand: number;
  min_profit: number;
  limit: number;
}

export default function TradeRoutePanel({ initialNearSystem }: Props) {
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
            <i className="icarus-terminal-route text-glow__blue text-3xl"></i>
            <p className="text-xs uppercase tracking-widest text-neutral-500">Pairing markets...</p>
          </div>
        </Panel>
      )}

      {routes && !isLoading && <TradeRouteList routes={routes} />}
    </>
  );
}

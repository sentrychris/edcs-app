"use client";

import { useState } from "react";
import type { SystemRouteWaypoint } from "@/core/interfaces/SystemRoute";
import { getResource } from "@/core/api";
import Panel from "@/components/panel";
import Heading from "@/components/heading";
import SearchStatusPanel from "@/components/search-status-panel";
import RoutePlotterForm from "./route-plotter-form";
import RoutePlot3D from "./route-plot-3d";
import RouteJumpList from "./route-jump-list";

interface Props {
  initialFrom: string;
  initialTo: string;
  initialLy: number;
}

export default function RoutePlotterView({ initialFrom, initialTo, initialLy }: Props) {
  const [route, setRoute] = useState<SystemRouteWaypoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (from: string, to: string, ly: number) => {
    setIsLoading(true);
    setError(null);
    setRoute(null);

    try {
      const { data } = await getResource<SystemRouteWaypoint[]>("systems/search/route", {
        params: { from, to, ly },
      });
      setRoute(data);
    } catch {
      setError("No route found. Check the system slugs are correct or try increasing the jump range.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Form ── */}
      <Panel className="px-4 py-4 md:px-6 md:py-5">
        <Heading
          icon="icarus-terminal-route"
          title="Route Plotter"
          subtitle="Calculate jump route between star systems"
          bordered
          className="mb-4 pb-4"
        />
        <RoutePlotterForm
          initialFrom={initialFrom}
          initialTo={initialTo}
          initialLy={initialLy}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Panel>

      {/* ── Error ── */}
      {error && <SearchStatusPanel state="error" icon="icarus-terminal-warning" message={error} />}

      {/* ── Loading ── */}
      {isLoading && (
        <SearchStatusPanel
          state="loading"
          icon="icarus-terminal-route"
          message="Calculating optimal route..."
        />
      )}

      {/* ── Results ── */}
      {route && !isLoading && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <RoutePlot3D waypoints={route} />
          </div>
          <div>
            <RouteJumpList waypoints={route} />
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import type { MarketTradeRoute } from "@/core/interfaces/MarketSearch";
import Panel from "@/components/panel";
import Heading from "@/components/heading";

interface Props {
  routes: MarketTradeRoute[];
}

const numberFormatter = new Intl.NumberFormat("en-GB");

export default function TradeRouteList({ routes }: Props) {
  if (routes.length === 0) {
    return (
      <Panel className="px-4 py-8">
        <p className="text-center text-xs uppercase tracking-widest text-neutral-500">
          No profitable routes found in the live index — try lowering the minimum profit or expanding the radius.
        </p>
      </Panel>
    );
  }

  return (
    <Panel className="overflow-hidden">
      <div className="border-b border-sky-900/20 px-4 py-3 md:px-5 md:py-4">
        <Heading
          icon="icarus-terminal-credits"
          title="Trade Routes"
          subtitle={`${routes.length} pairing${routes.length === 1 ? "" : "s"} ranked by profit per unit`}
        />
      </div>

      <ul className="divide-y divide-sky-900/10">
        {routes.map((route, idx) => (
          <li key={`${route.commodity.name}-${route.buy_from.station.id}-${route.sell_to.station.id}`}>
            <div className="grid grid-cols-1 gap-4 px-4 py-4 md:grid-cols-12 md:px-5">
              {/* ── Commodity + profit ── */}
              <div className="md:col-span-3">
                <p className="text-xs uppercase tracking-widest text-neutral-600">#{idx + 1}</p>
                <p className="text-sm font-bold uppercase tracking-widest text-sky-300">
                  {route.commodity.display_name}
                </p>
                <p className="mt-2 text-xs uppercase tracking-widest text-neutral-600">Profit / unit</p>
                <p className="text-glow__blue text-lg font-bold tabular-nums">
                  {numberFormatter.format(route.profit_per_unit)}
                  <span className="ml-1 text-xs font-normal text-neutral-500">cr</span>
                </p>
              </div>

              {/* ── Buy from ── */}
              <div className="md:col-span-4">
                <p className="text-xs uppercase tracking-widest text-neutral-600">Buy from</p>
                <Link
                  href={`/stations/${route.buy_from.station.slug}`}
                  className="block truncate text-xs font-bold uppercase tracking-widest text-neutral-300 transition-colors hover:text-sky-400"
                >
                  {route.buy_from.station.name}
                </Link>
                <Link
                  prefetch={false}
                  href={`/systems/${route.buy_from.system.slug}`}
                  className="block truncate text-xs uppercase tracking-widest text-neutral-500 transition-colors hover:text-sky-400"
                >
                  {route.buy_from.system.name}
                </Link>
                <p className="mt-1 text-xs tabular-nums text-neutral-500">
                  @ {numberFormatter.format(route.buy_from.buy_price)} cr
                  <span className="ml-2 text-neutral-700">
                    Stock: {numberFormatter.format(route.buy_from.stock)}
                  </span>
                </p>
              </div>

              {/* ── Arrow ── */}
              <div className="hidden items-center justify-center md:col-span-1 md:flex">
                <span className="text-2xl text-sky-500/40">→</span>
              </div>

              {/* ── Sell to ── */}
              <div className="md:col-span-4">
                <p className="text-xs uppercase tracking-widest text-neutral-600">Sell to</p>
                <Link
                  href={`/stations/${route.sell_to.station.slug}`}
                  className="block truncate text-xs font-bold uppercase tracking-widest text-neutral-300 transition-colors hover:text-sky-400"
                >
                  {route.sell_to.station.name}
                </Link>
                <Link
                  prefetch={false}
                  href={`/systems/${route.sell_to.system.slug}`}
                  className="block truncate text-xs uppercase tracking-widest text-neutral-500 transition-colors hover:text-sky-400"
                >
                  {route.sell_to.system.name}
                </Link>
                <p className="mt-1 text-xs tabular-nums text-neutral-500">
                  @ {numberFormatter.format(route.sell_to.sell_price)} cr
                  <span className="ml-2 text-neutral-700">
                    Demand: {numberFormatter.format(route.sell_to.demand)}
                  </span>
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

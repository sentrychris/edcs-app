"use client";

import Link from "next/link";
import type { MarketCommodityListing } from "@/core/interfaces/MarketSearch";
import Panel from "@/components/panel";
import Heading from "@/components/heading";
import type { CommodityFilters } from "./commodity-search-panel";

interface Props {
  title: string;
  subtitle: string;
  icon: string;
  priceLabel: string;
  priceField: "buy_price" | "sell_price";
  quantityLabel: string;
  quantityField: "stock" | "demand";
  listings: MarketCommodityListing[];
  commodityDisplayName: string;
  filters: CommodityFilters | null;
}

const numberFormatter = new Intl.NumberFormat("en-GB");

export default function CommodityListingTable({
  title,
  subtitle,
  icon,
  priceLabel,
  priceField,
  quantityLabel,
  quantityField,
  listings,
  commodityDisplayName,
  filters,
}: Props) {
  return (
    <Panel className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b border-sky-900/20 px-4 py-3 md:px-5 md:py-4">
        <Heading icon={icon} title={title} subtitle={subtitle} />
      </div>

      {/* ── Summary stats ── */}
      <div className="grid shrink-0 grid-cols-2 gap-px border-b border-sky-900/20 bg-sky-900/10">
        <div className="bg-black/50 px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-neutral-600">Commodity</p>
          <p className="mt-0.5 truncate font-bold text-neutral-200">{commodityDisplayName}</p>
        </div>
        <div className="bg-black/50 px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-neutral-600">Listings</p>
          <p className="mt-0.5 font-bold text-neutral-200">
            {listings.length}
            {filters && (
              <span className="ml-1 text-xs font-normal text-neutral-500">/ {filters.limit}</span>
            )}
          </p>
        </div>
      </div>

      {/* ── Listings ── */}
      <div className="min-h-0 flex-1 divide-y divide-sky-900/10 overflow-y-auto">
        {listings.length === 0 ? (
          <div className="flex h-full items-center justify-center p-8 text-center">
            <p className="text-xs uppercase tracking-widest text-neutral-600">
              No listings match the selected filters
            </p>
          </div>
        ) : (
          listings.map((listing) => (
            <div
              key={listing.station.id}
              className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-sky-900/5"
            >
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-sky-900/30 text-xs font-bold">
                <i className="icarus-terminal-station text-xs text-sky-900/60"></i>
              </div>

              <div className="min-w-0 flex-1">
                <Link
                  href={`/stations/${listing.station.slug}`}
                  className="block truncate text-xs font-bold uppercase tracking-widest text-neutral-300 transition-colors hover:text-sky-400"
                >
                  {listing.station.name}
                </Link>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-neutral-600">
                  <Link
                    href={`/systems/${listing.system.slug}`}
                    className="text-neutral-500 transition-colors hover:text-sky-400"
                  >
                    {listing.system.name}
                  </Link>
                  <span className="text-neutral-800">■</span>
                  <span>{listing.station.type}</span>
                  <span className="text-neutral-800">■</span>
                  <span title="Distance to arrival">{numberFormatter.format(Math.round(listing.station.distance_to_arrival))} ls</span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-xs uppercase tracking-widest text-neutral-600">{priceLabel}</p>
                <p className="font-bold tabular-nums text-sky-300">
                  {numberFormatter.format(listing[priceField])}
                  <span className="ml-1 text-xs font-normal text-neutral-500">cr</span>
                </p>
                <p className="mt-1 text-xs uppercase tracking-widest text-neutral-700">
                  {quantityLabel}: <span className="text-neutral-400">{numberFormatter.format(listing[quantityField])}</span>
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Panel>
  );
}

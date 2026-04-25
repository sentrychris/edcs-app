export interface MarketCommodityListing {
  station: {
    id: number;
    name: string;
    type: string;
    slug: string;
    distance_to_arrival: number;
  };
  system: {
    id64: number;
    name: string;
    slug: string;
    coords: { x: number; y: number; z: number };
  };
  buy_price: number;
  sell_price: number;
  mean_price: number;
  stock: number;
  demand: number;
  last_updated: string | null;
}

export interface CommoditySearchResult {
  commodity: {
    name: string;
    display_name: string;
  };
  best_buy_from: MarketCommodityListing[];
  best_sell_to: MarketCommodityListing[];
}

export interface MarketTradeRoute {
  commodity: {
    name: string;
    display_name: string;
  };
  profit_per_unit: number;
  buy_from: MarketCommodityListing;
  sell_to: MarketCommodityListing;
}

export interface CommodityFilters {
  commodity: string;
  near_system: string;
  ly: number;
  min_stock: number;
  min_demand: number;
  limit: number;
}

export interface TradeRouteFilters {
  near_system: string;
  ly: number;
  min_stock: number;
  min_demand: number;
  min_profit: number;
  limit: number;
}

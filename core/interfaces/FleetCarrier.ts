import type { System } from "./System";

export interface FleetCarrier {
  id: number;
  market_id: number;
  name: string;
  system?: System;
  distance_to_arrival: number | null;
  allegiance: string | null;
  government: string | null;
  economy: string | null;
  second_economy: string | null;
  has_market: boolean;
  has_shipyard: boolean;
  has_outfitting: boolean;
  other_services: Array<string> | null;
  last_updated: {
    information: string | null;
    market: string | null;
    shipyard: string | null;
    outfitting: string | null;
  };
  slug: string;
}

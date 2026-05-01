/**
 * Estimated Universal Cartographics scan payouts for stellar bodies.
 *
 * Formulas mirror the post-Odyssey UC payout model widely reproduced from
 * Frontier's published constants. Returned values are approximations — the
 * live game adjusts for things like surface mapping efficiency and prior
 * commander tags, which we cannot know here.
 */

const Q = 0.56591828;

/** Star K-values, keyed on `sub_type` as it arrives from EDSM. */
const STAR_K: Record<string, number> = {
  "White Dwarf (D) Star": 14057,
  "White Dwarf (DA) Star": 14057,
  "White Dwarf (DAB) Star": 14057,
  "White Dwarf (DAO) Star": 14057,
  "White Dwarf (DAV) Star": 14057,
  "White Dwarf (DAZ) Star": 14057,
  "White Dwarf (DB) Star": 14057,
  "White Dwarf (DBV) Star": 14057,
  "White Dwarf (DBZ) Star": 14057,
  "White Dwarf (DC) Star": 14057,
  "White Dwarf (DCV) Star": 14057,
  "White Dwarf (DQ) Star": 14057,
  "White Dwarf (DX) Star": 14057,
  "Neutron Star": 22628,
  "Black Hole": 22628,
  "Supermassive Black Hole": 33737,
};
const STAR_DEFAULT_K = 1200;

/**
 * Planet K table — `[base, terraformableBonus]`. Earth-like worlds bake in the
 * terraformable bonus regardless of the API's `terraforming_state`.
 */
const PLANET_K: Record<string, [number, number]> = {
  "Metal-rich body": [21790, 65631],
  "Ammonia world": [96932, 0],
  "Class I gas giant": [1656, 0],
  "Class II gas giant": [9654, 0],
  "Class III gas giant": [200, 0],
  "Class IV gas giant": [200, 0],
  "Class V gas giant": [200, 0],
  "Earth-like world": [64831, 116295],
  "Water world": [64831, 116295],
  "Water giant": [1656, 0],
  "High metal content world": [9654, 100677],
  "Rocky body": [720, 93328],
  "Rocky Ice world": [720, 0],
  "Icy body": [720, 0],
  "Helium-rich gas giant": [1656, 0],
  "Helium gas giant": [1656, 0],
  "Gas giant with water-based life": [1656, 0],
  "Gas giant with ammonia-based life": [1656, 0],
};

export interface ScanPayout {
  base: number;
  bonus: number;
  bonusLabel: string;
}

export function starScanValue(subType: string, solarMasses: number | null | undefined): ScanPayout | null {
  const k = STAR_K[subType] ?? STAR_DEFAULT_K;
  const mass = solarMasses ?? 0;
  const base = Math.round(k + (mass * k) / 66.25);
  const bonus = Math.round(base * 2.6);
  return { base, bonus, bonusLabel: "First Discovered" };
}

export function planetScanValue(
  subType: string,
  earthMasses: number | null | undefined,
  terraformingState: string | null | undefined,
): ScanPayout | null {
  const entry = PLANET_K[subType];
  if (!entry) {
    return null;
  }
  const [k, kt] = entry;
  const isEarthLike = subType === "Earth-like world";
  const terraformable = isEarthLike || terraformingState === "Candidate for terraforming";
  const mass = Math.max(earthMasses ?? 0, 0);
  const base = Math.round((k + (terraformable ? kt : 0)) * (1 + Q * Math.pow(mass, 0.2)));
  const bonus = Math.max(500, Math.round(base * 3.69962));
  return { base, bonus, bonusLabel: "First Map (Max)" };
}

export type DumpType =
  | "systems"
  | "populated-systems"
  | "systems-recent"
  | "bodies"
  | "bodies-recent"
  | "stations"
  | "stations-recent"
  | "carriers"
  | "carriers-recent";

export interface DumpManifestEntry {
  available: boolean;
  size: number | null;
  built_at: string | null;
}

export type DumpManifest = Record<DumpType, DumpManifestEntry>;

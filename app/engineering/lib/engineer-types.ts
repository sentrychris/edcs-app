export type EngineerDiscipline = "ship" | "pilot";
export type EngineerRegion = "core" | "colonia" | "witch-head";

export interface EngineerModification {
  category: string;
  maxGrade?: number;
}

export interface Engineer {
  slug: string;
  href: string;
  name: string;
  base: string;
  system: string;
  planet: string;
  region: EngineerRegion;
  discipline: EngineerDiscipline;
  icon: string;
  modifications: EngineerModification[];
}

import type { Metadata } from "next";
import FieldGuideModulePage from "../components/field-guide-module-page";
import { cartographyTopics } from "./data";

export const metadata: Metadata = {
  title: "Galactic Cartography | Knowledge Base | ED:CS",
  description: "Field guides for reading the Milky Way through coordinates, regions, density, nebulae, permit locks, and map scale.",
};

export default function GalacticCartographyPage() {
  return (
    <FieldGuideModulePage
      topics={cartographyTopics}
      protocolLabel="DATABASE:GALACTIC-CARTOGRAPHY"
      moduleTitle="Galactic Cartography"
      moduleSubtitle="Coordinates, Regions & Exploration Scale"
      moduleIcon="icarus-terminal-route"
      contextLabel="MODULE - GALACTIC CARTOGRAPHY"
      lensTitle="Cartographic Lens"
      lensParagraphs={[
        "This module treats the galaxy as a navigable dataset: coordinates, regions, density, hazards, and scale all change how commanders read the starfield.",
        "It pairs naturally with the ED:CS galaxy map, distance search, and route plotting tools because those features all depend on spatial structure.",
      ]}
    />
  );
}

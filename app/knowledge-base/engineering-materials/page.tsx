import type { Metadata } from "next";
import FieldGuideModulePage from "../components/field-guide-module-page";
import { engineeringTopics } from "./data";

export const metadata: Metadata = {
  title: "Engineering & Materials | Knowledge Base | ED:CS",
  description: "Field guides for engineering materials, traders, blueprint grades, Guardian unlocks, Odyssey engineering, and gathering loops.",
};

export default function EngineeringMaterialsPage() {
  return (
    <FieldGuideModulePage
      topics={engineeringTopics}
      protocolLabel="DATABASE:ENGINEERING-MATERIALS"
      moduleTitle="Engineering & Materials"
      moduleSubtitle="Blueprints, Unlocks & Gathering Loops"
      moduleIcon="icarus-terminal-table-index"
      contextLabel="MODULE - ENGINEERING & MATERIALS"
      lensTitle="Engineering Lens"
      lensParagraphs={[
        "This module treats engineering as logistics: blueprint requirements, material categories, trader exchange rates, unlock chains, and gathering loops all decide how quickly a build comes together.",
        "It is knowledge-base friendly because the hard part is usually not a single upgrade, but planning the inventory and route that gets every requirement into place.",
      ]}
    />
  );
}

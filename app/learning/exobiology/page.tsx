import type { Metadata } from "next";
import FieldGuideModulePage from "../components/field-guide-module-page";
import { exobiologyTopics } from "./data";

export const metadata: Metadata = {
  title: "Exobiology | Learning Resources | ED:CS",
  description: "Field guides for Odyssey biology detection, sampling, planetary constraints, lifeform families, and efficient exobiology routing.",
};

export default function ExobiologyPage() {
  return (
    <FieldGuideModulePage
      topics={exobiologyTopics}
      protocolLabel="DATABASE:EXOBIOLOGY"
      moduleTitle="Exobiology"
      moduleSubtitle="Biological Signals, Sampling & Survey Strategy"
      moduleIcon="icarus-terminal-planet-atmosphere"
      contextLabel="MODULE - EXOBIOLOGY"
      lensTitle="Biology Lens"
      lensParagraphs={[
        "This module treats exobiology as a survey discipline: detect likely habitats, read body conditions, land with intent, finish genetic samples, and protect the data.",
        "It pairs naturally with ED:CS body and route data because exobiology value depends on environmental filters, surface conditions, and efficient travel choices.",
      ]}
    />
  );
}

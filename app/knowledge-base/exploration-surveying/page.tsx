import type { Metadata } from "next";
import FieldGuideModulePage from "../components/field-guide-module-page";
import { explorationTopics } from "./data";

export const metadata: Metadata = {
  title: "Exploration & Surveying | Knowledge Base | ED:CS",
  description: "Field guides for scanning, mapping, route boosting, discovery tags, high-value worlds, and exploration data payouts.",
};

export default function ExplorationSurveyingPage() {
  return (
    <FieldGuideModulePage
      topics={explorationTopics}
      protocolLabel="DATABASE:EXPLORATION-SURVEYING"
      moduleTitle="Exploration & Surveying"
      moduleSubtitle="Scanning, Mapping & Deep-Space Data Value"
      moduleIcon="icarus-terminal-scan"
      contextLabel="MODULE - EXPLORATION & SURVEYING"
      lensTitle="Survey Lens"
      lensParagraphs={[
        "This module treats exploration as an operational workflow: scan the system, identify value, map the right bodies, protect the data, and return it safely.",
        "It connects directly to ED:CS system and body data because the same signals that guide commanders also power filters, route context, and high-value survey summaries.",
      ]}
    />
  );
}
